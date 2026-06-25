/* Carga LyokFox Studio bajo demanda — la web no parsea 3300+ líneas hasta abrir Studio */
(function () {
  'use strict';

  var loading = false;
  var loaded = false;

  function isStudioFrame() {
    return /(?:^|[?&])studioFrame=1(?:&|$)/.test(location.search);
  }

  function buildVer() {
    return (window.SITE && SITE.build) ? SITE.build : 'dev';
  }

  function loadScript(src, next) {
    var s = document.createElement('script');
    s.src = src + '?v=' + buildVer();
    s.defer = true;
    s.onload = function () { next(); };
    s.onerror = function () { next(); };
    document.body.appendChild(s);
  }

  function ensureStudioCss() {
    if (document.querySelector('link[href*="lyok-studio.css"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/lyok-studio.css?v=' + buildVer();
    document.head.appendChild(link);
  }

  function loadStudio(done) {
    if (loaded && window.LYOK_STUDIO) {
      done();
      return;
    }
    if (loading) return;
    loading = true;
    ensureStudioCss();
    loadScript('js/lyok-studio-icons.js', function () {
      loadScript('js/lyok-studio.js', function () {
        loaded = true;
        loading = false;
        done();
      });
    });
  }

  function mountFab() {
    if (isStudioFrame() || document.getElementById('lyok-studio-fab')) return;
    var fab = document.createElement('button');
    fab.type = 'button';
    fab.id = 'lyok-studio-fab';
    fab.className = 'lyok-studio-fab';
    fab.setAttribute('aria-label', 'Abrir LyokFox Studio');
    fab.innerHTML = '<span class="lyok-studio-fab-ico" aria-hidden="true">⚙</span><span class="lyok-studio-fab-label">Studio</span>';
    fab.onclick = function () {
      fab.disabled = true;
      fab.classList.add('is-loading');
      loadStudio(function () {
        fab.disabled = false;
        fab.classList.remove('is-loading');
        if (window.LYOK_STUDIO && window.LYOK_STUDIO.open) window.LYOK_STUDIO.open();
      });
    };
    document.body.appendChild(fab);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountFab);
  } else {
    mountFab();
  }
})();
