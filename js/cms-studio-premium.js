/* LyokFox Studio PREMIUM — visibilidad, cabecera, textos sponsor, hub central */
(function () {
  'use strict';
  if (typeof window.CMS === 'undefined') return;
  var C = window.CMS;

  var NAV_KEYS = [
    { key: 'inicio', label: 'Inicio' },
    { key: 'comunidad', label: 'Comunidad' },
    { key: 'noticias', label: 'Noticias' },
    { key: 'historia', label: 'Historia' },
    { key: 'equipos', label: 'Equipos' },
    { key: 'sponsor', label: 'Sponsor' },
    { key: 'contacto', label: 'Contáctanos' }
  ];

  var PAGE_BLOCKS = {
    inicio: [
      { id: 'hero', label: 'Hero portada pro (banner + logo + stats)' },
      { id: 'spotlight', label: 'Tarjetas spotlight (3)' },
      { id: 'brands', label: 'Franja logos de juegos' },
      { id: 'kp', label: 'Bloque Kitsune Points' },
      { id: 'matchday', label: 'Calendario matchday' },
      { id: 'games', label: 'Tarjetas de disciplinas' },
      { id: 'newsTeaser', label: 'Últimas noticias (teaser)' }
    ],
    equipos: [
      { id: 'eqStats', label: 'Franja estadísticas' },
      { id: 'eqBrawl', label: 'División Brawl Stars' },
      { id: 'eqClash', label: 'División Clash Royale' },
      { id: 'eqEafc', label: 'División Clubes Pro' },
      { id: 'eqStaff', label: 'Bloque Staff' },
      { id: 'eqCta', label: 'CTA inferior' }
    ],
    sponsor: [
      { id: 'spPitch', label: 'Por qué LyokFox' },
      { id: 'spImpact', label: 'Impacto medible' },
      { id: 'spAch', label: 'Palmarés sponsor' },
      { id: 'spPackages', label: 'Paquetes' },
      { id: 'spDeliver', label: 'Entregables' },
      { id: 'spAudience', label: 'Audiencia' },
      { id: 'spProcess', label: 'Proceso' },
      { id: 'spPartners', label: 'Ligas y partners' },
      { id: 'spDossier', label: 'Bloque dossier' },
      { id: 'spFanCta', label: 'CTA fans / comunidad' }
    ],
    historia: [
      { id: 'histIntro', label: 'Introducción y origen' },
      { id: 'histChapters', label: 'Capítulos (cuerpo)' },
      { id: 'histMilestones', label: 'Hitos cronología' }
    ],
    contacto: [
      { id: 'conForm', label: 'Formulario de contacto' },
      { id: 'conCta', label: 'CTA premios / comunidad' }
    ],
    noticias: [
      { id: 'newsHero', label: 'Hero noticias (banner + stats)' },
      { id: 'newsBreaking', label: 'Barra última hora' },
      { id: 'newsFeed', label: 'Feed de artículos' },
      { id: 'newsCta', label: 'CTA hacia Comunidad' }
    ],
    cuenta: [
      { id: 'cuentaForm', label: 'Formulario perfil' }
    ],
    comunidad: [
      { id: 'commHero', label: 'Hero comunidad (banner + stats)' },
      { id: 'commHub', label: 'Barra progreso y pestañas' },
      { id: 'commEarn', label: 'Franja formas de ganar KP' },
      { id: 'commSocial', label: 'Pestaña Redes' },
      { id: 'commShop', label: 'Pestaña Tienda' },
      { id: 'commGames', label: 'Pestaña Juegos' },
      { id: 'commPred', label: 'Pestaña Predicciones' },
      { id: 'commMissions', label: 'Pestaña Misiones' },
      { id: 'commRanking', label: 'Pestaña Ranking' }
    ]
  };

  function val(id) {
    var el = document.getElementById(id);
    return el ? String(el.value).trim() : '';
  }

  function chk(id) {
    var el = document.getElementById(id);
    return el ? !!el.checked : true;
  }

  function head(title, desc) {
    return '<header class="cms-studio-section-head cms-studio-section-head--premium">' +
      '<h2>' + title + '</h2>' +
      (desc ? '<p>' + desc + '</p>' : '') +
      '</header>';
  }

  function card(title, body, open) {
    return '<details class="cms-studio-card cms-studio-card--premium"' + (open ? ' open' : '') + '>' +
      '<summary>' + title + '</summary><div class="cms-studio-card-body">' + body + '</div></details>';
  }

  function getVis() {
    return C.load().visibility || {};
  }

  function getSec(key) {
    var s = C.load().sponsorSections || {};
    return s[key] || {};
  }

  function secFields(prefix, sec, defaults) {
    var d = defaults || {};
    return C.fieldEasy('Texto pequeño arriba', prefix + '-eyebrow', sec.eyebrow || d.eyebrow || '') +
      C.fieldEasy('Título (puedes usar <em>)</em>', prefix + '-title', sec.title || d.title || '', { full: true }) +
      C.textareaEasy('Subtítulo', prefix + '-sub', sec.sub || d.sub || '', { rows: 2, full: true });
  }

  function iconFieldVal(icons, imgs, key) {
    var v = (icons && icons[key]) || (imgs && imgs[key]) || '';
    return C.safeImageFieldValue(v, '');
  }

  function renderIconsEditor() {
    var o = C.load();
    var icons = o.icons || {};
    var imgs = o.images || {};
    var defs = C.ICON_DEFS || [];
    var html = head('Iconos e imágenes', 'Logos, favicon, portada, juegos, pie de página y minijuegos — enlace o subir archivo.') +
      C.helpBox('Consejo', 'Pega un enlace de internet o sube una imagen. Si lo dejas vacío, se usa la del club.', 'tip');

    var groups = {};
    defs.forEach(function (d) {
      if (!groups[d.group]) groups[d.group] = [];
      groups[d.group].push(d);
    });

    Object.keys(groups).forEach(function (g, gi) {
      var inner = groups[g].map(function (d) {
        var val = iconFieldVal(icons, imgs, d.key);
        var preview = val && val.indexOf('[imagen') !== 0 && (val.indexOf('data:') === 0 || /^https?:\/\//i.test(val) || val.indexOf('img/') === 0)
          ? '<div class="cms-icon-preview"><img src="' + C.escAttr(val) + '" alt="Vista previa"></div>' : '';
        return '<div class="cms-icon-field">' +
          C.fieldEasy(d.label, 'prem-icon-' + d.key, val, { full: true, hint: d.hint || 'Enlace o archivo de imagen' }) +
          preview +
          '<label class="cms-field cms-field-upload"><span>Subir imagen</span><input type="file" accept="image/*" data-prem-icon-upload="' + d.key + '"></label>' +
          '</div>';
      }).join('');
      html += card(g, inner, gi === 0);
    });
    return html;
  }

  var iconUploadBound = false;

  function bindIconUploads() {
    if (iconUploadBound) return;
    iconUploadBound = true;
    document.addEventListener('change', function (e) {
      var input = e.target;
      if (!input.getAttribute || !input.getAttribute('data-prem-icon-upload')) return;
      var key = input.getAttribute('data-prem-icon-upload');
      if (!input.files || !input.files[0]) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        var o = C.load();
        o.icons = o.icons || {};
        o.icons[key] = ev.target.result;
        if (['logo', 'banner', 'favicon', 'brawl', 'clash', 'eafc'].indexOf(key) >= 0) {
          o.images = o.images || {};
          o.images[key] = ev.target.result;
        }
        C.save(o);
        var field = document.getElementById('prem-icon-' + key);
        if (field) field.value = '[imagen subida]';
        C.toast('Imagen lista — pulsa Guardar todo');
      };
      reader.readAsDataURL(input.files[0]);
      input.value = '';
    });
  }

  function collectIcons(o) {
    if (!document.getElementById('prem-icon-logo')) return o;
    o.icons = o.icons || {};
    (C.ICON_DEFS || []).forEach(function (d) {
      var v = val('prem-icon-' + d.key);
      if (v && v.indexOf('[imagen') !== 0) o.icons[d.key] = v;
      else delete o.icons[d.key];
    });
    o.images = o.images || {};
    ['logo', 'banner', 'favicon', 'brawl', 'clash', 'eafc'].forEach(function (k) {
      if (o.icons[k]) o.images[k] = o.icons[k];
    });
    return o;
  }

  function renderPremiumHub() {
    return head('Studio Premium', 'Todo lo que ves en la web se edita aquí con formularios visuales — sin código ni pegar datos.') +
      C.helpBox('Cómo funciona', 'Elige una categoría en el menú. Cambia textos, jugadores, noticias o <strong>oculta secciones</strong> con los interruptores. Pulsa <strong>Guardar cambios</strong> arriba.', 'tip') +
      '<div class="cms-premium-hub">' +
        C.taskCard('👥', '43 Jugadores', 'Rosters Brawl · Clash · FC26', 'players') +
        C.taskCard('📅', 'Calendario', 'Matchday + partidos', 'schedule') +
        C.taskCard('📰', 'Noticias', 'Todos los artículos', 'news') +
        C.taskCard('📜', 'Historia ×10', 'Capítulos completos', 'historia-completa') +
        C.taskCard('💼', 'Sponsor', 'Paquetes + textos', 'prem-sponsor-texts') +
        C.taskCard('🖼️', 'Iconos & imágenes', 'Logos, favicon, UI', 'prem-icons') +
        C.taskCard('👁️', 'Ocultar secciones', 'Bloques por página', 'prem-visibility') +
        C.taskCard('🧭', 'Menú · cabecera', 'Orden y nombres', 'prem-header') +
        C.taskCard('📄', 'Textos por página', 'Héroes de las 8 páginas', 'pages') +
        C.taskCard('✨', 'Portada', 'Banner, stats, spotlight', 'home') +
        C.taskCard('🌐', 'Comunidad', 'Misiones, tienda, juegos', 'comm-missions') +
      '</div>';
  }

  function getNavOrder() {
    var site = C.load().site || {};
    var order = (site.navOrder && site.navOrder.length) ? site.navOrder.slice() : null;
    if (!order && typeof SITE !== 'undefined' && SITE.navOrder) order = SITE.navOrder.slice();
    if (!order) order = NAV_KEYS.map(function (n) { return n.key; });
    NAV_KEYS.forEach(function (n) {
      if (order.indexOf(n.key) < 0) order.push(n.key);
    });
    return order;
  }

  function renderNavOrderEditor() {
    var order = getNavOrder();
    var vis = getVis();
    var g = vis.global || {};
    var labels = (C.load().site || {}).pageLabels || (typeof SITE !== 'undefined' ? SITE.pageLabels : {}) || {};
    var items = order.map(function (key) {
      var def = NAV_KEYS.find(function (n) { return n.key === key; }) || { key: key, label: key };
      var on = g['nav_' + key] !== false;
      return '<li class="cms-nav-order-item" data-nav-key="' + key + '">' +
        '<div class="cms-nav-order-move">' +
          '<button type="button" class="cms-nav-order-btn" data-nav-move="up" title="Subir">↑</button>' +
          '<button type="button" class="cms-nav-order-btn" data-nav-move="down" title="Bajar">↓</button>' +
        '</div>' +
        '<div class="cms-nav-order-fields">' +
          '<label class="cms-field cms-field-compact"><span>' + def.label + '</span>' +
            '<input type="text" id="prem-nav-label-' + key + '" value="' + C.escAttr(labels[key] || def.label) + '">' +
          '</label>' +
          '<label class="cms-vis-row cms-vis-row--inline">' +
            '<input type="checkbox" id="prem-vis-nav-' + key + '"' + (on ? ' checked' : '') + '>' +
            '<span>Visible en menú</span>' +
          '</label>' +
        '</div>' +
      '</li>';
    }).join('');
    return card('Orden del menú (cabecera y pie)', '' +
      C.helpBox('Cómo funciona', 'Usa ↑ ↓ para cambiar el orden. El primer enlace aparece más a la izquierda. Desmarca <strong>Visible</strong> para ocultar esa página del menú (la página sigue existiendo).', 'tip') +
      '<ol class="cms-nav-order-list" id="prem-nav-order-list">' + items + '</ol>', true);
  }

  function renderVisibility() {
    var vis = getVis();
    var g = vis.global || {};
    var html = head('Mostrar u ocultar secciones', 'Oculta bloques de cada página y elementos globales de la cabecera.') +
      card('Cabecera global', '' +
        toggleRow('prem-vis-ticker', 'Barra EN VIVO (ticker)', g.ticker !== false) +
        toggleRow('prem-vis-profile', 'Botón perfil / KP', g.headerProfile !== false) +
        toggleRow('prem-vis-auth', 'Enlace Entrar / Mi cuenta', g.headerAuth !== false), true);

    html += C.helpBox('Menú de páginas', 'El orden y qué enlaces se ven está en <strong>Cabecera & menú → Orden del menú</strong>.', 'info');

    Object.keys(PAGE_BLOCKS).forEach(function (pageKey) {
      var blocks = PAGE_BLOCKS[pageKey];
      var pageVis = vis[pageKey] || {};
      var inner = blocks.map(function (b) {
        return toggleRow('prem-vis-' + pageKey + '-' + b.id, b.label, pageVis[b.id] !== false);
      }).join('');
      html += card('Página · ' + pageKey, inner, pageKey === 'inicio');
    });

    return html;
  }

  function toggleRow(id, label, checked) {
    return '<label class="cms-vis-row">' +
      '<input type="checkbox" id="' + id + '"' + (checked ? ' checked' : '') + '>' +
      '<span>' + label + '</span></label>';
  }

  function renderHeaderEditor() {
    var layout = C.load().layout || {};
    var site = C.load().site || {};
    var html = head('Cabecera, menú y pie', 'Orden del menú, nombres de enlaces, ticker y textos del footer.') +
      renderNavOrderEditor() +
      card('Marca en cabecera', '' +
        C.fieldEasy('Texto loader', 'prem-layout-loader', layout.loaderText || 'LYOKFOX') +
        C.fieldEasy('Badge EN VIVO', 'prem-layout-live', layout.liveBadge || 'EN VIVO') +
        C.fieldEasy('Nombre marca (LYOKFOX)', 'prem-layout-brand', layout.brandName || 'LYOKFOX') +
        C.fieldEasy('Año copyright', 'prem-layout-year', layout.copyrightYear || '2020'), true) +
      card('Pie de página', '' +
        C.textareaEasy('Texto copyright / pie', 'prem-layout-footer', layout.footerCopy || '', { rows: 2, full: true }) +
        C.fieldEasy('Nota panel perfil', 'prem-layout-profile-note', layout.profileNote || ''), false);

    html += card('Ticker breaking (texto deslizante)', C.textareaEasy('Mensaje ticker', 'prem-site-ticker', site.tickerBreaking || (typeof SITE !== 'undefined' ? SITE.tickerBreaking : ''), { rows: 2, full: true }), false);

    return html;
  }

  function renderSponsorTexts() {
    var s = C.load().sponsorSections || {};
    var html = head('Sponsor — todos los textos', 'Títulos de cada bloque de la página Patrocinio. El contenido (stats, paquetes…) se edita en Sponsor completo.') +
      card('Hero portada', '' +
        C.fieldEasy('Texto pequeño del hero', 'prem-sp-hero-eyebrow', s.heroEyebrow || 'Patrocinio & partners') +
        C.fieldEasy('Botón dossier', 'prem-sp-hero-btn1', s.heroBtn1 || 'Solicitar dossier') +
        C.fieldEasy('Botón paquetes', 'prem-sp-hero-btn2', s.heroBtn2 || 'Ver paquetes'), true) +
      card('Por qué LyokFox', secFields('prem-sp-why', getSec('why'), {
        eyebrow: 'Por qué LyokFox',
        title: '¿Por qué <em>unirse</em> a la camada?',
        sub: 'Marcas que buscan esports ibérico serio: competición, comunidad y retorno medible — sin humo.'
      }), false) +
      card('Impacto', secFields('prem-sp-impact', getSec('impact'), {
        eyebrow: 'Alcance', title: 'Impacto <em>medible</em>', sub: 'Datos reales de comunidad, redes y calendario competitivo.'
      }), false) +
      card('Palmarés', secFields('prem-sp-ach', getSec('achievements'), {
        eyebrow: 'Palmarés', title: 'Logros que <em>respaldan</em> tu inversión', sub: 'Hitos oficiales en Brawl Stars, Pokémon UNITE y Clubes Pro.'
      }), false) +
      card('Paquetes', secFields('prem-sp-pkg', getSec('packages'), {
        eyebrow: 'Paquetes', title: 'Elige tu <em>nivel</em> Kitsune', sub: 'Desde presencia digital hasta main partner.'
      }), false) +
      card('Entregables', secFields('prem-sp-del', getSec('deliverables'), {
        eyebrow: 'Entregables', title: 'Qué <em>incluye</em> colaborar', sub: 'Canales donde tu marca aparece con el club.'
      }), false) +
      card('Audiencia', secFields('prem-sp-aud', getSec('audience'), {
        eyebrow: 'Audiencia', title: 'A quién <em>llegas</em>', sub: 'Perfil demográfico y hábitos de la camada Indomables.'
      }), false) +
      card('Proceso', secFields('prem-sp-proc', getSec('process'), {
        eyebrow: 'Proceso', title: 'Cómo <em>cerramos</em> un acuerdo', sub: 'Cuatro pasos claros desde el primer email.'
      }), false) +
      card('Partners', secFields('prem-sp-part', getSec('partners'), {
        eyebrow: 'Ecosistema', title: 'Ligas y <em>partners</em> actuales', sub: 'Competimos con las referencias del esports ibérico.'
      }), false) +
      card('Dossier', secFields('prem-sp-dossier', getSec('dossier'), {
        title: 'Solicita el <em>dossier comercial</em>',
        sub: 'Media kit PDF, calendario matchday, tarifas detalladas. Respuesta en 48 h.'
      }) +
        C.textareaEasy('Tags dossier (uno por línea)', 'prem-sp-dossier-tags', arrToLines(getSec('dossier').tags || ['VPG · PLG · VFO', '43 jugadores', 'Reporting mensual', 'Activaciones KP']), { rows: 3 }), false) +
      card('CTA fans', secFields('prem-sp-fan', getSec('fanCta'), {
        eyebrow: 'Camada', title: '¿Eres <em>fan</em> del club?', sub: 'La Zona Comunidad es para la afición.'
      }) +
        C.fieldEasy('Botón comunidad', 'prem-sp-fan-btn1', (getSec('fanCta').btn1 || 'Zona Comunidad')) +
        C.fieldEasy('Botón historia', 'prem-sp-fan-btn2', (getSec('fanCta').btn2 || 'Nuestra historia')), false);

    return html;
  }

  function arrToLines(arr) {
    return (arr || []).join('\n');
  }

  function linesToArr(text) {
    return text ? text.split('\n').map(function (s) { return s.trim(); }).filter(Boolean) : [];
  }

  function collectSection(prefix) {
    if (!document.getElementById(prefix + '-title')) return null;
    return {
      eyebrow: val(prefix + '-eyebrow'),
      title: val(prefix + '-title'),
      sub: val(prefix + '-sub')
    };
  }

  function collect(o) {
    if (document.getElementById('prem-vis-ticker')) {
      o.visibility = o.visibility || {};
      o.visibility.global = o.visibility.global || {};
      o.visibility.global.ticker = chk('prem-vis-ticker');
      o.visibility.global.headerProfile = chk('prem-vis-profile');
      if (document.getElementById('prem-vis-auth')) {
        o.visibility.global.headerAuth = chk('prem-vis-auth');
      }
      NAV_KEYS.forEach(function (n) {
        var el = document.getElementById('prem-vis-nav-' + n.key);
        if (el) o.visibility.global['nav_' + n.key] = el.checked;
      });
      Object.keys(PAGE_BLOCKS).forEach(function (pageKey) {
        o.visibility[pageKey] = o.visibility[pageKey] || {};
        PAGE_BLOCKS[pageKey].forEach(function (b) {
          o.visibility[pageKey][b.id] = chk('prem-vis-' + pageKey + '-' + b.id);
        });
      });
    }

    if (document.getElementById('prem-layout-loader')) {
      o.layout = o.layout || {};
      o.layout.loaderText = val('prem-layout-loader');
      o.layout.liveBadge = val('prem-layout-live');
      o.layout.brandName = val('prem-layout-brand');
      o.layout.copyrightYear = val('prem-layout-year');
      o.layout.footerCopy = val('prem-layout-footer');
      o.layout.profileNote = val('prem-layout-profile-note');
    }

    if (document.getElementById('prem-nav-order-list')) {
      o.site = o.site || {};
      var order = [];
      document.querySelectorAll('#prem-nav-order-list li[data-nav-key]').forEach(function (li) {
        order.push(li.getAttribute('data-nav-key'));
      });
      if (order.length) o.site.navOrder = order;
      o.site.pageLabels = o.site.pageLabels || {};
      NAV_KEYS.forEach(function (n) {
        var v = val('prem-nav-label-' + n.key);
        if (v) o.site.pageLabels[n.key] = v;
      });
      var tick = val('prem-site-ticker');
      if (tick) o.site.tickerBreaking = tick;
      o.visibility = o.visibility || {};
      o.visibility.global = o.visibility.global || {};
      NAV_KEYS.forEach(function (n) {
        var el = document.getElementById('prem-vis-nav-' + n.key);
        if (el) o.visibility.global['nav_' + n.key] = el.checked;
      });
    } else if (document.getElementById('prem-nav-label-inicio')) {
      o.site = o.site || {};
      o.site.pageLabels = o.site.pageLabels || {};
      NAV_KEYS.forEach(function (n) {
        var v = val('prem-nav-label-' + n.key);
        if (v) o.site.pageLabels[n.key] = v;
      });
      var tick = val('prem-site-ticker');
      if (tick) o.site.tickerBreaking = tick;
    }

    collectIcons(o);

    if (document.getElementById('prem-sp-why-title')) {
      o.sponsorSections = o.sponsorSections || {};
      o.sponsorSections.heroEyebrow = val('prem-sp-hero-eyebrow');
      o.sponsorSections.heroBtn1 = val('prem-sp-hero-btn1');
      o.sponsorSections.heroBtn2 = val('prem-sp-hero-btn2');
      var map = {
        why: 'prem-sp-why', impact: 'prem-sp-impact', achievements: 'prem-sp-ach',
        packages: 'prem-sp-pkg', deliverables: 'prem-sp-del', audience: 'prem-sp-aud',
        process: 'prem-sp-proc', partners: 'prem-sp-part', dossier: 'prem-sp-dossier', fanCta: 'prem-sp-fan'
      };
      Object.keys(map).forEach(function (k) {
        var sec = collectSection(map[k]);
        if (sec) o.sponsorSections[k] = sec;
      });
      if (document.getElementById('prem-sp-dossier-tags')) {
        o.sponsorSections.dossier = o.sponsorSections.dossier || {};
        o.sponsorSections.dossier.tags = linesToArr(val('prem-sp-dossier-tags'));
      }
      if (document.getElementById('prem-sp-fan-btn1')) {
        o.sponsorSections.fanCta = o.sponsorSections.fanCta || {};
        o.sponsorSections.fanCta.btn1 = val('prem-sp-fan-btn1');
        o.sponsorSections.fanCta.btn2 = val('prem-sp-fan-btn2');
      }
    }

    return o;
  }

  function bindNavOrder() {
    var list = document.getElementById('prem-nav-order-list');
    if (!list || list.dataset.bound) return;
    list.dataset.bound = '1';
    list.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-nav-move]');
      if (!btn) return;
      var li = btn.closest('li');
      if (!li) return;
      var dir = btn.getAttribute('data-nav-move');
      if (dir === 'up' && li.previousElementSibling) {
        list.insertBefore(li, li.previousElementSibling);
      }
      if (dir === 'down' && li.nextElementSibling) {
        list.insertBefore(li.nextElementSibling, li);
      }
    });
  }

  window.CMSStudioPremium = {
    nav: [],
    render: function (id) {
      if (id === 'prem-hub') return renderPremiumHub();
      if (id === 'prem-icons') return renderIconsEditor();
      if (id === 'prem-visibility') return renderVisibility();
      if (id === 'prem-header') return renderHeaderEditor();
      if (id === 'prem-sponsor-texts') return renderSponsorTexts();
      return null;
    },
    collect: collect,
    bind: function (section) {
      bindIconUploads();
      bindNavOrder();
    }
  };
})();
