/* ══════════════════════════════════════════
   AHSAN PORTFOLIO — script.js
══════════════════════════════════════════ */

/* ── Custom Cursor ── */
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

// Hover scale
document.querySelectorAll('a, button, .svc-card, .port-card, .price-card, input, textarea, select').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    cursorRing.style.transform = 'translate(-50%,-50%) scale(1.3)';
    cursorRing.style.borderColor = 'rgba(224,0,27,0.7)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorRing.style.borderColor = 'rgba(224,0,27,0.5)';
  });
});

/* ── Navbar scroll behaviour ── */
const navbar = document.getElementById('navbar');
const btt    = document.getElementById('btt');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 50);
  btt.classList.toggle('show', y > 400);

  // Active nav link highlight
  document.querySelectorAll('section[id], div[id="stats"]').forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 100 && rect.bottom >= 100) {
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + sec.id) a.style.color = 'var(--red)';
      });
    }
  });
});

/* ── Mobile burger ── */
const burger    = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
burger.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  burger.children[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
  burger.children[1].style.opacity   = open ? '0' : '1';
  burger.children[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
document.querySelectorAll('.mnav-link').forEach(l => {
  l.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    burger.children[0].style.transform = '';
    burger.children[1].style.opacity   = '1';
    burger.children[2].style.transform = '';
  });
});

/* ── Typed text hero ── */
const phrases = [
  'ACTUALLY Sell.',
  'Convert Visitors.',
  'Rank on Google.',
  'Load in Under 1s.',
  'Grow Your Brand.'
];
let pi = 0, ci = 0, del = false;
const typedEl = document.getElementById('typed');

function typeLoop() {
  const word = phrases[pi];
  typedEl.textContent = del
    ? word.substring(0, ci - 1)
    : word.substring(0, ci + 1);
  del ? ci-- : ci++;

  let wait = del ? 55 : 95;
  if (!del && ci === word.length)  { wait = 2200; del = true; }
  if (del && ci === 0)             { del = false; pi = (pi+1) % phrases.length; wait = 350; }
  setTimeout(typeLoop, wait);
}
typeLoop();

/* ── Scroll Reveal ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── Service card stagger ── */
const svcObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const d = parseInt(e.target.dataset.delay || 0);
      setTimeout(() => e.target.classList.add('in'), d * 110);
      svcObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.svc-card.reveal').forEach(el => svcObs.observe(el));

/* ── Counter animation ── */
function runCounter(el) {
  const target = +el.dataset.target;
  const dur = 1800;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.count').forEach(runCounter);
      statsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
const statsEl = document.getElementById('stats');
if (statsEl) statsObs.observe(statsEl);

/* ── Skill bars ── */
function animateBars(container) {
  container.querySelectorAll('.skbar-fill').forEach((bar, i) => {
    setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, i * 130 + 60);
  });
}
const aboutEl = document.getElementById('about');
let barsAnimated = false;
const aboutObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !barsAnimated) {
      const panel = document.getElementById('tab-skills');
      if (panel && panel.classList.contains('active')) {
        animateBars(panel); barsAnimated = true;
      }
      aboutObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
if (aboutEl) aboutObs.observe(aboutEl);

/* ── Tabs ── */
document.querySelectorAll('.tabBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = 'tab-' + btn.dataset.tab;
    document.querySelectorAll('.tabBtn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const pane = document.getElementById(id);
    if (pane) {
      pane.classList.add('active');
      if (btn.dataset.tab === 'skills') {
        pane.querySelectorAll('.skbar-fill').forEach(b => b.style.width = '0');
        setTimeout(() => animateBars(pane), 50);
      }
    }
  });
});

/* ── Contact Form ── */
document.getElementById('cForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const msg = document.getElementById('formMsg');
  const orig = btn.innerHTML;
  btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = 'Sent! <i class="fas fa-check"></i>';
    btn.style.background = '#16a34a';
    btn.style.borderColor = '#16a34a';
    msg.textContent = '✓ Thanks! I\'ll get back to you within 24 hours.';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled = false;
      btn.style.background = '';
      btn.style.borderColor = '';
      msg.textContent = '';
      e.target.reset();
    }, 4000);
  }, 1500);
});

/* ── Back to Top ── */
btt.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

/* ── Smooth anchor scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth', block:'start' }); }
  });
});
/*form action cform formspreee */
const contactForm = document.getElementById('cForm');
const formMsg = document.getElementById('formMsg');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Page refresh hone se rokne ke liye
  
  const formData = new FormData(contactForm);
  
  try {
    const response = await fetch("https://formspree.io/f/xnjbyrpg", {
      method: "POST",
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      formMsg.textContent = "Shukriya! Aapka message bhej diya gaya hai.";
      formMsg.style.color = "green";
      contactForm.reset(); // Form ko khaali karne ke liye
    } else {
      formMsg.textContent = "Oops! Kuch masla hua hai, dobara koshish karein.";
      formMsg.style.color = "red";
    }
  } catch (error) {
    formMsg.textContent = "Server se rabta nahi ho pa raha.";
  }
});
