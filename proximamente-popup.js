/* Cuba Feliz · tarjetas de iniciativas aún en preparación.
   El contenido del modal procede de la tarjeta publicada; no crea páginas nuevas. */
(function(){
  'use strict';
  const KINDS=new Set(['casa-luz','tertulia-de-tribu','rayitos-de-sol']);
  function clean(v){return String(v==null?'':v).replace(/[&<>"']/g,function(x){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]})}
  function safeMedia(value){
    const s=String(value||'').trim();
    if(/^assets\/[A-Za-z0-9_./-]+\.(?:png|jpe?g|webp|avif|gif)$/i.test(s)&&!s.includes('..'))return s;
    try{const u=new URL(s,location.href);if(['http:','https:'].includes(u.protocol))return u.href}catch(e){}
    return '';
  }
  function openUpcoming(button){
    const key=button.dataset.upcomingCard;
    if(!KINDS.has(key))return;
    document.querySelectorAll('dialog.cf-upcoming-modal').forEach(function(previous){previous.close();previous.remove()});
    const title=button.dataset.upcomingTitle||({
      'casa-luz':'Casa Luz',
      'tertulia-de-tribu':'Tertulia de Tribu',
      'rayitos-de-sol':'Rayitos de Sol'
    })[key];
    const originalText=(button.dataset.upcomingDescription||'').trim();
    const hasDetails=originalText && !/contenido pendiente de completar|contenido en construcción/i.test(originalText);
    const description=hasDetails ? originalText : 'Estamos preparando este espacio para compartir próximamente más información sobre esta iniciativa.';
    const picture=safeMedia(button.dataset.upcomingImage);
    const popup=document.createElement('dialog');
    popup.className='cf-upcoming-modal';
    popup.setAttribute('aria-labelledby','cf-upcoming-heading');
    popup.setAttribute('aria-describedby','cf-upcoming-description');
    popup.innerHTML='<div class="cf-upcoming-inner">'+
      '<button class="cf-upcoming-close" type="button" aria-label="Cerrar ventana">×</button>'+
      (picture?'<div class="cf-upcoming-photo"><img src="'+clean(picture)+'" alt="Imagen de '+clean(title)+'" loading="eager"></div>':
      '<div class="cf-upcoming-photo cf-upcoming-photo--empty" aria-hidden="true"><span>✳</span></div>')+
      '<div class="cf-upcoming-content"><span class="cf-upcoming-eyebrow">UNA INICIATIVA DE ¡CUBA FELIZ!</span>'+
      '<h2 id="cf-upcoming-heading">'+clean(title)+'</h2>'+
      '<div class="cf-upcoming-status"><span class="cf-upcoming-status-dot" aria-hidden="true"></span> Próximamente</div>'+
      '<p id="cf-upcoming-description" class="cf-upcoming-description">'+clean(description)+'</p>'+
      '<p class="cf-upcoming-note">Esta sección está en construcción. Muy pronto podrás conocer más.</p>'+
      '<button class="cf-upcoming-ok" type="button">Entendido, volver a las iniciativas <span aria-hidden="true">↗</span></button>'+
      '</div></div>';
    document.body.appendChild(popup);
    const close=function(){popup.close()};
    popup.querySelector('.cf-upcoming-close').addEventListener('click',close);
    popup.querySelector('.cf-upcoming-ok').addEventListener('click',close);
    popup.addEventListener('click',function(ev){if(ev.target===popup)close()});
    popup.addEventListener('close',function(){popup.remove()},{once:true});
    if(typeof popup.showModal==='function')popup.showModal();else popup.setAttribute('open','');
  }
  document.addEventListener('click',function(event){
    const el=event.target&&event.target.closest?event.target.closest('button[data-upcoming-card]'):null;
    if(!el)return;
    event.preventDefault();
    openUpcoming(el);
  });
})();