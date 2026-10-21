
(function(){
"use strict";
const C=window.CFExperience;
if(!C||C.slug!=="meditacion-canonazo-de-las-9")return;
const escape=C.esc;
const icons=["♥","◎","✦","☀"];
const moments=["heart","breath","gratitude","cuba"];
const weights=[.18,.31,.24,.27];
const fallback=[
{title:"CORAZÓN",body:"Cierra los ojos y enfócate en tu corazón. Pon toda tu energía, toda tu conciencia en ese espacio. También puedes poner tus manos ahí, sobre tu corazón. Es aún más energía con esa atención física.",cues:["Cierra los ojos y enfócate en tu corazón.","Pon toda tu energía, toda tu conciencia en ese espacio.","También puedes poner tus manos ahí, sobre tu corazón.","Es aún más energía con esa atención física."]},
{title:"RESPIRACIÓN",body:"Reduce la velocidad de su respiración. Inhala lentamente (y profundamente), más o menos a un paso de 7 segundos y exhala también a un paso de 7 segundos. 7 y 7 (si no puedes llegar a esa lentitud, 4 a 6 segundos está bien). Inhala y exhala despacito e imagina que estas respirando profundamente a través de tu corazón.",cues:["Reduce la velocidad de su respiración.","Inhala lentamente (y profundamente), más o menos a un paso de 7 segundos y exhala también a un paso de 7 segundos.","7 y 7 (si no puedes llegar a esa lentitud, 4 a 6 segundos está bien).","Inhala y exhala despacito e imagina que estas respirando profundamente a través de tu corazón."]},
{title:"GRATITUD",body:"Trae un sentimiento de gratitud. O sea, recuerda tiempos felices en tu vida dónde las personas, situaciones o acontecimientos fueron muy especiales. Usa uno de esos lindos recuerdos para traer el sentimiento de gratitud a tu ser. Deja que ese sentimiento viva en tu cuerpo durante todo este proceso. Sigue enfocada en tu corazón, respirando lentamente a través de ella, con esa gran emoción de gratitud.",cues:["Trae un sentimiento de gratitud.","Recuerda tiempos felices en tu vida dónde las personas, situaciones o acontecimientos fueron muy especiales.","Usa uno de esos lindos recuerdos para traer el sentimiento de gratitud a tu ser.","Deja que ese sentimiento viva en tu cuerpo durante todo este proceso."]},
{title:"CUBA SOMOS ABUNDANCIA",body:"Trae a tu mente tus propias visiones de Cuba en pura Abundancia. Cómo sería la gente, los paisajes, las calles, los mercados, las casas, los edificios, el campo, la cultura, las escuelas, las playas, los animales, los comercios, los barrios, la comida... Cualquier visión de prosperidad que tengas para tu Isla majestuosa.",cues:["Trae a tu mente tus propias visiones de Cuba en pura Abundancia.","Cómo sería la gente, los paisajes, las calles, los mercados, las casas, los edificios, el campo, la cultura, las escuelas, las playas, los animales, los comercios, los barrios, la comida...","Cualquier visión de prosperidad que tengas para tu Isla majestuosa."]}
];
function prepare(){
 const data=C.items("detail-meditacion-canonazo-de-las-9-1");
 C.canonSteps=fallback.map((f,i)=>{
  const original=data[i]||{};
  const title=original.title||f.title;
  const body=original.body||f.body;
  const cues=Array.isArray(original.cues)&&original.cues.length?original.cues.filter(x=>typeof x==="string"&&x.trim()):f.cues;
  return {title,body,cues:cues.length?cues:[body],icon:icons[i]};
 });
}
function stepNav(){
 return '<div class="canon-phase-nav" aria-label="Los cuatro momentos de la meditación">'+C.canonSteps.map((s,i)=>
  '<div class="canon-phase-item" data-phase="'+i+'" data-active="false" data-complete="false"><span class="canon-index">'+(i+1)+'</span><strong>'+escape(s.title)+'</strong></div>'
 ).join("")+'</div>';
}
C.render=function(){
 prepare();
 const settings=C.sec("detail-meditacion-canonazo-de-las-9-1").settings||{};
 const closing=settings.source_closing||"Con la atención en tu Corazón y tu lenta Respiración, estás creando coherencia entre mente y cuerpo, y con tu bella emoción de Gratitud y tu gran visión para Cuba, LE ESTAS MANDANDO UNA POTENTE SEÑAL AL UNIVERSO de que ya toda esta abundancia está en pie. Le estas brindando un renacer a tu patria. ¡Y con todos juntos, hecho esta! Ashé.";
 return '<section class="canon-header"><div class="shell"><div class="canon-kicker">Una experiencia compartida · Todas las noches a las 9 PM</div><h2 class="canon-title">El Cañonazo de la Abundancia</h2><p class="canon-subtitle">Una poderosa meditación de 5 minutos para todo el pueblo cubano. Estés donde estés. Juntos.</p></div></section>'+
 '<section id="canon-meditation" aria-label="Meditación guiada de El Cañonazo de la Abundancia"><span id="experiencia" aria-hidden="true"></span>'+
 '<div class="shell"><div class="canon-toolbar"><div class="canon-duration"><strong>ELIGE TU DURACIÓN</strong><button type="button" data-duration="300" aria-pressed="true">5 minutos</button><button type="button" data-duration="180" aria-pressed="false">3 minutos</button></div><div class="canon-kicker" style="margin:0">Corazón · Respiración · Gratitud · Cuba</div></div>'+
 '<div class="canon-stage" id="canon-stage" data-moment="intro" aria-label="Zona de meditación"><span class="canon-ambient one" aria-hidden="true"></span><span class="canon-ambient two" aria-hidden="true"></span>'+stepNav()+
 '<div class="canon-content"><div class="canon-visual"><div class="canon-orb-outer" aria-hidden="true"><div class="canon-orb-inner" id="canon-orb"><span class="canon-orb-icon" id="canon-orb-icon">♥</span></div></div>'+
 '<div class="canon-breath-guide"><strong id="canon-action-word">Un momento para conectar</strong><span id="canon-action-detail">Con tu corazón y con Cuba</span>'+
 '<div class="canon-breath-visuals" id="canon-breath-options"><div class="canon-breath-options" aria-label="Ritmo de la respiración"><button type="button" data-breath="7" aria-pressed="true">7 y 7</button><button type="button" data-breath="5" aria-pressed="false">5 y 5</button><button type="button" data-breath="0" aria-pressed="false">A tu ritmo</button></div><span>La guía permite 4 a 6 segundos si 7 resulta difícil.</span></div></div></div>'+
 '<div class="canon-copy"><div class="canon-scene-kicker" id="canon-step-label">PREPARA TU MEDITACIÓN</div><h2 class="canon-scene-heading" id="canon-step-title">Todo el pueblo cubano. Juntos.</h2><p class="canon-cue" id="canon-step-cue" aria-live="polite" aria-atomic="true">Una poderosa meditación de cinco minutos. Todas las noches, estés donde estés, a las 9 PM.</p><div class="canon-source-panel" id="canon-source"><div class="label">La guía original · Instrucción completa</div><p id="canon-step-full">Configura el temporizador durante 5 minutos (mínimo 3). Pulsa comenzar cuando estés preparado para recorrer los cuatro momentos.</p></div></div></div>'+
 '<div class="canon-stage-footer"><div class="canon-stage-meta"><div><div class="canon-time-label" id="canon-time-label">TIEMPO DE LA EXPERIENCIA</div><div class="canon-time" id="canon-time">05:00</div></div><div class="canon-control-row"><button class="btn canon-primary" id="canon-toggle" type="button">Comenzar experiencia ▶</button><button class="btn canon-secondary" id="canon-prev" type="button" disabled>← Anterior</button><button class="btn canon-secondary" id="canon-next" type="button" disabled>Siguiente →</button><button class="btn canon-secondary" id="canon-reset" type="button">Reiniciar ↺</button></div></div><div class="canon-track" role="progressbar" id="canon-progress" aria-label="Progreso de la meditación" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="canon-track-progress" id="canon-progress-fill"></div></div></div></div>'+
 '<div class="canon-disclaimer"><span class="canon-note">Los cuatro momentos y todas las instrucciones son los del documento original. Las transiciones visuales distribuyen los cinco minutos, sin modificar la práctica.</span><span id="canon-status">La sesión todavía no ha comenzado.</span></div></div></section>'+
 '<section class="canon-read-guide" id="informacion"><div class="shell"><div class="canon-guide-top"><div class="eyebrow dark">INSTRUCCIONES ORIGINALES</div><h2>Los cuatro momentos, paso a paso.</h2><p>Para leer con calma antes o después de la experiencia. Se incluye el texto completo de cada instrucción del archivo entregado.</p></div><div class="canon-guide-grid">'+C.canonSteps.map((s,i)=>
 '<article class="canon-guide-card"><div class="canon-mini-step">MOMENTO 0'+(i+1)+'</div><h3>'+escape(s.title)+'</h3><p>'+escape(s.body)+'</p></article>'
 ).join("")+'</div></div></section>'+
 '<section class="canon-closing"><div class="shell canon-closing-inner"><div class="eyebrow">MENSAJE FINAL DE LA GUÍA</div><h2>¡Y con todos juntos, hecho esta!</h2><blockquote>'+escape(closing)+'</blockquote><div class="canon-signature">Ashé ✦</div></div></section>'+
 C.cta("Cada noche, estemos donde estemos.","A las 9 PM, una meditación compartida por el pueblo cubano.","#experiencia","Volver a vivir la experiencia");
};
C.initTimer=function(){
 const byId=id=>document.getElementById(id);
 const stage=byId("canon-stage"),orb=byId("canon-orb"),symbol=byId("canon-orb-icon");
 const actionWord=byId("canon-action-word"),actionDetail=byId("canon-action-detail"),title=byId("canon-step-title"),label=byId("canon-step-label");
 const cue=byId("canon-step-cue"),full=byId("canon-step-full"),time=byId("canon-time"),status=byId("canon-status");
 const toggle=byId("canon-toggle"),reset=byId("canon-reset"),prev=byId("canon-prev"),next=byId("canon-next");
 const progress=byId("canon-progress"),fill=byId("canon-progress-fill"),phaseNodes=[...document.querySelectorAll(".canon-phase-item")];
 let total=300,elapsed=0,started=false,running=false,finished=false,lastTick=0,handle=null;
 let activePhase=-1,activeCue=-1,breathSecs=7;
 const starts=[0];
 weights.forEach(w=>starts.push(starts[starts.length-1]+w));
 function format(s){const remaining=Math.max(0,Math.ceil(s));return String(Math.floor(remaining/60)).padStart(2,"0")+":"+String(remaining%60).padStart(2,"0")}
 function stop(){if(handle!==null)clearInterval(handle);handle=null;running=false}
 function indexFor(t){for(let i=0;i<4;i++)if(t<total*starts[i+1])return i;return 3}
 function displayWords(){
  if(!started){actionWord.textContent="Un momento para conectar";actionDetail.textContent="Con tu corazón y con Cuba";orb.dataset.guided="false";orb.style.transform="";return}
  if(finished){actionWord.textContent="Ashé";actionDetail.textContent="¡Y con todos juntos, hecho esta!";orb.dataset.guided="false";orb.style.transform="";return}
  if(activePhase!==1){
    const words=["Corazón","Respiración","Gratitud","Cuba"];
    const details=["Pon toda tu atención en tu corazón.","Inhala y exhala despacito.","Deja que la gratitud viva en tu cuerpo.","Imagina tu Cuba en abundancia."];
    actionWord.textContent=words[activePhase]||"Corazón";
    actionDetail.textContent=details[activePhase]||"";
    orb.dataset.guided="false";orb.style.transform="";return;
  }
  if(!breathSecs){
   actionWord.textContent="Respira despacito";actionDetail.textContent="A tu propio ritmo, a través de tu corazón.";
   orb.dataset.guided="false";orb.style.transform="";return;
  }
  const fromStart=Math.max(0,elapsed-total*starts[1]);
  const fraction=fromStart%(breathSecs*2);
  const inhaling=fraction<breathSecs;
  const inner=inhaling?fraction:fraction-breathSecs;
  const remaining=Math.max(1,Math.ceil(breathSecs-inner));
  const scale=inhaling?.85+.22*(inner/breathSecs):1.07-.22*(inner/breathSecs);
  actionWord.textContent=(inhaling?"Inhala":"Exhala")+" · "+remaining+" s";
  actionDetail.textContent=inhaling?"Lentamente y profundamente":"Despacito, imaginando que respiras a través del corazón";
  orb.dataset.guided="true";orb.style.transform="scale("+scale.toFixed(3)+")";
 }
 function scene(p,c){
  if(p===activePhase&&c===activeCue)return;
  activePhase=p;activeCue=c;
  if(finished){
   stage.dataset.moment="finished";symbol.textContent="✦";
   label.textContent="LOS CINCO MINUTOS HAN TERMINADO";
   title.textContent="¡Y con todos juntos, hecho esta!";
   cue.textContent="Ashé.";
   full.textContent=C.sec("detail-meditacion-canonazo-de-las-9-1").settings?.source_closing||"Con la atención en tu Corazón y tu lenta Respiración, tu bella emoción de Gratitud y tu gran visión para Cuba, has dedicado este momento a tu patria.";
   byId("canon-source").querySelector(".label").textContent="MENSAJE FINAL DEL DOCUMENTO";
  }else if(!started){
   stage.dataset.moment="intro";symbol.textContent="♥";
   label.textContent="PREPARA TU MEDITACIÓN";
   title.textContent="Todo el pueblo cubano. Juntos.";
   cue.textContent="Una poderosa meditación de cinco minutos. Todas las noches, estés donde estés, a las 9 PM.";
   full.textContent="Configura el temporizador durante 5 minutos (mínimo 3). Pulsa comenzar cuando estés preparado para recorrer los cuatro momentos.";
   byId("canon-source").querySelector(".label").textContent="LA GUÍA ORIGINAL · PREPARACIÓN";
  }else{
   const st=C.canonSteps[p];
   stage.dataset.moment=moments[p];symbol.textContent=st.icon;
   label.textContent="MOMENTO "+(p+1)+" DE 4 · "+st.title;
   title.textContent=st.title;
   cue.textContent=st.cues[c]||st.body;
   full.textContent=st.body;
   byId("canon-source").querySelector(".label").textContent="INSTRUCCIÓN COMPLETA DEL DOCUMENTO";
  }
  cue.classList.remove("canon-enter");void cue.offsetWidth;cue.classList.add("canon-enter");
 }
 function render(){
  if(elapsed>=total&&started){elapsed=total;finished=true;stop()}
  const p=started&&!finished?indexFor(elapsed):-1;
  let c=-1;
  if(p>=0){
    const from=total*starts[p],length=total*(starts[p+1]-starts[p]);
    const ratio=Math.min(.99999,Math.max(0,(elapsed-from)/length));
    c=Math.min(C.canonSteps[p].cues.length-1,Math.floor(ratio*C.canonSteps[p].cues.length));
  }
  scene(p,c);
  displayWords();
  time.textContent=format(total-elapsed);
  fill.style.width=(elapsed/total*100).toFixed(3)+"%";
  progress.setAttribute("aria-valuenow",String(Math.round(elapsed/total*100)));
  phaseNodes.forEach((node,i)=>{node.dataset.active=String(i===p);node.dataset.complete=String(finished||started&&i<p)});
  toggle.textContent=finished?"Volver a meditar ↻":running?"Pausar II":started?"Continuar ▶":"Comenzar experiencia ▶";
  prev.disabled=!started||finished||p===0;
  next.disabled=!started||finished||p===3;
  status.textContent=finished?"Meditación completa. Ashé.":running?"Momento "+(p+1)+" de 4 · en curso":started?"Sesión pausada. Continúa cuando quieras.":"La sesión todavía no ha comenzado.";
  byId("canon-time-label").textContent=finished?"EXPERIENCIA COMPLETADA":running?"TIEMPO RESTANTE":"DURACIÓN DE LA EXPERIENCIA";
 }
 function tick(){
  if(!running)return;
  const now=performance.now();
  elapsed=Math.min(total,elapsed+Math.max(0,(now-lastTick)/1000));
  lastTick=now;
  render();
 }
 function begin(){
  if(finished){resetAll()}
  if(!started){started=true;elapsed=0;activePhase=-2;activeCue=-2}
  running=true;lastTick=performance.now();
  handle=setInterval(tick,100);
  render();
 }
 function resetAll(){
  stop();elapsed=0;started=false;finished=false;activePhase=-2;activeCue=-2;
  render()
 }
 function jump(delta){
  if(!started||finished)return;
  const newIndex=Math.max(0,Math.min(3,indexFor(elapsed)+delta));
  stop();
  elapsed=total*starts[newIndex]+.001;
  activePhase=-2;activeCue=-2;
  render();
 }
 toggle.addEventListener("click",()=>{if(running){tick();stop();render()}else begin()});
 reset.addEventListener("click",resetAll);
 prev.addEventListener("click",()=>jump(-1));
 next.addEventListener("click",()=>jump(1));
 document.querySelectorAll("[data-duration]").forEach(button=>button.addEventListener("click",()=>{
   total=Number(button.dataset.duration);
   document.querySelectorAll("[data-duration]").forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
   resetAll();
 }));
 document.querySelectorAll("[data-breath]").forEach(button=>button.addEventListener("click",()=>{
   breathSecs=Number(button.dataset.breath);
   document.querySelectorAll("[data-breath]").forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
   displayWords();
 }));
 document.addEventListener("visibilitychange",()=>{
  if(document.hidden&&running){tick();stop();render()}
 });
 resetAll();
};
})();
