// Lógica pura (sin red) para mapear una fila de public.cf_leads a GHL.
// Se separa de index.ts para poder probarla con `deno test`.

// IDs de la subcuenta GHL «CUBA FELIZ» (location 3icsVf8NEAhkEMSakJpd).
// No son secretos: solo identifican campos y etapas dentro de la subcuenta.
export const GHL_IDS = {
  fields: {
    pais: "Od1QMxDWfQKcJX1pWm6k", // contact.pas (TEXT)
    origen: "AhSsBcvTSDskdDPUBPWh", // contact.origen (TEXT)
    intereses: "GP5GySEdPYxbPDBEjGF4", // contact.intereses (MULTIPLE_OPTIONS)
  },
  pipeline: {
    id: "WI8s6TWOmKFXOQX4IQhM", // «Cuba Feliz – Comunidad»
    stageNuevoInscrito: "7fd098ef-7d72-46b1-aa3e-4211d72058fe",
  },
} as const;

// Opciones válidas del campo «Intereses» y de las etiquetas cf-int-*.
export const KNOWN_INTERESTS = [
  "meditacion",
  "aprender",
  "eligiendo",
  "voluntariado",
  "newsletter",
  "aportar",
] as const;

export type Lead = {
  id?: string | number;
  full_name?: string | null;
  country?: string | null;
  email?: string | null;
  phone?: string | null;
  interest?: string | null;
  interests?: string[] | null;
  consent?: boolean | null;
  source?: string | null;
};

const clean = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

/** Normaliza para comparar: minúsculas y sin tildes. */
const fold = (v: string) =>
  v.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export function isCuba(country: unknown): boolean {
  return fold(clean(country)) === "cuba";
}

/** Intereses válidos, sin duplicados, en el orden del formulario. */
export function validInterests(lead: Lead): { valid: string[]; unknown: string[] } {
  const raw = Array.isArray(lead.interests) ? lead.interests.map((x) => fold(String(x))) : [];
  const set = new Set(raw);
  const valid = KNOWN_INTERESTS.filter((k) => set.has(k));
  const unknown = [...set].filter((x) => x && !(KNOWN_INTERESTS as readonly string[]).includes(x));
  return { valid, unknown };
}

export function buildTags(lead: Lead): string[] {
  const tags = ["cf-inscrito", isCuba(lead.country) ? "cf-cuba" : "cf-exterior"];
  for (const i of validInterests(lead).valid) tags.push(`cf-int-${i}`);
  if (lead.consent === true) tags.push("cf-consentimiento");
  return tags;
}

export function splitName(full: unknown): { firstName: string; lastName: string } {
  const parts = clean(full).split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: "", lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

/** Cuerpo para POST /contacts/upsert (sin etiquetas: se agregan aparte para no reemplazar las existentes). */
export function buildUpsertBody(lead: Lead, locationId: string): Record<string, unknown> {
  const { firstName, lastName } = splitName(lead.full_name);
  const email = clean(lead.email).toLowerCase();
  const phone = clean(lead.phone);
  const country = clean(lead.country);
  const source = clean(lead.source) || "cuba-feliz";
  const interests = validInterests(lead).valid;

  const customFields: { id: string; field_value: unknown }[] = [];
  if (country) customFields.push({ id: GHL_IDS.fields.pais, field_value: country });
  customFields.push({ id: GHL_IDS.fields.origen, field_value: source });
  if (interests.length) customFields.push({ id: GHL_IDS.fields.intereses, field_value: interests });

  const body: Record<string, unknown> = { locationId, source, customFields };
  if (firstName) body.firstName = firstName;
  if (lastName) body.lastName = lastName;
  if (firstName) body.name = [firstName, lastName].filter(Boolean).join(" ");
  if (email) body.email = email;
  if (phone) body.phone = phone;
  return body;
}

export function opportunityName(lead: Lead): string {
  const n = clean(lead.full_name) || clean(lead.email) || clean(lead.phone) || "Inscrito";
  return `${n} – Cuba Feliz`;
}

/** Comparación en tiempo constante para el secreto compartido del webhook. */
export function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const x = enc.encode(a);
  const y = enc.encode(b);
  let diff = x.length ^ y.length;
  const len = Math.max(x.length, y.length);
  for (let i = 0; i < len; i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}
