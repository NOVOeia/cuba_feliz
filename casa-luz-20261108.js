(function(){
'use strict';
const $=selector=>document.querySelector(selector),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const categories=[['todos','Todas las fotos'],['estanque','Estanque y cascada'],['muros','Muros y estructura'],['instalaciones','Instalaciones'],['transformacion','Transformación'],['equipo','Personas y equipo'],['otros','Otros avances']];
let gallery={items:[],index:0,kind:'photo',trigger:null},data={renders:[],photos:[],videos:[],plans:[]},currentFilter='todos',visibleCount=6;
function tile(x,i,kind){
 const name=x.title.replace(/^Const\.?\s*/i,'').replace(/^Cont\.?\s*/i,'').replace(/\.jpe?g$/i,'');
 return '<button type="button" class="cl-media-card" data-view="'+kind+'" data-index="'+i+'" aria-label="Ampliar '+esc(name)+'"><span class="cl-media-picture"><img src="'+esc(x.url)+'" alt="'+esc(name)+'" loading="lazy" decoding="async"></span><span class="cl-media-card-meta"><span>'+esc(name)+'</span><span class="cl-open">Ampliar ↗</span></span></button>';
}
function renderArchitect(){
 $('#cl-render-count').textContent=data.renders.length+' vistas';
 $('#cl-render-grid').innerHTML=data.renders.map((x,i)=>tile(x,i,'render')).join('');
 $('#cl-plans').innerHTML=data.plans.map((x,i)=>'<button type="button" data-view="plan" data-index="'+i+'" class="cl-plan-card" aria-label="Abrir '+esc(x.title)+'"><span><span class="cl-file-symbol" aria-hidden="true">▤</span> '+esc(x.title.toUpperCase())+'</span><span aria-hidden="true">↗</span></button>').join('');
}
function group(){return currentFilter==='todos'?data.photos:data.photos.filter(x=>x.group===currentFilter)}
function renderPhotos(){
 const subset=group(),list=subset.slice(0,visibleCount);
 $('#cl-photo-grid').innerHTML=list.length?list.map((x,i)=>tile(x,i,'photo')).join(''):'<p class="cl-loading">No hay fotografías en esta categoría.</p>';
 $('#cl-photo-showing').textContent='Mostrando '+list.length+' de '+subset.length+' fotografías';
 const more=$('#cl-more-photos');more.hidden=list.length>=subset.length;
}
function renderFilters(){
 $('#cl-photo-filters').innerHTML=categories.map(([value,label])=>'<button class="cl-filter" type="button" data-photo-filter="'+value+'" aria-pressed="'+(value===currentFilter)+'">'+esc(label)+'</button>').join('');
}
function renderVideos(){
 $('#cl-video-grid').innerHTML=data.videos.map((x,i)=>'<article class="cl-video-card"><div class="cl-video-stage" id="cl-video-stage-'+i+'"><button class="cl-video-play" type="button" data-video="'+i+'" aria-label="Ver video: '+esc(x.title)+'">▶</button></div><h4>'+esc(x.title)+'</h4><a href="'+esc(x.link)+'" target="_blank" rel="noopener noreferrer">Abrir en Google Drive ↗</a></article>').join('');
}
function lightboxItems(kind){return kind==='render'?data.renders:kind==='plan'?data.plans:group()}
function showItem(index){
 const item=gallery.items[(index+gallery.items.length)%gallery.items.length];if(!item)return;
 gallery.index=(index+gallery.items.length)%gallery.items.length;
 const body=$('#cl-modal-content');body.replaceChildren();
 if(gallery.kind==='plan'){
  const iframe=document.createElement('iframe');iframe.title='Plano arquitectónico '+item.title;iframe.src=item.url+'#toolbar=1&navpanes=0';iframe.loading='lazy';body.appendChild(iframe);
 }else{
  const img=document.createElement('img');img.src=item.url;img.alt=item.title;img.decoding='async';body.appendChild(img);
 }
 $('#cl-modal-title').textContent=item.title;
 $('#cl-modal-kind').textContent=gallery.kind==='render'?'CASA LUZ · RENDER CONCEPTUAL':gallery.kind==='plan'?'CASA LUZ · PLANOS':'CASA LUZ · REGISTRO DE OBRA';
 $('#cl-modal-count').textContent=(gallery.index+1)+' / '+gallery.items.length;
 const single=gallery.items.length<2;$('#cl-modal-next').disabled=single;$('#cl-modal-prev').disabled=single;
}
function openViewer(kind,index,trigger){
 gallery={kind,items:lightboxItems(kind),index,trigger};if(!gallery.items.length)return;
 showItem(index);const dialog=$('#cl-lightbox');if(!dialog.open)dialog.showModal();
}
function next(step){if(gallery.items.length)showItem(gallery.index+step)}
function bind(){
 document.addEventListener('click',event=>{
  const card=event.target.closest('[data-view]');
  if(card){openViewer(card.dataset.view,Number(card.dataset.index),card);return}
  const filter=event.target.closest('[data-photo-filter]');
  if(filter){currentFilter=filter.dataset.photoFilter;visibleCount=6;renderFilters();renderPhotos();return}
  if(event.target.closest('#cl-more-photos')){visibleCount+=6;renderPhotos();return}
  const vid=event.target.closest('[data-video]');
  if(vid){const i=Number(vid.dataset.video),v=data.videos[i],stage=$('#cl-video-stage-'+i);
   if(/\.(mp4|webm)(?:[?#]|$)/i.test(v.url)){const el=document.createElement('video');el.src=v.url;el.controls=true;el.playsInline=true;el.preload='metadata';el.style.width='100%';stage.replaceChildren(el);el.play().catch(()=>{});}else{const frame=document.createElement('iframe');frame.src=v.url;frame.title=v.title;frame.loading='lazy';frame.referrerPolicy='strict-origin-when-cross-origin';frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';frame.setAttribute('allowfullscreen','');stage.replaceChildren(frame)}return}
 });
 const dialog=$('#cl-lightbox');
 $('#cl-modal-close').addEventListener('click',()=>dialog.close());
 $('#cl-modal-prev').addEventListener('click',()=>next(-1));
 $('#cl-modal-next').addEventListener('click',()=>next(1));
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
 dialog.addEventListener('close',()=>{const body=$('#cl-modal-content');body.replaceChildren();gallery.trigger?.focus?.()});
 dialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();next(1)}if(event.key==='ArrowLeft'){event.preventDefault();next(-1)}});
 let touchX=null,touchY=null;
 dialog.addEventListener('touchstart',event=>{if(event.touches.length===1){touchX=event.touches[0].clientX;touchY=event.touches[0].clientY}},{passive:true});
 dialog.addEventListener('touchend',event=>{if(touchX===null||!event.changedTouches.length)return;const dx=event.changedTouches[0].clientX-touchX,dy=event.changedTouches[0].clientY-touchY;touchX=null;touchY=null;if(Math.abs(dx)>52&&Math.abs(dx)>Math.abs(dy)*1.4)next(dx<0?1:-1)},{passive:true});
}
async function init(){
 bind();
 try{
  const res=await fetch('casa-luz-media-20261108.json',{cache:'force-cache'});if(!res.ok)throw new Error('Catálogo no disponible');
  const catalog=await res.json();
  data={renders:catalog.renders||[],photos:catalog.photos||[],videos:catalog.videos||[],plans:catalog.plans||[]};
  try{
   const response=await fetch('https://fjhululvenojnvhickln.supabase.co/rest/v1/cf_media_assets?collection=eq.casa-luz&published=eq.true&select=object_key,public_url,title,file_name,category,content_type,sort_order&order=sort_order.asc',{
    headers:{apikey:'sb_publishable_GbK3GUex9INr7lnigL05Nw_gaAGppHY',Accept:'application/json'},cache:'no-store'
   });
   if(response.ok){
    const assets=await response.json();
    const byKey=new Map(assets.map(x=>[x.object_key,x]));
    const used=new Set();
    for(const group of ['renders','photos','plans']){
     data[group]=data[group].map(item=>{
      const old=String(item.url||'');
      if(!old.startsWith('assets/casa-luz/'))return item;
      const objectKey='casa-luz/archivo/'+old.slice('assets/casa-luz/'.length);
      const asset=byKey.get(objectKey);
      if(!asset)return item;
      used.add(objectKey);
      return {...item,url:asset.public_url};
     });
    }
    for(const asset of assets){
     if(asset.content_type?.startsWith('video/')){if(!data.videos.some(v=>v.url===asset.public_url)){data.videos.push({title:asset.title||asset.file_name||'Video de Casa Luz',url:asset.public_url,link:asset.public_url})}continue;}
     if(used.has(asset.object_key))continue;
     const isPdf=asset.content_type==='application/pdf';
     const isImage=String(asset.content_type||'').startsWith('image/');
     const addition={title:asset.title||asset.file_name||'Archivo',url:asset.public_url,
      type:isPdf?'plan':'photo',group:['estanque','muros','instalaciones','transformacion','equipo','otros'].includes(asset.category)?asset.category:'otros'};
     if(isPdf)data.plans.push(addition);
     else if(isImage)data.photos.push(addition);
    }
   }
  }catch(error){console.warn('Biblioteca R2 no disponible; se mantienen los medios originales',error)}
  renderArchitect();renderFilters();renderPhotos();renderVideos();
 }catch(error){console.error('Casa Luz - catálogo',error);const message='No pudimos cargar la galería. Actualiza la página para volver a intentarlo.';['#cl-render-grid','#cl-photo-grid','#cl-video-grid','#cl-plans'].forEach(selector=>{const area=$(selector);if(area)area.textContent=message})}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();