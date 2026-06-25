/* Datos patrocinio LyokFox — dossier para empresas */
var SPONSOR = {
  heroStats: [
    { value: '5+', label: 'Años activos', sub: 'Desde 2020' },
    { value: '43', label: 'Jugadores', sub: '3 disciplinas' },
    { value: '7.7K+', label: 'Audiencia X', sub: 'Cuenta histórica' },
    { value: '3', label: 'Ligas top', sub: 'VPG · PLG · VFO' }
  ],

  impactStats: [
    { value: 2847, suffix: '+', label: 'Miembros comunidad', desc: 'Zona Comunidad activa con KP y retención semanal' },
    { value: 7700, suffix: '+', label: 'Seguidores históricos', desc: '@LyokFox — base Indomables consolidada' },
    { value: 3420, suffix: '', label: 'Interacciones X / semana', desc: 'Likes, RT y comentarios en contenido oficial' },
    { value: 12, suffix: '+', label: 'Matchdays / mes', desc: 'Brawl · Clash · Clubes Pro FC26 en calendario real' },
    { value: 1.2, suffix: 'M+', label: 'KP distribuidos', desc: 'Engagement medible en predicciones y arcade' },
    { value: 3, suffix: '', label: 'Verticales esports', desc: 'Mobile + simulación competitiva ibérica' }
  ],

  whyJoin: [
    {
      icon: '📡',
      title: 'Visibilidad multiplataforma',
      desc: 'Tu marca en matchdays VPG, PLG y VFO, streams, redes oficiales y web premium con tráfico cualificado esports.'
    },
    {
      icon: '🎯',
      title: 'Audiencia joven y fiel',
      desc: 'Gen Z y millennials mobile-first. Comunidad Indomables que interactúa, predice y comparte cada jornada.'
    },
    {
      icon: '🏆',
      title: 'Palmarés demostrable',
      desc: 'Top 7 y Top 9 Brawl Stars, Top Europa UNITE, 1ª PLG, 1ª VFO, 1ª VPG y VPG Europa League — credibilidad real.'
    },
    {
      icon: '📊',
      title: 'Métricas y reporting',
      desc: 'Impresiones, clips, menciones y KPIs de campaña. Transparencia para marketing y dirección.'
    },
    {
      icon: '🤝',
      title: 'Activaciones a medida',
      desc: 'Sorteos KP, códigos promo, naming de torneos internos, contenido co-branded y presencia en eventos.'
    },
    {
      icon: '⚡',
      title: 'Respuesta ágil',
      desc: 'Club estructurado con staff, plantillas completas y canal directo para cerrar acuerdos rápido.'
    }
  ],

  achievements: [
    { game: 'Brawl Stars', title: 'Top 7 · BSC', detail: 'Clasificatorio oficial Supercell', tier: 'gold' },
    { game: 'Brawl Stars', title: 'Top 9 · BSC', detail: 'Clasificatorio oficial Supercell', tier: 'gold' },
    { game: 'Pokémon UNITE', title: 'Top Europa', detail: 'Competición europea camada', tier: 'legend' },
    { game: 'Clubes Pro', title: '1ª División PLG', detail: 'Máxima categoría nacional', tier: 'legend' },
    { game: 'Clubes Pro', title: '1ª VFO Spain', detail: 'Liga nacional VFO', tier: 'legend' },
    { game: 'Clubes Pro', title: '1ª VPG Spain', detail: 'Máximo nivel VPG', tier: 'legend' },
    { game: 'Clubes Pro', title: 'VPG Europa League', detail: 'Competición internacional', tier: 'legend' },
    { game: 'Clubes Pro', title: 'Once de la Semana', detail: 'VPG Zero Masters T3 y T8', tier: 'silver' },
    { game: 'Clubes Pro', title: 'Gol de la Semana', detail: 'Impact Game VPG · 3º puesto', tier: 'silver' }
  ],

  packages: [
    {
      id: 'bronze',
      name: 'Kitsune Bronze',
      price: 'Desde 150 €/mes',
      tagline: 'Presencia digital constante',
      features: [
        'Logo en web LyokFox (página Sponsor)',
        'Mención en 2 posts X / mes',
        'Enlace en footer y dossier PDF',
        'Badge “Partner” en Comunidad'
      ],
      cta: 'Solicitar dossier',
      highlight: false
    },
    {
      id: 'silver',
      name: 'Kitsune Silver',
      price: 'Desde 400 €/mes',
      tagline: 'Matchday + redes',
      features: [
        'Todo Bronze +',
        'Overlay stream / panel matchday',
        'Logo en gráfica resultado jornada',
        '4 posts + 1 hilo X / mes',
        'Código promo KP para tu audiencia'
      ],
      cta: 'Reservar franja',
      highlight: false
    },
    {
      id: 'gold',
      name: 'Kitsune Gold',
      price: 'Desde 900 €/mes',
      tagline: 'Copatrocinio visible',
      features: [
        'Todo Silver +',
        'Naming “Powered by [marca]” en segmento',
        'Presencia en camiseta / asset digital',
        'Activación sorteo Comunidad',
        'Report mensual de impacto'
      ],
      cta: 'Hablar con el club',
      highlight: true
    },
    {
      id: 'legend',
      name: 'Kitsune Legend',
      price: 'A medida',
      tagline: 'Main partner categoría',
      features: [
        'Exclusividad por vertical (gaming, energy, tech…)',
        'Title sponsor torneo interno o liga',
        'Contenido co-branded + entrevistas',
        'Presencia eventos y merch conjunto',
        'Roadmap anual y renovación preferente'
      ],
      cta: 'Propuesta personalizada',
      highlight: false
    }
  ],

  deliverables: [
    { icon: '🖥️', title: 'Web & streaming', items: ['Banner web', 'Overlay OBS', 'Lower-thirds matchday', 'Página landing co-brand'] },
    { icon: '𝕏', title: 'Redes oficiales', items: ['@LyokFox_', '@lyokfox IG', '@Lyokfox_Fans', 'Hilos matchday'] },
    { icon: '👕', title: 'Merch & digital', items: ['Mockups camiseta', 'Assets para tu marketing', 'Códigos promo KP'] },
    { icon: '🎮', title: 'Comunidad', items: ['2.800+ miembros KP', 'Predicciones matchday', 'Sorteos marca', 'Misiones branded'] }
  ],

  audience: [
    { pct: '68%', label: '18–34 años', desc: 'Core gaming mobile y FC' },
    { pct: '82%', label: 'España + LATAM', desc: 'Audiencia hispanohablante' },
    { pct: '3', label: 'Disciplinas', desc: 'Brawl · Clash · Clubes Pro' },
    { pct: '24/7', label: 'Contenido', desc: 'Noticias, clips y comunidad' }
  ],

  process: [
    { step: '01', title: 'Primer contacto', desc: 'Cuéntanos objetivo, presupuesto y sector. Respondemos en 48 h.' },
    { step: '02', title: 'Dossier & llamada', desc: 'Te enviamos media kit, métricas y propuesta de paquete.' },
    { step: '03', title: 'Activación', desc: 'Firmamos, integramos assets y lanzamos en el próximo matchday.' },
    { step: '04', title: 'Reporting', desc: 'Informe de impacto y opciones de renovación o upgrade.' }
  ],

  partners: [
    { type: 'league', key: 'vpg', name: 'VPG', sub: 'SPAIN', desc: 'Zero Masters · Superliga · Europa League' },
    { type: 'league', key: 'plg', name: 'PLG', sub: 'SPAIN', desc: '1ª División · Copa Camada' },
    { type: 'league', key: 'vfo', name: 'VFO', sub: 'SPAIN', desc: 'Liga Nacional · Playoffs' },
    { type: 'league', key: 'impact', name: 'IMPACT', sub: 'GAME', desc: 'VPG highlights · Gol de la Semana' },
    { type: 'partner', key: 'alphaWolfs', name: 'ALPHA', sub: 'WOLFS', desc: 'Partner histórico camada' },
    { type: 'partner', key: 'supercell', name: 'SUPERCELL', sub: 'ESPORTS', desc: 'Ecosistema Brawl Stars' },
    { type: 'social', key: 'fans', name: 'LYOKFOX', sub: 'FANS', desc: 'Comunidad Indomables' }
  ],

  quote: {
    text: 'Patrocinar LyokFox no es pegar un logo: es entrar en matchdays reales, con afición que responde y palmarés que respalda la inversión.',
    author: 'Dirección LyokFox Esports',
    role: 'Dossier comercial 2025–26'
  }
};
