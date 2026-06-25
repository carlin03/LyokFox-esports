document.addEventListener('DOMContentLoaded', () => {
  // Loader — siempre se oculta aunque fallen imágenes
  const hideLoader = () => document.body.classList.add('ready');
  setTimeout(hideLoader, 1200);
  window.addEventListener('load', hideLoader);

  // Header scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active nav on scroll
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link:not(.nav-cta)');
  window.addEventListener('scroll', () => {
    const pos = window.scrollY + 100;
    sections.forEach(sec => {
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${sec.id}`);
        });
      }
    });
  }, { passive: true });

  // Counter animation
  const counters = document.querySelectorAll('[data-count]');
  let counted = false;
  const statsEl = document.querySelector('.stats');
  if (statsEl) {
    const countObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        counters.forEach(el => {
          const target = +el.dataset.count;
          const start = performance.now();
          const tick = now => {
            const p = Math.min((now - start) / 1800, 1);
            el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
          };
          requestAnimationFrame(tick);
        });
        countObserver.disconnect();
      }
    }, { threshold: 0.5 });
    countObserver.observe(statsEl);
  }

  // Reveal on scroll
  const reveal = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('show'), i * 80);
        reveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.player, .timeline li').forEach(el => reveal.observe(el));

  // Contact form
  const form = document.getElementById('form');
  const toast = document.getElementById('toast');
  if (form && toast) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const txt = btn.textContent;
      btn.textContent = 'Enviando...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = txt;
        btn.disabled = false;
        form.reset();
        toast.textContent = '¡Mensaje enviado! Te contactaremos pronto.';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
      }, 1200);
    });
  }
});
