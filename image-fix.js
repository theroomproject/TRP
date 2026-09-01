// TRP production fixes: pricing rule, WhatsApp enquiry flow, reliable image display and FAQs.
const TRP_WHATSAPP_NUMBER='60102380016';
const TRP_WHATSAPP_BASE='https://wa.me/'+TRP_WHATSAPP_NUMBER;

// Maintain the final/max figure and reduce only the starting/minimum estimate by 20%.
convertPriceRange=function(price){
  const nums=[...price.matchAll(/[\\d,]+/g)].map(m=>Number(m[0].replaceAll(',','')));
  if(!nums.length) return price;
  const plus=price.trim().endsWith('+');
  const lower=Math.round(nums[0]*0.8);
  if(nums.length===1) return `${formatMoney(convertMYR(lower))}${plus?'+':''}`;
  return `${formatMoney(convertMYR(lower))}–${formatMoney(convertMYR(nums[1]))}${plus?'+':''}`;
};

// Re-render after the pricing override so cards and the room selector use the intended figures.
if(typeof renderRooms==='function'){
  const active=document.querySelector('.filter-btn.active')?.dataset.filter||'all';
  renderRooms(active);
}
if(formRoom){
  const selected=formRoom.value;
  formRoom.innerHTML='<option value="">Choose a room type</option>';
  roomTypes.forEach(r=>{
    const o=document.createElement('option');
    o.value=r.name;
    o.textContent=`${r.emoji} ${r.name} — ${convertPriceRange(r.price)}`;
    formRoom.appendChild(o);
  });
  if([...formRoom.options].some(o=>o.value===selected)) formRoom.value=selected;
}

// Images: remove any old diagnostic styles, ensure real images are visible,
// and gracefully fall back to the TRP logo rather than leaving a blank panel.
const imageSafetyStyle=document.createElement('style');
imageSafetyStyle.textContent=`
.room-card>img{display:block!important}
.modal-image-wrap{position:relative!important;min-height:420px!important;background:#0b0b0d!important;overflow:hidden!important}
.modal-image-wrap>img{display:block!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:cover!important;object-position:center!important;opacity:1!important;visibility:visible!important}
.brief-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}.brief-actions .btn{flex:1}
.trp-whatsapp-float{position:fixed;right:18px;bottom:18px;z-index:80;background:#25D366;color:#07140b;padding:13px 17px;border-radius:999px;font-weight:900;box-shadow:0 12px 35px rgba(0,0,0,.35);display:flex;align-items:center;gap:8px}
.trp-whatsapp-float:hover{transform:translateY(-2px)}
@media(max-width:650px){.modal-image-wrap{min-height:260px!important}.trp-whatsapp-float{right:12px;bottom:12px;padding:11px 14px;font-size:.86rem}}
`;
document.head.appendChild(imageSafetyStyle);

function installImageFallbacks(root=document){
  root.querySelectorAll('img').forEach(img=>{
    if(img.dataset.trpFallbackInstalled) return;
    img.dataset.trpFallbackInstalled='1';
    img.addEventListener('error',()=>{
      if(img.dataset.trpFallbackUsed) return;
      img.dataset.trpFallbackUsed='1';
      img.src='assets/images/trp_modern_room_project_logo.webp';
      img.alt='TRP — The Room Project';
      img.style.objectFit='contain';
      img.style.padding='24px';
      img.style.background='#0b0b0d';
    });
  });
}
installImageFallbacks();
const imageObserver=new MutationObserver(()=>installImageFallbacks());
imageObserver.observe(document.body,{childList:true,subtree:true});

// Keep modal images visible after the original openRoom() updates the source.
if(grid){
  grid.addEventListener('click',()=>setTimeout(()=>installImageFallbacks(document.getElementById('roomModal')||document),0));
}

// WhatsApp project brief button.
const whatsappBrief=document.getElementById('whatsappBrief');
if(whatsappBrief){
  whatsappBrief.addEventListener('click',e=>{
    const text=(briefOutput?.textContent||'').trim();
    if(!text) return;
    e.currentTarget.href=TRP_WHATSAPP_BASE+'?text='+encodeURIComponent(
      'Hi TRP, I would like a FREE quotation. Here is my project brief:\\n\\n'+text
    );
  });
}

// Floating WhatsApp enquiry button.
if(!document.querySelector('.trp-whatsapp-float')){
  const a=document.createElement('a');
  a.className='trp-whatsapp-float';
  a.href=TRP_WHATSAPP_BASE+'?text='+encodeURIComponent("Hi TRP, I'd like to enquire about a room transformation and get a FREE quotation.");
  a.target='_blank';
  a.rel='noopener';
  a.setAttribute('aria-label','WhatsApp TRP for a free quotation');
  a.textContent='WhatsApp • FREE Quote';
  document.body.appendChild(a);
}

