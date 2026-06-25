/* LyokFox Studio FÁCIL — para editar sin saber programar */
(function () {
  'use strict';
  if (typeof window.CMS === 'undefined') return;

  var C = window.CMS;

  var EASY_NAV = [];

  function val(id) {
    var el = document.getElementById(id);
    return el ? String(el.value).trim() : '';
  }

  function linesToArr(t) {
    return t ? t.split('\n').map(function (s) { return s.trim(); }).filter(Boolean) : [];
  }

  function arrToLines(a) {
    return (a || []).join('\n');
  }

  function sectionHead(title, desc) {
    return '<header class="cms-studio-section-head cms-studio-section-head--easy">' +
      '<h2>' + title + '</h2>' +
      (desc ? '<p>' + desc + '</p>' : '') +
    '</header>';
  }

  function card(title, body, open) {
    return '<details class="cms-studio-card cms-studio-card--easy"' + (open ? ' open' : '') + '>' +
      '<summary>' + title + '</summary>' +
      '<div class="cms-studio-card-body">' + body + '</div>' +
    '</details>';
  }

  function renderGuide() {
    return sectionHead('Guía para editar la web sin programar', 'El Studio funciona como WordPress o Wix: eliges una página, editas y guardas.') +
      C.helpBox('¿Cómo funciona?', 'Abres ⚙️ → <strong>Inicio Studio</strong> → eliges la página → editas → <strong>💾 Guardar todo</strong>. Los cambios se guardan en <em>este navegador</em>.', 'info') +
      C.stepsBox([
        '<strong>Portada</strong> — menú lateral <em>Inicio</em> → Portada o Edición rápida.',
        '<strong>Logo e imágenes</strong> — <em>Ajustes del sitio</em> → Iconos & imágenes.',
        '<strong>Menú y cabecera</strong> — <em>Ajustes del sitio</em> → Menú · cabecera.',
        '<strong>Noticias</strong> — menú <em>Noticias</em> → Artículos.',
        '<strong>Comunidad</strong> — menú <em>Comunidad</em> → Misiones, tienda, juegos…',
        '<strong>Copia de seguridad</strong> — menú <em>Copia de seguridad</em> → Exportar.'
      ]) +
      '<div class="cms-task-grid">' +
        C.taskCard('🏠', 'Inicio Studio', 'Mapa de todas las páginas', 'studio-home') +
        C.taskCard('⚡', 'Edición rápida', 'Ticker, partido y portada', 'quick') +
        C.taskCard('✨', 'Página Inicio', 'Portada y calendario', 'page-inicio') +
        C.taskCard('📰', 'Noticias', 'Crear y editar artículos', 'news') +
        C.taskCard('⚙️', 'Ajustes del sitio', 'Logo, menú y buscadores', 'settings-hub') +
        C.taskCard('💾', 'Copia de seguridad', 'Guardar archivo en tu PC', 'advanced') +
      '</div>' +
      C.helpBox('Consejo', 'Usa el botón <strong>← Volver</strong> arriba para regresar al menú de la página.', 'tip');
  }

  function renderQuick() {
    var site = C.load().site || {};
    var home = C.load().home || {};
    var sched = (typeof SCHEDULE !== 'undefined') ? SCHEDULE : { featured: {} };
    var f = sched.featured || {};
    return sectionHead('Edición rápida', 'Lo que más se cambia en 2 minutos. Pulsa Guardar cuando termines.') +
      C.helpBox('Atajo', 'Aquí tienes lo esencial junto. Para más opciones usa el menú lateral.', 'tip') +
      card('📢 Aviso en la cabecera (ticker)', C.fieldEasy('Texto del ticker EN VIVO', 'cms-quick-ticker', site.tickerBreaking || (typeof SITE !== 'undefined' ? SITE.tickerBreaking : ''), {
        where: 'Barra naranja bajo el menú en todas las páginas',
        hint: 'Ej: "VPG vs Rival · sábado 22:00 · Predicciones abiertas"',
        full: true
      }), true) +
      card('⚽ Próximo partido (panel hero)', C.fieldEasy('Rival', 'cms-quick-rival', f.opponent || '', { where: 'Panel derecho del hero · partido destacado' }) +
        C.fieldEasy('Competición', 'cms-quick-comp', f.competition || '', { where: 'Panel derecho del hero' }) +
        C.fieldEasy('Fecha (aaaa-mm-dd)', 'cms-quick-date', f.date || '', { placeholder: '2025-07-02' }) +
        C.fieldEasy('Hora (24h)', 'cms-quick-time', f.time || '', { placeholder: '23:00' }), true) +
      card('🏠 Portada · textos principales', C.fieldEasy('Disciplinas bajo LYOKFOX', 'cms-quick-disciplines', home.disciplines || 'Brawl Stars · Clash Royale · Clubes Pro', { where: 'Columna izquierda del hero' }) +
        C.fieldEasy('Tagline', 'cms-quick-tagline', home.tagline || '', { where: 'Frase principal del hero' }) +
        C.fieldEasy('Texto botón naranja', 'cms-quick-cta1', home.ctaPrimary || 'Comunidad', { where: 'Botón principal' }) +
        C.fieldEasy('Texto botón secundario', 'cms-quick-cta2', home.ctaSecondary || 'Equipos', { where: 'Botón gris' }), false) +
      card('📊 Stats del hero (4 cifras)', C.fieldEasy('Jugadores — número', 'cms-quick-stat0v', (home.stats && home.stats[0]) ? home.stats[0].value : '43') +
        C.fieldEasy('Brawl EU — texto', 'cms-quick-stat1v', (home.stats && home.stats[1]) ? home.stats[1].value : 'TOP') +
        C.fieldEasy('PLG/VFO — texto', 'cms-quick-stat2v', (home.stats && home.stats[2]) ? home.stats[2].value : '1ª') +
        C.fieldEasy('KP — texto', 'cms-quick-stat3v', (home.stats && home.stats[3]) ? home.stats[3].value : 'KP'), false);
  }

  function renderImagesEasy() {
    var o = C.load();
    var imgs = o.images || {};
    var defaultBanner = (typeof SITE !== 'undefined' && SITE.banner) ? SITE.banner : 'img/banner-oficial.png';
    return sectionHead('Logo, banner y fotos', 'Sube imágenes desde tu PC o pega un enlace. No hace falta saber código.') +
      C.stepsBox([
        'Pulsa <strong>Elegir archivo</strong> y selecciona la foto de tu PC.',
        'Verás un mensaje de confirmación.',
        'Pulsa <strong>💾 Guardar todo</strong> arriba a la derecha.',
        '¡Listo! La web mostrará tu imagen.'
      ]) +
      '<div class="cms-upload-grid">' +
        '<div class="cms-upload-box">' +
          '<p class="cms-upload-title">🦊 Logo del club</p>' +
          '<p class="cms-upload-desc">Aparece en la cabecera, loader y portada.</p>' +
          C.fieldEasy('Enlace (opcional)', 'cms-img-logo', C.safeImageFieldValue(imgs.logo, ''), { full: true, placeholder: 'https://... o sube archivo abajo' }) +
          '<label class="cms-upload-btn"><span>📁 Elegir logo de mi PC</span><input type="file" id="cms-upload-logo" accept="image/*"></label>' +
        '</div>' +
        '<div class="cms-upload-box cms-upload-box--banner">' +
          '<p class="cms-upload-title">🖼️ Banner portada</p>' +
          '<p class="cms-upload-desc">Imagen grande de fondo en Inicio.</p>' +
          C.fieldEasy('Enlace (opcional)', 'cms-img-banner', C.safeImageFieldValue(imgs.banner, defaultBanner), { full: true }) +
          '<label class="cms-upload-btn"><span>📁 Elegir banner de mi PC</span><input type="file" id="cms-upload-banner" accept="image/*"></label>' +
        '</div>' +
      '</div>' +
      card('Logos de juegos (opcional)', C.fieldEasy('Brawl Stars', 'cms-img-brawl', C.safeImageFieldValue(imgs.brawl, '')) +
        C.fieldEasy('Clash Royale', 'cms-img-clash', C.safeImageFieldValue(imgs.clash, '')) +
        C.fieldEasy('EA Sports FC', 'cms-img-eafc', C.safeImageFieldValue(imgs.eafc, '')), false) +
      C.helpBox('Tamaño recomendado', 'Banner: 1920×1080 px · Logo: cuadrado 500×500 px mínimo.', 'tip');
  }

  function renderTickerEasy() {
    var site = C.load().site || {};
    var news = C.load().news || {};
    return sectionHead('Ticker & avisos', 'La frase que corre en la barra naranja de arriba.') +
      C.textareaEasy('Ticker EN VIVO (todas las páginas)', 'cms-ticker-breaking', site.tickerBreaking || (typeof SITE !== 'undefined' ? SITE.tickerBreaking : ''), {
        rows: 3,
        where: 'Barra bajo el menú principal',
        hint: 'Corta y directa. Incluye fecha/hora del partido si quieres.'
      }) +
      C.fieldEasy('Noticia última hora (página Noticias)', 'cms-news-breaking-quick', news.breaking || (typeof NEWS !== 'undefined' ? NEWS.breaking : ''), {
        full: true,
        where: 'Cabecera de la página Noticias',
        hint: 'Opcional. Déjalo vacío si no hay breaking.'
      });
  }

  function renderHomeEasy() {
    var home = C.load().home || {};
    var portada = home.portada || {};
    var stats = home.stats || [
      { value: '43', label: 'Jugadores' },
      { value: 'TOP', label: 'Brawl EU' },
      { value: '1ª', label: 'PLG / VFO' },
      { value: 'KP', label: 'Comunidad' }
    ];
    var spotlight = home.spotlight || [
      { eyebrow: 'Zona Comunidad', title: 'Kitsune Points', text: 'Minijuegos, predicciones, Like/RT en X y tienda con camisetas, gorras y merch real.', link: 'Entrar y jugar →' },
      { eyebrow: 'Matchday', title: 'Calendario oficial', text: 'VPG Zero Masters, PLG, VFO, scrims Brawl y Supremacy CR — rivales reales cada semana.', link: 'Ver partidos →' },
      { eyebrow: 'Plantillas', title: '43 jugadores', text: 'Brawl Stars, Clash Royale y Clubes Pro FC26 — rosters completos y fichas detalladas.', link: 'Ver equipos →' }
    ];

    var html = sectionHead('Portada / Inicio', 'Hero portada pro (dos columnas): logo, disciplinas, 4 stats, panel partido y tarjetas spotlight.') +
      C.helpBox('Importante', 'Después de editar, pulsa <strong>💾 Guardar todo</strong>. Si no guardas, se pierden los cambios.', 'warn');

    html += card('🎯 Hero — columna izquierda', C.fieldEasy('Disciplinas (bajo LYOKFOX)', 'cms-home-disciplines', home.disciplines || 'Brawl Stars · Clash Royale · Clubes Pro', {
        where: 'Bajo el título LYOKFOX',
        full: true
      }) +
      C.fieldEasy('Tagline (frase principal)', 'cms-home-tagline', portada.tagline || home.tagline || '', {
        where: 'Frase bajo disciplinas',
        full: true
      }) +
      C.fieldEasy('Botón naranja — texto', 'cms-home-cta1', portada.ctaPrimary || home.ctaPrimary || 'Comunidad', { where: 'Botón principal' }) +
      C.fieldEasy('Botón gris — texto', 'cms-home-cta2', portada.ctaSecondary || home.ctaSecondary || 'Equipos', { where: 'Botón secundario' }), true);

    html += card('📊 Stats del hero (4 cifras)', stats.map(function (s, i) {
      var labels = ['Jugadores', 'Brawl EU', 'PLG / VFO', 'Comunidad'];
      return C.fieldEasy('Número — ' + (s.label || labels[i]), 'cms-home-stat-v-' + i, s.value, { where: 'Fila de stats bajo tagline' }) +
        C.fieldEasy('Etiqueta — ' + (labels[i] || (i + 1)), 'cms-home-stat-l-' + i, s.label || labels[i]);
    }).join(''), false);

    html += card('🔗 Partido destacado', C.helpBox('', 'Rival, fecha y hora → <button type="button" class="cms-inline-link" data-goto="schedule">Calendario</button> o <button type="button" class="cms-inline-link" data-goto="quick">Edición rápida</button>. Aparece en el panel derecho del hero.', 'tip'), false);

    spotlight.forEach(function (sp, i) {
      var names = ['Tarjeta Comunidad / KP', 'Tarjeta Matchday', 'Tarjeta Equipos'];
      html += card('🃏 ' + (names[i] || ('Tarjeta ' + (i + 1))), C.fieldEasy('Etiqueta pequeña', 'cms-home-sp-' + i + '-eyebrow', sp.eyebrow, { where: 'Sección spotlight · 3 tarjetas' }) +
        C.fieldEasy('Título', 'cms-home-sp-' + i + '-title', sp.title) +
        C.textareaEasy('Descripción', 'cms-home-sp-' + i + '-text', sp.text, { rows: 3, full: true }) +
        C.fieldEasy('Texto del enlace', 'cms-home-sp-' + i + '-link', sp.link, { hint: 'Ej: Entrar y jugar →' }), i === 0);
    });

    html += C.helpBox('Más bloques de Inicio', 'KP, marcas, calendario, disciplinas y noticias → <button type="button" class="cms-inline-link" data-goto="home-sections">Inicio · bloques inferiores</button>.', 'info');
    return html;
  }

  function renderBrandEasy() {
    var site = C.load().site || {};
    return sectionHead('Marca del club', 'Nombre, contacto y moneda Kitsune Points.') +
      C.fieldEasy('Nombre del club', 'cms-site-name', site.name || (typeof SITE !== 'undefined' ? SITE.name : ''), { where: 'Cabecera, título pestaña, footer' }) +
      C.fieldEasy('Lema corto', 'cms-site-tagline', site.tagline || (typeof SITE !== 'undefined' ? SITE.tagline : ''), { where: 'Varios sitios de la web' }) +
      C.fieldEasy('Email de contacto', 'cms-site-email', site.email || (typeof SITE !== 'undefined' ? SITE.email : ''), { where: 'Página Contáctanos y footer' }) +
      C.fieldEasy('Año de fundación', 'cms-site-est', site.est || (typeof SITE !== 'undefined' ? SITE.est : ''), { type: 'number', where: 'Textos "Est. 2020"' }) +
      card('💰 Moneda Kitsune Points (KP)', C.fieldEasy('Nombre completo', 'cms-points-name', (site.points && site.points.name) || 'Kitsune Points', { where: 'Comunidad, portada' }) +
        C.fieldEasy('Abreviatura', 'cms-points-short', (site.points && site.points.short) || 'KP', { where: 'Iconos y badges KP' }) +
        C.fieldEasy('Frase de la moneda', 'cms-points-motto', (site.points && site.points.motto) || '', { where: 'Zona Comunidad', full: true }), true) +
      card('🌐 Redes sociales', C.fieldEasy('Twitter / X @LyokFox_', 'cms-social-twitter', (C.load().social && C.load().social.twitter) || (typeof SITE !== 'undefined' ? SITE.social.twitter : ''), { full: true }) +
        C.fieldEasy('Instagram', 'cms-social-instagram', (C.load().social && C.load().social.instagram) || '') +
        C.fieldEasy('Cuenta Fans @Lyokfox_Fans', 'cms-social-fans', (C.load().social && C.load().social.fans) || ''), true);
  }

  function renderBackupEasy() {
    return sectionHead('Copia de seguridad', 'Guarda tus cambios en un archivo por si acaso.') +
      C.stepsBox([
        'Pulsa <strong>📥 Descargar copia de seguridad</strong> — se guarda un archivo en tu PC.',
        'Guárdalo en Drive, USB o donde quieras.',
        'Para recuperar: menú <em>Copia de seguridad</em> → elige el archivo → <em>Restaurar copia</em>.',
        'Para volver al contenido original de fábrica: <em>Restaurar web original</em>.'
      ]) +
      '<div class="cms-studio-actions cms-studio-actions--big">' +
        '<button type="button" class="btn btn-primary" id="cms-export">📥 Descargar copia de seguridad</button>' +
        '<button type="button" class="btn btn-glass cms-danger" id="cms-reset">🗑️ Restaurar web original</button>' +
      '</div>' +
      C.helpBox('Restaurar copia', 'Elige el archivo <strong>.lyokfox-backup</strong> que descargaste. Sin copiar ni pegar texto.', 'info') +
      '<label class="cms-field cms-field-full cms-backup-file"><span>Archivo de copia LyokFox</span><input type="file" id="cms-import-file" accept=".lyokfox-backup,.json,application/octet-stream"></label>' +
      '<button type="button" class="btn btn-primary btn-sm" id="cms-import">📤 Restaurar copia y recargar</button>' +
      card('🔐 Cambiar PIN de acceso', C.fieldEasy('Nuevo PIN (opcional)', 'cms-new-pin', '', { type: 'password', hint: 'Por defecto: lyokfox. Déjalo vacío si no quieres cambiarlo.' }), false) +
      C.helpBox('PIN actual', 'Clave por defecto: <strong>lyokfox</strong>. Si la olvidas, pulsa Restaurar PIN en la pantalla de acceso.', 'info');
  }

  function renderDashboardEasy() {
    var articles = (typeof NEWS !== 'undefined' && NEWS.articles) ? NEWS.articles.length : 0;
    var players = 0;
    if (typeof ROSTERS !== 'undefined') {
      players = (ROSTERS.brawlStars || []).length + (ROSTERS.clashRoyale || []).length + (ROSTERS.clubesPro || []).length;
    }
    return sectionHead('¡Hola! Bienvenido al Studio LyokFox', 'Edita toda la web sin programar. Elige qué quieres cambiar:') +
      C.helpBox('Recuerda', 'Siempre pulsa <strong>💾 Guardar todo</strong> (arriba a la derecha) cuando termines.', 'info') +
      '<div class="cms-task-grid cms-task-grid--hero">' +
        C.taskCard('🗺️', 'Mapa 100% web', 'Edita TODA la web', 'ult-map') +
        C.taskCard('📖', 'Guía paso a paso', 'Si es tu primera vez, empieza aquí', 'guide') +
        C.taskCard('⚡', 'Edición rápida', 'Ticker, partido y portada en 2 minutos', 'quick') +
        C.taskCard('🖼️', 'Logo y banner', 'Sube fotos desde tu PC', 'images-easy') +
        C.taskCard('🎨', 'Todos los iconos', 'Portada · pie · juegos', 'prem-icons') +
        C.taskCard('📰', 'Noticias', articles + ' artículos · crear o editar', 'news') +
        C.taskCard('🎮', 'Jugadores', players + ' jugadores · fichas', 'players') +
        C.taskCard('✨', 'Portada completa', 'Banner, stats, tarjetas', 'home') +
        C.taskCard('🎯', 'Misiones KP', 'Recompensas comunidad', 'comm-missions') +
        C.taskCard('🛒', 'Tienda', 'Premios canjeables', 'comm-shop') +
      '</div>' +
      '<div class="cms-studio-stats">' +
        '<div class="cms-studio-stat"><strong>' + articles + '</strong><span>Noticias</span></div>' +
        '<div class="cms-studio-stat"><strong>' + players + '</strong><span>Jugadores</span></div>' +
        '<div class="cms-studio-stat"><strong>3</strong><span>Equipos</span></div>' +
        '<div class="cms-studio-stat"><strong>KP</strong><span>Comunidad</span></div>' +
      '</div>';
  }

  function renderScheduleEasy() {
    return null; /* usa el de cms-studio.js pero podemos wrap - skip for now */
  }

  var RENDERERS = {
    'guide': renderGuide,
    'quick': renderQuick,
    'images-easy': renderImagesEasy,
    'ticker-easy': renderTickerEasy,
    'home': renderHomeEasy,
    'brand': renderBrandEasy,
    'backup-easy': renderBackupEasy,
    'dashboard': renderDashboardEasy,
    'advanced': renderBackupEasy
  };

  function collectEasy(o) {
    if (document.getElementById('cms-quick-ticker')) {
      o.site = o.site || {};
      o.site.tickerBreaking = val('cms-quick-ticker');
    }
    if (document.getElementById('cms-quick-rival')) {
      o.schedule = o.schedule || JSON.parse(JSON.stringify(typeof SCHEDULE !== 'undefined' ? SCHEDULE : { featured: {}, upcoming: [] }));
      o.schedule.featured = o.schedule.featured || {};
      o.schedule.featured.opponent = val('cms-quick-rival');
      o.schedule.featured.competition = val('cms-quick-comp');
      o.schedule.featured.date = val('cms-quick-date');
      o.schedule.featured.time = val('cms-quick-time');
    }
    if (document.getElementById('cms-quick-disciplines') || document.getElementById('cms-quick-tagline')) {
      o.home = o.home || {};
      if (document.getElementById('cms-quick-disciplines')) o.home.disciplines = val('cms-quick-disciplines');
      o.home.tagline = val('cms-quick-tagline');
      o.home.ctaPrimary = val('cms-quick-cta1');
      o.home.ctaSecondary = val('cms-quick-cta2');
      if (document.getElementById('cms-quick-stat0v')) {
        o.home.stats = [
          { value: val('cms-quick-stat0v'), label: 'Jugadores' },
          { value: val('cms-quick-stat1v'), label: 'Brawl EU' },
          { value: val('cms-quick-stat2v'), label: 'PLG / VFO' },
          { value: val('cms-quick-stat3v'), label: 'Comunidad' }
        ];
      }
    }
    if (document.getElementById('cms-news-breaking-quick')) {
      o.news = o.news || {};
      o.news.breaking = val('cms-news-breaking-quick');
    }
    if (document.getElementById('cms-home-disciplines')) {
      o.home = o.home || {};
      o.home.disciplines = val('cms-home-disciplines');
    }
    return o;
  }

  function bindEasy(id) {
    document.querySelectorAll('.cms-inline-link[data-goto]').forEach(function (btn) {
      btn.onclick = function () {
        if (window.CMSStudio && window.CMSStudio.goto) window.CMSStudio.goto(btn.dataset.goto);
      };
    });
    if (id === 'images-easy' || id === 'media') bindUploads();
  }

  function bindUploads() {
    function fileToDataUrl(inputId, targetKey) {
      var input = document.getElementById(inputId);
      if (!input || !input.files[0]) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        var o = C.load();
        o.images = o.images || {};
        o.images[targetKey] = e.target.result;
        C.save(o);
        var f = document.getElementById('cms-img-' + targetKey);
        if (f) f.value = '[archivo subido — pulsa Guardar todo]';
        C.toast('✅ Imagen lista — ahora pulsa 💾 Guardar todo');
      };
      reader.readAsDataURL(input.files[0]);
    }
    var uploadLogo = document.getElementById('cms-upload-logo');
    if (uploadLogo) uploadLogo.onchange = function () { fileToDataUrl('cms-upload-logo', 'logo'); };
    var uploadBanner = document.getElementById('cms-upload-banner');
    if (uploadBanner) uploadBanner.onchange = function () { fileToDataUrl('cms-upload-banner', 'banner'); };
  }

  window.CMSStudioEasy = {
    nav: EASY_NAV,
    render: function (id) {
      if (RENDERERS[id]) return RENDERERS[id]();
      return null;
    },
    collect: collectEasy,
    bind: bindEasy,
    bindUploads: bindUploads
  };
})();
