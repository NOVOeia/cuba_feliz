/* Cuba Feliz 4th draft: catalogo ISO 3166-1, espanol y seleccion accesible. */
(function(){
'use strict';
const codes='AWAFAOAIAXALADAEARAMASAQTFAGAUATAZBIBEBJBQBFBDBGBHBSBABLBYBZBMBOBRBBBNBTBVBWCFCACCCHCLCNCICMCDCGCKCOKMCVCRCUCWCXKYCYCZDEDJDMDKDODZECEGEREHESEEETFIFJFKFRFOFMGAGBGEGGGHGIGNGPGMGWGQGRGDGLGTGFGUGYHKHMHNHRHTHUIDIMINIOIEIRIQISILITJMJEJOJPKZKEKGKHKIKNKRKWLALBLRLYLCLILKLSLTLULVMOMFMAMCMDMGMVMXMHMKMLMTMMMEMNMPMZMRMSMQMUMWMYYTNANCNENFNGNINUNLNONPNRNZOMPKPAPNPEPHPWPGPLPRKPPTPYPSPFQARERORURWSASDSNSGGSSHSJSBSLSVSMSOPMRSSSSTSRSKSISESZSXSCSYTCTDTGTHTJTKTMTLTOTTTNTRTVTWTZUGUAUMUYUSUZVAVCVEVGVIVNVUWFWSYEZAZMZW'.match(/.{2}/g);
const regionNames=typeof Intl.DisplayNames==='function'?new Intl.DisplayNames(['es'],{type:'region'}):null;
const overrides={US:'Estados Unidos',GB:'Reino Unido',CZ:'Chequia',TW:'Taiwán',HK:'Hong Kong',MO:'Macao',PR:'Puerto Rico',PS:'Palestina',VA:'Ciudad del Vaticano'};
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').trim();
const list=codes.map(code=>({code,name:overrides[code]||regionNames?.of(code)||code}));
list.push({code:'XK',name:'Kosovo'});
list.sort((a,b)=>a.name.localeCompare(b.name,'es',{sensitivity:'base'}));
function setup(form,onCountryChange){
 const input=form.querySelector('#joinCountrySearch'),value=form.querySelector('[name="country"]'),panel=form.querySelector('#joinCountryResults');
 if(!input||!value||!panel)return;
 let visible=[],selectedIndex=-1;
 const close=()=>{panel.hidden=true;input.setAttribute('aria-expanded','false');selectedIndex=-1;};
 const select=c=>{input.value=c.name;value.value=c.name;input.setCustomValidity('');close();onCountryChange?.();};
 function draw(){
   const query=norm(input.value);
   visible=query?list.filter(x=>norm(x.name).includes(query)||norm(x.code)===query):list;
   if(!visible.length){panel.innerHTML='<p class="country-no-results">No encontramos ese país o territorio.</p>';panel.hidden=false;input.setAttribute('aria-expanded','true');return;}
   panel.innerHTML=visible.map((x,i)=>'<button type="button" role="option" id="joinCountryOption'+i+'" data-country-index="'+i+'" aria-selected="false">'+x.name+'</button>').join('');
   panel.hidden=false;input.setAttribute('aria-expanded','true');
 }
 input.addEventListener('input',()=>{
   value.value='';input.setCustomValidity('');
   const exact=list.find(x=>norm(x.name)===norm(input.value));
   if(exact)value.value=exact.name;
   draw();onCountryChange?.();
 });
 input.addEventListener('focus',()=>{if(!value.value)draw()});
 panel.addEventListener('pointerdown',event=>{if(event.target.closest('[data-country-index]'))event.preventDefault()});
 panel.addEventListener('click',event=>{const button=event.target.closest('[data-country-index]');if(button){const c=visible[Number(button.dataset.countryIndex)];if(c)select(c);}});
 input.addEventListener('keydown',e=>{
   if(e.key==='Escape'){close();return;}
   if(e.key==='ArrowDown'&&panel.hidden){e.preventDefault();draw();return;}
   if(e.key==='ArrowDown'||e.key==='ArrowUp'){
     e.preventDefault();if(panel.hidden)draw();if(!visible.length)return;
     selectedIndex=(selectedIndex+(e.key==='ArrowDown'?1:-1)+visible.length)%visible.length;
     panel.querySelectorAll('[role="option"]').forEach((x,i)=>{x.setAttribute('aria-selected',String(i===selectedIndex));});
     panel.querySelector('[data-country-index="'+selectedIndex+'"]')?.scrollIntoView({block:'nearest'});return;
   }
   if(e.key==='Enter'&&!panel.hidden&&visible.length){e.preventDefault();select(visible[Math.max(0,selectedIndex)]);}
 });
 document.addEventListener('click',e=>{if(!e.target.closest('#joinCountryField'))close();});
 input.addEventListener('blur',()=>setTimeout(close,160));
 form.addEventListener('reset',()=>{close();input.setCustomValidity('');});
 return {valid(){if(list.some(x=>norm(x.name)===norm(value.value)))return true;input.setCustomValidity('Selecciona un país de la lista.');input.reportValidity();return false;},clear(){close();}};
}
window.CF_COUNTRIES={count:list.length,setup,list};
})();