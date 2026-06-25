/* LyokFox Studio — textos claros (sin HTML, JSON, código…) */
(function () {
  'use strict';

  var SELECTORS = [
    '.cms-field-label',
    '.cms-field > span:first-child',
    '.cms-studio-section-head h2',
    '.cms-studio-section-head p',
    '.cms-studio-section-head--easy h2',
    '.cms-studio-section-head--easy p',
    '.cms-studio-card > summary',
    '.cms-hint',
    '.cms-field-hint',
    '.cms-field-where',
    '.cms-help-box strong',
    '.cms-help-box p',
    '.cms-task-body strong',
    '.cms-task-body em',
    '.cms-page-card-title',
    '.cms-page-card-desc',
    '.cms-studio-preview-hint',
    '.cms-studio-preview-focus',
    '.cms-studio-nav-group',
    '.cms-steps-box li div',
    '.cms-sched-section-head p'
  ];

  var PHRASES = [
    [/Eyebrow/gi, 'Texto pequeño arriba'],
    [/eyebrow/g, 'texto pequeño arriba'],
    [/Meta description/gi, 'Descripción para Google'],
    [/Meta \(número\)/gi, 'Número (likes, reposts…)'],
    [/Título \(<title>\)/gi, 'Título en la pestaña del navegador'],
    [/Título H1 \(HTML ok:[^)]*\)/gi, 'Título principal'],
    [/HTML ok con <em>/gi, 'Puedes usar texto normal'],
    [/HTML ok:\s*/gi, ''],
    [/\(HTML[^)]*\)/gi, ''],
    [/\bHTML\b/gi, ''],
    [/\bJSON\b/gi, ''],
    [/\bOAuth\b/gi, 'cuenta de X'],
    [/\bdrawer\b/gi, 'menú lateral'],
    [/\bDrawer\b/g, 'Menú lateral'],
    [/\bSEO\b/g, 'Buscadores'],
    [/\bFeatures\b/gi, 'Qué incluye'],
    [/\(about\)/gi, ''],
    [/\babout\b/gi, 'descripción'],
    [/\bLead\b/g, 'Texto principal'],
    [/URL imagen/gi, 'Imagen'],
    [/Logo URL/gi, 'Logo del club'],
    [/Banner URL/gi, 'Imagen del banner'],
    [/Favicon URL/gi, 'Icono de la pestaña'],
    [/URL o sube archivo/gi, 'Enlace o sube un archivo'],
    [/URL o ruta img[^.]*/gi, 'Enlace o archivo de imagen'],
    [/Pega una URL \(https?:\/\/[^)]*\)/gi, 'Pega un enlace de internet'],
    [/formato:\s*/gi, 'escribe así: '],
    [/Stats \(formato:[^)]*\)/gi, 'Cifras (nombre · número)'],
    [/Temas contacto \(Título \| Descripción[^)]*\)/gi, 'Temas del formulario (título · texto)'],
    [/FAQ comunidad \(q \| a[^)]*\)/gi, 'Preguntas frecuentes (pregunta · respuesta)'],
    [/Stats strip \(valor \| label[^)]*\)/gi, 'Cifras de la barra (número · texto)'],
    [/Cuerpo \(párrafos HTML[^)]*\)/gi, 'Texto completo del artículo'],
    [/Bloque origen — párrafos HTML/gi, 'Origen de LyokFox — párrafos'],
    [/Ticker breaking/gi, 'Mensaje en barra naranja'],
    [/Última hora \/ breaking/gi, 'Noticia de última hora'],
    [/Label avatar URL/gi, 'Foto de perfil (enlace)'],
    [/Descripción OAuth/gi, 'Texto al vincular X'],
    [/Nota OAuth/gi, 'Nota sobre vincular X'],
    [/Hint resumen/gi, 'Texto bajo las cifras'],
    [/Hint Brawl/gi, 'Ayuda en Brawl Stars'],
    [/Hint Clash/gi, 'Ayuda en Clash Royale'],
    [/Hint EAFC/gi, 'Ayuda en Clubes Pro'],
    [/CTA eyebrow/gi, 'Texto pequeño del botón final'],
    [/KP section eyebrow/gi, 'Texto pequeño sección KP'],
    [/Partners grid \(formato:[^)]*\)/gi, 'Lista de partners (tipo · nombre · texto)'],
    [/Labels marcas \(Brawl \| Clash[^)]*\)/gi, 'Nombres de juegos (uno por línea)'],
    [/Equipos SITE\.teams/gi, 'Nombres de equipos'],
    [/Paquetes y cita/gi, 'Paquetes y frase comercial'],
    [/Editor 100%/gi, 'Editor completo'],
    [/noticias\.html/gi, 'página Noticias'],
    [/index\.html/gi, 'página Inicio'],
    [/login\.html/gi, 'página Entrar'],
    [/contactanos\.html/gi, 'página Contacto'],
    [/equipos\.html/gi, 'página Equipos'],
    [/comunidad\.html/gi, 'página Comunidad'],
    [/sponsor\.html/gi, 'página Sponsor'],
    [/historia\.html/gi, 'página Historia'],
    [/cuenta\.html/gi, 'página Mi cuenta'],
    [/\.lyokfox-backup/gi, 'archivo de copia LyokFox'],
    [/application\/octet-stream/gi, ''],
    [/,\s*\.json/gi, ''],
    [/Banner por defecto:\s*<strong>[^<]*<\/strong>/gi, 'Si no subes banner, se usa el del club.'],
    [/\s+\|\s+/g, ' · '],
    [/\s{2,}/g, ' ']
  ];

  function humanize(text) {
    if (!text || typeof text !== 'string') return text;
    var out = text;
    PHRASES.forEach(function (pair) {
      out = out.replace(pair[0], pair[1]);
    });
    return out.replace(/\s+([,.])/g, '$1').replace(/\(\s*\)/g, '').trim();
  }

  function polishNode(el) {
    if (!el || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') return;
    if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
      el.textContent = humanize(el.textContent);
      return;
    }
    el.childNodes.forEach(function (node) {
      if (node.nodeType === 3) {
        var t = humanize(node.textContent);
        if (t !== node.textContent) node.textContent = t;
      } else if (node.nodeType === 1 && node.tagName !== 'INPUT' && node.tagName !== 'TEXTAREA') {
        polishNode(node);
      }
    });
  }

  function polish(root) {
    if (!root) return;
    SELECTORS.forEach(function (sel) {
      root.querySelectorAll(sel).forEach(polishNode);
    });
    var file = root.querySelector('#cms-import-file');
    if (file) file.setAttribute('accept', '.lyokfox-backup');
  }

  function wrapOpts(opts) {
    if (!opts) return opts;
    var o = Object.assign({}, opts);
    if (o.hint) o.hint = humanize(o.hint);
    if (o.where) o.where = humanize(o.where);
    if (o.placeholder) o.placeholder = humanize(o.placeholder);
    return o;
  }

  function patchCMS() {
    var C = window.CMS;
    if (!C || C._studioFriendlyPatched) return;
    C._studioFriendlyPatched = true;

    var origField = C.field;
    var origFieldEasy = C.fieldEasy;
    var origTextarea = C.textarea;
    var origTextareaEasy = C.textareaEasy;
    var origHelp = C.helpBox;
    var origTask = C.taskCard;

    C.field = function (label, id, value, type) {
      return origField(humanize(label), id, value, type);
    };
    C.fieldEasy = function (label, id, value, opts) {
      return origFieldEasy(humanize(label), id, value, wrapOpts(opts));
    };
    C.textarea = function (label, id, value, rows) {
      return origTextarea(humanize(label), id, value, rows);
    };
    C.textareaEasy = function (label, id, value, opts) {
      return origTextareaEasy(humanize(label), id, value, wrapOpts(opts));
    };
    C.helpBox = function (title, body, type) {
      return origHelp(humanize(title), humanize(body), type);
    };
    C.taskCard = function (icon, title, desc, sectionId) {
      return origTask(icon, humanize(title), humanize(desc), sectionId);
    };
  }

  patchCMS();

  window.CMSStudioFriendly = {
    humanize: humanize,
    polish: polish,
    patchCMS: patchCMS
  };
})();
