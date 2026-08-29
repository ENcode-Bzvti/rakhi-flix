/* =========================================================
   RAKHI FLIX — main script
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const introSound = document.getElementById('intro-sound');
  const music = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-toggle');

  let introDone = false;
  let musicPlaying = false;
  let userMuted = false;

  function reallyPlayBgMusic(){
    music.play().then(() => {
      musicPlaying = true;
      musicBtn.textContent = '🔊';
    }).catch(() => { });
  }

  function startBgMusic(){
    if(musicPlaying || userMuted) return;
    reallyPlayBgMusic();
  }

  musicBtn.addEventListener('click', () => {
    if(!musicPlaying){
      userMuted = false;
      reallyPlayBgMusic();
    } else {
      music.pause();
      musicPlaying = false;
      userMuted = true;
      musicBtn.textContent = '🔇';
    }
  });

  const gate = document.getElementById('sound-gate');
  const gateYes = document.getElementById('gate-yes');
  const gateNo = document.getElementById('gate-no');
  const intro = document.getElementById('netflix-intro');

  function closeGate(wantsSound){
    userMuted = !wantsSound;
    gate.style.transition = 'opacity .35s ease';
    gate.style.opacity = '0';
    setTimeout(() => {
      gate.style.display = 'none';
      intro.hidden = false;
      if(wantsSound) introSound.play().catch(() => {});
      startIntroTimer();
    }, 350);
  }

  gateYes.addEventListener('click', () => closeGate(true));
  gateNo.addEventListener('click', () => closeGate(false));

  const app = document.getElementById('app');
  const skipBtn = document.getElementById('skip-intro');

  function endIntro(){
    if(introDone) return;
    introDone = true;
    introSound.pause();
    intro.style.transition = 'opacity .5s ease';
    intro.style.opacity = '0';
    setTimeout(() => {
      intro.style.display = 'none';
      app.hidden = false;
      startBgMusic(); 
    }, 500);
  }

  skipBtn.addEventListener('click', endIntro);

  function startIntroTimer(){
    setTimeout(endIntro, 3600); 
  }

  const screens = document.querySelectorAll('.screen');
  function showScreen(id){
    screens.forEach(s => s.classList.toggle('active', s.id === id));
    window.scrollTo({ top:0, behavior:'smooth' });
    if(id === 'final-message'){ startConfetti(); }
  }

  // Listens to clicks on both .person-card and .sister-card classes
  document.querySelectorAll('.person-card, .sister-card').forEach(card => {
    card.addEventListener('click', () => showScreen(card.dataset.target));
  });

  document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => showScreen('select-screen'));
  });

  document.querySelectorAll('.cta-final').forEach(btn => {
    btn.addEventListener('click', () => showScreen('final-message'));
  });

  const goSelectAgain = document.getElementById('go-select-again');
  if(goSelectAgain){
    goSelectAgain.addEventListener('click', () => showScreen('select-screen'));
  }

  const canvas = document.getElementById('confetti-canvas');
  const ctx2d = canvas.getContext('2d');
  let confettiRunning = false;
  const pieces = [];
  const emojiSet = ['🧵','🎉','🪢','💛','🐱','😹','✨'];

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function startConfetti(){
    if(confettiRunning) return;
    confettiRunning = true;
    for(let i=0;i<45;i++){
      pieces.push({
        x: Math.random()*canvas.width,
        y: -20 - Math.random()*canvas.height,
        speed: 1.5 + Math.random()*2.5,
        drift: (Math.random()-0.5)*1.5,
        size: 16 + Math.random()*14,
        emoji: emojiSet[Math.floor(Math.random()*emojiSet.length)],
        spin: Math.random()*360,
        spinSpeed: (Math.random()-0.5)*4
      });
    }
    requestAnimationFrame(animateConfetti);
    setTimeout(() => { confettiRunning = false; }, 8000);
  }

  function animateConfetti(){
    ctx2d.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p => {
      p.y += p.speed;
      p.x += p.drift;
      p.spin += p.spinSpeed;
      if(p.y > canvas.height + 30){
        p.y = -30;
        p.x = Math.random()*canvas.width;
      }
      ctx2d.save();
      ctx2d.translate(p.x, p.y);
      ctx2d.rotate(p.spin * Math.PI/180);
      ctx2d.font = `${p.size}px sans-serif`;
      ctx2d.textAlign = 'center';
      ctx2d.fillText(p.emoji, 0, 0);
      ctx2d.restore();
    });
    const finalScreen = document.getElementById('final-message');
    if(finalScreen.classList.contains('active')){
      requestAnimationFrame(animateConfetti);
    } else {
      ctx2d.clearRect(0,0,canvas.width,canvas.height);
    }
  }
});