'use strict';

// CONFIGURAÇÃO DO CLIENTE: vazio mantém a demonstração sem envio ou armazenamento.
const FORM_ENDPOINT = '';
const WHATSAPP_NUMBER = '5500000000000';
const WHATSAPP_MESSAGE = 'Olá! Vi o Aurora Residence e gostaria de receber mais informações sobre o empreendimento.';

const gallery = [
  ['fachada', 'Fachada', 'Referência de fachada residencial contemporânea'],
  ['sala', 'Living integrado', 'Sala de estar com luz natural e ambientes integrados'],
  ['varanda', 'Varanda', 'Terraço ilustrativo para momentos ao ar livre'],
  ['cozinha', 'Cozinha', 'Cozinha contemporânea com acabamentos claros'],
  ['lazer', 'Área de lazer', 'Ambiente de lazer ilustrativo com espreguiçadeiras'],
  ['piscina', 'Piscina', 'Piscina ilustrativa rodeada de paisagismo'],
  ['academia', 'Academia', 'Referência de espaço fitness equipado'],
  ['externa', 'Área externa', 'Jardim ilustrativo com áreas de convivência']
];
const plans = [
  {id:'a', area:72, rooms:'2 quartos', interest:'Apartamento 2 quartos', detail:'Ambientes integrados · Varanda gourmet'},
  {id:'b', area:94, rooms:'3 quartos', interest:'Apartamento 3 quartos', detail:'Mais espaço para compartilhar · Varanda gourmet'},
  {id:'c', area:118, rooms:'3 quartos + suíte', interest:'Apartamento 3 quartos + suíte', detail:'Uma suíte entre os 3 quartos · Varanda gourmet'}
];
const amenities = [
  ['Piscina','Uma pausa para renovar as energias.','M3 17q3-3 6 0t6 0t6 0M3 21q3-3 6 0t6 0t6 0M7 13V5a2 2 0 0 1 4 0M15 13V5a2 2 0 0 1 4 0M7 8h8M7 12h8'],
  ['Academia','Seu bem-estar, bem perto.','M7 12h10M3 8v8M6 6v12M18 6v12M21 8v8M3 12h3M18 12h3'],
  ['Espaço gourmet','Sabores que aproximam.','M4 3v6q0 3 3 3V3M7 12v9M18 3v18M18 3q-6 4 0 10'],
  ['Salão de festas','Boas histórias merecem celebrar.','M5 10h14v11H5zM3 10h18M8 10V6h8v4M12 6V2M9 16h6'],
  ['Playground','Espaço para a imaginação.','M3 21 8 3h8l5 18M8 3l8 18M12 8h6M10 13h9M8 18h12'],
  ['Coworking','Novas ideias encontram lugar.','M5 4h14v11H5zM2 19h20M8 15l-1 4M16 15l1 4'],
  ['Portaria','Cuidado em cada chegada.','M12 2 3 6v6q0 6 9 10 9-4 9-10V6zM8 12l3 3 5-6'],
  ['Paisagismo','A natureza faz parte de casa.','M12 22V11M12 16Q1 16 3 5q11-1 9 11ZM12 12Q11 2 21 3q1 9-9 9']
];
document.querySelector('#amenity-grid').innerHTML = amenities.map(([title,description,path]) => `<article class="amenity"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg><h3>${title}</h3><p>${description}</p></article>`).join('');
document.querySelector('#gallery-grid').innerHTML = gallery.map(([file,label,alt],i) => `<button class="gallery-item" data-gallery="${i}" aria-label="Ampliar: ${label}"><img src="assets/images/${file}.jpg" alt="${alt}" width="800" height="600" loading="lazy"><span class="gallery-caption">${label}<span aria-hidden="true">↗</span></span></button>`).join('');
document.querySelector('#plans-grid').innerHTML = plans.map(p => `<article class="plan"><div class="plan-top"><span>PLANTA ${p.id.toUpperCase()}</span><span>${p.rooms}</span></div><img src="assets/images/planta-${p.id}.svg" alt="Esquema ilustrativo da planta ${p.id.toUpperCase()}, ${p.rooms}, sem escala" width="400" height="300" loading="lazy"><h3>${p.area} m²</h3><p>${p.detail}</p><button class="text-link" data-plan="${p.id}" aria-label="Ver planta ${p.id.toUpperCase()}, ${p.area} metros quadrados">Ver planta <span aria-hidden="true">↗</span></button></article>`).join('');

const menu = document.querySelector('#menu');
const toggle = document.querySelector('.menu-toggle');
function closeMenu(){ menu.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Abrir menu'); }
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';menu.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
window.matchMedia('(min-width:951px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
const header=document.querySelector('.header');
function updateHeader(){header.classList.toggle('scrolled',window.scrollY>20);}
window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
document.querySelector('.back-top').addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.querySelector('.brand').focus({preventScroll:true});});

