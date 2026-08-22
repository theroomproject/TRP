const TRP_FALLBACK_IMAGE = 'assets/images/room-gallery.jpg';
const TRP_POSITIONS = ['0% 0%','25% 0%','50% 0%','75% 0%','100% 0%','0% 100%','25% 100%','50% 100%','75% 100%','100% 100%'];

// Keep the main catalogue intentionally text-first. Concept visuals only appear
// after a visitor chooses a room and opens its details.
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
  @media(max-width:650px){.room-card{min-height:0}.room-card-content{padding:22px!important;}}
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
  modalImage.src=TRP_FALLBACK_IMAGE;
  modalImage.alt=`Concept inspiration for ${r.name}`;
  modalImage.style.objectFit='cover';
  modalImage.style.objectPosition=TRP_POSITIONS[index % TRP_POSITIONS.length];
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

// Replace the original image-heavy catalogue renderer and modal opener.
if(typeof renderRooms === 'function') renderRooms = renderTRPTextRooms;
if(typeof openRoom === 'function') openRoom = openTRPTextRoom;

const activeFilter=document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
renderTRPTextRooms(activeFilter);

// Update the catalogue introduction to match the cleaner text-first experience.
const roomsIntro=document.querySelector('#rooms .section-head p');
if(roomsIntro){
  roomsIntro.textContent='Explore the room concepts below for ideas, estimated pricing and possible features. Click any concept to view visual inspiration and the full details. Final designs are personalised to the actual room, customer preferences, selected materials and available budget.';
}

// If the fallback visual itself ever fails, keep the details usable rather than
// showing a broken-image icon.
const modalImage=document.getElementById('modalImage');
if(modalImage){
  modalImage.addEventListener('error',()=>{
    modalImage.removeAttribute('src');
    modalImage.alt='Concept image temporarily unavailable';
    const wrap=modalImage.closest('.modal-image-wrap');
    if(wrap) wrap.style.display='none';
  });
}
