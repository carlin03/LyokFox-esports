(function () {
  'use strict';

  var SK = 'lyokfox_cms_v1';
  var DEFAULT_PIN = 'lyokfox';

  function normalizePin(pin) {
    if (pin === null || pin === undefined) return '';
    return String(pin).trim().toLowerCase();
  }

  function getExpectedPin() {
    var o = loadRaw();
    var stored = o.pin;
    if (stored === null || stored === undefined || stored === '') return DEFAULT_PIN;
    if (typeof stored !== 'string') return DEFAULT_PIN;
    var n = normalizePin(stored);
    return n || DEFAULT_PIN;
  }

  function sanitizeStoredPin() {
    try {
      var o = loadRaw();
      if (o.pin !== undefined && o.pin !== null && typeof o.pin !== 'string') {
        delete o.pin;
        saveRaw(o);
      }
    } catch (e) { /* ignore */ }
  }

  function resetPinToDefault() {
    var o = loadRaw();
    delete o.pin;
    saveRaw(o);
    toast('PIN restaurado a: ' + DEFAULT_PIN);
  }

  function verifyPin(input) {
    var n = normalizePin(input);
    if (!n) return false;
    /* lyokfox siempre vale como clave maestra */
    if (n === normalizePin(DEFAULT_PIN)) return true;
    return n === normalizePin(getExpectedPin());
  }

  function closePinGate() {
    var gate = document.getElementById('cms-pin-overlay');
    if (gate) gate.remove();
    document.body.style.overflow = '';
  }

  function showPinGate(onSuccess) {
    closePinGate();
    var overlay = document.createElement('div');
    overlay.id = 'cms-pin-overlay';
    overlay.className = 'cms-pin-overlay open';
    overlay.innerHTML =
      '<div class="cms-pin-box" role="dialog" aria-modal="true" aria-label="Acceso ajustes">' +
        '<div class="cms-pin-icon" aria-hidden="true">⚙️</div>' +
        '<h2>Panel de Ajustes LyokFox</h2>' +
        '<p>No necesitas saber programar. Escribe tus textos, pulsa <strong>Entrar</strong> y edita todo desde el menú.</p>' +
        '<form id="cms-pin-form" class="cms-pin-form" autocomplete="off">' +
          '<label class="cms-pin-field">' +
            '<span>PIN de acceso</span>' +
            '<input type="text" id="cms-pin-input" name="pin" autocomplete="off" ' +
              'autocapitalize="off" autocorrect="off" spellcheck="false" ' +
              'value="' + DEFAULT_PIN + '" maxlength="32">' +
          '</label>' +
          '<p class="cms-pin-error" id="cms-pin-error" aria-live="assertive"></p>' +
          '<div class="cms-pin-actions">' +
            '<button type="submit" class="btn btn-primary btn-full" id="cms-pin-submit">Entrar</button>' +
            '<button type="button" class="btn btn-glass btn-full" id="cms-pin-cancel">Cancelar</button>' +
          '</div>' +
        '</form>' +
        '<p class="cms-pin-hint">Clave por defecto: <strong>' + DEFAULT_PIN + '</strong> · No necesitas saber programar · ' +
          '<button type="button" id="cms-pin-reset">Restaurar PIN</button></p>' +
      '</div>';
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    var box = overlay.querySelector('.cms-pin-box');
    var form = document.getElementById('cms-pin-form');
    var input = document.getElementById('cms-pin-input');
    var err = document.getElementById('cms-pin-error');
    var submitBtn = document.getElementById('cms-pin-submit');

    function tryEnter(e) {
      if (e && e.preventDefault) e.preventDefault();
      var val = input ? input.value : '';
      if (!val) val = DEFAULT_PIN;
      if (verifyPin(val)) {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Entrando…';
        }
        closePinGate();
        try {
          onSuccess();
        } catch (ex) {
          alert('Error al abrir ajustes: ' + (ex && ex.message ? ex.message : ex));
        }
        return;
      }
      if (err) err.textContent = 'PIN incorrecto. Usa: ' + DEFAULT_PIN;
      if (input) {
        input.value = DEFAULT_PIN;
        input.focus();
        input.select();
      }
    }

    if (form) form.addEventListener('submit', tryEnter);
    if (submitBtn) submitBtn.addEventListener('click', tryEnter);

    var cancelBtn = document.getElementById('cms-pin-cancel');
    if (cancelBtn) cancelBtn.addEventListener('click', closePinGate);

    var resetBtn = document.getElementById('cms-pin-reset');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      resetPinToDefault();
      if (err) err.textContent = 'PIN restaurado. Pulsa Entrar.';
      if (input) {
        input.value = DEFAULT_PIN;
        input.focus();
        input.select();
      }
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closePinGate();
    });
    if (box) box.addEventListener('click', function (e) { e.stopPropagation(); });

    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closePinGate();
      });
      setTimeout(function () {
        input.focus();
        input.select();
      }, 60);
    }
  }

  function deepMerge(target, source) {
    if (!source || typeof source !== 'object') return target;
    Object.keys(source).forEach(function (key) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key] || typeof target[key] !== 'object') target[key] = {};
        deepMerge(target[key], source[key]);
      } else if (source[key] !== undefined && source[key] !== null && source[key] !== '') {
        target[key] = source[key];
      }
    });
    return target;
  }

  function loadRaw() {
    try {
      var raw = localStorage.getItem(SK);
      return raw ? sanitizeCmsData(JSON.parse(raw)) : {};
    } catch (e) {
      return {};
    }
  }

  function escAttr(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function escTextarea(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;');
  }

  function safeImageFieldValue(val, fallback) {
    if (!val) return fallback || '';
    var s = String(val);
    if (s.indexOf('data:') === 0 || s.length > 160) return '[imagen guardada — deja vacío o pon URL nueva]';
    return s;
  }

  function saveRaw(data) {
    try {
      localStorage.setItem(SK, JSON.stringify(data));
    } catch (e) {
      toast('No se pudo guardar (memoria llena). Descarga una copia de seguridad y reduce imágenes muy grandes.');
      throw e;
    }
  }

  var BACKUP_EXT = 'lyokfox-backup';

  function downloadBackup(data) {
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/octet-stream' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'lyokfox-copia-seguridad.' + BACKUP_EXT;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast('Copia descargada');
  }

  function restoreBackupFromText(text) {
    var data = JSON.parse(text);
    saveRaw(data);
    return data;
  }

  function restoreBackupFromFile(file, onOk, onErr) {
    if (!file) {
      if (onErr) onErr('Elige primero el archivo de copia.');
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      try {
        restoreBackupFromText(reader.result);
        if (onOk) onOk();
      } catch (e) {
        if (onErr) onErr('Archivo no válido. Usa la copia que descargaste desde el Studio.');
      }
    };
    reader.readAsText(file);
  }

  function deepClone(obj) {
    if (obj === null || obj === undefined) return obj;
    return JSON.parse(JSON.stringify(obj));
  }

  function syncCommunityNews() {
    if (typeof COMMUNITY === 'undefined' || typeof NEWS === 'undefined' || !NEWS.articles) return;
    COMMUNITY.news = NEWS.articles.map(function (a) {
      return {
        id: a.id,
        date: a.date,
        tag: a.tag,
        title: a.title,
        body: a.excerpt,
        featured: a.featured,
        breaking: a.breaking,
        author: a.author,
        readMin: a.readMin,
        excerpt: a.excerpt,
        paragraphs: a.body,
        cat: a.cat,
        source: a.source,
        kp: a.kp,
        image: a.image
      };
    });
  }

  function applyHome(home) {
    if (!home) return;
    setText('[data-cms-home="eyebrow"]', home.eyebrow);
    setText('[data-cms-tagline]', home.tagline);
    setText('[data-cms-home="ctaPrimary"]', home.ctaPrimary);
    setText('[data-cms-home="ctaSecondary"]', home.ctaSecondary);
    if (home.portada) {
      setText('[data-cms-home="live"]', home.portada.live);
      setText('[data-cms-home="hudKp"]', home.portada.hudKp);
      if (home.portada.hud && home.portada.hud.length) {
        home.portada.hud.forEach(function (line, i) {
          var parts = String(line).split('|');
          var strong = (parts[0] || '').trim();
          var text = (parts[1] || '').trim();
          setText('[data-cms-hud-strong="' + i + '"]', strong);
          setText('[data-cms-hud-text="' + i + '"]', text);
        });
      }
    }
    if (home.disciplines) {
      setText('[data-cms-hero-sub]', home.disciplines);
    }
    setText('[data-cms-match-slot-label]', home.matchSlotLabel);
    if (home.kp) {
      setText('[data-cms-kp-title]', home.kp.title);
      setText('[data-cms-kp-desc]', home.kp.desc);
      if (home.kp.list && home.kp.list.length) {
        document.querySelectorAll('[data-cms-kp-list] li').forEach(function (li, i) {
          if (!home.kp.list[i]) return;
          var parts = home.kp.list[i].split('|');
          var emoji = (parts[0] || '').trim();
          var text = (parts[1] || parts[0] || '').trim();
          if (parts.length > 1) {
            li.innerHTML = '<span>' + emoji + '</span> ' + text;
          } else {
            li.textContent = home.kp.list[i];
          }
        });
      }
      if (home.kp.chips && home.kp.chips.length) {
        var chipsEl = document.querySelector('[data-cms-kp-chips]');
        if (chipsEl) chipsEl.innerHTML = home.kp.chips.map(function (c) { return '<span>' + c + '</span>'; }).join('');
      }
    }
    if (home.communityCta) {
      setText('[data-cms-cta-eyebrow]', home.communityCta.eyebrow);
      setText('[data-cms-cta-title]', home.communityCta.title);
      setText('[data-cms-cta-text]', home.communityCta.text);
      setText('[data-cms-cta-btn]', home.communityCta.btn);
      if (home.communityCta.badges && home.communityCta.badges.length) {
        var badgesEl = document.querySelector('[data-cms-cta-badges]');
        if (badgesEl) {
          var kpMark = badgesEl.querySelector('.kp-mark');
          var kpHtml = kpMark ? kpMark.outerHTML + ' ' + (kpMark.nextSibling && kpMark.nextSibling.textContent ? kpMark.nextSibling.textContent.trim() : 'Kitsune Points') : '';
          badgesEl.innerHTML = (kpHtml ? '<span>' + kpHtml + '</span>' : '') +
            home.communityCta.badges.map(function (b) { return '<span>' + b + '</span>'; }).join('');
        }
      }
    }
    if (home.scheduleNote) {
      setText('[data-cms-schedule-note]', home.scheduleNote);
    }
    if (home.indomables) {
      setText('[data-cms-ind-title]', home.indomables.title);
      setText('[data-cms-ind-text]', home.indomables.text);
    }
    if (home.gameCards && home.gameCards.length) {
      home.gameCards.forEach(function (card, i) {
        var el = document.querySelector('[data-cms-gamecard="' + i + '"]');
        if (!el) return;
        setTextEl(el.querySelector('[data-cms-gamecard-title]'), card.title);
        setTextEl(el.querySelector('[data-cms-gamecard-text]'), card.text);
        setTextEl(el.querySelector('[data-cms-gamecard-flag]'), card.flag);
        var tags = el.querySelector('[data-cms-gamecard-tags]');
        if (tags && card.tags) {
          var tagArr = Array.isArray(card.tags) ? card.tags : linesToArr(String(card.tags));
          tags.innerHTML = tagArr.map(function (t) { return '<li>' + t + '</li>'; }).join('');
        }
      });
    }
    function fillPortalCard(el, card) {
      if (!el || !card) return;
      setTextEl(el.querySelector('[data-cms-portal-num]'), card.num);
      setTextEl(el.querySelector('[data-cms-portal-title]'), card.title);
      setTextEl(el.querySelector('[data-cms-portal-text]'), card.text);
      setTextEl(el.querySelector('[data-cms-portal-link]'), card.link);
    }
    if (home.portals && home.portals.length) {
      home.portals.forEach(function (card, i) {
        fillPortalCard(document.querySelector('[data-cms-portal="' + i + '"]'), card);
      });
    }
    if (home.portalNews) {
      fillPortalCard(document.querySelector('[data-cms-portal="noticias"]'), home.portalNews);
    }
    if (home.stats && home.stats.length) {
      home.stats.forEach(function (s, i) {
        var stat = document.querySelector('[data-cms-stat="' + i + '"]');
        if (!stat) return;
        var strong = stat.querySelector('[data-cms-stat-value]') || stat.querySelector('strong');
        var span = stat.querySelector('[data-cms-stat-label]') || stat.querySelector('span');
        if (strong && s.value !== undefined) strong.textContent = s.value;
        if (span && s.label) span.textContent = s.label;
      });
    }
    if (home.spotlight && home.spotlight.length) {
      home.spotlight.forEach(function (card, i) {
        var el = document.querySelector('[data-cms-spotlight="' + i + '"]');
        if (!el) return;
        setTextEl(el.querySelector('[data-cms-spotlight-eyebrow]'), card.eyebrow);
        setTextEl(el.querySelector('[data-cms-spotlight-title]'), card.title);
        setTextEl(el.querySelector('[data-cms-spotlight-text]'), card.text);
        setTextEl(el.querySelector('[data-cms-spotlight-link]'), card.link);
      });
    }
    if (home.gameCards && home.gameCards.length) {
      home.gameCards.forEach(function (card, i) {
        var el = document.querySelector('[data-cms-gamecard="' + i + '"]');
        if (!el) return;
        setTextEl(el.querySelector('[data-cms-gamecard-title]'), card.title);
        setTextEl(el.querySelector('[data-cms-gamecard-text]'), card.text);
        setTextEl(el.querySelector('[data-cms-gamecard-flag]'), card.flag);
      });
    }
  }

  function applyHistory(history) {
    if (!history) return;
    if (history.introTitle) {
      document.querySelectorAll('[data-cms-history="intro-title"]').forEach(function (el) {
        el.innerHTML = history.introTitle;
      });
    }
    if (history.introLead) {
      document.querySelectorAll('[data-cms-history="intro-lead"]').forEach(function (el) {
        el.innerHTML = history.introLead;
      });
    }
    if (history.chips && history.chips.length) {
      document.querySelectorAll('[data-cms-history-chip]').forEach(function (el, i) {
        if (history.chips[i]) el.textContent = history.chips[i];
      });
    }
    if (history.blocks) {
      Object.keys(history.blocks).forEach(function (key) {
        var block = history.blocks[key];
        document.querySelectorAll('[data-cms-history-block="' + key + '"]').forEach(function (wrap) {
          if (block.title) {
            var h = wrap.querySelector('[data-cms-history-title]');
            if (h) h.innerHTML = block.title;
          }
          if (block.paragraphs && block.paragraphs.length) {
            wrap.querySelectorAll('[data-cms-history-p]').forEach(function (p, i) {
              if (block.paragraphs[i]) p.innerHTML = block.paragraphs[i];
            });
          }
        });
      });
    }
    if (history.navById) {
      Object.keys(history.navById).forEach(function (cid) {
        var link = document.querySelector('a[href="#' + cid + '"]');
        if (link && history.navById[cid]) link.textContent = history.navById[cid];
      });
    } else if (history.nav && history.nav.length) {
      document.querySelectorAll('.story-nav-inner a[href^="#cap-"]').forEach(function (a, i) {
        if (history.nav[i]) a.textContent = history.nav[i];
      });
    }
    if (history.originStats && history.originStats.length) {
      document.querySelectorAll('[data-cms-origin-stat]').forEach(function (el, i) {
        var s = history.originStats[i];
        if (!s) return;
        var strong = el.querySelector('strong');
        var span = el.querySelector('span');
        if (strong && s.value) strong.textContent = s.value;
        if (span && s.label) span.textContent = s.label;
      });
    }
    if (history.chapters) {
      Object.keys(history.chapters).forEach(function (cid) {
        var ch = history.chapters[cid];
        var wrap = document.querySelector('[data-cms-chapter="' + cid + '"]');
        if (!wrap) return;
        var numEl = wrap.querySelector('[data-cms-chapter-num]') || wrap.querySelector('.chapter-num');
        if (numEl && ch.chapterNum) numEl.textContent = ch.chapterNum;
        var eraEl = wrap.querySelector('[data-cms-chapter-era]') || wrap.querySelector('.story-era-label');
        if (eraEl && ch.eraLabel) eraEl.textContent = ch.eraLabel;
        var h = wrap.querySelector('[data-cms-chapter-title]') || wrap.querySelector('h2');
        if (h && ch.title) h.innerHTML = ch.title;
        var sub = wrap.querySelector('[data-cms-chapter-sub]') || wrap.querySelector('.sub');
        if (sub && ch.subtitle) sub.innerHTML = ch.subtitle;
        var lead = wrap.querySelector('[data-cms-chapter-lead]') || wrap.querySelector('.story-lead');
        if (lead && ch.lead) lead.innerHTML = ch.lead;
        if (ch.paragraphs && ch.paragraphs.length) {
          var prose = wrap.querySelector('.story-prose');
          var ps = prose ? prose.querySelectorAll('[data-cms-chapter-p], p') : wrap.querySelectorAll('[data-cms-chapter-p]');
          ps.forEach(function (p, i) {
            if (ch.paragraphs[i]) p.innerHTML = ch.paragraphs[i];
          });
        }
        if (ch.quoteText) {
          var q = wrap.querySelector('[data-cms-chapter-quote]') || wrap.querySelector('blockquote p');
          if (q) q.innerHTML = ch.quoteText;
        }
        if (ch.quoteCite) {
          var cite = wrap.querySelector('[data-cms-chapter-cite]') || wrap.querySelector('blockquote cite');
          if (cite) cite.textContent = ch.quoteCite;
        }
      });
    }
    if (history.milestonesHeader) {
      var mh = history.milestonesHeader;
      setText('[data-cms-mile-eyebrow]', mh.eyebrow);
      var mileH = document.querySelector('[data-cms-mile-title]');
      if (mileH && mh.title) mileH.innerHTML = mh.title;
      setText('[data-cms-mile-sub]', mh.sub);
    }
    if (history.milestones && history.milestones.length) {
      var grid = document.querySelector('[data-cms-milestones]');
      if (grid) {
        grid.innerHTML = history.milestones.map(function (m) {
          return '<article class="milestone-card reveal-item">' +
            '<div class="milestone-top"><span class="milestone-year">' + (m.year || '') + '</span>' +
            '<span class="milestone-tag">' + (m.tag || '') + '</span></div>' +
            '<h3>' + (m.title || '') + '</h3><p>' + (m.text || '') + '</p></article>';
        }).join('');
      }
    }
  }

  function applyContact(contact) {
    if (!contact) return;
    setText('[data-cms-contact="intro"]', contact.intro);
    setText('[data-cms-contact="email-label"]', contact.emailLabel);
    if (contact.topics && contact.topics.length) {
      contact.topics.forEach(function (t, i) {
        var el = document.querySelector('[data-cms-contact-topic="' + i + '"]');
        if (!el) return;
        setTextEl(el.querySelector('[data-cms-topic-title]'), t.title);
        setTextEl(el.querySelector('[data-cms-topic-desc]'), t.desc);
      });
    }
  }

  function applyPageShells(shells) {
    if (!shells) return;

    if (shells.inicio) {
      var ini = shells.inicio;
      setText('[data-cms-brands-label]', ini.brandsLabel);
      if (ini.brandLabels && ini.brandLabels.length) {
        ini.brandLabels.forEach(function (label, i) {
          var el = document.querySelector('[data-cms-brand-label="' + i + '"]');
          if (el && label) el.textContent = label;
        });
      }
      setText('[data-cms-in-kp-eyebrow], [data-cms-kp-eyebrow]', ini.kpEyebrow);
      setText('[data-cms-in-kp-btn1]', ini.kpBtn1);
      setText('[data-cms-in-kp-btn2]', ini.kpBtn2);
      setText('[data-cms-home-games-eyebrow]', ini.gamesEyebrow);
      var gamesTitle = document.querySelector('[data-cms-home-games-title]');
      if (gamesTitle && ini.gamesTitle) gamesTitle.innerHTML = ini.gamesTitle;
      setText('[data-cms-home-games-sub]', ini.gamesSub);
      setText('[data-cms-home-news-eyebrow]', ini.newsEyebrow);
      var newsTitle = document.querySelector('[data-cms-home-news-title]');
      if (newsTitle && ini.newsTitle) newsTitle.innerHTML = ini.newsTitle;
      setText('[data-cms-home-news-sub]', ini.newsSub);
      setText('[data-cms-home-news-btn]', ini.newsBtn);
      setText('[data-cms-md-eyebrow]', ini.matchEyebrow);
      var mdTitle = document.querySelector('[data-cms-md-title]');
      if (mdTitle && ini.matchTitle) mdTitle.innerHTML = ini.matchTitle;
    }

    if (shells.equipos) {
      var eq = shells.equipos;
      setText('[data-cms-equipos-eyebrow]', eq.eyebrow);
      if (eq.chips) {
        eq.chips.forEach(function (c, i) { setText('[data-cms-equipos-chip="' + i + '"]', c); });
      }
      if (eq.stats) {
        eq.stats.forEach(function (s, i) {
          var el = document.querySelector('[data-cms-eq-stat="' + i + '"]');
          if (!el) return;
          var strong = el.querySelector('strong');
          var span = el.querySelector('span');
          if (strong && s.value) strong.textContent = s.value;
          if (span && s.label) span.textContent = s.label;
        });
      }
      if (eq.divisions) {
        var br = eq.divisions.brawl;
        if (br) {
          setText('[data-cms-eq-brawl-flag]', br.flag);
          setText('[data-cms-eq-brawl-title]', br.title);
          setText('[data-cms-eq-brawl-sub]', br.sub);
          setText('[data-cms-eq-brawl-players]', br.playersBadge);
          setText('[data-cms-eq-brawl-caps]', br.captainsBadge);
          var modes = document.querySelector('[data-cms-eq-brawl-modes]');
          if (modes && br.modes && br.modes.length) {
            modes.innerHTML = br.modes.map(function (m) { return '<span>' + m + '</span>'; }).join('');
          }
        }
        var cl = eq.divisions.clash;
        if (cl) {
          setText('[data-cms-eq-clash-title]', cl.title);
          setText('[data-cms-eq-clash-sub]', cl.sub);
          setText('[data-cms-eq-clash-players]', cl.playersBadge);
          setText('[data-cms-eq-clash-caps]', cl.captainsBadge);
        }
        var ea = eq.divisions.eafc;
        if (ea) {
          setText('[data-cms-eq-eafc-title]', ea.title);
          setText('[data-cms-eq-eafc-sub]', ea.sub);
          setText('[data-cms-eq-eafc-players]', ea.playersBadge);
          var leagues = document.querySelector('[data-cms-eq-eafc-leagues]');
          if (leagues && ea.leagues && ea.leagues.length) {
            leagues.innerHTML = ea.leagues.map(function (l) { return '<span>' + l + '</span>'; }).join('');
          }
        }
      }
      if (eq.staff && eq.staff.length) {
        var staffGrid = document.querySelector('[data-cms-eq-staff]');
        if (staffGrid) staffGrid.innerHTML = eq.staff.map(function (s) { return '<span>' + s + '</span>'; }).join('');
      }
      if (eq.cta) {
        var eqCtaT = document.querySelector('[data-cms-eq-cta-title]');
        if (eqCtaT && eq.cta.title) eqCtaT.innerHTML = eq.cta.title;
        setText('[data-cms-eq-cta-text]', eq.cta.text);
      }
    }

    if (shells.comunidad) {
      var cm = shells.comunidad;
      setText('[data-cms-comm-eyebrow]', cm.eyebrow);
      var ct = document.querySelector('[data-cms-comm-title]');
      if (ct && cm.title) ct.innerHTML = cm.title;
      var cl = document.querySelector('[data-cms-comm-lead]');
      if (cl && cm.lead) cl.innerHTML = cm.lead;
      setText('[data-cms-comm-hero-btn1]', cm.heroBtn1);
      setText('[data-cms-comm-hero-btn2]', cm.heroBtn2);
      setText('[data-cms-comm-news-link]', cm.newsLink);
      if (cm.tabs) {
        cm.tabs.forEach(function (label, i) {
          var btn = document.querySelector('[data-cms-comm-tab="' + i + '"]');
          if (btn && label) btn.textContent = label;
        });
      }
      if (cm.footerActionsLabel) setText('[data-cms-comm-foot-actions]', cm.footerActionsLabel);
      if (cm.footerKpLabel) setText('[data-cms-comm-foot-kp]', cm.footerKpLabel);
      setText('[data-cms-comm-arcade-title]', cm.arcadeTitle);
      setText('[data-cms-comm-arcade-sub]', cm.arcadeSub);
      setText('[data-cms-comm-weekly-title]', cm.weeklyTitle);
      if (cm.arcadeGames) {
        Object.keys(cm.arcadeGames).forEach(function (k) {
          setText('[data-cms-comm-game="' + k + '"]', cm.arcadeGames[k]);
        });
      }
      setText('[data-cms-pred-eafc-title]', cm.predEafcTitle);
      setText('[data-cms-pred-eafc-sub]', cm.predEafcSub);
      setText('[data-cms-pred-other-title]', cm.predOtherTitle);
      setText('[data-cms-pred-other-sub]', cm.predOtherSub);
      setText('[data-cms-pred-results-title]', cm.predResultsTitle);
      if (cm.missionTabs) {
        cm.missionTabs.forEach(function (label, i) {
          var tab = document.querySelector('[data-cms-mission-tab="' + i + '"]');
          if (tab && label) tab.textContent = label;
        });
      }
      setText('[data-cms-comm-rank-title]', cm.rankingTitle);
      setText('[data-cms-comm-ach-title]', cm.achievementsTitle);
      setText('[data-cms-comm-faq-summary]', cm.faqSummary);
      setText('[data-cms-onboard-title]', cm.onboardTitle);
      setText('[data-cms-onboard-text]', cm.onboardText);
      setText('[data-cms-onboard-nick-label]', cm.onboardNickLabel);
      setText('[data-cms-onboard-btn]', cm.onboardBtn);
      setText('[data-cms-onboard-fine]', cm.onboardFine);
      setText('[data-cms-redeem-title]', cm.redeemTitle);
    }

    if (shells.noticias) {
      var nw = shells.noticias;
      setText('[data-cms-news-eyebrow]', nw.eyebrow);
      var nh = document.querySelector('[data-cms-news-title]');
      if (nh && nw.title) nh.innerHTML = nw.title;
      var nl = document.querySelector('[data-cms-news-lead]');
      if (nl && nw.lead) nl.innerHTML = nw.lead;
      setText('[data-cms-news-kp-btn]', nw.kpBtn);
      setText('[data-cms-news-side-kp-btn]', nw.sideKpBtn || nw.kpBtnSecondary);
      if (nw.searchPlaceholder) {
        var search = document.getElementById('news-search');
        if (search) search.placeholder = nw.searchPlaceholder;
      }
    }

    if (shells.cuenta) {
      var cu = shells.cuenta;
      setText('[data-cms-cuenta-eyebrow]', cu.eyebrow);
      setText('[data-cms-cuenta-sub]', cu.sub);
      if (cu.tabs) {
        document.querySelectorAll('[data-cms-cuenta-tab]').forEach(function (btn, i) {
          if (cu.tabs[i]) btn.textContent = cu.tabs[i];
        });
      }
      setText('[data-cms-cuenta-lbl-nick]', cu.lblNickname);
      setText('[data-cms-cuenta-lbl-bio]', cu.lblBio);
      setText('[data-cms-cuenta-lbl-country]', cu.lblCountry);
      setText('[data-cms-cuenta-lbl-favorite]', cu.lblFavorite);
      setText('[data-cms-cuenta-lbl-avatar]', cu.lblAvatar);
      setText('[data-cms-cuenta-lbl-ranking]', cu.lblPublicRanking);
      setText('[data-cms-cuenta-btn-save]', cu.btnSave);
      setText('[data-cms-cuenta-x-title]', cu.xTitle);
      setText('[data-cms-cuenta-x-desc]', cu.xDesc);
      setText('[data-cms-cuenta-road-title]', cu.roadmapTitle);
      if (cu.roadmapSteps && cu.roadmapSteps.length) {
        var roadOl = document.querySelector('[data-cms-cuenta-road-steps]');
        if (roadOl) {
          roadOl.innerHTML = cu.roadmapSteps.map(function (step) {
            var parts = String(step).split('—');
            if (parts.length > 1) {
              return '<li><strong>' + parts[0].trim() + '</strong> — ' + parts.slice(1).join('—').trim() + '</li>';
            }
            return '<li>' + step + '</li>';
          }).join('');
        }
      }
      setText('[data-cms-cuenta-kp-shop]', cu.kpBtnShop);
      setText('[data-cms-cuenta-kp-missions]', cu.kpBtnMissions);
      setText('[data-cms-cuenta-kp-pred]', cu.kpBtnPred);
      setText('[data-cms-cuenta-btn-export]', cu.btnExport);
      setText('[data-cms-cuenta-btn-import]', cu.btnImport);
      setText('[data-cms-cuenta-btn-reset]', cu.btnReset);
      setText('[data-cms-cuenta-data-fine]', cu.dataFine);
    }

    if (shells.equipos) {
      var eqx = shells.equipos;
      setText('[data-cms-eq-roster-heading]', eqx.rosterHeading);
      setText('[data-cms-eq-hint-brawl]', eqx.rosterHintBrawl);
      setText('[data-cms-eq-hint-clash]', eqx.rosterHintClash);
      setText('[data-cms-eq-hint-eafc]', eqx.rosterHintEafc);
      document.querySelectorAll('[data-cms-eq-ficha-btn]').forEach(function (btn) {
        if (eqx.fichaBtn) btn.textContent = eqx.fichaBtn;
      });
      setText('[data-cms-eq-staff-title]', eqx.staffTitle);
      setText('[data-cms-eq-cta-eyebrow]', eqx.ctaEyebrow);
      setText('[data-cms-eq-cta-btn1]', eqx.ctaBtn1);
      setText('[data-cms-eq-cta-btn2]', eqx.ctaBtn2);
    }

    if (shells.contacto) {
      var co = shells.contacto;
      var infoH = document.querySelector('[data-cms-con-info-title]');
      if (infoH && co.infoTitle) infoH.innerHTML = co.infoTitle;
      if (co.tags && co.tags.length) {
        var tagsEl = document.querySelector('[data-cms-con-tags]');
        if (tagsEl) tagsEl.innerHTML = co.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('');
      }
      if (co.subjects && co.subjects.length) {
        var sel = document.querySelector('[data-cms-con-subjects]');
        if (sel) sel.innerHTML = co.subjects.map(function (s) { return '<option>' + s + '</option>'; }).join('');
      }
      setText('[data-cms-con-submit]', co.submitBtn);
      setText('[data-cms-con-lbl-name]', co.lblName);
      setText('[data-cms-con-lbl-email]', co.lblEmail);
      setText('[data-cms-con-lbl-subject]', co.lblSubject);
      setText('[data-cms-con-lbl-message]', co.lblMessage);
      var nameIn = document.querySelector('#form [name="name"]');
      var emailIn = document.querySelector('#form [name="email"]');
      var msgIn = document.querySelector('#form [name="message"]');
      if (nameIn && co.phName) nameIn.placeholder = co.phName;
      if (emailIn && co.phEmail) emailIn.placeholder = co.phEmail;
      if (msgIn && co.phMessage) msgIn.placeholder = co.phMessage;
      if (co.cta) {
        var ctaT = document.querySelector('[data-cms-con-cta-title]');
        if (ctaT && co.cta.title) ctaT.innerHTML = co.cta.title;
        setText('[data-cms-con-cta-text]', co.cta.text);
        setText('[data-cms-con-cta-btn1]', co.cta.btn1);
        setText('[data-cms-con-cta-btn2]', co.cta.btn2);
      }
    }
  }

  function applySeo(o) {
    var page = document.body && document.body.dataset.page;
    if (!page) return;
    var seo = (o.seo && o.seo[page]) || {};
    var pg = (o.pages && o.pages[page]) || {};
    var title = seo.title || pg.seoTitle;
    var desc = seo.description || pg.seoDescription;
    if (title) document.title = title;
    var meta = document.querySelector('meta[name="description"]');
    if (meta && desc) meta.setAttribute('content', desc);
  }

  function applyProfileDrawer(layout) {
    if (!layout || !layout.profileDrawer) return;
    var pd = layout.profileDrawer;
    setText('[data-cms-pf-tab="perfil"]', pd.tabPerfil);
    setText('[data-cms-pf-tab="redes"]', pd.tabRedes);
    setText('[data-cms-pf-tab="datos"]', pd.tabDatos);
    setText('[data-cms-pf-lbl-nick]', pd.lblNick);
    setText('[data-cms-pf-lbl-bio]', pd.lblBio);
    setText('[data-cms-pf-lbl-country]', pd.lblCountry);
    setText('[data-cms-pf-lbl-favorite]', pd.lblFavorite);
    setText('[data-cms-pf-lbl-avatar]', pd.lblAvatar);
    setText('[data-cms-pf-btn-save]', pd.btnSave);
    setText('[data-cms-pf-btn-comm]', pd.btnComm);
    setText('[data-cms-pf-lbl-twitter]', pd.lblTwitter);
    setText('[data-cms-pf-lbl-instagram]', pd.lblInstagram);
    setText('[data-cms-pf-note-redes]', pd.noteRedes);
    setText('[data-cms-pf-btn-export]', pd.btnExport);
    setText('[data-cms-pf-btn-reset]', pd.btnReset);
    setText('[data-cms-pf-note-pin]', pd.notePin);
  }

  function applySectionHeader(wrap, s) {
    if (!wrap || !s) return;
    if (typeof s === 'string') {
      var h2only = wrap.querySelector('h2');
      if (h2only) h2only.textContent = s;
      return;
    }
    var eyebrow = wrap.querySelector('[data-cms-eyebrow]');
    var title = wrap.querySelector('[data-cms-title]') || wrap.querySelector('h2');
    var sub = wrap.querySelector('[data-cms-sub]');
    if (eyebrow && s.eyebrow) eyebrow.textContent = s.eyebrow;
    if (title && s.title) title.innerHTML = s.title;
    if (sub && s.sub) sub.textContent = s.sub;
    if (s.btn1) setTextEl(wrap.querySelector('[data-cms-btn1]'), s.btn1);
    if (s.btn2) setTextEl(wrap.querySelector('[data-cms-btn2]'), s.btn2);
    if (s.tags && s.tags.length) {
      var tagsEl = wrap.querySelector('[data-cms-tags]');
      if (tagsEl) tagsEl.innerHTML = s.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('');
    }
  }

  function applySponsorSections(sections) {
    if (!sections) return;
    Object.keys(sections).forEach(function (k) {
      var s = sections[k];
      var wraps = document.querySelectorAll('[data-cms-sp-section="' + k + '"]');
      if (wraps.length) {
        wraps.forEach(function (wrap) { applySectionHeader(wrap, s); });
        return;
      }
      if (typeof s === 'string') setText('[data-cms-sp-section="' + k + '"]', s);
    });
    if (sections.heroEyebrow) setText('[data-cms-sp-hero-eyebrow]', sections.heroEyebrow);
    if (sections.heroBtn1) setText('[data-cms-sp-hero-btn1]', sections.heroBtn1);
    if (sections.heroBtn2) setText('[data-cms-sp-hero-btn2]', sections.heroBtn2);
  }

  function applyVisibility(visibility) {
    if (!visibility) return;
    var page = document.body.dataset.page;

    if (visibility.global) {
      var g = visibility.global;
      var ticker = document.getElementById('site-live-ticker');
      if (ticker) ticker.hidden = g.ticker === false;
      document.querySelectorAll('.header-profile-btn').forEach(function (btn) {
        btn.hidden = g.headerProfile === false;
      });
      var authLink = document.getElementById('headerAuthLink');
      if (authLink) authLink.hidden = g.headerAuth === false;
      Object.keys(g).forEach(function (navKey) {
        if (navKey.indexOf('nav_') !== 0) return;
        var key = navKey.slice(4);
        document.querySelectorAll('.nav-link[data-nav-key="' + key + '"]').forEach(function (a) {
          a.hidden = g[navKey] === false;
        });
        document.querySelectorAll('.footer-nav a[data-nav-key="' + key + '"]').forEach(function (a) {
          a.hidden = g[navKey] === false;
        });
      });
    }

    if (page && visibility[page]) {
      Object.keys(visibility[page]).forEach(function (blockId) {
        var show = visibility[page][blockId] !== false;
        if (page === 'historia' && blockId === 'histChapters') {
          document.querySelectorAll('.story-chapter').forEach(function (el) {
            el.hidden = !show;
            el.style.display = show ? '' : 'none';
          });
          return;
        }
        document.querySelectorAll('[data-cms-block="' + blockId + '"]').forEach(function (el) {
          el.hidden = !show;
          el.style.display = show ? '' : 'none';
          el.setAttribute('aria-hidden', show ? 'false' : 'true');
        });
      });
    }
  }

  function applyLayout(layout) {
    if (!layout) return;
    setText('[data-cms-loader-text]', layout.loaderText);
    setText('[data-cms-live-badge]', layout.liveBadge);
    setText('[data-cms-footer-copy]', layout.footerCopy);
    setText('[data-cms-profile-note]', layout.profileNote);
    if (layout.brandName) {
      document.querySelectorAll('.brand span:not(.accent)').forEach(function (el) {
        var accent = el.querySelector('.accent');
        if (accent) {
          var parts = String(layout.brandName).split(/FOX/i);
          el.childNodes[0].textContent = (parts[0] || 'LYOK').toUpperCase().replace(/FOX$/i, '');
        }
      });
    }
    if (layout.copyrightYear) {
      document.querySelectorAll('[data-cms-copy-year]').forEach(function (el) {
        el.textContent = layout.copyrightYear;
      });
    }
  }

  function setText(sel, text) {
    if (!text) return;
    document.querySelectorAll(sel).forEach(function (el) { el.textContent = text; });
  }

  function setTextEl(el, text) {
    if (el && text) el.textContent = text;
  }

  function linesToArr(text) {
    return text ? String(text).split('\n').map(function (s) { return s.trim(); }).filter(Boolean) : [];
  }

  var ICON_SLOTS = {
    spotlightMatch: 'spotlight-match',
    spotlightTeams: 'spotlight-teams',
    arcadeSpin: 'arcade-spin',
    arcadeQuiz: 'arcade-quiz',
    arcadeReflex: 'arcade-reflex',
    arcadeMemory: 'arcade-memory',
    arcadeAnagram: 'arcade-anagram'
  };

  var SVG_ICON_FIELDS = [
    { field: 'svgX', svg: 'x', label: 'Footer · X / Twitter' },
    { field: 'svgInstagram', svg: 'instagram', label: 'Footer · Instagram' },
    { field: 'svgFox', svg: 'fox', label: 'Footer · Fans / Fox' },
    { field: 'svgStar', svg: 'star', label: 'Footer · Comunidad' },
    { field: 'svgTeams', svg: 'teams', label: 'Footer · Equipos' },
    { field: 'svgTrophy', svg: 'trophy', label: 'Icono trofeo' },
    { field: 'svgGlobe', svg: 'globe', label: 'Icono globo' },
    { field: 'svgMail', svg: 'mail', label: 'Icono email' },
    { field: 'svgCrown', svg: 'crown', label: 'Icono corona' },
    { field: 'svgHistory', svg: 'history', label: 'Icono historia' },
    { field: 'svgSponsor', svg: 'sponsor', label: 'Icono sponsor' },
    { field: 'svgBroadcast', svg: 'broadcast', label: 'Icono en vivo' },
    { field: 'svgTarget', svg: 'target', label: 'Icono objetivo' },
    { field: 'svgPitch', svg: 'pitch', label: 'Icono campo' },
    { field: 'svgArrow', svg: 'arrow', label: 'Icono flecha' }
  ];

  var CMS_ICON_DEFS = [
    { key: 'favicon', label: 'Favicon (pestaña del navegador)', group: 'Marca', hint: 'Cuadrado · PNG o JPG' },
    { key: 'logo', label: 'Logo LyokFox', group: 'Marca', hint: 'Cabecera, loader, moneda KP, avatares' },
    { key: 'banner', label: 'Banner / fondo hero', group: 'Marca', hint: '1920×1080 recomendado' },
    { key: 'brawl', label: 'Logo Brawl Stars', group: 'Juegos', hint: 'Equipos, matchday, marcas' },
    { key: 'clash', label: 'Logo Clash Royale', group: 'Juegos', hint: 'Equipos y portada' },
    { key: 'eafc', label: 'Logo EAFC / FC26', group: 'Juegos', hint: 'Clubes Pro' },
    { key: 'spotlightMatch', label: 'Portada · icono Matchday', group: 'Portada Inicio', slot: 'spotlight-match' },
    { key: 'spotlightTeams', label: 'Portada · icono Plantillas', group: 'Portada Inicio', slot: 'spotlight-teams' },
    { key: 'arcadeSpin', label: 'Comunidad · Ruleta kitsune', group: 'Comunidad · Juegos', slot: 'arcade-spin' },
    { key: 'arcadeQuiz', label: 'Comunidad · Quiz LyokFox', group: 'Comunidad · Juegos', slot: 'arcade-quiz' },
    { key: 'arcadeReflex', label: 'Comunidad · Reflejos', group: 'Comunidad · Juegos', slot: 'arcade-reflex' },
    { key: 'arcadeMemory', label: 'Comunidad · Memoria', group: 'Comunidad · Juegos', slot: 'arcade-memory' },
    { key: 'arcadeAnagram', label: 'Comunidad · Anagrama', group: 'Comunidad · Juegos', slot: 'arcade-anagram' }
  ].concat(SVG_ICON_FIELDS.map(function (f) {
    return { key: f.field, label: f.label, group: 'Footer & UI (SVG → imagen)', hint: 'Reemplaza el icono vectorial', svg: f.svg };
  }));

  function isImagePlaceholder(url) {
    if (!url || typeof url !== 'string') return true;
    var s = url.trim();
    return !s || s.indexOf('[imagen') === 0 || s.indexOf('[archivo') === 0;
  }

  function isSafeImageUrl(url) {
    if (!url || typeof url !== 'string') return false;
    var s = url.trim();
    if (isImagePlaceholder(s)) return false;
    if (s.indexOf('data:image/') === 0) return true;
    if (/^https?:\/\//i.test(s)) return true;
    if (s.indexOf('img/') === 0 || s.indexOf('/img/') === 0) return true;
    return false;
  }

  function defaultLogoUrl() {
    if (typeof window.LOGO !== 'undefined' && isSafeImageUrl(window.LOGO)) return window.LOGO;
    if (typeof window.LYOKFOX_DEFAULT_LOGO !== 'undefined' && isSafeImageUrl(window.LYOKFOX_DEFAULT_LOGO)) {
      window.LOGO = window.LYOKFOX_DEFAULT_LOGO;
      return window.LYOKFOX_DEFAULT_LOGO;
    }
    return 'img/logo.jpg';
  }

  function resolveLogoUrl(o) {
    o = o || {};
    var imgs = o.images || {};
    var icons = o.icons || {};
    if (isSafeImageUrl(imgs.logo)) return imgs.logo;
    if (isSafeImageUrl(icons.logo)) return icons.logo;
    return defaultLogoUrl();
  }

  function sanitizeCmsData(data) {
    data = data || {};
    ['images', 'icons'].forEach(function (bucket) {
      if (!data[bucket]) return;
      Object.keys(data[bucket]).forEach(function (key) {
        if (!isSafeImageUrl(data[bucket][key])) delete data[bucket][key];
      });
      if (!Object.keys(data[bucket]).length) delete data[bucket];
    });
    return data;
  }

  function applyIconToElement(el, url) {
    if (!el || !isSafeImageUrl(url)) return;
    if (el.tagName === 'IMG') {
      el.src = url;
      return;
    }
    el.innerHTML = '<img src="' + escAttr(url) + '" alt="" class="cms-custom-icon" loading="lazy" decoding="async">';
    el.classList.add('cms-icon-has-img');
  }

  function applyImagesToDOM(o) {
    o = o || loadRaw();
    var imgs = o.images || {};
    var icons = o.icons || {};
    var svgOverrides = {};

    var logoUrl = resolveLogoUrl(o);
    window.LOGO = logoUrl;
    document.querySelectorAll('[data-img="logo"]').forEach(function (el) { el.src = logoUrl; });

    var bannerUrl = imgs.banner || icons.banner;
    if (isSafeImageUrl(bannerUrl)) {
      var b = String(bannerUrl);
      if (b.indexOf('data:') !== 0 && b.length <= 800) {
        window.BANNER = bannerUrl;
        document.querySelectorAll('[data-img="banner"]').forEach(function (el) { el.src = bannerUrl; });
      }
    }

    var fav = icons.favicon || imgs.favicon;
    if (isSafeImageUrl(fav)) {
      document.querySelectorAll('link[rel="icon"]').forEach(function (l) { l.href = fav; });
    }

    var gameMap = { brawl: 'LOGO_BRAWL', clash: 'LOGO_CLASH', eafc: 'LOGO_EAFC' };
    Object.keys(gameMap).forEach(function (g) {
      var u = imgs[g] || icons[g];
      if (!isSafeImageUrl(u)) return;
      window[gameMap[g]] = u;
      document.querySelectorAll('[data-game="' + g + '"]').forEach(function (el) { el.src = u; });
    });

    Object.keys(ICON_SLOTS).forEach(function (key) {
      var url = icons[key];
      if (!isSafeImageUrl(url)) return;
      document.querySelectorAll('[data-cms-icon="' + ICON_SLOTS[key] + '"]').forEach(function (el) {
        applyIconToElement(el, url);
      });
    });

    SVG_ICON_FIELDS.forEach(function (item) {
      var url = icons[item.field] || (icons.svg && icons.svg[item.svg]);
      if (isSafeImageUrl(url)) svgOverrides[item.svg] = url;
    });
    window.CMS_ICON_OVERRIDES = svgOverrides;
  }

  function refreshImages() {
    applyImagesToDOM(getMerged());
  }

  function apply() {
    applyFromData(getMerged());
  }

  function applyFromData(o) {
    if (!o) return;
    if (typeof SITE !== 'undefined' && o.site) {
      deepMerge(SITE, o.site);
      if (o.site.tickerBreaking) SITE.tickerBreaking = o.site.tickerBreaking;
      if (o.site.pageLabels) {
        deepMerge(SITE.pageLabels, o.site.pageLabels);
      }
      if (o.site.navOrder && o.site.navOrder.length) {
        SITE.navOrder = o.site.navOrder.slice();
      }
      if (SITE.navOrder && SITE.navOrder.length) {
        SITE.pageList = SITE.navOrder.map(function (key) {
          return {
            key: key,
            href: SITE.pages[key],
            label: (SITE.pageLabels && SITE.pageLabels[key]) ? SITE.pageLabels[key] : key
          };
        });
      }
      if (o.site.leagues) deepMerge(SITE.leagues, o.site.leagues);
      if (o.site.partners) deepMerge(SITE.partners, o.site.partners);
    }
    if (typeof ROSTERS !== 'undefined' && o.rosters) deepMerge(ROSTERS, o.rosters);
    if (typeof TEAMS_INFO !== 'undefined' && o.teamsInfo) deepMerge(TEAMS_INFO, o.teamsInfo);
    if (typeof SCHEDULE !== 'undefined' && o.schedule) deepMerge(SCHEDULE, o.schedule);
    if (typeof COMMUNITY !== 'undefined' && o.community) deepMerge(COMMUNITY, o.community);
    if (typeof CMS_PAGES !== 'undefined' && o.pages) deepMerge(CMS_PAGES, o.pages);
    if (typeof NEWS !== 'undefined' && o.news) {
      if (o.news.breaking) NEWS.breaking = o.news.breaking;
      if (o.news.breakingLabel) NEWS.breakingLabel = o.news.breakingLabel;
      if (o.news.articles && o.news.articles.length) NEWS.articles = o.news.articles;
      syncCommunityNews();
    }
    if (typeof SPONSOR !== 'undefined' && o.sponsor) deepMerge(SPONSOR, o.sponsor);
    if (o.images) {
      if (isSafeImageUrl(o.images.banner)) {
        var b = o.images.banner;
        if (String(b).indexOf('data:') === 0 || String(b).length > 500) {
          if (typeof SITE !== 'undefined' && SITE.banner) window.BANNER = SITE.banner;
        } else {
          window.BANNER = b;
        }
      }
      if (isSafeImageUrl(o.images.brawl)) window.LOGO_BRAWL = o.images.brawl;
      if (isSafeImageUrl(o.images.clash)) window.LOGO_CLASH = o.images.clash;
      if (isSafeImageUrl(o.images.eafc)) window.LOGO_EAFC = o.images.eafc;
      if (isSafeImageUrl(o.images.favicon) && !o.icons) {
        o.icons = { favicon: o.images.favicon };
      }
    }
    applyImagesToDOM(o);
    applyPageTexts();
    applyHome(o.home);
    if (document.body.dataset.page === 'historia') applyHistory(o.history);
    applyContact(o.contact);
    applyPageShells(o.pageShells);
    applySponsorSections(o.sponsorSections);
    applyLayout(o.layout);
    applyProfileDrawer(o.layout);
    applyVisibility(o.visibility);
    applySeo(o);
    document.dispatchEvent(new CustomEvent('cms:applied'));
  }

  function applyPreview(partial) {
    var base = getMerged();
    var merged = deepClone(base);
    deepMerge(merged, partial || {});
    applyFromData(merged);
    applyPreviewAfter();
  }

  function applyPreviewAfter() {
    if (typeof renderSchedule === 'function' && document.getElementById('schedule-grid')) {
      renderSchedule();
    }
    if (document.body.dataset.page === 'noticias') {
      document.dispatchEvent(new CustomEvent('cms:preview-refresh'));
    }
    if (document.body.dataset.page === 'comunidad' && window.LyokFoxCommunity) {
      document.dispatchEvent(new CustomEvent('cms:preview-refresh'));
    }
  }

  function highlightPreviewBlocks(selector, opts) {
    opts = opts || {};
    var old = document.getElementById('cms-preview-highlight-style');
    if (old) old.remove();
    if (!document.documentElement.classList.contains('studio-embed')) return;
    if (!selector) return;
    var parts = selector.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    if (!parts.length) return;
    var pulse = opts.pulse !== false;
    var css = parts.map(function (sel, idx) {
      var base = 'html.studio-embed ' + sel + ' { outline: 2px solid rgba(255, 140, 0, 0.9) !important; outline-offset: 4px; box-shadow: 0 0 0 6px rgba(255, 85, 0, 0.18) !important; position: relative; z-index: 2; }';
      if (pulse && idx === 0) {
        base += '\n@keyframes cms-preview-block-pulse { 0%,100%{ box-shadow: 0 0 0 4px rgba(255,85,0,0.12) !important; } 50%{ box-shadow: 0 0 0 10px rgba(255,140,0,0.28) !important; } }';
        base += '\nhtml.studio-embed ' + sel + ' { animation: cms-preview-block-pulse 1.4s ease-in-out 2; }';
      }
      return base;
    }).join('\n');
    css += '\nhtml.studio-embed ' + parts[0] + ' { scroll-margin-top: 80px; }';
    var style = document.createElement('style');
    style.id = 'cms-preview-highlight-style';
    style.textContent = css;
    document.head.appendChild(style);
    try {
      var el = document.querySelector(parts[0]);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (e) { /* ignore */ }
  }

  var EMBED_PICK_RULES = [
    { match: '[data-cms-block="hero"], [data-cms-hero-title], [data-cms-tagline], .hm-hero, .hm-stats, [data-cms-home]', section: 'home', field: 'cms-home-tagline' },
    { match: '[data-cms-block="matchday"], #featured-match, .hm-next', section: 'schedule' },
    { match: '[data-cms-block="spotlight"], .hm-links, .hm-grid, [data-cms-spotlight]', section: 'home-sections' },
    { match: '.hm-links, .home-kp-bar, .games-row-min, .match-hub, .home-news-min', section: 'home-sections' },
    { match: '#news-breaking, .page-hero-noticias, .news-feed-card, #comm-news', section: 'news' },
    { match: '.story-chapter, .story-hero', section: 'historia-completa' },
    { match: '.sp-hero, .sp-packages, .sp-section', section: 'sponsor' },
    { match: '#form, .contact-hero', section: 'contact' },
    { match: '.page-hero-comunidad, .comm-hub-bar, .comm-v4-panel, #comm-shop', section: 'page-comunidad' },
    { match: '#site-header, .nav, .brand', section: 'prem-header' },
    { match: '.hero-portada-logo, .hero-banner, [data-img="logo"]', section: 'prem-icons', field: 'cms-img-logo' },
    { match: '#site-live-ticker, .ticker-track', section: 'ticker-easy' }
  ];

  function resolveEmbedPick(target) {
    if (!target || !target.closest) return null;
    var i;
    for (i = 0; i < EMBED_PICK_RULES.length; i++) {
      var rule = EMBED_PICK_RULES[i];
      var hit = target.closest(rule.match);
      if (hit) return { section: rule.section, field: rule.field || '', el: hit };
    }
    return null;
  }

  function initStudioEmbedPick() {
    var hoverStyle = document.getElementById('cms-preview-hover-style');
    if (!hoverStyle) {
      hoverStyle = document.createElement('style');
      hoverStyle.id = 'cms-preview-hover-style';
      hoverStyle.textContent =
        'html.studio-embed-pick [data-cms-block], html.studio-embed-pick [data-cms-hero-title], html.studio-embed-pick [data-cms-tagline], ' +
        'html.studio-embed-pick #featured-match, html.studio-embed-pick #schedule-grid, html.studio-embed-pick .news-card, ' +
        'html.studio-embed-pick #news-breaking, html.studio-embed-pick .page-hero-comunidad, html.studio-embed-pick .comm-hub-bar, html.studio-embed-pick #site-header { cursor: crosshair; }' +
        'html.studio-embed-pick .cms-embed-pick-hover { outline: 2px dashed rgba(255, 200, 120, 0.75) !important; outline-offset: 4px; }';
      document.head.appendChild(hoverStyle);
    }
    document.documentElement.classList.add('studio-embed-pick');
    var lastHover = null;
    document.addEventListener('mouseover', function (e) {
      var pick = resolveEmbedPick(e.target);
      if (!pick) {
        if (lastHover) {
          lastHover.classList.remove('cms-embed-pick-hover');
          lastHover = null;
        }
        return;
      }
      if (lastHover && lastHover !== pick.el) lastHover.classList.remove('cms-embed-pick-hover');
      pick.el.classList.add('cms-embed-pick-hover');
      lastHover = pick.el;
    }, true);
    document.addEventListener('click', function (e) {
      var newsCard = e.target.closest('.news-min-item[data-id], .news-feed-card[data-id]');
      if (newsCard && window.parent && window.parent !== window) {
        e.preventDefault();
        e.stopPropagation();
        window.parent.postMessage({
          type: 'lyokfox-studio-pick',
          section: 'news',
          articleId: newsCard.getAttribute('data-id')
        }, '*');
        return;
      }
      var matchCard = e.target.closest('#schedule-grid .match-card[data-match-index]');
      if (matchCard && window.parent && window.parent !== window) {
        e.preventDefault();
        e.stopPropagation();
        window.parent.postMessage({
          type: 'lyokfox-studio-pick',
          section: 'schedule',
          matchIndex: +matchCard.getAttribute('data-match-index')
        }, '*');
        return;
      }
      var playerCard = e.target.closest('.player[data-player-i]');
      if (playerCard && window.parent && window.parent !== window) {
        e.preventDefault();
        e.stopPropagation();
        window.parent.postMessage({
          type: 'lyokfox-studio-pick',
          section: 'players',
          team: playerCard.getAttribute('data-team'),
          playerIndex: +playerCard.getAttribute('data-player-i')
        }, '*');
        return;
      }
      var pick = resolveEmbedPick(e.target);
      if (!pick) return;
      e.preventDefault();
      e.stopPropagation();
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'lyokfox-studio-pick', section: pick.section, field: pick.field }, '*');
      }
    }, true);
  }

  function initStudioEmbedMode() {
    if (window.location.search.indexOf('studio-embed=1') < 0) return;
    document.documentElement.classList.add('studio-embed');
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initStudioEmbedPick);
    } else {
      initStudioEmbedPick();
    }
  }

  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'lyokfox-cms-preview') return;
    if (window.parent === window) return;
    applyPreview(e.data.payload);
    if (e.data.highlight) {
      highlightPreviewBlocks(e.data.highlight, { pulse: !!e.data.pulse });
    }
    runPreviewContext(e.data.previewContext);
  });

  function runPreviewContext(ctx) {
    if (!ctx || !document.documentElement.classList.contains('studio-embed')) return;
    if (ctx.type === 'news' && ctx.mode === 'breaking') {
      highlightPreviewBlocks('#news-breaking', { pulse: true });
      return;
    }
    if (ctx.type === 'news' && ctx.mode === 'article' && ctx.articleId && ctx.openArticle) {
      setTimeout(function () {
        document.dispatchEvent(new CustomEvent('cms:preview-open-article', {
          detail: { id: ctx.articleId }
        }));
      }, 80);
      return;
    }
    if (ctx.type === 'player' && ctx.highlight) {
      setTimeout(function () {
        try {
          var el = document.querySelector(ctx.highlight);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (err) { /* ignore */ }
      }, 150);
    }
  }

  function previewFieldAttr(fieldId) {
    if (window.CMSStudioPreview && typeof window.CMSStudioPreview.fieldDataAttr === 'function') {
      return window.CMSStudioPreview.fieldDataAttr(fieldId);
    }
    return '';
  }

  function previewWhereText(opts) {
    if (!opts || !opts.where) return '';
    return '<small class="cms-field-where">Vista: ' + opts.where + '</small>';
  }

  function formatHeroTitle(text) {
    if (!text) return text;
    var t = text;
    if (/LYOKFOX/i.test(t)) {
      var ac = (document.body.classList.contains('home-minimal') && !document.body.classList.contains('home-v4'))
        ? 'hm-accent' : 'hero-v3-accent';
      t = t.replace(/LYOKFOX/gi, '<span>LYOK</span><span class="' + ac + '">FOX</span>');
    }
    var emPhrases = ['una camada', 'gana premios', 'la camada', 'colaboradores', 'negocios', 'kitsune', 'patrocinio'];
    emPhrases.forEach(function (ph) {
      if (t.indexOf('<em>') !== -1) return;
      var re = new RegExp('(' + ph.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'i');
      t = t.replace(re, '<em>$1</em>');
    });
    return t;
  }

  function applyPageTexts() {
    if (typeof CMS_PAGES === 'undefined') return;
    var page = document.body.dataset.page;
    if (!page || !CMS_PAGES[page]) return;
    var p = CMS_PAGES[page];
    document.querySelectorAll('[data-cms-hero-title]').forEach(function (el) {
      if (!p.heroTitle) return;
      if (el.classList.contains('hero-portada-title')) {
        var lyok = el.querySelector('.hero-portada-lyok');
        var fox = el.querySelector('.hero-portada-fox');
        if (lyok && fox) {
          lyok.textContent = 'LYOK';
          fox.textContent = 'FOX';
        }
        return;
      }
      if (el.classList.contains('hm-title') && el.querySelector('.hm-accent')) {
        el.innerHTML = 'LYOK<span class="hm-accent">FOX</span>';
        return;
      }
      el.innerHTML = formatHeroTitle(p.heroTitle);
    });
    document.querySelectorAll('[data-cms-hero-sub]').forEach(function (el) {
      if (p.heroSub) el.textContent = p.heroSub;
    });
    document.querySelectorAll('[data-cms-tagline]').forEach(function (el) {
      if (p.heroTagline) el.textContent = p.heroTagline;
    });
    if (p.sections) {
      Object.keys(p.sections).forEach(function (key) {
        var s = p.sections[key];
        document.querySelectorAll('[data-cms-section="' + key + '"]').forEach(function (wrap) {
          var eyebrow = wrap.querySelector('[data-cms-eyebrow]');
          var title = wrap.querySelector('[data-cms-title]');
          var accent = wrap.querySelector('[data-cms-accent]');
          var sub = wrap.querySelector('[data-cms-sub]');
          if (eyebrow && s.eyebrow) eyebrow.textContent = s.eyebrow;
          if (title && s.title) title.textContent = s.title;
          if (accent && s.accent) accent.textContent = s.accent;
          if (sub && s.sub) sub.textContent = s.sub;
        });
      });
    }
  }

  function field(label, id, value, type) {
    type = type || 'text';
    return '<label class="cms-field"><span>' + label + '</span>' +
      '<input type="' + type + '" id="' + id + '" value="' + escAttr(value) + '"' + previewFieldAttr(id) + '></label>';
  }

  function fieldEasy(label, id, value, opts) {
    opts = opts || {};
    var type = opts.type || 'text';
    var hint = opts.hint ? '<small class="cms-field-hint">' + opts.hint + '</small>' : '';
    var where = previewWhereText(opts);
    return '<label class="cms-field cms-field-easy' + (opts.full ? ' cms-field-full' : '') + '" data-preview-field="' + escAttr(id) + '">' +
      '<span class="cms-field-label">' + label + '</span>' +
      where + hint +
      '<input type="' + type + '" id="' + id + '" value="' + escAttr(value) + '" placeholder="' + escAttr(opts.placeholder || '') + '"' + previewFieldAttr(id) + '>' +
    '</label>';
  }

  function textareaEasy(label, id, value, opts) {
    opts = opts || {};
    var rows = opts.rows || 4;
    var hint = opts.hint ? '<small class="cms-field-hint">' + opts.hint + '</small>' : '';
    var where = previewWhereText(opts);
    return '<label class="cms-field cms-field-easy cms-field-full" data-preview-field="' + escAttr(id) + '">' +
      '<span class="cms-field-label">' + label + '</span>' +
      where + hint +
      '<textarea id="' + id + '" rows="' + rows + '" placeholder="' + escAttr(opts.placeholder || '') + '"' + previewFieldAttr(id) + '>' + escTextarea(value) + '</textarea>' +
    '</label>';
  }

  function helpBox(title, body, type) {
    type = type || 'info';
    return '<div class="cms-help-box cms-help-box--' + type + '">' +
      (title ? '<strong>' + title + '</strong>' : '') +
      '<p>' + body + '</p>' +
    '</div>';
  }

  function stepsBox(steps) {
    var items = (steps || []).map(function (s, i) {
      return '<li><span class="cms-step-num">' + (i + 1) + '</span><div>' + s + '</div></li>';
    }).join('');
    return '<ol class="cms-steps-box">' + items + '</ol>';
  }

  function taskCard(icon, title, desc, sectionId) {
    var iconHtml = '';
    if (window.CMSStudioIcons) {
      iconHtml = window.CMSStudioIcons.render(sectionId) || window.CMSStudioIcons.render(icon);
    }
    if (!iconHtml && icon) iconHtml = '<span class="cms-ico-legacy">' + icon + '</span>';
    return '<button type="button" class="cms-task-card" data-goto="' + sectionId + '">' +
      '<span class="cms-task-icon">' + iconHtml + '</span>' +
      '<span class="cms-task-body"><strong>' + title + '</strong><em>' + desc + '</em></span>' +
      '<span class="cms-task-arrow">→</span>' +
    '</button>';
  }

  function textarea(label, id, value, rows) {
    rows = rows || 4;
    return '<label class="cms-field cms-field-full"><span>' + label + '</span>' +
      '<textarea id="' + id + '" rows="' + rows + '">' + escTextarea(value) + '</textarea></label>';
  }

  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 3500);
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = (typeof SITE !== 'undefined' && SITE.asset) ? SITE.asset(src) : src;
      s.async = false;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('No se pudo cargar ' + src)); };
      document.body.appendChild(s);
    });
  }

  var studioBundlePromise = null;

  function loadStudioBundle() {
    if (window.CMSStudio) return Promise.resolve();
    if (studioBundlePromise) return studioBundlePromise;
    studioBundlePromise = ensureStudioDataLoaded()
      .then(function () { return loadScript('js/cms-sync.js'); })
      .then(function () { return loadScript('js/cms-studio-icons.js'); })
      .then(function () { return loadScript('js/cms-studio.js'); })
      .then(function () { return loadScript('js/cms-studio-pro.js'); })
      .then(function () { return loadScript('js/cms-studio-easy.js'); })
      .then(function () { return loadScript('js/cms-studio-ultimate.js'); })
      .then(function () { return loadScript('js/cms-studio-premium.js'); })
      .then(function () { return loadScript('js/cms-studio-extra.js'); })
      .then(function () { return loadScript('js/cms-studio-schedule-visual.js'); })
      .then(function () { return loadScript('js/cms-historia-mirror.js'); })
      .then(function () { return loadScript('js/cms-studio-cohesion.js'); })
      .then(function () { return loadScript('js/cms-studio-unified.js'); });
    return studioBundlePromise;
  }

  function openAdmin() {
    var customPin = loadRaw().pin;
    function launch() {
      prepareStudio().then(function () {
        if (window.CMSStudio && typeof window.CMSStudio.open === 'function') {
          window.CMSStudio.open();
          return;
        }
        alert('Studio CMS no cargado. Recarga con Ctrl+F5.');
      }).catch(function (ex) {
        alert('Error al cargar Studio: ' + (ex && ex.message ? ex.message : ex));
      });
    }
    function start() {
      loadStudioBundle().then(launch).catch(function (ex) {
        alert('Error al cargar Studio: ' + (ex && ex.message ? ex.message : ex));
      });
    }
    if (!customPin || normalizePin(customPin) === normalizePin(DEFAULT_PIN)) {
      start();
      return;
    }
    showPinGate(start);
  }

  function closeAdmin() {
    if (window.CMSStudio && typeof window.CMSStudio.close === 'function') {
      window.CMSStudio.close();
      return;
    }
    var overlay = document.getElementById('cms-overlay');
    if (overlay) overlay.remove();
    document.body.style.overflow = '';
  }

  var STUDIO_DATA_SCRIPTS = [
    'js/news-data.js',
    'js/rosters.js',
    'js/teams-info.js',
    'js/sponsor-data.js',
    'js/cms-history-defaults.js',
    'js/schedule.js'
  ];

  var HOME_DEFAULTS = {
    eyebrow: 'Est. 2020 · Brawl · Clash · Clubes Pro · #Indomables',
    tagline: 'La astucia del kitsune · El fuego de la competición',
    disciplines: 'Brawl Stars · Clash Royale · Clubes Pro FC26',
    ctaPrimary: 'Gana Kitsune Points',
    ctaSecondary: 'Ver equipos',
    portada: {
      live: 'LyokFox Esports · En competición',
      hud: ['3|Equipos oficiales', '43|Jugadores en plantilla', '5|Años de historia']
    },
    stats: [
      { value: '43', label: 'Jugadores' },
      { value: 'TOP', label: 'Brawl EU' },
      { value: '1ª', label: 'PLG / VFO' },
      { value: 'KP', label: 'Comunidad' }
    ],
    spotlight: [
      { eyebrow: 'Zona Comunidad', title: 'Kitsune Points', text: 'Minijuegos, predicciones, Like/RT en X y tienda con camisetas, gorras y merch real.', link: 'Entrar y jugar →' },
      { eyebrow: 'Matchday', title: 'Calendario oficial', text: 'VPG Zero Masters, PLG, VFO, scrims Brawl y Supremacy CR — rivales reales cada semana.', link: 'Ver partidos →' },
      { eyebrow: 'Plantillas', title: '43 jugadores', text: 'Brawl Stars, Clash Royale y Clubes Pro FC26 — rosters completos y fichas detalladas.', link: 'Ver equipos →' }
    ],
    kp: {
      title: '¿Qué son los Kitsune Points?',
      desc: 'La moneda oficial de LyokFox. Gana KP con acciones en X, predicciones, minijuegos y lectura de noticias. Canjea por premios reales en la tienda.',
      list: ['Like en @LyokFox_ = +20 KP', 'RT oficial = +35 KP', 'Predicción acertada = +100 KP', 'Camiseta desde 2.500 KP'],
      chips: ['Predicciones', 'Minijuegos', 'Tienda']
    },
    communityCta: {
      eyebrow: 'Zona camada',
      title: 'Gana Kitsune Points · premios reales',
      text: 'Entra a la Zona Comunidad: juegos, predicciones, misiones y tienda con premios físicos.',
      btn: 'Entrar a la camada →',
      badges: ['Gratis', 'Sin app', 'Premios reales']
    },
    scheduleNote: 'Horarios en CEST · Sigue los matchdays en @LyokFox_ · Predicciones KP en Comunidad',
    indomables: {
      title: '#Indomables 7700+',
      text: 'La comunidad kitsune en X. Etiqueta @lyokfox y presume tu foto naranja. Campañas, marcos y premios para la camada.'
    },
    gameCards: [
      { title: 'Brawl Stars', flag: 'Principal', text: '3v3 ranked, scrims, map pool y draft. 8 jugadores + 2 capitanes IGL.', tags: ['Gem Grab', 'Bounty', 'Knockout', 'Ranked'] },
      { title: 'Clash Royale', flag: 'Ladder', text: 'Ladder, Clan Wars y torneos. 8 jugadores + 2 capitanes.', tags: ['Ladder', 'CW', 'Torneos'] },
      { title: 'Clubes Pro FC26', flag: 'Pro Clubs', text: '25 jugadores · VPG, PLG y VFO.', tags: ['VPG', 'PLG', 'VFO'] }
    ],
    portals: [
      { num: 'KP', title: 'Comunidad', text: 'Kitsune Points · juegos · premios', link: 'Jugar →' },
      { num: '01', title: 'Equipos', text: 'Fichas detalladas · 43 jugadores', link: 'Rosters →' },
      { num: '02', title: 'Historia', text: 'Crónica desde 2020 · BS Top 7/9 · UNITE EU', link: 'Leer →' },
      { num: '03', title: 'Patrocinio', text: 'Dossier B2B · paquetes y palmarés', link: 'Dossier →' },
      { num: '04', title: 'Contáctanos', text: 'Fichajes · pruebas · prensa', link: 'Contactar →' }
    ],
    portalNews: { num: 'NEWS', title: 'Noticias', text: 'Centro de noticias · +10 KP por leer', link: 'Leer →' }
  };

  var PAGE_SHELL_DEFAULTS = {
    inicio: {
      brandsLabel: 'Disciplinas oficiales',
      brandLabels: ['Brawl Stars', 'Clash Royale', 'EA Sports FC 26'],
      kpEyebrow: 'Kitsune Points',
      kpBtn1: 'Ir a Comunidad',
      kpBtn2: 'Ver tienda KP',
      gamesEyebrow: 'Disciplinas',
      gamesTitle: 'Tres <em>frentes</em> de batalla',
      gamesSub: 'Brawl Stars, Clash Royale y Clubes Pro — plantillas completas y competición oficial.',
      newsEyebrow: 'Actualidad',
      newsTitle: 'Últimas <em>noticias</em>',
      newsSub: 'Matchday, fichajes y novedades del club · +10 KP por cada artículo leído',
      newsBtn: 'Ver todas las noticias →',
      matchEyebrow: 'Matchday',
      matchTitle: 'Próximos <em>partidos</em>'
    },
    noticias: {
      eyebrow: 'LyokFox News',
      title: 'Noticias <em>oficiales</em>',
      lead: 'Matchday, fichajes, palmarés y novedades del club. Lee cada artículo y suma <strong data-points-short>KP</strong> en la Zona Comunidad.',
      kpBtn: '+10 KP por leer',
      kpBtnSecondary: 'Canjear KP',
      breakingLabel: 'Última hora',
      searchPlaceholder: 'Buscar noticia…'
    },
    comunidad: {
      eyebrow: 'Zona camada',
      title: 'Comunidad <em>Kitsune</em>',
      lead: 'Gana <strong data-points-short>KP</strong> en redes, minijuegos, predicciones y lectura de noticias. Canjea camisetas, gorras y merch real en la tienda.',
      heroBtn1: 'Ir a la tienda',
      heroBtn2: 'Noticias +10 KP',
      newsLink: 'Noticias →',
      tabs: ['Redes +KP', 'Tienda', 'Juegos', 'Predicciones', 'Misiones', 'Ranking'],
      footerActionsLabel: 'Acciones totales:',
      footerKpLabel: 'KP en redes:',
      arcadeTitle: 'Arcade camada',
      arcadeSub: 'Minijuegos diarios · ruleta · objetivos semanales',
      weeklyTitle: 'Objetivos semanales',
      predEafcTitle: 'Partidos EAFC · Clubes Pro',
      predEafcSub: '+25 KP al registrar · +100 si aciertas',
      predOtherTitle: 'Otros equipos LyokFox',
      predOtherSub: 'Brawl · Clash · scrims',
      predResultsTitle: 'Resultados recientes',
      rankingTitle: 'Ranking',
      achievementsTitle: 'Logros',
      faqSummary: 'FAQ Kitsune Points',
      onboardTitle: 'Únete a la camada',
      onboardText: 'Elige apodo para guardar Kitsune Points.',
      onboardNickLabel: 'Apodo',
      onboardBtn: 'Entrar',
      onboardFine: 'Ajustes web ⚙️ PIN: lyokfox',
      redeemTitle: 'Premio canjeado'
    },
    equipos: {
      rosterHeading: 'Roster oficial',
      rosterHintBrawl: 'Pulsa cualquier jugador para ver su ficha · o usa «Ficha equipo» arriba.',
      rosterHintClash: 'Pulsa cualquier jugador para ver su ficha.',
      rosterHintEafc: 'Pulsa cualquier jugador para ver su ficha.',
      fichaBtn: 'Ficha equipo',
      staffTitle: 'Staff & Comunidad',
      ctaEyebrow: 'Camada',
      ctaBtn1: 'Zona Comunidad',
      ctaBtn2: 'Contáctanos'
    }
  };

  var studioDataPromise = null;

  function ensureStudioDataLoaded() {
    if (studioDataPromise) return studioDataPromise;
    studioDataPromise = STUDIO_DATA_SCRIPTS.reduce(function (chain, src) {
      return chain.then(function () {
        if (src.indexOf('news-data') >= 0 && typeof NEWS !== 'undefined') return;
        if (src.indexOf('rosters') >= 0 && typeof ROSTERS !== 'undefined') return;
        if (src.indexOf('teams-info') >= 0 && typeof TEAMS_INFO !== 'undefined') return;
        if (src.indexOf('sponsor-data') >= 0 && typeof SPONSOR !== 'undefined') return;
        if (src.indexOf('cms-history-defaults') >= 0 && typeof CMS_HISTORY_DEFAULTS !== 'undefined') return;
        if (src.indexOf('schedule') >= 0 && typeof SCHEDULE !== 'undefined') return;
        return loadScript(src);
      });
    }, Promise.resolve());
    return studioDataPromise;
  }

  function exportDefaultsFromGlobals() {
    var d = {};
    var logoDefault = (typeof window.LYOKFOX_DEFAULT_LOGO !== 'undefined' && window.LYOKFOX_DEFAULT_LOGO)
      ? window.LYOKFOX_DEFAULT_LOGO
      : ((typeof window.LOGO !== 'undefined' && isSafeImageUrl(window.LOGO)) ? window.LOGO : '');
    if (typeof SITE !== 'undefined') {
      d.site = {
        name: SITE.name,
        tagline: SITE.tagline,
        email: SITE.email,
        est: SITE.est,
        tickerBreaking: SITE.tickerBreaking,
        pageLabels: deepClone(SITE.pageLabels || {}),
        navOrder: SITE.navOrder ? SITE.navOrder.slice() : [],
        points: SITE.points ? deepClone(SITE.points) : {},
        leagues: SITE.leagues ? deepClone(SITE.leagues) : {},
        partners: SITE.partners ? deepClone(SITE.partners) : {}
      };
    }
    if (typeof NEWS !== 'undefined') {
      d.news = deepClone({
        breaking: NEWS.breaking,
        breakingLabel: NEWS.breakingLabel,
        articles: NEWS.articles || []
      });
    }
    if (typeof COMMUNITY !== 'undefined') d.community = deepClone(COMMUNITY);
    if (typeof ROSTERS !== 'undefined') d.rosters = deepClone(ROSTERS);
    if (typeof TEAMS_INFO !== 'undefined') d.teamsInfo = deepClone(TEAMS_INFO);
    if (typeof SCHEDULE !== 'undefined') d.schedule = deepClone(SCHEDULE);
    if (typeof SPONSOR !== 'undefined') d.sponsor = deepClone(SPONSOR);
    if (typeof CMS_PAGES !== 'undefined') d.pages = deepClone(CMS_PAGES);
    if (typeof CMS_HISTORY_DEFAULTS !== 'undefined') d.history = deepClone(CMS_HISTORY_DEFAULTS);
    if (logoDefault) d.images = { logo: logoDefault };
    d.home = deepClone(HOME_DEFAULTS);
    if (typeof window.BANNER !== 'undefined' && window.BANNER) {
      d.images = d.images || {};
      d.images.banner = window.BANNER;
    }
    d.pageShells = deepClone(PAGE_SHELL_DEFAULTS);
    return d;
  }

  function getMerged() {
    var base = exportDefaultsFromGlobals();
    var stored = loadRaw();
    var out = deepClone(base);
    deepMerge(out, stored);
    if (base.news && base.news.articles && base.news.articles.length) {
      if (!out.news || !out.news.articles || !out.news.articles.length) {
        out.news = out.news || {};
        out.news.articles = deepClone(base.news.articles);
      }
      if (!out.news.breaking && base.news.breaking) out.news.breaking = base.news.breaking;
    }
    if (base.history) {
      out.history = deepMerge(deepClone(base.history), out.history || {});
    }
    if (base.pageShells) {
      out.pageShells = out.pageShells || {};
      Object.keys(base.pageShells).forEach(function (k) {
        out.pageShells[k] = deepMerge(deepClone(base.pageShells[k]), out.pageShells[k] || {});
      });
    }
    return out;
  }

  function getNewsArticles() {
    var m = getMerged();
    return (m.news && m.news.articles && m.news.articles.length)
      ? m.news.articles
      : ((typeof NEWS !== 'undefined' && NEWS.articles) ? NEWS.articles : []);
  }

  function getNewsBreaking() {
    var m = getMerged();
    if (m.news && m.news.breaking) return m.news.breaking;
    return (typeof NEWS !== 'undefined' && NEWS.breaking) ? NEWS.breaking : '';
  }

  function getPageShell(key) {
    var m = getMerged();
    return (m.pageShells && m.pageShells[key]) ? m.pageShells[key] : (PAGE_SHELL_DEFAULTS[key] || {});
  }

  function getHistoryData() {
    return getMerged().history || (typeof CMS_HISTORY_DEFAULTS !== 'undefined' ? CMS_HISTORY_DEFAULTS : {});
  }

  function normalizeHistoryChapter(ch) {
    ch = ch || {};
    return {
      chapterNum: ch.chapterNum || ch.num || '',
      title: ch.title || '',
      subtitle: ch.subtitle || ch.sub || '',
      eraLabel: ch.eraLabel || ch.era || '',
      paragraphs: ch.paragraphs || [],
      quoteText: ch.quoteText || (ch.quote && ch.quote.text) || '',
      quoteCite: ch.quoteCite || (ch.quote && ch.quote.cite) || ''
    };
  }

  function prepareStudio() {
    return ensureStudioDataLoaded().then(function () {
      if (window.LyokFoxCmsSync && typeof window.LyokFoxCmsSync.pull === 'function') {
        return window.LyokFoxCmsSync.pull().catch(function () { return null; });
      }
      return null;
    }).then(function () {
      apply();
    });
  }

  function injectAdminButton() {
    if (document.getElementById('cms-fab')) return;
    function mountFab() {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'cms-fab';
      btn.className = 'cms-fab cms-fab--premium';
      btn.title = 'LyokFox Studio — Editar la web';
      btn.innerHTML = (window.CMSStudioIcons && window.CMSStudioIcons.fabHtml)
        ? window.CMSStudioIcons.fabHtml()
        : '<span class="cms-fab-glow" aria-hidden="true"></span><span class="cms-fab-inner"><span class="cms-fab-label">Studio</span></span>';
      btn.onclick = openAdmin;
      document.body.appendChild(btn);
    }
    if (window.CMSStudioIcons) {
      mountFab();
      return;
    }
    loadScript('js/cms-studio-icons.js').then(mountFab).catch(mountFab);
  }

  window.CMS = {
    SK: SK,
    apply: apply,
    applyFromData: applyFromData,
    applyPreview: applyPreview,
    open: openAdmin,
    close: closeAdmin,
    load: loadRaw,
    save: saveRaw,
    resetPin: resetPinToDefault,
    verifyPin: verifyPin,
    defaultPin: DEFAULT_PIN,
    deepMerge: deepMerge,
    escAttr: escAttr,
    escTextarea: escTextarea,
    safeImageFieldValue: safeImageFieldValue,
    field: field,
    fieldEasy: fieldEasy,
    textareaEasy: textareaEasy,
    helpBox: helpBox,
    stepsBox: stepsBox,
    taskCard: taskCard,
    textarea: textarea,
    toast: toast,
    formatHeroTitle: formatHeroTitle,
    applyPageTexts: applyPageTexts,
    syncCommunityNews: syncCommunityNews,
    downloadBackup: downloadBackup,
    restoreBackupFromFile: restoreBackupFromFile,
    deepClone: deepClone,
    BACKUP_EXT: BACKUP_EXT,
    refreshImages: refreshImages,
    applyImagesToDOM: applyImagesToDOM,
    ICON_DEFS: CMS_ICON_DEFS,
    isSafeImageUrl: isSafeImageUrl,
    defaultLogoUrl: defaultLogoUrl,
    resolveLogoUrl: resolveLogoUrl,
    ensureStudioDataLoaded: ensureStudioDataLoaded,
    prepareStudio: prepareStudio,
    getMerged: getMerged,
    getNewsArticles: getNewsArticles,
    getNewsBreaking: getNewsBreaking,
    getPageShell: getPageShell,
    getHistoryData: getHistoryData,
    normalizeHistoryChapter: normalizeHistoryChapter,
    exportDefaultsFromGlobals: exportDefaultsFromGlobals
  };

  function initCloudCms() {
    loadScript('js/supabase-config.js').catch(function () { return null; }).then(function () {
      if (!isConfiguredForCloud()) {
        apply();
        return;
      }
      return loadScript('js/cms-sync.js').then(function () {
        if (window.LyokFoxCmsSync && typeof window.LyokFoxCmsSync.pull === 'function') {
          return window.LyokFoxCmsSync.pull();
        }
        return null;
      });
    }).then(function () {
      apply();
    }).catch(function () {
      apply();
    });
  }

  function isConfiguredForCloud() {
    var c = window.SUPABASE_CONFIG || {};
    return !!(c.enabled && c.url && c.anonKey && String(c.url).indexOf('TU-PROYECTO') < 0);
  }

  sanitizeStoredPin();
  initStudioEmbedMode();
  document.addEventListener('DOMContentLoaded', injectAdminButton);
  document.addEventListener('layout:ready', function () {
    injectAdminButton();
    initCloudCms();
  });
})();
