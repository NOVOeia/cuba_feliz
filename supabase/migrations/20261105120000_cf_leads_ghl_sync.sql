-- Cuba Feliz → GHL: envía cada INSERT de public.cf_leads a la Edge Function ghl-sync-lead.
--
-- Equivale a un «Database Webhook» del panel de Supabase, pero el secreto
-- compartido se lee de Supabase Vault en vez de quedar escrito en el trigger
-- (y, por tanto, en este repositorio).
--
-- ANTES de aplicar, crea el secreto en Vault (SQL Editor, una sola vez):
--   select vault.create_secret('<mismo valor que CF_WEBHOOK_SECRET>', 'cf_ghl_webhook_secret');
--
-- La llamada es asíncrona (pg_net): el INSERT del formulario nunca espera a GHL
-- ni falla si GHL o la función fallan. Los resultados quedan en
-- public.cf_leads.ghl_* y en public.cf_ghl_sync_log.

create extension if not exists pg_net with schema extensions;

-- 1. Columnas de estado de la sincronización
alter table public.cf_leads
  add column if not exists ghl_contact_id     text,
  add column if not exists ghl_opportunity_id text,
  add column if not exists ghl_synced_at      timestamptz,
  add column if not exists ghl_sync_error     text;

-- 2. Bitácora (solo service_role; RLS activo sin políticas = sin acceso público)
create table if not exists public.cf_ghl_sync_log (
  id          bigint generated always as identity primary key,
  lead_id     text,
  status      text not null check (status in ('ok', 'error')),
  step        text not null,
  http_status integer,
  detail      jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists cf_ghl_sync_log_lead_idx on public.cf_ghl_sync_log (lead_id, created_at desc);
alter table public.cf_ghl_sync_log enable row level security;
revoke all on public.cf_ghl_sync_log from anon, authenticated;

-- 3. Función del trigger
create or replace function public.cf_leads_notify_ghl()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_secret text;
begin
  select decrypted_secret into v_secret
  from vault.decrypted_secrets
  where name = 'cf_ghl_webhook_secret'
  limit 1;

  if v_secret is null then
    raise warning 'cf_leads_notify_ghl: falta el secreto cf_ghl_webhook_secret en Vault; no se envía a GHL';
    return new;
  end if;

  perform net.http_post(
    url     := 'https://fjhululvenojnvhickln.supabase.co/functions/v1/ghl-sync-lead',
    body    := jsonb_build_object(
                 'type', 'INSERT',
                 'table', tg_table_name,
                 'schema', tg_table_schema,
                 'record', to_jsonb(new),
                 'old_record', null),
    headers := jsonb_build_object(
                 'Content-Type', 'application/json',
                 'x-webhook-secret', v_secret),
    timeout_milliseconds := 10000
  );
  return new;
exception when others then
  -- Nunca bloquear el registro del formulario por un fallo de la integración.
  raise warning 'cf_leads_notify_ghl: % (%)', sqlerrm, sqlstate;
  return new;
end;
$$;

revoke all on function public.cf_leads_notify_ghl() from public, anon, authenticated;

-- 4. Trigger
drop trigger if exists cf_leads_ghl_sync on public.cf_leads;
create trigger cf_leads_ghl_sync
  after insert on public.cf_leads
  for each row execute function public.cf_leads_notify_ghl();
