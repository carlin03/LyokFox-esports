function syncSiteLinks(scope) {
  if (typeof SITE === 'undefined') return;
  const root = scope && scope.querySelectorAll ? scope : document;
  const isFull = !scope || scope === document;

  if (isFull) {
    document.querySelectorAll('.site-origin').forEach(el => {
      el.textContent = window.location.host || SITE.host();
    });
  }

  root.querySelectorAll('[data-site-email]').forEach(el => {
    const subject = el.dataset.siteEmailSubject ? '?subject=' + encodeURIComponent(el.dataset.siteEmailSubject) : '';
    el.href = 'mailto:' + SITE.email + subject;
  });

  root.querySelectorAll('[data-site-url]').forEach(el => {
    const path = el.dataset.siteUrl || '';
    el.href = SITE.abs(path);
  });

  if (isFull && SITE.points) {
    document.querySelectorAll('[data-points-name]').forEach(el => {
      el.textContent = SITE.points.name;
    });
    document.querySelectorAll('[data-points-short]').forEach(el => {
      el.textContent = SITE.points.short;
    });
    document.querySelectorAll('[data-points-icon]').forEach(el => {
      const badge = SITE.points.badge || SITE.points.short || 'KP';
      el.classList.add('kp-mark');
      if (!el.classList.contains('kp-mark-lg') && !el.classList.contains('kp-mark-sm')) {
        el.classList.add('kp-mark-md');
      }
      el.textContent = badge;
    });
    document.querySelectorAll('[data-points-badge]').forEach(el => {
      el.textContent = SITE.points.name;
    });
    document.querySelectorAll('[data-points-name-plural]').forEach(el => {
      el.textContent = SITE.points.name;
    });
    document.querySelectorAll('[data-points-tagline]').forEach(el => {
      el.textContent = SITE.points.motto;
    });
    document.querySelectorAll('[data-points-tagline-full]').forEach(el => {
      const p = el.querySelector('[data-points-short]');
      if (p) {
        el.innerHTML = SITE.points.tagline + '. Ganas <strong data-points-short>' + SITE.points.short + '</strong> apoyando en X, jugando minijuegos, acertando predicciones y completando misiones. Canjea por premios físicos en la tienda Kitsune.';
      } else {
        el.textContent = SITE.points.tagline;
      }
    });
    document.querySelectorAll('[data-points-label-short]').forEach(el => {
      el.textContent = SITE.points.name + ' · juegos · premios';
    });
    document.title = document.title.replace('KP', SITE.points.short);
  }

  root.querySelectorAll('[data-site-social]').forEach(el => {
    const key = el.dataset.siteSocial;
    if (SITE.social[key]) el.href = SITE.social[key];
  });

  root.querySelectorAll('[data-site-league]').forEach(el => {
    const key = el.dataset.siteLeague;
    if (SITE.leagues[key]) el.href = SITE.leagues[key];
  });

  root.querySelectorAll('[data-site-partner]').forEach(el => {
    const key = el.dataset.sitePartner;
    if (SITE.partners && SITE.partners[key]) el.href = SITE.partners[key];
  });

  root.querySelectorAll('[data-site-page]').forEach(el => {
    const key = el.dataset.sitePage;
    if (!SITE.pages[key]) return;
    const href = el.getAttribute('href') || '';
    let suffix = '';
    const hashAt = href.indexOf('#');
    const queryAt = href.indexOf('?');
    if (hashAt >= 0) suffix = href.slice(hashAt);
    else if (queryAt >= 0) suffix = href.slice(queryAt);
    el.href = SITE.pages[key] + suffix;
  });

  root.querySelectorAll('a[href], area[href]').forEach(el => {
    const href = el.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
    if (/^https?:\/\//i.test(href) && !SITE.isInternalHref(href)) return;
    const norm = SITE.normalizeHref(href);
    if (norm && norm !== href) el.setAttribute('href', norm);
    if (SITE.isInternalHref(norm || href)) {
      el.removeAttribute('target');
      const rel = el.getAttribute('rel');
      if (rel === 'noopener' || rel === 'noopener noreferrer') el.removeAttribute('rel');
    }
  });

  if (isFull) {
    const pageKey = document.body.dataset.page;
    if (pageKey && SITE.pages[pageKey]) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = SITE.fullUrl(SITE.pageAbs(pageKey));

      var ogUrl = document.querySelector('meta[property="og:url"]');
      if (!ogUrl && pageKey === 'inicio') {
        ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrl);
      }
      if (ogUrl) ogUrl.setAttribute('content', SITE.fullUrl(SITE.pageAbs(pageKey)));
    }

    const pagesList = document.getElementById('site-pages-list');
    if (pagesList) {
      pagesList.innerHTML =
        '<p class="urls-label">Páginas del sitio (mismas rutas en local y online)</p>' +
        SITE.pageList.map(p => `<a href="${p.href}">${p.label} — ${p.href}</a>`).join('');
    }

    const socialList = document.getElementById('contact-social-list');
    if (socialList && typeof icon === 'function') {
      const item = (href, ic, label, external) => {
        const ext = external ? ' target="_blank" rel="noopener"' : '';
        return `<li><a href="${href}"${ext}><span class="c-icon ico">${ICONS[ic] || ''}</span> ${label}</a></li>`;
      };
      socialList.innerHTML =
        item(SITE.pages.comunidad, 'star', 'Zona Comunidad · ' + (SITE.points ? SITE.points.name : 'KP') + ' y premios', false) +
        item(SITE.social.twitter, 'x', SITE.socialLabels.twitter, true) +
        item(SITE.social.fans, 'fox', SITE.socialLabels.fans, true) +
        item(SITE.social.instagram, 'instagram', SITE.socialLabels.instagram, true) +
        item(SITE.social.twitterLegacy, 'fox', SITE.socialLabels.twitterLegacy, true) +
        item('mailto:' + SITE.email, 'mail', SITE.email + ' — Contacto directo', true) +
        item(SITE.pages.equipos, 'teams', 'Equipos · Plantillas oficiales', false);
    }
  }
}

function formatMatchDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()];
}

function gameClass(game) {
  if (game === 'brawl') return 'match-brawl';
  if (game === 'clash') return 'match-clash';
  return 'match-eafc';
}

function matchLogoImg(game) {
  return '<img src="" alt="" class="match-game-logo" data-game="' + game + '" aria-hidden="true">';
}

function renderSchedule() {
  if (typeof SCHEDULE === 'undefined') return;

  const featuredEl = document.getElementById('featured-match');
  if (featuredEl && SCHEDULE.featured) {
    const m = SCHEDULE.featured;
    featuredEl.innerHTML =
      '<div class="featured-match-inner ' + gameClass(m.game) + '">' +
        matchLogoImg(m.game) +
        '<span class="match-live-tag">' + m.status + '</span>' +
        '<p class="match-game-label">' + m.gameLabel + '</p>' +
        '<h3 class="match-opponent">' + m.opponent + '</h3>' +
        '<p class="match-comp">' + m.competition + '</p>' +
        '<div class="match-datetime">' +
          '<span>' + formatMatchDate(m.date) + '</span>' +
          '<strong>' + m.time + ' ' + m.timezone + '</strong>' +
        '</div>' +
        '<span class="match-venue">' + m.venue + '</span>' +
        (m.stream ? '<a href="' + m.stream + '" target="_blank" rel="noopener" class="btn btn-glass btn-sm featured-stream">Seguir en X</a>' : '') +
      '</div>';
  }

  var countdownEl = document.getElementById('hero-countdown');
  if (countdownEl && SCHEDULE.featured) {
    var fm = SCHEDULE.featured;
    var target = new Date(fm.date + 'T' + fm.time + ':00');
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    var cdTimer = null;
    function tickCountdown() {
      var now = new Date();
      var diff = target - now;
      if (diff <= 0) {
        countdownEl.innerHTML = '<span class="cd-live">🔴 Matchday en curso</span>';
        if (cdTimer) clearInterval(cdTimer);
        return;
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var min = Math.floor((diff % 3600000) / 60000);
      var sec = Math.floor((diff % 60000) / 1000);
      countdownEl.innerHTML =
        '<span class="cd-label">Cuenta atrás</span>' +
        '<div class="cd-blocks">' +
          (d > 0 ? '<span><strong>' + d + '</strong><em>d</em></span>' : '') +
          '<span><strong>' + pad(h) + '</strong><em>h</em></span>' +
          '<span><strong>' + pad(min) + '</strong><em>m</em></span>' +
          '<span><strong>' + pad(sec) + '</strong><em>s</em></span>' +
        '</div>';
    }
    tickCountdown();
    cdTimer = setInterval(tickCountdown, 1000);
  }

  const gridEl = document.getElementById('schedule-grid');
  if (gridEl && SCHEDULE.upcoming) {
    gridEl.innerHTML = SCHEDULE.upcoming.map(function (m, i) {
      return '<article class="match-card ' + gameClass(m.game) + ' reveal-item' + (i === 0 ? ' match-card-next' : '') + '" data-match-index="' + i + '">' +
        matchLogoImg(m.game) +
        '<div class="match-card-top">' +
          '<span class="match-card-game">' + m.gameLabel + '</span>' +
          '<span class="match-card-status">' + m.status + '</span>' +
        '</div>' +
        '<h3 class="match-card-vs">' + m.opponent + '</h3>' +
        '<p class="match-card-comp">' + m.competition + '</p>' +
        '<div class="match-card-foot">' +
          '<time datetime="' + m.date + '">' + formatMatchDate(m.date) + ' · ' + m.time + '</time>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  if (typeof LOGO_BRAWL !== 'undefined') {
    document.querySelectorAll('[data-game="brawl"]').forEach(el => { el.src = LOGO_BRAWL; });
  }
  if (typeof LOGO_CLASH !== 'undefined') {
    document.querySelectorAll('[data-game="clash"]').forEach(el => { el.src = LOGO_CLASH; });
  }
  if (typeof LOGO_EAFC !== 'undefined') {
    document.querySelectorAll('[data-game="eafc"]').forEach(el => { el.src = LOGO_EAFC; });
  }
}

function renderTeamInfoPanels() {
  if (typeof TEAMS_INFO === 'undefined') return;
  const map = {
    'team-info-brawl': TEAMS_INFO.brawlStars,
    'team-info-clash': TEAMS_INFO.clashRoyale,
    'team-info-eafc': TEAMS_INFO.clubesPro
  };
  Object.keys(map).forEach(function (id) {
    const el = document.getElementById(id);
    const t = map[id];
    if (!el || !t) return;
    el.innerHTML =
      '<div class="team-info-grid">' +
        '<div class="team-info-main">' +
          '<p class="team-info-tagline">' + t.tagline + '</p>' +
          '<p class="team-info-about">' + t.about + '</p>' +
          '<div class="team-info-focus">' + t.focus.map(function (f) {
            return '<span>' + f + '</span>';
          }).join('') + '</div>' +
        '</div>' +
        '<div class="team-info-side">' +
          '<div class="team-info-stats">' + t.stats.map(function (s) {
            return '<div class="tis"><strong>' + s.value + '</strong><span>' + s.label + '</span></div>';
          }).join('') + '</div>' +
          '<div class="team-info-block">' +
            '<h4>Horarios</h4><p>' + t.schedule + '</p>' +
          '</div>' +
          '<div class="team-info-block">' +
            '<h4>Reclutamiento</h4><p>' + t.recruitment + '</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="team-info-achievements">' +
        '<h4>Logros y enfoque</h4><ul>' + t.achievements.map(function (a) {
          return '<li>' + a + '</li>';
        }).join('') +
        (t.legacy ? t.legacy.map(function (a) {
          return '<li class="team-legacy-item">' + a + '</li>';
        }).join('') : '') +
      '</ul>' +
      '</div>';
  });
}

function initUltraPremium() {
  var embersEl = document.querySelector('.embers');
  if (embersEl && !embersEl.dataset.filled) {
    embersEl.dataset.filled = '1';
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var count = reduced ? 0 : (window.innerWidth < 768 ? 12 : 24);
    for (var i = 0; i < count; i++) {
      var e = document.createElement('span');
      e.className = 'ember' + (Math.random() > 0.7 ? ' ember-gold' : '');
      e.style.left = Math.random() * 100 + '%';
      e.style.animationDuration = 5 + Math.random() * 10 + 's';
      e.style.animationDelay = Math.random() * 8 + 's';
      var size = 1 + Math.random() * 2;
      e.style.width = e.style.height = size + 'px';
      embersEl.appendChild(e);
    }
  }

  var spot = document.querySelector('.fx-spotlight');
  if (spot && !spot.dataset.bound) {
    spot.dataset.bound = '1';
    var spotTick = false;
    document.addEventListener('mousemove', function (e) {
      if (spotTick) return;
      spotTick = true;
      requestAnimationFrame(function () {
        spot.style.left = e.clientX + 'px';
        spot.style.top = e.clientY + 'px';
        spotTick = false;
      });
    }, { passive: true });
  }

  var canTilt = !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.querySelectorAll(
    '.portal-card, .game-card, .spotlight-card, .stat-card, .match-card, .news-feed-card, ' +
    '.reward-card-v5, .pred-card-v5, .x-post-card, .arcade-card-v5, .mission-row-v5, .milestone-card'
  ).forEach(function (card) {
    if (card.dataset.shineBound) return;
    card.dataset.shineBound = '1';
    if (!canTilt) return;
    card.classList.add('tilt-card');
    card.addEventListener('mousemove', function (ev) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', ((ev.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--spot-y', ((ev.clientY - r.top) / r.height * 100) + '%');
    }, { passive: true });
  });
}

function initLiveTicker() {
  var track = document.getElementById('site-live-ticker-track');
  if (!track) return;

  var items = [
    'VAMOS LYOKFOX',
    'KITSUNE POINTS',
    '#INDOMABLES',
    'BRAWL STARS · CLASH ROYALE · CLUBES PRO',
    'GANA KP EN REDES',
    'PREDICCIONES FC26',
    'TIENDA KITSUNE',
    'MINIJUEGOS + KP',
    'RANKING SEMANAL',
    'ZONA COMUNIDAD',
    'PREMIOS REALES'
  ];

  if (typeof NEWS !== 'undefined' && NEWS.breaking) {
    items.unshift(NEWS.breaking.replace(/^🔥\s*/, '').toUpperCase());
  } else if (typeof SITE !== 'undefined' && SITE.tickerBreaking) {
    items.unshift(SITE.tickerBreaking.toUpperCase());
  }

  var html = '';
  var doubled = items.concat(items);
  doubled.forEach(function (text) {
    html += '<span>' + text + '</span><span class="ticker-sep"></span>';
  });
  track.innerHTML = html;
}

function renderHomeNewsTeaser() {
  var grid = document.getElementById('home-news-grid');
  var list = document.getElementById('home-news-list');
  var target = list || grid;
  if (!target || typeof NEWS === 'undefined' || !NEWS.articles || !NEWS.articles.length) return;

  function formatDate(d) {
    try {
      return new Date(d + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    } catch (e) { return d; }
  }

  var sorted = NEWS.articles.slice().sort(function (a, b) {
    return String(b.date).localeCompare(String(a.date));
  });
  var picks = sorted.slice(0, list ? 4 : 3);

  if (list) {
    target.innerHTML = picks.map(function (a) {
      return '<li><a href="noticias.html?id=' + encodeURIComponent(a.id) + '" data-site-page="noticias">' +
        '<strong>' + a.title + '</strong>' +
        '<span>' + a.tag + ' · ' + formatDate(a.date) + ' · +10 KP</span>' +
      '</a></li>';
    }).join('');
  } else {
    target.innerHTML = picks.map(function (a) {
      return '<a href="noticias.html?id=' + encodeURIComponent(a.id) + '" class="home-news-card reveal-item" data-site-page="noticias">' +
        '<span class="home-news-tag">' + a.tag + '</span>' +
        '<strong>' + a.title + '</strong>' +
        '<span class="home-news-meta">' + formatDate(a.date) + ' · ' + a.readMin + ' min · +10 KP</span>' +
      '</a>';
    }).join('');
  }

  if (typeof syncSiteLinks === 'function') syncSiteLinks(target);
}

var _lyokMainInited = false;

function bindGlobalNav() {
  if (window._lyokNavBound) return;
  window._lyokNavBound = true;
  document.addEventListener('click', function (e) {
    var menuBtn = e.target.closest('#menuBtn');
    if (menuBtn) {
      var nav = document.getElementById('nav');
      if (!nav) return;
      menuBtn.classList.toggle('open');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
      return;
    }
    if (e.target.closest('#nav .nav-link')) {
      var mb = document.getElementById('menuBtn');
      var nv = document.getElementById('nav');
      if (mb) mb.classList.remove('open');
      if (nv) nv.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

document.addEventListener('layout:ready', bindGlobalNav);

function initLyokFox() {
  if (_lyokMainInited) return;
  _lyokMainInited = true;
  document.body.classList.add('ready');

  if (typeof LOGO !== 'undefined') {
    document.querySelectorAll('[data-img="logo"]').forEach(el => { el.src = LOGO; });
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.href = LOGO;
  }
  if (typeof BANNER !== 'undefined' || (typeof SITE !== 'undefined' && SITE.banner)) {
    var bannerSrc = (typeof SITE !== 'undefined' && SITE.banner) ? SITE.banner : BANNER;
    document.querySelectorAll('[data-img="banner"]').forEach(function (el) { el.src = bannerSrc; });
  }

  if (typeof LOGO_CLASH !== 'undefined') {
    document.querySelectorAll('[data-game="clash"]').forEach(el => { el.src = LOGO_CLASH; });
  }
  if (typeof LOGO_BRAWL !== 'undefined') {
    document.querySelectorAll('[data-game="brawl"]').forEach(el => { el.src = LOGO_BRAWL; });
  }
  if (typeof LOGO_EAFC !== 'undefined') {
    document.querySelectorAll('[data-game="eafc"]').forEach(el => { el.src = LOGO_EAFC; });
  }

  syncSiteLinks();
  renderTeamInfoPanels();
  initLiveTicker();
  renderHomeNewsTeaser();

  if (document.body.dataset.page === 'inicio') {
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('.hero-sparks').forEach(function (el) {
      if (el.dataset.filled) return;
      el.dataset.filled = '1';
      var n = reducedMotion ? 0 : (window.innerWidth < 768 ? 3 : 6);
      for (let i = 0; i < n; i++) {
        const sp = document.createElement('span');
        sp.className = 'hero-spark';
        sp.style.left = `${Math.random() * 100}%`;
        sp.style.top = `${Math.random() * 100}%`;
        sp.style.animationDuration = `${2 + Math.random() * 4}s`;
        sp.style.animationDelay = `${Math.random() * 5}s`;
        el.appendChild(sp);
      }
    });
  }

  const header = document.getElementById('header');
  let scrollIdleTimer;
  function syncHeaderScrollState() {
    if (!header) return;
    var scrolled = window.scrollY > 50;
    header.classList.toggle('scrolled', scrolled);
    document.body.classList.toggle('header-scrolled', scrolled);
  }
  if (header) {
    syncHeaderScrollState();
    window.addEventListener('scroll', () => {
      syncHeaderScrollState();
      document.body.classList.add('is-scrolling');
      clearTimeout(scrollIdleTimer);
      scrollIdleTimer = setTimeout(() => document.body.classList.remove('is-scrolling'), 140);
    }, { passive: true });
  }

  /* Sin parallax en scroll del banner — causaba sensación de bajada lenta en Inicio */

  const heroRevealsOld = document.querySelectorAll('.hero .reveal');
  if (heroRevealsOld.length && !document.querySelector('.hero-v3')) {
    setTimeout(() => {
      heroRevealsOld.forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 120);
      });
    }, 400);
  }

  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  if (menuBtn && nav && !window._lyokNavBound) {
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
  }

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var statsContainers = document.querySelectorAll('.stats-glass, .equipos-stats-inner, .hero-v3-stats, .hero-portada-stats');
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || entry.target.dataset.counted) return;
        entry.target.dataset.counted = '1';
        entry.target.querySelectorAll('[data-count]').forEach(function (el) {
          var target = +el.dataset.count;
          var start = performance.now();
          var tick = function (now) {
            var p = Math.min((now - start) / 2000, 1);
            el.textContent = Math.floor((1 - Math.pow(1 - p, 4)) * target);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
          };
          requestAnimationFrame(tick);
        });
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    statsContainers.forEach(function (el) { countObserver.observe(el); });
  }

  const reveal = new IntersectionObserver(entries => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        reveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '40px' });

  if (document.body.dataset.page !== 'comunidad') {
    document.querySelectorAll('.reveal-item, .history-timeline li, .milestone-card, .story-chapter, .value-card, .league-card, .game-card, .match-card, .page-cta-inner, .page-cta-strip, .spotlight-card, .home-kp-inner, .indomables-inner').forEach(el => reveal.observe(el));
    renderSchedule();
    document.querySelectorAll('#schedule-grid .match-card.reveal-item').forEach(el => reveal.observe(el));
  } else {
    document.querySelectorAll('.reveal-item').forEach(el => el.classList.add('show'));
  }

  initUltraPremium();

  const heroReveals = document.querySelectorAll('.reveal, .hero-v3-center, .hero-v3-side');
  if (heroReveals.length) {
    setTimeout(() => {
      heroReveals.forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 100);
      });
    }, 400);
  }

  document.querySelectorAll('.hero-v3 .reveal-item').forEach((el, i) => {
    setTimeout(() => el.classList.add('show'), 520 + i * 60);
  });

  const scrollHint = document.querySelector('.hero-scroll-hint');
  if (scrollHint) {
    scrollHint.addEventListener('click', e => {
      const href = scrollHint.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  }

  const storyNav = document.querySelector('.story-nav');
  if (storyNav) {
    const links = storyNav.querySelectorAll('a');
    const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    var storyScrollTick = false;
    const onScroll = () => {
      if (storyScrollTick) return;
      storyScrollTick = true;
      requestAnimationFrame(function () {
        let active = sections[0];
        sections.forEach(sec => {
          if (sec.offsetTop <= window.scrollY + 140) active = sec;
        });
        links.forEach(a => {
          a.classList.toggle('active', active && a.getAttribute('href') === '#' + active.id);
        });
        storyNav.classList.toggle('stuck', window.scrollY > 400);
        storyScrollTick = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const renderRoster = (containerId, players, compact) => {
    const container = document.getElementById(containerId);
    if (!container || typeof ROSTERS === 'undefined') return;
    const teamKey = typeof LyokFoxPlayers !== 'undefined' && LyokFoxPlayers.teamKeys
      ? LyokFoxPlayers.teamKeys[containerId] : null;

    container.innerHTML = players.map((player, i) => {
      const num = String(i + 1).padStart(2, '0');
      const name = player.name || `Jugador ${num}`;
      const initial = player.name ? player.name.replace(/[^a-zA-Z0-9]/, '').charAt(0).toUpperCase() : num;
      const cls = ['player', 'reveal-item', 'player-clickable'];
      if (containerId === 'rosterBrawlStars') cls.push('player-brawl');
      if (player.captain) cls.push('featured');
      if (compact) cls.push('player-compact');
      const note = player.note ? `<p>${player.note}</p>` : player.name ? `<p>LyokFox · ${player.role}</p>` : `<p>Plantilla activa · ${player.role}</p>`;

      return `<article class="${cls.join(' ')}" data-team="${teamKey || ''}" data-player-i="${i}" tabindex="0" role="button" aria-label="Ver ficha de ${name}">
        <span class="player-num">${num}</span>
        <div class="player-top"><div class="avatar">${initial}</div><span class="role">${player.role}</span></div>
        <h3>${name}</h3>
        ${note}
        <span class="player-view-hint">Ver ficha →</span>
      </article>`;
    }).join('');

    container.querySelectorAll('.player-clickable').forEach(card => {
      const open = () => {
        const tk = card.dataset.team;
        const idx = +card.dataset.playerI;
        if (tk && typeof LyokFoxPlayers !== 'undefined') LyokFoxPlayers.openPlayer(tk, idx);
      };
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });

    container.querySelectorAll('.reveal-item').forEach(el => reveal.observe(el));
  };

  if (typeof ROSTERS !== 'undefined') {
    renderRoster('rosterBrawlStars', ROSTERS.brawlStars, false);
    renderRoster('rosterClashRoyale', ROSTERS.clashRoyale, false);
    renderRoster('rosterClubesPro', ROSTERS.clubesPro, true);
  }

  document.querySelectorAll('[data-open-team]').forEach(el => {
    el.addEventListener('click', e => {
      if (typeof LyokFoxPlayers === 'undefined') return;
      if (el.classList.contains('hero-team-card') || el.classList.contains('btn-team-ficha')) {
        e.preventDefault();
        LyokFoxPlayers.openTeam(el.dataset.openTeam);
      }
    });
  });

  document.querySelectorAll('.game-card[data-open-team] .game-card-cta').forEach(cta => {
    cta.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const card = cta.closest('.game-card');
      if (card && typeof LyokFoxPlayers !== 'undefined') LyokFoxPlayers.openTeam(card.dataset.openTeam);
    });
  });

  if (document.body.dataset.page === 'equipos') {
    sessionStorage.setItem('lyokfox_visit_equipos', '1');
  }
  if (document.body.dataset.page === 'historia') {
    sessionStorage.setItem('lyokfox_visit_historia', '1');
  }
  if (document.body.dataset.page === 'inicio') {
    sessionStorage.setItem('lyokfox_visit_inicio', '1');
  }
  if (document.body.dataset.page === 'sponsor') {
    sessionStorage.setItem('lyokfox_visit_sponsor', '1');
  }
  if (document.body.dataset.page === 'contacto') {
    sessionStorage.setItem('lyokfox_visit_contacto', '1');
  }

  const form = document.getElementById('form');
  const toast = document.getElementById('toast');
  if (form && toast) {
    const params = new URLSearchParams(window.location.search);
    const premio = params.get('premio');
    const codigo = params.get('codigo');
    if (premio && codigo) {
      const subj = form.querySelector('[name="subject"]');
      const msg = form.querySelector('[name="message"]');
      if (subj) {
        const opt = Array.from(subj.options).find(o => o.textContent === 'Premio comunidad');
        if (opt) subj.value = opt.textContent;
        else {
          const o = document.createElement('option');
          o.textContent = 'Premio comunidad';
          o.selected = true;
          subj.appendChild(o);
        }
      }
      if (msg) msg.value = 'Canje Zona Comunidad\nPremio: ' + premio + '\nCódigo: ' + codigo + '\n\nTalla / datos de envío:\n';
    }
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
}

document.addEventListener('layout:ready', initLyokFox);
document.addEventListener('cms:applied', function () {
  if (typeof syncSiteLinks === 'function') syncSiteLinks();
  if (document.body.dataset.page === 'inicio') renderHomeNewsTeaser();
});
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('site-header') && !document.getElementById('header')) {
    setTimeout(initLyokFox, 50);
  }
});
