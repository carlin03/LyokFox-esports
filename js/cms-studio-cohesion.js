/* Cohesión Studio ↔ Web — mapa y jugadores mejorados */
(function () {
  'use strict';
  if (typeof window.CMS === 'undefined') return;
  var C = window.CMS;

  var WEB_PAGES = [
    { page: 'Inicio', studio: 'prem-hub', sections: ['Hero minimal', 'Enlaces', 'Calendario', 'KP', 'Noticias'] },
    { page: 'Equipos', studio: 'players', sections: ['Hero', '3 divisiones', '43 jugadores', 'Staff'] },
    { page: 'Comunidad', studio: 'ult-comunidad-ui', sections: ['Hero premium', '6 pestañas', 'Misiones', 'Tienda', 'Juegos', 'Predicciones'] },
    { page: 'Noticias', studio: 'news', sections: ['Hero premium', 'Breaking', 'Feed artículos'] },
    { page: 'Historia', studio: 'historia-completa', sections: ['10 capítulos', 'Hitos', 'Nav'] },
    { page: 'Sponsor', studio: 'prem-sponsor-texts', sections: ['Textos secciones', 'Paquetes', 'Impacto'] },
    { page: 'Contacto', studio: 'ult-contacto-ui', sections: ['Hero', 'Formulario', 'CTA'] },
    { page: 'Mi cuenta', studio: 'ult-cuenta-ui', sections: ['Hero', 'Tabs', 'Perfil'] },
    { page: 'Global', studio: 'prem-header', sections: ['Menú', 'Ticker', 'Footer', 'Mostrar/ocultar'] }
  ];

  function renderCohesionMap() {
    var rows = WEB_PAGES.map(function (p) {
      return '<div class="cms-cohesion-row">' +
        '<div class="cms-cohesion-page"><strong>' + p.page + '</strong>' +
          '<button type="button" class="cms-inline-link" data-goto="' + p.studio + '">Abrir editor →</button></div>' +
        '<div class="cms-cohesion-sections">' + p.sections.map(function (s) {
          return '<span class="cms-cohesion-chip">' + s + '</span>';
        }).join('') + '</div></div>';
    }).join('');

    return '<header class="cms-studio-section-head cms-studio-section-head--easy">' +
      '<h2>Mapa web ↔ Studio</h2>' +
      '<p>Cada sección de la web tiene su editor. Empieza por <strong>Studio Premium</strong> o el mapa inferior.</p></header>' +
      C.helpBox('Studio Premium', 'Menú <strong>✦ Studio Premium</strong>: visibilidad, cabecera, sponsor completo y accesos rápidos.', 'tip') +
      '<div class="cms-cohesion-list">' + rows + '</div>' +
      '<div class="cms-task-grid" style="margin-top:24px">' +
        C.taskCard('👥', '43 Jugadores', 'Brawl · Clash · FC26', 'players') +
        C.taskCard('📜', 'Historia completa', '10 capítulos + hitos', 'historia-completa') +
        C.taskCard('📰', 'Noticias', 'Todos los artículos', 'news') +
        C.taskCard('🎯', 'Misiones KP', 'Comunidad', 'comm-missions') +
        C.taskCard('🛒', 'Tienda premios', 'Comunidad', 'comm-shop') +
        C.taskCard('📅', 'Calendario', 'Partidos', 'schedule') +
      '</div>';
  }

  function enhancePlayersRender() {
    if (typeof window.CMSStudio === 'undefined') return;
    var orig = null;
    /* Hook via wrapping - players uses cms-studio.js renderPlayers - we patch at open */
  }

  window.CMSStudioCohesion = {
    nav: [],
    render: function (id) {
      if (id === 'cohesion-map') return renderCohesionMap();
      if (id === 'ult-map') return renderCohesionMap();
      return null;
    },
    collect: function (o) { return o; },
    bind: function () {}
  };
})();
