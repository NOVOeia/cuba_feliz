/* Plétora — página de marca personalizada usando datos del proyecto */
(function(){
"use strict";
const C=window.CFExperience;
if(!C || C.slug!=="pletora")return;
const h=C.esc;
const svg=(path)=>'<svg viewBox="0 0 80 80" role="img" focusable="false" aria-hidden="true">'+path+'</svg>';
const icons=[
svg('<circle cx="40" cy="15" r="7"/><path d="M40 24c-11 0-12 8-13 19l-9 12q-7 6-13 2 M40 24c11 0 12 8 13 19l9 12q7 6 13 2 M28 41l-4 18 M52 41l4 18 M40 32v26 M40 58c-10 0-16 9-23 9h46c-7 0-13-9-23-9 M25 49c4 7 9 9 15 9 6 0 11-2 15-9 M19 66h42"/>'),
svg('<path d="M39 10v26c-4 1-8 7-13 13-6 6-13 7-15 1-2-6 2-12 7-19 4-6 6-10 9-9 6 2 3 14 12 14 M41 10v26c4 1 8 7 13 13 6 6 13 7 15 1 2-6-2-12-7-19-4-6-6-10-9-9-6 2-3 14-12 14 M25 26l-5 15m8-9-7 17 M55 26l5 15m-8-9 7 17 M40 10v53"/>'),
svg('<path d="M40 68 13 43C-5 27 11 3 30 17l10 10 10-10C69 3 85 27 67 43Z"/>'),
svg('<path d="M39 12c-8-10-20 1-18 8-14 2-12 19-4 24-7 11 1 23 12 20 4 7 11 4 11-3V15M41 12c8-10 20 1 18 8 14 2 12 19 4 24 7 11-1 23-12 20-4 7-11 4-11-3V15 M31 22c-11-5-12 12-5 14m5 7c-13-1-8 17-1 13m-8-19 10 6m-8 14 10-4m15-30c11-5 12 12 5 14m-5 7c13-1 8 17 1 13m8-19-10 6m8 14-10-4 M40 19v40"/>'),
svg('<circle cx="40" cy="17" r="9"/><circle cx="19" cy="28" r="7"/><circle cx="61" cy="28" r="7"/><path d="M27 58V44c0-17 26-17 26 0v14H27ZM6 58V45c0-10 11-13 17-8m51 21V45c0-10-11-13-17-8M19 65h42M10 65h60"/>'),
svg('<path d="M40 65C19 62 13 41 15 30c10 3 22 10 25 35ZM40 65c21-3 27-24 25-35-10 3-22 10-25 35ZM40 61C26 42 33 22 40 15c7 7 14 27 0 46ZM40 65c-15 0-28-3-34-13 15-2 25 2 34 13Zm0 0c15 0 28-3 34-13-15-2-25 2-34 13Z"/>')
];
const colors=['#873a99','#1c9aaa','#fc8a16','#eb69a4','#76ad52','#6a399b'];
function getLogo(){
 const c=C.homeItems.find(x=>x.key==='pletora');
 const src=C.sec('detail-pletora-0').media?.url||c?.media?.url;
 return C.url(src)||'https://assets.cdn.filesafe.space/3icsVf8NEAhkEMSakJpd/media/6ad7aeecb212bcb9dcc9d1c6.png';
}
const T=(k,title,desc)=>'<div class="pl-eyebrow">'+h(k)+'</div><h2 class="pl-title">'+title+'</h2>'+(desc?'<p class="pl-intro">'+h(desc)+'</p>':'');
const btn=(label,href,primary)=>C.btn(label,href,primary);
function gallery(kind,alt){
 return '<div class="pl-gallery-wrap '+(alt?'alt':'')+'"><div class="pl-wrap">'+T(kind==='galeria'?'FOTOGRAFÍAS Y VIDEOS':'TESTIMONIOS',''+(kind==='galeria'?'Momentos para recordar.':'Experiencias contadas por quienes las vivieron.'),'')+'</div>'+C.gallery(kind)+'</div>';
}
C.hero=function(){
 return '<section class="pl-hero"><div class="pl-wrap pl-hero-inner"><div><div class="pl-eyebrow">PLÉTORA · EL ARTE DE VIVIR DESDE LA ABUNDANCIA</div>'+
 '<h1>Escápate… <em>vive tu abundancia interior.</em></h1>'+
 '<p class="pl-claim">A Guanabacoa por cuatro días y sumérgete en una experiencia transformadora para <strong>recordar, activar y vivir tu abundancia interior.</strong></p>'+
 '<div class="pl-headline-date"><span class="pl-date-icon" aria-hidden="true">◈</span><div><strong>10 al 13 de diciembre de 2026</strong><small>Jueves a domingo · Guanabacoa, Cuba</small></div></div>'+
 '<div class="pl-hero-actions">'+btn('Descubrir la experiencia','#experiencia',true)+btn('Fecha, lugar y aporte','#informacion',false)+'</div></div>'+
 '<div class="pl-logo-spot"><div class="pl-logo-frame"><img src="'+h(getLogo())+'" alt="Logo oficial Plétora, El Arte de Vivir Desde La Abundancia" loading="eager" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.hidden=false"><span class="pl-logo-text" hidden>PLÉTORA</span></div><span class="pl-logo-caption">El Arte de Vivir Desde La Abundancia</span></div>'+
 '</div></section>';
};
function pillars(){
 const six=C.items('detail-pletora-2');
 return '<section class="pl-slab pl-slab--sea" id="experiencia"><div class="pl-wrap">'+T('LO QUE VIVIRÁS','Seis caminos para vivir la abundancia.','Cada dimensión está tomada del afiche oficial de Plétora.')+
 '<div class="pl-pillars">'+six.map((x,i)=>'<article class="pl-pillar" style="--pl-pillar:'+colors[i%colors.length]+'"><div class="pl-pillar-icon">'+icons[i%icons.length]+'</div><h3>'+h(x.title)+'</h3><p>'+h(x.body)+'</p></article>').join('')+'</div></div></section>';
}
function facts(){
 const rows=[['FECHA DEL RETIRO','10 al 13 de diciembre de 2026','Jueves a domingo'],['LUGAR','Guanabacoa','Hijas de María Auxiliadora, Cuba'],['DIRIGIDO A','Personas que ya realizaron Eligiendo Milagros','Retiro de segundo nivel'],['APORTE','$22,222 CUP','Incluye transporte, hospedaje, tres comidas y todo el programa']];
 return '<section class="pl-slab pl-slab--cream" id="informacion"><div class="pl-wrap">'+T('INFORMACIÓN OFICIAL','Fechas, lugar y aporte.<br><span style="color:#067e85">Grandes y claros.</span>','Toda la información se presenta como figura en el material original.')+
 '<div class="pl-facts">'+rows.map((x,i)=>'<article class="pl-fact"><div class="pl-fact-label">'+h(x[0])+'</div><div class="pl-fact-value '+(i===0||i===3?'emphasis':'')+'">'+h(x[1])+'</div><p class="pl-fact-note">'+h(x[2])+'</p></article>').join('')+'</div>'+
 '<div class="pl-inclusion"><strong>¿Qué incluye el aporte?</strong><p>Transporte, hospedaje, tres comidas y todo el programa del retiro.</p></div></div></section>';
}
function dates(){
 const milestones=[['PRIMERA PUBLICACIÓN','Miércoles, 7 octubre 2026'],['MATRÍCULA COMIENZA','Domingo, 11 octubre 2026'],['MATRÍCULA CIERRA','Miércoles, 4 noviembre 2026'],['FECHA DEL RETIRO','10–13 diciembre 2026']];
 return '<section class="pl-slab pl-slab--cream" id="matricula"><div class="pl-wrap">'+T('CRONOGRAMA','Las fechas de nuestra convocatoria.','Según las fechas publicadas en el afiche de Plétora.')+
 '<div class="pl-timeline">'+milestones.map(x=>'<article class="pl-milestone"><div class="pl-milestone-label">'+h(x[0])+'</div><div class="pl-milestone-date">'+h(x[1])+'</div></article>').join('')+'</div></div></section>';
}
function intro(){
 return '<div class="pl-identity-bar"><div class="pl-wrap"><strong><span>Personas más conscientes</span> para una Cuba más plena.</strong></div></div>'+
 '<section class="pl-slab pl-slab--cream"><div class="pl-wrap pl-invitation"><div>'+T('UN RETIRO TRANSFORMADOR','Más que un retiro. Una elección personal.','Escápate a Guanabacoa por cuatro días, para recordar, activar y vivir tu abundancia interior.')+'</div>'+
 '<div class="pl-quote-art"><blockquote>“Es un compromiso <em>contigo, con los tuyos y con una Cuba más feliz.</em>”</blockquote></div></div></section>';
}
function contact(){
 const wa=C.wa();
 return '<section class="pl-upcoming"><div class="pl-wrap"><div class="pl-eyebrow" style="color:#ffe0a7">PLÉTORA · CONTACTO DIRECTO</div><h2>El arte de vivir<br>desde la abundancia.</h2>'+
 '<p>'+ (wa?'Contacta directamente al equipo organizador de Plétora.':'El canal directo de WhatsApp de Plétora se activará cuando se incorpore su número oficial.')+'</p>'+
 (wa?btn('Consultar al equipo de Plétora',wa,true):'<span style="display:inline-flex;border:1px solid #ffffff90;padding:15px 20px;border-radius:16px;font-size:1.16rem;font-weight:750">WhatsApp de Plétora pendiente de confirmar</span>')+
 '</div></section>';
}
C.render=function(){return intro()+pillars()+facts()+dates()+gallery('galeria',false)+gallery('testimonios',true)+contact()};
})();
