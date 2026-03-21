/* ============================================================
   CIRO & VINCENZA — SCRIPT.JS
   Tutte le animazioni e interazioni del sito romantico
   ============================================================ */

'use strict';

// ── COSTANTI ─────────────────────────────────────────────────
const RELATIONSHIP_START = new Date('2022-08-24T21:00:00'); // Modifica l'ora se vuoi
const SECRET_PASSWORD    = 'cheschifo';
const NAME_CORRECT       = 'topino';

// ★★★ LETTERA SEGRETA ★★★
// Modifica qui il testo della lettera romantica segreta
const SECRET_LETTER = `Amore mio,

se stai leggendo questo, significa che hai trovato il posto più nascosto di questo sito.

Voglio che tu sappia una cosa: non esistono litigi abbastanza grandi da farmi smettere di amarti. Nessuna parola detta nel momento sbagliato può cancellare quello che sento quando ti guardo.

Ti amo quando sei felice, ti amo quando sei silenziosa, ti amo quando ti arrabbi
Sei la persona con cui voglio costruire tutto. Ogni viaggio, ogni Natale, ogni domenica mattina, ogni momento stupido che poi diventa un ricordo.

Non sono perfetto. Ma sono tuo, completamente.

Con tutto l'amore che ho,
Ciro ❤️`;

// ============================================================
// 1. PARTICLE CANVAS (intro background)
// ============================================================

(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createParticle() {
    return {
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 1.5 + 0.3,
      vx:   (Math.random() - 0.5) * 0.2,
      vy:   -(Math.random() * 0.3 + 0.1),
      a:    Math.random() * 0.5 + 0.1,
    };
  }

  for (let i = 0; i < 90; i++) particles.push(createParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${p.a})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -5) { Object.assign(p, createParticle(), { y: H + 5 }); }
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ============================================================
// 2. INTRO / ACCESSO
// ============================================================

(function initIntro() {
  const introScreen  = document.getElementById('intro-screen');
  const introLogo    = document.getElementById('intro-logo');
  const accessForm   = document.getElementById('access-form');
  const welcomeMsg   = document.getElementById('welcome-msg');
  const nameInput    = document.getElementById('name-input');
  const nameSubmit   = document.getElementById('name-submit');
  const nameError    = document.getElementById('name-error');
  const startBtn     = document.getElementById('start-journey');
  const mainSite     = document.getElementById('main-site');

  // Mostra il form dopo animazione iniziale
  setTimeout(() => {
    introLogo.style.opacity = '0';
    introLogo.style.transition = 'opacity 0.8s ease';
    setTimeout(() => {
      introLogo.classList.add('hidden');
      accessForm.classList.remove('hidden');
      nameInput.focus();
    }, 800);
  }, 2200);
/*
  function checkName() {
    const val = nameInput.value.trim().toLowerCase();
    if (val === NAME_CORRECT) {
      accessForm.classList.add('hidden');
      welcomeMsg.classList.remove('hidden');
      launchHeartsIntro();
    } else if (val.length > 0) {
      nameError.classList.remove('hidden');
      nameInput.classList.add('shake');
      setTimeout(() => nameInput.classList.remove('shake'), 600);
    }
  }
*/

function checkName() {
    const val = nameInput.value.trim().toLowerCase();
    if (val === NAME_CORRECT) {
      accessForm.classList.add('hidden');
      welcomeMsg.classList.remove('hidden');
      launchHeartsIntro();
    } else if (val === 'vincenza') {
      nameError.textContent = 'Non è vero, tu non ti chiami Vincenza... ti chiami To....? 🤔🐁';
      nameError.classList.remove('hidden');
      nameInput.value = '';
    } else if (val.length > 0) {
      nameError.textContent = 'Questo sito è stato creato per una persona speciale...';
      nameError.classList.remove('hidden');
      nameInput.classList.add('shake');
      setTimeout(() => nameInput.classList.remove('shake'), 600);
    }
  }
  nameSubmit.addEventListener('click', checkName);
  nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') checkName(); });

  startBtn.addEventListener('click', () => {
    introScreen.classList.add('fade-out');
    mainSite.classList.remove('hidden');
    document.body.style.overflowY = 'auto';
    setTimeout(() => {
      introScreen.remove();
      startBgMusic();
      startFloatingHearts();
      initCounter();
    }, 1200);
  });

  // Blocca scroll durante intro
  document.body.style.overflowY = 'hidden';
})();

