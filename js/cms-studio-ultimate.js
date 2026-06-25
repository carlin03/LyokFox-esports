/* LyokFox Studio ULTIMATE — edición 100% de toda la web */
(function () {
  'use strict';
  if (typeof window.CMS === 'undefined') return;
  var C = window.CMS;

  var ULT_NAV = [];

  function val(id) { var el = document.getElementById(id); return el ? String(el.value).trim() : ''; }
  function chk(id) { var el = document.getElementById(id); return el ? el.checked : false; }
  function linesToArr(t) { return t ? t.split('\n').map(function (s) { return s.trim(); }).filter(Boolean) : []; }
  function arrToLines(a) { return (a || []).join('\n'); }

  function head(t, d) {
    return '<header class="cms-studio-section-head cms-studio-section-head--easy"><h2>' + t + '</h2>' +
      (d ? '<p>' + d + '</p>' : '') + '</header>';
  }
  function card(t, body, open) {
    return '<details class="cms-studio-card cms-studio-card--easy"' + (open ? ' open' : '') + '><summary>' + t +
      '</summary><div class="cms-studio-card-body">' + body + '</div></details>';
  }

  function getShell(key) {
    var o = C.load().pageShells || {};
    return o[key] || {};
  }
  function getComm() { return (typeof COMMUNITY !== 'undefined') ? COMMUNITY : {}; }
  function getSp() { return (typeof SPONSOR !== 'undefined') ? SPONSOR : {}; }

  function renderMap() {
    return head('Mapa 100% LyokFox Studio', 'Todo lo editable en la web. Pulsa una tarjeta para ir al editor.') +
      C.helpBox('Cómo usar', 'Edita → 💾 Guardar todo. Cada sección indica dónde aparece en la web.', 'info') +
      '<div class="cms-task-grid cms-task-grid--hero">' +
        C.taskCard('📜', 'Historia · 10 capítulos', 'Capítulos + hitos cronología', 'historia-completa') +
        C.taskCard('👥', '43 Jugadores', 'Plantillas Brawl · CR · FC26', 'players') +
        C.taskCard('✨', 'Portada Inicio', 'Banner, stats, tarjetas', 'home') +
        C.taskCard('👥', 'Equipos', 'Divisiones, chips, staff', 'ult-equipos') +
        C.taskCard('🎮', 'Comunidad UI', 'Hero y pestañas', 'ult-comunidad-ui') +
        C.taskCard('📰', 'Noticias UI', 'Hero premium y botones', 'ult-noticias-ui') +
        C.taskCard('🪪', 'Mi cuenta', 'Textos página cuenta', 'ult-cuenta-ui') +
        C.taskCard('✉️', 'Contacto', 'Formulario, tags, CTA', 'ult-contacto-ui') +
        C.taskCard('💼', 'Sponsor+', 'Impacto, partners, proceso', 'ult-sponsor-plus') +
        C.taskCard('🛒', 'Tienda cats', 'Categorías, tiers', 'ult-com-shop') +
        C.taskCard('🕹️', 'Minijuegos', 'Arcade, ruleta, retos', 'ult-com-games') +
        C.taskCard('🔗', 'Layout global', 'Loader, footer', 'ult-layout') +
        C.taskCard('📖', 'Guía fácil', 'Para empezar', 'guide') +
      '</div>';
  }

  function renderEquiposPage() {
    var s = getShell('equipos');
    var div = s.divisions || {};
    var br = div.brawl || {};
    var cl = div.clash || {};
    var ea = div.eafc || {};
    return head('Página Equipos — 100%', 'Hero, chips, stats, divisiones Brawl/Clash/FC26, staff y CTA.') +
      card('Hero equipos', C.fieldEasy('Eyebrow', 'ult-eq-eyebrow', s.eyebrow || 'Plantillas oficiales', { where: 'Arriba del título' }) +
        C.fieldEasy('Chip 1', 'ult-eq-chip0', (s.chips && s.chips[0]) || 'Brawl Stars · 3v3') +
        C.fieldEasy('Chip 2', 'ult-eq-chip1', (s.chips && s.chips[1]) || 'Clash Royale') +
        C.fieldEasy('Chip 3', 'ult-eq-chip2', (s.chips && s.chips[2]) || 'Clubes Pro · 25'), true) +
      card('Stats strip', [0, 1, 2, 3].map(function (i) {
        var st = (s.stats && s.stats[i]) || {};
        var defs = [{ v: '3', l: 'Equipos activos' }, { v: '8', l: 'Brawl Stars' }, { v: '10', l: 'Clash Royale' }, { v: '25', l: 'Clubes Pro' }];
        return C.fieldEasy('Número ' + (i + 1), 'ult-eq-stat-v-' + i, st.value || defs[i].v) +
          C.fieldEasy('Etiqueta ' + (i + 1), 'ult-eq-stat-l-' + i, st.label || defs[i].l);
      }).join(''), false) +
      card('División Brawl Stars', C.fieldEasy('Badge', 'ult-eq-brawl-flag', br.flag || 'Equipo principal') +
        C.fieldEasy('Título', 'ult-eq-brawl-title', br.title || 'Brawl Stars') +
        C.fieldEasy('Subtítulo', 'ult-eq-brawl-sub', br.sub || 'Competitivo 3v3 · Ranked · Scrims · Torneos', { full: true }) +
        C.textareaEasy('Modos (uno por línea)', 'ult-eq-brawl-modes', arrToLines(br.modes || ['Gem Grab', 'Bounty', 'Heist', 'Knockout', 'Hot Zone', 'Ranked 3v3']), { rows: 3 }) +
        C.fieldEasy('Badge jugadores', 'ult-eq-brawl-players', br.playersBadge || '6 jugadores') +
        C.fieldEasy('Badge capitanes', 'ult-eq-brawl-caps', br.captainsBadge || '2 capitanes'), true) +
      card('División Clash Royale', C.fieldEasy('Título', 'ult-eq-clash-title', cl.title || 'Clash Royale') +
        C.fieldEasy('Subtítulo', 'ult-eq-clash-sub', cl.sub || 'División competitiva · Ladder y CW') +
        C.fieldEasy('Jugadores', 'ult-eq-clash-players', cl.playersBadge || '8 jugadores') +
        C.fieldEasy('Capitanes', 'ult-eq-clash-caps', cl.captainsBadge || '2 capitanes'), false) +
      card('División Clubes Pro', C.fieldEasy('Título', 'ult-eq-eafc-title', ea.title || 'EAFC / FC26 · Clubes Pro') +
        C.fieldEasy('Subtítulo', 'ult-eq-eafc-sub', ea.sub || 'Plantilla oficial · Tres ligas') +
        C.fieldEasy('Jugadores', 'ult-eq-eafc-players', ea.playersBadge || '25 jugadores') +
        C.textareaEasy('Ligas (una por línea)', 'ult-eq-eafc-leagues', arrToLines(ea.leagues || ['VPG Spain', 'PLG Spain', 'VFO Spain']), { rows: 2 }), false) +
      card('Staff & CTA final', C.textareaEasy('Staff (uno por línea)', 'ult-eq-staff', arrToLines(s.staff || ['MicifuzGT · Diseño', 'Brawl Stars · LyokFox', 'Comunidad Vamos LyokFox', '7700+ seguidores · @LyokFox_']), { rows: 4 }) +
        C.fieldEasy('CTA título', 'ult-eq-cta-title', (s.cta && s.cta.title) || 'Apoya al club y gana premios') +
        C.textareaEasy('CTA texto', 'ult-eq-cta-text', (s.cta && s.cta.text) || 'Predice partidos, juega minijuegos y canjea camisetas en la Zona Comunidad.', { rows: 2 }), false);
  }

  function renderComunidadUI() {
    var s = getShell('comunidad');
    var tabs = s.tabs || ['Redes +KP', 'Tienda', 'Juegos', 'Predicciones', 'Misiones', 'Ranking'];
    return head('Página Comunidad — hero y UI', 'Mismo patrón que Noticias/Sponsor: hero + barra de pestañas.') +
      card('Hero comunidad', C.fieldEasy('Eyebrow', 'ult-comm-eyebrow', s.eyebrow || 'Zona camada', { where: 'Arriba del título en el banner' }) +
        C.fieldEasy('Título H1 (puedes usar <em>)', 'ult-comm-title', s.title || 'Comunidad Kitsune', { full: true, where: 'Título principal del hero' }) +
        C.textareaEasy('Descripción hero', 'ult-comm-lead', s.lead || 'Gana KP en redes, minijuegos, predicciones y lectura de noticias.', { rows: 3, full: true }) +
        C.fieldEasy('Botón principal', 'ult-comm-hero-btn1', s.heroBtn1 || 'Ir a la tienda') +
        C.fieldEasy('Botón secundario', 'ult-comm-hero-btn2', s.heroBtn2 || 'Noticias +10 KP'), true) +
      card('Barra pestañas', tabs.map(function (t, i) {
        return C.fieldEasy('Pestaña ' + (i + 1), 'ult-comm-tab-' + i, t);
      }).join('') +
        C.fieldEasy('Pie redes — acciones', 'ult-comm-foot-actions', s.footerActionsLabel || 'Acciones totales:', { hint: 'Antes del número' }) +
        C.fieldEasy('Pie redes — KP', 'ult-comm-foot-kp', s.footerKpLabel || 'KP en redes:', { hint: 'Antes del total KP' }), false);
  }

  function renderNoticiasUI() {
    var s = getShell('noticias');
    return head('Página Noticias — textos UI', 'Hero estilo Sponsor (mismo patrón que Patrocinio).') +
      C.fieldEasy('Eyebrow', 'ult-news-eyebrow', s.eyebrow || 'LyokFox News') +
      C.fieldEasy('Título principal (puedes usar <em>)', 'ult-news-title', s.title || 'Noticias oficiales', { full: true }) +
      C.textareaEasy('Descripción hero', 'ult-news-lead', s.lead || 'Matchday, fichajes, palmarés y novedades del club. Lee cada artículo y suma KP en la Zona Comunidad.', { rows: 3, full: true, hint: 'Puedes usar <strong> para resaltar KP' }) +
      C.fieldEasy('Botón KP principal', 'ult-news-kp-btn', s.kpBtn || '+10 KP por leer') +
      C.fieldEasy('Botón secundario', 'ult-news-side-kp-btn', s.sideKpBtn || s.kpBtnSecondary || 'Canjear KP') +
      C.fieldEasy('Placeholder búsqueda', 'ult-news-search', s.searchPlaceholder || 'Buscar noticia…') +
      C.fieldEasy('Label breaking', 'ult-news-breaking-label', s.breakingLabel || 'Última hora');
  }

  function renderCuentaUI() {
    var s = getShell('cuenta');
    return head('Página Mi cuenta — textos', 'Hero, pestañas y etiquetas de formulario.') +
      C.fieldEasy('Eyebrow', 'ult-cuenta-eyebrow', s.eyebrow || 'Mi camada') +
      C.fieldEasy('Subtítulo hero', 'ult-cuenta-sub', s.sub || 'Crea tu perfil, conecta redes y gestiona tus Kitsune Points.') +
      ['Perfil', 'Redes & X', 'Kitsune Points', 'Datos'].map(function (t, i) {
        return C.fieldEasy('Pestaña ' + (i + 1), 'ult-cuenta-tab-' + i, (s.tabs && s.tabs[i]) || t);
      }).join('') +
      card('Formulario perfil', C.fieldEasy('Label apodo', 'ult-cuenta-lbl-nick', s.lblNickname || 'Apodo camada (obligatorio)') +
        C.fieldEasy('Label bio', 'ult-cuenta-lbl-bio', s.lblBio || 'Bio') +
        C.fieldEasy('Botón guardar', 'ult-cuenta-btn-save', s.btnSave || 'Guardar perfil'), false);
  }

  function renderContactoUI() {
    var s = getShell('contacto');
    var cta = s.cta || {};
    return head('Página Contacto — 100%', 'Info, tags, formulario y CTA inferior.') +
      C.fieldEasy('Título sección info', 'ult-con-info-title', s.infoTitle || 'Redes & contacto', { hint: 'Solo texto normal' }) +
      C.textareaEasy('Tags (uno por línea)', 'ult-con-tags', arrToLines(s.tags || ['Pruebas abiertas', 'Fichajes', 'Patrocinio', 'Prensa']), { rows: 4 }) +
      C.textareaEasy('Opciones asunto formulario (una por línea)', 'ult-con-subjects', arrToLines(s.subjects || ['Patrocinio', 'Prueba de jugador', 'Fichaje', 'Clash Royale', 'Clubes Pro', 'Prensa', 'Premio comunidad', 'Otro']), { rows: 6 }) +
      C.fieldEasy('Botón enviar', 'ult-con-submit', s.submitBtn || 'Enviar mensaje') +
      card('CTA inferior', C.fieldEasy('Título CTA', 'ult-con-cta-title', cta.title || '¿Buscas premios?') +
        C.textareaEasy('Texto CTA', 'ult-con-cta-text', cta.text || 'Canjea camisetas y merch en la Zona Comunidad.', { rows: 2 }) +
        C.fieldEasy('Botón comunidad', 'ult-con-cta-btn1', cta.btn1 || 'Zona Comunidad') +
        C.fieldEasy('Botón equipos', 'ult-con-cta-btn2', cta.btn2 || 'Ver equipos'), false);
  }

  function renderInicioExtra() {
    var s = getShell('inicio');
    return head('Inicio — extras avanzados', 'Marcas, cabeceras de sección y botones KP.') +
      C.fieldEasy('Label strip marcas', 'ult-in-brands-label', s.brandsLabel || 'Disciplinas oficiales') +
      C.textareaEasy('Labels marcas (Brawl | Clash | EAFC, uno por línea)', 'ult-in-brand-labels', arrToLines(s.brandLabels || ['Brawl Stars', 'Clash Royale', 'EA Sports FC 26']), { rows: 3 }) +
      C.fieldEasy('KP section eyebrow', 'ult-in-kp-eyebrow', s.kpEyebrow || 'Kitsune Points') +
      C.fieldEasy('Botón KP principal', 'ult-in-kp-btn1', s.kpBtn1 || 'Ir a Comunidad') +
      C.fieldEasy('Botón KP secundario', 'ult-in-kp-btn2', s.kpBtn2 || 'Ver tienda KP') +
      C.fieldEasy('Disciplinas · eyebrow', 'ult-in-games-eyebrow', s.gamesEyebrow || 'Disciplinas') +
      C.fieldEasy('Disciplinas · título', 'ult-in-games-title', s.gamesTitle || 'Tres <em>frentes</em> de batalla') +
      C.textareaEasy('Disciplinas · subtítulo', 'ult-in-games-sub', s.gamesSub || '', { rows: 2 }) +
      C.fieldEasy('Noticias teaser · eyebrow', 'ult-in-news-eyebrow', s.newsEyebrow || 'Actualidad') +
      C.fieldEasy('Noticias teaser · título', 'ult-in-news-title', s.newsTitle || 'Últimas <em>noticias</em>') +
      C.textareaEasy('Noticias teaser · subtítulo', 'ult-in-news-sub', s.newsSub || '', { rows: 2 }) +
      C.fieldEasy('Noticias teaser · botón', 'ult-in-news-btn', s.newsBtn || 'Ver todas las noticias →') +
      C.fieldEasy('Matchday · eyebrow', 'ult-in-match-eyebrow', s.matchEyebrow || 'Matchday') +
      C.fieldEasy('Matchday · título', 'ult-in-match-title', s.matchTitle || 'Próximos <em>partidos</em>');
  }

  function renderSponsorPlus() {
    var sp = getSp();
    var sec = C.load().sponsorSections || {};
    var html = head('Sponsor — contenido completo', 'Impacto, entregables, audiencia, proceso y partners.') +
      card('Títulos de secciones', C.fieldEasy('Why join', 'ult-sp-sec-why', sec.why || 'Por qué LyokFox') +
        C.fieldEasy('Impacto', 'ult-sp-sec-impact', sec.impact || 'Impacto medible') +
        C.fieldEasy('Palmarés', 'ult-sp-sec-ach', sec.achievements || 'Palmarés') +
        C.fieldEasy('Paquetes', 'ult-sp-sec-pkg', sec.packages || 'Paquetes') +
        C.fieldEasy('Entregables', 'ult-sp-sec-del', sec.deliverables || 'Qué incluye') +
        C.fieldEasy('Audiencia', 'ult-sp-sec-aud', sec.audience || 'Audiencia') +
        C.fieldEasy('Proceso', 'ult-sp-sec-proc', sec.process || 'Cómo empezar'), true);

    (sp.impactStats || []).forEach(function (st, i) {
      html += card('Stat impacto ' + (i + 1), C.fieldEasy('Valor', 'ult-sp-imp-v-' + i, st.value) +
        C.fieldEasy('Sufijo', 'ult-sp-imp-suf-' + i, st.suffix || '') +
        C.fieldEasy('Etiqueta', 'ult-sp-imp-l-' + i, st.label || '') +
        C.textareaEasy('Descripción', 'ult-sp-imp-d-' + i, st.desc || '', { rows: 2 }), i === 0);
    });

    (sp.deliverables || []).forEach(function (d, i) {
      html += card('Entregable ' + (i + 1), C.fieldEasy('Icono', 'ult-sp-del-i-' + i, d.icon || '') +
        C.fieldEasy('Título', 'ult-sp-del-t-' + i, d.title || '') +
        C.textareaEasy('Items (uno por línea)', 'ult-sp-del-items-' + i, arrToLines(d.items), { rows: 4 }), false);
    });

    (sp.audience || []).forEach(function (a, i) {
      html += card('Audiencia ' + (i + 1), C.fieldEasy('%', 'ult-sp-aud-p-' + i, a.pct || '') +
        C.fieldEasy('Etiqueta', 'ult-sp-aud-l-' + i, a.label || '') +
        C.fieldEasy('Desc', 'ult-sp-aud-d-' + i, a.desc || ''), false);
    });

    (sp.process || []).forEach(function (p, i) {
      html += card('Paso ' + (i + 1), C.fieldEasy('Número', 'ult-sp-proc-s-' + i, p.step || '') +
        C.fieldEasy('Título', 'ult-sp-proc-t-' + i, p.title || '') +
        C.textareaEasy('Descripción', 'ult-sp-proc-d-' + i, p.desc || '', { rows: 2 }), i === 0);
    });

    html += card('Partners grid (formato: tipo | key | name | sub | desc)', C.textareaEasy('Partners', 'ult-sp-partners', (sp.partners || []).map(function (p) {
      return (p.type || '') + ' | ' + (p.key || '') + ' | ' + (p.name || '') + ' | ' + (p.sub || '') + ' | ' + (p.desc || '');
    }).join('\n'), { rows: 8 }), false);

    return html;
  }

  function listCrud(opts) {
    var items = opts.items || [];
    var sel = items.map(function (it, i) {
      return '<option value="' + i + '">' + (it[opts.labelKey] || it.label || it.name || it.title || it.code || ('Item ' + (i + 1))).toString().slice(0, 50) + '</option>';
    }).join('');
    var fields = '';
    (opts.fields || []).forEach(function (f) {
      var v = items[0] ? items[0][f.key] : '';
      if (f.type === 'textarea') fields += C.textareaEasy(f.label, 'cms-' + opts.prefix + '-' + f.key, v || '', { rows: f.rows || 2 });
      else if (f.type === 'number') fields += C.fieldEasy(f.label, 'cms-' + opts.prefix + '-' + f.key, v || 0, { type: 'number' });
      else fields += C.fieldEasy(f.label, 'cms-' + opts.prefix + '-' + f.key, v || '');
    });
    return head(opts.title, opts.desc || '') +
      '<div class="cms-studio-toolbar">' +
        '<label class="cms-field cms-field-grow"><span>' + (opts.itemLabel || 'Elemento') + '</span><select id="cms-' + opts.prefix + '-index">' + sel + '</select></label>' +
        '<button type="button" class="btn btn-glass btn-sm" id="cms-' + opts.prefix + '-add">+ Añadir</button>' +
        '<button type="button" class="btn btn-glass btn-sm cms-danger" id="cms-' + opts.prefix + '-del">Eliminar</button>' +
      '</div><div class="cms-list-count">' + items.length + ' elementos</div>' +
      '<div id="cms-' + opts.prefix + '-form">' + fields + '</div>';
  }

  var SHOP_CAT_FIELDS = [{ key: 'id', label: 'ID' }, { key: 'label', label: 'Nombre' }, { key: 'icon', label: 'Icono emoji' }];
  var SHOP_TIER_FIELDS = [{ key: 'id', label: 'ID' }, { key: 'label', label: 'Nombre' }, { key: 'range', label: 'Rango KP' }, { key: 'color', label: 'Color hex' }];
  var ARCADE_FIELDS = [{ key: 'id', label: 'ID' }, { key: 'icon', label: 'Icono' }, { key: 'name', label: 'Nombre' }, { key: 'maxKp', label: 'KP máx', type: 'number' }, { key: 'limit', label: 'Límite' }, { key: 'rule', label: 'Regla', type: 'textarea', rows: 2 }];
  var POLL_FIELDS = [{ key: 'question', label: 'Pregunta' }, { key: 'optionA', label: 'Opción A' }, { key: 'optionB', label: 'Opción B' }, { key: 'optionC', label: 'Opción C' }, { key: 'reward', label: 'KP recompensa', type: 'number' }];
  var EARN_FIELDS = [{ key: 'icon', label: 'Icono' }, { key: 'title', label: 'Título' }, { key: 'desc', label: 'Descripción', type: 'textarea', rows: 2 }, { key: 'kp', label: 'KP texto' }];
  var QUOTE_FIELDS = [{ key: 'nick', label: 'Nick' }, { key: 'text', label: 'Cita', type: 'textarea', rows: 2 }, { key: 'avatar', label: 'Avatar emoji' }];
  var MILESTONE_FIELDS = [{ key: 'year', label: 'Año' }, { key: 'title', label: 'Título' }, { key: 'desc', label: 'Descripción', type: 'textarea', rows: 2 }, { key: 'icon', label: 'Icono' }];
  var CHALLENGE_FIELDS = [{ key: 'id', label: 'ID' }, { key: 'text', label: 'Texto reto' }, { key: 'reward', label: 'KP', type: 'number' }];
  var SPIN_FIELDS = [{ key: 'label', label: 'Etiqueta' }, { key: 'value', label: 'Valor KP', type: 'number' }, { key: 'color', label: 'Color' }];

  function renderComShop() {
    var c = getComm();
    return listCrud({ title: 'Categorías tienda', prefix: 'shopcat', labelKey: 'label', itemLabel: 'Categoría', items: c.shopCategories || [], fields: SHOP_CAT_FIELDS }) +
      listCrud({ title: 'Tiers tienda', prefix: 'shoptier', labelKey: 'label', itemLabel: 'Tier', items: c.shopTiers || [], fields: SHOP_TIER_FIELDS }) +
      card('Canjes recientes (nick | item | ago)', C.textareaEasy('Canjes', 'ult-shop-redeems', (c.shopRecentRedeems || []).map(function (r) {
        return r.nick + ' | ' + r.item + ' | ' + r.ago;
      }).join('\n'), { rows: 6 })) +
      C.fieldEasy('IDs destacados tienda (coma)', 'ult-shop-featured', (c.shopFeatured || []).join(', '));
  }

  function renderComGames() {
    var c = getComm();
    return listCrud({ title: 'Minijuegos arcade', prefix: 'arcade', labelKey: 'name', itemLabel: 'Juego', items: c.arcadeGames || [], fields: ARCADE_FIELDS }) +
      listCrud({ title: 'Segmentos ruleta', prefix: 'spin', labelKey: 'label', itemLabel: 'Segmento', items: c.spinSegments || [], fields: SPIN_FIELDS }) +
      listCrud({ title: 'Retos diarios', prefix: 'dch', labelKey: 'text', itemLabel: 'Reto', items: c.dailyChallenges || [], fields: CHALLENGE_FIELDS }) +
      listCrud({ title: 'Objetivos semanales', prefix: 'wgoal', labelKey: 'label', itemLabel: 'Objetivo', items: c.weeklyGoals || [], fields: [
        { key: 'id', label: 'ID' }, { key: 'label', label: 'Texto' }, { key: 'icon', label: 'Icono' },
        { key: 'target', label: 'Meta', type: 'number' }, { key: 'reward', label: 'KP', type: 'number' }
      ] }) +
      card('Anagramas (palabra | pista, uno por línea)', C.textareaEasy('Anagramas', 'ult-word-scramble', (c.wordScramble || []).map(function (w) {
        return w.word + ' | ' + w.hint;
      }).join('\n'), { rows: 6 })) +
      card('Bonus diario', C.fieldEasy('Base KP', 'ult-daily-base', (c.dailyLogin && c.dailyLogin.base) || 25, { type: 'number' }) +
        C.fieldEasy('Bonus racha', 'ult-daily-streak', (c.dailyLogin && c.dailyLogin.streakBonus) || 8, { type: 'number' }) +
        C.fieldEasy('Tope racha', 'ult-daily-cap', (c.dailyLogin && c.dailyLogin.streakCap) || 80, { type: 'number' }));
  }

  function renderComPolls() {
    var c = getComm();
    var polls = [
      { key: 'poll', label: 'Encuesta 1', data: c.poll || {} },
      { key: 'poll2', label: 'Encuesta 2', data: c.poll2 || {} },
      { key: 'poll3', label: 'Encuesta 3', data: c.poll3 || {} }
    ];
    return head('Encuestas Comunidad', 'Las 3 encuestas activas en la Zona Comunidad.') +
      polls.map(function (p, i) {
        var d = p.data;
        return card(p.label, C.fieldEasy('Pregunta', 'ult-poll-' + i + '-q', d.question || '') +
          C.fieldEasy('Opción A', 'ult-poll-' + i + '-a', (d.options && d.options[0]) || d.optionA || '') +
          C.fieldEasy('Opción B', 'ult-poll-' + i + '-b', (d.options && d.options[1]) || d.optionB || '') +
          C.fieldEasy('Opción C', 'ult-poll-' + i + '-c', (d.options && d.options[2]) || d.optionC || '') +
          C.fieldEasy('KP al votar', 'ult-poll-' + i + '-rw', d.reward || 40, { type: 'number' }), i === 0);
      }).join('');
  }

  function renderComSocialPlus() {
    var c = getComm();
    var ig = c.instagramRewards || {};
    var fans = c.fansRewards || {};
    return head('Recompensas Instagram & Fans', 'KP por Like, comentario, etc.') +
      card('Instagram', C.fieldEasy('Like', 'ult-ig-like', ig.perLike || 25, { type: 'number' }) +
        C.fieldEasy('Comentario', 'ult-ig-comment', ig.perComment || 40, { type: 'number' }) +
        C.fieldEasy('Guardar', 'ult-ig-save', ig.perSave || 30, { type: 'number' }) +
        C.fieldEasy('Bonus post completo', 'ult-ig-bonus', ig.fullPostBonus || 30, { type: 'number' }), true) +
      card('@Lyokfox_Fans', C.fieldEasy('Like', 'ult-fans-like', fans.perLike || 15, { type: 'number' }) +
        C.fieldEasy('RT', 'ult-fans-rt', fans.perRt || 25, { type: 'number' }) +
        C.fieldEasy('Comentario', 'ult-fans-comment', fans.perComment || 30, { type: 'number' }) +
        C.fieldEasy('Combo bonus', 'ult-fans-combo', fans.comboBonus || 20, { type: 'number' }), false);
  }

  function renderComMisc() {
    var c = getComm();
    return listCrud({ title: 'Formas de ganar KP', prefix: 'earn', labelKey: 'title', itemLabel: 'Método', items: c.earnMethods || [], fields: EARN_FIELDS }) +
      listCrud({ title: 'Citas fans', prefix: 'fquote', labelKey: 'nick', itemLabel: 'Cita', items: c.fanQuotes || [], fields: QUOTE_FIELDS }) +
      listCrud({ title: 'Hitos club (milestones)', prefix: 'cmile', labelKey: 'title', itemLabel: 'Hito', items: c.clubMilestones || [], fields: MILESTONE_FIELDS }) +
      card('Ranking seed (nick | kp | level, uno por línea)', C.textareaEasy('Leaderboard', 'ult-leaderboard', (c.leaderboardSeed || []).map(function (r) {
        return (r.nick || r.name || '') + ' | ' + (r.kp || r.points || 0) + ' | ' + (r.level || '');
      }).join('\n'), { rows: 8 }));
  }

  function renderLayout() {
    var lay = C.load().layout || {};
    var site = C.load().site || {};
    return head('Cabecera · Footer · Loader', 'Textos globales en todas las páginas.') +
      C.fieldEasy('Texto loader', 'ult-lay-loader', lay.loaderText || 'LYOKFOX', { where: 'Pantalla de carga inicial' }) +
      C.fieldEasy('Badge ticker EN VIVO', 'ult-lay-live-badge', lay.liveBadge || 'EN VIVO') +
      C.fieldEasy('Copyright footer', 'ult-lay-copy', lay.footerCopy || '© 2020–2025 LyokFox Esports · Est. 2020') +
      C.fieldEasy('Texto perfil en cabecera — nota X', 'ult-lay-profile-note', lay.profileNote || 'Pronto podrás vincular X. Mientras: reclama KP en posts.') +
      C.fieldEasy('Año copyright fin', 'ult-lay-year', site.copyrightYear || '2025', { type: 'number' });
  }

  function renderSitePlus() {
    var site = C.load().site || {};
    var teams = site.teams || (typeof SITE !== 'undefined' ? SITE.teams : {});
    return head('Config global SITE', 'Equipos, collective, redes labels y más.') +
      C.fieldEasy('Collective (camada)', 'ult-site-collective', site.collective || 'camada') +
      C.fieldEasy('Collective label', 'ult-site-coll-label', site.collectiveLabel || 'La camada kitsune') +
      C.fieldEasy('KP tagline largo', 'ult-site-pt-tagline', (site.points && site.points.tagline) || '') +
      card('Labels redes', C.fieldEasy('Twitter', 'ult-soc-lbl-tw', (site.socialLabels && site.socialLabels.twitter) || 'Twitter / X') +
        C.fieldEasy('Instagram', 'ult-soc-lbl-ig', (site.socialLabels && site.socialLabels.instagram) || 'Instagram') +
        C.fieldEasy('Fans', 'ult-soc-lbl-fans', (site.socialLabels && site.socialLabels.fans) || '@Lyokfox_Fans'), true) +
      card('Equipos del club', ['brawlStars', 'clashRoyale', 'clubesPro'].map(function (k) {
        var t = teams[k] || {};
        return C.fieldEasy(k + ' label', 'ult-team-' + k + '-label', t.label || '') +
          C.fieldEasy(k + ' tag', 'ult-team-' + k + '-tag', t.tag || '') +
          C.fieldEasy(k + ' players', 'ult-team-' + k + '-players', t.players || '', { type: 'number' });
      }).join(''), false);
  }

  var RENDERERS = {
    'ult-map': renderMap,
    'ult-equipos': renderEquiposPage,
    'ult-comunidad-ui': renderComunidadUI,
    'ult-noticias-ui': renderNoticiasUI,
    'ult-cuenta-ui': renderCuentaUI,
    'ult-contacto-ui': renderContactoUI,
    'ult-inicio-extra': renderInicioExtra,
    'ult-sponsor-plus': renderSponsorPlus,
    'ult-com-shop': renderComShop,
    'ult-com-games': renderComGames,
    'ult-com-polls': renderComPolls,
    'ult-com-social-plus': renderComSocialPlus,
    'ult-com-misc': renderComMisc,
    'ult-layout': renderLayout,
    'ult-site-plus': renderSitePlus
  };

  function fillList(prefix, item, fields) {
    fields.forEach(function (f) {
      var el = document.getElementById('cms-' + prefix + '-' + f.key);
      if (!el) return;
      el.value = item[f.key] !== undefined && item[f.key] !== null ? item[f.key] : '';
    });
  }

  function readList(prefix, fields, base) {
    var item = JSON.parse(JSON.stringify(base || {}));
    fields.forEach(function (f) {
      var el = document.getElementById('cms-' + prefix + '-' + f.key);
      if (!el) return;
      item[f.key] = f.type === 'number' ? (+el.value || 0) : el.value.trim();
    });
    return item;
  }

  function bindListCrud(prefix, fields, key, makeNew) {
    var idxEl = document.getElementById('cms-' + prefix + '-index');
    if (!idxEl) return;
    function items() { return (getComm()[key] || []); }
    function refresh() {
      var idx = +idxEl.value || 0;
      fillList(prefix, items()[idx] || {}, fields);
    }
    idxEl.onchange = refresh;
    refresh();
    var addBtn = document.getElementById('cms-' + prefix + '-add');
    if (addBtn) addBtn.onclick = function () {
      var o = C.load();
      o.community = o.community || {};
      o.community[key] = JSON.parse(JSON.stringify(getComm()[key] || []));
      o.community[key].push(makeNew ? makeNew() : { id: prefix + '-' + Date.now(), label: 'Nuevo' });
      C.save(o); C.apply();
      if (window.CMSStudio && window.CMSStudio.goto) window.CMSStudio.goto(window.CMSStudio.activeSection);
    };
    var delBtn = document.getElementById('cms-' + prefix + '-del');
    if (delBtn) delBtn.onclick = function () {
      if (!confirm('¿Eliminar?')) return;
      var idx = +idxEl.value || 0;
      var o = C.load();
      o.community = o.community || {};
      o.community[key] = JSON.parse(JSON.stringify(getComm()[key] || []));
      o.community[key].splice(idx, 1);
      C.save(o); C.apply();
      if (window.CMSStudio && window.CMSStudio.goto) window.CMSStudio.goto(window.CMSStudio.activeSection);
    };
  }

  function collectList(prefix, fields, key) {
    if (!document.getElementById('cms-' + prefix + '-index')) return null;
    var idx = +val('cms-' + prefix + '-index') || 0;
    var list = JSON.parse(JSON.stringify(getComm()[key] || []));
    if (list[idx]) list[idx] = readList(prefix, fields, list[idx]);
    return list;
  }

  function collectUltimate(o) {
    o.pageShells = o.pageShells || {};

    if (document.getElementById('ult-eq-eyebrow')) {
      o.pageShells.equipos = {
        eyebrow: val('ult-eq-eyebrow'),
        chips: [val('ult-eq-chip0'), val('ult-eq-chip1'), val('ult-eq-chip2')],
        stats: [0, 1, 2, 3].map(function (i) {
          return { value: val('ult-eq-stat-v-' + i), label: val('ult-eq-stat-l-' + i) };
        }),
        divisions: {
          brawl: {
            flag: val('ult-eq-brawl-flag'), title: val('ult-eq-brawl-title'), sub: val('ult-eq-brawl-sub'),
            modes: linesToArr(val('ult-eq-brawl-modes')), playersBadge: val('ult-eq-brawl-players'), captainsBadge: val('ult-eq-brawl-caps')
          },
          clash: {
            title: val('ult-eq-clash-title'), sub: val('ult-eq-clash-sub'),
            playersBadge: val('ult-eq-clash-players'), captainsBadge: val('ult-eq-clash-caps')
          },
          eafc: {
            title: val('ult-eq-eafc-title'), sub: val('ult-eq-eafc-sub'),
            playersBadge: val('ult-eq-eafc-players'), leagues: linesToArr(val('ult-eq-eafc-leagues'))
          }
        },
        staff: linesToArr(val('ult-eq-staff')),
        cta: { title: val('ult-eq-cta-title'), text: val('ult-eq-cta-text') }
      };
    }

    if (document.getElementById('ult-comm-title')) {
      o.pageShells.comunidad = {
        eyebrow: val('ult-comm-eyebrow'), title: val('ult-comm-title'), lead: val('ult-comm-lead'),
        heroBtn1: val('ult-comm-hero-btn1'), heroBtn2: val('ult-comm-hero-btn2'),
        tabs: [0, 1, 2, 3, 4, 5].map(function (i) { return val('ult-comm-tab-' + i); }),
        footerActionsLabel: val('ult-comm-foot-actions'),
        footerKpLabel: val('ult-comm-foot-kp')
      };
    }

    if (document.getElementById('ult-news-title')) {
      o.pageShells.noticias = {
        eyebrow: val('ult-news-eyebrow'), title: val('ult-news-title'), lead: val('ult-news-lead'),
        kpBtn: val('ult-news-kp-btn'), sideKpBtn: val('ult-news-side-kp-btn'),
        searchPlaceholder: val('ult-news-search'), breakingLabel: val('ult-news-breaking-label')
      };
    }

    if (document.getElementById('ult-cuenta-eyebrow')) {
      o.pageShells.cuenta = {
        eyebrow: val('ult-cuenta-eyebrow'), sub: val('ult-cuenta-sub'),
        tabs: [0, 1, 2, 3].map(function (i) { return val('ult-cuenta-tab-' + i); }),
        lblNickname: val('ult-cuenta-lbl-nick'), lblBio: val('ult-cuenta-lbl-bio'), btnSave: val('ult-cuenta-btn-save')
      };
    }

    if (document.getElementById('ult-con-info-title')) {
      o.pageShells.contacto = {
        infoTitle: val('ult-con-info-title'), tags: linesToArr(val('ult-con-tags')),
        subjects: linesToArr(val('ult-con-subjects')), submitBtn: val('ult-con-submit'),
        cta: { title: val('ult-con-cta-title'), text: val('ult-con-cta-text'), btn1: val('ult-con-cta-btn1'), btn2: val('ult-con-cta-btn2') }
      };
    }

    if (document.getElementById('ult-in-brands-label')) {
      o.pageShells.inicio = {
        brandsLabel: val('ult-in-brands-label'), brandLabels: linesToArr(val('ult-in-brand-labels')),
        kpEyebrow: val('ult-in-kp-eyebrow'), kpBtn1: val('ult-in-kp-btn1'), kpBtn2: val('ult-in-kp-btn2'),
        gamesEyebrow: val('ult-in-games-eyebrow'), gamesTitle: val('ult-in-games-title'), gamesSub: val('ult-in-games-sub'),
        newsEyebrow: val('ult-in-news-eyebrow'), newsTitle: val('ult-in-news-title'), newsSub: val('ult-in-news-sub'),
        newsBtn: val('ult-in-news-btn'), matchEyebrow: val('ult-in-match-eyebrow'), matchTitle: val('ult-in-match-title')
      };
    }

    if (document.getElementById('ult-sp-sec-why')) {
      o.sponsorSections = {
        why: val('ult-sp-sec-why'), impact: val('ult-sp-sec-impact'), achievements: val('ult-sp-sec-ach'),
        packages: val('ult-sp-sec-pkg'), deliverables: val('ult-sp-sec-del'), audience: val('ult-sp-sec-aud'), process: val('ult-sp-sec-proc')
      };
      o.sponsor = o.sponsor || JSON.parse(JSON.stringify(getSp()));
      var imp = [];
      for (var ii = 0; document.getElementById('ult-sp-imp-v-' + ii); ii++) {
        imp.push({ value: val('ult-sp-imp-v-' + ii), suffix: val('ult-sp-imp-suf-' + ii), label: val('ult-sp-imp-l-' + ii), desc: val('ult-sp-imp-d-' + ii) });
      }
      if (imp.length) o.sponsor.impactStats = imp;
      var del = [], aud = [], proc = [];
      for (var di = 0; document.getElementById('ult-sp-del-t-' + di); di++) {
        del.push({ icon: val('ult-sp-del-i-' + di), title: val('ult-sp-del-t-' + di), items: linesToArr(val('ult-sp-del-items-' + di)) });
      }
      for (var ai = 0; document.getElementById('ult-sp-aud-l-' + ai); ai++) {
        aud.push({ pct: val('ult-sp-aud-p-' + ai), label: val('ult-sp-aud-l-' + ai), desc: val('ult-sp-aud-d-' + ai) });
      }
      for (var pi = 0; document.getElementById('ult-sp-proc-t-' + pi); pi++) {
        proc.push({ step: val('ult-sp-proc-s-' + pi), title: val('ult-sp-proc-t-' + pi), desc: val('ult-sp-proc-d-' + pi) });
      }
      if (del.length) o.sponsor.deliverables = del;
      if (aud.length) o.sponsor.audience = aud;
      if (proc.length) o.sponsor.process = proc;
      var plines = linesToArr(val('ult-sp-partners'));
      if (plines.length) {
        o.sponsor.partners = plines.map(function (line) {
          var p = line.split('|');
          return { type: (p[0] || '').trim(), key: (p[1] || '').trim(), name: (p[2] || '').trim(), sub: (p[3] || '').trim(), desc: (p[4] || '').trim() };
        });
      }
    }

    o.community = o.community || {};
    var shopcat = collectList('shopcat', SHOP_CAT_FIELDS, 'shopCategories');
    if (shopcat) o.community.shopCategories = shopcat;
    var shoptier = collectList('shoptier', SHOP_TIER_FIELDS, 'shopTiers');
    if (shoptier) o.community.shopTiers = shoptier;
    if (document.getElementById('ult-shop-redeems')) {
      o.community.shopRecentRedeems = linesToArr(val('ult-shop-redeems')).map(function (line) {
        var p = line.split('|');
        return { nick: (p[0] || '').trim(), item: (p[1] || '').trim(), ago: (p[2] || '').trim() };
      });
    }
    if (document.getElementById('ult-shop-featured')) {
      o.community.shopFeatured = val('ult-shop-featured').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    }

    var arcade = collectList('arcade', ARCADE_FIELDS, 'arcadeGames');
    if (arcade) o.community.arcadeGames = arcade;
    var spin = collectList('spin', SPIN_FIELDS, 'spinSegments');
    if (spin) o.community.spinSegments = spin;
    var dch = collectList('dch', CHALLENGE_FIELDS, 'dailyChallenges');
    if (dch) o.community.dailyChallenges = dch;
    var wgoal = collectList('wgoal', [{ key: 'id', label: '' }, { key: 'label', label: '' }, { key: 'icon', label: '' }, { key: 'target', label: '' }, { key: 'reward', label: '' }], 'weeklyGoals');
    if (wgoal) o.community.weeklyGoals = wgoal;

    if (document.getElementById('ult-word-scramble')) {
      o.community.wordScramble = linesToArr(val('ult-word-scramble')).map(function (line) {
        var p = line.split('|');
        return { word: (p[0] || '').trim(), hint: (p[1] || '').trim() };
      });
    }
    if (document.getElementById('ult-daily-base')) {
      o.community.dailyLogin = { base: +val('ult-daily-base') || 25, streakBonus: +val('ult-daily-streak') || 8, streakCap: +val('ult-daily-cap') || 80 };
    }

    [0, 1, 2].forEach(function (i) {
      if (!document.getElementById('ult-poll-' + i + '-q')) return;
      var poll = {
        question: val('ult-poll-' + i + '-q'),
        options: [val('ult-poll-' + i + '-a'), val('ult-poll-' + i + '-b'), val('ult-poll-' + i + '-c')],
        reward: +val('ult-poll-' + i + '-rw') || 40
      };
      o.community[i === 0 ? 'poll' : 'poll' + (i + 1)] = poll;
    });

    if (document.getElementById('ult-ig-like')) {
      o.community.instagramRewards = {
        perLike: +val('ult-ig-like') || 25, perComment: +val('ult-ig-comment') || 40,
        perSave: +val('ult-ig-save') || 30, fullPostBonus: +val('ult-ig-bonus') || 30
      };
      o.community.fansRewards = {
        perLike: +val('ult-fans-like') || 15, perRt: +val('ult-fans-rt') || 25,
        perComment: +val('ult-fans-comment') || 30, comboBonus: +val('ult-fans-combo') || 20
      };
    }

    var earn = collectList('earn', EARN_FIELDS, 'earnMethods');
    if (earn) o.community.earnMethods = earn;
    var fquote = collectList('fquote', QUOTE_FIELDS, 'fanQuotes');
    if (fquote) o.community.fanQuotes = fquote;
    var cmile = collectList('cmile', MILESTONE_FIELDS, 'clubMilestones');
    if (cmile) o.community.clubMilestones = cmile;
    if (document.getElementById('ult-leaderboard')) {
      o.community.leaderboardSeed = linesToArr(val('ult-leaderboard')).map(function (line) {
        var p = line.split('|');
        return { nick: (p[0] || '').trim(), kp: +((p[1] || '').trim()) || 0, level: (p[2] || '').trim() };
      });
    }

    if (document.getElementById('ult-lay-loader')) {
      o.layout = {
        loaderText: val('ult-lay-loader'), liveBadge: val('ult-lay-live-badge'),
        footerCopy: val('ult-lay-copy'), profileNote: val('ult-lay-profile-note')
      };
    }
    if (document.getElementById('ult-site-collective')) {
      o.site = o.site || {};
      o.site.collective = val('ult-site-collective');
      o.site.collectiveLabel = val('ult-site-coll-label');
      o.site.copyrightYear = val('ult-lay-year') || val('ult-site-year');
      o.site.points = o.site.points || {};
      o.site.points.tagline = val('ult-site-pt-tagline');
      o.site.socialLabels = {
        twitter: val('ult-soc-lbl-tw'), instagram: val('ult-soc-lbl-ig'), fans: val('ult-soc-lbl-fans')
      };
      o.site.teams = o.site.teams || {};
      ['brawlStars', 'clashRoyale', 'clubesPro'].forEach(function (k) {
        if (!document.getElementById('ult-team-' + k + '-label')) return;
        o.site.teams[k] = {
          label: val('ult-team-' + k + '-label'), tag: val('ult-team-' + k + '-tag'), players: +val('ult-team-' + k + '-players') || 0
        };
      });
    }

    return o;
  }

  function bindUltimate(id) {
    if (id === 'ult-com-shop') {
      bindListCrud('shopcat', SHOP_CAT_FIELDS, 'shopCategories', function () { return { id: 'cat-' + Date.now(), label: 'Nueva', icon: '🛒' }; });
      bindListCrud('shoptier', SHOP_TIER_FIELDS, 'shopTiers', function () { return { id: 'tier-' + Date.now(), label: 'Nuevo', range: '0 KP', color: '#ff5500' }; });
    }
    if (id === 'ult-com-games') {
      bindListCrud('arcade', ARCADE_FIELDS, 'arcadeGames', function () { return { id: 'game-' + Date.now(), icon: '🎮', name: 'Nuevo juego', maxKp: 100, limit: '1/día', rule: '' }; });
      bindListCrud('spin', SPIN_FIELDS, 'spinSegments', function () { return { label: '+10 KP', value: 10, color: '#ff5500' }; });
      bindListCrud('dch', CHALLENGE_FIELDS, 'dailyChallenges', function () { return { id: 'dc-' + Date.now(), text: 'Nuevo reto', reward: 50 }; });
      bindListCrud('wgoal', [{ key: 'id', label: '' }, { key: 'label', label: '' }, { key: 'icon', label: '' }, { key: 'target', label: '' }, { key: 'reward', label: '' }], 'weeklyGoals');
    }
    if (id === 'ult-com-misc') {
      bindListCrud('earn', EARN_FIELDS, 'earnMethods', function () { return { icon: '⭐', title: 'Nuevo', desc: '', kp: '0' }; });
      bindListCrud('fquote', QUOTE_FIELDS, 'fanQuotes', function () { return { nick: 'Fan', text: '', avatar: '🦊' }; });
      bindListCrud('cmile', MILESTONE_FIELDS, 'clubMilestones', function () { return { year: '2025', title: 'Nuevo', desc: '', icon: '★' }; });
    }
  }

  window.CMSStudioUltimate = {
    nav: ULT_NAV,
    render: function (id) { return RENDERERS[id] ? RENDERERS[id]() : null; },
    collect: collectUltimate,
    bind: bindUltimate
  };
})();
