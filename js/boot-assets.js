/* Tras config.js — añade ?v=SITE.build a JS/CSS locales aún no cargados */
(function () {
  'use strict';
  if (typeof SITE === 'undefined' || !SITE.asset) return;
  var self = document.currentScript;
  document.querySelectorAll('script[src]').forEach(function (node) {
    if (node === self) return;
    var src = node.getAttribute('src');
    if (!src || /^https?:/i.test(src)) return;
    if (src.indexOf('config.js') >= 0) return;
    if (src.indexOf('?') >= 0) return;
    node.src = SITE.asset(src);
  });
  document.querySelectorAll('link[rel="stylesheet"][href]').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || /^https?:/i.test(href)) return;
    if (href.indexOf('css/') !== 0 && href.indexOf('/css/') < 0) return;
    if (href.indexOf('?') >= 0) return;
    link.href = SITE.asset(href);
  });
})();