/*
// MODALITÀ DEV
document.getElementById('intro-screen').style.display = 'none';
document.getElementById('main-site').classList.remove('hidden');
document.body.style.overflowY = 'auto';
setTimeout(() => { startFloatingHearts(); initCounter(); }, 300);
*/
// ============================================================
// 3. HEARTS INTRO (pioggia veloce alla conferma nome)
// ============================================================
function launchHeartsIntro() {
  for (let i = 0; i < 30; i++) {
    setTimeout(() => spawnBgHeart(true), i * 60);
  }
}

function spawnBgHeart(fast) {
  const container = document.getElementById('hearts-bg') || document.getElementById('intro-screen');
  const el = document.createElement('span');
  el.className = 'bg-heart';
  el.textContent = Math.random() > 0.5 ? '❤' : '♥';
  el.style.left   = `${Math.random() * 100}vw`;
  el.style.fontSize = `${Math.random() * 1.2 + 0.6}rem`;
  el.style.animationDuration = `${fast ? Math.random() * 3 + 2 : Math.random() * 8 + 6}s`;
  el.style.animationDelay   = `${Math.random() * 2}s`;
  el.style.opacity = '0';
  container.appendChild(el);
  setTimeout(() => el.remove(), fast ? 6000 : 14000);
}

// ============================================================
// 4. FLOATING HEARTS (persistenti in background)
// ============================================================
function startFloatingHearts() {
  function spawnCycle() {
    spawnBgHeart(false);
    setTimeout(spawnCycle, Math.random() * 2200 + 800);
  }
  spawnCycle();
}

// ============================================================
// 5. AUDIO — avvio dopo l'intro
// ============================================================
function startBgMusic() {
  const audio  = document.getElementById('bg-music');
  const toggle = document.getElementById('music-toggle');
  const icon   = document.getElementById('music-icon');
  const label  = toggle.querySelector('.music-label');

  if (!audio) return;

  audio.volume = 0.55;

  // Prova l'autoplay (i browser moderni lo bloccano spesso)
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      icon.classList.add('playing');
      label.textContent = '♪ Completamente';
    }).catch(() => {
      // Autoplay bloccato — l'utente deve cliccare il player
      label.textContent = 'Premi per ascoltare';
    });
  }

  toggle.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      icon.classList.add('playing');
      label.textContent = '♪ Completamente';
    } else {
      audio.pause();
      icon.classList.remove('playing');
      label.textContent = 'Musica in pausa';
    }
  });
}

// ============================================================
// 6. SCROLL REVEAL (Intersection Observer)
// ============================================================
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger per elementi multipli
        entry.target.style.transitionDelay = `${i * 0.07}s`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ============================================================
// 7. CONTATORE (giorni, ore, minuti, secondi + poetico)
// ============================================================
function initCounter() {
  const elDays    = document.getElementById('cnt-days');
  const elHours   = document.getElementById('cnt-hours');
  const elMinutes = document.getElementById('cnt-minutes');
  const elSeconds = document.getElementById('cnt-seconds');
  const elPoetic  = document.getElementById('poetic-counter');

  function update() {
    const now  = new Date();
    const diff = now - RELATIONSHIP_START;

    const totalSeconds = Math.floor(diff / 1000);
    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (elDays)    elDays.textContent    = days.toLocaleString('it-IT');
    if (elHours)   elHours.textContent   = String(hours).padStart(2, '0');
    if (elMinutes) elMinutes.textContent = String(minutes).padStart(2, '0');
    if (elSeconds) elSeconds.textContent = String(seconds).padStart(2, '0');

    // Contatore poetico
    if (elPoetic) {
      elPoetic.textContent = `${days.toLocaleString('it-IT')} giorni in cui sei stata la mia casa`;
    }
  }

  update();
  setInterval(update, 1000);
}

