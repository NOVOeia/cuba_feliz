(function initRainerHonor(){
  "use strict";
  const dialogId="cf-rainer-honor-dialog";
  const collage="assets/rainer-rafael-gomez-arndt-homenaje.svg";
  const css=`
    #root .cf-rainer-honor-link-wrap{display:flex;align-items:center;justify-content:center;margin:14px auto 6px;text-align:center}
    #root .cf-rainer-honor-trigger{appearance:none;border:0;background:transparent;color:#f5ca48;text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px;cursor:pointer;font:600 clamp(14px,1.3vw,17px)/1.4 "DM Sans",sans-serif;letter-spacing:.01em;padding:8px 15px}
    #root .cf-rainer-honor-trigger:hover{color:#fff0b6}
    #root .cf-rainer-honor-trigger:focus-visible{outline:2px solid #f5ca48;outline-offset:3px;border-radius:6px}
    .cf-rainer-dialog{position:fixed;border:0;padding:0;border-radius:22px;width:min(820px,calc(100vw - 26px));max-width:820px;max-height:min(91dvh,1000px);background:#fcfaf6;color:#32213b;box-shadow:0 26px 100px rgba(15,4,28,.4);overflow:hidden}
    .cf-rainer-dialog::backdrop{background:rgba(19,5,37,.78);backdrop-filter:blur(5px)}
    .cf-rainer-dialog__scroll{max-height:min(91dvh,1000px);overflow-y:auto;overscroll-behavior:contain}
    .cf-rainer-dialog__top{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:10px;background:#34184d;color:#f5ca48;padding:12px 15px 12px 24px;min-height:55px}
    .cf-rainer-dialog__eyebrow{font:700 11px/1.4 "DM Sans",sans-serif;letter-spacing:.1em}
    .cf-rainer-dialog__close{appearance:none;border:1px solid rgba(255,255,255,.35);border-radius:50%;width:36px;height:36px;display:grid;place-items:center;background:transparent;color:white;cursor:pointer;font:400 24px/1 Arial,sans-serif}
    .cf-rainer-dialog__close:hover{background:rgba(255,255,255,.13)}
    .cf-rainer-dialog__close:focus-visible{outline:3px solid #f5ca48}
    .cf-rainer-dialog__inner{padding:clamp(18px,4vw,36px)}
    .cf-rainer-dialog__photo{display:block;width:min(100%,600px);height:auto;max-width:100%;margin:0 auto 25px;object-fit:contain;border-radius:9px}
    .cf-rainer-dialog__copy{max-width:675px;margin:0 auto}
    .cf-rainer-dialog__copy h2{font:700 clamp(27px,4vw,38px)/1.12 "Outfit",sans-serif;letter-spacing:-.035em;color:#35154d;text-align:center;margin:0 0 10px}
    .cf-rainer-dialog__subtitle{font:italic 500 clamp(17px,2.5vw,21px)/1.4 Georgia,serif;color:#704c82;text-align:center;margin:0 0 6px}
    .cf-rainer-dialog__dedication{font:700 12px/1.6 "DM Sans",sans-serif;color:#6d5873;text-align:center;margin:0 0 25px}
    .cf-rainer-dialog__copy p{font:400 clamp(14px,1.9vw,16px)/1.78 "DM Sans",sans-serif;color:#413747;margin:0 0 18px}
    .cf-rainer-dialog__copy .cf-rainer-dialog__highlight{font:italic 600 clamp(18px,2.5vw,23px)/1.5 Georgia,serif;color:#633776;text-align:center;padding:16px 3px}
    .cf-rainer-dialog__copy .cf-rainer-dialog__thanks{font-weight:700;text-align:center;color:#3b2051}
    .cf-rainer-dialog__copy .cf-rainer-dialog__footnote{border-top:1px solid #e5dce9;padding-top:15px;font-size:12px;line-height:1.65;color:#756979}
    @media(max-width:600px){.cf-rainer-dialog{border-radius:15px;max-height:93dvh}.cf-rainer-dialog__scroll{max-height:93dvh}.cf-rainer-dialog__top{padding-left:15px}.cf-rainer-dialog__inner{padding:18px}.cf-rainer-dialog__photo{margin-bottom:19px}}
  `;
  if(!document.getElementById("cf-rainer-honor-styles")){
    const style=document.createElement("style");style.id="cf-rainer-honor-styles";style.textContent=css;document.head.appendChild(style);
  }
  function getDialog(){
    let dialog=document.getElementById(dialogId);
    if(dialog)return dialog;
    dialog=document.createElement("dialog");
    dialog.id=dialogId;
    dialog.className="cf-rainer-dialog";
    dialog.setAttribute("aria-labelledby","cf-rainer-dialog-title");
    dialog.setAttribute("aria-describedby","cf-rainer-dialog-subtitle");
    dialog.innerHTML=`
      <div class="cf-rainer-dialog__scroll">
        <div class="cf-rainer-dialog__top">
          <span class="cf-rainer-dialog__eyebrow">EN SU HONOR · CAMINA POR CUBA</span>
          <button class="cf-rainer-dialog__close" type="button" aria-label="Cerrar homenaje">×</button>
        </div>
        <div class="cf-rainer-dialog__inner">
          <img class="cf-rainer-dialog__photo" alt="Collage con fotografías de Rainer Rafael Gómez-Arndt y momentos junto a sus seres queridos" width="1254" height="1254" decoding="async">
          <div class="cf-rainer-dialog__copy">
            <h2 id="cf-rainer-dialog-title">Rainer Rafael Gómez-Arndt</h2>
            <div id="cf-rainer-dialog-subtitle" class="cf-rainer-dialog__subtitle">Una luz que sigue iluminando nuestro camino</div>
            <div class="cf-rainer-dialog__dedication">En su honor, caminamos por Cuba este 14 de noviembre</div>
            <p>Hay seres humanos cuya presencia es un regalo de Dios. Personas que llegan a nuestras vidas para sembrar amor, despertar esperanza y recordarnos que, aun en los momentos más oscuros, siempre existe una luz. Rainer Rafael Gómez-Arndt, un cubano maravilloso, fue uno de esos seres extraordinarios. Generoso, cálido, profundamente amoroso, tenía el don de hacer sentir especiales a quienes lo rodeaban. Su vida estuvo llena de pequeños y grandes gestos de bondad, de palabras de aliento y de una entrega sincera a su familia y sus amigos. Para quienes tuvimos la bendición de conocerlo, Rainer fue verdaderamente un ángel en la Tierra.</p>
            <p>Desde 2016, cuando el sueño de una Cuba Feliz apenas comenzaba a tomar forma, Rainer estuvo presente, ofreciendo su amistad incondicional, su confianza y su aliento. Fue uno de los fundadores de Club Luz* y su primer director, creyendo en una visión de amor, perdón y paz para Cuba mucho antes de verla florecer. Su partida el 14 de noviembre de 2024 dejó un vacío inmenso, pero también un legado que continúa inspirándonos. Por eso hemos elegido el 14 de noviembre para celebrar Camina por Cuba: para transformar el recuerdo de su ausencia en un acto vivo de amor, gratitud y esperanza.</p>
            <p class="cf-rainer-dialog__highlight">Porque hay luces que jamás se apagan. Solo encuentran nuevas maneras de brillar.</p>
            <p class="cf-rainer-dialog__thanks">Gracias, Rainer, por ayudarnos a dar los primeros pasos. Hoy seguimos caminando contigo en el corazón.</p>
            <p class="cf-rainer-dialog__footnote">* Club Luz, Inc. es una organización sin fines de lucro estadounidense, reconocida bajo la sección 501(c)(3), dedicada a iluminar las vidas de los cubanos desde su interior. ¡Cuba Feliz! es el nombre de la iniciativa mediante la cual hacemos realidad esta misión.</p>
          </div>
        </div>
      </div>`;
    document.body.appendChild(dialog);
    dialog.querySelector(".cf-rainer-dialog__close").addEventListener("click",()=>dialog.close());
    dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
    dialog.addEventListener("close",()=>{dialog.querySelector(".cf-rainer-dialog__scroll").scrollTop=0});
    return dialog;
  }
  document.addEventListener("click",event=>{
    const trigger=event.target.closest?.(".cf-rainer-honor-trigger");
    if(!trigger)return;
    event.preventDefault();
    const dialog=getDialog();
    const image=dialog.querySelector(".cf-rainer-dialog__photo");
    if(!image.getAttribute("src"))image.setAttribute("src",collage);
    if(!dialog.open)dialog.showModal();
    dialog.querySelector(".cf-rainer-dialog__scroll").scrollTop=0;
  });
})();
