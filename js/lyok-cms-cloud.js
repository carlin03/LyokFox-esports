/* LyokFox — CMS en nube (Supabase): lectura pública + publicación vía API segura */
(function () {
  'use strict';

  var CMS_ROW_ID = 'main';
  var SK_META = 'lyokfox_cms_cloud_meta_v1';
  var SK = 'lyokfox_studio_v3';
  var readClient = null;

  function cfg() {
    return window.SUPABASE_CONFIG || { url: '', anonKey: '', enabled: false };
  }

  function isConfigured() {
    var c = cfg();
    return !!(c.enabled && c.url && c.anonKey);
  }

  function readMeta() {
    try { return JSON.parse(localStorage.getItem(SK_META) || '{}'); }
    catch (e) { return {}; }
  }

  function writeMeta(meta) {
    try { localStorage.setItem(SK_META, JSON.stringify(meta || {})); }
    catch (e) { /* ignore */ }
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
      s.onerror = function () { reject(new Error('No se pudo cargar Supabase')); };
      document.head.appendChild(s);
    });
  }

  function getClient() {
    if (!isConfigured()) return Promise.resolve(null);
    if (readClient) return Promise.resolve(readClient);
    return loadSupabaseLib().then(function (lib) {
      var c = cfg();
      readClient = lib.createClient(c.url, c.anonKey);
      return readClient;
    });
  }

  function normalizePayload(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (raw.data && typeof raw.data === 'object') {
      return { data: raw.data, visibility: raw.visibility || raw.data.visibility || {} };
    }
    return { data: raw, visibility: raw.visibility || {} };
  }

  function applyToStorage(payload) {
    if (!payload || !payload.data) return false;
    try {
      localStorage.setItem(SK, JSON.stringify(payload));
      return true;
    } catch (e) {
      return false;
    }
  }

  function applyToRuntime(payload) {
    if (!payload || !payload.data) return false;
    applyToStorage(payload);
    if (typeof window.applyStudioEnvelope === 'function') {
      window.applyStudioEnvelope(payload);
      return true;
    }
    return applyToStorage(payload);
  }

  function pull(force) {
    if (!isConfigured()) return Promise.resolve(null);
    return getClient().then(function (sb) {
      if (!sb) return null;
      return sb.from('site_cms').select('payload, updated_at').eq('id', CMS_ROW_ID).maybeSingle();
    }).then(function (res) {
      if (!res || res.error) return null;
      var row = res.data;
      if (!row || !row.payload) return null;
      var payload = normalizePayload(row.payload);
      if (!payload) return null;
      var meta = readMeta();
      var remoteAt = row.updated_at || '';
      if (!force && meta.updated_at && meta.updated_at === remoteAt) {
        return payload;
      }
      writeMeta({ updated_at: remoteAt, source: 'supabase' });
      applyToRuntime(payload);
      return payload;
    }).catch(function () { return null; });
  }

  function pullAndApply(force) {
    return pull(force).then(function (payload) {
      if (payload) return payload;
      try {
        var raw = localStorage.getItem(SK);
        if (!raw) return null;
        var saved = JSON.parse(raw);
        if (saved && saved.data) applyToRuntime(saved);
        return saved;
      } catch (e) { return null; }
    });
  }

  function push(saved, pin) {
    if (!isConfigured()) return Promise.resolve({ ok: false, reason: 'not_configured' });
    saved = saved || {};
    var body = {
      data: saved.data,
      visibility: saved.visibility || (saved.data && saved.data.visibility) || {}
    };
    return fetch('/api/studio-publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Studio-Pin': String(pin || '').trim()
      },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().then(function (j) {
        if (r.ok && j.ok) {
          writeMeta({ updated_at: j.updated_at || new Date().toISOString(), source: 'supabase' });
        }
        return j;
      });
    }).catch(function (e) {
      return { ok: false, reason: e.message || 'network_error' };
    });
  }

  window.LyokCmsCloud = {
    isConfigured: isConfigured,
    pull: pull,
    pullAndApply: pullAndApply,
    push: push,
    applyToRuntime: applyToRuntime
  };
})();
