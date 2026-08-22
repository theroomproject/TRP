const TRP_FALLBACK_IMAGE = 'assets/images/room-gallery.jpg';
const TRP_POSITIONS = ['0% 0%','25% 0%','50% 0%','75% 0%','100% 0%','0% 100%','25% 100%','50% 100%','75% 100%','100% 100%'];

function fixTRPImages(){
  document.querySelectorAll('.room-card').forEach((card, index)=>{
    const img=card.querySelector('img');
    if(!img) return;
    if(!img.dataset.trpFallbackBound){
      img.dataset.trpFallbackBound='1';
      img.addEventListener('error', ()=>{
        img.src = TRP_FALLBACK_IMAGE;
        img.style.objectFit='cover';
        img.style.objectPosition=TRP_POSITIONS[index % TRP_POSITIONS.length];
      }, {once:true});
    }
    if(img.getAttribute('src')?.startsWith('assets/images/') && img.getAttribute('src')?.endsWith('.webp') && !img.src.includes('trp_modern_room_project_logo')){
      img.src = TRP_FALLBACK_IMAGE;
      img.style.objectFit='cover';
      img.style.objectPosition=TRP_POSITIONS[index % TRP_POSITIONS.length];
    }
  });

  const modal=document.getElementById('roomModal');
  const modalImg=document.getElementById('modalImage');
  if(modal?.classList.contains('open') && modalImg){
    if(modalImg.getAttribute('src')?.endsWith('.webp')){
      modalImg.src=TRP_FALLBACK_IMAGE;
      modalImg.style.objectFit='cover';
    }
  }
}
const trpImageObserver=new MutationObserver(()=>requestAnimationFrame(fixTRPImages));
const trpGrid=document.getElementById('roomGrid');
if(trpGrid) trpImageObserver.observe(trpGrid,{childList:true,subtree:true});
document.addEventListener('click',()=>setTimeout(fixTRPImages,0));
window.addEventListener('load',fixTRPImages);
fixTRPImages();