// ============================================================
// 8. GALLERY MULTI-ANNO (4 caroselli indipendenti)
// ============================================================
(function initGalleries() {
  function initSingleGallery(n) {
    const track   = document.getElementById(`gallery-track-${n}`);
    const dotsEl  = document.getElementById(`gallery-dots-${n}`);
    const prevBtn = document.querySelector(`.gallery-prev[data-track="${n}"]`);
    const nextBtn = document.querySelector(`.gallery-next[data-track="${n}"]`);

    if (!track) return;

    const slides = track.querySelectorAll('.gallery-slide');
    const total  = slides.length;
    let current  = 0, startX = 0, isDragging = false;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    });

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, total - 1));
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsEl.querySelectorAll('.gallery-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));

    function getX(e) { return e.touches ? e.touches[0].clientX : e.clientX; }

    track.addEventListener('touchstart', e => { startX = getX(e); isDragging = true; }, { passive: true });
    track.addEventListener('mousedown',  e => { startX = getX(e); isDragging = true; track.style.cursor = 'grabbing'; });
    track.addEventListener('touchmove',  e => {}, { passive: true });
    track.addEventListener('mouseup',    handleEnd);
    track.addEventListener('touchend',   handleEnd);
    track.addEventListener('mouseleave', handleEnd);

    function handleEnd(e) {
      if (!isDragging) return;
      isDragging = false;
      track.style.cursor = '';
      const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const moved = endX - startX;
      if (moved < -50) goTo(current + 1);
      else if (moved > 50) goTo(current - 1);
      else goTo(current);
    }
  }

  [1, 2, 3, 4].forEach(initSingleGallery);
})();

/*

// ============================================================
// 9. MAPPA — TOOLTIP SUI PIN
// ============================================================
(function initMap() {
  const tooltip   = document.getElementById('map-tooltip');
  const cityEl    = document.getElementById('tooltip-city');
  const descEl    = document.getElementById('tooltip-desc');
  const mapEl     = document.getElementById('love-map');
  const container = document.querySelector('.map-container');

  if (!mapEl || !tooltip) return;

  mapEl.querySelectorAll('.map-pin').forEach(pin => {
    pin.addEventListener('mouseenter', e => {
      cityEl.textContent = pin.dataset.city;
      descEl.textContent = pin.dataset.desc;
      tooltip.classList.remove('hidden');
    });

    pin.addEventListener('mousemove', e => {
      const rect = container.getBoundingClientRect();
      let x = e.clientX - rect.left + 10;
      let y = e.clientY - rect.top - 40;
      // Evita che esca dai bordi
      if (x + 160 > rect.width) x -= 170;
      if (y < 0) y = 10;
      tooltip.style.left = x + 'px';
      tooltip.style.top  = y + 'px';
    });

    pin.addEventListener('mouseleave', () => {
      tooltip.classList.add('hidden');
    });

    // Touch su mobile
    pin.addEventListener('click', () => {
      cityEl.textContent = pin.dataset.city;
      descEl.textContent = pin.dataset.desc;
      tooltip.classList.remove('hidden');
      setTimeout(() => tooltip.classList.add('hidden'), 2500);
    });
  });
})();

*/

// ============================================================
// 10. REASON CARDS — FLIP AL CLICK (mobile friendly)
// ============================================================
(function initReasonCards() {
  document.querySelectorAll('.reason-card').forEach(card => {
    function toggle() { card.classList.toggle('flipped'); }
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') toggle(); });
  });
})();

// ============================================================
// 11. PROMESSE — TYPEWRITER EFFECT (scroll-triggered)
// ============================================================
(function initPromises() {
  const items = document.querySelectorAll('.promise-text');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.dataset.text || '';
        typeWrite(el, text, 28);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  items.forEach(el => observer.observe(el));

  function typeWrite(el, text, speed) {
    let i = 0;
    el.textContent = '';
    const timer = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
  }
})();

