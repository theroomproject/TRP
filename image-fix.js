// TRP text-first room catalogue with original TRP visual concepts in the popup.
// The main room cards stay text-only; a clean 4:3 room image appears only when opened.

const TRP_MASTER_VISUAL='assets/images/trp-originals-master.jpg?v=20260823c';
const TRP_VISUAL_TILES={
  gaming:[0,0], luxury:[1,0], prayer:[2,0], zen:[3,0],
  cinema:[0,1], creator:[1,1], office:[2,1], jungle:[3,1],
  pastel:[0,2], kids:[1,2], tropical:[2,2], sports:[3,2]
};
const trpMasterImage=new Image();
trpMasterImage.decoding='async';
trpMasterImage.src=TRP_MASTER_VISUAL;
const trpCropCache={};

function trpVisualKeyForRoom(r){
  const n=r.name.toLowerCase();
  if(n.includes('cinema')) return 'cinema';
  if(n.includes('prayer')||n.includes('spiritual')) return 'prayer';
  if(n.includes('zen')||n.includes('meditation')) return 'zen';
  if(n.includes('podcast')||n.includes('streaming')||n.includes('music')||n.includes('creative studio')||n.includes('content creator')) return 'creator';
  if(n.includes('office')||n.includes('study')||n.includes('productivity')) return 'office';
  if(n.includes('nature')||n.includes('jungle')||n.includes('chill lounge')) return 'jungle';
  if(n.includes('pastel')||n.includes('princess')||n.includes('glam')||n.includes('beauty')||n.includes('makeup')||n.includes('nursery')) return 'pastel';
  if(n.includes('kids')||n.includes('fantasy')) return 'kids';
  if(n.includes('resort')||n.includes('bali')||n.includes('airbnb')||n.includes('walk-in wardrobe')) return 'tropical';
  if(n.includes('sports')||n.includes('car enthusiast')||n.includes('sneaker')||n.includes('fashion')) return 'sports';
  if(n.includes('gaming')||n.includes('anime')||n.includes('party')||n.includes('galaxy')||n.includes('space')) return 'gaming';
  return 'luxury';
}

function trpCreateCrop(key,callback){
  if(trpCropCache[key]){callback(trpCropCache[key]);return;}
  const make=()=>{
    const tile=TRP_VISUAL_TILES[key]||TRP_VISUAL_TILES.luxury;
    const sw=Math.floor(trpMasterImage.naturalWidth/4);
    const sh=Math.floor(trpMasterImage.naturalHeight/3);
    if(!sw||!sh)return;
    const canvas=document.createElement('canvas');
    canvas.width=sw;
    canvas.height=sh;
    const ctx=canvas.getContext('2d',{alpha:false});
    ctx.imageSmoothingEnabled=true;
    ctx.imageSmoothingQuality='high';
    ctx.drawImage(trpMasterImage,tile[0]*sw,tile[1]*sh,sw,sh,0,0,sw,sh);
    const url=canvas.toDataURL('image/jpeg',0.96);
    trpCropCache[key]=url;
    callback(url);
  };
  if(trpMasterImage.complete&&trpMasterImage.naturalWidth){make();}
  else trpMasterImage.addEventListener('load',make,{once:true});
}

convertPriceRange=function(price){
  const nums=[...price.matchAll(/[\d,]+/g)].map(m=>Number(m[0].replaceAll(',','')));
  if(!nums.length) return price;
  const plus=price.trim().endsWith('+');
  const lower=Math.round(nums[0]*0.8);
  if(nums.length===1) return `${formatMoney(convertMYR(lower))}${plus?'+':''}`;
  return `${formatMoney(convertMYR(lower))}–${formatMoney(convertMYR(nums[1]))}${plus?'+':''}`;
};

const trpStyle=document.createElement('style');
trpStyle.textContent=`
.room-card{min-height:285px;display:flex;overflow:hidden}.room-card>img{display:none!important}.room-card-content{display:flex!important;flex-direction:column;flex:1;padding:28px!important}.room-card-content h3{margin-top:14px}.room-card-content p{margin-bottom:18px}.room-card-content button{margin-top:auto}.room-feature-preview{display:flex;flex-wrap:wrap;gap:7px;margin:0 0 22px;padding:0;list-style:none}.room-feature-preview li{font-size:.72rem;line-height:1.2;padding:7px 9px;border:1px solid rgba(255,255,255,.12);border-radius:999px;color:rgba(255,255,255,.72);background:rgba(255,255,255,.035)}.room-concept-label{font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:#ff8a24;font-weight:800}
.modal-panel{grid-template-columns:minmax(420px,600px) minmax(0,1fr)!important;align-items:start!important;max-width:1240px!important}.modal-image-wrap{display:block!important;position:relative!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:4/3!important;align-self:start!important;background:#0b0b0d!important;overflow:hidden!important}.modal-image-wrap img{display:block!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;min-height:0!important;object-fit:cover!important;object-position:center!important;filter:none!important;transform:none!important;image-rendering:auto!important}.modal-gradient{display:block!important;background:linear-gradient(0deg,rgba(0,0,0,.5),transparent 42%)!important;pointer-events:none!important}.modal-category{bottom:18px!important}.modal-visual-note{position:absolute;left:18px;top:18px;z-index:2;background:rgba(0,0,0,.72);border:1px solid rgba(255,255,255,.16);border-radius:8px;padding:7px 9px;color:#fff;font-size:.62rem;letter-spacing:.11em;text-transform:uppercase;font-weight:800}
@media(max-width:980px){.modal-panel{grid-template-columns:1fr!important;max-width:760px!important}.modal-image-wrap{width:100%!important;aspect-ratio:4/3!important}}@media(max-width:650px){.room-card{min-height:0}.room-card-content{padding:22px!important}.modal-image-wrap{width:100%!important;aspect-ratio:4/3!important}}
`;
document.head.appendChild(trpStyle);