// Keep the expanded FAQ set.
const faqList=document.querySelector('.faq-list');
if(faqList && faqList.querySelectorAll('details').length<15){
  const extraFaqs=[
    ['How long does a room transformation usually take?','The timeline depends on room size, scope, custom items, material availability and specialist schedules. TRP will provide a clearer timeline once the room and final scope have been assessed.'],
    ['Do I have to choose one of the room concepts shown on the website?','No. The concepts are starting points. You can share your own references or ask TRP to develop a direction around your needs and budget.'],
    ['Can I keep some of my existing furniture?','Yes. Suitable existing furniture, lighting, décor or equipment can be incorporated into the new concept where practical.'],
    ['Can I change the design after the project has started?','Changes may be possible, but they can affect cost, materials and completion time. Any impact will be discussed before additional work is approved.'],
    ['Does TRP handle furniture, lighting and décor too?','Depending on the agreed scope, TRP can coordinate furniture, lighting, décor, curtains, technology, carpentry and other items required to complete the room.'],
    ['What happens if final quotations are above my budget?','TRP can review priorities and scope with you and explore practical ways to reduce or phase the spending.'],
    ['Can TRP transform a rented room or rental property?','Potentially, yes, provided the customer has permission for changes affecting the property.'],
    ['Will the finished room look exactly like an inspiration image?','Not necessarily. Final results depend on the actual room, dimensions, building conditions, materials, availability and approved budget.'],
    ['How do I request a FREE quotation?','Create a project brief on this page or WhatsApp TRP directly at +60 10-238 0016.']
  ];
  extraFaqs.forEach(([q,a])=>faqList.insertAdjacentHTML('beforeend',`<details class="reveal visible"><summary>${q}</summary><p>${a}</p></details>`));
}

// Update intro copy if the older wording is still present.
const roomsIntro=document.querySelector('#rooms .section-head p');
if(roomsIntro) roomsIntro.textContent='Explore the room concepts below for inspiration, estimated pricing and possible features. Final designs are personalised to the actual room, customer preferences, selected materials and available budget.';


// Hero/banner currency selector synced with the existing page currency control.
const heroCurrencySelect=document.getElementById('heroCurrencySelect');
function trpApplyCurrency(value){
  if(!currencyConfig[value]) return;
  activeCurrency=value;
  if(currencySelect) currencySelect.value=value;
  if(heroCurrencySelect) heroCurrencySelect.value=value;
  const currentFilter=document.querySelector('.filter-btn.active')?.dataset.filter||'all';
  if(typeof renderRooms==='function') renderRooms(currentFilter);
  if(formRoom){
    const selected=formRoom.value;
    formRoom.innerHTML='<option value="">Choose a room type</option>';
    roomTypes.forEach(r=>{
      const o=document.createElement('option');
      o.value=r.name;
      o.textContent=`${r.emoji} ${r.name} — ${convertPriceRange(r.price)}`;
      formRoom.appendChild(o);
    });
    if([...formRoom.options].some(o=>o.value===selected)) formRoom.value=selected;
  }
  if(typeof rebuildBudgetOptions==='function') rebuildBudgetOptions();
  const openTitle=document.getElementById('modalTitle')?.textContent;
  if(document.getElementById('roomModal')?.classList.contains('open') && openTitle){
    const r=roomTypes.find(x=>x.name===openTitle);
    if(r){
      const mp=document.getElementById('modalPrice');
      if(mp) mp.textContent=`Estimated ${convertPriceRange(r.price)} ${activeCurrency}`;
    }
  }
}
if(heroCurrencySelect){
  heroCurrencySelect.value=activeCurrency;
  heroCurrencySelect.addEventListener('change',()=>trpApplyCurrency(heroCurrencySelect.value));
}
if(currencySelect){
  currencySelect.addEventListener('change',()=>{ if(heroCurrencySelect) heroCurrencySelect.value=currencySelect.value; });
}

const heroCurrencyStyle=document.createElement('style');
heroCurrencyStyle.textContent=`
.hero-currency{display:flex;align-items:center;justify-content:space-between;gap:18px;max-width:540px;margin:22px 0 18px;padding:14px 16px;border:1px solid rgba(255,255,255,.16);border-radius:14px;background:rgba(13,13,15,.72);backdrop-filter:blur(12px)}
.hero-currency>div{display:grid;gap:2px}.hero-currency strong{font-size:.86rem;color:#fff}.hero-currency small{font-size:.72rem;color:#9f9b96}
.hero-currency select{min-width:120px;border:1px solid #45454d;background:#0d0d10;color:#fff;border-radius:10px;padding:10px 12px;font-weight:800;outline:none}
.hero-currency select:focus{border-color:var(--orange)}
@media(max-width:650px){.hero-currency{align-items:flex-start;flex-direction:column}.hero-currency select{width:100%}}
`;
document.head.appendChild(heroCurrencyStyle);
