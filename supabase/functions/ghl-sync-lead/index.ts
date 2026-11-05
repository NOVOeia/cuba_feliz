// Supabase Edge Function: ghl-sync-lead
//
// Recibe el payload del trigger de INSERT en public.cf_leads (ver la migración
// supabase/migrations/*_cf_leads_ghl_sync.sql) y sincroniza el inscrito con la
// subcuenta GHL «CUBA FELIZ»:
//   1. POST /contacts/upsert           (nombre, correo, teléfono, campos País/Origen/Intereses)
//   2. POST /contacts/{id}/tags        (agrega etiquetas sin borrar las existentes)
//   3. Oportunidad en «Cuba Feliz – Comunidad» → «Nuevo inscrito» (si el contacto no tiene una ya)
//
// La fila de cf_leads NUNCA se pierde: el trigger es asíncrono (pg_net) y esta
// función solo escribe el resultado en cf_leads.ghl_* y en public.cf_ghl_sync_log.
//
// Secrets requeridos (supabase secrets set ...):
//   GHL_PIT              Private Integration Token de la subcuenta (nunca en el repo)
//   GHL_LOCATION_ID      3icsVf8NEAhkEMSakJpd
//   CF_WEBHOOK_SECRET    secreto compartido con el trigger (cabecera x-webhook-secret)
// Disponibles automáticamente: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
//
// También acepta {"type":"RESYNC","lead_id":"..."} (con el mismo secreto) para
// reintentar manualmente una fila que falló.

import { createClient } from "jsr:@supabase/supabase-js@2";
import {
  buildTags,
  buildUpsertBody,
  GHL_IDS,
  type Lead,
  opportunityName,
  safeEqual,
  validInterests,
} from "./lib.ts";

const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

const env = (k: string) => Deno.env.get(k) ?? "";

const supabase = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { persistSession: false },
});

class GhlError extends Error {
  constructor(public step: string, public status: number, public body: unknown) {
    super(`GHL ${step} respondió ${status}`);
  }
}

