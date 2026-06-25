/* Carga auth en páginas con cabecera (enlace Entrar / Mi cuenta) */
(function () {
  'use strict';

  function asset(src) {
    return (typeof SITE !== 'undefined' && SITE.asset) ? SITE.asset(src) : src;
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var url = asset(src);
      if (document.querySelector('script[src="' + url + '"]')) {
        resolve();
        return;
      }
      var s = document.createElement('script');
      s.src = url;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  document.addEventListener('layout:ready', function () {
    if (!document.getElementById('headerAuthLink')) return;
    loadScript('js/supabase-config.js')
      .then(function () { return loadScript('js/auth.js'); })
      .then(function () {
        if (window.updateHeaderAuthLink) window.updateHeaderAuthLink();
      })
      .catch(function () { /* sin auth */ });
  });
})();
