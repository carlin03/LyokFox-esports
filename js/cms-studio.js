/* LyokFox Studio CMS — editor completo estilo WordPress/Wix */
(function () {
  'use strict';

  if (typeof window.CMS === 'undefined') return;

  var C = window.CMS;
  var SK = C.SK;
  var activeSection = 'dashboard';

  var NAV = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard', group: 'Principal' },
    { id: 'brand', icon: '🦊', label: 'Marca global', group: 'Principal' },
    { id: 'home', icon: '✨', label: 'Portada / Inicio', group: 'Páginas' },
    { id: 'pages', icon: '📄', label: 'Todas las páginas', group: 'Páginas' },
    { id: 'news', icon: '📰', label: 'Noticias', group: 'Contenido' },
    { id: 'teams', icon: '👥', label: 'Equipos', group: 'Contenido' },
    { id: 'players', icon: '🎮', label: 'Jugadores', group: 'Contenido' },
    { id: 'schedule', icon: '📅', label: 'Calendario · vista Inicio', group: 'Contenido' },
    { id: 'sponsor', icon: '💼', label: 'Sponsor', group: 'Contenido' },
    { id: 'history', icon: '📜', label: 'Historia', group: 'Contenido' },
    { id: 'contact', icon: '✉️', label: 'Contacto', group: 'Contenido' },
    { id: 'community', icon: '🌐', label: 'Comunidad · números', group: 'Contenido' },
    { id: 'media', icon: '🖼️', label: 'Medios', group: 'Diseño' },
    { id: 'advanced', icon: '💾', label: 'Copia de seguridad', group: 'Diseño' }
  ];

  var PAGE_KEYS = ['inicio', 'equipos', 'comunidad', 'noticias', 'historia', 'sponsor', 'contacto', 'cuenta'];
  var TEAM_KEYS = [
    { key: 'brawlStars', label: 'Brawl Stars' },
    { key: 'clashRoyale', label: 'Clash Royale' },
    { key: 'clubesPro', label: 'Clubes Pro FC26' }
  ];

  function getNav() {
    if (window.CMSStudioUnified && window.CMSStudioUnified.nav) {
      return window.CMSStudioUnified.nav.slice();
    }
    var nav = NAV.slice();
    if (window.CMSStudioExtra && window.CMSStudioExtra.nav) {
      nav = window.CMSStudioExtra.nav.concat(nav);
    }
    if (window.CMSStudioPremium && window.CMSStudioPremium.nav) {
      nav = window.CMSStudioPremium.nav.concat(nav);
    }
    if (window.CMSStudioUltimate && window.CMSStudioUltimate.nav) {
      nav = window.CMSStudioUltimate.nav.concat(nav);
    }
    if (window.CMSStudioCohesion && window.CMSStudioCohesion.nav) {
      nav = window.CMSStudioCohesion.nav.concat(nav);
    }
    if (window.CMSStudioEasy && window.CMSStudioEasy.nav) {
      nav = window.CMSStudioEasy.nav.concat(nav);
    }
    if (window.CMSStudioHistoria && window.CMSStudioHistoria.nav) {
      nav = window.CMSStudioHistoria.nav.concat(nav);
    }
    if (window.CMSStudioPro && window.CMSStudioPro.nav) {
      nav = nav.concat(window.CMSStudioPro.nav);
    }
    nav.forEach(function (item) {
      if (item.id === 'community') item.label = 'Comunidad · números';
      if (item.id === 'advanced') item.label = 'Copia de seguridad';
      if (item.id === 'media') item.label = 'Medios (imágenes)';
    });
    return nav;
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? String(el.value).trim() : '';
  }

  function chk(id) {
    var el = document.getElementById(id);
    return el ? el.checked : false;
  }

  function linesToArr(text) {
    return text ? text.split('\n').map(function (s) { return s.trim(); }).filter(Boolean) : [];
  }

  function arrToLines(arr) {
    return (arr || []).join('\n');
  }

  function statsToLines(stats) {
    return (stats || []).map(function (s) { return (s.label || '') + ' | ' + (s.value || ''); }).join('\n');
  }

  function linesToStats(text) {
    return linesToArr(text).map(function (line) {
      var p = line.split('|');
      return { label: (p[0] || '').trim(), value: (p[1] || '').trim() };
    }).filter(function (s) { return s.label || s.value; });
  }

  function getRoster(team) {
    if (typeof ROSTERS !== 'undefined' && ROSTERS[team]) return ROSTERS[team];
    return [];
  }

  function getTeamInfo(key) {
    if (typeof TEAMS_INFO !== 'undefined' && TEAMS_INFO[key]) return TEAMS_INFO[key];
    return {};
  }

  function getNewsArticles() {
    if (C.getNewsArticles) return C.getNewsArticles();
    if (typeof NEWS !== 'undefined' && NEWS.articles) return NEWS.articles;
    return [];
  }

  function getSchedule() {
    if (typeof SCHEDULE !== 'undefined') return SCHEDULE;
    return { featured: {}, upcoming: [] };
  }

  function getSponsor() {
    if (typeof SPONSOR !== 'undefined') return SPONSOR;
    return {};
  }

  function sectionTitle(title, desc) {
    return '<header class="cms-studio-section-head">' +
      '<h2>' + title + '</h2>' +
      (desc ? '<p>' + desc + '</p>' : '') +
    '</header>';
  }

  function card(title, body, open) {
    return '<details class="cms-studio-card"' + (open ? ' open' : '') + '>' +
      '<summary>' + title + '</summary>' +
      '<div class="cms-studio-card-body">' + body + '</div>' +
    '</details>';
  }

  function renderDashboard() {
    var articles = getNewsArticles().length;
    var players = getRoster('brawlStars').length + getRoster('clashRoyale').length + getRoster('clubesPro').length;
    var matches = (getSchedule().upcoming || []).length;
    var missions = (typeof COMMUNITY !== 'undefined' && COMMUNITY.missions) ? COMMUNITY.missions.length : 0;
    var rewards = (typeof COMMUNITY !== 'undefined' && COMMUNITY.rewards) ? COMMUNITY.rewards.length : 0;
    return sectionTitle('Inicio del Studio', 'Edita noticias, jugadores, comunidad, historia, patrocinio y más.') +
      (window.CMSStudioUnified ? '<div class="cms-extra-dash-banner"><button type="button" class="cms-studio-quick-btn cms-extra-dash-btn" data-goto="studio-home">Inicio Studio</button></div>' : '') +
      '<div class="cms-studio-stats">' +
        '<div class="cms-studio-stat"><strong>' + articles + '</strong><span>Noticias</span></div>' +
        '<div class="cms-studio-stat"><strong>' + players + '</strong><span>Jugadores</span></div>' +
        '<div class="cms-studio-stat"><strong>' + missions + '</strong><span>Misiones</span></div>' +
        '<div class="cms-studio-stat"><strong>' + rewards + '</strong><span>Premios tienda</span></div>' +
      '</div>' +
      '<div class="cms-studio-quick">' +
        '<button type="button" class="cms-studio-quick-btn" data-goto="news">Noticias</button>' +
        '<button type="button" class="cms-studio-quick-btn" data-goto="players">Jugadores</button>' +
        '<button type="button" class="cms-studio-quick-btn" data-goto="comm-missions">Misiones</button>' +
        '<button type="button" class="cms-studio-quick-btn" data-goto="comm-shop">Tienda</button>' +
        '<button type="button" class="cms-studio-quick-btn" data-goto="home-sections">Inicio secciones</button>' +
        '<button type="button" class="cms-studio-quick-btn" data-goto="historia-completa">Historia 10 cap.</button>' +
      '</div>' +
      '<p class="cms-hint">Los cambios se guardan en este navegador. Usa <strong>Copia de seguridad</strong> para guardar un archivo en tu PC.</p>';
  }

  function renderBrand() {
    var site = C.getMerged ? (C.getMerged().site || {}) : (C.load().site || {});
    return sectionTitle('Marca del club', 'Nombre, lema, email, moneda KP y mensaje en la barra superior.') +
      '<div class="cms-grid">' +
        C.field('Nombre del club', 'cms-site-name', site.name || (typeof SITE !== 'undefined' ? SITE.name : '')) +
        C.field('Lema / tagline', 'cms-site-tagline', site.tagline || (typeof SITE !== 'undefined' ? SITE.tagline : '')) +
        C.field('Email contacto', 'cms-site-email', site.email || (typeof SITE !== 'undefined' ? SITE.email : '')) +
        C.field('Año fundación', 'cms-site-est', site.est || (typeof SITE !== 'undefined' ? SITE.est : ''), 'number') +
        C.field('Nombre moneda KP', 'cms-points-name', (site.points && site.points.name) || (typeof SITE !== 'undefined' && SITE.points ? SITE.points.name : 'Kitsune Points')) +
        C.field('Abreviatura KP', 'cms-points-short', (site.points && site.points.short) || (typeof SITE !== 'undefined' && SITE.points ? SITE.points.short : 'KP')) +
        C.field('Motto KP', 'cms-points-motto', (site.points && site.points.motto) || (typeof SITE !== 'undefined' && SITE.points ? SITE.points.motto : '')) +
        C.textarea('Ticker EN VIVO (cabecera)', 'cms-ticker-breaking', site.tickerBreaking || (typeof SITE !== 'undefined' ? SITE.tickerBreaking : ''), 3) +
      '</div>';
  }

  function renderHome() {
    var home = C.getMerged ? (C.getMerged().home || {}) : (C.load().home || {});
    var portada = home.portada || {};
    var stats = home.stats || [
      { value: '43', label: 'Jugadores' },
      { value: 'TOP', label: 'Brawl EU' },
      { value: '1ª', label: 'PLG / VFO' },
      { value: 'KP', label: 'Comunidad' }
    ];
    var spotlight = home.spotlight || [
      { eyebrow: 'Zona Comunidad', title: 'Kitsune Points', text: 'Minijuegos, predicciones, Like/RT en X y tienda con camisetas, gorras y merch real.', link: 'Entrar y jugar →' },
      { eyebrow: 'Matchday', title: 'Calendario oficial', text: 'VPG Zero Masters, PLG, VFO, scrims Brawl y Supremacy CR — rivales reales cada semana.', link: 'Ver partidos →' },
      { eyebrow: 'Plantillas', title: '43 jugadores', text: 'Brawl Stars, Clash Royale y Clubes Pro FC26 — rosters completos y fichas detalladas.', link: 'Ver equipos →' }
    ];
    var html = sectionTitle('Portada / Inicio', 'Hero portada pro: logo, disciplinas, stats de prueba, panel partido y 3 tarjetas spotlight.') +
      card('Textos del hero (columna izquierda)', C.field('Disciplinas (bajo LYOKFOX)', 'cms-home-disciplines', home.disciplines || 'Brawl Stars · Clash Royale · Clubes Pro') +
        C.field('Tagline portada', 'cms-home-tagline', portada.tagline || home.tagline || (typeof CMS_PAGES !== 'undefined' && CMS_PAGES.inicio ? CMS_PAGES.inicio.heroTagline : '')) +
        C.field('Botón principal', 'cms-home-cta1', portada.ctaPrimary || home.ctaPrimary || 'Comunidad') +
        C.field('Botón secundario', 'cms-home-cta2', portada.ctaSecondary || home.ctaSecondary || 'Equipos'), true);

    html += card('Stats del hero (4 cifras)', stats.map(function (s, i) {
      var labels = ['Jugadores', 'Brawl EU', 'PLG / VFO', 'Comunidad'];
      return C.field('Valor — ' + (s.label || labels[i]), 'cms-home-stat-v-' + i, s.value) +
        C.field('Etiqueta — ' + (labels[i] || (i + 1)), 'cms-home-stat-l-' + i, s.label || labels[i]);
    }).join(''), false);

    html += spotlight.map(function (sp, i) {
      return card('Tarjeta destacada ' + (i + 1), C.field('Texto pequeño arriba', 'cms-home-sp-' + i + '-eyebrow', sp.eyebrow) +
        C.field('Título', 'cms-home-sp-' + i + '-title', sp.title) +
        C.textarea('Texto', 'cms-home-sp-' + i + '-text', sp.text, 3) +
        C.field('Enlace texto', 'cms-home-sp-' + i + '-link', sp.link), false);
    }).join('');

    return html;
  }

  function renderPages() {
    var pages = C.load().pages || {};
    return sectionTitle('Todas las páginas', 'Título hero, subtítulo y secciones internas de cada página.') +
      PAGE_KEYS.map(function (k) {
        var p = pages[k] || (typeof CMS_PAGES !== 'undefined' ? CMS_PAGES[k] : {}) || {};
        var sectionsHtml = '';
        if (p.sections) {
          Object.keys(p.sections).forEach(function (sk) {
            var s = p.sections[sk];
            sectionsHtml += '<div class="cms-studio-subblock">' +
              '<p class="cms-studio-subtitle">Sección: ' + sk + '</p>' +
              C.field('Eyebrow', 'cms-sec-' + k + '-' + sk + '-eyebrow', s.eyebrow || '') +
              C.field('Título', 'cms-sec-' + k + '-' + sk + '-title', s.title || '') +
              C.field('Acento', 'cms-sec-' + k + '-' + sk + '-accent', s.accent || '') +
              C.field('Subtítulo', 'cms-sec-' + k + '-' + sk + '-sub', s.sub || '') +
            '</div>';
          });
        }
        return card('Página: ' + k, C.field('Título hero', 'cms-page-' + k + '-title', p.heroTitle || '') +
          C.field('Subtítulo hero', 'cms-page-' + k + '-sub', p.heroSub || '') +
          C.field('Tagline', 'cms-page-' + k + '-tagline', p.heroTagline || '') +
          sectionsHtml, k === 'inicio');
      }).join('');
  }

  function renderNews() {
    var news = C.load().news || {};
    var breaking = news.breaking || (typeof NEWS !== 'undefined' ? NEWS.breaking : '');
    var articles = getNewsArticles();
    var sel = articles.map(function (a, i) {
      return '<option value="' + i + '">' + (a.title || a.id) + '</option>';
    }).join('');

    return sectionTitle('Noticias', 'Crea, edita y elimina artículos. Cada párrafo en un bloque; deja una línea vacía entre párrafos.') +
      C.textarea('Última hora / breaking', 'cms-news-breaking', breaking, 2) +
      '<div class="cms-studio-toolbar">' +
        '<label class="cms-field"><span>Artículo</span><select id="cms-news-index">' + sel + '</select></label>' +
        '<button type="button" class="btn btn-glass btn-sm" id="cms-news-add">+ Nuevo artículo</button>' +
        '<button type="button" class="btn btn-glass btn-sm cms-danger" id="cms-news-del">Eliminar</button>' +
      '</div>' +
      '<div id="cms-news-form"></div>';
  }

  function renderNewsForm(idx) {
    var articles = getNewsArticles();
    var a = articles[idx] || {};
    var body = Array.isArray(a.body) ? a.body.join('\n\n') : (a.body || '');
    return '<div class="cms-grid">' +
      C.field('ID único', 'cms-n-id', a.id || 'n-nuevo-' + Date.now()) +
      C.field('Fecha (YYYY-MM-DD)', 'cms-n-date', a.date || '2025-06-21') +
      C.field('Etiqueta', 'cms-n-tag', a.tag || 'LyokFox') +
      C.field('Categoría', 'cms-n-cat', a.cat || 'clubesPro') +
      C.field('Autor', 'cms-n-author', a.author || 'Staff LyokFox') +
      C.field('Minutos lectura', 'cms-n-read', a.readMin || 3, 'number') +
      C.field('KP al leer', 'cms-n-kp', a.kp || 10, 'number') +
      C.field('Imagen del artículo', 'cms-n-image', a.image || '') +
      C.field('Fuente / enlace', 'cms-n-source', a.source || '') +
      C.field('Título', 'cms-n-title', a.title || '', 'text') +
      C.textarea('Extracto', 'cms-n-excerpt', a.excerpt || '', 3) +
      C.textarea('Texto completo del artículo', 'cms-n-body', body, 12) +
      '<label class="cms-check"><input type="checkbox" id="cms-n-featured"' + (a.featured ? ' checked' : '') + '> Destacado</label>' +
      '<label class="cms-check"><input type="checkbox" id="cms-n-breaking"' + (a.breaking ? ' checked' : '') + '> Breaking</label>' +
    '</div>';
  }

  function renderTeams() {
    return sectionTitle('Equipos', 'Ficha completa de Brawl Stars, Clash Royale y Clubes Pro.') +
      TEAM_KEYS.map(function (t, i) {
        var info = getTeamInfo(t.key);
        return card(t.label, C.field('Tagline', 'cms-team-' + t.key + '-tagline', info.tagline || '') +
          C.textarea('Descripción del equipo', 'cms-team-' + t.key + '-about', info.about || '', 4) +
          C.textarea('Puntos fuertes (uno por línea)', 'cms-team-' + t.key + '-focus', arrToLines(info.focus), 3) +
          C.field('Horarios', 'cms-team-' + t.key + '-schedule', info.schedule || '') +
          C.field('Reclutamiento', 'cms-team-' + t.key + '-recruitment', info.recruitment || '') +
          C.textarea('Cifras (nombre · número, uno por línea)', 'cms-team-' + t.key + '-stats', statsToLines(info.stats), 4) +
          C.textarea('Logros (uno por línea)', 'cms-team-' + t.key + '-achievements', arrToLines(info.achievements), 5) +
          C.textarea('Legado (uno por línea)', 'cms-team-' + t.key + '-legacy', arrToLines(info.legacy), 3), i === 0);
      }).join('');
  }

  function rosterCount() {
    var total = 0;
    TEAM_KEYS.forEach(function (t) { total += getRoster(t.key).length; });
    return total;
  }

  function renderPlayers() {
    var counts = TEAM_KEYS.map(function (t) {
      return t.label + ': <strong>' + getRoster(t.key).length + '</strong>';
    }).join(' · ');
    return sectionTitle('Jugadores', 'Misma plantilla que en Equipos — ' + rosterCount() + ' jugadores en total.') +
      C.helpBox('Cohesión', 'Cada jugador de la web se edita aquí. Equipos: ' + counts + '.', 'tip') +
      '<div class="cms-studio-toolbar">' +
        '<label class="cms-field"><span>Equipo</span><select id="cms-player-team">' +
          TEAM_KEYS.map(function (t) { return '<option value="' + t.key + '">' + t.label + '</option>'; }).join('') +
        '</select></label>' +
        '<label class="cms-field"><span>Jugador</span><select id="cms-player-index"></select></label>' +
        '<button type="button" class="btn btn-glass btn-sm" id="cms-player-add">+ Añadir</button>' +
        '<button type="button" class="btn btn-glass btn-sm cms-danger" id="cms-player-del">Eliminar</button>' +
      '</div>' +
      '<div id="cms-player-form"></div>';
  }

  function renderPlayerForm() {
    var team = val('cms-player-team') || 'brawlStars';
    var roster = getRoster(team);
    var sel = document.getElementById('cms-player-index');
    if (sel) {
      sel.innerHTML = roster.map(function (p, i) {
        return '<option value="' + i + '">' + (p.name || 'Jugador ' + (i + 1)) + '</option>';
      }).join('');
    }
    var idx = sel ? (+sel.value || 0) : 0;
    var p = roster[idx] || {};
    return '<div class="cms-grid">' +
      C.field('Nombre', 'cms-p-name', p.name || '') +
      C.field('Rol', 'cms-p-role', p.role || '') +
      C.field('Nota corta', 'cms-p-note', p.note || '') +
      C.textarea('Biografía', 'cms-p-bio', p.bio || p.note || '', 4) +
      C.field('Twitter / X', 'cms-p-twitter', p.twitter || '') +
      C.field('Trofeos / ranking', 'cms-p-trophies', p.trophies || '') +
      C.field('Mains / posición', 'cms-p-mains', p.mains || '') +
      C.field('En el club desde', 'cms-p-joined', p.joined || '2024') +
      C.field('Avatar URL', 'cms-p-avatar', p.avatar || '') +
      '<label class="cms-check"><input type="checkbox" id="cms-p-captain"' + (p.captain ? ' checked' : '') + '> Capitán</label>' +
    '</div>';
  }

  function renderSchedule() {
    if (window.CMSStudioScheduleVisual && typeof window.CMSStudioScheduleVisual.render === 'function') {
      var vis = window.CMSStudioScheduleVisual.render('schedule');
      if (vis) return vis;
    }
    return '<p class="cms-hint">Cargando calendario…</p>';
  }

  function renderSponsor() {
    var sp = getSponsor();
    var html = sectionTitle('Sponsor / Patrocinio', 'Stats, paquetes y cita comercial.') +
      C.textarea('Cita principal', 'cms-sp-quote', (sp.quote && sp.quote.text) || '', 3) +
      C.field('Autor cita', 'cms-sp-quote-author', (sp.quote && sp.quote.author) || '') +
      C.field('Rol cita', 'cms-sp-quote-role', (sp.quote && sp.quote.role) || '');

    (sp.packages || []).forEach(function (pkg, i) {
      html += card(pkg.name || ('Paquete ' + (i + 1)), C.field('Nombre', 'cms-sp-pkg-' + i + '-name', pkg.name || '') +
        C.field('Precio', 'cms-sp-pkg-' + i + '-price', pkg.price || '') +
        C.field('Tagline', 'cms-sp-pkg-' + i + '-tagline', pkg.tagline || '') +
        C.field('CTA', 'cms-sp-pkg-' + i + '-cta', pkg.cta || '') +
        C.textarea('Qué incluye (uno por línea)', 'cms-sp-pkg-' + i + '-features', arrToLines(pkg.features), 5) +
        '<label class="cms-check"><input type="checkbox" id="cms-sp-pkg-' + i + '-highlight"' + (pkg.highlight ? ' checked' : '') + '> Destacado</label>', i === 2);
    });

    return html;
  }

  function renderHistory() {
    var hist = C.load().history || {};
    return sectionTitle('Historia', 'Intro y bloques principales de la crónica.') +
      C.field('Título intro', 'cms-hist-intro-title', hist.introTitle || 'Origen LyokFox') +
      C.textarea('Texto principal de la intro', 'cms-hist-intro-lead', hist.introLead || '', 4) +
      C.textarea('Etiquetas del banner (uno por línea)', 'cms-hist-chips', arrToLines(hist.chips || ['Est. 2020', 'BS Top 7 · Top 9', 'UNITE Top Europa', 'VPG · PLG · VFO']), 3) +
      card('Origen de LyokFox', C.textarea('Párrafo 1', 'cms-hist-origin-p0', (hist.blocks && hist.blocks.origin && hist.blocks.origin.paragraphs && hist.blocks.origin.paragraphs[0]) || '', 4) +
        C.textarea('Párrafo 2', 'cms-hist-origin-p1', (hist.blocks && hist.blocks.origin && hist.blocks.origin.paragraphs && hist.blocks.origin.paragraphs[1]) || '', 4) +
        C.textarea('Párrafo 3', 'cms-hist-origin-p2', (hist.blocks && hist.blocks.origin && hist.blocks.origin.paragraphs && hist.blocks.origin.paragraphs[2]) || '', 4), true);
  }

  function renderContact() {
    var contact = C.load().contact || {};
    return sectionTitle('Contacto', 'Textos de la página Contáctanos.') +
      C.textarea('Intro formulario', 'cms-contact-intro', contact.intro || '') +
      C.field('Etiqueta email', 'cms-contact-email-label', contact.emailLabel || 'lyokfox@gmail.com') +
      C.textarea('Temas del formulario (título · texto, uno por línea)', 'cms-contact-topics', (contact.topics || []).map(function (t) {
        return (t.title || '') + ' | ' + (t.desc || '');
      }).join('\n'), 5);
  }

  function renderCommunity() {
    var comm = C.load().community || {};
    var g = (typeof COMMUNITY !== 'undefined' && COMMUNITY.globalStats) ? COMMUNITY.globalStats : {};
    return sectionTitle('Comunidad · números', 'Cifras del hero (#comm-hero-stats). Misiones, tienda y textos UI en el menú Comunidad.') +
      C.fieldEasy('Miembros de la camada', 'cms-comm-members', comm.members || g.members || '', { where: 'Hero Comunidad · stat Miembros' }) +
      C.fieldEasy('KP repartidos (texto)', 'cms-comm-kp', comm.kpDistributed || g.kpDistributed || '', { where: 'Hero Comunidad · stat KP' }) +
      C.fieldEasy('Predicciones totales', 'cms-comm-predictions', comm.predictions || g.predictions || '', { where: 'Hero Comunidad · stat Predicciones' }) +
      C.helpBox('Misiones, tienda, FAQ…', 'Están en el menú lateral: <em>Misiones KP</em>, <em>Tienda / premios</em>, etc.', 'tip');
  }

  function renderMedia() {
    var o = C.load();
    var imgs = o.images || {};
    var defaultBanner = (typeof SITE !== 'undefined' && SITE.banner) ? SITE.banner : 'img/banner-oficial.png';
    return sectionTitle('Medios', 'Logo, banner y logos de juegos.') +
      C.helpBox('Iconos completos', 'Para favicon, iconos de portada, footer y minijuegos → menú <strong>Iconos & imágenes</strong> (Premium).', 'tip') +
      '<p class="cms-hint">Pega un enlace o sube una imagen. Si lo dejas vacío, se usa la del club.</p>' +
      '<div class="cms-grid">' +
        C.field('Logo del club', 'cms-img-logo', C.safeImageFieldValue(imgs.logo, '')) +
        C.field('Icono de la pestaña', 'cms-img-favicon', C.safeImageFieldValue(imgs.favicon || (o.icons && o.icons.favicon), '')) +
        C.field('Imagen del banner', 'cms-img-banner', C.safeImageFieldValue(imgs.banner, defaultBanner)) +
        C.field('Logo Brawl Stars', 'cms-img-brawl', C.safeImageFieldValue(imgs.brawl, '')) +
        C.field('Logo Clash Royale', 'cms-img-clash', C.safeImageFieldValue(imgs.clash, '')) +
        C.field('Logo EAFC', 'cms-img-eafc', C.safeImageFieldValue(imgs.eafc, '')) +
        '<label class="cms-field cms-field-full"><span>Subir logo</span><input type="file" id="cms-upload-logo" accept="image/*"></label>' +
        '<label class="cms-field cms-field-full"><span>Subir banner</span><input type="file" id="cms-upload-banner" accept="image/*"></label>' +
      '</div>' +
      '<div class="cms-studio-toolbar">' +
        C.field('X @LyokFox_', 'cms-social-twitter', (o.social && o.social.twitter) || (typeof SITE !== 'undefined' ? SITE.social.twitter : '')) +
        C.field('Instagram', 'cms-social-instagram', (o.social && o.social.instagram) || (typeof SITE !== 'undefined' ? SITE.social.instagram : '')) +
        C.field('Fans', 'cms-social-fans', (o.social && o.social.fans) || (typeof SITE !== 'undefined' ? SITE.social.fans : '')) +
      '</div>';
  }

  function renderAdvanced() {
    return sectionTitle('Copia de seguridad', 'Guarda o restaura todos tus cambios del Studio — solo con archivos, sin pegar texto.') +
      C.stepsBox([
        'Pulsa <strong>Descargar copia</strong> — se guarda un archivo en tu PC.',
        'Guárdalo en Drive, USB o donde quieras.',
        'Para recuperar: elige el archivo abajo y pulsa <strong>Restaurar copia</strong>.',
        'Para volver al contenido original: <strong>Restaurar web original</strong>.'
      ]) +
      '<div class="cms-studio-actions cms-studio-actions--big">' +
        '<button type="button" class="btn btn-primary" id="cms-export">📥 Descargar copia de seguridad</button>' +
        '<button type="button" class="btn btn-glass cms-danger" id="cms-reset">🗑️ Restaurar web original</button>' +
      '</div>' +
      C.helpBox('Restaurar copia', 'Elige el archivo <strong>.lyokfox-backup</strong> que descargaste antes. No hace falta copiar ni pegar nada.', 'info') +
      '<label class="cms-field cms-field-full cms-backup-file"><span>Archivo de copia LyokFox</span><input type="file" id="cms-import-file" accept=".lyokfox-backup"></label>' +
      '<button type="button" class="btn btn-primary btn-sm" id="cms-import">📤 Restaurar copia y recargar</button>' +
      C.field('Nuevo PIN admin (opcional)', 'cms-new-pin', '', 'password') +
      '<p class="cms-hint">PIN por defecto: <strong>' + C.defaultPin + '</strong>. Los cambios se guardan en este navegador al pulsar Guardar.</p>';
  }

  function renderSection(id) {
    if (window.CMSStudioUnified && typeof window.CMSStudioUnified.render === 'function') {
      var unifiedHtml = window.CMSStudioUnified.render(id);
      if (unifiedHtml) return unifiedHtml;
    }
    if (window.CMSStudioExtra && typeof window.CMSStudioExtra.render === 'function') {
      var extraHtml = window.CMSStudioExtra.render(id);
      if (extraHtml) return extraHtml;
    }
    if (window.CMSStudioPremium && typeof window.CMSStudioPremium.render === 'function') {
      var premHtml = window.CMSStudioPremium.render(id);
      if (premHtml) return premHtml;
    }
    if (window.CMSStudioUltimate && typeof window.CMSStudioUltimate.render === 'function') {
      var ultHtml = window.CMSStudioUltimate.render(id);
      if (ultHtml) return ultHtml;
    }
    if (window.CMSStudioCohesion && typeof window.CMSStudioCohesion.render === 'function') {
      var cohHtml = window.CMSStudioCohesion.render(id);
      if (cohHtml) return cohHtml;
    }
    if (window.CMSStudioHistoria && typeof window.CMSStudioHistoria.render === 'function') {
      var histHtml = window.CMSStudioHistoria.render(id);
      if (histHtml) return histHtml;
    }
    if (window.CMSStudioEasy && typeof window.CMSStudioEasy.render === 'function') {
      var easyHtml = window.CMSStudioEasy.render(id);
      if (easyHtml) return easyHtml;
    }
    if (window.CMSStudioPro && typeof window.CMSStudioPro.render === 'function') {
      var proHtml = window.CMSStudioPro.render(id);
      if (proHtml) return proHtml;
    }
    switch (id) {
      case 'dashboard': return renderDashboard();
      case 'brand': return renderBrand();
      case 'home': return renderHome();
      case 'pages': return renderPages();
      case 'news': return null; /* CMSStudioPro */
      case 'teams': return renderTeams();
      case 'players': return renderPlayers();
      case 'schedule': return renderSchedule();
      case 'sponsor': return renderSponsor();
      case 'history': return renderHistory();
      case 'contact': return renderContact();
      case 'community': return renderCommunity();
      case 'media': return renderMedia();
      case 'advanced': return renderAdvanced();
      default: return renderDashboard();
    }
  }

  function renderNav() {
    var groups = {};
    getNav().forEach(function (item) {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    });
    var html = '';
    Object.keys(groups).forEach(function (g) {
      html += '<p class="cms-studio-nav-group">' + g + '</p>';
      groups[g].forEach(function (item) {
        var searchHint = item.search ? ' data-search="' + item.search.replace(/"/g, '') + '"' : '';
        var iconHtml = (window.CMSStudioIcons && (window.CMSStudioIcons.render(item.id) || window.CMSStudioIcons.render(item.icon))) || '';
        html += '<button type="button" class="cms-studio-nav-item' + (activeSection === item.id ? ' active' : '') + '" data-section="' + item.id + '"' + searchHint + '>' +
          '<span class="cms-studio-nav-icon">' + iconHtml + '</span>' + item.label + '</button>';
      });
    });
    return html;
  }

  function renderShell() {
    var previewCol = (window.CMSStudioPreview && window.CMSStudioPreview.shellHtml)
      ? window.CMSStudioPreview.shellHtml() : '';
    return '<div class="cms-studio cms-studio--premium cms-studio--visual" id="cms-studio">' +
      '<aside class="cms-studio-sidebar">' +
        '<div class="cms-studio-brand cms-studio-brand--premium">' +
          (window.CMSStudioIcons ? window.CMSStudioIcons.brandHtml() : '<span class="cms-studio-brand-mark cms-studio-brand-mark--fallback"></span>') +
          '<div class="cms-studio-brand-text">' +
            '<strong>LyokFox <em>Studio</em></strong>' +
            '<span>Como WordPress · elige página y edita</span>' +
          '</div>' +
        '</div>' +
        '<div class="cms-studio-search">' +
          '<input type="search" id="cms-studio-search" placeholder="Buscar… inicio, equipos, logo, menú" autocomplete="off">' +
        '</div>' +
        '<nav class="cms-studio-nav" id="cms-studio-nav">' + renderNav() + '</nav>' +
      '</aside>' +
      '<div class="cms-studio-split">' +
      '<div class="cms-studio-main">' +
        '<header class="cms-studio-topbar cms-studio-topbar--premium">' +
          '<div class="cms-studio-topbar-title" id="cms-studio-title">Dashboard</div>' +
          '<div class="cms-studio-topbar-actions">' +
            '<button type="button" class="btn btn-glass btn-sm cms-topbar-btn" id="cms-preview">' +
              (window.CMSStudioIcons ? window.CMSStudioIcons.render('eye', 'cms-ico--btn') : '') + ' Ver web</button>' +
            '<button type="button" class="btn btn-primary btn-sm cms-save-big cms-save-glow cms-topbar-btn" id="cms-save">' +
              (window.CMSStudioIcons ? window.CMSStudioIcons.render('save', 'cms-ico--btn') : '') + ' Guardar todo</button>' +
            '<button type="button" class="cms-studio-close" id="cms-close" aria-label="Cerrar">×</button>' +
          '</div>' +
        '</header>' +
        '<div class="cms-studio-content" id="cms-studio-content">' + renderSection(activeSection) + '</div>' +
        '<footer class="cms-studio-footer" id="cms-studio-footer">' +
          '<span>Edita → <strong>Guardar todo</strong> → listo. Sin programar.</span>' +
          '<button type="button" class="cms-inline-link" data-goto="studio-home">Inicio Studio</button>' +
        '</footer>' +
      '</div>' +
      previewCol +
      '</div>' +
    '</div>';
  }

  function bindSectionEvents() {
    if (activeSection === 'news') bindNewsEvents();
    if (activeSection === 'players') bindPlayerEvents();
    if (activeSection === 'schedule') {
      if (window.CMSStudioScheduleVisual && typeof window.CMSStudioScheduleVisual.bind === 'function') {
        window.CMSStudioScheduleVisual.bind('schedule', gotoSection);
      } else {
        bindScheduleEvents();
      }
    }
    if (activeSection === 'media' || activeSection === 'images-easy') bindMediaEvents();

    if (window.CMSStudioPro && typeof window.CMSStudioPro.bind === 'function') {
      window.CMSStudioPro.bind(activeSection);
    }

    if (window.CMSStudioEasy && typeof window.CMSStudioEasy.bind === 'function') {
      window.CMSStudioEasy.bind(activeSection);
    }

    if (window.CMSStudioExtra && typeof window.CMSStudioExtra.bind === 'function') {
      window.CMSStudioExtra.bind(activeSection);
    }

    if (window.CMSStudioPremium && typeof window.CMSStudioPremium.bind === 'function') {
      window.CMSStudioPremium.bind(activeSection);
    }
    if (window.CMSStudioUltimate && typeof window.CMSStudioUltimate.bind === 'function') {
      window.CMSStudioUltimate.bind(activeSection);
    }
    if (window.CMSStudioUnified && typeof window.CMSStudioUnified.bind === 'function') {
      window.CMSStudioUnified.bind(activeSection);
    }

    var search = document.getElementById('cms-studio-search');
    if (search) {
      search.oninput = function () {
        var q = search.value.trim().toLowerCase();
        var extraMatches = [];
        if (q && window.CMSStudioUnified && typeof window.CMSStudioUnified.searchSections === 'function') {
          extraMatches = window.CMSStudioUnified.searchSections(q);
        }
        document.querySelectorAll('.cms-studio-nav-item').forEach(function (btn) {
          var label = btn.textContent.toLowerCase();
          var hint = (btn.getAttribute('data-search') || '').toLowerCase();
          var id = btn.dataset.section;
          var matchExtra = extraMatches.indexOf(id) >= 0;
          var ok = !q || label.indexOf(q) >= 0 || hint.indexOf(q) >= 0 || matchExtra;
          btn.style.display = ok ? '' : 'none';
        });
        document.querySelectorAll('.cms-studio-nav-group').forEach(function (g) {
          var next = g.nextElementSibling;
          var anyVisible = false;
          while (next && !next.classList.contains('cms-studio-nav-group')) {
            if (next.classList.contains('cms-studio-nav-item') && next.style.display !== 'none') anyVisible = true;
            next = next.nextElementSibling;
          }
          g.style.display = anyVisible || !q ? '' : 'none';
        });
      };
    }

    document.querySelectorAll('[data-goto]').forEach(function (btn) {
      btn.onclick = function () { gotoSection(btn.dataset.goto); };
    });
  }

  function gotoSection(id) {
    activeSection = id;
    var item = getNav().find(function (n) { return n.id === id; });
    var titleEl = document.getElementById('cms-studio-title');
    var contentEl = document.getElementById('cms-studio-content');
    var title = item ? item.label : (
      window.CMSStudioUnified && typeof window.CMSStudioUnified.getTitle === 'function'
        ? window.CMSStudioUnified.getTitle(id)
        : id
    );
    if (titleEl) titleEl.textContent = title;
    if (contentEl) {
      var html = renderSection(id);
      if (window.CMSStudioUnified && typeof window.CMSStudioUnified.renderBackFor === 'function') {
        html = window.CMSStudioUnified.renderBackFor(id) + html;
      }
      contentEl.innerHTML = html;
      contentEl.scrollTop = 0;
      if (window.CMSStudioFriendly && typeof window.CMSStudioFriendly.polish === 'function') {
        window.CMSStudioFriendly.polish(contentEl);
      }
    }
    document.querySelectorAll('.cms-studio-nav-item').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.section === id);
    });
    bindSectionEvents();
    if (window.CMSStudioPreview && typeof window.CMSStudioPreview.onSection === 'function') {
      window.CMSStudioPreview.onSection(id);
    }
  }

  function bindNav() {
    document.querySelectorAll('.cms-studio-nav-item').forEach(function (btn) {
      btn.onclick = function () { gotoSection(btn.dataset.section); };
    });
  }

  function bindNewsEvents() {
    var form = document.getElementById('cms-news-form');
    var sel = document.getElementById('cms-news-index');
    function refreshForm() {
      if (form && sel) {
        form.innerHTML = renderNewsForm(+sel.value || 0);
        if (window.CMSStudioFriendly) window.CMSStudioFriendly.polish(form);
      }
    }
    if (sel) {
      refreshForm();
      sel.onchange = function () {
        refreshForm();
        if (window.CMSStudioPreview && typeof window.CMSStudioPreview.syncContext === 'function') {
          window.CMSStudioPreview.syncContext();
        }
      };
    }
    var addBtn = document.getElementById('cms-news-add');
    if (addBtn) addBtn.onclick = function () {
      var o = C.load();
      o.news = o.news || {};
      if (!o.news.articles) o.news.articles = JSON.parse(JSON.stringify(getNewsArticles()));
      o.news.articles.unshift({
        id: 'n-nuevo-' + Date.now(),
        date: '2025-06-21',
        tag: 'LyokFox',
        cat: 'clubesPro',
        title: 'Nueva noticia',
        excerpt: '',
        body: [''],
        author: 'Staff LyokFox',
        readMin: 3,
        kp: 10,
        featured: false,
        breaking: false
      });
      C.save(o);
      C.apply();
      gotoSection('news');
      C.toast('Artículo creado — edítalo y guarda');
    };
    var delBtn = document.getElementById('cms-news-del');
    if (delBtn) delBtn.onclick = function () {
      if (!confirm('¿Eliminar este artículo?')) return;
      var idx = +val('cms-news-index');
      var o = C.load();
      o.news = o.news || {};
      o.news.articles = JSON.parse(JSON.stringify(getNewsArticles()));
      o.news.articles.splice(idx, 1);
      C.save(o);
      C.apply();
      gotoSection('news');
    };
  }

  function bindPlayerEvents() {
    var form = document.getElementById('cms-player-form');
    var sel = document.getElementById('cms-player-index');
    var teamSel = document.getElementById('cms-player-team');
    function refresh() {
      if (form) form.innerHTML = renderPlayerForm();
    }
    refresh();
    if (teamSel) teamSel.onchange = function () {
      refresh();
      if (window.CMSStudioPreview && typeof window.CMSStudioPreview.syncContext === 'function') {
        window.CMSStudioPreview.syncContext();
      }
    };
    if (sel) sel.onchange = function () {
      refresh();
      if (window.CMSStudioPreview && typeof window.CMSStudioPreview.syncContext === 'function') {
        window.CMSStudioPreview.syncContext();
      }
    };

    var addBtn = document.getElementById('cms-player-add');
    if (addBtn) addBtn.onclick = function () {
      var team = val('cms-player-team');
      var o = C.load();
      o.rosters = o.rosters || {};
      o.rosters[team] = JSON.parse(JSON.stringify(getRoster(team)));
      o.rosters[team].push({ name: 'Nuevo jugador', role: 'Jugador', note: '' });
      C.save(o);
      C.apply();
      gotoSection('players');
    };

    var delBtn = document.getElementById('cms-player-del');
    if (delBtn) delBtn.onclick = function () {
      if (!confirm('¿Eliminar este jugador?')) return;
      var team = val('cms-player-team');
      var idx = +val('cms-player-index');
      var o = C.load();
      o.rosters = o.rosters || {};
      o.rosters[team] = JSON.parse(JSON.stringify(getRoster(team)));
      o.rosters[team].splice(idx, 1);
      C.save(o);
      C.apply();
      gotoSection('players');
    };
  }

  function bindScheduleEvents() {
    var addBtn = document.getElementById('cms-match-add');
    if (addBtn) addBtn.onclick = function () {
      var o = C.load();
      o.schedule = o.schedule || JSON.parse(JSON.stringify(getSchedule()));
      o.schedule.upcoming = o.schedule.upcoming || [];
      o.schedule.upcoming.push({
        id: 'm-new-' + Date.now(),
        date: '2025-06-21',
        time: '22:00',
        game: 'eafc',
        gameLabel: 'Clubes Pro FC26',
        competition: 'VPG',
        opponent: 'Rival',
        status: 'Próximo'
      });
      C.save(o);
      C.apply();
      gotoSection('schedule');
    };
    document.querySelectorAll('.cms-match-remove').forEach(function (btn) {
      btn.onclick = function () {
        var idx = +btn.dataset.idx;
        var o = C.load();
        o.schedule = o.schedule || JSON.parse(JSON.stringify(getSchedule()));
        o.schedule.upcoming.splice(idx, 1);
        C.save(o);
        C.apply();
        gotoSection('schedule');
      };
    });
  }

  function bindMediaEvents() {
    function fileToDataUrl(inputId, targetKey) {
      var input = document.getElementById(inputId);
      if (!input || !input.files[0]) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        var o = C.load();
        o.images = o.images || {};
        o.images[targetKey] = e.target.result;
        C.save(o);
        var f = document.getElementById('cms-img-' + targetKey);
        if (f) f.value = '[archivo subido]';
        C.toast('✅ Imagen lista — ahora pulsa 💾 Guardar todo');
      };
      reader.readAsDataURL(input.files[0]);
    }
    var uploadLogo = document.getElementById('cms-upload-logo');
    if (uploadLogo) uploadLogo.onchange = function () { fileToDataUrl('cms-upload-logo', 'logo'); };
    var uploadBanner = document.getElementById('cms-upload-banner');
    if (uploadBanner) uploadBanner.onchange = function () { fileToDataUrl('cms-upload-banner', 'banner'); };
  }

  function collectAll() {
    var o = C.load();

    o.site = o.site || {};
    o.site.name = val('cms-site-name') || o.site.name;
    o.site.tagline = val('cms-site-tagline');
    o.site.email = val('cms-site-email');
    o.site.est = +val('cms-site-est') || 2020;
    o.site.tickerBreaking = val('cms-ticker-breaking');
    o.site.points = o.site.points || {};
    o.site.points.name = val('cms-points-name');
    o.site.points.short = val('cms-points-short');
    o.site.points.motto = val('cms-points-motto');

    o.home = o.home || {};
    o.home.eyebrow = val('cms-home-eyebrow');
    o.home.tagline = val('cms-home-tagline');
    o.home.ctaPrimary = val('cms-home-cta1');
    o.home.ctaSecondary = val('cms-home-cta2');
    if (document.getElementById('cms-home-disciplines')) {
      o.home.disciplines = val('cms-home-disciplines');
    }
    o.home.stats = [];
    for (var si = 0; si < 4; si++) {
      if (!document.getElementById('cms-home-stat-v-' + si)) continue;
      o.home.stats.push({ value: val('cms-home-stat-v-' + si), label: val('cms-home-stat-l-' + si) });
    }
    o.home.spotlight = [];
    for (var spi = 0; spi < 3; spi++) {
      o.home.spotlight.push({
        eyebrow: val('cms-home-sp-' + spi + '-eyebrow'),
        title: val('cms-home-sp-' + spi + '-title'),
        text: val('cms-home-sp-' + spi + '-text'),
        link: val('cms-home-sp-' + spi + '-link')
      });
    }

    o.pages = o.pages || {};
    PAGE_KEYS.forEach(function (k) {
      o.pages[k] = o.pages[k] || {};
      o.pages[k].heroTitle = val('cms-page-' + k + '-title');
      o.pages[k].heroSub = val('cms-page-' + k + '-sub');
      o.pages[k].heroTagline = val('cms-page-' + k + '-tagline');
      o.pages[k].sections = o.pages[k].sections || {};
      document.querySelectorAll('[id^="cms-sec-' + k + '-"]').forEach(function () { /* dynamic keys collected below */ });
      var secPrefix = 'cms-sec-' + k + '-';
      var sectionKeys = {};
      Array.prototype.slice.call(document.querySelectorAll('[id^="' + secPrefix + '"]')).forEach(function (el) {
        var rest = el.id.slice(secPrefix.length);
        var parts = rest.split('-');
        var sk = parts[0];
        var field = parts.slice(1).join('-');
        if (!sectionKeys[sk]) sectionKeys[sk] = {};
        sectionKeys[sk][field] = el.value.trim();
      });
      Object.keys(sectionKeys).forEach(function (sk) {
        o.pages[k].sections[sk] = {
          eyebrow: sectionKeys[sk].eyebrow || '',
          title: sectionKeys[sk].title || '',
          accent: sectionKeys[sk].accent || '',
          sub: sectionKeys[sk].sub || ''
        };
      });
    });

    if (document.getElementById('cms-news-breaking')) {
      o.news = o.news || {};
      o.news.breaking = val('cms-news-breaking');
      var articles = JSON.parse(JSON.stringify(getNewsArticles()));
      if (document.getElementById('cms-n-title')) {
        var nIdx = +val('cms-news-index') || 0;
        var bodyRaw = val('cms-n-body');
        var bodyArr = bodyRaw ? bodyRaw.split(/\n\s*\n/).filter(Boolean) : [];
        var article = {
          id: val('cms-n-id'),
          date: val('cms-n-date'),
          tag: val('cms-n-tag'),
          cat: val('cms-n-cat'),
          author: val('cms-n-author'),
          readMin: +val('cms-n-read') || 3,
          kp: +val('cms-n-kp') || 10,
          image: val('cms-n-image'),
          source: val('cms-n-source'),
          title: val('cms-n-title'),
          excerpt: val('cms-n-excerpt'),
          body: bodyArr,
          featured: chk('cms-n-featured'),
          breaking: chk('cms-n-breaking')
        };
        if (articles[nIdx]) articles[nIdx] = article;
        else articles.push(article);
      }
      o.news.articles = articles;
    }

    o.teamsInfo = o.teamsInfo || {};
    TEAM_KEYS.forEach(function (t) {
      var key = t.key;
      var prefix = 'cms-team-' + key + '-';
      if (!document.getElementById(prefix + 'tagline')) return;
      o.teamsInfo[key] = {
        tagline: val(prefix + 'tagline'),
        about: val(prefix + 'about'),
        focus: linesToArr(val(prefix + 'focus')),
        schedule: val(prefix + 'schedule'),
        recruitment: val(prefix + 'recruitment'),
        stats: linesToStats(val(prefix + 'stats')),
        achievements: linesToArr(val(prefix + 'achievements')),
        legacy: linesToArr(val(prefix + 'legacy'))
      };
    });

    if (document.getElementById('cms-p-name')) {
      var team = val('cms-player-team');
      var idx = +val('cms-player-index') || 0;
      o.rosters = o.rosters || {};
      o.rosters[team] = JSON.parse(JSON.stringify(getRoster(team)));
      if (o.rosters[team][idx]) {
        o.rosters[team][idx] = {
          name: val('cms-p-name'),
          role: val('cms-p-role'),
          note: val('cms-p-note'),
          bio: val('cms-p-bio'),
          twitter: val('cms-p-twitter'),
          trophies: val('cms-p-trophies'),
          mains: val('cms-p-mains'),
          joined: val('cms-p-joined'),
          avatar: val('cms-p-avatar'),
          captain: chk('cms-p-captain')
        };
      }
    }

    if (window.CMSStudioScheduleVisual && typeof window.CMSStudioScheduleVisual.collect === 'function') {
      o = window.CMSStudioScheduleVisual.collect(o);
    } else if (document.getElementById('cms-feat-opponent')) {
      o.schedule = o.schedule || JSON.parse(JSON.stringify(getSchedule()));
      o.schedule.featured = {
        id: val('cms-feat-id') || 'feat-1',
        date: val('cms-feat-date'),
        time: val('cms-feat-time'),
        game: val('cms-feat-game') || 'eafc',
        gameLabel: val('cms-feat-gameLabel'),
        competition: val('cms-feat-competition'),
        opponent: val('cms-feat-opponent'),
        status: val('cms-feat-status'),
        stream: val('cms-feat-stream'),
        venue: val('cms-feat-venue') || 'Online · PS5',
        timezone: 'CEST'
      };
    }

    if (document.getElementById('cms-sp-quote')) {
      o.sponsor = o.sponsor || JSON.parse(JSON.stringify(getSponsor()));
      o.sponsor.quote = {
        text: val('cms-sp-quote'),
        author: val('cms-sp-quote-author'),
        role: val('cms-sp-quote-role')
      };
      o.sponsor.packages = o.sponsor.packages || [];
      var pkgIdx = 0;
      while (document.getElementById('cms-sp-pkg-' + pkgIdx + '-name')) {
        o.sponsor.packages[pkgIdx] = {
          id: o.sponsor.packages[pkgIdx] && o.sponsor.packages[pkgIdx].id ? o.sponsor.packages[pkgIdx].id : 'pkg-' + pkgIdx,
          name: val('cms-sp-pkg-' + pkgIdx + '-name'),
          price: val('cms-sp-pkg-' + pkgIdx + '-price'),
          tagline: val('cms-sp-pkg-' + pkgIdx + '-tagline'),
          cta: val('cms-sp-pkg-' + pkgIdx + '-cta'),
          features: linesToArr(val('cms-sp-pkg-' + pkgIdx + '-features')),
          highlight: chk('cms-sp-pkg-' + pkgIdx + '-highlight')
        };
        pkgIdx++;
      }
    }

    if (document.getElementById('cms-hist-intro-title')) {
      o.history = {
        introTitle: val('cms-hist-intro-title'),
        introLead: val('cms-hist-intro-lead'),
        chips: linesToArr(val('cms-hist-chips')),
        blocks: {
          origin: {
            paragraphs: [val('cms-hist-origin-p0'), val('cms-hist-origin-p1'), val('cms-hist-origin-p2')].filter(Boolean)
          }
        }
      };
    }

    if (document.getElementById('cms-contact-intro')) {
      o.contact = {
        intro: val('cms-contact-intro'),
        emailLabel: val('cms-contact-email-label'),
        topics: linesToArr(val('cms-contact-topics')).map(function (line) {
          var p = line.split('|');
          return { title: (p[0] || '').trim(), desc: (p[1] || '').trim() };
        })
      };
    }

    if (document.getElementById('cms-comm-members')) {
      o.community = o.community || {};
      o.community.members = val('cms-comm-members');
      o.community.kpDistributed = val('cms-comm-kp');
      o.community.predictions = val('cms-comm-predictions');
    }

    o.images = o.images || {};
    if (document.getElementById('cms-img-logo')) {
      var bannerInput = val('cms-img-banner');
      var logoInput = val('cms-img-logo');
      if (logoInput && logoInput.indexOf('[imagen') !== 0 && logoInput.indexOf('[archivo') !== 0) {
        o.images.logo = logoInput;
      }
      var favIn = val('cms-img-favicon');
      if (favIn && favIn.indexOf('[imagen') !== 0 && favIn.indexOf('[archivo') !== 0) {
        o.images.favicon = favIn;
        o.icons = o.icons || {};
        o.icons.favicon = favIn;
      }
      if (bannerInput && bannerInput.indexOf('[imagen') !== 0 && bannerInput.indexOf('[archivo') !== 0) {
        o.images.banner = bannerInput;
      }
      var brawlIn = val('cms-img-brawl');
      if (brawlIn && brawlIn.indexOf('[imagen') !== 0 && brawlIn.indexOf('[archivo') !== 0) o.images.brawl = brawlIn;
      var clashIn = val('cms-img-clash');
      if (clashIn && clashIn.indexOf('[imagen') !== 0 && clashIn.indexOf('[archivo') !== 0) o.images.clash = clashIn;
      var eafcIn = val('cms-img-eafc');
      if (eafcIn && eafcIn.indexOf('[imagen') !== 0 && eafcIn.indexOf('[archivo') !== 0) o.images.eafc = eafcIn;
    }

    if (document.getElementById('cms-social-twitter')) {
      o.social = {
        twitter: val('cms-social-twitter'),
        instagram: val('cms-social-instagram'),
        fans: val('cms-social-fans')
      };
    }

    var newPin = val('cms-new-pin');
    if (newPin) o.pin = newPin.trim().toLowerCase();

    if (window.CMSStudioHistoria && typeof window.CMSStudioHistoria.collect === 'function') {
      o = window.CMSStudioHistoria.collect(o);
    }

    if (window.CMSStudioPro && typeof window.CMSStudioPro.collect === 'function') {
      o = window.CMSStudioPro.collect(o);
    }

    if (window.CMSStudioEasy && typeof window.CMSStudioEasy.collect === 'function') {
      o = window.CMSStudioEasy.collect(o);
    }

    if (window.CMSStudioExtra && typeof window.CMSStudioExtra.collect === 'function') {
      o = window.CMSStudioExtra.collect(o);
    }

    if (window.CMSStudioPremium && typeof window.CMSStudioPremium.collect === 'function') {
      o = window.CMSStudioPremium.collect(o);
    }
    if (window.CMSStudioUltimate && typeof window.CMSStudioUltimate.collect === 'function') {
      o = window.CMSStudioUltimate.collect(o);
    }
    if (window.CMSStudioUnified && typeof window.CMSStudioUnified.collect === 'function') {
      o = window.CMSStudioUnified.collect(o);
    }

    return o;
  }

  function saveAll() {
    if (!confirm('¿Guardar todos los cambios?\n\nLa página se recargará para que veas el resultado.')) return;
    try {
      var data = collectAll();
      C.save(data);
      if (typeof SITE !== 'undefined') {
        if (data.site) C.deepMerge(SITE, data.site);
        if (data.site && data.site.tickerBreaking) SITE.tickerBreaking = data.site.tickerBreaking;
        if (data.social) {
          SITE.social.twitter = data.social.twitter || SITE.social.twitter;
          SITE.social.instagram = data.social.instagram || SITE.social.instagram;
          SITE.social.fans = data.social.fans || SITE.social.fans;
        }
      }
      function finish(msg) {
        if (msg) C.toast(msg);
        location.reload();
      }
      if (window.LyokFoxCmsSync && typeof window.LyokFoxCmsSync.push === 'function' && window.LyokFoxCmsSync.isConfigured()) {
        window.LyokFoxCmsSync.push(data).then(function (res) {
          if (res && res.ok) finish('Guardado y publicado en la nube');
          else if (res && res.reason === 'no_session') finish('Guardado en este navegador. Inicia sesión en login.html para publicar para todos.');
          else finish('Guardado en este navegador');
        }).catch(function () { finish('Guardado en este navegador'); });
        return;
      }
      finish();
    } catch (e) {
      alert('Error al guardar: ' + (e && e.message ? e.message : e));
    }
  }

  function openStudio() {
    var existing = document.getElementById('cms-overlay');
    if (existing) existing.remove();

    activeSection = window.CMSStudioUnified ? 'studio-home' : (window.CMSStudioExtra ? 'extra-hub' : 'dashboard');
    var overlay = document.createElement('div');
    overlay.id = 'cms-overlay';
    overlay.className = 'cms-overlay cms-overlay-studio cms-overlay--premium open';
    overlay.innerHTML = renderShell();
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    bindNav();
    bindSectionEvents();
    if (window.CMSStudioPreview && typeof window.CMSStudioPreview.onSection === 'function') {
      window.CMSStudioPreview.onSection(activeSection);
    }

    document.getElementById('cms-close').onclick = closeStudio;
    document.getElementById('cms-preview').onclick = function () {
      if (window.CMSStudioPreview && typeof window.CMSStudioPreview.openExternal === 'function') {
        window.CMSStudioPreview.openExternal();
      } else {
        closeStudio();
      }
    };
    document.getElementById('cms-save').onclick = saveAll;

    var exportBtn = document.getElementById('cms-export');
    if (exportBtn) exportBtn.onclick = function () {
      C.downloadBackup(collectAll());
    };

    var importBtn = document.getElementById('cms-import');
    if (importBtn) importBtn.onclick = function () {
      var fileInput = document.getElementById('cms-import-file');
      var file = fileInput && fileInput.files && fileInput.files[0];
      C.restoreBackupFromFile(file, function () {
        alert('Copia restaurada. Recargando…');
        location.reload();
      }, function (msg) {
        alert(msg);
      });
    };

    var resetBtn = document.getElementById('cms-reset');
    if (resetBtn) resetBtn.onclick = function () {
      if (confirm('¿Borrar TODOS los cambios del Studio y volver al contenido original?')) {
        localStorage.removeItem(SK);
        location.reload();
      }
    };
  }

  function collectPreview() {
    var base = C.deepClone(C.getMerged ? C.getMerged() : C.load());
    var partial = collectAll();
    return C.deepMerge(base, partial);
  }

  function closeStudio() {
    var overlay = document.getElementById('cms-overlay');
    if (overlay) overlay.remove();
    document.body.style.overflow = '';
  }

  window.CMSStudio = {
    open: openStudio,
    close: closeStudio,
    collectAll: collectAll,
    collectPreview: collectPreview,
    goto: gotoSection,
    get activeSection() { return activeSection; }
  };
})();
