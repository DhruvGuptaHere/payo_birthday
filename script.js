const messages = [
  "HAPPY BIRTHDAY TO YOU",
];
const rotatingEl = document.getElementById("rotating-text");
let idx = 0;
function showMessage(text){
  rotatingEl.classList.remove("show");
  setTimeout(() => {
    rotatingEl.textContent = text;
    rotatingEl.classList.add("show");
  }, 80);
}
function startCycling(){
  showMessage(messages[idx]);
  idx = (idx + 1) % messages.length;
  setInterval(() => {
    showMessage(messages[idx]);
    idx = (idx + 1) % messages.length;
  }, 2200);
}
window.addEventListener("load", () => {
  setTimeout(() => {
    const intro = document.getElementById("heart-intro");
    intro.style.transition = "opacity 400ms ease";
    intro.style.opacity = "0";
    setTimeout(() => intro.remove(), 420);
    const main = document.getElementById("main-card");
    main.style.display = "block";
    main.style.opacity = 0;
    main.style.transform = "translateY(16px)";
    main.style.transition = "opacity 500ms ease, transform 600ms cubic-bezier(.2,.9,.2,1)";
    requestAnimationFrame(() => {
      main.style.opacity = 1;
      main.style.transform = "translateY(0)";
    });
    startCycling();
    setTimeout(() => {
      showNPC("Click on S in Surprise to begin the journey!");
      highlightCurrent();
    }, 700);
  }, 1700);
});
const surpriseConfig = {
  images: {
    S: "images/payo1.jpeg",  
    U: "images/payo5.jpeg",  
    R: "images/payo2.jpeg",  
    P: "images/payo3.jpeg",  
    R2: "images/payo4.jpeg", 
    I: "images/payo6.jpeg",  
    S2: "images/payo7.jpeg", 
    E: "images/payo8.jpeg"   
  },
  messages: {
    S: "Happy Birthday to my biggest blessing",
    U: "Happy Birthday to the only girl who can steal my heart, my peace, and still make me smile about it",
    R: "Tere muskaan se shuru hota hai mera din, aur tere khayalon par khatam",
    P: "If I could paint happiness, it would look like you smiling on your birthday",
    R2: "If I could gift you one thing, it’d be my eyes — so you could see how special you are to me",
    I: "You’re the melody that makes my heart dance",
    S2: "If beauty were time, you’d be eternity",
    E: "Even the mirror must’ve blushed today"
  }
};
const messagesMap = Object.fromEntries(
  Object.keys(surpriseConfig.messages).map(key => [
    key,
    {
      text: surpriseConfig.messages[key],
      img: surpriseConfig.images[key]
    }
  ])
);
const sequence = ['S','U','R','P','R2','I','S2','E'];
let seqIndex = 0;
const clickedKeys = new Set();
let eClicked = false;
function highlightCurrent(){
  document.querySelectorAll('.letter').forEach(el => el.classList.remove('highlight'));
  const key = sequence[seqIndex];
  const target = document.querySelector(`.letter[data-key="${key}"]`);
  if(target) target.classList.add('highlight');
}
const scrollHint = document.getElementById('scroll-hint');
if(scrollHint){
  scrollHint.addEventListener('click', () => {
    const top = document.getElementById('surprise').offsetTop;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}
document.querySelectorAll('.letter').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.getAttribute('data-key');
    const entry = messagesMap[key];
    if(entry){
      openModal(entry.text, entry.img);
      if(key === sequence[seqIndex]){
        clickedKeys.add(key);
        if(seqIndex < sequence.length - 1){
          seqIndex += 1;
          highlightCurrent();
        } else {
          document.querySelectorAll('.letter').forEach(el => el.classList.remove('highlight'));
        }
      } else {
        showNPC("Please click the highlighted letter to continue the journey.");
      }
      if(key === 'E'){
        eClicked = true;
        showNPC("Scroll down for surprise", { promptScroll: true });
      } else if(key === sequence[seqIndex - 1]){
        showNPC("Nice choice! Keep going — click the next letter.");
      }
    }
  });
});
const scrollMenu = document.getElementById('scroll-menu');
const menuClose = document.getElementById('scroll-menu-close');
const menuContinue = document.getElementById('menu-continue');
function openScrollMenu(){
  if(!scrollMenu) return;
  scrollMenu.setAttribute('aria-hidden','false');
  scrollMenu.classList.add('open');
}
function closeScrollMenu(){
  if(!scrollMenu) return;
  scrollMenu.setAttribute('aria-hidden','true');
  scrollMenu.classList.remove('open');
}
if(menuClose) menuClose.addEventListener('click', closeScrollMenu);
if(menuContinue) menuContinue.addEventListener('click', ()=>{ closeScrollMenu(); window.scrollTo({ top: document.getElementById('surprise').offsetTop, behavior: 'smooth' }); });
const npc = document.getElementById('npc');
const npcBubble = document.getElementById('npc-bubble');
let npcTimeout = null;
function showNPC(text, opts = {}){
  if(!npc) return;
  npcBubble.textContent = text || '';
  npc.setAttribute('aria-hidden','false');
  npc.classList.add('show');
  if(opts.promptScroll && scrollHint){
    scrollHint.classList.add('pulse');
    clearTimeout(npcTimeout);
    npcTimeout = setTimeout(()=> scrollHint.classList.remove('pulse'), 8000);
  }
  if(opts.highlightKeys && Array.isArray(opts.highlightKeys)){
    opts.highlightKeys.forEach(k => {
      const t = document.querySelector(`.letter[data-key="${k}"]`);
      if(t) t.classList.add('highlight');
    });
  } else if(opts.highlightKey){
    const target = document.querySelector(`.letter[data-key="${opts.highlightKey}"]`);
    if(target) target.classList.add('highlight');
  }
  clearTimeout(npcTimeout);
  npcTimeout = setTimeout(()=>{
    if(npc) npc.classList.remove('show');
    npc.setAttribute('aria-hidden','true');
  }, opts.promptScroll ? 9000 : 4200);
}
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalText = document.getElementById('modal-text');
const modalClose = document.getElementById('modal-close');
function openModal(text, img){
  modalImg.src = img || 'images/payoo.jpeg';
  modalText.textContent = text || '';
  modal.setAttribute('aria-hidden','false');
}
function closeModal(){
  modal.setAttribute('aria-hidden','true');
}
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{
  if(e.target === modal || e.target.classList.contains('modal-backdrop')) closeModal();
});
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });
const surpriseSection = document.getElementById('surprise');
