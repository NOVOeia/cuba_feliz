
(function(){
const {query,publicInsert,renderMedia,safeUrl} = window.CFAPI;
let currentPage=null,appData=[],appPages=[];const root=document.querySelector('#root');
const h=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const id=x=>String(x||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9-]/g,'-');
let slug='inicio';
function link(b){const register=['camina-aprende','camina-conecta','camina-encuentrate','camina-llega'].includes(slug)&&/volver\s+a\s+(?:(?:¡?\s*)?cuba\s+feliz!?|camina\s+por\s+cuba|cuba)/i.test(String(b?.label||''));const href=register?'#participar':(safeUrl(b?.href)||'#');const label=register?'Inscríbete a Camina por Cuba':(b.label||'Conocer más');const style=['primary','secondary','ghost'].includes(b?.style)?b.style:'primary';return `<a class="cf-btn ${style}" href="${h(href)}" ${href.startsWith('http')?'target="_blank" rel="noopener noreferrer"':''}><span>${h(label)}</span><span class="btn-arrow">\u2197</span></a>`}
function buttons(bs){return bs?.length?`<div class="button-group">${bs.map(link).join('')}</div>`:''}
function cards(sec){return `<div class="cards-grid">${(sec.items||[]).map((c,i)=>`<article class="content-card reveal" id="${id(c.title)}"><div class="card-media">${renderMedia(c.media,{alt:c.title})}</div><div class="card-pad"><h3>${h(c.title)}</h3><p>${h(c.body)}</p>${sec.section_key==='iniciativas'&&['casa-luz','tertulia-de-tribu','rayitos-de-sol'].includes(c.key)?`<div class="button-group"><button type="button" class="cf-btn primary cf-upcoming-trigger" data-upcoming-card="${h(c.key)}" data-upcoming-title="${h(c.title)}" data-upcoming-description="${h(c.body)}" data-upcoming-image="${h(c.media?.type==='video'?(c.media?.poster||''):(c.media?.url||''))}"><span>Próximamente</span><span class="btn-arrow" aria-hidden="true">↗</span></button></div>`:buttons(c.buttons)}</div></article>`).join('')}</div>`}
function orbitCover(c){
 const media=c.media||{};
 let cover=media?.type==='video'?(media.poster||''):(media.url||'');
 if(media?.type==='video'&&!cover){try{const u=new URL(media.url);const host=u.hostname.replace(/^www\./,'');const code=host==='youtu.be'?u.pathname.split('/')[1]:u.searchParams.get('v')||u.pathname.match(/^\/(?:embed|shorts|live)\/([A-Za-z0-9_-]+)/)?.[1];if(code&&/^[A-Za-z0-9_-]{6,20}$/.test(code)&&['youtube.com','m.youtube.com','youtu.be','youtube-nocookie.com'].includes(host))cover='https://img.youtube.com/vi/'+code+'/hqdefault.jpg'}catch(e){}}
 if(cover&&window.CF_ASSETS?.[cover])cover=window.CF_ASSETS[cover];
 const safe=safeUrl(cover);
 const position=['center','top','bottom'].includes(media.position)?media.position:'center';
 return safe?`<img src="${h(safe)}" loading="lazy" alt="" style="object-position:${position}">`:'<div class="missing-media"><span class="line-symbol">'+window.CF_ASTERISK_SVG+'</span><span>Imagen próximamente</span></div>';
}
function orbitGallery(s){const galleryId=id(s.id||s.section_key);
 return `<div class="orbit-gallery" data-orbit-gallery="${h(galleryId)}" aria-label="Galería ${h(s.title)}"><button class="orbit-arrow prev" type="button" data-orbit-prev aria-label="Tarjeta anterior">‹</button><div class="orbit-track" tabindex="0" aria-label="Desliza para explorar las iniciativas">${(s.items||[]).map((c,i)=>`<article class="orbit-tile"><button class="orbit-open" type="button" data-orbit-item="${i}" aria-label="Ampliar ${h(c.title)}"><span class="orbit-frame"><span class="orbit-media">${orbitCover(c)}</span>${c.media?.type==='video'&&c.media?.url?'<span class="orbit-play" aria-hidden="true">▶</span>':''}</span><h3>${h(c.title)}</h3><p>${h(c.body)}</p><span class="orbit-read-more">Descubrir más ↗</span></button></article>`).join('')}</div><button class="orbit-arrow next" type="button" data-orbit-next aria-label="Tarjeta siguiente">›</button><p class="orbit-label">Desliza las tarjetas o selecciona una para ampliarla</p></div>`
}
function setupOrbitGalleries(sections){root.querySelectorAll('[data-orbit-gallery]').forEach(g=>{
 const s=sections.find(x=>id(x.id||x.section_key)===g.dataset.orbitGallery);if(!s)return;
 const track=g.querySelector('.orbit-track');
 const advance=delta=>{const width=track.querySelector('.orbit-tile')?.getBoundingClientRect().width||270;const step=width+20;const edge=track.scrollWidth-track.clientWidth;if(delta>0&&track.scrollLeft>=edge-4)track.scrollTo({left:0,behavior:'smooth'});else if(delta<0&&track.scrollLeft<=4)track.scrollTo({left:edge,behavior:'smooth'});else track.scrollBy({left:delta*step,behavior:'smooth'});};
 g.querySelector('[data-orbit-prev]').onclick=()=>advance(-1);g.querySelector('[data-orbit-next]').onclick=()=>advance(1);
 track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();advance(1)}else if(e.key==='ArrowLeft'){e.preventDefault();advance(-1)}});
 g.querySelectorAll('[data-orbit-item]').forEach(button=>button.onclick=()=>{
  const c=s.items[Number(button.dataset.orbitItem)];if(!c)return;
  const destination=(c.buttons||[]).find(b=>/^#pagina\/camina-(aprende|conecta|multiplica|encuentrate)$/.test(b.href||''));
  if(destination){window.location.hash=destination.href;return;}
  const d=document.createElement('dialog');d.className='orbit-modal';d.setAttribute('aria-label','Detalle: '+c.title);
  const usefulButtons=(c.buttons||[]).filter(button=>!/^(camina-por-cuba\.html(?:#[a-z0-9_-]+)?|#pagina\/camina-por-cuba(?:\/[a-z0-9_-]+)?)$/i.test(button.href||''));
  d.innerHTML=`<button class="orbit-modal-close" type="button" aria-label="Cerrar galería">×</button><div class="orbit-modal-content"><div class="orbit-modal-art">${renderMedia(c.media,{alt:c.title})}</div><div class="orbit-modal-copy"><span class="orbit-modal-kicker">CAMINA POR CUBA · UN MISMO CORAZÓN</span><h3>${h(c.title)}</h3><p>${h(c.body)}</p>${buttons(usefulButtons)}</div></div>`;
  document.body.appendChild(d);window.CF_rewriteLinks?.(d);d.addEventListener('close',()=>d.remove(),{once:true});d.querySelector('.orbit-modal-close').onclick=()=>d.close();d.onclick=e=>{if(e.target===d)d.close()};d.showModal();
 });
 });}

function cfCaminaJourneyNav(slug){
 const links=[['camina-aprende','Aprende'],['camina-conecta','Conecta'],['camina-encuentrate','Llega'],['gotas-de-felicidad','Aporta']];
 if(!links.some(([route])=>route===slug))return '';
 return '<nav class="cf-journey-nav" aria-label="Explorar Camina por Cuba">'
   +'<p class="cf-journey-nav__eyebrow">Camina por Cuba · Explora las cuatro formas de participar</p>'
   +'<div class="cf-journey-nav__items">'
   +links.map(([route,label])=>'<a class="cf-journey-nav__link" href="#pagina/'+route+'"'+(slug===route?' aria-current="page"':'')+'>'+label+'</a>').join('')
   +'</div></nav>';
}
function stepList(sec){const visible=sec.section_key==='camina'?(sec.items||[]).filter(c=>c.key!=='multiplica'&&c.status!=='hidden'):(sec.items||[]);return `<div class="walk-grid">${visible.map((c,i)=>`<article class="walk-card reveal" style="--cf-stagger:${i}" id="${id(c.title)}"><div class="walk-image">${renderMedia(c.media,{alt:c.title})}</div><div class="walk-body"><h3>${h(c.title)}</h3><p>${h(c.body)}</p>${buttons(c.buttons)}</div></article>`).join('')}</div>`}

function homeHeadline(s){
 const title=String(s.title||'').trim();
 const match=title.match(/^(Nos conmueve el amor)\s+(profundo a)\s+(nuestra patria)\s+(y nos unimos para impulsar)\s+(su transformación\.)$/i);
 if(!match)return headlineAccent(s);
 return '<span class="cf-home-title-line cf-home-title-white">'+h(match[1])+'</span>'
   +'<span class="cf-home-title-line cf-home-title-white">'+h(match[2])+' <em class="cf-home-patria">'+h(match[3])+'</em></span>'
   +'<span class="cf-home-title-line cf-home-title-yellow cf-home-title-second">'+h(match[4])+'</span>'
   +'<span class="cf-home-title-line cf-home-title-yellow">'+h(match[5])+'</span>';
}
function headlineAccent(s){
  const title=String(s.title||'');
  if(['camina','camina-intro'].includes(s.section_key)){
    const lines=title.trim().match(/^(Camina)\s+(por\s+Cuba)$/i);
    if(lines)return '<span class="cf-camina-title-line">'+h(lines[1])+'</span><span class="cf-camina-title-line cf-camina-title-color">'+h(lines[2])+'</span>';
  }
  const phrase=String(s.settings?.title_highlight||'').trim();
  if(!phrase)return h(title);
  const loc=title.toLocaleLowerCase('es').lastIndexOf(phrase.toLocaleLowerCase('es'));
  if(loc<0)return h(title);
  return h(title.slice(0,loc))+'<em class="v4-title-mark">'+h(title.slice(loc,loc+phrase.length))+'</em>'+h(title.slice(loc+phrase.length));
}


function cfPurposeSubtitle(s){
 const subtitle=String(s.subtitle||'');
 const fragment='nace en nuestro corazón';
 const index=subtitle.toLocaleLowerCase('es').indexOf(fragment.toLocaleLowerCase('es'));
 if(index<0)return h(subtitle);
 return h(subtitle.slice(0,index))+'<span class="cf-purpose-emphasis">'+h(subtitle.slice(index))+'</span>';
}
function cfInitiativesHeadline(s){
 const title=String(s.title||'');
 if(/^\s*Muchas maneras de aprender y crecer\s*$/i.test(title)){
   return '<span class="cf-init-line">Muchas maneras de</span><span class="cf-init-line cf-init-line--emphasis">aprender y crecer</span>';
 }
 return headlineAccent(s);
}
function cfPurposeHeadline(s){return h(s.title).replace(/\ben\b/i,'<span class="cf-purpose-underline">en</span>');}
function cfWalkSubtitle(s){return String(s.subtitle||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean).map(x=>'<span class="cf-walk-sub-line">'+h(x)+'</span>').join('');}
function cfCaminaIsotipo(){return '<img class="cf-camina-isotipo" src="assets/camina-isotipo-sin-fondo.svg" alt="Isotipo Camina por Cuba sin letras" width="112" height="116" loading="lazy" decoding="async">';}
function eventMeta(s){
  const cfg=s.settings||{};
  const values=[
    String(cfg.date_label||'14 NOV 2026'),
    String(cfg.time_label||'10:00 A. M. · HORA DE CUBA'),
    String(cfg.fee_label||'PARTICIPACIÓN GRATUITA')
  ];
  const icons=[
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18M8 14h3"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2.5"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m12 21-1.6-1.45C4.8 14.5 2 11.9 2 8.7a5 5 0 0 1 9-3.1l1 1.1 1-1.1A5 5 0 0 1 22 8.7c0 3.2-2.8 5.8-8.4 10.85z"/></svg>'
  ];
  return '<div class="section-meta cf-event-meta" role="group" aria-label="Fecha, hora y participación de la iniciativa">'+values.map((v,i)=>'<span class="cf-event-pill cf-event-pill-'+i+'">'+icons[i]+'<strong>'+h(v)+'</strong></span>').join('')+'</div>';
}
function homeRail(s){
 const settings=s.settings||{};
 const eyebrow=settings.rail_eyebrow||'TU MOMENTO DE CONEXIÓN · ACCESO DIRECTO';
 const headline=settings.rail_text||'Una meditación para compartir el presente.';
 const formattedHeadline=headline.trim().startsWith('El sábado 14 de noviembre,')&&headline.includes('todos los cubanos avanzando juntos.')
   ? 'El sábado 14 de noviembre,<br>todos los cubanos avanzando juntos.'
   : h(headline);
 const label=settings.rail_button||'Conocer Camina por Cuba';
 const href='#participar'; // El botón de inscripción abre siempre el formulario «Quiero ser parte».
 return `<div class="v4-live-rail" aria-label="Camina por Cuba"><div class="container v4-live-inner"><div class="v4-live-copy"><span class="v4-live-icon" aria-hidden="true">${window.CF_ASTERISK_SVG}</span><div class="v4-live-text"><small>${h(eyebrow)}</small><h3>${formattedHeadline}</h3></div></div><a class="cf-btn" href="${h(href)}">${h(label)} <span class="btn-arrow">↗</span></a></div></div>`;
}

function walkFeatureVideo(s){
 const cfg=s.settings||{};
 if(String(cfg.walk_video_enabled??'true')==='false')return '';
 const video=cfg.walk_video||{};
 const url=safeUrl(video.url);
 const poster=safeUrl(video.poster);
 const media=url
   ?renderMedia({type:'video',url,poster,position:video.position||'center'},{alt:'Video destacado de Camina por Cuba'})
   :'<div class="walk-feature-placeholder" aria-label="Espacio para el video de Camina por Cuba"><span class="walk-feature-play" aria-hidden="true">▶</span><strong>Camina por Cuba</strong><small>Video de la iniciativa</small></div>';
 return '<div class="walk-feature-media" aria-label="Video destacado de Camina por Cuba">'+media+'</div>';
}

function cfPurposePhotos(s){
 const gallery=s.settings?.manifesto_gallery;
 if(Array.isArray(gallery))return gallery;
 const media=s.media||{};
 return media.url?[{url:media.url,focal_y:media.position==='top'?25:media.position==='bottom'?75:50}]:[];
}
function cfPurposeCarousel(s){
 const photos=cfPurposePhotos(s).filter(p=>safeUrl(p?.url)).slice(0,16);
 if(!photos.length)return renderMedia(s.media,{alt:s.title});
 const delay=Math.min(15,Math.max(2,Number(s.settings?.manifesto_interval)||5));
 const auto=String(s.settings?.manifesto_autoplay??'true')!=='false';
 return '<div class="cf-manifesto-carousel" tabindex="0" role="region" aria-roledescription="carrusel" aria-label="Fotografías del propósito de Cuba Feliz" data-interval="'+delay+'" data-autoplay="'+auto+'">'+
 photos.map((p,i)=>'<img class="cf-manifesto-slide'+(i===0?' is-active':'')+'" src="'+h(safeUrl(p.url))+'" alt="Cuba Feliz, fotografía '+(i+1)+' de '+photos.length+'" loading="'+(i===0?'eager':'lazy')+'" decoding="async" aria-hidden="'+(i===0?'false':'true')+'" style="object-position:center '+Math.min(100,Math.max(0,Number(p.focal_y??50)||0))+'%">').join('')+'</div>';
}
function cfInitPurposeCarousel(){
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 root.querySelectorAll('.cf-manifesto-carousel').forEach(g=>{
  const slides=Array.from(g.querySelectorAll('.cf-manifesto-slide'));if(slides.length<2)return;
  let current=0,timer=null,startX=null,onscreen=false;
  const show=i=>{const next=(i+slides.length)%slides.length;if(next===current)return;slides[current].classList.remove('is-active');slides[current].setAttribute('aria-hidden','true');slides[next].classList.add('is-active');slides[next].setAttribute('aria-hidden','false');current=next;};
  const stop=()=>{if(timer){clearInterval(timer);timer=null;}};
  const start=()=>{if(timer||reduced||!onscreen||g.dataset.autoplay==='false'||document.hidden||g.matches(':hover')||g.contains(document.activeElement))return;const ms=1000*Math.min(15,Math.max(2,Number(g.dataset.interval)||5));timer=setInterval(()=>{if(!root.contains(g)){stop();return;}if(!document.hidden)show(current+1);},ms);};
  g.addEventListener('mouseenter',stop);g.addEventListener('mouseleave',start);
  g.addEventListener('focusin',stop);g.addEventListener('focusout',()=>{if(!g.contains(document.activeElement))start();});
  g.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(current+(e.key==='ArrowRight'?1:-1));}});
  g.addEventListener('touchstart',e=>{startX=e.changedTouches[0]?.screenX??null;stop();},{passive:true});
  g.addEventListener('touchend',e=>{const end=e.changedTouches[0]?.screenX??null;if(startX!=null&&end!=null&&Math.abs(end-startX)>45)show(current+(end<startX?1:-1));startX=null;start();},{passive:true});
  if('IntersectionObserver' in window){const ob=new IntersectionObserver(entries=>entries.forEach(e=>{onscreen=e.isIntersecting;if(onscreen)start();else stop();}),{threshold:.12});ob.observe(g);}
  else{onscreen=true;start();}
 });
}
function cfInitSectionMotion(){
 const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const selectors='.cf-section .headline, .cf-section .quote-inner h2, .cf-section .camina-promo-dale, .cf-section .hero-copy h1, .cf-section .eyebrow';
 if(!reduce&&'IntersectionObserver' in window){
  const elems=Array.from(root.querySelectorAll(selectors)).filter(el=>!el.closest('.reveal, .walk-card, .content-card, .orbit-tile'));
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target);}}),{threshold:.01,rootMargin:'0px 0px 90px 0px'});
  elems.forEach(el=>{el.classList.add('cf-motion-enter');observer.observe(el);});
 }
 const grids=root.querySelectorAll('.section-walk .walk-grid');
 if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.querySelectorAll('img[loading="lazy"]').forEach(img=>{img.loading='eager';img.decoding='async';});io.unobserve(e.target);}}),{rootMargin:'650px 0px 650px 0px',threshold:0});
  grids.forEach(el=>io.observe(el));
 }
}

