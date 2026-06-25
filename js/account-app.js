(function () {
  'use strict';

  var GUEST_KEY = 'lyokfox_cuenta_guest';

  function getApi() { return window.LyokFoxCommunity || null; }
  function getAuth() { return window.LyokFoxAuth || null; }

  function loginUrl(mode) {
    var base = (typeof SITE !== 'undefined' && SITE.pages.login) ? SITE.pages.login : 'login.html';
    if (mode === 'register') return base + (base.indexOf('?') >= 0 ? '&' : '?') + 'mode=register';
    return base;
  }

  function cuentaUrl() {
    return (typeof SITE !== 'undefined' && SITE.pages.cuenta) ? SITE.pages.cuenta : 'cuenta.html';
  }

  function toast(msg) {
    var api = getApi();
    if (api && api.toast) { api.toast(msg); return; }
    var el = document.getElementById('toast');
    if (el) { el.textContent = msg; el.classList.add('show'); setTimeout(function () { el.classList.remove('show'); }, 4000); }
  }

  function getState() {
    var api = getApi();
    return api ? api.getState() : null;
  }

  function saveState(s) {
    var api = getApi();
    if (api) api.save(s);
  }

  function defaultProfile() {
    return { bio: '', avatar: '', twitter: '', instagram: '', country: 'ES', favoriteGame: 'brawlStars', publicRanking: true, createdAt: '' };
  }

  function ensureProfile(state) {
    if (!state.profile) state.profile = defaultProfile();
    return state;
  }

  function getLevel(lifetime) {
    if (typeof COMMUNITY === 'undefined' || !COMMUNITY.levels) return { name: 'Cachorro', icon: 'C' };
    var lv = COMMUNITY.levels[0];
    COMMUNITY.levels.forEach(function (l) { if (lifetime >= l.min) lv = l; });
    return lv;
  }

  function isGuestMode() {
    return sessionStorage.getItem(GUEST_KEY) === '1';
  }

  function showMemberArea(show) {
    var gate = document.getElementById('cuenta-auth-gate');
    var area = document.getElementById('cuenta-member-area');
    if (gate) gate.hidden = !!show;
    if (area) area.hidden = !show;
  }

  function refreshHeader(state) {
    if (!state) return;
    ensureProfile(state);
    var lv = getLevel(state.lifetime || 0);
    var nick = state.nickname || 'Invitado';
    var av = state.profile.avatar || '';
    var img = document.getElementById('headerProfileImg');
    var kp = document.getElementById('headerProfileKp');
    if (img) {
      if (av) img.src = av;
      else if (typeof LOGO !== 'undefined') img.src = LOGO;
    }
    if (kp) kp.textContent = (state.points || 0).toLocaleString('es-ES');
    var pn = document.getElementById('profile-panel-nick');
    var pl = document.getElementById('profile-panel-level');
    var pk = document.getElementById('profile-panel-kp');
    var ps = document.getElementById('profile-panel-streak');
    var pa = document.getElementById('profile-panel-avatar');
    if (pn) pn.textContent = nick;
    if (pl) pl.textContent = lv.name;
    if (pk) pk.textContent = (state.points || 0).toLocaleString('es-ES');
    if (ps) ps.textContent = 'Racha ' + (state.streak || 0) + ' · ' + (state.lifetime || 0).toLocaleString('es-ES') + ' KP total';
    if (pa) pa.src = av || (typeof LOGO !== 'undefined' ? LOGO : pa.src);
    refreshCuentaHero(state);
  }

  function refreshCuentaHero(state) {
    if (document.body.dataset.page !== 'cuenta') return;
    ensureProfile(state);
    var lv = getLevel(state.lifetime || 0);
    var nickEl = document.getElementById('cuenta-hero-nick');
    var badge = document.getElementById('cuenta-level-badge');
    var av = document.getElementById('cuenta-avatar-preview');
    var kpis = document.getElementById('cuenta-kpis');
    if (nickEl) nickEl.textContent = state.nickname || 'Invitado';
    if (badge) badge.textContent = lv.name;
    if (av) av.src = state.profile.avatar || (typeof LOGO !== 'undefined' ? LOGO : av.src);
    if (kpis) {
      kpis.innerHTML =
        '<span class="cuenta-kpi"><strong>' + (state.points || 0).toLocaleString('es-ES') + '</strong><span>KP disponibles</span></span>' +
        '<span class="cuenta-kpi"><strong>' + (state.lifetime || 0).toLocaleString('es-ES') + '</strong><span>KP total</span></span>' +
        '<span class="cuenta-kpi"><strong>' + (state.streak || 0) + '</strong><span>Racha días</span></span>';
    }
    fillCuentaForm(state);
    renderCuentaKpDash(state);
    renderXStatus(state);
  }

  function renderXStatus(state) {
    var el = document.getElementById('cuenta-x-status');
    if (!el) return;
    var tw = state.profile.twitter;
    if (tw) {
      el.innerHTML = '<p class="cuenta-x-connected">Conectado como <strong>@' + tw + '</strong></p>';
    } else {
      el.innerHTML = '<p class="cuenta-x-pending">Añade tu @ de X para aparecer en el ranking camada.</p>';
    }
  }

  function fillCuentaForm(state) {
    ensureProfile(state);
    var p = state.profile;
    var set = function (id, v) { var el = document.getElementById(id); if (el) el.value = v == null ? '' : v; };
    var chk = function (id, v) { var el = document.getElementById(id); if (el) el.checked = !!v; };
    set('fld-nickname', state.nickname);
    set('fld-bio', p.bio);
    set('fld-country', p.country || 'ES');
    set('fld-favorite', p.favoriteGame || 'brawlStars');
    set('fld-avatar', p.avatar);
    set('fld-twitter', p.twitter);
    set('fld-instagram', p.instagram);
    chk('fld-public-ranking', p.publicRanking !== false);
  }

  function renderCuentaKpDash(state) {
    var el = document.getElementById('cuenta-kp-dash');
    if (!el) return;
    var lv = getLevel(state.lifetime || 0);
    var next = COMMUNITY.levels.find(function (l) { return l.min > (state.lifetime || 0); });
    var pct = next ? Math.min(100, Math.round(((state.lifetime || 0) / next.min) * 100)) : 100;
    el.innerHTML =
      '<div class="cuenta-kp-card">' +
        '<span class="kp-mark">KP</span>' +
        '<div><strong>' + (state.points || 0).toLocaleString('es-ES') + '</strong><em>Disponibles · Nivel ' + lv.name + '</em></div>' +
      '</div>' +
      '<div class="cuenta-kp-progress"><span>Progreso a ' + (next ? next.name : 'máximo') + '</span><div class="bar"><i style="width:' + pct + '%"></i></div></div>';
  }

  function saveProfileFromForm() {
    var state = getState();
    if (!state) return Promise.reject(new Error('Sin estado local'));
    ensureProfile(state);
    var nick = (document.getElementById('fld-nickname').value || '').trim().slice(0, 18);
    if (nick.length < 2) { toast('Apodo mínimo 2 caracteres'); return Promise.reject(); }
    state.nickname = nick;
    state.profile.bio = (document.getElementById('fld-bio').value || '').trim().slice(0, 160);
    state.profile.country = document.getElementById('fld-country').value;
    state.profile.favoriteGame = document.getElementById('fld-favorite').value;
    state.profile.avatar = (document.getElementById('fld-avatar').value || '').trim();
    var pub = document.getElementById('fld-public-ranking');
    if (pub) state.profile.publicRanking = pub.checked;
    if (!state.profile.createdAt) state.profile.createdAt = new Date().toISOString();
    saveState(state);
    refreshHeader(state);
    var sync = window.LyokFoxCamadaSync;
    if (sync && getAuth() && getAuth().isConfigured()) {
      return getAuth().getSession().then(function (s) {
        if (!s) return state;
        return sync.pushToCloud().then(function () { return state; });
      });
    }
    return Promise.resolve(state);
  }

  function updatePanelActions(session) {
    var actions = document.getElementById('profile-panel-actions');
    var status = document.getElementById('profile-panel-status');
    if (!actions) return;

    var auth = getAuth();
    var configured = auth && auth.isConfigured();
    var loggedIn = !!(session && session.user);
    var guest = isGuestMode();

    if (loggedIn) {
      if (status) status.textContent = 'Sesión: ' + (session.user.email || 'camada');
      actions.innerHTML =
        '<a href="' + cuentaUrl() + '" class="btn btn-primary btn-full" data-site-page="cuenta">Mi cuenta</a>' +
        '<button type="button" class="btn btn-glass btn-full" id="profile-panel-sync">Sincronizar KP</button>' +
        '<button type="button" class="btn btn-glass btn-full cuenta-danger" id="profile-panel-logout">Cerrar sesión</button>';
      var syncBtn = document.getElementById('profile-panel-sync');
      if (syncBtn) syncBtn.onclick = function () {
        if (window.LyokFoxCamadaSync) {
          window.LyokFoxCamadaSync.syncBidirectional().then(function () {
            toast('Sincronizado');
            var s = getState();
            if (s) refreshHeader(s);
          }).catch(function (e) { toast(e.message || 'Error sync'); });
        }
      };
      var out = document.getElementById('profile-panel-logout');
      if (out) out.onclick = function () {
        auth.signOut().then(function () {
          sessionStorage.removeItem(GUEST_KEY);
          toast('Sesión cerrada');
          updatePanelActions(null);
          if (typeof window.updateHeaderAuthLink === 'function') window.updateHeaderAuthLink();
        });
      };
      return;
    }

    if (guest) {
      if (status) status.textContent = 'Modo invitado · solo este dispositivo';
      actions.innerHTML =
        '<a href="' + cuentaUrl() + '" class="btn btn-primary btn-full" data-site-page="cuenta">Editar perfil local</a>' +
        '<a href="' + loginUrl() + '" class="btn btn-glass btn-full">Iniciar sesión</a>';
      return;
    }

    if (status) {
      status.textContent = configured
        ? 'Sin sesión — crea cuenta para sincronizar'
        : 'Modo local — inicia sesión cuando configures la nube';
    }
    actions.innerHTML =
      '<a href="' + loginUrl() + '" class="btn btn-primary btn-full">Iniciar sesión</a>' +
      '<a href="' + loginUrl('register') + '" class="btn btn-glass btn-full">Crear cuenta</a>';
  }

  function renderSessionBar(session, guest) {
    var bar = document.getElementById('cuenta-session-bar');
    if (!bar) return;
    var login = loginUrl();

    if (session && session.user) {
      bar.className = 'cuenta-session-bar is-cloud wrap';
      bar.innerHTML =
        '<p>Sesión activa · <strong>' + (session.user.email || 'camada') + '</strong></p>' +
        '<div class="cuenta-session-actions">' +
          '<button type="button" class="btn btn-glass btn-sm" id="cuenta-sync-btn">Sincronizar</button>' +
          '<button type="button" class="btn btn-glass btn-sm cuenta-danger" id="cuenta-logout-btn">Cerrar sesión</button>' +
        '</div>';
      document.getElementById('cuenta-sync-btn').onclick = function () {
        if (window.LyokFoxCamadaSync) {
          window.LyokFoxCamadaSync.syncBidirectional().then(function () {
            toast('Sincronizado');
            var s = getState();
            if (s) refreshCuentaHero(s);
          });
        }
      };
      document.getElementById('cuenta-logout-btn').onclick = function () {
        getAuth().signOut().then(function () {
          sessionStorage.removeItem(GUEST_KEY);
          toast('Sesión cerrada');
          location.reload();
        });
      };
    } else if (guest) {
      bar.className = 'cuenta-session-bar is-guest wrap';
      bar.innerHTML =
        '<p>Modo invitado — KP solo en este navegador.</p>' +
        '<div class="cuenta-session-actions">' +
          '<a href="' + login + '" class="btn btn-primary btn-sm">Iniciar sesión</a>' +
          '<a href="' + loginUrl('register') + '" class="btn btn-glass btn-sm">Crear cuenta</a>' +
        '</div>';
    } else {
      bar.hidden = true;
    }

    renderAccountTab(session, guest);
  }

  function renderAccountTab(session, guest) {
    var emailEl = document.getElementById('cuenta-account-email');
    var actions = document.getElementById('cuenta-account-actions');
    if (!emailEl || !actions) return;

    if (session && session.user) {
      emailEl.textContent = 'Conectado como ' + (session.user.email || 'usuario');
      actions.innerHTML =
        '<button type="button" class="btn btn-glass btn-sm" id="cuenta-tab-sync">Sincronizar ahora</button>' +
        '<button type="button" class="btn btn-glass btn-sm cuenta-danger" id="cuenta-tab-logout">Cerrar sesión</button>';
      document.getElementById('cuenta-tab-sync').onclick = function () {
        if (window.LyokFoxCamadaSync) {
          window.LyokFoxCamadaSync.syncBidirectional().then(function () { toast('Sincronizado'); });
        }
      };
      document.getElementById('cuenta-tab-logout').onclick = function () {
        getAuth().signOut().then(function () { location.reload(); });
      };
    } else if (guest) {
      emailEl.textContent = 'Sin cuenta en la nube — progreso local únicamente.';
      actions.innerHTML =
        '<a href="' + loginUrl() + '" class="btn btn-primary btn-sm">Iniciar sesión</a>' +
        '<a href="' + loginUrl('register') + '" class="btn btn-glass btn-sm">Crear cuenta</a>';
    } else {
      emailEl.textContent = 'Inicia sesión para sincronizar tu perfil.';
      actions.innerHTML =
        '<a href="' + loginUrl() + '" class="btn btn-primary btn-sm">Iniciar sesión</a>' +
        '<a href="' + loginUrl('register') + '" class="btn btn-glass btn-sm">Crear cuenta</a>';
    }
  }

  function initCuentaGate() {
    if (document.body.dataset.page !== 'cuenta') return;

    var guestBtn = document.getElementById('cuenta-guest-btn');
    if (guestBtn && !guestBtn.dataset.bound) {
      guestBtn.dataset.bound = '1';
      guestBtn.addEventListener('click', function () {
        sessionStorage.setItem(GUEST_KEY, '1');
        showMemberArea(true);
        renderSessionBar(null, true);
        var state = getState();
        if (state) refreshCuentaHero(state);
      });
    }

    var auth = getAuth();
    var guest = isGuestMode();

    function enterMember(session) {
      if (session || guest) {
        showMemberArea(true);
        renderSessionBar(session, guest && !session);
        if (session && window.LyokFoxCamadaSync) {
          window.LyokFoxCamadaSync.syncBidirectional().catch(function () { /* offline */ });
        }
        var state = getState();
        if (state) refreshCuentaHero(state);
      } else {
        showMemberArea(false);
      }
      updatePanelActions(session);
    }

    if (!auth || !auth.isConfigured()) {
      enterMember(null);
      return;
    }

    auth.getSession().then(function (session) {
      if (session) sessionStorage.removeItem(GUEST_KEY);
      enterMember(session);
    });
  }

  function openPanel() {
    var panel = document.getElementById('profile-panel');
    if (!panel) return;
    var auth = getAuth();
    if (auth && auth.isConfigured()) {
      auth.getSession().then(function (session) {
        updatePanelActions(session);
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    } else {
      updatePanelActions(null);
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closePanel() {
    var panel = document.getElementById('profile-panel');
    if (!panel) return;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initCuentaTabs() {
    document.querySelectorAll('.cuenta-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.cuenta-tab').forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.cuenta-panel').forEach(function (p) { p.hidden = true; p.classList.remove('active'); });
        tab.classList.add('active');
        var panel = document.getElementById('tab-' + tab.dataset.tab);
        if (panel) { panel.hidden = false; panel.classList.add('active'); }
      });
    });
  }

  function initForms() {
    var fc = document.getElementById('cuenta-form-perfil');
    if (fc) {
      fc.addEventListener('submit', function (e) {
        e.preventDefault();
        saveProfileFromForm().then(function () { toast('Perfil guardado'); }).catch(function () {});
      });
    }

    var fcx = document.getElementById('cuenta-form-x');
    if (fcx) {
      fcx.addEventListener('submit', function (e) {
        e.preventDefault();
        var state = getState();
        if (!state) return;
        ensureProfile(state);
        state.profile.twitter = (document.getElementById('fld-twitter').value || '').replace(/^@/, '').trim();
        state.profile.instagram = (document.getElementById('fld-instagram').value || '').replace(/^@/, '').trim();
        saveState(state);
        refreshHeader(state);
        if (window.LyokFoxCamadaSync && getAuth() && getAuth().isConfigured()) {
          getAuth().getSession().then(function (s) {
            if (s) window.LyokFoxCamadaSync.pushToCloud().then(function () { toast('Redes guardadas'); });
            else toast('Redes guardadas (local)');
          });
        } else toast('Redes guardadas');
      });
    }

    function downloadProfileBackup(state) {
      var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/octet-stream' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'lyokfox-camada.lyokfox-camada';
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast('Copia descargada');
    }

    var exp = document.getElementById('btn-export');
    if (exp && !exp.dataset.bound) {
      exp.dataset.bound = '1';
      exp.addEventListener('click', function () {
        var state = getState();
        if (state) downloadProfileBackup(state);
      });
    }

    var input = document.getElementById('btn-import');
    if (input && !input.dataset.bound) {
      input.dataset.bound = '1';
      input.addEventListener('change', function () {
        var file = input.files && input.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            saveState(JSON.parse(reader.result));
            toast('Datos restaurados');
            location.reload();
          } catch (e) { toast('Archivo no válido'); }
        };
        reader.readAsText(file);
        input.value = '';
      });
    }

    var reset = document.getElementById('btn-reset');
    if (reset && !reset.dataset.bound) {
      reset.dataset.bound = '1';
      reset.addEventListener('click', function () {
        if (!confirm('¿Borrar todo el progreso KP local?')) return;
        if (typeof COMMUNITY !== 'undefined') localStorage.removeItem(COMMUNITY.storageKey);
        location.reload();
      });
    }
  }

  function initProfile() {
    if (window._lyokProfileInited) return;
    window._lyokProfileInited = true;

    document.addEventListener('click', function (e) {
      if (e.target.closest('#headerProfileBtn')) {
        openPanel();
      }
      if (e.target.closest('#profile-panel-close') || e.target.closest('#profile-panel-x')) closePanel();
    });

    initCuentaTabs();
    initForms();
    initCuentaGate();

    var state = getState();
    if (state) refreshHeader(state);

    var auth = getAuth();
    if (auth && auth.isConfigured()) {
      auth.getSession().then(function (session) {
        updatePanelActions(session);
      });
      auth.onAuthStateChange(function () {
        auth.getSession().then(function (session) {
          updatePanelActions(session);
          if (typeof window.updateHeaderAuthLink === 'function') window.updateHeaderAuthLink();
        });
      });
    } else {
      updatePanelActions(null);
    }
  }

  window.LyokFoxProfile = { refresh: refreshHeader, open: openPanel, close: closePanel };

  document.addEventListener('layout:ready', function () {
    setTimeout(initProfile, 50);
  });
})();
