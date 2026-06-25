/* Calendario — rivales reales matchdays @LyokFox_ (VPG · PLG · VFO · scrims) */
var SCHEDULE = {
  featured: {
    id: 'feat-1',
    date: '2026-06-21',
    time: '22:20',
    timezone: 'CEST',
    game: 'eafc',
    gameLabel: 'Clubes Pro FC26',
    competition: 'VPG Zero Masters · Temp. 8 · Jornada 14',
    opponent: 'Kode Gaming ES',
    venue: 'Online · PS5',
    status: 'Hoy',
    stream: 'https://x.com/LyokFox_'
  },
  upcoming: [
    {
      id: 'm-eafc-1',
      date: '2026-06-21',
      time: '22:20',
      game: 'eafc',
      gameLabel: 'Clubes Pro FC26',
      competition: 'VPG Zero Masters · T8',
      opponent: 'Kode Gaming ES',
      status: 'Hoy'
    },
    {
      id: 'm-eafc-2',
      date: '2026-06-21',
      time: '22:45',
      game: 'eafc',
      gameLabel: 'Clubes Pro FC26',
      competition: 'PLG · 1ª División',
      opponent: 'Onibi eSports',
      status: 'Hoy'
    },
    {
      id: 'm-eafc-3',
      date: '2026-06-22',
      time: '21:30',
      game: 'eafc',
      gameLabel: 'Clubes Pro FC26',
      competition: 'VFO Spain · Liga Nacional',
      opponent: 'JAM eSports',
      status: 'Próximo'
    },
    {
      id: 'm-eafc-4',
      date: '2026-06-25',
      time: '23:00',
      game: 'eafc',
      gameLabel: 'Clubes Pro FC26',
      competition: 'VPG Superliga · T8',
      opponent: 'Ventucorp',
      status: 'Próximo'
    },
    {
      id: 'm-eafc-5',
      date: '2026-06-28',
      time: '22:00',
      game: 'eafc',
      gameLabel: 'Clubes Pro FC26',
      competition: 'VPG Europa League · 32avos',
      opponent: 'Meta FC Pro',
      status: 'Próximo'
    },
    {
      id: 'm-eafc-6',
      date: '2026-07-02',
      time: '22:30',
      game: 'eafc',
      gameLabel: 'Clubes Pro FC26',
      competition: 'PLG · Copa Camada',
      opponent: 'Drift Esports',
      status: 'Próximo'
    },
    {
      id: 'm-brawl-1',
      date: '2026-06-21',
      time: '21:00',
      game: 'brawl',
      gameLabel: 'Brawl Stars',
      competition: 'Scrims 3v3 · Ranked',
      opponent: 'Kayro Esports',
      status: 'Hoy'
    },
    {
      id: 'm-clash-1',
      date: '2026-06-23',
      time: '20:30',
      game: 'clash',
      gameLabel: 'Clash Royale',
      competition: 'Supremacy League · Mixed S2',
      opponent: 'WeSports CR',
      status: 'Próximo'
    },
    {
      id: 'm-eafc-7',
      date: '2026-06-24',
      time: '22:15',
      game: 'eafc',
      gameLabel: 'Clubes Pro FC26',
      competition: 'VPG Zero Masters · T8',
      opponent: 'Nova Fox ES',
      status: 'Próximo'
    },
    {
      id: 'm-eafc-8',
      date: '2026-06-26',
      time: '21:45',
      game: 'eafc',
      gameLabel: 'Clubes Pro FC26',
      competition: 'PLG · 1ª División',
      opponent: 'Royal Kings FC',
      status: 'Próximo'
    },
    {
      id: 'm-eafc-9',
      date: '2026-06-29',
      time: '23:00',
      game: 'eafc',
      gameLabel: 'Clubes Pro FC26',
      competition: 'VFO Spain · Playoffs',
      opponent: 'Elite Squad',
      status: 'Próximo'
    },
    {
      id: 'm-eafc-10',
      date: '2026-07-03',
      time: '22:00',
      game: 'eafc',
      gameLabel: 'Clubes Pro FC26',
      competition: 'VPG Europa League · 16avos',
      opponent: 'Meta FC Pro',
      status: 'Próximo'
    },
    {
      id: 'm-brawl-2',
      date: '2026-06-27',
      time: '20:00',
      game: 'brawl',
      gameLabel: 'Brawl Stars',
      competition: 'Scrims 3v3 · Ranked',
      opponent: 'Gem Hunters',
      status: 'Próximo'
    }
  ]
};

/* Fechas siempre próximas (rolling desde hoy) */
(function () {
  if (typeof SCHEDULE === 'undefined') return;
  var now = new Date();
  function dayStr(offset) {
    var d = new Date(now);
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  }
  var offsets = [0, 0, 1, 3, 6, 10, 0, 2, 4, 7, 11, 14, 5];
  if (SCHEDULE.featured) {
    SCHEDULE.featured.date = dayStr(0);
    SCHEDULE.featured.status = 'Hoy';
  }
  SCHEDULE.upcoming.forEach(function (m, i) {
    var off = offsets[i] != null ? offsets[i] : Math.floor(i / 2);
    m.date = dayStr(off);
    m.status = off === 0 ? 'Hoy' : (off === 1 ? 'Mañana' : 'Próximo');
  });
  if (typeof SITE !== 'undefined' && SITE.social && SITE.social.twitter) {
    var tw = SITE.social.twitter;
    if (SCHEDULE.featured) SCHEDULE.featured.stream = tw;
    SCHEDULE.upcoming.forEach(function (m) {
      if (!m.stream || /x\.com/i.test(m.stream)) m.stream = tw;
    });
  }
})();
