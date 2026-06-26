/* LyokFox Auth — Supabase email/password + perfil camada */
(function () {
  'use strict';

  var client = null;
  var readyPromise = null;

  function cfg() {
    var c = window.SUPABASE_CONFIG;
    if (c && c.enabled && c.url && c.anonKey) return c;
    if (window.SITE && SITE.supabase && SITE.supabase.enabled) return SITE.supabase;
    return { url: '', anonKey: '', enabled: false };
  }

  function isConfigured() {
    var c = cfg();
    return !!(c.enabled && c.url && c.anonKey && c.url.indexOf('TU-PROYECTO') < 0);
  }

  function loadSupabaseLib() {
    return new Promise(function (resolve, reject) {
      if (window.supabase && window.supabase.createClient) {
        resolve(window.supabase);
        return;
      }
      if (window.__lyokSupabaseLoad) {
        window.__lyokSupabaseLoad.then(resolve).catch(reject);
        return;
      }
      window.__lyokSupabaseLoad = new Promise(function (res, rej) {
        var s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
        s.onload = function () { res(window.supabase); };
        s.onerror = function () { rej(new Error('No se pudo cargar Supabase JS')); };
        document.head.appendChild(s);
      });
      window.__lyokSupabaseLoad.then(resolve).catch(reject);
    });
  }

  function ensureClient() {
    if (!isConfigured()) return Promise.resolve(null);
    if (client) return Promise.resolve(client);
    if (readyPromise) return readyPromise;
    readyPromise = loadSupabaseLib().then(function (lib) {
      var c = cfg();
      client = lib.createClient(c.url, c.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      return client;
    });
    return readyPromise;
  }

  function mapProfileRow(row) {
    if (!row) return null;
    return {
      id: row.id,
      nickname: row.nickname,
      bio: row.bio || '',
      avatar: row.avatar_url || '',
      twitter: row.twitter_handle || '',
      instagram: row.instagram_handle || '',
      country: row.country || 'ES',
      favoriteGame: row.favorite_game || 'Clash Royale',
      points: row.points || 0,
      lifetime: row.lifetime_points || 0,
      streak: row.streak || 0,
      publicRanking: row.public_ranking !== false,
      email: row.email || '',
      camadaData: row.camada_data || {}
    };
  }

  function profileToRow(p) {
    return {
      nickname: (p.nickname || '').trim().slice(0, 18),
      bio: (p.bio || '').trim().slice(0, 240),
      avatar_url: (p.avatar || '').trim(),
      twitter_handle: (p.twitter || '').replace(/^@/, '').trim(),
      instagram_handle: (p.instagram || '').replace(/^@/, '').trim(),
      country: p.country || 'ES',
      favorite_game: p.favoriteGame || 'Clash Royale',
      points: +p.points || 0,
      lifetime_points: +p.lifetime || 0,
      streak: +p.streak || 0,
      public_ranking: p.publicRanking !== false,
      camada_data: p.camadaData || {},
      updated_at: new Date().toISOString()
    };
  }

  function getSession() {
    return ensureClient().then(function (sb) {
      if (!sb) return null;
      return sb.auth.getSession().then(function (r) { return r.data.session; });
    });
  }

  function getUser() {
    return getSession().then(function (s) { return s ? s.user : null; });
  }

  function signIn(email, password) {
    return ensureClient().then(function (sb) {
      if (!sb) throw new Error('Supabase no configurado. Rellena js/supabase-config.js');
      return sb.auth.signInWithPassword({ email: email.trim(), password: password });
    });
  }

  function signUp(email, password, nickname, favoriteGame) {
    return ensureClient().then(function (sb) {
      if (!sb) throw new Error('Supabase no configurado');
      var nick = (nickname || '').trim().slice(0, 18);
      if (nick.length < 2) throw new Error('Apodo mínimo 2 caracteres');
      var meta = { nickname: nick };
      if (favoriteGame) meta.favorite_game = String(favoriteGame).slice(0, 40);
      return sb.auth.signUp({
        email: email.trim(),
        password: password,
        options: { data: meta }
      });
    });
  }

  function signOut() {
    return ensureClient().then(function (sb) {
      if (!sb) return null;
      return sb.auth.signOut();
    });
  }

  function resetPassword(email) {
    return ensureClient().then(function (sb) {
      if (!sb) throw new Error('Supabase no configurado');
      var redirect = (typeof SITE !== 'undefined' && SITE.fullUrl)
        ? SITE.fullUrl('login.html?reset=1')
        : (window.location.origin + '/login.html?reset=1');
      return sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: redirect });
    });
  }

  function updatePassword(newPassword) {
    return ensureClient().then(function (sb) {
      if (!sb) throw new Error('Supabase no configurado');
      return sb.auth.updateUser({ password: newPassword });
    });
  }

  function fetchProfile() {
    return getUser().then(function (user) {
      if (!user) return null;
      return ensureClient().then(function (sb) {
        return sb.from('profiles').select('*').eq('id', user.id).maybeSingle().then(function (r) {
          if (r.error) throw r.error;
          return mapProfileRow(r.data);
        });
      });
    });
  }

  function saveProfile(patch) {
    return getUser().then(function (user) {
      if (!user) throw new Error('No has iniciado sesión');
      var row = profileToRow(patch);
      row.email = user.email;
      return ensureClient().then(function (sb) {
        return sb.from('profiles').upsert(Object.assign({ id: user.id }, row)).select().single().then(function (r) {
          if (r.error) throw r.error;
          return mapProfileRow(r.data);
        });
      });
    });
  }

  function onAuthStateChange(cb) {
    ensureClient().then(function (sb) {
      if (!sb) return;
      sb.auth.onAuthStateChange(function (event, session) {
        cb(event, session);
      });
    });
  }

  window.LyokFoxAuth = {
    isConfigured: isConfigured,
    ensureClient: ensureClient,
    getSession: getSession,
    getUser: getUser,
    signIn: signIn,
    signUp: signUp,
    signOut: signOut,
    resetPassword: resetPassword,
    updatePassword: updatePassword,
    fetchProfile: fetchProfile,
    saveProfile: saveProfile,
    onAuthStateChange: onAuthStateChange,
    mapProfileRow: mapProfileRow,
    profileToRow: profileToRow
  };
})();