async function ghl(step: string, method: string, path: string, body?: unknown): Promise<any> {
  const init: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${env("GHL_PIT")}`,
      Version: GHL_VERSION,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  };
  // Un reintento ante límite de tasa o error temporal del servidor.
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(GHL_BASE + path, init);
    const text = await res.text();
    let data: unknown = text;
    try {
      data = text ? JSON.parse(text) : null;
    } catch { /* respuesta no JSON */ }
    if (res.ok) return data;
    if (attempt === 0 && (res.status === 429 || res.status >= 500)) {
      await new Promise((r) => setTimeout(r, 1500));
      continue;
    }
    throw new GhlError(step, res.status, data);
  }
}

/** Si GHL rechazó la oportunidad por duplicada (OPPORTUNITY_NO_DUPLICATE), devuelve el ID existente. */
function duplicateOpportunityId(err: unknown): string | undefined {
  if (!(err instanceof GhlError) || err.status !== 400) return undefined;
  const b = err.body as any;
  const code = b?.code ?? b?.error?.code ?? b?.errorCode;
  if (code !== "OPPORTUNITY_NO_DUPLICATE") return undefined;
  const id = b?.meta?.existingId ?? b?.error?.meta?.existingId;
  return typeof id === "string" && id ? id : undefined;
}

async function log(leadId: unknown, status: "ok" | "error", step: string, httpStatus: number | null, detail: unknown) {
  const { error } = await supabase.from("cf_ghl_sync_log").insert({
    lead_id: leadId == null ? null : String(leadId),
    status,
    step,
    http_status: httpStatus,
    detail,
  });
  if (error) console.error("No se pudo escribir cf_ghl_sync_log", error);
}

async function markLead(leadId: unknown, patch: Record<string, unknown>) {
  if (leadId == null) return;
  const { error } = await supabase.from("cf_leads").update(patch).eq("id", leadId);
  if (error) console.error("No se pudo actualizar cf_leads.ghl_*", error);
}

async function syncLead(lead: Lead) {
  const locationId = env("GHL_LOCATION_ID");
  const { unknown } = validInterests(lead);
  if (unknown.length) console.warn("Intereses desconocidos ignorados", unknown);

  // 1. Contacto
  const upsert = await ghl("contacts.upsert", "POST", "/contacts/upsert", buildUpsertBody(lead, locationId));
  const contactId: string | undefined = upsert?.contact?.id;
  if (!contactId) throw new GhlError("contacts.upsert", 200, { message: "Respuesta sin contact.id", upsert });

  // 2. Etiquetas (agregar, no reemplazar)
  const tags = buildTags(lead);
  await ghl("contacts.tags", "POST", `/contacts/${contactId}/tags`, { tags });

  // 3. Oportunidad (solo si el contacto aún no tiene una en el pipeline)
  const q = new URLSearchParams({
    location_id: locationId,
    pipeline_id: GHL_IDS.pipeline.id,
    contact_id: contactId,
  });
  const found = await ghl("opportunities.search", "GET", `/opportunities/search?${q}`);
  let opportunityId: string | undefined = found?.opportunities?.[0]?.id;
  let opportunityCreated = false;
  if (!opportunityId) {
    try {
      const opp = await ghl("opportunities.create", "POST", "/opportunities/", {
        locationId,
        pipelineId: GHL_IDS.pipeline.id,
        pipelineStageId: GHL_IDS.pipeline.stageNuevoInscrito,
        contactId,
        name: opportunityName(lead),
        status: "open",
        source: lead.source || "cuba-feliz",
      });
      opportunityId = opp?.opportunity?.id ?? opp?.id;
      opportunityCreated = true;
    } catch (err) {
      // Dos inscripciones casi simultáneas que GHL une en el mismo contacto
      // (mismo correo o teléfono): la búsqueda previa no ve la oportunidad
      // recién creada y GHL rechaza el duplicado. Es un éxito: usamos la existente.
      const existingId = duplicateOpportunityId(err);
      if (!existingId) throw err;
      opportunityId = existingId;
    }
  }

  return { contactId, contactIsNew: upsert?.new === true, tags, opportunityId, opportunityCreated };
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json(405, { error: "Método no permitido" });

  const expected = env("CF_WEBHOOK_SECRET");
  const given = req.headers.get("x-webhook-secret") ?? "";
  if (!expected || !safeEqual(given, expected)) return json(401, { error: "No autorizado" });

  if (!env("GHL_PIT") || !env("GHL_LOCATION_ID")) {
    console.error("Faltan los secrets GHL_PIT o GHL_LOCATION_ID");
    return json(500, { error: "Configuración incompleta" });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: "JSON inválido" });
  }

  let lead: Lead | null = null;
  if (payload?.type === "INSERT" && payload?.table === "cf_leads" && payload?.record) {
    lead = payload.record as Lead;
  } else if (payload?.type === "RESYNC" && payload?.lead_id != null) {
    const { data, error } = await supabase.from("cf_leads").select("*").eq("id", payload.lead_id).maybeSingle();
    if (error || !data) return json(404, { error: "Fila no encontrada", detail: error?.message });
    lead = data as Lead;
  } else {
    return json(200, { skipped: true, reason: "Evento no aplicable" });
  }

  if (!lead.email && !lead.phone) {
    await log(lead.id, "error", "validate", null, { message: "Sin correo ni teléfono" });
    await markLead(lead.id, { ghl_sync_error: "Sin correo ni teléfono" });
    return json(200, { skipped: true, reason: "Sin correo ni teléfono" });
  }

  try {
    const result = await syncLead(lead);
    await markLead(lead.id, {
      ghl_contact_id: result.contactId,
      ghl_opportunity_id: result.opportunityId ?? null,
      ghl_synced_at: new Date().toISOString(),
      ghl_sync_error: null,
    });
    await log(lead.id, "ok", "done", 200, result);
    return json(200, { ok: true, ...result });
  } catch (err) {
    const step = err instanceof GhlError ? err.step : "exception";
    const status = err instanceof GhlError ? err.status : null;
    const detail = err instanceof GhlError ? err.body : { message: String(err) };
    console.error("Fallo al sincronizar con GHL", { leadId: lead.id, step, status, detail });
    await log(lead.id, "error", step, status, detail);
    await markLead(lead.id, { ghl_sync_error: `${step} (${status ?? "sin HTTP"})` });
    return json(502, { ok: false, step, status });
  }
});