// Invitación oficial de Conecta. Texto de la plantilla PDF del cliente.
const CF_CONECTA_INVITACION="¡Hola a todos! 🇨🇺\n\nQuiero invitarlos a formar parte de una experiencia única, poderosa y profundamente transformadora. El próximo sábado 14 de noviembre a las 10:00 am nos uniremos en una caminata muy especial llamada Camina por Cuba.\n\nNo es una caminata común para hacer ejercicio; es una meditación activa en movimiento. Basándonos en la idea de un movimiento de cambio global, nos reuniremos con un propósito claro y unificado: sintonizar nuestra mente y corazón para proyectar una Cuba transformada, libre, próspera y abundante.\n\nLa regla de oro de esta caminata es \"caminar como si nuestros deseos ya hubieran sido escuchados\", encarnando con la cabeza en alto, el pecho afuera y pasos firmes esa realidad de abundancia que queremos ver en nuestra patria. Cambiaremos nuestra energía interior para reflejar el futuro que deseamos manifestar.\n\nDetalles del encuentro:\n🗓 Fecha: Sábado, 14 de noviembre de 2026\n⏰ Hora: 10:00 AM\n📍 Lugar: [Insertar parque, playa o sendero aquí]\n🎧 Requisito obligatorio: Descargar meditación andante en www.CubaFeliz.com. Traer tu teléfono celular bien cargado y audífonos/auriculares (estaremos escuchando un audio de meditación de manera sincronizada).\n\nVengan listos para conectar con su fuerza interior, caminar con paso de grandeza y elevar la energía colectiva por el futuro de nuestra tierra. ¡Confírmame si cuento contigo para apartar tu lugar en el grupo!";

