/* Cuba Feliz · Gotas de la Felicidad
   El sitio solo prepara una solicitud. No cobra ni envia SMS sin integraciones privadas.
   Adaptador seguro: window.CF_ZELLE_SEND_INSTRUCTIONS(payload) -> Promise<{ok:boolean}>
   Stripe: window.CF_STRIPE_CHECKOUT(payload) -> Promise<...>
   No colocar tokens ni webhooks privados de GHL en archivos publicos.
*/
(function () {
'use strict';
const root=document.getElementById('root');
if(!root)return;
const escapeHTML=value=>String(value==null?'':value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const style=document.createElement('style');
style.id='cf-gotas-sms-ui';
style.textContent=[
'#root .cf-gotas-stage{border-top:1px solid #e8dfea;margin-top:24px;padding-top:22px}',
'#root .cf-gotas-stage[hidden],#root .cf-gotas-sms[hidden],#root .cf-gotas-stripe[hidden]{display:none!important}',
'#root .cf-gotas-stage h4{color:#381b53;font:700 21px Outfit,sans-serif;line-height:1.25;margin:0 0 8px}',
'#root .cf-gotas-stage h5{color:#381b53;font:700 16px Outfit,sans-serif;margin:18px 0 8px}',
'#root .cf-gotas-stage p{line-height:1.6;font-size:13px;color:#675576}',
'#root .cf-gotas-summary{color:#452360;font-weight:800;margin:8px 0 16px}',
'#root .cf-gotas-methods{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;margin:15px 0}',
'#root .cf-gotas-method{background:#fff;border:1.5px solid #d8c9e1;border-radius:14px;color:#361951;cursor:pointer;min-width:0;padding:15px;text-align:left}',
'#root .cf-gotas-method strong{display:block;font-size:15px;margin-bottom:5px}',
'#root .cf-gotas-method small{display:block;font-size:11px;line-height:1.4;color:#766384}',
'#root .cf-gotas-method:disabled{opacity:.66;background:#f8f6f9;cursor:not-allowed}',
'#root .cf-gotas-method.is-selected{background:#fff6da;border-color:#c9a336}',
'#root .cf-gotas-sms form{display:grid;gap:13px;margin-top:15px}',
'#root .cf-gotas-sms form>label{display:grid;gap:6px;font-size:12px;font-weight:700;color:#48345a}',
'#root .cf-gotas-sms input:not([type=checkbox]){width:100%;box-sizing:border-box;min-width:0;min-height:45px;border:1px solid #d6c6df;border-radius:10px;background:#fff;color:#2c1b34;padding:12px;font-size:15px}',
'#root .cf-gotas-sms .cf-gotas-sms-consent{display:flex;align-items:flex-start;gap:10px;line-height:1.6;font-size:12px}',
'#root .cf-gotas-sms-consent input{width:18px;height:18px;flex:none;margin:3px 0 0}',
'#root .cf-gotas-submit{width:100%;background:#f5ca48;border:0;border-radius:12px;color:#31164b;cursor:pointer;font-size:14px;font-weight:800;padding:16px}',
'#root .cf-gotas-submit:disabled{opacity:.65;cursor:not-allowed}',
'#root .cf-gotas-status{font-size:12px;line-height:1.6;min-height:19px;color:#60376d}',
'#root .cf-zelle-official{background:#f9f5fb;border:1px solid #e7daee;border-radius:14px;padding:16px;margin-top:18px}',
'#root .cf-zelle-official .cf-zelle-line{display:flex;align-items:center;justify-content:space-between;gap:10px;overflow-wrap:anywhere}',
'#root .cf-zelle-official .cf-zelle-copy{background:#fff;border:1px solid #d5c6dc;border-radius:8px;color:#49235f;padding:6px 9px;font-weight:700;cursor:pointer}',
'#root .cf-zelle-official img{display:block;max-width:min(100%,210px);aspect-ratio:1;object-fit:contain;border-radius:12px;margin:14px auto}',
'#root .cf-zelle-official .cf-zelle-disclaimer{font-size:11px}',
'@media(max-width:540px){#root .cf-gotas-methods{grid-template-columns:1fr}#root .donate-widget{padding:22px}#root .cf-zelle-official .cf-zelle-line{flex-direction:column;align-items:flex-start}}'
].join('\n');
document.head.appendChild(style);
function makeOfficialBox(z, target){
 const fullName=String(z.recipient_name||'').trim(),email=String(z.recipient_email||'').trim(),phone=String(z.recipient_phone||'').trim();
 if(!fullName||(!email&&!phone))return;
 const box=document.createElement('div');box.className='cf-zelle-official';
 const h5=document.createElement('h5');h5.textContent='Datos para tu transferencia Zelle';box.append(h5);
 function row(title,value,copy){
  if(!value)return;
  const paragraph=document.createElement('p');paragraph.className='cf-zelle-line';
  const span=document.createElement('span');const label=document.createElement('strong');label.textContent=title+': ';
  span.append(label,document.createTextNode(value));paragraph.append(span);
  if(copy){const button=document.createElement('button');button.className='cf-zelle-copy';button.type='button';button.textContent='Copiar';
    button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(value);button.textContent='Copiado';}catch{button.textContent='Copia el dato manualmente';}});
    paragraph.append(button);}
  box.append(paragraph);
 }
 row('Beneficiario',fullName,false);row('Correo Zelle',email,true);row('Teléfono Zelle',phone,true);
 const qr=String(z.qr_url||'').trim();
 if(/^https:\/\/(?:media\.cubafeliz\.com|cubafeliz\.com)\//.test(qr)){
  const img=document.createElement('img');img.alt='Código QR oficial de Zelle';img.loading='lazy';img.src=qr;box.append(img);
 }
 const reminder=document.createElement('p');reminder.className='cf-zelle-disclaimer';
 reminder.textContent='Antes de enviar el dinero, confirma en tu banco que el destinatario es el correcto. Solicitar un SMS no significa que la donación esté pagada.';
 box.append(reminder);target.append(box);
}
function parsePhone(raw){
 let digits=String(raw||'').replace(/[\s().-]/g,'');
 if(/^\d{10}$/.test(digits))digits='+1'+digits;
 return /^\+[1-9]\d{7,14}$/.test(digits)?digits:null;
}
function money(widget){
 const selected=widget.querySelector('[data-amount].selected');
 const raw=selected?.dataset.amount;
 const custom=widget.querySelector('#customDonation');
 const n=raw==='other'?Number(custom?.value):Number(raw);
 return Number.isFinite(n)&&n>=1&&n<=100000&&Math.abs(n*100-Math.round(n*100))<.00001?n:null;
}
function decorate(widget){
 if(widget.dataset.cfGotasSmsReady==='1')return;
 widget.dataset.cfGotasSmsReady='1';
 // Se retrasa un cuadro para que los listeners originales terminen de enlazarse.
 requestAnimationFrame(async()=>{
  if(!widget.isConnected)return;
  const old=widget.querySelector('#donateButton');
  if(!old)return;
  const action=old.cloneNode(true);old.replaceWith(action);
  const firstLabel=action.querySelector('span');
  if(firstLabel)firstLabel.textContent='Elegir forma de aportar';
  const notice=widget.querySelector('#donationNotice');
  if(notice)notice.textContent='Estamos preparando Zelle y el pago con tarjeta. Ningún cobro está habilitado todavía.';
  const stage=document.createElement('section');
  stage.className='cf-gotas-stage';stage.hidden=true;
  stage.innerHTML='<h4>¿Cómo quieres aportar?</h4>'
   +'<div class="cf-gotas-summary" aria-live="polite"></div>'
   +'<div class="cf-gotas-methods" role="group" aria-label="Opciones para aportar">'
   +'<button class="cf-gotas-method" data-gotas-method="zelle" type="button" disabled><strong>Zelle</strong><small>Próximamente</small></button>'
   +'<button class="cf-gotas-method" data-gotas-method="stripe" type="button" disabled><strong>Tarjeta (Stripe)</strong><small>Próximamente</small></button></div>'
   +'<section class="cf-gotas-sms" hidden><h5>Recibe las instrucciones para Zelle por SMS</h5>'
   +'<p>Necesitas una cuenta bancaria estadounidense que permita transferencias mediante Zelle. Guardaremos el monto que seleccionaste para incluirlo en tus instrucciones.</p>'
   +'<form class="cf-gotas-sms-form"><label>Nombre completo<input type="text" name="full_name" autocomplete="name" placeholder="Nombre y apellido" maxlength="100" required></label>'
   +'<label>Tu celular para recibir el SMS<input type="tel" name="phone" autocomplete="tel" inputmode="tel" maxlength="25" placeholder="+1 754 000 0000" required></label>'
   +'<label>Correo electrónico (opcional)<input name="email" type="email" autocomplete="email" maxlength="150" placeholder="correo@ejemplo.com"></label>'
   +'<label class="cf-gotas-sms-consent"><input type="checkbox" name="sms_consent" required><span>Autorizo a Cuba Feliz a enviarme por SMS las instrucciones que solicito para este aporte. No acepto por ello mensajes promocionales.</span></label>'
   +'<button class="cf-gotas-submit" type="submit">Enviarme las instrucciones por SMS</button>'
   +'<p class="cf-gotas-status" role="status" aria-live="polite"></p></form></section>'
   +'<section class="cf-gotas-stripe" hidden><h5>Pago seguro con tarjeta</h5>'
   +'<p>Tu monto seleccionado se enviará a Stripe Checkout al conectar la pasarela segura.</p>'
   +'<button class="cf-gotas-submit" type="button" data-gotas-stripe-submit>Continuar a Stripe</button>'
   +'<p class="cf-gotas-status" role="status" aria-live="polite"></p></section>';
  widget.insertBefore(stage,notice||null);
  const buttons=[...stage.querySelectorAll('[data-gotas-method]')];
  const zelleButton=stage.querySelector('[data-gotas-method=zelle]'),stripeButton=stage.querySelector('[data-gotas-method=stripe]');
  const zellePane=stage.querySelector('.cf-gotas-sms'),stripePane=stage.querySelector('.cf-gotas-stripe');
  let zelleConfig={},zelleEnabled=false,stripeEnabled=false;
  try{
   const sections=await window.CFAPI.query('cf_sections','section_key=eq.gotas&status=eq.published&select=settings&limit=1');
   if(!widget.isConnected)return;
   const payments=sections?.[0]?.settings?.payment_methods||{};
   zelleConfig=payments.zelle||{};
   const ready=Boolean(String(zelleConfig.recipient_name||'').trim()&&String(zelleConfig.recipient_email||zelleConfig.recipient_phone||'').trim());
   zelleEnabled=zelleConfig.enabled===true&&zelleConfig.sms_enabled===true&&ready&&typeof window.CF_ZELLE_SEND_INSTRUCTIONS==='function';
   stripeEnabled=payments.stripe?.enabled===true&&typeof window.CF_STRIPE_CHECKOUT==='function';
  }catch(err){console.warn('Cuba Feliz: configuración de pagos no disponible');}
  zelleButton.disabled=!zelleEnabled;zelleButton.querySelector('small').textContent=zelleEnabled?'Transferencia bancaria mediante Zelle':'Próximamente · en preparación';
  stripeButton.disabled=!stripeEnabled;stripeButton.querySelector('small').textContent=stripeEnabled?'Pago seguro con tarjeta':'Próximamente · en preparación';
  if(zelleEnabled)makeOfficialBox(zelleConfig,zellePane);
  function clear(){
   stage.hidden=true;zellePane.hidden=true;stripePane.hidden=true;
   for(const b of buttons){b.classList.remove('is-selected');b.setAttribute('aria-pressed','false');}
  }
  for(const choice of widget.querySelectorAll('[data-amount]'))choice.addEventListener('click',clear);
  widget.querySelector('#customDonation')?.addEventListener('input',clear);
  action.addEventListener('click',()=>{
   const n=money(widget);
   if(n===null){if(notice)notice.textContent='Selecciona un aporte válido de mínimo $1 USD, con hasta dos decimales.';return;}
   stage.hidden=false;
   stage.querySelector('.cf-gotas-summary').textContent='Tu Gota: $'+n.toFixed(2)+' USD';
   if(notice)notice.textContent=(zelleEnabled||stripeEnabled)?'Elige la forma en que deseas aportar.':'Zelle y Stripe aún están desactivados. No se envían SMS ni se realizan cobros.';
  });
  for(const button of buttons)button.addEventListener('click',()=>{
   if(button.disabled)return;
   for(const b of buttons){b.classList.toggle('is-selected',b===button);b.setAttribute('aria-pressed',String(b===button));}
   zellePane.hidden=button!==zelleButton;stripePane.hidden=button!==stripeButton;
  });
  const form=stage.querySelector('form');
  form.addEventListener('submit',async event=>{
   event.preventDefault();
   const result=form.querySelector('.cf-gotas-status'),fd=new FormData(form);
   const amount=money(widget),phone=parsePhone(fd.get('phone')),name=String(fd.get('full_name')||'').trim();
   const email=String(fd.get('email')||'').trim();
   if(!zelleEnabled||typeof window.CF_ZELLE_SEND_INSTRUCTIONS!=='function'){result.textContent='La opción Zelle aún no está conectada. No se envió ningún SMS.';return;}
   if(amount===null){result.textContent='Revisa el monto de tu Gota.';return;}
   if(name.length<2){result.textContent='Escribe tu nombre completo.';return;}
   if(!phone){result.textContent='Introduce un celular válido con código de país, como +1 754 000 0000.';return;}
   if(fd.get('sms_consent')!=='on'){result.textContent='Para recibir las instrucciones debes autorizar este SMS.';return;}
   const payload={source:'cuba-feliz-web',purpose:'zelle_donation_instructions',method:'zelle',
    amount_usd:amount,currency:'USD',full_name:name,phone_e164:phone,email:email,
    sms_consent:true,sms_consent_at:new Date().toISOString(),
    sms_consent_text:'Autorizo a Cuba Feliz a enviarme por SMS las instrucciones que solicito para este aporte. No acepto por ello mensajes promocionales.',
    donation_status:'instructions_requested'};
   const submit=form.querySelector('button[type=submit]');
   submit.disabled=true;result.textContent='Enviando solicitud...';
   try{
    const resp=await window.CF_ZELLE_SEND_INSTRUCTIONS(payload);
    result.textContent=resp?.ok===true?'Recibimos tu solicitud. Revisa tu teléfono para recibir las instrucciones.':'No pudimos confirmar el envío del SMS. Inténtalo de nuevo.';
   }catch{result.textContent='No pudimos confirmar el envío del SMS. Inténtalo de nuevo.'}
   finally{submit.disabled=false;}
  });
  stage.querySelector('[data-gotas-stripe-submit]').addEventListener('click',async()=>{
   const result=stripePane.querySelector('.cf-gotas-status'),amount=money(widget);
   if(!stripeEnabled||typeof window.CF_STRIPE_CHECKOUT!=='function'){result.textContent='El pago con tarjeta todavía no está disponible.';return;}
   if(amount===null){result.textContent='Selecciona un monto válido.';return;}
   try{await window.CF_STRIPE_CHECKOUT({source:'cuba-feliz-web',purpose:'gota_de_felicidad',amount_usd:amount,currency:'USD'});}
   catch{result.textContent='No pudimos iniciar el pago con tarjeta.';}
  });
 });
}
let pending=false;
const observer=new MutationObserver(()=>{
 if(pending)return;
 pending=true;
 queueMicrotask(()=>{pending=false;const widget=root.querySelector('.donate-widget');if(widget)decorate(widget);});
});
observer.observe(root,{childList:true,subtree:false});
const initial=root.querySelector('.donate-widget');if(initial)decorate(initial);
})();