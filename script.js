/* =========================================================
   JOHN ROGER — PORTFOLIO  (script.js)
   ERROR-FREE VERSION — works on file:// and http://
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     ⭐ 0. SMOOTH SCROLL — intercepts all [data-scroll] links
     This replaces native #hash navigation which Chrome blocks
     on file:// protocol. Works 100% offline.
     --------------------------------------------------------- */
  document.querySelectorAll('[data-scroll]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.getElementById(href.slice(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* Also intercept any other in-page anchor */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    if (link.hasAttribute('data-scroll')) return;
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.getElementById(href.slice(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- 1. PRELOADER ---------- */
  window.addEventListener('load', () => {
    setTimeout(() => {
      const pre = document.getElementById('preloader');
      if (pre) pre.classList.add('hidden');
    }, 900);
  });

  /* ---------- 2. TYPING ANIMATION ---------- */
  const roles = [
    'HTML Web Developer',
    'Aspiring IT Professional',
    'Front-End Enthusiast',
    'Continuous Learner'
  ];
  const typedEl = document.getElementById('typed');
  if (typedEl) {
    let roleIndex = 0, charIndex = 0, isDeleting = false;
    (function typeLoop() {
      const current = roles[roleIndex];
      const speed = isDeleting ? 45 : 90;
      typedEl.textContent = current.substring(0, charIndex);

      if (!isDeleting && charIndex === current.length) {
        isDeleting = true;
        return setTimeout(typeLoop, 1800);
      }
      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        return setTimeout(typeLoop, 350);
      }
      charIndex += isDeleting ? -1 : 1;
      setTimeout(typeLoop, speed);
    })();
  }

  /* ---------- 3. HEADER + PROGRESS + BACK TO TOP ---------- */
  const header = document.getElementById('header');
  const toTop = document.getElementById('toTop');
  const progress = document.getElementById('scrollProgress');

  function onScroll() {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    if (header) header.classList.toggle('scrolled', y > 40);
    if (toTop) toTop.classList.toggle('show', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 4. MOBILE NAV ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- 5. SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- 6. SKILL BARS ---------- */
  const barObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width || '0%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.bar-fill').forEach(b => barObserver.observe(b));

  /* ---------- 7. ANIMATED COUNTERS ---------- */
  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const duration = 1400;
      const start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(p * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.count').forEach(c => countObserver.observe(c));

  /* ---------- 8. ACTIVE NAV LINK ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');
  function setActiveLink() {
    const pos = window.scrollY + 140;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (pos >= top && pos < bottom) {
        navItems.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      }
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- 9. BACK TO TOP ---------- */
  if (toTop) {
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- 10. TOASTS ---------- */
  function toast(msg, icon = '✅') {
    const wrap = document.getElementById('toastWrap');
    if (!wrap) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span>${icon}</span> ${msg}`;
    wrap.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }

  /* ---------- 11. CONTACT FORM ---------- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const n = document.getElementById('name').value.trim();
      const em = document.getElementById('email').value.trim();
      const m = document.getElementById('message').value.trim();

      if (!n || !em || !m) {
        if (note) { note.style.color = '#ec4899'; note.textContent = '⚠️ Please fill in all fields.'; }
        toast('Please fill all fields', '⚠️');
        return;
      }
      if (note) { note.style.color = '#22d3a6'; note.textContent = `✅ Thanks ${n}! Your message has been noted.`; }
      toast(`Thanks ${n}! Message received.`, '📩');
      form.reset();
      setTimeout(() => { if (note) note.textContent = ''; }, 5000);
    });
  }

  /* ---------- 12. CLICK-TO-COPY ---------- */
  document.querySelectorAll('.contact-item[data-copy]').forEach(item => {
    item.addEventListener('click', () => {
      const text = item.dataset.copy;
      const label = item.dataset.label || 'Copied';
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
          .then(() => toast(`${label} copied!`, '📋'))
          .catch(() => fallbackCopy(text, label));
      } else {
        fallbackCopy(text, label);
      }
    });
  });
  function fallbackCopy(text, label) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); toast(`${label} copied!`, '📋'); }
    catch { toast('Copy failed — please copy manually.', '⚠️'); }
    ta.remove();
  }

  /* ---------- 13. THEME TOGGLE ---------- */
  const themeToggle = document.getElementById('themeToggle');
  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('jr-theme') || 'dark'; } catch (e) {}
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (themeToggle) {
    themeToggle.textContent = savedTheme === 'light' ? '☀️' : '🌙';
    themeToggle.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      themeToggle.textContent = next === 'light' ? '☀️' : '🌙';
      try { localStorage.setItem('jr-theme', next); } catch (e) {}
      toast(`${next === 'light' ? 'Light' : 'Dark'} mode activated`, next === 'light' ? '☀️' : '🌙');
    });
  }

  
/* ---------- 14. RESUME DOWNLOAD ---------- */
const resumeBtn = document.getElementById('resumeBtn');

if (resumeBtn) {
  resumeBtn.addEventListener('click', () => {
    toast('Downloading resume...', '📄');
  });
}
  /* ---------- 15. 3D TILT ---------- */
  const isTouch = window.matchMedia('(hover:none), (pointer:coarse)').matches;
  if (!isTouch) {
    document.querySelectorAll('.tilt').forEach(card => {
      card.style.transition = 'transform .25s ease, box-shadow .35s ease, border-color .35s ease';
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- 16. CUSTOM CURSOR ---------- */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!isTouch && dot && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    (function animateRing() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, .contact-item, .skill-card, .strength-card')
      .forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
      });
  }

  /* ---------- 17. PARTICLE BACKGROUND ---------- */
  const canvas = document.getElementById('particles');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let W, H, particles;

    function initParticles() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      const count = Math.min(90, Math.floor(W / 18));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.6,
        hue: [190, 270, 330][Math.floor(Math.random() * 3)]
      }));
    }
    function getParticleColor(hue, alpha = 0.7) {
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      return `hsla(${hue}, 90%, ${light ? '45%' : '65%'}, ${alpha})`;
    }
    function drawParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = getParticleColor(p.hue, 0.6);
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = getParticleColor(particles[i].hue, (1 - dist / 120) * 0.18);
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }
    initParticles();
    drawParticles();
    window.addEventListener('resize', initParticles);
  }

  /* ---------- 18. MARQUEE DUPLICATION ---------- */
  const track = document.getElementById('marqueeTrack');
  if (track) track.innerHTML += track.innerHTML;

  /* ---------- 19. KEYBOARD SHORTCUTS ---------- */
  document.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea')) return;
    const key = e.key.toLowerCase();
    if (key === 'h') window.scrollTo({ top: 0, behavior: 'smooth' });
    if (key === 'c') {
      const c = document.getElementById('contact');
      if (c) c.scrollIntoView({ behavior: 'smooth' });
    }
    if (key === 'p') { toast('Opening print dialog…', '📄'); setTimeout(() => window.print(), 300); }
    if (key === 't' && themeToggle) themeToggle.click();
  });

  /* ---------- 20. FOOTER YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});