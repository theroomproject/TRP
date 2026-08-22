const TRP_CONCEPT_SPRITE='assets/images/trp-room-concepts.jpg?v=5';
const TRP_POSITIONS=['0% 0%','33.333% 0%','66.667% 0%','100% 0%','0% 33.333%','33.333% 33.333%','66.667% 33.333%','100% 33.333%','0% 66.667%','33.333% 66.667%','66.667% 66.667%','100% 66.667%'];

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
.modal-panel{grid-template-columns:minmax(360px,520px) 1fr!important;align-items:center!important}.modal-image-wrap{display:block!important;width:100%!important;aspect-ratio:16/9!important;min-height:0!important;background-repeat:no-repeat!important;background-size:400% 400%!important;background-color:#111!important;align-self:center!important}.modal-image-wrap img{display:none!important}.modal-gradient{background:linear-gradient(0deg,rgba(0,0,0,.6),transparent 48%)!important}
@media(max-width:980px){.modal-panel{grid-template-columns:1fr!important;max-width:720px!important}.modal-image-wrap{aspect-ratio:16/9!important;min-height:0!important}}@media(max-width:650px){.room-card{min-height:0}.room-card-content{padding:22px!important}.modal-image-wrap{aspect-ratio:16/9!important;min-height:0!important}}
`;
document.head.appendChild(trpStyle);

function renderTRPTextRooms(filter='all'){
  const list=filter==='all'?roomTypes:roomTypes.filter(r=>r.cat===filter);
  grid.innerHTML=list.map(r=>`<article class="room-card tone-${r.tone}" data-name="${r.name.replaceAll('"','&quot;')}"><div class="room-card-content"><div class="room-card-top"><span class="room-emoji">${r.emoji}</span><span class="room-price">${convertPriceRange(r.price)}</span></div><span class="room-concept-label">Room concept</span><h3>${r.name}</h3><p>${r.desc}</p><ul class="room-feature-preview">${r.features.slice(0,3).map(f=>`<li>${f}</li>`).join('')}</ul><button type="button" data-room="${encodeURIComponent(r.name)}">View concept image & details <span>→</span></button></div></article>`).join('');
}

function openTRPTextRoom(name){
  const r=roomTypes.find(x=>x.name===name);if(!r)return;
  const index=roomTypes.findIndex(x=>x.name===name);
  const wrap=document.querySelector('.modal-image-wrap');
  const img=document.getElementById('modalImage');
  if(wrap){wrap.style.display='block';wrap.style.backgroundImage=`url("${TRP_CONCEPT_SPRITE}")`;wrap.style.backgroundSize='400% 400%';wrap.style.backgroundPosition=TRP_POSITIONS[index%TRP_POSITIONS.length];wrap.style.backgroundRepeat='no-repeat';}
  if(img){img.style.display='none';img.removeAttribute('src');}
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
const roomsIntro=document.querySelector('#rooms .section-head p');if(roomsIntro)roomsIntro.textContent='Explore the room concepts below for ideas, estimated pricing and possible features. Click any concept to view visual inspiration and the full details. Final designs are personalised to the actual room, customer preferences, selected materials and available budget.';
