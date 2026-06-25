/* LyokFox Studio EXTRA PREMIUM — edición 100%+ de toda la web */
(function () {
  'use strict';
  if (typeof window.CMS === 'undefined') return;
  var C = window.CMS;

  var SEO_PAGES = [
    { key: 'inicio', label: 'Inicio', title: 'LyokFox Esports — Inicio', desc: 'Club esports Brawl Stars, Clash Royale y EAFC. Comunidad, noticias, equipos y Kitsune Points.' },
    { key: 'equipos', label: 'Equipos', title: 'Equipos | LyokFox Esports', desc: 'Plantillas oficiales Brawl Stars, Clash Royale y Clubes Pro FC26.' },
    { key: 'comunidad', label: 'Comunidad', title: 'Comunidad | LyokFox Esports', desc: 'Zona Comunidad LyokFox — Gana KP en redes, juegos, predicciones y tienda.' },
    { key: 'noticias', label: 'Noticias', title: 'Noticias | LyokFox Esports', desc: 'Noticias LyokFox Esports — Matchday, fichajes, Brawl Stars, VPG, PLG y comunidad Indomables.' },
    { key: 'historia', label: 'Historia', title: 'Historia | LyokFox Esports', desc: 'Historia de LyokFox Esports — Origen, camada kitsune e hitos del club.' },
    { key: 'sponsor', label: 'Sponsor', title: 'Sponsor | LyokFox Esports', desc: 'Patrocina LyokFox Esports — Visibilidad en Brawl, Clash, FC26 y comunidad Indomables.' },
    { key: 'contacto', label: 'Contacto', title: 'Contáctanos | LyokFox Esports', desc: 'Contacta con LyokFox Esports — Patrocinio, fichajes, pruebas y prensa.' },
    { key: 'cuenta', label: 'Mi cuenta', title: 'Mi cuenta | LyokFox Esports', desc: 'Tu cuenta LyokFox — Perfil camada, conectar X/Twitter y gestionar Kitsune Points.' }
  ];

  var EXP_NAV = [];

  function val(id) { var el = document.getElementById(id); return el ? String(el.value).trim() : ''; }
  function linesToArr(t) { return t ? t.split('\n').map(function (s) { return s.trim(); }).filter(Boolean) : []; }

  function head(t, d) {
    return '<header class="cms-studio-section-head cms-studio-section-head--extra"><h2>' + t + '</h2>' +
      (d ? '<p>' + d + '</p>' : '') + '</header>';
  }
  function card(t, body, open) {
    return '<details class="cms-studio-card cms-studio-card--extra"' + (open ? ' open' : '') + '><summary>' + t +
      '</summary><div class="cms-studio-card-body">' + body + '</div></details>';
  }

  function getSeo(key) {
    var o = C.load();
    var s = (o.seo && o.seo[key]) || {};
    var pg = (o.pages && o.pages[key]) || {};
    var def = SEO_PAGES.find(function (p) { return p.key === key; }) || {};
    return {
      title: s.title || pg.seoTitle || def.title || '',
      description: s.description || pg.seoDescription || def.desc || ''
    };
  }
  function getShell(key) {
    if (C.getPageShell) return C.getPageShell(key);
    return (C.load().pageShells || {})[key] || {};
  }
  function getComm() { return (typeof COMMUNITY !== 'undefined') ? COMMUNITY : {}; }
  function getUi() {
    var c = getComm();
    return c.ui || {};
  }

  function renderHub() {
    return head('LyokFox Studio Extra Premium', 'Centro de control profesional — edita el 100% de la web y más, sin código.') +
      C.helpBox('Modo profesional', 'Todo lo que ves en la web tiene editor aquí. Cambia textos, buscadores, formularios, logros, quiz y panel de perfil. Pulsa <strong>Guardar cambios</strong> arriba.', 'tip') +
      '<div class="cms-extra-badge">✦ EXTRA PREMIUM · EDICIÓN TOTAL</div>' +
      '<div class="cms-task-grid cms-task-grid--hero cms-task-grid--extra">' +
        C.taskCard('✦', 'Extra Premium', 'Este panel — mapa total', 'extra-hub') +
        C.taskCard('🔍', 'Buscadores', 'Título y descripción en Google', 'extra-seo') +
        C.taskCard('🖼️', 'Iconos & imágenes', 'URLs · logos · UI', 'prem-icons') +
        C.taskCard('👁️', 'Mostrar / ocultar', 'Secciones y menú', 'prem-visibility') +
        C.taskCard('🎮', 'Comunidad textos', 'Arcade · pred · modales', 'extra-com-textos') +
        C.taskCard('🏆', 'Logros & Quiz', 'Badges y preguntas', 'extra-com-data') +
        C.taskCard('👥', '43 Jugadores', 'Plantillas completas', 'players') +
        C.taskCard('📅', 'Calendario', 'Matchday visual', 'schedule') +
        C.taskCard('📜', 'Historia ×10', 'Capítulos completos', 'historia-completa') +
        C.taskCard('🪪', 'Cuenta completa', 'Formulario · redes · datos', 'extra-cuenta') +
        C.taskCard('👥', 'Equipos detalles', 'Roster · ficha · staff', 'extra-equipos') +
        C.taskCard('✉️', 'Contacto form', 'Labels y asuntos', 'extra-contacto') +
        C.taskCard('📰', 'Noticias portal', 'Breaking · búsqueda', 'extra-noticias') +
        C.taskCard('🏠', 'Inicio extras', 'Panel partido · calendario', 'extra-inicio') +
        C.taskCard('👤', 'Panel perfil', 'Menú lateral de la cabecera', 'extra-perfil') +
        C.taskCard('🗺️', 'Mapa web 100%', 'Todos los editores', 'ult-map') +
        C.taskCard('💾', 'Copia seguridad', 'Descargar / restaurar', 'advanced') +
      '</div>';
  }

  function renderSeo() {
    var html = head('Buscadores · 8 páginas', 'Título de pestaña y descripción para Google y redes sociales.');
    SEO_PAGES.forEach(function (p, i) {
      var s = getSeo(p.key);
      html += card(p.label, C.fieldEasy('Título en la pestaña', 'extra-seo-title-' + p.key, s.title, { full: true }) +
        C.textareaEasy('Descripción para Google', 'extra-seo-desc-' + p.key, s.description, { rows: 2, full: true }), i === 0);
    });
    return html;
  }

  function renderComTextos() {
    var cm = getShell('comunidad');
    var ui = getUi();
    var sh = ui.socialHero || {};
    var pr = ui.predictions || {};
    var ob = ui.onboard || {};
    var rd = ui.redeem || {};
    return head('Comunidad · todos los textos', 'Hero redes, arcade, predicciones, misiones, ranking y modales.') +
      card('Redes · hero dinámico (JS)', C.fieldEasy('Badge', 'extra-ui-sh-badge', sh.badge || 'Redes + KP') +
        C.fieldEasy('Título H2', 'extra-ui-sh-title', sh.title || 'Apoya a LyokFox · gana Kitsune Points', { full: true }) +
        C.textareaEasy('Texto', 'extra-ui-sh-text', sh.text || 'Like, RT y comentarios en @LyokFox_, Instagram y @Lyokfox_Fans.', { rows: 2, full: true }) +
        C.textareaEasy('Hint resumen (debajo stats)', 'extra-ui-sh-hint', ui.socialSummaryHint || '', { rows: 2, full: true }), true) +
      card('Arcade · cabecera', C.fieldEasy('Título panel juegos', 'extra-comm-arcade-title', cm.arcadeTitle || 'Arcade camada', { full: true }) +
        C.fieldEasy('Subtítulo', 'extra-comm-arcade-sub', cm.arcadeSub || 'Minijuegos diarios · ruleta · objetivos semanales', { full: true }) +
        C.fieldEasy('Objetivos semanales H3', 'extra-comm-weekly-title', cm.weeklyTitle || 'Objetivos semanales'), false) +
      card('Arcade · nombres juegos', ['spin', 'quiz', 'reflex', 'memory', 'anagram'].map(function (k, i) {
        var defs = ['Ruleta kitsune', 'Quiz LyokFox', 'Reflejos', 'Memoria', 'Anagrama'];
        var ag = (getComm().arcadeGames || [])[i];
        return C.fieldEasy(defs[i], 'extra-comm-game-' + k, (cm.arcadeGames && cm.arcadeGames[k]) || (ag && ag.name) || defs[i]);
      }).join(''), false) +
      card('Predicciones', C.fieldEasy('EAFC · título', 'extra-pred-eafc-title', pr.eafcTitle || cm.predEafcTitle || 'Partidos EAFC · Clubes Pro', { full: true }) +
        C.fieldEasy('EAFC · subtítulo', 'extra-pred-eafc-sub', pr.eafcSub || cm.predEafcSub || '+25 KP al registrar · +100 si aciertas') +
        C.fieldEasy('Otros equipos · título', 'extra-pred-other-title', pr.otherTitle || cm.predOtherTitle || 'Otros equipos LyokFox') +
        C.fieldEasy('Otros · subtítulo', 'extra-pred-other-sub', pr.otherSub || cm.predOtherSub || 'Brawl · Clash · scrims') +
        C.fieldEasy('Resultados · título', 'extra-pred-results-title', pr.resultsTitle || cm.predResultsTitle || 'Resultados recientes'), false) +
      card('Misiones · filtros', linesToArr('Todas\nInicio\nX\nSocial\nWeb\nPro').map(function (label, i) {
        var tabs = cm.missionTabs || ['Todas', 'Inicio', 'X', 'Social', 'Web', 'Pro'];
        return C.fieldEasy('Pestaña ' + (i + 1), 'extra-mission-tab-' + i, tabs[i] || label);
      }).join(''), false) +
      card('Ranking', C.fieldEasy('Título ranking', 'extra-rank-title', cm.rankingTitle || 'Ranking') +
        C.fieldEasy('Título logros', 'extra-ach-title', cm.achievementsTitle || 'Logros') +
        C.fieldEasy('FAQ summary', 'extra-faq-summary', cm.faqSummary || 'FAQ Kitsune Points'), false) +
      card('Modal onboarding', C.fieldEasy('Título', 'extra-onboard-title', ob.title || cm.onboardTitle || 'Únete a la camada') +
        C.textareaEasy('Texto', 'extra-onboard-text', ob.text || cm.onboardText || 'Elige apodo para guardar Kitsune Points.', { rows: 2 }) +
        C.fieldEasy('Label apodo', 'extra-onboard-nick', ob.nickLabel || cm.onboardNickLabel || 'Apodo') +
        C.fieldEasy('Botón entrar', 'extra-onboard-btn', ob.btn || cm.onboardBtn || 'Entrar') +
        C.fieldEasy('Nota PIN', 'extra-onboard-fine', ob.fine || cm.onboardFine || 'Ajustes web ⚙️ PIN: lyokfox'), false) +
      card('Modal canje premio', C.fieldEasy('Título', 'extra-redeem-title', rd.title || cm.redeemTitle || 'Premio canjeado'), false);
  }

  var ACH_FIELDS = [
    { key: 'id', label: 'ID' }, { key: 'name', label: 'Nombre' }, { key: 'desc', label: 'Descripción' },
    { key: 'at', label: 'Meta (número)', type: 'number' }, { key: 'type', label: 'Tipo (opcional)' }
  ];
  var QUIZ_FIELDS = [
    { key: 'q', label: 'Pregunta' },
    { key: 'a0', label: 'Opción A' }, { key: 'a1', label: 'Opción B' },
    { key: 'a2', label: 'Opción C' }, { key: 'a3', label: 'Opción D' },
    { key: 'correct', label: 'Índice correcto (0-3)', type: 'number' }
  ];

  function listCrud(opts) {
    var items = opts.items || [];
    var idx = 0;
    var sel = '<label class="cms-field cms-field-full"><span>' + opts.itemLabel + '</span><select id="cms-' + opts.prefix + '-index">' +
      items.map(function (it, i) {
        var lbl = it[opts.labelKey] || it.q || it.name || ('#' + (i + 1));
        return '<option value="' + i + '">' + (i + 1) + '. ' + lbl + '</option>';
      }).join('') + '</select></label>';
    var fields = opts.fields.map(function (f) {
      return C.fieldEasy(f.label, 'cms-' + opts.prefix + '-' + f.key, '', { type: f.type || 'text', full: f.key === 'q' || f.key === 'desc' });
    }).join('');
    return card(opts.title, sel + fields +
      '<div class="cms-list-actions"><button type="button" class="btn btn-glass btn-sm" id="cms-' + opts.prefix + '-add">+ Añadir</button>' +
      '<button type="button" class="btn btn-glass btn-sm cms-danger" id="cms-' + opts.prefix + '-del">Eliminar</button></div>', opts.open);
  }

  function renderComData() {
    var c = getComm();
    return head('Logros & Quiz', 'Badges de ranking y banco de preguntas del minijuego Quiz LyokFox.') +
      listCrud({ title: 'Logros (ranking)', prefix: 'ach', labelKey: 'name', itemLabel: 'Logro', items: c.achievements || [], fields: ACH_FIELDS, open: true }) +
      listCrud({ title: 'Quiz · preguntas', prefix: 'quiz', labelKey: 'q', itemLabel: 'Pregunta', items: (c.quizPool || []).map(function (q) {
        return { q: q.q, a0: q.a[0], a1: q.a[1], a2: q.a[2], a3: q.a[3], correct: q.correct };
      }), fields: QUIZ_FIELDS, open: false }) +
      card('FAQ comunidad (q | a, una por línea)', C.textareaEasy('FAQ', 'extra-faq-bulk', (c.faq || []).map(function (f) { return f.q + ' | ' + f.a; }).join('\n'), { rows: 10, full: true }));
  }

  function renderCuenta() {
    var cu = getShell('cuenta');
    return head('Mi cuenta · 100%', 'Formulario, pestañas, redes, roadmap y datos.') +
      card('Hero & pestañas', C.fieldEasy('Eyebrow', 'extra-cu-eyebrow', cu.eyebrow || 'Mi camada') +
        C.textareaEasy('Subtítulo hero', 'extra-cu-sub', cu.sub || '', { rows: 2, full: true }) +
        [0, 1, 2, 3].map(function (i) {
          var tabs = cu.tabs || ['Perfil', 'Redes & X', 'Kitsune Points', 'Datos'];
          return C.fieldEasy('Pestaña ' + (i + 1), 'extra-cu-tab-' + i, tabs[i] || '');
        }).join(''), true) +
      card('Formulario perfil', C.fieldEasy('Label apodo', 'extra-cu-lbl-nick', cu.lblNickname || 'Apodo camada (obligatorio)') +
        C.fieldEasy('Label bio', 'extra-cu-lbl-bio', cu.lblBio || 'Bio') +
        C.fieldEasy('Label país', 'extra-cu-lbl-country', cu.lblCountry || 'País') +
        C.fieldEasy('Label equipo fav.', 'extra-cu-lbl-favorite', cu.lblFavorite || 'Equipo favorito') +
        C.fieldEasy('Label avatar URL', 'extra-cu-lbl-avatar', cu.lblAvatar || 'URL avatar (opcional)') +
        C.fieldEasy('Checkbox ranking', 'extra-cu-lbl-ranking', cu.lblPublicRanking || 'Aparecer en ranking camada con mi apodo') +
        C.fieldEasy('Botón guardar', 'extra-cu-btn-save', cu.btnSave || 'Guardar perfil'), false) +
      card('Redes & X', C.fieldEasy('Título conectar X', 'extra-cu-x-title', cu.xTitle || 'Conectar Twitter / X', { full: true }) +
        C.textareaEasy('Descripción OAuth', 'extra-cu-x-desc', cu.xDesc || 'Vincula tu cuenta para sincronizar likes y sumar KP automáticamente.', { rows: 2, full: true }) +
        C.fieldEasy('Roadmap H3', 'extra-cu-road-title', cu.roadmapTitle || 'Roadmap integración X') +
        C.textareaEasy('Pasos roadmap (uno por línea)', 'extra-cu-road-steps', (cu.roadmapSteps || [
          'Ahora — Posts de @LyokFox_ en la web · reclamas KP aquí.',
          'Próximo — Cuenta LyokFox + Supabase: posts nuevos automáticos.',
          'Futuro — OAuth X: like verificado = KP automático.'
        ]).join('\n'), { rows: 4, full: true }), false) +
      card('KP & Datos', C.fieldEasy('Btn tienda', 'extra-cu-kp-shop', cu.kpBtnShop || 'Ir a la tienda') +
        C.fieldEasy('Btn misiones', 'extra-cu-kp-missions', cu.kpBtnMissions || 'Misiones') +
        C.fieldEasy('Btn predicciones', 'extra-cu-kp-pred', cu.kpBtnPred || 'Predicciones') +
        C.fieldEasy('Btn exportar', 'extra-cu-btn-export', cu.btnExport || 'Descargar mis datos') +
        C.fieldEasy('Btn restaurar label', 'extra-cu-btn-import', cu.btnImport || 'Restaurar desde archivo') +
        C.fieldEasy('Btn reset KP', 'extra-cu-btn-reset', cu.btnReset || 'Resetear progreso KP') +
        C.textareaEasy('Nota datos local', 'extra-cu-data-fine', cu.dataFine || 'Los datos se guardan en este navegador.', { rows: 2, full: true }), false);
  }

  function renderEquipos() {
    var eq = getShell('equipos');
    return head('Equipos · detalles', 'Roster, fichas, staff y CTA de la página equipos.') +
      card('Roster & fichas', C.fieldEasy('Heading roster', 'extra-eq-roster-heading', eq.rosterHeading || 'Roster oficial') +
        C.fieldEasy('Hint Brawl', 'extra-eq-hint-brawl', eq.rosterHintBrawl || 'Pulsa cualquier jugador para ver su ficha · o usa «Ficha equipo» arriba.') +
        C.fieldEasy('Hint Clash', 'extra-eq-hint-clash', eq.rosterHintClash || 'Pulsa cualquier jugador para ver su ficha.') +
        C.fieldEasy('Hint EAFC', 'extra-eq-hint-eafc', eq.rosterHintEafc || 'Pulsa cualquier jugador para ver su ficha.') +
        C.fieldEasy('Botón ficha equipo', 'extra-eq-ficha-btn', eq.fichaBtn || 'Ficha equipo'), true) +
      card('Staff & CTA', C.fieldEasy('Staff H3', 'extra-eq-staff-title', eq.staffTitle || 'Staff & Comunidad') +
        C.fieldEasy('CTA eyebrow', 'extra-eq-cta-eyebrow', eq.ctaEyebrow || 'Camada') +
        C.fieldEasy('CTA btn 1', 'extra-eq-cta-btn1', eq.ctaBtn1 || 'Zona Comunidad') +
        C.fieldEasy('CTA btn 2', 'extra-eq-cta-btn2', eq.ctaBtn2 || 'Contáctanos'), false);
  }

  function renderContacto() {
    var co = getShell('contacto');
    var ct = C.load().contact || {};
    return head('Contacto · formulario', 'Labels del formulario, email y temas de contacto.') +
      card('Info lateral', C.fieldEasy('Label email', 'extra-con-email-label', ct.emailLabel || 'Email directo') +
        C.textareaEasy('Temas contacto (título | descripción, uno por línea)', 'extra-con-topics', (ct.topics || []).map(function (t) {
          return (t.title || '') + ' | ' + (t.desc || '');
        }).join('\n') || 'Patrocinio | Marcas y paquetes\nPruebas | Tryouts abiertos', { rows: 5, full: true }), true) +
      card('Formulario', C.fieldEasy('Label nombre', 'extra-con-lbl-name', co.lblName || 'Nombre') +
        C.fieldEasy('Placeholder nombre', 'extra-con-ph-name', co.phName || 'Tu nombre') +
        C.fieldEasy('Label email', 'extra-con-lbl-email', co.lblEmail || 'Email') +
        C.fieldEasy('Placeholder email', 'extra-con-ph-email', co.phEmail || 'tu@email.com') +
        C.fieldEasy('Label asunto', 'extra-con-lbl-subject', co.lblSubject || 'Asunto') +
        C.fieldEasy('Label mensaje', 'extra-con-lbl-message', co.lblMessage || 'Mensaje') +
        C.fieldEasy('Placeholder mensaje', 'extra-con-ph-message', co.phMessage || 'Cuéntanos tu propuesta...'), false);
  }

  function renderNoticias() {
    var nw = getShell('noticias');
    var news = C.getMerged ? (C.getMerged().news || {}) : (C.load().news || {});
    var breaking = C.getNewsBreaking ? C.getNewsBreaking() : (news.breaking || '');
    return head('Noticias · portal', 'Hero estilo Sponsor, breaking, búsqueda y feed premium.') +
      C.helpBox('Artículos completos', 'Para editar títulos y cuerpo de cada noticia → <button type="button" class="cms-inline-link" data-goto="news">Artículos</button>.', 'tip') +
      C.fieldEasy('Texto breaking (barra naranja)', 'extra-news-breaking-text', breaking, { full: true, where: 'Barra bajo el hero en noticias.html' }) +
      C.fieldEasy('Placeholder búsqueda', 'extra-news-search', nw.searchPlaceholder || 'Buscar noticia…') +
      C.fieldEasy('Label breaking', 'extra-news-breaking-label', nw.breakingLabel || 'Última hora');
  }

  function renderInicio() {
    var home = C.load().home || {};
    return head('Inicio · extras', 'Nota del calendario y etiqueta del panel de partido en el hero.') +
      card('Panel partido (hero)', C.fieldEasy('Etiqueta «Próximo partido»', 'extra-in-match-label', home.matchSlotLabel || 'Próximo partido', { where: 'Panel derecho del hero' }), true) +
      card('Calendario · nota pie', C.textareaEasy('Nota schedule', 'extra-in-schedule-note', home.scheduleNote || 'Horarios en CEST · Sigue los matchdays en @LyokFox_ · Predicciones KP en Comunidad', { rows: 2, full: true }));
  }

  function renderPerfil() {
    var pd = (C.load().layout || {}).profileDrawer || {};
    return head('Panel perfil (cabecera)', 'Drawer lateral al pulsar tu avatar en cualquier página.') +
      card('Pestañas & labels', C.fieldEasy('Tab Perfil', 'extra-pf-tab-perfil', pd.tabPerfil || 'Perfil') +
        C.fieldEasy('Tab Redes', 'extra-pf-tab-redes', pd.tabRedes || 'Redes') +
        C.fieldEasy('Tab Datos', 'extra-pf-tab-datos', pd.tabDatos || 'Datos') +
        C.fieldEasy('Label apodo', 'extra-pf-lbl-nick', pd.lblNick || 'Apodo') +
        C.fieldEasy('Label bio', 'extra-pf-lbl-bio', pd.lblBio || 'Bio') +
        C.fieldEasy('Label país', 'extra-pf-lbl-country', pd.lblCountry || 'País') +
        C.fieldEasy('Label equipo fav.', 'extra-pf-lbl-favorite', pd.lblFavorite || 'Equipo fav.') +
        C.fieldEasy('Label avatar', 'extra-pf-lbl-avatar', pd.lblAvatar || 'Avatar URL') +
        C.fieldEasy('Btn guardar perfil', 'extra-pf-btn-save', pd.btnSave || 'Guardar perfil') +
        C.fieldEasy('Btn ir comunidad', 'extra-pf-btn-comm', pd.btnComm || 'Ir a Comunidad'), true) +
      card('Redes & datos', C.fieldEasy('Label usuario X', 'extra-pf-lbl-twitter', pd.lblTwitter || 'Usuario X') +
        C.fieldEasy('Label Instagram', 'extra-pf-lbl-instagram', pd.lblInstagram || 'Instagram') +
        C.textareaEasy('Nota OAuth', 'extra-pf-note-redes', pd.noteRedes || 'OAuth X próximamente. Mientras: reclama KP en posts.', { rows: 2, full: true }) +
        C.fieldEasy('Btn exportar', 'extra-pf-btn-export', pd.btnExport || 'Descargar copia de perfil') +
        C.fieldEasy('Btn reset KP', 'extra-pf-btn-reset', pd.btnReset || 'Resetear KP') +
        C.fieldEasy('Nota PIN editor', 'extra-pf-note-pin', pd.notePin || 'Ajustes editor ⚙️ PIN: lyokfox'), false);
  }

  var RENDERERS = {
    'extra-hub': renderHub,
    'extra-seo': renderSeo,
    'extra-com-textos': renderComTextos,
    'extra-com-data': renderComData,
    'extra-cuenta': renderCuenta,
    'extra-equipos': renderEquipos,
    'extra-contacto': renderContacto,
    'extra-noticias': renderNoticias,
    'extra-inicio': renderInicio,
    'extra-perfil': renderPerfil
  };

  function fillList(prefix, item, fields) {
    fields.forEach(function (f) {
      var el = document.getElementById('cms-' + prefix + '-' + f.key);
      if (!el || item[f.key] === undefined) return;
      el.value = item[f.key];
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
      var it = items()[idx] || {};
      if (prefix === 'quiz' && it.a) {
        it = { q: it.q, a0: it.a[0], a1: it.a[1], a2: it.a[2], a3: it.a[3], correct: it.correct };
      }
      fillList(prefix, it, fields);
    }
    idxEl.onchange = refresh;
    refresh();
    var addBtn = document.getElementById('cms-' + prefix + '-add');
    if (addBtn) addBtn.onclick = function () {
      var o = C.load();
      o.community = o.community || {};
      o.community[key] = JSON.parse(JSON.stringify(getComm()[key] || []));
      o.community[key].push(makeNew());
      C.save(o); C.apply();
      if (window.CMSStudio && window.CMSStudio.goto) window.CMSStudio.goto(window.CMSStudio.activeSection);
    };
    var delBtn = document.getElementById('cms-' + prefix + '-del');
    if (delBtn) delBtn.onclick = function () {
      if (!confirm('¿Eliminar este elemento?')) return;
      var idx = +idxEl.value || 0;
      var o = C.load();
      o.community = o.community || {};
      o.community[key] = JSON.parse(JSON.stringify(getComm()[key] || []));
      o.community[key].splice(idx, 1);
      C.save(o); C.apply();
      if (window.CMSStudio && window.CMSStudio.goto) window.CMSStudio.goto(window.CMSStudio.activeSection);
    };
  }

  function collectList(prefix, fields, key, mapRead) {
    if (!document.getElementById('cms-' + prefix + '-index')) return null;
    var idx = +val('cms-' + prefix + '-index') || 0;
    var list = JSON.parse(JSON.stringify(getComm()[key] || []));
    if (!list[idx]) return list;
    var raw = readList(prefix, fields, list[idx]);
    list[idx] = mapRead ? mapRead(raw, list[idx]) : raw;
    return list;
  }

  function collectExtra(o) {
    o.seo = o.seo || {};
    SEO_PAGES.forEach(function (p) {
      if (!document.getElementById('extra-seo-title-' + p.key)) return;
      o.seo[p.key] = {
        title: val('extra-seo-title-' + p.key),
        description: val('extra-seo-desc-' + p.key)
      };
    });

    if (document.getElementById('extra-ui-sh-badge')) {
      o.community = o.community || {};
      o.community.ui = o.community.ui || {};
      o.community.ui.socialHero = {
        badge: val('extra-ui-sh-badge'),
        title: val('extra-ui-sh-title'),
        text: val('extra-ui-sh-text')
      };
      o.community.ui.socialSummaryHint = val('extra-ui-sh-hint');
      o.community.ui.predictions = {
        eafcTitle: val('extra-pred-eafc-title'),
        eafcSub: val('extra-pred-eafc-sub'),
        otherTitle: val('extra-pred-other-title'),
        otherSub: val('extra-pred-other-sub'),
        resultsTitle: val('extra-pred-results-title')
      };
      o.community.ui.onboard = {
        title: val('extra-onboard-title'),
        text: val('extra-onboard-text'),
        nickLabel: val('extra-onboard-nick'),
        btn: val('extra-onboard-btn'),
        fine: val('extra-onboard-fine')
      };
      o.community.ui.redeem = { title: val('extra-redeem-title') };

      o.pageShells = o.pageShells || {};
      o.pageShells.comunidad = o.pageShells.comunidad || {};
      var cm = o.pageShells.comunidad;
      cm.arcadeTitle = val('extra-comm-arcade-title');
      cm.arcadeSub = val('extra-comm-arcade-sub');
      cm.weeklyTitle = val('extra-comm-weekly-title');
      cm.arcadeGames = {
        spin: val('extra-comm-game-spin'),
        quiz: val('extra-comm-game-quiz'),
        reflex: val('extra-comm-game-reflex'),
        memory: val('extra-comm-game-memory'),
        anagram: val('extra-comm-game-anagram')
      };
      cm.predEafcTitle = val('extra-pred-eafc-title');
      cm.predEafcSub = val('extra-pred-eafc-sub');
      cm.predOtherTitle = val('extra-pred-other-title');
      cm.predOtherSub = val('extra-pred-other-sub');
      cm.predResultsTitle = val('extra-pred-results-title');
      cm.missionTabs = [0, 1, 2, 3, 4, 5].map(function (i) { return val('extra-mission-tab-' + i); });
      cm.rankingTitle = val('extra-rank-title');
      cm.achievementsTitle = val('extra-ach-title');
      cm.faqSummary = val('extra-faq-summary');
      cm.onboardTitle = val('extra-onboard-title');
      cm.onboardText = val('extra-onboard-text');
      cm.onboardNickLabel = val('extra-onboard-nick');
      cm.onboardBtn = val('extra-onboard-btn');
      cm.onboardFine = val('extra-onboard-fine');
      cm.redeemTitle = val('extra-redeem-title');
    }

    var ach = collectList('ach', ACH_FIELDS, 'achievements');
    if (ach) { o.community = o.community || {}; o.community.achievements = ach; }
    var quiz = collectList('quiz', QUIZ_FIELDS, 'quizPool', function (raw) {
      return { q: raw.q, a: [raw.a0, raw.a1, raw.a2, raw.a3], correct: +raw.correct || 0 };
    });
    if (quiz) { o.community = o.community || {}; o.community.quizPool = quiz; }
    if (document.getElementById('extra-faq-bulk')) {
      o.community = o.community || {};
      o.community.faq = linesToArr(val('extra-faq-bulk')).map(function (line) {
        var p = line.split('|');
        return { q: (p[0] || '').trim(), a: (p[1] || '').trim() };
      }).filter(function (f) { return f.q; });
    }

    if (document.getElementById('extra-cu-eyebrow')) {
      o.pageShells = o.pageShells || {};
      var prevCu = (C.load().pageShells || {}).cuenta || {};
      o.pageShells.cuenta = Object.assign({}, prevCu, {
        eyebrow: val('extra-cu-eyebrow'), sub: val('extra-cu-sub'),
        tabs: [0, 1, 2, 3].map(function (i) { return val('extra-cu-tab-' + i); }),
        lblNickname: val('extra-cu-lbl-nick'), lblBio: val('extra-cu-lbl-bio'),
        lblCountry: val('extra-cu-lbl-country'), lblFavorite: val('extra-cu-lbl-favorite'),
        lblAvatar: val('extra-cu-lbl-avatar'), lblPublicRanking: val('extra-cu-lbl-ranking'),
        btnSave: val('extra-cu-btn-save'),
        xTitle: val('extra-cu-x-title'), xDesc: val('extra-cu-x-desc'),
        roadmapTitle: val('extra-cu-road-title'), roadmapSteps: linesToArr(val('extra-cu-road-steps')),
        kpBtnShop: val('extra-cu-kp-shop'), kpBtnMissions: val('extra-cu-kp-missions'), kpBtnPred: val('extra-cu-kp-pred'),
        btnExport: val('extra-cu-btn-export'), btnImport: val('extra-cu-btn-import'), btnReset: val('extra-cu-btn-reset'),
        dataFine: val('extra-cu-data-fine')
      });
    }

    if (document.getElementById('extra-eq-roster-heading')) {
      o.pageShells = o.pageShells || {};
      o.pageShells.equipos = o.pageShells.equipos || {};
      var eq = o.pageShells.equipos;
      eq.rosterHeading = val('extra-eq-roster-heading');
      eq.rosterHintBrawl = val('extra-eq-hint-brawl');
      eq.rosterHintClash = val('extra-eq-hint-clash');
      eq.rosterHintEafc = val('extra-eq-hint-eafc');
      eq.fichaBtn = val('extra-eq-ficha-btn');
      eq.staffTitle = val('extra-eq-staff-title');
      eq.ctaEyebrow = val('extra-eq-cta-eyebrow');
      eq.ctaBtn1 = val('extra-eq-cta-btn1');
      eq.ctaBtn2 = val('extra-eq-cta-btn2');
    }

    if (document.getElementById('extra-con-lbl-name')) {
      o.pageShells = o.pageShells || {};
      o.pageShells.contacto = o.pageShells.contacto || {};
      var co = o.pageShells.contacto;
      co.lblName = val('extra-con-lbl-name'); co.phName = val('extra-con-ph-name');
      co.lblEmail = val('extra-con-lbl-email'); co.phEmail = val('extra-con-ph-email');
      co.lblSubject = val('extra-con-lbl-subject'); co.lblMessage = val('extra-con-lbl-message');
      co.phMessage = val('extra-con-ph-message');
      o.contact = o.contact || {};
      o.contact.emailLabel = val('extra-con-email-label');
      o.contact.topics = linesToArr(val('extra-con-topics')).map(function (line) {
        var p = line.split('|');
        return { title: (p[0] || '').trim(), desc: (p[1] || '').trim() };
      }).filter(function (t) { return t.title; });
    }

    if (document.getElementById('extra-news-breaking-text')) {
      o.pageShells = o.pageShells || {};
      o.pageShells.noticias = o.pageShells.noticias || {};
      o.pageShells.noticias.searchPlaceholder = val('extra-news-search');
      if (document.getElementById('extra-news-breaking-label')) {
        o.pageShells.noticias.breakingLabel = val('extra-news-breaking-label');
      }
      o.news = o.news || {};
      o.news.breaking = val('extra-news-breaking-text');
    }

    if (document.getElementById('extra-in-schedule-note') || document.getElementById('extra-in-match-label')) {
      o.home = o.home || {};
      if (document.getElementById('extra-in-schedule-note')) o.home.scheduleNote = val('extra-in-schedule-note');
      if (document.getElementById('extra-in-match-label')) o.home.matchSlotLabel = val('extra-in-match-label');
    }

    if (document.getElementById('extra-pf-tab-perfil')) {
      o.layout = o.layout || {};
      o.layout.profileDrawer = {
        tabPerfil: val('extra-pf-tab-perfil'), tabRedes: val('extra-pf-tab-redes'), tabDatos: val('extra-pf-tab-datos'),
        lblNick: val('extra-pf-lbl-nick'), lblBio: val('extra-pf-lbl-bio'), lblCountry: val('extra-pf-lbl-country'),
        lblFavorite: val('extra-pf-lbl-favorite'), lblAvatar: val('extra-pf-lbl-avatar'),
        btnSave: val('extra-pf-btn-save'), btnComm: val('extra-pf-btn-comm'),
        lblTwitter: val('extra-pf-lbl-twitter'), lblInstagram: val('extra-pf-lbl-instagram'),
        noteRedes: val('extra-pf-note-redes'), btnExport: val('extra-pf-btn-export'), btnReset: val('extra-pf-btn-reset'),
        notePin: val('extra-pf-note-pin')
      };
    }

    return o;
  }

  function bindExtra(id) {
    if (id === 'extra-com-data') {
      bindListCrud('ach', ACH_FIELDS, 'achievements', function () {
        return { id: 'ach_' + Date.now(), name: 'Nuevo logro', desc: '', at: 1, type: '' };
      });
      bindListCrud('quiz', QUIZ_FIELDS, 'quizPool', function () {
        return { q: 'Nueva pregunta', a: ['A', 'B', 'C', 'D'], correct: 0 };
      });
    }
  }

  window.CMSStudioExtra = {
    nav: EXP_NAV,
    render: function (id) { return RENDERERS[id] ? RENDERERS[id]() : null; },
    collect: collectExtra,
    bind: bindExtra
  };
})();
