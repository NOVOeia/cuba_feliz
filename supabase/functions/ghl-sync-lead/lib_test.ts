// deno test supabase/functions/ghl-sync-lead/lib_test.ts
import { assertEquals } from "jsr:@std/assert@1";
import { buildTags, buildUpsertBody, countryCode, GHL_IDS, safeEqual, splitName } from "./lib.ts";

Deno.test("etiquetas: Cuba, intereses y consentimiento", () => {
  assertEquals(
    buildTags({ country: "Cuba", interests: ["meditacion", "aportar"], consent: true }),
    ["cf-inscrito", "cf-cuba", "cf-int-meditacion", "cf-int-aportar", "cf-consentimiento"],
  );
});

Deno.test("etiquetas: exterior sin consentimiento ignora intereses desconocidos", () => {
  assertEquals(
    buildTags({ country: "España", interests: ["newsletter", "otra-cosa"], consent: false }),
    ["cf-inscrito", "cf-exterior", "cf-int-newsletter"],
  );
});

Deno.test("upsert: campos personalizados por ID", () => {
  const b = buildUpsertBody(
    { full_name: " Ana  María Pérez ", country: "Cuba", email: "ANA@x.com ", phone: "+53 5555", interests: ["aprender"], source: "cuba-feliz-v6" },
    "LOC",
  );
  assertEquals(b.firstName, "Ana");
  assertEquals(b.lastName, "María Pérez");
  assertEquals(b.email, "ana@x.com");
  assertEquals(b.locationId, "LOC");
  assertEquals(b.customFields, [
    { id: GHL_IDS.fields.pais, field_value: "Cuba" },
    { id: GHL_IDS.fields.origen, field_value: "cuba-feliz-v6" },
    { id: GHL_IDS.fields.intereses, field_value: ["aprender"] },
  ]);
});

Deno.test("país: nombre en español → ISO-2 en el upsert", () => {
  assertEquals(countryCode("Colombia"), "CO");
  assertEquals(countryCode("cuba"), "CU");
  assertEquals(countryCode("Estados Unidos"), "US");
  assertEquals(countryCode("España"), "ES");
  assertEquals(countryCode("Atlántida"), "");
  assertEquals(buildUpsertBody({ email: "a@x.com", country: "Colombia" }, "LOC").country, "CO");
  assertEquals("country" in buildUpsertBody({ email: "a@x.com", country: "Atlántida" }, "LOC"), false);
});

Deno.test("splitName y safeEqual", () => {
  assertEquals(splitName(""), { firstName: "", lastName: "" });
  assertEquals(safeEqual("abc", "abc"), true);
  assertEquals(safeEqual("abc", "abd"), false);
  assertEquals(safeEqual("abc", "abcd"), false);
});
