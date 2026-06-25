/* Historia — editor espejo 1:1 con historia.html (10 capítulos + hitos + nav) */
(function () {
  'use strict';
  if (typeof window.CMS === 'undefined') return;
  var C = window.CMS;

  var CHAPTERS = [
    { id: 'cap-filosofia', label: 'Capítulo I · Filosofía kitsune', nav: 'Filosofía' },
    { id: 'cap-origen', label: 'Origen detallado · 2020–2021', nav: 'Origen' },
    { id: 'cap-comunidad', label: 'Capítulo II · Comunidad naranja', nav: 'Comunidad' },
    { id: 'cap-movil', label: 'Esports móvil · Brawl & UNITE', nav: 'Móvil' },
    { id: 'cap-clubes', label: 'Era Clubes Pro · 2022–2023', nav: 'Clubes Pro' },
    { id: 'cap-oro', label: 'Era dorada', nav: 'Era dorada' },
    { id: 'cap-europa', label: 'Europa · VPG Europa League', nav: 'Europa' },
    { id: 'cap-transicion', label: 'Transición generacional', nav: 'Transición' },
    { id: 'cap-fc26', label: 'FC26 · Nueva era', nav: 'FC26' },
    { id: 'cap-hoy', label: 'Presente · LyokFox hoy', nav: 'Hoy' }
  ];

  function val(id) { var el = document.getElementById(id); return el ? String(el.value).trim() : ''; }
  function linesToArr(t) { return t ? t.split('\n').map(function (s) { return s.trim(); }).filter(Boolean) : []; }
  function arrToLines(a) { return (a || []).join('\n'); }

  function getHist() {
    if (C.getHistoryData) return C.getHistoryData();
    return C.load().history || {};
  }
  function getChapter(id) {
    var h = getHist();
    var ch = (h.chapters && h.chapters[id]) ? h.chapters[id] : {};
    return C.normalizeHistoryChapter ? C.normalizeHistoryChapter(ch) : ch;
  }

  function chapterFields(id, ch, open) {
    ch = ch || {};
    return '<details class="cms-studio-card cms-studio-card--easy cms-hist-chapter"' + (open ? ' open' : '') + ' data-chapter="' + id + '">' +
      '<summary>' + CHAPTERS.find(function (c) { return c.id === id; }).label + '</summary>' +
      '<div class="cms-studio-card-body">' +
        C.fieldEasy('Etiqueta capítulo (ej: Capítulo I)', 'hist-' + id + '-num', ch.chapterNum || '', { where: 'historia.html · ' + id }) +
        C.fieldEasy('Título H2 (HTML ok)', 'hist-' + id + '-title', ch.title || '', { full: true }) +
        C.fieldEasy('Subtítulo', 'hist-' + id + '-sub', ch.subtitle || '', { full: true }) +
        C.fieldEasy('Era / fechas (panel lateral)', 'hist-' + id + '-era', ch.eraLabel || '') +
        C.textareaEasy('Párrafos (línea vacía entre cada uno · HTML ok)', 'hist-' + id + '-body', (ch.paragraphs || []).join('\n\n'), { rows: 8, full: true }) +
        C.fieldEasy('Cita (opcional)', 'hist-' + id + '-quote', ch.quoteText || '') +
        C.fieldEasy('Autor cita', 'hist-' + id + '-cite', ch.quoteCite || '') +
      '</div></details>';
  }

  function renderHistoriaCompleta() {
    var h = getHist();
    var navById = h.navById || {};
    CHAPTERS.forEach(function (c) { if (!navById[c.id]) navById[c.id] = c.nav; });
    var stats = h.originStats || [
      { value: '2020', label: 'Año de fundación' },
      { value: '5+', label: 'Temporadas activas' },
      { value: '7700+', label: 'Seguidores @LyokFox' },
      { value: '43', label: 'Jugadores en plantilla' },
      { value: '3', label: 'Ligas · VPG PLG VFO' },
      { value: 'Top 7/9', label: 'Brawl Stars oficial' },
      { value: 'Top EU', label: 'Pokémon UNITE' }
    ];
    var milestones = h.milestones || [];
    var html = '<header class="cms-studio-section-head cms-studio-section-head--easy">' +
      '<h2>Historia — espejo de la web</h2>' +
      '<p>Mismas secciones que <strong>historia.html</strong>: 10 capítulos, navegación, stats origen y cronología de hitos.</p></header>' +
      C.helpBox('Cohesión', 'Cada bloque aquí corresponde a un bloque visible en la página Historia. Guarda y recarga para ver cambios.', 'info');

    html += '<details class="cms-studio-card cms-studio-card--easy" open><summary>Intro &amp; chips hero</summary><div class="cms-studio-card-body">' +
      C.fieldEasy('Título intro origen', 'hist-intro-title', h.introTitle || 'Origen LyokFox', { full: true }) +
      C.textareaEasy('Lead intro', 'hist-intro-lead', h.introLead || '', { rows: 4, full: true }) +
      C.textareaEasy('Chips hero (uno por línea)', 'hist-chips', arrToLines(h.chips || ['Est. 2020', 'BS Top 7 · Top 9', 'UNITE Top Europa', 'VPG · PLG · VFO']), { rows: 3 }) +
      C.textareaEasy('Párrafos bloque origen (línea vacía entre párrafos)', 'hist-origin-body', (h.blocks && h.blocks.origin && h.blocks.origin.paragraphs) ? h.blocks.origin.paragraphs.join('\n\n') : '', { rows: 6, full: true }) +
    '</div></details>';

    html += '<details class="cms-studio-card cms-studio-card--easy"><summary>Menú navegación capítulos (10 enlaces)</summary><div class="cms-studio-card-body">' +
      CHAPTERS.map(function (c) {
        return C.fieldEasy('Enlace #' + c.id.replace('cap-', ''), 'hist-nav-' + c.id, navById[c.id] || c.nav);
      }).join('') +
    '</div></details>';

    html += '<details class="cms-studio-card cms-studio-card--easy"><summary>Stats bloque origen</summary><div class="cms-studio-card-body">' +
      stats.map(function (s, i) {
        return C.fieldEasy('Valor ' + (i + 1), 'hist-ostat-v-' + i, s.value || '') +
          C.fieldEasy('Etiqueta ' + (i + 1), 'hist-ostat-l-' + i, s.label || '');
      }).join('') +
    '</div></details>';

    html += '<p class="cms-studio-subtitle">Los 10 capítulos de la crónica</p>';
    CHAPTERS.forEach(function (c, i) {
      html += chapterFields(c.id, getChapter(c.id), i === 0);
    });

    html += '<details class="cms-studio-card cms-studio-card--easy"><summary>Cronología · hitos (tarjetas timeline)</summary><div class="cms-studio-card-body">' +
      C.fieldEasy('Eyebrow sección', 'hist-mile-eyebrow', (h.milestonesHeader && h.milestonesHeader.eyebrow) || 'Cronología') +
      C.fieldEasy('Título sección', 'hist-mile-title', (h.milestonesHeader && h.milestonesHeader.title) || 'Hitos LyokFox') +
      C.fieldEasy('Subtítulo', 'hist-mile-sub', (h.milestonesHeader && h.milestonesHeader.sub) || 'Diecinueve capítulos clave en la crónica del club.') +
      C.textareaEasy('Hitos (formato: Año | Etiqueta | Título | Texto — uno por línea)', 'hist-milestones', milestones.length ? milestones.map(function (m) {
        return (m.year || '') + ' | ' + (m.tag || '') + ' | ' + (m.title || '') + ' | ' + (m.text || '');
      }).join('\n') : '', { rows: 12, full: true, hint: 'Ej: 2020 | Fundación | Nace LyokFox Esports | Organización fundada...' }) +
    '</div></details>';

    return html;
  }

  function collectHistoria(o) {
    if (!document.getElementById('hist-intro-title')) return o;
    o.history = o.history || {};
    o.history.introTitle = val('hist-intro-title');
    o.history.introLead = val('hist-intro-lead');
    o.history.chips = linesToArr(val('hist-chips'));
    var originBody = val('hist-origin-body');
    o.history.blocks = o.history.blocks || {};
    o.history.blocks.origin = {
      paragraphs: originBody ? originBody.split(/\n\s*\n/).filter(Boolean) : []
    };

    o.history.navById = {};
    CHAPTERS.forEach(function (c) {
      o.history.navById[c.id] = val('hist-nav-' + c.id) || c.nav;
    });

    o.history.originStats = [];
    for (var si = 0; document.getElementById('hist-ostat-v-' + si); si++) {
      o.history.originStats.push({ value: val('hist-ostat-v-' + si), label: val('hist-ostat-l-' + si) });
    }

    o.history.chapters = o.history.chapters || {};
    CHAPTERS.forEach(function (c) {
      if (!document.getElementById('hist-' + c.id + '-title')) return;
      var body = val('hist-' + c.id + '-body');
      o.history.chapters[c.id] = {
        chapterNum: val('hist-' + c.id + '-num'),
        title: val('hist-' + c.id + '-title'),
        subtitle: val('hist-' + c.id + '-sub'),
        eraLabel: val('hist-' + c.id + '-era'),
        paragraphs: body ? body.split(/\n\s*\n/).filter(Boolean) : [],
        quoteText: val('hist-' + c.id + '-quote'),
        quoteCite: val('hist-' + c.id + '-cite')
      };
    });

    o.history.milestonesHeader = {
      eyebrow: val('hist-mile-eyebrow'),
      title: val('hist-mile-title'),
      sub: val('hist-mile-sub')
    };
    var mlines = linesToArr(val('hist-milestones'));
    if (mlines.length) {
      o.history.milestones = mlines.map(function (line) {
        var p = line.split('|');
        return { year: (p[0] || '').trim(), tag: (p[1] || '').trim(), title: (p[2] || '').trim(), text: (p[3] || '').trim() };
      });
    }

    return o;
  }

  window.CMSStudioHistoria = {
    nav: [],
    render: function (id) {
      if (id === 'historia-completa') return renderHistoriaCompleta();
      return null;
    },
    collect: collectHistoria,
    bind: function () { /* static form */ }
  };
})();
