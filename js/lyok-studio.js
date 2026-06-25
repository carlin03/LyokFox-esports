/* LyokFox Studio PRO — edita TODO: bloques, jugadores, imágenes, ocultar, previsualizar */
(function () {
  'use strict';

  var SK = 'lyokfox_studio_v3';
  var PIN = 'lyokfox';
  var previewData = null;
  var panelOpen = false;
  var activeSection = 'dashboard';
  var livePreviewOn = true;
  var livePreviewTimer = null;
  var activeItemPreviewKey = null;
  var previewViewMode = 'web';
  var webFrameReady = false;
  var pendingFrameFocus = null;

  var SECTION_BLOCK = {
    hero: 'hero', media: 'hero', pagestyles: 'hero', ticker: 'ticker', match: 'matchPanel',
    matchStrip: 'matchStrip', brands: 'brands',
    sections: 'spotlight', spotlight: 'spotlight', schedule: 'calendario',
    disciplines: 'disciplines', sponsor: 'patrocinio', seo: 'seo', cta: 'cta',
    homeNews: 'homeNews', newsBreaking: 'newsBreaking',
    news: 'noticias', history: 'historia',
    teams: 'equipos', players: 'equipos', navmenu: 'site-header', footer: 'site-footer',
    contact: 'contact-info', pages: 'hero', theme: 'hero', typography: 'hero', effects: 'hero',
    meta: 'hero', ui: 'disciplines', cuenta: 'cuenta-gate', visibility: 'hero'
  };

  var previewLayout = 'horizontal';

  var NAV = [
    { id: 'dashboard', icon: 'home', label: 'Centro de mando', tags: 'inicio hub mapa' },
    { id: 'theme', icon: 'palette', label: 'Colores base', tags: 'fondo acento superficie' },
    { id: 'typography', icon: 'list', label: 'Tipografía & textos', tags: 'color texto titulo eyebrow' },
    { id: 'effects', icon: 'bolt', label: 'Efectos visuales', tags: 'particulas animacion spotlight' },
    { id: 'media', icon: 'image', label: 'Banner & logo club', tags: 'marca hero imagen' },
    { id: 'pagestyles', icon: 'image', label: 'Fondos & páginas', tags: 'banner hero fondo escala imagen particulas' },
    { id: 'hero', icon: 'spark', label: 'Portada — texto & stats', tags: 'inicio titulo lead botones' },
    { id: 'match', icon: 'ball', label: 'Partido destacado', tags: 'matchday panel franja' },
    { id: 'ticker', icon: 'megaphone', label: 'Ticker & ligas', tags: 'avisos marcas franja' },
    { id: 'sections', icon: 'list', label: 'Títulos de sección', tags: 'eyebrow subtitulos inicio cta' },
    { id: 'spotlight', icon: 'bolt', label: 'Accesos rápidos', tags: 'cards inicio destacados' },
    { id: 'schedule', icon: 'calendar', label: 'Calendario partidos', tags: 'horarios torneos logos' },
    { id: 'sponsor', icon: 'handshake', label: 'Partnerships', tags: 'patrocinio tiers planes' },
    { id: 'seo', icon: 'search', label: 'SEO & FAQ', tags: 'google preguntas pie inicio' },
    { id: 'navmenu', icon: 'menu', label: 'Menú cabecera', tags: 'header links navegacion' },
    { id: 'footer', icon: 'footer', label: 'Pie global', tags: 'footer email redes tagline' },
    { id: 'pages', icon: 'page', label: 'Héroes de páginas', tags: 'noticias historia equipos contacto cuenta texto' },
    { id: 'meta', icon: 'search', label: 'SEO & meta tags', tags: 'title description google' },
    { id: 'contact', icon: 'mail', label: 'Página contacto', tags: 'formulario partnership mensaje' },
    { id: 'cuenta', icon: 'user', label: 'Página cuenta', tags: 'login registro perfil' },
    { id: 'ui', icon: 'link2', label: 'Textos de interfaz', tags: 'botones enlaces cards' },
    { id: 'news', icon: 'news', label: 'Noticias', tags: 'articulos blog feed' },
    { id: 'history', icon: 'scroll', label: 'Historia', tags: 'timeline hitos cronologia' },
    { id: 'teams', icon: 'users', label: 'Equipos & tryouts', tags: 'disciplinas bloques cta' },
    { id: 'players', icon: 'gamepad', label: 'Plantillas jugadores', tags: 'roster avatar perfil' },
    { id: 'visibility', icon: 'eye', label: 'Mostrar / ocultar', tags: 'bloques on off' },
    { id: 'backup', icon: 'save', label: 'Backup & restaurar', tags: 'export json import' }
  ];

  var NAV_GROUPS = [
    { title: 'Centro', ids: ['dashboard'] },
    { title: 'Identidad visual', ids: ['theme', 'typography', 'effects', 'media', 'pagestyles'] },
    { title: 'Inicio', ids: ['hero', 'match', 'ticker', 'sections', 'spotlight', 'schedule', 'sponsor', 'seo'] },
    { title: 'Páginas & sitio', ids: ['pages', 'navmenu', 'footer', 'meta', 'contact', 'cuenta', 'ui'] },
    { title: 'Contenido club', ids: ['news', 'history', 'teams', 'players'] },
    { title: 'Sistema', ids: ['visibility', 'backup'] }
  ];

  var TYPE_FIELDS = [
    { key: 'eyebrow', label: 'Eyebrow', hint: 'Etiquetas pequeñas · .eyebrow' },
    { key: 'display', label: 'Título hero', hint: 'Títulos gigantes · .display' },
    { key: 'displayAccent', label: 'Acento en título (&lt;em&gt;)', hint: 'Parte destacada del título' },
    { key: 'lead', label: 'Lead / subtítulo', hint: 'Párrafo bajo el título · .lead' },
    { key: 'sectionTitle', label: 'Títulos de sección', hint: '.section-title' },
    { key: 'sectionSub', label: 'Subtítulos de sección', hint: '.section-sub' },
    { key: 'cardTitle', label: 'Títulos en cards', hint: '.card-title' },
    { key: 'cardText', label: 'Texto en cards', hint: '.card-text' },
    { key: 'link', label: 'Enlaces & card-link', hint: 'Enlaces naranja · .card-link' },
    { key: 'nav', label: 'Menú navegación', hint: 'Links del header' },
    { key: 'navActive', label: 'Menú activo', hint: 'Página actual en el menú' },
    { key: 'statValue', label: 'Stats hero (número)', hint: 'Cifras del hero' },
    { key: 'statLabel', label: 'Stats hero (etiqueta)', hint: 'Label bajo cada cifra' },
    { key: 'footer', label: 'Pie de página', hint: 'Copyright y texto footer' }
  ];

  var META_PAGES = [
    { key: 'inicio', label: 'Inicio', file: 'index.html' },
    { key: 'noticias', label: 'Noticias', file: 'noticias.html' },
    { key: 'historia', label: 'Historia', file: 'historia.html' },
    { key: 'equipos', label: 'Equipos', file: 'equipos.html' },
    { key: 'contacto', label: 'Contacto', file: 'contactanos.html' },
    { key: 'cuenta', label: 'Mi perfil', file: 'cuenta.html' }
  ];

  var PAGE_LABELS = {
    noticias: 'Noticias',
    historia: 'Historia',
    equipos: 'Equipos',
    cuenta: 'Mi perfil',
    contacto: 'Contáctanos'
  };

  var SECTION_LABELS = {
    spotlight: { label: 'Accesos rápidos', block: 'spotlight', hint: 'Cabecera de las 3 cards debajo del hero.' },
    disciplines: { label: 'Disciplinas', block: 'disciplines', hint: 'Bloque Clash Royale + FC26 en inicio.' },
    schedule: { label: 'Calendario', block: 'calendario', hint: 'Título de la sección #calendario.' },
    sponsor: { label: 'Partnerships', block: 'patrocinio', hint: 'Inicio y contacto (#patrocinio).' },
    seo: { label: 'Sobre LyokFox', block: 'seo', hint: 'Texto SEO + FAQ al final del inicio.' },
    cta: { label: 'CTA final', block: 'cta', hint: 'Banner naranja antes del footer. Botones editables abajo.' },
    homeNews: { label: 'Noticias inicio', block: 'homeNews', hint: 'Teaser de 3 noticias en la home (#home-news).' }
  };

  var STUDIO_MAP = [
    { title: 'Inicio', icon: 'home', file: 'index.html', items: [
      { sec: 'media', label: 'Banner & logo' },
      { sec: 'pagestyles', label: 'Fondos por página' },
      { sec: 'hero', label: 'Portada texto & stats' },
      { sec: 'match', label: 'Partido destacado' },
      { sec: 'ticker', label: 'Ticker & franja ligas' },
      { sec: 'spotlight', label: 'Accesos rápidos (cards)' },
      { sec: 'sections', label: 'Títulos de sección (+ noticias inicio)' },
      { sec: 'schedule', label: 'Calendario' },
      { sec: 'sponsor', label: 'Partnerships' },
      { sec: 'seo', label: 'SEO, FAQ & CTA final' }
    ]},
    { title: 'Noticias', icon: 'news', file: 'noticias.html', items: [
      { sec: 'pages', label: 'Hero página', tip: 'Clave «noticias»' },
      { sec: 'pagestyles', label: 'Fondo & escala', tip: 'Clave noticias' },
      { sec: 'news', label: 'Feed & cabecera' }
    ]},
    { title: 'Historia', icon: 'scroll', file: 'historia.html', items: [
      { sec: 'pages', label: 'Hero página', tip: 'Clave «historia»' },
      { sec: 'pagestyles', label: 'Fondo & escala', tip: 'Clave historia' },
      { sec: 'history', label: 'Bloques narrativa & hitos' }
    ]},
    { title: 'Equipos', icon: 'users', file: 'equipos.html', items: [
      { sec: 'pages', label: 'Hero página', tip: 'Clave «equipos»' },
      { sec: 'pagestyles', label: 'Fondo & escala', tip: 'Clave equipos' },
      { sec: 'teams', label: 'Disciplinas, cabecera & tryouts' },
      { sec: 'players', label: 'Plantillas jugadores' }
    ]},
    { title: 'Contacto', icon: 'mail', file: 'contactanos.html', items: [
      { sec: 'pages', label: 'Hero página', tip: 'Clave «contacto»' },
      { sec: 'pagestyles', label: 'Fondo & escala', tip: 'Clave contacto' },
      { sec: 'contact', label: 'Formulario & info' },
      { sec: 'sponsor', label: 'Partnerships (misma sección)' }
    ]},
    { title: 'Cuenta', icon: 'user', file: 'cuenta.html', items: [
      { sec: 'pages', label: 'Hero página', tip: 'Clave «cuenta»' },
      { sec: 'pagestyles', label: 'Fondo & escala', tip: 'Clave cuenta' },
      { sec: 'cuenta', label: 'Login, registro & perfil PRO' }
    ]},
    { title: 'Global', icon: 'gear', file: '—', items: [
      { sec: 'theme', label: 'Colores base' },
      { sec: 'typography', label: 'Tipografía & textos' },
      { sec: 'effects', label: 'Efectos visuales' },
      { sec: 'pagestyles', label: 'Fondos por página' },
      { sec: 'meta', label: 'SEO & meta tags' },
      { sec: 'ui', label: 'Textos interfaz' },
      { sec: 'navmenu', label: 'Menú cabecera' },
      { sec: 'footer', label: 'Pie & redes' },
      { sec: 'visibility', label: 'Mostrar / ocultar bloques' },
      { sec: 'backup', label: 'Backup JSON' }
    ]}
  ];

  function studioHint(html) {
    return '<div class="studio-hint">' + html + '</div>';
  }

  function visRow(key, vis, label, previewBlock) {
    var on = vis[key] !== false;
    return '<label class="studio-check studio-vis-row">' +
      '<span class="studio-vis-row-main"><input type="checkbox" data-vis="' + key + '"' + (on ? ' checked' : '') + '> <strong>Visible</strong> — ' + label + '</span>' +
      (previewBlock ? '<button type="button" class="studio-btn-preview studio-btn-preview--icon" data-preview-block="' + previewBlock + '" aria-label="Ver bloque">' + ico('eye', 'st-ico st-ico-sm') + '</button>' : '') +
    '</label>';
  }

  function visPanel(title, items, vis) {
    if (!items.length) return '';
    return '<details class="studio-card studio-vis-card" open><summary>' + title + '</summary><div class="studio-card-body studio-vis-grid">' +
      items.map(function (it) { return visRow(it[0], vis, it[1], it[2] || it[0]); }).join('') +
    '</div></details>';
  }

  var VIS_GROUPS = [
    { title: 'Global', items: [
      ['siteHeader', 'Cabecera / menú', 'site-header'],
      ['siteFooter', 'Pie de página', 'site-footer'],
      ['ticker', 'Ticker avisos', 'ticker'],
      ['pageHero', 'Hero de subpáginas', 'pageHero']
    ]},
    { title: 'Inicio — portada', items: [
      ['hero', 'Hero completo', 'hero'],
      ['heroStats', 'Stats del hero (cifras)', 'heroStats'],
      ['heroCtas', 'Botones del hero', 'heroCtas'],
      ['matchPanel', 'Panel partido (hero)', 'matchPanel'],
      ['matchStrip', 'Franja matchday', 'matchStrip'],
      ['brands', 'Franja ligas / marcas', 'brands']
    ]},
    { title: 'Inicio — solo títulos', items: [
      ['secHead-spotlight', 'Título accesos rápidos', 'secHead-spotlight'],
      ['secHead-disciplines', 'Título disciplinas', 'secHead-disciplines'],
      ['secHead-schedule', 'Título calendario', 'secHead-schedule'],
      ['secHead-sponsor', 'Título partnerships', 'secHead-sponsor'],
      ['secHead-seo', 'Título sobre LyokFox', 'secHead-seo'],
      ['secHead-cta', 'Título CTA final', 'secHead-cta'],
      ['secHead-homeNews', 'Título noticias inicio', 'secHead-homeNews']
    ]},
    { title: 'Inicio — secciones', items: [
      ['spotlight', 'Accesos rápidos (cards)', 'spotlight'],
      ['disciplines', 'Disciplinas', 'disciplines'],
      ['homeNews', 'Teaser noticias (3 cards)', 'homeNews'],
      ['calendario', 'Calendario', 'calendario'],
      ['seoText', 'Texto SEO', 'seoText'],
      ['seoFaq', 'FAQ', 'seoFaq'],
      ['seo', 'Bloque SEO completo', 'seo'],
      ['patrocinio', 'Partnerships', 'patrocinio'],
      ['cta', 'CTA final (banner)', 'cta']
    ]},
    { title: 'Páginas', items: [
      ['noticias', 'Feed noticias', 'noticias'],
      ['newsBreaking', 'Franja última hora', 'newsBreaking'],
      ['historia', 'Timeline historia', 'historia'],
      ['historyStory', 'Bloques narrativa', 'historyStory'],
      ['equipos', 'Listado equipos', 'equipos'],
      ['equiposTryouts', 'CTA tryouts equipos', 'equiposTryouts'],
      ['contactPage', 'Bloque contacto', 'contactPage'],
      ['contactInfo', 'Info contacto (columna)', 'contactInfo'],
      ['contactForm', 'Formulario contacto', 'contactForm'],
      ['cuentaGate', 'Login / registro', 'cuentaGate'],
      ['cuentaArea', 'Perfil guardado', 'cuentaArea']
    ]}
  ];

  var VIS_BLOCKS = [];
  VIS_GROUPS.forEach(function (g) {
    g.items.forEach(function (it) { VIS_BLOCKS.push(it); });
  });

  function studioMapHtml() {
    return STUDIO_MAP.map(function (group) {
      var fileLink = group.file !== '—'
        ? ' <span class="studio-map-file">' + group.file + '</span>'
        : '';
      return '<div class="studio-map-group">' +
        '<p class="studio-map-group-title">' + ico(group.icon, 'st-ico st-ico-sm') + ' ' + group.title + fileLink + '</p>' +
        '<div class="studio-map-items">' +
        group.items.map(function (it) {
          return '<button type="button" class="studio-map-item" data-goto="' + it.sec + '">' +
            '<strong>' + it.label + '</strong>' +
            (it.tip ? '<em>' + it.tip + '</em>' : '') +
          '</button>';
        }).join('') +
        '</div></div>';
    }).join('');
  }

  var NEWS_CATS = [
    { id: 'clubesPro', label: 'Clubes Pro FC26' },
    { id: 'clash', label: 'Clash Royale' },
    { id: 'historia', label: 'Historia / Club' },
    { id: 'club', label: 'Comunidad' }
  ];

  function studioCounts(data) {
    data = data || getData();
    var rosters = data.rosters || {};
    var players = (rosters.clashRoyale || []).length + (rosters.clubesPro || []).length;
    return {
      news: (data.news && data.news.articles || []).length,
      players: players,
      teams: (data.teams || []).length,
      schedule: (data.schedule || []).length,
      brands: (data.brands || []).length,
      faq: ((data.home && data.home.faq) || []).length,
      storyBlocks: ((data.history && data.history.storyBlocks) || []).length
    };
  }

  function filterNavByQuery(q) {
    q = (q || '').toLowerCase().trim();
    if (!q) return null;
    return NAV.filter(function (n) {
      return n.label.toLowerCase().indexOf(q) > -1 ||
        (n.tags && n.tags.indexOf(q) > -1) ||
        n.id.indexOf(q) > -1;
    }).map(function (n) { return n.id; });
  }

  function studioBuildVer() {
    return (window.SITE && SITE.build) ? SITE.build : 'dev';
  }

  function studioBrandHtml() {
    var logo = window.LYOK_ICONS
      ? '<div class="lyok-studio-brand-mark">' + LYOK_ICONS.logoMark('img/logo.jpg', 'lyok-studio-brand-logo') + '</div>'
      : '';
    return logo +
      '<div><p class="eyebrow studio-brand-eyebrow">Control total · v' + studioBuildVer() + '</p>' +
      '<h2>LYOKFOX <span>STUDIO</span></h2></div>';
  }

  function renderSidebarNav(activeId, filterIds) {
    return NAV_GROUPS.map(function (g) {
      var btns = g.ids.map(function (sid) {
        if (filterIds && filterIds.indexOf(sid) === -1) return '';
        var n = NAV.find(function (x) { return x.id === sid; });
        if (!n) return '';
        return '<button type="button" data-sec="' + n.id + '"' + (n.id === activeId ? ' class="is-active"' : '') + '>' +
          '<span class="lyok-studio-nav-icon">' + ico(n.icon, 'st-ico st-ico-nav') + '</span>' + n.label + '</button>';
      }).join('');
      if (filterIds && !btns.trim()) return '';
      return '<p class="lyok-studio-nav-group">' + g.title + '</p>' + btns;
    }).join('');
  }

  function navMockHtml(data) {
    var items = (data && data.nav) || [];
    return '<div class="studio-nav-mock" aria-hidden="true"><span class="studio-nav-mock-label">Vista previa menú</span><nav class="studio-nav-mock-inner">' +
      items.map(function (item, i) {
        var cls = item.cta ? ' studio-nav-mock-cta' : '';
        return '<span class="studio-nav-mock-link' + cls + '" data-nav-mock="' + i + '">' + esc(item.label) + '</span>';
      }).join('') +
      '</nav></div>';
  }

  function persistSectionDraft() {
    if (!panelOpen || activeSection === 'dashboard') return;
    var collected = collectData();
    previewData = previewData || getData();
    deepMerge(previewData, collected);
  }

  function showImgLightbox(src) {
    if (!src) return;
    var ov = document.createElement('div');
    ov.className = 'studio-img-lightbox';
    ov.innerHTML = '<button type="button" class="studio-img-lightbox-close" aria-label="Cerrar">×</button><img src="' + esc(src) + '" alt="Vista previa">';
    ov.onclick = function (e) { if (e.target === ov || e.target.classList.contains('studio-img-lightbox-close')) ov.remove(); };
    document.body.appendChild(ov);
  }

  var THEME_PRESETS = {
    lyokfox: { label: 'LyokFox original', accent: '#ff5a1f', accentBright: '#ff7a3d', gold: '#d4a24e', bg: '#030303', headerBg: '#030303', headerOpacity: 0.88, headerTopOpacity: 0 },
    dorado: { label: 'Dorado premium', accent: '#d4a24e', accentBright: '#f0c875', gold: '#f0c875', bg: '#050403', headerBg: '#0a0806', headerOpacity: 0.92, headerTopOpacity: 0.35 },
    noche: { label: 'Noche total', accent: '#ff7a3d', accentBright: '#ff9a5c', gold: '#b8893a', bg: '#000000', headerBg: '#000000', headerOpacity: 0.96, headerTopOpacity: 0.72 },
    kitsune: { label: 'Kitsune fuego', accent: '#ff4500', accentBright: '#ff6b35', gold: '#ffb347', bg: '#0a0503', headerBg: '#120805', headerOpacity: 0.9, headerTopOpacity: 0.15 },
    hielo: { label: 'Hielo esports', accent: '#4ecdc4', accentBright: '#7ee8e0', gold: '#a8e6cf', bg: '#020608', headerBg: '#041018', headerOpacity: 0.94, headerTopOpacity: 0.5 }
  };

  var FX_PROFILES = {
    lite: { dustCount: 4, emberCount: 4, meshBlur: 28, spotlightSize: 360, tiltStrength: 0.55, magneticStrength: 0.08, scanline: false, mesh: false, spotlight: false, heroCinema: false, cardTilt: false, magneticBtns: false },
    balanced: { dustCount: 6, emberCount: 6, meshBlur: 42, spotlightSize: 460, tiltStrength: 0.9, magneticStrength: 0.12, mesh: true, scanline: false, spotlight: false, heroCinema: false, cardTilt: false, magneticBtns: false },
    ultra: { dustCount: 10, emberCount: 8, meshBlur: 48, spotlightSize: 500, tiltStrength: 1, magneticStrength: 0.14, mesh: true, scanline: true, spotlight: true, heroCinema: true, cardTilt: true, magneticBtns: true }
  };

  function ico(name, cls) {
    return window.LYOK_ICONS ? LYOK_ICONS.svg(name, cls || 'st-ico') : '';
  }

  function pv(label) {
    return window.LYOK_ICONS ? LYOK_ICONS.previewBtn(label || 'Previsualizar') : (label || 'Previsualizar');
  }

  function actBtn(iconName, label) {
    return ico(iconName, 'st-ico st-ico-sm') + '<span>' + label + '</span>';
  }

  function itemPv(type, index, label) {
    var key = index != null && index !== '' ? type + ':' + index : type;
    label = label || 'Ver en mitad web';
    return '<div class="studio-item-preview-actions">' +
      '<button type="button" class="studio-btn-preview studio-btn-preview--mini" data-preview-item="' + key + '">' + pv(label) + '</button></div>';
  }

  function resolvePreviewBlock(block) {
    var map = {
      schedule: 'calendario', sponsor: 'patrocinio', ticker: 'ticker',
      matchPanel: 'matchPanel', matchStrip: 'matchStrip', cta: 'cta-final'
    };
    return map[block] || block;
  }

  function blockPreviewTarget(block) {
    block = resolvePreviewBlock(block);
    var hashMap = {
      hero: '', matchPanel: '#match-panel', matchStrip: '#match-strip', ticker: '#site-ticker',
      brands: '#brands-strip', spotlight: '#spotlight', disciplines: '#disciplines',
      calendario: '#calendario', seo: '#sobre-lyokfox', seoText: '#seo-content', seoFaq: '#seo-content',
      patrocinio: '#patrocinio', cta: '#cta-final', 'cta-final': '#cta-final', equiposTryouts: '#equipos-tryouts',
      'site-footer': '#site-footer', siteFooter: '#site-footer', siteHeader: '#site-header',
      contactInfo: '#contact-info', contactForm: '#contact-form-wrap', contactPage: '#contact-info',
      cuentaGate: '#cuenta-app', cuentaArea: '#cuenta-app', pageHero: '.page-hero',
      heroStats: '#hero-stats', heroCtas: '#hero-content',
      'secHead-spotlight': '#spotlight', 'secHead-disciplines': '#disciplines',
      'secHead-schedule': '#calendario', 'secHead-sponsor': '#patrocinio',
      'secHead-seo': '#sobre-lyokfox', 'secHead-cta': '#cta-final',
      navmenu: '#site-header', 'contact-info': '#contact-info',
      noticias: '#news-feed', historia: '#history-content', equipos: '#teams-list'
    };
    var pageMap = {
      noticias: 'noticias.html', historia: 'historia.html', equipos: 'equipos.html', cuenta: 'cuenta.html',
      contactPage: 'contactanos.html', contactInfo: 'contactanos.html', contactForm: 'contactanos.html',
      cuentaGate: 'cuenta.html', cuentaArea: 'cuenta.html'
    };
    if (pageMap[block]) {
      return { page: pageMap[block], hash: hashMap[block] || '', block: block };
    }
    return { page: 'index.html', hash: hashMap[block] || '', block: block };
  }

  function scrollFrameToBlock(block) {
    block = resolvePreviewBlock(block);
    var frame = document.getElementById('studio-web-frame');
    if (!frame || !frame.contentWindow) return;
    try {
      var doc = frame.contentWindow.document;
      var el = doc.querySelector('[data-cms-block="' + block + '"]') || doc.getElementById(block);
      if (!el && block === 'ticker') el = doc.getElementById('site-ticker');
      if (!el && block === 'site-footer') el = doc.getElementById('site-footer');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else doc.querySelector('main') && doc.querySelector('main').scrollIntoView({ block: 'start' });
    } catch (e) { /* iframe loading */ }
  }

  function focusPreviewInFrame(itemKey) {
    var frame = document.getElementById('studio-web-frame');
    if (!frame || !frame.contentWindow) return;
    try {
      if (frame.contentWindow.LYOK_PREVIEW && frame.contentWindow.LYOK_PREVIEW.focusItem) {
        frame.contentWindow.LYOK_PREVIEW.focusItem(itemKey);
      } else {
        scrollFrameToBlock(resolvePreviewBlock(itemKey.split(':')[0]));
      }
    } catch (e) { /* ignore */ }
  }

  function navigatePreviewFrame(path, focusKey) {
    pendingFrameFocus = focusKey || null;
    var frame = document.getElementById('studio-web-frame');
    var label = document.getElementById('studio-web-url-label');
    if (label) label.textContent = path;
    if (!frame) return;
    var parts = path.split('#');
    var base = parts[0];
    var hash = parts[1] ? '#' + parts[1] : '';
    if (frame.dataset.base !== base) {
      frame.dataset.base = base;
      frame.dataset.hash = hash;
      webFrameReady = false;
      frame.src = frameUrl(path);
    } else if (hash && frame.dataset.hash !== hash) {
      frame.dataset.hash = hash;
      try { frame.contentWindow.location.hash = hash; } catch (e) { /* ignore */ }
      pushDraftToFrame();
      setTimeout(function () {
        if (pendingFrameFocus) focusPreviewInFrame(pendingFrameFocus);
        else scrollFrameToBlock(hash.replace('#', ''));
      }, 120);
    } else {
      pushDraftToFrame();
      setTimeout(function () {
        if (pendingFrameFocus) focusPreviewInFrame(pendingFrameFocus);
        else scrollFrameToBlock(parts[1] || '');
      }, 120);
    }
  }

  function previewBlockInFrame(block) {
    applyLivePreview();
    var t = blockPreviewTarget(block);
    navigatePreviewFrame(t.page + t.hash, null);
    setTimeout(function () { scrollFrameToBlock(t.block); }, 220);
  }

  function rosterHash(key) {
    return { brawlStars: 'brawl', clashRoyale: 'clash', clubesPro: 'eafc' }[key] || key;
  }

  function itemWebUrl(itemKey) {
    var p = itemKey.split(':');
    var t = p[0];
    var idx = p[1];
    var pageMap = {
      noticias: 'noticias.html', historia: 'historia.html', equipos: 'equipos.html',
      cuenta: 'cuenta.html', contacto: 'contactanos.html', inicio: 'index.html'
    };
    if (t === 'page' && idx) return pageMap[idx] || 'index.html';
    if (t === 'nav' && idx != null) {
      var nav = getData().nav || [];
      return (nav[+idx] && nav[+idx].href) || 'index.html';
    }
    if (t === 'team' && idx) return 'equipos.html#' + idx;
    if (t === 'player' && idx) {
      var pp = idx.split('-');
      var ri = pp.pop();
      var rk = pp.join('-');
      return 'equipos.html#player-' + idx;
    }
    var staticUrls = {
      schedule: 'index.html#calendario', spot: 'index.html#spotlight', tier: 'index.html#patrocinio',
      news: 'noticias.html', story: 'historia.html', hist: 'historia.html', mile: 'historia.html',
      faq: 'index.html#sobre-lyokfox', stat: 'index.html', match: 'index.html#match-panel',
      teamCard: 'index.html#disciplines', footer: 'index.html#site-footer', contact: 'contactanos.html#contact-info',
      tryouts: 'equipos.html#equipos-tryouts', ticker: 'index.html#site-ticker', brands: 'index.html#brands-strip',
      cta: 'index.html#cta-final', sec: 'index.html', brand: 'index.html#brands-strip'
    };
    if (t === 'sec' && idx) {
      var secHash = { spotlight: '#spotlight', disciplines: '#disciplines', schedule: '#calendario', sponsor: '#patrocinio', seo: '#sobre-lyokfox', cta: '#cta-final' };
      return 'index.html' + (secHash[idx] || '');
    }
    if (t === 'page' && idx === 'contacto') return 'contactanos.html';
    if (t === 'page' && idx === 'equipos') return 'equipos.html';
    if (t === 'page' && idx === 'historia') return 'historia.html';
    if (t === 'page' && idx === 'noticias') return 'noticias.html';
    if (t === 'page' && idx === 'cuenta') return 'cuenta.html';
    return staticUrls[t] || 'index.html';
  }

  function sectionPreviewUrl(sectionId) {
    var pageMap = {
      news: 'noticias.html',
      history: 'historia.html',
      teams: 'equipos.html',
      players: 'equipos.html',
      footer: 'index.html',
      contact: 'contactanos.html',
      pages: 'index.html',
      theme: 'index.html',
      media: 'index.html',
      visibility: 'index.html',
      dashboard: 'index.html',
      backup: 'index.html'
    };
    var hashMap = {
      hero: '', match: '#match-panel', ticker: '#site-ticker', matchStrip: '#match-strip',
      brands: '#brands-strip', spotlight: '#spotlight', disciplines: '#disciplines',
      calendario: '#calendario', schedule: '#calendario', seo: '#sobre-lyokfox',
      patrocinio: '#patrocinio', sponsor: '#patrocinio',
      cta: '#cta-final', equipos: '#teams-list', equiposTryouts: '#equipos-tryouts',
      noticias: '#news-feed', historia: '#history-content', 'site-footer': '#site-footer',
      'contact-info': '#contact-info', navmenu: '#site-header', 'site-header': '#site-header'
    };
    var page = pageMap[sectionId] || 'index.html';
    if (sectionId === 'pages') {
      var body = document.querySelector('.lyok-studio-body');
      var open = body && body.querySelector('details[open] [data-page-hero]');
      var pk = open && open.getAttribute('data-page-hero');
      if (pk === 'contacto') page = 'contactanos.html';
      else if (pk === 'equipos') page = 'equipos.html';
      else if (pk === 'historia') page = 'historia.html';
      else if (pk === 'noticias') page = 'noticias.html';
      else if (pk === 'cuenta') page = 'cuenta.html';
    }
    if (sectionId === 'footer') page = 'index.html';
    if (sectionId === 'sections') {
      var secBody = document.querySelector('.lyok-studio-body');
      var openSec = secBody && secBody.querySelector('details[open] [data-sec]');
      var sk = openSec && openSec.getAttribute('data-sec');
      if (sk === 'cta') hash = '#cta-final';
      else if (sk && hashMap[sk]) hash = hashMap[sk];
      else hash = '#spotlight';
      return page + hash;
    }
    var block = SECTION_BLOCK[sectionId];
    var hash = hashMap[block] || hashMap[sectionId] || '';
    return page + hash;
  }

  function frameUrl(path) {
    var parts = path.split('#');
    var base = parts[0];
    var hash = parts[1] ? '#' + parts[1] : '';
    var sep = base.indexOf('?') > -1 ? '&' : '?';
    return base + sep + 'studioFrame=1' + hash;
  }

  function pushDraftToFrame(draftData) {
    var frame = document.getElementById('studio-web-frame');
    if (!frame) return;
    var data = draftData || collectData();
    try {
      var w = frame.contentWindow;
      if (!w || !w.LYOK_DATA) return;
      if (w.applyCmsPreviewPayload) w.applyCmsPreviewPayload(data);
      else if (w.LYOK_STUDIO) {
        w.LYOK_STUDIO.applyOverrides({ data: data, visibility: data.visibility });
        if (w.lyokRerender) w.lyokRerender();
      } else if (w.lyokRerender) w.lyokRerender();
      if (pendingFrameFocus) {
        var fk = pendingFrameFocus;
        pendingFrameFocus = null;
        setTimeout(function () { focusPreviewInFrame(fk); }, 180);
      } else {
        scrollIframeToSection();
      }
    } catch (e) { /* iframe loading */ }
  }

  function scrollIframeToSection() {
    var block = SECTION_BLOCK[activeSection];
    if (block) scrollFrameToBlock(block);
  }

  function syncWebFrame() {
    if (previewViewMode !== 'web' || !livePreviewOn) return;
    var frame = document.getElementById('studio-web-frame');
    if (!frame) return;
    var target = sectionPreviewUrl(activeSection);
    var label = document.getElementById('studio-web-url-label');
    if (label) label.textContent = target;
    var parts = target.split('#');
    var targetBase = parts[0];
    var targetHash = parts[1] ? '#' + parts[1] : '';
    if (frame.dataset.base !== targetBase) {
      frame.dataset.base = targetBase;
      frame.dataset.hash = targetHash;
      webFrameReady = false;
      frame.src = frameUrl(target);
    } else {
      if (targetHash && frame.dataset.hash !== targetHash) {
        frame.dataset.hash = targetHash;
        try {
          frame.contentWindow.location.hash = targetHash;
        } catch (e) { /* cross-origin guard */ }
        if (webFrameReady) setTimeout(scrollIframeToSection, 120);
      }
      if (webFrameReady) pushDraftToFrame();
    }
  }

  function setPreviewTab(tab) {
    if (tab === 'horizontal' || tab === 'vertical') {
      previewViewMode = 'web';
      previewLayout = tab;
    } else if (tab === 'mini' || tab === 'editor') {
      previewViewMode = tab;
    }
    document.body.classList.toggle('lyok-studio-preview-web', previewViewMode === 'web');
    document.body.classList.toggle('lyok-studio-preview-mini', previewViewMode === 'mini');
    document.body.classList.toggle('lyok-studio-preview-editor', previewViewMode === 'editor');
    document.body.classList.toggle('lyok-studio-layout-h', previewViewMode === 'web' && previewLayout === 'horizontal');
    document.body.classList.toggle('lyok-studio-layout-v', previewViewMode === 'web' && previewLayout === 'vertical');
    document.querySelectorAll('[data-preview-tab]').forEach(function (btn) {
      var t = btn.getAttribute('data-preview-tab');
      var active = (t === 'horizontal' || t === 'vertical')
        ? (previewViewMode === 'web' && previewLayout === t)
        : (previewViewMode === t);
      btn.classList.toggle('is-active', active);
    });
    if (previewViewMode === 'web') syncWebFrame();
    else if (previewViewMode === 'mini') applyLivePreview();
  }

  function setPreviewViewMode(mode) {
    setPreviewTab(mode === 'web' ? previewLayout : mode);
  }

  function buildItemPreviewCard(itemKey, data) {
    var p = itemKey.split(':');
    var t = p[0];
    var idx = p[1];
    var i = idx != null && idx !== '' ? (isNaN(+idx) ? idx : +idx) : null;
    var wrap = function (title, inner) {
      return '<div class="studio-live-preview"><p class="studio-live-preview-label">' + esc(title) + '</p>' + inner + '</div>';
    };

    if (t === 'nav' && data.nav && data.nav[i]) {
      var nv = data.nav[i];
      return wrap('Enlace menú · ' + nv.label, navMockHtml({ nav: [nv] }) +
        '<p class="studio-live-more"><strong>Texto:</strong> ' + esc(nv.label) + '<br><strong>Enlace:</strong> ' + esc(nv.href) +
        (nv.cta ? '<br><em>Estilo botón CTA naranja</em>' : '') + '</p>');
    }
    if (t === 'schedule' && data.schedule && data.schedule[i]) {
      var s = data.schedule[i];
      var live = s.live ? ' <span class="studio-live-badge">EN VIVO</span>' : '';
      var homeLogo = s.homeLogo || (LYOK_DATA.site && LYOK_DATA.site.logo) || 'img/logo.jpg';
      var gameBadge = s.gameIcon ? '<img src="' + esc(s.gameIcon) + '" alt="" class="schedule-game-badge">' : '';
      var leagueInline = s.leagueLogo ? '<img src="' + esc(s.leagueLogo) + '" alt="" class="schedule-league-badge">' : '';
      var duel = '';
      if (homeLogo || s.awayLogo) {
        duel = '<div class="schedule-card-duel">' +
          (homeLogo ? '<img src="' + esc(homeLogo) + '" alt="" class="schedule-logo-team">' : '') +
          '<span class="schedule-logo-vs">vs</span>' +
          (s.awayLogo ? '<img src="' + esc(s.awayLogo) + '" alt="" class="schedule-logo-team">' : '<span class="schedule-logo-team schedule-logo-team--empty"></span>') +
        '</div>';
      }
      return wrap('Calendario · partido ' + (i + 1), '<article class="card card--schedule studio-live-card">' +
        '<div class="schedule-card-inner">' +
          '<div class="schedule-card-main">' +
            '<div class="schedule-card-meta"><p class="card-num">' + esc(s.game) + live + '</p>' + gameBadge + '</div>' +
            '<h3 class="card-title">' + esc(s.vs) + '</h3>' +
            '<p class="card-text">' + leagueInline + esc(s.league) + '<br><strong>' + esc(s.when) + '</strong></p>' +
          '</div>' + duel +
        '</div></article>');
    }
    if (t === 'news' && data.news && data.news.articles && data.news.articles[i]) {
      var a = data.news.articles[i];
      var nimg = a.image || 'img/banner-oficial.png';
      if (/assets\/games\//.test(nimg) || /logo\.jpg$/i.test(nimg)) nimg = 'img/banner-oficial.png';
      return wrap('Noticia', '<article class="news-feed-card studio-live-card">' +
        '<div class="news-feed-card-cover"><img src="' + esc(nimg) + '" alt=""></div>' +
        '<div class="news-feed-card-body"><span class="news-feed-card-meta">' + esc(a.tag) + '</span>' +
        '<h3 class="news-feed-card-title">' + esc(a.title) + '</h3>' +
        '<p class="news-feed-card-excerpt">' + esc(a.excerpt) + '</p>' +
        (a.body && a.body.length ? '<p class="studio-live-more">' + esc(a.body[0]) + '</p>' : '') +
        '</div></article>');
    }
    if (t === 'match' && data.nextMatch) {
      var m = data.nextMatch;
      var mlogos = (m.homeLogo || m.awayLogo || m.leagueLogo)
        ? '<div class="studio-live-match-logos">' +
            (m.homeLogo ? '<img src="' + esc(m.homeLogo) + '" alt="">' : '') +
            (m.awayLogo ? '<img src="' + esc(m.awayLogo) + '" alt="">' : '') +
            (m.leagueLogo ? '<img src="' + esc(m.leagueLogo) + '" alt="">' : '') +
          '</div>' : '';
      return wrap('Partido destacado', '<aside class="match-panel studio-live-card">' +
        mlogos +
        '<p class="match-panel-label">' + esc(m.label) + '</p>' +
        '<p class="match-panel-vs">' + esc(m.home) + ' vs ' + esc(m.away) + '</p>' +
        '<p class="match-panel-league">' + esc(m.league) + '</p>' +
        '<p class="match-panel-date">' + esc(m.date) + ' · ' + esc(m.time) + '</p>' +
        '<p class="card-text">' + esc(m.status) + '</p></aside>');
    }
    if (t === 'spot' && data.spotlight && data.spotlight[i]) {
      var sp = data.spotlight[i];
      return wrap('Acceso rápido', '<a class="card studio-live-card' + (sp.accent ? ' card--accent' : '') + '">' +
        '<p class="card-num">' + esc(sp.num) + '</p><h3 class="card-title">' + esc(sp.title) + '</h3>' +
        '<p class="card-text">' + esc(sp.text) + '</p></a>');
    }
    if (t === 'tier' && data.sponsorTiers && data.sponsorTiers[i]) {
      var tier = data.sponsorTiers[i];
      return wrap('Partnership', '<article class="tier studio-live-card' + (tier.featured ? ' featured' : '') + '">' +
        '<h3 class="tier-name">' + esc(tier.name) + '</h3><p class="tier-price">' + esc(tier.price) + '</p>' +
        '<ul>' + (tier.perks || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></article>');
    }
    if (t === 'story' && data.history && data.history.storyBlocks && data.history.storyBlocks[i]) {
      var sb = data.history.storyBlocks[i];
      var excerpt = (sb.text || '').replace(/<[^>]+>/g, '').slice(0, 120);
      return wrap('Bloque narrativa', '<article class="history-story-block studio-live-card">' +
        '<p class="eyebrow">' + esc(sb.eyebrow || '') + '</p>' +
        '<h3 class="section-title">' + (sb.title || '') + '</h3>' +
        '<p class="card-text">' + esc(excerpt) + '</p></article>');
    }
    if (t === 'hist' && data.history && data.history.chapters && data.history.chapters[i]) {
      var c = data.history.chapters[i];
      var num = String(i + 1).padStart(2, '0');
      var teaser = (c.text || '').replace(/<[^>]+>/g, '').slice(0, 155);
      if (teaser.length >= 155) teaser = teaser.replace(/\s+\S*$/, '') + '…';
      return wrap('Capítulo', '<button type="button" class="hist-chapter-item studio-live-card">' +
        '<span class="hist-chapter-num">' + num + '</span>' +
        '<div class="hist-chapter-main"><span class="hist-chapter-era">' + esc(c.era) + '</span>' +
        '<h3 class="hist-chapter-title">' + (c.title || '') + '</h3>' +
        '<p class="hist-chapter-teaser">' + esc(teaser) + '</p></div>' +
        '<span class="card-link">Leer</span></button>');
    }
    if (t === 'mile' && data.history && data.history.milestones && data.history.milestones[i]) {
      var ml = data.history.milestones[i];
      return wrap('Hito cronología', '<article class="milestone-card studio-live-card">' +
        '<div class="milestone-top"><span class="milestone-year">' + esc(ml.year) + '</span>' +
        '<span class="milestone-tag">' + esc(ml.tag) + '</span></div>' +
        '<h3 class="milestone-title">' + esc(ml.title) + '</h3><p class="milestone-text">' + esc(ml.text) + '</p></article>');
    }
    if (t === 'team' && data.teams) {
      var team = data.teams.find(function (x) { return x.id === idx; });
      if (team) {
        return wrap('Equipo', '<article class="team-block studio-live-card">' +
          '<img src="' + esc(team.icon) + '" alt="" width="48" height="48">' +
          '<h2 class="team-name">' + esc(team.name) + '</h2><p class="card-text">' + esc(team.about) + '</p></article>');
      }
    }
    if (t === 'player' && idx) {
      var pp = String(idx).split('-');
      var ri = +pp.pop();
      var rk = pp.join('-');
      var pl = data.rosters && data.rosters[rk] && data.rosters[rk][ri];
      if (pl) {
        var bio = pl.bio || pl.note || '';
        return wrap('Jugador · perfil', '<article class="player-card studio-live-card">' +
          '<div class="player-card-avatar"><img src="' + esc(pl.avatar || data.site.logo || 'img/logo.jpg') + '" alt=""></div>' +
          '<span class="player-card-name">' + esc(pl.name) + '</span>' +
          '<span class="player-card-role">' + esc(pl.role) + '</span>' +
          '<p class="player-card-note">' + esc(pl.note) + '</p>' +
          (bio ? '<p class="studio-live-more">' + esc(bio) + '</p>' : '') +
          '</article>');
      }
    }
    if (t === 'faq' && data.home && data.home.faq && data.home.faq[i]) {
      var f = data.home.faq[i];
      return wrap('FAQ', '<details class="faq-item studio-live-card" open><summary>' + esc(f.q) + '</summary><p>' + esc(f.a) + '</p></details>');
    }
    if (t === 'stat' && data.stats && data.stats[i]) {
      var st = data.stats[i];
      return wrap('Stat hero', '<ul class="hero-stats studio-live-card"><li><strong>' + esc(st.value) + '</strong><span>' + esc(st.label) + '</span></li></ul>');
    }
    if (t === 'page' && data.pages && data.pages[idx]) {
      var pg = data.pages[idx];
      return wrap('Hero ' + idx, '<header class="page-hero studio-live-card studio-live-hero">' +
        '<p class="eyebrow">' + esc(pg.eyebrow) + '</p><h1 class="display">' + pg.title + '</h1>' +
        '<p class="lead">' + esc(pg.lead) + '</p></header>');
    }
    if (t === 'teamCard' && data.teams && data.teams[i]) {
      var tc = data.teams[i];
      return wrap('Disciplina inicio', '<a class="card studio-live-card"><img src="' + esc(tc.icon) + '" alt="" width="48">' +
        '<h3 class="card-title">' + esc(tc.name) + '</h3><p class="card-text">' + esc(tc.tag) + '</p></a>');
    }
    if (t === 'footer' && data.footer) {
      var ct = (data.site && data.site.contact) || {};
      return wrap('Pie de página', '<footer class="studio-live-card studio-live-footer">' +
        '<p class="footer-tagline">' + esc(data.footer.tagline) + '</p>' +
        '<p class="studio-live-more"><strong>Email:</strong> ' + esc(ct.email || '') + '</p></footer>');
    }
    if (t === 'contact' && data.contactPage) {
      var cp = data.contactPage;
      return wrap('Página contacto', '<div class="studio-live-card">' +
        '<h3 class="section-title">' + esc(cp.infoTitle || 'Información') + '</h3>' +
        '<p>' + esc(cp.intro || '') + '</p></div>');
    }
    if (t === 'tryouts' && data.equiposPage) {
      var ep = data.equiposPage;
      var btn = ep.tryoutsBtn || {};
      return wrap('CTA Tryouts', '<div class="cta-banner studio-live-card">' +
        '<h3 class="section-title">' + ep.tryoutsTitle + '</h3>' +
        '<p class="section-sub">' + esc(ep.tryoutsSub || '') + '</p>' +
        '<span class="btn btn-primary btn-sm">' + esc(btn.text || '') + '</span></div>');
    }
    if (t === 'ticker' && data.ticker) {
      return wrap('Ticker', '<div class="ticker studio-live-card studio-live-ticker">' +
        data.ticker.slice(0, 4).map(function (line) { return '<span>' + esc(line) + '</span>'; }).join('') +
        '</div>');
    }
    if (t === 'brands' && data.brands) {
      return wrap('Ligas / marcas', '<div class="studio-live-card studio-live-brands">' +
        data.brands.map(function (b, bi) {
          var name = typeof b === 'string' ? b : (b.name || '');
          var logo = typeof b === 'object' && b ? (b.logo || '') : '';
          return logo
            ? '<span><img src="' + esc(logo) + '" alt=""><em>' + esc(name) + '</em></span>'
            : '<span>' + esc(name) + '</span>';
        }).join('') +
        '</div>');
    }
    if (t === 'brand' && data.brands && data.brands[i]) {
      var bb = data.brands[i];
      var bname = typeof bb === 'string' ? bb : (bb.name || '');
      var blogo = typeof bb === 'object' && bb ? (bb.logo || '') : '';
      return wrap('Liga / torneo', '<div class="studio-live-card studio-live-brands">' +
        (blogo ? '<span><img src="' + esc(blogo) + '" alt=""><em>' + esc(bname) + '</em></span>' : '<span>' + esc(bname) + '</span>') +
        '</div>');
    }
    if (t === 'cta' && data.home) {
      var sec = data.home.sections && data.home.sections.cta;
      var btns = data.home.ctaButtons || {};
      return wrap('Banner CTA final', '<div class="cta-banner studio-live-card">' +
        (sec ? '<p class="eyebrow">' + esc(sec.eyebrow) + '</p><h3 class="section-title">' + sec.title + '</h3><p class="section-sub">' + esc(sec.sub || '') + '</p>' : '') +
        '<span class="btn btn-primary btn-sm">' + esc((btns.primary && btns.primary.text) || '') + '</span> ' +
        '<span class="btn btn-ghost btn-sm">' + esc((btns.secondary && btns.secondary.text) || '') + '</span></div>');
    }
    if (t === 'sec' && idx && data.home && data.home.sections && data.home.sections[idx]) {
      var sx = data.home.sections[idx];
      return wrap('Sección ' + idx, '<header class="sec-head studio-live-card">' +
        '<p class="eyebrow">' + esc(sx.eyebrow) + '</p><h3 class="section-title">' + sx.title + '</h3>' +
        '<p class="section-sub">' + esc(sx.sub || '') + '</p></header>');
    }
    return '<p class="studio-lead">Vista previa no disponible para este elemento.</p>';
  }

  function buildSectionPreview(sectionId, data) {
    data = data || getData();
    if (sectionId === 'dashboard') {
      return '<div class="studio-live-pane-empty"><span class="studio-live-dot studio-live-dot--pulse"></span>' +
        '<p><strong>Vista previa en vivo</strong></p>' +
        '<p>A la derecha ves la web real al 100%. Cada cambio se refleja al instante en el iframe.</p></div>';
    }
    if (sectionId === 'backup') {
      return '<div class="studio-live-pane-empty">Copia de seguridad — sin vista previa de contenido.</div>';
    }
    var parts = [];
    if (sectionId === 'theme') {
      var th = data.theme || {};
      parts.push('<div class="studio-live-preview"><p class="studio-live-preview-label">Colores activos</p>' +
        '<div class="studio-live-swatches">' +
        ['accent', 'accentBright', 'gold', 'bg', 'surface'].map(function (k) {
          var labels = { accent: 'Acento', accentBright: 'Claro', gold: 'Dorado', bg: 'Fondo', surface: 'Cards' };
          return '<span class="studio-live-swatch" style="background:' + esc(th[k] || th.accent || '#ff5a1f') + '">' + (labels[k] || k) + '</span>';
        }).join('') +
        '</div><p class="studio-live-more">Header: ' + (th.headerHeight != null ? th.headerHeight : 84) + 'px · Menú ×' +
        (th.headerNavScale != null ? th.headerNavScale : 1.08) + ' · Marca ×' +
        (th.headerBrandScale != null ? th.headerBrandScale : 1.06) +
        ' · Opacidad: ' + (th.headerOpacity != null ? th.headerOpacity : 0.88) +
        ' · Grain: ' + (th.grainOpacity != null ? th.grainOpacity : 0.03) + '</p></div>');
    }
    if (sectionId === 'typography') {
      var ty = (data.theme && data.theme.type) || {};
      parts.push('<div class="studio-live-preview"><p class="studio-live-preview-label">Tipografía por rol</p>' +
        '<div class="studio-live-swatches">' +
        TYPE_FIELDS.slice(0, 8).map(function (f) {
          var c = ty[f.key] || '#888';
          return '<span class="studio-live-swatch" style="background:' + esc(c) + '">' + f.label + '</span>';
        }).join('') +
        '</div><p class="studio-live-more">Escala display: ' + ((data.theme && data.theme.scale && data.theme.scale.display) || 1) + '</p></div>');
    }
    if (sectionId === 'effects') {
      var fx = (data.theme && data.theme.effects) || {};
      var fxList = [
        ['mesh', 'Mesh'], ['dust', 'Partículas'], ['spotlight', 'Spotlight'], ['scanline', 'Scanlines'],
        ['heroCinema', 'Hero cinema'], ['embers', 'Embers'], ['cardTilt', 'Tilt cards'], ['magneticBtns', 'Botones magnéticos']
      ];
      parts.push('<div class="studio-live-preview studio-live-card"><p class="studio-live-preview-label">Efectos activos</p>' +
        fxList.map(function (pair) {
          var on = fx[pair[0]] !== false;
          return '<span class="tag" style="opacity:' + (on ? '1' : '0.35') + '">' + pair[1] + (on ? ' ✓' : ' ✗') + '</span> ';
        }).join('') +
        '<p class="studio-live-more">Reveal scroll: ' + (data.theme && data.theme.animations !== false ? 'ON' : 'OFF') + '</p></div>');
    }
    if (sectionId === 'meta') {
      META_PAGES.forEach(function (mp) {
        var m = (data.meta && data.meta[mp.key]) || {};
        parts.push('<div class="studio-live-preview studio-live-card"><p class="studio-live-preview-label">' + mp.label + '</p>' +
          '<p class="card-text"><strong>' + esc(m.title || '') + '</strong></p>' +
          '<p class="card-text">' + esc(m.description || '') + '</p></div>');
      });
    }
    if (sectionId === 'ui') {
      var ui = data.uiLabels || {};
      parts.push('<div class="studio-live-preview studio-live-card"><p class="studio-live-preview-label">Microtextos</p>' +
        '<p class="card-text">Cards: ' + esc(ui.cardExplore || '') + ' · ' + esc(ui.cardRoster || '') + ' · ' + esc(ui.cardEnter || '') + '</p>' +
        '<p class="card-text">Noticias: ' + esc(ui.newsReadMore || '') + ' · Cerrar: ' + esc(ui.newsPanelClose || '') + '</p></div>');
    }
    if (sectionId === 'cuenta') {
      parts.push(buildItemPreviewCard('page:cuenta', data));
      var cp = data.cuentaPage || {};
      parts.push('<div class="studio-live-preview studio-live-card"><p class="studio-live-preview-label">Login / registro</p>' +
        '<h3 class="section-title" style="font-size:1.25rem">' + esc(cp.loginTitle || '') + '</h3>' +
        '<p class="card-text">' + esc(cp.loginEmail || '') + ' · ' + esc(cp.loginPassword || '') + '</p></div>');
    }
    if (sectionId === 'contact') {
      parts.push(buildItemPreviewCard('contact', data));
      var cp2 = data.contactPage || {};
      parts.push('<div class="studio-live-preview studio-live-card"><p class="studio-live-preview-label">Formulario</p>' +
        '<h3 class="section-title" style="font-size:1.25rem">' + esc(cp2.formTitle || '') + '</h3>' +
        '<p class="card-text">' + esc((cp2.formLabels && cp2.formLabels.submit) || '') + '</p></div>');
    }
    if (sectionId === 'media') {
      var st = data.site || {};
      parts.push('<div class="studio-live-preview"><p class="studio-live-preview-label">Marca & banner</p>' +
        '<div class="studio-brand-strip studio-brand-strip--live">' +
        '<div class="studio-brand-strip-item"><span>Logo</span><img src="' + esc(st.logo || 'img/logo.jpg') + '" alt=""></div>' +
        '<div class="studio-brand-strip-item studio-brand-strip-item--wide"><span>Banner</span><img src="' + esc(st.banner || 'img/banner-oficial.png') + '" alt=""></div>' +
        '</div><p class="studio-live-more">Opacidad banner: ' + (st.heroImageOpacity != null ? st.heroImageOpacity : 0.5) +
        (st.heroOverlay ? ' · Capa oscura ON' : ' · Imagen limpia') + '</p></div>');
    }
    if (sectionId === 'hero') {
      var ho = data.home || {};
      parts.push('<div class="studio-live-preview"><p class="studio-live-preview-label">Hero portada</p>' +
        '<div class="studio-live-hero">' +
        '<p class="eyebrow">' + esc(ho.eyebrow) + '</p><h1 class="display">' + ho.title + '</h1>' +
        '<p class="lead">' + esc(ho.lead) + '</p>' +
        '<div class="studio-live-btns">' +
        '<span class="btn btn-primary btn-sm">' + esc((ho.ctaPrimary && ho.ctaPrimary.text) || '') + '</span>' +
        '<span class="btn btn-ghost btn-sm">' + esc((ho.ctaSecondary && ho.ctaSecondary.text) || '') + '</span></div></div></div>');
      (data.stats || []).forEach(function (_, i) { parts.push(buildItemPreviewCard('stat:' + i, data)); });
    }
    if (sectionId === 'navmenu') parts.push(navMockHtml(data));
    if (sectionId === 'footer') {
      parts.push(buildItemPreviewCard('footer', data));
      parts.push(buildItemPreviewCard('contact', data));
    }
    if (sectionId === 'pages') {
      Object.keys(data.pages || {}).forEach(function (k) { parts.push(buildItemPreviewCard('page:' + k, data)); });
    }
    if (sectionId === 'ticker') {
      parts.push(buildItemPreviewCard('ticker', data));
      parts.push(buildItemPreviewCard('brands', data));
    }
    if (sectionId === 'match') parts.push(buildItemPreviewCard('match', data));
    if (sectionId === 'sections') {
      ['spotlight', 'disciplines', 'schedule', 'sponsor', 'seo', 'cta'].forEach(function (k) {
        parts.push(buildItemPreviewCard('sec:' + k, data));
      });
      parts.push(buildItemPreviewCard('cta', data));
    }
    if (sectionId === 'spotlight') {
      (data.spotlight || []).forEach(function (_, i) { parts.push(buildItemPreviewCard('spot:' + i, data)); });
    }
    if (sectionId === 'schedule') {
      (data.schedule || []).forEach(function (_, i) { parts.push(buildItemPreviewCard('schedule:' + i, data)); });
    }
    if (sectionId === 'sponsor') {
      (data.sponsorTiers || []).forEach(function (_, i) { parts.push(buildItemPreviewCard('tier:' + i, data)); });
    }
    if (sectionId === 'seo') {
      parts.push('<div class="studio-live-preview studio-live-card"><p class="studio-live-preview-label">Texto SEO</p>' +
        (data.home && data.home.seoText || []).map(function (p) { return '<p class="card-text">' + esc(p) + '</p>'; }).join('') + '</div>');
      (data.home && data.home.faq || []).forEach(function (_, i) { parts.push(buildItemPreviewCard('faq:' + i, data)); });
    }
    if (sectionId === 'news') {
      (data.news && data.news.articles || []).forEach(function (_, i) { parts.push(buildItemPreviewCard('news:' + i, data)); });
    }
    if (sectionId === 'history') {
      var hist = data.history || {};
      parts.push('<div class="studio-live-preview studio-live-card"><p class="studio-live-preview-label">Intro historia</p>' +
        '<h3 class="section-title">' + (hist.intro && hist.intro.title || '') + '</h3>' +
        '<p>' + esc(hist.intro && hist.intro.lead || '') + '</p></div>');
      (hist.storyBlocks || []).forEach(function (_, i) { parts.push(buildItemPreviewCard('story:' + i, data)); });
      (hist.milestones || []).forEach(function (_, i) { parts.push(buildItemPreviewCard('mile:' + i, data)); });
    }
    if (sectionId === 'teams') {
      (data.teams || []).forEach(function (t, i) {
        parts.push(buildItemPreviewCard('team:' + t.id, data));
        parts.push(buildItemPreviewCard('teamCard:' + i, data));
      });
      parts.push(buildItemPreviewCard('tryouts', data));
    }
    if (sectionId === 'players') {
      [['clashRoyale', 'Clash Royale'], ['clubesPro', 'Clubes Pro FC26']].forEach(function (pair) {
        parts.push('<p class="studio-live-preview-label" style="margin-top:0.75rem">' + pair[1] + '</p>');
        ((data.rosters && data.rosters[pair[0]]) || []).forEach(function (_, i) {
          parts.push(buildItemPreviewCard('player:' + pair[0] + '-' + i, data));
        });
      });
    }
    if (sectionId === 'visibility') {
      parts.push('<div class="studio-live-preview studio-live-card"><p class="studio-live-preview-label">Visibilidad</p>' +
        '<p class="card-text">Los bloques desmarcados desaparecen al instante en la web.</p></div>');
    }
    if (!parts.length) {
      return '<div class="studio-live-pane-empty">Edita los campos para ver la vista previa aquí.</div>';
    }
    return '<div class="studio-live-pane-stack">' + parts.join('') + '</div>';
  }

  function updateLivePane(html) {
    var pane = document.getElementById('studio-live-pane-content');
    if (pane) pane.innerHTML = html;
  }

  function scrollToSectionBlock(sectionId) {
    if (!livePreviewOn) return;
    var block = SECTION_BLOCK[sectionId];
    if (!block) return;
    var el = document.querySelector('[data-cms-block="' + block + '"]');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function applyLivePreview() {
    if (!panelOpen || !livePreviewOn) return;
    if (activeSection === 'backup') {
      updateLivePane(buildSectionPreview('backup', getData()));
      return;
    }
    var data = collectData();
    previewData = previewData || getData();
    deepMerge(previewData, data);
    deepMerge(LYOK_DATA, data);
    applyVisibility(LYOK_DATA.visibility);
    if (previewViewMode === 'web') {
      updateLivePane(buildSectionPreview(activeSection, data));
      if (webFrameReady) pushDraftToFrame(data);
      else syncWebFrame();
    } else {
      applySiteImages();
      if (window.applyLyokTheme) applyLyokTheme();
      runPreviewRefresh();
      updateLivePane(buildSectionPreview(activeSection, data));
      scrollToSectionBlock(activeSection);
    }
    if (activeSection === 'navmenu') {
      var mock = document.querySelector('.studio-nav-mock-inner');
      if (mock) {
        mock.innerHTML = (data.nav || []).map(function (item) {
          var cls = item.cta ? ' studio-nav-mock-cta' : '';
          return '<span class="studio-nav-mock-link' + cls + '">' + esc(item.label) + '</span>';
        }).join('');
      }
    }
    if (activeItemPreviewKey) {
      var modal = document.getElementById('lyok-item-preview');
      var body = modal && modal.querySelector('.lyok-item-preview-body');
      if (body) body.innerHTML = buildItemPreviewCard(activeItemPreviewKey, data);
    }
  }

  function scheduleLivePreview() {
    if (!livePreviewOn || !panelOpen) return;
    clearTimeout(livePreviewTimer);
    livePreviewTimer = setTimeout(applyLivePreview, 650);
  }

  function bindLivePreview(root) {
    if (!root) return;
    root.querySelectorAll('input, textarea, select').forEach(function (el) {
      el.addEventListener('input', scheduleLivePreview);
      el.addEventListener('change', scheduleLivePreview);
    });
  }

  function closeItemPreviewModal() {
    activeItemPreviewKey = null;
    var m = document.getElementById('lyok-item-preview');
    if (m) m.remove();
  }

  function showItemPreviewModal(itemKey) {
    closeItemPreviewModal();
    activeItemPreviewKey = itemKey;
    var data = collectData();
    previewData = data;
    deepMerge(LYOK_DATA, data);
    applyVisibility(LYOK_DATA.visibility);
    applySiteImages();
    if (window.applyLyokTheme) applyLyokTheme();
    runPreviewRefresh();
    var card = buildItemPreviewCard(itemKey, data);
    var ov = document.createElement('div');
    ov.id = 'lyok-item-preview';
    ov.className = 'lyok-item-preview';
    ov.innerHTML =
      '<div class="lyok-item-preview-box">' +
        '<header class="lyok-item-preview-head">' +
          ico('eye', 'st-ico') + '<strong>Vista previa en vivo</strong>' +
          '<button type="button" class="lyok-item-preview-x" aria-label="Cerrar">×</button>' +
        '</header>' +
        '<div class="lyok-item-preview-body">' + card + '</div>' +
        '<footer class="lyok-item-preview-foot">' +
          '<button type="button" class="btn btn-ghost" id="lyok-item-preview-close">Cerrar</button>' +
          '<button type="button" class="btn btn-primary" id="lyok-item-preview-web">' + ico('link', 'st-ico st-ico-sm') + '<span>Ver en la web</span></button>' +
        '</footer></div>';
    document.body.appendChild(ov);
    ov.querySelector('.lyok-item-preview-x').onclick = closeItemPreviewModal;
    ov.querySelector('#lyok-item-preview-close').onclick = closeItemPreviewModal;
    ov.querySelector('#lyok-item-preview-web').onclick = function () { goPreviewWeb(itemKey); };
    ov.addEventListener('click', function (e) { if (e.target === ov) closeItemPreviewModal(); });
  }

  function goPreviewWeb(itemKey) {
    if (panelOpen) {
      closeItemPreviewModal();
      applyItemPreview(itemKey, false);
      return;
    }
    previewData = collectData();
    saveSaved({ data: previewData, visibility: previewData.visibility, _draft: true });
    sessionStorage.setItem('lyokfox_preview_item', itemKey);
    closeItemPreviewModal();
    location.href = itemWebUrl(itemKey);
  }

  function applyItemPreview(itemKey, webOnly) {
    previewData = collectData();
    deepMerge(LYOK_DATA, previewData);
    applyVisibility(LYOK_DATA.visibility);
    applySiteImages();
    if (window.applyLyokTheme) applyLyokTheme();
    runPreviewRefresh();
    sessionStorage.setItem('lyokfox_live_draft', JSON.stringify({ data: previewData, visibility: previewData.visibility }));
    pendingFrameFocus = itemKey;
    if (panelOpen) {
      setPreviewViewMode('web');
      navigatePreviewFrame(itemWebUrl(itemKey), itemKey);
      return;
    }
    if (webOnly) goPreviewWeb(itemKey);
    else showItemPreviewModal(itemKey);
  }

  function loadSaved() {
    try { return JSON.parse(localStorage.getItem(SK) || '{}'); } catch (e) { return {}; }
  }

  function saveSaved(data) { localStorage.setItem(SK, JSON.stringify(data)); }

  function deepMerge(t, s) {
    if (!s || typeof s !== 'object') return t;
    Object.keys(s).forEach(function (k) {
      if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k])) {
        t[k] = deepMerge(t[k] || {}, s[k]);
      } else if (Array.isArray(s[k])) {
        if (s[k].length) t[k] = s[k];
      } else { t[k] = s[k]; }
    });
    return t;
  }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function getData() {
    return previewData || JSON.parse(JSON.stringify(typeof LYOK_DATA !== 'undefined' ? LYOK_DATA : {}));
  }

  function applyOverrides(saved) {
    if (typeof LYOK_DATA === 'undefined') return;
    var s = saved || loadSaved();
    if (s.data) deepMerge(LYOK_DATA, s.data);
    if (s.visibility) {
      var vis = s.visibility;
      var falseCount = Object.keys(vis).filter(function (k) {
        return typeof vis[k] !== 'object' && vis[k] === false;
      }).length;
      if (falseCount < 4) {
        LYOK_DATA.visibility = Object.assign({}, LYOK_DATA.visibility || {}, s.visibility);
      }
    }
    applyVisibility(LYOK_DATA.visibility);
    applySiteImages();
    if (window.applyLyokTheme) applyLyokTheme();
  }

  function applySiteImages() {
    if (typeof LYOK_DATA === 'undefined' || !LYOK_DATA.site) return;
    var b = LYOK_DATA.site.banner || 'img/banner-oficial.png';
    var l = LYOK_DATA.site.logo || 'img/logo.jpg';
    document.querySelectorAll('.hero-bg img, .page-hero-bg img').forEach(function (i) { i.src = b; });
    document.querySelectorAll('.brand img, .hero-logo').forEach(function (i) {
      if (!i.getAttribute('data-keep-src')) i.src = l;
    });
    document.body.classList.toggle('hero-pure', LYOK_DATA.site.heroOverlay === false);
    document.body.classList.toggle('hero-fx-on', LYOK_DATA.site.heroOverlay === true);
    var op = LYOK_DATA.site.heroImageOpacity != null ? LYOK_DATA.site.heroImageOpacity : 0.5;
    document.querySelectorAll('.hero-bg img').forEach(function (hi) {
      hi.style.opacity = String(op);
    });
    document.querySelectorAll('.page-hero-bg img').forEach(function (img) {
      img.style.opacity = String(Math.min(op * 0.58, 0.28));
    });
    applyHeroEffectsLocal();
  }

  function applyHeroEffectsLocal() {
    if (typeof LYOK_DATA === 'undefined' || !LYOK_DATA.site) return;
    var fx = LYOK_DATA.site.heroEffects || {};
    document.querySelectorAll('[data-fx]').forEach(function (el) {
      var key = el.getAttribute('data-fx');
      el.setAttribute('data-fx-visible', fx[key] === true ? 'true' : 'false');
    });
  }

  function applyVisibility(vis) {
    if (window.applyLyokVisibility) {
      window.applyLyokVisibility(vis);
      return;
    }
    if (!vis) return;
    Object.keys(vis).forEach(function (k) {
      if (typeof vis[k] === 'object') return;
      document.querySelectorAll('[data-cms-block="' + k + '"]').forEach(function (el) {
        el.hidden = vis[k] === false;
      });
    });
    var t = document.getElementById('site-ticker');
    if (t) t.style.display = vis.ticker === false ? 'none' : '';
  }

  var FX_ONLY_SECTIONS = { theme: 1, typography: 1, effects: 1, pagestyles: 1 };
  var MEDIA_ONLY_SECTIONS = { media: 1 };
  var NAV_ONLY_SECTIONS = { navmenu: 1, footer: 1 };
  var TICKER_ONLY_SECTIONS = { ticker: 1 };
  var META_ONLY_SECTIONS = { meta: 1 };

  function refresh() { if (window.lyokRerender) window.lyokRerender(); }

  function parentPreviewPaused() {
    return panelOpen && livePreviewOn && previewViewMode === 'web';
  }

  function runPreviewRefresh() {
    if (parentPreviewPaused()) return;
    if (FX_ONLY_SECTIONS[activeSection] && window.lyokRefreshFx) window.lyokRefreshFx();
    else if (MEDIA_ONLY_SECTIONS[activeSection] && window.lyokRefreshMedia) window.lyokRefreshMedia();
    else if (NAV_ONLY_SECTIONS[activeSection] && window.lyokRefreshNav) window.lyokRefreshNav();
    else if (META_ONLY_SECTIONS[activeSection] && window.applyPageMeta) {
      window.applyPageMeta();
    } else if (TICKER_ONLY_SECTIONS[activeSection] && window.renderTicker) {
      window.renderTicker();
      if (window.lyokRefreshNav) window.lyokRefreshNav();
    } else if (window.lyokRerender) window.lyokRerender();
  }

  function runFrameRefresh(w) {
    if (!w) return;
    if (FX_ONLY_SECTIONS[activeSection] && w.lyokRefreshFx) w.lyokRefreshFx();
    else if (MEDIA_ONLY_SECTIONS[activeSection] && w.lyokRefreshMedia) w.lyokRefreshMedia();
    else if (NAV_ONLY_SECTIONS[activeSection] && w.lyokRefreshNav) w.lyokRefreshNav();
    else if (w.applyCmsPreviewPayload) w.applyCmsPreviewPayload(w.LYOK_DATA);
    else if (w.lyokRerender) w.lyokRerender();
  }

  function colorField(label, id, val) {
    var v = val || '#030303';
    if (v.charAt(0) !== '#') v = '#030303';
    return '<label class="studio-field studio-color-field">' + label +
      '<div class="studio-color-row">' +
      '<input type="color" id="' + id + '-picker" value="' + esc(v) + '" data-color-sync="' + id + '">' +
      '<input type="text" id="' + id + '" value="' + esc(val || v) + '" data-theme-field="' + id + '">' +
      '</div></label>';
  }

  function typeColorField(label, id, val, hint) {
    var pickerVal = (val && String(val).charAt(0) === '#') ? val : '#d4a24e';
    return '<label class="studio-field studio-color-field">' + label +
      (hint ? ' <em class="studio-card-key">' + hint + '</em>' : '') +
      '<div class="studio-color-row">' +
      '<input type="color" id="' + id + '-picker" value="' + esc(pickerVal) + '" data-color-sync="' + id + '">' +
      '<input type="text" id="' + id + '" value="' + esc(val || '') + '" placeholder="Auto (hereda del tema)" data-theme-field="' + id + '">' +
      '</div></label>';
  }

  function rangeField(label, id, val, min, max, step) {
    return '<label class="studio-field">' + label +
      '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" data-theme-range="' + id + '">' +
      '<output for="' + id + '" class="studio-range-val" id="' + id + '-out">' + val + '</output></label>';
  }

  function imgField(label, id, val, wide) {
    var prev = val
      ? '<img src="' + esc(val) + '" alt="Vista previa">'
      : '<span class="studio-img-empty">' + ico('image', 'st-ico st-ico-sm') + '<span>Sin imagen — sube o pega URL</span></span>';
    return '<div class="studio-media-block' + (wide ? ' studio-media-block--wide' : '') + '">' +
      '<div class="studio-media-head"><strong>' + label + '</strong></div>' +
      '<div class="studio-img-preview' + (wide ? ' studio-img-preview--hero' : '') + '" id="prev-' + id + '">' + prev + '</div>' +
      '<label class="studio-field studio-field--inline">Ruta o URL de imagen<input type="text" id="' + id + '" value="' + esc(val) + '" data-img-preview="prev-' + id + '" placeholder="img/banner-oficial.png"></label>' +
      '<div class="studio-media-actions">' +
        '<label class="studio-upload-label studio-upload-btn">' + ico('upload', 'st-ico st-ico-sm') + ' Subir archivo<input type="file" accept="image/*" data-upload-target="' + id + '" data-upload-preview="prev-' + id + '"></label>' +
        '<button type="button" class="btn btn-ghost btn-sm studio-img-open" data-img-open="' + id + '">' + ico('eye', 'st-ico st-ico-sm') + ' Ver grande</button>' +
      '</div></div>';
  }

  function previewBlock(blockId) {
    var el = document.querySelector('[data-cms-block="' + blockId + '"]');
    if (!el) {
      var target = blockPreviewTarget(blockId);
      if (target && target.page) window.location.href = target.page + (target.hash || '');
      return;
    }
    document.body.classList.add('lyok-highlight-block');
    el.classList.add('lyok-block-highlight');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(function () {
      el.classList.remove('lyok-block-highlight');
      document.body.classList.remove('lyok-highlight-block');
    }, 2800);
  }

  function bindImgPreviews(root) {
    if (!root) return;
    root.querySelectorAll('[data-img-preview]').forEach(function (inp) {
      inp.addEventListener('input', function () {
        var p = document.getElementById(inp.getAttribute('data-img-preview'));
        if (p) {
          p.innerHTML = inp.value
            ? '<img src="' + inp.value + '" alt="Vista previa">'
            : '<span class="studio-img-empty">' + ico('image', 'st-ico st-ico-sm') + '<span>Sin imagen</span></span>';
        }
        if (inp.id === 'st-logo') {
          var live = document.getElementById('studio-live-logo');
          if (live && inp.value) live.src = inp.value;
        }
        if (inp.id === 'st-banner') {
          var liveB = document.getElementById('studio-live-banner');
          if (liveB && inp.value) liveB.src = inp.value;
        }
        scheduleLivePreview();
      });
    });
    root.querySelectorAll('[data-upload-target]').forEach(function (fi) {
      fi.addEventListener('change', function () {
        var f = fi.files[0];
        if (!f) return;
        var r = new FileReader();
        r.onload = function () {
          var tid = fi.getAttribute('data-upload-target');
          var inp = document.getElementById(tid);
          if (inp) {
            inp.value = r.result;
            inp.dispatchEvent(new Event('input'));
          }
        };
        r.readAsDataURL(f);
      });
    });
    root.querySelectorAll('[data-img-open]').forEach(function (btn) {
      btn.onclick = function () {
        var id = btn.getAttribute('data-img-open');
        var inp = document.getElementById(id);
        if (inp && inp.value) showImgLightbox(inp.value);
      };
    });
    var heroOp = root.querySelector('#st-hero-opacity');
    if (heroOp) {
      heroOp.addEventListener('input', function () {
        var out = document.getElementById('st-hero-opacity-out');
        if (out) out.textContent = heroOp.value;
      });
    }
  }

  function bindStudioCrud(body) {
    body.querySelectorAll('[data-studio-add]').forEach(function (btn) {
      btn.onclick = function () {
        persistSectionDraft();
        var kind = btn.getAttribute('data-studio-add');
        var d = getData();
        var secMap = {
          faq: 'seo', nav: 'navmenu', brand: 'ticker', news: 'news', schedule: 'schedule',
          spot: 'spotlight', tier: 'sponsor', story: 'history', hist: 'history', mile: 'history',
          player: 'players', tickerline: 'ticker', stat: 'hero'
        };
        if (kind === 'faq') {
          d.home = d.home || {}; d.home.faq = d.home.faq || [];
          d.home.faq.push({ q: 'Nueva pregunta', a: 'Escribe aquí la respuesta.' });
        } else if (kind === 'nav') {
          d.nav = d.nav || [];
          d.nav.push({ key: 'link' + d.nav.length, label: 'Nuevo enlace', href: 'index.html' });
        } else if (kind === 'brand') {
          d.brands = d.brands || [];
          d.brands.push({ name: 'Nueva liga', logo: '' });
        } else if (kind === 'news') {
          d.news = d.news || {}; d.news.articles = d.news.articles || [];
          d.news.articles.unshift({
            id: 'n-' + Date.now(), date: new Date().toISOString().slice(0, 10),
            tag: 'Club', cat: 'club', featured: false, title: 'Nueva noticia',
            excerpt: 'Escribe el extracto aquí.', image: 'img/banner-oficial.png', body: ['Párrafo 1']
          });
        } else if (kind === 'schedule') {
          d.schedule = d.schedule || [];
          d.schedule.push({ game: 'Clubes Pro', vs: 'Rival', league: 'Torneo', when: 'Próximamente', live: false, homeLogo: 'img/logo.jpg' });
        } else if (kind === 'spot') {
          d.spotlight = d.spotlight || [];
          d.spotlight.push({ num: '0' + (d.spotlight.length + 1), title: 'Nuevo acceso', text: 'Descripción', href: 'index.html', accent: false });
        } else if (kind === 'tier') {
          d.sponsorTiers = d.sponsorTiers || [];
          d.sponsorTiers.push({ name: 'Nuevo plan', price: 'Consultar', featured: false, perks: ['Beneficio 1'], logo: '' });
        } else if (kind === 'mile') {
          d.history = d.history || {}; d.history.milestones = d.history.milestones || [];
          d.history.milestones.push({ year: '2026', tag: 'Hito', title: 'Nuevo hito', text: 'Descripción del hito.' });
        } else if (kind === 'story') {
          d.history = d.history || {}; d.history.storyBlocks = d.history.storyBlocks || [];
          d.history.storyBlocks.push({
            id: 'story-' + Date.now(),
            layout: 'image-left',
            eyebrow: 'Nueva era',
            title: 'Nuevo <em>bloque</em>',
            text: 'Escribe aquí el texto del bloque narrativo.',
            image: 'img/banner-oficial.png',
            style: { width: 'normal', titleScale: 1, textScale: 1 }
          });
        } else if (kind === 'player') {
          var rk = btn.getAttribute('data-roster-key') || 'clubesPro';
          d.rosters = d.rosters || {}; d.rosters[rk] = d.rosters[rk] || [];
          d.rosters[rk].push({ name: 'Nuevo jugador', role: 'Jugador', note: '', avatar: '' });
          previewData = d;
          setSection('players');
          return;
        } else if (kind === 'tickerline') {
          d.ticker = d.ticker || [];
          d.ticker.push('Nuevo aviso matchday');
        } else if (kind === 'stat') {
          d.stats = d.stats || [];
          d.stats.push({ value: '0', label: 'Nuevo' });
        }
        previewData = d;
        setSection(secMap[kind] || activeSection);
      };
    });
    body.querySelectorAll('[data-studio-remove]').forEach(function (btn) {
      btn.onclick = function () {
        if (!confirm('¿Eliminar este elemento?')) return;
        persistSectionDraft();
        var kind = btn.getAttribute('data-studio-remove');
        var idx = +btn.getAttribute('data-index');
        var rk = btn.getAttribute('data-roster-key');
        var d = getData();
        if (kind === 'faq' && d.home && d.home.faq) { d.home.faq.splice(idx, 1); setSection('seo'); }
        else if (kind === 'nav' && d.nav && d.nav.length > 2) { d.nav.splice(idx, 1); setSection('navmenu'); }
        else if (kind === 'brand' && d.brands) { d.brands.splice(idx, 1); setSection('ticker'); }
        else if (kind === 'news' && d.news && d.news.articles) { d.news.articles.splice(idx, 1); setSection('news'); }
        else if (kind === 'schedule' && d.schedule) { d.schedule.splice(idx, 1); setSection('schedule'); }
        else if (kind === 'spot' && d.spotlight) { d.spotlight.splice(idx, 1); setSection('spotlight'); }
        else if (kind === 'tier' && d.sponsorTiers) { d.sponsorTiers.splice(idx, 1); setSection('sponsor'); }
        else if (kind === 'mile' && d.history && d.history.milestones) { d.history.milestones.splice(idx, 1); setSection('history'); }
        else if (kind === 'story' && d.history && d.history.storyBlocks) { d.history.storyBlocks.splice(idx, 1); setSection('history'); }
        else if (kind === 'player' && rk && d.rosters && d.rosters[rk]) { d.rosters[rk].splice(idx, 1); setSection('players'); }
        else if (kind === 'stat' && d.stats && d.stats.length > 1) { d.stats.splice(idx, 1); setSection('hero'); }
        previewData = d;
      };
    });
    body.querySelectorAll('[data-studio-dup]').forEach(function (btn) {
      btn.onclick = function () {
        persistSectionDraft();
        var kind = btn.getAttribute('data-studio-dup');
        var idx = +btn.getAttribute('data-index');
        var d = JSON.parse(JSON.stringify(getData()));
        if (kind === 'news' && d.news && d.news.articles[idx]) {
          var copy = JSON.parse(JSON.stringify(d.news.articles[idx]));
          copy.id = copy.id + '-copy'; copy.title = copy.title + ' (copia)';
          d.news.articles.splice(idx + 1, 0, copy);
          setSection('news');
        } else if (kind === 'schedule' && d.schedule[idx]) {
          var sc = JSON.parse(JSON.stringify(d.schedule[idx]));
          sc.vs = sc.vs + ' (copia)';
          d.schedule.splice(idx + 1, 0, sc);
          setSection('schedule');
        }
        previewData = d;
      };
    });
  }

  function bindStudioSearch(shell) {
    var inp = shell.querySelector('#st-studio-search');
    if (!inp) return;
    inp.addEventListener('input', function () {
      var ids = filterNavByQuery(inp.value);
      var nav = shell.querySelector('.lyok-studio-nav');
      if (nav) nav.innerHTML = renderSidebarNav(activeSection, ids);
      nav.querySelectorAll('button[data-sec]').forEach(function (b) {
        b.onclick = function () { setSection(b.getAttribute('data-sec')); };
      });
    });
  }

  function renderSection(id, data) {
    var h = '';
    var vis = data.visibility || {};
    if (id === 'dashboard') {
      var c = studioCounts(data);
      h = '<div class="studio-welcome studio-welcome--ultra studio-welcome--cinema">' +
        '<div class="studio-welcome-brand">' + (window.LYOK_ICONS ? LYOK_ICONS.logoMark((data.site && data.site.logo) || 'img/logo.jpg', 'studio-welcome-logo') : '') +
        '<div><p class="eyebrow">LyokFox · Esports CMS</p><h4>STUDIO ULTRA</h4>' +
        '<p>Tu <strong>centro de mando cinematográfico</strong>: textos, colores, imágenes, partidos, jugadores y noticias con <em>vista previa en vivo</em> al instante.</p></div></div>' +
        '<div class="studio-stats-row">' +
          '<span class="studio-stat-pill"><strong>' + c.news + '</strong> noticias</span>' +
          '<span class="studio-stat-pill"><strong>' + c.players + '</strong> jugadores</span>' +
          '<span class="studio-stat-pill"><strong>' + c.schedule + '</strong> partidos</span>' +
          '<span class="studio-stat-pill"><strong>' + c.teams + '</strong> equipos</span>' +
          '<span class="studio-stat-pill"><strong>' + c.brands + '</strong> ligas</span>' +
          '<span class="studio-stat-pill"><strong>' + c.storyBlocks + '</strong> bloques historia</span>' +
        '</div>' +
        '<div class="studio-quick-actions">' +
          '<button type="button" class="btn btn-primary btn-sm" data-goto="news">+ Noticia</button>' +
          '<button type="button" class="btn btn-ghost btn-sm" data-goto="schedule">Calendario</button>' +
          '<button type="button" class="btn btn-ghost btn-sm" data-goto="players">Jugadores</button>' +
          '<button type="button" class="btn btn-ghost btn-sm" data-goto="theme">Colores</button>' +
          '<button type="button" class="btn btn-ghost btn-sm" data-goto="media">Banner & logo</button>' +
        '</div>' +
        '<p class="studio-lead">Mapa por página — cada botón abre el editor correcto sin duplicar datos.</p>' +
        '<div class="studio-page-map">' + studioMapHtml() + '</div>' +
        '<details class="studio-card studio-card--flat"><summary>Todas las herramientas (' + (NAV.length - 1) + ')</summary><div class="studio-card-body">' +
        '<div class="studio-dash-grid studio-dash-grid--ultra">' +
        NAV.slice(1).map(function (n) {
          return '<button type="button" class="studio-dash-card" data-goto="' + n.id + '">' +
            '<span class="studio-dash-ico">' + ico(n.icon, 'st-ico st-ico-lg') + '</span>' +
            '<strong>' + n.label + '</strong>' +
            '<em>' + (n.tags || 'Editar') + '</em></button>';
        }).join('') +
        '</div></div></details></div>';
    }

    if (id === 'theme') {
      var th = data.theme || {};
      h = studioHint('Paleta <strong>global</strong> de la web (fondos, acentos, header). Los colores de cada tipo de texto están en «<button type="button" class="studio-inline-link" data-goto="typography">Tipografía & textos</button>».') +
        '<div class="studio-preset-row">' +
        Object.keys(THEME_PRESETS).map(function (key) {
          return '<button type="button" class="btn btn-ghost btn-sm" data-theme-preset="' + key + '">' + THEME_PRESETS[key].label + '</button>';
        }).join('') +
        '</div>' +
        '<details class="studio-card" open><summary>Colores principales</summary><div class="studio-card-body studio-grid-2">' +
          colorField('Acento naranja', 'st-theme-accent', th.accent || '#ff5a1f') +
          colorField('Acento claro', 'st-theme-accent-bright', th.accentBright || '#ff7a3d') +
          colorField('Acento oscuro', 'st-theme-accent-dim', th.accentDim || '#c94412') +
          colorField('Dorado', 'st-theme-gold', th.gold || '#d4a24e') +
          colorField('Fondo página', 'st-theme-bg', th.bg || '#030303') +
          colorField('Fondo secundario', 'st-theme-bg2', th.bg2 || '#060606') +
          colorField('Superficie cards', 'st-theme-surface', th.surface || '#0a0a0a') +
          colorField('Texto base', 'st-theme-text', th.text || '#f2f0ed') +
          colorField('Texto muted', 'st-theme-muted', th.muted || '#7a7a7a') +
        '</div></details>' +
        '<details class="studio-card" open><summary>Header & capas</summary><div class="studio-card-body">' +
          colorField('Color fondo header', 'st-theme-header-bg', th.headerBg || '#030303') +
          rangeField('Opacidad header al scroll (0–1)', 'st-theme-header-opacity', th.headerOpacity != null ? th.headerOpacity : 0.88, 0, 1, 0.02) +
          rangeField('Opacidad header arriba (0 = transparente)', 'st-theme-header-top-opacity', th.headerTopOpacity != null ? th.headerTopOpacity : 0, 0, 1, 0.02) +
          rangeField('Blur header (px)', 'st-theme-header-blur', th.headerBlur != null ? th.headerBlur : 20, 0, 40, 1) +
          rangeField('Altura cabecera (px)', 'st-theme-header-height', th.headerHeight != null ? th.headerHeight : 84, 64, 96, 2) +
          rangeField('Tamaño botones menú (×)', 'st-theme-header-nav-scale', th.headerNavScale != null ? th.headerNavScale : 1.08, 0.85, 1.25, 0.02) +
          rangeField('Tamaño marca / logo (×)', 'st-theme-header-brand-scale', th.headerBrandScale != null ? th.headerBrandScale : 1.06, 0.85, 1.25, 0.02) +
          rangeField('Opacidad glass cards (0–1)', 'st-theme-card-glass', th.cardGlass != null ? th.cardGlass : 0.82, 0.2, 1, 0.02) +
          rangeField('Grain / textura (0–0.12)', 'st-theme-grain', th.grainOpacity != null ? th.grainOpacity : 0.03, 0, 0.12, 0.005) +
          rangeField('Bordes acento (0–1)', 'st-theme-border-accent', th.borderAccent != null ? th.borderAccent : 0.5, 0, 1, 0.05) +
          rangeField('Intensidad glow (0.5–2)', 'st-theme-glow', th.glowIntensity != null ? th.glowIntensity : 1, 0.5, 2, 0.1) +
          rangeField('Radio esquinas cards (px)', 'st-theme-radius', th.radiusLg != null ? th.radiusLg : 12, 0, 24, 1) +
          rangeField('Velocidad ticker (segundos)', 'st-theme-ticker-speed', th.tickerSpeed != null ? th.tickerSpeed : 38, 18, 80, 1) +
        '</div></details>' +
        '<button type="button" class="studio-btn-preview" id="st-theme-live">' + pv('Ver cambios en la web') + '</button>';
    }

    if (id === 'typography') {
      var thTy = data.theme || {};
      var ty = thTy.type || {};
      var sc = thTy.scale || {};
      h = studioHint('Color de <strong>cada tipo de texto</strong> en la web. Vacío = usa el color base del tema. Acepta hex (#ff5a1f) o rgba.') +
        '<div class="studio-grid-2">' +
        TYPE_FIELDS.map(function (f) {
          return typeColorField(f.label, 'st-type-' + f.key, ty[f.key] || '', f.hint);
        }).join('') +
        '</div>' +
        '<p class="studio-lead" style="margin-top:1rem">Escala de tamaño (1 = normal)</p>' +
        '<div class="studio-grid-2">' +
          rangeField('Títulos hero', 'st-scale-display', sc.display != null ? sc.display : 1, 0.8, 1.25, 0.05) +
          rangeField('Títulos sección', 'st-scale-section', sc.section != null ? sc.section : 1, 0.8, 1.25, 0.05) +
          rangeField('Cuerpo / lead', 'st-scale-body', sc.body != null ? sc.body : 1, 0.85, 1.2, 0.05) +
        '</div>' +
        '<button type="button" class="studio-btn-preview" id="st-theme-live">' + pv('Ver tipografía en la web') + '</button>';
    }

    if (id === 'effects') {
      var fx = (data.theme && data.theme.effects) || {};
      var thFx = data.theme || {};
      h = studioHint('Control total de <strong>efectos premium</strong>: partículas, mesh, spotlight, embers, tilt… Ajusta intensidad sin tocar colores. Perfil «Fluido» = máximo rendimiento.') +
        '<div class="studio-preset-row">' +
          '<button type="button" class="btn btn-ghost btn-sm" data-fx-profile="lite">Fluido (rápido)</button>' +
          '<button type="button" class="btn btn-ghost btn-sm" data-fx-profile="balanced">Equilibrado</button>' +
          '<button type="button" class="btn btn-ghost btn-sm" data-fx-profile="ultra">Cinematográfico</button>' +
        '</div>' +
        '<input type="hidden" id="st-fx-profile" value="' + esc(fx.perfProfile || 'balanced') + '">' +
        '<div class="studio-fx-grid">' +
          '<label class="studio-check"><input type="checkbox" id="st-fx-mesh"' + (fx.mesh === true ? ' checked' : '') + '> Mesh de fondo (orbs)</label>' +
          '<label class="studio-check"><input type="checkbox" id="st-fx-dust"' + (fx.dust !== false ? ' checked' : '') + '> Partículas / polvo</label>' +
          '<label class="studio-check"><input type="checkbox" id="st-fx-spotlight"' + (fx.spotlight === true ? ' checked' : '') + '> Spotlight cursor</label>' +
          '<label class="studio-check"><input type="checkbox" id="st-fx-scanline"' + (fx.scanline === true ? ' checked' : '') + '> Scanlines cinematográficas</label>' +
          '<label class="studio-check"><input type="checkbox" id="st-fx-hero-cinema"' + (fx.heroCinema === true ? ' checked' : '') + '> Hero Ken Burns + haz de luz</label>' +
          '<label class="studio-check"><input type="checkbox" id="st-fx-embers"' + (fx.embers !== false ? ' checked' : '') + '> Embers en el hero</label>' +
          '<label class="studio-check"><input type="checkbox" id="st-fx-tilt"' + (fx.cardTilt === true ? ' checked' : '') + '> Tilt 3D en cards</label>' +
          '<label class="studio-check"><input type="checkbox" id="st-fx-magnetic"' + (fx.magneticBtns === true ? ' checked' : '') + '> Botones magnéticos</label>' +
          '<label class="studio-check"><input type="checkbox" id="st-theme-animations"' + (thFx.animations !== false ? ' checked' : '') + '> Animaciones reveal / scroll</label>' +
        '</div>' +
        '<p class="studio-lead" style="margin-top:1rem">Intensidad (más bajo = más fluido)</p>' +
        '<div class="studio-grid-2">' +
          rangeField('Partículas polvo (0–48)', 'st-fx-dust-count', fx.dustCount != null ? fx.dustCount : 8, 0, 48, 1) +
          rangeField('Embers hero (0–36)', 'st-fx-ember-count', fx.emberCount != null ? fx.emberCount : 6, 0, 36, 1) +
          rangeField('Blur mesh (px)', 'st-fx-mesh-blur', fx.meshBlur != null ? fx.meshBlur : 58, 24, 90, 2) +
          rangeField('Tamaño spotlight (px)', 'st-fx-spotlight-size', fx.spotlightSize != null ? fx.spotlightSize : 460, 200, 720, 20) +
          rangeField('Fuerza tilt cards', 'st-fx-tilt-strength', fx.tiltStrength != null ? fx.tiltStrength : 0.9, 0, 1.5, 0.05) +
          rangeField('Fuerza botones magnéticos', 'st-fx-magnetic-strength', fx.magneticStrength != null ? fx.magneticStrength : 0.12, 0, 0.28, 0.01) +
        '</div>' +
        '<button type="button" class="studio-btn-preview" id="st-theme-live">' + pv('Ver efectos en la web') + '</button>';
    }

    if (id === 'meta') {
      var meta = data.meta || {};
      h = studioHint('Título de pestaña del navegador y <strong>meta description</strong> por página (Google / redes). El hero visible se edita en «Héroes de páginas».') +
        META_PAGES.map(function (mp) {
          var m = meta[mp.key] || {};
          return '<details class="studio-card"><summary>' + mp.label + ' <em class="studio-card-key">' + mp.file + '</em></summary><div class="studio-card-body">' +
            '<label class="studio-field">&lt;title&gt; pestaña<input type="text" data-meta="' + mp.key + '" data-sf="title" value="' + esc(m.title || '') + '"></label>' +
            '<label class="studio-field">Meta description<textarea data-meta="' + mp.key + '" data-sf="description" rows="2">' + esc(m.description || '') + '</textarea></label>' +
            '<button type="button" class="studio-btn-preview" data-goto-page="' + mp.file + '">' + pv('Abrir ' + mp.label) + '</button>' +
          '</div></details>';
        }).join('');
    }

    if (id === 'ui') {
      var ui = data.uiLabels || {};
      var soc = ui.contactSocial || {};
      h = studioHint('Microtextos de la interfaz: enlaces en cards, redes en contacto, paneles y mensajes del sistema.') +
        '<div class="studio-grid-2">' +
          '<label class="studio-field">Card disciplinas<input type="text" id="st-ui-card-explore" value="' + esc(ui.cardExplore || 'Explorar') + '"></label>' +
          '<label class="studio-field">Card plantilla<input type="text" id="st-ui-card-roster" value="' + esc(ui.cardRoster || 'Ver plantilla') + '"></label>' +
          '<label class="studio-field">Card accesos rápidos<input type="text" id="st-ui-card-enter" value="' + esc(ui.cardEnter || 'Entrar') + '"></label>' +
          '<label class="studio-field">Noticias — leer más<input type="text" id="st-ui-news-read" value="' + esc(ui.newsReadMore || 'Leer artículo') + '"></label>' +
          '<label class="studio-field">Cerrar panel noticia<input type="text" id="st-ui-news-close" value="' + esc(ui.newsPanelClose || 'Cerrar') + '"></label>' +
          '<label class="studio-field">Cerrar perfil jugador<input type="text" id="st-ui-player-close" value="' + esc(ui.playerProfileClose || 'Cerrar') + '"></label>' +
        '</div>' +
        '<p class="studio-lead">Redes en bloque contacto</p>' +
        '<div class="studio-grid-2">' +
          '<label class="studio-field">Label X<input type="text" id="st-ui-soc-twitter" value="' + esc(soc.twitter || 'X / Twitter') + '"></label>' +
          '<label class="studio-field">Label Instagram<input type="text" id="st-ui-soc-instagram" value="' + esc(soc.instagram || 'Instagram') + '"></label>' +
          '<label class="studio-field">Label fans<input type="text" id="st-ui-soc-fans" value="' + esc(soc.fans || 'Comunidad fans') + '"></label>' +
          '<label class="studio-field">Éxito formulario (fallback)<input type="text" id="st-ui-contact-success" value="' + esc(ui.contactSuccess || '') + '" placeholder="Si «Página contacto» no define mensaje propio"></label>' +
        '</div>';
    }

    if (id === 'cuenta') {
      var cp = data.cuentaPage || {};
      h = visPanel('Visibilidad cuenta', [
        ['pageHero', 'Hero página', 'pageHero'],
        ['cuentaGate', 'Login / registro', 'cuentaGate'],
        ['cuentaArea', 'Perfil guardado', 'cuentaArea']
      ], vis) +
      studioHint('Toda la página <strong>cuenta.html</strong>: login, registro y perfil. Sin textos fijos en el HTML.') +
        '<details class="studio-card" open><summary>Hub — título y subtítulo</summary><div class="studio-card-body studio-grid-2">' +
          '<label class="studio-field">Título hub (HTML)<input type="text" id="st-cuenta-hub-title" value="' + esc(cp.hubTitle || 'Tu <em>perfil</em>') + '"></label>' +
          '<label class="studio-field">Subtítulo hub<textarea id="st-cuenta-hub-sub" rows="2">' + esc(cp.hubSub || '') + '</textarea></label>' +
        '</div></details>' +
        '<details class="studio-card" open><summary>Login & registro — títulos y botones</summary><div class="studio-card-body studio-grid-2">' +
          '<label class="studio-field">Título login<input type="text" id="st-cuenta-login-title" value="' + esc(cp.loginTitle || '') + '"></label>' +
          '<label class="studio-field">Título registro<input type="text" id="st-cuenta-register-title" value="' + esc(cp.registerTitle || '') + '"></label>' +
          '<label class="studio-field">Botón entrar<input type="text" id="st-cuenta-login-submit" value="' + esc(cp.loginSubmit || '') + '"></label>' +
          '<label class="studio-field">Botón crear cuenta<input type="text" id="st-cuenta-register-submit" value="' + esc(cp.registerSubmit || '') + '"></label>' +
          '<label class="studio-field">Skip sin cuenta<input type="text" id="st-cuenta-skip-text" value="' + esc(cp.skipText || '') + '"></label>' +
          '<label class="studio-field">Enlace skip<input type="text" id="st-cuenta-skip-href" value="' + esc(cp.skipHref || 'index.html') + '"></label>' +
        '</div></details>' +
        '<details class="studio-card" open><summary>Campos del formulario</summary><div class="studio-card-body studio-grid-2">' +
          '<label class="studio-field">Label email login<input type="text" id="st-cuenta-login-email" value="' + esc(cp.loginEmail || 'Email') + '"></label>' +
          '<label class="studio-field">Label contraseña login<input type="text" id="st-cuenta-login-password" value="' + esc(cp.loginPassword || 'Contraseña') + '"></label>' +
          '<label class="studio-field">Label apodo registro<input type="text" id="st-cuenta-register-nickname" value="' + esc(cp.registerNickname || 'Apodo camada') + '"></label>' +
          '<label class="studio-field">Label email registro<input type="text" id="st-cuenta-register-email" value="' + esc(cp.registerEmail || 'Email') + '"></label>' +
          '<label class="studio-field">Label contraseña registro<input type="text" id="st-cuenta-register-password" value="' + esc(cp.registerPassword || 'Contraseña') + '"></label>' +
          '<label class="studio-field">Label disciplina registro<input type="text" id="st-cuenta-register-game" value="' + esc(cp.registerGame || 'Disciplina favorita') + '"></label>' +
          '<label class="studio-field">Disciplinas (una por línea)<textarea id="st-cuenta-games" rows="3">' + esc((cp.games || []).join('\n')) + '</textarea></label>' +
        '</div></details>' +
        '<details class="studio-card"><summary>Perfil PRO — avatar, redes & accesos</summary><div class="studio-card-body studio-grid-2">' +
          '<label class="studio-field">Eyebrow identidad<input type="text" id="st-cuenta-profile-id-eyebrow" value="' + esc(cp.profileIdentityEyebrow || '') + '"></label>' +
          '<label class="studio-field">Título identidad (HTML)<input type="text" id="st-cuenta-profile-id-title" value="' + esc(cp.profileIdentityTitle || '') + '"></label>' +
          '<label class="studio-field">Label rol<input type="text" id="st-cuenta-profile-role" value="' + esc(cp.profileRole || '') + '"></label>' +
          '<label class="studio-field">Eyebrow redes<input type="text" id="st-cuenta-profile-social-eyebrow" value="' + esc(cp.profileSocialEyebrow || '') + '"></label>' +
          '<label class="studio-field">Título redes (HTML)<input type="text" id="st-cuenta-profile-social-title" value="' + esc(cp.profileSocialTitle || '') + '"></label>' +
          '<label class="studio-field">Label Instagram<input type="text" id="st-cuenta-profile-instagram" value="' + esc(cp.profileInstagram || '') + '"></label>' +
          '<label class="studio-field">Placeholder Instagram<input type="text" id="st-cuenta-profile-instagram-ph" value="' + esc(cp.profileInstagramPlaceholder || '') + '"></label>' +
          '<label class="studio-field">Label Discord<input type="text" id="st-cuenta-profile-discord" value="' + esc(cp.profileDiscord || '') + '"></label>' +
          '<label class="studio-field">Placeholder Discord<input type="text" id="st-cuenta-profile-discord-ph" value="' + esc(cp.profileDiscordPlaceholder || '') + '"></label>' +
          '<label class="studio-field">Título avatar<input type="text" id="st-cuenta-profile-avatar-title" value="' + esc(cp.profileAvatarTitle || '') + '"></label>' +
          '<label class="studio-field">Botón cambiar foto<input type="text" id="st-cuenta-profile-avatar-change" value="' + esc(cp.profileAvatarChange || '') + '"></label>' +
          '<label class="studio-field">Label URL avatar<input type="text" id="st-cuenta-profile-avatar-url" value="' + esc(cp.profileAvatarUrl || '') + '"></label>' +
          '<label class="studio-field">Botón aplicar URL<input type="text" id="st-cuenta-profile-avatar-apply" value="' + esc(cp.profileAvatarApply || '') + '"></label>' +
          '<label class="studio-field">Botón subir foto<input type="text" id="st-cuenta-profile-avatar-upload" value="' + esc(cp.profileAvatarUpload || '') + '"></label>' +
          '<label class="studio-field">Botón quitar foto<input type="text" id="st-cuenta-profile-avatar-remove" value="' + esc(cp.profileAvatarRemove || '') + '"></label>' +
          '<label class="studio-field">Eyebrow ficha<input type="text" id="st-cuenta-profile-stats-eyebrow" value="' + esc(cp.profileStatsEyebrow || '') + '"></label>' +
          '<label class="studio-field">Título ficha (HTML)<input type="text" id="st-cuenta-profile-stats-title" value="' + esc(cp.profileStatsTitle || '') + '"></label>' +
          '<label class="studio-field">Label «camada desde»<input type="text" id="st-cuenta-profile-member-since" value="' + esc(cp.profileMemberSince || '') + '"></label>' +
          '<label class="studio-field">Nota local (privacidad)<textarea id="st-cuenta-profile-local-note" rows="2">' + esc(cp.profileLocalNote || '') + '</textarea></label>' +
          '<label class="studio-field">Acceso noticias — título<input type="text" id="st-cuenta-quick-news" value="' + esc(cp.quickNews || '') + '"></label>' +
          '<label class="studio-field">Acceso noticias — subtítulo<input type="text" id="st-cuenta-quick-news-sub" value="' + esc(cp.quickNewsSub || '') + '"></label>' +
          '<label class="studio-field">Acceso equipos — título<input type="text" id="st-cuenta-quick-teams" value="' + esc(cp.quickTeams || '') + '"></label>' +
          '<label class="studio-field">Acceso equipos — subtítulo<input type="text" id="st-cuenta-quick-teams-sub" value="' + esc(cp.quickTeamsSub || '') + '"></label>' +
          '<label class="studio-field">Acceso tryouts — título<input type="text" id="st-cuenta-quick-tryouts" value="' + esc(cp.quickTryouts || '') + '"></label>' +
          '<label class="studio-field">Acceso tryouts — subtítulo<input type="text" id="st-cuenta-quick-tryouts-sub" value="' + esc(cp.quickTryoutsSub || '') + '"></label>' +
          '<label class="studio-field">Acceso historia — título<input type="text" id="st-cuenta-quick-history" value="' + esc(cp.quickHistory || '') + '"></label>' +
          '<label class="studio-field">Acceso historia — subtítulo<input type="text" id="st-cuenta-quick-history-sub" value="' + esc(cp.quickHistorySub || '') + '"></label>' +
        '</div></details>' +
        '<details class="studio-card" open><summary>Perfil guardado — textos base</summary><div class="studio-card-body studio-grid-2">' +
          '<label class="studio-field">Eyebrow perfil<input type="text" id="st-cuenta-profile-eyebrow" value="' + esc(cp.profileEyebrow || '') + '"></label>' +
          '<label class="studio-field">Título perfil<input type="text" id="st-cuenta-profile-title" value="' + esc(cp.profileTitle || '') + '"></label>' +
          '<label class="studio-field">Bienvenida ({nickname})<input type="text" id="st-cuenta-profile-welcome" value="' + esc(cp.profileWelcome || 'Hola, {nickname}') + '"></label>' +
          '<label class="studio-field">Label apodo perfil<input type="text" id="st-cuenta-profile-nickname" value="' + esc(cp.profileNickname || 'Apodo') + '"></label>' +
          '<label class="studio-field">Label bio<input type="text" id="st-cuenta-profile-bio" value="' + esc(cp.profileBio || 'Bio') + '"></label>' +
          '<label class="studio-field">Placeholder bio<input type="text" id="st-cuenta-profile-bio-ph" value="' + esc(cp.profileBioPlaceholder || '') + '"></label>' +
          '<label class="studio-field">Label disciplina perfil<input type="text" id="st-cuenta-profile-game" value="' + esc(cp.profileGame || 'Disciplina favorita') + '"></label>' +
          '<label class="studio-field">Label Twitter<input type="text" id="st-cuenta-profile-twitter" value="' + esc(cp.profileTwitter || 'Twitter / X') + '"></label>' +
          '<label class="studio-field">Placeholder Twitter<input type="text" id="st-cuenta-profile-twitter-ph" value="' + esc(cp.profileTwitterPlaceholder || '') + '"></label>' +
          '<label class="studio-field">Guardado OK<input type="text" id="st-cuenta-profile-saved" value="' + esc(cp.profileSaved || '') + '"></label>' +
          '<label class="studio-field">Botón guardar<input type="text" id="st-cuenta-profile-save" value="' + esc(cp.profileSave || '') + '"></label>' +
          '<label class="studio-field">Botón logout<input type="text" id="st-cuenta-profile-logout" value="' + esc(cp.profileLogout || '') + '"></label>' +
        '</div></details>' +
        '<button type="button" class="studio-btn-preview" data-goto-page="cuenta.html">' + pv('Ver cuenta') + '</button>';
    }

    if (id === 'media') {
      var st = data.site || {};
      var fx = st.heroEffects || {};
      h = '<div class="studio-brand-strip">' +
        '<div class="studio-brand-strip-item"><span>Logo club</span><img id="studio-live-logo" src="' + esc(st.logo || 'img/logo.jpg') + '" alt="Logo"></div>' +
        '<div class="studio-brand-strip-item studio-brand-strip-item--wide"><span>Banner hero</span><img id="studio-live-banner" src="' + esc(st.banner || 'img/banner-oficial.png') + '" alt="Banner"></div>' +
        '</div>' +
        '<p class="studio-lead">Imágenes oficiales del club. Cambia la URL, sube un archivo o pulsa <strong>Ver grande</strong> para previsualizar a tamaño completo.</p>' +
        imgField('Banner hero (oficial)', 'st-banner', st.banner || 'img/banner-oficial.png', true) +
        imgField('Logo club', 'st-logo', st.logo || 'img/logo.jpg') +
        '<label class="studio-check"><input type="checkbox" id="st-hero-overlay"' + (st.heroOverlay === true ? ' checked' : '') + '> Activar capa oscura / efectos sobre el banner (desmarcado = imagen más limpia)</label>' +
        '<label class="studio-field">Opacidad del banner visible <output id="st-hero-opacity-out">' + (st.heroImageOpacity != null ? st.heroImageOpacity : 0.5) + '</output><input type="range" id="st-hero-opacity" min="0.15" max="0.72" step="0.03" value="' + (st.heroImageOpacity != null ? st.heroImageOpacity : 0.5) + '"></label>' +
        '<p class="studio-lead" style="margin-top:1rem">Efectos cinematográficos (solo si activaste la capa oscura)</p>' +
        '<div class="studio-fx-grid">' +
          '<label class="studio-check"><input type="checkbox" id="st-fx-kitsune"' + (fx.kitsuneGlow ? ' checked' : '') + '> Resplandor kitsune lateral</label>' +
          '<label class="studio-check"><input type="checkbox" id="st-fx-rays"' + (fx.rays ? ' checked' : '') + '> Rayos de luz</label>' +
          '<label class="studio-check"><input type="checkbox" id="st-fx-floor"' + (fx.floor ? ' checked' : '') + '> Brillo suelo</label>' +
          '<label class="studio-check"><input type="checkbox" id="st-fx-center"' + (fx.centerGlow ? ' checked' : '') + '> Glow central</label>' +
        '</div>' +
        '<button type="button" class="studio-btn-preview" data-preview-block="hero">' + pv('Previsualizar hero en la web') + '</button>';
    }

    if (id === 'hero') {
      var ho = data.home || {};
      h = visPanel('Visibilidad portada', [
        ['hero', 'Hero completo', 'hero'],
        ['heroStats', 'Stats (cifras)', 'heroStats'],
        ['heroCtas', 'Botones del hero', 'heroCtas']
      ], vis) +
      studioHint('Edita el <strong>hero de inicio</strong> (columna izquierda de la portada). Los botones de aquí son distintos del <strong>CTA final</strong> — edítalos en «Títulos de sección» → CTA final.') +
        '<label class="studio-field">Eyebrow<input type="text" id="st-hero-eyebrow" value="' + esc(ho.eyebrow) + '"></label>' +
        '<label class="studio-field">Título (HTML permitido: &lt;em&gt;)<input type="text" id="st-hero-title" value="' + esc(ho.title) + '"></label>' +
        '<label class="studio-field">Lead<textarea id="st-hero-lead" rows="3">' + esc(ho.lead) + '</textarea></label>' +
        '<div class="studio-grid-2">' +
          '<label class="studio-field">Botón 1 texto<input type="text" id="st-cta1t" value="' + esc((ho.ctaPrimary && ho.ctaPrimary.text) || '') + '"></label>' +
          '<label class="studio-field">Botón 1 enlace<input type="text" id="st-cta1h" value="' + esc((ho.ctaPrimary && ho.ctaPrimary.href) || '') + '"></label>' +
          '<label class="studio-field">Botón 2 texto<input type="text" id="st-cta2t" value="' + esc((ho.ctaSecondary && ho.ctaSecondary.text) || '') + '"></label>' +
          '<label class="studio-field">Botón 2 enlace<input type="text" id="st-cta2h" value="' + esc((ho.ctaSecondary && ho.ctaSecondary.href) || '') + '"></label>' +
        '</div>' +
        '<p class="studio-lead" style="margin-top:1rem">Stats hero</p>' +
        (data.stats || []).map(function (s, i) {
          return '<details class="studio-card"><summary>Stat ' + (i+1) + ': ' + esc(s.value) + '</summary><div class="studio-card-body">' +
            '<div class="studio-grid-2"><label class="studio-field">Valor<input type="text" data-stat="' + i + '" data-sf="value" value="' + esc(s.value) + '"></label>' +
            '<label class="studio-field">Etiqueta<input type="text" data-stat="' + i + '" data-sf="label" value="' + esc(s.label) + '"></label></div>' +
            '<label class="studio-check"><input type="checkbox" data-stat="' + i + '" data-sf="hidden"' + (s.hidden ? ' checked' : '') + '> Ocultar stat</label>' +
            itemPv('stat', i, 'Previsualizar stat') +
            ((data.stats || []).length > 1 ? '<button type="button" class="btn btn-ghost btn-sm studio-btn-danger" data-studio-remove="stat" data-index="' + i + '">Eliminar stat</button>' : '') +
          '</div></details>';
        }).join('') +
        '<div class="studio-inline-actions"><button type="button" class="btn btn-ghost btn-sm" data-studio-add="stat">+ Añadir stat</button></div>' +
        '<button type="button" class="studio-btn-preview" data-preview-block="hero">' + pv('Previsualizar') + '</button>';
    }

    if (id === 'navmenu') {
      var navItems = data.nav || [];
      h = visPanel('Visibilidad', [['siteHeader', 'Cabecera / menú', 'siteHeader']], vis) +
      navMockHtml(data) +
        '<p class="studio-lead">Enlaces del menú principal. Marca «CTA» para el botón naranja. Los cambios se ven arriba en la vista previa.</p>' +
        '<div class="studio-inline-actions"><button type="button" class="btn btn-ghost btn-sm" data-studio-add="nav">+ Añadir enlace</button></div>';
      navItems.forEach(function (item, i) {
        h += '<details class="studio-card"' + (i === 0 ? ' open' : '') + '><summary>' + esc(item.label) + '</summary><div class="studio-card-body">' +
          '<label class="studio-field">Texto del enlace<input type="text" data-nav="' + i + '" data-sf="label" value="' + esc(item.label) + '" data-nav-live="' + i + '"></label>' +
          '<label class="studio-field">Página de destino<input type="text" data-nav="' + i + '" data-sf="href" value="' + esc(item.href) + '" placeholder="noticias.html"></label>' +
          '<label class="studio-check"><input type="checkbox" data-nav="' + i + '" data-sf="cta"' + (item.cta ? ' checked' : '') + '> Mostrar como botón naranja (CTA)</label>' +
          '<label class="studio-check"><input type="checkbox" data-nav="' + i + '" data-sf="hidden"' + (item.hidden ? ' checked' : '') + '> Ocultar enlace (sin borrar)</label>' +
          '<div class="studio-inline-actions">' + itemPv('nav', i, 'Vista previa') +
          (navItems.length > 2 ? '<button type="button" class="btn btn-ghost btn-sm studio-btn-danger" data-studio-remove="nav" data-index="' + i + '">Eliminar enlace</button>' : '') +
          '</div></div></details>';
      });
    }

    if (id === 'footer') {
      var ft = data.footer || {};
      var ct = (data.site && data.site.contact) || {};
      var soc = ct.social || {};
      h = visPanel('Visibilidad', [['siteFooter', 'Pie de página', 'siteFooter']], vis) +
      studioHint('Solo el <strong>pie global</strong> (todas las páginas). El formulario de contacto está en «<button type="button" class="studio-inline-link" data-goto="contact">Página contacto</button>».') +
        '<label class="studio-field">Frase del pie de página<textarea id="st-footer-tagline" rows="2">' + esc(ft.tagline || '') + '</textarea></label>' +
        '<p class="studio-lead" style="margin-top:1rem">Email y redes (footer + bloque info en contacto)</p>' +
        '<label class="studio-field">Email del club<input type="email" id="st-contact-email" value="' + esc(ct.email || 'lyokfox@gmail.com') + '"></label>' +
        '<label class="studio-field">Enlace X / Twitter<input type="url" id="st-social-twitter" value="' + esc(soc.twitter || '') + '"></label>' +
        '<label class="studio-field">Enlace Instagram<input type="url" id="st-social-instagram" value="' + esc(soc.instagram || '') + '"></label>' +
        '<label class="studio-field">Enlace comunidad fans<input type="url" id="st-social-fans" value="' + esc(soc.fans || '') + '"></label>' +
        '<button type="button" class="studio-btn-preview" data-preview-block="site-footer">' + pv('Previsualizar pie') + '</button>';
    }

    if (id === 'contact') {
      var cp2 = data.contactPage || {};
      h = visPanel('Visibilidad contacto', [
        ['pageHero', 'Hero página', 'pageHero'],
        ['contactPage', 'Bloque contacto', 'contactPage'],
        ['contactInfo', 'Columna información', 'contactInfo'],
        ['contactForm', 'Formulario', 'contactForm'],
        ['patrocinio', 'Partnerships', 'patrocinio']
      ], vis) +
      studioHint('Todo lo de <strong>contactanos.html</strong>: bloque información, formulario y placeholders. Los planes partnership se editan en «Partnerships» (misma sección #patrocinio).') +
        '<details class="studio-card" open><summary>Bloque información (columna izquierda)</summary><div class="studio-card-body">' +
          '<label class="studio-field">Título bloque info<input type="text" id="st-contact-info-title" value="' + esc(cp2.infoTitle || 'Información') + '"></label>' +
          '<label class="studio-field">Texto introductorio<textarea id="st-contact-intro" rows="3">' + esc(cp2.intro || '') + '</textarea></label>' +
          '<button type="button" class="studio-btn-preview" data-goto-page="contactanos.html">' + pv('Ver página contacto') + '</button>' +
        '</div></details>' +
        '<details class="studio-card" open><summary>Formulario — textos y campos</summary><div class="studio-card-body">' +
          '<label class="studio-field">Título formulario<input type="text" id="st-contact-form-title" value="' + esc(cp2.formTitle || 'Escríbenos') + '"></label>' +
          '<div class="studio-grid-2">' +
            '<label class="studio-field">Label nombre<input type="text" id="st-contact-lbl-nombre" value="' + esc((cp2.formLabels && cp2.formLabels.nombre) || 'Nombre') + '"></label>' +
            '<label class="studio-field">Label email<input type="text" id="st-contact-lbl-email" value="' + esc((cp2.formLabels && cp2.formLabels.email) || 'Email') + '"></label>' +
            '<label class="studio-field">Label motivo<input type="text" id="st-contact-lbl-tipo" value="' + esc((cp2.formLabels && cp2.formLabels.tipo) || 'Motivo') + '"></label>' +
            '<label class="studio-field">Label mensaje<input type="text" id="st-contact-lbl-mensaje" value="' + esc((cp2.formLabels && cp2.formLabels.mensaje) || 'Mensaje') + '"></label>' +
            '<label class="studio-field">Texto botón enviar<input type="text" id="st-contact-lbl-submit" value="' + esc((cp2.formLabels && cp2.formLabels.submit) || 'Enviar mensaje') + '"></label>' +
          '</div>' +
          '<p class="studio-lead">Placeholders de los inputs</p>' +
          '<div class="studio-grid-2">' +
            '<label class="studio-field">Placeholder nombre<input type="text" id="st-contact-ph-nombre" value="' + esc((cp2.formPlaceholders && cp2.formPlaceholders.nombre) || 'Tu nombre') + '"></label>' +
            '<label class="studio-field">Placeholder email<input type="text" id="st-contact-ph-email" value="' + esc((cp2.formPlaceholders && cp2.formPlaceholders.email) || 'tu@email.com') + '"></label>' +
            '<label class="studio-field">Placeholder mensaje<input type="text" id="st-contact-ph-mensaje" value="' + esc((cp2.formPlaceholders && cp2.formPlaceholders.mensaje) || 'Cuéntanos en qué podemos ayudarte…') + '"></label>' +
          '</div>' +
          '<label class="studio-field">Nota bajo el formulario<input type="text" id="st-contact-form-note" value="' + esc(cp2.formNote || '') + '"></label>' +
          '<label class="studio-field">Mensaje al enviar (éxito)<input type="text" id="st-contact-form-success" value="' + esc(cp2.formSuccess || '') + '"></label>' +
          '<p class="studio-lead">Opciones del desplegable «Motivo» (valor|etiqueta, una por línea)</p>' +
          '<textarea id="st-contact-form-options" rows="4">' + esc((cp2.formOptions || []).map(function (o) { return o.value + '|' + o.label; }).join('\n')) + '</textarea>' +
        '</div></details>';
    }

    if (id === 'pagestyles') {
      var pStyles = data.pageStyles || {};
      h = studioHint('Control visual <strong>por página</strong>: banner del hero, imagen de fondo, escala de títulos y ritmo vertical. Vacío = usa el banner global de «Banner & logo».') +
        META_PAGES.map(function (mp) {
          var ps = pStyles[mp.key] || {};
          return '<details class="studio-card"><summary>' + mp.label + ' <em class="studio-card-key">' + mp.file + '</em></summary><div class="studio-card-body">' +
            imgField('Banner hero (vacío = global)', 'st-pstyle-banner-' + mp.key, ps.banner || '', true) +
            rangeField('Opacidad banner (0–1)', 'st-pstyle-banner-op-' + mp.key, ps.bannerOpacity != null && ps.bannerOpacity !== '' ? ps.bannerOpacity : 0.5, 0.1, 1, 0.05) +
            '<label class="studio-check"><input type="checkbox" id="st-pstyle-hero-bg-' + mp.key + '"' + (ps.showHeroBanner ? ' checked' : '') + '> Mostrar banner detrás del hero (páginas interiores)</label>' +
            '<p class="studio-lead">Escala & ritmo</p>' +
            '<div class="studio-grid-2">' +
              rangeField('Tamaño título hero (×)', 'st-pstyle-title-' + mp.key, ps.titleScale != null ? ps.titleScale : 1, 0.75, 1.35, 0.05) +
              rangeField('Tamaño lead (×)', 'st-pstyle-lead-' + mp.key, ps.leadScale != null ? ps.leadScale : 1, 0.8, 1.3, 0.05) +
              rangeField('Espaciado bloques (×)', 'st-pstyle-gap-' + mp.key, ps.blockGap != null ? ps.blockGap : 1, 0.7, 1.6, 0.05) +
            '</div>' +
            '<p class="studio-lead">Fondo de página</p>' +
            imgField('Imagen fondo página', 'st-pstyle-bg-' + mp.key, ps.bgImage || '', true) +
            rangeField('Opacidad fondo (0–0.5)', 'st-pstyle-bg-op-' + mp.key, ps.bgOpacity != null ? ps.bgOpacity : 0.1, 0, 0.5, 0.02) +
            '<button type="button" class="studio-btn-preview" data-goto-page="' + mp.file + '">' + pv('Abrir ' + mp.label) + '</button>' +
          '</div></details>';
        }).join('') +
        '<button type="button" class="studio-btn-preview" id="st-theme-live">' + pv('Ver cambios en la web') + '</button>';
    }

    if (id === 'pages') {
      var pgs = data.pages || {};
      h = visPanel('Visibilidad', [['pageHero', 'Hero de subpáginas', 'pageHero']], vis) +
      studioHint('Hero visible de cada subpágina (eyebrow + título + lead). El <strong>&lt;title&gt;</strong> del navegador está en «SEO & meta tags». Los <strong>fondos, banner y escala</strong> están en «<button type="button" class="studio-inline-link" data-goto="pagestyles">Fondos & páginas</button>».') +
        Object.keys(pgs).map(function (key) {
        var p = pgs[key];
        var label = PAGE_LABELS[key] || key;
        var pageFile = key === 'contacto' ? 'contactanos.html' : key + '.html';
        return '<details class="studio-card"><summary>' + esc(label) + ' <em class="studio-card-key">' + key + '</em></summary><div class="studio-card-body">' +
          '<label class="studio-field">Eyebrow<input type="text" data-page-hero="' + key + '" data-sf="eyebrow" value="' + esc(p.eyebrow) + '"></label>' +
          '<label class="studio-field">Título (HTML: &lt;em&gt;)<input type="text" data-page-hero="' + key + '" data-sf="title" value="' + esc(p.title) + '"></label>' +
          '<label class="studio-field">Lead<textarea data-page-hero="' + key + '" data-sf="lead" rows="2">' + esc(p.lead) + '</textarea></label>' +
          itemPv('page', key, 'Previsualizar hero') +
          '<button type="button" class="studio-btn-preview" data-goto-page="' + pageFile + '">' + pv('Abrir ' + label) + '</button>' +
        '</div></details>';
      }).join('');
    }

    if (id === 'ticker') {
      var hoTk = data.home || {};
      h = visPanel('Visibilidad', [
        ['ticker', 'Ticker cabecera', 'ticker'],
        ['brands', 'Franja ligas / marcas', 'brands']
      ], vis) +
      studioHint('El <strong>ticker</strong> es la franja de avisos bajo el menú. Las <strong>ligas</strong> son el carrusel de logos justo debajo.') +
        '<label class="studio-field">Ticker (una línea = un aviso)<textarea id="st-ticker" rows="6">' + esc((data.ticker || []).join('\n')) + '</textarea></label>' +
        '<label class="studio-field">Título franja ligas<input type="text" id="st-brands-label" value="' + esc(hoTk.brandsLabel || 'Ligas & circuitos oficiales') + '"></label>' +
        '<p class="studio-lead" style="margin-top:1rem">Ligas / torneos — nombre + logo en la franja</p>';
      (data.brands || []).forEach(function (b, i) {
        var name = typeof b === 'string' ? b : (b.name || '');
        var logo = typeof b === 'object' && b ? (b.logo || '') : '';
        h += '<details class="studio-card"' + (i === 0 ? ' open' : '') + '><summary>' + esc(name || ('Marca ' + (i + 1))) + '</summary><div class="studio-card-body">' +
          '<label class="studio-field">Nombre<input type="text" data-brand="' + i + '" data-sf="name" value="' + esc(name) + '"></label>' +
          imgField('Logo liga / torneo', 'st-brand-logo-' + i, logo, false) +
          itemPv('brand', i, 'Ver en franja') +
        '</div></details>';
      });
      h += '<div class="studio-inline-actions">' +
        '<button type="button" class="btn btn-ghost btn-sm" data-studio-add="brand">+ Liga/torneo</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-studio-add="tickerline">+ Línea ticker</button></div>' +
        '<button type="button" class="studio-btn-preview" data-preview-block="ticker">' + pv('Previsualizar ticker') + '</button>' +
        '<button type="button" class="studio-btn-preview" data-preview-block="brands">' + pv('Previsualizar franja marcas') + '</button>';
    }

    if (id === 'match') {
      var m = data.nextMatch || {};
      var mlinks = m.links || {};
      var lx = mlinks.x || { text: 'Seguir en X →', href: 'https://x.com/LyokFox_' };
      var lcal = mlinks.calendar || { text: 'Ver calendario completo →', href: 'index.html#calendario' };
      h = visPanel('Visibilidad partido', [
        ['matchPanel', 'Panel en hero', 'matchPanel'],
        ['matchStrip', 'Franja matchday', 'matchStrip']
      ], vis) +
      studioHint('Alimenta el <strong>panel del hero</strong> y la <strong>franja matchday</strong> (#matchStrip). Mismos datos en ambos sitios.') +
        '<div class="studio-grid-2">' +
        '<label class="studio-field">Etiqueta<input type="text" id="st-match-label" value="' + esc(m.label) + '"></label>' +
        '<label class="studio-field">Local<input type="text" id="st-match-home" value="' + esc(m.home) + '"></label>' +
        '<label class="studio-field">Rival<input type="text" id="st-match-away" value="' + esc(m.away) + '"></label>' +
        '<label class="studio-field">Liga / torneo<input type="text" id="st-match-league" value="' + esc(m.league) + '"></label>' +
        '<label class="studio-field">Fecha<input type="text" id="st-match-date" value="' + esc(m.date) + '"></label>' +
        '<label class="studio-field">Hora<input type="text" id="st-match-time" value="' + esc(m.time) + '"></label>' +
        '<label class="studio-field">Estado<input type="text" id="st-match-status" value="' + esc(m.status) + '"></label>' +
        '</div>' +
        imgField('Logo LyokFox (local)', 'st-match-home-logo', m.homeLogo || (data.site && data.site.logo) || 'img/logo.jpg', false) +
        imgField('Logo rival', 'st-match-away-logo', m.awayLogo || '', false) +
        imgField('Logo torneo / liga', 'st-match-league-logo', m.leagueLogo || '', false) +
        '<p class="studio-lead">Enlaces del panel partido</p>' +
        '<div class="studio-grid-2">' +
          '<label class="studio-field">Texto enlace X<input type="text" id="st-match-link-x-text" value="' + esc(lx.text) + '"></label>' +
          '<label class="studio-field">URL enlace X<input type="text" id="st-match-link-x-href" value="' + esc(lx.href) + '"></label>' +
          '<label class="studio-field">Texto enlace calendario<input type="text" id="st-match-link-cal-text" value="' + esc(lcal.text) + '"></label>' +
          '<label class="studio-field">URL enlace calendario<input type="text" id="st-match-link-cal-href" value="' + esc(lcal.href) + '"></label>' +
        '</div>' +
        itemPv('match', null, 'Previsualizar partido') +
        '<button type="button" class="studio-btn-preview" data-preview-block="matchPanel">' + pv('Ver panel en inicio') + '</button>' +
        '<button type="button" class="studio-btn-preview" data-preview-block="matchStrip">' + pv('Ver franja matchday') + '</button>';
    }

    if (id === 'sections') {
      var sec = (data.home && data.home.sections) || {};
      h = studioHint('Títulos de cada bloque del inicio. Puedes <strong>ocultar solo el título</strong> o la <strong>sección entera</strong> sin borrar contenido.') +
      ['spotlight', 'disciplines', 'schedule', 'sponsor', 'seo', 'cta', 'homeNews'].map(function (k) {
        var meta = SECTION_LABELS[k] || { label: k, block: k, hint: '' };
        var s = sec[k] || {};
        var blockId = meta.block;
        var secHeadKey = 'secHead-' + k;
        var out = '<details class="studio-card" open><summary>' + esc(meta.label) + ' <em class="studio-card-key">#' + blockId + '</em></summary><div class="studio-card-body">' +
          visRow(secHeadKey, vis, 'Mostrar título (eyebrow + cabecera)', secHeadKey) +
          visRow(blockId, vis, 'Mostrar sección completa', blockId) +
          (meta.hint ? '<p class="studio-lead">' + meta.hint + '</p>' : '') +
          '<label class="studio-field">Eyebrow<input type="text" data-sec="' + k + '" data-sf="eyebrow" value="' + esc(s.eyebrow) + '"></label>' +
          '<label class="studio-field">Título<input type="text" data-sec="' + k + '" data-sf="title" value="' + esc(s.title) + '"></label>' +
          '<label class="studio-field">Subtítulo<textarea data-sec="' + k + '" data-sf="sub" rows="2">' + esc(s.sub) + '</textarea></label>' +
          '<button type="button" class="studio-btn-preview" data-preview-block="' + blockId + '">' + pv('Previsualizar') + '</button>' +
        '</div></details>';
        if (k === 'cta') {
          var btns = (data.home && data.home.ctaButtons) || {};
          out += '<div class="studio-grid-2" style="margin-top:0.5rem">' +
            '<label class="studio-field">Botón CTA 1 texto<input type="text" id="st-cta-btn1t" value="' + esc((btns.primary && btns.primary.text) || '') + '"></label>' +
            '<label class="studio-field">Botón CTA 1 enlace<input type="text" id="st-cta-btn1h" value="' + esc((btns.primary && btns.primary.href) || '') + '"></label>' +
            '<label class="studio-field">Botón CTA 2 texto<input type="text" id="st-cta-btn2t" value="' + esc((btns.secondary && btns.secondary.text) || '') + '"></label>' +
            '<label class="studio-field">Botón CTA 2 enlace<input type="text" id="st-cta-btn2h" value="' + esc((btns.secondary && btns.secondary.href) || '') + '"></label>' +
          '</div>';
        }
        return out;
      }).join('') +
      (function () {
        var teaser = (data.home && data.home.newsTeaser) || {};
        return '<details class="studio-card"><summary>Enlace «Ver todas las noticias»</summary><div class="studio-card-body studio-grid-2">' +
          '<label class="studio-field">Texto botón<input type="text" id="st-home-news-more-text" value="' + esc(teaser.moreText || 'Ver todas las noticias') + '"></label>' +
          '<label class="studio-field">Enlace<input type="text" id="st-home-news-more-href" value="' + esc(teaser.moreHref || 'noticias.html') + '"></label>' +
          '<button type="button" class="studio-btn-preview" data-preview-block="homeNews">' + pv('Previsualizar teaser') + '</button>' +
        '</div></details>';
      })();
    }

    if (id === 'spotlight') {
      h = visPanel('Visibilidad', [
        ['secHead-spotlight', 'Título de sección', 'secHead-spotlight'],
        ['spotlight', 'Sección completa', 'spotlight']
      ], vis) +
      studioHint('Las <strong>3 cards</strong> bajo el hero. El título de la sección está en «Títulos de sección» → Accesos rápidos.') +
      (data.spotlight || []).map(function (s, i) {
        return '<details class="studio-card"' + (i === 0 ? ' open' : '') + '><summary>Card ' + (i+1) + ': ' + esc(s.title) + '</summary><div class="studio-card-body">' +
          imgField('Imagen card (opcional)', 'st-spot-img-' + i, s.image || '', false) +
          '<label class="studio-field">Número<input type="text" data-spot="' + i + '" data-sf="num" value="' + esc(s.num) + '"></label>' +
          '<label class="studio-field">Título<input type="text" data-spot="' + i + '" data-sf="title" value="' + esc(s.title) + '"></label>' +
          '<label class="studio-field">Texto<textarea data-spot="' + i + '" data-sf="text" rows="2">' + esc(s.text) + '</textarea></label>' +
          '<label class="studio-field">Enlace<input type="text" data-spot="' + i + '" data-sf="href" value="' + esc(s.href) + '"></label>' +
          '<label class="studio-check"><input type="checkbox" data-spot="' + i + '" data-sf="accent"' + (s.accent ? ' checked' : '') + '> Destacado (acento naranja)</label>' +
          '<div class="studio-inline-actions">' + itemPv('spot', i, 'Previsualizar card') +
          '<button type="button" class="btn btn-ghost btn-sm studio-btn-danger" data-studio-remove="spot" data-index="' + i + '">Eliminar</button></div>' +
        '</div></details>';
      }).join('') +
        '<div class="studio-inline-actions"><button type="button" class="btn btn-ghost btn-sm" data-studio-add="spot">+ Acceso rápido</button></div>' +
        '<button type="button" class="studio-btn-preview" data-preview-block="spotlight">' + pv('Previsualizar sección') + '</button>';
    }

    if (id === 'schedule') {
      h = visPanel('Visibilidad', [
        ['secHead-schedule', 'Título calendario', 'secHead-schedule'],
        ['calendario', 'Sección calendario', 'calendario']
      ], vis) +
      studioHint('Partidos en <strong>#calendario</strong> (inicio). Distinto del «Partido destacado» del hero — ese usa un solo duelo.') +
      (data.schedule || []).map(function (s, i) {
        return '<details class="studio-card"><summary>Partido ' + (i+1) + ': ' + esc(s.vs) + '</summary><div class="studio-card-body">' +
          '<label class="studio-field">Juego<input type="text" data-sched="' + i + '" data-sf="game" value="' + esc(s.game) + '"></label>' +
          '<label class="studio-field">VS<input type="text" data-sched="' + i + '" data-sf="vs" value="' + esc(s.vs) + '"></label>' +
          '<label class="studio-field">Liga / torneo<input type="text" data-sched="' + i + '" data-sf="league" value="' + esc(s.league) + '"></label>' +
          '<label class="studio-field">Cuándo<input type="text" data-sched="' + i + '" data-sf="when" value="' + esc(s.when) + '"></label>' +
          imgField('Icono juego', 'st-sched-game-' + i, s.gameIcon || '', false) +
          imgField('Logo LyokFox', 'st-sched-home-' + i, s.homeLogo || (data.site && data.site.logo) || 'img/logo.jpg', false) +
          imgField('Logo rival', 'st-sched-away-' + i, s.awayLogo || '', false) +
          imgField('Logo torneo', 'st-sched-league-' + i, s.leagueLogo || '', false) +
          '<label class="studio-check"><input type="checkbox" data-sched="' + i + '" data-sf="live"' + (s.live ? ' checked' : '') + '> EN VIVO</label>' +
          itemPv('schedule', i, 'Previsualizar partido') +
          '<button type="button" class="btn btn-ghost btn-sm" data-studio-dup="schedule" data-index="' + i + '">Duplicar</button>' +
          '<button type="button" class="btn btn-ghost btn-sm studio-btn-danger" data-studio-remove="schedule" data-index="' + i + '">Eliminar</button>' +
        '</div></details>';
      }).join('') +
        '<div class="studio-inline-actions"><button type="button" class="btn btn-ghost btn-sm" data-studio-add="schedule">+ Partido</button></div>' +
        '<button type="button" class="studio-btn-preview" data-preview-block="calendario">' + pv('Previsualizar calendario') + '</button>';
    }

    if (id === 'sponsor') {
      var sui = data.sponsorUi || {};
      h = visPanel('Visibilidad', [
        ['secHead-sponsor', 'Título partnerships', 'secHead-sponsor'],
        ['patrocinio', 'Sección partnerships', 'patrocinio']
      ], vis) +
      studioHint('Planes visibles en <strong>inicio</strong> y <strong>contacto</strong> (#patrocinio). Los títulos de sección están en «Títulos de sección» → Partnerships.') +
        '<details class="studio-card" open><summary>Textos de botones partnership</summary><div class="studio-card-body studio-grid-2">' +
          '<label class="studio-field">Texto botón en cada plan<input type="text" id="st-sponsor-tier-cta" value="' + esc(sui.tierCta || 'Solicitar') + '"></label>' +
          '<label class="studio-field">Texto botón dossier (dorado)<input type="text" id="st-sponsor-dossier-cta" value="' + esc(sui.dossierCta || 'Solicitar dossier completo') + '"></label>' +
          '<label class="studio-field">Enlace dossier (inicio)<input type="text" id="st-sponsor-dossier-href" value="' + esc(sui.dossierHref || 'contactanos.html?tipo=patrocinio') + '"></label>' +
        '</div></details>';
      (data.sponsorTiers || []).forEach(function (t, i) {
        h += '<details class="studio-card"' + (t.featured ? ' open' : '') + '><summary>' + esc(t.name) + ' — ' + esc(t.price) + '</summary><div class="studio-card-body">' +
          imgField('Logo partner (opcional)', 'st-tier-logo-' + i, t.logo || '', false) +
          '<label class="studio-field">Nombre<input type="text" data-tier="' + i + '" data-sf="name" value="' + esc(t.name) + '"></label>' +
          '<label class="studio-field">Precio<input type="text" data-tier="' + i + '" data-sf="price" value="' + esc(t.price) + '"></label>' +
          '<label class="studio-field">Beneficios (uno por línea)<textarea data-tier="' + i + '" data-sf="perks" rows="4">' + esc((t.perks || []).join('\n')) + '</textarea></label>' +
          '<label class="studio-check"><input type="checkbox" data-tier="' + i + '" data-sf="featured"' + (t.featured ? ' checked' : '') + '> Plan destacado</label>' +
          '<div class="studio-inline-actions">' + itemPv('tier', i, 'Previsualizar plan') +
          '<button type="button" class="btn btn-ghost btn-sm studio-btn-danger" data-studio-remove="tier" data-index="' + i + '">Eliminar</button></div>' +
        '</div></details>';
      });
      h += '<div class="studio-inline-actions"><button type="button" class="btn btn-ghost btn-sm" data-studio-add="tier">+ Plan partnership</button></div>' +
        '<button type="button" class="studio-btn-preview" data-preview-block="patrocinio">' + pv('Previsualizar') + '</button>';
    }

    if (id === 'seo') {
      var ho2 = data.home || {};
      h = visPanel('Visibilidad', [
        ['secHead-seo', 'Título sobre LyokFox', 'secHead-seo'],
        ['seoText', 'Texto SEO', 'seoText'],
        ['seoFaq', 'FAQ', 'seoFaq'],
        ['seo', 'Bloque SEO completo', 'seo']
      ], vis) +
      studioHint('Texto largo + FAQ en <strong>#sobre-lyokfox</strong>. El título de sección está en «Títulos de sección» → Sobre LyokFox.') +
        '<label class="studio-field">Párrafos SEO (uno por línea)<textarea id="st-seo-text" rows="5">' + esc((ho2.seoText || []).join('\n')) + '</textarea></label>' +
        '<label class="studio-field">Keywords (una por línea)<textarea id="st-seo-kw" rows="3">' + esc((ho2.seoKeywords || []).join('\n')) + '</textarea></label>' +
        '<p class="studio-lead">FAQ — preguntas frecuentes</p>' +
        '<div class="studio-inline-actions"><button type="button" class="btn btn-ghost btn-sm" data-studio-add="faq">+ Añadir pregunta FAQ</button></div>' +
        (ho2.faq || []).map(function (f, i) {
          return '<details class="studio-card"><summary>' + esc(f.q) + '</summary><div class="studio-card-body">' +
            '<label class="studio-field">Pregunta<input type="text" data-faq="' + i + '" data-sf="q" value="' + esc(f.q) + '"></label>' +
            '<label class="studio-field">Respuesta<textarea data-faq="' + i + '" data-sf="a" rows="2">' + esc(f.a) + '</textarea></label>' +
            '<div class="studio-inline-actions">' + itemPv('faq', i, 'Previsualizar FAQ') +
            '<button type="button" class="btn btn-ghost btn-sm studio-btn-danger" data-studio-remove="faq" data-index="' + i + '">Eliminar</button></div>' +
          '</div></details>';
        }).join('') +
        '<button type="button" class="studio-btn-preview" data-preview-block="seo">' + pv('Previsualizar SEO') + '</button>';
    }

    if (id === 'news') {
      var nw = data.news || {};
      var nsh = nw.sectionHead || {};
      h = visPanel('Visibilidad', [
        ['noticias', 'Feed noticias', 'noticias'],
        ['newsBreaking', 'Franja última hora', 'newsBreaking']
      ], vis) +
      studioHint('Artículos del feed en <strong>noticias.html</strong>. Hero → «Héroes de páginas». Fondos → «Fondos & páginas».') +
        '<details class="studio-card" open><summary>Cabecera del feed & breaking</summary><div class="studio-card-body">' +
          '<label class="studio-field">Franja última hora (vacío = oculta)<textarea id="st-news-breaking" rows="2">' + esc(nw.breaking || '') + '</textarea></label>' +
          '<label class="studio-field">Label breaking<input type="text" id="st-news-breaking-label" value="' + esc(nw.breakingLabel || 'Última hora') + '"></label>' +
          '<p class="studio-lead">Título sobre el grid de noticias</p>' +
          '<div class="studio-grid-2">' +
            '<label class="studio-field">Eyebrow<input type="text" id="st-news-sec-eyebrow" value="' + esc(nsh.eyebrow || '') + '"></label>' +
            '<label class="studio-field">Título (HTML &lt;em&gt;)<input type="text" id="st-news-sec-title" value="' + esc(nsh.title || '') + '"></label>' +
            '<label class="studio-field studio-field--full">Subtítulo<textarea id="st-news-sec-sub" rows="2">' + esc(nsh.sub || '') + '</textarea></label>' +
          '</div>' +
          '<button type="button" class="studio-btn-preview" data-preview-block="newsBreaking">' + pv('Previsualizar breaking') + '</button>' +
        '</div></details>' +
        '<div class="studio-inline-actions"><button type="button" class="btn btn-primary btn-sm" data-studio-add="news">+ Nueva noticia</button></div>';
      (data.news && data.news.articles || []).forEach(function (a, i) {
        var catOpts = NEWS_CATS.map(function (c) {
          return '<option value="' + c.id + '"' + (a.cat === c.id ? ' selected' : '') + '>' + c.label + '</option>';
        }).join('');
        h += '<details class="studio-card"' + (i < 2 ? ' open' : '') + '><summary>' + esc(a.title) + '</summary><div class="studio-card-body">' +
          imgField('Imagen artículo', 'st-news-img-' + i, a.image || 'img/banner-oficial.png', true) +
          '<label class="studio-field">Título<input type="text" data-news="' + i + '" data-sf="title" value="' + esc(a.title) + '"></label>' +
          '<label class="studio-field">Extracto<textarea data-news="' + i + '" data-sf="excerpt" rows="2">' + esc(a.excerpt) + '</textarea></label>' +
          '<label class="studio-field">Cuerpo (párrafos, uno por línea)<textarea data-news="' + i + '" data-sf="body" rows="4">' + esc((a.body || []).join('\n')) + '</textarea></label>' +
          '<div class="studio-grid-2">' +
            '<label class="studio-field">Fecha<input type="text" data-news="' + i + '" data-sf="date" value="' + esc(a.date) + '"></label>' +
            '<label class="studio-field">Etiqueta<input type="text" data-news="' + i + '" data-sf="tag" value="' + esc(a.tag) + '"></label>' +
            '<label class="studio-field">Categoría<select data-news="' + i + '" data-sf="cat">' + catOpts + '</select></label>' +
            '<label class="studio-field">ID único<input type="text" data-news="' + i + '" data-sf="id" value="' + esc(a.id || '') + '"></label>' +
          '</div>' +
          '<label class="studio-check"><input type="checkbox" data-news="' + i + '" data-sf="featured"' + (a.featured ? ' checked' : '') + '> Destacada</label>' +
          '<label class="studio-check"><input type="checkbox" data-news="' + i + '" data-sf="hidden"' + (a.hidden ? ' checked' : '') + '> Ocultar artículo</label>' +
          '<div class="studio-inline-actions">' + itemPv('news', i, 'Previsualizar noticia') +
          '<button type="button" class="btn btn-ghost btn-sm" data-studio-dup="news" data-index="' + i + '">Duplicar</button>' +
          '<button type="button" class="btn btn-ghost btn-sm studio-btn-danger" data-studio-remove="news" data-index="' + i + '">Eliminar</button></div>' +
        '</div></details>';
      });
      h += '<button type="button" class="studio-btn-preview" data-goto-page="noticias.html">' + pv('Ver feed noticias') + '</button>';
    }

    if (id === 'history') {
      var hist = data.history || {};
      h = visPanel('Visibilidad', [
        ['historia', 'Página historia', 'historia'],
        ['historyStory', 'Bloques narrativa', 'historyStory']
      ], vis) +
      studioHint('Contenido de <strong>historia.html</strong>. El hero está en «Héroes de páginas» → historia.') +
        '<label class="studio-field">Intro título (HTML &lt;em&gt;)<input type="text" id="st-hist-title" value="' + esc((hist.intro && hist.intro.title) || '') + '"></label>' +
        '<label class="studio-field">Intro lead<textarea id="st-hist-lead" rows="3">' + esc((hist.intro && hist.intro.lead) || '') + '</textarea></label>' +
        '<p class="studio-lead">Stats origen</p>' +
        ((hist.intro && hist.intro.stats) || []).map(function (s, i) {
          return '<div class="studio-grid-2"><label class="studio-field">Stat ' + (i + 1) + ' valor<input type="text" data-hist-stat="' + i + '" data-sf="value" value="' + esc(s.value) + '"></label>' +
            '<label class="studio-field">Stat ' + (i + 1) + ' etiqueta<input type="text" data-hist-stat="' + i + '" data-sf="label" value="' + esc(s.label) + '"></label></div>';
        }).join('') +
        '<p class="studio-lead">Bloques narrativa (blog)</p>' +
        '<div class="studio-inline-actions"><button type="button" class="btn btn-primary btn-sm" data-studio-add="story">+ Añadir bloque</button></div>' +
        (hist.storyBlocks || [
          { layout: 'image-left', eyebrow: '', title: '', text: '', image: '' },
          { layout: 'image-right', eyebrow: '', title: '', text: '', image: '' },
          { layout: 'center', eyebrow: '', title: '', text: '', image: '' }
        ]).map(function (b, i) {
          var layoutLabel = b.layout === 'image-right' ? 'Texto + imagen' : (b.layout === 'center' ? 'Texto centrado' : 'Imagen + texto');
          var st = b.style || {};
          var layoutOpts = ['image-left', 'image-right', 'center'].map(function (lv) {
            var lb = lv === 'image-right' ? 'Texto + imagen' : (lv === 'center' ? 'Centrado' : 'Imagen + texto');
            return '<option value="' + lv + '"' + ((b.layout || 'image-left') === lv ? ' selected' : '') + '>' + lb + '</option>';
          }).join('');
          var widthOpts = ['normal', 'wide', 'full'].map(function (wv) {
            var wl = wv === 'wide' ? 'Ancho (LyokFox hoy)' : (wv === 'full' ? 'Pantalla completa' : 'Normal');
            return '<option value="' + wv + '"' + ((st.width || (b.wide ? 'wide' : 'normal')) === wv ? ' selected' : '') + '>' + wl + '</option>';
          }).join('');
          return '<details class="studio-card"' + (i < 2 ? ' open' : '') + '><summary>Bloque ' + (i + 1) + ' — ' + layoutLabel + '</summary><div class="studio-card-body">' +
            '<label class="studio-field">Disposición<select data-story="' + i + '" data-sf="layout">' + layoutOpts + '</select></label>' +
            (b.layout !== 'center' ? imgField('Imagen', 'st-story-img-' + i, b.image || '', true) : '') +
            (b.layout === 'center' ? imgField('Imagen de fondo (opcional)', 'st-story-bg-' + i, b.bgImage || '', true) : '') +
            '<label class="studio-field">Eyebrow<input type="text" data-story="' + i + '" data-sf="eyebrow" value="' + esc(b.eyebrow || '') + '"></label>' +
            '<label class="studio-field">Título (HTML &lt;em&gt;)<input type="text" data-story="' + i + '" data-sf="title" value="' + esc(b.title || '') + '"></label>' +
            '<label class="studio-field">Texto (párrafos separados por línea en blanco)<textarea data-story="' + i + '" data-sf="text" rows="6">' + esc(b.text || '') + '</textarea></label>' +
            '<p class="studio-lead">Tamaño & espaciado</p>' +
            '<div class="studio-grid-2">' +
              '<label class="studio-field">Ancho bloque<select data-story-style="' + i + '" data-sf="width">' + widthOpts + '</select></label>' +
              rangeField('Escala título (×)', 'st-story-title-scale-' + i, st.titleScale != null ? st.titleScale : 1, 0.8, 1.3, 0.05) +
              rangeField('Escala texto (×)', 'st-story-text-scale-' + i, st.textScale != null ? st.textScale : 1, 0.85, 1.25, 0.05) +
            '</div>' +
            '<div class="studio-inline-actions">' + itemPv('story', i, 'Previsualizar bloque') +
            '<button type="button" class="btn btn-ghost btn-sm studio-btn-danger" data-studio-remove="story" data-index="' + i + '">Eliminar bloque</button></div>' +
          '</div></details>';
        }).join('') +
        '<p class="studio-lead">Hitos cronología</p>' +
        (hist.milestones || []).map(function (m, i) {
          return '<details class="studio-card"><summary>' + esc(m.year) + ' — ' + esc(m.title) + '</summary><div class="studio-card-body">' +
            '<label class="studio-field">Año<input type="text" data-mile="' + i + '" data-sf="year" value="' + esc(m.year) + '"></label>' +
            '<label class="studio-field">Tag<input type="text" data-mile="' + i + '" data-sf="tag" value="' + esc(m.tag) + '"></label>' +
            '<label class="studio-field">Título<input type="text" data-mile="' + i + '" data-sf="title" value="' + esc(m.title) + '"></label>' +
            '<label class="studio-field">Texto<textarea data-mile="' + i + '" data-sf="text" rows="2">' + esc(m.text) + '</textarea></label>' +
            itemPv('mile', i, 'Previsualizar hito') +
            '<button type="button" class="btn btn-ghost btn-sm studio-btn-danger" data-studio-remove="mile" data-index="' + i + '">Eliminar</button>' +
          '</div></details>';
        }).join('') +
        '<div class="studio-inline-actions"><button type="button" class="btn btn-ghost btn-sm" data-studio-add="mile">+ Hito</button></div>' +
        '<button type="button" class="studio-btn-preview" data-goto-page="historia.html">' + pv('Ver historia') + '</button>' +
        '<details class="studio-card"><summary>Botones fin de página historia</summary><div class="studio-card-body">' +
        ((data.historyPage && data.historyPage.actions) || []).map(function (a, i) {
          return '<div class="studio-grid-2">' +
            '<label class="studio-field">Botón ' + (i + 1) + ' texto<input type="text" data-hist-action="' + i + '" data-sf="text" value="' + esc(a.text) + '"></label>' +
            '<label class="studio-field">Botón ' + (i + 1) + ' enlace<input type="text" data-hist-action="' + i + '" data-sf="href" value="' + esc(a.href) + '"></label>' +
            '<label class="studio-field">Estilo<select data-hist-action="' + i + '" data-sf="style"><option value="primary"' + (a.style !== 'ghost' ? ' selected' : '') + '>Naranja (principal)</option><option value="ghost"' + (a.style === 'ghost' ? ' selected' : '') + '>Transparente</option></select></label>' +
          '</div>';
        }).join('') +
        '</div></details>';
    }

    if (id === 'teams') {
      h = visPanel('Visibilidad', [
        ['secHead-disciplines', 'Título disciplinas (inicio)', 'secHead-disciplines'],
        ['disciplines', 'Cards disciplinas (inicio)', 'disciplines'],
        ['equipos', 'Página equipos', 'equipos'],
        ['equiposTryouts', 'CTA tryouts', 'equiposTryouts']
      ], vis) +
      studioHint('Bloques de <strong>disciplina en inicio</strong> + CTA tryouts al final de equipos.html. Jugadores → «Plantillas jugadores».') +
        '<button type="button" class="btn btn-ghost btn-sm" data-goto="players" style="margin-bottom:0.75rem">Ir a Plantillas →</button>';
      (data.teams || []).forEach(function (t, i) {
        var statsHtml = (t.stats || []).map(function (s, si) {
          return '<div class="studio-grid-2"><label class="studio-field">Stat ' + (si + 1) + ' valor<input type="text" data-team-stat="' + i + '" data-si="' + si + '" data-sf="value" value="' + esc(s.value) + '"></label>' +
            '<label class="studio-field">Stat ' + (si + 1) + ' label<input type="text" data-team-stat="' + i + '" data-si="' + si + '" data-sf="label" value="' + esc(s.label) + '"></label></div>';
        }).join('');
        h += '<details class="studio-card" open><summary>' + esc(t.name) + '</summary><div class="studio-card-body">' +
          imgField('Icono equipo', 'st-team-icon-' + i, t.icon, false) +
          '<label class="studio-field">Nombre<input type="text" data-team="' + i + '" data-sf="name" value="' + esc(t.name) + '"></label>' +
          '<label class="studio-field">Tag<input type="text" data-team="' + i + '" data-sf="tag" value="' + esc(t.tag) + '"></label>' +
          '<label class="studio-field">Descripción<textarea data-team="' + i + '" data-sf="about" rows="3">' + esc(t.about) + '</textarea></label>' +
          '<label class="studio-field">Tags (uno por línea)<textarea data-team="' + i + '" data-sf="tags" rows="2">' + esc((t.tags || []).join('\n')) + '</textarea></label>' +
          '<label class="studio-check"><input type="checkbox" data-team="' + i + '" data-sf="hidden"' + (t.hidden ? ' checked' : '') + '> Ocultar disciplina (inicio + equipos)</label>' +
          '<p class="studio-lead">Cifras del bloque</p>' + statsHtml +
          itemPv('team', t.id, 'Previsualizar equipo') +
          itemPv('teamCard', i, 'Ver en inicio') +
        '</div></details>';
      });
      var ep = data.equiposPage || {};
      var esh = ep.sectionHead || {};
      h += '<details class="studio-card" open><summary>Cabecera página equipos</summary><div class="studio-card-body">' +
        '<label class="studio-field">Eyebrow<input type="text" id="st-equipos-sec-eyebrow" value="' + esc(esh.eyebrow || '') + '"></label>' +
        '<label class="studio-field">Título (HTML &lt;em&gt;)<input type="text" id="st-equipos-sec-title" value="' + esc(esh.title || '') + '"></label>' +
        '<label class="studio-field">Subtítulo<textarea id="st-equipos-sec-sub" rows="2">' + esc(esh.sub || '') + '</textarea></label>' +
        '<button type="button" class="studio-btn-preview" data-goto-page="equipos.html">' + pv('Ver cabecera equipos') + '</button>' +
      '</div></details>' +
      '<details class="studio-card" open><summary>CTA Tryouts (final página equipos)</summary><div class="studio-card-body">' +
        '<label class="studio-field">Título (HTML &lt;em&gt;)<input type="text" id="st-equipos-tryouts-title" value="' + esc(ep.tryoutsTitle || '') + '"></label>' +
        '<label class="studio-field">Subtítulo<textarea id="st-equipos-tryouts-sub" rows="2">' + esc(ep.tryoutsSub || '') + '</textarea></label>' +
        '<div class="studio-grid-2">' +
          '<label class="studio-field">Texto botón<input type="text" id="st-equipos-tryouts-btn-text" value="' + esc((ep.tryoutsBtn && ep.tryoutsBtn.text) || '') + '"></label>' +
          '<label class="studio-field">Enlace botón<input type="text" id="st-equipos-tryouts-btn-href" value="' + esc((ep.tryoutsBtn && ep.tryoutsBtn.href) || '') + '"></label>' +
        '</div>' +
        '<button type="button" class="studio-btn-preview" data-preview-block="equiposTryouts">' + pv('Previsualizar CTA tryouts') + '</button>' +
      '</div></details>';
    }

    if (id === 'players') {
      h = studioHint('Solo <strong>jugadores y perfiles</strong>. Los bloques de disciplina (nombre, stats, icono) están en «Equipos & tryouts».') +
        '<button type="button" class="btn btn-ghost btn-sm" data-goto="teams" style="margin-bottom:0.75rem">Ir a Equipos →</button>';
      var keys = [['clashRoyale', 'Clash Royale'], ['clubesPro', 'Clubes Pro FC26']];
      keys.forEach(function (pair) {
        var list = (data.rosters && data.rosters[pair[0]]) || [];
        h += '<h4 style="margin:1.25rem 0 0.75rem;color:var(--gold);font-family:var(--font-stat)">' + pair[1] + '</h4>';
        list.forEach(function (p, i) {
          var pid = pair[0] + '-' + i;
          h += '<div class="studio-player-row" id="studio-pl-' + pid + '">' +
            '<img src="' + esc(p.avatar || (data.site && data.site.logo) || 'img/logo.jpg') + '" alt="" id="prev-pl-' + pid + '">' +
            '<div>' +
              '<label class="studio-field">Nombre<input type="text" data-roster="' + pair[0] + '" data-ri="' + i + '" data-sf="name" value="' + esc(p.name) + '"></label>' +
              '<div class="studio-grid-2">' +
                '<label class="studio-field">Rol<input type="text" data-roster="' + pair[0] + '" data-ri="' + i + '" data-sf="role" value="' + esc(p.role) + '"></label>' +
                '<label class="studio-field">Nota corta<input type="text" data-roster="' + pair[0] + '" data-ri="' + i + '" data-sf="note" value="' + esc(p.note) + '"></label>' +
              '</div>' +
              '<label class="studio-field">Bio / perfil completo<textarea data-roster="' + pair[0] + '" data-ri="' + i + '" data-sf="bio" rows="3">' + esc(p.bio || '') + '</textarea></label>' +
              '<div class="studio-grid-2">' +
                '<label class="studio-field">Desde (año)<input type="text" data-roster="' + pair[0] + '" data-ri="' + i + '" data-sf="joined" value="' + esc(p.joined || '') + '"></label>' +
                '<label class="studio-field">Twitter / @<input type="text" data-roster="' + pair[0] + '" data-ri="' + i + '" data-sf="twitter" value="' + esc(p.twitter || '') + '"></label>' +
              '</div>' +
              '<label class="studio-field">Highlights (uno por línea)<textarea data-roster="' + pair[0] + '" data-ri="' + i + '" data-sf="highlights" rows="2">' + esc((p.highlights || []).join('\n')) + '</textarea></label>' +
              imgField('Foto jugador', 'st-pl-avatar-' + pid, p.avatar || '', false) +
              '<label class="studio-check"><input type="checkbox" data-roster="' + pair[0] + '" data-ri="' + i + '" data-sf="captain"' + (p.captain ? ' checked' : '') + '> Capitán</label>' +
              '<label class="studio-check"><input type="checkbox" data-roster="' + pair[0] + '" data-ri="' + i + '" data-sf="hidden"' + (p.hidden ? ' checked' : '') + '> Ocultar jugador</label>' +
              '<div class="studio-inline-actions">' + itemPv('player', pair[0] + '-' + i, 'Previsualizar jugador') +
              '<button type="button" class="btn btn-ghost btn-sm studio-btn-danger" data-studio-remove="player" data-roster-key="' + pair[0] + '" data-index="' + i + '">Eliminar</button></div>' +
            '</div></div>';
        });
        h += '<button type="button" class="btn btn-ghost btn-sm" data-studio-add="player" data-roster-key="' + pair[0] + '">+ Jugador ' + pair[1] + '</button>';
      });
    }

    if (id === 'visibility') {
      h = studioHint('Desmarca para <strong>ocultar</strong> cualquier bloque. También puedes ocultar desde cada editor (arriba del formulario). Nada se borra — solo deja de mostrarse.') +
        VIS_GROUPS.map(function (g) {
          return visPanel(g.title, g.items, vis);
        }).join('');
    }

    if (id === 'backup') {
      h = '<p class="studio-lead">Exporta toda la web editada a un archivo JSON. Impórtalo en otro PC o navegador.</p>' +
        '<div class="studio-card-actions">' +
          '<button type="button" class="btn btn-primary" id="st-export">' + actBtn('download', 'Exportar backup') + '</button>' +
          '<label class="studio-upload-label btn btn-ghost">' + actBtn('upload', 'Importar backup') + '<input type="file" id="st-import" accept=".json,application/json"></label>' +
          '<button type="button" class="btn btn-ghost" id="st-reset">' + actBtn('reset', 'Restaurar original') + '</button>' +
        '</div>';
    }

    return h;
  }

  function collectData() {
    var d = getData();
    var el = function (id) { var e = document.getElementById(id); return e ? e.value.trim() : null; };
    var chk = function (id) { var e = document.getElementById(id); return e ? e.checked : null; };

    if (el('st-banner')) {
      d.site = d.site || {};
      d.site.banner = el('st-banner') || 'img/banner-oficial.png';
      d.site.logo = el('st-logo') || d.site.logo;
      var ov = chk('st-hero-overlay');
      if (ov !== null) d.site.heroOverlay = ov;
      var op = el('st-hero-opacity');
      if (op) d.site.heroImageOpacity = parseFloat(op);
      d.site.heroEffects = d.site.heroEffects || {};
      ['kitsuneGlow', 'rays', 'floor', 'centerGlow'].forEach(function (key) {
        var map = { kitsuneGlow: 'st-fx-kitsune', rays: 'st-fx-rays', floor: 'st-fx-floor', centerGlow: 'st-fx-center' };
        var cb = document.getElementById(map[key]);
        if (cb) d.site.heroEffects[key] = cb.checked;
      });
    }
    if (el('st-hero-eyebrow')) {
      d.home = d.home || {};
      d.home.eyebrow = el('st-hero-eyebrow');
      d.home.title = el('st-hero-title');
      d.home.lead = el('st-hero-lead');
      d.home.ctaPrimary = { text: el('st-cta1t'), href: el('st-cta1h') };
      d.home.ctaSecondary = { text: el('st-cta2t'), href: el('st-cta2h') };
    }
    document.querySelectorAll('[data-stat]').forEach(function (inp) {
      var i = +inp.getAttribute('data-stat');
      var f = inp.getAttribute('data-sf');
      if (!d.stats[i]) d.stats[i] = {};
      if (f === 'hidden') d.stats[i][f] = inp.checked;
      else d.stats[i][f] = inp.value;
    });
    if (el('st-theme-accent')) {
      d.theme = d.theme || {};
      Object.assign(d.theme, {
        accent: el('st-theme-accent'),
        accentBright: el('st-theme-accent-bright'),
        accentDim: el('st-theme-accent-dim') || (d.theme && d.theme.accentDim),
        gold: el('st-theme-gold'),
        bg: el('st-theme-bg'),
        bg2: el('st-theme-bg2'),
        surface: el('st-theme-surface'),
        text: el('st-theme-text'),
        muted: el('st-theme-muted'),
        headerBg: el('st-theme-header-bg'),
        headerOpacity: parseFloat(el('st-theme-header-opacity')),
        headerTopOpacity: parseFloat(el('st-theme-header-top-opacity')),
        headerBlur: parseFloat(el('st-theme-header-blur')),
        headerHeight: parseFloat(el('st-theme-header-height')),
        headerNavScale: parseFloat(el('st-theme-header-nav-scale')),
        headerBrandScale: parseFloat(el('st-theme-header-brand-scale')),
        cardGlass: parseFloat(el('st-theme-card-glass')),
        grainOpacity: parseFloat(el('st-theme-grain')),
        borderAccent: parseFloat(el('st-theme-border-accent')),
        glowIntensity: parseFloat(el('st-theme-glow')),
        radiusLg: parseFloat(el('st-theme-radius')),
        tickerSpeed: parseFloat(el('st-theme-ticker-speed'))
      });
    }
    if (el('st-type-eyebrow') || document.getElementById('st-type-display')) {
      d.theme = d.theme || {};
      var typeObj = {};
      TYPE_FIELDS.forEach(function (f) {
        var v = el('st-type-' + f.key);
        if (v) typeObj[f.key] = v;
      });
      d.theme.type = typeObj;
      if (el('st-scale-display')) {
        d.theme.scale = {
          display: parseFloat(el('st-scale-display')),
          section: parseFloat(el('st-scale-section')),
          body: parseFloat(el('st-scale-body'))
        };
      }
    }
    if (document.getElementById('st-fx-mesh')) {
      d.theme = d.theme || {};
      var prevFx = (d.theme && d.theme.effects) || {};
      d.theme.effects = Object.assign({}, prevFx, {
        mesh: chk('st-fx-mesh') === true,
        dust: chk('st-fx-dust') !== false,
        spotlight: chk('st-fx-spotlight') === true,
        scanline: chk('st-fx-scanline') === true,
        heroCinema: chk('st-fx-hero-cinema') === true,
        embers: chk('st-fx-embers') !== false,
        cardTilt: chk('st-fx-tilt') === true,
        magneticBtns: chk('st-fx-magnetic') === true,
        dustCount: parseInt(el('st-fx-dust-count'), 10) || 0,
        emberCount: parseInt(el('st-fx-ember-count'), 10) || 0,
        meshBlur: parseFloat(el('st-fx-mesh-blur')),
        spotlightSize: parseFloat(el('st-fx-spotlight-size')),
        tiltStrength: parseFloat(el('st-fx-tilt-strength')),
        magneticStrength: parseFloat(el('st-fx-magnetic-strength')),
        perfProfile: el('st-fx-profile') || prevFx.perfProfile || 'balanced'
      });
      if (chk('st-theme-animations') !== null) d.theme.animations = chk('st-theme-animations') !== false;
    }
    document.querySelectorAll('[data-meta]').forEach(function (inp) {
      var key = inp.getAttribute('data-meta');
      var f = inp.getAttribute('data-sf');
      d.meta = d.meta || {};
      if (!d.meta[key]) d.meta[key] = {};
      d.meta[key][f] = inp.value;
    });
    if (el('st-ui-card-explore')) {
      d.uiLabels = {
        cardExplore: el('st-ui-card-explore'),
        cardRoster: el('st-ui-card-roster'),
        cardEnter: el('st-ui-card-enter'),
        newsReadMore: el('st-ui-news-read'),
        newsPanelClose: el('st-ui-news-close'),
        playerProfileClose: el('st-ui-player-close'),
        contactSuccess: el('st-ui-contact-success'),
        contactSocial: {
          twitter: el('st-ui-soc-twitter'),
          instagram: el('st-ui-soc-instagram'),
          fans: el('st-ui-soc-fans')
        }
      };
    }
    if (el('st-cuenta-login-title')) {
      var prevCp = d.cuentaPage || {};
      d.cuentaPage = Object.assign({}, prevCp, {
        hubTitle: el('st-cuenta-hub-title'),
        hubSub: el('st-cuenta-hub-sub'),
        loginTitle: el('st-cuenta-login-title'),
        loginEmail: el('st-cuenta-login-email'),
        loginPassword: el('st-cuenta-login-password'),
        loginSubmit: el('st-cuenta-login-submit'),
        registerTitle: el('st-cuenta-register-title'),
        registerNickname: el('st-cuenta-register-nickname'),
        registerEmail: el('st-cuenta-register-email'),
        registerPassword: el('st-cuenta-register-password'),
        registerGame: el('st-cuenta-register-game'),
        registerSubmit: el('st-cuenta-register-submit'),
        skipText: el('st-cuenta-skip-text'),
        skipHref: el('st-cuenta-skip-href'),
        profileEyebrow: el('st-cuenta-profile-eyebrow'),
        profileTitle: el('st-cuenta-profile-title'),
        profileWelcome: el('st-cuenta-profile-welcome'),
        profileNickname: el('st-cuenta-profile-nickname'),
        profileBio: el('st-cuenta-profile-bio'),
        profileBioPlaceholder: el('st-cuenta-profile-bio-ph'),
        profileGame: el('st-cuenta-profile-game'),
        profileRole: el('st-cuenta-profile-role'),
        profileTwitter: el('st-cuenta-profile-twitter'),
        profileTwitterPlaceholder: el('st-cuenta-profile-twitter-ph'),
        profileInstagram: el('st-cuenta-profile-instagram'),
        profileInstagramPlaceholder: el('st-cuenta-profile-instagram-ph'),
        profileDiscord: el('st-cuenta-profile-discord'),
        profileDiscordPlaceholder: el('st-cuenta-profile-discord-ph'),
        profileAvatarChange: el('st-cuenta-profile-avatar-change'),
        profileAvatarTitle: el('st-cuenta-profile-avatar-title'),
        profileAvatarUrl: el('st-cuenta-profile-avatar-url'),
        profileAvatarApply: el('st-cuenta-profile-avatar-apply'),
        profileAvatarUpload: el('st-cuenta-profile-avatar-upload'),
        profileAvatarRemove: el('st-cuenta-profile-avatar-remove'),
        profileIdentityEyebrow: el('st-cuenta-profile-id-eyebrow'),
        profileIdentityTitle: el('st-cuenta-profile-id-title'),
        profileSocialEyebrow: el('st-cuenta-profile-social-eyebrow'),
        profileSocialTitle: el('st-cuenta-profile-social-title'),
        profileStatsEyebrow: el('st-cuenta-profile-stats-eyebrow'),
        profileStatsTitle: el('st-cuenta-profile-stats-title'),
        profileMemberSince: el('st-cuenta-profile-member-since'),
        profileLocalNote: el('st-cuenta-profile-local-note'),
        quickNews: el('st-cuenta-quick-news'),
        quickNewsSub: el('st-cuenta-quick-news-sub'),
        quickTeams: el('st-cuenta-quick-teams'),
        quickTeamsSub: el('st-cuenta-quick-teams-sub'),
        quickTryouts: el('st-cuenta-quick-tryouts'),
        quickTryoutsSub: el('st-cuenta-quick-tryouts-sub'),
        quickHistory: el('st-cuenta-quick-history'),
        quickHistorySub: el('st-cuenta-quick-history-sub'),
        profileSaved: el('st-cuenta-profile-saved'),
        profileSave: el('st-cuenta-profile-save'),
        profileLogout: el('st-cuenta-profile-logout'),
        games: el('st-cuenta-games')
          ? el('st-cuenta-games').split('\n').map(function (s) { return s.trim(); }).filter(Boolean)
          : (prevCp.games || ['Clash Royale', 'Clubes Pro FC26'])
      });
    }
    if (el('st-match-home')) {
      d.nextMatch = {
        label: el('st-match-label'), home: el('st-match-home'), away: el('st-match-away'),
        league: el('st-match-league'), date: el('st-match-date'), time: el('st-match-time'), status: el('st-match-status'),
        homeLogo: el('st-match-home-logo') || (d.site && d.site.logo) || 'img/logo.jpg',
        awayLogo: el('st-match-away-logo') || '',
        leagueLogo: el('st-match-league-logo') || '',
        links: {
          x: { text: el('st-match-link-x-text') || 'Seguir en X →', href: el('st-match-link-x-href') || 'https://x.com/LyokFox_' },
          calendar: { text: el('st-match-link-cal-text') || 'Ver calendario completo →', href: el('st-match-link-cal-href') || 'index.html#calendario' }
        }
      };
    }
    if (el('st-ticker')) {
      d.ticker = el('st-ticker').split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      if (el('st-brands-label')) {
        d.home = d.home || {};
        d.home.brandsLabel = el('st-brands-label');
      }
      d.brands = [];
      document.querySelectorAll('[data-brand][data-sf="name"]').forEach(function (inp) {
        var i = +inp.getAttribute('data-brand');
        var logoEl = document.getElementById('st-brand-logo-' + i);
        d.brands.push({
          name: inp.value.trim(),
          logo: logoEl ? logoEl.value.trim() : ''
        });
      });
    }
    document.querySelectorAll('[data-sec]').forEach(function (inp) {
      var k = inp.getAttribute('data-sec');
      var f = inp.getAttribute('data-sf');
      d.home = d.home || {}; d.home.sections = d.home.sections || {};
      if (!d.home.sections[k]) d.home.sections[k] = {};
      d.home.sections[k][f] = inp.value;
    });
    document.querySelectorAll('[data-spot]').forEach(function (inp) {
      var i = +inp.getAttribute('data-spot');
      var f = inp.getAttribute('data-sf');
      if (!d.spotlight[i]) return;
      if (f === 'accent') d.spotlight[i][f] = inp.checked;
      else d.spotlight[i][f] = inp.value;
    });
    document.querySelectorAll('[data-sched]').forEach(function (inp) {
      var i = +inp.getAttribute('data-sched');
      var f = inp.getAttribute('data-sf');
      if (!d.schedule[i]) return;
      if (f === 'live') d.schedule[i][f] = inp.checked;
      else d.schedule[i][f] = inp.value;
    });
    document.querySelectorAll('[id^="st-sched-game-"]').forEach(function (inp) {
      var i = +inp.id.replace('st-sched-game-', '');
      if (d.schedule[i]) d.schedule[i].gameIcon = inp.value;
    });
    document.querySelectorAll('[id^="st-sched-home-"]').forEach(function (inp) {
      var i = +inp.id.replace('st-sched-home-', '');
      if (d.schedule[i]) d.schedule[i].homeLogo = inp.value;
    });
    document.querySelectorAll('[id^="st-sched-away-"]').forEach(function (inp) {
      var i = +inp.id.replace('st-sched-away-', '');
      if (d.schedule[i]) d.schedule[i].awayLogo = inp.value;
    });
    document.querySelectorAll('[id^="st-sched-league-"]').forEach(function (inp) {
      var i = +inp.id.replace('st-sched-league-', '');
      if (d.schedule[i]) d.schedule[i].leagueLogo = inp.value;
    });
    document.querySelectorAll('[data-tier]').forEach(function (inp) {
      var i = +inp.getAttribute('data-tier');
      var f = inp.getAttribute('data-sf');
      if (!d.sponsorTiers[i]) return;
      if (f === 'featured') d.sponsorTiers[i][f] = inp.checked;
      else if (f === 'perks') d.sponsorTiers[i][f] = inp.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      else d.sponsorTiers[i][f] = inp.value;
    });
    if (el('st-seo-text')) {
      d.home.seoText = el('st-seo-text').split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      d.home.seoKeywords = (el('st-seo-kw') || '').split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    }
    document.querySelectorAll('[data-faq]').forEach(function (inp) {
      var i = +inp.getAttribute('data-faq');
      var f = inp.getAttribute('data-sf');
      if (d.home.faq[i]) d.home.faq[i][f] = inp.value;
    });
    document.querySelectorAll('[data-news]').forEach(function (inp) {
      var i = +inp.getAttribute('data-news');
      var f = inp.getAttribute('data-sf');
      if (!d.news.articles[i]) return;
      if (f === 'featured' || f === 'hidden') d.news.articles[i][f] = inp.checked;
      else if (f === 'body') d.news.articles[i][f] = inp.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      else d.news.articles[i][f] = inp.value;
    });
    document.querySelectorAll('[id^="st-news-img-"]').forEach(function (inp) {
      var i = +inp.id.replace('st-news-img-', '');
      if (d.news.articles[i]) d.news.articles[i].image = inp.value;
    });
    if (el('st-hist-lead') && d.history && d.history.intro) {
      d.history.intro.lead = el('st-hist-lead');
      if (el('st-hist-title')) d.history.intro.title = el('st-hist-title');
    }
    document.querySelectorAll('[data-hist-stat]').forEach(function (inp) {
      var i = +inp.getAttribute('data-hist-stat');
      var f = inp.getAttribute('data-sf');
      if (d.history && d.history.intro && d.history.intro.stats && d.history.intro.stats[i]) {
        d.history.intro.stats[i][f] = inp.value;
      }
    });
    document.querySelectorAll('[data-story]').forEach(function (inp) {
      var i = +inp.getAttribute('data-story');
      var f = inp.getAttribute('data-sf');
      if (!d.history.storyBlocks) d.history.storyBlocks = [];
      if (!d.history.storyBlocks[i]) d.history.storyBlocks[i] = {};
      d.history.storyBlocks[i][f] = inp.value;
    });
    document.querySelectorAll('[id^="st-story-img-"]').forEach(function (inp) {
      var i = +inp.id.replace('st-story-img-', '');
      if (!d.history.storyBlocks) d.history.storyBlocks = [];
      if (!d.history.storyBlocks[i]) d.history.storyBlocks[i] = {};
      d.history.storyBlocks[i].image = inp.value;
    });
    document.querySelectorAll('[id^="st-story-bg-"]').forEach(function (inp) {
      var i = +inp.id.replace('st-story-bg-', '');
      if (!d.history.storyBlocks) d.history.storyBlocks = [];
      if (!d.history.storyBlocks[i]) d.history.storyBlocks[i] = {};
      d.history.storyBlocks[i].bgImage = inp.value;
    });
    document.querySelectorAll('[data-story-style]').forEach(function (inp) {
      var i = +inp.getAttribute('data-story-style');
      var f = inp.getAttribute('data-sf');
      if (!d.history.storyBlocks) d.history.storyBlocks = [];
      if (!d.history.storyBlocks[i]) d.history.storyBlocks[i] = {};
      d.history.storyBlocks[i].style = d.history.storyBlocks[i].style || {};
      d.history.storyBlocks[i].style[f] = inp.value;
      if (f === 'width') d.history.storyBlocks[i].wide = inp.value === 'wide';
    });
    document.querySelectorAll('[id^="st-story-title-scale-"]').forEach(function (inp) {
      var i = +inp.id.replace('st-story-title-scale-', '');
      if (!d.history.storyBlocks) d.history.storyBlocks = [];
      if (!d.history.storyBlocks[i]) d.history.storyBlocks[i] = {};
      d.history.storyBlocks[i].style = d.history.storyBlocks[i].style || {};
      d.history.storyBlocks[i].style.titleScale = parseFloat(inp.value) || 1;
    });
    document.querySelectorAll('[id^="st-story-text-scale-"]').forEach(function (inp) {
      var i = +inp.id.replace('st-story-text-scale-', '');
      if (!d.history.storyBlocks) d.history.storyBlocks = [];
      if (!d.history.storyBlocks[i]) d.history.storyBlocks[i] = {};
      d.history.storyBlocks[i].style = d.history.storyBlocks[i].style || {};
      d.history.storyBlocks[i].style.textScale = parseFloat(inp.value) || 1;
    });
    document.querySelectorAll('[data-hist]').forEach(function (inp) {
      var i = +inp.getAttribute('data-hist');
      var f = inp.getAttribute('data-sf');
      if (d.history.chapters[i]) d.history.chapters[i][f] = inp.value;
    });
    document.querySelectorAll('[id^="st-hist-img-"]').forEach(function (inp) {
      var i = +inp.id.replace('st-hist-img-', '');
      if (d.history.chapters[i]) d.history.chapters[i].image = inp.value;
    });
    document.querySelectorAll('[data-mile]').forEach(function (inp) {
      var i = +inp.getAttribute('data-mile');
      var f = inp.getAttribute('data-sf');
      if (d.history.milestones[i]) d.history.milestones[i][f] = inp.value;
    });
    document.querySelectorAll('[data-team]').forEach(function (inp) {
      var i = +inp.getAttribute('data-team');
      var f = inp.getAttribute('data-sf');
      if (!d.teams[i]) return;
      if (f === 'tags') d.teams[i][f] = inp.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      else if (f === 'hidden') d.teams[i][f] = inp.checked;
      else d.teams[i][f] = inp.value;
    });
    document.querySelectorAll('[id^="st-team-icon-"]').forEach(function (inp) {
      var i = +inp.id.replace('st-team-icon-', '');
      if (d.teams[i]) d.teams[i].icon = inp.value;
    });
    document.querySelectorAll('[data-team-stat]').forEach(function (inp) {
      var ti = +inp.getAttribute('data-team-stat');
      var si = +inp.getAttribute('data-si');
      var f = inp.getAttribute('data-sf');
      if (d.teams[ti] && d.teams[ti].stats && d.teams[ti].stats[si]) d.teams[ti].stats[si][f] = inp.value;
    });
    document.querySelectorAll('[data-roster]').forEach(function (inp) {
      var key = inp.getAttribute('data-roster');
      var i = +inp.getAttribute('data-ri');
      var f = inp.getAttribute('data-sf');
      if (!d.rosters[key] || !d.rosters[key][i]) return;
      if (f === 'captain' || f === 'hidden') d.rosters[key][i][f] = inp.checked;
      else if (f === 'highlights') d.rosters[key][i][f] = inp.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      else d.rosters[key][i][f] = inp.value;
    });
    document.querySelectorAll('[id^="st-pl-avatar-"]').forEach(function (inp) {
      var parts = inp.id.replace('st-pl-avatar-', '').split('-');
      var ri = +parts.pop();
      var key = parts.join('-');
      if (d.rosters[key] && d.rosters[key][ri]) d.rosters[key][ri].avatar = inp.value;
    });
    document.querySelectorAll('[data-nav]').forEach(function (inp) {
      var i = +inp.getAttribute('data-nav');
      var f = inp.getAttribute('data-sf');
      if (!d.nav || !d.nav[i]) return;
      if (f === 'cta' || f === 'hidden') d.nav[i][f] = inp.checked;
      else d.nav[i][f] = inp.value;
    });
    if (el('st-footer-tagline')) {
      d.footer = d.footer || {};
      d.footer.tagline = el('st-footer-tagline');
    }
    if (el('st-contact-email')) {
      d.site = d.site || {};
      d.site.contact = {
        email: el('st-contact-email'),
        social: {
          twitter: el('st-social-twitter') || '',
          instagram: el('st-social-instagram') || '',
          fans: el('st-social-fans') || ''
        }
      };
    }
    if (el('st-contact-info-title')) {
      d.contactPage = d.contactPage || {};
      d.contactPage.infoTitle = el('st-contact-info-title');
      d.contactPage.intro = el('st-contact-intro');
      d.contactPage.formNote = el('st-contact-form-note');
      if (el('st-contact-form-success')) d.contactPage.formSuccess = el('st-contact-form-success');
      if (el('st-contact-form-title')) d.contactPage.formTitle = el('st-contact-form-title');
      if (el('st-contact-lbl-nombre')) {
        d.contactPage.formLabels = {
          nombre: el('st-contact-lbl-nombre'),
          email: el('st-contact-lbl-email'),
          tipo: el('st-contact-lbl-tipo'),
          mensaje: el('st-contact-lbl-mensaje'),
          submit: el('st-contact-lbl-submit')
        };
      }
      if (el('st-contact-form-options')) {
        d.contactPage.formOptions = el('st-contact-form-options').split('\n').map(function (line) {
          var p = line.split('|');
          return p.length >= 2 ? { value: p[0].trim(), label: p[1].trim() } : null;
        }).filter(Boolean);
      }
      if (el('st-contact-ph-nombre')) {
        d.contactPage.formPlaceholders = {
          nombre: el('st-contact-ph-nombre'),
          email: el('st-contact-ph-email'),
          mensaje: el('st-contact-ph-mensaje')
        };
      }
    }
    if (el('st-sponsor-tier-cta')) {
      d.sponsorUi = {
        tierCta: el('st-sponsor-tier-cta'),
        dossierCta: el('st-sponsor-dossier-cta'),
        dossierHref: el('st-sponsor-dossier-href')
      };
    }
    document.querySelectorAll('[id^="st-spot-img-"]').forEach(function (inp) {
      var i = +inp.id.replace('st-spot-img-', '');
      if (d.spotlight[i]) d.spotlight[i].image = inp.value;
    });
    document.querySelectorAll('[id^="st-tier-logo-"]').forEach(function (inp) {
      var i = +inp.id.replace('st-tier-logo-', '');
      if (d.sponsorTiers[i]) d.sponsorTiers[i].logo = inp.value;
    });
    if (el('st-equipos-tryouts-title') || el('st-equipos-sec-eyebrow')) {
      var prevEp = d.equiposPage || {};
      d.equiposPage = Object.assign({}, prevEp, {
        sectionHead: {
          eyebrow: el('st-equipos-sec-eyebrow'),
          title: el('st-equipos-sec-title'),
          sub: el('st-equipos-sec-sub')
        },
        tryoutsTitle: el('st-equipos-tryouts-title'),
        tryoutsSub: el('st-equipos-tryouts-sub'),
        tryoutsBtn: { text: el('st-equipos-tryouts-btn-text'), href: el('st-equipos-tryouts-btn-href') }
      });
    }
    if (document.getElementById('st-news-breaking') || document.getElementById('st-news-sec-eyebrow')) {
      d.news = d.news || {};
      var breakingEl = document.getElementById('st-news-breaking');
      if (breakingEl) d.news.breaking = breakingEl.value.trim();
      if (el('st-news-breaking-label')) d.news.breakingLabel = el('st-news-breaking-label');
      if (el('st-news-sec-eyebrow')) {
        d.news.sectionHead = {
          eyebrow: el('st-news-sec-eyebrow'),
          title: el('st-news-sec-title'),
          sub: el('st-news-sec-sub')
        };
      }
    }
    if (el('st-home-news-more-text')) {
      d.home = d.home || {};
      d.home.newsTeaser = {
        moreText: el('st-home-news-more-text'),
        moreHref: el('st-home-news-more-href') || 'noticias.html'
      };
    }
    document.querySelectorAll('[data-hist-action]').forEach(function (inp) {
      var i = +inp.getAttribute('data-hist-action');
      var f = inp.getAttribute('data-sf');
      d.historyPage = d.historyPage || { actions: [] };
      if (!d.historyPage.actions[i]) d.historyPage.actions[i] = {};
      d.historyPage.actions[i][f] = inp.value;
    });
    document.querySelectorAll('[data-page-hero]').forEach(function (inp) {
      var key = inp.getAttribute('data-page-hero');
      var f = inp.getAttribute('data-sf');
      d.pages = d.pages || {};
      if (!d.pages[key]) d.pages[key] = {};
      d.pages[key][f] = inp.value;
    });
    META_PAGES.forEach(function (mp) {
      var key = mp.key;
      var bannerEl = document.getElementById('st-pstyle-banner-' + key);
      if (!bannerEl && !document.getElementById('st-pstyle-title-' + key)) return;
      d.pageStyles = d.pageStyles || {};
      if (!d.pageStyles[key]) d.pageStyles[key] = {};
      var ps = d.pageStyles[key];
      if (bannerEl) ps.banner = bannerEl.value.trim();
      var bop = el('st-pstyle-banner-op-' + key);
      if (bop) ps.bannerOpacity = parseFloat(bop);
      var heroBg = document.getElementById('st-pstyle-hero-bg-' + key);
      if (heroBg) ps.showHeroBanner = heroBg.checked;
      var ts = el('st-pstyle-title-' + key);
      if (ts) ps.titleScale = parseFloat(ts);
      var ls = el('st-pstyle-lead-' + key);
      if (ls) ps.leadScale = parseFloat(ls);
      var gp = el('st-pstyle-gap-' + key);
      if (gp) ps.blockGap = parseFloat(gp);
      var bg = el('st-pstyle-bg-' + key);
      if (bg) ps.bgImage = bg.value.trim();
      var bgop = el('st-pstyle-bg-op-' + key);
      if (bgop) ps.bgOpacity = parseFloat(bgop);
    });
    if (el('st-cta-btn1t')) {
      d.home = d.home || {};
      d.home.ctaButtons = {
        primary: { text: el('st-cta-btn1t'), href: el('st-cta-btn1h') },
        secondary: { text: el('st-cta-btn2t'), href: el('st-cta-btn2h') }
      };
    }
    document.querySelectorAll('[data-vis]').forEach(function (cb) {
      d.visibility = d.visibility || {};
      d.visibility[cb.getAttribute('data-vis')] = cb.checked;
    });
    return d;
  }

  function showPreviewBar() {
    var old = document.querySelector('.lyok-preview-bar');
    if (old) old.remove();
    var bar = document.createElement('div');
    bar.className = 'lyok-preview-bar';
    bar.innerHTML = ico('eye', 'st-ico st-ico-sm') + '<span>PREVISUALIZACIÓN — cambios NO publicados</span>' +
      '<button type="button" class="btn btn-primary btn-sm" id="lyok-preview-back">Volver al Studio</button>' +
      '<button type="button" class="btn btn-ghost btn-sm" id="lyok-preview-publish">' + actBtn('save', 'Publicar ahora') + '</button>' +
      '<button type="button" class="btn btn-ghost btn-sm" id="lyok-preview-discard">Descartar</button>';
    document.body.appendChild(bar);
    bar.querySelector('#lyok-preview-back').onclick = function () {
      bar.remove();
      document.body.classList.remove('lyok-preview-mode');
      previewData = collectData();
      openPanel();
    };
    bar.querySelector('#lyok-preview-publish').onclick = function () {
      var data = collectData();
      saveSaved({ data: data, visibility: data.visibility });
      previewData = null;
      deepMerge(LYOK_DATA, data);
      applyOverrides(loadSaved());
      bar.remove();
      document.body.classList.remove('lyok-preview-mode');
      refresh();
      toast('Publicado');
    };
    bar.querySelector('#lyok-preview-discard').onclick = function () {
      bar.remove();
      document.body.classList.remove('lyok-preview-mode');
      previewData = null;
      applyOverrides(loadSaved());
      refresh();
    };
  }

  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'lyok-studio-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2800);
  }

  function bindThemeControls(root) {
    if (!root) return;
    root.querySelectorAll('[data-color-sync]').forEach(function (picker) {
      var id = picker.getAttribute('data-color-sync');
      var text = document.getElementById(id);
      picker.addEventListener('input', function () {
        if (text) text.value = picker.value;
        liveThemePreview();
      });
      if (text) text.addEventListener('input', function () {
        if (/^#[0-9a-f]{3,8}$/i.test(text.value)) picker.value = text.value;
        liveThemePreview();
      });
    });
    root.querySelectorAll('[data-theme-range]').forEach(function (range) {
      var out = document.getElementById(range.id + '-out');
      range.addEventListener('input', function () {
        if (out) out.textContent = range.value;
        liveThemePreview();
      });
    });
    root.querySelectorAll('[data-theme-preset]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var preset = THEME_PRESETS[btn.getAttribute('data-theme-preset')];
        if (!preset) return;
        Object.keys(preset).forEach(function (k) {
          if (k === 'label') return;
          var map = {
            accent: 'st-theme-accent', accentBright: 'st-theme-accent-bright', gold: 'st-theme-gold',
            bg: 'st-theme-bg', headerBg: 'st-theme-header-bg', headerOpacity: 'st-theme-header-opacity',
            headerTopOpacity: 'st-theme-header-top-opacity'
          };
          var fid = map[k];
          if (!fid) return;
          var inp = document.getElementById(fid);
          if (inp) {
            inp.value = preset[k];
            inp.dispatchEvent(new Event('input'));
          }
          var pick = document.getElementById(fid + '-picker');
          if (pick && String(preset[k]).charAt(0) === '#') pick.value = preset[k];
        });
        var typeFromPreset = {
          eyebrow: preset.gold,
          displayAccent: preset.accentBright,
          link: preset.accentBright,
          navActive: preset.accent,
          statValue: preset.gold
        };
        Object.keys(typeFromPreset).forEach(function (tk) {
          var tinp = document.getElementById('st-type-' + tk);
          if (tinp && typeFromPreset[tk]) {
            tinp.value = typeFromPreset[tk];
            var tpick = document.getElementById('st-type-' + tk + '-picker');
            if (tpick && String(typeFromPreset[tk]).charAt(0) === '#') tpick.value = typeFromPreset[tk];
          }
        });
        liveThemePreview();
        toast('Preset aplicado — publica para guardar');
      });
    });
    root.querySelectorAll('[data-fx-profile]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-fx-profile');
        var prof = FX_PROFILES[key];
        if (!prof) return;
        var hid = document.getElementById('st-fx-profile');
        if (hid) hid.value = key;
        Object.keys(prof).forEach(function (k) {
          var boolMap = {
            scanline: 'st-fx-scanline', mesh: 'st-fx-mesh', spotlight: 'st-fx-spotlight',
            heroCinema: 'st-fx-hero-cinema', cardTilt: 'st-fx-tilt', magneticBtns: 'st-fx-magnetic'
          };
          if (boolMap[k]) {
            var cb = document.getElementById(boolMap[k]);
            if (cb) cb.checked = !!prof[k];
            return;
          }
          var map = {
            dustCount: 'st-fx-dust-count', emberCount: 'st-fx-ember-count', meshBlur: 'st-fx-mesh-blur',
            spotlightSize: 'st-fx-spotlight-size', tiltStrength: 'st-fx-tilt-strength', magneticStrength: 'st-fx-magnetic-strength'
          };
          var inp = document.getElementById(map[k]);
          if (inp) {
            inp.value = prof[k];
            inp.dispatchEvent(new Event('input'));
            var out = document.getElementById(inp.id + '-out');
            if (out) out.textContent = prof[k];
          }
        });
        scheduleLivePreview();
        toast('Perfil «' + key + '» aplicado');
      });
    });
    var liveBtn = root.querySelector('#st-theme-live');
    if (liveBtn) liveBtn.addEventListener('click', function () {
      previewData = collectData();
      deepMerge(LYOK_DATA, previewData);
      if (window.applyLyokTheme) applyLyokTheme();
      applySiteImages();
      refresh();
      pushDraftToFrame();
      toast('Tema aplicado en vista previa');
    });
  }

  function liveThemePreview() {
    scheduleLivePreview();
  }

  function bindBodyEvents(body) {
    bindImgPreviews(body);
    bindThemeControls(body);
    bindStudioCrud(body);
    bindLivePreview(body);
    body.querySelectorAll('[data-goto]').forEach(function (btn) {
      btn.onclick = function () { activeSection = btn.getAttribute('data-goto'); setSection(activeSection); };
    });
    body.querySelectorAll('.studio-quick-actions [data-goto]').forEach(function (btn) {
      btn.onclick = function () { setSection(btn.getAttribute('data-goto')); };
    });
    body.querySelectorAll('[data-preview-block]').forEach(function (btn) {
      btn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (panelOpen) previewBlockInFrame(btn.getAttribute('data-preview-block'));
        else previewBlock(btn.getAttribute('data-preview-block'));
      };
    });
    body.querySelectorAll('details.studio-card').forEach(function (det) {
      det.addEventListener('toggle', function () {
        if (det.open) scheduleLivePreview();
      });
    });
    body.querySelectorAll('[data-preview-item]').forEach(function (btn) {
      btn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        applyItemPreview(btn.getAttribute('data-preview-item'), false);
      };
    });
    body.querySelectorAll('[data-goto-page]').forEach(function (btn) {
      btn.onclick = function () {
        applyLivePreview();
        var page = btn.getAttribute('data-goto-page');
        if (panelOpen) navigatePreviewFrame(page, null);
        else {
          previewData = collectData();
          saveSaved({ data: previewData, visibility: previewData.visibility, _draft: true });
          location.href = page;
        }
      };
    });
    var exp = document.getElementById('st-export');
    if (exp) exp.onclick = function () {
      var data = collectData();
      var blob = new Blob([JSON.stringify({ data: data, visibility: data.visibility }, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'lyokfox-studio-backup.json';
      a.click();
    };
    var imp = document.getElementById('st-import');
    if (imp) imp.onchange = function () {
      var f = imp.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var j = JSON.parse(r.result);
          saveSaved(j);
          applyOverrides(j);
          refresh();
          toast('Backup importado');
        } catch (e) { alert('JSON inválido'); }
      };
      r.readAsText(f);
    };
    var reset = document.getElementById('st-reset');
    if (reset) reset.onclick = function () {
      if (!confirm('¿Restaurar contenido original? Se borran ediciones del Studio.')) return;
      localStorage.removeItem(SK);
      location.reload();
    };
  }

  function setSection(id) {
    if (panelOpen && id !== activeSection) persistSectionDraft();
    activeSection = id;
    var shell = document.getElementById('lyok-studio');
    if (!shell) return;
    shell.querySelectorAll('.lyok-studio-nav button').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-sec') === id);
    });
    var label = (NAV.find(function (n) { return n.id === id; }) || {}).label || id;
    var title = shell.querySelector('.lyok-studio-topbar h3');
    if (title) title.textContent = label;
    var body = shell.querySelector('.lyok-studio-body');
    if (body) body.scrollTop = 0;
    body.innerHTML = renderSection(id, getData());
    bindBodyEvents(body);
    updateLivePane(buildSectionPreview(id, getData()));
    if (livePreviewOn && id !== 'dashboard' && id !== 'backup') {
      scrollToSectionBlock(id);
    }
  }

  function openPanel() {
    if (panelOpen) return;
    panelOpen = true;
    previewViewMode = 'web';
    previewLayout = 'horizontal';
    webFrameReady = false;
    if (!previewData) previewData = JSON.parse(JSON.stringify(LYOK_DATA));

    var shell = document.createElement('div');
    shell.id = 'lyok-studio';
    shell.className = 'lyok-studio';
    shell.innerHTML =
      '<div class="lyok-studio-backdrop"></div>' +
      '<div class="lyok-studio-ambient" aria-hidden="true"></div>' +
      '<div class="lyok-studio-shell lyok-studio-shell--split">' +
        '<aside class="lyok-studio-sidebar">' +
          '<div class="lyok-studio-brand">' + studioBrandHtml() + '</div>' +
          '<div class="studio-search-wrap">' +
            '<input type="search" id="st-studio-search" class="studio-search" placeholder="Buscar sección… (noticias, color, jugador)">' +
          '</div>' +
          '<nav class="lyok-studio-nav">' + renderSidebarNav(activeSection) + '</nav>' +
        '</aside>' +
        '<div class="lyok-studio-work">' +
          '<div class="lyok-studio-main">' +
            '<div class="lyok-studio-topbar">' +
              '<div class="lyok-studio-topbar-title">' +
                '<p class="studio-topbar-eyebrow">Editando ahora</p>' +
                '<h3>Inicio Studio</h3>' +
              '</div>' +
              '<div class="lyok-studio-topbar-actions">' +
                '<label class="studio-live-toggle" title="Vista previa en vivo"><input type="checkbox" id="st-live-toggle" checked><span>En vivo</span></label>' +
                '<button type="button" class="lyok-studio-close" aria-label="Cerrar">×</button>' +
              '</div></div>' +
            '<div class="lyok-studio-body"></div>' +
            '<footer class="lyok-studio-foot">' +
              '<button type="button" class="btn btn-ghost" id="st-cancel">Cancelar</button>' +
              '<button type="button" class="btn btn-ghost" id="st-preview">' + pv('Pantalla completa') + '</button>' +
              '<button type="button" class="btn btn-primary" id="st-publish">' + actBtn('save', 'Publicar cambios') + '</button>' +
            '</footer>' +
          '</div>' +
        '</div></div>' +
      '<div id="studio-web-preview-outer" class="studio-web-preview-outer">' +
        '<header class="studio-web-preview-head">' +
          '<span class="studio-preview-live-badge"><span class="studio-live-dot studio-live-dot--pulse"></span> Live</span>' +
          '<div class="studio-preview-view-tabs" role="tablist">' +
            '<button type="button" class="is-active" data-preview-tab="horizontal" role="tab">Horizontal</button>' +
            '<button type="button" data-preview-tab="vertical" role="tab">Vertical</button>' +
            '<button type="button" data-preview-tab="mini" role="tab">Resumen</button>' +
            '<button type="button" data-preview-tab="editor" role="tab">Solo editor</button>' +
          '</div>' +
          '<span class="studio-web-url" id="studio-web-url-label">index.html</span>' +
          '<button type="button" class="btn btn-ghost btn-sm" id="st-live-goto-web">' +
            ico('link', 'st-ico st-ico-sm') + '<span>Ir al bloque</span></button>' +
        '</header>' +
        '<iframe id="studio-web-frame" class="studio-web-frame" title="Vista previa web LyokFox"></iframe>' +
        '<div class="studio-live-pane-body studio-live-pane-body--mini" id="studio-live-pane-content"></div>' +
      '</div>';

    document.body.appendChild(shell);
    document.body.classList.add('lyok-studio-open', 'lyok-studio-live', 'lyok-studio-preview-web', 'lyok-studio-layout-h');
    bindStudioSearch(shell);

    var previewOuter = document.getElementById('studio-web-preview-outer');

    var frame = document.getElementById('studio-web-frame');
    if (frame) {
      frame.addEventListener('load', function () {
        webFrameReady = true;
        pushDraftToFrame();
        scrollIframeToSection();
      });
    }

    previewOuter.querySelectorAll('[data-preview-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setPreviewTab(btn.getAttribute('data-preview-tab'));
      });
    });
    setPreviewTab('horizontal');

    var liveToggle = shell.querySelector('#st-live-toggle');
    if (liveToggle) {
      liveToggle.addEventListener('change', function () {
        livePreviewOn = liveToggle.checked;
        document.body.classList.toggle('lyok-studio-live', livePreviewOn);
        if (livePreviewOn) applyLivePreview();
        else {
          updateLivePane('<div class="studio-live-pane-empty">Vista en vivo pausada. Activa «En vivo» para ver cambios al instante.</div>');
          webFrameReady = false;
        }
      });
    }
    var gotoWeb = document.getElementById('st-live-goto-web');
    if (gotoWeb) {
      gotoWeb.addEventListener('click', function () {
        applyLivePreview();
        if (previewViewMode === 'web') scrollIframeToSection();
        else scrollToSectionBlock(activeSection);
      });
    }

    shell.querySelectorAll('.lyok-studio-nav button').forEach(function (btn) {
      btn.onclick = function () { setSection(btn.getAttribute('data-sec')); };
    });
    shell.querySelectorAll('.studio-dash-card').forEach(function (c) {
      c.onclick = function () { setSection(c.getAttribute('data-goto')); };
    });

    function closePanel(discard) {
      shell.remove();
      document.body.classList.remove('lyok-studio-open', 'lyok-studio-live', 'lyok-studio-preview-web', 'lyok-studio-preview-mini', 'lyok-studio-preview-editor', 'lyok-studio-layout-h', 'lyok-studio-layout-v');
      panelOpen = false;
      webFrameReady = false;
      livePreviewOn = true;
      clearTimeout(livePreviewTimer);
      if (discard) {
        previewData = null;
        applyOverrides(loadSaved());
        refresh();
      }
    }

    shell.querySelector('.lyok-studio-close').onclick = function () { closePanel(true); };
    shell.querySelector('.lyok-studio-backdrop').onclick = function () { closePanel(true); };
    shell.querySelector('#st-cancel').onclick = function () { closePanel(true); };

    function doPreview() {
      previewData = collectData();
      deepMerge(LYOK_DATA, previewData);
      applyVisibility(LYOK_DATA.visibility);
      applySiteImages();
      document.body.classList.add('lyok-preview-mode');
      closePanel(false);
      refresh();
      showPreviewBar();
    }

    shell.querySelector('#st-preview').onclick = doPreview;

    shell.querySelector('#st-publish').onclick = function () {
      var data = collectData();
      var saved = { data: data, visibility: data.visibility };
      saveSaved(saved);
      previewData = null;
      deepMerge(LYOK_DATA, data);
      applyOverrides(loadSaved());
      closePanel(false);
      refresh();
      if (window.LyokCmsCloud && LyokCmsCloud.isConfigured && LyokCmsCloud.isConfigured()) {
        LyokCmsCloud.push(saved, PIN).then(function (r) {
          if (r && r.ok) toast('Publicado en la nube — todos lo verán');
          else toast('Guardado local. Nube: ' + ((r && r.reason) || 'no disponible'));
        });
      } else {
        toast('Cambios publicados (solo en este navegador)');
      }
    };

    setSection(activeSection);
  }

  function showPin(cb) {
    var ov = document.createElement('div');
    ov.id = 'lyok-studio-pin';
    ov.className = 'lyok-studio-pin';
    ov.innerHTML =
      '<div class="lyok-studio-pin-box">' +
        '<div class="lyok-studio-pin-icon">' + (window.LYOK_ICONS ? LYOK_ICONS.logoMark('img/logo.jpg', 'studio-logo-mark') : '') + '</div>' +
        '<h2>STUDIO <span>ULTRA</span></h2>' +
        '<p>Tu <strong>centro de control premium</strong> LyokFox: colores, imágenes, partidos, jugadores, noticias… con vista previa en vivo al instante.</p>' +
        '<form id="lyok-pin-form"><label>PIN de acceso<input type="password" id="lyok-pin-input" placeholder="Introduce tu PIN" autocomplete="off"></label>' +
        '<p class="lyok-pin-err" id="lyok-pin-err"></p>' +
        '<div class="lyok-studio-pin-actions"><button type="submit" class="btn btn-primary btn-full">Entrar al Studio</button>' +
        '<button type="button" class="btn btn-ghost btn-full" id="lyok-pin-x">Cancelar</button></div></form>' +
        '<p class="lyok-pin-hint">Panel de edición LyokFox — acceso restringido</p></div>';
    document.body.appendChild(ov);
    ov.querySelector('#lyok-pin-x').onclick = function () { ov.remove(); };
    ov.querySelector('#lyok-pin-form').onsubmit = function (e) {
      e.preventDefault();
      if ((ov.querySelector('#lyok-pin-input').value || '').trim().toLowerCase() !== PIN) {
        ov.querySelector('#lyok-pin-err').textContent = 'PIN incorrecto';
        return;
      }
      ov.remove();
      cb();
    };
  }

  function isStudioFrame() {
    return /(?:^|[?&])studioFrame=1(?:&|$)/.test(location.search);
  }

  function mountFab() {
    if (document.getElementById('lyok-studio-fab') || isStudioFrame()) return;
    var fab = document.createElement('button');
    fab.type = 'button';
    fab.id = 'lyok-studio-fab';
    fab.className = 'lyok-studio-fab';
    fab.innerHTML = ico('gear', 'st-ico st-ico-fab') + '<span class="lyok-studio-fab-label">Studio</span>';
    fab.onclick = function () { showPin(openPanel); };
    document.body.appendChild(fab);
  }

  function init() {
    if (isStudioFrame()) {
      document.body.classList.add('studio-frame-page');
      return;
    }
    var saved = loadSaved();
    if (saved._draft) {
      delete saved._draft;
      saveSaved(saved);
      setTimeout(function () {
        applyOverrides(loadSaved());
        if (window.lyokRerender) window.lyokRerender();
        showPreviewBar();
        document.body.classList.add('lyok-preview-mode');
      }, 400);
    }
    mountFab();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.LYOK_STUDIO = { applyOverrides: applyOverrides, open: function () { showPin(openPanel); } };
})();
