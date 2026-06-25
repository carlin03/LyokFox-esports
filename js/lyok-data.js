/* Datos estáticos LyokFox Sports */
var LYOK_DATA = {
  site: {
    banner: 'img/banner-oficial.png',
    logo: 'img/logo.jpg',
    heroOverlay: false,
    heroImageOpacity: 0.5,
    heroEffects: {
      moon: false,
      kitsuneGlow: false,
      rays: false,
      floor: false,
      centerGlow: false
    },
    contact: {
      email: 'lyokfox@gmail.com',
      social: {
        twitter: 'https://x.com/LyokFox_',
        instagram: 'https://instagram.com/lyokfox',
        fans: 'https://x.com/Lyokfox_Fans'
      }
    }
  },
  theme: {
    accent: '#ff5a1f',
    accentBright: '#ff7a3d',
    accentDim: '#c94412',
    gold: '#d4a24e',
    bg: '#030303',
    bg2: '#060606',
    surface: '#0a0a0a',
    text: '#f2f0ed',
    muted: '#7a7a7a',
    headerBg: '#030303',
    headerOpacity: 0.88,
    headerTopOpacity: 0.62,
    headerBlur: 20,
    headerHeight: 84,
    headerNavScale: 1.08,
    headerBrandScale: 1.06,
    cardGlass: 0.82,
    grainOpacity: 0.02,
    borderAccent: 0.55,
    glowIntensity: 1.12,
    radiusLg: 12,
    tickerSpeed: 38,
    animations: false,
    type: {
      eyebrow: '#d4a24e',
      display: '#f2f0ed',
      displayAccent: '',
      lead: 'rgba(242, 240, 237, 0.78)',
      sectionTitle: '#f2f0ed',
      sectionSub: 'rgba(242, 240, 237, 0.65)',
      cardTitle: '#f2f0ed',
      cardText: 'rgba(242, 240, 237, 0.72)',
      link: '#ff7a3d',
      nav: 'rgba(242, 240, 237, 0.85)',
      navActive: '#ff5a1f',
      statValue: '#d4a24e',
      statLabel: 'rgba(242, 240, 237, 0.55)',
      footer: '#7a7a7a'
    },
    scale: {
      display: 1,
      section: 1,
      body: 1
    },
    effects: {
      mesh: false,
      dust: false,
      spotlight: false,
      scanline: false,
      heroCinema: false,
      cardTilt: false,
      magneticBtns: false,
      embers: false,
      dustCount: 0,
      emberCount: 0,
      meshBlur: 28,
      spotlightSize: 360,
      tiltStrength: 0.55,
      magneticStrength: 0.08,
      perfProfile: 'balanced'
    }
  },
  meta: {
    inicio: {
      title: 'LyokFox Sports — Club Esports España | Clash Royale y FC26',
      description: 'LyokFox Sports: club de esports español desde 2020. 35 jugadores en Clash Royale y EA Sports FC 26 Clubes Pro.'
    },
    noticias: {
      title: 'Noticias — LyokFox Sports | Matchdays y Novedades',
      description: 'Noticias oficiales LyokFox Sports. Matchdays, fichajes, torneos y novedades del club de esports.'
    },
    historia: {
      title: 'Historia — LyokFox Sports | Desde 2020',
      description: 'Historia de LyokFox Sports. Desde 2020, la camada kitsune en esports ibérico: Clash Royale y Clubes Pro.'
    },
    equipos: {
      title: 'Equipos — LyokFox Sports | Clash Royale y Clubes Pro FC26',
      description: 'Plantillas oficiales LyokFox: Clash Royale y Clubes Pro FC26. 35 jugadores en VPG, PLG y VFO.'
    },
    contacto: {
      title: 'Contáctanos — LyokFox Sports | Contacto y Reclutamiento',
      description: 'Contacta con LyokFox Sports. Reclutamiento, patrocinio, prensa y consultas generales.'
    },
    cuenta: {
      title: 'Mi perfil — LyokFox Sports | Cuenta camada',
      description: 'Crea tu perfil camada LyokFox. Opcional — no necesitas cuenta para ver la web.'
    }
  },
  uiLabels: {
    cardExplore: 'Explorar',
    cardRoster: 'Ver plantilla',
    cardEnter: 'Entrar',
    newsReadMore: 'Leer artículo',
    contactSocial: {
      twitter: 'X / Twitter',
      instagram: 'Instagram',
      fans: 'Comunidad fans'
    },
    contactSuccess: 'Redirigiendo a tu email… Si no se abre, escríbenos directamente.',
    playerProfileClose: 'Cerrar',
    newsPanelClose: 'Cerrar'
  },
  cuentaPage: {
    hubTitle: 'Tu <em>perfil</em>',
    hubSub: 'Opcional — guarda apodo y datos. No necesitas cuenta para ver la web.',
    loginTitle: 'Iniciar sesión',
    loginEmail: 'Email',
    loginPassword: 'Contraseña',
    loginSubmit: 'Entrar',
    registerTitle: 'Crear perfil',
    registerNickname: 'Apodo camada',
    registerEmail: 'Email',
    registerPassword: 'Contraseña',
    registerGame: 'Disciplina favorita',
    registerSubmit: 'Crear cuenta',
    skipText: 'Seguir sin cuenta →',
    skipHref: 'index.html',
    profileEyebrow: 'Tu camada',
    profileTitle: 'Mi perfil',
    profileWelcome: 'Hola, {nickname}',
    profileNickname: 'Apodo',
    profileBio: 'Bio',
    profileBioPlaceholder: 'Fan, jugador, staff… Cuéntanos quién eres en la camada.',
    profileGame: 'Disciplina favorita',
    profileRole: 'Rol en la camada',
    profileTwitter: 'Twitter / X',
    profileTwitterPlaceholder: '@tuusuario',
    profileInstagram: 'Instagram',
    profileInstagramPlaceholder: '@tuusuario',
    profileDiscord: 'Discord',
    profileDiscordPlaceholder: 'usuario#0000',
    profileAvatarChange: 'Cambiar foto',
    profileAvatarTitle: 'Foto de perfil',
    profileAvatarUrl: 'URL de imagen',
    profileAvatarApply: 'Aplicar URL',
    profileAvatarUpload: 'Subir desde PC',
    profileAvatarRemove: 'Quitar foto',
    profileIdentityEyebrow: 'Identidad',
    profileIdentityTitle: 'Tu <em>perfil</em>',
    profileSocialEyebrow: 'Redes',
    profileSocialTitle: 'Dónde <em>encontrarte</em>',
    profileStatsEyebrow: 'Resumen',
    profileStatsTitle: 'Tu ficha',
    profileMemberSince: 'Camada desde',
    profileLocalNote: 'Los datos se guardan solo en este navegador. Nadie más puede ver tu perfil.',
    quickNews: 'Noticias',
    quickNewsSub: 'Matchdays y novedades',
    quickTeams: 'Equipos',
    quickTeamsSub: 'Plantillas oficiales',
    quickTryouts: 'Tryouts',
    quickTryoutsSub: 'Únete a la camada',
    quickHistory: 'Historia',
    quickHistorySub: 'Crónica kitsune',
    profileRoles: { fan: 'Fan naranja', jugador: 'Jugador', staff: 'Staff', directiva: 'Directiva' },
    profileSave: 'Guardar cambios',
    profileLogout: 'Cerrar sesión',
    profileSaved: '✓ Perfil guardado',
    games: ['Clash Royale', 'Clubes Pro FC26']
  },
  nav: [
    { key: 'inicio', label: 'Inicio', href: 'index.html' },
    { key: 'noticias', label: 'Noticias', href: 'noticias.html' },
    { key: 'historia', label: 'Historia', href: 'historia.html' },
    { key: 'equipos', label: 'Equipos', href: 'equipos.html' },
    { key: 'contacto', label: 'Contáctanos', href: 'contactanos.html', cta: true }
  ],
  footer: {
    tagline: 'La astucia del kitsune · El fuego de la competición'
  },
  pages: {
    noticias: { eyebrow: 'Actualidad', title: 'NOTIC<em>IAS</em>', lead: 'Matchdays, fichajes y novedades de Clash Royale y Clubes Pro FC26.' },
    historia: { eyebrow: 'Desde 2020', title: 'HISTOR<em>IA</em>', lead: 'La camada kitsune: de scrims móviles a 1ª división en PLG y circuitos oficiales.' },
    equipos: { eyebrow: 'Plantillas oficiales', title: 'EQUIP<em>OS</em>', lead: '35 jugadores en Clash Royale y Clubes Pro FC26. Clan wars, ladder y ligas oficiales VPG, PLG y VFO.' },
    cuenta: { eyebrow: 'Opcional', title: 'MI PER<em>FIL</em>', lead: 'Cuenta camada para guardar tu apodo y datos. No es obligatoria para navegar la web.' },
    contacto: { eyebrow: 'Hablemos', title: 'CONTÁCT<em>ANOS</em>', lead: 'Tryouts, patrocinio, prensa o fans — escríbenos y te respondemos.' }
  },
  pageStyles: {
    inicio: { banner: '', bannerOpacity: null, showHeroBanner: false, titleScale: 1, leadScale: 1, bgImage: '', bgOpacity: 0.12, blockGap: 1 },
    noticias: { banner: '', bannerOpacity: null, showHeroBanner: false, titleScale: 1, leadScale: 1, bgImage: '', bgOpacity: 0.1, blockGap: 1 },
    historia: { banner: '', bannerOpacity: null, showHeroBanner: false, titleScale: 1, leadScale: 1, bgImage: '', bgOpacity: 0.1, blockGap: 1 },
    equipos: { banner: '', bannerOpacity: null, showHeroBanner: false, titleScale: 1, leadScale: 1, bgImage: '', bgOpacity: 0.1, blockGap: 1 },
    cuenta: { banner: '', bannerOpacity: null, showHeroBanner: false, titleScale: 1, leadScale: 1, bgImage: '', bgOpacity: 0.08, blockGap: 1 },
    contacto: { banner: '', bannerOpacity: null, showHeroBanner: false, titleScale: 1, leadScale: 1, bgImage: '', bgOpacity: 0.1, blockGap: 1 }
  },
  contactPage: {
    infoTitle: 'Información',
    intro: 'Respondemos en 24–48 h laborables. Para urgencias de matchday, escríbenos por @LyokFox_ en X.',
    formNote: 'Al enviar aceptas que te contactemos por email. No compartimos tus datos con terceros.',
    formTitle: 'Escríbenos',
    formLabels: {
      nombre: 'Nombre',
      email: 'Email',
      tipo: 'Motivo',
      mensaje: 'Mensaje',
      submit: 'Enviar mensaje'
    },
    formPlaceholders: {
      nombre: 'Tu nombre',
      email: 'tu@email.com',
      mensaje: 'Cuéntanos en qué podemos ayudarte…'
    },
    formSuccess: 'Redirigiendo a tu email… Si no se abre, escríbenos a lyokfox@gmail.com',
    formOptions: [
      { value: 'general', label: 'Consulta general' },
      { value: 'reclutamiento', label: 'Reclutamiento / Tryouts' },
      { value: 'patrocinio', label: 'Patrocinio / Partnership' },
      { value: 'prensa', label: 'Prensa / Medios' }
    ]
  },
  equiposPage: {
    sectionHead: {
      eyebrow: 'Plantillas oficiales',
      title: 'Nuestros <em>equipos</em>',
      sub: 'Clash Royale y Clubes Pro FC26 — jugadores, roles y perfiles de la camada kitsune.'
    },
    tryoutsTitle: '¿Buscas <em>tryouts</em>?',
    tryoutsSub: 'Escríbenos con tu disciplina, experiencia y disponibilidad horaria.',
    tryoutsBtn: { text: 'Contactar reclutamiento', href: 'contactanos.html' }
  },
  historyPage: {
    actions: [
      { text: 'Ver equipos actuales', href: 'equipos.html', style: 'primary' },
      { text: 'Leer noticias', href: 'noticias.html', style: 'ghost' }
    ]
  },
  home: {
    badge: '',
    eyebrow: 'Clash Royale · Clubes Pro FC26',
    title: 'LYOK<em>FOX</em>',
    lead: 'La astucia del kitsune. El fuego de la competición. Club de esports ibérico desde 2020 con presencia en VPG, PLG y VFO.',
    ctaPrimary: { text: 'Ver noticias', href: 'noticias.html' },
    ctaSecondary: { text: 'Ver equipos', href: 'equipos.html' },
    sections: {
      spotlight: { eyebrow: 'Accesos rápidos', title: 'Lo más <em>destacado</em>', sub: 'Noticias, historia y equipos del club.' },
      disciplines: { eyebrow: 'Disciplinas', title: 'Dos frentes de <em>batalla</em>', sub: 'Clash Royale y Clubes Pro FC26 — plantillas profesionales y calendario oficial.' },
      schedule: { eyebrow: 'Calendario', title: 'Próximos <em>partidos</em>', sub: 'Horarios CEST · Sigue los matchdays en @LyokFox_' },
      sponsor: { eyebrow: 'Partnerships', title: 'Niveles de <em>partnership</em>', sub: 'Visibilidad en esports ibérico con paquetes claros.' },
      seo: { eyebrow: 'Club oficial', title: 'LyokFox Sports — <em>esports</em> ibérico' },
      cta: { eyebrow: 'Únete', title: '¿Quieres formar parte de la <em>camada</em>?', sub: 'Jugadores y fans — escríbenos.' },
      homeNews: { eyebrow: 'Actualidad', title: 'Últimas <em>noticias</em>', sub: 'Matchdays, fichajes y novedades del club.' }
    },
    newsTeaser: {
      moreText: 'Ver todas las noticias',
      moreHref: 'noticias.html'
    },
    brandsLabel: 'Ligas & circuitos oficiales',
    ctaButtons: {
      primary: { text: 'Contáctanos', href: 'contactanos.html' },
      secondary: { text: 'Nuestra historia', href: 'historia.html' }
    },
    seoText: [
      'LyokFox Sports es un club de esports español fundado en 2020. Con 35 jugadores en Clash Royale y EA Sports FC 26 Clubes Pro compite en VPG Spain, PLG Spain y VFO Spain.',
      'La camada kitsune combina competición oficial y contenido en redes. Si buscas unirte como jugador o seguir los matchdays, lee nuestras noticias o contáctanos.'
    ],
    seoKeywords: ['Esports España', 'Clash Royale', 'Clubes Pro FC26', 'VPG', 'PLG', 'VFO'],
    faq: [
      { q: '¿Qué es LyokFox Sports?', a: 'Club de esports ibérico desde 2020 con plantillas en Clash Royale y FC26 Clubes Pro. 35 jugadores en competición oficial.' },
      { q: '¿En qué ligas compite?', a: 'VPG, PLG y VFO en fútbol virtual. Ladder, Clan Wars y Supremacy League en Clash Royale.' },
      { q: '¿Cómo unirme al club?', a: 'Escríbenos en Contáctanos con tu disciplina, experiencia y horarios.' },
      { q: '¿Dónde seguir los partidos?', a: 'En @LyokFox_ y en el calendario de esta web.' }
    ]
  },
  visibility: {
    hero: true,
    heroStats: true,
    heroCtas: true,
    ticker: true,
    matchPanel: true,
    matchStrip: true,
    brands: true,
    'secHead-spotlight': true,
    'secHead-disciplines': true,
    'secHead-schedule': true,
    'secHead-sponsor': true,
    'secHead-seo': true,
    'secHead-cta': true,
    spotlight: false,
    disciplines: true,
    calendario: true,
    seoText: true,
    seoFaq: true,
    seo: true,
    patrocinio: true,
    cta: true,
    siteHeader: true,
    siteFooter: true,
    pageHero: true,
    contactInfo: true,
    contactForm: true,
    contactPage: true,
    noticias: true,
    historia: true,
    equipos: true,
    equiposTryouts: true,
    homeNews: true,
    newsBreaking: false,
    cuenta: true,
    cuentaGate: true,
    cuentaArea: true
  },
  ticker: [
    'VPG Superliga vs Ventucorp · 26 Jun 23:00 CEST',
    'Vamos LyokFox',
    '#Indomables',
    'Clash Royale · Clubes Pro FC26',
    '1ª División PLG · VFO Spain',
    'Sigue @LyokFox_ en X'
  ],
  brands: [
    { name: 'VPG Spain', logo: 'assets/games/fc26-official-light.svg' },
    { name: 'PLG Spain', logo: 'assets/games/fc26-official-light.svg' },
    { name: 'VFO Spain', logo: 'assets/games/fc26-official-light.svg' },
    { name: 'Supremacy League', logo: 'assets/games/clash-royale-official.png' },
    { name: 'Impact Game', logo: '' }
  ],
  stats: [
    { value: '35', label: 'Jugadores' },
    { value: '2', label: 'Disciplinas' },
    { value: '1ª', label: 'PLG / VFO' },
    { value: '2020', label: 'Fundación' }
  ],
  nextMatch: {
    label: 'Próximo partido',
    home: 'LyokFox',
    away: 'Ventucorp',
    league: 'VPG Superliga · Temp. 8 · FC26',
    date: 'Vie 26 Jun',
    time: '23:00 CEST',
    status: 'Online · PS5',
    homeLogo: 'img/logo.jpg',
    awayLogo: '',
    leagueLogo: 'assets/games/fc26-official-light.svg',
    links: {
      x: { text: 'Seguir en X →', href: 'https://x.com/LyokFox_' },
      calendar: { text: 'Ver calendario completo →', href: 'index.html#calendario' }
    }
  },
  sponsorUi: {
    tierCta: 'Solicitar',
    dossierCta: 'Solicitar dossier completo',
    dossierHref: 'contactanos.html?tipo=patrocinio'
  },
  spotlight: [
    { num: '01', title: 'Noticias', text: 'Matchdays, fichajes y novedades del club.', href: 'noticias.html', accent: true },
    { num: '02', title: 'Historia', text: 'Desde 2020. La camada kitsune y su legado.', href: 'historia.html' },
    { num: '03', title: 'Equipos', text: 'Clash Royale y Clubes Pro — 35 jugadores.', href: 'equipos.html' }
  ],
  teams: [
    {
      id: 'clash',
      name: 'Clash Royale',
      tag: 'Ladder · Clan Wars · Torneos',
      icon: 'assets/games/clash-royale-official.png',
      about: 'Ocho titulares y dos capitanes. Ladder competitivo, guerras de clanes y Supremacy League Mixed Edition S2.',
      stats: [
        { value: '8', label: 'Titulares' },
        { value: '2', label: 'Capitanes' },
        { value: 'CW', label: 'Activo' }
      ],
      tags: ['Ladder', 'Clan Wars', 'Supremacy', 'Meta decks']
    },
    {
      id: 'eafc',
      name: 'Clubes Pro FC26',
      tag: 'VPG · PLG · VFO',
      icon: 'assets/games/fc26-official-light.svg',
      about: 'Veinticinco jugadores en las tres grandes ligas del eFootball clubes ibérico. 1ª PLG alcanzada. Hasta cuatro oficiales en una noche.',
      stats: [
        { value: '25', label: 'Plantilla' },
        { value: '3', label: 'Ligas' },
        { value: '1ª', label: 'PLG' }
      ],
      tags: ['VPG Spain', 'PLG Spain', 'VFO Spain', 'Táctica 11v11']
    }
  ],
  schedule: [
    { game: 'Clubes Pro', vs: 'Kode Gaming ES', league: 'VPG Zero Masters · T8', when: 'Mar 23 Jun · 22:20', live: true, gameIcon: 'assets/games/fc26-official-light.svg', homeLogo: 'img/logo.jpg', awayLogo: '', leagueLogo: 'assets/games/fc26-official-light.svg' },
    { game: 'Clubes Pro', vs: 'Onibi eSports', league: 'PLG 1ª División', when: 'Mar 23 Jun · 22:45', live: true, gameIcon: 'assets/games/fc26-official-light.svg', homeLogo: 'img/logo.jpg', leagueLogo: 'assets/games/fc26-official-light.svg' },
    { game: 'Clubes Pro', vs: 'JAM eSports', league: 'VFO Spain', when: 'Mié 24 Jun · 21:30', gameIcon: 'assets/games/fc26-official-light.svg', homeLogo: 'img/logo.jpg', leagueLogo: 'assets/games/fc26-official-light.svg' },
    { game: 'Clubes Pro', vs: 'Ventucorp', league: 'VPG Superliga', when: 'Vie 26 Jun · 23:00', gameIcon: 'assets/games/fc26-official-light.svg', homeLogo: 'img/logo.jpg', leagueLogo: 'assets/games/fc26-official-light.svg' },
    { game: 'Clash Royale', vs: 'WeSports CR', league: 'Supremacy League S2', when: 'Jue 25 Jun · 20:30', gameIcon: 'assets/games/clash-royale-official.png', homeLogo: 'img/logo.jpg', leagueLogo: 'assets/games/clash-royale-official.png' }
  ],
  sponsorTiers: [
    {
      name: 'Bronce',
      price: 'Desde 150 €/mes',
      featured: false,
      perks: [
        'Logo en web oficial y redes sociales',
        'Mención en stream mensual',
        'Acceso al dossier de audiencia',
        'Tag en publicaciones de matchday'
      ]
    },
    {
      name: 'Plata',
      price: 'Desde 400 €/mes',
      featured: true,
      perks: [
        'Todo el paquete Bronce',
        'Banner en directos y overlays',
        'Post dedicado en X e Instagram',
        'Presencia en calendario de partidos',
        'Clip mensual con tu marca'
      ]
    },
    {
      name: 'Oro',
      price: 'Partnership a medida',
      featured: false,
      perks: [
        'Todo el paquete Plata',
        'Naming de torneo interno LyokFox',
        'Merchandising co-branded',
        'Activaciones con jugadores',
        'Presencia premium en eventos'
      ]
    }
  ],
  rosters: {
    clashRoyale: [
      { name: 'aroy_cr', role: 'Capitán', captain: true, note: 'Supremacy League Mixed S2', joined: '2022', twitter: '@aroy_cr', bio: 'Capitán de Clash Royale. Lidera la división CR en Supremacy League Mixed S2, Clan Wars y ladder competitivo. Especialista en meta decks y coordinación de guerras.', highlights: ['Capitán CR', 'Supremacy League S2', 'Clan Wars activo'] },
      { name: 'Recameca', role: 'Capitán', captain: true, note: 'Clan Wars · ladder', joined: '2021', bio: 'Co-capitanía CR. Referente en matchups y guerras de clan. Apoya la estructura competitiva de la camada kitsune en ladder.', highlights: ['Co-capitanía', 'Ladder top', 'CW'] },
      { name: 'kevincito_CR', role: 'Jugador', note: 'Meta decks · CW' },
      { name: 'ByAlexis_Carp', role: 'Jugador', note: 'Torneos CR' },
      { name: 'CarlosCgmz', role: 'Jugador', note: '@LyokFox_ · ladder' },
      { name: 'Maya_cr01', role: 'Jugador', note: 'CRL June · Top 1149' },
      { name: 'MonllorCr', role: 'Jugador', note: 'Ladder competitivo' },
      { name: 'Hyron_cr', role: 'Jugador', note: 'Matchups · CW' },
      { name: 'JuanCRplayer', role: 'Jugador', note: 'Guerras de clan' },
      { name: 'AndrCastaeda4', role: 'Staff', note: 'Supremacy League · coordinación' }
    ],
    clubesPro: [
      { name: 'Pabzz___', role: 'Medio', note: 'Fichaje 2025', joined: '2025', bio: 'Regreso al escudo kitsune en el ciclo FC26. Medio creativo con experiencia en VPG, PLG y VFO. Pieza clave del mediocampo LyokFox.', highlights: ['Fichaje 2025', 'VPG · PLG · VFO'] },
      { name: 'Merino11_', role: 'Medio', note: 'Fichaje confirmado', joined: '2025', bio: 'Nuevo fichaje con mentalidad ganadora para las tres ligas ibéricas de Clubes Pro.', highlights: ['Debut FC26', 'Plantilla élite'] },
      { name: 'Txiki', role: 'Carrilero', note: 'asiercg7_' },
      { name: 'Vargas_N1shh3r', role: 'Mediocentro', note: 'Ex EsThundergaming' },
      { name: 'TeweletelaJR', role: 'Delantero', note: 'Dupla ataque' },
      { name: 'ZarzuJr', role: 'Delantero', note: 'Dupla ataque' },
      { name: 'Jesus_ns_03', role: 'Delantero', note: 'DC · @LyokFox_' },
      { name: 'edgarbarge13', role: 'Defensa', note: 'LFX · @LyokFox_' },
      { name: 'Javi14B', role: 'Mediocentro', note: 'CDM/CM · capitán AW' },
      { name: 'AitorGarcia1998', role: 'Defensa', note: 'DFC · Alpha Wolfs' },
      { name: 'CarlosCgmz', role: 'Medio', note: '@LyokFox_' },
      { name: 'zorenice', role: 'Polivalente', note: 'DC · MCO · MV · DFC' },
      { name: 'CproEdu', role: 'Portero', note: 'GK · Alpha Wolfs' },
      { name: 'nicoeff96', role: 'Defensa', note: 'DFC · MV' },
      { name: 'xDieguinho7', role: 'Medio', note: 'Alpha Wolfs · FC26' },
      { name: 'Moriles_12', role: 'Carrilero', note: 'VPG x2' },
      { name: 'Big_Sindu', role: 'Defensa', note: 'Pro Clubs · ascensos VPG' },
      { name: 'rubeen_mtnzz', role: 'Medio', note: 'Alpha Wolfs' },
      { name: 'PrinceMatute', role: 'Mediocentro', note: 'Ex Virus Gaming CP' },
      { name: 'Palanquista_eSp', role: 'Extremo', note: 'Rotaciones PLG/VPG' },
      { name: 'Marcelinhocpro', role: 'Delantero', note: 'M15 · DC/CAR' },
      { name: 'WoLFcr', role: 'Manager', note: 'MG Alpha Wolfs · @LyokFox', joined: '2020', twitter: '@LyokFox', bio: 'Manager general Alpha Wolfs y referente del proyecto Clubes Pro. Coordina plantilla, calendario multi-liga y scouting.', highlights: ['Manager CP', 'Alpha Wolfs', 'Staff LyokFox'] },
      { name: 'MicifuzGT', role: 'Director', note: 'CEO · diseño', joined: '2020', bio: 'CEO y director del club. Identidad visual kitsune, partnerships y visión competitiva desde la fundación en 2020.', highlights: ['Fundador', 'CEO', 'Branding'] },
      { name: 'geemz_g', role: 'Staff', note: 'Community & social' },
      { name: 'palopi1905', role: 'Staff', note: 'Scouting · ex @LyokFoxEAFCPS5' }
    ]
  },
  news: {
    breaking: '',
    breakingLabel: 'Última hora',
    sectionHead: {
      eyebrow: 'Feed oficial',
      title: 'Todas las <em>noticias</em>',
      sub: 'Matchdays, fichajes, torneos y novedades de Clash Royale y Clubes Pro.'
    },
    articles: [
      {
        id: 'n-matchday-jun28',
        date: '2025-06-28',
        tag: 'Matchday',
        cat: 'clubesPro',
        featured: true,
        title: 'Super Matchday FC26: cuatro partidos en una noche',
        excerpt: 'LyokFox activa cartelera completa: Zero Masters VPG, jornada PLG y Superliga en una sola noche.',
        image: 'img/banner-oficial.png',
        body: [
          'Esta noche la camada no duerme. LyokFox activa cartelera completa en EA Sports FC 26 Clubes Pro: Zero Masters VPG, jornada de PLG y partido de Superliga en la misma ventana horaria.',
          'El staff confirma rotaciones para sostener el ritmo en las tres competiciones. Los horarios oficiales y las alineaciones se publican en el hilo de @LyokFox_ antes del pitido inicial.',
          'Si sigues la camada desde fuera, activa notificaciones: hasta cuatro partidos oficiales pueden coincidir en una sola noche de matchday.'
        ]
      },
      {
        id: 'n-fichajes-pabzz',
        date: '2025-06-19',
        tag: 'Fichajes',
        cat: 'clubesPro',
        featured: true,
        title: 'Pabzz___ vuelve a casa y Merino11_ se une al proyecto',
        excerpt: 'Movimiento de lujo en Clubes Pro para VPG, PLG y VFO en el ciclo FC26.',
        image: 'img/banner-oficial.png',
        body: [
          'Pabzz___ regresa al escudo kitsune con experiencia en VPG y mentalidad de competición inmediata. Merino11_ se une al proyecto como fichaje de impacto para el ciclo FC26.',
          'La dirección deportiva refuerza el medio campo y la profundidad de banquillo en PLG y VFO. Ambos jugadores pasan revisión médica y táctica esta semana.',
          'Con 25 jugadores activos, LyokFox mantiene plantilla completa para sostener el calendario multi-liga sin descuidar ninguna competición oficial.'
        ]
      },
      {
        id: 'n-vpg-once-t8',
        date: '2024-11-12',
        tag: 'VPG',
        cat: 'clubesPro',
        title: 'Once de la Semana VPG Zero Masters — T8',
        excerpt: 'Palanquista_eSp y la plantilla LyokFox en el XI oficial de la semana.',
        image: 'img/banner-oficial.png',
        body: [
          'Palanquista_eSp y la plantilla LyokFox entran en el Once de la Semana de VPG Zero Masters Temporada 8, reconocimiento individual tras una jornada de alto rendimiento.',
          'El club repite hitos similares en temporadas anteriores de Zero Masters, consolidando la imagen de proyecto serio en la élite del fútbol virtual ibérico.',
          'El reconocimiento suma visibilidad al escudo y refuerza el trabajo de scouting y análisis que acompaña cada matchday oficial.'
        ]
      },
      {
        id: 'n-supremacy-cr',
        date: '2025-06-10',
        tag: 'Clash Royale',
        cat: 'clash',
        title: 'Supremacy League Mixed S2 — plantilla confirmada',
        excerpt: 'Capitanes aroy_cr y Recameca lideran la división CR de LyokFox.',
        image: 'img/banner-oficial.png',
        body: [
          'La división de Clash Royale confirma plantilla para Supremacy League Mixed Edition S2 con aroy_cr y Recameca al frente como capitanes.',
          'Ocho titulares más staff activo en Clan Wars, ladder competitivo y preparación de meta decks para la fase de grupos.',
          'El próximo escenario importante es el duelo ante WeSports CR en jornada Supremacy. La camada busca sumar puntos clave antes del corte de clasificación.'
        ]
      },
      {
        id: 'n-indomables',
        date: '2024-03-15',
        tag: 'Club',
        cat: 'historia',
        title: '#Indomables — el lema que une a la camada',
        excerpt: 'Más de 7.700 seguidores en @LyokFox. Cultura naranja desde 2020.',
        image: 'img/banner-oficial.png',
        body: [
          'Vamos LyokFox dejó de ser un grito en chat para convertirse en bandera de la camada. #Indomables resume la actitud competitiva del club desde 2020.',
          'Más de 7.700 seguidores en @LyokFox_ empujan desde fuera como una décima posición en el campo: comunidad, prensa amateur y fans que viven cada matchday.',
          'La cultura naranja no es solo estética: es el estándar de exigencia que une plantillas de Clash Royale y Clubes Pro bajo un mismo nombre.'
        ]
      },
      {
        id: 'n-5-aniversario',
        date: '2025-01-20',
        tag: 'Historia',
        cat: 'historia',
        title: '5 años de LyokFox — de scrims móviles a 1ª PLG',
        excerpt: 'Fundados en 2020. Dos disciplinas activas, 35 jugadores, una camada.',
        image: 'img/banner-oficial.png',
        body: [
          'LyokFox cumple cinco años de historia competitiva: de scrims móviles y primeros torneos a 1ª división en PLG y presencia estable en VPG y VFO.',
          'Hoy la camada suma 35 jugadores en dos disciplinas activas, con calendario oficial cargado cada semana y una identidad kitsune reconocible en todo el ecosistema ibérico.',
          'El aniversario no es cierre: es punto de partida para seguir creciendo con tryouts abiertos, contenido en redes y ambición clara en cada competición.'
        ]
      }
    ]
  },
  history: {
    intro: {
      title: 'Origen <em>LyokFox</em>',
      lead: 'Fundados en 2020. El kitsune — astuto, adaptable — es nuestro símbolo. Naranja fuego, negro carbón y una camada que supera los 7.700 seguidores en @LyokFox.',
      stats: [
        { value: '2020', label: 'Fundación' },
        { value: '7700+', label: 'Seguidores @LyokFox' },
        { value: '35', label: 'Jugadores' },
        { value: '1ª', label: 'PLG / VFO / VPG' },
        { value: 'Top EU', label: 'Pokémon UNITE' }
      ]
    },
    storyBlocks: [
      {
        id: 'story-origen',
        layout: 'image-left',
        eyebrow: '2020 — 2021',
        title: 'Los primeros <em>pasos</em>',
        text: 'LyokFox Esports nació en 2020 con una idea clara: organización competitiva ibérica con alma y ambición real. Identidad visual naranja sobre negro, presencia en redes y búsqueda de jugadores con mentalidad #Indomables. En 2021 el proyecto dejó de ser papel para convertirse en nombre serio de la escena.',
        image: 'img/banner-oficial.png'
      },
      {
        id: 'story-camino',
        layout: 'image-right',
        eyebrow: 'Competición',
        title: 'De scrims a <em>ligas oficiales</em>',
        text: 'Top 7 y Top 9 en clasificatorios BSC. 3º-4º en NA West Monthly Finals 2023. Con @LyokFoxEAFCPS5 alcanzamos 2ª PLG, 1ª VFO y 1ª VPG desde cero. VPG Zero Masters, Superliga, Once de la Semana e Impact Game. Tres ligas, un solo escudo naranja.',
        image: 'assets/games/clash-royale-official.png'
      },
      {
        id: 'story-hoy',
        layout: 'center',
        wide: true,
        style: { width: 'wide', padding: 'xl', titleScale: 1.06, textScale: 1.05 },
        eyebrow: 'Presente',
        title: 'LyokFox <em>hoy</em>',
        text: 'Dos frentes activos: Clash Royale y Clubes Pro FC26. 35 jugadores, calendario oficial cada semana y una identidad kitsune reconocible en todo el ecosistema ibérico.\n\nPalmarés en móvil y clubes, presencia en VPG, PLG y VFO, y una comunidad naranja que crece en cada matchday. La historia no se cierra: se escribe cada jornada con tryouts abiertos, contenido en redes y ambición clara de seguir compitiendo al más alto nivel ibérico.',
        image: '',
        bgImage: ''
      }
    ],
    chapters: [
      {
        id: 'origen',
        era: '2020 — 2021',
        title: 'Los primeros <em>pasos</em>',
        text: 'LyokFox Esports nació en 2020 con una idea clara: organización competitiva ibérica con alma y ambición real. Identidad visual naranja sobre negro, presencia en redes y búsqueda de jugadores con mentalidad #Indomables. En 2021 el proyecto dejó de ser papel para convertirse en nombre serio de la escena.'
      },
      {
        id: 'filosofia',
        era: 'Capítulo I',
        title: 'Filosofía <em>kitsune</em>',
        text: 'No competimos solo por ganar: competimos por representar. La camada kitsune — capitanes, plantilla, directiva y comunidad — es el núcleo. Lema: La astucia del kitsune. El fuego de la competición.',
        quote: 'La astucia del kitsune. El fuego de la competición. — Lema LyokFox'
      },
      {
        id: 'comunidad',
        era: '2021 — 2022',
        title: 'La comunidad <em>naranja</em>',
        text: '@LyokFox superó los 7.700 seguidores. Matchdays en directo, clips, interacción con ligas y rivales. La marca kitsune se reconoció en X e Instagram. Una org sin comunidad es un equipo; LyokFox siempre quiso ser un movimiento.'
      },
      {
        id: 'movil',
        era: 'Móvil',
        title: 'Esports <em>móvil</em>',
        text: 'Top 7 y Top 9 en clasificatorios BSC. 3º-4º en NA West Monthly Finals 2023 ($3.500, Liquipedia). Top Europa en Pokémon UNITE. Brawl Stars vuelve en 2025 como disciplina principal con scrims 3v3 y map pool oficial.',
        highlights: ['Top 7 BSC', 'Top 9 BSC', '3º-4º NA Finals', 'Top EU UNITE']
      },
      {
        id: 'clubes',
        era: '2022 — 2023',
        title: 'Era <em>Clubes Pro</em>',
        text: 'Con @LyokFoxEAFCPS5 alcanzamos 2ª PLG, 1ª VFO y 1ª VPG desde cero. VPG Zero Masters, Superliga, Once de la Semana, Impact Game y Europa League. Tres ligas, un solo escudo naranja.'
      },
      {
        id: 'dorada',
        era: '2023 — 2024',
        title: 'La era <em>dorada</em>',
        text: 'Once de la Semana VPG (T3 y T8), Gol Impact Game 3º puesto, 1ª División PLG confirmada. Noches con hasta 4 partidos oficiales. VPG Europa League hasta 32avos de final. Clash Royale consolida 8 jugadores y 2 capitanes.'
      },
      {
        id: 'fc26',
        era: '2025',
        title: 'Nueva era <em>FC26</em>',
        text: 'Nace @LyokFox_ y la reconstrucción en EA Sports FC 26 Clubes Pro. Fichajes Pabzz___, Merino11_, Txiki y plantilla de 25 para VPG, PLG y VFO. Dos cuentas, una sola camada.'
      },
      {
        id: 'hoy',
        era: 'Presente',
        title: 'LyokFox <em>hoy</em>',
        text: 'Dos frentes activos: Clash Royale y Clubes Pro FC26. Palmarés en móvil y clubes. Cinco años después, independientes, ambiciosos y fieles a la identidad naranja. La historia se escribe cada jornada.'
      }
    ],
    milestonesHeader: {
      eyebrow: 'Cronología',
      title: 'Hitos <em>clave</em>',
      sub: 'Palmarés, ascensos y momentos que marcaron la camada — pincha para ampliar.'
    },
    milestones: [
      { year: '2020', tag: 'Fundación', title: 'Nace LyokFox Esports', text: 'Organización fundada para competir al más alto nivel. Identidad kitsune naranja y lema Vamos LyokFox.' },
      { year: '2022', tag: 'Clubes', title: '@LyokFoxEAFCPS5', text: 'Nace el proyecto de EAFC Clubes Pro en PS5. Ambición clara: ascender a las máximas categorías.' },
      { year: '2023', tag: 'Ascenso', title: '2ª PLG · 1ª VFO · 1ª VPG', text: 'Todos los objetivos cumplidos desde cero. LyokFox entra en la élite de las tres ligas españolas.' },
      { year: '2023', tag: 'Europa', title: 'VPG Europa League', text: '32avos de final — ESP vs POL. El club compite fuera de España por primera vez en competición europea.' },
      { year: '2024', tag: 'PLG', title: '1ª División PLG', text: 'Máxima categoría alcanzada. @PLGeFootBall confirma el estatus de élite del club.' },
      { year: '2024', tag: 'Palmarés', title: 'Once de la Semana VPG', text: 'Zero Masters temporadas 3 y 8. Jugadores LyokFox entre los mejores de la competición.' },
      { year: 'Jul 2025', tag: 'FC26', title: 'Cuenta @LyokFox_', text: 'Nueva era oficial. Fichajes estratégicos y plantilla de 25 para dominar el ciclo FC26.' },
      { year: '2026', tag: 'Hoy', title: 'LyokFox Sports', text: '35 jugadores · Clash Royale y Clubes Pro · camada activa en VPG, PLG y VFO.' }
    ]
  }
};

/* Copia canónica — la web pública siempre arranca desde aquí */
var LYOK_DATA_DEFAULTS = JSON.parse(JSON.stringify(LYOK_DATA));
