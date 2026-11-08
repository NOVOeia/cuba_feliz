
(function(){
 window.CF_ASSETS={"assets/cuba-habana.jpg":"assets/cuba-habana.jpg","assets/casa-luz.png":"assets/casa-luz-photo.jpg"};
 window.CF_SEED=[];
 window.CF_currentSlug=function(){let match=location.hash.match(/^#pagina\/([a-z0-9-]+)/);return match?match[1]:'inicio'};
 const known=new Set(['index','camina-por-cuba','casa-luz','iniciativas','gotas-de-felicidad','biblioteca','experiencias','meditaciones','pagina','admin']);
 window.CF_routeHref=function(h){
   if(!h)return h;
   if(h==='#portal'||h.startsWith('#pagina/'))return h;
   // Casa Luz has its own full page. Do not convert its link to the SPA hash router.
   if(/^casa-luz\.html(?:[?#].*)?$/i.test(h))return h;
   if(h==='admin.html')return '#portal';
   const m=h.match(/^([a-z0-9-]+)\.html(?:\?slug=([a-z0-9-]+))?(?:#([a-z0-9_-]+))?$/i);
   if(!m||!known.has(m[1]))return h;
   if(m[1]==='admin')return '#portal';
   const slug=m[1]==='index'?'inicio':(m[1]==='pagina'?m[2]||'inicio':m[1]);
   return '#pagina/'+slug+(m[3]?'/'+m[3]:'');
 };
 window.CF_rewriteLinks=function(el){if(!el)return;el.querySelectorAll('a[href]').forEach(a=>{const fixed=window.CF_routeHref(a.getAttribute('href'));if(fixed!==a.getAttribute('href')){a.setAttribute('href',fixed);a.removeAttribute('target')}})};
 function parseRoute(){let h=location.hash;if(h==='#portal')return {portal:true};const parts=h.match(/^#pagina\/([a-z0-9-]+)(?:\/([a-z0-9_-]+))?$/);return {portal:false,slug:parts?parts[1]:'inicio',anchor:parts?.[2]||((h==='#participar'||h==='#proposito')?h.slice(1):'')};}
 let previous=''; let routeCounter=0;
 function resetPublicScroll(){
   const el=document.documentElement, old=el.style.scrollBehavior;
   el.style.scrollBehavior='auto';
   window.scrollTo(0,0);
   el.style.scrollBehavior=old;
 }
 async function show(){const token=++routeCounter;const state=parseRoute();if(!state.portal && (state.slug==='pletora'||state.slug==='casa-luz')){window.location.replace(state.slug+'.html'+(state.anchor?'#'+encodeURIComponent(state.anchor):''));return;}let signature=state.portal?'portal':state.slug;
   if(!state.portal&&!state.anchor)resetPublicScroll();
   if(state.portal){document.body.classList.add('portal-mode');document.querySelector('#root').hidden=true;document.querySelector('#app').hidden=false;
     if(previous!=='portal'){window.CF_START_ADMIN();previous='portal';}return;}
   document.body.classList.remove('portal-mode');document.querySelector('#app').hidden=true;document.querySelector('#root').hidden=false;
   if(previous!==signature){previous=signature;await window.CF_START_SITE(state.slug);}
   if(token!==routeCounter)return;
   if(state.anchor==='participar'){document.querySelectorAll('a[href="#participar"]')[0]?.click()}
   else if(state.anchor){setTimeout(()=>document.getElementById(state.anchor)?.scrollIntoView({behavior:'smooth'}),60)}
   else {resetPublicScroll();requestAnimationFrame(()=>{if(token===routeCounter&&parseRoute().slug===state.slug&&!parseRoute().anchor)resetPublicScroll()})}
 }
 document.addEventListener('click',(e)=>{const a=e.target.closest('a[href]');if(!a)return;const href=a.getAttribute('href');let fixed=window.CF_routeHref(href);if(fixed===href)return;e.preventDefault();if(location.hash===fixed)show();else location.hash=fixed;});
 window.addEventListener('hashchange',show);
 window.CF_NAV_NOTIFY=function(node){window.CF_rewriteLinks(node)};
 document.addEventListener('DOMContentLoaded',show);
})();
