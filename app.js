/* =========================================================
   MOHAMED ALI — PORTFOLIO APP.JS
   ========================================================= */

'use strict';

/* ---- Loader ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1800);
});

/* ---- Cursor Glow ---- */
(function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
})();


/* ---- Particles Canvas ---- */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x: randomBetween(0, W),
      y: randomBetween(0, H),
      r: randomBetween(0.5, 2),
      vx: randomBetween(-0.3, 0.3),
      vy: randomBetween(-0.5, -0.1),
      alpha: randomBetween(0.2, 0.8),
      color: Math.random() > 0.5 ? '124,58,237' : '6,182,212',
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 100 }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();

      // Connect nearby
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${p.color},${0.05 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -5) { p.y = H + 5; p.x = randomBetween(0, W); }
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
    });

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  draw();
})();

/* ---- Typed Text ---- */
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const texts = [
    'Full Stack Developer',
    'MERN Stack Expert',
    'React & Node.js',
    'Video Producer',
    'AI Solutions Expert',
    'مبرمج مواقع محترف'
  ];

  let idx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = texts[idx];
    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % texts.length;
      }
    }
    setTimeout(type, deleting ? 60 : 100);
  }

  type();
})();

/* ---- Navbar Scroll ---- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + section.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
})();

/* ---- Mobile Nav ---- */
(function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('nav-mobile');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileNav.classList.toggle('open');
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileNav.classList.remove('open');
    });
  });
})();

/* ---- Skills Tabs ---- */
(function initSkillsTabs() {
  const tabs = document.querySelectorAll('.skills-tab');
  const panels = document.querySelectorAll('.skills-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('panel-' + target);
      if (panel) {
        panel.classList.add('active');
        animateBarsInPanel(panel);
      }
    });
  });

  // Animate bars in visible panel
  function animateBarsInPanel(panel) {
    panel.querySelectorAll('.skill-bar[data-pct]').forEach(bar => {
      bar.style.width = bar.dataset.pct;
    });
  }
})();

/* ---- Scroll Reveal ---- */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate skill bars if inside
        entry.target.querySelectorAll('.skill-bar[data-pct]').forEach(bar => {
          setTimeout(() => { bar.style.width = bar.dataset.pct; }, 300);
        });
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));

  // Also watch skill bars globally
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        setTimeout(() => { bar.style.width = bar.dataset.pct; }, 400);
        barObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-bar[data-pct]').forEach(b => barObserver.observe(b));
})();

/* ---- Projects Filter ---- */
(function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-cat]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const show = filter === 'all' || card.dataset.cat === filter;
        card.style.display = show ? '' : 'none';
        if (show) {
          card.style.animation = 'fade-in-up 0.4s ease both';
        }
      });
    });
  });
})();

/* ---- Counter Animation ---- */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(ease * target) + (el.dataset.suffix || '');
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ---- Scroll To Top ---- */
(function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ---- Video Modal ---- */
(function initVideoModal() {
  const modal = document.getElementById('video-modal');
  const modalVideo = document.getElementById('modal-video-player');
  const modalClose = document.getElementById('modal-close');

  document.querySelectorAll('[data-video]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const src = trigger.dataset.video;
      if (!modal || !modalVideo) return;
      if (src.startsWith('http')) {
        // YouTube embed
        modalVideo.innerHTML = `<iframe src="${src}?autoplay=1" allow="autoplay" allowfullscreen></iframe>`;
      } else {
        modalVideo.innerHTML = `<video src="${src}" controls autoplay></video>`;
      }
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    if (modalVideo) modalVideo.innerHTML = '';
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

/* ---- Contact Form ---- */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const original = btn.innerHTML;

    btn.innerHTML = '<span>✓ تم الإرسال!</span>';
    btn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';

    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
})();

/* ---- Smooth Scroll for anchors ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