// Preguntas y aviso legal entregados por el cliente: contenido completo y accesible.

// Lightbox del mapa de Llega, sin salir del sitio ni perder la posición de lectura.
document.addEventListener('click',function(ev){
 const opener=ev.target.closest('[data-cf-open-map]');
 const closer=ev.target.closest('[data-cf-close-map]');
 const modal=document.getElementById('cfLlegaMapModal');
 if(!modal)return;
 if(opener){ev.preventDefault();if(!modal.open)modal.showModal();}
 if(closer){ev.preventDefault();modal.close();}
 if(ev.target===modal)modal.close();
});

/* Aprende: la fotografía actual sigue como portada. El MP4 no se descarga hasta pulsar Play. */
function cfAprendeVideoPoster(section){
 const src='https://assets.cdn.filesafe.space/3icsVf8NEAhkEMSakJpd/media/6aef5dd631d623e532181a32.mp4';
 const poster=safeUrl(section.settings?.video_poster_url)||safeUrl(section.media?.url)||'';
 return '<button class="cf-aprende-video-trigger" type="button" data-cf-aprende-play aria-label="Reproducir video de Aprende">'
  +(poster?'<img src="'+h(poster)+'" alt="Video de Aprende: Camina por Cuba" loading="lazy" decoding="async">':'')
  +'<span class="cf-aprende-playmark" aria-hidden="true"><span></span></span></button>';
}
document.addEventListener('click',function(event){
 const trigger=event.target.closest('[data-cf-aprende-play]');
 if(!trigger)return;
 event.preventDefault();
 const holder=trigger.parentElement;
 if(!holder)return;
 const video=document.createElement('video');
 video.controls=true;video.playsInline=true;video.autoplay=true;
 video.preload='metadata';
 video.className='cf-aprende-inline-video';
 video.setAttribute('aria-label','Video de Aprende: Camina por Cuba');
 video.src='https://assets.cdn.filesafe.space/3icsVf8NEAhkEMSakJpd/media/6aef5dd631d623e532181a32.mp4';
 holder.replaceChild(video,trigger);
 const played=video.play();
 if(played&&typeof played.catch==='function')played.catch(()=>{});
});

function cfLlegaMeetingPoint(){
const rows=[['8:30 a 9:15 a. m.','Asistencia gratuita de los Coach para descargar o transferir el audio. Llevan camisetas rosadas identificadas con Cuba Feliz y Camina por Cuba.'],['9:30 a. m.','Llegada de participantes con el audio descargado y probado.'],['9:45 a. m.','Ceremonia de apertura.'],['10:00 a. m.','Inicio sincronizado de la meditación andante.'],['11:00 a. m.','Ceremonia de clausura y regalo de gratitud.'],['11:15 a. m.','Celebración gratuita en el parque de La Punta: música, baile y merienda.']];
const items=['Ropa cómoda y calzado adecuado para caminar.','Teléfono o dispositivo propio y audífonos.','Meditación descargada y probada antes de salir.','Dispositivo con suficiente batería y notificaciones en silencio.','Mochila para tus pertenencias y una botella pequeña de agua.'];
const map='https://assets.cdn.filesafe.space/3icsVf8NEAhkEMSakJpd/media/6aecee3231d623e532dbe256.png';
return '<section id="punto-de-encuentro" class="cf-llega-page"><div class="container">'
+'<div class="cf-llega-page__intro"><span class="cf-llega-map-kicker">LLEGA · CAMINA POR CUBA</span><h2>Nos vemos en La Punta, La Habana</h2><p>¡Bienvenidos, bienvenidas y bienvenides a Camina por Cuba en La Punta! Conoce el programa y las indicaciones para el sábado 14 de noviembre de 2026.</p><p>¿Preguntas? <a href="https://wa.me/5363935812" target="_blank" rel="noopener noreferrer">Escríbenos por WhatsApp al +53 63935812 ↗</a></p></div>'
+'<div class="cf-llega-page__map"><div class="cf-llega-map-frame"><button type="button" class="cf-llega-page__map-image-link" data-cf-open-map aria-label="Ampliar mapa oficial de Camina por Cuba"><img class="cf-llega-page__map-image" src="'+h(map)+'" alt="Mapa oficial de Camina por Cuba en La Punta, con entradas desde el Malecón y Paseo del Prado, ceremonias y ruta señalada" loading="lazy" decoding="async"><span class="cf-llega-page__zoom-hint">Ampliar mapa ⤢</span></button><div class="cf-llega-map-caption">Parque La Punta · inicio de Camina por Cuba</div></div><div class="cf-llega-page__map-text"><h3>¿Dónde nos encontramos?</h3><p><strong>Inicio y ceremonias:</strong> zona del Castillo de San Salvador de La Punta, junto al Malecón de La Habana.</p><p><strong>Entradas:</strong> desde el Paseo del Prado o el Malecón, según el mapa de los organizadores.</p><p><strong>Recorrido:</strong> caminaremos por el Malecón en dirección al Cristo de La Habana. Aproximadamente a mitad de la meditación regresaremos, a nuestro ritmo, para terminar cerca del punto de inicio.</p><p>Haz clic en el mapa para ampliarlo y ver las entradas, la zona de ceremonias y el recorrido.</p></div></div><dialog class="cf-llega-map-modal" id="cfLlegaMapModal" aria-label="Mapa ampliado de Camina por Cuba"><div class="cf-llega-map-modal__top"><strong>Mapa oficial · Camina por Cuba</strong><button type="button" data-cf-close-map aria-label="Cerrar mapa">✕</button></div><div class="cf-llega-map-modal__image"><img src="'+h(map)+'" alt="Mapa oficial ampliado del encuentro Camina por Cuba en La Punta, La Habana" decoding="async"></div></dialog>'
+'<div class="cf-llega-page__schedule"><h3>Programa · sábado 14 de noviembre</h3><div class="cf-llega-page__events">'+rows.map(x=>'<article><strong>'+h(x[0])+'</strong><p>'+h(x[1])+'</p></article>').join('')+'</div></div>'
+'<div class="cf-llega-page__bring"><div><h3>¿Qué debes llevar?</h3><ul>'+items.map(x=>'<li>'+h(x)+'</li>').join('')+'</ul></div><aside><h3>Ayuda y accesorios</h3><p>Si necesitas ayuda de los Coach o deseas adquirir accesorios, llega antes de las <strong>9:15 a. m.</strong></p><p>Audífonos: <strong>300 CUP</strong>. Si no puedes pagarlos, el equipo podrá prestarte unos. Tapaojos opcionales: <strong>200 CUP</strong>.</p><p>Los tapaojos se utilizan solo durante las fases de quietud; <strong>retíralos antes de caminar</strong>.</p><p>La ayuda de los Coach y la participación en el encuentro son gratuitas.</p></aside></div>'
+'</div></section>';
}