// ============================================================
// 12. PAGINA SEGRETA — PASSWORD + TYPEWRITER LETTERA
// ============================================================
(function initSecret() {
  const input   = document.getElementById('secret-input');
  const submit  = document.getElementById('secret-submit');
  const errMsg  = document.getElementById('secret-error');
  const content = document.getElementById('secret-content');
  const letterEl= document.getElementById('secret-letter');

  if (!input) return;

  function checkPassword() {
    if (input.value.trim().toLowerCase() === SECRET_PASSWORD) {
      input.closest('.secret-form').classList.add('hidden');
      content.classList.remove('hidden');
      // Lancia il typewriter effect sulla lettera
      typeWriteLetter(letterEl, SECRET_LETTER, 22);
    } else {
      errMsg.classList.remove('hidden');
      input.value = '';
      input.focus();
    }
  }

  submit?.addEventListener('click', checkPassword);
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') checkPassword(); });

  function typeWriteLetter(el, text, speed) {
    let i = 0;
    el.textContent = '';
    function step() {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
        setTimeout(step, speed);
      } else {
        // Rimuove il cursore lampeggiante al termine
        el.classList.remove('typewriter-letter');
      }
    }
    step();
  }
})();

// ============================================================
// 13. GRAN FINALE — ESPLOSIONE CUORI + VINCENZA + EASTER EGG
// ============================================================
(function initFinale() {
  const loveBtn       = document.getElementById('love-btn');
  const finaleCanvas  = document.getElementById('finale-canvas');
  const vincenzaEl    = document.getElementById('vincenza-letters');
  const easterEggMsg  = document.getElementById('easter-egg-msg');

  if (!loveBtn) return;

  let ctx, W, H, particles = [], animating = false;
  let longPressTimer = null;

  // Setup canvas
  if (finaleCanvas) {
    ctx = finaleCanvas.getContext('2d');
    function resize() {
      W = finaleCanvas.width  = finaleCanvas.offsetWidth  || window.innerWidth;
      H = finaleCanvas.height = finaleCanvas.offsetHeight || window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
  }

  // Click normale → esplosione cuori
  loveBtn.addEventListener('click', () => {
    if (!animating) launchFireworks();
  });

  // EASTER EGG — tieni premuto 3 secondi
  function startLongPress() {
    longPressTimer = setTimeout(() => {
      showEasterEgg();
    }, 3000);
  }

  function cancelLongPress() {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  loveBtn.addEventListener('mousedown',  startLongPress);
  loveBtn.addEventListener('touchstart', startLongPress, { passive: true });
  loveBtn.addEventListener('mouseup',    cancelLongPress);
  loveBtn.addEventListener('mouseleave', cancelLongPress);
  loveBtn.addEventListener('touchend',   cancelLongPress);

  function showEasterEgg() {
    easterEggMsg.classList.remove('hidden');
    easterEggMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    for (let i = 0; i < 20; i++) {
      setTimeout(() => spawnBgHeart(true), i * 80);
    }
  }

  // ── FIREWORKS DI CUORI ──────────────────────────────────────
  function launchFireworks() {
    if (!ctx) return;
    animating = true;

    // Prima mostra la frase animata, poi i fuochi durano 12 secondi
    showFrase(() => {
      // Ondate di burst prolungate
      for (let i = 0; i < 18; i++) {
        setTimeout(() => {
          burst(
            W * (0.1 + Math.random() * 0.8),
            H * (0.1 + Math.random() * 0.7),
            Math.floor(Math.random() * 22 + 18)
          );
        }, i * 600);
      }

      requestAnimationFrame(animateParticles);

      setTimeout(() => {
        animating = false;
      }, 14000);
    });
  }

  function showFrase(cb) {
    if (!vincenzaEl) { cb && cb(); return; }
    vincenzaEl.innerHTML = '';
    vincenzaEl.classList.remove('hidden');

    // Overlay scuro dietro il testo
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed; inset:0; z-index:49;
      background:rgba(0,0,0,0.72);
      backdrop-filter:blur(3px);
      animation:fadeIn 0.5s ease forwards;
    `;
    document.body.appendChild(overlay);

    // Frase al centro
    const frase = document.createElement('div');
    frase.style.cssText = `
      position:fixed; inset:0; z-index:51;
      display:flex; align-items:center; justify-content:center;
      padding:2rem; text-align:center;
      pointer-events:none;
    `;
    frase.innerHTML = `<p style="
      font-family:'Great Vibes',cursive;
      font-size:clamp(2rem,7vw,4.5rem);
      color:#e0c070;
      text-shadow:0 0 40px rgba(201,168,76,0.5), 0 2px 8px rgba(0,0,0,0.8);
      line-height:1.35;
      animation:letterAppear 0.7s ease forwards;
    ">Per tutti i millemila motivi per cui litighiamo incomprensioni e caratterini<br/>Millemila+1 motivi per restare insieme ed amarci come solo noi sappiamo fare<br/> sei la mia vita e senza te non riuscirei a vivere.. <br/> Ti Amo Amore Mio ❤️</p>`;
    document.body.appendChild(frase);

    // Resta visibile 4 secondi, poi sfuma e parte l'esplosione
    const visibleMs = 13000;
    setTimeout(() => {
      frase.style.transition   = 'opacity 1s ease';
      overlay.style.transition = 'opacity 1s ease';
      frase.style.opacity   = '0';
      overlay.style.opacity = '0';
      setTimeout(() => {
        frase.remove();
        overlay.remove();
        vincenzaEl.classList.add('hidden');
        cb && cb();
      }, 1000);
    }, visibleMs);
  }

  // Crea un burst di cuori
  function burst(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle  = (Math.PI * 2 / count) * i + (Math.random() * 0.4);
      const speed  = Math.random() * 7 + 3;
      const size   = Math.random() * 22 + 10;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size,
        alpha: 1,
        decay: Math.random() * 0.005 + 0.003,
        gravity: 0.12,
        color: Math.random() > 0.5 ? '#9b1c2e' : '#c9a84c',
      });
    }
  }

  function drawHeart(ctx, x, y, size, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const s = size * 0.035;
    ctx.bezierCurveTo(x,       y - s*4,  x - s*7, y - s*8, x - s*7, y - s*4);
    ctx.bezierCurveTo(x - s*7, y - s*0,  x,       y + s*5, x,       y + s*5);
    ctx.bezierCurveTo(x,       y + s*5,  x + s*7, y - s*0, x + s*7, y - s*4);
    ctx.bezierCurveTo(x + s*7, y - s*8,  x,       y - s*4, x,       y);
    ctx.fill();
    ctx.restore();
  }

  function animateParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    particles = particles.filter(p => p.alpha > 0);

    particles.forEach(p => {
      p.x      += p.vx;
      p.y      += p.vy;
      p.vy     += p.gravity;
      p.alpha  -= p.decay;
      p.vx     *= 0.99;
      drawHeart(ctx, p.x, p.y, p.size, p.color, Math.max(0, p.alpha));
    });

    if (particles.length > 0) {
      requestAnimationFrame(animateParticles);
    } else {
      ctx.clearRect(0, 0, W, H);
    }
  }
})();

