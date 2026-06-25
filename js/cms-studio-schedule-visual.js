/* Calendario Studio — misma vista que Inicio (portada + grid partidos) */
(function () {
  'use strict';
  if (typeof window.CMS === 'undefined') return;
  var C = window.CMS;

  var GAMES = [
    { key: 'eafc', label: 'Clubes Pro FC26' },
    { key: 'brawl', label: 'Brawl Stars' },
    { key: 'clash', label: 'Clash Royale' }
  ];

  var STATUSES = ['Próximo', 'Hoy', 'En directo', 'Finalizado'];

  function val(id) { var el = document.getElementById(id); return el ? String(el.value).trim() : ''; }
  function selVal(id) { var el = document.getElementById(id); return el ? el.value : ''; }

  function getSched() {
    var o = C.load();
    if (o.schedule) return o.schedule;
    if (typeof SCHEDULE !== 'undefined') return SCHEDULE;
    return { featured: {}, upcoming: [] };
  }

  function gameClass(game) {
    if (game === 'brawl') return 'match-brawl';
    if (game === 'clash') return 'match-clash';
    return 'match-eafc';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    var d = new Date(dateStr + 'T12:00:00');
    var days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    var months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()];
  }

  function gameLabelFor(key) {
    var g = GAMES.find(function (x) { return x.key === key; });
    return g ? g.label : 'Clubes Pro FC26';
  }

  function featuredPreview(f) {
    f = f || {};
    return '<div class="cms-sched-live-preview">' +
      '<p class="cms-sched-preview-label">📍 Así se ve en la <strong>portada de Inicio</strong></p>' +
      '<div class="featured-match cms-sched-featured-wrap">' +
        '<div class="featured-match-inner ' + gameClass(f.game || 'eafc') + '">' +
          '<span class="match-live-tag">' + C.escAttr(f.status || 'Próximo') + '</span>' +
          '<p class="match-game-label">' + C.escAttr(f.gameLabel || gameLabelFor(f.game)) + '</p>' +
          '<h3 class="match-opponent">' + C.escAttr(f.opponent || 'Rival') + '</h3>' +
          '<p class="match-comp">' + C.escAttr(f.competition || 'Competición') + '</p>' +
          '<div class="match-datetime">' +
            '<span>' + formatDate(f.date) + '</span>' +
            '<strong>' + C.escAttr(f.time || '22:00') + ' CEST</strong>' +
          '</div>' +
          '<span class="match-venue">' + C.escAttr(f.venue || 'Online · PS5') + '</span>' +
        '</div>' +
      '</div></div>';
  }

  function matchCardPreview(m, i, active) {
    m = m || {};
    return '<article class="match-card ' + gameClass(m.game || 'eafc') + (i === 0 ? ' match-card-next' : '') +
      ' cms-sched-pick' + (active ? ' cms-sched-pick--active' : '') + '" data-sched-idx="' + i + '" tabindex="0" role="button">' +
      '<div class="match-card-top">' +
        '<span class="match-card-game">' + C.escAttr(m.gameLabel || gameLabelFor(m.game)) + '</span>' +
        '<span class="match-card-status">' + C.escAttr(m.status || 'Próximo') + '</span>' +
      '</div>' +
      '<h3 class="match-card-vs">' + C.escAttr(m.opponent || 'Rival') + '</h3>' +
      '<p class="match-card-comp">' + C.escAttr(m.competition || '') + '</p>' +
      '<div class="match-card-foot">' +
        '<time>' + formatDate(m.date) + ' · ' + C.escAttr(m.time || '') + '</time>' +
      '</div>' +
      '<span class="cms-sched-pick-hint">✏️ Editar</span>' +
    '</article>';
  }

  function selectOptions(list, selected) {
    return list.map(function (item) {
      var v = typeof item === 'string' ? item : item.key;
      var l = typeof item === 'string' ? item : item.label;
      return '<option value="' + C.escAttr(v) + '"' + (v === selected ? ' selected' : '') + '>' + C.escAttr(l) + '</option>';
    }).join('');
  }

  function featuredForm(f) {
    f = f || {};
    return '<div class="cms-sched-editor cms-sched-editor--featured">' +
      '<h3>⚽ Partido destacado (portada)</h3>' +
      '<div class="cms-grid">' +
        C.fieldEasy('Rival', 'cms-feat-opponent', f.opponent || '', { where: 'Portada Inicio · nombre grande' }) +
        C.fieldEasy('Competición', 'cms-feat-competition', f.competition || '', { where: 'Portada', full: true }) +
        '<label class="cms-field"><span>Disciplina</span><select id="cms-feat-game">' + selectOptions(GAMES, f.game || 'eafc') + '</select></label>' +
        C.fieldEasy('Fecha', 'cms-feat-date', f.date || '', { placeholder: '21/06/2026', hint: 'Día, mes y año del partido' }) +
        C.fieldEasy('Hora', 'cms-feat-time', f.time || '', { placeholder: '22:20' }) +
        '<label class="cms-field"><span>Estado</span><select id="cms-feat-status">' +
          STATUSES.map(function (s) { return '<option' + (s === (f.status || 'Próximo') ? ' selected' : '') + '>' + s + '</option>'; }).join('') +
        '</select></label>' +
        C.fieldEasy('Sede / formato', 'cms-feat-venue', f.venue || 'Online · PS5', { where: 'Texto bajo la fecha' }) +
        C.fieldEasy('Enlace directo (X/Twitch)', 'cms-feat-stream', f.stream || '', { full: true }) +
        '<input type="hidden" id="cms-feat-id" value="' + C.escAttr(f.id || 'feat-1') + '">' +
        '<input type="hidden" id="cms-feat-gameLabel" value="' + C.escAttr(f.gameLabel || gameLabelFor(f.game)) + '">' +
        '<input type="hidden" id="cms-sched-visual" value="1">' +
      '</div></div>';
  }

  function matchForm(m, idx) {
    m = m || {};
    return '<div class="cms-sched-editor cms-sched-editor--match">' +
      '<h3>✏️ Partido ' + (idx + 1) + '</h3>' +
      '<div class="cms-grid">' +
        C.fieldEasy('Rival', 'cms-match-' + idx + '-opponent', m.opponent || '', { full: true }) +
        C.fieldEasy('Competición', 'cms-match-' + idx + '-competition', m.competition || '', { full: true }) +
        '<label class="cms-field"><span>Disciplina</span><select id="cms-match-' + idx + '-game">' + selectOptions(GAMES, m.game || 'eafc') + '</select></label>' +
        C.fieldEasy('Fecha', 'cms-match-' + idx + '-date', m.date || '', { placeholder: '2026-06-21' }) +
        C.fieldEasy('Hora', 'cms-match-' + idx + '-time', m.time || '', { placeholder: '22:00' }) +
        '<label class="cms-field"><span>Estado</span><select id="cms-match-' + idx + '-status">' +
          STATUSES.map(function (s) { return '<option' + (s === (m.status || 'Próximo') ? ' selected' : '') + '>' + s + '</option>'; }).join('') +
        '</select></label>' +
        '<input type="hidden" id="cms-match-' + idx + '-id" value="' + C.escAttr(m.id || ('m-' + idx)) + '">' +
        '<button type="button" class="btn btn-glass btn-sm cms-danger cms-match-remove" data-idx="' + idx + '">🗑️ Quitar este partido</button>' +
      '</div></div>';
  }

  function renderScheduleVisual() {
    var sched = getSched();
    var f = sched.featured || {};
    var upcoming = sched.upcoming || [];
    var activeIdx = 0;

    var html = '<header class="cms-studio-section-head cms-studio-section-head--easy">' +
      '<h2>📅 Calendario · vista Inicio</h2>' +
      '<p>Editas exactamente lo que ven los fans: partido grande en portada + tarjetas de abajo.</p></header>' +
      C.helpBox('Cómo funciona', 'Cambia los campos → mira la vista previa → <strong>💾 Guardar todo</strong>. Sin códigos ni archivos raros.', 'tip');

    html += featuredPreview(f);
    html += featuredForm(f);

    html += '<div class="cms-sched-section-head">' +
      '<h3>Próximos partidos</h3>' +
      '<p class="cms-hint">Misma cuadrícula que en Inicio, sección Matchday.</p>' +
      '<button type="button" class="btn btn-glass btn-sm" id="cms-match-add">+ Añadir partido</button>' +
    '</div>';

    html += '<div class="cms-sched-grid-preview schedule-grid">';
    if (!upcoming.length) {
      html += '<p class="cms-hint">No hay partidos en la lista. Pulsa <strong>+ Añadir partido</strong>.</p>';
    } else {
      upcoming.forEach(function (m, i) { html += matchCardPreview(m, i, i === activeIdx); });
    }
    html += '</div>';

    html += '<div id="cms-sched-match-forms">';
    upcoming.forEach(function (m, i) {
      html += '<div class="cms-sched-form-panel' + (i === activeIdx ? ' is-active' : '') + '" data-form-idx="' + i + '">' +
        matchForm(m, i) + '</div>';
    });
    html += '</div>';

    return html;
  }

  function bindScheduleVisual(gotoSection) {
    var gameSel = document.getElementById('cms-feat-game');
    if (gameSel) {
      gameSel.onchange = function () {
        var lbl = document.getElementById('cms-feat-gameLabel');
        if (lbl) lbl.value = gameLabelFor(gameSel.value);
      };
    }

    function showMatchEditor(idx) {
      document.querySelectorAll('.cms-sched-pick').forEach(function (el) {
        el.classList.toggle('cms-sched-pick--active', +el.dataset.schedIdx === idx);
      });
      document.querySelectorAll('.cms-sched-form-panel').forEach(function (el) {
        el.classList.toggle('is-active', +el.dataset.formIdx === idx);
      });
      bindRemoveButtons(gotoSection);
      if (window.CMSStudioPreview && typeof window.CMSStudioPreview.syncContext === 'function') {
        window.CMSStudioPreview.syncContext();
      }
    }

    document.querySelectorAll('.cms-sched-pick').forEach(function (card) {
      var open = function () { showMatchEditor(+card.dataset.schedIdx); };
      card.addEventListener('click', open);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });

    var addBtn = document.getElementById('cms-match-add');
    if (addBtn) {
      addBtn.onclick = function () {
        var o = C.load();
        o.schedule = o.schedule || JSON.parse(JSON.stringify(getSched()));
        o.schedule.upcoming = o.schedule.upcoming || [];
        o.schedule.upcoming.push({
          id: 'm-new-' + Date.now(),
          date: new Date().toISOString().slice(0, 10),
          time: '22:00',
          game: 'eafc',
          gameLabel: 'Clubes Pro FC26',
          competition: 'VPG',
          opponent: 'Nuevo rival',
          status: 'Próximo'
        });
        C.save(o);
        if (typeof SCHEDULE !== 'undefined') {
          SCHEDULE.upcoming = o.schedule.upcoming;
        }
        gotoSection('schedule');
      };
    }

    bindRemoveButtons(gotoSection);
  }

  function bindRemoveButtons(gotoSection) {
    document.querySelectorAll('.cms-match-remove').forEach(function (btn) {
      btn.onclick = function () {
        if (!confirm('¿Quitar este partido del calendario?')) return;
        var idx = +btn.dataset.idx;
        var o = C.load();
        o.schedule = o.schedule || JSON.parse(JSON.stringify(getSched()));
        o.schedule.upcoming.splice(idx, 1);
        C.save(o);
        if (typeof SCHEDULE !== 'undefined') {
          SCHEDULE.upcoming = o.schedule.upcoming;
        }
        gotoSection('schedule');
      };
    });
  }

  function collectSchedule(o) {
    if (!document.getElementById('cms-sched-visual')) return o;
    o.schedule = o.schedule || JSON.parse(JSON.stringify(getSched()));
    var gameKey = selVal('cms-feat-game') || 'eafc';
    o.schedule.featured = {
      id: val('cms-feat-id') || 'feat-1',
      date: val('cms-feat-date'),
      time: val('cms-feat-time'),
      timezone: 'CEST',
      game: gameKey,
      gameLabel: gameLabelFor(gameKey),
      competition: val('cms-feat-competition'),
      opponent: val('cms-feat-opponent'),
      venue: val('cms-feat-venue') || 'Online · PS5',
      status: selVal('cms-feat-status') || val('cms-feat-status') || 'Próximo',
      stream: val('cms-feat-stream')
    };
    o.schedule.upcoming = [];
    var matchIdx = 0;
    while (document.getElementById('cms-match-' + matchIdx + '-opponent')) {
      var gk = selVal('cms-match-' + matchIdx + '-game') || 'eafc';
      o.schedule.upcoming.push({
        id: val('cms-match-' + matchIdx + '-id') || ('m-' + matchIdx),
        date: val('cms-match-' + matchIdx + '-date'),
        time: val('cms-match-' + matchIdx + '-time'),
        game: gk,
        gameLabel: gameLabelFor(gk),
        competition: val('cms-match-' + matchIdx + '-competition'),
        opponent: val('cms-match-' + matchIdx + '-opponent'),
        status: selVal('cms-match-' + matchIdx + '-status') || 'Próximo'
      });
      matchIdx++;
    }
    return o;
  }

  window.CMSStudioScheduleVisual = {
    render: function (id) {
      if (id === 'schedule') return renderScheduleVisual();
      return null;
    },
    collect: collectSchedule,
    bind: function (id, gotoSection) {
      if (id === 'schedule') bindScheduleVisual(gotoSection || function () {});
    }
  };
})();
