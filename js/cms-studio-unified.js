/* LyokFox Studio — navegación unificada estilo WordPress / Wix */
(function () {
  'use strict';
  if (typeof window.CMS === 'undefined') return;
  var C = window.CMS;

  var UNIFIED_NAV = [
    { id: 'studio-home', icon: 'grid', label: 'Inicio Studio', group: 'LyokFox Studio', search: 'mapa inicio dashboard hub' },
    { id: 'guide', icon: 'book', label: 'Guía · empieza aquí', group: 'LyokFox Studio', search: 'ayuda tutorial empezar' },
    { id: 'quick', icon: 'bolt', label: 'Edición rápida', group: 'LyokFox Studio', search: 'ticker partido portada rápido' },
    { id: 'page-inicio', icon: 'home', label: 'Inicio', group: 'Páginas', search: 'portada banner calendario matchday' },
    { id: 'page-equipos', icon: 'users', label: 'Equipos', group: 'Páginas', search: 'jugadores plantilla brawl clash fc26' },
    { id: 'page-comunidad', icon: 'community', label: 'Comunidad', group: 'Páginas', search: 'misiones tienda kp juegos predicciones' },
    { id: 'page-noticias', icon: 'news', label: 'Noticias', group: 'Páginas', search: 'artículos breaking portal' },
    { id: 'page-historia', icon: 'scroll', label: 'Historia', group: 'Páginas', search: 'capítulos cronología club' },
    { id: 'page-sponsor', icon: 'briefcase', label: 'Sponsor', group: 'Páginas', search: 'patrocinio paquetes' },
    { id: 'page-contacto', icon: 'mail', label: 'Contacto', group: 'Páginas', search: 'formulario email asuntos' },
    { id: 'page-cuenta', icon: 'user', label: 'Mi cuenta', group: 'Páginas', search: 'perfil login drawer' },
    { id: 'settings-hub', icon: 'settings', label: 'Ajustes del sitio', group: 'Global', search: 'logo menú seo iconos ticker marca cabecera ocultar' },
    { id: 'advanced', icon: 'database', label: 'Copia de seguridad', group: 'Global', search: 'exportar importar backup restaurar pin' }
  ];

  var SECTION_TITLES = {
    'studio-home': 'Inicio Studio',
    'extra-hub': 'Inicio Studio',
    guide: 'Guía · empieza aquí',
    quick: 'Edición rápida',
    'page-inicio': 'Editar · Inicio',
    'page-equipos': 'Editar · Equipos',
    'page-comunidad': 'Editar · Comunidad',
    'page-noticias': 'Editar · Noticias',
    'page-historia': 'Editar · Historia',
    'page-sponsor': 'Editar · Sponsor',
    'page-contacto': 'Editar · Contacto',
    'page-cuenta': 'Editar · Mi cuenta',
    'settings-hub': 'Ajustes del sitio',
    home: 'Portada · banner y textos',
    schedule: 'Calendario · próximo partido',
    'extra-inicio': 'Inicio · secciones extra',
    'home-sections': 'Inicio · bloques inferiores',
    teams: 'Equipos · fichas',
    players: 'Jugadores · plantillas',
    'extra-equipos': 'Equipos · textos página',
    'ult-equipos': 'Equipos · UI avanzada',
    'extra-com-textos': 'Comunidad · textos UI',
    community: 'Comunidad · números',
    'comm-missions': 'Misiones KP',
    'comm-shop': 'Tienda · premios',
    'ult-com-shop': 'Tienda · categorías',
    'ult-com-games': 'Minijuegos & retos',
    'comm-social': 'Posts en redes',
    'ult-com-social-plus': 'Recompensas IG/Fans',
    'extra-com-data': 'Logros & Quiz',
    'comm-faq': 'FAQ Comunidad',
    'comm-levels': 'Niveles KP',
    'comm-events': 'Eventos camada',
    'comm-promo': 'Códigos promo',
    'comm-match': 'Partidos / predicciones',
    'ult-com-polls': 'Encuestas',
    'ult-com-misc': 'Logros · quotes · más',
    'ult-comunidad-ui': 'Comunidad · hero premium',
    news: 'Noticias · artículos',
    'extra-noticias': 'Noticias · portal',
    'ult-noticias-ui': 'Noticias · UI avanzada',
    'historia-completa': 'Historia · 10 capítulos',
    history: 'Historia · intro',
    'history-chapters': 'Historia · capítulos (rápido)',
    sponsor: 'Sponsor · paquetes',
    'prem-sponsor-texts': 'Sponsor · textos secciones',
    'sponsor-full': 'Sponsor · datos avanzados',
    'ult-sponsor-plus': 'Sponsor · impacto y partners',
    contact: 'Contacto · básico',
    'extra-contacto': 'Contacto · formulario',
    'ult-contacto-ui': 'Contacto · UI avanzada',
    'extra-cuenta': 'Mi cuenta · formulario',
    'extra-perfil': 'Panel perfil cabecera',
    'ult-cuenta-ui': 'Mi cuenta · UI avanzada',
    brand: 'Marca global',
    'prem-icons': 'Iconos & imágenes',
    'images-easy': 'Logo, banner y fotos',
    media: 'Medios (imágenes)',
    'prem-header': 'Menú · cabecera',
    'prem-visibility': 'Ocultar secciones',
    'extra-seo': 'Buscadores · 8 páginas',
    'ticker-easy': 'Ticker & avisos',
    'ult-layout': 'Carga · pie · perfil',
    'ult-site-plus': 'Ajustes globales del sitio',
    'nav-footer': 'Menú & footer (legacy)',
    pages: 'Todas las páginas · textos hero',
    advanced: 'Copia de seguridad',
    dashboard: 'Dashboard',
    'prem-hub': 'Studio Premium',
    'ult-map': 'Mapa web',
    'cohesion-map': 'Mapa de la web',
    'ult-inicio-extra': 'Inicio · extras avanzados'
  };

  function head(title, desc) {
    return '<header class="cms-studio-section-head cms-studio-section-head--unified">' +
      '<h2>' + title + '</h2>' +
      (desc ? '<p>' + desc + '</p>' : '') +
    '</header>';
  }

  function backBar(pageId, pageLabel) {
    return '<div class="cms-studio-backbar">' +
      '<button type="button" class="cms-studio-back" data-goto="' + pageId + '">← ' + pageLabel + '</button>' +
    '</div>';
  }

  function ico(key, cls) {
    if (window.CMSStudioIcons && typeof window.CMSStudioIcons.render === 'function') {
      return window.CMSStudioIcons.render(key, cls) || '';
    }
    return '';
  }

  function pageCard(iconKey, title, desc, goto, tag) {
    var iconHtml = ico(iconKey, 'cms-ico--card') || ico(goto, 'cms-ico--card') || ico('spark', 'cms-ico--card');
    return '<button type="button" class="cms-page-card" data-goto="' + goto + '">' +
      '<span class="cms-page-card-icon" aria-hidden="true">' + iconHtml + '</span>' +
      '<span class="cms-page-card-body">' +
        '<strong>' + title + '</strong>' +
        '<span>' + desc + '</span>' +
      '</span>' +
      (tag ? '<span class="cms-page-card-tag">' + tag + '</span>' : '') +
      '<span class="cms-page-card-arrow" aria-hidden="true">→</span>' +
    '</button>';
  }

  function pageGrid(cards) {
    return '<div class="cms-page-grid">' + cards.join('') + '</div>';
  }

  function renderHome() {
    return head('LyokFox Studio', 'Edita tu web con vista previa. Portada premium: hero pro, spotlight, KP, calendario, disciplinas y noticias.') +
      C.helpBox('Flujo simple', '1) Elige <strong>página</strong> · 2) Edita a la izquierda · 3) Mira la <strong>vista previa</strong> en vivo a la derecha · 4) <strong>Guardar todo</strong>.', 'tip') +
      '<div class="cms-studio-hero-badge">' + ico('spark', 'cms-ico--badge') + ' STUDIO · EDICIÓN TOTAL</div>' +
      pageGrid([
        pageCard('home', 'Inicio', 'Portada premium, calendario y bloques', 'page-inicio'),
        pageCard('users', 'Equipos', 'Plantillas, fichas y staff', 'page-equipos'),
        pageCard('community', 'Comunidad', 'Misiones, tienda, juegos y KP', 'page-comunidad'),
        pageCard('news', 'Noticias', 'Artículos y portal', 'page-noticias'),
        pageCard('scroll', 'Historia', '10 capítulos completos', 'page-historia'),
        pageCard('briefcase', 'Sponsor', 'Patrocinio y paquetes', 'page-sponsor'),
        pageCard('mail', 'Contacto', 'Formulario y textos', 'page-contacto'),
        pageCard('user', 'Mi cuenta', 'Perfil y panel cabecera', 'page-cuenta')
      ]) +
      '<h3 class="cms-page-grid-label">Accesos rápidos</h3>' +
      pageGrid([
        pageCard('bolt', 'Edición rápida', 'Ticker, partido y portada en 2 min', 'quick', 'Popular'),
        pageCard('settings', 'Ajustes del sitio', 'Logo, menú, buscadores y visibilidad', 'settings-hub'),
        pageCard('database', 'Copia de seguridad', 'Descargar o restaurar', 'advanced')
      ]);
  }

  function renderPageInicio() {
    return backBar('studio-home', 'Inicio Studio') +
      head('Página Inicio', 'Hero portada pro + spotlight + KP + matchday + disciplinas + teaser noticias.') +
      pageGrid([
        pageCard('home', 'Portada · hero', 'Logo, stats, CTAs y spotlight', 'home', 'Principal'),
        pageCard('quick', 'Edición rápida', 'Ticker, partido y textos del hero', 'quick', 'Rápido'),
        pageCard('schedule', 'Calendario', 'Próximo partido y matchday', 'schedule'),
        pageCard('home-sections', 'Bloques inferiores', 'KP, marcas, juegos y noticias', 'home-sections'),
        pageCard('extra-inicio', 'Extras inicio', 'Panel partido y nota calendario', 'extra-inicio'),
        pageCard('ult-inicio-extra', 'Textos avanzados', 'Marcas, cabeceras y botones', 'ult-inicio-extra', 'Avanzado')
      ]) +
      C.helpBox('Ocultar bloques', 'Para mostrar u ocultar secciones de Inicio → <button type="button" class="cms-inline-link" data-goto="prem-visibility">Ocultar secciones</button> (pestaña Inicio).', 'info');
  }

  function renderPageEquipos() {
    return backBar('studio-home', 'Inicio Studio') +
      head('Página Equipos', 'Plantillas, textos de división y página pública.') +
      pageGrid([
        pageCard('teams', 'Fichas equipos', 'Tagline, about y stats por juego', 'teams', 'Principal'),
        pageCard('players', '43 Jugadores', 'Nombre, rol, bio y Twitter', 'players', 'Principal'),
        pageCard('extra-equipos', 'Textos página', 'Hero, chips, staff y CTA', 'extra-equipos'),
        pageCard('ult-equipos', 'UI avanzada', 'Divisiones y stats strip', 'ult-equipos', 'Avanzado')
      ]);
  }

  function renderPageComunidad() {
    return backBar('studio-home', 'Inicio Studio') +
      head('Página Comunidad', 'Hero premium + pestañas Redes, Tienda, Juegos, Predicciones, Misiones y Ranking.') +
      pageGrid([
        pageCard('extra-com-textos', 'Textos y pestañas', 'Arcade, predicciones, modales', 'extra-com-textos', 'Principal'),
        pageCard('community', 'Números globales', 'Miembros, KP y predicciones', 'community'),
        pageCard('comm-missions', 'Misiones KP', 'Recompensas diarias', 'comm-missions'),
        pageCard('comm-shop', 'Tienda premios', 'Camisetas, gorras, merch', 'comm-shop'),
        pageCard('ult-com-shop', 'Categorías tienda', 'Tiers y canjes', 'ult-com-shop', 'Avanzado'),
        pageCard('ult-com-games', 'Minijuegos', 'Arcade, ruleta y retos', 'ult-com-games'),
        pageCard('comm-social', 'Posts redes', 'Feed X, IG y Fans', 'comm-social'),
        pageCard('ult-com-social-plus', 'Recompensas IG/Fans', 'Puntos por seguir', 'ult-com-social-plus', 'Avanzado'),
        pageCard('extra-com-data', 'Logros & Quiz', 'Badges y preguntas', 'extra-com-data'),
        pageCard('comm-faq', 'FAQ', 'Preguntas frecuentes', 'comm-faq'),
        pageCard('comm-levels', 'Niveles KP', 'Rangos de la camada', 'comm-levels'),
        pageCard('comm-events', 'Eventos', 'Calendario camada', 'comm-events'),
        pageCard('comm-promo', 'Códigos promo', 'Cupones KP', 'comm-promo'),
        pageCard('comm-match', 'Predicciones', 'Partidos y stats', 'comm-match'),
        pageCard('ult-com-polls', 'Encuestas', '3 polls activas', 'ult-com-polls', 'Avanzado'),
        pageCard('ult-com-misc', 'Quotes y más', 'Milestones y leaderboard', 'ult-com-misc', 'Avanzado'),
        pageCard('ult-comunidad-ui', 'Hero comunidad', 'Banner, lead y pestañas', 'ult-comunidad-ui', 'Principal'),
      ]);
  }

  function renderPageNoticias() {
    return backBar('studio-home', 'Inicio Studio') +
      head('Página Noticias', 'Hero estilo Sponsor + breaking + feed con cards premium.') +
      pageGrid([
        pageCard('news', 'Artículos', 'Crear, editar y borrar noticias', 'news', 'Principal'),
        pageCard('extra-noticias', 'Portal', 'Breaking y búsqueda', 'extra-noticias'),
        pageCard('ult-noticias-ui', 'UI avanzada', 'Hero, lead y botones KP', 'ult-noticias-ui', 'Avanzado')
      ]);
  }

  function renderPageHistoria() {
    return backBar('studio-home', 'Inicio Studio') +
      head('Página Historia', 'La línea temporal del club en 10 capítulos.') +
      pageGrid([
        pageCard('historia-completa', '10 capítulos', 'Editor completo con hitos', 'historia-completa', 'Recomendado'),
        pageCard('history', 'Intro rápida', 'Chips y párrafos de origen', 'history'),
        pageCard('history-chapters', 'Capítulos simples', 'Título y cuerpo por capítulo', 'history-chapters', 'Legacy')
      ]) +
      C.helpBox('Consejo', 'Usa <strong>10 capítulos</strong> para editar todo. Los otros dos son atajos antiguos — no hace falta usarlos si ya usas el editor completo.', 'tip');
  }

  function renderPageSponsor() {
    return backBar('studio-home', 'Inicio Studio') +
      head('Página Sponsor', 'Patrocinio, paquetes y textos de cada bloque.') +
      pageGrid([
        pageCard('sponsor', 'Paquetes y cita', 'Precios y qué incluye', 'sponsor', 'Principal'),
        pageCard('prem-sponsor-texts', 'Textos secciones', 'Títulos y subtítulos por bloque', 'prem-sponsor-texts'),
        pageCard('sponsor-full', 'Datos avanzados', 'Hero stats y why join', 'sponsor-full'),
        pageCard('ult-sponsor-plus', 'Impacto y partners', 'Proceso, audiencia, entregables', 'ult-sponsor-plus', 'Avanzado')
      ]);
  }

  function renderPageContacto() {
    return backBar('studio-home', 'Inicio Studio') +
      head('Página Contacto', 'Formulario, asuntos y textos del hero.') +
      pageGrid([
        pageCard('contact', 'Contacto básico', 'Intro, email y temas', 'contact', 'Principal'),
        pageCard('extra-contacto', 'Formulario', 'Labels de campos y asuntos', 'extra-contacto'),
        pageCard('ult-contacto-ui', 'UI avanzada', 'Hero, CTA y tags', 'ult-contacto-ui', 'Avanzado')
      ]);
  }

  function renderPageCuenta() {
    return backBar('studio-home', 'Inicio Studio') +
      head('Página Mi cuenta', 'Formulario de perfil y menú lateral de la cabecera.') +
      pageGrid([
        pageCard('extra-cuenta', 'Cuenta completa', 'Pestañas, formulario y redes', 'extra-cuenta', 'Principal'),
        pageCard('extra-perfil', 'Panel perfil', 'Menú lateral al pulsar tu foto', 'extra-perfil'),
        pageCard('ult-cuenta-ui', 'UI avanzada', 'Hero y textos página', 'ult-cuenta-ui', 'Avanzado')
      ]);
  }

  function renderSettingsHub() {
    return backBar('studio-home', 'Inicio Studio') +
      head('Ajustes del sitio', 'Logo, menú, buscadores y qué se muestra en toda la web.') +
      pageGrid([
        pageCard('brand', 'Marca global', 'Nombre, email, KP y redes', 'brand', 'Principal'),
        pageCard('prem-icons', 'Iconos e imágenes', 'Logo, favicon, banner y juegos', 'prem-icons', 'Principal'),
        pageCard('prem-header', 'Menú y cabecera', 'Orden, nombres, ticker y pie', 'prem-header'),
        pageCard('prem-visibility', 'Ocultar secciones', 'Mostrar u ocultar bloques', 'prem-visibility'),
        pageCard('extra-seo', 'Buscadores (Google)', 'Título y descripción en 8 páginas', 'extra-seo'),
        pageCard('quick', 'Aviso en barra', 'Mensaje naranja de la cabecera', 'ticker-easy'),
        pageCard('pages', 'Textos de cada página', 'Título y descripción por página', 'pages'),
        pageCard('settings', 'Pie y carga', 'Pantalla de carga, pie y nota de perfil', 'ult-layout', 'Avanzado'),
        pageCard('settings', 'Ajustes generales', 'Etiquetas, equipos y textos globales', 'ult-site-plus', 'Avanzado')
      ]) +
      C.helpBox('Sin duplicar', 'Cada ajuste está en <strong>un solo sitio</strong>. El menú y el aviso naranja se editan en <em>Menú y cabecera</em>, no en Marca global.', 'tip');
  }

  var RENDERERS = {
    'studio-home': renderHome,
    'extra-hub': renderHome,
    'page-inicio': renderPageInicio,
    'page-equipos': renderPageEquipos,
    'page-comunidad': renderPageComunidad,
    'page-noticias': renderPageNoticias,
    'page-historia': renderPageHistoria,
    'page-sponsor': renderPageSponsor,
    'page-contacto': renderPageContacto,
    'page-cuenta': renderPageCuenta,
    'settings-hub': renderSettingsHub
  };

  function getTitle(id) {
    return SECTION_TITLES[id] || id;
  }

  var PARENT_SECTION = {
    home: 'page-inicio', quick: 'studio-home', schedule: 'page-inicio', 'extra-inicio': 'page-inicio',
    'home-sections': 'page-inicio', 'ult-inicio-extra': 'page-inicio',
    teams: 'page-equipos', players: 'page-equipos', 'extra-equipos': 'page-equipos', 'ult-equipos': 'page-equipos',
    'extra-com-textos': 'page-comunidad', community: 'page-comunidad', 'comm-missions': 'page-comunidad',
    'comm-shop': 'page-comunidad', 'ult-com-shop': 'page-comunidad', 'ult-com-games': 'page-comunidad',
    'comm-social': 'page-comunidad', 'ult-com-social-plus': 'page-comunidad', 'extra-com-data': 'page-comunidad',
    'comm-faq': 'page-comunidad', 'comm-levels': 'page-comunidad', 'comm-events': 'page-comunidad',
    'comm-promo': 'page-comunidad', 'comm-match': 'page-comunidad', 'ult-com-polls': 'page-comunidad',
    'ult-com-misc': 'page-comunidad', 'ult-comunidad-ui': 'page-comunidad',
    news: 'page-noticias', 'extra-noticias': 'page-noticias', 'ult-noticias-ui': 'page-noticias',
    'historia-completa': 'page-historia', history: 'page-historia', 'history-chapters': 'page-historia',
    sponsor: 'page-sponsor', 'prem-sponsor-texts': 'page-sponsor', 'sponsor-full': 'page-sponsor', 'ult-sponsor-plus': 'page-sponsor',
    contact: 'page-contacto', 'extra-contacto': 'page-contacto', 'ult-contacto-ui': 'page-contacto',
    'extra-cuenta': 'page-cuenta', 'extra-perfil': 'page-cuenta', 'ult-cuenta-ui': 'page-cuenta',
    brand: 'settings-hub', 'prem-icons': 'settings-hub', 'prem-header': 'settings-hub', 'prem-visibility': 'settings-hub',
    'extra-seo': 'settings-hub', 'ticker-easy': 'settings-hub', pages: 'settings-hub',
    'ult-layout': 'settings-hub', 'ult-site-plus': 'settings-hub', 'images-easy': 'settings-hub', media: 'settings-hub',
    guide: 'studio-home'
  };

  function getParent(id) {
    return PARENT_SECTION[id] || null;
  }

  function renderBackFor(id) {
    var parent = getParent(id);
    if (!parent) return '';
    var label = getTitle(parent);
    return backBar(parent, label);
  }

  function searchSections(q) {
    if (!q) return [];
    var hits = [];
    Object.keys(SECTION_TITLES).forEach(function (id) {
      var title = SECTION_TITLES[id].toLowerCase();
      if (title.indexOf(q) >= 0) hits.push(id);
    });
    var navParents = { 'page-inicio': 1, 'page-equipos': 1, 'page-comunidad': 1, 'page-noticias': 1, 'page-historia': 1, 'page-sponsor': 1, 'page-contacto': 1, 'page-cuenta': 1, 'settings-hub': 1, 'studio-home': 1, guide: 1, quick: 1, advanced: 1 };
    return hits.filter(function (id) { return !navParents[id]; });
  }

  window.CMSStudioUnified = {
    nav: UNIFIED_NAV,
    getTitle: getTitle,
    getParent: getParent,
    renderBackFor: renderBackFor,
    searchSections: searchSections,
    render: function (id) {
      var fn = RENDERERS[id];
      return fn ? fn() : null;
    },
    collect: function (o) { return o; },
    bind: function () {}
  };
})();
