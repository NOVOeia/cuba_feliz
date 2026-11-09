# Cuba Feliz — Integración Zelle + SMS GHL

## Estado preparado (2026-11-09)

- Importes: **US$11, US$22, US$33 y Otro** (USD), guardados en `cf_sections.settings.donation_amounts` en Supabase.
- En `cf_sections`, sección `gotas`, se dispone de `settings.payment_methods.zelle` con `enabled=false`, `sms_enabled=false`, `recipient_name`, `recipient_email`, `recipient_phone` y `qr_url`.
- `settings.payment_methods.stripe.enabled=false`.
- El archivo público `cf-gotas-zelle-20261109.js` dibuja la selección de método y el formulario de instrucciones, pero **no puede enviar SMS sin el adaptador GHL**, ni cobra ni confirma un pago.
- El frontend solo habilita Zelle cuando hay un beneficiario y correo/teléfono de Zelle, ambas flags son true y existe un adaptador seguro `window.CF_ZELLE_SEND_INSTRUCTIONS`.

## Contrato con GHL (implementación a cargo del equipo GHL)

Inyectar en la página la función:

```js
window.CF_ZELLE_SEND_INSTRUCTIONS = async (payload) => {
  // Solicitar un endpoint backend propio autorizado (nunca webhooks secretos desde el navegador).
  // Devolver { ok: true } SOLO si el servidor aceptó realmente la petición.
};
```

Ejemplo de objeto recibido (valores de prueba):

```json
{
  "source": "cuba-feliz-web",
  "purpose": "zelle_donation_instructions",
  "method": "zelle",
  "amount_usd": 22,
  "currency": "USD",
  "full_name": "Ejemplo Usuario",
  "phone_e164": "+17540000000",
  "email": "",
  "sms_consent": true,
  "sms_consent_at": "2026-11-09T17:00:00.000Z",
  "sms_consent_text": "Autorizo a Cuba Feliz a enviarme por SMS las instrucciones que solicito para este aporte. No acepto por ello mensajes promocionales.",
  "donation_status": "instructions_requested"
}
```

Mapeo sugerido en GHL: Nombre completo → contacto; teléfono → contacto; correo → contacto (si se proporciona); `amount_usd` → campo personalizado `Gota - Monto USD`; `purpose` → etiqueta `cf-gota-zelle`; consentimiento → evidencia de opt-in de un solo mensaje. Al finalizar el flujo, GHL envía un SMS de agradecimiento y las instrucciones de Zelle en función de los datos **reales** de la organización. Si el SMS contiene QR, usar un enlace seguro al QR oficial hospedado en el dominio de Cuba Feliz; no insertar imágenes como texto bruto.

La respuesta del endpoint indica recepción de una solicitud, **no** confirmación de transferencia. No registrar el estado `paid` hasta verificar los fondos en el banco.

## Encendido

1. Completar los datos oficiales de beneficiario y el QR de la organización; confirmar que la cuenta permite Zelle.
2. Implementar el endpoint/backend GHL seguro, con autenticación, limitación de frecuencia y protección antiabuso; nunca publicar tokens ni URL privadas.
3. Probar con número autorizado y consentimiento, verificar que GHL reciba la cantidad exacta (incluida cantidad personalizada) y que el SMS realmente llegue.
4. Solo entonces cambiar `zelle.enabled` y `zelle.sms_enabled` a `true`.
5. Stripe: crear sesión de Checkout en backend y proporcionar `window.CF_STRIPE_CHECKOUT(payload)`; habilitar la flag solo tras verificar el flujo completo.

## Nota sobre verificación telefónica

El formulario valida el formato E.164 del celular (acepta números de EE. UU. de 10 dígitos). **No realiza OTP/SMS de verificación** todavía; si se requiere verificar que el teléfono sea de la persona, implementar OTP en el backend/GHL antes del envío de instrucciones. La autorización es únicamente para el SMS solicitado, sin consentimiento promocional implícito.
