/* Sincroniza KP local (localStorage) con perfil Supabase */
(function () {
  'use strict';

  function getCommApi() { return window.LyokFoxCommunity || null; }
  function getAuth() { return window.LyokFoxAuth || null; }

  function localState() {
    var api = getCommApi();
    return api ? api.getState() : null;
  }

  function saveLocal(state) {
    var api = getCommApi();
    if (api) api.save(state);
  }

  function mergeLocalFromCloud(profile) {
    if (!profile) return;
    var state = localState();
    if (!state) return;
    state.nickname = profile.nickname || state.nickname;
    if (!state.profile) state.profile = {};
    state.profile.bio = profile.bio || state.profile.bio || '';
    state.profile.avatar = profile.avatar || state.profile.avatar || '';
    state.profile.twitter = profile.twitter || state.profile.twitter || '';
    state.profile.instagram = profile.instagram || state.profile.instagram || '';
    state.profile.country = profile.country || state.profile.country || 'ES';
    state.profile.favoriteGame = profile.favoriteGame || state.profile.favoriteGame || 'brawlStars';
    state.profile.publicRanking = profile.publicRanking !== false;
    if (profile.points != null) state.points = profile.points;
    if (profile.lifetime != null) state.lifetime = profile.lifetime;
    if (profile.streak != null) state.streak = profile.streak;
    if (profile.camadaData && typeof profile.camadaData === 'object') {
      Object.keys(profile.camadaData).forEach(function (k) {
        if (profile.camadaData[k] !== undefined) state[k] = profile.camadaData[k];
      });
    }
    saveLocal(state);
    if (window.LyokFoxProfile && typeof window.LyokFoxProfile.refresh === 'function') {
      window.LyokFoxProfile.refresh(state);
    }
  }

  function buildCloudPatch(state) {
    state = state || localState();
    if (!state) return null;
    var camadaData = {};
    var skip = { nickname: 1, points: 1, lifetime: 1, streak: 1, profile: 1 };
    Object.keys(state).forEach(function (k) {
      if (!skip[k]) camadaData[k] = state[k];
    });
    var p = state.profile || {};
    return {
      nickname: state.nickname || 'Fox',
      bio: p.bio || '',
      avatar: p.avatar || '',
      twitter: p.twitter || '',
      instagram: p.instagram || '',
      country: p.country || 'ES',
      favoriteGame: p.favoriteGame || 'brawlStars',
      points: state.points || 0,
      lifetime: state.lifetime || 0,
      streak: state.streak || 0,
      publicRanking: p.publicRanking !== false,
      camadaData: camadaData
    };
  }

  function pushToCloud() {
    var auth = getAuth();
    if (!auth || !auth.isConfigured()) return Promise.resolve(null);
    var patch = buildCloudPatch();
    if (!patch) return Promise.resolve(null);
    return auth.saveProfile(patch);
  }

  function pullFromCloud() {
    var auth = getAuth();
    if (!auth || !auth.isConfigured()) return Promise.resolve(null);
    return auth.fetchProfile().then(function (profile) {
      if (profile) mergeLocalFromCloud(profile);
      return profile;
    });
  }

  function syncBidirectional() {
    return pullFromCloud().then(function (cloud) {
      if (!cloud) return pushToCloud();
      var local = localState();
      var cloudLife = cloud.lifetime || 0;
      var localLife = (local && local.lifetime) || 0;
      if (localLife > cloudLife) return pushToCloud();
      mergeLocalFromCloud(cloud);
      return cloud;
    });
  }

  window.LyokFoxCamadaSync = {
    mergeLocalFromCloud: mergeLocalFromCloud,
    buildCloudPatch: buildCloudPatch,
    pushToCloud: pushToCloud,
    pullFromCloud: pullFromCloud,
    syncBidirectional: syncBidirectional
  };

  document.addEventListener('layout:ready', function () {
    var auth = getAuth();
    if (!auth || !auth.isConfigured()) return;
    auth.getSession().then(function (session) {
      if (session) syncBidirectional().catch(function () { /* offline */ });
    });
    auth.onAuthStateChange(function (event) {
      if (event === 'SIGNED_IN') syncBidirectional().catch(function () { /* ignore */ });
      if (event === 'SIGNED_OUT' && window.LyokFoxProfile) {
        var s = localState();
        if (s) window.LyokFoxProfile.refresh(s);
      }
    });
  });
})();
