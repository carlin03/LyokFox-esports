/* KP / perfil en header — sin cargar community-app.js (2600+ líneas) */
(function () {
  'use strict';
  if (window.LyokFoxCommunity) return;
  var key = (typeof COMMUNITY !== 'undefined' && COMMUNITY.storageKey) ? COMMUNITY.storageKey : 'lyokfox_community_v3';
  function load() {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : { nickname: 'Invitado', points: 0, lifetime: 0, streak: 0, profile: {} };
    } catch (e) {
      return { nickname: 'Invitado', points: 0, lifetime: 0, streak: 0, profile: {} };
    }
  }
  window.LyokFoxCommunity = {
    getState: load,
    save: function (s) { try { localStorage.setItem(key, JSON.stringify(s)); } catch (e) { /* quota */ } },
    toast: function () {},
    reload: function () {}
  };
})();
