/* Zona Comunidad LyokFox — datos editables */
var _WEB = (typeof SITE !== 'undefined' && SITE.pages) ? SITE.pages.inicio : 'index.html';
var _WEB_COM = (typeof SITE !== 'undefined' && SITE.pages) ? SITE.pages.comunidad : 'comunidad.html';
var _SOC = (typeof SITE !== 'undefined' && SITE.social) ? SITE.social : {
  twitter: 'https://x.com/LyokFox_',
  instagram: 'https://instagram.com/lyokfox',
  fans: 'https://x.com/Lyokfox_Fans'
};
var _PAGES = (typeof SITE !== 'undefined' && SITE.pages) ? SITE.pages : {
  equipos: 'equipos.html',
  historia: 'historia.html',
  inicio: 'index.html',
  comunidad: 'comunidad.html',
  sponsor: 'sponsor.html',
  contacto: 'contactanos.html'
};

var COMMUNITY = {
  currency: (typeof SITE !== 'undefined' && SITE.points) ? SITE.points.short : 'KP',
  currencyName: (typeof SITE !== 'undefined' && SITE.points) ? SITE.points.name : 'Kitsune Points',
  currencyIcon: 'KP',
  storageKey: 'lyokfox_community_v3',

  instagramRewards: {
    perLike: 25,
    perComment: 40,
    perSave: 30,
    fullPostBonus: 30,
    profileUrl: _SOC.instagram
  },

  fansRewards: {
    perLike: 15,
    perRt: 25,
    perComment: 30,
    comboBonus: 20,
    fullPostBonus: 25,
    profileUrl: _SOC.fans
  },

  instagramPosts: [
    { id: 'ig-ventucorp', date: '2025-07-02', tag: 'Matchday', text: '⚽ Jornada clave VPG Superliga — LyokFox vs Ventucorp. Stories con alineación y horario. ¿Tu predicción? #VamosLyokFox', url: _SOC.instagram, stats: { likes: 612, comments: 47 } },
    { id: 'ig-matchday', date: '2025-06-28', tag: 'Matchday', text: '🔥 Noche triple — VPG vs Kode Gaming · PLG vs Onibi · Scrims Brawl vs Kayro. ¿Quién se queda despierto con la camada? #Indomables', url: _SOC.instagram, stats: { likes: 524, comments: 38 } },
    { id: 'ig-comunidad', date: '2025-06-21', tag: 'Comunidad', text: '🎮 Zona Comunidad activa — Like aquí también suma Kitsune Points. Link en bio → ' + _WEB_COM, url: _SOC.instagram, stats: { likes: 398, comments: 41 } },
    { id: 'ig-brawl', date: '2025-06-22', tag: 'Brawl Stars', text: 'Scrims 3v3 este finde — Gem Grab y Knockout en map pool oficial. Capitanes IGL en directo.', url: _SOC.instagram, stats: { likes: 445, comments: 67 } },
    { id: 'ig-indomables', date: '2025-06-20', tag: 'Indomables', text: '🦊 Campaña #Indomables — marco kitsune en stories. Etiqueta @lyokfox y presume tu foto naranja.', url: _SOC.instagram, stats: { likes: 891, comments: 112 } },
    { id: 'ig-plantilla', date: '2025-06-19', tag: 'Fichajes', text: 'Pabzz___ vuelve · Merino11_ llega. Nueva era Clubes Pro FC26 💛🖤', url: _SOC.instagram, stats: { likes: 672, comments: 54 } },
    { id: 'ig-cr', date: '2025-06-17', tag: 'Clash Royale', text: 'Debut Supremacy Mixed S2 — plantilla CR lista para ladder y CW vs WeSports.', url: _SOC.instagram, stats: { likes: 312, comments: 28 } }
  ],

  fansPosts: [
    { id: 'fans-sorteo-jun', date: '2025-06-25', tag: 'Sorteo', pinned: true, text: '🎁 SORTEO CAMADA — Sigue @Lyokfox_Fans · RT · Like. Gana merch LyokFox firmado. Indomables only 🧡', url: _SOC.fans, stats: { likes: 234, rts: 89 } },
    { id: 'fans-ventucorp', date: '2025-07-02', tag: 'Matchday', text: '⚽ Aviso: VPG Superliga vs Ventucorp — 23:00 CEST. Predicciones abiertas en la web. #VamosLyokFox', url: _SOC.fans, stats: { likes: 178, rts: 52 } },
    { id: 'fans-matchday', date: '2025-06-28', tag: 'Matchday', text: '🔥 Triple cartelera hoy — LyokFox en VPG, PLG y scrims Brawl. Sigue el hilo en vivo. #Indomables', url: _SOC.fans, stats: { likes: 156, rts: 44 } },
    { id: 'fans-kp', date: '2025-06-21', tag: 'Kitsune Points', text: '¿Sabías que Like y RT aquí también suman KP? Entra en ' + _WEB_COM + ' 🦊', url: _SOC.fans, stats: { likes: 198, rts: 72 } },
    { id: 'fans-indomables', date: '2025-06-18', tag: 'Indomables', text: '7700+ Indomables y contando. Comparte tu foto con marco kitsune — los mejores los RTeamos.', url: _SOC.fans, stats: { likes: 287, rts: 103 } },
    { id: 'fans-jam', date: '2025-07-05', tag: 'Matchday', text: '🏆 VFO Spain vs JAM eSports — jornada nacional FC26. Alineación y horario en la web.', url: _SOC.fans, stats: { likes: 134, rts: 38 } }
  ],

  shopCategories: [
    { id: 'all', label: 'Todas', icon: '🛒' },
    { id: 'merch', label: 'Merch físico', icon: '👕' },
    { id: 'digital', label: 'Digital', icon: '🖼️' },
    { id: 'ingame', label: 'In-game', icon: '🎮' },
    { id: 'experiencia', label: 'Experiencias', icon: '⭐' },
    { id: 'sorteos', label: 'Sorteos', icon: '🎟️' }
  ],

  shopTiers: [
    { id: 'bronze', label: 'Bronce', range: '300–800 KP', color: '#cd7f32' },
    { id: 'silver', label: 'Plata', range: '900–1.500 KP', color: '#c0c0c0' },
    { id: 'gold', label: 'Oro', range: '1.800–3.200 KP', color: '#ffd060' },
    { id: 'legend', label: 'Leyenda', range: '5.000+ KP', color: '#ff6a1a' }
  ],

  shopRecentRedeems: [
    { nick: 'FoxFire_ES', item: 'Camiseta LyokFox 2025', ago: '2 h' },
    { nick: 'GemGrabber', item: 'Gorra LyokFox', ago: '5 h' },
    { nick: 'Camada_Elite', item: 'Pack pegatinas', ago: '8 h' },
    { nick: 'NaranjaKing', item: 'Entrada sorteo VIP', ago: '12 h' },
    { nick: 'KnockoutKing', item: 'Marco perfil digital', ago: '1 d' },
    { nick: 'VPG_Fanatic', item: 'Taza LyokFox', ago: '1 d' }
  ],

  twitterRewards: {
    perLike: 20,
    perRt: 35,
    perComment: 45,
    comboBonus: 25,
    fullPostBonus: 35,
    profileUrl: _SOC.twitter
  },

  twitterPosts: [
    {
      id: 'tw-ventucorp',
      date: '2025-07-02',
      tag: 'Matchday',
      pinned: true,
      text: '⚽ VPG Superliga T8 — LyokFox vs Ventucorp. Jornada clave a las 23:00 CEST. Predicciones abiertas en la web. #VamosLyokFox #TuEresVPG',
      url: _SOC.twitter,
      stats: { likes: 142, rts: 41 }
    },
    {
      id: 'tw-matchday-jun',
      date: '2025-06-28',
      tag: 'Matchday',
      text: '🔥 MATCHDAY FC26 🔥 Triple cartelera: Zero Masters vs Kode Gaming · PLG vs Onibi · Scrims Brawl vs Kayro. #Indomables',
      url: _SOC.twitter,
      stats: { likes: 186, rts: 52 }
    },
    {
      id: 'tw-jam-vfo',
      date: '2025-07-05',
      tag: 'Matchday',
      text: '🏆 VFO Spain — LyokFox vs JAM eSports. Clubes Pro en competición nacional. Calendario en ' + _WEB,
      url: _SOC.twitter,
      stats: { likes: 98, rts: 28 }
    },
    {
      id: 'tw-indomables',
      date: '2025-06-20',
      tag: 'Indomables',
      text: '🦊 Campaña #Indomables — marco oficial LyokFox para tu foto de perfil. Responde al tweet con tu foto · Like · RT. ¡No te quedes en la madriguera! 🧡',
      url: _SOC.twitter,
      stats: { likes: 312, rts: 128 }
    },
    {
      id: 'tw-fichajes',
      date: '2025-06-19',
      tag: 'Fichajes',
      text: '🔥 ¡Movimiento de lujo! @Pabzz___ vuelve a casa y @Merino11_ se suma al proyecto. Experiencia y ambición para VPG, PLG y VFO. 💛🖤',
      url: _SOC.twitter,
      stats: { likes: 241, rts: 67 }
    },
    {
      id: 'tw-brawl-scrims',
      date: '2025-06-22',
      tag: 'Brawl Stars',
      text: 'Scrims 3v3 cada fin de semana · ranked en equipo · map pool oficial. Capitanes IGL activos. DM para pruebas.',
      url: _SOC.twitter,
      stats: { likes: 89, rts: 22 }
    },
    {
      id: 'tw-supremacy-cr',
      date: '2025-06-17',
      tag: 'Clash Royale',
      text: 'Los Zorros 🦊 debutan en @CR_Supremacy Mixed S2 vs WeSports CR. Ladder, CW y torneos — plantilla en la web.',
      url: _SOC.twitter,
      stats: { likes: 98, rts: 34 }
    },
    {
      id: 'tw-once-vpg',
      date: '2025-06-14',
      tag: 'Palmarés',
      text: '⭐ Once de la Semana VPG Zero Masters — Temp. 8. LyokFox entre los mejores de la jornada. #GolImpactGameVPG',
      url: _SOC.twitter,
      stats: { likes: 203, rts: 41 }
    },
    {
      id: 'tw-vuelta',
      date: '2025-06-15',
      tag: 'Comunidad',
      text: '🧡 HEMOS VUELTO 🧡 Nueva era LyokFox. Brawl Stars, Clash Royale y Clubes Pro. Sigue a @Lyokfox_Fans para sorteos y avisos matchday.',
      url: _SOC.twitter,
      stats: { likes: 427, rts: 156 }
    },
    {
      id: 'tw-comunidad-kp',
      date: '2025-06-21',
      tag: 'Zona Comunidad',
      text: '🎮 Zona Comunidad activa — Like y RT en nuestros posts = KP. Canjea camisetas, gorras y merch real. ' + _WEB_COM,
      url: _SOC.twitter,
      stats: { likes: 156, rts: 63 }
    }
  ],

  levels: [
    { id: 'cachorro', name: 'Cachorro', min: 0, icon: 'I', discount: 0 },
    { id: 'explorador', name: 'Explorador', min: 200, icon: 'II', discount: 0 },
    { id: 'zorro', name: 'Zorro', min: 500, icon: 'III', discount: 0 },
    { id: 'huron', name: 'Hurón', min: 1000, icon: 'IV', discount: 0 },
    { id: 'kitsune', name: 'Kitsune', min: 2000, icon: 'V', discount: 0.05 },
    { id: 'naranja', name: 'Naranja', min: 3500, icon: 'VI', discount: 0.07 },
    { id: 'alpha', name: 'Alpha', min: 5500, icon: 'VII', discount: 0.10 },
    { id: 'elite', name: 'Élite', min: 8000, icon: 'VIII', discount: 0.12 },
    { id: 'leyenda', name: 'Leyenda', min: 12000, icon: 'IX', discount: 0.15 },
    { id: 'mythic', name: 'Mythic', min: 18000, icon: 'X', discount: 0.18 },
    { id: 'supremo', name: 'Supremo', min: 30000, icon: 'XI', discount: 0.20 }
  ],

  dailyLogin: { base: 25, streakBonus: 8, streakCap: 80 },

  earnMethods: [
    { icon: '📅', title: 'Bonus diario', desc: '+25 KP al entrar · racha hasta +80', kp: '25–105' },
    { icon: '𝕏', title: 'Like en X', desc: '+20 KP por Like en cada post @LyokFox_', kp: '20 c/u' },
    { icon: '🔁', title: 'RT en X', desc: '+35 KP por retweet en cada post', kp: '35 c/u' },
    { icon: '💬', title: 'Comentario en X', desc: '+45 KP por comentar en cada post oficial', kp: '45 c/u' },
    { icon: '📸', title: 'Instagram', desc: 'Like +25 · Comentario +40 · Guardar +30 por post', kp: '25–40' },
    { icon: '🧡', title: '@Lyokfox_Fans', desc: 'Like +15 · RT +25 · Comentario +30 por post', kp: '15–30' },
    { icon: '💥', title: 'Combo Like+RT', desc: '+25 KP extra en el mismo post (X)', kp: '+25' },
    { icon: '🏆', title: 'Post completo', desc: 'Like+RT+Comentario en X = bonus +35 KP', kp: '+35' },
    { icon: '⚽', title: 'Predicciones', desc: '+25 KP por partido · +100 si aciertas', kp: '25–100' },
    { icon: '🧠', title: 'Quiz del día', desc: '5 preguntas LyokFox · +50 KP c/u', kp: 'hasta 250' },
    { icon: '🎡', title: 'Ruleta kitsune', desc: '1 giro gratis al día', kp: '15–150' },
    { icon: '🔤', title: 'Anagrama Fox', desc: 'Descifra la palabra del día', kp: 'hasta 120' },
    { icon: '⚡', title: 'Reflejos + Memoria', desc: 'Minijuegos arcade con límite diario', kp: '80–370' },
    { icon: '🎯', title: 'Reto diario', desc: 'Objetivo especial cada 24 h', kp: '60–200' },
    { icon: '📋', title: 'Misiones', desc: 'Redes, web, X e historia', kp: '30–250' },
    { icon: '📰', title: 'Noticias camada', desc: 'Lee novedades del club · +10 KP', kp: '10 c/u' },
    { icon: '🗳️', title: 'Encuestas', desc: 'Vota y opina sobre el club', kp: '40–50' },
    { icon: '🎁', title: 'Códigos promo', desc: 'Canjea códigos de campaña', kp: '50–100' },
    { icon: '📆', title: 'Objetivos semanales', desc: '5 metas con bonus extra', kp: '180–300' }
  ],

  predictionResults: {
    'past-m1': 'lyokfox',
    'past-m2': 'rival',
    'past-m3': 'lyokfox',
    'past-m4': 'draw',
    'past-m5': 'lyokfox'
  },

  fallbackMatches: [
    { id: 'fb-eafc-1', date: '2026-06-21', time: '22:20', game: 'eafc', gameLabel: 'Clubes Pro FC26', competition: 'VPG Zero Masters · T8', opponent: 'Kode Gaming ES', status: 'Hoy' },
    { id: 'fb-eafc-2', date: '2026-06-22', time: '21:30', game: 'eafc', gameLabel: 'Clubes Pro FC26', competition: 'VFO Spain', opponent: 'JAM eSports', status: 'Mañana' },
    { id: 'fb-brawl-1', date: '2026-06-21', time: '21:00', game: 'brawl', gameLabel: 'Brawl Stars', competition: 'Scrims 3v3', opponent: 'Kayro Esports', status: 'Hoy' }
  ],

  matchHistory: [
    { id: 'past-m1', date: '2026-06-20', gameLabel: 'Brawl Stars', opponent: 'Nova Fox ES', score: '2-1', result: 'lyokfox', competition: 'Scrims 3v3 · Ranked' },
    { id: 'past-m2', date: '2026-06-19', gameLabel: 'Clash Royale', opponent: 'Royal Kings', score: '1-3', result: 'rival', competition: 'Supremacy League · CW' },
    { id: 'past-m3', date: '2026-06-18', gameLabel: 'Clubes Pro FC26', opponent: 'Drift Esports', score: '3-1', result: 'lyokfox', competition: 'VPG Zero Masters · T8' },
    { id: 'past-m4', date: '2026-06-17', gameLabel: 'Clubes Pro FC26', opponent: 'Meta FC', score: '2-2', result: 'draw', competition: 'PLG · 1ª División' },
    { id: 'past-m5', date: '2026-06-15', gameLabel: 'Clubes Pro FC26', opponent: 'Elite Squad', score: '4-0', result: 'lyokfox', competition: 'VFO Spain · Jornada 12' },
    { id: 'past-m6', date: '2026-06-14', gameLabel: 'Brawl Stars', opponent: 'Gem Hunters', score: '0-2', result: 'rival', competition: 'Scrims 3v3' }
  ],

  globalStats: {
    members: 2847,
    kpDistributed: 1250000,
    predictionsWeek: 892,
    xActionsWeek: 3420,
    prizesRedeemed: 156
  },

  levelPerks: [
    { level: 'cachorro', icon: '🐾', perks: ['Acceso arcade', 'Bonus diario +25 KP', 'Predicciones abiertas'] },
    { level: 'explorador', icon: '🔍', perks: ['Badge Explorador', 'Reto diario extra', 'Noticias +10 KP'] },
    { level: 'zorro', icon: '🦊', perks: ['Badge Zorro en ranking', 'Misiones sociales premium', 'Prioridad sorteos'] },
    { level: 'huron', icon: '🎋', perks: ['Encuestas exclusivas', 'Ruleta bonus +5 KP', 'Acceso misiones Pro'] },
    { level: 'kitsune', icon: '🔥', perks: ['Tienda -5% descuento', 'Misiones Pro desbloqueadas', 'Marco perfil digital gratis 1x'] },
    { level: 'naranja', icon: '🧡', perks: ['Tienda -7%', 'Doble KP reto diario ocasional', 'Canal camada prioritario'] },
    { level: 'alpha', icon: '⚡', perks: ['Tienda -10%', 'Saludo stream matchday', 'Premios gold prioritarios'] },
    { level: 'elite', icon: '💎', perks: ['Tienda -12%', 'Rol VIP reducido', 'Acceso scrim watch descuento'] },
    { level: 'leyenda', icon: '👑', perks: ['Tienda -15%', 'Merch firmado anual', 'Hall of Fame camada'] },
    { level: 'mythic', icon: '✨', perks: ['Tienda -18%', 'Invitación eventos VIP', 'Badge Mythic único'] },
    { level: 'supremo', icon: '🌟', perks: ['Tienda -20%', 'Merch exclusivo Supremo', 'Nombre en web camada'] }
  ],

  quickStart: [
    { step: 1, title: 'Crea tu perfil', desc: 'Apodo y redes en Mi cuenta — sincroniza con KP.', href: (typeof SITE !== 'undefined' && SITE.pages.cuenta) ? SITE.pages.cuenta : 'cuenta.html', icon: '🪪' },
    { step: 2, title: 'Reclama bonus diario', desc: '+25 KP al entrar · racha hasta +80 extra.', href: '#juegos', icon: '📅' },
    { step: 3, title: 'Apoya en redes', desc: 'X, Instagram y @Lyokfox_Fans — Like, RT y comentarios.', href: '#apoya-redes', icon: '📱' },
    { step: 4, title: 'Lee noticias', desc: '+10 KP por noticia · centro de noticias oficial.', href: (typeof SITE !== 'undefined' && SITE.pages.noticias) ? SITE.pages.noticias : 'noticias.html', icon: '📰' },
    { step: 5, title: 'Juega y predice', desc: 'Minijuegos + predicciones matchday.', href: '#predicciones', icon: '🎮' },
    { step: 6, title: 'Canjea premios', desc: 'Camisetas, gorras y merch real con KP.', href: '#tienda', icon: '🎁' }
  ],

  communityEvents: [
    { id: 'ev1', date: '2025-06-28', time: '21:00', title: 'Super Matchday FC26', type: 'Matchday', desc: 'Triple cartelera: Brawl scrims + VPG vs Kode + PLG vs Onibi.', icon: '🔥', href: '#predicciones' },
    { id: 'ev2', date: '2025-07-02', time: '23:00', title: 'VPG Superliga vs Ventucorp', type: 'Liga', desc: 'Jornada clave Temp. 8 — predicciones abiertas.', icon: '⚽', href: '#predicciones' },
    { id: 'ev3', date: '2025-07-05', time: '22:30', title: 'VFO Spain vs JAM eSports', type: 'Liga', desc: 'Clubes Pro en competición nacional VFO.', icon: '🏆', href: '#predicciones' },
    { id: 'ev4', date: '2025-06-29', time: '20:30', title: 'Supremacy CR Mixed S2', type: 'Torneo', desc: 'LyokFox vs WeSports CR — ladder + CW.', icon: '👑', href: _PAGES.equipos },
    { id: 'ev5', date: '2025-07-01', time: '19:00', title: 'Sorteo trimestral VIP', type: 'Sorteo', desc: 'Canjea entrada con 600 KP en tienda.', icon: '🎟️', href: '#tienda' },
    { id: 'ev6', date: '2025-07-10', time: '18:00', title: 'Campaña #Indomables', type: 'Comunidad', desc: 'Marco perfil kitsune — Like, RT y participa.', icon: '🧡', href: '#apoya-redes' }
  ],

  clubMilestones: [
    { year: '2020', title: 'Fundación LyokFox', desc: 'Nace la identidad kitsune naranja/negro.', icon: 'LF' },
    { year: '2022–23', title: 'Brawl Stars Top 7/9', desc: 'Clasificatorios oficiales BSC · circuito competitivo.', icon: '#7' },
    { year: '2023', title: 'BSC NA West 3º-4º', desc: 'Monthly Finals julio 2023 · $3.500 · Liquipedia.', icon: 'BS' },
    { year: '2023', title: 'Pokémon UNITE Top Europa', desc: 'Palmarés móvil camada · competición europea.', icon: 'EU' },
    { year: '2024', title: 'Liga Destiny VGC', desc: 'LyokFox Sureste · Pokémon VGC oficial España.', icon: 'VGC' },
    { year: '2023', title: 'Ascenso clubes pro', desc: '2ª PLG · 1ª VFO · 1ª VPG desde cero.', icon: 'CP' },
    { year: '2024', title: 'Palmarés VPG', desc: 'Once de la Semana · Gol Impact · Europa League.', icon: 'VPG' },
    { year: '2025', title: 'BS equipo principal', desc: 'Retorno Brawl Stars 3v3 + CR + FC26.', icon: '3v3' }
  ],

  fanQuotes: [
    { nick: 'FoxFire_ES', text: 'La Zona Comunidad es adictiva — ya tengo casi para la camiseta.', avatar: '🦊' },
    { nick: 'GemGrabber', text: 'Apoyar en X y sumar KP mientras sigo los matchdays… genial.', avatar: '⚡' },
    { nick: 'Camada_Elite', text: '#Indomables de verdad. Orgullo kitsune naranja.', avatar: '🔥' },
    { nick: 'VPG_Fanatic', text: 'Las predicciones de VPG me enganchan cada jornada.', avatar: '⚽' },
    { nick: 'KnockoutKing', text: 'El quiz diario te obliga a conocer la historia del club.', avatar: '🧠' },
    { nick: 'NaranjaKing', text: 'Canjeé la gorra — merch de calidad, envío rápido.', avatar: '🧢' }
  ],

  arcadeGames: [
    { id: 'quiz', icon: '🧠', name: 'Quiz del día', maxKp: 250, limit: '1/día', rule: '5 preguntas LyokFox · +50 KP por acierto' },
    { id: 'reflex', icon: '⚡', name: 'Reflejos kitsune', maxKp: 150, limit: '3/día', rule: '30 s clickeando el zorro · +10 KP/acierto' },
    { id: 'memory', icon: '🃏', name: 'Memoria Fox', maxKp: 220, limit: '1/día', rule: '8 parejas · menos movimientos = más KP' },
    { id: 'word', icon: '🔤', name: 'Anagrama Fox', maxKp: 120, limit: '1/día', rule: 'Descifra la palabra con pista' },
    { id: 'tap', icon: 'TP', name: 'Fox Tap', maxKp: 125, limit: '1/día', rule: '5 rondas de reacción · bonus por velocidad' }
  ],

  shopFeatured: ['camiseta-2025', 'gorra', 'sorteo-vip'],

  promoCodes: [
    { code: 'INDOMABLES', reward: 100, desc: 'Campaña marco perfil #Indomables' },
    { code: 'VAMOSLYOKFOX', reward: 75, desc: 'Bonus matchday camada' },
    { code: 'KITSUNE2025', reward: 50, desc: 'Bienvenida Zona Comunidad' }
  ],

  dailyChallenges: [
    { id: 'pred1', text: 'Registra 1 predicción de partido', check: 'predictions_today', target: 1, reward: 75 },
    { id: 'quiz1', text: 'Completa el Quiz del día', check: 'quiz_done', target: 1, reward: 60 },
    { id: 'spin1', text: 'Gira la Ruleta kitsune', check: 'spin_done', target: 1, reward: 50 },
    { id: 'game2', text: 'Juega 2 minijuegos distintos', check: 'games_played', target: 2, reward: 90 },
    { id: 'mission1', text: 'Completa 1 misión social', check: 'missions_done', target: 1, reward: 80 },
    { id: 'word1', text: 'Resuelve el Anagrama Fox', check: 'word_done', target: 1, reward: 70 },
    { id: 'news2', text: 'Lee 2 noticias de la camada', check: 'news_read', target: 2, reward: 65 },
    { id: 'x1', text: 'Reclama 1 Like, RT o comentario en X', check: 'twitter_claims', target: 1, reward: 70 },
    { id: 'x2', text: 'Haz combo Like+RT en un post', check: 'twitter_combo', target: 1, reward: 90 },
    { id: 'x3', text: 'Comenta en un post @LyokFox_', check: 'twitter_comment', target: 1, reward: 85 }
  ],

  weeklyGoals: [
    { id: 'w_pred', label: '5 predicciones', icon: '⚽', target: 5, reward: 200, track: 'weeklyPredictions' },
    { id: 'w_games', label: '8 minijuegos jugados', icon: '🎮', target: 8, reward: 250, track: 'weeklyGames' },
    { id: 'w_streak', label: 'Racha de 5 días', icon: '🔥', target: 5, reward: 300, track: 'weeklyStreak' },
    { id: 'w_missions', label: '4 misiones completadas', icon: '📋', target: 4, reward: 180, track: 'weeklyMissions' },
    { id: 'w_twitter', label: '6 acciones en X (Like/RT)', icon: '𝕏', target: 6, reward: 220, track: 'weeklyTwitter' },
    { id: 'w_social', label: '8 acciones en redes', icon: '📱', target: 8, reward: 280, track: 'weeklySocial' }
  ],

  spinSegments: [
    { label: '+15 KP', value: 15, color: '#666' },
    { label: '+30 KP', value: 30, color: '#ff8c00' },
    { label: '+50 KP', value: 50, color: '#ff5500' },
    { label: '+75 KP', value: 75, color: '#ffb800' },
    { label: '+100 KP', value: 100, color: '#ffd060' },
    { label: '+150 KP', value: 150, color: '#ff6a1a' },
    { label: '+25 KP', value: 25, color: '#888' },
    { label: '+40 KP', value: 40, color: '#cc5500' }
  ],

  wordScramble: [
    { word: 'LYOKFOX', hint: 'Nombre del club' },
    { word: 'KITSUNE', hint: 'Espíritu zorro japonés' },
    { word: 'CAMADA', hint: 'Así llamamos a la comunidad' },
    { word: 'BRAWL', hint: 'Juego principal móvil' },
    { word: 'VPG', hint: 'Liga de Clubes Pro' },
    { word: 'GEMGRAB', hint: 'Modo 3v3 emblemático' },
    { word: 'KNOCKOUT', hint: 'Modo eliminatorio Brawl' },
    { word: 'CLASH', hint: 'Segundo equipo móvil' },
    { word: 'SCRIMS', hint: 'Entrenamientos de equipo' },
    { word: 'ORANGE', hint: 'Color de la marca (en inglés)' }
  ],

  news: [
    { id: 'n1', date: '2025-06-20', tag: 'Brawl Stars', title: 'Scrims 3v3 cada fin de semana', body: 'El equipo principal entrena ranked y map pool oficial. Sigue los matchdays en @LyokFox_.' },
    { id: 'n2', date: '2025-06-18', tag: 'Comunidad', title: 'Zona Comunidad activa — gana camisetas', body: 'Acumula Kitsune Points con minijuegos, predicciones y misiones. Canjea merch real en la tienda.' },
    { id: 'n3', date: '2025-06-15', tag: 'Clubes Pro', title: 'VPG Zero Masters en marcha', body: '25 jugadores compiten en VPG, PLG y VFO. Plantilla completa en Equipos.' },
    { id: 'n4', date: '2025-06-12', tag: 'Clash Royale', title: 'Clan Wars activas', body: '8 jugadores + 2 capitanes pelean ladder y CW cada semana.' },
    { id: 'n5', date: '2025-06-10', tag: 'Sorteo', title: 'Sorteo trimestral VIP', body: 'Canjea entradas con 600 KP en la tienda. Merch firmado para la camada.' },
    { id: 'n6', date: '2025-06-08', tag: 'Historia', title: '5 años de LyokFox', body: 'Desde 2020 construyendo identidad kitsune. Lee la crónica completa en Historia.' },
    { id: 'n7', date: '2025-06-19', tag: 'Clubes Pro', title: 'Pabzz___ vuelve · Merino11_ fichaje', body: 'Movimiento de lujo en la plantilla FC26. Experiencia y ambición para VPG, PLG y VFO.' },
    { id: 'n8', date: '2025-06-17', tag: 'Clash Royale', title: 'Debut en Supremacy League Mixed S2', body: 'LyokFox compite en la edición mixed de @CR_Supremacy. Plantilla en Equipos.' },
    { id: 'n9', date: '2025-06-21', tag: 'Comunidad', title: 'Like y RT = Kitsune Points', body: 'Cada interacción en posts @LyokFox_ suma KP en la Zona Comunidad. Like +20 · RT +35 · combo +25.' },
    { id: 'n10', date: '2025-06-20', tag: 'Indomables', title: 'Campaña marco perfil #Indomables', body: 'Responde al tweet oficial con tu foto. Like, RT y luce el marco kitsune naranja.' },
    { id: 'n11', date: '2025-06-13', tag: 'Brawl Stars', title: 'Capitanes freambs y ManuZZZaurio777', body: 'Dúo IGL lidera scrims 3v3 y ranked. Entrenamientos Mar/Jue/Sáb 21:00 CEST.' },
    { id: 'n12', date: '2025-06-11', tag: 'Europa', title: 'VPG Europa League — 32avos', body: 'LyokFox representa a España en competición europea @OfficialVPG.' },
    { id: 'n13', date: '2025-06-09', tag: 'Impact Game', title: 'Gol de la Semana · 3º puesto', body: 'Impact Game VPG semana 4 — LyokFox en el top 3 del ranking de goles.' },
    { id: 'n14', date: '2025-06-07', tag: 'Fans', title: '@Lyokfox_Fans activo', body: 'Comunidad Indomables: sorteos, avisos matchday y contenido exclusivo.' },
    { id: 'n15', date: '2025-06-22', tag: 'Comunidad', title: 'Panel Mi progreso activo', body: 'Consulta misiones, noticias leídas, KP lifetime y progreso de nivel en tiempo real.' },
    { id: 'n16', date: '2025-06-23', tag: 'Brawl Stars', title: 'Map pool oficial junio', body: 'Gem Grab, Knockout y Brawl Ball en rotación scrims. Entrenamientos Mar/Jue/Sáb 21:00 CEST.' },
    { id: 'n17', date: '2025-06-24', tag: 'Clubes Pro', title: 'Triple matchday 28 junio', body: 'VPG vs Kode Gaming · PLG vs Onibi · Scrims Brawl vs Kayro. Predicciones abiertas en Comunidad.' },
    { id: 'n18', date: '2025-06-25', tag: 'Sorteo', title: 'Códigos promo activos', body: 'INDOMABLES, VAMOSLYOKFOX y KITSUNE2025 — canjea en la tienda KP por bonus instantáneo.' },
    { id: 'n19', date: '2025-06-26', tag: 'Clash Royale', title: 'CW semanal completada', body: '8 jugadores + capitanes sumaron trofeos. Próximo rival: WeSports CR en Supremacy.' },
    { id: 'n20', date: '2025-06-27', tag: 'Europa', title: 'Road to Europa League', body: 'Preparación 32avos VPG Europa. Sigue el calendario en Inicio y predice en Comunidad.' }
  ],

  poll: {
    id: 'poll-junio-2025',
    question: '¿Qué modo de Brawl Stars quieres ver más en stream?',
    options: [
      { id: 'gem', label: 'Gem Grab', votes: 142 },
      { id: 'bounty', label: 'Bounty', votes: 98 },
      { id: 'knockout', label: 'Knockout', votes: 167 },
      { id: 'brawlball', label: 'Brawl Ball', votes: 121 }
    ],
    reward: 40
  },

  poll2: {
    id: 'poll-cr-julio',
    question: '¿Qué recompensa te interesa más en la tienda KP?',
    options: [
      { id: 'shirt', label: 'Camiseta oficial', votes: 89 },
      { id: 'pass', label: 'Brawl Pass / gemas', votes: 134 },
      { id: 'discord', label: 'Rol Discord VIP', votes: 67 },
      { id: 'hoodie', label: 'Sudadera premium', votes: 112 }
    ],
    reward: 50
  },

  poll3: {
    id: 'poll-x-junio',
    question: '¿Qué post de @LyokFox_ apoyas más?',
    options: [
      { id: 'matchday', label: 'Matchday FC26', votes: 198 },
      { id: 'indomables', label: 'Campaña Indomables', votes: 276 },
      { id: 'fichajes', label: 'Fichajes Pabzz/Merino', votes: 142 },
      { id: 'comunidad', label: 'Zona Comunidad KP', votes: 167 }
    ],
    reward: 45
  },

  missions: [
    { id: 'profile', title: 'Completa tu perfil', desc: 'Elige tu apodo de camada.', reward: 50, type: 'auto', icon: '🪪', cat: 'inicio' },
    { id: 'follow_x', title: 'Sigue a @LyokFox_', desc: 'Apoya al club en X.', reward: 150, type: 'social', url: _SOC.twitter, icon: '𝕏', cat: 'social' },
    { id: 'instagram', title: 'Sigue @lyokfox', desc: 'Behind the scenes y sorteos.', reward: 120, type: 'social', url: _SOC.instagram, icon: '📸', cat: 'social' },
    { id: 'share', title: 'Comparte la web', desc: 'Difunde LyokFox con tu link.', reward: 100, type: 'share', icon: '🔗', cat: 'social' },
    { id: 'visit_equipos', title: 'Explora los equipos', desc: 'Fichas y rosters oficiales.', reward: 40, type: 'visit', url: _PAGES.equipos, icon: '🎮', cat: 'web' },
    { id: 'visit_historia', title: 'Lee la crónica', desc: 'Historia del club desde 2020.', reward: 45, type: 'visit', url: _PAGES.historia, icon: '📜', cat: 'web' },
    { id: 'visit_inicio', title: 'Visita el inicio', desc: 'Calendario y partidos próximos.', reward: 30, type: 'visit', url: _PAGES.inicio, icon: '🏠', cat: 'web' },
    { id: 'discord', title: 'Únete a la camada', desc: 'Comunidad Indomables en @Lyokfox_Fans.', reward: 200, type: 'social', url: _SOC.fans, icon: '💬', cat: 'social' },
    { id: 'x_first_like', title: 'Primer Like en X', desc: 'Da Like a un post @LyokFox_ y reclámalo.', reward: 50, type: 'auto_x_like', icon: '❤️', cat: 'x' },
    { id: 'x_first_rt', title: 'Primer RT en X', desc: 'Retweetea un post oficial y reclámalo.', reward: 60, type: 'auto_x_rt', icon: '🔁', cat: 'x' },
    { id: 'x_first_comment', title: 'Primer comentario X', desc: 'Comenta en un post @LyokFox_ y reclámalo.', reward: 65, type: 'auto_x_comment', icon: '💬', cat: 'x' },
    { id: 'x_combo3', title: 'Combo x3', desc: 'Like+RT en 3 posts distintos.', reward: 150, type: 'auto_x_combo3', icon: '💥', cat: 'x' },
    { id: 'x_week5', title: 'Indomable semanal', desc: '5 acciones X esta semana (Like o RT).', reward: 120, type: 'auto_x_week5', icon: '🔥', cat: 'x' },
    { id: 'x_share_profile', title: 'Comparte @LyokFox_', desc: 'Difunde el perfil oficial en tu bio o story.', reward: 80, type: 'social', url: _SOC.twitter, icon: '📣', cat: 'x' },
    { id: 'first_pred', title: 'Primera predicción', desc: 'Registra tu primer pick de partido.', reward: 35, type: 'auto_pred', icon: '⚽', cat: 'inicio' },
    { id: 'three_preds', title: 'Oráculo en práctica', desc: 'Haz 3 predicciones acumuladas.', reward: 80, type: 'auto_preds', icon: '🔮', cat: 'pro' },
    { id: 'play_all_games', title: 'Arcade completo', desc: 'Juega quiz, reflejos y memoria el mismo día.', reward: 100, type: 'auto_arcade', icon: '🕹️', cat: 'pro' },
    { id: 'first_spin', title: 'Primer giro', desc: 'Usa la ruleta kitsune por primera vez.', reward: 25, type: 'auto_spin', icon: '🎡', cat: 'inicio' },
    { id: 'visit_comunidad', title: 'Explora Comunidad', desc: 'Recorre todas las secciones KP.', reward: 35, type: 'visit', url: _PAGES.comunidad, icon: '🎮', cat: 'inicio' },
    { id: 'visit_sponsor', title: 'Dossier patrocinio', desc: 'Conoce paquetes y palmarés para empresas.', reward: 40, type: 'visit', url: _PAGES.sponsor, icon: '🤝', cat: 'web' },
    { id: 'visit_contacto', title: 'Guarda contacto', desc: 'Email lyokfox@gmail.com para premios.', reward: 35, type: 'visit', url: _PAGES.contacto, icon: '✉️', cat: 'web' },
    { id: 'read_5_news', title: 'Informado x5', desc: 'Lee 5 noticias de la camada.', reward: 60, type: 'auto_news5', icon: '📰', cat: 'pro' },
    { id: 'weekly_complete', title: 'Semana perfecta', desc: 'Reclama los 5 objetivos semanales.', reward: 150, type: 'auto_weekly', icon: '📆', cat: 'pro' },
    { id: 'promo_indomables', title: 'Código #Indomables', desc: 'Canjea el código INDOMABLES en tienda.', reward: 40, type: 'auto_promo', icon: '🎁', cat: 'inicio' },
    { id: 'x_all_posts', title: 'Superfan X', desc: 'Like en todos los posts activos.', reward: 200, type: 'auto_x_all', icon: '💎', cat: 'x' },
    { id: 'ig_first_like', title: 'Primer Like IG', desc: 'Da Like en un post @lyokfox y reclámalo.', reward: 55, type: 'auto_ig_like', icon: '📸', cat: 'social' },
    { id: 'ig_comment', title: 'Comenta en IG', desc: 'Comenta en un post oficial de Instagram.', reward: 70, type: 'auto_ig_comment', icon: '💬', cat: 'social' },
    { id: 'fans_first', title: 'Apoya @Lyokfox_Fans', desc: 'Like o RT en un post de fans.', reward: 45, type: 'auto_fans', icon: '🧡', cat: 'social' },
    { id: 'social10', title: 'Influencer camada', desc: '10 acciones en todas las redes.', reward: 180, type: 'auto_social10', icon: '📱', cat: 'social' },
    { id: 'level_kitsune_m', title: 'Ascenso Kitsune', desc: 'Alcanza nivel Kitsune (2.000 KP).', reward: 100, type: 'auto_level', icon: '🔥', cat: 'pro' },
    { id: 'level_leyenda_m', title: 'Camino a Leyenda', desc: 'Alcanza nivel Leyenda (12.000 KP).', reward: 250, type: 'auto_level', icon: '👑', cat: 'pro' }
  ],

  rewards: [
    { id: 'camiseta-2025', name: 'Camiseta LyokFox 2025', desc: 'Edición kitsune naranja/negro · talla al canjear.', cost: 2500, stock: 'Limitado', icon: '👕', tier: 'gold', category: 'merch' },
    { id: 'sudadera', name: 'Sudadera oficial', desc: 'Logo bordado · envío peninsular.', cost: 5000, stock: 'Muy limitado', icon: '🧥', tier: 'legend', category: 'merch' },
    { id: 'gorra', name: 'Gorra LyokFox', desc: 'Snapback edición competición.', cost: 1200, stock: 'Disponible', icon: '🧢', tier: 'silver', category: 'merch' },
    { id: 'mochila', name: 'Mochila esports', desc: 'Compartimentos · logo reflectante.', cost: 3200, stock: '10 uds', icon: '🎒', tier: 'gold', category: 'merch' },
    { id: 'pegatinas', name: 'Pack pegatinas', desc: '12 stickers kitsune + logo LyokFox.', cost: 400, stock: 'Disponible', icon: '✨', tier: 'bronze', category: 'merch' },
    { id: 'descuento-sponsor', name: 'Descuento partner 10%', desc: 'Código en tiendas colaboradoras.', cost: 800, stock: 'Disponible', icon: '🏷️', tier: 'bronze', category: 'digital' },
    { id: 'rol-discord', name: 'Rol exclusivo Discord', desc: 'Badge Camada VIP + canal privado.', cost: 1500, stock: 'Disponible', icon: '💎', tier: 'silver', category: 'digital' },
    { id: 'sorteo-vip', name: 'Entrada sorteo VIP', desc: 'Sorteo trimestral merch firmado.', cost: 600, stock: 'Ilimitado', icon: '🎟️', tier: 'bronze', category: 'sorteos' },
    { id: 'skin-ingame', name: 'Pack skins / pases', desc: 'Brawl Pass o gemas del mes.', cost: 1800, stock: '5 / mes', icon: '🎁', tier: 'gold', category: 'ingame' },
    { id: 'stream-shoutout', name: 'Saludo en stream', desc: 'Mención en directo matchday.', cost: 900, stock: '4 / mes', icon: '📺', tier: 'silver', category: 'experiencia' },
    { id: 'poster', name: 'Póster A2 firmado', desc: 'Edición limitada plantilla Brawl.', cost: 1400, stock: '15 uds', icon: '🖼️', tier: 'silver', category: 'merch' },
    { id: 'vip-match', name: 'Acceso scrim watch', desc: 'Ver scrim privado con el equipo.', cost: 2200, stock: '2 / mes', icon: '👁️', tier: 'gold', category: 'experiencia' },
    { id: 'llavero', name: 'Llavero kitsune', desc: 'Metal naranja/negro · edición 2025.', cost: 350, stock: 'Disponible', icon: '🔑', tier: 'bronze', category: 'merch' },
    { id: 'taza', name: 'Taza LyokFox', desc: 'Cerámica 350 ml · logo térmico.', cost: 550, stock: 'Disponible', icon: '☕', tier: 'bronze', category: 'merch' },
    { id: 'pin-set', name: 'Set 3 pins', desc: 'Brawl · Clash · Clubes Pro.', cost: 700, stock: '30 uds', icon: '📌', tier: 'bronze', category: 'merch' },
    { id: 'avatar-frame', name: 'Marco perfil digital', desc: 'PNG #Indomables para Discord/X.', cost: 300, stock: 'Ilimitado', icon: '🖼️', tier: 'bronze', category: 'digital' },
    { id: 'gemas-brawl', name: '250 gemas Brawl', desc: 'Recarga in-game · 1/mes por usuario.', cost: 2000, stock: '3 / mes', icon: '💎', tier: 'gold', category: 'ingame' },
    { id: 'pantalon-esports', name: 'Pantalón joggers', desc: 'Edición competición · logo bordado.', cost: 2800, stock: '8 uds', icon: '👖', tier: 'gold', category: 'merch' },
    { id: 'calcetines', name: 'Calcetines LyokFox x3', desc: 'Pack triple · diseño kitsune.', cost: 450, stock: 'Disponible', icon: '🧦', tier: 'bronze', category: 'merch' },
    { id: 'wallpaper-pack', name: 'Pack wallpapers 4K', desc: '12 fondos oficiales móvil/PC.', cost: 200, stock: 'Ilimitado', icon: '📱', tier: 'bronze', category: 'digital' },
    { id: 'curso-brawl', name: 'Guía IGL Brawl PDF', desc: 'Map pool · draft · comunicación 3v3.', cost: 650, stock: 'Ilimitado', icon: '📚', tier: 'bronze', category: 'digital' },
    { id: 'gemas-clash', name: '500 gemas CR', desc: 'Recarga Clash Royale · 1/mes.', cost: 2200, stock: '2 / mes', icon: '👑', tier: 'gold', category: 'ingame' },
    { id: 'sorteo-doble', name: 'Doble entrada sorteo', desc: '2x chances en sorteo trimestral.', cost: 1000, stock: 'Ilimitado', icon: '🎰', tier: 'silver', category: 'sorteos' },
    { id: 'foto-equipo', name: 'Foto con plantilla', desc: 'Sesión digital con jugador Brawl/CR.', cost: 3500, stock: '3 / mes', icon: '📷', tier: 'legend', category: 'experiencia' },
    { id: 'discord-nitro', name: '1 mes Discord Nitro', desc: 'Código regalo · sorteo mensual camada.', cost: 1800, stock: '2 / mes', icon: '💬', tier: 'gold', category: 'digital' }
  ],

  achievements: [
    { id: 'first_points', name: 'Primer KP', desc: 'Gana tus primeros puntos', at: 1 },
    { id: 'predictor', name: 'Oráculo', desc: '5 predicciones acertadas', at: 5, type: 'predictions_correct' },
    { id: 'pred10', name: 'Profeta', desc: '10 predicciones registradas', at: 10, type: 'predictions_total' },
    { id: 'streak7', name: 'Racha x7', desc: '7 días seguidos entrando', at: 7, type: 'streak' },
    { id: 'streak14', name: 'Fuego eterno', desc: '14 días de racha', at: 14, type: 'streak' },
    { id: 'quiz_master', name: 'Sabio kitsune', desc: 'Quiz perfecto 3 veces', at: 3, type: 'quiz_perfect' },
    { id: 'shopper', name: 'Coleccionista', desc: 'Canjea tu primer premio', at: 1, type: 'redeems' },
    { id: 'shopper5', name: 'VIP camada', desc: 'Canjea 5 premios', at: 5, type: 'redeems' },
    { id: 'legend', name: 'Leyenda viva', desc: 'Alcanza nivel Leyenda', at: 12000, type: 'lifetime' },
    { id: 'level_supremo', name: 'Supremo kitsune', desc: 'Alcanza nivel Supremo', at: 30000, type: 'lifetime' },
    { id: 'ig_master', name: 'Fan Instagram', desc: '5 acciones IG reclamadas', at: 5, type: 'instagram_actions' },
    { id: 'fans_master', name: 'Indomable Fans', desc: '5 acciones @Lyokfox_Fans', at: 5, type: 'fans_actions' },
    { id: 'social20', name: 'Redes totales', desc: '20 acciones en todas las redes', at: 20, type: 'social_actions' },
    { id: 'games20', name: 'Arcade master', desc: '20 minijuegos jugados', at: 20, type: 'games_total' },
    { id: 'news_all', name: 'Informado', desc: 'Lee las 20 noticias', at: 20, type: 'news_read' },
    { id: 'x_supporter', name: 'Indomable X', desc: '10 acciones Like/RT reclamadas', at: 10, type: 'twitter_actions' },
    { id: 'x_combo5', name: 'Combo master', desc: 'Like+RT en 5 posts', at: 5, type: 'twitter_combos' },
    { id: 'x_kp500', name: 'Influencer kitsune', desc: '500+ KP desde X', at: 500, type: 'twitter_kp' },
    { id: 'news20', name: 'Crónica total', desc: 'Lee las 20 noticias', at: 20, type: 'news_read' },
    { id: 'level_kitsune', name: 'Kitsune ascendido', desc: 'Alcanza nivel Kitsune', at: 2000, type: 'lifetime' },
    { id: 'promo3', name: 'Cazador de códigos', desc: 'Canjea 3 códigos promo', at: 3, type: 'promos' },
    { id: 'weekly5', name: 'Semana de fuego', desc: '5 objetivos semanales en una semana', at: 5, type: 'weekly_claims' },
    { id: 'pred_wins3', name: 'Vidente', desc: '3 predicciones acertadas', at: 3, type: 'predictions_correct' }
  ],

  faq: [
    { q: '¿Qué son los Kitsune Points (KP)?', a: 'Es la moneda de la Zona Comunidad. Ganas KP jugando, prediciendo y completando misiones. Canjeas KP por premios reales.' },
    { q: '¿Los premios son de verdad?', a: 'Sí. Tras canjear recibes un código único. Envíalo por Contáctanos con tus datos y el club gestiona el envío en 7–21 días.' },
    { q: '¿Se pierden mis puntos?', a: 'Se guardan en tu navegador (localStorage). Usa el mismo dispositivo y navegador para no perder progreso.' },
    { q: '¿Cómo acerto predicciones?', a: 'Cuando haya resultado oficial, editamos community-data.js. Si acertaste, recibes +100 KP automáticamente al entrar.' },
    { q: '¿Hay límite diario?', a: 'Algunos juegos tienen límite (ruleta 1/día, memoria 1/día, reflejos 3/día). El bonus diario y misiones rotan cada 24 h.' },
    { q: '¿Puedo participar sin registro?', a: 'Necesitas un apodo para guardar KP. Es gratis, solo eliges tu nombre de camada al entrar.' },
    { q: '¿Cómo gano KP con Like y RT en X?', a: 'Ve a Apoya en redes → X: abre cada post, da Like (+20 KP), RT (+35 KP) o comenta (+45 KP). Cada acción se reclama una vez por post. Combo Like+RT = +25 KP extra. Si haces las 3 = +35 KP bonus.' },
    { q: '¿Puedo reclamar varias veces el mismo post?', a: 'Cada acción (Like, RT, comentario, guardar…) se reclama una sola vez por post y apodo. Sí puedes apoyar todos los posts de la lista — cada uno suma KP independiente.' },
    { q: '¿Verificáis mis likes en X?', a: 'Reclama tras interactuar de verdad. El club puede auditar ganadores de premios físicos. El abuso puede anular canjes.' },
    { q: '¿Cuánto KP puedo ganar en X?', a: 'Hasta 10 posts activos: 20+35+25 combo = 80 KP por post completo. Misiones y objetivo semanal dan bonus extra.' },
    { q: '¿Dónde veo los posts nuevos?', a: 'Actualizamos la lista en community-data.js. Sigue @LyokFox_ para no perderte matchdays y campañas #Indomables.' },
    { q: '¿Qué son los códigos promo?', a: 'Códigos de campaña (INDOMABLES, VAMOSLYOKFOX…) que canjeas en la tienda por KP instantáneos. Cada código solo una vez por apodo.' },
    { q: '¿Cómo subo de nivel?', a: 'Los niveles usan KP lifetime (total ganado). 11 rangos: Cachorro 0 · Explorador 200 · Zorro 500 · Hurón 1.000 · Kitsune 2.000 · Naranja 3.500 · Alpha 5.500 · Élite 8.000 · Leyenda 12.000 · Mythic 18.000 · Supremo 30.000.' },
    { q: '¿Gano KP en Instagram?', a: 'Sí. En Apoya en redes → Instagram: Like +25 KP, Comentario +40 KP, Guardar +30 KP por post. Reclama tras interactuar de verdad.' },
    { q: '¿Y en @Lyokfox_Fans?', a: 'Like +15 KP y RT +25 KP en posts de la cuenta fans. Combo +20 KP si haces ambos en el mismo post.' },
    { q: '¿Hay descuento en tienda por nivel?', a: 'Desde Kitsune -5% hasta Supremo -20% en todos los premios. El descuento se aplica automáticamente al canjear.' },
    { q: '¿Qué es Mi progreso?', a: 'Panel con checklist personal: perfil, racha, misiones, noticias, minijuegos y barra hacia el siguiente nivel.' }
  ],

  leaderboardSeed: [
    { nick: 'FoxFire_ES', points: 12400 },
    { nick: 'KitsunePro', points: 9800 },
    { nick: 'BrawlLyok', points: 7650 },
    { nick: 'NaranjaKing', points: 6200 },
    { nick: 'Camada_Elite', points: 5100 },
    { nick: 'VPG_Fanatic', points: 4300 },
    { nick: 'GemGrabber', points: 3800 },
    { nick: 'ZorroNocturno', points: 2900 },
    { nick: 'KnockoutKing', points: 2400 },
    { nick: 'LyokFan_99', points: 1850 },
    { nick: 'OrangeStorm', points: 1620 },
    { nick: 'FoxTapPro', points: 1480 },
    { nick: 'Indomable_X', points: 1320 },
    { nick: 'CR_Lyok', points: 1190 },
    { nick: 'MemoriaFox', points: 1050 },
    { nick: 'PredKing_26', points: 980 },
    { nick: 'Camada_Nova', points: 870 },
    { nick: 'QuizFox', points: 760 },
    { nick: 'RT_Machine', points: 690 }
  ],

  quizPool: [
    { q: '¿En qué año se fundó LyokFox?', a: ['2018', '2020', '2022', '2019'], correct: 1 },
    { q: '¿Cuántos jugadores tiene Clubes Pro?', a: ['15', '20', '25', '30'], correct: 2 },
    { q: '¿Qué animal inspira la identidad?', a: ['Lobo', 'Kitsune', 'Tigre', 'Águila'], correct: 1 },
    { q: '¿Equipo principal móvil?', a: ['Clash Royale', 'Brawl Stars', 'FC Mobile', 'PUBG'], correct: 1 },
    { q: '¿Ligas de Clubes Pro?', a: ['LCS y VCT', 'VPG, PLG y VFO', 'UCL', 'MLG'], correct: 1 },
    { q: '¿Capitanes en Brawl Stars?', a: ['1', '2', '3', '0'], correct: 1 },
    { q: '¿Nombre de la comunidad?', a: ['Manada', 'Camada', 'Clan', 'Guild'], correct: 1 },
    { q: '¿Equipos oficiales?', a: ['2', '3', '4', '5'], correct: 1 },
    { q: '¿Color de marca?', a: ['Azul', 'Verde', 'Naranja', 'Rosa'], correct: 2 },
    { q: '¿Jugadores Brawl + Clash?', a: ['12', '14', '16', '18'], correct: 2 },
    { q: '¿Modo emblemático 3v3?', a: ['Showdown', 'Gem Grab', 'Heist', 'Hot Zone'], correct: 1 },
    { q: '¿Cuenta X oficial?', a: ['@LyokFox', '@LyokFox_', '@LyokFoxES', '@FoxLyok'], correct: 1 },
    { q: '¿Años del club?', a: ['3+', '5+', '7+', '10+'], correct: 1 },
    { q: 'Clash Royale compite en…', a: ['Solo ladder', 'Ladder y CW', 'Solo torneos', 'BR'], correct: 1 },
    { q: '¿KP significa…?', a: ['Kill Points', 'Kitsune Points', 'King Power', 'Key Pass'], correct: 1 },
    { q: '¿Total jugadores activos?', a: ['35', '40', '43', '50'], correct: 2 },
    { q: '¿Lema del club?', a: ['Go Fox', 'Vamos LyokFox', 'Fox Win', 'Orange Power'], correct: 1 },
    { q: '¿Mejor resultado BSC verificado 2023?', a: ['Top 16', '3º-4º NA West Finals', 'Campeones mundiales', 'Sin top'], correct: 1 },
    { q: '¿Mejor posición UNITE de LyokFox?', a: ['Top España', 'Top Europa', 'Top Mundial', 'Amateur'], correct: 1 },
    { q: '¿Staff diseño?', a: ['FoxDesign', 'MicifuzGT', 'LyokArt', 'KitsuneLab'], correct: 1 },
    { q: '¿Comunidad en redes?', a: ['500+', '7700+', '1000+', '200+'], correct: 1 },
    { q: '¿KP por Like en X?', a: ['5', '10', '20', '50'], correct: 2 },
    { q: '¿KP por RT en X?', a: ['15', '25', '35', '60'], correct: 2 },
    { q: '¿Hashtag campaña 2025?', a: ['#VamosFox', '#Indomables', '#OrangeFox', '#LyokWin'], correct: 1 },
    { q: '¿Rival PLG matchday?', a: ['Kode Gaming', 'Onibi eSports', 'JAM eSports', 'Ventucorp'], correct: 1 },
    { q: '¿Email contacto club?', a: ['info@lyokfox.com', 'lyokfox@gmail.com', 'contact@lyokfox.es', 'fox@lyokfox.com'], correct: 1 }
  ]
};
