/* LyokFox Studio PRO — editores 100% web (comunidad, inicio, historia, sponsor…) */
(function () {
  'use strict';
  if (typeof window.CMS === 'undefined') return;

  var C = window.CMS;

  var TEAM_KEYS = [
    { key: 'brawlStars', label: 'Brawl Stars' },
    { key: 'clashRoyale', label: 'Clash Royale' },
    { key: 'clubesPro', label: 'Clubes Pro FC26' }
  ];

  var PRO_NAV = [];

  var HISTORY_CHAPTERS = [
    { id: 'cap-origen', label: 'Origen' },
    { id: 'cap-filosofia', label: 'Filosofía' },
    { id: 'cap-comunidad', label: 'Comunidad' },
    { id: 'cap-movil', label: 'Móvil / Brawl' },
    { id: 'cap-clubes', label: 'Clubes Pro' },
    { id: 'cap-oro', label: 'Era dorada' },
    { id: 'cap-europa', label: 'Europa' },
    { id: 'cap-transicion', label: 'Transición' },
    { id: 'cap-fc26', label: 'FC26' },
    { id: 'cap-hoy', label: 'Hoy' }
  ];

  function val(id) {
    var el = document.getElementById(id);
    return el ? String(el.value).trim() : '';
  }

  function chk(id) {
    var el = document.getElementById(id);
    return el ? el.checked : false;
  }

  function linesToArr(t) {
    return t ? t.split('\n').map(function (s) { return s.trim(); }).filter(Boolean) : [];
  }

  function arrToLines(a) {
    return (a || []).join('\n');
  }

  function getComm() {
    if (C.getMerged) {
      var m = C.getMerged();
      if (m.community) return m.community;
    }
    return (typeof COMMUNITY !== 'undefined') ? COMMUNITY : {};
  }

  function getHomeData() {
    if (C.getMerged) {
      var m = C.getMerged();
      if (m.home) return m.home;
    }
    return C.load().home || {};
  }

  function sectionHead(t, d) {
    return '<header class="cms-studio-section-head"><h2>' + t + '</h2>' + (d ? '<p>' + d + '</p>' : '') + '</header>';
  }

  function card(t, body, open) {
    return '<details class="cms-studio-card"' + (open ? ' open' : '') + '><summary>' + t + '</summary><div class="cms-studio-card-body">' + body + '</div></details>';
  }

  function renderHomeSections() {
    var h = getHomeData();
    var kp = h.kp || {};
    var shells = (C.load().pageShells || {}).inicio || {};
    var games = h.gameCards || [
      { title: 'Brawl Stars', flag: 'Principal', text: '3v3 ranked, scrims, map pool y draft. 8 jugadores + 2 capitanes IGL.', tags: ['Gem Grab', 'Bounty', 'Knockout', 'Ranked'] },
      { title: 'Clash Royale', flag: 'Ladder', text: 'Ladder, Clan Wars y torneos. 8 jugadores + 2 capitanes.', tags: ['Ladder', 'CW', 'Torneos'] },
      { title: 'Clubes Pro FC26', flag: 'Pro Clubs', text: '25 jugadores · VPG, PLG y VFO.', tags: ['VPG', 'PLG', 'VFO'] }
    ];

    var html = sectionHead('Inicio · bloques inferiores', 'Kitsune Points, marcas, calendario, disciplinas y teaser de noticias. Las 3 tarjetas spotlight se editan en Portada.') +
      card('Bloque Kitsune Points', C.field('Título KP', 'cms-kp-title', kp.title || '¿Qué son los Kitsune Points?') +
        C.textarea('Descripción', 'cms-kp-desc', kp.desc || '', 4) +
        C.textarea('Lista KP (uno por línea)', 'cms-kp-list', arrToLines(kp.list || ['Like en @LyokFox_ = +20 KP', 'RT oficial = +35 KP', 'Predicción acertada = +100 KP', 'Camiseta desde 2.500 KP']), 5), true);

    html += card('Franja marcas (logos juegos)', C.field('Label strip', 'cms-in-brands-label', shells.brandsLabel || 'Disciplinas oficiales') +
      C.textarea('Nombres (Brawl | Clash | EAFC, uno por línea)', 'cms-in-brand-labels', arrToLines(shells.brandLabels || ['Brawl Stars', 'Clash Royale', 'EA Sports FC 26']), 3) +
      C.field('Eyebrow sección KP', 'cms-in-kp-eyebrow', shells.kpEyebrow || 'Kitsune Points') +
      C.field('Botón KP principal', 'cms-in-kp-btn1', shells.kpBtn1 || 'Ir a Comunidad') +
      C.field('Botón KP secundario', 'cms-in-kp-btn2', shells.kpBtn2 || 'Ver tienda KP'), false);

    html += card('Calendario matchday', C.field('Eyebrow calendario', 'cms-md-eyebrow', shells.matchEyebrow || 'Matchday') +
      C.field('Título calendario (puedes usar <em>)', 'cms-md-title', shells.matchTitle || 'Próximos <em>partidos</em>') +
      C.textarea('Nota pie calendario', 'cms-in-schedule-note', h.scheduleNote || 'Horarios en CEST · Sigue los matchdays en @LyokFox_ · Predicciones KP en Comunidad', 2), false);

    games.forEach(function (g, i) {
      html += card('Tarjeta disciplina ' + (i + 1), C.field('Título', 'cms-game-' + i + '-title', g.title || '') +
        C.field('Badge', 'cms-game-' + i + '-flag', g.flag || '') +
        C.textarea('Descripción', 'cms-game-' + i + '-text', g.text || '', 2) +
        C.textarea('Tags (uno por línea)', 'cms-game-' + i + '-tags', arrToLines(g.tags ? (Array.isArray(g.tags) ? g.tags : String(g.tags).split('\n')) : []), 2), i === 0);
    });

    html += card('Cabecera sección disciplinas', C.field('Eyebrow', 'cms-in-games-eyebrow', shells.gamesEyebrow || 'Disciplinas') +
      C.field('Título (puedes usar <em>)', 'cms-in-games-title', shells.gamesTitle || 'Tres <em>frentes</em> de batalla') +
      C.textarea('Subtítulo', 'cms-in-games-sub', shells.gamesSub || '', 2), false);

    html += card('Teaser noticias (inicio)', C.field('Eyebrow', 'cms-in-news-eyebrow', shells.newsEyebrow || 'Actualidad') +
      C.field('Título (puedes usar <em>)', 'cms-in-news-title', shells.newsTitle || 'Últimas <em>noticias</em>') +
      C.textarea('Subtítulo', 'cms-in-news-sub', shells.newsSub || '', 2) +
      C.field('Botón ver todas', 'cms-in-news-btn', shells.newsBtn || 'Ver todas las noticias →'), false);

    return html;
  }

  function renderListCrud(opts) {
    var items = opts.items || [];
    var sel = items.map(function (it, i) {
      return '<option value="' + i + '">' + (it[opts.labelKey] || it.id || ('Item ' + (i + 1))) + '</option>';
    }).join('');
    var fieldsHtml = '';
    (opts.fields || []).forEach(function (f) {
      var item = items[0] || {};
      var v = item[f.key];
      if (f.type === 'textarea') {
        fieldsHtml += C.textarea(f.label, 'cms-' + opts.prefix + '-' + f.key, v || '', f.rows || 3);
      } else if (f.type === 'number') {
        fieldsHtml += C.field(f.label, 'cms-' + opts.prefix + '-' + f.key, v || 0, 'number');
      } else if (f.type === 'checkbox') {
        fieldsHtml += '<label class="cms-check"><input type="checkbox" id="cms-' + opts.prefix + '-' + f.key + '"' + (v ? ' checked' : '') + '> ' + f.label + '</label>';
      } else {
        fieldsHtml += C.field(f.label, 'cms-' + opts.prefix + '-' + f.key, v || '');
      }
    });

    return sectionHead(opts.title, opts.desc) +
      '<div class="cms-studio-toolbar">' +
        '<label class="cms-field cms-field-grow"><span>' + (opts.itemLabel || 'Elemento') + '</span><select id="cms-' + opts.prefix + '-index">' + sel + '</select></label>' +
        '<button type="button" class="btn btn-glass btn-sm" id="cms-' + opts.prefix + '-add">+ Añadir</button>' +
        '<button type="button" class="btn btn-glass btn-sm" id="cms-' + opts.prefix + '-dup">Duplicar</button>' +
        '<button type="button" class="btn btn-glass btn-sm cms-danger" id="cms-' + opts.prefix + '-del">Eliminar</button>' +
      '</div>' +
      '<div class="cms-list-count">' + items.length + ' elementos</div>' +
      '<div id="cms-' + opts.prefix + '-form" data-cms-list="' + opts.prefix + '">' + fieldsHtml + '</div>';
  }

  function fillListForm(prefix, item, fields) {
    fields.forEach(function (f) {
      var el = document.getElementById('cms-' + prefix + '-' + f.key);
      if (!el) return;
      var v = item[f.key];
      if (f.type === 'checkbox') el.checked = !!v;
      else if (f.nested && f.nestedKey) {
        el.value = (item[f.nested] && item[f.nested][f.nestedKey]) || '';
      } else el.value = v !== undefined && v !== null ? v : '';
    });
  }

  function readListForm(prefix, fields, base) {
    var item = JSON.parse(JSON.stringify(base || {}));
    fields.forEach(function (f) {
      var el = document.getElementById('cms-' + prefix + '-' + f.key);
      if (!el) return;
      if (f.type === 'checkbox') item[f.key] = el.checked;
      else if (f.type === 'number') item[f.key] = +el.value || 0;
      else if (f.nested && f.nestedKey) {
        item[f.nested] = item[f.nested] || {};
        item[f.nested][f.nestedKey] = +el.value || 0;
      } else item[f.key] = el.value.trim();
    });
    return item;
  }

  var MISSION_FIELDS = [
    { key: 'id', label: 'ID único' },
    { key: 'title', label: 'Título' },
    { key: 'desc', label: 'Descripción' },
    { key: 'reward', label: 'Recompensa KP', type: 'number' },
    { key: 'icon', label: 'Icono emoji' },
    { key: 'cat', label: 'Categoría' },
    { key: 'type', label: 'Tipo (auto, social, visit…)' },
    { key: 'url', label: 'URL (opcional)' }
  ];

  var REWARD_FIELDS = [
    { key: 'id', label: 'ID único' },
    { key: 'name', label: 'Nombre premio' },
    { key: 'desc', label: 'Descripción', type: 'textarea', rows: 2 },
    { key: 'cost', label: 'Coste KP', type: 'number' },
    { key: 'stock', label: 'Stock' },
    { key: 'icon', label: 'Icono' },
    { key: 'tier', label: 'Tier (bronze/silver/gold/legend)' },
    { key: 'category', label: 'Categoría' }
  ];

  var POST_FIELDS = [
    { key: 'id', label: 'ID' },
    { key: 'date', label: 'Fecha' },
    { key: 'tag', label: 'Etiqueta' },
    { key: 'text', label: 'Texto del post', type: 'textarea', rows: 4 },
    { key: 'url', label: 'URL perfil/post' },
    { key: 'likes', label: 'Likes', type: 'number', nested: 'stats', nestedKey: 'likes' },
    { key: 'rts', label: 'RTs', type: 'number', nested: 'stats', nestedKey: 'rts' },
    { key: 'comments', label: 'Comentarios', type: 'number', nested: 'stats', nestedKey: 'comments' },
    { key: 'pinned', label: 'Fijado', type: 'checkbox' }
  ];

  var LEVEL_FIELDS = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre nivel' },
    { key: 'min', label: 'KP mínimo', type: 'number' },
    { key: 'icon', label: 'Icono romano' },
    { key: 'discount', label: 'Descuento tienda (0–0.2)', type: 'number' }
  ];

  var EVENT_FIELDS = [
    { key: 'id', label: 'ID' },
    { key: 'date', label: 'Fecha' },
    { key: 'time', label: 'Hora' },
    { key: 'title', label: 'Título' },
    { key: 'type', label: 'Tipo' },
    { key: 'desc', label: 'Descripción', type: 'textarea', rows: 2 },
    { key: 'icon', label: 'Icono' },
    { key: 'href', label: 'Enlace (#predicciones o URL)' }
  ];

  var FAQ_FIELDS = [
    { key: 'q', label: 'Pregunta' },
    { key: 'a', label: 'Respuesta', type: 'textarea', rows: 3 }
  ];

  var PROMO_FIELDS = [
    { key: 'code', label: 'Código' },
    { key: 'reward', label: 'KP', type: 'number' },
    { key: 'desc', label: 'Descripción' }
  ];

  var MATCH_HIST_FIELDS = [
    { key: 'id', label: 'ID' },
    { key: 'date', label: 'Fecha' },
    { key: 'gameLabel', label: 'Juego' },
    { key: 'opponent', label: 'Rival' },
    { key: 'score', label: 'Marcador' },
    { key: 'result', label: 'Resultado (lyokfox/rival/draw)' },
    { key: 'competition', label: 'Competición' }
  ];

  function renderCommMissions() {
    return renderListCrud({ title: 'Misiones Kitsune Points', desc: 'Todas las misiones de la Zona Comunidad.', prefix: 'mission', labelKey: 'title', itemLabel: 'Misión', items: getComm().missions || [], fields: MISSION_FIELDS });
  }

  function renderCommShop() {
    return renderListCrud({ title: 'Tienda / premios', desc: 'Artículos canjeables con KP.', prefix: 'reward', labelKey: 'name', itemLabel: 'Premio', items: getComm().rewards || [], fields: REWARD_FIELDS });
  }

  function renderCommSocial() {
    var c = getComm();
    return sectionHead('Posts en redes', 'Edita posts de X, Instagram y @Lyokfox_Fans.') +
      card('Posts 𝕏 Twitter', renderListCrudInner({ prefix: 'tw', labelKey: 'text', itemLabel: 'Post', items: c.twitterPosts || [], fields: POST_FIELDS }), true) +
      card('Posts Instagram', renderListCrudInner({ prefix: 'ig', labelKey: 'text', itemLabel: 'Post', items: c.instagramPosts || [], fields: POST_FIELDS }), false) +
      card('Posts @Lyokfox_Fans', renderListCrudInner({ prefix: 'fans', labelKey: 'text', itemLabel: 'Post', items: c.fansPosts || [], fields: POST_FIELDS }), false) +
      card('Recompensas X (KP por acción)', C.field('Like', 'cms-tw-rw-like', (c.twitterRewards && c.twitterRewards.perLike) || 20, 'number') +
        C.field('RT', 'cms-tw-rw-rt', (c.twitterRewards && c.twitterRewards.perRt) || 35, 'number') +
        C.field('Comentario', 'cms-tw-rw-comment', (c.twitterRewards && c.twitterRewards.perComment) || 45, 'number') +
        C.field('Combo bonus', 'cms-tw-rw-combo', (c.twitterRewards && c.twitterRewards.comboBonus) || 25, 'number'), false);
  }

  function renderListCrudInner(opts) {
    var items = opts.items || [];
    var sel = items.map(function (it, i) {
      return '<option value="' + i + '">' + (it[opts.labelKey] || it.id || ('Item ' + (i + 1))).slice(0, 60) + '</option>';
    }).join('');
    var fieldsHtml = '';
    (opts.fields || []).forEach(function (f) {
      var item = items[0] || {};
      var v = item[f.key];
      if (f.type === 'textarea') fieldsHtml += C.textarea(f.label, 'cms-' + opts.prefix + '-' + f.key, v || '', f.rows || 3);
      else if (f.type === 'number') fieldsHtml += C.field(f.label, 'cms-' + opts.prefix + '-' + f.key, v || 0, 'number');
      else if (f.type === 'checkbox') fieldsHtml += '<label class="cms-check"><input type="checkbox" id="cms-' + opts.prefix + '-' + f.key + '"' + (v ? ' checked' : '') + '> ' + f.label + '</label>';
      else fieldsHtml += C.field(f.label, 'cms-' + opts.prefix + '-' + f.key, v || '');
    });
    return '<div class="cms-studio-toolbar">' +
      '<label class="cms-field cms-field-grow"><span>' + (opts.itemLabel || 'Elemento') + '</span><select id="cms-' + opts.prefix + '-index">' + sel + '</select></label>' +
      '<button type="button" class="btn btn-glass btn-sm" id="cms-' + opts.prefix + '-add">+ Añadir</button>' +
      '<button type="button" class="btn btn-glass btn-sm" id="cms-' + opts.prefix + '-dup">Duplicar</button>' +
      '<button type="button" class="btn btn-glass btn-sm cms-danger" id="cms-' + opts.prefix + '-del">Eliminar</button>' +
    '</div><div class="cms-list-count">' + items.length + ' elementos</div><div id="cms-' + opts.prefix + '-form">' + fieldsHtml + '</div>';
  }

  function renderCommLevels() {
    return renderListCrud({ title: 'Niveles KP', desc: 'Progresión de la camada.', prefix: 'level', labelKey: 'name', itemLabel: 'Nivel', items: getComm().levels || [], fields: LEVEL_FIELDS });
  }

  function renderCommEvents() {
    return renderListCrud({ title: 'Eventos camada', desc: 'Calendario de eventos en Comunidad.', prefix: 'event', labelKey: 'title', itemLabel: 'Evento', items: getComm().communityEvents || [], fields: EVENT_FIELDS });
  }

  function renderCommFaq() {
    return renderListCrud({ title: 'FAQ Comunidad', desc: 'Preguntas frecuentes.', prefix: 'faq', labelKey: 'q', itemLabel: 'FAQ', items: getComm().faq || [], fields: FAQ_FIELDS });
  }

  function renderCommPromo() {
    return renderListCrud({ title: 'Códigos promo', desc: 'Canjeables en la tienda.', prefix: 'promo', labelKey: 'code', itemLabel: 'Código', items: getComm().promoCodes || [], fields: PROMO_FIELDS });
  }

  function renderCommMatch() {
    var c = getComm();
    return sectionHead('Partidos & predicciones', 'Historial de resultados y stats globales.') +
      renderListCrud({ title: 'Historial partidos', desc: '', prefix: 'mhist', labelKey: 'opponent', itemLabel: 'Partido', items: c.matchHistory || [], fields: MATCH_HIST_FIELDS }) +
      card('Stats globales', C.field('Miembros', 'cms-gs-members', (c.globalStats && c.globalStats.members) || '', 'number') +
        C.field('KP distribuidos', 'cms-gs-kp', (c.globalStats && c.globalStats.kpDistributed) || '', 'number') +
        C.field('Predicciones semana', 'cms-gs-pred', (c.globalStats && c.globalStats.predictionsWeek) || '', 'number') +
        C.field('Acciones X semana', 'cms-gs-x', (c.globalStats && c.globalStats.xActionsWeek) || '', 'number') +
        C.field('Premios canjeados', 'cms-gs-redeems', (c.globalStats && c.globalStats.prizesRedeemed) || '', 'number'), true) +
      C.helpBox('Resultados predicciones', 'Se gestionan solos cuando los fans predicen en Comunidad. No hace falta tocar nada aquí.', 'tip');
  }

  function renderHistoryChapters() {
    var hist = C.load().history || {};
    var chapters = hist.chapters || {};
    var sel = HISTORY_CHAPTERS.map(function (ch, i) {
      return '<option value="' + ch.id + '">' + ch.label + '</option>';
    }).join('');
    var first = HISTORY_CHAPTERS[0];
    var data = chapters[first.id] || {};
    return sectionHead('Capítulos Historia', 'Edita cada capítulo de la crónica (HTML permitido en párrafos).') +
      '<label class="cms-field cms-field-full"><span>Capítulo</span><select id="cms-hchapter-id">' + sel + '</select></label>' +
      '<div id="cms-hchapter-form">' +
        C.field('Título (HTML ok)', 'cms-hchapter-title', data.title || '') +
        C.textarea('Lead / intro', 'cms-hchapter-lead', data.lead || '', 3) +
        C.textarea('Párrafos (separados por línea en blanco, HTML ok)', 'cms-hchapter-body', (data.paragraphs || []).join('\n\n'), 14) +
      '</div>';
  }

  function renderSponsorFull() {
    var sp = (typeof SPONSOR !== 'undefined') ? SPONSOR : {};
    var html = sectionHead('Sponsor completo', 'Stats, ventajas, palmarés y proceso comercial.') +
      card('Stats hero', (sp.heroStats || []).map(function (s, i) {
        return C.field('Valor ' + (i + 1), 'cms-sp-hv-' + i, s.value || '') + C.field('Etiqueta ' + (i + 1), 'cms-sp-hl-' + i, s.label || '') + C.field('Sub ' + (i + 1), 'cms-sp-hs-' + i, s.sub || '');
      }).join(''), true);

    (sp.whyJoin || []).forEach(function (w, i) {
      html += card('Ventaja ' + (i + 1), C.field('Icono', 'cms-sp-wj-' + i + '-icon', w.icon || '') +
        C.field('Título', 'cms-sp-wj-' + i + '-title', w.title || '') +
        C.textarea('Descripción', 'cms-sp-wj-' + i + '-desc', w.desc || '', 3), false);
    });

    html += card('Palmarés sponsor (uno por línea: Juego | Título | Detalle | tier)', C.textarea('Logros', 'cms-sp-ach', (sp.achievements || []).map(function (a) {
      return (a.game || '') + ' | ' + (a.title || '') + ' | ' + (a.detail || '') + ' | ' + (a.tier || '');
    }).join('\n'), 8), false);

    return html;
  }

  function renderNavFooter() {
    var labels = (typeof SITE !== 'undefined' && SITE.pageLabels) ? SITE.pageLabels : {};
    var keys = ['inicio', 'comunidad', 'noticias', 'historia', 'equipos', 'sponsor', 'contacto'];
    return sectionHead('Menú & footer', 'Etiquetas del menú y footer.') +
      keys.map(function (k) {
        return C.field('Menú: ' + k, 'cms-nav-' + k, labels[k] || k);
      }).join('') +
      card('Enlaces partners / ligas', C.field('VPG', 'cms-link-vpg', (typeof SITE !== 'undefined' && SITE.leagues) ? SITE.leagues.vpg : '') +
        C.field('PLG', 'cms-link-plg', (typeof SITE !== 'undefined' && SITE.leagues) ? SITE.leagues.plg : '') +
        C.field('VFO', 'cms-link-vfo', (typeof SITE !== 'undefined' && SITE.leagues) ? SITE.leagues.vfo : '') +
        C.field('Impact Game', 'cms-link-impact', (typeof SITE !== 'undefined' && SITE.leagues) ? SITE.leagues.impact : '') +
        C.field('Alpha Wolfs', 'cms-link-alpha', (typeof SITE !== 'undefined' && SITE.partners) ? SITE.partners.alphaWolfs : ''), true);
  }

  function renderEnhancedNews() {
    var news = C.getMerged ? C.getMerged().news || {} : (C.load().news || {});
    var articles = C.getNewsArticles ? C.getNewsArticles() : ((typeof NEWS !== 'undefined' && NEWS.articles) ? NEWS.articles : []);
    var breaking = C.getNewsBreaking ? C.getNewsBreaking() : (news.breaking || (typeof NEWS !== 'undefined' ? NEWS.breaking : ''));
    var listHtml = articles.map(function (a, i) {
      return '<button type="button" class="cms-news-pick' + (i === 0 ? ' active' : '') + '" data-news-idx="' + i + '">' +
        '<strong>' + C.escAttr(a.title || a.id) + '</strong><span>' + (a.date || '') + ' · ' + (a.tag || '') + '</span></button>';
    }).join('');
    var a = articles[0] || {};
    var body = Array.isArray(a.body) ? a.body.join('\n\n') : '';
    return sectionHead('Noticias — editor completo', 'Lista todas las noticias · añade, duplica y elimina.') +
      C.textarea('Última hora / breaking', 'cms-news-breaking', breaking, 2) +
      '<div class="cms-news-layout">' +
        '<div class="cms-news-list" id="cms-news-list">' + listHtml + '</div>' +
        '<div class="cms-news-editor">' +
          '<div class="cms-studio-toolbar">' +
            '<button type="button" class="btn btn-glass btn-sm" id="cms-news-add">+ Nueva</button>' +
            '<button type="button" class="btn btn-glass btn-sm" id="cms-news-dup">Duplicar</button>' +
            '<button type="button" class="btn btn-glass btn-sm cms-danger" id="cms-news-del">Eliminar</button>' +
          '</div>' +
          '<input type="hidden" id="cms-news-index" value="0">' +
          '<div id="cms-news-form">' + renderNewsFormFields(a) + '</div>' +
        '</div>' +
      '</div>';
  }

  function renderNewsFormFields(a) {
    a = a || {};
    var body = Array.isArray(a.body) ? a.body.join('\n\n') : '';
    return '<div class="cms-grid">' +
      C.field('ID', 'cms-n-id', a.id || '') +
      C.field('Fecha', 'cms-n-date', a.date || '') +
      C.field('Etiqueta', 'cms-n-tag', a.tag || '') +
      C.field('Categoría', 'cms-n-cat', a.cat || '') +
      C.field('Autor', 'cms-n-author', a.author || '') +
      C.field('Min lectura', 'cms-n-read', a.readMin || 3, 'number') +
      C.field('KP', 'cms-n-kp', a.kp || 10, 'number') +
      C.field('Imagen URL', 'cms-n-image', a.image || '') +
      C.field('Fuente', 'cms-n-source', a.source || '') +
      C.field('Título', 'cms-n-title', a.title || '') +
      C.textarea('Extracto', 'cms-n-excerpt', a.excerpt || '', 3) +
      C.textarea('Cuerpo (párrafos HTML, línea vacía entre cada uno)', 'cms-n-body', body, 14) +
      '<label class="cms-check"><input type="checkbox" id="cms-n-featured"' + (a.featured ? ' checked' : '') + '> Destacado</label>' +
      '<label class="cms-check"><input type="checkbox" id="cms-n-breaking"' + (a.breaking ? ' checked' : '') + '> Breaking</label>' +
    '</div>';
  }

  function renderEnhancedPlayers() {
    var roster = getComm(); /* placeholder */
    return null; /* use base players */
  }

  var RENDERERS = {
    'home-sections': renderHomeSections,
    'comm-missions': renderCommMissions,
    'comm-shop': renderCommShop,
    'comm-social': renderCommSocial,
    'comm-levels': renderCommLevels,
    'comm-events': renderCommEvents,
    'comm-faq': renderCommFaq,
    'comm-promo': renderCommPromo,
    'comm-match': renderCommMatch,
    'history-chapters': renderHistoryChapters,
    'sponsor-full': renderSponsorFull,
    'nav-footer': renderNavFooter,
    'news': renderEnhancedNews
  };

  function bindListCrud(prefix, fields, getItems, makeNew) {
    var idxEl = document.getElementById('cms-' + prefix + '-index');
    function items() { return getItems(); }
    function refreshForm() {
      var idx = idxEl ? (+idxEl.value || 0) : 0;
      var list = items();
      fillListForm(prefix, list[idx] || {}, fields);
    }
    if (idxEl) {
      idxEl.onchange = refreshForm;
      refreshForm();
    }
    function persistList(list) {
      var o = C.load();
      o.community = o.community || JSON.parse(JSON.stringify(getComm()));
      return { o: o, list: list };
    }
    var addBtn = document.getElementById('cms-' + prefix + '-add');
    if (addBtn) addBtn.onclick = function () {
      var o = C.load();
      o.community = o.community || {};
      var key = prefix === 'tw' ? 'twitterPosts' : prefix === 'ig' ? 'instagramPosts' : prefix === 'fans' ? 'fansPosts' : prefix === 'reward' ? 'rewards' : prefix === 'mission' ? 'missions' : prefix === 'level' ? 'levels' : prefix === 'event' ? 'communityEvents' : prefix === 'faq' ? 'faq' : prefix === 'promo' ? 'promoCodes' : prefix === 'mhist' ? 'matchHistory' : '';
      if (!key) return;
      if (!o.community[key]) o.community[key] = JSON.parse(JSON.stringify(getComm()[key] || []));
      o.community[key].push(makeNew ? makeNew() : { id: prefix + '-' + Date.now(), title: 'Nuevo', name: 'Nuevo' });
      C.save(o);
      C.apply();
      if (window.CMSStudio && window.CMSStudio.goto) window.CMSStudio.goto(window.CMSStudio.activeSection || 'comm-missions');
    };
    var dupBtn = document.getElementById('cms-' + prefix + '-dup');
    if (dupBtn) dupBtn.onclick = function () {
      var idx = idxEl ? +idxEl.value : 0;
      var o = C.load();
      var keyMap = { mission: 'missions', reward: 'rewards', tw: 'twitterPosts', ig: 'instagramPosts', fans: 'fansPosts', level: 'levels', event: 'communityEvents', faq: 'faq', promo: 'promoCodes', mhist: 'matchHistory' };
      var key = keyMap[prefix];
      if (!key) return;
      o.community = o.community || {};
      o.community[key] = JSON.parse(JSON.stringify(getComm()[key] || []));
      var copy = JSON.parse(JSON.stringify(o.community[key][idx] || {}));
      copy.id = (copy.id || prefix) + '-copy-' + Date.now();
      o.community[key].push(copy);
      C.save(o);
      C.apply();
      if (window.CMSStudio && window.CMSStudio.goto) window.CMSStudio.goto(window.CMSStudio.activeSection);
    };
    var delBtn = document.getElementById('cms-' + prefix + '-del');
    if (delBtn) delBtn.onclick = function () {
      if (!confirm('¿Eliminar este elemento?')) return;
      var idx = idxEl ? +idxEl.value : 0;
      var o = C.load();
      var keyMap = { mission: 'missions', reward: 'rewards', tw: 'twitterPosts', ig: 'instagramPosts', fans: 'fansPosts', level: 'levels', event: 'communityEvents', faq: 'faq', promo: 'promoCodes', mhist: 'matchHistory' };
      var key = keyMap[prefix];
      if (!key) return;
      o.community[key] = JSON.parse(JSON.stringify(getComm()[key] || []));
      o.community[key].splice(idx, 1);
      C.save(o);
      C.apply();
      if (window.CMSStudio && window.CMSStudio.goto) window.CMSStudio.goto(window.CMSStudio.activeSection);
    };
  }

  function bindProSection(id) {
    if (id === 'comm-missions') bindListCrud('mission', MISSION_FIELDS, function () { return getComm().missions || []; }, function () { return { id: 'm-' + Date.now(), title: 'Nueva misión', desc: '', reward: 50, icon: '🎯', cat: 'inicio', type: 'auto' }; });
    if (id === 'comm-shop') bindListCrud('reward', REWARD_FIELDS, function () { return getComm().rewards || []; }, function () { return { id: 'item-' + Date.now(), name: 'Nuevo premio', desc: '', cost: 500, stock: 'Disponible', icon: '🎁', tier: 'bronze', category: 'merch' }; });
    if (id === 'comm-levels') bindListCrud('level', LEVEL_FIELDS, function () { return getComm().levels || []; });
    if (id === 'comm-events') bindListCrud('event', EVENT_FIELDS, function () { return getComm().communityEvents || []; });
    if (id === 'comm-faq') bindListCrud('faq', FAQ_FIELDS, function () { return getComm().faq || []; });
    if (id === 'comm-promo') bindListCrud('promo', PROMO_FIELDS, function () { return getComm().promoCodes || []; });
    if (id === 'comm-match') bindListCrud('mhist', MATCH_HIST_FIELDS, function () { return getComm().matchHistory || []; });

    if (id === 'comm-social') {
      bindListCrud('tw', POST_FIELDS, function () { return getComm().twitterPosts || []; });
      bindListCrud('ig', POST_FIELDS, function () { return getComm().instagramPosts || []; }, function () { return { id: 'ig-' + Date.now(), date: '2025-06-21', tag: 'LyokFox', text: '', url: '', stats: { likes: 0, comments: 0 } }; });
      bindListCrud('fans', POST_FIELDS, function () { return getComm().fansPosts || []; }, function () { return { id: 'fans-' + Date.now(), date: '2025-06-21', tag: 'Fans', text: '', url: '', stats: { likes: 0, rts: 0 } }; });
    }

    if (id === 'history-chapters') {
      var sel = document.getElementById('cms-hchapter-id');
      var hist = C.load().history || {};
      var chapters = hist.chapters || {};
      function loadChapter() {
        var cid = sel ? sel.value : '';
        var data = chapters[cid] || {};
        var t = document.getElementById('cms-hchapter-title');
        var l = document.getElementById('cms-hchapter-lead');
        var b = document.getElementById('cms-hchapter-body');
        if (t) t.value = data.title || '';
        if (l) l.value = data.lead || '';
        if (b) b.value = (data.paragraphs || []).join('\n\n');
      }
      if (sel) { sel.onchange = loadChapter; loadChapter(); }
    }

    if (id === 'news') bindEnhancedNews();
  }

  function bindEnhancedNews() {
    var articles = C.getNewsArticles ? C.getNewsArticles().slice() : ((typeof NEWS !== 'undefined' && NEWS.articles) ? NEWS.articles.slice() : []);
    var idxInput = document.getElementById('cms-news-index');
    var form = document.getElementById('cms-news-form');

    function readArticle() {
      var bodyRaw = val('cms-n-body');
      return {
        id: val('cms-n-id'),
        date: val('cms-n-date'),
        tag: val('cms-n-tag'),
        cat: val('cms-n-cat'),
        author: val('cms-n-author'),
        readMin: +val('cms-n-read') || 3,
        kp: +val('cms-n-kp') || 10,
        image: val('cms-n-image'),
        source: val('cms-n-source'),
        title: val('cms-n-title'),
        excerpt: val('cms-n-excerpt'),
        body: bodyRaw ? bodyRaw.split(/\n\s*\n/).filter(Boolean) : [],
        featured: chk('cms-n-featured'),
        breaking: chk('cms-n-breaking')
      };
    }

    function showArticle(i) {
      if (idxInput) idxInput.value = i;
      var a = articles[i] || {};
      if (form) form.innerHTML = renderNewsFormFields(a);
      document.querySelectorAll('.cms-news-pick').forEach(function (btn) {
        btn.classList.toggle('active', +btn.dataset.newsIdx === i);
      });
    }

    document.querySelectorAll('.cms-news-pick').forEach(function (btn) {
      btn.onclick = function () {
        var cur = idxInput ? +idxInput.value : 0;
        articles[cur] = readArticle();
        showArticle(+btn.dataset.newsIdx);
      };
    });

    var addBtn = document.getElementById('cms-news-add');
    if (addBtn) addBtn.onclick = function () {
      var cur = idxInput ? +idxInput.value : 0;
      articles[cur] = readArticle();
      articles.unshift({ id: 'n-' + Date.now(), date: '2025-06-21', tag: 'LyokFox', cat: 'clubesPro', title: 'Nueva noticia', excerpt: '', body: [''], author: 'Staff', readMin: 3, kp: 10 });
      var o = C.load();
      o.news = o.news || {};
      o.news.articles = articles;
      C.save(o);
      C.apply();
      if (window.CMSStudio && window.CMSStudio.goto) window.CMSStudio.goto('news');
    };

    var dupBtn = document.getElementById('cms-news-dup');
    if (dupBtn) dupBtn.onclick = function () {
      var cur = idxInput ? +idxInput.value : 0;
      articles[cur] = readArticle();
      var copy = JSON.parse(JSON.stringify(articles[cur]));
      copy.id = copy.id + '-copy';
      copy.title = copy.title + ' (copia)';
      articles.splice(cur + 1, 0, copy);
      var o = C.load();
      o.news = { breaking: val('cms-news-breaking'), articles: articles };
      C.save(o);
      C.apply();
      if (window.CMSStudio && window.CMSStudio.goto) window.CMSStudio.goto('news');
    };

    var delBtn = document.getElementById('cms-news-del');
    if (delBtn) delBtn.onclick = function () {
      if (!confirm('¿Eliminar noticia?')) return;
      var cur = idxInput ? +idxInput.value : 0;
      articles.splice(cur, 1);
      var o = C.load();
      o.news = { breaking: val('cms-news-breaking'), articles: articles };
      C.save(o);
      C.apply();
      if (window.CMSStudio && window.CMSStudio.goto) window.CMSStudio.goto('news');
    };
  }

  function collectList(prefix, fields, key) {
    if (!document.getElementById('cms-' + prefix + '-index')) return;
    var idx = +val('cms-' + prefix + '-index') || 0;
    var list = JSON.parse(JSON.stringify(getComm()[key] || []));
    if (!list.length && document.getElementById('cms-' + prefix + '-' + fields[0].key)) {
      list = [{}];
    }
    if (list[idx]) list[idx] = readListForm(prefix, fields, list[idx]);
    return list;
  }

  function collectPro(o) {
    if (document.getElementById('cms-kp-title')) {
      o.home = o.home || {};
      o.home.kp = {
        title: val('cms-kp-title'),
        desc: val('cms-kp-desc'),
        list: linesToArr(val('cms-kp-list'))
      };
      if (document.getElementById('cms-kp-chips')) {
        o.home.kp.chips = linesToArr(val('cms-kp-chips'));
      }
      if (document.getElementById('cms-in-schedule-note')) {
        o.home.scheduleNote = val('cms-in-schedule-note');
      }
      o.home.gameCards = [];
      for (var gi = 0; gi < 3; gi++) {
        if (!document.getElementById('cms-game-' + gi + '-title')) continue;
        o.home.gameCards.push({
          title: val('cms-game-' + gi + '-title'),
          flag: val('cms-game-' + gi + '-flag'),
          text: val('cms-game-' + gi + '-text'),
          tags: linesToArr(val('cms-game-' + gi + '-tags'))
        });
      }
      if (document.getElementById('cms-in-brands-label')) {
        o.pageShells = o.pageShells || {};
        o.pageShells.inicio = {
          brandsLabel: val('cms-in-brands-label'),
          brandLabels: linesToArr(val('cms-in-brand-labels')),
          kpEyebrow: val('cms-in-kp-eyebrow'),
          kpBtn1: val('cms-in-kp-btn1'),
          kpBtn2: val('cms-in-kp-btn2'),
          gamesEyebrow: val('cms-in-games-eyebrow'),
          gamesTitle: val('cms-in-games-title'),
          gamesSub: val('cms-in-games-sub'),
          newsEyebrow: val('cms-in-news-eyebrow'),
          newsTitle: val('cms-in-news-title'),
          newsSub: val('cms-in-news-sub'),
          newsBtn: val('cms-in-news-btn'),
          matchEyebrow: val('cms-md-eyebrow'),
          matchTitle: val('cms-md-title')
        };
      }
    }

    o.community = o.community || {};
    if (document.getElementById('cms-mission-index')) o.community.missions = collectList('mission', MISSION_FIELDS, 'missions');
    if (document.getElementById('cms-reward-index')) o.community.rewards = collectList('reward', REWARD_FIELDS, 'rewards');
    if (document.getElementById('cms-tw-index')) o.community.twitterPosts = collectList('tw', POST_FIELDS, 'twitterPosts');
    if (document.getElementById('cms-ig-index')) o.community.instagramPosts = collectList('ig', POST_FIELDS, 'instagramPosts');
    if (document.getElementById('cms-fans-index')) o.community.fansPosts = collectList('fans', POST_FIELDS, 'fansPosts');
    if (document.getElementById('cms-level-index')) o.community.levels = collectList('level', LEVEL_FIELDS, 'levels');
    if (document.getElementById('cms-event-index')) o.community.communityEvents = collectList('event', EVENT_FIELDS, 'communityEvents');
    if (document.getElementById('cms-faq-index')) o.community.faq = collectList('faq', FAQ_FIELDS, 'faq');
    if (document.getElementById('cms-promo-index')) o.community.promoCodes = collectList('promo', PROMO_FIELDS, 'promoCodes');
    if (document.getElementById('cms-mhist-index')) o.community.matchHistory = collectList('mhist', MATCH_HIST_FIELDS, 'matchHistory');

    if (document.getElementById('cms-tw-rw-like')) {
      o.community.twitterRewards = o.community.twitterRewards || {};
      o.community.twitterRewards.perLike = +val('cms-tw-rw-like') || 20;
      o.community.twitterRewards.perRt = +val('cms-tw-rw-rt') || 35;
      o.community.twitterRewards.perComment = +val('cms-tw-rw-comment') || 45;
      o.community.twitterRewards.comboBonus = +val('cms-tw-rw-combo') || 25;
    }

    if (document.getElementById('cms-gs-members')) {
      o.community.globalStats = {
        members: +val('cms-gs-members') || 0,
        kpDistributed: +val('cms-gs-kp') || 0,
        predictionsWeek: +val('cms-gs-pred') || 0,
        xActionsWeek: +val('cms-gs-x') || 0,
        prizesRedeemed: +val('cms-gs-redeems') || 0
      };
    }

    if (document.getElementById('cms-hchapter-id')) {
      var storedHist = C.load().history || {};
      o.history = o.history || storedHist;
      o.history.chapters = o.history.chapters || storedHist.chapters || {};
      var cid = val('cms-hchapter-id');
      var bodyRaw = val('cms-hchapter-body');
      o.history.chapters[cid] = {
        title: val('cms-hchapter-title'),
        lead: val('cms-hchapter-lead'),
        paragraphs: bodyRaw ? bodyRaw.split(/\n\s*\n/).filter(Boolean) : []
      };
    }

    if (document.getElementById('cms-sp-hv-0')) {
      o.sponsor = o.sponsor || JSON.parse(JSON.stringify(typeof SPONSOR !== 'undefined' ? SPONSOR : {}));
      o.sponsor.heroStats = o.sponsor.heroStats || [];
      for (var si = 0; si < 4; si++) {
        if (document.getElementById('cms-sp-hv-' + si)) {
          o.sponsor.heroStats[si] = { value: val('cms-sp-hv-' + si), label: val('cms-sp-hl-' + si), sub: val('cms-sp-hs-' + si) };
        }
      }
      o.sponsor.whyJoin = o.sponsor.whyJoin || [];
      var wi = 0;
      while (document.getElementById('cms-sp-wj-' + wi + '-title')) {
        o.sponsor.whyJoin[wi] = {
          icon: val('cms-sp-wj-' + wi + '-icon'),
          title: val('cms-sp-wj-' + wi + '-title'),
          desc: val('cms-sp-wj-' + wi + '-desc')
        };
        wi++;
      }
      var achLines = linesToArr(val('cms-sp-ach'));
      if (achLines.length) {
        o.sponsor.achievements = achLines.map(function (line) {
          var p = line.split('|');
          return { game: (p[0] || '').trim(), title: (p[1] || '').trim(), detail: (p[2] || '').trim(), tier: (p[3] || '').trim() || 'silver' };
        });
      }
    }

    if (document.getElementById('cms-nav-inicio')) {
      o.site = o.site || {};
      o.site.pageLabels = o.site.pageLabels || {};
      ['inicio', 'comunidad', 'noticias', 'historia', 'equipos', 'sponsor', 'contacto'].forEach(function (k) {
        o.site.pageLabels[k] = val('cms-nav-' + k);
      });
      o.site.leagues = {
        vpg: val('cms-link-vpg'),
        plg: val('cms-link-plg'),
        vfo: val('cms-link-vfo'),
        impact: val('cms-link-impact')
      };
      o.site.partners = { alphaWolfs: val('cms-link-alpha') };
    }

    if (document.getElementById('cms-news-list')) {
      var articles = C.getNewsArticles ? C.getNewsArticles().slice() : JSON.parse(JSON.stringify((typeof NEWS !== 'undefined' && NEWS.articles) ? NEWS.articles : []));
      var cur = +val('cms-news-index') || 0;
      if (document.getElementById('cms-n-title')) {
        var bodyRaw = val('cms-n-body');
        articles[cur] = {
          id: val('cms-n-id'),
          date: val('cms-n-date'),
          tag: val('cms-n-tag'),
          cat: val('cms-n-cat'),
          author: val('cms-n-author'),
          readMin: +val('cms-n-read') || 3,
          kp: +val('cms-n-kp') || 10,
          image: val('cms-n-image'),
          source: val('cms-n-source'),
          title: val('cms-n-title'),
          excerpt: val('cms-n-excerpt'),
          body: bodyRaw ? bodyRaw.split(/\n\s*\n/).filter(Boolean) : [],
          featured: chk('cms-n-featured'),
          breaking: chk('cms-n-breaking')
        };
      }
      o.news = { breaking: val('cms-news-breaking'), articles: articles };
    }

    /* Jugadores — guardar los 3 equipos completos */
    if (document.getElementById('cms-p-name')) {
      o.rosters = o.rosters || {};
      TEAM_KEYS.forEach(function (t) {
        o.rosters[t.key] = JSON.parse(JSON.stringify((typeof ROSTERS !== 'undefined' && ROSTERS[t.key]) ? ROSTERS[t.key] : []));
      });
      var team = val('cms-player-team');
      var idx = +val('cms-player-index') || 0;
      if (o.rosters[team] && o.rosters[team][idx]) {
        o.rosters[team][idx] = {
          name: val('cms-p-name'),
          role: val('cms-p-role'),
          note: val('cms-p-note'),
          bio: val('cms-p-bio'),
          twitter: val('cms-p-twitter'),
          trophies: val('cms-p-trophies'),
          mains: val('cms-p-mains'),
          joined: val('cms-p-joined'),
          avatar: val('cms-p-avatar'),
          captain: chk('cms-p-captain')
        };
      }
    }

    return o;
  }

  window.CMSStudioPro = {
    nav: PRO_NAV,
    render: function (id) {
      if (RENDERERS[id]) return RENDERERS[id]();
      return null;
    },
    bind: bindProSection,
    collect: collectPro
  };
})();
