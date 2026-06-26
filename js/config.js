/* Configuración central — mismos enlaces en localhost y web pública */
var SITE = {
  name: 'LyokFox Esports',
  tagline: 'Vamos LyokFox',
  collective: 'camada',
  collectiveLabel: 'La camada kitsune',
  est: 2020,
  build: '2026.06.26-web',
  banner: 'img/banner-oficial.png',
  email: 'lyokfox@gmail.com',
  /* Solo referencia deploy — la web usa rutas relativas en todos los entornos */
  url: 'https://lyokfox.vercel.app',
  tickerBreaking: 'VPG Superliga vs Ventucorp · 2 jul 23:00 CEST · Predicciones abiertas en Comunidad',
  /* Moneda oficial Zona Comunidad */
  points: {
    name: 'Kitsune Points',
    short: 'KP',
    icon: '',
    badge: 'KP',
    motto: 'Juega, apoya y gana premios reales',
    tagline: 'La moneda oficial de la camada LyokFox'
  },
  teams: {
    clashRoyale: { label: 'Clash Royale', players: 10, captains: 2, tag: 'Ladder · CW · Torneos' },
    clubesPro: { label: 'Clubes Pro FC26', players: 25, captains: 0, tag: 'VPG · PLG · VFO' }
  },
  pageLabels: {
    inicio: 'Inicio',
    historia: 'Historia',
    equipos: 'Equipos',
    comunidad: 'Comunidad',
    noticias: 'Noticias',
    cuenta: 'Mi cuenta',
    sponsor: 'Sponsor',
    contacto: 'Contáctanos',
    login: 'Entrar'
  },
  pages: {
    inicio: 'index.html',
    historia: 'historia.html',
    equipos: 'equipos.html',
    comunidad: 'comunidad.html',
    noticias: 'noticias.html',
    cuenta: 'cuenta.html',
    login: 'login.html',
    sponsor: 'sponsor.html',
    contacto: 'contactanos.html'
  },
  social: {
    twitter: 'https://x.com/LyokFox_',
    twitterLegacy: 'https://x.com/LyokFox',
    instagram: 'https://instagram.com/lyokfox',
    fans: 'https://x.com/Lyokfox_Fans'
  },
  socialLabels: {
    twitter: '@LyokFox_ — Oficial',
    twitterLegacy: '@LyokFox — Cuenta histórica (7700+)',
    instagram: '@lyokfox — Instagram',
    fans: '@Lyokfox_Fans — Comunidad Indomables'
  },
  partners: {
    alphaWolfs: 'https://x.com/ALPHA___WOLFS',
    supercell: 'https://esports.brawlstars.com/'
  },
  leagues: {
    vpg: 'https://x.com/VPG_Spain',
    plg: 'https://x.com/PLG_Spain',
    vfo: 'https://x.com/VFOspain',
    impact: 'https://x.com/ImpactGame_es'
  },
  /* Solo referencia — la web usa rutas relativas iguales en todos los entornos */
  mirrors: [
    'https://lyokfox.vercel.app',
    'https://lyokfox-esports.vercel.app',
    'https://v0-sports-team-website.vercel.app'
  ],
  /* Orden unificado: menú, footer y listados */
  navOrder: ['inicio', 'comunidad', 'noticias', 'historia', 'equipos', 'sponsor', 'contacto']
};

SITE.pageList = SITE.navOrder.map(function (key) {
  return { key: key, href: SITE.pages[key], label: SITE.pageLabels[key] };
});

/* Cache-bust — misma versión en localhost y en todos los mirrors Vercel */
SITE.asset = function (path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  var base = String(path).split('?')[0];
  if (!SITE.build) return base;
  return base + '?v=' + encodeURIComponent(SITE.build);
};

SITE.host = function () {
  if (typeof window !== 'undefined' && window.location && window.location.host) {
    return window.location.host;
  }
  return SITE.url.replace(/^https?:\/\//, '');
};

SITE.origin = function () {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }
  return SITE.url.replace(/\/$/, '');
};

