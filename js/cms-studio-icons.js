/* LyokFox Studio — iconografía SVG (sin emojis) */
(function () {
  'use strict';

  var SVG_ATTR = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"';

  var PATHS = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    community: '<circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>',
    news: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>',
    scroll: '<path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
    brand: '<path d="M12 3c-1.5 2.5-4 4.5-4 8a4 4 0 0 0 8 0c0-3.5-2.5-5.5-4-8z"/><path d="M8 21h8"/><path d="M10 17h4"/>',
    pages: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
    gamepad: '<line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
    spark: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'
  };

  var SECTION_MAP = {
    'studio-home': 'grid', 'extra-hub': 'grid', dashboard: 'grid',
    guide: 'book', quick: 'bolt',
    'page-inicio': 'home', home: 'home', 'home-sections': 'layers',
    'page-equipos': 'users', teams: 'users', players: 'gamepad', 'extra-equipos': 'users', 'ult-equipos': 'users',
    'page-comunidad': 'community', community: 'community', 'comm-missions': 'target', 'comm-shop': 'cart',
    'extra-com-textos': 'community', 'ult-comunidad-ui': 'community',
    'page-noticias': 'news', news: 'news', 'extra-noticias': 'news', 'ult-noticias-ui': 'news',
    'page-historia': 'scroll', history: 'scroll', 'historia-completa': 'scroll', 'history-chapters': 'scroll',
    'page-sponsor': 'briefcase', sponsor: 'briefcase', 'prem-sponsor-texts': 'briefcase', 'sponsor-full': 'briefcase', 'ult-sponsor-plus': 'briefcase',
    'page-contacto': 'mail', contact: 'mail', 'extra-contacto': 'mail', 'ult-contacto-ui': 'mail',
    'page-cuenta': 'user', 'extra-cuenta': 'user', 'extra-perfil': 'user', 'ult-cuenta-ui': 'user',
    'settings-hub': 'settings', brand: 'brand', 'prem-header': 'settings', 'prem-visibility': 'eye',
    'prem-icons': 'image', media: 'image', 'images-easy': 'image',
    advanced: 'database', schedule: 'calendar', pages: 'pages',
    'extra-seo': 'spark', 'prem-hub': 'spark', 'ult-map': 'grid', 'cohesion-map': 'grid',
    'extra-inicio': 'layers', 'ult-inicio-extra': 'layers', 'ticker-easy': 'bolt',
    'extra-com-textos': 'community', 'extra-com-data': 'target', 'ult-com-shop': 'cart',
    'ult-com-games': 'gamepad', 'comm-social': 'community', 'ult-com-social-plus': 'community',
    'comm-faq': 'book', 'comm-levels': 'spark', 'comm-events': 'calendar', 'comm-promo': 'spark',
    'comm-match': 'target', 'ult-com-polls': 'community', 'ult-com-misc': 'spark',
    'extra-contacto': 'mail', 'extra-perfil': 'user', 'sponsor-full': 'briefcase',
    'ult-sponsor-plus': 'briefcase', 'ult-layout': 'settings', 'ult-site-plus': 'settings'
  };

  function logoSrc() {
    if (window.CMS && typeof window.CMS.defaultLogoUrl === 'function') return window.CMS.defaultLogoUrl();
    if (typeof window.LOGO !== 'undefined' && window.LOGO && String(window.LOGO).indexOf('[imagen') !== 0) return window.LOGO;
    return 'img/logo.jpg';
  }

  function svg(name, extraClass) {
    var path = PATHS[name];
    if (!path) return '';
    return '<span class="cms-ico' + (extraClass ? ' ' + extraClass : '') + '" aria-hidden="true">' +
      '<svg ' + SVG_ATTR + '>' + path + '</svg></span>';
  }

  function render(key, extraClass) {
    if (!key) return '';
    var name = SECTION_MAP[key] || key;
    if (PATHS[name]) return svg(name, extraClass);
    return '';
  }

  function brandHtml() {
    return '<span class="cms-studio-brand-mark" aria-hidden="true">' +
      '<img src="' + logoSrc() + '" alt="" class="cms-studio-logo-img" width="40" height="40" loading="lazy" decoding="async">' +
    '</span>';
  }

  function fabHtml() {
    return '<span class="cms-fab-glow" aria-hidden="true"></span>' +
      '<span class="cms-fab-inner">' +
        '<img src="' + logoSrc() + '" alt="" class="cms-fab-logo" width="28" height="28" loading="lazy" decoding="async">' +
        '<span class="cms-fab-label">Studio</span>' +
      '</span>';
  }

  window.CMSStudioIcons = {
    render: render,
    svg: svg,
    brandHtml: brandHtml,
    fabHtml: fabHtml,
    logoSrc: logoSrc,
    SECTION_MAP: SECTION_MAP
  };
})();
