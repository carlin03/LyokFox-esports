/* LyokFox Studio — vista previa exacta por bloque */
(function () {
  'use strict';

  var debounceTimer = null;
  var focusTimer = null;
  var iframeLoadTimer = null;
  var previewDevice = 'desktop';
  var currentSection = 'studio-home';
  var activeFieldId = '';
  var editorContext = {};
  var userPanelPref = null;

  /* off = sin vista previa útil (copia seguridad, buscadores…) */
  var SECTION_PANEL = {
    advanced: 'off',
    'extra-seo': 'off',
    'ult-site-plus': 'off',
    'cohesion-map': 'off',
    'ult-map': 'off'
  };

  var TARGETS = {
    'studio-home': { page: 'inicio', label: 'Inicio', highlight: '.hm-hero, .hm-stats' },
    guide: { page: 'inicio', label: 'Inicio', highlight: '.hm-hero' },
    home: { page: 'inicio', label: 'Portada', highlight: '.hm-hero, .hm-grid' },
    quick: { page: 'inicio', label: 'Portada rápida', highlight: '.hm-hero, #featured-match' },
    schedule: { page: 'inicio', label: 'Calendario', highlight: '#featured-match, #schedule-grid', hash: 'calendario' },
    'home-sections': { page: 'inicio', label: 'Bloques inicio', highlight: '.hm-links, .home-kp-bar, .games-row-min' },
    'page-inicio': { page: 'inicio', label: 'Inicio', highlight: '.hm-hero, .hm-links' },
    'extra-inicio': { page: 'inicio', label: 'Inicio extra', highlight: '.hm-next, .match-hub' },
    'ult-inicio-extra': { page: 'inicio', label: 'Inicio avanzado', highlight: '.hm-links, .match-hub, .home-news-min' },
    'page-equipos': { page: 'equipos', label: 'Equipos', highlight: '.lyok-intro-band' },
    teams: { page: 'equipos', label: 'Equipos', highlight: '.lyok-intro-band' },
    players: { page: 'equipos', label: 'Jugador', highlight: '.player' },
    'extra-equipos': { page: 'equipos', label: 'Textos equipos', highlight: '.lyok-intro-band' },
    'ult-equipos': { page: 'equipos', label: 'UI equipos', highlight: '.equipos-hub-band' },
    'page-comunidad': { page: 'comunidad', label: 'Comunidad', highlight: '.page-hero-comunidad, .comm-hub-bar' },
    community: { page: 'comunidad', label: 'Comunidad', highlight: '#comm-hero-stats, .comm-hub-stats' },
    'comm-missions': { page: 'comunidad', label: 'Misiones', highlight: '#misiones, .comm-v4-panel[data-panel="misiones"]', hash: 'misiones' },
    'comm-shop': { page: 'comunidad', label: 'Tienda', highlight: '#comm-shop, #tienda', hash: 'tienda' },
    'ult-com-shop': { page: 'comunidad', label: 'Tienda', highlight: '#comm-shop', hash: 'tienda' },
    'ult-com-games': { page: 'comunidad', label: 'Juegos', highlight: '#juegos, .comm-v4-panel[data-panel="juegos"]', hash: 'juegos' },
    'comm-social': { page: 'comunidad', label: 'Redes', highlight: '#apoya-redes, .comm-v4-panel[data-panel="redes"]', hash: 'apoya-redes' },
    'page-noticias': { page: 'noticias', label: 'Noticias', highlight: '.page-hero-noticias, .news-feed-section' },
    news: { page: 'noticias', label: 'Noticia', highlight: '.news-feed-grid, .news-feed-card' },
    'extra-noticias': { page: 'noticias', label: 'Portal noticias', highlight: '.page-hero-noticias' },
    'ult-noticias-ui': { page: 'noticias', label: 'Cabecera noticias', highlight: '.page-hero-noticias, #news-hero-stats' },
    'page-historia': { page: 'historia', label: 'Historia', highlight: '.page-hero, #history-content' },
    'historia-completa': { page: 'historia', label: 'Capítulo', highlight: '.hist-chapter-item' },
    history: { page: 'historia', label: 'Historia intro', highlight: '.history-origin, #history-content' },
    'history-chapters': { page: 'historia', label: 'Capítulo', highlight: '.hist-chapter-item' },
    'page-sponsor': { page: 'sponsor', label: 'Sponsor', highlight: '.sp-hero' },
    sponsor: { page: 'sponsor', label: 'Sponsor', highlight: '.sp-packages' },
    'prem-sponsor-texts': { page: 'sponsor', label: 'Textos sponsor', highlight: '.sp-section' },
    'page-contacto': { page: 'contacto', label: 'Contacto', highlight: '.contact-hero' },
    contact: { page: 'contacto', label: 'Contacto', highlight: '#form' },
    'extra-contacto': { page: 'contacto', label: 'Formulario', highlight: '#form' },
    'page-cuenta': { page: 'cuenta', label: 'Mi cuenta', highlight: '.cuenta-hero' },
    'extra-cuenta': { page: 'cuenta', label: 'Perfil', highlight: '.cuenta-hero' },
    'extra-perfil': { page: 'inicio', label: 'Perfil cabecera', highlight: '#site-header .header-profile-btn' },
    brand: { page: 'inicio', label: 'Marca', highlight: '#site-header .brand' },
    'prem-header': { page: 'inicio', label: 'Menú', highlight: '#site-header, .nav' },
    'prem-icons': { page: 'inicio', label: 'Imágenes', highlight: '.hero-portada-logo, .hero-banner' },
    'images-easy': { page: 'inicio', label: 'Logo y banner', highlight: '.hero-portada-logo' },
    media: { page: 'inicio', label: 'Medios', highlight: '.hero-portada-logo' },
    'prem-visibility': { page: 'inicio', label: 'Visibilidad', highlight: 'main' },
    pages: { page: 'inicio', label: 'Textos página', highlight: '.page-hero' },
    'ticker-easy': { page: 'inicio', label: 'Barra naranja', highlight: '#site-live-ticker' },
    'extra-seo': { page: 'inicio', label: 'Buscadores', highlight: 'main' },
    advanced: { page: 'inicio', label: 'Copia seguridad', highlight: 'main' }
  };

  var FIELD_RULES = [
    { re: /^cms-home-eyebrow|^cms-home-tagline|^cms-home-cta|^cms-home-disciplines|^cms-quick-/, page: 'inicio', highlight: '.hm-hero, [data-cms-tagline]' },
    { re: /^cms-home-stat|^cms-home-hud/, page: 'inicio', highlight: '.hm-stats, [data-cms-stat]' },
    { re: /^cms-home-sp-/, page: 'inicio', highlight: '.home-spotlight [data-cms-spotlight]' },
    { re: /^cms-kp-|^cms-in-|^cms-game-|^cms-md-/, page: 'inicio', highlight: '.home-kp-section, .games-showcase-v3, .match-hub, .home-news-teaser' },
    { re: /^cms-img-|^prem-icon-/, page: 'inicio', highlight: '.hero-portada-logo, .hero-banner, #site-header .brand img' },
    { re: /^cms-feat-|^extra-in-match|^cms-match-slot/, page: 'inicio', highlight: '#featured-match, .hero-portada-panel', hash: 'calendario' },
    { re: /^cms-match-/, page: 'inicio', highlight: '#schedule-grid .match-card', hash: 'calendario' },
    { re: /^cms-site-ticker|^cms-ticker|^prem-site-ticker/, page: 'inicio', highlight: '#site-live-ticker' },
    { re: /^prem-nav-|^prem-vis-nav/, page: 'inicio', highlight: '#site-header .nav' },
    { re: /^ult-news-|^extra-news-/, page: 'noticias', highlight: '.page-hero-noticias, #news-breaking, .news-feed-section' },
    { re: /^cms-n-/, page: 'noticias', highlight: '.news-feed-card' },
    { re: /^cms-p-/, page: 'equipos', highlight: '.equipos-player, [data-player-id]' },
    { re: /^cms-hchapter-/, page: 'historia', highlight: '.hist-chapter-item, #history-content' },
    { re: /^cms-hist-/, page: 'historia', highlight: '.history-origin, .hist-chapter-item, #history-content' },
    { re: /^cms-sp-|^prem-sp-/, page: 'sponsor', highlight: '.sp-hero, .sp-packages' },
    { re: /^cms-contact-|^extra-con-/, page: 'contacto', highlight: '#form, .contact-hero' },
    { re: /^cms-comm-|^extra-com-|^ult-com-/, page: 'comunidad', highlight: '.page-hero-comunidad, .comm-hub-bar, #comm-shop' },
    { re: /^cms-page-|^pages-|^extra-seo-/, page: null, highlight: '.page-hero, .lyok-intro-band' },
    { re: /^cms-team-brawlStars/, page: 'equipos', highlight: '#rosterBrawlStars, [data-cms-eq-brawl]' },
    { re: /^cms-team-clashRoyale/, page: 'equipos', highlight: '#rosterClashRoyale' },
    { re: /^cms-team-clubesPro/, page: 'equipos', highlight: '#rosterClubesPro' }
  ];

  function val(id) {
    var el = document.getElementById(id);
    return el ? String(el.value).trim() : '';
  }

  function getPageHref(pageKey) {
    if (typeof SITE !== 'undefined' && SITE.pages && SITE.pages[pageKey]) {
      return SITE.pages[pageKey];
    }
    var map = {
      inicio: 'index.html', equipos: 'equipos.html', comunidad: 'comunidad.html',
      noticias: 'noticias.html', historia: 'historia.html', sponsor: 'sponsor.html',
      contacto: 'contactanos.html', cuenta: 'cuenta.html'
    };
    return map[pageKey] || 'index.html';
  }

  function isNewsSection() {
    return /^(news|page-noticias|extra-noticias|ult-noticias)/.test(currentSection);
  }

  function isScheduleSection() {
    return currentSection === 'schedule';
  }

  function isPlayersSection() {
    return currentSection === 'players';
  }

  function isHistorySection() {
    return /^(historia-completa|history|history-chapters|page-historia)/.test(currentSection);
  }

  function panelModeForSection(sectionId) {
    if (SECTION_PANEL[sectionId] === 'off') return 'off';
    if (userPanelPref) return userPanelPref;
    return 'expanded';
  }

  function collectEditorContext(fieldId) {
    var ctx = { type: 'generic' };

    if (isNewsSection()) {
      if (fieldId === 'cms-news-breaking' || fieldId === 'extra-news-breaking-text') {
        ctx.type = 'news';
        ctx.mode = 'breaking';
        ctx.label = 'Última hora';
        ctx.highlight = '#news-breaking';
        return ctx;
      }
      if (fieldId && /^cms-n-/.test(fieldId)) {
        var idx = +val('cms-news-index') || 0;
        var articleId = val('cms-n-id');
        if (!articleId && window.CMS && window.CMS.getNewsArticles) {
          var arts = window.CMS.getNewsArticles();
          if (arts[idx]) articleId = arts[idx].id;
        }
        ctx.type = 'news';
        ctx.mode = 'article';
        ctx.articleIndex = idx;
        ctx.articleId = articleId;
        ctx.label = val('cms-n-title') || 'Noticia';
        if (articleId) {
          ctx.highlight = '.news-feed-card[data-news-id="' + cssEscape(articleId) + '"], #news-feed .news-feed-grid';
          ctx.openArticle = true;
        }
        return ctx;
      }
      ctx.type = 'news';
      ctx.mode = 'list';
      ctx.label = 'Noticias';
      ctx.highlight = '.page-hero-noticias, #news-feed';
      return ctx;
    }

    if (isScheduleSection()) {
      if (fieldId && /^cms-feat-/.test(fieldId)) {
        ctx.type = 'schedule';
        ctx.mode = 'featured';
        ctx.label = 'Partido destacado · ' + (val('cms-feat-opponent') || 'portada');
        ctx.highlight = '#featured-match, .featured-match-inner';
        ctx.hash = 'calendario';
        return ctx;
      }
      var matchM = fieldId && fieldId.match(/^cms-match-(\d+)-/);
      var mIdx = matchM ? +matchM[1] : getActiveScheduleIndex();
      ctx.type = 'schedule';
      ctx.mode = matchM || fieldId ? 'match' : 'calendar';
      ctx.matchIndex = mIdx;
      ctx.label = fieldId ? ('Partido ' + (mIdx + 1)) : 'Calendario';
      ctx.highlight = fieldId && matchM
        ? '#schedule-grid .match-card[data-match-index="' + mIdx + '"]'
        : '#featured-match, .hero-portada-panel, #schedule-grid';
      ctx.hash = 'calendario';
      return ctx;
    }

    if (isPlayersSection() && (fieldId && /^cms-p-/.test(fieldId))) {
      var team = val('cms-player-team') || 'brawlStars';
      var pIdx = +val('cms-player-index') || 0;
      var rosterKey = team === 'brawlStars' ? 'brawlStars' : (team === 'clashRoyale' ? 'clashRoyale' : 'clubesPro');
      ctx.type = 'player';
      ctx.team = team;
      ctx.playerIndex = pIdx;
      ctx.label = val('cms-p-name') || 'Jugador';
      ctx.highlight = '.equipos-player[data-player-id="' + rosterKey + '-' + pIdx + '"]';
      ctx.hash = 'player-' + rosterKey + '-' + pIdx;
      return ctx;
    }

    if (isHistorySection() && fieldId && /^cms-hchapter-/.test(fieldId)) {
      var chId = val('cms-hchapter-id');
      if (chId) {
        ctx.type = 'history';
        ctx.chapterId = chId;
        ctx.label = 'Capítulo · ' + (val('cms-hchapter-title') || chId);
        ctx.highlight = '#hist-' + cssEscape(chId) + ', [data-cms-item^="hist-chapter-"], .hist-chapter-item';
        ctx.hash = 'hist-' + chId;
      }
      return ctx;
    }

    return ctx;
  }

  function getActiveScheduleIndex() {
    var active = document.querySelector('.cms-sched-pick--active');
    if (active && active.dataset.schedIdx != null) return +active.dataset.schedIdx;
    var panel = document.querySelector('.cms-sched-form-panel.is-active');
    if (panel && panel.dataset.formIdx != null) return +panel.dataset.formIdx;
    return 0;
  }

  function cssEscape(s) {
    return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  function resolveTarget(sectionId) {
    var t = TARGETS[sectionId];
    if (t) return Object.assign({}, t);
    if (window.CMSStudioUnified && typeof window.CMSStudioUnified.getParent === 'function') {
      var parent = window.CMSStudioUnified.getParent(sectionId);
      if (parent && TARGETS[parent]) return Object.assign({}, TARGETS[parent]);
      if (parent && parent.indexOf('page-') === 0) {
        return { page: parent.replace('page-', ''), label: parent.replace('page-', ''), highlight: 'main' };
      }
    }
    return { page: 'inicio', label: 'Web', highlight: 'main' };
  }

  function resolveField(fieldId) {
    if (!fieldId) return null;
    var i;
    for (i = 0; i < FIELD_RULES.length; i++) {
      var rule = FIELD_RULES[i];
      if (rule.re.test(fieldId)) {
        return { page: rule.page, highlight: rule.highlight, hash: rule.hash, fieldId: fieldId };
      }
    }
    return null;
  }

  function mergeTarget(sectionId, fieldId) {
    var base = resolveTarget(sectionId);
    var field = resolveField(fieldId);
    var ctx = collectEditorContext(fieldId);
    editorContext = ctx;

    if (ctx.highlight) base.highlight = ctx.highlight;
    if (ctx.hash) base.hash = ctx.hash;
    if (ctx.label) base.label = ctx.label;
    if (ctx.type === 'news' && ctx.mode === 'breaking') {
      base.page = 'noticias';
      base.highlight = '#news-breaking';
      base.label = 'Última hora';
    }
    if (ctx.type === 'news' && ctx.mode === 'article') {
      base.page = 'noticias';
      base.label = ctx.label || 'Noticia';
    }
    if (ctx.type === 'schedule') {
      base.page = 'inicio';
      base.hash = 'calendario';
    }
    if (ctx.type === 'player') {
      base.page = 'equipos';
      base.label = ctx.label || 'Jugador';
    }
    if (ctx.type === 'history' && ctx.chapterId) {
      base.page = 'historia';
      base.hash = ctx.chapterId;
    }
    if (field) {
      if (field.page) base.page = field.page;
      if (field.highlight && !ctx.highlight) base.highlight = field.highlight;
      if (field.hash && !ctx.hash) base.hash = field.hash;
    }
    base.previewContext = ctx;
    return base;
  }

  function previewShellHtml() {
    return '<aside class="cms-studio-preview" id="cms-studio-preview">' +
      '<button type="button" class="cms-preview-fold-tab" id="cms-preview-fold-tab" title="Abrir vista previa">' +
        '<span class="cms-preview-fold-tab-text">Vista previa</span>' +
      '</button>' +
      '<div class="cms-studio-preview-body" id="cms-preview-body">' +
        '<div class="cms-studio-preview-head">' +
          '<div class="cms-studio-preview-title">' +
            '<span class="cms-studio-preview-dot" aria-hidden="true"></span>' +
            '<span>En vivo</span>' +
            '<strong id="cms-preview-page-label">Inicio</strong>' +
          '</div>' +
          '<div class="cms-studio-preview-actions">' +
            '<button type="button" class="cms-preview-btn" id="cms-preview-device" title="Ancho móvil/escritorio">▭</button>' +
            '<button type="button" class="cms-preview-btn" id="cms-preview-refresh" title="Recargar">↻</button>' +
            '<button type="button" class="cms-preview-btn cms-preview-btn--fold" id="cms-preview-fold" title="Plegar vista previa">▾</button>' +
            '<button type="button" class="cms-preview-btn" id="cms-preview-toggle" title="Ocultar del todo">✕</button>' +
          '</div>' +
        '</div>' +
        '<p class="cms-studio-preview-hint" id="cms-preview-hint">Edita a la izquierda. Aquí ves exactamente el bloque que cambias.</p>' +
        '<p class="cms-studio-preview-focus" id="cms-preview-focus" hidden></p>' +
        '<div class="cms-studio-preview-off-msg" id="cms-preview-off-msg" hidden>' +
          '<p>Esta sección no necesita vista previa visual.</p>' +
          '<button type="button" class="btn btn-glass btn-sm" id="cms-preview-show-anyway">Mostrar web igualmente</button>' +
        '</div>' +
        '<div class="cms-studio-preview-frame-wrap" id="cms-preview-frame-wrap">' +
          '<iframe id="cms-studio-preview-frame" class="cms-studio-preview-frame" title="Vista previa LyokFox" loading="lazy"></iframe>' +
        '</div>' +
      '</div>' +
    '</aside>';
  }

  function getIframe() {
    return document.getElementById('cms-studio-preview-frame');
  }

  function getStudioEl() {
    return document.getElementById('cms-studio');
  }

  function buildPreviewUrl(sectionId, fieldId) {
    var target = mergeTarget(sectionId, fieldId);
    var href = getPageHref(target.page);
    var hash = target.hash || '';
    return href + '?studio-embed=1' + (hash ? '#' + hash : '');
  }

  function applyPanelLayout(sectionId) {
    var studio = getStudioEl();
    if (!studio) return;
    var mode = panelModeForSection(sectionId);
    if (studio.dataset.previewForce === 'expanded') mode = 'expanded';

    studio.classList.toggle('cms-studio--preview-off-section', mode === 'off');
    studio.classList.toggle('cms-studio--preview-collapsed', mode === 'collapsed');
    studio.classList.toggle('cms-studio--preview-hidden', mode === 'hidden');

    var offMsg = document.getElementById('cms-preview-off-msg');
    var frameWrap = document.getElementById('cms-preview-frame-wrap');
    if (offMsg) offMsg.hidden = mode !== 'off' || studio.dataset.previewForce === 'expanded';
    if (frameWrap) frameWrap.hidden = mode === 'off' && studio.dataset.previewForce !== 'expanded';
  }

  function setPanelState(state) {
    var studio = getStudioEl();
    if (!studio) return;
    if (state === 'expanded' || state === 'collapsed' || state === 'hidden') {
      userPanelPref = state;
      studio.dataset.previewForce = '';
      studio.classList.remove('cms-studio--preview-hidden', 'cms-studio--preview-collapsed', 'cms-studio--preview-off-section');
      if (state === 'hidden') {
        studio.classList.add('cms-studio--preview-hidden');
      } else if (state === 'collapsed') {
        studio.classList.add('cms-studio--preview-collapsed');
      }
      var frameWrap = document.getElementById('cms-preview-frame-wrap');
      var offMsg = document.getElementById('cms-preview-off-msg');
      if (frameWrap) frameWrap.hidden = false;
      if (offMsg) offMsg.hidden = true;
    }
  }

  function applyIframeHash(hash) {
    var iframe = getIframe();
    if (!iframe || !iframe.contentWindow) return;
    try {
      var win = iframe.contentWindow;
      var base = win.location.pathname + win.location.search;
      if (hash) {
        var want = '#' + hash;
        if (win.location.hash !== want) win.location.hash = hash;
      } else if (win.location.hash) {
        win.history.replaceState(null, '', base);
      }
    } catch (e) { /* ignore */ }
  }

  function pageUrlForSection(sectionId, fieldId) {
    return getPageHref(mergeTarget(sectionId, fieldId).page) + '?studio-embed=1';
  }

  function updateLabel(sectionId, fieldId) {
    var el = document.getElementById('cms-preview-page-label');
    var hint = document.getElementById('cms-preview-hint');
    var focus = document.getElementById('cms-preview-focus');
    if (!el) return;
    var t = mergeTarget(sectionId, fieldId);
    el.textContent = t.label || 'Web';
    if (hint) {
      if (editorContext.type === 'news' && editorContext.mode === 'article') {
        hint.textContent = 'Vista de esta noticia concreta (tarjeta + artículo abierto).';
      } else if (editorContext.type === 'schedule') {
        hint.textContent = 'Vista del partido en la portada / calendario.';
      } else if (editorContext.type === 'player') {
        hint.textContent = 'Vista de la ficha de este jugador en Equipos.';
      } else if (editorContext.type === 'history') {
        hint.textContent = 'Vista de este capítulo en Historia.';
      } else if (!fieldId) {
        hint.textContent = 'Edita un campo · la zona en naranja es lo que cambias.';
      }
    }
    if (focus) {
      if (fieldId || editorContext.label) {
        var labelEl = fieldId ? document.getElementById(fieldId) : null;
        var labelText = editorContext.label;
        if (!labelText && labelEl && labelEl.closest('.cms-field')) {
          labelText = (labelEl.closest('.cms-field').querySelector('span') || {}).textContent;
        }
        focus.hidden = false;
        focus.textContent = 'Viendo: ' + (labelText || fieldId || t.label);
      } else {
        focus.hidden = true;
      }
    }
  }

  function pushToIframe(fieldId, opts) {
    opts = opts || {};
    var iframe = getIframe();
    if (!iframe || !iframe.contentWindow || !window.CMS) return;
    if (getStudioEl() && getStudioEl().classList.contains('cms-studio--preview-off-section') &&
        getStudioEl().dataset.previewForce !== 'expanded') return;

    var data = null;
    if (window.CMSStudio && typeof window.CMSStudio.collectPreview === 'function') {
      data = window.CMSStudio.collectPreview();
    } else if (window.CMS.getMerged) {
      data = window.CMS.getMerged();
    }
    if (!data) return;

    var target = mergeTarget(currentSection, fieldId || activeFieldId);
    iframe.contentWindow.postMessage({
      type: 'lyokfox-cms-preview',
      payload: data,
      highlight: target.highlight || 'main',
      fieldId: fieldId || activeFieldId || '',
      previewContext: target.previewContext || editorContext,
      pulse: opts.pulse === true
    }, '*');
  }

  function navigatePreview(sectionId, fieldId, opts) {
    opts = opts || {};
    currentSection = sectionId;
    if (fieldId) activeFieldId = fieldId;
    applyPanelLayout(sectionId);
    var iframe = getIframe();
    if (!iframe) return;

    var mode = panelModeForSection(sectionId);
    if (mode === 'off' && getStudioEl() && getStudioEl().dataset.previewForce !== 'expanded') {
      updateLabel(sectionId, fieldId);
      return;
    }

    updateLabel(sectionId, fieldId);
    var target = mergeTarget(sectionId, fieldId);
    var pageUrl = pageUrlForSection(sectionId, fieldId);
    var fullUrl = buildPreviewUrl(sectionId, fieldId);

    if (iframe.dataset.pageUrl !== pageUrl) {
      iframe.dataset.pageUrl = pageUrl;
      iframe.dataset.src = fullUrl;
      iframe.src = fullUrl;
    } else {
      applyIframeHash(target.hash);
      pushToIframe(fieldId, { pulse: opts.pulse === true });
    }
  }

  function onIframeLoad() {
    if (iframeLoadTimer) clearTimeout(iframeLoadTimer);
    iframeLoadTimer = setTimeout(function () {
      pushToIframe(activeFieldId, { pulse: false });
    }, 250);
  }

  function scheduleLivePush() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () { pushToIframe(activeFieldId, { pulse: false }); }, 320);
  }

  function onFieldFocus(e) {
    var el = e.target;
    if (!el || !el.id) return;
    if (el.closest('#cms-studio-search')) return;
    activeFieldId = el.id;
    document.querySelectorAll('.cms-field--preview-active').forEach(function (f) {
      f.classList.remove('cms-field--preview-active');
    });
    var wrap = el.closest('.cms-field, .cms-field-easy');
    if (wrap) wrap.classList.add('cms-field--preview-active');

    updateLabel(currentSection, el.id);
    if (focusTimer) clearTimeout(focusTimer);
    focusTimer = setTimeout(function () {
      var target = mergeTarget(currentSection, el.id);
      var iframe = getIframe();
      var pageUrl = pageUrlForSection(currentSection, el.id);
      if (iframe && iframe.dataset.pageUrl !== pageUrl) {
        iframe.dataset.pageUrl = pageUrl;
        iframe.dataset.src = buildPreviewUrl(currentSection, el.id);
        iframe.src = buildPreviewUrl(currentSection, el.id);
      } else {
        applyIframeHash(target.hash);
        pushToIframe(el.id, { pulse: true });
      }
    }, 150);
  }

  function bindLiveInputs() {
    var root = document.getElementById('cms-studio-content');
    if (!root) return;
    if (!root.dataset.previewBound) {
      root.dataset.previewBound = '1';
      root.addEventListener('input', scheduleLivePush);
      root.addEventListener('change', function (e) {
        scheduleLivePush();
        if (e.target && (e.target.id === 'cms-news-index' || e.target.id === 'cms-player-index' ||
            e.target.id === 'cms-player-team' || e.target.id === 'cms-hchapter-id')) {
          syncContext();
        }
      });
      root.addEventListener('focusin', onFieldFocus);
    }
  }

  function syncContext() {
    updateLabel(currentSection, activeFieldId);
    var target = mergeTarget(currentSection, activeFieldId);
    var iframe = getIframe();
    if (!iframe) return;
    var pageUrl = pageUrlForSection(currentSection, activeFieldId);
    if (iframe.dataset.pageUrl !== pageUrl) {
      iframe.dataset.pageUrl = pageUrl;
      iframe.src = buildPreviewUrl(currentSection, activeFieldId);
    } else {
      applyIframeHash(target.hash);
      pushToIframe(activeFieldId, { pulse: true });
    }
  }

  function toggleDevice() {
    var wrap = document.getElementById('cms-preview-frame-wrap');
    var btn = document.getElementById('cms-preview-device');
    if (!wrap) return;
    previewDevice = previewDevice === 'desktop' ? 'mobile' : 'desktop';
    wrap.classList.toggle('cms-studio-preview-frame-wrap--mobile', previewDevice === 'mobile');
    if (btn) btn.textContent = previewDevice === 'mobile' ? '▯' : '▭';
  }

  function bindControls() {
    var iframe = getIframe();
    if (iframe && !iframe.dataset.bound) {
      iframe.dataset.bound = '1';
      iframe.addEventListener('load', onIframeLoad);
    }
    var refresh = document.getElementById('cms-preview-refresh');
    if (refresh && !refresh.dataset.bound) {
      refresh.dataset.bound = '1';
      refresh.onclick = function () {
        var f = getIframe();
        if (f) f.src = buildPreviewUrl(currentSection, activeFieldId);
      };
    }
    var toggle = document.getElementById('cms-preview-toggle');
    if (toggle && !toggle.dataset.bound) {
      toggle.dataset.bound = '1';
      toggle.onclick = function () {
        setPanelState('hidden');
      };
    }
    var fold = document.getElementById('cms-preview-fold');
    if (fold && !fold.dataset.bound) {
      fold.dataset.bound = '1';
      fold.onclick = function () { setPanelState('collapsed'); };
    }
    var foldTab = document.getElementById('cms-preview-fold-tab');
    if (foldTab && !foldTab.dataset.bound) {
      foldTab.dataset.bound = '1';
      foldTab.onclick = function () { setPanelState('expanded'); };
    }
    var showAnyway = document.getElementById('cms-preview-show-anyway');
    if (showAnyway && !showAnyway.dataset.bound) {
      showAnyway.dataset.bound = '1';
      showAnyway.onclick = function () {
        var studio = getStudioEl();
        if (studio) studio.dataset.previewForce = 'expanded';
        applyPanelLayout(currentSection);
        navigatePreview(currentSection, activeFieldId);
      };
    }
    var device = document.getElementById('cms-preview-device');
    if (device && !device.dataset.bound) {
      device.dataset.bound = '1';
      device.onclick = toggleDevice;
    }
  }

  function findNewsIndexById(articleId) {
    if (!articleId || !window.CMS || !window.CMS.getNewsArticles) return -1;
    var arts = window.CMS.getNewsArticles();
    var i;
    for (i = 0; i < arts.length; i++) {
      if (arts[i].id === articleId) return i;
    }
    return -1;
  }

  function handlePickFromIframe(data) {
    if (!data) return;

    if (data.articleId && window.CMSStudio) {
      window.CMSStudio.goto('news');
      setTimeout(function () {
        var idx = findNewsIndexById(data.articleId);
        var sel = document.getElementById('cms-news-index');
        if (sel && idx >= 0) {
          sel.value = String(idx);
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        }
        activeFieldId = 'cms-n-title';
        syncContext();
        var input = document.getElementById('cms-n-title');
        if (input) input.focus();
      }, 450);
      if (window.CMS && window.CMS.toast) window.CMS.toast('Noticia seleccionada');
      return;
    }

    if (data.matchIndex != null && window.CMSStudio) {
      window.CMSStudio.goto('schedule');
      setTimeout(function () {
        var card = document.querySelector('.cms-sched-pick[data-sched-idx="' + data.matchIndex + '"]');
        if (card) card.click();
        else {
          activeFieldId = 'cms-match-' + data.matchIndex + '-opponent';
          syncContext();
        }
      }, 450);
      if (window.CMS && window.CMS.toast) window.CMS.toast('Partido seleccionado');
      return;
    }

    if (data.team != null && data.playerIndex != null && window.CMSStudio) {
      window.CMSStudio.goto('players');
      setTimeout(function () {
        var teamSel = document.getElementById('cms-player-team');
        var idxSel = document.getElementById('cms-player-index');
        if (teamSel) teamSel.value = data.team;
        if (teamSel) teamSel.dispatchEvent(new Event('change', { bubbles: true }));
        setTimeout(function () {
          if (idxSel) idxSel.value = String(data.playerIndex);
          if (idxSel) idxSel.dispatchEvent(new Event('change', { bubbles: true }));
          activeFieldId = 'cms-p-name';
          syncContext();
          var input = document.getElementById('cms-p-name');
          if (input) input.focus();
        }, 200);
      }, 450);
      if (window.CMS && window.CMS.toast) window.CMS.toast('Jugador seleccionado');
      return;
    }

    if (data.section && window.CMSStudio) {
      window.CMSStudio.goto(data.section);
    }
    if (data.field && document.getElementById(data.field)) {
      setTimeout(function () {
        document.getElementById(data.field).focus();
      }, 400);
    }
  }

  function openExternal() {
    var url = buildPreviewUrl(currentSection, activeFieldId).replace('?studio-embed=1', '');
    window.open(url, '_blank');
  }

  function fieldDataAttr(fieldId) {
    var f = resolveField(fieldId);
    if (!f) return '';
    return ' data-preview-highlight="' + String(f.highlight).split(',')[0].trim() + '"';
  }

  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'lyokfox-studio-pick') return;
    if (!document.getElementById('cms-studio')) return;
    handlePickFromIframe(e.data);
  });

  window.CMSStudioPreview = {
    shellHtml: previewShellHtml,
    onSection: function (sectionId) {
      currentSection = sectionId;
      activeFieldId = '';
      editorContext = {};
      document.querySelectorAll('.cms-field--preview-active').forEach(function (f) {
        f.classList.remove('cms-field--preview-active');
      });
      var focus = document.getElementById('cms-preview-focus');
      if (focus) focus.hidden = true;
      bindControls();
      bindLiveInputs();
      navigatePreview(sectionId, '', { pulse: false });
    },
    syncContext: syncContext,
    push: pushToIframe,
    bind: bindControls,
    openExternal: openExternal,
    fieldDataAttr: fieldDataAttr,
    resolveField: resolveField,
    mergeTarget: mergeTarget,
    setPanelState: setPanelState
  };
})();
