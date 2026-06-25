(function () {
  'use strict';

  if (typeof NEWS === 'undefined') return;

  var newsFilter = 'all';
  var newsSearch = '';

  function getState() {
    return window.LyokFoxCommunity ? window.LyokFoxCommunity.getState() : { newsRead: {} };
  }

  function filterArticles() {
    return NEWS.articles.filter(function (a) {
      var tagOk = newsFilter === 'all' || a.tag === newsFilter;
      var q = newsSearch.toLowerCase();
      var hay = (a.title + ' ' + a.excerpt + ' ' + a.tag + ' ' + (a.body || []).join(' ')).toLowerCase();
      return tagOk && (!q || hay.indexOf(q) >= 0);
    });
  }

  function catClass(cat) {
    return 'news-cat-' + (cat || 'comunidad');
  }

  function formatDate(d) {
    try {
      return new Date(d + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) { return d; }
  }

  function isRead(id) {
    return !!(getState().newsRead || {})[id];
  }

  function renderBreaking() {
    var el = document.getElementById('news-breaking');
    if (!el) return;
    var label = (typeof NEWS !== 'undefined' && NEWS.breakingLabel) ? NEWS.breakingLabel : 'Última hora';
    var shells = window.CMS && typeof window.CMS.load === 'function' ? (window.CMS.load().pageShells || {}).noticias : null;
    if (shells && shells.breakingLabel) label = shells.breakingLabel;
    var text = NEWS.breaking || '';
    el.innerHTML =
      '<div class="news-breaking-inner wrap">' +
        '<span class="news-breaking-label">' + label + '</span>' +
        '<div class="news-breaking-track" aria-hidden="true">' +
          '<p class="news-breaking-marquee"><span>' + text + '</span><span>' + text + '</span></p>' +
        '</div>' +
      '</div>';
  }

  function renderHeroStats() {
    var el = document.getElementById('news-hero-stats');
    if (!el || !NEWS.articles) return;
    var total = NEWS.articles.length;
    var read = Object.keys(getState().newsRead || {}).length;
    var featured = NEWS.articles.filter(function (a) { return a.featured; }).length;
    el.innerHTML =
      '<div class="news-hero-stat"><strong>' + total + '</strong><span>Artículos</span></div>' +
      '<div class="news-hero-stat"><strong>' + featured + '</strong><span>Destacadas</span></div>' +
      '<div class="news-hero-stat"><strong>' + read + '</strong><span>Leídas</span></div>' +
      '<div class="news-hero-stat news-hero-stat--kp"><strong>+10</strong><span data-points-short>KP</span><em>por noticia</em></div>';
    if (typeof syncSiteLinks === 'function') syncSiteLinks(el);
  }

  function renderTags() {
    var el = document.getElementById('comm-news-tags');
    if (!el) return;
    var tags = ['Todos'];
    NEWS.articles.forEach(function (a) {
      if (tags.indexOf(a.tag) < 0) tags.push(a.tag);
    });
    el.innerHTML = tags.map(function (t) {
      var id = t === 'Todos' ? 'all' : t;
      var on = (newsFilter === 'all' && t === 'Todos') || newsFilter === t ? ' news-tag-on' : '';
      return '<button type="button" class="news-tag-btn' + on + '" data-tag="' + id + '">' + t + '</button>';
    }).join('');
    el.querySelectorAll('.news-tag-btn').forEach(function (btn) {
      btn.onclick = function () {
        newsFilter = btn.dataset.tag;
        renderAll();
      };
    });
  }

  function resolveNewsImage(a) {
    var src = a.image || (NEWS.catImages && NEWS.catImages[a.cat]) || 'assets/games/eafc.svg';
    if (src === '__banner__' && typeof BANNER !== 'undefined') return BANNER;
    if (src === '__logo__' && typeof LOGO !== 'undefined') return LOGO;
    return src;
  }

  function articleVisual(a, size) {
    var src = resolveNewsImage(a);
    var isSvg = /\.svg$/i.test(src);
    var cls = 'news-feed-img' + (isSvg ? ' news-feed-img-svg' : '');
    return '<div class="news-feed-visual news-feed-img-wrap news-feed-visual-' + (size || 'md') + '">' +
      '<img src="' + src + '" alt="" loading="lazy" class="' + cls + '">' +
      '<span class="news-feed-cat-overlay">' + a.tag + '</span>' +
    '</div>';
  }

  function articleCard(a, size) {
    var read = isRead(a.id);
    var sz = size || 'md';
    return '<article class="news-feed-card news-feed-' + sz + ' ' + catClass(a.cat) + (read ? ' news-read' : '') + '" data-id="' + a.id + '">' +
      articleVisual(a, sz) +
      '<div class="news-feed-body">' +
        '<div class="news-feed-meta"><span class="news-feed-tag">' + a.tag + '</span><time>' + formatDate(a.date) + '</time>' +
        (a.featured ? '<span class="news-feed-badge">Destacada</span>' : '') +
        '</div>' +
        '<h2>' + a.title + '</h2>' +
        '<p>' + a.excerpt + '</p>' +
        '<footer class="news-feed-foot">' +
          '<span>' + a.author + ' · ' + a.readMin + ' min</span>' +
          (read ? '<span class="mission-done">✓ +10 KP</span>' : '<span class="news-feed-kp">+10 KP</span>') +
        '</footer>' +
      '</div></article>';
  }

  function renderHero() {
    var list = filterArticles();
    var hero = document.getElementById('news-hero-featured');
    if (!hero) return;
    if (!list.length) { hero.innerHTML = ''; return; }
    var main = list.find(function (a) { return a.featured; }) || list[0];
    hero.innerHTML = articleCard(main, 'hero');
    bindCards(hero);
  }

  function renderFeed() {
    var el = document.getElementById('comm-news');
    if (!el) return;
    var list = filterArticles();
    var main = list.find(function (a) { return a.featured; }) || list[0];
    var shown = list.filter(function (a) { return a.id !== main.id; });
    var countEl = document.getElementById('news-feed-count');
    if (countEl) {
      var n = list.length;
      countEl.textContent = n ? (n + (n === 1 ? ' noticia' : ' noticias')) : 'Sin resultados';
    }
    el.innerHTML = shown.length
      ? shown.map(function (a) { return articleCard(a, 'md'); }).join('')
      : '<p class="news-empty">No hay más noticias con este filtro.</p>';
    bindCards(el);
  }

  function openArticle(id) {
    var a = NEWS.articles.find(function (x) { return x.id === id; });
    if (!a) return;
    var modal = document.getElementById('news-article-modal');
    var content = document.getElementById('news-article-content');
    if (!modal || !content) return;
    var read = isRead(a.id);
    content.innerHTML =
      articleVisual(a, 'hero') +
      '<div class="news-article-meta">' +
        '<span class="news-feed-tag">' + a.tag + '</span>' +
        '<time>' + formatDate(a.date) + '</time>' +
        '<span>' + a.author + ' · ' + a.readMin + ' min lectura</span>' +
      '</div>' +
      '<h2>' + a.title + '</h2>' +
      '<div class="news-article-body">' +
        (a.body || []).map(function (p) { return '<p>' + p + '</p>'; }).join('') +
      '</div>' +
      '<div class="news-article-actions">' +
        (a.source ? (function () {
          var src = (typeof SITE !== 'undefined' && SITE.normalizeHref) ? SITE.normalizeHref(a.source) : a.source;
          var internal = typeof SITE !== 'undefined' && SITE.isInternalHref && SITE.isInternalHref(src);
          return '<a href="' + src + '"' + (internal ? '' : ' target="_blank" rel="noopener"') + ' class="btn btn-glass btn-sm">Fuente oficial</a>';
        })() : '') +
        (read
          ? '<span class="mission-done">✓ Leída · +10 KP</span>'
          : '<button type="button" class="btn btn-primary btn-sm" id="news-mark-read" data-id="' + a.id + '">Marcar leída · +10 KP</button>') +
        '<a href="comunidad.html#tienda" class="btn btn-glass btn-sm" data-site-page="comunidad">Canjear KP →</a>' +
      '</div>';
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (typeof syncSiteLinks === 'function') syncSiteLinks(content);
    var btn = document.getElementById('news-mark-read');
    if (btn) {
      btn.onclick = function () {
        markRead(a.id);
        openArticle(a.id);
      };
    }
  }

  function closeArticle() {
    var modal = document.getElementById('news-article-modal');
    if (modal) { modal.hidden = true; document.body.style.overflow = ''; }
  }

  function markRead(id) {
    document.dispatchEvent(new CustomEvent('lyokfox:news-read', { detail: { id: id, kp: 10 } }));
  }

  function bindCards(root) {
    (root || document).querySelectorAll('.news-feed-card').forEach(function (card) {
      card.onclick = function () { openArticle(card.dataset.id); };
    });
  }

  function initSearch() {
    var input = document.getElementById('news-search');
    if (!input) return;
    input.addEventListener('input', function () {
      newsSearch = input.value.trim();
      renderAll();
    });
  }

  function renderAll() {
    renderTags();
    renderHeroStats();
    renderHero();
    renderFeed();
    if (typeof syncSiteLinks === 'function') {
      var newsRoot = document.querySelector('.news-feed-section') || document.getElementById('news-article-content');
      syncSiteLinks(newsRoot || undefined);
    }
  }

  function initNews() {
    if (document.body.dataset.page !== 'noticias') return;
    if (window._lyokNewsInited) return;
    window._lyokNewsInited = true;
    renderBreaking();
    renderAll();
    initSearch();
    document.getElementById('news-article-close').onclick = closeArticle;
    document.getElementById('news-article-x').onclick = closeArticle;
    document.addEventListener('lyokfox:news-read', function () {
      renderAll();
      if (window.LyokFoxProfile) window.LyokFoxProfile.refresh();
    });
    var params = new URLSearchParams(window.location.search);
    var openId = params.get('id');
    if (openId) {
      setTimeout(function () { openArticle(openId); }, 350);
    }
  }

  document.addEventListener('layout:ready', initNews);

  function refreshFromCms() {
    if (document.body.dataset.page !== 'noticias') return;
    renderBreaking();
    renderAll();
  }

  document.addEventListener('cms:applied', refreshFromCms);
  document.addEventListener('cms:preview-refresh', refreshFromCms);
  document.addEventListener('cms:preview-open-article', function (e) {
    if (document.body.dataset.page !== 'noticias' || !e.detail || !e.detail.id) return;
    window._lyokPreviewOpenId = e.detail.id;
    if (typeof openArticle === 'function') openArticle(e.detail.id);
  });

  document.addEventListener('cms:preview-refresh', function () {
    if (document.body.dataset.page !== 'noticias' || !window._lyokPreviewOpenId) return;
    var modal = document.getElementById('news-article-modal');
    if (modal && !modal.hidden && typeof openArticle === 'function') {
      openArticle(window._lyokPreviewOpenId);
    }
  });
})();
