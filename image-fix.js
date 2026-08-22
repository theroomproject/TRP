const TRP_FALLBACK_IMAGE = 'assets/images/trp-room-concepts.jpg';
const TRP_POSITIONS = ['0% 0%','25% 0%','50% 0%','75% 0%','100% 0%','0% 100%','25% 100%','50% 100%','75% 100%','100% 100%'];

// Reduce only the STARTING price of each approximate room range by 20%.
// Example: RM2,000–RM10,000 becomes RM1,600–RM10,000.
const trpOriginalConvertPriceRange = convertPriceRange;
convertPriceRange = function(price){
  const nums=[...price.matchAll(/[\d,]+/g)].map(m=>Number(m[0].replaceAll(',','')));
  if(!nums.length) return price;
  const plus=price.trim().endsWith('+');
  const lower=Math.round(nums[0]*0.8);
  if(nums.length===1) return `${formatMoney(convertMYR(lower))}${plus?'+':''}`;
  return `${formatMoney(convertMYR(lower))}–${formatMoney(convertMYR(nums[1]))}${plus?'+':''}`;
};

const trpCatalogueStyle = document.createElement('style');
trpCatalogueStyle.textContent = `
  .room-card{min-height:285px;display:flex;overflow:hidden;}
  .room-card > img{display:none!important;}
  .room-card-content{display:flex!important;flex-direction:column;flex:1;padding:28px!important;}
  .room-card-content h3{margin-top:14px;}
  .room-card-content p{margin-bottom:18px;}
  .room-card-content button{margin-top:auto;}
  .room-feature-preview{display:flex;flex-wrap:wrap;gap:7px;margin:0 0 22px;padding:0;list-style:none;}
  .room-feature-preview li{font-size:.72rem;line-height:1.2;padding:7px 9px;border:1px solid rgba(255,255,255,.12);border-radius:999px;color:rgba(255,255,255,.72);background:rgba(255,255,255,.035);}
  .room-concept-label{font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:#ff8a24;font-weight:800;}
  .modal-image-wrap{display:block!important;min-height:260px;background:#111;overflow:hidden;}
  .modal-image-wrap img{display:block!important;width:100%;height:100%;min-height:260px;object-fit:cover;}
  @media(max-width:650px){.room-card{min-height:0}.room-card-content{padding:22px!important;}.modal-image-wrap,.modal-image-wrap img{min-height:210px;}}
`;
document.head.appendChild(trpCatalogueStyle);

function renderTRPTextRooms(filter='all'){
  if(typeof roomTypes === 'undefined' || !grid) return;
  const list = filter==='all' ? roomTypes : roomTypes.filter(r=>r.cat===filter);
  grid.innerHTML = list.map((r)=>`<article class="room-card tone-${r.tone}" data-name="${r.name.replaceAll('"','&quot;')}">
    <div class="room-card-content">
      <div class="room-card-top"><span class="room-emoji">${r.emoji}</span><span class="room-price">${convertPriceRange(r.price)}</span></div>
      <span class="room-concept-label">Room concept</span>
      <h3>${r.name}</h3>
      <p>${r.desc}</p>
      <ul class="room-feature-preview">${r.features.slice(0,3).map(f=>`<li>${f}</li>`).join('')}</ul>
      <button type="button" data-room="${encodeURIComponent(r.name)}">View concept image & details <span>→</span></button>
    </div>
  </article>`).join('');
}

function openTRPTextRoom(name){
  if(typeof roomTypes === 'undefined') return;
  const r=roomTypes.find(x=>x.name===name); if(!r) return;
  const index=roomTypes.findIndex(x=>x.name===name);
  const modalImage=document.getElementById('modalImage');
  const imageWrap=modalImage?.closest('.modal-image-wrap');
  if(imageWrap){
    imageWrap.style.display='block';
    imageWrap.style.background='#111';
  }
  if(modalImage){
    modalImage.style.display='block';
    modalImage.src=TRP_FALLBACK_IMAGE + '?v=3';
    modalImage.alt=`Concept inspiration for ${r.name}`;
    modalImage.style.objectFit='cover';
    modalImage.style.objectPosition=TRP_POSITIONS[index % TRP_POSITIONS.length];
  }
  document.getElementById('modalCategory').textContent=r.cat.replace('work','work & create');
  document.getElementById('modalEmoji').textContent=`${r.emoji} ROOM CONCEPT`;
  document.getElementById('modalTitle').textContent=r.name;
  document.getElementById('modalPrice').textContent=`Estimated ${convertPriceRange(r.price)} ${activeCurrency}`;
  document.getElementById('modalDescription').textContent=r.desc;
  document.getElementById('modalFeatures').innerHTML=r.features.map(f=>`<li>${f}</li>`).join('');
  formRoom.value=r.name;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
}

if(typeof renderRooms === 'function') renderRooms = renderTRPTextRooms;
if(typeof openRoom === 'function') openRoom = openTRPTextRoom;

const activeFilter=document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
renderTRPTextRooms(activeFilter);

if(formRoom){
  const selected=formRoom.value;
  formRoom.innerHTML='<option value="">Choose a room type</option>';
  roomTypes.forEach(r=>{const o=document.createElement('option');o.value=r.name;o.textContent=`${r.emoji} ${r.name} — ${convertPriceRange(r.price)}`;formRoom.appendChild(o)});
  if([...formRoom.options].some(o=>o.value===selected)) formRoom.value=selected;
}

const roomsIntro=document.querySelector('#rooms .section-head p');
if(roomsIntro){
  roomsIntro.textContent='Explore the room concepts below for ideas, estimated pricing and possible features. Click any concept to view visual inspiration and the full details. Final designs are personalised to the actual room, customer preferences, selected materials and available budget.';
}

const modalImage=document.getElementById('modalImage');
if(modalImage){
  modalImage.addEventListener('error',()=>{
    const wrap=modalImage.closest('.modal-image-wrap');
    if(wrap){
      wrap.style.display='block';
      wrap.style.background='linear-gradient(135deg,#161616,#2b1608 55%,#0d0d0d)';
    }
    modalImage.style.display='none';
  });
}
