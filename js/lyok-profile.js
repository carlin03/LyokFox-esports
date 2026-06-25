/* LyokFox — Perfil camada (login, registro, ver y editar) */
(function () {
  'use strict';

  var USERS_KEY = 'lyokfox-profile-users';
  var SESSION_KEY = 'lyokfox-profile-session';
  var ROLES = [
    { id: 'fan', label: 'Fan naranja' },
    { id: 'jugador', label: 'Jugador' },
    { id: 'staff', label: 'Staff' },
    { id: 'directiva', label: 'Directiva' }
  ];
  var AVATAR_PRESETS = [
    { id: 'logo', src: 'img/logo.jpg', label: 'Logo LyokFox' },
    { id: 'banner', src: 'img/banner-oficial.png', label: 'Banner club' }
  ];

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function texts() {
    return (typeof LYOK_DATA !== 'undefined' && LYOK_DATA.cuentaPage) ? LYOK_DATA.cuentaPage : {};
  }

  function games() {
    return texts().games || ['Clash Royale', 'Clubes Pro FC26'];
  }

  function toast(msg) {
    var el = document.getElementById('cuenta-toast') || document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(function () { el.classList.remove('show'); }, 4000);
  }

  function loadUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
    catch (e) { return []; }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function hashPass(pw) {
    var h = 5381;
    for (var i = 0; i < pw.length; i++) h = ((h << 5) + h) + pw.charCodeAt(i);
    return 'lf' + (h >>> 0).toString(36);
  }

  function getSessionEmail() {
    try {
      var s = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      return s && s.email ? String(s.email).toLowerCase() : null;
    } catch (e) { return null; }
  }

  function setSession(email) {
    if (email) sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: String(email).toLowerCase() }));
    else sessionStorage.removeItem(SESSION_KEY);
    notifyNav();
  }

  function currentUser() {
    var email = getSessionEmail();
    if (!email) return null;
    return loadUsers().find(function (u) { return u.email === email; }) || null;
  }

  function isLoggedIn() {
    return !!currentUser();
  }

  function register(data) {
    var email = String(data.email || '').trim().toLowerCase();
    var password = String(data.password || '');
    var nickname = String(data.nickname || '').trim();
    if (!email || !password || !nickname) {
      return { ok: false, error: 'Completa apodo, email y contraseña.' };
    }
    if (password.length < 6) {
      return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
    }
    if (nickname.length < 2) {
      return { ok: false, error: 'El apodo debe tener al menos 2 caracteres.' };
    }
    var users = loadUsers();
    if (users.some(function (u) { return u.email === email; })) {
      return { ok: false, error: 'Ese email ya tiene cuenta. Inicia sesión.' };
    }
    var user = {
      email: email,
      nickname: nickname.slice(0, 18),
      password: hashPass(password),
      avatar: '',
      bio: '',
      favoriteGame: data.favoriteGame || games()[0],
      role: 'fan',
      twitter: '',
      instagram: '',
      discord: '',
      created: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
    setSession(email);
    return { ok: true, user: user };
  }

  function login(email, password) {
    var e = String(email || '').trim().toLowerCase();
    var user = loadUsers().find(function (u) { return u.email === e; });
    if (!user || user.password !== hashPass(String(password || ''))) {
      return { ok: false, error: 'Email o contraseña incorrectos.' };
    }
    setSession(e);
    return { ok: true, user: user };
  }

  function logout() {
    setSession(null);
    return { ok: true };
  }

  function updateProfile(patch) {
    var user = currentUser();
    if (!user) return { ok: false, error: 'No has iniciado sesión.' };
    var users = loadUsers();
    var idx = users.findIndex(function (u) { return u.email === user.email; });
    if (idx < 0) return { ok: false, error: 'Cuenta no encontrada.' };
    if (patch.nickname != null) users[idx].nickname = String(patch.nickname).trim().slice(0, 18);
    if (patch.bio != null) users[idx].bio = String(patch.bio).trim().slice(0, 240);
    if (patch.favoriteGame != null) users[idx].favoriteGame = patch.favoriteGame;
    if (patch.role != null) users[idx].role = patch.role;
    if (patch.twitter != null) users[idx].twitter = String(patch.twitter).replace(/^@/, '').trim().slice(0, 32);
    if (patch.instagram != null) users[idx].instagram = String(patch.instagram).replace(/^@/, '').trim().slice(0, 32);
    if (patch.discord != null) users[idx].discord = String(patch.discord).trim().slice(0, 40);
    if (patch.avatar != null) {
      var av = String(patch.avatar);
      if (!av) users[idx].avatar = '';
      else if (av.length <= 120000) users[idx].avatar = av;
      else return { ok: false, error: 'La imagen es demasiado grande. Prueba otra más pequeña.' };
    }
    saveUsers(users);
    notifyNav();
    return { ok: true, user: users[idx] };
  }

  function notifyNav() {
    if (typeof window.lyokRefreshNav === 'function') window.lyokRefreshNav();
    else if (typeof window.renderHeader === 'function') window.renderHeader();
  }

  function gameOptions(selected) {
    return games().map(function (g) {
      return '<option value="' + esc(g) + '"' + (selected === g ? ' selected' : '') + '>' + esc(g) + '</option>';
    }).join('');
  }

  function roleOptions(selected) {
    var roleLabels = texts().profileRoles || {};
    return ROLES.map(function (r) {
      var label = roleLabels[r.id] || r.label;
      return '<option value="' + r.id + '"' + ((selected || 'fan') === r.id ? ' selected' : '') + '>' + esc(label) + '</option>';
    }).join('');
  }

  function roleLabel(id) {
    var roleLabels = texts().profileRoles || {};
    var found = ROLES.find(function (r) { return r.id === id; });
    return roleLabels[id] || (found ? found.label : 'Fan naranja');
  }

  function memberSince(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  }

  function avatarInner(user) {
    if (user.avatar) {
      return '<img src="' + esc(user.avatar) + '" alt="" class="cuenta-avatar-img" id="profile-avatar-img">';
    }
    var initial = (user.nickname || 'L').charAt(0).toUpperCase();
    return '<span class="cuenta-avatar-initial" id="profile-avatar-initial">' + esc(initial) + '</span>';
  }

  function resizeImageFile(file, cb) {
    if (!file || !file.type || file.type.indexOf('image/') !== 0) {
      cb({ ok: false, error: 'Selecciona un archivo de imagen (JPG, PNG, WebP).' });
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      cb({ ok: false, error: 'La imagen pesa demasiado (máx. 4 MB).' });
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var size = 160;
        var canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        var ctx = canvas.getContext('2d');
        var min = Math.min(img.width, img.height);
        var sx = (img.width - min) / 2;
        var sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        var data = canvas.toDataURL('image/jpeg', 0.86);
        if (data.length > 120000) {
          data = canvas.toDataURL('image/jpeg', 0.72);
        }
        if (data.length > 120000) {
          cb({ ok: false, error: 'No se pudo comprimir la imagen. Prueba otra más pequeña.' });
          return;
        }
        cb({ ok: true, data: data });
      };
      img.onerror = function () { cb({ ok: false, error: 'No se pudo leer la imagen.' }); };
      img.src = reader.result;
    };
    reader.onerror = function () { cb({ ok: false, error: 'Error al leer el archivo.' }); };
    reader.readAsDataURL(file);
  }

  function setTab(mode) {
    document.querySelectorAll('[data-profile-tab]').forEach(function (btn) {
      var on = btn.getAttribute('data-profile-tab') === mode;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    var login = document.getElementById('profile-form-login');
    var reg = document.getElementById('profile-form-register');
    if (login) login.hidden = mode !== 'login';
    if (reg) reg.hidden = mode !== 'register';
  }

  function bindTabs(root) {
    root.querySelectorAll('[data-profile-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTab(btn.getAttribute('data-profile-tab'));
      });
    });
  }

  function bindLoginForm(root) {
    var form = root.querySelector('#profile-form-login');
    if (!form || form.dataset.bound) return;
    form.dataset.bound = '1';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = root.querySelector('#profile-login-error');
      if (err) err.textContent = '';
      var fd = new FormData(form);
      var res = login(fd.get('email'), fd.get('password'));
      if (!res.ok) {
        if (err) err.textContent = res.error;
        return;
      }
      toast('¡Bienvenido, ' + res.user.nickname + '!');
      renderCuenta(root);
    });
  }

  function bindRegisterForm(root) {
    var form = root.querySelector('#profile-form-register');
    if (!form || form.dataset.bound) return;
    form.dataset.bound = '1';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = root.querySelector('#profile-register-error');
      if (err) err.textContent = '';
      var fd = new FormData(form);
      var res = register({
        nickname: fd.get('nickname'),
        email: fd.get('email'),
        password: fd.get('password'),
        favoriteGame: fd.get('favoriteGame')
      });
      if (!res.ok) {
        if (err) err.textContent = res.error;
        return;
      }
      toast('Perfil creado — ¡bienvenido a la camada!');
      renderCuenta(root);
    });
  }

  function bindAvatarPicker(root) {
    var toggle = root.querySelector('#profile-avatar-toggle');
    var panel = root.querySelector('#profile-avatar-panel');
    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        var open = !panel.hidden;
        panel.hidden = open;
        toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      });
    }

    var urlBtn = root.querySelector('#profile-avatar-url-btn');
    var urlInput = root.querySelector('#profile-avatar-url');
    if (urlBtn && urlInput) {
      urlBtn.addEventListener('click', function () {
        var url = urlInput.value.trim();
        if (!url) { toast('Pega una URL de imagen'); return; }
        var res = updateProfile({ avatar: url });
        if (!res.ok) { toast(res.error); return; }
        toast('Foto de perfil actualizada');
        renderCuenta(root);
      });
    }

    var fileInput = root.querySelector('#profile-avatar-file');
    if (fileInput) {
      fileInput.addEventListener('change', function () {
        var file = fileInput.files && fileInput.files[0];
        if (!file) return;
        resizeImageFile(file, function (r) {
          if (!r.ok) { toast(r.error); fileInput.value = ''; return; }
          var res = updateProfile({ avatar: r.data });
          if (!res.ok) { toast(res.error); return; }
          toast('Foto subida correctamente');
          renderCuenta(root);
        });
      });
    }

    root.querySelectorAll('[data-avatar-preset]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var src = btn.getAttribute('data-avatar-preset');
        var res = updateProfile({ avatar: src });
        if (!res.ok) { toast(res.error); return; }
        toast('Avatar actualizado');
        renderCuenta(root);
      });
    });

    var removeBtn = root.querySelector('#profile-avatar-remove');
    if (removeBtn) {
      removeBtn.addEventListener('click', function () {
        updateProfile({ avatar: '' });
        toast('Foto eliminada — se usa tu inicial');
        renderCuenta(root);
      });
    }
  }

  function bindProfileForm(root) {
    var form = root.querySelector('#profile-edit-form');
    if (!form || form.dataset.bound) return;
    form.dataset.bound = '1';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var res = updateProfile({
        nickname: fd.get('nickname'),
        bio: fd.get('bio'),
        favoriteGame: fd.get('favoriteGame'),
        role: fd.get('role'),
        twitter: fd.get('twitter'),
        instagram: fd.get('instagram'),
        discord: fd.get('discord')
      });
      if (!res.ok) {
        toast(res.error);
        return;
      }
      toast('Perfil guardado');
      var ok = root.querySelector('#profile-save-ok');
      if (ok) {
        ok.hidden = false;
        setTimeout(function () { ok.hidden = true; }, 2500);
      }
      renderCuenta(root);
    });

    var out = root.querySelector('#profile-logout-btn');
    if (out) {
      out.addEventListener('click', function () {
        logout();
        toast('Sesión cerrada');
        renderCuenta(root);
      });
    }

    bindAvatarPicker(root);
  }

  function renderGuest(root) {
    var t = texts();
    root.innerHTML =
      '<div class="cuenta-hub">' +
        '<div class="auth-warn auth-warn--local">Tu perfil se guarda en este navegador. Puedes crear cuenta, entrar y editarla cuando quieras.</div>' +
        '<div class="auth-mode-pick auth-mode-pick--gate" role="tablist">' +
          '<button type="button" class="auth-mode-card active" data-profile-tab="login" role="tab" aria-selected="true">' +
            '<span class="auth-mode-icon" aria-hidden="true">→</span><strong>' + esc(t.loginTitle || 'Iniciar sesión') + '</strong><em>Ya tengo cuenta</em></button>' +
          '<button type="button" class="auth-mode-card auth-mode-card--accent" data-profile-tab="register" role="tab" aria-selected="false">' +
            '<span class="auth-mode-icon auth-mode-icon--new" aria-hidden="true">+</span><strong>' + esc(t.registerTitle || 'Crear perfil') + '</strong><em>Registro nuevo</em></button>' +
        '</div>' +
        '<div class="cuenta-hub-card card">' +
          '<form id="profile-form-login" class="auth-form cuenta-hub-form" autocomplete="on">' +
            '<label class="auth-field"><span>' + esc(t.loginEmail || 'Email') + '</span><input type="email" name="email" required autocomplete="email" placeholder="tu@email.com"></label>' +
            '<label class="auth-field"><span>' + esc(t.loginPassword || 'Contraseña') + '</span><input type="password" name="password" required minlength="6" autocomplete="current-password" placeholder="Mínimo 6 caracteres"></label>' +
            '<p class="form-error" id="profile-login-error" aria-live="polite"></p>' +
            '<button type="submit" class="btn btn-primary btn-full">' + esc(t.loginSubmit || 'Entrar') + '</button>' +
          '</form>' +
          '<form id="profile-form-register" class="auth-form cuenta-hub-form" hidden autocomplete="on">' +
            '<label class="auth-field"><span>' + esc(t.registerNickname || 'Apodo camada') + '</span><input type="text" name="nickname" required maxlength="18" autocomplete="nickname" placeholder="Ej. FoxMaster"></label>' +
            '<label class="auth-field"><span>' + esc(t.registerEmail || 'Email') + '</span><input type="email" name="email" required autocomplete="email" placeholder="tu@email.com"></label>' +
            '<label class="auth-field"><span>' + esc(t.registerPassword || 'Contraseña') + '</span><input type="password" name="password" required minlength="6" autocomplete="new-password" placeholder="Mínimo 6 caracteres"></label>' +
            '<label class="auth-field"><span>' + esc(t.registerGame || 'Disciplina favorita') + '</span><select name="favoriteGame">' + gameOptions() + '</select></label>' +
            '<p class="form-error" id="profile-register-error" aria-live="polite"></p>' +
            '<button type="submit" class="btn btn-primary btn-full">' + esc(t.registerSubmit || 'Crear perfil') + '</button>' +
          '</form>' +
        '</div>' +
        '<p class="cuenta-skip"><a href="' + esc(t.skipHref || 'index.html') + '" class="btn btn-ghost">' + esc(t.skipText || 'Seguir sin cuenta →') + '</a></p>' +
      '</div>';

    bindTabs(root);
    bindLoginForm(root);
    bindRegisterForm(root);

    var mode = new URLSearchParams(location.search).get('mode');
    if (mode === 'register') setTab('register');
  }

  function quickLink(href, label, sub) {
    return '<a href="' + esc(href) + '" class="cuenta-quick-card card">' +
      '<strong>' + esc(label) + '</strong><span>' + esc(sub) + '</span></a>';
  }

  function renderMember(root, user) {
    var t = texts();
    var since = memberSince(user.created);
    var sinceLabel = (t.profileMemberSince || 'Camada desde') + ' ' + since;
    var presetBtns = AVATAR_PRESETS.map(function (p) {
      return '<button type="button" class="btn btn-ghost btn-sm" data-avatar-preset="' + esc(p.src) + '">' + esc(p.label) + '</button>';
    }).join('');

    root.innerHTML =
      '<div class="cuenta-profile-pro">' +
        '<div class="cuenta-profile-hero card">' +
          '<div class="cuenta-profile-hero-glow" aria-hidden="true"></div>' +
          '<div class="cuenta-profile-hero-top">' +
            '<p class="eyebrow">' + esc(t.profileEyebrow || 'Tu camada') + '</p>' +
            '<button type="button" class="btn btn-ghost btn-sm cuenta-logout-top" id="profile-logout-btn">' + esc(t.profileLogout || 'Cerrar sesión') + '</button>' +
          '</div>' +
          '<div class="cuenta-profile-hero-body">' +
            '<div class="cuenta-avatar-stack">' +
              '<div class="cuenta-avatar-ring" id="profile-avatar-display">' + avatarInner(user) + '</div>' +
              '<button type="button" class="btn btn-glass btn-sm cuenta-avatar-toggle" id="profile-avatar-toggle" aria-expanded="false">' + esc(t.profileAvatarChange || 'Cambiar foto') + '</button>' +
            '</div>' +
            '<div class="cuenta-hero-copy">' +
              '<h2 class="cuenta-hero-name">' + esc(user.nickname) + '</h2>' +
              '<p class="cuenta-hero-email">' + esc(user.email) + '</p>' +
              '<div class="cuenta-hero-chips">' +
                '<span class="cuenta-chip cuenta-chip--role">' + esc(roleLabel(user.role)) + '</span>' +
                '<span class="cuenta-chip">' + esc(user.favoriteGame || games()[0]) + '</span>' +
                (since ? '<span class="cuenta-chip cuenta-chip--muted">' + esc(sinceLabel) + '</span>' : '') +
              '</div>' +
              (user.bio ? '<p class="cuenta-hero-bio">' + esc(user.bio) + '</p>' : '') +
            '</div>' +
          '</div>' +
          '<div class="cuenta-avatar-panel" id="profile-avatar-panel" hidden>' +
            '<p class="cuenta-avatar-panel-title">' + esc(t.profileAvatarTitle || 'Foto de perfil') + '</p>' +
            '<div class="cuenta-avatar-panel-row">' +
              '<label class="auth-field cuenta-avatar-url-field"><span>' + esc(t.profileAvatarUrl || 'URL de imagen') + '</span>' +
                '<input type="url" id="profile-avatar-url" placeholder="https://…" value="' + esc(user.avatar && !user.avatar.startsWith('data:') ? user.avatar : '') + '"></label>' +
              '<button type="button" class="btn btn-primary btn-sm" id="profile-avatar-url-btn">' + esc(t.profileAvatarApply || 'Aplicar URL') + '</button>' +
            '</div>' +
            '<div class="cuenta-avatar-panel-row cuenta-avatar-upload-row">' +
              '<label class="cuenta-upload-btn btn btn-glass btn-sm">' + esc(t.profileAvatarUpload || 'Subir desde PC') +
                '<input type="file" id="profile-avatar-file" accept="image/jpeg,image/png,image/webp,image/gif" hidden></label>' +
              '<button type="button" class="btn btn-ghost btn-sm cuenta-danger" id="profile-avatar-remove">' + esc(t.profileAvatarRemove || 'Quitar foto') + '</button>' +
            '</div>' +
            '<div class="cuenta-avatar-presets">' + presetBtns + '</div>' +
          '</div>' +
        '</div>' +

        '<div class="cuenta-quick-grid">' +
          quickLink('noticias.html', t.quickNews || 'Noticias', t.quickNewsSub || 'Matchdays y novedades') +
          quickLink('equipos.html', t.quickTeams || 'Equipos', t.quickTeamsSub || 'Plantillas oficiales') +
          quickLink('contactanos.html?tipo=reclutamiento', t.quickTryouts || 'Tryouts', t.quickTryoutsSub || 'Únete a la camada') +
          quickLink('historia.html', t.quickHistory || 'Historia', t.quickHistorySub || 'Crónica kitsune') +
        '</div>' +

        '<div class="cuenta-profile-shell">' +
          '<section class="cuenta-panel card">' +
            '<header class="cuenta-panel-head">' +
              '<p class="eyebrow">' + esc(t.profileIdentityEyebrow || 'Identidad') + '</p>' +
              '<h3 class="section-title">' + (t.profileIdentityTitle || 'Tu <em>perfil</em>') + '</h3>' +
            '</header>' +
            '<form id="profile-edit-form" class="auth-form cuenta-profile-form">' +
              '<div class="cuenta-form-grid">' +
                '<label class="auth-field"><span>' + esc(t.profileNickname || 'Apodo') + '</span><input type="text" name="nickname" required maxlength="18" value="' + esc(user.nickname) + '"></label>' +
                '<label class="auth-field"><span>' + esc(t.profileRole || 'Rol en la camada') + '</span><select name="role">' + roleOptions(user.role) + '</select></label>' +
                '<label class="auth-field cuenta-form-span-2"><span>' + esc(t.profileBio || 'Bio') + '</span><textarea name="bio" rows="3" maxlength="240" placeholder="' + esc(t.profileBioPlaceholder || 'Fan, jugador, staff…') + '">' + esc(user.bio) + '</textarea></label>' +
                '<label class="auth-field"><span>' + esc(t.profileGame || 'Disciplina favorita') + '</span><select name="favoriteGame">' + gameOptions(user.favoriteGame) + '</select></label>' +
              '</div>' +
              '<header class="cuenta-panel-head cuenta-panel-head--sub">' +
                '<p class="eyebrow">' + esc(t.profileSocialEyebrow || 'Redes') + '</p>' +
                '<h3 class="section-title" style="font-size:clamp(1.25rem,2.5vw,1.55rem)">' + (t.profileSocialTitle || 'Dónde <em>encontrarte</em>') + '</h3>' +
              '</header>' +
              '<div class="cuenta-form-grid cuenta-form-grid--social">' +
                '<label class="auth-field"><span>' + esc(t.profileTwitter || 'Twitter / X') + '</span><input type="text" name="twitter" placeholder="' + esc(t.profileTwitterPlaceholder || '@tuusuario') + '" value="' + esc(user.twitter) + '"></label>' +
                '<label class="auth-field"><span>' + esc(t.profileInstagram || 'Instagram') + '</span><input type="text" name="instagram" placeholder="' + esc(t.profileInstagramPlaceholder || '@tuusuario') + '" value="' + esc(user.instagram || '') + '"></label>' +
                '<label class="auth-field cuenta-form-span-2"><span>' + esc(t.profileDiscord || 'Discord') + '</span><input type="text" name="discord" placeholder="' + esc(t.profileDiscordPlaceholder || 'usuario#0000') + '" value="' + esc(user.discord || '') + '"></label>' +
              '</div>' +
              '<p class="form-ok" id="profile-save-ok" hidden>' + esc(t.profileSaved || '✓ Perfil guardado') + '</p>' +
              '<div class="cuenta-actions">' +
                '<button type="submit" class="btn btn-primary">' + esc(t.profileSave || 'Guardar cambios') + '</button>' +
              '</div>' +
            '</form>' +
          '</section>' +

          '<aside class="cuenta-side-stack">' +
            '<div class="cuenta-side-card card">' +
              '<p class="eyebrow">' + esc(t.profileStatsEyebrow || 'Resumen') + '</p>' +
              '<h3 class="cuenta-side-title">' + esc(t.profileStatsTitle || 'Tu ficha') + '</h3>' +
              '<ul class="cuenta-stat-list">' +
                '<li><span>Rol</span><strong>' + esc(roleLabel(user.role)) + '</strong></li>' +
                '<li><span>Disciplina</span><strong>' + esc(user.favoriteGame || '—') + '</strong></li>' +
                '<li><span>Email</span><strong class="cuenta-stat-email">' + esc(user.email) + '</strong></li>' +
                (since ? '<li><span>Miembro</span><strong>' + esc(since) + '</strong></li>' : '') +
              '</ul>' +
            '</div>' +
            '<div class="cuenta-side-card card cuenta-side-card--accent">' +
              '<p class="cuenta-side-note">' + esc(t.profileLocalNote || 'Los datos se guardan solo en este navegador. Nadie más puede ver tu perfil.') + '</p>' +
            '</div>' +
          '</aside>' +
        '</div>' +
      '</div>';

    bindProfileForm(root);
  }

  function renderCuenta(root) {
    if (!root) root = document.getElementById('cuenta-app');
    if (!root) return;
    var user = currentUser();
    if (user) renderMember(root, user);
    else renderGuest(root);
  }

  function initLoginPage() {
    if (isLoggedIn()) {
      location.href = 'cuenta.html';
      return;
    }

    var pick = document.getElementById('auth-mode-pick');
    if (pick) {
      pick.querySelectorAll('[data-auth-mode]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var mode = btn.getAttribute('data-auth-mode');
          if (!mode || mode === 'reset') return;
          pick.querySelectorAll('[data-auth-mode]').forEach(function (b) {
            if (b.tagName !== 'BUTTON') return;
            var on = b.getAttribute('data-auth-mode') === mode;
            b.classList.toggle('active', on);
            b.setAttribute('aria-selected', on ? 'true' : 'false');
          });
          var login = document.getElementById('auth-form-login');
          var reg = document.getElementById('auth-form-register');
          if (login) login.hidden = mode !== 'login';
          if (reg) reg.hidden = mode !== 'register';
        });
      });
    }

    var warn = document.getElementById('auth-config-warn');
    if (warn) {
      warn.hidden = false;
      warn.innerHTML = '<strong>Perfil local.</strong><p>Crea tu cuenta o entra. Todo se guarda en este navegador.</p>';
    }

    var loginForm = document.getElementById('auth-form-login');
    if (loginForm && !loginForm.dataset.bound) {
      loginForm.dataset.bound = '1';
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var res = login(
          document.getElementById('login-email').value,
          document.getElementById('login-password').value
        );
        if (!res.ok) { toast(res.error); return; }
        toast('¡Bienvenido, ' + res.user.nickname + '!');
        location.href = 'cuenta.html';
      });
    }

    var regForm = document.getElementById('auth-form-register');
    if (regForm && !regForm.dataset.bound) {
      regForm.dataset.bound = '1';
      regForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var res = register({
          nickname: document.getElementById('reg-nickname').value,
          email: document.getElementById('reg-email').value,
          password: document.getElementById('reg-password').value
        });
        if (!res.ok) { toast(res.error); return; }
        toast('Perfil creado — ¡bienvenido!');
        location.href = 'cuenta.html';
      });
    }

    var resetBtn = document.querySelector('.auth-link-btn[data-auth-mode="reset"]');
    if (resetBtn) resetBtn.hidden = true;

    if (new URLSearchParams(location.search).get('mode') === 'register') {
      var regTab = pick && pick.querySelector('[data-auth-mode="register"]');
      if (regTab) regTab.click();
    }
  }

  function boot() {
    var page = document.body && document.body.dataset.page;
    if (page === 'cuenta') {
      var root = document.getElementById('cuenta-app');
      if (!root) return;
      if (root.querySelector('#profile-edit-form, #auth-form-login')) return;
      renderCuenta();
    }
    if (page === 'login') initLoginPage();
  }

  window.LyokProfile = {
    currentUser: currentUser,
    isLoggedIn: isLoggedIn,
    register: register,
    login: login,
    logout: logout,
    updateProfile: updateProfile,
    render: renderCuenta,
    toast: toast
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  document.addEventListener('lyok:rerender', boot);
})();
