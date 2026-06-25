/* LyokFox — FX ligeros: delegación, scroll unificado, sin trabajo en idle */
(function () {
  'use strict';

  var CARD_SEL =
    '.card, .tier, .match-panel, .card--schedule, .team-block, .news-card, ' +
    '.faq-item, .contact-form-wrap, .cuenta-card, .history-chapter, .milestone-item';
  var MAG_SEL = '.btn-primary, .btn-gold';

  var cached = null;
  var dustBuilt = -1;
  var spotEl = null;
  var tiltCard = null;
  var magBtn = null;
  var tiltRaf = false;
  var spotRaf = false;
  var scrollRaf = false;
  var scrollPauseTimer = null;
  var pointerBound = false;
  var lastMouse = { x: 0, y: 0 };

  function fxSettings() {
    if (cached) return cached;
    var fx = (typeof LYOK_DATA !== 'undefined' && LYOK_DATA.theme && LYOK_DATA.theme.effects) || {};
    var profile = fx.perfProfile || 'balanced';
    var dustBase = fx.dustCount != null ? fx.dustCount : (profile === 'ultra' ? 10 : profile === 'balanced' ? 6 : 4);
    var emberBase = fx.emberCount != null ? fx.emberCount : (profile === 'ultra' ? 8 : profile === 'balanced' ? 6 : 4);
    cached = {
      mesh: fx.mesh !== false,
      dust: fx.dust !== false,
      spotlight: fx.spotlight === true && profile === 'ultra',
      scanline: fx.scanline === true && profile === 'ultra',
      heroCinema: fx.heroCinema === true && profile === 'ultra',
      cardTilt: fx.cardTilt === true && profile === 'ultra',
      magneticBtns: fx.magneticBtns === true && profile === 'ultra',
      dustCount: Math.max(0, Math.min(32, dustBase)),
      emberCount: Math.max(0, Math.min(24, emberBase)),
      meshBlur: fx.meshBlur != null ? fx.meshBlur : (profile === 'ultra' ? 48 : 32),
      spotlightSize: fx.spotlightSize != null ? fx.spotlightSize : 420,
      tiltStrength: fx.tiltStrength != null ? fx.tiltStrength : 0.85,
      magneticStrength: fx.magneticStrength != null ? fx.magneticStrength : 0.1,
      perfProfile: profile,
      wantsPointer: false
    };
    cached.wantsPointer = cached.spotlight || cached.cardTilt || cached.magneticBtns;
    return cached;
  }

  function invalidateSettings() {
    cached = null;
    dustBuilt = -1;
    spotEl = null;
  }

  function reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.body.classList.contains('lyok-no-anim');
  }

  function canHover() {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }

  function isLiteContext() {
    return document.body.classList.contains('studio-frame-page') ||
      document.body.classList.contains('lyok-fx-lite') ||
      window.innerWidth < 768;
  }

  function removeLayer(sel) {
    document.querySelectorAll(sel).forEach(function (el) { el.remove(); });
  }

  function buildDust(count) {
    if (dustBuilt === count && document.querySelector('.fx-dust-field')) return;
    dustBuilt = count;
    removeLayer('.fx-dust-field');
    if (!count || document.body.classList.contains('fx-off-dust') || reducedMotion() || isLiteContext()) return;
    var dust = document.createElement('div');
    dust.className = 'fx-dust-field';
    dust.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < count; i++) {
      var m = document.createElement('span');
      m.className = 'fx-dust-mote' + (i % 6 === 0 ? ' fx-dust-mote--gold' : '');
      m.style.left = (Math.random() * 100) + '%';
      m.style.top = (40 + Math.random() * 60) + '%';
      m.style.animationDuration = (18 + Math.random() * 14) + 's';
      m.style.animationDelay = (Math.random() * 10) + 's';
      m.style.setProperty('--drift-x', (Math.random() * 40 - 20) + 'px');
      m.style.setProperty('--drift-y', (-30 - Math.random() * 50) + 'px');
      dust.appendChild(m);
    }
    document.body.insertBefore(dust, document.body.firstChild);
  }

  function syncAmbient() {
    var s = fxSettings();
    if (!document.body.classList.contains('page-fx') || reducedMotion() || isLiteContext()) {
      removeLayer('.fx-mesh-bg, .fx-spotlight, .fx-dust-field, .fx-scanline');
      document.body.classList.remove('hero-cinema-on');
      return;
    }
    var root = document.documentElement;
    root.style.setProperty('--fx-mesh-blur', s.meshBlur + 'px');
    root.style.setProperty('--fx-spotlight-size', s.spotlightSize + 'px');
    root.style.setProperty('--fx-tilt-strength', String(s.tiltStrength));
    root.style.setProperty('--fx-magnetic-strength', String(s.magneticStrength));

    if (!document.body.classList.contains('fx-off-mesh') && s.mesh) {
      if (!document.querySelector('.fx-mesh-bg')) {
        var mesh = document.createElement('div');
        mesh.className = 'fx-mesh-bg';
        mesh.setAttribute('aria-hidden', 'true');
        document.body.insertBefore(mesh, document.body.firstChild);
      }
    } else {
      removeLayer('.fx-mesh-bg');
    }

    if (!document.body.classList.contains('fx-off-spotlight') && s.spotlight && canHover()) {
      if (!document.querySelector('.fx-spotlight')) {
        spotEl = document.createElement('div');
        spotEl.className = 'fx-spotlight';
        spotEl.setAttribute('aria-hidden', 'true');
        document.body.insertBefore(spotEl, document.body.firstChild);
      } else {
        spotEl = document.querySelector('.fx-spotlight');
      }
    } else {
      removeLayer('.fx-spotlight');
      spotEl = null;
    }

    buildDust(s.dust ? s.dustCount : 0);

    if (!document.body.classList.contains('fx-off-scanline') && s.scanline) {
      if (!document.querySelector('.fx-scanline')) {
        var scan = document.createElement('div');
        scan.className = 'fx-scanline';
        scan.setAttribute('aria-hidden', 'true');
        document.body.appendChild(scan);
      }
    } else {
      removeLayer('.fx-scanline');
    }

    bindPointerFx();
  }

  function resetTilt(card) {
    if (!card) return;
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  }

  function onPointerFrame() {
    var s = fxSettings();
    if (spotEl && s.spotlight && !document.body.classList.contains('fx-off-spotlight')) {
      spotEl.style.left = lastMouse.x + 'px';
      spotEl.style.top = lastMouse.y + 'px';
    }
    if (magBtn && s.magneticBtns && !document.body.classList.contains('fx-off-magnetic')) {
      var rMag = magBtn.getBoundingClientRect();
      var k = s.magneticStrength;
      var mx = (lastMouse.x - rMag.left - rMag.width / 2) * k;
      var my = (lastMouse.y - rMag.top - rMag.height / 2) * k;
      magBtn.style.transform = 'translate3d(' + mx.toFixed(1) + 'px,' + my.toFixed(1) + 'px,0)';
    }
    if (tiltCard && s.cardTilt && !document.body.classList.contains('fx-off-tilt')) {
      var r = tiltCard.getBoundingClientRect();
      var px = (lastMouse.x - r.left) / r.width - 0.5;
      var py = (lastMouse.y - r.top) / r.height - 0.5;
      var str = s.tiltStrength;
      tiltCard.style.setProperty('--spot-x', ((lastMouse.x - r.left) / r.width * 100) + '%');
      tiltCard.style.setProperty('--spot-y', ((lastMouse.y - r.top) / r.height * 100) + '%');
      tiltCard.style.setProperty('--tilt-x', (py * -4 * str).toFixed(2) + 'deg');
      tiltCard.style.setProperty('--tilt-y', (px * 4.5 * str).toFixed(2) + 'deg');
    }
    spotRaf = false;
    tiltRaf = false;
  }

  function bindPointerFx() {
    var s = fxSettings();
    if (!s.wantsPointer || !canHover() || reducedMotion() || isLiteContext()) return;
    if (pointerBound) return;
    pointerBound = true;

    document.addEventListener('mousemove', function (e) {
      lastMouse.x = e.clientX;
      lastMouse.y = e.clientY;
      if (!fxSettings().wantsPointer) return;

      if (!document.body.classList.contains('fx-off-tilt')) {
        var card = e.target.closest && e.target.closest(CARD_SEL);
        if (!card) {
          if (tiltCard) { resetTilt(tiltCard); tiltCard = null; }
        } else if (fxSettings().cardTilt) {
          if (tiltCard !== card) {
            if (tiltCard) resetTilt(tiltCard);
            tiltCard = card;
            card.classList.add('fx-tilt-card');
          }
        }
      }

      if (!spotRaf && !tiltRaf) {
        spotRaf = true;
        tiltRaf = true;
        requestAnimationFrame(onPointerFrame);
      }
    }, { passive: true });

    document.addEventListener('mouseover', function (e) {
      if (!fxSettings().magneticBtns || document.body.classList.contains('fx-off-magnetic')) return;
      var btn = e.target.closest && e.target.closest(MAG_SEL);
      if (btn) {
        magBtn = btn;
        btn.classList.add('fx-magnetic-btn');
      }
    }, { passive: true });

    document.addEventListener('mouseout', function (e) {
      if (magBtn && e.target.closest && !e.target.closest(MAG_SEL)) {
        magBtn.style.transform = '';
        magBtn = null;
      }
    }, { passive: true });
  }

  function initHeroCinema() {
    var s = fxSettings();
    if (!s.heroCinema || document.body.classList.contains('fx-off-hero-cinema') || reducedMotion() || isLiteContext()) {
      document.body.classList.remove('hero-cinema-on');
      removeLayer('.hero-cinema-beam');
      return;
    }
    var hero = document.querySelector('.hero');
    if (!hero) return;
    document.body.classList.add('hero-cinema-on');
    if (!hero.querySelector('.hero-cinema-beam')) {
      var beam = document.createElement('div');
      beam.className = 'hero-cinema-beam';
      beam.setAttribute('aria-hidden', 'true');
      hero.appendChild(beam);
    }
  }

  function onScrollFrame() {
    var header = document.getElementById('header');
    if (header) {
      if (document.body.classList.contains('page-inner')) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.toggle('is-scrolled', window.scrollY > 40);
      }
    }
    if (!document.body.classList.contains('is-scrolling')) {
      document.body.classList.add('is-scrolling');
    }
    clearTimeout(scrollPauseTimer);
    scrollPauseTimer = setTimeout(function () {
      document.body.classList.remove('is-scrolling');
    }, 220);
    scrollRaf = false;
  }

  function initScrollPerf() {
    if (document.body.dataset.fxScrollPerf) return;
    document.body.dataset.fxScrollPerf = '1';
    window.addEventListener('scroll', function () {
      if (!scrollRaf) {
        scrollRaf = true;
        requestAnimationFrame(onScrollFrame);
      }
    }, { passive: true });
    onScrollFrame();
  }

  function initTickerPerf() {
    document.addEventListener('visibilitychange', function () {
      var track = document.querySelector('.ticker-track');
      if (!track) return;
      track.style.animationPlayState = document.hidden ? 'paused' : 'running';
    });
  }

  function initStaggerReveal() {
    /* reveal estático — sin delays escalonados al pintar */
  }

  function init() {
    if (!document.body.classList.contains('page-fx')) return;
    syncAmbient();
    initHeroCinema();
    initScrollPerf();
    initTickerPerf();
    initStaggerReveal();
    document.body.dataset.lyokFxReady = '1';
  }

  function sync() {
    var prev = cached;
    invalidateSettings();
    var next = fxSettings();
    if (prev && prev.perfProfile === next.perfProfile && prev.dustCount === next.dustCount && prev.mesh === next.mesh) {
      cached = next;
      return;
    }
    syncAmbient();
    initHeroCinema();
  }

  window.LYOK_FX = { init: init, sync: sync };
})();
