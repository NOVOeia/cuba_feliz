(function(){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css=document.createElement('style');css.textContent=`
.cf-entry{padding:12px 8px;display:grid;gap:8px}.cf-entry button{color:#fff;background:#4c2870;border:1px solid #84619b;border-radius:12px;padding:13px;text-align:left;cursor:pointer;font:700 12px DM Sans,sans-serif}.cf-entry button small{display:block;font-weight:400;margin-top:4px}.cf-entry button.active{background:#f5ca48;color:#31164b}
.cf-business{padding:26px;width:100%;max-width:1350px;margin:auto;color:#301843}.cf-business h2{font:700 28px Outfit,sans-serif;margin:0 0 12px}.cf-business p{color:#675b72;line-height:1.6}
.cf-bcards{display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:14px;margin:20px 0}.cf-bcard{padding:20px;background:#fff;border:1px solid #e8e0ed;border-radius:14px}.cf-bcard b.metric{font-size:30px}
.cf-business .cf-btabs{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 24px}.cf-business button,.cf-business .cf-button{cursor:pointer;border:0;background:#391b53;color:white;padding:10px 13px;border-radius:8px;text-decoration:none;font:600 12px DM Sans,sans-serif;display:inline-block}
.cf-business .cf-btabs button{background:#e8deee;color:#301843}.cf-business .cf-btabs button.selected{background:#37184e;color:#fff}
.cf-business input,.cf-business select,.cf-business textarea{border:1px solid #d5c7de;border-radius:8px;padding:10px;max-width:100%;background:#fff;color:#321648}
.cf-business label{display:grid;gap:6px;font-weight:700;font-size:12px;margin:12px 0}.cf-business label.checkbox{display:flex;align-items:center;gap:9px}
.cf-business .cf-flex{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:16px 0}.cf-business .cf-table{overflow:auto;background:#fff;border:1px solid #e5dbe9;border-radius:12px}.cf-business table{border-collapse:collapse;width:100%;font-size:12px}.cf-business th,.cf-business td{padding:12px;text-align:left;border-bottom:1px solid #eee6f2;vertical-align:top}.cf-business th{background:#f8f5f9}
.cf-business .cf-tag{display:inline-block;padding:4px 8px;border-radius:18px;background:#f0e7f5;font-size:11px;margin:2px}
.cf-business .cf-warning{background:#fff5d5;border-radius:10px;padding:14px}.cf-business .cf-detail{margin-top:22px;background:white;padding:22px;border:1px solid #e2d8e8;border-radius:14px}
@media(max-width:720px){.cf-business{padding:16px}.cf-entry{grid-template-columns:1fr 1fr}}
`;document.head.appendChild(css);
let current='chooser',once=false;
const api=()=>window.CF_BIZ_API;
const labels={nuevo:'Nuevo',contactado:'Contactado',seguimiento:'En seguimiento',finalizado:'Finalizado'};
const interests={meditacion:'Meditación Camina por Cuba',aprender:'Aprender cómo',eligiendo:'Eligiendo Milagros',voluntariado:'Voluntariado',newsletter:'Newsletter',aportar:'Aportar'};
const tags=a=>(a||[]).map(v=>'<span class="cf-tag">'+esc(interests[v]||v)+'</span>').join('')||'Sin respuesta';
function mount(){
 const side=document.querySelector('.admin-app .sidebar');if(!side)return;
 if(!side.querySelector('#cfEntry')){
 const d=document.createElement('div');d.id='cfEntry';d.className='cf-entry';d.innerHTML='<button id="cfEditMode" type="button">✎ EDITAR SITIO WEB<small>Textos, páginas e imágenes</small></button><button id="cfBusinessMode" type="button">▦ GESTIONAR CUBA FELIZ<small>Comunidad, WhatsApp y Gotas</small></button>';
 side.insertBefore(d,side.querySelector('.side-label'));
 d.querySelector('#cfEditMode').onclick=()=>{current='editor';api().draw()};
 d.querySelector('#cfBusinessMode').onclick=()=>show('home');
 const lead=side.querySelector('#leadView');if(lead){lead.textContent='☷ Comunidad';lead.onclick=()=>show('community')}
 const w=document.createElement('button');w.className='page-link';w.textContent='◉ WhatsApp';w.onclick=()=>show('whatsapp');lead?.after(w);
 const g=document.createElement('button');g.className='page-link';g.textContent='◈ Gotas y Stripe';g.onclick=()=>show('gotas');w.after(g);
 }
 side.querySelector('#cfEditMode')?.classList.toggle('active',current==='editor');
 side.querySelector('#cfBusinessMode')?.classList.toggle('active',current!=='editor');
}
function frame(section,html){
 current=section;
 const a=api();if(!a)return;
 if(!document.querySelector('.admin-app'))return;
 mount();
 const top=document.querySelector('.topbar');if(top)top.innerHTML='<div><div class="breadcrumb">GESTIONAR CUBA FELIZ</div><h1>Centro de gestión</h1></div><div class="top-actions"><button id="cfBackEditor" class="control outlined" type="button">✎ Editar sitio web</button></div>';
 const layout=document.querySelector('.editor-layout');if(!layout)return;
 const tabs=[['home','Resumen'],['community','Comunidad'],['whatsapp','WhatsApp'],['gotas','Gotas y Stripe']];
 layout.innerHTML='<div class="cf-business"><div class="cf-btabs">'+tabs.map(([id,label])=>'<button type="button" data-cf-tab="'+id+'" class="'+(id===section?'selected':'')+'">'+label+'</button>').join('')+'</div>'+html+'</div>';
 document.getElementById('cfBackEditor').onclick=()=>{current='editor';a.draw()};
 document.querySelectorAll('[data-cf-tab]').forEach(b=>b.onclick=()=>show(b.dataset.cfTab));
 mount();
}
async function show(section){
 const a=api();if(!a)return;
 try{
 if(section==='home'){
 const x=await a.query('cf_leads','select=id,email&limit=2000',{auth:true});
 const unique=new Set(x.map(r=>(r.email||r.id).toLowerCase())).size;
 frame(section,'<h2>Gestionar Cuba Feliz</h2><p>Selecciona qué deseas gestionar. El editor de páginas está separado de la administración del movimiento.</p><div class="cf-bcards"><div class="cf-bcard"><h3>Comunidad</h3><b class="metric">'+unique+'</b><p>Personas identificadas</p><button data-biz="community">Gestionar participantes</button></div><div class="cf-bcard"><h3>WhatsApp</h3><p>Configurar número oficial, mensaje y botón público.</p><button data-biz="whatsapp">Configurar contacto</button></div><div class="cf-bcard"><h3>Gotas de la Felicidad</h3><p>Montos y transacciones. Cobros reales desactivados.</p><button data-biz="gotas">Abrir Gotas</button></div></div>');
 document.querySelectorAll('[data-biz]').forEach(b=>b.onclick=()=>show(b.dataset.biz));
 }else if(section==='community')await community();
 else if(section==='whatsapp')await whatsapp();
 else if(section==='gotas')await gotas();
 }catch(e){frame(section,'<h2>Problema al cargar el módulo</h2><p>'+esc(e.message)+'</p>')}
}
async function community(){
 const a=api(),records=await a.query('cf_leads','select=id,full_name,country,email,phone,interests,interest,created_at,contact_status&order=created_at.desc&limit=2000',{auth:true});
 const grouped=new Map();
 records.forEach(x=>{const k=(x.email||'').trim().toLowerCase()||x.id;let group=grouped.get(k);if(!group){group={latest:x,history:[],interests:new Set()};grouped.set(k,group)}group.history.push(x);(x.interests?.length?x.interests:[x.interest]).forEach(v=>group.interests.add(v))});
 const people=[...grouped.values()];
 frame('community','<h2>Personas registradas</h2><p>'+people.length+' personas · '+records.length+' registros históricos. Cada respuesta se conserva.</p><div class="cf-flex"><input id="cfSearch" placeholder="Buscar persona, país o interés" style="flex:1;min-width:240px"><select id="cfState"><option value="">Todos los estados</option>'+Object.entries(labels).map(([k,v])=>'<option value="'+k+'">'+v+'</option>').join('')+'</select><button id="cfCsv">Exportar CSV</button></div><div class="cf-table"><table><thead><tr><th>Persona</th><th>País</th><th>Contacto</th><th>Respuestas</th><th>Estado</th><th>Detalle</th></tr></thead><tbody id="cfRows"></tbody></table></div><div id="cfDetail"></div>');
 const search=document.getElementById('cfSearch'),filter=document.getElementById('cfState'),tbody=document.getElementById('cfRows');
 const matches=g=>[g.latest.full_name,g.latest.country,g.latest.email,...g.interests].join(' ').toLowerCase().includes(search.value.toLowerCase())&&(!filter.value||g.latest.contact_status===filter.value);
 function paint(){const p=people.filter(matches);tbody.innerHTML=p.map(g=>{const x=g.latest;return '<tr><td><b>'+esc(x.full_name)+'</b><br><small>'+g.history.length+' registro(s)</small></td><td>'+esc(x.country)+'</td><td>'+esc(x.email||'')+'<br>'+esc(x.phone||'')+'</td><td>'+tags([...g.interests])+'</td><td>'+esc(labels[x.contact_status]||'Nuevo')+'</td><td><button data-open="'+esc(x.id)+'">Ver ficha</button></td></tr>'}).join('')||'<tr><td colspan="6">Sin resultados</td></tr>';tbody.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>open(people.find(g=>g.latest.id===b.dataset.open)))}
 async function open(g){
 const x=g.latest;
 document.getElementById('cfDetail').innerHTML='<div class="cf-detail"><h2>'+esc(x.full_name)+'</h2><p>'+esc(x.country)+' · '+esc(x.email||'')+' · '+esc(x.phone||'')+'</p><h3>¿Qué desea?</h3>'+tags([...g.interests])+'<div class="cf-flex"><label>Estado<select id="cfStatus">'+Object.entries(labels).map(([k,v])=>'<option value="'+k+'" '+(x.contact_status===k?'selected':'')+'>'+v+'</option>').join('')+'</select></label><button id="cfSaveStatus">Guardar estado</button>'+(x.email?'<a class="cf-button" href="mailto:'+encodeURIComponent(x.email)+'">Correo ↗</a>':'')+(x.phone?'<a class="cf-button" target="_blank" rel="noopener noreferrer" href="https://wa.me/'+x.phone.replace(/\D/g,'')+'">WhatsApp ↗</a>':'')+'</div><h3>Historial</h3><div class="cf-table"><table><thead><tr><th>Fecha</th><th>País</th><th>Respuestas</th></tr></thead><tbody>'+g.history.map(h=>'<tr><td>'+new Date(h.created_at).toLocaleString('es-ES')+'</td><td>'+esc(h.country)+'</td><td>'+tags(h.interests?.length?h.interests:[h.interest])+'</td></tr>').join('')+'</tbody></table></div><h3>Notas internas</h3><div id="cfNotes"></div><label>Nueva nota<textarea id="cfNewNote" rows="3" maxlength="3000"></textarea></label><button id="cfAddNote">Agregar nota</button></div>';
 document.getElementById('cfSaveStatus').onclick=async()=>{try{const status=document.getElementById('cfStatus').value;await a.mutate('cf_leads','PATCH',{contact_status:status},'id=eq.'+x.id,{returning:false});x.contact_status=status;paint();alert('Estado guardado')}catch(e){alert(e.message)}};
 async function loadNotes(){const n=await a.query('cf_contact_notes','select=body,created_at&lead_id=eq.'+x.id+'&order=created_at.desc',{auth:true});document.getElementById('cfNotes').innerHTML=n.map(v=>'<div class="cf-bcard">'+esc(v.body)+'<br><small>'+new Date(v.created_at).toLocaleString('es-ES')+'</small></div>').join('')||'<p>Sin notas</p>'}
 document.getElementById('cfAddNote').onclick=async()=>{const body=document.getElementById('cfNewNote').value.trim();if(!body)return;try{await a.mutate('cf_contact_notes','POST',{lead_id:x.id,body,author_id:a.getSession().user.id});document.getElementById('cfNewNote').value='';await loadNotes()}catch(e){alert(e.message)}};
 await loadNotes();
 }
 search.oninput=paint;filter.onchange=paint;
 document.getElementById('cfCsv').onclick=()=>{const rows=[['Nombre','País','Email','Teléfono','Intereses','Estado','Inscripciones'],...people.filter(matches).map(g=>{const x=g.latest;return [x.full_name,x.country,x.email,x.phone,[...g.interests].join('; '),labels[x.contact_status]||'Nuevo',g.history.length]})];const csv='\uFEFF'+rows.map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const l=document.createElement('a');l.href=url;l.download='cuba-feliz-comunidad.csv';l.click();setTimeout(()=>URL.revokeObjectURL(url),1500)};
 paint();
}
async function whatsapp(){
 const a=api(),s=(await a.query('cf_public_settings','select=*&id=eq.main',{auth:true}))[0];if(!s)throw Error('Configuración no disponible');
 frame('whatsapp','<h2>WhatsApp oficial</h2><p>Estos cambios se guardan en Supabase. No hace falta modificar la página manualmente.</p><div class="cf-bcard" style="max-width:650px"><form id="cfWhatsappForm"><label>Número oficial con prefijo internacional<input type="tel" id="cfNumber" maxlength="24" placeholder="+1 ..." value="'+esc(s.whatsapp_number)+'"></label><label>Mensaje inicial<textarea id="cfMessage" maxlength="500" rows="3">'+esc(s.whatsapp_message)+'</textarea></label><label class="checkbox"><input type="checkbox" id="cfEnabled" '+(s.whatsapp_enabled?'checked':'')+'> Mostrar WhatsApp en la web</label><label class="checkbox"><input type="checkbox" id="cfFloat" '+(s.whatsapp_floating?'checked':'')+'> Mostrar botón flotante</label><button type="submit">Guardar WhatsApp</button><p id="cfSaveMsg" role="status"></p></form></div>');
 document.getElementById('cfWhatsappForm').onsubmit=async e=>{e.preventDefault();const n=document.getElementById('cfNumber').value.trim();const enabled=document.getElementById('cfEnabled').checked;const digits=n.replace(/\D/g,'');if(enabled&&(digits.length<8||digits.length>15)){document.getElementById('cfSaveMsg').textContent='Ingresa un número internacional válido';return}try{await a.mutate('cf_public_settings','PATCH',{whatsapp_number:n,whatsapp_message:document.getElementById('cfMessage').value,whatsapp_enabled:enabled,whatsapp_floating:document.getElementById('cfFloat').checked},'id=eq.main',{returning:false});document.getElementById('cfSaveMsg').textContent='Configuración guardada.'}catch(err){document.getElementById('cfSaveMsg').textContent=err.message}};
}
async function gotas(){
 const a=api(),s=(await a.query('cf_public_settings','select=*&id=eq.main',{auth:true}))[0];const [payments,events]=await Promise.all([a.query('cf_contributions','select=*&order=created_at.desc&limit=1000',{auth:true}),a.query('cf_payment_events','select=*&order=received_at.desc&limit=100',{auth:true})]);
 const paid=payments.filter(p=>p.status==='paid');const total=paid.reduce((v,p)=>v+p.amount_cents,0)/100;
 frame('gotas','<h2>Gotas de la Felicidad</h2><p class="cf-warning"><b>Stripe aún no está conectado:</b> cobros reales bloqueados hasta verificar la entidad titular, la elegibilidad y configurar credenciales seguras.</p><div class="cf-bcards"><div class="cf-bcard"><h3>Total recaudado</h3><b class="metric">$'+total.toFixed(2)+'</b><p>USD · privado</p></div><div class="cf-bcard"><h3>Aportes confirmados</h3><b class="metric">'+paid.length+'</b></div><div class="cf-bcard"><h3>Eventos webhook</h3><b class="metric">'+events.length+'</b><p>Últimos 100 eventos consultados</p></div></div><div class="cf-bcard" style="max-width:650px"><form id="cfAmountsForm"><h3>Montos sugeridos</h3><label>USD (separados por coma)<input id="cfAmounts" value="'+esc((s.donation_amounts||[5,10,25,50,100]).join(', '))+'"></label><label class="checkbox"><input type="checkbox" id="cfCustom" '+(s.donation_custom_enabled?'checked':'')+'> Permitir monto libre</label><button type="submit">Guardar montos</button><p id="cfAmountsMsg"></p></form></div><h3>Transacciones</h3><div class="cf-table"><table><thead><tr><th>Fecha</th><th>Persona</th><th>USD</th><th>Estado</th><th>Stripe</th></tr></thead><tbody>'+payments.map(v=>'<tr><td>'+new Date(v.created_at).toLocaleDateString('es-ES')+'</td><td>'+esc(v.contributor_email||v.contributor_name||'')+'</td><td>$'+(v.amount_cents/100).toFixed(2)+'</td><td>'+esc(v.status)+'</td><td>'+esc(v.stripe_session_id||'—')+'</td></tr>').join('')+(payments.length?'':'<tr><td colspan="5">Sin transacciones todavía</td></tr>')+'</tbody></table></div><h3>Eventos recibidos</h3><div class="cf-table"><table><thead><tr><th>Fecha</th><th>Evento</th><th>Estado</th><th>ID</th></tr></thead><tbody>'+events.map(v=>'<tr><td>'+new Date(v.received_at).toLocaleString('es-ES')+'</td><td>'+esc(v.event_type)+'</td><td>'+esc(v.event_status)+'</td><td>'+esc(v.id)+'</td></tr>').join('')+(events.length?'':'<tr><td colspan="4">Sin eventos; webhook pendiente de configuración.</td></tr>')+'</tbody></table></div>');
 const emailCfg=(await a.query('cf_email_settings','select=*&id=eq.main',{auth:true}))[0];
 const emailBox=document.createElement('div');emailBox.className='cf-bcard';emailBox.style.cssText='max-width:650px;margin:24px 0';
 emailBox.innerHTML='<h3>Correo de agradecimiento</h3><p>El remitente y el texto se preparan aquí. Los emails automáticos permanecen desactivados hasta configurar y verificar un proveedor de envío.</p><form id="cfEmailForm"><label>Nombre del remitente<input id="cfSenderName" maxlength="120" value="'+esc(emailCfg.sender_name)+'"></label><label>Correo del remitente<input type="email" id="cfSenderEmail" maxlength="200" value="'+esc(emailCfg.sender_email)+'" placeholder="hola@cubafeliz.com"></label><label>Asunto<input id="cfEmailSubject" maxlength="200" value="'+esc(emailCfg.subject_template)+'"></label><label>Texto del agradecimiento<textarea id="cfEmailBody" rows="4" maxlength="3000">'+esc(emailCfg.body_template)+'</textarea></label><p class="cf-warning">Proveedor de correo: pendiente. Estado: sin verificar.</p><button type="submit">Guardar borrador del email</button><p id="cfEmailMsg" role="status"></p></form>';
 document.querySelector('.cf-business').appendChild(emailBox);
 document.getElementById('cfEmailForm').onsubmit=async e=>{e.preventDefault();const data={sender_name:document.getElementById('cfSenderName').value.trim(),sender_email:document.getElementById('cfSenderEmail').value.trim(),subject_template:document.getElementById('cfEmailSubject').value.trim(),body_template:document.getElementById('cfEmailBody').value.trim()};try{await a.mutate('cf_email_settings','PATCH',data,'id=eq.main',{returning:false});document.getElementById('cfEmailMsg').textContent='Borrador guardado. El envío sigue desactivado.'}catch(err){document.getElementById('cfEmailMsg').textContent=err.message}};
 document.getElementById('cfAmountsForm').onsubmit=async e=>{e.preventDefault();const nums=document.getElementById('cfAmounts').value.split(',').map(v=>Number(v.trim()));if(!nums.length||nums.length>10||nums.some(n=>!Number.isInteger(n)||n<1||n>10000)){document.getElementById('cfAmountsMsg').textContent='Montos inválidos (1 a 10 valores enteros positivos).';return;}try{await a.mutate('cf_public_settings','PATCH',{donation_amounts:[...new Set(nums)],donation_custom_enabled:document.getElementById('cfCustom').checked},'id=eq.main',{returning:false});const sect=(await a.query('cf_sections','select=id,settings&section_key=eq.gotas&template=eq.donations',{auth:true}))[0];if(sect){await a.mutate('cf_sections','PATCH',{settings:{...sect.settings,donation_amounts:[...new Set(nums)]}},'id=eq.'+sect.id,{returning:false})}document.getElementById('cfAmountsMsg').textContent='Montos guardados también en la sección pública. Los pagos siguen desactivados.'}catch(err){document.getElementById('cfAmountsMsg').textContent=err.message}};
}
async function publicWhatsapp(){
 const a=api();if(!a)return;
 try{const s=(await a.query('cf_public_settings','select=whatsapp_number,whatsapp_message,whatsapp_enabled,whatsapp_floating&id=eq.main'))[0];if(!s)return;
 const existing=document.getElementById('cfPublicWhatsapp');if(existing)existing.remove();
 const digits=(s.whatsapp_number||'').replace(/\D/g,'');
 if(!s.whatsapp_enabled||digits.length<8||digits.length>15)return;
 const nav=document.querySelector('.site-header .nav-actions');
 if(nav&&!document.getElementById('cfHeaderWhatsapp')){const headerLink=document.createElement('a');headerLink.id='cfHeaderWhatsapp';headerLink.href='https://wa.me/'+digits+'?text='+encodeURIComponent(s.whatsapp_message||'Hola, quiero saber más sobre Cuba Feliz.');headerLink.target='_blank';headerLink.rel='noopener noreferrer';headerLink.textContent='WhatsApp';headerLink.style.cssText='color:#31164b;border:1px solid #31164b;border-radius:9px;padding:8px 13px;text-decoration:none;font-weight:700';nav.appendChild(headerLink)}
 if(!s.whatsapp_floating)return;
 const l=document.createElement('a');l.id='cfPublicWhatsapp';l.textContent='WhatsApp · Contáctanos';l.href='https://wa.me/'+digits+'?text='+encodeURIComponent(s.whatsapp_message);l.target='_blank';l.rel='noopener noreferrer';l.style.cssText='position:fixed;bottom:22px;right:18px;background:#31164b;color:#fff;border:2px solid #f5ca48;padding:14px 19px;border-radius:40px;z-index:9000;font:700 13px DM Sans,sans-serif;text-decoration:none';document.body.appendChild(l);
 }catch(e){console.warn('WhatsApp no disponible',e)}
}
let pending=false;
const observer=new MutationObserver(()=>{if(pending)return;pending=true;queueMicrotask(()=>{pending=false;const side=document.querySelector('.admin-app .sidebar');if(!side)return;const absent=!side.querySelector('#cfEntry');if(absent){mount();if(!once){once=true;show('home')}else if(current!=='editor')show(current)}})});
observer.observe(document.body,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',()=>{mount();publicWhatsapp()});
if(document.readyState!=='loading'){mount();publicWhatsapp()}
setTimeout(publicWhatsapp,1500);
})();