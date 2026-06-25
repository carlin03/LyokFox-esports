/* LyokFox CMS — sincronización Supabase (contenido global del Studio) */
(function () {
  'use strict';

  var CMS_ROW_ID = 'main';
  var SK_META = 'lyokfox_cms_cloud_meta_v1';
  var readClient = null;

  function cfg() {
    return window.SUPABASE_CONFIG || { url: '', anonKey: '', enabled: false };
  }

  function isConfigured() {
    var c = cfg();
    return !!(c.enabled && c.url && c.anonKey && c.url.indexOf('TU-PROYECTO') < 0);
  }

  function getCms() {
    return window.CMS || null;
  }

  function loadSupabaseLib() {
    return new Promise(function (resolve, reject) {
      if (window.supabase && window.supabase.createClient) {
        resolve(window.supabase);
        return;
      }
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      s.onload = function () { resolve(window.supabase); };
      s.onerror = function () { reject(new Error('No se pudo cargar Supabase JS')); };
      document.head.appendChild(s);
    });
  }

  function getReadClient() {
    if (!isConfigured()) return Promise.resolve(null);
    if (readClient) return Promise.resolve(readClient);
    return loadSupabaseLib().then(function (lib) {
      var c = cfg();
      readClient = lib.createClient(c.url, c.anonKey);
      return readClient;
    });
  }

  function getAuth() {
    return window.LyokFoxAuth || null;
  }

  function getWriteClient() {
    var auth = getAuth();
    if (auth && typeof auth.ensureClient === 'function') {
      return auth.ensureClient();
    }
    return getReadClient();
  }

  function readMeta() {
    try {
      return JSON.parse(localStorage.getItem(SK_META) || '{}');
    } catch (e) {
      return {};
    }
  }

  function writeMeta(meta) {
    try {
      localStorage.setItem(SK_META, JSON.stringify(meta || {}));
    } catch (e) { /* ignore */ }
  }

  function pull() {
    var cms = getCms();
    if (!cms || !isConfigured()) return Promise.resolve(null);
    return getReadClient().then(function (sb) {
      if (!sb) return null;
      return sb.from('site_cms').select('payload, updated_at').eq('id', CMS_ROW_ID).maybeSingle();
    }).then(function (res) {
      if (!res || res.error) return null;
      var row = res.data;
      if (!row || !row.payload || typeof row.payload !== 'object') return null;
      var meta = readMeta();
      var remoteAt = row.updated_at || '';
      if (meta.updated_at && meta.updated_at === remoteAt) return row;
      if (cms.save) cms.save(row.payload);
      writeMeta({ updated_at: remoteAt, source: 'supabase' });
      if (cms.apply) cms.apply();
      return row;
    });
  }

  function push(payload) {
    var cms = getCms();
    if (!cms || !isConfigured()) return Promise.resolve({ ok: false, reason: 'not_configured' });
    payload = payload || (cms.load ? cms.load() : {});
    return getWriteClient().then(function (sb) {
      if (!sb) return { ok: false, reason: 'no_client' };
      return sb.auth.getSession().then(function (sessionRes) {
        var user = sessionRes.data.session && sessionRes.data.session.user;
        if (!user) return { ok: false, reason: 'no_session' };
        return sb.from('site_cms').upsert({
          id: CMS_ROW_ID,
          payload: payload,
          updated_at: new Date().toISOString(),
          updated_by: user.id
        }).select('updated_at').single().then(function (upsertRes) {
          if (upsertRes.error) return { ok: false, reason: upsertRes.error.message || 'error' };
          var at = (upsertRes.data && upsertRes.data.updated_at) || new Date().toISOString();
          writeMeta({ updated_at: at, source: 'supabase' });
          return { ok: true, updated_at: at };
        });
      });
    });
  }

  window.LyokFoxCmsSync = {
    pull: pull,
    push: push,
    isConfigured: isConfigured
  };
})();
