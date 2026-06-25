(function () {
  'use strict';

  var TEAM_KEYS = {
    rosterBrawlStars: 'brawlStars',
    rosterClashRoyale: 'clashRoyale',
    rosterClubesPro: 'clubesPro'
  };

  var TEAM_LABELS = {
    brawlStars: 'Brawl Stars',
    clashRoyale: 'Clash Royale',
    clubesPro: 'Clubes Pro FC26'
  };

  function enrichPlayer(p, teamKey) {
    return {
      name: p.name || 'Jugador LyokFox',
      role: p.role || 'Jugador',
      note: p.note || '',
      captain: !!p.captain,
      bio: p.bio || p.note || 'Miembro oficial de la plantilla LyokFox ' + (TEAM_LABELS[teamKey] || '') + '.',
      twitter: p.twitter || '',
      trophies: p.trophies || '—',
      mains: p.mains || p.role || '—',
      joined: p.joined || '2024',
      teamKey: teamKey
    };
  }

  function ensureModals() {
    if (document.getElementById('player-modal')) return;
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="fox-modal" id="player-modal" role="dialog" aria-modal="true">' +
        '<div class="fox-modal-backdrop" data-close-modal></div>' +
        '<div class="fox-modal-box fox-modal-player">' +
          '<button type="button" class="fox-modal-x" data-close-modal aria-label="Cerrar">×</button>' +
          '<div id="player-modal-content"></div>' +
        '</div>' +
      '</div>' +
      '<div class="fox-modal" id="team-modal" role="dialog" aria-modal="true">' +
        '<div class="fox-modal-backdrop" data-close-modal></div>' +
        '<div class="fox-modal-box fox-modal-team">' +
          '<button type="button" class="fox-modal-x" data-close-modal aria-label="Cerrar">×</button>' +
          '<div id="team-modal-content"></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap.firstElementChild);
    document.body.appendChild(wrap.lastElementChild);
    document.querySelectorAll('[data-close-modal]').forEach(function (el) {
      el.addEventListener('click', closeModals);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModals();
    });
  }

  function closeModals() {
    document.querySelectorAll('.fox-modal.open').forEach(function (m) {
      m.classList.remove('open');
    });
    document.body.style.overflow = '';
  }

  function openPlayerModal(teamKey, index) {
    if (typeof ROSTERS === 'undefined' || !ROSTERS[teamKey]) return;
    ensureModals();
    var p = enrichPlayer(ROSTERS[teamKey][index], teamKey);
    var modal = document.getElementById('player-modal');
    var el = document.getElementById('player-modal-content');
    if (!modal || !el) return;
    var initial = (p.name || '?').replace(/[^a-zA-Z0-9]/, '').charAt(0).toUpperCase() || '?';
    el.innerHTML =
      '<div class="player-modal-head">' +
        '<div class="player-modal-avatar' + (p.captain ? ' player-modal-captain' : '') + '">' + initial + '</div>' +
        '<div>' +
          (p.captain ? '<span class="player-modal-badge">Capitán</span>' : '') +
          '<h2>' + p.name + '</h2>' +
          '<p class="player-modal-role">' + p.role + ' · ' + TEAM_LABELS[teamKey] + '</p>' +
        '</div>' +
      '</div>' +
      '<p class="player-modal-bio">' + p.bio + '</p>' +
      '<div class="player-modal-stats">' +
        '<div><strong>' + p.mains + '</strong><span>Mains / posición</span></div>' +
        '<div><strong>' + p.trophies + '</strong><span>Trofeos / rank</span></div>' +
        '<div><strong>' + p.joined + '</strong><span>En LyokFox</span></div>' +
      '</div>' +
      (p.note ? '<p class="player-modal-note">' + p.note + '</p>' : '') +
      (p.twitter ? '<a href="' + p.twitter + '" target="_blank" rel="noopener" class="btn btn-glass btn-sm">Ver perfil</a>' : '');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function openTeamModal(teamKey) {
    if (typeof TEAMS_INFO === 'undefined' || !TEAMS_INFO[teamKey]) return;
    ensureModals();
    var t = TEAMS_INFO[teamKey];
    var roster = (typeof ROSTERS !== 'undefined' && ROSTERS[teamKey]) ? ROSTERS[teamKey] : [];
    var modal = document.getElementById('team-modal');
    var el = document.getElementById('team-modal-content');
    if (!modal || !el) return;
    el.innerHTML =
      '<p class="eyebrow"><span class="line"></span> Ficha oficial <span class="line"></span></p>' +
      '<h2>' + TEAM_LABELS[teamKey] + '</h2>' +
      '<p class="team-modal-tag">' + t.tagline + '</p>' +
      '<p class="team-modal-about">' + t.about + '</p>' +
      '<div class="team-modal-stats">' +
        (t.stats || []).map(function (s) {
          return '<div><strong>' + s.value + '</strong><span>' + s.label + '</span></div>';
        }).join('') +
      '</div>' +
      '<div class="team-modal-focus">' +
        (t.focus || []).map(function (f) { return '<span>' + f + '</span>'; }).join('') +
      '</div>' +
      '<div class="team-modal-blocks">' +
        '<div><h4>Horarios</h4><p>' + t.schedule + '</p></div>' +
        '<div><h4>Reclutamiento</h4><p>' + t.recruitment + '</p></div>' +
      '</div>' +
      '<div class="team-modal-achievements"><h4>Logros</h4><ul>' +
        (t.achievements || []).map(function (a) { return '<li>' + a + '</li>'; }).join('') +
        (t.legacy || []).map(function (a) { return '<li class="team-legacy-item">' + a + '</li>'; }).join('') +
      '</ul></div>' +
      '<div class="team-modal-roster"><h4>Plantilla (' + roster.length + ')</h4><div class="team-modal-roster-chips">' +
        roster.map(function (p, i) {
          return '<button type="button" class="team-roster-chip" data-team="' + teamKey + '" data-i="' + i + '">' +
            (p.captain ? '★ ' : '') + (p.name || 'Jugador') + '</button>';
        }).join('') +
      '</div></div>';
    el.querySelectorAll('.team-roster-chip').forEach(function (btn) {
      btn.onclick = function () {
        closeModals();
        openPlayerModal(btn.dataset.team, +btn.dataset.i);
      };
    });
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  window.LyokFoxPlayers = {
    openPlayer: openPlayerModal,
    openTeam: openTeamModal,
    enrich: enrichPlayer,
    teamKeys: TEAM_KEYS
  };

  document.addEventListener('layout:ready', ensureModals);
})();
