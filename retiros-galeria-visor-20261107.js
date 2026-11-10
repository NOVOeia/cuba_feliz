(function(){
'use strict';
const C=window.CFExperience;
if(!C||!['pletora','eligiendo-milagros'].includes(C.slug))return;
const escape=C.esc;
const originalGallery=C.gallery;
const galleryTitle=C.slug==='pletora'?'Plétora':'Eligiendo Milagros';
let photos=[],current=0,previousFocus=null;
function items(){
 const sec=C.sec(C.slug+'-galeria');
 return (Array.isArray(sec.items)?sec.items:[]).map((x,i)=>{
  const url=C.url(x?.media?.url),poster=C.url(x?.media?.poster);
  return {title:String(x.title||'Momento '+(i+1)),url,poster,video:x.media?.type==='video'||/\.(mp4|webm)(?:\?|$)/i.test(url)};
 }).filter(x=>!!x.url);
}
function card(x,i){
 const thumb=x.poster||(x.video?'':x.url);
 const displayTitle=x.video?x.title:'Fotografía '+(i+1)+' de '+galleryTitle;
 return '<button type="button" class="cf-retreat-gallery-card" data-cf-photo="'+i+'" aria-label="Abrir '+escape(displayTitle)+' y recorrer la galería">'
 +'<span class="cf-retreat-gallery-image">'+(thumb?'<img loading="lazy" decoding="async" src="'+escape(thumb)+'" alt="'+escape(displayTitle)+'">':'<span class="cf-retreat-gallery-video-mark">▶ Video</span>')+'</span>'
 +(x.video?'<span class="cf-retreat-gallery-label"><strong>'+escape(x.title)+'</strong><span aria-hidden="true">Ampliar ↗</span></span>':'<span class="cf-retreat-gallery-label"><span aria-hidden="true">Ampliar ↗</span></span>')+'</button>';
}
C.gallery=function(kind){
 if(kind!=='galeria')return originalGallery(kind);
 const found=items();
 if(!found.length)return '<section class="section band-soft cf-retreat-gallery" id="galeria"><div class="shell"><h2>Galería de experiencias</h2><p>Las fotografías se publicarán aquí cuando estén disponibles.</p></div></section>';
 return '<section class="section band-soft cf-retreat-gallery" id="galeria" aria-labelledby="cf-retreat-gallery-title"><div class="shell">'
 +'<div class="cf-retreat-gallery-heading"><div><span class="cf-retreat-gallery-kicker">MOMENTOS PARA RECORDAR · '+escape(galleryTitle)+'</span><h2 id="cf-retreat-gallery-title">Nuestra galería de experiencias</h2><p>Explora las fotografías sin recortes. Selecciona una para ampliarla y recorre las demás con las flechas.</p></div><span class="cf-retreat-photo-count">'+found.length+' '+(found.length===1?'fotografía':'fotografías')+'</span></div>'
 +'<div class="cf-retreat-gallery-grid">'+found.slice(0,12).map(card).join('')+'</div>'
 +(found.length>12?'<button type="button" class="cf-retreat-gallery-all" data-cf-more="12" aria-label="Mostrar doce fotografías más">Mostrar más fotografías · '+Math.min(12,found.length-12)+' siguientes <span aria-hidden="true">↓</span></button>':'<p class="cf-retreat-gallery-bottom">Pulsa cualquier fotografía para ampliar y recorrer todas.</p>')
 +(found.length>12?'<button type="button" class="cf-retreat-gallery-all cf-retreat-gallery-all--viewer" data-cf-photo="0">Abrir visor de las '+found.length+' fotografías <span aria-hidden="true">↗</span></button>':'')
 +'</div></section>';
};
C.lightbox=function(){
 return '<dialog class="cf-retreat-lightbox" id="mediaLightbox" aria-label="Visor de fotografías de '+escape(galleryTitle)+'">'
 +'<div class="cf-retreat-lightbox-toolbar"><span>'+escape(galleryTitle)+' · Galería de experiencias</span><button type="button" class="cf-retreat-lightbox-close" aria-label="Cerrar galería" data-cf-gallery-close>✕</button></div>'
 +'<div class="cf-retreat-lightbox-stage"><button type="button" class="cf-retreat-lightbox-arrow cf-retreat-lightbox-prev" data-cf-gallery-prev aria-label="Fotografía anterior">‹</button>'
 +'<div class="cf-retreat-lightbox-media" id="modalMedia" aria-live="polite"></div>'
 +'<button type="button" class="cf-retreat-lightbox-arrow cf-retreat-lightbox-next" data-cf-gallery-next aria-label="Fotografía siguiente">›</button></div>'
 +'<div class="cf-retreat-lightbox-bottom"><div class="cf-retreat-lightbox-caption" id="cfGalleryCaption"></div><span class="cf-retreat-lightbox-counter" id="cfGalleryCounter"></span></div>'
 +'<div class="cf-retreat-lightbox-neighbors" id="cfGalleryNeighbors" aria-label="Fotografías cercanas"></div>'
 +'</dialog>';
};
C.bindGallery=function(){
 const dialog=document.getElementById('mediaLightbox');
 if(!dialog)return;
 const media=dialog.querySelector('#modalMedia'),caption=dialog.querySelector('#cfGalleryCaption'),counter=dialog.querySelector('#cfGalleryCounter'),neighbors=dialog.querySelector('#cfGalleryNeighbors');
 photos=items();
 if(!photos.length)return;
 function show(index){
  current=(index+photos.length)%photos.length;
  const pic=photos[current];
  media.replaceChildren();
  const element=document.createElement(pic.video?'video':'img');
  element.src=pic.url;
  if(pic.video){element.controls=true;element.playsInline=true;element.preload='metadata';if(pic.poster)element.poster=pic.poster;}
  else{element.alt='Fotografía '+(current+1)+' de '+galleryTitle;element.decoding='async';}
  element.className='cf-retreat-lightbox-photo';
  media.appendChild(element);
  caption.textContent=pic.video?pic.title:'';
  counter.textContent=(current+1)+' / '+photos.length;
  const around=[];
  for(let step=-2;step<=2;step++){
   const j=(current+step+photos.length)%photos.length,p=photos[j],thumb=p.poster||(!p.video?p.url:'');
   if(around.some(x=>x.index===j))continue;
   around.push({index:j,photo:p,thumb});
  }
  neighbors.innerHTML=around.map(x=>'<button type="button" class="cf-retreat-lightbox-mini'+(x.index===current?' is-active':'')+'" data-cf-gallery-index="'+x.index+'" aria-label="Ver foto '+(x.index+1)+'" aria-current="'+(x.index===current?'true':'false')+'">'+(x.thumb?'<img loading="lazy" src="'+escape(x.thumb)+'" alt="">':'<span>▶</span>')+'</button>').join('');
 }
 function open(index,trigger){
  previousFocus=trigger||document.activeElement;
  show(index);
  if(!dialog.open)dialog.showModal();
 }
 function close(){if(dialog.open)dialog.close();}
 dialog.addEventListener('close',()=>{media.replaceChildren();if(previousFocus?.isConnected)previousFocus.focus();});
 dialog.addEventListener('click',ev=>{
  const prev=ev.target.closest('[data-cf-gallery-prev]'),next=ev.target.closest('[data-cf-gallery-next]');
  const exit=ev.target.closest('[data-cf-gallery-close]'),thumb=ev.target.closest('[data-cf-gallery-index]');
  if(prev)show(current-1);
  if(next)show(current+1);
  if(exit)close();
  if(thumb)show(Number(thumb.dataset.cfGalleryIndex));
  if(ev.target===dialog)close();
 });
 document.querySelectorAll('[data-cf-photo]').forEach(btn=>btn.addEventListener('click',()=>open(Number(btn.dataset.cfPhoto),btn)));
 const galleryGrid=document.querySelector('.cf-retreat-gallery-grid');
 const more=document.querySelector('[data-cf-more]');
 if(galleryGrid&&more){
   more.addEventListener('click',()=>{
     const current=galleryGrid.querySelectorAll('[data-cf-photo]').length;
     const next=Math.min(current+12,photos.length);
     galleryGrid.insertAdjacentHTML('beforeend',photos.slice(current,next).map(card).join(''));
     galleryGrid.querySelectorAll('[data-cf-photo]').forEach(btn=>{
       if(btn.dataset.viewerBound==='1')return;
       btn.dataset.viewerBound='1';
       btn.addEventListener('click',()=>open(Number(btn.dataset.cfPhoto),btn));
     });
     if(next>=photos.length)more.remove();
     else more.innerHTML='Mostrar más fotografías · '+Math.min(12,photos.length-next)+' siguientes <span aria-hidden="true">↓</span>';
   });
 }

 dialog.addEventListener('keydown',ev=>{
  if(ev.key==='ArrowRight'){ev.preventDefault();show(current+1);}
  if(ev.key==='ArrowLeft'){ev.preventDefault();show(current-1);}
 });
 let startX=null,startY=null;
 dialog.addEventListener('touchstart',ev=>{if(ev.touches.length===1){startX=ev.touches[0].clientX;startY=ev.touches[0].clientY;}},{passive:true});
 dialog.addEventListener('touchend',ev=>{
  if(startX===null||!ev.changedTouches.length)return;
  const dx=ev.changedTouches[0].clientX-startX,dy=ev.changedTouches[0].clientY-startY;
  startX=null;startY=null;
  if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.4)show(current+(dx<0?1:-1));
 },{passive:true});
};
})();