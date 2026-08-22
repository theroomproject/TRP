// TRP text-first room catalogue with sharp, on-demand concept imagery.
// Images are loaded only when a customer opens a room concept.

const TRP_VISUALS={
  gaming:'https://unsplash.com/photos/LFVBohYmtgc/download?force=true&w=1600',
  luxury:'https://unsplash.com/photos/FwKxATzkzmM/download?force=true&w=1600',
  office:'https://unsplash.com/photos/teRVpNnlR_c/download?force=true&w=1600',
  zen:'https://unsplash.com/photos/J-N6H44Jdkw/download?force=true&w=1600',
  jungle:'https://unsplash.com/photos/c7Pz9JbR4ZM/download?force=true&w=1600',
  pastel:'https://unsplash.com/photos/Si83c0apHok/download?force=true&w=1600',
  cinema:'https://unsplash.com/photos/HHQ2cZTMwtc/download?force=true&w=1600'
};

function trpVisualForRoom(r){
  const n=r.name.toLowerCase();
  if(n.includes('cinema')) return TRP_VISUALS.cinema;
  if(n.includes('gaming')||n.includes('anime')||n.includes('party')||n.includes('galaxy')||n.includes('sports')||n.includes('car enthusiast')) return TRP_VISUALS.gaming;
  if(n.includes('office')||n.includes('study')||n.includes('productivity')||n.includes('podcast')||n.includes('streaming')||n.includes('creative studio')||n.includes('content creator')) return TRP_VISUALS.office;
  if(n.includes('zen')||n.includes('meditation')||n.includes('prayer')||n.includes('spiritual')) return TRP_VISUALS.zen;
  if(n.includes('nature')||n.includes('jungle')||n.includes('resort')||n.includes('bali')) return TRP_VISUALS.jungle;
  if(n.includes('pastel')||n.includes('princess')||n.includes('glam')||n.includes('beauty')||n.includes('makeup')||n.includes('nursery')||n.includes('kids')) return TRP_VISUALS.pastel;
  return TRP_VISUALS.luxury;
}

// Reduce only the STARTING estimate by 20%; preserve the original maximum.
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
.modal-panel{grid-template-columns:minmax(420px,1.05fr) .95fr!important;align-items:stretch!important}.modal-image-wrap{display:block!important;position:relative!important;min-height:590px!important;background:#111!important;overflow:hidden!important}.modal-image-wrap img{display:block!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;min-height:0!important;object-fit:cover!important;object-position:center!important;filter:none!important;image-rendering:auto!important}.modal-gradient{display:block!important}.modal-visual-note{position:absolute;left:18px;top:18px;z-index:2;background:rgba(0,0,0,.72);border:1px solid rgba(255,255,255,.16);border-radius:8px;padding:7px 9px;color:#fff;font-size:.62rem;letter-spacing:.11em;text-transform:uppercase;font-weight:800}
@media(max-width:980px){.modal-panel{grid-template-columns:1fr!important;max-width:720px!important}.modal-image-wrap{min-height:360px!important}}@media(max-width:650px){.room-card{min-height:0}.room-card-content{padding:22px!important}.modal-image-wrap{min-height:280px!important}}
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
  if(wrap){
    wrap.style.display='block';
    wrap.style.background='#111';
    let note=wrap.querySelector('.modal-visual-note');
    if(!note){note=document.createElement('span');note.className='modal-visual-note';note.textContent='Visual inspiration';wrap.appendChild(note);}
  }
  if(img){
    img.style.display='block';
    img.alt=`Visual inspiration for ${r.name}`;
    img.src=trpVisualForRoom(r);
    img.onerror=()=>{
      img.onerror=null;
      img.src=TRP_VISUALS.luxury;
    };
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
const roomsIntro=document.querySelector('#rooms .section-head p');if(roomsIntro)roomsIntro.textContent='Explore the room concepts below for ideas, estimated pricing and possible features. Click any concept to view a sharp visual inspiration image and the full details. Final designs are personalised to the actual room, customer preferences, selected materials and available budget.';
