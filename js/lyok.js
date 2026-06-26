(function () {
  'use strict';

  var LYOK = {
    name: 'LyokFox Sports',
    short: 'LyokFox',
    url: 'https://lyokfox.vercel.app',
    email: 'lyokfox@gmail.com',
    build: '2026.06.26-web',
    est: 2020,
    tagline: 'La astucia del kitsune · El fuego de la competición',
    nav: [
      { key: 'inicio', label: 'Inicio', href: 'index.html' },
      { key: 'noticias', label: 'Noticias', href: 'noticias.html' },
      { key: 'historia', label: 'Historia', href: 'historia.html' },
      { key: 'equipos', label: 'Equipos', href: 'equipos.html' },
      { key: 'contacto', label: 'Contáctanos', href: 'contactanos.html', cta: true }
    ],
    social: {
      twitter: 'https://x.com/LyokFox_',
      instagram: 'https://instagram.com/lyokfox',
      fans: 'https://x.com/Lyokfox_Fans'
    }
  };

  function currentPage() {
    var p = document.body.getAttribute('data-page');
    if (p) return p;
    var file = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '');
    if (file === 'index' || file === '') return 'inicio';
    if (file === 'contactanos') return 'contacto';
    return file;
  }

  function getNav() {
    var items = (typeof LYOK_DATA !== 'undefined' && LYOK_DATA.nav && LYOK_DATA.nav.length)
      ? LYOK_DATA.nav : LYOK.nav;
    if (!items || !items.length) return LYOK.nav;
    if (items.every(function (i) { return i.hidden === true; })) return LYOK.nav;
    return items;
  }

  function getAccountDisplayName() {
    if (window.LyokProfile && LyokProfile.isLoggedIn()) {
      var u = LyokProfile.currentUser();
      if (u && u.nickname) return u.nickname;
    }
    return null;
  }

  function safeAvatarSrc(src) {
    if (!src) return '';
    src = String(src).trim();
    if (/^data:image\//i.test(src) || /^https?:\/\//i.test(src) || /^(\/|img\/|assets\/)/.test(src)) {
      return src.replace(/"/g, '&quot;');
    }
    return '';
  }

  function accountNavHtml() {
    var page = currentPage();
    var nick = getAccountDisplayName();
    var user = window.LyokProfile && LyokProfile.currentUser ? LyokProfile.currentUser() : null;
    var avatarSrc = user && user.avatar ? safeAvatarSrc(user.avatar) : '';
    var avatarHtml = avatarSrc
      ? '<img src="' + avatarSrc + '" alt="" class="nav-account-avatar" width="22" height="22">'
      : '';
    var active = page === 'cuenta' ? ' is-active' : '';
    if (nick) {
      return '<a href="cuenta.html" class="nav-account nav-account--in' + active + '" title="Mi perfil">' + avatarHtml + nick + '</a>';
    }
    var ic = window.LYOK_ICONS ? LYOK_ICONS.svg('user', 'st-ico st-ico-nav') : '';
    return '<a href="cuenta.html" class="nav-account' + active + '" title="Mi perfil">' + ic + 'Cuenta</a>';
  }

  function stabilizeHeader() {
    var header = document.getElementById('header');
    if (!header) return;
    if (document.body.classList.contains('page-inner')) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    }
  }

  function getSiteContact() {
    var c = (typeof LYOK_DATA !== 'undefined' && LYOK_DATA.site && LYOK_DATA.site.contact) || {};
    return {
      email: c.email || LYOK.email,
      social: Object.assign({}, LYOK.social, c.social || {})
    };
  }

  function hexToRgb(hex) {
    hex = String(hex || '').replace('#', '').trim();
    if (hex.length === 3) hex = hex.split('').map(function (ch) { return ch + ch; }).join('');
    var n = parseInt(hex, 16);
    if (isNaN(n)) return '3, 3, 3';
    return ((n >> 16) & 255) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255);
  }

  function applyTheme() {
    if (typeof LYOK_DATA === 'undefined') return;
    var t = LYOK_DATA.theme || {};
    var root = document.documentElement;
    var set = function (key, val) {
      if (val != null && val !== '') root.style.setProperty(key, String(val));
    };
    if (t.accent) set('--accent', t.accent);
    if (t.accentBright) set('--accent-bright', t.accentBright);
    if (t.accentDim) set('--accent-dim', t.accentDim);
    if (t.gold) set('--gold', t.gold);
    if (t.bg) set('--bg', t.bg);
    if (t.bg2) set('--bg-2', t.bg2);
    if (t.surface) set('--surface', t.surface);
    if (t.text) set('--text', t.text);
    if (t.muted) set('--muted', t.muted);
    if (t.radiusLg != null) set('--radius-lg', t.radiusLg + 'px');
    if (t.grainOpacity != null) set('--grain-opacity', String(t.grainOpacity));
    if (t.borderAccent != null) set('--border-accent-opacity', String(t.borderAccent));
    if (t.glowIntensity != null) {
      var g = t.glowIntensity;
      set('--glow', '0 0 ' + Math.round(100 * g) + 'px rgba(255, 90, 31, 0.18)');
      set('--glow-sm', '0 0 ' + Math.round(40 * g) + 'px rgba(255, 90, 31, 0.12)');
    }
    if (t.cardGlass != null) set('--glass', 'rgba(8, 8, 8, ' + t.cardGlass + ')');
    set('--header-bg-rgb', hexToRgb(t.headerBg || t.bg || '#030303'));
    set('--header-opacity', String(t.headerOpacity != null ? t.headerOpacity : 0.88));
    set('--header-top-opacity', String(t.headerTopOpacity != null ? t.headerTopOpacity : 0));
    set('--header-blur', (t.headerBlur != null ? t.headerBlur : 20) + 'px');
    set('--header-h', (t.headerHeight != null ? t.headerHeight : 84) + 'px');
    set('--header-nav-scale', String(t.headerNavScale != null ? t.headerNavScale : 1.08));
    set('--header-brand-scale', String(t.headerBrandScale != null ? t.headerBrandScale : 1.06));
    if (t.tickerSpeed != null) set('--ticker-speed', t.tickerSpeed + 's');
    document.body.classList.toggle('lyok-no-anim', t.animations === false);
    var ty = t.type || {};
    var def = function (key, fallback) {
      var v = ty[key];
      return (v != null && String(v).trim() !== '') ? v : fallback;
    };
    set('--type-eyebrow', def('eyebrow', t.gold || '#d4a24e'));
    set('--type-display', def('display', t.text || '#f2f0ed'));
    set('--type-display-accent', def('displayAccent', t.accentBright || t.accent || '#ff7a3d'));
    set('--type-lead', def('lead', 'rgba(242, 240, 237, 0.78)'));
    set('--type-section-title', def('sectionTitle', t.text || '#f2f0ed'));
    set('--type-section-sub', def('sectionSub', 'rgba(242, 240, 237, 0.65)'));
    set('--type-card-title', def('cardTitle', t.text || '#f2f0ed'));
    set('--type-card-text', def('cardText', 'rgba(242, 240, 237, 0.72)'));
    set('--type-link', def('link', t.accentBright || '#ff7a3d'));
    set('--type-nav', def('nav', 'rgba(242, 240, 237, 0.85)'));
    set('--type-nav-active', def('navActive', t.accent || '#ff5a1f'));
    set('--type-stat-value', def('statValue', t.gold || '#d4a24e'));
    set('--type-stat-label', def('statLabel', 'rgba(242, 240, 237, 0.55)'));
    set('--type-footer', def('footer', t.muted || '#7a7a7a'));
    var sc = t.scale || {};
    if (sc.display != null) set('--scale-display', String(sc.display));
    if (sc.section != null) set('--scale-section', String(sc.section));
    if (sc.body != null) set('--scale-body', String(sc.body));
    var fx = t.effects || {};
    document.body.classList.toggle('fx-off-mesh', fx.mesh === false);
    document.body.classList.toggle('fx-off-dust', fx.dust === false);
    document.body.classList.toggle('fx-off-spotlight', fx.spotlight === false);
    document.body.classList.toggle('fx-off-scanline', fx.scanline === false);
    document.body.classList.toggle('fx-off-hero-cinema', fx.heroCinema === false);
    document.body.classList.toggle('fx-off-tilt', fx.cardTilt === false);
    document.body.classList.toggle('fx-off-magnetic', fx.magneticBtns === false);
    document.body.classList.toggle('fx-off-embers', fx.embers === false);
    var profile = fx.perfProfile || 'balanced';
    document.body.classList.remove('lyok-fx-ultra', 'lyok-fx-balanced', 'lyok-fx-lite', 'lyok-lite');
    document.body.classList.add('lyok-fx-' + profile);
    if (profile === 'lite') {
      document.body.classList.add('lyok-fx-lite', 'lyok-lite');
    }
    document.body.classList.add('lyok-ultra');
    if (fx.meshBlur != null) set('--fx-mesh-blur', fx.meshBlur + 'px');
    if (fx.spotlightSize != null) set('--fx-spotlight-size', fx.spotlightSize + 'px');
    if (fx.tiltStrength != null) set('--fx-tilt-strength', String(fx.tiltStrength));
    if (fx.magneticStrength != null) set('--fx-magnetic-strength', String(fx.magneticStrength));
  }

  function applyPageMeta() {
    if (typeof LYOK_DATA === 'undefined') return;
    var page = currentPage();
    var m = (LYOK_DATA.meta && LYOK_DATA.meta[page]) || {};
    if (m.title) document.title = m.title;
    if (m.description) {
      var desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute('content', m.description);
      var og = document.querySelector('meta[property="og:description"]');
      if (og) og.setAttribute('content', m.description);
      var ogT = document.querySelector('meta[property="og:title"]');
      if (ogT && m.title) ogT.setAttribute('content', m.title);
    }
  }

  function getUiLabels() {
    return (typeof LYOK_DATA !== 'undefined' && LYOK_DATA.uiLabels) ? LYOK_DATA.uiLabels : {};
  }

  function applySiteImages() {
    if (typeof LYOK_DATA === 'undefined' || !LYOK_DATA.site) return;
    var banner = LYOK_DATA.site.banner || 'img/banner-oficial.png';
    var logo = LYOK_DATA.site.logo || 'img/logo.jpg';
    document.querySelectorAll('.hero-bg img, .page-hero-bg img').forEach(function (img) {
      img.src = banner;
    });
    document.querySelectorAll('.brand img, .hero-logo').forEach(function (img) {
      if (!img.getAttribute('data-keep-src')) img.src = logo;
    });
    applyHeroSettings();
  }

  function applyHeroSettings() {
    if (typeof LYOK_DATA === 'undefined' || !LYOK_DATA.site) return;
    var s = LYOK_DATA.site;
    document.body.classList.toggle('hero-pure', s.heroOverlay === false);
    document.body.classList.toggle('hero-fx-on', s.heroOverlay === true);
    var op = s.heroImageOpacity != null ? s.heroImageOpacity : 0.5;
    document.querySelectorAll('.hero-bg img').forEach(function (heroImg) {
      heroImg.style.opacity = String(op);
    });
    document.querySelectorAll('.page-hero-bg img').forEach(function (img) {
      if (document.body.classList.contains('page-inner') && !document.body.classList.contains('page-hero-banner')) {
        return;
      }
      img.style.opacity = String(Math.min(op * 0.58, 0.28));
    });
    applyHeroEffects();
  }

  function applyHeroEffects() {
    if (typeof LYOK_DATA === 'undefined' || !LYOK_DATA.site) return;
    var fx = LYOK_DATA.site.heroEffects || {};
    document.querySelectorAll('[data-fx]').forEach(function (el) {
      var key = el.getAttribute('data-fx');
      var on = fx[key] === true;
      el.setAttribute('data-fx-visible', on ? 'true' : 'false');
    });
  }

  function secHeadHtml(sec) {
    if (!sec) return '';
    var eyebrow = sec.eyebrow || '';
    var title = sec.title || '';
    if (!eyebrow && !title) return '';
    return '<p class="eyebrow">' + eyebrow + '</p>' +
      '<h2 class="section-title">' + title + '</h2>' +
      (sec.sub ? '<p class="section-sub">' + sec.sub + '</p>' : '');
  }

  function mergeSectionHead(custom, fallback) {
    custom = custom || {};
    fallback = fallback || {};
    return {
      eyebrow: custom.eyebrow || fallback.eyebrow || '',
      title: custom.title || fallback.title || '',
      sub: custom.sub != null && custom.sub !== '' ? custom.sub : (fallback.sub || '')
    };
  }

  function renderHomeHero() {
    var el = document.getElementById('hero-content');
    if (!el || typeof LYOK_DATA === 'undefined') return;
    var h = LYOK_DATA.home || {};
    var cta1 = h.ctaPrimary || { text: 'Ver noticias', href: 'noticias.html' };
    var cta2 = h.ctaSecondary || { text: 'Ver equipos', href: 'equipos.html' };
    el.innerHTML =
      '<p class="eyebrow">' + (h.eyebrow || 'Club esports ibérico') + '</p>' +
      '<h1 class="hero-portada-title display" id="hero-title" itemprop="name">' + (h.title || 'LYOK<em>FOX</em>') + '</h1>' +
      '<p class="hero-portada-tagline lead" itemprop="description">' + (h.lead || '') + '</p>' +
      '<ul class="hero-portada-proof" id="hero-stats" data-cms-block="heroStats" aria-label="Cifras del club"></ul>' +
      '<div class="hero-portada-actions hero-actions" data-cms-block="heroCtas">' +
        '<a href="' + cta1.href + '" class="btn btn-primary">' + cta1.text + '</a>' +
        '<a href="' + cta2.href + '" class="btn btn-ghost">' + cta2.text + '</a>' +
      '</div>';
    renderHomeStats();
  }

  function renderHomeSectionHeaders() {
    if (typeof LYOK_DATA === 'undefined' || !LYOK_DATA.home) return;
    var s = LYOK_DATA.home.sections || {};
    var fallbacks = {
      spotlight: { eyebrow: 'Accesos rápidos', title: 'Lo más <em>destacado</em>', sub: 'Noticias, historia y equipos del club.' },
      disciplines: { eyebrow: 'Disciplinas', title: 'Dos frentes de <em>batalla</em>', sub: 'Clash Royale y Clubes Pro FC26.' },
      schedule: { eyebrow: 'Calendario', title: 'Próximos <em>partidos</em>', sub: 'Horarios CEST · @LyokFox_' },
      sponsor: { eyebrow: 'Partnerships', title: 'Niveles de <em>partnership</em>', sub: 'Visibilidad en esports ibérico.' },
      seo: { eyebrow: 'Club oficial', title: 'LyokFox Sports — <em>esports</em> ibérico', sub: '' },
      homeNews: { eyebrow: 'Actualidad', title: 'Últimas <em>noticias</em>', sub: 'Matchdays, fichajes y novedades del club.' }
    };
    var map = {
      'spotlight-head': mergeSectionHead(s.spotlight, fallbacks.spotlight),
      'disciplines-head': mergeSectionHead(s.disciplines, fallbacks.disciplines),
      'schedule-head': mergeSectionHead(s.schedule, fallbacks.schedule),
      'sponsor-head': mergeSectionHead(s.sponsor, fallbacks.sponsor),
      'seo-head': mergeSectionHead(s.seo, fallbacks.seo),
      'home-news-head': mergeSectionHead(s.homeNews, fallbacks.homeNews)
    };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el && map[id]) {
        var html = secHeadHtml(map[id]);
        if (html) el.innerHTML = html;
      }
    });
    var cta = document.getElementById('cta-banner');
    if (cta) {
      cta.classList.add('card', 'card--cta', 'card--accent');
      var ctaData = mergeSectionHead(s.cta, {
        eyebrow: 'Únete',
        title: 'Forma parte de la <em>camada</em>',
        sub: 'Tryouts, patrocinio o comunidad — el club te espera.'
      });
      var btns = LYOK_DATA.home.ctaButtons || {};
      var b1 = btns.primary || { text: 'Contáctanos', href: 'contactanos.html' };
      var b2 = btns.secondary || { text: 'Nuestra historia', href: 'historia.html' };
      cta.innerHTML =
        '<div data-cms-block="secHead-cta">' +
          '<p class="eyebrow" style="justify-content:center">' + ctaData.eyebrow + '</p>' +
          '<h2 class="section-title">' + ctaData.title + '</h2>' +
          (ctaData.sub ? '<p class="section-sub" style="margin-inline:auto">' + ctaData.sub + '</p>' : '') +
        '</div>' +
        '<div class="cta-actions">' +
          '<a href="' + b1.href + '" class="btn btn-primary">' + b1.text + '</a>' +
          '<a href="' + b2.href + '" class="btn btn-ghost">' + b2.text + '</a>' +
        '</div>';
    }
  }

  function renderPageHero() {
    var wrap = document.querySelector('.page-hero .wrap') || document.getElementById('page-hero-content');
    if (!wrap || typeof LYOK_DATA === 'undefined' || !LYOK_DATA.pages) return;
    var page = currentPage();
    var p = LYOK_DATA.pages[page];
    if (!p) return;
    wrap.innerHTML =
      '<p class="eyebrow">' + (p.eyebrow || '') + '</p>' +
      '<h1 class="display">' + (p.title || '') + '</h1>' +
      '<p class="lead">' + (p.lead || '') + '</p>';
  }

  function applyPageStyles() {
    if (typeof LYOK_DATA === 'undefined') return;
    var page = currentPage();
    var ps = (LYOK_DATA.pageStyles && LYOK_DATA.pageStyles[page]) || {};
    var globalBanner = (LYOK_DATA.site && LYOK_DATA.site.banner) || 'img/banner-oficial.png';
    var banner = (ps.banner && ps.banner.trim()) ? ps.banner.trim() : globalBanner;
    var baseOp = LYOK_DATA.site && LYOK_DATA.site.heroImageOpacity != null ? LYOK_DATA.site.heroImageOpacity : 0.5;
    var heroOp = ps.bannerOpacity != null && ps.bannerOpacity !== '' ? parseFloat(ps.bannerOpacity) : baseOp;
    var showBanner = ps.showHeroBanner === true || !!(ps.banner && ps.banner.trim());

    document.body.classList.toggle('page-has-bg', !!(ps.bgImage && ps.bgImage.trim()));
    document.body.classList.toggle('page-hero-banner', showBanner);
    document.documentElement.style.setProperty('--page-hero-title-scale', String(ps.titleScale != null ? ps.titleScale : 1));
    document.documentElement.style.setProperty('--page-hero-lead-scale', String(ps.leadScale != null ? ps.leadScale : 1));
    document.documentElement.style.setProperty('--page-block-gap-scale', String(ps.blockGap != null ? ps.blockGap : 1));
    if (ps.bgImage && ps.bgImage.trim()) {
      document.documentElement.style.setProperty('--page-bg-image', 'url(' + ps.bgImage.trim() + ')');
      document.documentElement.style.setProperty('--page-bg-opacity', String(ps.bgOpacity != null ? ps.bgOpacity : 0.1));
    } else {
      document.documentElement.style.removeProperty('--page-bg-image');
      document.documentElement.style.removeProperty('--page-bg-opacity');
    }

    if (page === 'inicio') {
      document.querySelectorAll('.hero-bg img').forEach(function (img) {
        if (ps.banner && ps.banner.trim()) img.src = banner;
        img.style.opacity = String(heroOp);
      });
    } else {
      document.querySelectorAll('.page-hero-bg img').forEach(function (img) {
        img.src = banner;
        var innerOp = ps.showHeroBanner || (ps.banner && ps.banner.trim())
          ? Math.min(heroOp * 0.65, 0.42)
          : Math.min(heroOp * 0.58, 0.28);
        img.style.opacity = String(innerOp);
      });
    }
  }

  function renderSeoContent() {
    var el = document.getElementById('seo-content');
    if (!el || typeof LYOK_DATA === 'undefined' || !LYOK_DATA.home) return;
    var h = LYOK_DATA.home;
    var paras = (h.seoText || []).map(function (p) { return '<p>' + p + '</p>'; }).join('');
    var kws = (h.seoKeywords || []).map(function (k) { return '<span>' + k + '</span>'; }).join('');
    var faq = (h.faq || []).map(function (f, i) {
      return '<details class="faq-item card" data-cms-item="faq-' + i + '"><summary>' + f.q + '</summary><p>' + f.a + '</p></details>';
    }).join('');
    el.innerHTML =
      '<article class="seo-about-text card" data-cms-block="seoText">' + paras +
        '<div class="seo-keywords" aria-label="Temáticas">' + kws + '</div>' +
      '</article>' +
      '<aside class="card seo-faq-wrap" data-cms-block="seoFaq" aria-labelledby="faq-heading">' +
        '<h3 class="section-title" id="faq-heading" style="font-size:1.75rem;margin-bottom:1.25rem">Preguntas <em>frecuentes</em></h3>' +
        '<div class="faq-list">' + faq + '</div>' +
      '</aside>';
  }

  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function rosterKeyForTeam(id) {
    return { brawl: 'brawlStars', clash: 'clashRoyale', eafc: 'clubesPro' }[id] || id;
  }

  function renderEmbers() {
    if (!document.body.classList.contains('page-fx')) return;
    var fx = (LYOK_DATA && LYOK_DATA.theme && LYOK_DATA.theme.effects) || {};
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var old = hero.querySelector('.embers');
    if (fx.embers === false || document.body.classList.contains('fx-off-embers') || document.body.classList.contains('studio-frame-page')) {
      if (old) old.remove();
      return;
    }
    var profile = fx.perfProfile || 'balanced';
    var count = fx.emberCount != null ? fx.emberCount : (profile === 'ultra' ? 8 : profile === 'balanced' ? 6 : 4);
    count = Math.max(0, Math.min(24, count));
    if (!count) {
      if (old) old.remove();
      return;
    }
    if (old && old.dataset.emberCount === String(count)) return;
    if (old) old.remove();
    var embers = document.createElement('div');
    embers.className = 'embers';
    embers.dataset.emberCount = String(count);
    embers.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < count; i++) {
      var e = document.createElement('span');
      e.className = 'ember';
      e.style.left = (Math.random() * 100) + '%';
      e.style.animationDuration = (9 + Math.random() * 10) + 's';
      e.style.animationDelay = (Math.random() * 8) + 's';
      if (i % 3 === 0) {
        e.style.background = '#d4a24e';
        e.style.boxShadow = '0 0 8px #d4a24e';
      }
      embers.appendChild(e);
    }
    var lights = hero.querySelector('.hero-lights');
    if (lights) hero.insertBefore(embers, lights);
    else hero.appendChild(embers);
  }

  function renderTicker() {
    var el = document.getElementById('site-ticker');
    if (!el || typeof LYOK_DATA === 'undefined' || !LYOK_DATA.ticker) return;
    if (LYOK_DATA.visibility && LYOK_DATA.visibility.ticker === false) {
      el.style.display = 'none';
      return;
    }
    el.style.display = '';
    document.body.classList.add('has-ticker');
    var items = LYOK_DATA.ticker.concat(LYOK_DATA.ticker);
    var hash = items.join('||');
    if (hash === _tickerHash && el.querySelector('.ticker-track')) return;
    _tickerHash = hash;
    var spans = items.map(function (t) { return '<span>' + t + '</span>'; }).join('');
    el.innerHTML = '<div class="ticker-track">' + spans + '</div>';
  }

  function buildNavLinks(page, navItems) {
    return navItems.filter(function (item) { return item.hidden !== true; }).map(function (item) {
      var cls = (item.key === page ? 'is-active' : '') + (item.cta ? ' nav-cta' : '');
      return '<a href="' + item.href + '"' + (cls.trim() ? ' class="' + cls.trim() + '"' : '') + ' data-nav-key="' + item.key + '">' + item.label + '</a>';
    }).join('');
  }

  function buildHeaderHtml(page, navItems) {
    return '<header class="site-header site-header--ready" id="header" data-cms-block="siteHeader">' +
      '<div class="header-glow" aria-hidden="true"></div>' +
      '<div class="wrap header-inner">' +
        '<a href="index.html" class="brand" aria-label="LyokFox Sports inicio">' +
          '<img src="' + ((typeof LYOK_DATA !== 'undefined' && LYOK_DATA.site && LYOK_DATA.site.logo) || 'img/logo.jpg') + '" alt="Logo LyokFox" width="40" height="40">' +
          '<span>LYOK<span class="accent">FOX</span></span>' +
        '</a>' +
        '<button class="menu-toggle" id="menuToggle" type="button" aria-label="Abrir menú" aria-expanded="false">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
        '<nav class="nav" id="nav" aria-label="Principal">' + buildNavLinks(page, navItems) + '</nav>' +
        '<div class="nav-utils">' + accountNavHtml() + '</div>' +
      '</div>' +
    '</header>';
  }

  function syncNavActive(page) {
    document.querySelectorAll('#nav a[data-nav-key], #nav a').forEach(function (a) {
      var key = a.getAttribute('data-nav-key');
      if (!key) {
        var href = (a.getAttribute('href') || '').replace(/\.html$/, '');
        if (href === 'index' || href === '') key = 'inicio';
        else if (href === 'contactanos') key = 'contacto';
        else key = href;
      }
      a.classList.toggle('is-active', key === page);
    });
  }

  function renderHeader() {
    var el = document.getElementById('site-header');
    if (!el) return;
    var page = currentPage();
    var navItems = getNav();
    var navHtml = buildNavLinks(page, navItems);
    var accountHtml = accountNavHtml();
    var logoSrc = (typeof LYOK_DATA !== 'undefined' && LYOK_DATA.site && LYOK_DATA.site.logo) || 'img/logo.jpg';
    var hash = page + '|' + navHtml + '|' + accountHtml + '|' + logoSrc;
    var header = document.getElementById('header');
    if (!header) {
      el.innerHTML = buildHeaderHtml(page, navItems);
      stabilizeHeader();
      _headerHash = hash;
      return;
    }
    if (hash === _headerHash) {
      stabilizeHeader();
      return;
    }
    _headerHash = hash;
    var nav = document.getElementById('nav');
    if (nav) nav.innerHTML = navHtml;
    var utils = header.querySelector('.nav-utils');
    if (utils) utils.innerHTML = accountHtml;
    var logo = header.querySelector('.brand img');
    if (logo && logo.getAttribute('src') !== logoSrc) logo.src = logoSrc;
    stabilizeHeader();
  }

  function renderFooter() {
    var el = document.getElementById('site-footer');
    if (!el) return;
    var navItems = getNav().filter(function (item) { return item.hidden !== true; });
    var navLinks = navItems.map(function (item) {
      return '<a href="' + item.href + '">' + item.label + '</a>';
    }).join('');

    var tagline = (typeof LYOK_DATA !== 'undefined' && LYOK_DATA.footer && LYOK_DATA.footer.tagline)
      ? LYOK_DATA.footer.tagline : LYOK.tagline;

    var contact = getSiteContact();
    var social = contact.social || LYOK.social;
    var logo = (typeof LYOK_DATA !== 'undefined' && LYOK_DATA.site && LYOK_DATA.site.logo) || 'img/logo.jpg';
    var year = new Date().getFullYear();
    var hash = navLinks + '|' + tagline + '|' + logo + '|' + contact.email;
    if (hash === _footerHash && el.querySelector('.site-footer')) return;
    _footerHash = hash;

    el.innerHTML =
      '<footer class="site-footer site-footer--lyok" data-cms-block="siteFooter">' +
        '<div class="footer-lyok-line" aria-hidden="true"></div>' +
        '<div class="wrap footer-lyok-band">' +
          '<a href="index.html" class="brand footer-lyok-brand" aria-label="LyokFox inicio">' +
            '<img src="' + logo + '" alt="" width="36" height="36">' +
            '<span>LYOK<span class="accent">FOX</span></span>' +
          '</a>' +
          '<nav class="footer-lyok-nav" aria-label="Pie de página">' + navLinks + '</nav>' +
          '<div class="footer-lyok-contact">' +
            '<a href="mailto:' + contact.email + '" class="footer-lyok-mail">' + contact.email + '</a>' +
            '<div class="footer-lyok-social" aria-label="Redes">' +
              '<a href="' + social.twitter + '" target="_blank" rel="noopener" title="X">X</a>' +
              '<a href="' + social.instagram + '" target="_blank" rel="noopener" title="Instagram">IG</a>' +
              '<a href="' + social.fans + '" target="_blank" rel="noopener" title="Fans">FX</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="wrap footer-lyok-meta">' +
          '<p class="footer-lyok-copy">© ' + year + ' ' + LYOK.name + ' · Est. ' + LYOK.est + ' · ' + tagline + '</p>' +
          '<p class="footer-lyok-build">Clash Royale · Clubes Pro · VPG · PLG · VFO · v' + LYOK.build + ' · <a href="sitemap.xml">Sitemap</a></p>' +
        '</div>' +
      '</footer>';
  }

  var revealObserver = null;
  var _tickerHash = '';
  var _footerHash = '';
  var _headerHash = '';

  function initNav() {
    if (document.body.dataset.lyokNavBound) return;
    document.body.dataset.lyokNavBound = '1';
    var toggle = document.getElementById('menuToggle');
    var nav = document.getElementById('nav');
    var header = document.getElementById('header');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function initReveal(scope) {
    var root = scope && scope.querySelectorAll ? scope : document;
    root.querySelectorAll('.reveal:not(.is-visible)').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  function resetLyokDataFromDefaults() {
    if (typeof LYOK_DATA_DEFAULTS === 'undefined') return;
    Object.keys(LYOK_DATA_DEFAULTS).forEach(function (k) {
      LYOK_DATA[k] = JSON.parse(JSON.stringify(LYOK_DATA_DEFAULTS[k]));
    });
  }

  function mergeStudioDataSafe(savedData) {
    if (!savedData || typeof savedData !== 'object') return;
    deepMergeLyokData(LYOK_DATA, savedData);
  }

  function deepMergeLyokData(target, source) {
    if (!source || typeof source !== 'object') return;
    Object.keys(source).forEach(function (k) {
      if (k === 'visibility') return;
      var v = source[k];
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        target[k] = target[k] || {};
        deepMergeLyokData(target[k], v);
      } else if (Array.isArray(v)) {
        if (v.length) target[k] = JSON.parse(JSON.stringify(v));
      } else if (v !== undefined) {
        target[k] = v;
      }
    });
  }

  function replaceStudioEnvelope(saved) {
    if (!saved || !saved.data || typeof LYOK_DATA === 'undefined') return false;
    resetLyokDataFromDefaults();
    Object.keys(saved.data).forEach(function (key) {
      if (saved.data[key] !== undefined) {
        LYOK_DATA[key] = JSON.parse(JSON.stringify(saved.data[key]));
      }
    });
    var vis = saved.visibility || saved.data.visibility;
    if (vis && typeof vis === 'object') {
      LYOK_DATA.visibility = JSON.parse(JSON.stringify(vis));
      applyVisibility(LYOK_DATA.visibility);
    }
    return true;
  }

  function applyStudioEnvelope(saved) {
    if (!saved || !saved.data) return;
    deepMergeLyokData(LYOK_DATA, saved.data);
    var vis = saved.visibility || saved.data.visibility;
    if (vis && typeof vis === 'object') {
      LYOK_DATA.visibility = Object.assign({}, LYOK_DATA.visibility || {}, vis);
      applyVisibility(LYOK_DATA.visibility);
    }
  }

  var cmsMergedFromCloud = false;

  function loadPublicLyokData() {
    if (isStudioFrame()) {
      applyLiveDraftFromStorage();
      return;
    }
    if (cmsMergedFromCloud) return;
    var cloudOn = window.LyokCmsCloud && LyokCmsCloud.isConfigured && LyokCmsCloud.isConfigured();
    var prodCloud = cloudOn && LyokCmsCloud.isProdHost && LyokCmsCloud.isProdHost();
    if (prodCloud) return;
    if (isLocalDev() && !useLocalCmsCache() && !cloudOn) {
      resetLyokDataFromDefaults();
      return;
    }
    resetLyokDataFromDefaults();
    try {
      var raw = localStorage.getItem('lyokfox_studio_v3');
      if (!raw) return;
      var saved = JSON.parse(raw);
      if (!saved || !saved.data) return;
      applyStudioEnvelope(saved);
    } catch (e) { /* ignore corrupt cache */ }
  }

  function ensureCoreContent(snapshot) {
    if (!snapshot || typeof LYOK_DATA === 'undefined') return;
    var arrays = ['teams', 'spotlight', 'schedule', 'sponsorTiers', 'stats', 'ticker', 'brands', 'nav'];
    arrays.forEach(function (k) {
      if (!snapshot[k] || !snapshot[k].length) return;
      if (!LYOK_DATA[k] || !LYOK_DATA[k].length) {
        LYOK_DATA[k] = JSON.parse(JSON.stringify(snapshot[k]));
      }
    });
    if (snapshot.news && snapshot.news.articles && snapshot.news.articles.length) {
      LYOK_DATA.news = LYOK_DATA.news || {};
      if (!LYOK_DATA.news.articles || !LYOK_DATA.news.articles.length) {
        LYOK_DATA.news.articles = JSON.parse(JSON.stringify(snapshot.news.articles));
      }
    }
    if (snapshot.rosters && Object.keys(snapshot.rosters).length) {
      if (!LYOK_DATA.rosters || !Object.keys(LYOK_DATA.rosters).length) {
        LYOK_DATA.rosters = JSON.parse(JSON.stringify(snapshot.rosters));
      }
    }
    if (snapshot.home) {
      LYOK_DATA.home = LYOK_DATA.home || {};
      if (!LYOK_DATA.home.seoText || !LYOK_DATA.home.seoText.length) {
        LYOK_DATA.home.seoText = JSON.parse(JSON.stringify(snapshot.home.seoText || []));
      }
      if (!LYOK_DATA.home.faq || !LYOK_DATA.home.faq.length) {
        LYOK_DATA.home.faq = JSON.parse(JSON.stringify(snapshot.home.faq || []));
      }
      if (!LYOK_DATA.home.sections) {
        LYOK_DATA.home.sections = JSON.parse(JSON.stringify(snapshot.home.sections || {}));
      }
    }
    if (snapshot.footer && !LYOK_DATA.footer) {
      LYOK_DATA.footer = JSON.parse(JSON.stringify(snapshot.footer));
    }
    if (snapshot.history && typeof LYOK_DATA.history === 'object') {
      if (!LYOK_DATA.history.storyBlocks || !LYOK_DATA.history.storyBlocks.length) {
        LYOK_DATA.history.storyBlocks = JSON.parse(JSON.stringify(snapshot.history.storyBlocks || []));
      }
    }
    if (snapshot.pageStyles && !LYOK_DATA.pageStyles) {
      LYOK_DATA.pageStyles = JSON.parse(JSON.stringify(snapshot.pageStyles));
    }
    if (snapshot.history && (!LYOK_DATA.history || !LYOK_DATA.history.chapters || !LYOK_DATA.history.chapters.length)) {
      LYOK_DATA.history = JSON.parse(JSON.stringify(snapshot.history));
    }
    if (snapshot.history) {
      LYOK_DATA.history = LYOK_DATA.history || {};
      if (!LYOK_DATA.history.chapters || !LYOK_DATA.history.chapters.length) {
        LYOK_DATA.history.chapters = JSON.parse(JSON.stringify(snapshot.history.chapters || []));
      }
      if (!LYOK_DATA.history.milestones || LYOK_DATA.history.milestones.length < 8) {
        LYOK_DATA.history.milestones = JSON.parse(JSON.stringify(snapshot.history.milestones || []));
      }
      if (!LYOK_DATA.history.milestonesHeader && snapshot.history.milestonesHeader) {
        LYOK_DATA.history.milestonesHeader = JSON.parse(JSON.stringify(snapshot.history.milestonesHeader));
      }
    }
  }

  function sanitizeVisibility() {
    if (typeof LYOK_DATA === 'undefined' || !LYOK_DATA.visibility) return;
    var vis = LYOK_DATA.visibility;
    if (vis.siteHeader === false) vis.siteHeader = true;
    if (vis.siteFooter === false) vis.siteFooter = true;
  }

  function collapseSparseSections() {
    if (document.body.dataset.lyokCollapsed === '1') return;
    document.body.dataset.lyokCollapsed = '1';
    document.querySelectorAll('.section').forEach(function (sec) {
      if (sec.hidden) return;
      var wrap = sec.querySelector(':scope > .wrap');
      if (!wrap) return;
      var hasBody = false;
      Array.prototype.forEach.call(wrap.children, function (el) {
        if (!el || el.nodeType !== 1 || el.classList.contains('sec-head')) return;
        if (el.hidden) return;
        var cs = window.getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || cs.height === '0px') return;
        if (el.offsetHeight > 2 || el.children.length || (el.textContent || '').trim()) hasBody = true;
      });
      sec.classList.toggle('section--collapsed', !hasBody);
    });
    document.querySelectorAll('.match-strip, .brands-strip').forEach(function (strip) {
      if (!strip.innerHTML.trim()) {
        strip.classList.add('strip--collapsed');
      } else {
        strip.classList.remove('strip--collapsed');
      }
    });
  }

  function applyVisibility(vis) {
    if (!vis) return;
    Object.keys(vis).forEach(function (k) {
      if (typeof vis[k] === 'object') return;
      var show = vis[k] !== false;
      document.querySelectorAll('[data-cms-block="' + k + '"]').forEach(function (el) {
        el.hidden = !show;
      });
    });
    var ticker = document.getElementById('site-ticker');
    if (ticker) ticker.style.display = vis.ticker === false ? 'none' : '';
    var header = document.getElementById('site-header');
    if (header) {
      header.hidden = false;
      header.style.display = '';
    }
    var footer = document.getElementById('site-footer');
    if (footer) {
      footer.hidden = vis.siteFooter === false;
      if (vis.siteFooter !== false) footer.style.display = '';
    }
  }

  function renderHomeStats() {
    var ul = document.getElementById('hero-stats');
    if (!ul || typeof LYOK_DATA === 'undefined') return;
    ul.innerHTML = LYOK_DATA.stats.map(function (s, i) {
      if (s.hidden === true) return '';
      return '<li data-cms-item="stat-' + i + '"><strong>' + s.value + '</strong><span>' + s.label + '</span></li>';
    }).join('');
  }

  function newsArticleImage(art) {
    var img = (art && art.image) || 'img/banner-oficial.png';
    if (/assets\/games\//.test(img) || /logo\.jpg$/i.test(img)) {
      return 'img/banner-oficial.png';
    }
    return img;
  }

  function bindOverlayClose(panel, attr, closeFn) {
    if (panel._lyokEscHandler) {
      document.removeEventListener('keydown', panel._lyokEscHandler);
      panel._lyokEscHandler = null;
    }
    function done() {
      if (panel._lyokEscHandler) {
        document.removeEventListener('keydown', panel._lyokEscHandler);
        panel._lyokEscHandler = null;
      }
      closeFn();
    }
    panel.querySelectorAll('[' + attr + ']').forEach(function (el) {
      el.addEventListener('click', done);
    });
    var onEsc = function (e) {
      if (e.key === 'Escape') done();
    };
    panel._lyokEscHandler = onEsc;
    document.addEventListener('keydown', onEsc);
  }

  function focusOverlayCard(panel, selector) {
    var card = panel.querySelector(selector);
    if (!card) return;
    card.setAttribute('tabindex', '-1');
    if (card.focus) card.focus();
  }

  function openNewsArticle(art) {
    var panel = document.getElementById('news-article-panel');
    if (!panel || !art) return;
    var bodyParts = Array.isArray(art.body) ? art.body.slice() : [];
    if (!bodyParts.length && art.excerpt) bodyParts.push(art.excerpt);
    var bodyHtml = bodyParts.map(function (p) { return '<p>' + p + '</p>'; }).join('');
    var closeLabel = getUiLabels().newsPanelClose || 'Cerrar';
    var cover = newsArticleImage(art);
    panel.innerHTML =
      '<div class="news-article-backdrop lyok-overlay-backdrop" data-close-article tabindex="-1" aria-hidden="true"></div>' +
      '<article class="news-article-card lyok-overlay-card card" role="dialog" aria-modal="true" aria-labelledby="news-article-title" tabindex="-1">' +
        '<button type="button" class="news-article-close lyok-overlay-close" data-close-article aria-label="' + closeLabel + '">×</button>' +
        '<div class="news-article-cover"><img src="' + cover + '" alt="" loading="lazy"></div>' +
        '<header class="news-article-head">' +
          '<div class="news-article-meta">' +
            '<span class="news-card-tag">' + art.tag + '</span>' +
            '<time datetime="' + art.date + '">' + formatDate(art.date) + '</time>' +
          '</div>' +
          '<h2 id="news-article-title" class="news-article-title">' + art.title + '</h2>' +
        '</header>' +
        (art.excerpt ? '<div class="news-article-lead"><p>' + art.excerpt + '</p></div>' : '') +
        '<div class="news-article-body">' + bodyHtml + '</div>' +
        '<footer class="news-article-foot">' +
          '<button type="button" class="btn btn-ghost btn-sm" data-close-article>' + closeLabel + '</button>' +
        '</footer>' +
      '</article>';
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('news-panel-open');
    function closePanel() {
      panel.hidden = true;
      panel.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('news-panel-open');
    }
    bindOverlayClose(panel, 'data-close-article', closePanel);
    focusOverlayCard(panel, '.news-article-card');
  }

  function findPlayerById(playerId) {
    if (!playerId || typeof LYOK_DATA === 'undefined') return null;
    var parts = String(playerId).split('-');
    var ri = parseInt(parts.pop(), 10);
    var rk = parts.join('-');
    if (isNaN(ri) || !rk) return null;
    var roster = LYOK_DATA.rosters && LYOK_DATA.rosters[rk];
    if (!roster || !roster[ri]) return null;
    var teamName = '';
    (LYOK_DATA.teams || []).forEach(function (t) {
      if (rosterKeyForTeam(t.id) === rk) teamName = t.name;
    });
    return { player: roster[ri], rosterKey: rk, index: ri, teamName: teamName, id: rk + '-' + ri };
  }

  function openPlayerProfile(playerId) {
    var ctx = findPlayerById(playerId);
    var panel = document.getElementById('player-profile-panel');
    if (!ctx || !panel) return;
    var p = ctx.player;
    var av = p.avatar || (LYOK_DATA.site && LYOK_DATA.site.logo) || 'img/logo.jpg';
    var bio = p.bio || p.note || 'Jugador oficial de LyokFox Sports.';
    var highlights = (p.highlights || []).map(function (h) { return '<span class="tag">' + h + '</span>'; }).join('');
    var twitter = p.twitter ? String(p.twitter).replace(/^@/, '') : '';
    var twitterHtml = twitter
      ? '<a href="https://x.com/' + twitter + '" class="player-panel-social" target="_blank" rel="noopener">@' + twitter + '</a>'
      : '';
    var closeLabel = getUiLabels().playerProfileClose || 'Cerrar';
    panel.innerHTML =
      '<div class="player-panel-backdrop lyok-overlay-backdrop" data-close-player tabindex="-1" aria-hidden="true"></div>' +
      '<article class="player-profile-card lyok-overlay-card card" role="dialog" aria-modal="true" aria-labelledby="player-profile-title" tabindex="-1">' +
        '<button type="button" class="player-panel-close lyok-overlay-close" data-close-player aria-label="' + closeLabel + '">×</button>' +
        '<div class="player-panel-hero">' +
          '<div class="player-panel-avatar"><img src="' + av + '" alt=""></div>' +
          '<div class="player-panel-intro">' +
            (ctx.teamName ? '<p class="player-panel-team">' + ctx.teamName + '</p>' : '') +
            '<h2 class="player-panel-name" id="player-profile-title">' + p.name + (p.captain ? ' <span class="player-card-badge">C</span>' : '') + '</h2>' +
            '<p class="player-panel-role">' + p.role + '</p>' +
            (p.joined ? '<p class="player-panel-joined">En la camada desde ' + p.joined + '</p>' : '') +
            twitterHtml +
          '</div>' +
        '</div>' +
        (highlights ? '<div class="player-panel-tags">' + highlights + '</div>' : '') +
        '<div class="player-panel-body">' +
          (p.note ? '<p class="player-panel-note">' + p.note + '</p>' : '') +
          '<div class="player-panel-bio">' + bio.split('\n').map(function (line) { return '<p>' + line + '</p>'; }).join('') + '</div>' +
        '</div>' +
        '<footer class="player-panel-foot">' +
          '<a href="contactanos.html" class="btn btn-primary btn-sm">Contactar reclutamiento</a>' +
          '<button type="button" class="btn btn-ghost btn-sm" data-close-player>' + closeLabel + '</button>' +
        '</footer>' +
      '</article>';
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('player-panel-open');
    if (history.replaceState) history.replaceState(null, '', '#player-' + ctx.id);
    function closePanel() {
      panel.hidden = true;
      panel.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('player-panel-open');
      if (location.hash.indexOf('#player-') === 0 && history.replaceState) {
        history.replaceState(null, '', location.pathname + location.search);
      }
    }
    bindOverlayClose(panel, 'data-close-player', closePanel);
    focusOverlayCard(panel, '.player-profile-card');
  }

  function initPlayerProfiles() {
    document.querySelectorAll('[data-player-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openPlayerProfile(btn.getAttribute('data-player-id'));
      });
    });
    var hash = location.hash.replace(/^#/, '');
    if (hash.indexOf('player-') === 0) {
      setTimeout(function () { openPlayerProfile(hash.replace('player-', '')); }, 350);
    }
  }

  function highlightCmsItem(selector, opts) {
    opts = opts || {};
    var el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return false;
    document.body.classList.add('lyok-highlight-block');
    el.classList.add('lyok-block-highlight');
    el.scrollIntoView({ behavior: 'auto', block: 'center' });
    setTimeout(function () {
      el.classList.remove('lyok-block-highlight');
      document.body.classList.remove('lyok-highlight-block');
    }, opts.duration || 3200);
    return true;
  }

  function focusPreviewItem(itemKey) {
    if (!itemKey || typeof LYOK_DATA === 'undefined') return;
    var parts = itemKey.split(':');
    var type = parts[0];
    var idx = parts[1];
    var i = idx != null && idx !== '' ? parseInt(idx, 10) : null;

    if (type === 'news' && i != null && !isNaN(i)) {
      var articles = (LYOK_DATA.news && LYOK_DATA.news.articles) || [];
      var art = articles[i];
      if (art) {
        highlightCmsItem('[data-cms-item="news-' + i + '"]');
        setTimeout(function () { openNewsArticle(art); }, 500);
      }
      return;
    }
    if (type === 'match') {
      highlightCmsItem('#match-panel');
      highlightCmsItem('#match-strip');
      return;
    }
    if (type === 'team' && idx) {
      highlightCmsItem('[data-cms-item="team-' + idx + '"], #' + idx);
      return;
    }
    if (type === 'player' && idx) {
      highlightCmsItem('[data-player-id="' + idx + '"], [data-cms-item="player-' + idx + '"]');
      setTimeout(function () { openPlayerProfile(idx); }, 500);
      return;
    }
    if (type === 'story' && i != null && !isNaN(i)) {
      highlightCmsItem('[data-cms-item="story-' + i + '"]');
      return;
    }
    if (type === 'hist' && i != null && !isNaN(i)) {
      highlightCmsItem('[data-cms-item="story-' + i + '"]');
      return;
    }
    if (type === 'mile' && i != null && !isNaN(i)) {
      highlightCmsItem('[data-cms-item="hist-mile-' + i + '"]');
      setTimeout(function () { openHistoryMilestone(i); }, 500);
      return;
    }
    if (type === 'page' && idx) {
      highlightCmsItem('.page-hero .wrap');
      return;
    }
    if (type === 'nav' && i != null && !isNaN(i)) {
      var navItem = (LYOK_DATA.nav || [])[i];
      if (navItem) {
        document.querySelectorAll('#nav a, .nav a').forEach(function (a) {
          if (a.getAttribute('href') === navItem.href || a.textContent.trim() === navItem.label) {
            highlightCmsItem(a);
          }
        });
      }
      return;
    }
    if (type === 'brand' && i != null && !isNaN(i)) {
      highlightCmsItem('[data-cms-item="brand-' + i + '"]');
      return;
    }
    var selMap = {
      schedule: 'schedule-' + i,
      spot: 'spotlight-' + i,
      tier: 'tier-' + i,
      story: 'story-' + i,
      hist: 'story-' + i,
      mile: 'hist-mile-' + i,
      faq: 'faq-' + i,
      stat: 'stat-' + i,
      teamCard: 'discipline-' + i
    };
    if (selMap[type]) highlightCmsItem('[data-cms-item="' + selMap[type] + '"]');
    if (type === 'teamCard' && i != null) highlightCmsItem('[data-cms-item="discipline-' + i + '"]');
  }

  function runPendingItemPreview() {
    try {
      var key = sessionStorage.getItem('lyokfox_preview_item');
      if (!key) return;
      sessionStorage.removeItem('lyokfox_preview_item');
      setTimeout(function () { focusPreviewItem(key); }, 450);
    } catch (e) { /* ignore */ }
  }

  function renderMatchPanel() {
    var el = document.getElementById('match-panel');
    if (!el || typeof LYOK_DATA === 'undefined') return;
    var m = LYOK_DATA.nextMatch;
    var homeLogo = m.homeLogo || (LYOK_DATA.site && LYOK_DATA.site.logo) || 'img/logo.jpg';
    var awayLogo = m.awayLogo || '';
    var leagueLogo = m.leagueLogo || '';
    var logos = (homeLogo || awayLogo || leagueLogo)
      ? '<div class="match-panel-logos">' +
          (homeLogo ? '<img src="' + homeLogo + '" alt="" class="match-logo match-logo--home">' : '') +
          (awayLogo ? '<img src="' + awayLogo + '" alt="" class="match-logo match-logo--away">' : '') +
          (leagueLogo ? '<img src="' + leagueLogo + '" alt="" class="match-logo match-logo--league">' : '') +
        '</div>'
      : '';
    var body =
      logos +
      '<p class="match-panel-vs match-opponent">' + m.home + ' <span style="color:var(--muted);font-size:1.25rem">vs</span> ' + m.away + '</p>' +
      '<p class="match-panel-league match-comp">' + m.league + '</p>' +
      '<p class="match-panel-date">' + m.date + ' · ' + m.time + '</p>' +
      '<p class="card-text" style="margin-bottom:1.25rem">' + m.status + '</p>' +
      '<div class="match-panel-links">' +
        (function () {
          var links = m.links || {};
          var x = links.x || { text: 'Seguir en X →', href: 'https://x.com/LyokFox_' };
          var cal = links.calendar || { text: 'Ver calendario completo →', href: 'index.html#calendario' };
          return '<a href="' + x.href + '" target="_blank" rel="noopener">' + x.text + '</a>' +
            '<a href="' + cal.href + '">' + cal.text + '</a>';
        })() +
      '</div>';
    var games = (LYOK_DATA.teams || []).filter(function (t) { return t.hidden !== true; }).slice(0, 3).map(function (t) {
      return '<a href="equipos.html#' + t.id + '" class="hero-portada-game">' +
        '<img src="' + t.icon + '" alt="" width="28" height="28" loading="lazy">' +
        '<span>' + t.name + '</span></a>';
    }).join('');
    el.setAttribute('data-cms-item', 'match-panel');
    if (el.classList.contains('hero-portada-panel')) {
      el.innerHTML =
        '<div class="hero-portada-panel-head">' +
          '<p class="match-panel-label">' + m.label + '</p>' +
        '</div>' +
        '<div class="hero-portada-match-slot"><div class="featured-match-inner card">' + body + '</div></div>' +
        (games ? '<div class="hero-portada-games">' + games + '</div>' : '');
    } else {
      el.innerHTML = '<p class="match-panel-label">' + m.label + '</p>' + body;
    }
  }

  function stripTargets(id) {
    var targets = [document.getElementById(id)];
    if (id === 'match-strip') {
      targets.push(document.getElementById('page-match-strip'));
    }
    if (id === 'brands-strip') {
      targets.push(document.getElementById('page-brands-strip'));
    }
    return targets.filter(Boolean);
  }

  function renderMatchStrip() {
    var targets = stripTargets('match-strip');
    if (!targets.length || typeof LYOK_DATA === 'undefined') return;
    var m = LYOK_DATA.nextMatch;
    var homeLogo = m.homeLogo || (LYOK_DATA.site && LYOK_DATA.site.logo) || 'img/logo.jpg';
    var awayLogo = m.awayLogo || '';
    var leagueLogo = m.leagueLogo || '';
    var logos = (homeLogo || awayLogo || leagueLogo)
      ? '<span class="match-strip-logos">' +
          (homeLogo ? '<img src="' + homeLogo + '" alt="" class="match-logo match-logo--sm">' : '') +
          (awayLogo ? '<img src="' + awayLogo + '" alt="" class="match-logo match-logo--sm">' : '') +
          (leagueLogo ? '<img src="' + leagueLogo + '" alt="" class="match-logo match-logo--sm match-logo--league">' : '') +
        '</span>'
      : '';
    var html =
      '<div class="wrap match-strip-inner">' +
        logos +
        '<span class="match-label">' + m.label + '</span>' +
        '<span class="match-teams">' + m.home + ' vs ' + m.away + '</span>' +
        '<span class="match-meta">' + m.league + ' · ' + m.date + ' ' + m.time + '</span>' +
      '</div>';
    targets.forEach(function (el) {
      el.setAttribute('data-cms-item', 'match-strip');
      el.innerHTML = html;
    });
  }

  function renderBrands() {
    var targets = stripTargets('brands-strip');
    if (!targets.length || typeof LYOK_DATA === 'undefined' || !LYOK_DATA.brands) return;
    var html =
      '<div class="wrap brands-inner">' +
        '<p class="brands-label">' + ((LYOK_DATA.home && LYOK_DATA.home.brandsLabel) || 'Ligas & circuitos oficiales') + '</p>' +
        '<div class="brands-logos">' +
        LYOK_DATA.brands.map(function (b, i) {
          var name = typeof b === 'string' ? b : (b.name || '');
          var logo = typeof b === 'object' && b ? (b.logo || '') : '';
          if (logo) {
            return '<span class="brand-logo-item" data-cms-item="brand-' + i + '"><img src="' + logo + '" alt="' + name + '"><em>' + name + '</em></span>';
          }
          return '<span data-cms-item="brand-' + i + '">' + name + '</span>';
        }).join('') +
        '</div></div>';
    targets.forEach(function (el) {
      el.innerHTML = html;
    });
  }

  function renderSchedule() {
    var grid = document.getElementById('schedule-grid');
    if (!grid || typeof LYOK_DATA === 'undefined') return;
    grid.className = 'schedule-grid grid-2';
    grid.innerHTML = LYOK_DATA.schedule.map(function (s, i) {
      var live = s.live ? ' <span style="color:var(--accent);font-size:0.625rem;font-weight:700;letter-spacing:0.1em">● EN VIVO</span>' : '';
      var homeLogo = s.homeLogo || (LYOK_DATA.site && LYOK_DATA.site.logo) || 'img/logo.jpg';
      var gameBadge = s.gameIcon
        ? '<img src="' + s.gameIcon + '" alt="" class="schedule-game-badge" loading="lazy">'
        : '';
      var leagueInline = s.leagueLogo
        ? '<img src="' + s.leagueLogo + '" alt="" class="schedule-league-badge" loading="lazy">'
        : '';
      var duel = '';
      if (homeLogo || s.awayLogo) {
        duel = '<div class="schedule-card-duel" aria-hidden="true">' +
          (homeLogo ? '<img src="' + homeLogo + '" alt="" class="schedule-logo-team schedule-logo--home" loading="lazy">' : '') +
          '<span class="schedule-logo-vs">vs</span>' +
          (s.awayLogo ? '<img src="' + s.awayLogo + '" alt="" class="schedule-logo-team schedule-logo--away" loading="lazy">' : '<span class="schedule-logo-team schedule-logo-team--empty"></span>') +
        '</div>';
      }
      return '<article class="card card--schedule reveal" data-cms-item="schedule-' + i + '" style="transition-delay:' + (i * 0.06) + 's">' +
        '<div class="schedule-card-inner">' +
          '<div class="schedule-card-main">' +
            '<div class="schedule-card-meta">' +
              '<p class="card-num">' + s.game + live + '</p>' +
              gameBadge +
            '</div>' +
            '<h3 class="card-title">' + s.vs + '</h3>' +
            '<p class="card-text">' + leagueInline + s.league + '<br><strong style="color:var(--gold);font-family:var(--font-stat)">' + s.when + '</strong></p>' +
          '</div>' +
          duel +
        '</div>' +
      '</article>';
    }).join('');
  }

  function renderSections() {
    var grid = document.getElementById('sections-grid');
    if (!grid || typeof LYOK_DATA === 'undefined') return;
    grid.className = 'grid-3';
    grid.innerHTML = LYOK_DATA.sections.map(function (s, i) {
      var accent = s.accent ? ' card--accent' : '';
      return '<a href="' + s.href + '" class="card' + accent + ' reveal" style="transition-delay:' + (i * 0.07) + 's">' +
        '<p class="card-num">' + s.num + '</p>' +
        '<h2 class="card-title">' + s.title + '</h2>' +
        '<p class="card-text">' + s.text + '</p>' +
        '<span class="card-link">' + (getUiLabels().cardExplore || 'Explorar') + '</span>' +
      '</a>';
    }).join('');
  }

  function renderEquiposStats() {
    var el = document.getElementById('equipos-stats');
    if (!el || typeof LYOK_DATA === 'undefined') return;
    var teams = (LYOK_DATA.teams || []).filter(function (t) { return t.hidden !== true; });
    var disciplineCards = teams.map(function (t, i) {
      var rk = rosterKeyForTeam(t.id);
      var roster = (LYOK_DATA.rosters && LYOK_DATA.rosters[rk]) || [];
      var count = roster.filter(function (p) { return p.hidden !== true; }).length;
      var meta = t.tag || (t.tags && t.tags.slice(0, 2).join(' · ')) || '';
      var icon = t.icon
        ? '<img src="' + t.icon + '" alt="" loading="lazy">'
        : '<span class="equipos-hub-disc-fallback" aria-hidden="true"></span>';
      return '<div class="equipos-hub-disc" data-cms-item="equipos-disc-' + i + '">' +
        '<div class="equipos-hub-disc-icon">' + icon + '</div>' +
        '<div class="equipos-hub-disc-body">' +
        '<strong>' + t.name + '</strong>' +
        '<span>' + count + ' jugadores' + (meta ? ' · ' + meta : '') + '</span>' +
        '</div></div>';
    }).join('');
    var leagueTags = ['VPG', 'PLG', 'VFO'].map(function (l) {
      return '<span class="equipos-hub-league">' + l + '</span>';
    }).join('');
    el.className = 'equipos-hub-band card reveal';
    el.innerHTML =
      '<div class="equipos-hub-band__intro">' +
      '<p class="eyebrow">Roster oficial</p>' +
      '<p class="equipos-hub-band__lead">Plantillas activas en competición <em>ibérica</em>.</p>' +
      '</div>' +
      '<div class="equipos-hub-band__disciplines">' + disciplineCards + '</div>' +
      '<div class="equipos-hub-band__foot">' +
      '<div class="equipos-hub-band__leagues" aria-label="Circuitos oficiales">' + leagueTags + '</div>' +
      '<span class="equipos-hub-band__since">Camada desde <strong>2020</strong></span>' +
      '</div>';
  }

  function renderTeams() {
    var el = document.getElementById('teams-list');
    if (!el || typeof LYOK_DATA === 'undefined') return;
    var teams = LYOK_DATA.teams || [];
    if (!teams.length) return;
    el.className = 'equipos-pro-list';
    el.innerHTML = teams.map(function (t, i) {
      if (t.hidden === true) return '';
      var stats = (t.stats || []).map(function (s) {
        return '<li><strong>' + s.value + '</strong><span>' + s.label + '</span></li>';
      }).join('');
      var tags = (t.tags || []).map(function (tag) { return '<span class="tag">' + tag + '</span>'; }).join('');
      var rKey = rosterKeyForTeam(t.id);
      var roster = ((LYOK_DATA.rosters && LYOK_DATA.rosters[rKey]) || []).filter(function (p) {
        return p.hidden !== true;
      });
      var players = roster.map(function (p, pi) {
        var cap = p.captain ? ' equipos-player--captain' : '';
        var av = p.avatar || (LYOK_DATA.site && LYOK_DATA.site.logo) || 'img/logo.jpg';
        var pid = rKey + '-' + pi;
        return '<button type="button" class="equipos-player card' + cap + '" data-cms-item="player-' + pid + '" data-player-id="' + pid + '" aria-label="Ver perfil de ' + p.name + '">' +
          '<div class="equipos-player-av"><img src="' + av + '" alt="" loading="lazy"></div>' +
          '<span class="equipos-player-name">' + p.name + (p.captain ? '<span class="equipos-player-badge">C</span>' : '') + '</span>' +
          '<span class="equipos-player-role">' + (p.role || 'Jugador') + '</span>' +
          '<span class="equipos-player-note">' + (p.note || '') + '</span>' +
          '<span class="card-link equipos-player-more">Ver perfil</span>' +
        '</button>';
      }).join('');
      var iconWide = t.id === 'eafc' ? ' equipos-pro-icon--wide' : '';
      return '<article class="equipos-pro-team team-block card reveal" id="' + t.id + '" data-cms-item="team-' + t.id + '" style="transition-delay:' + (i * 0.08) + 's">' +
        '<div class="equipos-pro-hero">' +
          '<div class="equipos-pro-icon' + iconWide + '">' +
            '<img src="' + t.icon + '" alt="' + t.name + '" loading="lazy">' +
          '</div>' +
          '<div class="equipos-pro-meta">' +
            '<p class="eyebrow">' + t.tag + '</p>' +
            '<h2 class="equipos-pro-name">' + t.name + '</h2>' +
            '<p class="equipos-pro-about">' + (t.about || '') + '</p>' +
            '<ul class="equipos-pro-stats">' + stats + '</ul>' +
            '<div class="team-tags">' + tags + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="equipos-pro-roster">' +
          '<header class="equipos-pro-roster-head">' +
            '<h3>Plantilla oficial</h3>' +
            '<span>' + roster.length + ' jugadores</span>' +
          '</header>' +
          '<div class="equipos-pro-grid" aria-label="Plantilla ' + t.name + '">' + players + '</div>' +
        '</div>' +
        '<footer class="equipos-pro-foot">' +
          '<a href="contactanos.html?tipo=reclutamiento" class="btn btn-primary btn-sm">Unirse al equipo</a>' +
        '</footer>' +
      '</article>';
    }).join('');
    initPlayerProfiles();
  }

  function historyPlainText(html) {
    if (!html) return '';
    var el = document.createElement('div');
    el.innerHTML = html;
    return (el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function historyExcerpt(text, max) {
    var plain = historyPlainText(text);
    if (plain.length <= (max || 140)) return plain;
    return plain.slice(0, max || 140).replace(/\s+\S*$/, '') + '…';
  }

  function historyStoryImage(block) {
    var img = (block && block.image) || 'img/banner-oficial.png';
    if (!img || /logo\.jpg$/i.test(img)) return 'img/banner-oficial.png';
    return img;
  }

  function historyStoryBodyHtml(text) {
    if (!text) return '';
    if (/<[a-z][\s\S]*>/i.test(text)) {
      return '<div class="history-story-text">' + text + '</div>';
    }
    var parts = String(text).split(/\n+/).filter(function (s) { return s.trim(); });
    if (!parts.length) parts = [text];
    return '<div class="history-story-text">' + parts.map(function (p) { return '<p>' + p.trim() + '</p>'; }).join('') + '</div>';
  }

  function storyBlockClassAndStyle(block, delay) {
    var cls = [];
    var style = (block && block.style) || {};
    if (block && block.wide) cls.push('history-story-block--wide');
    if (style.width === 'wide') cls.push('history-story-block--wide');
    if (style.width === 'full') cls.push('history-story-block--full');
    if (style.padding === 'xl' || style.padding === 'large') cls.push('history-story-block--pad-xl');
    if (block && block.bgImage) cls.push('history-story-block--has-bg');
    var parts = ['transition-delay:' + delay + 's'];
    if (style.titleScale) parts.push('--story-title-scale:' + style.titleScale);
    if (style.textScale) parts.push('--story-text-scale:' + style.textScale);
    if (block && block.bgImage) parts.push('--story-bg-image:url(' + block.bgImage + ')');
    return {
      classExtra: cls.length ? ' ' + cls.join(' ') : '',
      styleAttr: ' style="' + parts.join(';') + '"'
    };
  }

  function historyStoryBlockHtml(block, i) {
    var layout = block.layout || (i === 0 ? 'image-left' : (i === 1 ? 'image-right' : 'center'));
    var delay = (i * 0.06) + 's';
    var extras = storyBlockClassAndStyle(block, delay);
    if (layout === 'center') {
      return '<article class="history-story-block history-story-block--center reveal card' + extras.classExtra + '" data-cms-item="story-' + i + '"' + extras.styleAttr + '>' +
        '<header class="sec-head center">' +
          (block.eyebrow ? '<p class="eyebrow">' + block.eyebrow + '</p>' : '') +
          '<h2 class="section-title">' + (block.title || '') + '</h2>' +
        '</header>' +
        historyStoryBodyHtml(block.text) +
      '</article>';
    }
    var media = '<div class="history-story-media"><img src="' + historyStoryImage(block) + '" alt="" loading="lazy"></div>';
    var copy = '<div class="history-story-copy">' +
      (block.eyebrow ? '<p class="eyebrow">' + block.eyebrow + '</p>' : '') +
      '<h2 class="section-title">' + (block.title || '') + '</h2>' +
      historyStoryBodyHtml(block.text) +
    '</div>';
    var imgFirst = layout !== 'image-right';
    return '<article class="history-story-block history-story-block--' + layout + ' reveal" data-cms-item="story-' + i + '" style="transition-delay:' + (i * 0.06) + 's">' +
      '<div class="history-story-row">' + (imgFirst ? media + copy : copy + media) + '</div>' +
    '</article>';
  }

  function historyStoryBlogSection(blocks) {
    if (!blocks || !blocks.length) return '';
    return '<div class="history-story-blog" data-cms-block="historyStory">' +
      blocks.map(historyStoryBlockHtml).join('') +
    '</div>';
  }

  function getHistoryStoryBlocks(h) {
    if (h.storyBlocks && h.storyBlocks.length) return h.storyBlocks;
    return [];
  }

  function historyChapterImage(c) {
    var img = (c && c.image) || 'img/banner-oficial.png';
    if (/assets\/games\//.test(img) || /logo\.jpg$/i.test(img)) {
      return 'img/banner-oficial.png';
    }
    return img;
  }

  function historyChapterCard(c, i) {
    var num = String(i + 1).padStart(2, '0');
    return '<button type="button" class="hist-chapter-item card reveal" id="hist-' + c.id + '" data-open-history-chapter="' + i + '" data-cms-item="hist-chapter-' + i + '" style="transition-delay:' + (i * 0.05) + 's">' +
      '<span class="hist-chapter-num" aria-hidden="true">' + num + '</span>' +
      '<div class="hist-chapter-main">' +
        '<span class="hist-chapter-era">' + (c.era || '') + '</span>' +
        '<h3 class="hist-chapter-title">' + (c.title || '') + '</h3>' +
        '<p class="hist-chapter-teaser">' + historyExcerpt(c.text, 155) + '</p>' +
      '</div>' +
      '<span class="hist-chapter-cta card-link">Leer capítulo</span>' +
    '</button>';
  }

  function historyChaptersSection(chapters) {
    if (!chapters.length) return '';
    return '<section class="history-chapters-pro reveal" aria-labelledby="history-chapters-title">' +
      '<header class="history-chapters-pro-head sec-head center">' +
        '<p class="eyebrow">Crónica</p>' +
        '<h2 class="section-title" id="history-chapters-title">Capítulos de la <em>camada</em></h2>' +
        '<p class="section-sub">Ocho capítulos de la crónica kitsune — abre cada uno para leerlo entero.</p>' +
      '</header>' +
      '<div class="history-chapters-rail">' +
        chapters.map(historyChapterCard).join('') +
      '</div>' +
    '</section>';
  }

  function newsFeedCard(a, idx, large, delay) {
    var img = newsArticleImage(a);
    var cls = 'news-feed-card card reveal' + (large ? ' news-feed-card--featured' : '');
    return '<article class="' + cls + '" data-news-id="' + a.id + '" data-cms-item="news-' + idx + '" style="transition-delay:' + (delay || 0) + 's">' +
      '<button type="button" class="news-feed-card-btn" data-open-article="' + a.id + '">' +
        '<div class="news-feed-card-cover"><img src="' + img + '" alt="" loading="lazy"></div>' +
        '<div class="news-feed-card-body">' +
          '<span class="news-feed-card-meta">' + a.tag + ' · ' + formatDate(a.date) + '</span>' +
          '<h3 class="news-feed-card-title">' + a.title + '</h3>' +
          '<p class="news-feed-card-excerpt">' + a.excerpt + '</p>' +
          '<span class="card-link news-feed-card-more">' + (getUiLabels().newsReadMore || 'Leer artículo') + '</span>' +
        '</div>' +
      '</button>' +
    '</article>';
  }

  function historyMilestoneCard(m, i) {
    return '<button type="button" class="milestone-card milestone-card--key card reveal" data-open-history-milestone="' + i + '" data-cms-item="hist-mile-' + i + '" style="transition-delay:' + ((i % 4) * 0.05) + 's">' +
      '<div class="milestone-top">' +
        '<span class="milestone-year">' + m.year + '</span>' +
        '<span class="milestone-tag">' + m.tag + '</span>' +
      '</div>' +
      '<h3 class="milestone-title">' + m.title + '</h3>' +
      '<p class="milestone-text">' + m.text + '</p>' +
      '<span class="card-link milestone-more">Ver detalle</span>' +
    '</button>';
  }

  function historyChapterBodyHtml(text) {
    if (!text) return '<div class="history-panel-body"></div>';
    if (/<[a-z][\s\S]*>/i.test(text)) {
      return '<div class="history-panel-body">' + text + '</div>';
    }
    var parts = String(text).split(/\n+/).filter(function (s) { return s.trim(); });
    if (!parts.length) parts = [text];
    return '<div class="history-panel-body">' + parts.map(function (p) { return '<p>' + p.trim() + '</p>'; }).join('') + '</div>';
  }

  function closeHistoryPanel() {
    var panel = document.getElementById('history-detail-panel');
    if (!panel) return;
    panel.hidden = true;
    panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('history-panel-open');
    if (location.hash.indexOf('#hist-') === 0 && history.replaceState) {
      history.replaceState(null, '', location.pathname + location.search);
    }
  }

  function openHistoryChapter(index) {
    if (typeof LYOK_DATA === 'undefined' || !LYOK_DATA.history) return;
    var c = (LYOK_DATA.history.chapters || [])[index];
    var panel = document.getElementById('history-detail-panel');
    if (!c || !panel) return;
    var highlights = (c.highlights || []).map(function (x) { return '<span class="tag">' + x + '</span>'; }).join('');
    var quote = c.quote ? '<blockquote class="history-panel-quote">' + c.quote + '</blockquote>' : '';
    var cover = historyChapterImage(c);
    var closeLabel = 'Cerrar';
    panel.innerHTML =
      '<div class="history-panel-backdrop lyok-overlay-backdrop" data-close-history tabindex="-1" aria-hidden="true"></div>' +
      '<article class="history-chapter-modal lyok-overlay-card card" role="dialog" aria-modal="true" aria-labelledby="history-panel-title" tabindex="-1">' +
        '<button type="button" class="history-panel-close lyok-overlay-close" data-close-history aria-label="' + closeLabel + '">×</button>' +
        '<div class="history-chapter-modal-cover"><img src="' + cover + '" alt="" loading="lazy"></div>' +
        '<header class="history-chapter-modal-head">' +
          '<span class="hist-chapter-era">' + (c.era || 'Capítulo') + '</span>' +
          '<h2 class="section-title history-chapter-modal-title" id="history-panel-title">' + (c.title || '') + '</h2>' +
        '</header>' +
        historyChapterBodyHtml(c.text) +
        (highlights ? '<div class="history-panel-tags">' + highlights + '</div>' : '') +
        quote +
        '<footer class="history-chapter-modal-foot">' +
          '<button type="button" class="btn btn-ghost btn-sm" data-close-history>' + closeLabel + '</button>' +
        '</footer>' +
      '</article>';
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('history-panel-open');
    if (history.replaceState && c.id) history.replaceState(null, '', '#hist-' + c.id);
    bindOverlayClose(panel, 'data-close-history', closeHistoryPanel);
    focusOverlayCard(panel, '.history-chapter-modal');
  }

  function openHistoryMilestone(index) {
    if (typeof LYOK_DATA === 'undefined' || !LYOK_DATA.history) return;
    var m = (LYOK_DATA.history.milestones || [])[index];
    var panel = document.getElementById('history-detail-panel');
    if (!m || !panel) return;
    var closeLabel = 'Cerrar';
    panel.innerHTML =
      '<div class="history-panel-backdrop lyok-overlay-backdrop" data-close-history tabindex="-1" aria-hidden="true"></div>' +
      '<article class="history-chapter-modal history-milestone-modal lyok-overlay-card card" role="dialog" aria-modal="true" aria-labelledby="history-panel-title" tabindex="-1">' +
        '<button type="button" class="history-panel-close lyok-overlay-close" data-close-history aria-label="' + closeLabel + '">×</button>' +
        '<div class="milestone-top">' +
          '<span class="milestone-year">' + m.year + '</span>' +
          '<span class="milestone-tag">' + m.tag + '</span>' +
        '</div>' +
        '<h2 class="section-title history-chapter-modal-title" id="history-panel-title">' + m.title + '</h2>' +
        '<div class="history-panel-body"><p>' + (m.text || '') + '</p></div>' +
        '<footer class="history-chapter-modal-foot">' +
          '<button type="button" class="btn btn-ghost btn-sm" data-close-history>' + closeLabel + '</button>' +
        '</footer>' +
      '</article>';
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('history-panel-open');
    bindOverlayClose(panel, 'data-close-history', closeHistoryPanel);
    focusOverlayCard(panel, '.history-chapter-modal');
  }

  function initHistoryPanels() {
    document.querySelectorAll('[data-open-history-milestone]').forEach(function (btn) {
      if (btn._lyokHistBound) return;
      btn._lyokHistBound = true;
      btn.addEventListener('click', function () {
        openHistoryMilestone(parseInt(btn.getAttribute('data-open-history-milestone'), 10));
      });
    });
  }

  function renderHistory() {
    var wrap = document.getElementById('history-content');
    if (!wrap || typeof LYOK_DATA === 'undefined' || !LYOK_DATA.history) return;
    var h = LYOK_DATA.history;
    var introStats = (h.intro.stats || []).map(function (s) {
      return '<div class="history-stat"><strong>' + s.value + '</strong><span>' + s.label + '</span></div>';
    }).join('');
    var storyBlocks = getHistoryStoryBlocks(h);
    var milestones = h.milestones || [];
    var mileHead = h.milestonesHeader || {};
    wrap.innerHTML =
      '<div class="history-origin reveal card">' +
        '<p class="eyebrow">Origen kitsune</p>' +
        '<h2 class="section-title">' + (h.intro.title || 'Historia') + '</h2>' +
        '<p class="history-origin-lead">' + (h.intro.lead || '') + '</p>' +
        '<div class="history-origin-stats">' + introStats + '</div>' +
      '</div>' +
      historyStoryBlogSection(storyBlocks) +
      '<header class="sec-head center reveal history-milestones-head">' +
        '<p class="eyebrow">' + (mileHead.eyebrow || 'Cronología') + '</p>' +
        '<h2 class="section-title">' + (mileHead.title || 'Hitos <em>clave</em>') + '</h2>' +
        '<p class="section-sub">' + (mileHead.sub || 'Palmarés, ascensos y momentos que marcaron la camada.') + '</p>' +
      '</header>' +
      '<div class="milestone-grid milestone-grid--cols4">' +
        milestones.map(historyMilestoneCard).join('') +
      '</div>';
    initHistoryPanels();
  }

  function renderNewsBreaking() {
    var el = document.getElementById('news-breaking');
    if (!el || typeof LYOK_DATA === 'undefined' || !LYOK_DATA.news) return;
    var vis = (LYOK_DATA.visibility || {});
    if (vis.newsBreaking === false) {
      el.hidden = true;
      el.innerHTML = '';
      return;
    }
    var text = (LYOK_DATA.news.breaking || '').trim();
    if (!text) {
      el.hidden = true;
      el.innerHTML = '';
      return;
    }
    var label = LYOK_DATA.news.breakingLabel || 'Última hora';
    el.hidden = false;
    el.innerHTML =
      '<div class="news-breaking-inner wrap">' +
        '<span class="news-breaking-label">' + label + '</span>' +
        '<div class="news-breaking-track" aria-hidden="true">' +
          '<p class="news-breaking-marquee"><span>' + text + '</span><span>' + text + '</span></p>' +
        '</div>' +
      '</div>';
  }

  function renderNewsSectionHead() {
    var el = document.getElementById('news-section-head');
    if (!el || typeof LYOK_DATA === 'undefined' || !LYOK_DATA.news) return;
    var s = LYOK_DATA.news.sectionHead || {};
    var html = secHeadHtml(mergeSectionHead(s, {
      eyebrow: 'Actualidad',
      title: 'Todas las <em>noticias</em>',
      sub: 'Matchdays, fichajes y novedades del club.'
    }));
    if (html) el.innerHTML = html;
  }

  function renderEquiposSectionHead() {
    var el = document.getElementById('equipos-section-head');
    if (!el || typeof LYOK_DATA === 'undefined') return;
    var s = (LYOK_DATA.equiposPage && LYOK_DATA.equiposPage.sectionHead) || {};
    var html = secHeadHtml(mergeSectionHead(s, {
      eyebrow: 'Plantillas',
      title: 'Nuestros <em>equipos</em>',
      sub: 'Clash Royale y Clubes Pro FC26 — roster oficial.'
    }));
    if (html) el.innerHTML = html;
  }

  function renderNews() {
    var feed = document.getElementById('news-feed');
    if (!feed || typeof LYOK_DATA === 'undefined' || !LYOK_DATA.news) return;
    var allArticles = LYOK_DATA.news.articles || [];
    var articles = allArticles.filter(function (a) { return a.hidden !== true; });
    var articleIndex = function (a) {
      for (var j = 0; j < allArticles.length; j++) {
        if (allArticles[j].id === a.id) return j;
      }
      return 0;
    };
    function card(a, large, delay) {
      return newsFeedCard(a, articleIndex(a), large, delay);
    }
    var topTwo = articles.slice(0, 2);
    var rest = articles.slice(2);
    var rows = '';
    for (var i = 0; i < rest.length; i += 3) {
      rows += '<div class="news-feed-row">' +
        rest.slice(i, i + 3).map(function (a, j) { return card(a, false, (i + 2 + j) * 0.05); }).join('') +
      '</div>';
    }
    feed.innerHTML =
      '<div class="news-feed-grid">' +
        '<div class="news-feed-featured news-feed-featured--duo">' +
          topTwo.map(function (a, idx) { return card(a, true, idx * 0.05); }).join('') +
        '</div>' +
        (rows ? '<div class="news-feed-rows">' + rows + '</div>' : '') +
      '</div>';
    feed.querySelectorAll('[data-open-article]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var id = btn.getAttribute('data-open-article');
        var art = allArticles.find(function (a) { return a.id === id; });
        openNewsArticle(art);
      });
    });
  }

  function renderCuentaPage() {
    /* js/lyok-profile.js */
  }

  function renderSponsorTiers() {
    var grid = document.getElementById('sponsor-tiers');
    if (!grid || typeof LYOK_DATA === 'undefined' || !LYOK_DATA.sponsorTiers) return;
    var onContact = document.body.getAttribute('data-page') === 'contacto';
    var ui = LYOK_DATA.sponsorUi || {};
    var tierCta = ui.tierCta || 'Solicitar';
    var section = grid.closest('#patrocinio') || grid.parentElement;
    var impactEl = document.getElementById('sponsor-pro-impact');
    if (!impactEl && section) {
      impactEl = document.createElement('div');
      impactEl.id = 'sponsor-pro-impact';
      impactEl.className = 'sponsor-pro-impact reveal';
      grid.parentNode.insertBefore(impactEl, grid);
    }
    if (impactEl) {
      impactEl.innerHTML = (LYOK_DATA.stats || []).map(function (s, i) {
        return '<div class="sponsor-pro-impact-card" data-cms-item="sponsor-stat-' + i + '">' +
          '<strong>' + s.value + '</strong><span>' + s.label + '</span></div>';
      }).join('');
    }
    grid.className = 'sponsor-pro-tiers';
    grid.innerHTML = LYOK_DATA.sponsorTiers.map(function (t, i) {
      var perks = t.perks.map(function (p) { return '<li>' + p + '</li>'; }).join('');
      var ctaHref = onContact ? '#contact-form' : 'contactanos.html?tipo=patrocinio';
      var ctaAttrs = onContact ? ' data-sponsor-form-cta' : '';
      var tierSlug = (t.name || '').toLowerCase().replace(/\s+/g, '-');
      return '<article class="sp-tier-card card reveal' + (t.featured ? ' sp-tier-featured' : '') + '" data-cms-item="tier-' + i + '" style="transition-delay:' + (i * 0.1) + 's">' +
        (t.featured ? '<span class="sp-tier-badge">RECOMENDADO</span>' : '') +
        (t.logo ? '<img src="' + t.logo + '" alt="" class="sp-tier-logo" loading="lazy">' : '') +
        '<p class="sp-tier-name">Plan ' + tierSlug + '</p>' +
        '<h3>' + t.name + '</h3>' +
        '<em class="sp-tier-price">' + t.price + '</em>' +
        '<ul class="sp-tier-list">' + perks + '</ul>' +
        '<a href="' + ctaHref + '" class="btn ' + (t.featured ? 'btn-primary' : 'btn-ghost') + ' btn-sm"' + ctaAttrs + '>' + tierCta + '</a>' +
      '</article>';
    }).join('');
    var foot = section && section.querySelector('.sponsor-pro-foot');
    if (!foot && section) {
      var ctaWrap = section.querySelector('.contact-partnerships-cta') || section.querySelector('p[style*="text-align"]');
      if (ctaWrap) ctaWrap.classList.add('sponsor-pro-foot');
    }
    bindSponsorFormCtas();
    renderSponsorDossierCtas();
  }

  function renderSponsorDossierCtas() {
    if (typeof LYOK_DATA === 'undefined') return;
    var ui = LYOK_DATA.sponsorUi || {};
    var text = ui.dossierCta || 'Solicitar dossier completo';
    var href = ui.dossierHref || 'contactanos.html?tipo=patrocinio';
    document.querySelectorAll('[data-sponsor-dossier-cta]').forEach(function (a) {
      a.textContent = text;
      if (a.id !== 'sponsor-contact-cta') a.setAttribute('href', href);
    });
  }

  function bindSponsorFormCtas() {
    document.querySelectorAll('[data-sponsor-form-cta], #sponsor-contact-cta').forEach(function (btn) {
      if (btn._lyokSponsorBound) return;
      btn._lyokSponsorBound = true;
      btn.addEventListener('click', function () {
        var sel = document.querySelector('#tipo');
        if (sel) sel.value = 'patrocinio';
        var form = document.getElementById('contact-form');
        if (form) {
          var first = form.querySelector('input, textarea, select');
          if (first) first.focus({ preventScroll: true });
        }
      });
    });
  }

  function renderContactPage() {
    if (typeof LYOK_DATA === 'undefined') return;
    var cp = LYOK_DATA.contactPage || {};
    var contact = getSiteContact();
    var social = contact.social || LYOK.social;
    var ui = getUiLabels();
    var L = cp.formLabels || {};
    var ph = cp.formPlaceholders || {};
    var opts = (cp.formOptions && cp.formOptions.length) ? cp.formOptions : [
      { value: 'general', label: 'Consulta general' },
      { value: 'reclutamiento', label: 'Reclutamiento / Tryouts' },
      { value: 'patrocinio', label: 'Patrocinio / Partnership' },
      { value: 'prensa', label: 'Prensa / Medios' }
    ];
    var successMsg = cp.formSuccess || ui.contactSuccess || '';
    var channelsEl = document.getElementById('contact-channels');
    if (channelsEl) {
      channelsEl.innerHTML =
        '<a href="mailto:' + contact.email + '" class="contact-pro-channel card">' +
          '<span class="contact-pro-channel-label">Email</span>' +
          '<strong>' + contact.email + '</strong>' +
          '<span>Respuesta en 24–48 h</span>' +
        '</a>' +
        '<a href="' + social.twitter + '" class="contact-pro-channel card" target="_blank" rel="noopener">' +
          '<span class="contact-pro-channel-label">X / Twitter</span>' +
          '<strong>@LyokFox_</strong>' +
          '<span>Matchdays y última hora</span>' +
        '</a>' +
        '<a href="' + social.instagram + '" class="contact-pro-channel card" target="_blank" rel="noopener">' +
          '<span class="contact-pro-channel-label">Instagram</span>' +
          '<strong>LyokFox</strong>' +
          '<span>Highlights y comunidad</span>' +
        '</a>' +
        '<a href="' + social.fans + '" class="contact-pro-channel card" target="_blank" rel="noopener">' +
          '<span class="contact-pro-channel-label">Fans</span>' +
          '<strong>Comunidad</strong>' +
          '<span>Únete a la camada</span>' +
        '</a>';
    }
    var infoEl = document.getElementById('contact-info');
    if (infoEl) {
      infoEl.className = 'contact-info contact-pro-aside card reveal';
      infoEl.innerHTML =
        '<p class="eyebrow">LyokFox Sports</p>' +
        '<h2 class="section-title" id="contact-info-title">' + (cp.infoTitle || 'Hablemos') + '</h2>' +
        '<p>' + (cp.intro || '') + '</p>' +
        '<a href="mailto:' + contact.email + '" class="contact-pro-email">' + contact.email + '</a>' +
        '<div class="contact-pro-facts">' +
          '<p class="contact-pro-fact">Tryouts abiertos en Clash Royale y Clubes Pro FC26.</p>' +
          '<p class="contact-pro-fact">Partnerships B2B con visibilidad en VPG, PLG y VFO.</p>' +
          '<p class="contact-pro-fact">Prensa y medios: dossier y assets bajo petición.</p>' +
        '</div>';
    }
    var formWrap = document.getElementById('contact-form-wrap');
    if (formWrap) {
      formWrap.innerHTML =
        '<form class="contact-form-wrap contact-pro-form card" id="contact-form" aria-label="Formulario de contacto">' +
          '<p class="eyebrow">Formulario</p>' +
          '<h2 class="section-title" id="contact-form-heading">' + (cp.formTitle || 'Escríbenos') + '</h2>' +
          '<div class="form-group">' +
            '<label for="nombre">' + (L.nombre || 'Nombre') + '</label>' +
            '<input type="text" id="nombre" name="nombre" required autocomplete="name" placeholder="' + (ph.nombre || 'Tu nombre') + '">' +
          '</div>' +
          '<div class="form-group">' +
            '<label for="email">' + (L.email || 'Email') + '</label>' +
            '<input type="email" id="email" name="email" required autocomplete="email" placeholder="' + (ph.email || 'tu@email.com') + '">' +
          '</div>' +
          '<div class="form-group">' +
            '<label for="tipo">' + (L.tipo || 'Motivo') + '</label>' +
            '<select id="tipo" name="tipo" required>' +
              opts.map(function (o) { return '<option value="' + o.value + '">' + o.label + '</option>'; }).join('') +
            '</select>' +
          '</div>' +
          '<div class="form-group">' +
            '<label for="mensaje">' + (L.mensaje || 'Mensaje') + '</label>' +
            '<textarea id="mensaje" name="mensaje" required placeholder="' + (ph.mensaje || 'Cuéntanos en qué podemos ayudarte…') + '"></textarea>' +
          '</div>' +
          '<button type="submit" class="btn btn-primary">' + (L.submit || 'Enviar mensaje') + '</button>' +
          '<p class="form-note" id="contact-form-note">' + (cp.formNote || '') + '</p>' +
          '<p class="form-success" id="form-success" role="status"' + (successMsg ? '' : ' hidden') + '>' + successMsg + '</p>' +
        '</form>';
      var nf = document.getElementById('contact-form');
      if (nf) nf._lyokContactBound = false;
      initContactForm();
    }
  }

  function renderEquiposTryouts() {
    if (typeof LYOK_DATA === 'undefined') return;
    var ep = LYOK_DATA.equiposPage || {};
    var btn = ep.tryoutsBtn || { text: 'Contactar reclutamiento', href: 'contactanos.html' };
    var html =
      '<h2 class="section-title" id="join-title">' + (ep.tryoutsTitle || 'Únete a la camada') + '</h2>' +
      '<p class="section-sub">' + (ep.tryoutsSub || 'Buscamos talento en Clash Royale y Clubes Pro.') + '</p>' +
      '<div class="cta-actions"><a href="' + btn.href + '" class="btn btn-primary">' + btn.text + '</a></div>';
    ['equipos-tryouts', 'home-tryouts'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.classList.add('card', 'card--cta');
        el.innerHTML = html;
      }
    });
  }

  function renderHomeNewsTeaser() {
    var grid = document.getElementById('home-news-grid');
    if (!grid || typeof LYOK_DATA === 'undefined' || !LYOK_DATA.news) return;
    var articles = (LYOK_DATA.news.articles || []).filter(function (a) { return a.hidden !== true; });
    if (!articles.length) return;
    var sorted = articles.slice().sort(function (a, b) {
      return String(b.date).localeCompare(String(a.date));
    });
    grid.innerHTML = sorted.slice(0, 3).map(function (a, i) {
      return '<a href="noticias.html?id=' + encodeURIComponent(a.id) + '" class="home-news-card card reveal" data-cms-item="home-news-' + i + '" style="transition-delay:' + (i * 0.08) + 's">' +
        '<span class="home-news-tag">' + a.tag + '</span>' +
        '<strong>' + a.title + '</strong>' +
        '<span class="home-news-meta">' + formatDate(a.date) + ' · ' + (a.readMin || '3') + ' min</span>' +
      '</a>';
    }).join('');
    var teaser = (LYOK_DATA.home && LYOK_DATA.home.newsTeaser) || {};
    var moreWrap = document.querySelector('.home-news-more a');
    if (moreWrap) {
      moreWrap.textContent = teaser.moreText || 'Ver todas las noticias';
      moreWrap.setAttribute('href', teaser.moreHref || 'noticias.html');
    }
  }

  function renderHistoryActions() {
    var el = document.getElementById('history-actions');
    if (!el || typeof LYOK_DATA === 'undefined') return;
    var actions = (LYOK_DATA.historyPage && LYOK_DATA.historyPage.actions) || [];
    el.innerHTML = actions.map(function (a) {
      var cls = a.style === 'ghost' ? 'btn btn-ghost' : 'btn btn-primary';
      return '<a href="' + a.href + '" class="' + cls + '">' + a.text + '</a>';
    }).join(' ');
  }

  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form || form._lyokContactBound) return;
    form._lyokContactBound = true;
    var params = new URLSearchParams(location.search);
    var tipo = params.get('tipo');
    if (tipo) {
      var sel = form.querySelector('[name="tipo"]');
      if (sel) sel.value = tipo;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var cfg = (window.SITE && SITE.supabase) || window.SUPABASE_CONFIG || {};
      if (cfg.enabled && cfg.url && cfg.anonKey) {
        var base = String(cfg.url).replace(/\/$/, '');
        fetch(base + '/rest/v1/contact_messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: cfg.anonKey,
            Authorization: 'Bearer ' + cfg.anonKey,
            Prefer: 'return=minimal'
          },
          body: JSON.stringify({
            name: String(fd.get('nombre') || '').slice(0, 120),
            email: String(fd.get('email') || '').slice(0, 200),
            tipo: String(fd.get('tipo') || 'general').slice(0, 80),
            message: String(fd.get('mensaje') || '').slice(0, 4000),
            page_url: location.href
          })
        }).catch(function () { /* offline */ });
      }
      var subject = encodeURIComponent('LyokFox — ' + (fd.get('tipo') || 'Contacto'));
      var body = encodeURIComponent(
        'Nombre: ' + fd.get('nombre') + '\n' +
        'Email: ' + fd.get('email') + '\n' +
        'Tipo: ' + fd.get('tipo') + '\n\n' +
        fd.get('mensaje')
      );
      window.location.href = 'mailto:' + getSiteContact().email + '?subject=' + subject + '&body=' + body;
      var ok = document.getElementById('form-success');
      if (ok) {
        var cp = (LYOK_DATA && LYOK_DATA.contactPage) || {};
        var ui = getUiLabels();
        var msg = cp.formSuccess || ui.contactSuccess;
        if (msg) ok.textContent = msg;
        ok.hidden = false;
        ok.classList.add('is-visible');
      }
    });
    bindSponsorFormCtas();
  }

  function renderHomeCards() {
    var grid = document.getElementById('home-disciplines');
    if (!grid || typeof LYOK_DATA === 'undefined') return;
    grid.className = LYOK_DATA.teams.length >= 3 ? 'games-showcase-v3-grid grid-3' : 'games-showcase-v3-grid grid-2';
    grid.innerHTML = LYOK_DATA.teams.filter(function (t) { return t.hidden !== true; }).map(function (t, i) {
      return '<a href="equipos.html#' + t.id + '" class="card spotlight-card reveal" data-cms-item="discipline-' + i + '" style="transition-delay:' + (i * 0.1) + 's">' +
        '<img src="' + t.icon + '" alt="" class="card-icon' + (t.id === 'eafc' ? ' card-icon--wide' : '') + '" width="48" height="48" loading="lazy">' +
        '<h3 class="card-title">' + t.name + '</h3>' +
        '<p class="card-text">' + t.tag + '</p>' +
        '<span class="card-link">' + (getUiLabels().cardRoster || 'Ver plantilla') + '</span>' +
      '</a>';
    }).join('');
  }

  function renderHomeSpotlight() {
    var grid = document.getElementById('home-spotlight');
    if (!grid || typeof LYOK_DATA === 'undefined') return;
    var items = LYOK_DATA.spotlight || [];
    grid.className = 'home-spotlight-grid grid-3';
    grid.innerHTML = items.map(function (s, i) {
      var accent = s.accent ? ' card--accent' : '';
      var img = s.image ? '<img src="' + s.image + '" alt="" class="card-spot-img" loading="lazy">' : '';
      return '<a href="' + s.href + '" class="card spotlight-card' + accent + ' reveal" data-cms-item="spotlight-' + i + '" style="transition-delay:' + (i * 0.08) + 's">' +
        img +
        '<p class="card-num">' + s.num + '</p>' +
        '<h3 class="card-title">' + s.title + '</h3>' +
        '<p class="card-text">' + s.text + '</p>' +
        '<span class="card-link">' + (getUiLabels().cardEnter || 'Entrar') + '</span>' +
      '</a>';
    }).join('');
  }

  function applyLiveDraftFromStorage() {
    try {
      var raw = sessionStorage.getItem('lyokfox_live_draft');
      if (!raw || typeof LYOK_DATA === 'undefined') return;
      var parsed = JSON.parse(raw);
      if (parsed.data) {
        Object.keys(parsed.data).forEach(function (k) {
          var v = parsed.data[k];
          if (v && typeof v === 'object' && !Array.isArray(v)) {
            LYOK_DATA[k] = Object.assign(LYOK_DATA[k] || {}, v);
          } else {
            LYOK_DATA[k] = v;
          }
        });
      }
      if (parsed.visibility) {
        LYOK_DATA.visibility = Object.assign({}, LYOK_DATA.visibility || {}, parsed.visibility);
      }
    } catch (e) { /* ignore */ }
  }

  function isStudioFrame() {
    return /(?:^|[?&])studioFrame=1(?:&|$)/.test(location.search);
  }

  function isLocalDev() {
    var h = location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h === '[::1]';
  }

  function useLocalCmsCache() {
    return /(?:^|[?&])cms=local(?:&|$)/.test(location.search);
  }

  /** Localhost = mismos datos que producción si hay Supabase; si no, datos limpios */
  function ensureLocalhostProdParity() {
    if (!isLocalDev()) return;
    if (window.LyokCmsCloud && LyokCmsCloud.isConfigured && LyokCmsCloud.isConfigured()) return;
    var build = LYOK.build || 'web';
    var flag = 'lyokfox_local_parity_' + build;
    if (sessionStorage.getItem(flag)) return;
    try { localStorage.removeItem('lyokfox_studio_v3'); } catch (e) { /* ignore */ }
    sessionStorage.setItem(flag, '1');
    document.documentElement.classList.add('lyok-local-parity');
  }

  function rerenderContent() {
    if (typeof LYOK_DATA === 'undefined') return;
    var page = currentPage();
    applySiteImages();
    applyTheme();
    applyPageStyles();
    applyPageMeta();
    renderHeader();
    renderTicker();
    renderFooter();
    renderPageHero();
    renderMatchStrip();
    renderBrands();
    if (!document.body.classList.contains('lyok-lite')) renderEmbers();

    if (page === 'inicio') {
      renderHomeHero();
      renderHomeSectionHeaders();
      renderSeoContent();
      renderHomeStats();
      renderMatchPanel();
      renderSchedule();
      renderEquiposStats();
      renderTeams();
      renderHomeCards();
      renderHomeSpotlight();
      renderHomeNewsTeaser();
      renderSponsorTiers();
    } else if (page === 'noticias') {
      renderNewsBreaking();
      renderNewsSectionHead();
      renderNews();
    } else if (page === 'historia') {
      renderHistory();
      renderHistoryActions();
    } else if (page === 'equipos') {
      renderEquiposStats();
      renderTeams();
      renderEquiposSectionHead();
      renderEquiposTryouts();
    } else if (page === 'contacto') {
      renderContactPage();
      renderSponsorTiers();
    }

    sanitizeVisibility();
    applyVisibility(LYOK_DATA.visibility);
    initReveal();
    collapseSparseSections();
    stabilizeHeader();
    if (window.LYOK_FX && !document.body.dataset.lyokFxReady) LYOK_FX.init();
    if (page === 'cuenta' && window.LyokProfile) {
      var cuentaApp = document.getElementById('cuenta-app');
      if (!cuentaApp || !cuentaApp.querySelector('#profile-edit-form, #profile-form-login, #auth-form-login')) {
        window.LyokProfile.render();
      }
    }
    document.dispatchEvent(new CustomEvent('lyok:rerender'));
  }

  function refreshFxOnly() {
    if (typeof LYOK_DATA === 'undefined') return;
    applyTheme();
    renderEmbers();
    if (window.LYOK_FX) {
      if (!document.body.dataset.lyokFxReady) LYOK_FX.init();
      else LYOK_FX.sync();
    }
  }

  function refreshMediaOnly() {
    if (typeof LYOK_DATA === 'undefined') return;
    applySiteImages();
    applyTheme();
    renderEmbers();
    if (window.LYOK_FX) {
      if (!document.body.dataset.lyokFxReady) LYOK_FX.init();
      else LYOK_FX.sync();
    }
  }

  function refreshNavOnly() {
    if (typeof LYOK_DATA === 'undefined') return;
    _headerHash = '';
    renderHeader();
    applyVisibility(LYOK_DATA.visibility);
  }

  function applyCmsPreviewPayload(partial) {
    if (!partial || typeof LYOK_DATA === 'undefined') return;
    Object.keys(partial).forEach(function (k) {
      if (partial[k] && typeof partial[k] === 'object' && !Array.isArray(partial[k])) {
        LYOK_DATA[k] = Object.assign(LYOK_DATA[k] || {}, partial[k]);
      } else {
        LYOK_DATA[k] = partial[k];
      }
    });
    rerenderContent();
  }

  function initCmsPreviewBridge() {
    if (document.body.dataset.lyokCmsBridge) return;
    document.body.dataset.lyokCmsBridge = '1';
    window.addEventListener('message', function (e) {
      if (!e.data || e.data.type !== 'lyokfox-cms-preview') return;
      if (window.parent === window && !isStudioFrame()) return;
      applyCmsPreviewPayload(e.data.payload);
      if (e.data.highlight) highlightCmsItem(e.data.highlight);
      var ctx = e.data.previewContext;
      if (ctx && ctx.type === 'news' && ctx.openArticle && ctx.articleId) {
        var art = (LYOK_DATA.news && LYOK_DATA.news.articles || []).find(function (a) { return a.id === ctx.articleId; });
        if (art) setTimeout(function () { openNewsArticle(art); }, 200);
      }
    });
    document.addEventListener('cms:preview-open-article', function (e) {
      var id = e.detail && e.detail.id;
      if (!id || typeof LYOK_DATA === 'undefined') return;
      var art = (LYOK_DATA.news && LYOK_DATA.news.articles || []).find(function (a) { return a.id === id; });
      if (art) openNewsArticle(art);
    });
  }

  function bootCore() {
    loadPublicLyokData();
    if (!cmsMergedFromCloud) {
      ensureCoreContent(typeof LYOK_DATA_DEFAULTS !== 'undefined' ? LYOK_DATA_DEFAULTS : null);
    }
    initCmsPreviewBridge();
    rerenderContent();
    document.body.classList.add('ready', 'lyok-ready');
    initNav();
    initContactForm();
    runPendingItemPreview();
  }

  function bootAfterReady() {
    var cms = window.LyokCmsCloud;
    if (cms && cms.isConfigured && cms.isConfigured() && cms.pullAndApply) {
      cms.pullAndApply(true).then(function (payload) {
        cmsMergedFromCloud = !!(payload && payload.data);
        if (cms.subscribe) cms.subscribe();
        if (!cmsMergedFromCloud && cms.isProdHost && cms.isProdHost()) {
          console.warn('[LyokFox] No se pudo cargar CMS desde Supabase — reintentando…');
          return cms.pullAndApply(true).then(function (retry) {
            cmsMergedFromCloud = !!(retry && retry.data);
            bootCore();
          });
        }
        bootCore();
      }).catch(function () { bootCore(); });
    } else {
      bootCore();
    }
  }

  function boot() {
    try {
      if (isStudioFrame()) document.body.classList.add('studio-frame-page');
      ensureLocalhostProdParity();
      var profileReady = (window.LyokProfile && LyokProfile.ready) ? LyokProfile.ready() : Promise.resolve();
      profileReady.then(bootAfterReady);
    } catch (err) {
      console.error('[LyokFox] Error al iniciar la web:', err);
      var header = document.getElementById('site-header');
      if (header && !header.innerHTML.trim()) {
        header.innerHTML =
          '<header class="site-header" id="header">' +
            '<div class="wrap header-inner">' +
              '<a href="index.html" class="brand"><span>LYOK<span class="accent">FOX</span></span></a>' +
            '</div>' +
          '</header>';
      }
    }
  }

  window.lyokRerender = rerenderContent;
  window.lyokRefreshFx = refreshFxOnly;
  window.lyokRefreshMedia = refreshMediaOnly;
  window.lyokRefreshNav = refreshNavOnly;
  window.LYOK_PREVIEW = {
    focusItem: focusPreviewItem,
    highlight: highlightCmsItem,
    openNews: openNewsArticle,
    openPlayer: openPlayerProfile,
    openHistoryChapter: openHistoryChapter
  };

  window.applyLyokTheme = applyTheme;
  window.applyLyokVisibility = applyVisibility;
  window.applyPageMeta = applyPageMeta;
  window.applyCmsPreviewPayload = applyCmsPreviewPayload;
  window.applyStudioEnvelope = applyStudioEnvelope;
  window.replaceStudioEnvelope = replaceStudioEnvelope;
  window.renderTicker = renderTicker;
  window.renderHeader = renderHeader;

  window.LYOK = LYOK;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