function renderTRPTextRooms(filter='all'){
  const list=filter==='all'?roomTypes:roomTypes.filter(r=>r.cat===filter);
  grid.innerHTML=list.map(r=>`<article class="room-card tone-${r.tone}" data-name="${r.name.replaceAll('"','&quot;')}"><div class="room-card-content"><div class="room-card-top"><span class="room-emoji">${r.emoji}</span><span class="room-price">${convertPriceRange(r.price)}</span></div><span class="room-concept-label">Room concept</span><h3>${r.name}</h3><p>${r.desc}</p><ul class="room-feature-preview">${r.features.slice(0,3).map(f=>`<li>${f}</li>`).join('')}</ul><button type="button" data-room="${encodeURIComponent(r.name)}">View concept image & details <span>→</span></button></div></article>`).join('');
}

function openTRPTextRoom(name){
  const r=roomTypes.find(x=>x.name===name);if(!r)return;
  const wrap=document.querySelector('.modal-image-wrap');
  const img=document.getElementById('modalImage');
  const visualKey=trpVisualKeyForRoom(r);
  if(wrap){
    wrap.style.removeProperty('background-image');
    wrap.style.removeProperty('background-size');
    wrap.style.removeProperty('background-position');
    wrap.style.background='#0b0b0d';
    let note=wrap.querySelector('.modal-visual-note');
    if(!note){note=document.createElement('span');note.className='modal-visual-note';note.textContent='TRP visual inspiration';wrap.appendChild(note);}
  }
  if(img){
    img.style.display='block';
    img.removeAttribute('src');
    img.alt=`TRP visual inspiration for ${r.name}`;
    trpCreateCrop(visualKey,(url)=>{img.src=url;});
  }
  document.getElementById('modalCategory').textContent=r.cat.replace('work','work & create');
  document.getElementById('modalEmoji').textContent=`${r.emoji} ROOM CONCEPT`;
  document.getElementById('modalTitle').textContent=r.name;
  document.getElementById('modalPrice').textContent=`Estimated ${convertPriceRange(r.price)} ${activeCurrency}`;
  document.getElementById('modalDescription').textContent=r.desc;
  document.getElementById('modalFeatures').innerHTML=r.features.map(f=>`<li>${f}</li>`).join('');
  formRoom.value=r.name;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');
}

renderRooms=renderTRPTextRooms;openRoom=openTRPTextRoom;
renderTRPTextRooms(document.querySelector('.filter-btn.active')?.dataset.filter||'all');
if(formRoom){const selected=formRoom.value;formRoom.innerHTML='<option value="">Choose a room type</option>';roomTypes.forEach(r=>{const o=document.createElement('option');o.value=r.name;o.textContent=`${r.emoji} ${r.name} — ${convertPriceRange(r.price)}`;formRoom.appendChild(o)});if([...formRoom.options].some(o=>o.value===selected))formRoom.value=selected;}
const roomsIntro=document.querySelector('#rooms .section-head p');if(roomsIntro)roomsIntro.textContent='Explore the room concepts below for ideas, estimated pricing and possible features. Click any concept to view original TRP visual inspiration and the full details. Final designs are personalised to the actual room, customer preferences, selected materials and available budget.';

const faqList=document.querySelector('.faq-list');
if(faqList && faqList.querySelectorAll('details').length<15){
  const extraFaqs=[
    ['How long does a room transformation usually take?','The timeline depends on the size of the room, the amount of work involved, custom items, material availability and specialist schedules. TRP will provide a clearer project timeline once the room and final scope have been assessed.'],
    ['Do I have to choose one of the room concepts shown on the website?','No. The concepts are there to help you imagine possibilities. You can bring your own reference photos, describe a completely different idea, or ask TRP to develop a direction based on your personality, needs and budget.'],
    ['Can I keep some of my existing furniture?','Yes. If existing furniture, lighting, décor or equipment still works with the new concept, TRP can plan around it. Reusing suitable items can also help control the overall project budget.'],
    ['Can I change the design after the project has started?','Changes may be possible, but they can affect cost, materials and completion time. TRP will discuss the impact of any requested changes before additional work is approved or arranged.'],
    ['Does TRP handle furniture, lighting and décor too?','Depending on the agreed scope, TRP can coordinate furniture, lighting, décor, curtains, technology, custom carpentry and other items needed to complete the room rather than leaving the customer to organise each supplier separately.'],
    ['What happens if the final quotations are above my budget?','TRP can review the scope with you and look at practical ways to reduce or prioritise spending. This may include changing materials, postponing lower-priority features or simplifying certain parts of the transformation.'],
    ['Can TRP transform a rented room or rental property?','Potentially, yes, provided the customer has permission for any changes that affect the property. For rented spaces, TRP can also focus on more reversible upgrades when appropriate.'],
    ['Will the finished room look exactly like the inspiration image?','Not necessarily. Inspiration images communicate a style and feeling. The final result depends on your actual room dimensions, layout, building conditions, chosen materials, product availability and approved budget.'],
    ['What happens after the room is completed?','TRP and the assigned Room Raider will coordinate the final checks and handover. Any warranty or after-sales coverage relating to specific products or specialist work will depend on the relevant supplier, contractor or agreed project terms.']
  ];
  extraFaqs.forEach(([q,a])=>faqList.insertAdjacentHTML('beforeend',`<details class="reveal visible"><summary>${q}</summary><p>${a}</p></details>`));
}
