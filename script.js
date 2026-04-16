/* =============================================
   MANAV CHOUHAN — PORTFOLIO SCRIPT
   Features:
   - Custom cursor tracking
   - Scroll progress bar
   - Navbar scroll state
   - Typewriter effect (type + erase)
   - Scroll reveal (IntersectionObserver)
   - 3D tilt on project cards
   - Number counter animation
   - Project filter
   - Hamburger menu
   - Smooth anchor scroll
   - Footer year
============================================= */

// ─── DOM READY ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // ─── EXP / EDU TAB SWITCHING ─────────────
  document.querySelectorAll('.exp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      // Find sibling tabs and panels within the same .exp-layout
      const layout = tab.closest('.exp-layout');
      const targetId = tab.dataset.target;

      // Deactivate all tabs in this layout
      layout.querySelectorAll('.exp-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      // Deactivate all panels in this layout
      layout.querySelectorAll('.exp-panel').forEach(p => p.classList.remove('active'));

      // Activate clicked tab + matching panel
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');
    });
  });

  // ─── FOOTER YEAR ─────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ─── SCROLL PROGRESS BAR ─────────────────
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  // ─── NAVBAR SCROLL STATE ─────────────────
  const navbar = document.getElementById('navbar');
  function updateNavbar() {
    if (window.scrollY > 70) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ─── HAMBURGER MENU ──────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  hamburger?.addEventListener('click', () => navLinks.classList.toggle('open'));
  document.querySelectorAll('#nav-links a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );

  // ─── SMOOTH SCROLL ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 78;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── CUSTOM CURSOR ───────────────────────
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  // Only activate on devices with a fine pointer (mouse), not touch
  if (dot && ring && window.matchMedia('(pointer:fine)').matches) {
    let ringX = 0, ringY = 0;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorVisible = false;

    // Activate custom cursor immediately
    document.body.classList.add('custom-cursor-active');

    // Position dot instantly on every move
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';

      // Show cursor on first move
      if (!cursorVisible) {
        cursorVisible = true;
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
      }
    });

    // Hide when mouse leaves the window
    document.addEventListener('mouseleave', () => {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    });

    // Smooth ring follow (RAF loop)
    function animateRing() {
      const ease = 0.11;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;
      ring.style.left = Math.round(ringX * 10) / 10 + 'px';
      ring.style.top  = Math.round(ringY * 10) / 10 + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Expand ring on interactive elements
    const interactiveEls = document.querySelectorAll('a, button, .project-card, .skill-icon-card, .filter-btn, .stat-card');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.style.transform   = 'translate(-50%, -50%) scale(1.8)';
        ring.style.width      = '52px';
        ring.style.height     = '52px';
        ring.style.borderColor = 'rgba(99,102,241,0.9)';
        ring.style.background  = 'rgba(99,102,241,0.06)';
      });
      el.addEventListener('mouseleave', () => {
        dot.style.transform   = 'translate(-50%, -50%) scale(1)';
        ring.style.width      = '36px';
        ring.style.height     = '36px';
        ring.style.borderColor = 'rgba(99,102,241,0.5)';
        ring.style.background  = 'transparent';
      });
    });
  }

  // ─── TYPEWRITER EFFECT ───────────────────
  const phrases = [
    'AI-powered systems.',
    'end-to-end pipelines.',
    'LLM agents.',
    'intelligent backends.',
    'things that matter.',
  ];
  const twEl = document.getElementById('typewriter-text');
  if (twEl) {
    let phraseIdx = 0;

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    async function type(text) {
      for (let i = 0; i <= text.length; i++) {
        twEl.textContent = text.slice(0, i);
        await sleep(60 + Math.random() * 30);
      }
    }

    async function erase() {
      const text = twEl.textContent;
      for (let i = text.length; i >= 0; i--) {
        twEl.textContent = text.slice(0, i);
        await sleep(30);
      }
    }

    async function runTypewriter() {
      await sleep(1600); // initial delay after page load
      while (true) {
        const phrase = phrases[phraseIdx % phrases.length];
        await type(phrase);
        await sleep(2200);
        await erase();
        await sleep(350);
        phraseIdx++;
      }
    }
    runTypewriter();
  }

  // ─── SCROLL REVEAL ───────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = entry.target.closest('.projects-grid, .edu-grid, .about-stats, .skills-icons-grid');
        let delay = 0;
        if (siblings) {
          const items = [...siblings.querySelectorAll('.reveal')];
          delay = items.indexOf(entry.target) * 70;
        }
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObs.observe(el));

  // ─── 3D TILT ON PROJECT CARDS ────────────
  document.querySelectorAll('.tilt-card').forEach(card => {
    let animId = null;

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const cx   = rect.width  / 2;
      const cy   = rect.height / 2;
      const rotX = ((y - cy) / cy) * -7;
      const rotY = ((x - cx) / cx) *  7;

      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(() => {
        card.style.transition = 'transform .05s linear, border-color .3s, box-shadow .3s';
        card.style.transform  = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
        card.style.borderColor = 'rgba(99,102,241,0.55)';
        card.style.boxShadow  = '0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(99,102,241,0.3)';
      });
    });

    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(animId);
      card.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1), border-color .3s, box-shadow .3s';
      card.style.transform  = '';
      card.style.borderColor = '';
      card.style.boxShadow  = '';
    });
  });

  // ─── NUMBER COUNTER ──────────────────────
  function animateCount(el, target, duration = 1800) {
    const startTime = performance.now();
    const isDecimal = el.dataset.decimal;

    function update(ts) {
      const elapsed  = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-quart
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = eased * target;

      if (isDecimal) {
        // Show static integer + animated decimal
        el.textContent = Math.floor(target) + (eased < 1 ? '.00' : isDecimal);
      } else {
        el.textContent = Math.round(value);
      }
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-number').forEach(num => {
          const target = parseFloat(num.dataset.target);
          animateCount(num, target);
        });
        statsObs.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.about-stats');
  if (statsSection) statsObs.observe(statsSection);

  // ─── PROJECT FILTERS ─────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach((card, i) => {
        const cats = card.dataset.category || '';
        const show = filter === 'all' || cats.includes(filter);

        if (show) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          requestAnimationFrame(() => {
            setTimeout(() => {
              card.style.transition = 'opacity .35s ease, transform .35s ease';
              card.style.opacity = '1';
              card.style.transform = '';
            }, i * 50);
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ─── MAGNETIC BUTTON EFFECT ──────────────
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width  / 2);
      const dy = e.clientY - (rect.top  + rect.height / 2);
      btn.style.transform = `translate(${dx * 0.2}px, ${dy * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
      btn.style.transform  = '';
      setTimeout(() => btn.style.transition = '', 500);
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform .12s linear';
    });
  });

});