// ============================================================
// 14. SHAKE UTILITY (CSS)
// ============================================================
(function addShakeStyle() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-8px); }
      40%      { transform: translateX(8px); }
      60%      { transform: translateX(-5px); }
      80%      { transform: translateX(5px); }
    }
    .shake { animation: shake 0.5s ease; }
  `;
  document.head.appendChild(style);
})();

// ============================================================
// 15. LETTERE NEL TEMPO — shuffle + modal
// ============================================================
(function initLetters() {
  const grid = document.getElementById('letters-grid');
  const modal = document.getElementById('letter-modal');
  const modalDate = document.getElementById('modal-date');
  const modalTitle = document.getElementById('modal-title');
  const modalText = document.getElementById('modal-text');
  const modalClose = document.getElementById('letter-modal-close');
  const backdrop = modal?.querySelector('.letter-modal-backdrop');

  if (!grid || !modal) return;

  // Shuffle casuale delle card
  const cards = Array.from(grid.querySelectorAll('.letter-card'));
  cards.sort(() => Math.random() - 0.5);
  cards.forEach(c => grid.appendChild(c));

  function openModal(card) {
    modalDate.textContent  = card.dataset.date  || '';
    modalTitle.textContent = card.dataset.title || '';
    modalText.textContent  = card.querySelector('.letter-full-text')?.textContent?.trim() || '';
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  cards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openModal(card); });
  });

  modalClose?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

// ============================================================
// 16. QUIZ
// ============================================================
(function initQuiz() {
  // ★★★ DOMANDE DEL QUIZ ★★★
  // Modifica le domande, le opzioni e l'indice della risposta corretta (0,1,2)
  const questions = [
    {
      q: "Chi è che subito ha perso la testa per l'altro?",
      options: ['Tutti e due', 'Enza', 'Ciro'],
      correct: 1,
      feedback: ['Quasi... ma no 😅', 'Esatto! ❤️', 'Ma che diciii😄']
    },
    {
      q: 'Qual è stato il mio regalo per il secondo Anniversario?',
      options: ['Cuscino', 'Orecchini', 'Collana'],
      correct: 1,
      feedback: ['Ma noo, quello era per il tuo compleanno 😅', 'SII, che però ti ho dovuto pregare per farteli mettere un pò😄 ', 'Aee e patan🥔']
    },
    {
      q: 'Cosa fa Enza quando si arrabbia per il nulla?',
      options: ['Fa un pompino per farsi perdonare', 'Chiede scusa', 'Non ammette mai che ha sbagliato'],
      correct: 2,
      feedback: ['Se magarii! 😍', 'See magarii!😍', "Bravaaaaa. ma non penso che l'hai cliccata come prima opzione 🫤"]
    },
    {
      q: 'Chi è il più geloso tra i due?',
      options: ['Enza', 'Ciro', 'Tutti e due allo stesso modo'],
      correct: 0,
      feedback: ['Ecco ammettilo pazzarella!💘', 'Assolutamente no! dici verità 😠', 'Ma che diciiiiii😠 dici verità']
    },
    {
      q: 'La tua esclamazione quando lo hai visto per la prima volta',
      options: ['Come è piccoloo!', 'Come è belloo!', 'Come è grosso!'],
      correct: 2,
      feedback: ['Te piacess 🍆', 'No, ma è vero anche questo 🍆😄', 'ESATTAMENTE 🔥🍆']
    },
    {
      q: 'La targa della mia Panda',
      options: ['EK172HW', 'EH172WH', 'EH172HW'],
      correct: 0,
      feedback: ['Sì!❤️', 'Quasi... ma no 😅', 'Quasi... ma no 😅']
    },
    {
      q: 'Il mio peso attuale',
      options: ['73', '75', '77'],
      correct: 0,
      feedback: ['Woow, bravissima!❤️', 'Mhh, No ma ci sei andata vicino 😄', 'Non sono così chiatto 😂']
    }
  ];

  const scoreMessages = [
    { min: 0, max: 2, emoji: '😅', text: '0-2 su 7', msg: 'Ciro è un po\' deluso... ma ti ama lo stesso.. forse 😂' },
    { min: 3, max: 5, emoji: '😏', text: '3-5 su 7', msg: 'Non malissimo...Ti potevi impegnare di più! Conosco la mia polla... 😄' },
    { min: 6, max: 6, emoji: '😍', text: '6 su 7',   msg: 'Quasi perfetta! Ma ti metto lo stesso 18 perchè erano facili..🌹❤️' },
    { min: 7, max: 7, emoji: '🏆', text: '7 su 7!',  msg: 'Perfetta! Mi hai sorpeso.. spero che non hai barato. Ti amo ❤️' },
  ];

  const playEl    = document.getElementById('quiz-play');
  const resultEl  = document.getElementById('quiz-result');
  const questionEl= document.getElementById('quiz-question');
  const optionsEl = document.getElementById('quiz-options');
  const counterEl = document.getElementById('quiz-counter');
  const fillEl    = document.getElementById('quiz-progress-fill');
  const feedbackEl= document.getElementById('quiz-feedback');
  const restartBtn= document.getElementById('quiz-restart');

  if (!playEl) return;

  let current = 0, score = 0;

  function loadQuestion() {
    const q = questions[current];
    counterEl.textContent = `Domanda ${current + 1} di ${questions.length}`;
    fillEl.style.width    = `${(current / questions.length) * 100}%`;
    questionEl.textContent = q.q;
    feedbackEl.textContent = '';
    optionsEl.innerHTML    = '';

    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => answer(i));
      optionsEl.appendChild(btn);
    });
  }

  function answer(idx) {
    const q    = questions[current];
    const btns = optionsEl.querySelectorAll('.quiz-option');
    btns.forEach(b => b.disabled = true);
    btns[idx].classList.add(idx === q.correct ? 'correct' : 'wrong');
    if (idx === q.correct) {
      score++;
      btns[q.correct].classList.add('correct');
    } else {
      btns[q.correct].classList.add('correct');
    }
    feedbackEl.textContent = q.feedback[idx];

    setTimeout(() => {
      current++;
      if (current < questions.length) loadQuestion();
      else showResult();
    }, 1600);
  }

  function showResult() {
    fillEl.style.width = '100%';
    playEl.classList.add('hidden');
    resultEl.classList.remove('hidden');
    const s = scoreMessages.find(m => score >= m.min && score <= m.max);
    document.getElementById('quiz-score-emoji').textContent = s.emoji;
    document.getElementById('quiz-score-text').textContent  = s.text;
    document.getElementById('quiz-score-msg').textContent   = s.msg;
  }

  restartBtn?.addEventListener('click', () => {
    current = 0; score = 0;
    resultEl.classList.add('hidden');
    playEl.classList.remove('hidden');
    loadQuestion();
  });

  loadQuestion();
})();

// ============================================================
// 17. MEMORY ROMANTICO
// ============================================================
(function initMemory() {
  const grid    = document.getElementById('memory-grid');
  const movesEl = document.getElementById('memory-moves');
  const winEl   = document.getElementById('memory-win');
  const restart = document.getElementById('memory-restart');

  if (!grid) return;

  // ★★★ PAROLE/EMOJI DEL MEMORY ★★★ — 6 coppie
  const pairs = ['💌', '🎸', '🌊', '✈️', '🎻', '🌙'];

  let moves = 0, flipped = [], matched = 0, locked = false;

  function build() {
    moves = 0; flipped = []; matched = 0; locked = false;
    movesEl.textContent = 'Mosse: 0';
    winEl.classList.add('hidden');
    grid.innerHTML = '';

    const deck = [...pairs, ...pairs].sort(() => Math.random() - 0.5);

    deck.forEach((emoji, i) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.value = emoji;
      card.innerHTML = `
        <div class="memory-card-inner">
          <div class="memory-card-back">❤</div>
          <div class="memory-card-front">${emoji}</div>
        </div>`;
      card.addEventListener('click', () => flipCard(card));
      grid.appendChild(card);
    });
  }

  function flipCard(card) {
    if (locked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    flipped.push(card);

    if (flipped.length === 2) {
      locked = true;
      moves++;
      movesEl.textContent = `Mosse: ${moves}`;
      const [a, b] = flipped;
      if (a.dataset.value === b.dataset.value) {
        a.classList.add('matched'); b.classList.add('matched');
        matched++;
        flipped = []; locked = false;
        if (matched === pairs.length) {
          setTimeout(() => winEl.classList.remove('hidden'), 400);
        }
      } else {
        setTimeout(() => {
          a.classList.remove('flipped'); b.classList.remove('flipped');
          flipped = []; locked = false;
        }, 900);
      }
    }
  }

  restart?.addEventListener('click', build);
  build();
})();

// ============================================================
// 18. LASCIAMI UN MESSAGGIO (localStorage)
// ============================================================
(function initBottle() {
  const textarea  = document.getElementById('bottle-textarea');
  const saveBtn   = document.getElementById('bottle-save');
  const formWrap  = document.getElementById('bottle-form-wrapper');
  const savedWrap = document.getElementById('bottle-saved');
  const savedText = document.getElementById('bottle-saved-text');
  const editBtn   = document.getElementById('bottle-edit');

  if (!textarea) return;

  const KEY = 'ciro_vincenza_message';

  function load() {
    const saved = localStorage.getItem(KEY);
    if (saved) {
      savedText.textContent = saved;
      formWrap.classList.add('hidden');
      savedWrap.classList.remove('hidden');
    }
  }

  saveBtn?.addEventListener('click', () => {
    const val = textarea.value.trim();
    if (!val) return;
    localStorage.setItem(KEY, val);
    savedText.textContent = val;
    formWrap.classList.add('hidden');
    savedWrap.classList.remove('hidden');
  });

  editBtn?.addEventListener('click', () => {
    textarea.value = localStorage.getItem(KEY) || '';
    savedWrap.classList.add('hidden');
    formWrap.classList.remove('hidden');
    textarea.focus();
  });

  load();
})();

// ============================================================
// 19. DADO — COSA FAREMO INSIEME
// ============================================================
(function initDice() {
  const diceEl    = document.getElementById('dice');
  const proposalEl= document.getElementById('dice-proposal');
  const rollBtn   = document.getElementById('dice-roll');

  if (!diceEl) return;

  // ★★★ PROPOSTE DEL DADO ★★★ — modificale con le tue idee!
  const proposals = [
    'Weekend a sorpresa — tu e io, nessun piano 🥂',
    'Passeggiata a Cavallo ',
    'Giornata intera sul divano a guardare film - serie 🍿',
    'Cena a Lume di Candela pagata da me 🕯️',
    'Una sera fuori a ballare, come non facciamo mai',
    'Picnic al tramonto, con tutto quello che ci piace 🧺'
  ];

  const faces = ['⚀','⚁','⚂','⚃','⚄','⚅'];
  let rolling = false;

  function roll() {
    if (rolling) return;
    rolling = true;
    proposalEl.style.opacity = '0';
    diceEl.classList.add('rolling');

    let ticks = 0;
    const interval = setInterval(() => {
      diceEl.querySelector('.dice-face').textContent = faces[Math.floor(Math.random() * 6)];
      ticks++;
      if (ticks > 10) {
        clearInterval(interval);
        diceEl.classList.remove('rolling');
        const pick = proposals[Math.floor(Math.random() * proposals.length)];
        proposalEl.textContent = pick;
        proposalEl.style.opacity = '1';
        rolling = false;
      }
    }, 60);
  }

  diceEl.addEventListener('click', roll);
  rollBtn?.addEventListener('click', roll);
})();

// ============================================================
// 20. LAZY LOAD IMMAGINI (quando le aggiungi)
// ============================================================
// Se in futuro aggiungi img con classe "lazy":
// <img class="lazy" data-src="foto/1.jpg" alt="..." />
// Questo observer le caricherà quando diventano visibili.
(function initLazyImages() {
  const imgs = document.querySelectorAll('img.lazy');
  if (!imgs.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  imgs.forEach(img => observer.observe(img));
})();

// ============================================================
// 16. PERFORMANCE — pausare musica quando la tab non è visibile
// ============================================================
document.addEventListener('visibilitychange', () => {
  const audio = document.getElementById('bg-music');
  if (!audio) return;
  if (document.hidden) {
    audio.pause();
  } else {
    // Riprende solo se era in riproduzione
    if (audio.dataset.wasPlaying === 'true') audio.play();
  }
});

document.getElementById('bg-music')?.addEventListener('play',  () => {
  document.getElementById('bg-music').dataset.wasPlaying = 'true';
});
document.getElementById('bg-music')?.addEventListener('pause', () => {
  document.getElementById('bg-music').dataset.wasPlaying = 'false';
});