// Navegación dentro de Aprende sin cambiar el hash de la ruta principal.
document.addEventListener('click',function(event){
 const anchor=event.target.closest('a[href="#preguntas-frecuentes"]');
 if(!anchor||slug!=='camina-aprende')return;
 const target=document.getElementById('preguntas-frecuentes');
 if(!target)return;
 event.preventDefault();event.stopPropagation();
 target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
},true);
function cfAprendeInformation(){
 const items=window.CF_APRENDE_FAQS||[];
 const legal=window.CF_APRENDE_LEGAL||{};
 const ps=parts=>(parts||[]).map(x=>'<p>'+h(x)+'</p>').join('');
 return '<section class="cf-aprende-info" id="preguntas-frecuentes"><div class="container cf-aprende-info__inner">'
  +'<div class="cf-aprende-info__heading"><span class="cf-aprende-info__eyebrow">APRENDE · CAMINA POR CUBA</span><h2>Preguntas frecuentes</h2><p>Encuentra respuestas sobre la meditación, la preparación y cómo participar en Camina por Cuba.</p></div>'
  +'<div class="cf-aprende-info__accordions">'
  +items.map((item,i)=>'<details class="cf-aprende-info__item"><summary><span>'+h(item.question)+'</span><span class="cf-aprende-info__chevron" aria-hidden="true"></span></summary><div class="cf-aprende-info__answer">'+ps(item.paragraphs)+'</div></details>').join('')
  +'</div></div></section>'
  +'<section class="cf-aprende-legal" id="aviso-legal-camina"><div class="container cf-aprende-legal__inner">'
  +'<div><span class="cf-aprende-info__eyebrow">INFORMACIÓN IMPORTANTE</span><h2>Aviso legal y condiciones de participación</h2><p>Antes de participar, lee el aviso legal general y la exención de responsabilidad del evento.</p></div>'
  +'<details class="cf-aprende-legal__details"><summary>Leer aviso legal completo <span aria-hidden="true">+</span></summary>'
  +'<div class="cf-aprende-legal__content"><h3>'+h(legal.title||'Aviso Legal General y Exención de Responsabilidad')+'</h3>'+ps(legal.paragraphs)+'</div></details>'
  +'</div></section>';
}
// El formulario debe abrirse sin abandonar Aprende, Conecta o Llega.
document.addEventListener('click',function(event){
 const anchor=event.target.closest('a[href="#participar"]');
 if(!anchor||!['camina-aprende','camina-conecta','camina-encuentrate','camina-llega'].includes(slug))return;
 event.preventDefault();event.stopPropagation();
 const overlay=document.getElementById('joinOverlay');
 if(overlay&&!overlay.classList.contains('open'))openJoin();
},true);

function cfConectaInvitation(){
 return '<section id="conecta-invitacion" class="cf-conecta-invitation" aria-labelledby="cf-invite-title"><div class="container cf-conecta-invitation__layout">'
  +'<div class="cf-conecta-invitation__intro"><span class="cf-conecta-invitation__eyebrow">CONECTA · CAMINA POR CUBA</span><h2 id="cf-invite-title">Invita a caminar contigo</h2>'
  +'<p>Comparte esta invitación con amigos, familiares o compañeros de trabajo. Puedes formar un grupo en tu barrio, parque o localidad. ¡Incluso dos personas pueden vivir esta experiencia!</p>'
  +'<p class="cf-conecta-invitation__hint">Copia el texto, reemplaza el lugar del encuentro y pégalo en WhatsApp o SMS.</p></div>'
  +'<div class="cf-conecta-invitation__card"><label for="cf-conecta-message">Plantilla de invitación para WhatsApp o SMS</label>'
  +'<textarea id="cf-conecta-message" readonly spellcheck="false" rows="12">'+h(CF_CONECTA_INVITACION)+'</textarea>'
  +'<div class="cf-conecta-invitation__actions"><button type="button" class="cf-conecta-invitation__copy" data-copy-conecta>Copiar invitación <span aria-hidden="true">⧉</span></button>'
  +'<span class="cf-conecta-invitation__status" role="status" aria-live="polite"></span></div></div>'
  +'</div></section>';
}
document.addEventListener('click',async function(event){
 const btn=event.target.closest('[data-copy-conecta]');
 if(!btn)return;
 const area=document.getElementById('cf-conecta-message');
 const status=document.querySelector('.cf-conecta-invitation__status');
 if(!area)return;
 try{
  if(navigator.clipboard?.writeText && window.isSecureContext){await navigator.clipboard.writeText(area.value)}
  else {area.focus();area.select();if(!document.execCommand('copy'))throw new Error('No se pudo copiar')}
  btn.firstChild.textContent='¡Texto copiado! ';
  if(status)status.textContent='Ya puedes pegarlo en WhatsApp o en tus mensajes.';
 }catch(e){area.focus();area.select();if(status)status.textContent='Selecciona el texto y utiliza Copiar en tu dispositivo.'}
});

