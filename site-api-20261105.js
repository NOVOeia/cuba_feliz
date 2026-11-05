
(function(){
const SUPABASE_URL = 'https://fjhululvenojnvhickln.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GbK3GUex9INr7lnigL05Nw_gaAGppHY';
const BUCKET = 'cuba-feliz-media';

const ROOT = SUPABASE_URL+'/rest/v1/';
const endpoint = SUPABASE_URL;
const SESSION_NAME='cuba-feliz-v5-session';
let session=null;try{session=JSON.parse(sessionStorage.getItem(SESSION_NAME)||'null')}catch{session=null};
const getSession=()=>session;
const saveSession=x=>{session=x; try{if(x)sessionStorage.setItem(SESSION_NAME,JSON.stringify(x));else sessionStorage.removeItem(SESSION_NAME);}catch(e){ /* local file without storage */ }};
async function authLogin(email,password){
 const r=await fetch(SUPABASE_URL+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify({email,password})});
 const data=await r.json();if(!r.ok)throw new Error(data.error_description||data.msg||data.message||'Error de acceso');saveSession({...data,expires_at:Math.floor(Date.now()/1000)+(data.expires_in||3600)});return session;
}
async function authLogout(){if(session?.access_token) await fetch(SUPABASE_URL+'/auth/v1/logout',{method:'POST',headers:apiHeaders(true)}).catch(()=>{});saveSession(null);}
async function ensureSession(){if(!session)return null;const now=Math.floor(Date.now()/1000);if(session.expires_at&&session.expires_at>now+90)return session;if(!session.refresh_token){saveSession(null);return null;}const r=await fetch(SUPABASE_URL+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:session.refresh_token})});if(!r.ok){saveSession(null);return null;}const data=await r.json();saveSession({...data,expires_at:Math.floor(Date.now()/1000)+(data.expires_in||3600)});return session;}
function apiHeaders(auth=false){const headers={apikey:SUPABASE_KEY,'Content-Type':'application/json'};if(auth&&session?.access_token)headers.Authorization='Bearer '+session.access_token;return headers;}
async function query(table,params='',{auth=false}={}){if(auth)await ensureSession();const r=await fetch(ROOT+table+(params?'?'+params:''),{headers:apiHeaders(auth),cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status+' en '+table+': '+(await r.text()).slice(0,1000));return await r.json();}
async function mutate(table,method,body,selector='',{returning=true}={}){await ensureSession();const h=apiHeaders(true);h.Prefer=returning?'return=representation':'return=minimal';const r=await fetch(ROOT+table+(selector?'?'+selector:''),{method,headers:h,body:body==null?undefined:JSON.stringify(body)});if(!r.ok)throw new Error(await r.text());return returning?await r.json():null;}
async function publicInsert(table,body){const r=await fetch(ROOT+table,{method:'POST',headers:{...apiHeaders(false),Prefer:'return=minimal'},body:JSON.stringify(body)});if(!r.ok)throw new Error(await r.text());return true;}
async function uploadMedia(file){await ensureSession();if(!session)throw new Error('Debes iniciar sesi\u00f3n');const allowed=['image/jpeg','image/png','image/webp','image/avif','video/mp4','video/webm','application/pdf'];if(!allowed.includes(file.type))throw new Error('Formato no admitido');if(file.size>50*1024*1024)throw new Error('Archivo demasiado grande (m\u00e1ximo 50 MB)');const ext=(file.name.split('.').pop()||'bin').toLowerCase().replace(/[^a-z0-9]/g,'');const uid=globalThis.crypto?.randomUUID?.()||Array.from(crypto.getRandomValues(new Uint8Array(16)),v=>v.toString(16).padStart(2,'0')).join('');const name=uid+'.'+ext;const r=await fetch(SUPABASE_URL+'/storage/v1/object/'+BUCKET+'/'+name,{method:'POST',headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+session.access_token,'Content-Type':file.type,'x-upsert':'false'},body:file});if(!r.ok)throw new Error(await r.text());return SUPABASE_URL+'/storage/v1/object/public/'+BUCKET+'/'+name;}
function safeUrl(u){const s=String(u||'').trim();if(!s)return '';if(s.startsWith('#')||/^([a-z0-9_-]+\.html)(\?slug=[a-z0-9-]+)?(#[a-z0-9_-]+)?$/i.test(s)||s.startsWith('assets/'))return s;try{const x=new URL(s);return ['https:','http:'].includes(x.protocol)?s:'';}catch{return '';}}
function mediaAttr(x){return String(x??'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll("'",'&#39;');}
function cfVideoDetails(url){
 try{
  const u=new URL(url,location.href);
  const host=u.hostname.toLowerCase().replace(/^www\./,'');
  if(['youtube.com','m.youtube.com','youtube-nocookie.com','youtu.be'].includes(host)){
   const id=host==='youtu.be'?u.pathname.split('/')[1]:u.pathname.match(/^\/(?:embed|shorts|live)\/([A-Za-z0-9_-]+)/)?.[1]||u.searchParams.get('v');
   if(id&&/^[A-Za-z0-9_-]{6,20}$/.test(id))return {kind:'youtube',source:'https://www.youtube-nocookie.com/embed/'+id,defaultPoster:'https://img.youtube.com/vi/'+id+'/hqdefault.jpg'};
  }
  if(['vimeo.com','player.vimeo.com'].includes(host)){
   const id=u.pathname.match(/(?:^|\/)(\d{5,15})(?:$|\/)/)?.[1];
   if(id)return {kind:'vimeo',source:'https://player.vimeo.com/video/'+id,defaultPoster:''};
  }
  if(['https:','http:'].includes(u.protocol))return {kind:'file',source:url,defaultPoster:''};
 }catch(e){}
 return null;
}
function renderMedia(media,opts={}){
 let url=safeUrl(media?.url);if(url&&window.CF_ASSETS?.[url])url=window.CF_ASSETS[url];
 let poster=safeUrl(media?.poster);if(poster&&window.CF_ASSETS?.[poster])poster=window.CF_ASSETS[poster];
 const position=['top','center','bottom'].includes(media?.position)?media.position:'center';
 if(media?.type==='video' && url){
  const info=cfVideoDetails(url);
  if(!info)return '<div class="missing-media">Enlace de video no compatible</div>';
  const image=poster||info.defaultPoster;
  const label=opts.alt||'Video de Cuba Feliz';
  return `<button type="button" class="cf-video-thumb" data-video-kind="${mediaAttr(info.kind)}" data-video-source="${mediaAttr(info.source)}" aria-label="Reproducir video: ${mediaAttr(label)}">${image?`<img class="cf-video-cover" src="${mediaAttr(image)}" alt="" loading="lazy" style="object-position:${position}">`:`<span class="cf-video-spark" aria-hidden="true">${window.CF_ASTERISK_SVG}</span>`}<span class="cf-video-overlay" aria-hidden="true"></span><span class="cf-video-playmark" aria-hidden="true">\u25b6</span><span class="cf-video-caption">REPRODUCIR VIDEO</span></button>`;
 }
 if(!url){
  if(media?.type==='video' && poster)return `<div class="missing-media" style="position:relative"><img src="${mediaAttr(poster)}" alt="${mediaAttr(opts.alt||'Miniatura')}" style="width:100%;height:100%;object-fit:cover;object-position:${position}"><span class="cf-video-caption" style="position:absolute;bottom:10px;left:10px">Video pendiente de conectar</span></div>`;
  return '<div class="missing-media" aria-label="Contenido multimedia pendiente"><span class="line-symbol">'+window.CF_ASTERISK_SVG+'</span><span>Contenido multimedia pendiente</span></div>';
 }
 return `<img src="${mediaAttr(url)}" alt="${mediaAttr(opts.alt||'Imagen de Cuba Feliz')}" loading="lazy" style="object-position:${position}" />`;
}
function openCFVideo(kind,source){
 if(!['youtube','vimeo','file'].includes(kind)||!safeUrl(source))return;
 const d=document.createElement('dialog');d.className='cf-video-dialog';d.setAttribute('aria-label','Reproductor de video');
 const stage=document.createElement('div');stage.className='cf-video-stage';
 const close=document.createElement('button');close.type='button';close.className='cf-video-close';close.setAttribute('aria-label','Cerrar video');close.textContent='\u00d7';
 const player=kind==='file'?document.createElement('video'):document.createElement('iframe');
 if(kind==='file'){player.controls=true;player.autoplay=true;player.playsInline=true;player.preload='metadata';player.src=source;}
 else{const separator=source.includes('?')?'&':'?';player.src=source+separator+'autoplay=1';player.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';player.allowFullscreen=true;player.title='Video Cuba Feliz';}
 stage.appendChild(player);d.appendChild(close);d.appendChild(stage);document.body.appendChild(d);
 const stop=()=>{if(player.tagName==='VIDEO')player.pause();player.removeAttribute('src');player.load?.();d.remove();};
 d.addEventListener('close',stop,{once:true});close.onclick=()=>d.close();
 d.addEventListener('click',e=>{if(e.target===d)d.close()});
 if(typeof d.showModal==='function')d.showModal();else{d.setAttribute('open','');}
}
document.addEventListener('click',event=>{
 const button=event.target.closest?.('.cf-video-thumb');if(!button)return;
 event.preventDefault();openCFVideo(button.dataset.videoKind,button.dataset.videoSource);
});

window.CFAPI={endpoint,getSession,authLogin,authLogout,ensureSession,query,mutate,publicInsert,uploadMedia,safeUrl,renderMedia};
})();