const mediaModal=document.querySelector('#media-modal');
const modalImage=document.querySelector('#modal-image');
const caption=document.querySelector('#modal-caption');
const previous=document.querySelector('#previous');
const next=document.querySelector('#next');
let galleryIndex=0;
let mediaMode='gallery';
let selectedPlan=null;
let lastFocus=null;
function openDialog(dialog){lastFocus=document.activeElement;dialog.showModal();document.body.classList.add('modal-open');}
document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.querySelector('.modal-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');lastFocus?.focus();});
  dialog.addEventListener('keydown',e=>{
    if(e.key!=='Tab')return;
    const focusable=[...dialog.querySelectorAll('button,a[href],input,select,[tabindex="0"]')].filter(el=>!el.hidden&&!el.disabled&&el.getClientRects().length);
    const first=focusable[0],last=focusable[focusable.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
  // Native dialog supplies modal semantics and Escape; tab wrapping stays within controls.
});
function renderGallery(){const [file,label,alt]=gallery[galleryIndex];modalImage.src=`assets/images/${file}.jpg`;modalImage.alt=alt;caption.textContent=`${label} · Fotografia de referência`;document.querySelector('#modal-count').textContent=`${galleryIndex+1} / ${gallery.length}`;}
document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{mediaMode='gallery';galleryIndex=Number(button.dataset.gallery);previous.hidden=next.hidden=false;renderGallery();openDialog(mediaModal);}));
function moveImage(step){galleryIndex=(galleryIndex+step+gallery.length)%gallery.length;renderGallery();}
previous.addEventListener('click',()=>moveImage(-1));next.addEventListener('click',()=>moveImage(1));
mediaModal.addEventListener('keydown',e=>{if(mediaMode==='gallery'&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();moveImage(e.key==='ArrowLeft'?-1:1);}});
document.querySelectorAll('[data-plan]').forEach(button=>button.addEventListener('click',()=>{
  const plan=plans.find(p=>p.id===button.dataset.plan);selectedPlan=plan;mediaMode='plan';previous.hidden=next.hidden=true;
  modalImage.src=`assets/images/planta-${plan.id}.svg`;modalImage.alt=`Planta ${plan.id.toUpperCase()}: ${plan.rooms}, ${plan.area} m², esquema sem escala`;
  caption.textContent=`Planta ${plan.id.toUpperCase()} · ${plan.rooms} · ${plan.area} m²`;
  document.querySelector('#modal-count').textContent='Planta meramente ilustrativa · Sem escala';
  document.querySelector('#interest').value=plan.interest;openDialog(mediaModal);
}));
document.querySelector('#interest').addEventListener('change',e=>{selectedPlan=plans.find(p=>p.interest===e.target.value)||null;});
document.querySelectorAll('.whatsapp').forEach(button=>button.addEventListener('click',()=>{
  const message=WHATSAPP_MESSAGE+(selectedPlan?` Tenho interesse na planta ${selectedPlan.id.toUpperCase()}, de ${selectedPlan.area} m² (${selectedPlan.rooms}).`:'');
  const url=`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g,'')}?text=${encodeURIComponent(message)}`;
  if(WHATSAPP_NUMBER==='5500000000000'||!WHATSAPP_NUMBER){document.querySelector('#wa-message').textContent=message;openDialog(document.querySelector('#whatsapp-modal'));}
  else window.open(url,'_blank','noopener,noreferrer');
}));
document.querySelector('#wa-ok').addEventListener('click',()=>document.querySelector('#whatsapp-modal').close());

const form=document.querySelector('#interest-form');
const feedback=document.querySelector('#form-feedback');
if(FORM_ENDPOINT)document.querySelector('.form-privacy').textContent='Seus dados serão enviados para a equipe responsável pelo atendimento.';
function fieldError(id,message){const field=document.getElementById(id);document.getElementById(`${id}-error`).textContent=message;field.setAttribute('aria-invalid',String(Boolean(message)));return !message;}
function validate(id){const field=document.getElementById(id);const value=field.value.trim();let error='';
  if(id==='name'&&value.length<2)error='Informe seu nome com pelo menos 2 caracteres.';
  if(id==='phone'){const digits=value.replace(/\D/g,'');if(!/^(?:55)?\d{10,11}$/.test(digits))error='Informe um telefone com DDD (10 ou 11 dígitos).';}
  if(id==='email'&&(!value||field.validity.typeMismatch||!/^\S+@\S+\.\S+$/.test(value)))error='Digite um e-mail válido, como nome@exemplo.com.';
  if(id==='consent'&&!field.checked)error='Autorize o contato para continuar.';
  return fieldError(id,error);
}
['name','phone','email','consent'].forEach(id=>{const field=document.getElementById(id);field.addEventListener('blur',()=>validate(id));field.addEventListener('input',()=>{if(field.getAttribute('aria-invalid')==='true')validate(id);feedback.textContent='';});});
form.addEventListener('submit',async e=>{
  e.preventDefault();feedback.textContent='';feedback.classList.remove('failure');
  const valid=['name','phone','email','consent'].map(validate).every(Boolean);
  if(!valid){form.querySelector('[aria-invalid="true"]').focus();return;}
  const submit=form.querySelector('[type=submit]');submit.disabled=true;
  try{
    if(FORM_ENDPOINT){
      const response=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({name:form.elements.name.value.trim(),phone:form.elements.phone.value.trim(),email:form.elements.email.value.trim(),interest:form.elements.interest.value,consent:form.elements.consent.checked}),signal:AbortSignal.timeout(15000)});
      if(!response.ok)throw new Error('Envio indisponível');
      feedback.textContent='Interesse enviado com sucesso. Em breve, a equipe entrará em contato.';
    }else feedback.textContent='Formulário enviado em modo demonstrativo. Em um projeto real, estes dados seriam enviados ao CRM, e-mail ou sistema do cliente.';
    form.reset();selectedPlan=null;['name','phone','email','consent'].forEach(id=>document.getElementById(id).removeAttribute('aria-invalid'));feedback.focus();
  }catch{feedback.classList.add('failure');feedback.textContent='Não foi possível enviar agora. Seus campos foram mantidos. Tente novamente em alguns instantes.';feedback.focus();}
  finally{submit.disabled=false;}
});
document.querySelector('#year').textContent=new Date().getFullYear();
if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.body.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}
