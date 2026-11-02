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

/* Registro Cuba Feliz: correo obligatorio, respuestas cerradas en desplegables y validación integral. */
(function(){
'use strict';
function enhance(){
 const country=document.getElementById('joinCountrySearch');
 const form=country?.closest('form');
 if(!form||form.dataset.cfRequiredEnhanced==='true')return;
 form.dataset.cfRequiredEnhanced='true';
 const countryValue=form.querySelector('[name="country"]');
 if(country){country.required=true;country.setAttribute('aria-required','true');}
 if(countryValue)countryValue.setAttribute('data-cf-required-country','true');
 let email=form.querySelector('input[type="email"],input[name="email"],input[name="correo"],input[name="correo_electronico"]');
 if(!email){
   const wrap=document.createElement('div');wrap.className='form-field cf-email-field';
   const label=document.createElement('label');label.htmlFor='joinRequiredEmail';label.textContent='Correo electrónico *';
   email=document.createElement('input');email.id='joinRequiredEmail';email.name='email';email.type='email';email.autocomplete='email';email.placeholder='nombre@ejemplo.com';
   wrap.append(label,email);
   const anchor=country.closest('#joinCountryField')||country.parentElement;
   if(anchor?.parentNode)anchor.parentNode.insertBefore(wrap,anchor);
   else form.prepend(wrap);
 } else {
   email.type='email';if(!email.name)email.name='email';
 }
 email.required=true;email.setAttribute('aria-required','true');
 email.autocomplete='email';
 const processed=new Set();
 form.querySelectorAll('input[type="radio"][name]').forEach(radio=>{
   const name=radio.name;
   if(processed.has(name))return;processed.add(name);
   const group=[...form.querySelectorAll('input[type="radio"]')].filter(el=>el.name===name);
   if(group.length<2)return;
   const fieldset=group[0].closest('fieldset');
   if(!fieldset||!group.every(el=>fieldset.contains(el)))return;
   const choices=group.map(el=>{
     const lbl=el.closest('label')|| (el.id?fieldset.querySelector('label[for="'+CSS.escape(el.id)+'"]'):null);
     return {radio:el,text:(lbl?.textContent||el.value||'').trim()};
   }).filter(x=>x.text);
   if(choices.length!==group.length)return;
   const select=document.createElement('select');
   select.className='cf-answer-select';select.required=true;
   select.setAttribute('aria-label',fieldset.querySelector('legend')?.textContent?.trim()||'Selecciona una respuesta');
   const initial=document.createElement('option');initial.value='';initial.textContent='Selecciona una opción';initial.disabled=true;initial.selected=!group.some(x=>x.checked);select.append(initial);
   choices.forEach(x=>{const option=document.createElement('option');option.value=x.radio.value;option.textContent=x.text;option.selected=x.radio.checked;select.append(option);});
   const holder=document.createElement('div');holder.className='cf-radio-dropdown';holder.append(select);
   fieldset.append(holder);
   group.forEach(el=>{
     const container=el.closest('label')||el;
     container.style.display='none';el.required=false;
   });
   select.addEventListener('change',()=>{
     const active=group.find(el=>el.value===select.value);
     if(active){active.checked=true;active.dispatchEvent(new Event('change',{bubbles:true}));}
   });
 });
 function requireAll(){
   form.querySelectorAll('input,select,textarea').forEach(el=>{
     if(el.disabled||['hidden','submit','button','reset','file','checkbox','radio'].includes(el.type)||el.type==='search'&&el!==country)return;
     if(el.offsetParent===null&&el!==country)return;
     el.required=true;el.setAttribute('aria-required','true');
   });
   [...new Set([...form.querySelectorAll('input[type="radio"][name]')].map(el=>el.name))].forEach(name=>{
     const arr=[...form.querySelectorAll('input[type="radio"]')].filter(el=>el.name===name);
     if(!arr.every(el=>el.closest('fieldset')?.querySelector('.cf-radio-dropdown'))&&arr.length)arr[0].required=true;
   });
 }
 requireAll();
 form.addEventListener('submit',event=>{
   requireAll();
   if(country&&!countryValue?.value.trim()){country.setCustomValidity('Selecciona un país de la lista.');}
   else country?.setCustomValidity('');
   if(!form.checkValidity()){
     event.preventDefault();event.stopImmediatePropagation();form.reportValidity();
   }
 },true);
 country?.addEventListener('input',()=>country.setCustomValidity(''));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance);
else enhance();
const watcher=new MutationObserver(enhance);
watcher.observe(document.documentElement,{childList:true,subtree:true});
})();
