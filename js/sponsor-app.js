(function () {
  'use strict';

  function esc(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function partnerHref(p) {
    if (p.type === 'league' && typeof SITE !== 'undefined' && SITE.leagues && SITE.leagues[p.key]) {
      return SITE.leagues[p.key];
    }
    if (p.type === 'partner' && typeof SITE !== 'undefined' && SITE.partners && SITE.partners[p.key]) {
      return SITE.partners[p.key];
    }
    if (p.type === 'social' && typeof SITE !== 'undefined' && SITE.social && SITE.social.fans) {
      return SITE.social.fans;
    }
    return '#';
  }

  function partnerAttrs(p) {
    if (p.type === 'league') return ' data-site-league="' + p.key + '"';
    if (p.type === 'partner') return ' data-site-partner="' + p.key + '"';
    if (p.type === 'social') return ' data-site-social="fans"';
    return '';
  }

  function formatImpactValue(stat) {
    if (stat.suffix === 'M+') return stat.value + 'M+';
    if (typeof stat.value === 'number' && stat.value >= 1000 && !stat.suffix) {
      return stat.value.toLocaleString('es-ES');
    }
    return stat.value + (stat.suffix || '');
  }

  function renderHeroStats() {
    var el = document.getElementById('sponsor-hero-stats');
    if (!el || !SPONSOR.heroStats) return;
    el.innerHTML = SPONSOR.heroStats.map(function (s) {
      return '<div class="sp-hero-stat reveal-item">' +
        '<strong>' + esc(s.value) + '</strong>' +
        '<span>' + esc(s.label) + '</span>' +
        '<em>' + esc(s.sub) + '</em>' +
      '</div>';
    }).join('');
  }

  function renderWhy() {
    var el = document.getElementById('sponsor-why');
    if (!el || !SPONSOR.whyJoin) return;
    el.innerHTML = SPONSOR.whyJoin.map(function (w) {
      return '<article class="sp-why-card reveal-item">' +
        '<span class="sp-why-icon">' + w.icon + '</span>' +
        '<h3>' + esc(w.title) + '</h3>' +
        '<p>' + esc(w.desc) + '</p>' +
      '</article>';
    }).join('');
  }

  function renderImpact() {
    var el = document.getElementById('sponsor-impact-stats');
    if (!el || !SPONSOR.impactStats) return;
    el.innerHTML = SPONSOR.impactStats.map(function (s, i) {
      var countAttr = typeof s.value === 'number' && s.suffix !== 'M+'
        ? ' data-count="' + s.value + '"'
        : '';
      var valHtml = typeof s.value === 'number' && s.suffix !== 'M+'
        ? '<strong' + countAttr + '>0</strong>'
        : '<strong>' + esc(formatImpactValue(s)) + '</strong>';
      if (s.suffix === 'M+') {
        valHtml = '<strong>' + esc(formatImpactValue(s)) + '</strong>';
      }
      return '<article class="sp-impact-card reveal-item">' +
        valHtml +
        '<span>' + esc(s.label) + '</span>' +
        '<p>' + esc(s.desc) + '</p>' +
      '</article>';
    }).join('');
  }

  function renderAchievements() {
    var el = document.getElementById('sponsor-trophies');
    if (!el || !SPONSOR.achievements) return;
    el.innerHTML = SPONSOR.achievements.map(function (a) {
      return '<article class="sp-trophy-card sp-tier-' + a.tier + ' reveal-item">' +
        '<span class="sp-trophy-game">' + esc(a.game) + '</span>' +
        '<h3>' + esc(a.title) + '</h3>' +
        '<p>' + esc(a.detail) + '</p>' +
      '</article>';
    }).join('');
  }

  function renderPackages() {
    var el = document.getElementById('sponsor-tiers');
    if (!el || !SPONSOR.packages) return;
    el.innerHTML = SPONSOR.packages.map(function (pkg) {
      var cls = 'sp-tier-card sp-tier-' + pkg.id + (pkg.highlight ? ' sp-tier-featured' : '');
      return '<article class="' + cls + ' reveal-item">' +
        (pkg.highlight ? '<span class="sp-tier-badge">Más demandado</span>' : '') +
        '<p class="sp-tier-name">' + esc(pkg.name) + '</p>' +
        '<h3>' + esc(pkg.price) + '</h3>' +
        '<em class="sp-tier-tag">' + esc(pkg.tagline) + '</em>' +
        '<ul class="sp-tier-list">' +
          pkg.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') +
        '</ul>' +
        '<a href="' + (typeof SITE !== 'undefined' ? SITE.pages.contacto : 'contactanos.html') + '?tipo=patrocinio&amp;paquete=' + encodeURIComponent(pkg.id) + '" class="btn ' + (pkg.highlight ? 'btn-primary' : 'btn-glass') + ' btn-sm btn-full" data-site-page="contacto">' + esc(pkg.cta) + '</a>' +
      '</article>';
    }).join('');
  }

  function renderDeliverables() {
    var el = document.getElementById('sponsor-deliverables');
    if (!el || !SPONSOR.deliverables) return;
    el.innerHTML = SPONSOR.deliverables.map(function (d) {
      return '<article class="sp-deliver-card reveal-item">' +
        '<span class="sp-deliver-icon">' + d.icon + '</span>' +
        '<h3>' + esc(d.title) + '</h3>' +
        '<ul>' + d.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>' +
      '</article>';
    }).join('');
  }

  function renderAudience() {
    var el = document.getElementById('sponsor-audience');
    if (!el || !SPONSOR.audience) return;
    el.innerHTML = '<div class="sp-audience-grid">' +
      SPONSOR.audience.map(function (a) {
        return '<div class="sp-audience-pill reveal-item">' +
          '<strong>' + esc(a.pct) + '</strong>' +
          '<span>' + esc(a.label) + '</span>' +
          '<em>' + esc(a.desc) + '</em>' +
        '</div>';
      }).join('') +
      '</div>' +
      '<blockquote class="sp-quote reveal-item">' +
        '<p>“' + esc(SPONSOR.quote.text) + '”</p>' +
        '<footer><strong>' + esc(SPONSOR.quote.author) + '</strong> · ' + esc(SPONSOR.quote.role) + '</footer>' +
      '</blockquote>';
  }

  function renderProcess() {
    var el = document.getElementById('sponsor-process');
    if (!el || !SPONSOR.process) return;
    el.innerHTML = SPONSOR.process.map(function (p) {
      return '<article class="sp-step reveal-item">' +
        '<span class="sp-step-num">' + esc(p.step) + '</span>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p>' + esc(p.desc) + '</p>' +
      '</article>';
    }).join('');
  }

  function renderPartners() {
    var el = document.getElementById('sponsor-partners-grid');
    if (!el || !SPONSOR.partners) return;
    el.innerHTML = SPONSOR.partners.map(function (p) {
      return '<a href="' + esc(partnerHref(p)) + '"' + partnerAttrs(p) +
        ' target="_blank" rel="noopener" class="sp-partner-card reveal-item">' +
        '<span class="sp-partner-name">' + esc(p.name) + '<em>' + esc(p.sub) + '</em></span>' +
        '<p>' + esc(p.desc) + '</p>' +
      '</a>';
    }).join('');
  }

  function initSponsorCounters() {
    var grid = document.getElementById('sponsor-impact-stats');
    if (!grid) return;
    var counted = false;
    var obs = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting || counted) return;
      counted = true;
      grid.querySelectorAll('[data-count]').forEach(function (el) {
        var target = +el.dataset.count;
        var start = performance.now();
        var tick = function (now) {
          var p = Math.min((now - start) / 1800, 1);
          el.textContent = Math.floor((1 - Math.pow(1 - p, 4)) * target).toLocaleString('es-ES');
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target.toLocaleString('es-ES');
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.25 });
    obs.observe(grid);
  }

  function initSponsor() {
    if (document.body.dataset.page !== 'sponsor') return;
    if (typeof SPONSOR === 'undefined') return;
    renderHeroStats();
    renderWhy();
    renderImpact();
    renderAchievements();
    renderPackages();
    renderDeliverables();
    renderAudience();
    renderProcess();
    renderPartners();
    initSponsorCounters();
    if (typeof applyImages === 'function') applyImages(document.body);
    if (typeof syncSiteLinks === 'function') syncSiteLinks();
  }

  document.addEventListener('layout:ready', initSponsor);
  if (document.getElementById('site-header') && document.getElementById('site-header').innerHTML) {
    initSponsor();
  }
})();