function secHtml(s,i){if(s.status!=='published'||s.settings?.show_on_page===false)return '';let inner='',b=buttons(s.buttons),ey=`<div class="eyebrow"><span class="ey-dot"></span>${h(s.eyebrow)}</div>`;switch(s.template){
 case 'hero':inner=`<div class="hero-visual">${renderMedia(s.media,{alt:s.title})}${slug==='inicio'&&s.section_key==='home'&&String(s.settings?.home_brand_overlay??'true')!=='false'?'<span class="home-mark" aria-hidden="true"><svg viewBox="0 0 100 100"><path d="M50 12V88M12 50H88M23 23L77 77M77 23L23 77" fill="none" stroke="#f5ca48" stroke-width="7" stroke-linecap="round"/></svg></span>':''}</div><div class="container hero-inner"><div class="hero-copy">${ey}<h1>${slug==='inicio'&&s.section_key==='home'?homeHeadline(s):headlineAccent(s)}</h1>${s.section_key==='camina-intro'?cfCaminaIsotipo():''}<p class="hero-sub">${s.section_key==='camina-intro'?cfWalkSubtitle(s):h(s.subtitle)}</p><p class="hero-description">${h(s.body)}</p>${s.settings?.shared_event_from?`${eventMeta(s)}`:''}${b}</div></div>`;break;
 case 'manifesto':inner=`<div class="container split-grid"><div class="visual-photo reveal">${slug==='inicio'&&s.section_key==='proposito'?cfPurposeCarousel(s):renderMedia(s.media,{alt:s.title})}${slug==='inicio'&&s.section_key==='proposito'?'':'<div class="visual-label">TODO COMIENZA CONMIGO</div>'}</div><div class="reveal">${ey}<h2 class="headline">${slug==='inicio'&&s.section_key==='proposito'?cfPurposeHeadline(s):headlineAccent(s)}</h2><p class="accent-line">${slug==='inicio'&&s.section_key==='proposito'?cfPurposeSubtitle(s):h(s.subtitle)}</p><p class="copy text-wide">${h(s.body)}</p>${b}</div></div>`;break;
 case 'walk':inner=`<div class="container">${ey}<div class="walk-heading"><div class="walk-intro"><div class="cf-camina-title-wrap"><h2 class="headline">${headlineAccent(s)}</h2>${s.section_key==='camina'?cfCaminaIsotipo():''}</div><p class="accent-line">${cfWalkSubtitle(s)}</p>${eventMeta(s)}</div><div class="walk-right-column">${slug==='inicio'&&s.section_key==='camina'?walkFeatureVideo(s):''}<p class="copy">${h(s.body)}</p></div></div>${stepList(s)}${s.settings?.timezone_url?`<p class="footnote">Encuentro sincronizado. <a target="_blank" rel="noopener" href="${h(safeUrl(s.settings.timezone_url))}">Consultar conversor de zonas horarias \u2197</a></p>`:''}${s.section_key==='camina'?'<div class="cf-walk-main-cta">'+buttons((s.buttons||[]).slice(0,1).map(btn=>({...btn,style:'secondary'})))+'</div>':b}</div>`;break;
 case 'cards':inner=`<div class="container">${ey}<div class="intro-center"><h2 class="headline">${s.section_key==='iniciativas'?cfInitiativesHeadline(s):headlineAccent(s)}</h2>${s.subtitle?`<p class="accent-line">${h(s.subtitle)}</p>`:''}<p class="copy">${h(s.body)}</p></div>${s.settings?.gallery_style==='orbit'?orbitGallery(s):cards(s)}${b}</div>`;break;
 case 'quote':inner=`<div class="container quote-inner">${ey}<h2>\u00ab${h(s.title)}\u00bb</h2><div class="quote-flower">${window.CF_ASTERISK_SVG}</div></div>`;break;
 case 'split':inner=`<div class="container split-grid"><div class="visual-photo reveal">${slug==='camina-aprende'&&s.section_key==='camina-detalle'?cfAprendeVideoPoster(s):renderMedia(s.media,{alt:s.title})}</div><div class="reveal">${ey}<h2 class="headline">${headlineAccent(s)}</h2>${s.subtitle?`<p class="accent-line">${h(s.subtitle)}</p>`:''}<p class="copy">${h(s.body)}</p>${(slug==='camina-aprende'&&s.section_key==='camina-detalle')?buttons([{label:'Conoce más',href:'#preguntas-frecuentes',style:'secondary'}]):(['camina-conecta','camina-encuentrate','camina-llega'].includes(slug)&&s.section_key==='camina-detalle')?buttons([{label:'Inscríbete a Camina por Cuba',href:'#participar',style:'secondary'}]):b}</div></div>`;break;
 case 'cta':{
  const donationCard=(s.items||[])[0];
  const hasGotas=!!donationCard;
  const values=(Array.isArray(s.settings?.donation_amounts)?s.settings.donation_amounts:String(s.settings?.donation_amounts||'1,3,5').split(','))
    .map(v=>Number(v)).filter(v=>Number.isFinite(v)&&v>0&&v<=100000).slice(0,5);
  const amounts=[...new Set(values.length?values:[1,3,5])];
  const selected=amounts.includes(3)?3:amounts[0];
  const choices=amounts.map(v=>`<button class="cta-gota-option ${v===selected?'selected':''}" data-gota-value="${v}" aria-pressed="${v===selected?'true':'false'}" type="button">$${h(v)}</button>`).join('');
  const firstBtn=donationCard?.buttons?.[0];
  const goLabel=firstBtn?.label||'Quiero aportar';
  inner=`<div class="container cta-inner ${hasGotas?'cta-split':''}"><div class="cta-main reveal">${ey}<h2 class="headline">${headlineAccent(s)}</h2><p class="copy">${h(s.body)}</p>${b}</div>${hasGotas?`<aside class="cta-gotas-card reveal" aria-label="Gotas de Felicidad"><div class="cta-gotas-mark" aria-hidden="true">${window.CF_ASTERISK_SVG}</div><span class="cta-gotas-kicker">GOTAS DE FELICIDAD</span><h3>${h(donationCard.title||'Deja una Gota de Felicidad')}</h3><p>${h(donationCard.body||'Tu presencia ya es una contribución.')}</p><div class="cta-gotas-caption">ELIGE UN APORTE VOLUNTARIO · USD</div><div class="cta-gotas-amounts">${choices}<button class="cta-gota-option" type="button" data-gota-value="other" aria-pressed="false">Otro</button></div><label class="cta-gota-custom" hidden>Otro valor en USD<input type="number" min="1" step="0.01" inputmode="decimal" placeholder="Cantidad"></label><button class="cta-gota-go" data-gota-go="${h(firstBtn?.href||'gotas-de-felicidad.html')}" type="button">${h(goLabel)}<span aria-hidden="true">↗</span></button><p class="cta-gotas-disclaimer">La contribución es opcional. El pago en línea todavía no está habilitado.</p></aside>`:'<div class="cta-star">${window.CF_ASTERISK_SVG}</div>'}</div>`;
  break;
 }
 case 'donations':{const values=(Array.isArray(s.settings?.donation_amounts)?s.settings.donation_amounts:String(s.settings?.donation_amounts||'1,3,5').split(',')).map(Number).filter(v=>Number.isFinite(v)&&v>0&&v<100000).slice(0,5);const choices=[...new Set(values.length?values:[1,3,5])];const selected=choices.includes(3)?3:choices[0];inner=`<div class="container donation-layout"><div>${ey}<h2 class="headline">${headlineAccent(s)}</h2><p class="copy">${h(s.body)}</p></div><div class="donate-widget"><h3>Elige tu Gota</h3><p>Aporte voluntario \u00b7 USD</p><div class="amounts">${choices.map(v=>`<button type="button" data-amount="${v}" class="${v===selected?'selected':''}">$${v}</button>`).join('')}<button type="button" data-amount="other">Otro</button></div><label class="custom-amount" hidden>Cantidad en USD <input id="customDonation" type="number" min="1" step="0.01" placeholder="Cantidad"></label><button id="donateButton" class="cf-btn primary" type="button"><span>${h(s.buttons?.[0]?.label||'Quiero aportar')}</span><span class="btn-arrow">\u2197</span></button><div class="notice" id="donationNotice">La donaci\u00f3n requiere conectar el checkout real. Ning\u00fan cobro se realiza en esta demostraci\u00f3n.</div></div></div>`;break;}
 case 'faq':inner=`<div class="container">${ey}<h2 class="headline">${headlineAccent(s)}</h2>${(s.items||[]).map(c=>`<details class="faq-row"><summary>${h(c.title)}</summary><p>${h(c.body)}</p></details>`).join('')}</div>`;break;
 case 'content':
  if(s.section_key==='camina-banner'){
   const headline=String(s.title||'Una meditación andante, todos los cubanos, por todo el mundo.');
   const lines=headline.replace(/,\s+/g,',\n').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
   const logo=safeUrl(s.media?.url||'');
   const date=String(s.settings?.date_label||'14 NOV 2026');
   const time=String(s.settings?.time_label||'10:00 AM HORA DE CUBA');
   const callToAction=buttons((s.buttons||[]).length?s.buttons:[{label:'Quiero ser parte',href:'#participar',style:'primary'}]);
   inner='<div class="container camina-promo-grid">'
    +'<div class="camina-promo-logo">'+(logo?'<img src="'+h(logo)+'" alt="Camina por Cuba" loading="eager" decoding="async">':'')+'</div>'
    +'<div class="camina-promo-copy">'
     +'<div class="camina-promo-dateblock"><span class="camina-promo-date">'+h(date)+'</span><span class="camina-promo-time">'+h(time)+'</span></div>'
     +'<h2 class="camina-promo-title">'+lines.map((line,i)=>'<span class="camina-promo-line'+(i===0?'':' yellow')+'">'+h(line)+'</span>').join('')+'</h2>'
     +'<p class="camina-promo-dale">'+h(s.subtitle||'¡Dale!')+'</p>'
     +'<div class="camina-promo-actions">'+callToAction+'</div>'
    +'</div>'
   +'</div>';
  }else{inner=`<div class="container content-shell">${ey}<h2 class="headline">${headlineAccent(s)}</h2>${s.subtitle?`<p class="accent-line">${h(s.subtitle)}</p>`:''}<p class="copy">${h(s.body)}</p>${b}${s.items?.length?cards(s):''}</div>`}
  break;
 default:inner=`<div class="container content-shell">${ey}<h2 class="headline">${headlineAccent(s)}</h2>${s.subtitle?`<p class="accent-line">${h(s.subtitle)}</p>`:''}<p class="copy">${h(s.body)}</p>${b}${s.items?.length?cards(s):''}</div>`;
 }const theme=['cream','white','purple','dark'].includes(s.settings?.theme)?s.settings.theme:'auto';const hh=Math.max(650,Math.min(1050,Number(s.settings?.home_hero_height)||830));const fy=Math.max(0,Math.min(100,Number(s.settings?.home_photo_focus??43)));const op=Math.max(0,Math.min(.45,Number(s.settings?.home_asterisk_opacity??.18)));const sty=slug==='inicio'&&s.section_key==='home'?' style="--home-height:'+hh+'px;--home-photo-y:'+fy+'%;--home-mark-opacity:'+op+'"':'';return `<section id="${slug==='inicio'&&s.section_key==='camina'?'camina-tarjetas':id(s.section_key||'seccion-'+i)}" class="cf-section ${s.section_key==='camina-banner'?(slug==='inicio'?'camina-promo-section ':('camina-promo-section camina-promo-inner '+(['camina-aprende','camina-conecta','camina-encuentrate','camina-llega'].includes(slug)?'cf-camina-compact-banner ':''))):''}${slug==='inicio'&&s.template==='hero'?'v4-home-hero':''} ${slug==='camina-aprende'&&s.section_key==='camina-detalle'?'cf-aprende-video-section':''} section-${h(s.template)} ${s.template==='cta'&&(s.items||[]).length?'has-donation-card':''} ${i%2?'alt':''} ${theme!=='auto'?'cf-theme-'+theme:''}"${sty}>${inner}</section>`}
