(function () {
  var NAV_DEFAULTS = {
    inicio: { label: 'Inicio', extra: '' },
    comunidad: { label: 'Comunidad', extra: ' nav-hot' },
    noticias: { label: 'Noticias', extra: '' },
    historia: { label: 'Historia', extra: '' },
    equipos: { label: 'Equipos', extra: '' },
    sponsor: { label: 'Sponsor', extra: '' },
    contacto: { label: 'Contáctanos', extra: ' nav-cta' }
  };

  function getNavOrder() {
    if (typeof SITE !== 'undefined' && SITE.navOrder && SITE.navOrder.length) {
      return SITE.navOrder.slice();
    }
    return ['inicio', 'comunidad', 'noticias', 'historia', 'equipos', 'sponsor', 'contacto'];
  }

  function brandLogoSrc() {
    if (window.CMS && typeof window.CMS.defaultLogoUrl === 'function') return window.CMS.defaultLogoUrl();
    if (typeof LOGO !== 'undefined' && LOGO && String(LOGO).indexOf('[imagen') !== 0) return LOGO;
    if (typeof window.LYOKFOX_DEFAULT_LOGO !== 'undefined') return window.LYOKFOX_DEFAULT_LOGO;
    return 'img/logo.jpg';
  }

  function navLink(key, label, extra) {
    var href = SITE.pages[key];
    var active = document.body.dataset.page === key ? ' active' : '';
    var navLabel = (SITE.pageLabels && SITE.pageLabels[key]) ? SITE.pageLabels[key] : label;
    return '<a href="' + href + '" class="nav-link' + active + extra + '" data-nav-key="' + key + '" data-site-page="' + key + '">' + navLabel + '</a>';
  }

  function socialIcon(name) {
    if (typeof icon === 'function') return icon(name);
    return '';
  }

  function renderProfilePanel() {
    if (document.getElementById('profile-panel')) return;
    var loginUrl = SITE.pages.login || 'login.html';
    var cuentaUrl = SITE.pages.cuenta || 'cuenta.html';
    var commUrl = SITE.pages.comunidad || 'comunidad.html';
    var panel = document.createElement('div');
    panel.id = 'profile-panel';
    panel.className = 'profile-panel';
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML =
      '<div class="profile-panel-backdrop" id="profile-panel-close"></div>' +
      '<aside class="profile-panel-drawer" role="dialog" aria-label="Perfil camada">' +
        '<header class="profile-panel-head">' +
          '<div class="profile-panel-user">' +
            '<img src="" alt="" id="profile-panel-avatar" data-img="logo" class="profile-panel-avatar">' +
            '<div><strong id="profile-panel-nick">Invitado</strong><span id="profile-panel-level">Cachorro</span></div>' +
          '</div>' +
          '<button type="button" class="profile-panel-x" id="profile-panel-x" aria-label="Cerrar">×</button>' +
        '</header>' +
        '<div class="profile-panel-kp">' +
          '<span data-points-short>KP</span> <strong id="profile-panel-kp">0</strong>' +
          '<em id="profile-panel-streak">Racha 0</em>' +
        '</div>' +
        '<div class="profile-panel-body profile-panel-quick">' +
          '<p class="profile-panel-status" id="profile-panel-status">Sin sesión</p>' +
          '<div id="profile-panel-actions" class="profile-panel-actions"></div>' +
          '<nav class="profile-panel-links" aria-label="Accesos rápidos">' +
            '<a href="' + commUrl + '" data-site-page="comunidad">Zona Comunidad</a>' +
            '<a href="' + commUrl + '#tienda" data-site-page="comunidad">Tienda KP</a>' +
            '<a href="' + cuentaUrl + '" data-site-page="cuenta">Mi cuenta</a>' +
          '</nav>' +
        '</div>' +
      '</aside>';
    document.body.appendChild(panel);
  }

  function renderHeader() {
    var el = document.getElementById('site-header');
    if (!el) return;
    el.innerHTML =
      '<header class="header" id="header">' +
        '<div class="header-glow" aria-hidden="true"></div>' +
        '<div class="wrap header-inner">' +
          '<a href="' + SITE.pages.inicio + '" class="brand" data-site-page="inicio">' +
            '<img src="' + brandLogoSrc() + '" alt="LyokFox" data-img="logo">' +
            '<span>LYOK<span class="accent">FOX</span></span>' +
          '</a>' +
          '<button class="menu-btn" id="menuBtn" aria-label="Menú"><span></span><span></span><span></span></button>' +
          '<nav class="nav" id="nav">' +
            getNavOrder().map(function (key) {
              var d = NAV_DEFAULTS[key] || { label: key, extra: '' };
              return navLink(key, d.label, d.extra);
            }).join('') +
          '</nav>' +
          '<button type="button" class="header-profile-btn" id="headerProfileBtn" aria-label="Mi perfil camada">' +
            '<img src="' + brandLogoSrc() + '" alt="" class="header-profile-img" id="headerProfileImg" data-img="logo">' +
            '<span class="header-profile-kp" id="headerProfileKp">0</span>' +
          '</button>' +
          '<a href="' + (SITE.pages.login || 'login.html') + '" class="header-auth-link" id="headerAuthLink" data-site-page="login">Entrar</a>' +
        '</div>' +
      '</header>';
  }

  function renderFooter() {
    var el = document.getElementById('site-footer');
    if (!el) return;
    el.innerHTML =
      '<footer class="footer">' +
        '<div class="wrap footer-inner">' +
          '<a href="' + SITE.pages.inicio + '" class="brand" data-site-page="inicio">' +
            '<img src="' + brandLogoSrc() + '" alt="LyokFox" data-img="logo">' +
            '<span>LYOK<span class="accent">FOX</span></span>' +
          '</a>' +
          '<nav class="footer-nav">' +
            SITE.pageList.filter(function (p) { return p.key !== 'cuenta'; }).map(function (p) {
              return '<a href="' + p.href + '" data-nav-key="' + p.key + '" data-site-page="' + p.key + '">' + p.label + '</a>';
            }).join('') +
          '</nav>' +
          '<div class="footer-social">' +
            '<a href="' + SITE.pages.comunidad + '" data-site-page="comunidad" aria-label="Comunidad">' + socialIcon('star') + '</a>' +
            '<a href="' + SITE.social.twitter + '" target="_blank" rel="noopener" aria-label="X">' + socialIcon('x') + '</a>' +
            '<a href="' + SITE.social.fans + '" target="_blank" rel="noopener" aria-label="Fans">' + socialIcon('fox') + '</a>' +
            '<a href="' + SITE.social.instagram + '" target="_blank" rel="noopener" aria-label="Instagram">' + socialIcon('instagram') + '</a>' +
            '<a href="' + SITE.pages.equipos + '" data-site-page="equipos" aria-label="Equipos">' + socialIcon('teams') + '</a>' +
          '</div>' +
        '</div>' +
        '<p class="copy" data-cms-footer-copy>&copy; <span data-cms-copy-year>2020</span>–2025 LyokFox Esports · Est. 2020 · ' + SITE.tagline + '</p>' +
        '<p class="copy copy-links"><span class="site-origin"></span> · v' + SITE.build + '</p>' +
      '</footer>';
  }

  function renderLiveTicker() {
    if (document.body.classList.contains('home-minimal')) return;
    if (document.getElementById('site-live-ticker')) return;
    var anchor = document.getElementById('site-header');
    if (!anchor) return;
    var el = document.createElement('div');
    el.id = 'site-live-ticker';
    el.className = 'lyok-live-ticker';
    el.setAttribute('aria-label', 'Actividad en vivo');
    el.innerHTML =
      '<span class="lyok-live-badge" data-cms-live-badge>EN VIVO</span>' +
      '<div class="lyok-live-track">' +
        '<div class="ticker-track" id="site-live-ticker-track"></div>' +
      '</div>';
    anchor.insertAdjacentElement('afterend', el);
    document.body.classList.add('has-live-ticker');
    document.documentElement.classList.add('has-live-ticker');
  }

  function renderAmbient() {
    if (document.body.dataset.page !== 'inicio') return;
    if (document.body.classList.contains('home-minimal')) return;
    if (document.querySelector('.ambient-orbs')) return;
    var orbs = document.createElement('div');
    orbs.className = 'ambient-orbs';
    orbs.setAttribute('aria-hidden', 'true');
    orbs.innerHTML =
      '<span class="orb orb-1"></span><span class="orb orb-2"></span>' +
      '<span class="orb orb-3"></span><span class="orb orb-4"></span>';
    document.body.prepend(orbs);
  }

  function renderUltraFx() {
    if (document.body.classList.contains('lyok-ultra')) {
      if (!document.querySelector('.fx-mesh-bg')) {
        var mesh = document.createElement('div');
        mesh.className = 'fx-mesh-bg';
        mesh.setAttribute('aria-hidden', 'true');
        document.body.prepend(mesh);
      }
      return;
    }
    var hasFx = document.body.classList.contains('page-fx') ||
      document.body.dataset.page === 'inicio';
    if (hasFx) {
      document.body.classList.add('lyok-ultra');
      if (!document.querySelector('.fx-mesh-bg')) {
        var meshFx = document.createElement('div');
        meshFx.className = 'fx-mesh-bg';
        meshFx.setAttribute('aria-hidden', 'true');
        document.body.prepend(meshFx);
      }
    }
  }

  function bumpAssetCache() {
    if (!SITE.asset) return;
    document.querySelectorAll('link[rel="stylesheet"][href]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href.indexOf('http') === 0) return;
      if (href.indexOf('css/') !== 0 && href.indexOf('/css/') < 0) return;
      link.href = SITE.asset(href);
    });
    document.querySelectorAll('script[src]').forEach(function (node) {
      var src = node.getAttribute('src');
      if (!src || src.indexOf('http') === 0) return;
      if (src.indexOf('js/') !== 0 && src.indexOf('/js/') < 0) return;
      if (src.indexOf('config.js') >= 0) return;
      node.src = SITE.asset(src);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof SITE === 'undefined') return;
    bumpAssetCache();
    renderAmbient();
    renderUltraFx();
    renderHeader();
    renderLiveTicker();
    renderProfilePanel();
    renderFooter();
    if (typeof syncSiteLinks === 'function') syncSiteLinks();
    document.dispatchEvent(new CustomEvent('layout:ready'));
  });

  function refreshHeaderImages() {
    var src = brandLogoSrc();
    document.querySelectorAll('#site-header [data-img="logo"], #site-footer [data-img="logo"]').forEach(function (el) {
      el.src = src;
    });
  }

  document.addEventListener('cms:applied', function () {
    if (typeof SITE === 'undefined') return;
    renderHeader();
    renderFooter();
    if (window.CMS && typeof window.CMS.refreshImages === 'function') {
      window.CMS.refreshImages();
    } else {
      refreshHeaderImages();
    }
    if (typeof syncSiteLinks === 'function') syncSiteLinks();
    if (typeof initLiveTicker === 'function') initLiveTicker();
    if (window.LyokFoxProfile && typeof window.LyokFoxProfile.refresh === 'function') {
      var st = window.LyokFoxCommunity && window.LyokFoxCommunity.getState();
      if (st) window.LyokFoxProfile.refresh(st);
    }
    updateHeaderAuthLink();
  });

  function updateHeaderAuthLink() {
    var link = document.getElementById('headerAuthLink');
    if (!link) return;
    var auth = window.LyokFoxAuth;
    if (!auth || !auth.isConfigured()) {
      link.textContent = 'Entrar';
      link.href = (typeof SITE !== 'undefined' && SITE.pages.login) ? SITE.pages.login : 'login.html';
      return;
    }
    auth.getSession().then(function (session) {
      if (session) {
        link.textContent = 'Mi cuenta';
        link.href = (typeof SITE !== 'undefined' && SITE.pages.cuenta) ? SITE.pages.cuenta : 'cuenta.html';
      } else {
        link.textContent = 'Entrar';
        link.href = (typeof SITE !== 'undefined' && SITE.pages.login) ? SITE.pages.login : 'login.html';
      }
    });
  }

  window.updateHeaderAuthLink = updateHeaderAuthLink;

  (function loadAuthBundle() {
    if (document.body.dataset.page === 'login' || document.body.dataset.page === 'cuenta') return;
    document.addEventListener('DOMContentLoaded', function () {
      var s = document.createElement('script');
      s.src = SITE.asset ? SITE.asset('js/auth-bundle-loader.js') : 'js/auth-bundle-loader.js';
      document.body.appendChild(s);
    });
  })();
})();
