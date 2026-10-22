
(function(){
'use strict';
const C=window.CFExperience;
if(!C||!['pletora','eligiendo-milagros'].includes(C.slug))return;
const e=C.esc;
const slug=C.slug;
const pletora=slug==='pletora';
const prefix=pletora?'detail-pletora-':'detail-eligiendo-milagros-';
const mark=pletora?'PLÉTORA':'ELIGIENDO MILAGROS';
const paletteIcons=pletora?['✦','◎','♡','✳','♧','❀']:['◎','✦','♫'];
function pic(){
 const front=C.sec(prefix+'0').media?.url;
 const card=C.homeItems.find(x=>x.key===slug)?.media?.url;
 const defaultSrc=pletora?'https://assets.cdn.filesafe.space/3icsVf8NEAhkEMSakJpd/media/6ad7aeecb212bcb9dcc9d1c6.png':'https://assets.cdn.filesafe.space/3icsVf8NEAhkEMSakJpd/media/6ad7aeecd13d88c0c82ca572.png';
 return C.url(front)||C.url(card)||defaultSrc;
}
function head(k,t,d){
 return '<div class="rt-kicker">'+e(k)+'</div><h2 class="rt-h2">'+t+'</h2>'+(d?'<p class="rt-paragraph">'+e(d)+'</p>':'');
}
function gallery(kind){
 const title=kind==='galeria'?'Una historia para ver y recordar.':'Voces que merecen ser escuchadas.';
 const text=kind==='galeria'?'Aquí podrán publicarse fotografías y videos reales del retiro, desde el portal administrativo.':'Los testimonios se incorporarán cuando sean facilitados y autorizados por sus protagonistas.';
 return '<div class="rt-gallery-wrapper '+(kind==='testimonios'?'testimonials':'')+'"><div class="shell"><div class="rt-kicker">'+(kind==='galeria'?'GALERÍA DE EXPERIENCIAS':'TESTIMONIOS REALES')+'</div><h2 class="rt-h2">'+title+'</h2><p class="rt-paragraph">'+text+'</p></div>'+C.gallery(kind)+'</div>';
}
function visual(){
 return '<div class="rt-hero-visual" aria-hidden="true"><div class="rt-sun"></div><div class="rt-ring"></div><div class="rt-ring r2"></div><div class="rt-ring r3"></div><span class="rt-floating-mark">✳</span><span class="rt-floating-mark rt-symbol--1">✦</span><div class="rt-visual-core"><img src="'+e(pic())+'" alt="" loading="eager"></div><div class="rt-visual-note">'+(pletora?'El arte de vivir desde la abundancia':'Un retiro de sanación y transformación')+'</div></div>';
}
C.hero=function(){
 const wa=C.wa();
 const title=pletora?'Escápate. <span>Vive tu abundancia interior.</span>':'Elige tu camino. <span>Elige tus milagros.</span>';
 const lead=pletora?'Escápate a Guanabacoa por cuatro días y sumérgete en una experiencia transformadora para recordar, activar y vivir tu abundancia interior.':'Un retiro de sanación y transformación con yoga, meditación, respiración consciente y espacios de reflexión.';
 return '<section class="rt-hero '+(pletora?'rt-hero--pletora':'rt-hero--milagros')+'"><div class="shell rt-hero-inner"><div><div class="rt-eyebrow">'+(pletora?'PLÉTORA · EL ARTE DE VIVIR DESDE LA ABUNDANCIA':'ELIGIENDO MILAGROS · RETIRO DE SANACIÓN Y TRANSFORMACIÓN')+'</div><h1>'+title+'</h1><p class="rt-hero-lead">'+lead+'</p><div class="rt-hero-tags"><span>'+(pletora?'10–13 DICIEMBRE 2026':'25–28 FEBRERO 2027')+'</span><span>GUANABACOA · CUBA</span></div><div class="rt-hero-actions">'+(wa?C.btn('Consultar por WhatsApp',wa,true):C.btn('Explorar la experiencia','#experiencia',true))+C.btn('Conocer los detalles','#informacion',false)+'</div><div class="rt-media-label">Una iniciativa del movimiento Cuba Feliz</div></div>'+visual()+'</div></section>';
};
function pillarSection(){
 const raw=C.items(prefix+'2');
 const cards=raw.map((x,i)=>'<button type="button" class="rt-pillar" data-pillar="'+i+'" aria-pressed="'+(i===0?'true':'false')+'" aria-controls="rt-pillar-detail"><span class="rt-pillar-symbol">'+paletteIcons[i%paletteIcons.length]+'</span><h3>'+e(x.title)+'</h3><p>'+e(x.body)+'</p></button>').join('');
 const f=raw[0]||{title:'',body:''};
 return '<section class="rt-section rt-section--cream" id="experiencia"><div class="shell">'+head('SEIS DIMENSIONES DE LA EXPERIENCIA','Un universo de <em>posibilidades.</em>','Meditación, Respiración ESPI, autorregulación, herramientas transformadoras, sinergia grupal, naturaleza y comunidad.')+'<div class="rt-pillars">'+cards+'</div><div class="rt-pillar-spotlight" id="rt-pillar-detail" aria-live="polite"><div><span>EXPLORA LA EXPERIENCIA</span><h3 id="rt-focus-name">'+e(f.title)+'</h3><p id="rt-focus-text">'+e(f.body)+'</p></div><div class="symbol" aria-hidden="true" id="rt-focus-icon">'+paletteIcons[0]+'</div></div></div></section>';
}
function pletoraDetails(){
 const stats=[['FECHA','10–13 diciembre 2026'],['LUGAR','Guanabacoa · Hijas de María Auxiliadora'],['DIRIGIDO A','Personas que ya realizaron Eligiendo Milagros'],['APORTE','22.222 CUP']];
 const calendar=[['PRIMERA PUBLICACIÓN','Mié. 7 oct 2026'],['MATRÍCULA COMIENZA','Dom. 11 oct 2026'],['MATRÍCULA CIERRA','Mié. 4 nov 2026'],['RETIRO','10–13 dic 2026']];
 return '<section class="rt-section rt-section--white" id="informacion"><div class="shell">'+head('DETALLES CONFIRMADOS','Todo lo que debes <em>saber.</em>','Fecha, lugar, personas a quienes está dirigido el retiro y aporte según el afiche oficial.')+'<div class="rt-stats">'+stats.map(x=>'<div class="rt-stat"><span class="key">'+e(x[0])+'</span><div class="value">'+e(x[1])+'</div></div>').join('')+'</div><div class="rt-info-hero"><div class="rt-info-copy"><div class="rt-kicker">TU APORTE INCLUYE</div><h3>Cuatro días para vivir la experiencia.</h3><p>El programa anunciado incluye transporte, hospedaje, tres comidas y todas las actividades del retiro.</p><p>Está dirigido a personas que ya realizaron <strong>Eligiendo Milagros</strong>.</p></div><div class="rt-info-visual"><div><div class="big">22.222 CUP</div><span>Aporte anunciado para Plétora</span></div></div></div><div class="rt-divider"></div><div class="rt-kicker">CALENDARIO DE LA CONVOCATORIA</div><div class="rt-calendar">'+calendar.map(x=>'<article class="rt-calendar-item"><span class="over">'+e(x[0])+'</span><div class="date">'+e(x[1])+'</div></article>').join('')+'</div></div></section>';
}
function pletoraPage(){
 return '<div class="rt-masthead"><div class="shell"><strong>Personas más conscientes para una Cuba más plena.</strong><a href="#experiencia">Descubre las seis experiencias ↗</a></div></div>'+
 '<section class="rt-section rt-section--dark"><div class="shell"><div class="rt-kicker">MÁS QUE UN RETIRO</div><p class="rt-quote">“Es un compromiso <span>contigo, con los tuyos y con una Cuba más feliz.</span>”</p></div></section>'+
 pillarSection()+pletoraDetails()+
 '<section class="rt-section rt-section--dark"><div class="shell rt-center">'+head('PLÉTORA','Conecta. Comparte. <em>Expande tu potencial.</em>','El arte de vivir desde la abundancia.')+'</div></section>'+
 gallery('galeria')+gallery('testimonios')+
 '<section class="rt-contact"><div class="shell"><div class="rt-kicker">CONTACTO DIRECTO DE PLÉTORA</div><h2 class="rt-h2">La abundancia <em>comienza dentro.</em></h2><p class="rt-paragraph">'+(C.wa()?'Para información sobre el retiro, escribe al contacto oficial de Plétora.':'La organización facilitará el contacto de WhatsApp exclusivo de Plétora; no te enviaremos al formulario general de Cuba Feliz.')+'</p>'+(C.wa()?C.btn('Escribir al WhatsApp de Plétora',C.wa(),true):'<p class="rt-contact-note">Número de WhatsApp de Plétora pendiente de incorporar.</p>')+'</div></section>';
}
function benefits(){
 const items=C.items(prefix+'1');
 return '<section class="rt-section rt-section--white" id="experiencia"><div class="shell">'+head('QUÉ TE ESPERA','Un encuentro para <em>reconectar contigo.</em>','El retiro reúne prácticas de Respiración ESPI, yoga, círculos sagrados, talleres y espacios de reflexión.')+'<div class="rt-em-steps">'+items.map((x,i)=>'<article class="rt-em-step"><div class="rt-numeral">0'+(i+1)+'</div><h3>'+e(x.title)+'</h3><p>'+e(x.body)+'</p></article>').join('')+'</div></div></section>';
}
function mentors(){
 const mentors=C.items(prefix+'2');
 const cards=mentors.map((x,i)=>{
   const media=x.media||{},photo=(media.type!=='video'?C.url(media.url):'')||'';
   const pos=['top','center','bottom'].includes(media.position)?media.position:'center';
   const picture=photo?'<img src="'+e(photo)+'" alt="Fotografía de '+e(x.title)+'" loading="lazy" decoding="async" style="object-position:center '+e(pos)+'" onerror="this.hidden=true;this.parentElement.dataset.failed='+'true'+'">':'';
   const initial=e(x.title?.[0]||String(i+1));
   const empty='<span class="rt-mentor-empty-symbol" aria-hidden="true">'+initial+'</span><span class="rt-mentor-empty-label">Fotografía pendiente</span>';
   return '<article class="rt-mentor"><div class="rt-mentor-photo '+(photo?'':'rt-mentor-photo--empty')+'">'+picture+'<div class="rt-mentor-placeholder">'+empty+'</div></div><div class="rt-mentor-info"><div class="rt-mentor-kicker">FACILITADORA 0'+(i+1)+'</div><h3>'+e(x.title)+'</h3><p>'+e(x.body)+'</p></div></article>';
 }).join('');
 return '<section class="rt-section rt-section--faint" id="facilitadoras"><div class="shell">'+head('TRES MAESTRAS','El corazón del <em>encuentro.</em>','Conoce las trayectorias de Luzliank, Yonaiky y Verónica.')+'<div class="rt-mentors">'+cards+'</div></div></section>';
}
function agenda(){
 const days=C.items(prefix+'3'),labels=['25 FEB','26 FEB','27 FEB'];
 const tabs=days.map((d,i)=>'<button type="button" class="rt-day-tab" role="tab" id="rt-tab-'+i+'" aria-controls="rt-panel-'+i+'" aria-selected="'+(i===0?'true':'false')+'" data-day="'+i+'">'+e(labels[i]||d.title)+'</button>').join('');
 const panels=days.map((d,i)=>{
   const schedule=Array.isArray(d.schedule)?d.schedule:[];
   const contents=schedule.length?'<div class="rt-day-schedule">'+schedule.map(x=>'<div class="rt-day-schedule-row"><span class="time">'+e(x.time)+'</span><span class="activity">'+e(x.activity)+'</span></div>').join('')+'</div>':'<p class="rt-paragraph">'+e(d.body)+'</p>';
   return '<div class="rt-day-content" role="tabpanel" id="rt-panel-'+i+'" aria-labelledby="rt-tab-'+i+'" '+(i===0?'':'hidden')+'><h3>'+e(d.title)+'</h3>'+contents+'</div>';
 }).join('');
 return '<section class="rt-section rt-section--cream"><div class="shell">'+head('PROGRAMA DEL RETIRO','Cada momento cuenta.','El programa de las tres jornadas está tomado del documento de Eligiendo Milagros.')+'<div class="rt-day-panels" role="tablist" aria-label="Selecciona el día del programa">'+tabs+'</div>'+panels+'<p class="rt-small-note">El material anuncia el retiro del 25 al 28 de febrero de 2027, pero la agenda suministrada solo detalla los días 25, 26 y 27. No se agregaron actividades para el día 28.</p></div></section>';
}
function emInfo(){
 return '<section class="rt-section rt-section--white" id="informacion"><div class="shell">'+head('DETALLES DE MATRÍCULA','Un espacio para <em>tu transformación.</em>','Condiciones publicadas en la convocatoria de Eligiendo Milagros.')+'<div class="rt-stats">'+[['FECHAS','25–28 febrero 2027'],['LUGAR','Guanabacoa, Cuba'],['MATRÍCULA','28 dic 2026 – 7 feb 2027'],['APORTE','11.111 CUP']].map(x=>'<div class="rt-stat"><span class="key">'+e(x[0])+'</span><div class="value">'+e(x[1])+'</div></div>').join('')+'</div><div class="rt-em-details"><article class="rt-em-card"><h3>Qué incluye</h3><ul><li>Insumos, herramientas, prácticas y enseñanzas.</li><li>Tres comidas al día y hospedaje.</li><li>Transporte de ida y vuelta de La Habana a Guanabacoa.</li></ul><p>Hay becas parciales y un descuento de 888 CUP para pago presencial completo en efectivo en Lawton.</p></article><article class="rt-em-card"><div class="rt-kicker">APORTE</div><div class="rt-price">11.111 CUP</div><h3>Reserva anunciada</h3><p>Apartado: <strong>3.111 CUP</strong>. Dos plazos posteriores de <strong>4.000 CUP</strong> cada uno, antes del 7 de febrero de 2027.</p><p><strong>Transfermóvil:</strong> 9200 9598 7577 9981.</p><p>Envía comprobante de pago y datos solicitados al <strong>+53 52703839</strong>.</p></article></div><p class="rt-small-note">Las descripciones de bienestar corresponden al enfoque de los organizadores y no constituyen una garantía de resultados médicos.</p></div></section>';
}
function milagrosPage(){
 return '<div class="rt-masthead"><div class="shell"><strong>Un retiro de sanación y transformación.</strong><a href="#experiencia">Conoce la experiencia ↗</a></div></div>'+
 benefits()+
 '<section class="rt-section rt-section--dark"><div class="shell"><div class="rt-kicker">ELIGIENDO MILAGROS</div><p class="rt-quote">“Respira, <span>conecta y descubre</span> nuevas posibilidades.”</p></div></section>'+
 mentors()+agenda()+emInfo()+gallery('galeria')+gallery('testimonios')+
 '<section class="rt-contact rt-contact--milagros"><div class="shell"><div class="rt-kicker">CONTACTO DIRECTO</div><h2 class="rt-h2">Da el primer paso hacia <em>tu experiencia.</em></h2><p class="rt-paragraph">Para consultar información sobre Eligiendo Milagros, escribe directamente a su equipo al +53 58647042.</p>'+C.btn('WhatsApp · Eligiendo Milagros',C.wa(),true)+'</div></section>';
}
C.render=pletora?pletoraPage:milagrosPage;
document.addEventListener('click',function(evt){
 const pillar=evt.target.closest('[data-pillar]');
 if(pillar&&C.slug==='pletora'){
   const index=Number(pillar.dataset.pillar),data=C.items(prefix+'2')[index];
   if(!data)return;
   document.querySelectorAll('[data-pillar]').forEach(node=>node.setAttribute('aria-pressed',String(node===pillar)));
   const t=document.getElementById('rt-focus-name'),d=document.getElementById('rt-focus-text'),ic=document.getElementById('rt-focus-icon');
   if(t)t.textContent=data.title;
   if(d)d.textContent=data.body;
   if(ic)ic.textContent=paletteIcons[index%paletteIcons.length];
 }
 const tab=evt.target.closest('[data-day]');
 if(tab&&C.slug==='eligiendo-milagros'){
   const index=Number(tab.dataset.day);
   document.querySelectorAll('[data-day]').forEach(node=>node.setAttribute('aria-selected',String(node===tab)));
   document.querySelectorAll('.rt-day-content').forEach((node,i)=>node.hidden=i!==index);
 }
});
})();
