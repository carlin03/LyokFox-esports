/* LyokFox — CMS 100% Supabase: lectura pública + publicación vía API */
(function () {
  'use strict';

  var CMS_ROW_ID = 'main';
  var SK_META = 'lyokfox_cms_cloud_meta_v1';
  var SK = 'lyokfox_studio_v3';
  var readClient = null;
  var pullInFlight = null;
  var realtimeChannel = null;

  function cfg() {
    return window.SUPABASE_CONFIG || { url: '', anonKey: '', enabled: false };
  }

  function isConfigured() {
    var c = cfg();
    return !!(c.enabled && c.url && c.anonKey && String(c.url).indexOf('TU-PROYECTO') < 0);
  }

  function isProdHost() {
    var h = (location.hostname || '').toLowerCase();
    return !!(h && h !== 'localhost' && h !== '127.0.0.1' && h !== '[::1]');
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
      if (window.__lyokSupabaseLoad) {
        window.__lyokSupabaseLoad.then(resolve).catch(reject);
        return;
      }
      window.__lyokSupabaseLoad = new Promise(function (res, rej) {
        var s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
        s.onload = function () { res(window.supabase); };
        s.onerror = function () { rej(new Error('No se pudo cargar Supabase')); };
        document.head.appendChild(s);
      });
      window.__lyokSupabaseLoad.then(resolve).catch(reject);
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

  function applyToRuntime(payload, source) {
    if (!payload || !payload.data) return false;
    applyToStorage(payload);
    if (source === 'supabase' && typeof window.replaceStudioEnvelope === 'function') {
      window.replaceStudioEnvelope(payload);
      return true;
    }
    if (typeof window.applyStudioEnvelope === 'function') {
      window.applyStudioEnvelope(payload);
      return true;
    }
    return false;
  }

  function handleRemoteRow(row) {
    if (!row || !row.payload) return null;
    var payload = normalizePayload(row.payload);
    if (!payload) return null;
    writeMeta({ updated_at: row.updated_at || '', source: 'supabase' });
    applyToRuntime(payload, 'supabase');
    if (typeof window.lyokRerender === 'function') window.lyokRerender();
    return payload;
  }

  function pull(force) {
    if (!isConfigured()) return Promise.resolve(null);
    if (pullInFlight && !force) return pullInFlight;
    pullInFlight = getClient().then(function (sb) {
      if (!sb) return null;
      return sb.from('site_cms').select('payload, updated_at').eq('id', CMS_ROW_ID).maybeSingle();
    }).then(function (res) {
      if (!res || res.error) return null;
      return handleRemoteRow(res.data);
    }).catch(function () { return null; }).finally(function () {
      pullInFlight = null;
    });
    return pullInFlight;
  }

  function pullAndApply(force) {
    return pull(force).then(function (payload) {
      if (payload) return payload;
      if (isConfigured() && isProdHost()) return null;
      try {
        var raw = localStorage.getItem(SK);
        if (!raw) return null;
        var saved = JSON.parse(raw);
        if (saved && saved.data) {
          applyToRuntime(saved, 'local');
          return saved;
        }
      } catch (e) { /* ignore */ }
      return null;
    });
  }

  function subscribe() {
    if (!isConfigured() || realtimeChannel) return;
    getClient().then(function (sb) {
      if (!sb || realtimeChannel) return;
      realtimeChannel = sb
        .channel('lyokfox-site-cms')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'site_cms',
          filter: 'id=eq.' + CMS_ROW_ID
        }, function (msg) {
          if (msg.new) handleRemoteRow(msg.new);
        })
        .subscribe();
    });
    if (!window.__lyokCmsVisibilityPull) {
      window.__lyokCmsVisibilityPull = true;
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden && isConfigured()) pull(true);
      });
      window.addEventListener('focus', function () {
        if (isConfigured()) pull(true);
      });
    }
  }

  function push(saved, pin) {
    if (!isConfigured()) return Promise.resolve({ ok: false, reason: 'not_configured' });
    saved = saved || {};
    var body = {
      data: saved.data,
      visibility: saved.visibility || (saved.data && saved.data.visibility) || {}
    };
    return fetch('/api/studio-publish.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Studio-Pin': String(pin || '').trim()
      },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.text().then(function (text) {
        var j = {};
        try { j = text ? JSON.parse(text) : {}; } catch (e) {
          j = { ok: false, reason: 'invalid_response', detail: text.slice(0, 120) };
        }
        if (r.ok && j.ok) {
          writeMeta({ updated_at: j.updated_at || new Date().toISOString(), source: 'supabase' });
          applyToRuntime(body, 'supabase');
          if (typeof window.lyokRerender === 'function') window.lyokRerender();
        } else if (!j.reason) {
          j.reason = 'http_' + r.status;
        }
        return j;
      });
    }).catch(function (e) {
      return { ok: false, reason: e.message || 'network_error' };
    });
  }

  window.LyokCmsCloud = {
    isConfigured: isConfigured,
    isProdHost: isProdHost,
    pull: pull,
    pullAndApply: pullAndApply,
    push: push,
    subscribe: subscribe,
    applyToRuntime: applyToRuntime
  };
})();