SITE.isLocalHost = function () {
  if (typeof window === 'undefined' || !window.location) return false;
  var h = window.location.hostname;
  return h === 'localhost' || h === '127.0.0.1' || h === '[::1]';
};

SITE.internalHosts = function () {
  var hosts = [];
  if (typeof window !== 'undefined' && window.location && window.location.host) {
    hosts.push(window.location.host);
  }
  (SITE.mirrors || []).forEach(function (m) {
    try { hosts.push(new URL(m).host); } catch (e) { /* ignore */ }
  });
  return hosts.filter(function (h, i, a) { return h && a.indexOf(h) === i; });
};

/* Rutas relativas — mismo comportamiento en localhost y online */
SITE.abs = function (path) {
  if (!path) return SITE.pages.inicio || 'index.html';
  if (/^https?:/i.test(path)) return path;
  return path.charAt(0) === '/' ? path.slice(1) : path;
};

SITE.pageAbs = function (key, suffix) {
  var page = SITE.pages[key];
  if (!page) return SITE.pages.inicio || 'index.html';
  return page + (suffix || '');
};

SITE.fullUrl = function (path) {
  var rel = SITE.abs(path);
  if (/^https?:/i.test(rel)) return rel;
  if (typeof window !== 'undefined' && window.location && window.location.href) {
    return new URL(rel, window.location.href).href;
  }
  return rel;
};

SITE.link = function (key, suffix) {
  return SITE.pageAbs(key, suffix || '');
};

SITE.isInternalHref = function (href) {
  if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0) return false;
  if (/^https?:\/\//i.test(href)) {
    try {
      var u = new URL(href);
      return SITE.internalHosts().indexOf(u.host) >= 0;
    } catch (e) { return false; }
  }
  var bare = href.split(/[?#]/)[0].replace(/^\//, '').replace(/\.html$/, '');
  return Object.keys(SITE.pages).some(function (key) {
    var p = SITE.pages[key];
    return href === p || href.indexOf(p + '?') === 0 || href.indexOf(p + '#') === 0 ||
      bare === p.replace(/\.html$/, '') || bare === key;
  });
};

/* Fuerza rutas tipo localhost: comunidad.html, nunca /comunidad ni dominio absoluto */
SITE.normalizeHref = function (href) {
  if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0) return href;
  if (/^https?:\/\//i.test(href)) {
    if (!SITE.isInternalHref(href)) return href;
    try {
      var u = new URL(href);
      href = u.pathname.replace(/^\//, '') + u.search + u.hash;
    } catch (e) { return href; }
  }
  if (href.charAt(0) === '/') href = href.slice(1);
  var hash = '';
  var query = '';
  var path = href;
  var hi = path.indexOf('#');
  var qi = path.indexOf('?');
  if (hi >= 0) { hash = path.slice(hi); path = path.slice(0, hi); }
  if (qi >= 0) { query = path.slice(qi); path = path.slice(0, qi); }
  path = path.replace(/\/$/, '');
  if (!path || path === 'index') path = 'index.html';
  var slug = path.replace(/\.html$/, '');
  var matched = false;
  Object.keys(SITE.pages).forEach(function (key) {
    if (matched) return;
    var p = SITE.pages[key];
    if (p === path || p.replace(/\.html$/, '') === slug || key === slug) {
      path = p;
      matched = true;
    }
  });
  if (!matched && path.indexOf('.') === -1 && path) path = path + '.html';
  return path + query + hash;
};

/* Supabase — clave anon pública (RLS protege datos). Debe estar en el repo para deploy GitHub. */
SITE.supabase = {
  url: 'https://paljzienuwokoifowjxf.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhbGp6aWVudXdva29pZm93anhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNzczNjIsImV4cCI6MjA5Nzc1MzM2Mn0.Udpd88jKmT8MIDCbO2VMws6F4RJNJEpm119c5zorvp4',
  enabled: true,
  cloudOnly: true
};

if (typeof window !== 'undefined') {
  window.SUPABASE_CONFIG = Object.assign({}, SITE.supabase, window.SUPABASE_CONFIG || {});
}