function render(page,sections){const detailTitle=sections.find(s=>s.section_key==='camina-detalle')?.title;if(detailTitle)page={...page,title:detailTitle};const customLinks=appPages.filter(p=>p.show_in_nav&& !['inicio','camina-por-cuba'].includes(p.slug)).map(p=>`<a href="${['iniciativas','gotas-de-felicidad','casa-luz','pletora'].includes(p.slug)?p.slug+'.html':'pagina.html?slug='+encodeURIComponent(p.slug)}">${h(p.title)}</a>`).join('');document.title=page.title+' | Cuba Feliz';const isHome=slug==='inicio';const promoIndex=sections.findIndex(s=>s.section_key==='camina-banner');const homeSection=sections.find(s=>s.section_key==='home');const bannerVisible=isHome&&homeSection?.status==='published'&&homeSection?.settings?.show_on_page!==false;root.innerHTML=`${bannerVisible?`<div class="v4-topline">${h(sections.find(s=>s.section_key==='home')?.settings?.banner_text||'La felicidad también se construye entre todos')}</div>`:''}<header class="site-header"><div class="nav-shell container"><a class="wordmark" href="index.html" aria-label="Cuba Feliz inicio">${window.CF_LOGO_HTML()}</a><nav class="desktop-nav" aria-label="Principal"><a href="index.html">Inicio</a><a href="index.html#proposito">El movimiento</a><a href="#pagina/inicio/camina-banner">Camina por Cuba</a>${customLinks}</nav><div class="nav-actions"><a class="cf-btn primary small" href="#participar">Quiero ser parte <span class="btn-arrow">\u2197</span></a><a class="portal-link" href="#portal">Ingresar al portal</a><button class="menu-toggle" aria-label="Abrir men\u00fa" aria-expanded="false" id="menuToggle">\u2630</button></div></div><div class="mobile-nav" id="mobileNav"><a href="index.html">Inicio</a><a href="index.html#proposito">El movimiento</a><a href="#pagina/inicio/camina-banner">Camina por Cuba</a>${customLinks}<a href="gotas-de-felicidad.html">Gotas de Felicidad</a><a href="#participar">Quiero ser parte</a><a class="mobile-portal" href="#portal">Ingresar al portal</a></div></header><main>${!isHome?`<div class="page-breadcrumb container"><a href="index.html">Cuba Feliz</a><span>/</span><span>${h(page.title)}</span></div>`:''}${sections.map((s,i)=>secHtml(s,promoIndex>=0&&i>promoIndex?i-1:i)+(slug==='camina-conecta'&&s.section_key==='camina-detalle'?cfConectaInvitation():'')+(slug==='camina-aprende'&&s.section_key==='camina-detalle'?cfAprendeInformation():'')+(['camina-encuentrate','camina-llega'].includes(slug)&&s.section_key==='camina-detalle'?cfLlegaMeetingPoint():'')+(isHome&&s.section_key==='home'&&s.status==='published'&&s.settings?.show_on_page!==false?homeRail(s):'')).join('')}</main>${cfCaminaJourneyNav(slug)}<footer class="site-footer"><div class="container footer-grid"><div><a class="wordmark on-dark" href="index.html">${window.CF_LOGO_HTML()}</a><p>Nos conmueve el amor profundo a nuestra patria y nos unimos para impulsar su transformaci\u00f3n.</p></div><div><h4>El movimiento</h4><a href="#pagina/inicio/camina-banner">Camina por Cuba</a><a href="casa-luz.html">Casa Luz</a><a href="pletora.html">Pl\u00e9tora</a><a href="gotas-de-felicidad.html">Gotas de Felicidad</a></div><div><h4>Participa</h4><a href="#participar">Quiero ser parte</a><a href="iniciativas.html">Otras iniciativas</a><a href="#portal">Ingresar al portal</a></div></div><div class="container footer-bottom">CUBA FELIZ \u00b7 2026 <span>TODO COMIENZA CONMIGO</span> <span>Una iniciativa de Club Luz Inc. · 501(c)(3)</span> <span><a href="privacidad.html">Privacidad</a> · <a href="terminos.html">Términos</a></span></div></footer><div class="overlay" id="joinOverlay" aria-hidden="true"><div class="dialog" role="dialog" aria-modal="true" aria-labelledby="joinTitle"><button class="modal-close" id="closeJoin" aria-label="Cerrar">×</button><div class="eyebrow">QUIERO SER PARTE</div><h2 id="joinTitle">Tu deseo marca la diferencia.</h2><p>El deseo es el motor que transforma intención en acción, y así de fácil comenzamos juntos el rumbo hacia una ¡Cuba Feliz!</p><form id="joinForm"><label>Tu nombre <input required name="full_name" maxlength="120" placeholder="Nombre completo"></label><div class="join-country-field" id="joinCountryField"><label for="joinCountrySearch">¿Dónde vives?</label><input type="search" required id="joinCountrySearch" placeholder="Busca tu país o territorio" role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded="false" aria-controls="joinCountryResults" autocomplete="off"><input type="hidden" name="country" value=""><div id="joinCountryResults" class="country-results" role="listbox" hidden></div></div><label id="joinEmail">Correo electrónico *<input name="email" type="email" required maxlength="160" autocomplete="email" placeholder="tu@correo.com"></label><label id="joinPhone">Tu celular con prefijo *<input name="phone" type="tel" required maxlength="30" autocomplete="tel" placeholder="+53 ..."></label><fieldset class="join-interests"><legend>¿Qué deseas? *</legend><details class="join-interests-dropdown"><summary style="cursor:pointer;padding:14px 16px;border:1px solid #cbb8dc;border-radius:10px;background:#fff;color:#38204b;font-weight:600">Selecciona las opciones que te interesan ▾</summary><div class="join-options" style="padding:12px 8px"><label class="join-option"><input type="checkbox" name="interests" value="meditacion">Descarga Meditación: Camina por Cuba 14 Nov 26</label><label class="join-option"><input type="checkbox" name="interests" value="aprender">Unirme para «Aprender Cómo»</label><label class="join-option"><input type="checkbox" name="interests" value="eligiendo">Matricular en Eligiendo Milagros 26–28 Feb 27</label><label class="join-option"><input type="checkbox" name="interests" value="voluntariado">Colaborar o ser Voluntario</label><label class="join-option"><input type="checkbox" name="interests" value="newsletter">Inscribirme al Newsletter mensual «Todo Empieza Conmigo»</label><label class="join-option"><input type="checkbox" name="interests" value="aportar">Aportar a una ¡Cuba Feliz!</label></div></details><p class="join-help">Abre el menú para elegir una o varias opciones. Tus preferencias se registrarán con tu solicitud.</p></fieldset><label class="join-consent" style="display:flex;gap:10px;align-items:flex-start;margin:4px 0 14px;font-size:13px;line-height:1.45;font-weight:400;text-align:left"><input type="checkbox" name="consent" value="1" style="flex:none;width:18px;height:18px;margin:2px 0 0;accent-color:#34a99b"><span>Acepto recibir mensajes de ¡Cuba Feliz! por correo electrónico, WhatsApp y mensajes de texto (SMS) con información de Camina por Cuba, nuestras iniciativas y novedades. La frecuencia varía. Pueden aplicarse tarifas de mensajes y datos. Responde STOP para cancelar o HELP para ayuda. Consulta la <a href="privacidad.html" target="_blank" rel="noopener">Política de privacidad</a> y los <a href="terminos.html" target="_blank" rel="noopener">Términos de mensajes</a>.</span></label><p class="form-message" id="joinMessage" role="status" aria-live="polite"></p><button class="cf-btn primary join-submit" type="submit">¡Dale! <span class="btn-arrow" aria-hidden="true">↗</span></button></form></div></div>`;
 window.CF_NAV_NOTIFY?.(root);setupOrbitGalleries(sections);cfInitPurposeCarousel();cfInitSectionMotion();document.getElementById('menuToggle').onclick=()=>{let x=document.getElementById('mobileNav');let open=x.classList.toggle('open');document.getElementById('menuToggle').setAttribute('aria-expanded',String(open))};document.querySelectorAll('a[href="#participar"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openJoin()}));document.getElementById('closeJoin').onclick=closeJoin;document.getElementById('joinOverlay').onclick=e=>{if(e.target.id==='joinOverlay')closeJoin()};document.addEventListener('keydown',e=>{if(e.key==='Escape')closeJoin()});const f=document.getElementById('joinForm'),c=f.elements.country;
 const sync=()=>{
  const selected=String(c.value||'').trim();
  const cuba=selected.toLocaleLowerCase('es')==='cuba';
  const hasCountry=!!selected;
  const phoneField=document.getElementById('joinPhone');
  const emailField=document.getElementById('joinEmail');
  const showPhone=hasCountry&&cuba;
  const showEmail=hasCountry&&!cuba;
  phoneField.hidden=!showPhone;emailField.hidden=!showEmail;
  f.elements.phone.disabled=!showPhone;f.elements.email.disabled=!showEmail;
  f.elements.phone.required=showPhone;f.elements.email.required=showEmail;
  f.elements.phone.setAttribute('aria-required',String(showPhone));
  f.elements.email.setAttribute('aria-required',String(showEmail));
  if(!showPhone)f.elements.phone.value='';
  if(!showEmail)f.elements.email.value='';
 };
 const countryControl=window.CF_COUNTRIES?.setup(f,sync);
 sync();
 f.onsubmit=async e=>{
   e.preventDefault();
   const m=document.getElementById('joinMessage');
   if(!countryControl?.valid()){m.textContent='Selecciona un país de la lista.';return;}
   const formData=new FormData(f);
   const interests=formData.getAll('interests').map(String);
   if(!interests.length){m.textContent='Selecciona por lo menos una forma de participar.';f.querySelector('.join-interests-dropdown')?.setAttribute('open','');f.querySelector('.join-options input')?.focus();return;}
   const first=interests[0];
   const legacyInterest=first==='voluntariado'?'colaborar':first==='aportar'?'aportar':first==='newsletter'||first==='aprender'?'informacion':'participar';
   const cuba=c.value==='Cuba';
   const submit=f.querySelector('[type="submit"]');
   submit.disabled=true;m.textContent='Enviando...';
   try{
     await publicInsert('cf_leads',{full_name:String(formData.get('full_name')||'').trim(),country:c.value,email:String(formData.get('email')||'').trim(),phone:String(formData.get('phone')||'').trim(),interest:legacyInterest,interests,consent:formData.get('consent')==='1',source:'cuba-feliz-v6'});
     m.textContent='Gracias. Recibimos tu solicitud y las opciones que seleccionaste.';
     f.reset();countryControl?.clear();sync();
     if(interests.includes('meditacion')){closeJoin();openMeditacionPopup();}
   }catch(err){m.textContent='No pudimos registrar tu solicitud. Revisa los campos e inténtalo nuevamente.';}
   finally{submit.disabled=false;}
 };
 
 // Aporte voluntario al cierre: selector visual, sin procesar pagos inexistentes.
 document.querySelectorAll('.cta-gotas-card').forEach(widget=>{
   const options=[...widget.querySelectorAll('.cta-gota-option')];
   const custom=widget.querySelector('.cta-gota-custom');
   const customInput=custom.querySelector('input');
   let selected=options.find(x=>x.classList.contains('selected'))?.dataset.gotaValue||'3';
   options.forEach(option=>option.addEventListener('click',()=>{
     selected=option.dataset.gotaValue;
     options.forEach(b=>{const on=b===option;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on))});
     custom.hidden=selected!=='other';
     if(selected==='other')customInput.focus();
   }));
   widget.querySelector('.cta-gota-go')?.addEventListener('click',()=>{
     const amount=selected==='other'?Number(customInput.value):Number(selected);
     if(!Number.isFinite(amount)||amount<1){customInput.setCustomValidity('Introduce un aporte mínimo de $1.');customInput.reportValidity();return}
     customInput.setCustomValidity('');
     try{sessionStorage.setItem('cf_gota_amount',String(amount))}catch{}
     const destination=widget.querySelector('.cta-gota-go')?.dataset.gotaGo||'gotas-de-felicidad.html';
     const safe=safeUrl(destination)||'gotas-de-felicidad.html';
     const routed=window.CF_routeHref?.(safe)||safe;
     if(location.hash===routed){window.CF_START_SITE('gotas-de-felicidad');}
     else if(routed.startsWith('#'))location.hash=routed;
     else window.location.href=routed;
   });
 });
 const donate=document.querySelector('#donateButton');if(donate){
 let remembered;try{remembered=sessionStorage.getItem('cf_gota_amount');sessionStorage.removeItem('cf_gota_amount')}catch{}
 const amountValue=Number(remembered);
 if(remembered&&Number.isFinite(amountValue)&&amountValue>=1){
   const btn=[...document.querySelectorAll('[data-amount]')].find(x=>Number(x.dataset.amount)===amountValue);
   const target=btn||document.querySelector('[data-amount="other"]');
   if(target){document.querySelectorAll('[data-amount]').forEach(x=>x.classList.remove('selected'));target.classList.add('selected');
     if(!btn){document.querySelector('.custom-amount').hidden=false;document.querySelector('#customDonation').value=String(amountValue)}}
 }
 document.querySelectorAll('[data-amount]').forEach(x=>x.onclick=()=>{document.querySelectorAll('[data-amount]').forEach(b=>b.classList.remove('selected'));x.classList.add('selected');document.querySelector('.custom-amount').hidden=x.dataset.amount!=='other'});donate.onclick=()=>{const amount=document.querySelector('[data-amount].selected')?.dataset.amount;const amt=amount==='other'?Number(document.querySelector('#customDonation').value):Number(amount);document.querySelector('#donationNotice').textContent=amt>0?`Gota de $${amt} USD seleccionada. El enlace de pago todav\u00eda no ha sido configurado; no se ha realizado ning\u00fan cobro.`:'Selecciona un importe v\u00e1lido.'}};
 if('IntersectionObserver'in window){const ob=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');ob.unobserve(e.target)}})},{threshold:.01,rootMargin:'0px 0px 100px 0px'});document.querySelectorAll('.reveal').forEach(el=>ob.observe(el))}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in-view'));
 if(location.hash&&location.hash!=='#participar'){setTimeout(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:'smooth'}),120)}if(location.hash==='#participar')openJoin();
}
function openJoin(){document.getElementById('joinOverlay').classList.add('open');document.getElementById('joinOverlay').setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');document.querySelector('#joinForm input').focus()}
function closeJoin(){document.getElementById('joinOverlay').classList.remove('open');document.getElementById('joinOverlay').setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll')}

// Pop-up «Descarga tu meditación»: se abre tras «¡Dale!» cuando la persona eligió la Meditación.
function openMeditacionPopup(){
  const url='descargar-meditacion.html';
  if(typeof HTMLDialogElement!=='function'){window.location.href=url;return;}
  if(!document.getElementById('cfMedStyle')){
    const s=document.createElement('style');s.id='cfMedStyle';
    s.textContent='.cf-med-modal{border:0;padding:0;width:min(680px,calc(100vw - 24px));height:min(92vh,900px);max-height:none;border-radius:20px;background:#faf8f3;box-shadow:0 24px 60px rgba(33,24,46,.35);overflow:hidden}'
      +'.cf-med-modal::backdrop{background:rgba(33,24,46,.6)}'
      +'.cf-med-modal__bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px 10px 18px;background:#321648;color:#fff;font:700 14px/1.3 "DM Sans",Arial,sans-serif}'
      +'.cf-med-modal__bar a{color:#f5ca48;font-weight:700;font-size:13px}'
      +'.cf-med-modal__close{flex:none;width:36px;height:36px;border:0;border-radius:50%;background:rgba(255,255,255,.14);color:#fff;font-size:22px;line-height:1;cursor:pointer}'
      +'.cf-med-modal__close:hover{background:rgba(255,255,255,.28)}'
      +'.cf-med-modal iframe{display:block;width:100%;height:calc(100% - 56px);border:0;background:#faf8f3}';
    document.head.appendChild(s);
  }
  const d=document.createElement('dialog');d.className='cf-med-modal';d.setAttribute('aria-label','Descarga tu meditación');
  d.innerHTML='<div class="cf-med-modal__bar"><span>¡Gracias por inscribirte! Aquí está tu meditación</span><span style="display:flex;align-items:center;gap:12px"><a href="'+url+'" target="_blank" rel="noopener">Abrir en otra pestaña</a><button type="button" class="cf-med-modal__close" aria-label="Cerrar">×</button></span></div><iframe src="'+url+'" title="Descarga tu meditación"></iframe>';
  document.body.appendChild(d);
  d.querySelector('.cf-med-modal__close').onclick=()=>d.close();
  d.addEventListener('click',e=>{if(e.target===d)d.close();});
  d.addEventListener('close',()=>{d.remove();document.body.classList.remove('no-scroll');},{once:true});
  document.body.classList.add('no-scroll');
  d.showModal();
}

// Las paginas comparten secciones maestras; no se guardan copias independientes.
function resolveSharedSections(available,requested){
 const byId=new Map(available.map(s=>[s.id,s]));
 const itemKey=item=>item?.key||id(item?.title);
 const refItem=item=>{
  if(!item.shared_from_section)return item;
  const source=byId.get(item.shared_from_section);
  return source?{...item,title:source.title,body:source.body,media:source.media}:null;
 };
 return requested.map(original=>{
  const s={...original,settings:{...(original.settings||{})}};
  const content=byId.get(s.settings.shared_fields_from);
  if(s.settings.shared_fields_from&&!content)s.status='draft';
  if(content)for(const field of s.settings.shared_fields||['title','subtitle','body','media'])if(['title','subtitle','body','media','buttons'].includes(field))s[field]=content[field];
  const itemsFrom=byId.get(s.settings.shared_items_from);
  if(s.settings.shared_items_from){if(!itemsFrom)s.status='draft';const allowed=s.settings.shared_item_keys||[];const items=itemsFrom?.items||[];s.items=(allowed.length?items.filter(item=>allowed.includes(itemKey(item))):items).map(refItem).filter(Boolean);}
  else s.items=(original.items||[]).map(refItem).filter(Boolean);
  if(s.settings.shared_card_media_from){
   const source=byId.get(s.settings.shared_card_media_from);
   const card=source?.items?.find(item=>(item.key||id(item.title))===s.settings.shared_card_key);
   if(card){if(card.media?.url)s.media=card.media;if(s.section_key==='camina-detalle'&&card.title)s.title=card.title;}
  }
  const event=byId.get(s.settings.shared_event_from);
  if(s.settings.shared_event_from&&!event)s.status='draft';
  if(event){s.settings.date_label=event.settings?.date_label||'14 NOV 2026';s.settings.time_label=event.settings?.time_label||'10:00 A. M. · HORA DE CUBA';s.settings.fee_label=event.settings?.fee_label||'PARTICIPACIÓN GRATUITA';s.eyebrow='INICIATIVA · ENCUENTRO';}
  const amounts=byId.get(s.settings.shared_amounts_from);
  if(s.settings.shared_amounts_from&&!amounts)s.status='draft';
  if(amounts?.settings?.donation_amounts)s.settings.donation_amounts=amounts.settings.donation_amounts;
  return s;
 });
}
// Reutiliza las páginas publicadas durante la navegación. Una actualización normal
// del navegador o la expiración de la caché vuelve a consultar Supabase.
let publicContentCache=null,publicContentTime=0,publicContentRequest=null;
async function cfPublishedContent(){
  if(publicContentCache&&Date.now()-publicContentTime<60000)return publicContentCache;
  if(publicContentRequest)return publicContentRequest;
  publicContentRequest=Promise.all([
    query('cf_pages','status=eq.published&select=*'),
    query('cf_sections','status=eq.published&order=sort_order.asc&select=*')
  ]).then(([pages,sections])=>{
    publicContentCache={pages,sections};publicContentTime=Date.now();
    return publicContentCache;
  }).finally(()=>{publicContentRequest=null});
  return publicContentRequest;
}
async function boot(){
  const requestedSlug=slug;
  // No borrar la página actual ni mostrar «Cargando» en cada cambio de sección.
  if(!navigator.onLine&&!publicContentCache){
    if(!root.querySelector('.site-header'))root.innerHTML='<div class="error-page"><h1>No hay conexión</h1><p>Conéctate a internet y vuelve a cargar la página.</p><button onclick="location.reload()" class="cf-btn primary">Reintentar</button></div>';
    return;
  }
  try {
    const timeout=ms=>new Promise((_,reject)=>setTimeout(()=>reject(new Error('Tiempo de espera agotado')),ms));
    const request=async()=>{
      const data=await cfPublishedContent();
      const page=data.pages.find(p=>p.slug===requestedSlug)||null;
      if(!page)return {pages:data.pages,page:null,sections:[]};
      window.CF_LOGO_URL=data.sections.find(x=>x.section_key==='home')?.settings?.logo_url||'assets/cuba-feliz-logo-oficial.png';
      return {pages:data.pages,page,sections:resolveSharedSections(data.sections,data.sections.filter(s=>s.page_id===page.id))};
    };
    const latest=await Promise.race([request(),timeout(18000)]);
    if(window.CF_currentSlug()!==slug || window.location.hash==='#portal')return;
    if(!latest.page){root.innerHTML='<div class="error-page"><a href="#pagina/inicio">← Volver al inicio</a><h1>Contenido no publicado</h1><p>Esta página no está disponible por el momento.</p></div>';return;}
    appPages=latest.pages;currentPage=latest.page;appData=latest.sections;
    render(currentPage,latest.sections.filter(s=>s.status==='published'));
  }catch(e){
    console.error('[Cuba Feliz] Error al cargar contenido publicado:',e);
    const message=String(e?.message||'');
    const http=message.match(/(?:HTTP\s*)?(401|403|404|408|429|500|502|503|504)/);
    const problem=/permission denied|42501|403/i.test(message)?'No hay permisos de lectura para el contenido público.':http?'La consulta del contenido devolvió un error HTTP '+http[1]+'.':/tiempo de espera|timeout/i.test(message)?'Supabase tardó demasiado en responder.':'No se pudo conectar con Supabase.';
    root.innerHTML='<div class="error-page"><div class="eyebrow">CUBA FELIZ</div><h1>La página no pudo conectarse</h1><p>'+problem+'</p><p>Intenta de nuevo. Si continúa, el administrador debe revisar el acceso público de Supabase.</p><div class="button-group"><button onclick="location.reload()" class="cf-btn primary">Volver a intentar ↗</button></div></div>';
  }
}
window.CF_START_SITE=async function(nextSlug){slug=nextSlug||'inicio';await boot()};

})();
