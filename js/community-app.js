(function () {
  'use strict';

  if (typeof COMMUNITY === 'undefined') return;

  var SK = COMMUNITY.storageKey;

  function pts(n, opts) {
    opts = opts || {};
    var num = typeof n === 'number' ? n.toLocaleString('es-ES') : n;
    var sign = opts.sign !== false && typeof n === 'number' && n > 0 ? '+' : '';
    if (opts.full) return sign + num + ' ' + COMMUNITY.currencyName + ' (' + COMMUNITY.currency + ')';
    if (opts.name) return sign + num + ' ' + COMMUNITY.currencyName;
    return sign + num + ' ' + COMMUNITY.currency;
  }

  function ptsLabel(key) {
    var map = {
      available: COMMUNITY.currencyName + ' disponibles',
      lifetime: COMMUNITY.currencyName + ' totales',
      distributed: COMMUNITY.currencyName + ' repartidos',
      fromX: 'tu ' + COMMUNITY.currencyName + ' desde X'
    };
    return map[key] || COMMUNITY.currencyName;
  }

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function uid() {
    return 'LF-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  }

  function defaultState() {
    return {
      nickname: '',
      points: 0,
      lifetime: 0,
      streak: 0,
      lastLogin: '',
      predictions: {},
      predictionWins: 0,
      quizDone: {},
      quizPerfect: 0,
      missions: {},
      redeemed: [],
      achievements: [],
      pollVotes: {},
      newsRead: {},
      games: {
        reflex: { day: '', plays: 0, best: 0 },
        memory: { day: '', plays: 0, best: 0 },
        spin: { day: '' },
        word: { day: '' },
        tap: { day: '', best: 0 },
        emote: { day: '' }
      },
      gamesToday: {},
      gamesTotal: 0,
      dailyChallenge: { day: '', id: '', claimed: false },
      weekly: { key: '', predictions: 0, games: 0, missions: 0, twitter: 0, claimed: {} },
      twitterClaims: {},
      twitterActions: 0,
      twitterCombos: 0,
      twitterKp: 0,
      instagramClaims: {},
      instagramKp: 0,
      fansClaims: {},
      fansKp: 0,
      promoRedeemed: [],
      activity: [],
      profile: {
        bio: '',
        avatar: '',
        twitter: '',
        twitterLinked: false,
        twitterLinkedAt: '',
        instagram: '',
        country: 'ES',
        favoriteGame: 'brawlStars',
        publicRanking: true,
        createdAt: ''
      }
    };
  }

  function weekKey() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    var y = d.getFullYear();
    var w = Math.ceil((((d - new Date(y, 0, 1)) / 86400000) + 1) / 7);
    return y + '-W' + w;
  }

  function ensureWeekly() {
    var wk = weekKey();
    if (state.weekly.key !== wk) {
      state.weekly = { key: wk, predictions: 0, games: 0, missions: 0, twitter: 0, social: 0, claimed: {} };
    }
  }

  function ensureGamesToday() {
    var t = todayKey();
    if (state.gamesToday.date !== t) {
      state.gamesToday = { date: t, list: {}, predictions: 0 };
    }
  }

  function trackGame(name) {
    ensureGamesToday();
    state.gamesToday.list[name] = true;
    state.gamesTotal += 1;
    ensureWeekly();
    state.weekly.games += 1;
    save(state);
    checkAutoMissions();
    renderDailyChallenge();
    renderWeekly();
  }

  function trackPrediction() {
    ensureGamesToday();
    state.gamesToday.predictions = (state.gamesToday.predictions || 0) + 1;
    ensureWeekly();
    state.weekly.predictions += 1;
    save(state);
    checkAutoMissions();
    renderDailyChallenge();
    renderWeekly();
  }

  function getDailyChallenge() {
    var day = todayKey();
    var idx = Math.floor(new Date(day).getTime() / 86400000) % COMMUNITY.dailyChallenges.length;
    return COMMUNITY.dailyChallenges[idx];
  }

  function challengeProgress(ch) {
    ensureGamesToday();
    if (ch.check === 'predictions_today') return state.gamesToday.predictions || 0;
    if (ch.check === 'quiz_done') return state.quizDone[todayKey()] ? 1 : 0;
    if (ch.check === 'spin_done') return state.games.spin.day === todayKey() ? 1 : 0;
    if (ch.check === 'word_done') return state.games.word.day === todayKey() ? 1 : 0;
    if (ch.check === 'games_played') return Object.keys(state.gamesToday.list || {}).length;
    if (ch.check === 'missions_done') {
      return COMMUNITY.missions.filter(function (m) {
        return state.missions[m.id] && m.type !== 'auto' && m.type !== 'auto_pred';
      }).length > 0 ? 1 : 0;
    }
    if (ch.check === 'news_read') {
      return Object.keys(state.newsRead).length;
    }
    if (ch.check === 'twitter_claims') return countTwitterActions();
    if (ch.check === 'twitter_combo') return state.twitterCombos || 0;
    if (ch.check === 'twitter_comment') return countTwitterComments();
    return 0;
  }

  function countTwitterComments() {
    var n = 0;
    Object.keys(state.twitterClaims || {}).forEach(function (pid) {
      if (state.twitterClaims[pid].comment) n += 1;
    });
    return n;
  }

  function countTwitterActions() {
    var n = 0;
    Object.keys(state.twitterClaims || {}).forEach(function (pid) {
      var c = state.twitterClaims[pid];
      if (c.like) n += 1;
      if (c.rt) n += 1;
      if (c.comment) n += 1;
    });
    return n;
  }

  function countInstagramActions() {
    var n = 0;
    Object.keys(state.instagramClaims || {}).forEach(function (pid) {
      var c = state.instagramClaims[pid];
      if (c.like) n += 1;
      if (c.comment) n += 1;
      if (c.save) n += 1;
    });
    return n;
  }

  function countFansActions() {
    var n = 0;
    Object.keys(state.fansClaims || {}).forEach(function (pid) {
      var c = state.fansClaims[pid];
      if (c.like) n += 1;
      if (c.rt) n += 1;
      if (c.comment) n += 1;
    });
    return n;
  }

  function getSocialKpTotal() {
    return (state.twitterKp || 0) + (state.instagramKp || 0) + (state.fansKp || 0);
  }

  function countAllSocialActions() {
    return countTwitterActions() + countInstagramActions() + countFansActions();
  }

  function trackSocialWeekly() {
    ensureWeekly();
    state.weekly.social = (state.weekly.social || 0) + 1;
  }

  function getPostClaims(postId) {
    if (!state.twitterClaims[postId]) state.twitterClaims[postId] = {};
    return state.twitterClaims[postId];
  }

  function claimTwitter(postId, action) {
    if (!state.nickname) {
      toast('Elige tu apodo primero');
      showOnboarding();
      return;
    }
    var post = COMMUNITY.twitterPosts.find(function (p) { return p.id === postId; });
    if (!post) return;
    var rw = COMMUNITY.twitterRewards;
    var claims = getPostClaims(postId);

    if (action === 'like') {
      if (claims.like) { toast('Ya reclamaste el Like de este post'); return; }
      claims.like = true;
      state.twitterActions += 1;
      state.twitterKp = (state.twitterKp || 0) + rw.perLike;
      ensureWeekly();
      state.weekly.twitter += 1;
      addPoints(rw.perLike, 'Like @LyokFox_ · ' + post.tag);
      maybeTwitterCombo(postId, post);
      maybeTwitterFullPost(postId, post);
      checkTwitterMissions();
      trackSocialWeekly();
      checkSocialMissions();
      save(state);
      renderSocialPosts();
      renderHUD();
      renderDailyChallenge();
      renderWeekly();
      return;
    }

    if (action === 'rt') {
      if (claims.rt) { toast('Ya reclamaste el RT de este post'); return; }
      claims.rt = true;
      state.twitterActions += 1;
      state.twitterKp = (state.twitterKp || 0) + rw.perRt;
      ensureWeekly();
      state.weekly.twitter += 1;
      addPoints(rw.perRt, 'RT @LyokFox_ · ' + post.tag);
      maybeTwitterCombo(postId, post);
      maybeTwitterFullPost(postId, post);
      checkTwitterMissions();
      trackSocialWeekly();
      checkSocialMissions();
      save(state);
      renderSocialPosts();
      renderHUD();
      renderDailyChallenge();
      renderWeekly();
      return;
    }

    if (action === 'comment') {
      if (claims.comment) { toast('Ya reclamaste el comentario de este post'); return; }
      claims.comment = true;
      state.twitterActions += 1;
      state.twitterKp = (state.twitterKp || 0) + rw.perComment;
      ensureWeekly();
      state.weekly.twitter += 1;
      addPoints(rw.perComment, 'Comentario @LyokFox_ · ' + post.tag);
      maybeTwitterFullPost(postId, post);
      checkTwitterMissions();
      trackSocialWeekly();
      checkSocialMissions();
      save(state);
      renderSocialPosts();
      renderHUD();
      renderDailyChallenge();
      renderWeekly();
    }
  }

  function maybeTwitterFullPost(postId, post) {
    var claims = getPostClaims(postId);
    var rw = COMMUNITY.twitterRewards;
    if (!rw.fullPostBonus) return;
    if (claims.like && claims.rt && claims.comment && !claims.full) {
      claims.full = true;
      state.twitterKp = (state.twitterKp || 0) + rw.fullPostBonus;
      addPoints(rw.fullPostBonus, 'Post completo X · ' + post.tag);
    }
  }

  function maybeIgFullPost(postId, post) {
    var claims = getIgClaims(postId);
    var rw = COMMUNITY.instagramRewards;
    if (!rw.fullPostBonus) return;
    if (claims.like && claims.comment && claims.save && !claims.full) {
      claims.full = true;
      state.instagramKp = (state.instagramKp || 0) + rw.fullPostBonus;
      addPoints(rw.fullPostBonus, 'Post completo IG · ' + post.tag);
    }
  }

  function maybeFansFullPost(postId, post) {
    var claims = getFansClaims(postId);
    var rw = COMMUNITY.fansRewards;
    if (!rw.fullPostBonus) return;
    if (claims.like && claims.rt && claims.comment && !claims.full) {
      claims.full = true;
      state.fansKp = (state.fansKp || 0) + rw.fullPostBonus;
      addPoints(rw.fullPostBonus, 'Post completo Fans · ' + post.tag);
    }
  }
  function maybeTwitterCombo(postId, post) {
    var claims = getPostClaims(postId);
    var rw = COMMUNITY.twitterRewards;
    if (claims.like && claims.rt && !claims.combo) {
      claims.combo = true;
      state.twitterCombos = (state.twitterCombos || 0) + 1;
      state.twitterKp = (state.twitterKp || 0) + rw.comboBonus;
      addPoints(rw.comboBonus, 'Combo Like+RT · ' + post.tag);
    }
  }

  function checkTwitterMissions() {
    var hasLike = false;
    var hasRt = false;
    var hasComment = false;
    Object.keys(state.twitterClaims || {}).forEach(function (pid) {
      var c = state.twitterClaims[pid];
      if (c.like) hasLike = true;
      if (c.rt) hasRt = true;
      if (c.comment) hasComment = true;
    });
    if (hasLike) completeMission('x_first_like');
    if (hasRt) completeMission('x_first_rt');
    if (hasComment) completeMission('x_first_comment');
    if ((state.twitterCombos || 0) >= 3) completeMission('x_combo3');
    if ((state.weekly.twitter || 0) >= 5) completeMission('x_week5');
    var allLikes = COMMUNITY.twitterPosts.every(function (p) {
      return state.twitterClaims[p.id] && state.twitterClaims[p.id].like;
    });
    if (allLikes && COMMUNITY.twitterPosts.length) completeMission('x_all_posts');
  }

  function getIgClaims(postId) {
    if (!state.instagramClaims[postId]) state.instagramClaims[postId] = {};
    return state.instagramClaims[postId];
  }

  function getFansClaims(postId) {
    if (!state.fansClaims[postId]) state.fansClaims[postId] = {};
    return state.fansClaims[postId];
  }

  function claimInstagram(postId, action) {
    if (!state.nickname) { toast('Elige tu apodo primero'); showOnboarding(); return; }
    var post = COMMUNITY.instagramPosts.find(function (p) { return p.id === postId; });
    if (!post) return;
    var rw = COMMUNITY.instagramRewards;
    var claims = getIgClaims(postId);
    if (action === 'like') {
      if (claims.like) { toast('Ya reclamaste el Like de este post'); return; }
      claims.like = true;
      state.instagramKp = (state.instagramKp || 0) + rw.perLike;
      addPoints(rw.perLike, 'Like Instagram · ' + post.tag);
      maybeIgFullPost(postId, post);
    } else if (action === 'comment') {
      if (claims.comment) { toast('Ya reclamaste comentario en este post'); return; }
      claims.comment = true;
      state.instagramKp = (state.instagramKp || 0) + rw.perComment;
      addPoints(rw.perComment, 'Comentario IG · ' + post.tag);
      maybeIgFullPost(postId, post);
    } else if (action === 'save') {
      if (claims.save) { toast('Ya reclamaste guardar este post'); return; }
      claims.save = true;
      state.instagramKp = (state.instagramKp || 0) + rw.perSave;
      addPoints(rw.perSave, 'Guardar IG · ' + post.tag);
      maybeIgFullPost(postId, post);
    }
    trackSocialWeekly();
    checkSocialMissions();
    save(state);
    renderSocialPosts();
    renderHUD();
    renderDailyChallenge();
    renderWeekly();
  }

  function claimFans(postId, action) {
    if (!state.nickname) { toast('Elige tu apodo primero'); showOnboarding(); return; }
    var post = COMMUNITY.fansPosts.find(function (p) { return p.id === postId; });
    if (!post) return;
    var rw = COMMUNITY.fansRewards;
    var claims = getFansClaims(postId);
    if (action === 'like') {
      if (claims.like) { toast('Ya reclamaste Like en este post'); return; }
      claims.like = true;
      state.fansKp = (state.fansKp || 0) + rw.perLike;
      addPoints(rw.perLike, 'Like @Lyokfox_Fans · ' + post.tag);
      maybeFansCombo(postId, post);
      maybeFansFullPost(postId, post);
    } else if (action === 'rt') {
      if (claims.rt) { toast('Ya reclamaste RT en este post'); return; }
      claims.rt = true;
      state.fansKp = (state.fansKp || 0) + rw.perRt;
      addPoints(rw.perRt, 'RT @Lyokfox_Fans · ' + post.tag);
      maybeFansCombo(postId, post);
      maybeFansFullPost(postId, post);
    } else if (action === 'comment') {
      if (claims.comment) { toast('Ya reclamaste comentario en este post'); return; }
      claims.comment = true;
      state.fansKp = (state.fansKp || 0) + rw.perComment;
      addPoints(rw.perComment, 'Comentario @Lyokfox_Fans · ' + post.tag);
      maybeFansFullPost(postId, post);
    }
    ensureWeekly();
    state.weekly.twitter += 1;
    trackSocialWeekly();
    checkSocialMissions();
    save(state);
    renderSocialPosts();
    renderHUD();
    renderWeekly();
  }

  function maybeFansCombo(postId, post) {
    var claims = getFansClaims(postId);
    var rw = COMMUNITY.fansRewards;
    if (claims.like && claims.rt && !claims.combo) {
      claims.combo = true;
      state.fansKp = (state.fansKp || 0) + rw.comboBonus;
      addPoints(rw.comboBonus, 'Combo Fans · ' + post.tag);
    }
  }

  function checkSocialMissions() {
    var hasIgLike = false;
    var hasIgComment = false;
    Object.keys(state.instagramClaims || {}).forEach(function (pid) {
      if (state.instagramClaims[pid].like) hasIgLike = true;
      if (state.instagramClaims[pid].comment) hasIgComment = true;
    });
    if (hasIgLike) completeMission('ig_first_like');
    if (hasIgComment) completeMission('ig_comment');
    var hasFans = countFansActions() >= 1;
    if (hasFans) completeMission('fans_first');
    if (countAllSocialActions() >= 10) completeMission('social10');
    var lv = getLevel(state.lifetime);
    if (lv.min >= 2000 || lv.id === 'kitsune' || ['naranja','alpha','elite','leyenda','mythic','supremo'].indexOf(lv.id) >= 0) {
      if (state.lifetime >= 2000) completeMission('level_kitsune_m');
    }
    if (state.lifetime >= 12000) completeMission('level_leyenda_m');
    checkAchievements();
  }

  function getLevelDiscount() {
    var lv = getLevel(state.lifetime);
    return lv.discount || 0;
  }

  function discountedCost(cost) {
    var d = getLevelDiscount();
    if (!d) return cost;
    return Math.max(1, Math.floor(cost * (1 - d)));
  }

  var socialNetwork = 'x';
  var shopCategory = 'all';

  function load() {
    try {
      var raw = localStorage.getItem(SK);
      if (!raw && SK === 'lyokfox_community_v3') {
        var legacy = localStorage.getItem('lyokfox_community_v2');
        if (legacy) {
          localStorage.setItem(SK, legacy);
          raw = legacy;
        }
      }
      if (!raw) return defaultState();
      return Object.assign(defaultState(), JSON.parse(raw));
    } catch (e) {
      return defaultState();
    }
  }

  function save(state) {
    localStorage.setItem(SK, JSON.stringify(state));
  }

  var state = load();
  var toastEl = null;

  function toast(msg) {
    if (!toastEl) toastEl = document.getElementById('toast');
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(function () { toastEl.classList.remove('show'); }, 4200);
  }

  function logActivity(text, pts) {
    state.activity.unshift({ t: Date.now(), text: text, pts: pts || 0 });
    if (state.activity.length > 30) state.activity.length = 30;
  }

  function addPoints(amount, reason) {
    if (amount <= 0) return;
    state.points += amount;
    state.lifetime += amount;
    logActivity(reason, amount);
    checkAchievements();
    save(state);
    renderHUD();
    toast(pts(amount) + ' · ' + reason);
  }

  function spendPoints(amount) {
    if (state.points < amount) return false;
    state.points -= amount;
    save(state);
    renderHUD();
    return true;
  }

  function getLevel(lifetime) {
    var lv = COMMUNITY.levels[0];
    COMMUNITY.levels.forEach(function (l) {
      if (lifetime >= l.min) lv = l;
    });
    return lv;
  }

  function nextLevel(lifetime) {
    for (var i = 0; i < COMMUNITY.levels.length; i++) {
      if (lifetime < COMMUNITY.levels[i].min) return COMMUNITY.levels[i];
    }
    return null;
  }

  function checkAchievements() {
    COMMUNITY.achievements.forEach(function (ach) {
      if (state.achievements.indexOf(ach.id) >= 0) return;
      var ok = false;
      if (ach.type === 'predictions_correct') ok = state.predictionWins >= ach.at;
      else if (ach.type === 'predictions_total') ok = Object.keys(state.predictions).length >= ach.at;
      else if (ach.type === 'streak') ok = state.streak >= ach.at;
      else if (ach.type === 'quiz_perfect') ok = state.quizPerfect >= ach.at;
      else if (ach.type === 'redeems') ok = state.redeemed.length >= ach.at;
      else if (ach.type === 'lifetime') ok = state.lifetime >= ach.at;
      else if (ach.type === 'games_total') ok = state.gamesTotal >= ach.at;
      else if (ach.type === 'news_read') ok = Object.keys(state.newsRead).length >= ach.at;
      else if (ach.type === 'twitter_actions') ok = countTwitterActions() >= ach.at;
      else if (ach.type === 'twitter_combos') ok = (state.twitterCombos || 0) >= ach.at;
      else if (ach.type === 'twitter_kp') ok = (state.twitterKp || 0) >= ach.at;
      else if (ach.type === 'instagram_actions') ok = countInstagramActions() >= ach.at;
      else if (ach.type === 'fans_actions') ok = countFansActions() >= ach.at;
      else if (ach.type === 'social_actions') ok = countAllSocialActions() >= ach.at;
      else if (ach.type === 'promos') ok = (state.promoRedeemed || []).length >= ach.at;
      else if (ach.type === 'weekly_claims') ok = Object.keys(state.weekly.claimed || {}).length >= ach.at;
      else ok = state.lifetime >= ach.at;
      if (ok) {
        state.achievements.push(ach.id);
        logActivity('Logro desbloqueado: ' + ach.name, 0);
        toast('🏆 Logro: ' + ach.name);
      }
    });
    save(state);
  }

  function processDailyLogin() {
    var today = todayKey();
    if (state.lastLogin === today) return;
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var yKey = yesterday.toISOString().slice(0, 10);
    if (state.lastLogin === yKey) state.streak += 1;
    else state.streak = 1;
    state.lastLogin = today;
    var bonus = Math.min(COMMUNITY.dailyLogin.streakCap, (state.streak - 1) * COMMUNITY.dailyLogin.streakBonus);
    var total = COMMUNITY.dailyLogin.base + bonus;
    addPoints(total, 'Bonus diario · racha x' + state.streak);
    save(state);
  }

  function formatDate(dateStr) {
    var d = new Date(dateStr + 'T12:00:00');
    var months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return d.getDate() + ' ' + months[d.getMonth()];
  }

  /* ─── RENDER HUD ─── */
  function renderHUD() {
    var lv = getLevel(state.lifetime);
    var next = nextLevel(state.lifetime);
    var pct = next ? Math.min(100, ((state.lifetime - lv.min) / (next.min - lv.min)) * 100) : 100;

    var nickEl = document.getElementById('comm-nick');
    var ptsEl = document.getElementById('comm-points');
    var streakEl = document.getElementById('comm-streak');
    var levelEl = document.getElementById('comm-level');
    var barEl = document.getElementById('comm-level-bar');

    if (nickEl) nickEl.textContent = state.nickname || 'Invitado';
    if (ptsEl) ptsEl.textContent = state.points.toLocaleString('es-ES');
    if (streakEl) streakEl.textContent = state.streak;
    if (levelEl) levelEl.textContent = lv.name;
    if (barEl) barEl.style.width = pct + '%';

    document.querySelectorAll('[data-comm-points]').forEach(function (el) {
      el.textContent = state.points.toLocaleString('es-ES');
    });
    renderStatsStrip();
    renderLevels();
    if (window.LyokFoxProfile) window.LyokFoxProfile.refresh(state);
  }

  /* ─── ONBOARDING ─── */
  function showOnboarding() {
    var modal = document.getElementById('comm-onboard');
    if (!modal) return;
    if (state.nickname) {
      modal.classList.remove('open');
      return;
    }
    modal.classList.add('open');
    var input = document.getElementById('comm-nick-input');
    var btn = document.getElementById('comm-nick-save');
    if (btn && input) {
      btn.onclick = function () {
        var nick = input.value.trim().slice(0, 18);
        if (nick.length < 2) {
          toast('El apodo debe tener al menos 2 caracteres');
          return;
        }
        state.nickname = nick;
        save(state);
        modal.classList.remove('open');
        renderHUD();
        completeMission('profile');
        renderMissions();
        renderLeaderboard();
        toast('¡Bienvenido a la camada, ' + nick + '!');
      };
    }
  }

  /* ─── PREDICTIONS ─── */
  function getPredictionMatches() {
    var raw = [];
    if (typeof SCHEDULE !== 'undefined' && SCHEDULE.upcoming && SCHEDULE.upcoming.length) {
      raw = SCHEDULE.upcoming.slice();
    }
    if (!raw.length && COMMUNITY.fallbackMatches) {
      raw = COMMUNITY.fallbackMatches.slice();
    }
    return raw.sort(function (a, b) {
      if (a.game === 'eafc' && b.game !== 'eafc') return -1;
      if (b.game === 'eafc' && a.game !== 'eafc') return 1;
      return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
    });
  }

  function showActivePanelReveals() {
    var panel = document.querySelector('.comm-v4-panel.active:not([hidden])');
    if (!panel) return;
    panel.querySelectorAll('.reveal-item, .pred-card-v5, .pred-hero-card, .reward-card-v5, .shop-showcase-card, .mission-row-v5, .x-post-card, .arcade-card-v5').forEach(function (el) {
      el.classList.add('show');
      el.style.opacity = '';
      el.style.transform = '';
    });
  }

  function refreshCommPanel(id) {
    if (id === 'tienda') {
      renderShopHero();
      renderShopFeatured();
      renderShopTiers();
      renderShopTips();
      renderShopCategories();
      renderPromo();
      renderShop();
      renderShopRecent();
      renderMyRedeems();
    } else if (id === 'predicciones') {
      renderPredMatchday();
      renderPredRules();
      renderFeaturedPrediction();
      renderPredictions();
      renderPredHistory();
    } else if (id === 'juegos') {
      renderDailyChallenge();
      renderSpin();
      if (!window._lyokGamesFull) {
        window._lyokGamesFull = true;
        requestAnimationFrame(function () {
          renderQuiz();
          renderReflex();
          renderMemory();
          renderWord();
          renderPoll();
          renderWeekly();
          renderArcadeLegend();
        });
      }
    } else if (id === 'misiones') {
      renderMissions();
    } else if (id === 'ranking') {
      renderLeaderboard();
      renderAchievements();
      renderActivity();
      renderFAQ();
    } else if (id === 'redes') {
      renderSocialPosts();
    }
    requestAnimationFrame(showActivePanelReveals);
  }

  function activateCommTab(id) {
    var tabs = document.querySelectorAll('.comm-v4-tab');
    tabs.forEach(function (t) {
      t.classList.toggle('active', t.dataset.commTab === id);
    });
    document.querySelectorAll('.comm-v4-panel').forEach(function (p) {
      var on = p.dataset.panel === id;
      p.hidden = !on;
      p.classList.toggle('active', on);
      if (on) {
        p.classList.remove('comm-panel-enter');
        void p.offsetWidth;
        p.classList.add('comm-panel-enter');
      }
    });
    refreshCommPanel(id);
    if (typeof syncSiteLinks === 'function') {
      var panel = document.querySelector('.comm-v4-panel.active:not([hidden])');
      syncSiteLinks(panel || document.querySelector('.comm-hub-panels') || undefined);
    }
  }

  function openCommTabFromHash() {
    var hash = (window.location.hash || '').replace('#', '');
    var map = {
      'apoya-redes': 'redes',
      redes: 'redes',
      tienda: 'tienda',
      juegos: 'juegos',
      predicciones: 'predicciones',
      misiones: 'misiones',
      ranking: 'ranking',
      noticias: null
    };
    if (map[hash]) activateCommTab(map[hash]);
  }

  function renderPredRules() {
    var el = document.getElementById('comm-pred-rules');
    if (!el) return;
    var g = COMMUNITY.globalStats || {};
    el.innerHTML =
      '<div class="pred-rule-chip"><strong>+25 KP</strong><span>por pick</span></div>' +
      '<div class="pred-rule-chip"><strong>+100 KP</strong><span>si aciertas</span></div>' +
      '<div class="pred-rule-chip"><strong>' + (g.predictionsWeek || 892).toLocaleString('es-ES') + '</strong><span>picks esta semana</span></div>' +
      '<div class="pred-rule-chip"><strong>1 pick</strong><span>por partido</span></div>' +
      '<a href="' + (typeof SITE !== 'undefined' ? SITE.social.twitter : 'https://x.com/LyokFox_') + '" target="_blank" rel="noopener" class="pred-rule-link">Seguir matchday en X →</a>';
  }

  function renderPredMatchday() {
    var el = document.getElementById('comm-pred-matchday');
    if (!el) return;
    var eafc = getPredictionMatches().filter(function (m) { return m.game === 'eafc'; });
    var today = eafc.filter(function (m) { return m.status === 'Hoy'; }).length;
    el.innerHTML =
      '<div class="pred-matchday-inner">' +
        '<span class="pred-matchday-badge">⚽ MATCHDAY FC26</span>' +
        '<div class="pred-matchday-copy">' +
          '<strong>' + eafc.length + ' partidos Clubes Pro</strong>' +
          '<em>' + (today ? today + ' hoy · ' : '') + 'VPG · PLG · VFO · predice y gana KP</em>' +
        '</div>' +
        '<div class="pred-matchday-stats">' +
          '<span><strong>' + Object.keys(state.predictions).length + '</strong> tus picks</span>' +
          '<span><strong>' + (state.predictionWins || 0) + '</strong> aciertos</span>' +
        '</div>' +
      '</div>';
  }

  function buildPredCard(m) {
    var picked = state.predictions[m.id];
    var resolved = COMMUNITY.predictionResults[m.id];
    var resultHtml = '';
    if (resolved && picked) {
      var win = picked === resolved;
      if (win) resultHtml = '<span class="pred-result pred-win">✓ Acertaste · +100 KP</span>';
      else resultHtml = '<span class="pred-result pred-lose">Resultado: ' + labelPick(resolved) + '</span>';
    }
    var statusBadge = m.status === 'Hoy'
      ? '<span class="pred-live-badge">EN VIVO</span>'
      : '<span class="pred-soon-badge">' + m.status + '</span>';
    return '<article class="pred-card-v5 match-' + m.game + '">' +
      '<div class="pred-card-v5-top">' +
        statusBadge +
        '<span class="pred-game">' + m.gameLabel + '</span>' +
        '<time>' + formatDate(m.date) + ' · ' + m.time + '</time>' +
      '</div>' +
      '<div class="pred-card-v5-teams">' +
        '<span class="pred-team pred-team-home">LyokFox</span>' +
        '<span class="pred-vs">VS</span>' +
        '<span class="pred-team">' + m.opponent + '</span>' +
      '</div>' +
      '<p class="pred-comp">' + m.competition + '</p>' +
      '<div class="pred-options" data-match="' + m.id + '">' +
        btnPick(m.id, 'lyokfox', 'Victoria LyokFox', picked) +
        btnPick(m.id, 'draw', 'Empate', picked) +
        btnPick(m.id, 'rival', 'Victoria rival', picked) +
      '</div>' +
      (picked ? '<p class="pred-picked">Tu pick: <strong>' + labelPick(picked) + '</strong> · +25 KP</p>' : '') +
      resultHtml +
    '</article>';
  }

  function bindPredCards(root) {
    if (!root) return;
    root.querySelectorAll('.pred-opt:not([disabled])').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var matchId = btn.closest('.pred-options').dataset.match;
        var pick = btn.dataset.pick;
        if (state.predictions[matchId]) return;
        state.predictions[matchId] = pick;
        addPoints(25, 'Predicción registrada');
        trackPrediction();
        completeMission('first_pred');
        save(state);
        renderPredictions();
        renderFeaturedPrediction();
        renderPredMatchday();
        checkPredictionResults();
      });
    });
  }

  function renderPredictions() {
    var eafcEl = document.getElementById('comm-predictions-eafc');
    var otherEl = document.getElementById('comm-predictions');
    if (!eafcEl && !otherEl) return;

    var matches = getPredictionMatches();
    var featuredId = (typeof SCHEDULE !== 'undefined' && SCHEDULE.featured) ? SCHEDULE.featured.id : '';
    var eafc = matches.filter(function (m) { return m.game === 'eafc' && m.id !== featuredId; });
    var other = matches.filter(function (m) { return m.game !== 'eafc'; });

    var otherHead = document.querySelector('.pred-section-head-v5.pred-section-alt');
    if (otherHead) otherHead.hidden = !other.length;

    if (!matches.length) {
      if (eafcEl) eafcEl.innerHTML = '<p class="comm-empty">Cargando calendario… Recarga con Ctrl+F5 si no aparecen partidos.</p>';
      if (otherEl) otherEl.innerHTML = '';
      return;
    }

    if (eafcEl) {
      eafcEl.innerHTML = eafc.length
        ? eafc.map(buildPredCard).join('')
        : '<p class="comm-empty comm-empty-inline">Partidos EAFC en el partido estrella ↑</p>';
      bindPredCards(eafcEl);
    }
    if (otherEl) {
      otherEl.innerHTML = other.length ? other.map(buildPredCard).join('') : '';
      if (other.length) bindPredCards(otherEl);
    }
    renderPredMatchday();
  }

  function btnPick(matchId, pick, label, selected) {
    var sel = selected === pick ? ' pred-opt-on' : '';
    var dis = selected ? ' disabled' : '';
    return '<button type="button" class="pred-opt' + sel + '" data-pick="' + pick + '"' + dis + '>' + label + '</button>';
  }

  function labelPick(p) {
    if (p === 'lyokfox') return 'LyokFox gana';
    if (p === 'rival') return 'Rival gana';
    return 'Empate';
  }

  function checkPredictionResults() {
    Object.keys(COMMUNITY.predictionResults).forEach(function (mid) {
      var result = COMMUNITY.predictionResults[mid];
      var picked = state.predictions[mid];
      var key = 'pred_bonus_' + mid;
      if (!picked || state.missions[key]) return;
      if (picked === result) {
        state.predictionWins += 1;
        state.missions[key] = true;
        addPoints(100, 'Predicción acertada');
        save(state);
      }
    });
  }

  /* ─── QUIZ ─── */
  function getDailyQuiz() {
    var day = todayKey();
    var start = new Date(day).getTime() / 86400000;
    var qs = [];
    for (var i = 0; i < 5; i++) {
      qs.push(COMMUNITY.quizPool[(start + i * 3) % COMMUNITY.quizPool.length]);
    }
    return qs;
  }

  function renderQuiz() {
    var el = document.getElementById('comm-quiz');
    if (!el) return;
    var done = state.quizDone[todayKey()];
    if (done) {
      el.innerHTML = '<div class="mini-done"><span>✓</span><p>Quiz de hoy completado</p><small>Vuelve mañana · hasta +250 KP</small></div>';
      return;
    }
    var qs = getDailyQuiz();
    var idx = 0;
    var score = 0;

    function showQ() {
      if (idx >= qs.length) {
        var pts = score * 50;
        if (score === qs.length) state.quizPerfect += 1;
        state.quizDone[todayKey()] = { score: score, total: qs.length };
        addPoints(pts, 'Quiz del día (' + score + '/' + qs.length + ')');
        trackGame('quiz');
        save(state);
        renderQuiz();
        checkAchievements();
        return;
      }
      var q = qs[idx];
      el.innerHTML =
        '<div class="quiz-box">' +
          '<div class="quiz-progress"><span style="width:' + ((idx / qs.length) * 100) + '%"></span></div>' +
          '<p class="quiz-meta">Pregunta ' + (idx + 1) + '/' + qs.length + ' · +50 KP c/u</p>' +
          '<h3 class="quiz-q">' + q.q + '</h3>' +
          '<div class="quiz-opts">' +
            q.a.map(function (opt, i) {
              return '<button type="button" class="quiz-opt" data-i="' + i + '">' + opt + '</button>';
            }).join('') +
          '</div>' +
        '</div>';
      el.querySelectorAll('.quiz-opt').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var i = +btn.dataset.i;
          if (i === q.correct) score += 1;
          idx += 1;
          showQ();
        });
      });
    }
    showQ();
  }

  /* ─── REFLEX GAME ─── */
  var reflexTimer = null;
  var reflexScore = 0;
  var reflexTime = 0;

  function renderReflex() {
    var el = document.getElementById('comm-reflex');
    if (!el) return;
    var g = state.games.reflex;
    var today = todayKey();
    if (g.day !== today) { g.day = today; g.plays = 0; save(state); }
    var left = 3 - g.plays;

    el.innerHTML =
      '<div class="reflex-wrap">' +
        '<p class="mini-meta">Partidas hoy: <strong>' + left + '/3</strong> · +10 KP por acierto</p>' +
        '<div class="reflex-arena" id="reflex-arena">' +
          '<p class="reflex-hint">Pulsa INICIAR — clickea el objetivo naranja cuando aparezca</p>' +
        '</div>' +
        '<div class="reflex-foot">' +
          '<button type="button" class="btn btn-primary" id="reflex-start"' + (left <= 0 ? ' disabled' : '') + '>Iniciar (30s)</button>' +
          '<span>Récord: <strong>' + g.best + '</strong> KP</span>' +
        '</div>' +
      '</div>';

    var startBtn = document.getElementById('reflex-start');
    if (startBtn && left > 0) {
      startBtn.addEventListener('click', startReflex);
    }
  }

  function startReflex() {
    var arena = document.getElementById('reflex-arena');
    if (!arena) return;
    reflexScore = 0;
    reflexTime = 30;
    arena.innerHTML = '<span class="reflex-timer" id="reflex-timer">30</span>';
    var startBtn = document.getElementById('reflex-start');
    if (startBtn) startBtn.disabled = true;
    spawnFox(arena);
    reflexTimer = setInterval(function () {
      reflexTime -= 1;
      var t = document.getElementById('reflex-timer');
      if (t) t.textContent = reflexTime;
      if (reflexTime <= 0) endReflex(arena);
    }, 1000);
  }

  function spawnFox(arena) {
    if (reflexTime <= 0) return;
    var fox = document.createElement('button');
    fox.type = 'button';
    fox.className = 'reflex-fox';
    fox.textContent = 'GO';
    fox.style.left = (10 + Math.random() * 70) + '%';
    fox.style.top = (15 + Math.random() * 55) + '%';
    fox.addEventListener('click', function () {
      reflexScore += 1;
      fox.remove();
      spawnFox(arena);
    });
    arena.appendChild(fox);
    setTimeout(function () { if (fox.parentNode) fox.remove(); }, 900);
  }

  function endReflex(arena) {
    clearInterval(reflexTimer);
    var g = state.games.reflex;
    g.plays += 1;
    var pts = Math.min(150, reflexScore * 10);
    if (pts > g.best) g.best = pts;
    addPoints(pts, 'Reflejos kitsune (' + reflexScore + ' aciertos)');
    trackGame('reflex');
    save(state);
    arena.innerHTML = '<p class="reflex-done">¡Fin! +' + pts + ' KP · ' + reflexScore + ' aciertos</p>';
    setTimeout(renderReflex, 2200);
  }

  /* ─── MEMORY GAME ─── */
  function renderMemory() {
    var el = document.getElementById('comm-memory');
    if (!el) return;
    var g = state.games.memory;
    var today = todayKey();
    if (g.day !== today) { g.day = today; g.plays = 0; save(state); }
    if (g.plays >= 1) {
      el.innerHTML = '<div class="mini-done"><span>🃏</span><p>Memoria Fox completada hoy</p><small>Mejor: ' + g.best + ' KP · vuelve mañana</small></div>';
      return;
    }
    var symbols = ['LF', 'BS', 'CR', 'FC', 'KP', 'VPG', 'PLG', 'VFO'];
    var deck = symbols.concat(symbols).sort(function () { return Math.random() - 0.5; });
    var flipped = [];
    var matched = 0;
    var moves = 0;
    var lock = false;

    el.innerHTML =
      '<p class="mini-meta">Encuentra las 8 parejas · menos movimientos = más KP</p>' +
      '<div class="memory-grid" id="memory-grid">' +
        deck.map(function (s, i) {
          return '<button type="button" class="mem-card" data-i="' + i + '" data-s="' + s + '"><span>?</span></button>';
        }).join('') +
      '</div>' +
      '<p class="memory-stats">Movimientos: <strong id="mem-moves">0</strong></p>';

    el.querySelectorAll('.mem-card').forEach(function (card) {
      card.addEventListener('click', function () {
        if (lock || card.classList.contains('open') || card.classList.contains('matched')) return;
        card.classList.add('open');
        card.querySelector('span').textContent = card.dataset.s;
        flipped.push(card);
        if (flipped.length === 2) {
          moves += 1;
          document.getElementById('mem-moves').textContent = moves;
          lock = true;
          if (flipped[0].dataset.s === flipped[1].dataset.s) {
            flipped.forEach(function (c) { c.classList.add('matched'); });
            matched += 2;
            flipped = [];
            lock = false;
            if (matched === deck.length) finishMemory(moves);
          } else {
            setTimeout(function () {
              flipped.forEach(function (c) {
                c.classList.remove('open');
                c.querySelector('span').textContent = '?';
              });
              flipped = [];
              lock = false;
            }, 700);
          }
        }
      });
    });
  }

  function finishMemory(moves) {
    var pts = Math.max(80, 220 - moves * 8);
    var g = state.games.memory;
    g.plays = 1;
    if (pts > g.best) g.best = pts;
    addPoints(pts, 'Memoria Fox (' + moves + ' movimientos)');
    trackGame('memory');
    save(state);
    setTimeout(renderMemory, 1500);
  }

  /* ─── POLL ─── */
  function renderPoll() {
    renderPollEl('comm-poll', COMMUNITY.poll);
  }

  /* ─── MISSIONS ─── */
  function completeMission(id) {
    if (state.missions[id]) return;
    var m = COMMUNITY.missions.find(function (x) { return x.id === id; });
    if (!m) return;
    state.missions[id] = true;
    ensureWeekly();
    state.weekly.missions += 1;
    addPoints(m.reward, 'Misión: ' + m.title);
    save(state);
    renderWeekly();
  }

  function checkAutoMissions() {
    ensureGamesToday();
    if (Object.keys(state.predictions).length >= 3) completeMission('three_preds');
    var g = state.gamesToday.list || {};
    if (g.quiz && g.reflex && g.memory) completeMission('play_all_games');
    if (state.games.spin.day === todayKey()) completeMission('first_spin');
    if (Object.keys(state.newsRead).length >= 5) completeMission('read_5_news');
    ensureWeekly();
    var wc = COMMUNITY.weeklyGoals.filter(function (wg) { return state.weekly.claimed[wg.id]; }).length;
    if (wc >= COMMUNITY.weeklyGoals.length) completeMission('weekly_complete');
    if ((state.promoRedeemed || []).indexOf('INDOMABLES') >= 0) completeMission('promo_indomables');
  }

  var missionFilter = 'all';

  function renderMissionsHero() {
    var el = document.getElementById('comm-missions-hero');
    if (!el) return;
    var list = COMMUNITY.missions.filter(function (m) {
      if (missionFilter === 'all') return true;
      return m.cat === missionFilter;
    });
    var done = list.filter(function (m) { return state.missions[m.id]; }).length;
    var avail = list.filter(function (m) { return !state.missions[m.id]; })
      .reduce(function (s, m) { return s + m.reward; }, 0);
    var pct = list.length ? Math.round((done / list.length) * 100) : 0;
    el.innerHTML =
      '<div class="missions-hero-inner">' +
        '<div class="missions-hero-ring" style="--pct:' + pct + '">' +
          '<span><strong>' + done + '</strong><em>/ ' + list.length + '</em></span>' +
        '</div>' +
        '<div class="missions-hero-copy">' +
          '<h2>Misiones camada</h2>' +
          '<p>Completa retos en X, web y arcade. <strong>+' + avail.toLocaleString('es-ES') + ' KP</strong> aún disponibles.</p>' +
        '</div>' +
        '<div class="missions-hero-kpis">' +
          '<span><strong>' + state.points.toLocaleString('es-ES') + '</strong> KP ahora</span>' +
          '<span><strong>' + state.streak + '</strong> días racha</span>' +
        '</div>' +
      '</div>';
  }

  function missionCatLabel(cat) {
    var map = { inicio: 'Inicio', x: 'X / Twitter', social: 'Social', web: 'Web', pro: 'Pro' };
    return map[cat] || cat;
  }

  function renderMissions() {
    var el = document.getElementById('comm-missions');
    if (!el) return;
    renderMissionsHero();
    var list = COMMUNITY.missions.filter(function (m) {
      if (missionFilter === 'all') return true;
      return m.cat === missionFilter;
    });
    el.innerHTML = list.map(function (m) {
      var done = state.missions[m.id];
      var btn = '';
      if (done) {
        btn = '<span class="mission-done-v5">✓ Completada</span>';
      } else if (m.type === 'social' || m.type === 'visit') {
        var mHref = m.url || '#';
        if (typeof SITE !== 'undefined' && SITE.normalizeHref) mHref = SITE.normalizeHref(mHref);
        var mInternal = typeof SITE !== 'undefined' && SITE.isInternalHref && SITE.isInternalHref(mHref);
        btn = '<a href="' + mHref + '" target="' + (mInternal ? '_self' : '_blank') + '"' + (mInternal ? '' : ' rel="noopener"') + ' class="btn btn-glass btn-sm mission-go">Ir</a>' +
              '<button type="button" class="btn btn-primary btn-sm mission-claim" data-id="' + m.id + '">Reclamar</button>';
      } else if (m.type === 'share') {
        btn = '<button type="button" class="btn btn-glass btn-sm mission-share" data-id="' + m.id + '">Compartir</button>';
      } else if (m.type === 'auto' || (m.type && m.type.indexOf('auto_') === 0)) {
        btn = '<span class="mission-auto-v5">Auto al cumplir</span>';
      }
      return '<article class="mission-row-v5' + (done ? ' mission-row-done' : '') + '">' +
        '<span class="mission-row-icon">' + m.icon + '</span>' +
        '<div class="mission-row-body">' +
          '<div class="mission-row-top">' +
            '<h4>' + m.title + '</h4>' +
            '<span class="mission-cat-chip">' + missionCatLabel(m.cat) + '</span>' +
          '</div>' +
          '<p>' + m.desc + '</p>' +
        '</div>' +
        '<div class="mission-row-side">' +
          '<strong class="mission-row-kp">+' + m.reward + ' KP</strong>' +
          '<div class="mission-row-actions">' + btn + '</div>' +
        '</div>' +
      '</article>';
    }).join('');

    el.querySelectorAll('.mission-claim').forEach(function (btn) {
      btn.addEventListener('click', function () {
        completeMission(btn.dataset.id);
        renderMissions();
      });
    });

    el.querySelectorAll('.mission-share').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var page = (typeof SITE !== 'undefined' && SITE.pages) ? SITE.pages.inicio : 'index.html';
        var url = (typeof SITE !== 'undefined' && SITE.fullUrl)
          ? SITE.fullUrl(page)
          : page;
        if (navigator.share) {
          navigator.share({ title: 'LyokFox Esports', url: url }).catch(function () {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(url);
          toast('Enlace copiado al portapapeles');
        }
        completeMission(btn.dataset.id);
        renderMissions();
      });
    });
    if (typeof syncSiteLinks === 'function') syncSiteLinks(el);
  }

  /* ─── REWARDS SHOP ─── */
  function shopTierLabel(tier) {
    var map = { bronze: 'Bronce', silver: 'Plata', gold: 'Oro', legend: 'Leyenda' };
    return map[tier] || tier;
  }

  function renderShopHero() {
    var el = document.getElementById('comm-shop-hero');
    if (!el) return;
    var lv = getLevel(state.lifetime);
    var disc = getLevelDiscount();
    el.innerHTML =
      '<div class="shop-bar-inner">' +
        '<div class="shop-bar-balance">' +
          '<span class="kp-coin kp-coin-sm" aria-hidden="true"><img src="" alt="" data-img="logo"><em data-points-short>KP</em></span>' +
          '<div><strong class="shop-bar-pts" data-comm-points>' + state.points.toLocaleString('es-ES') + '</strong>' +
          '<em data-points-name>Kitsune Points</em></div>' +
        '</div>' +
        '<div class="shop-bar-meta">' +
          '<span>' + lv.icon + ' <strong>' + lv.name + '</strong></span>' +
          (disc > 0
            ? '<span>Descuento <strong>-' + Math.round(disc * 100) + '%</strong></span>'
            : '<span>Merch · digital · in-game</span>') +
          '<span><strong>' + COMMUNITY.rewards.length + '</strong> premios</span>' +
        '</div>' +
      '</div>';
    if (typeof applyImages === 'function') applyImages(el);
  }

  function renderShop() {
    var el = document.getElementById('comm-shop');
    if (!el) return;
    renderShopHero();
    var discount = getLevelDiscount();
    var list = COMMUNITY.rewards.filter(function (r) {
      return shopCategory === 'all' || r.category === shopCategory;
    });
    el.innerHTML = list.map(function (r) {
      var finalCost = discountedCost(r.cost);
      var can = state.points >= finalCost;
      var owned = r.id !== 'sorteo-vip' && r.id !== 'sorteo-doble' && state.redeemed.some(function (x) { return x.id === r.id; });
      var discountHtml = discount > 0 && finalCost < r.cost
        ? '<span class="reward-discount-v5">-' + Math.round(discount * 100) + '% · ' + r.cost.toLocaleString('es-ES') + ' → ' + finalCost.toLocaleString('es-ES') + '</span>'
        : '';
      return '<article class="reward-card-v5 reward-' + r.tier + '" data-cat="' + (r.category || '') + '">' +
        '<span class="reward-v5-tier">' + shopTierLabel(r.tier) + '</span>' +
        '<span class="reward-icon reward-icon-v5">' + r.icon + '</span>' +
        '<span class="reward-stock-v5">' + r.stock + '</span>' +
        '<h4>' + r.name + '</h4>' +
        '<p>' + r.desc + '</p>' +
        discountHtml +
        '<div class="reward-foot-v5">' +
          '<strong class="reward-cost">' + finalCost.toLocaleString('es-ES') + ' <span data-points-short>KP</span></strong>' +
          '<button type="button" class="btn btn-primary btn-sm reward-btn" data-id="' + r.id + '"' +
            (can && !owned ? '' : ' disabled') + '>' + (owned ? 'Canjeado' : 'Canjear') + '</button>' +
        '</div>' +
      '</article>';
    }).join('');

    el.querySelectorAll('.reward-btn:not([disabled])').forEach(function (btn) {
      btn.addEventListener('click', function () {
        redeemReward(btn.dataset.id);
      });
    });
  }

  function renderShopCategories() {
    var el = document.getElementById('comm-shop-cats');
    if (!el || !COMMUNITY.shopCategories) return;
    el.innerHTML = COMMUNITY.shopCategories.map(function (c) {
      var on = shopCategory === c.id ? ' shop-cat-on' : '';
      return '<button type="button" class="shop-cat-btn' + on + '" data-cat="' + c.id + '">' + c.icon + ' ' + c.label + '</button>';
    }).join('');
    el.querySelectorAll('.shop-cat-btn').forEach(function (btn) {
      btn.onclick = function () {
        shopCategory = btn.dataset.cat;
        renderShopCategories();
        renderShop();
      };
    });
  }

  function renderShopTiers() {
    var el = document.getElementById('comm-shop-tiers');
    if (!el || !COMMUNITY.shopTiers) return;
    el.innerHTML = COMMUNITY.shopTiers.map(function (t) {
      return '<div class="shop-tier-chip" style="--tier-color:' + t.color + '"><strong>' + t.label + '</strong><span>' + t.range + '</span></div>';
    }).join('');
  }

  function renderShopTips() {
    var el = document.getElementById('comm-shop-tips');
    if (!el) return;
    var disc = getLevelDiscount();
    var affordable = COMMUNITY.rewards.filter(function (r) {
      return state.points >= discountedCost(r.cost);
    }).length;
    var g = COMMUNITY.globalStats || {};
    el.innerHTML =
      '<div class="shop-tip-v6"><strong>' + affordable + '</strong><span>canjeables ahora</span></div>' +
      '<div class="shop-tip-v6"><strong>' + (g.prizesRedeemed || 156) + '</strong><span>canjes totales</span></div>' +
      '<div class="shop-tip-v6"><strong>1 código</strong><span>por premio físico</span></div>' +
      (disc > 0
        ? '<div class="shop-tip-v6 shop-tip-accent"><strong>-' + Math.round(disc * 100) + '%</strong><span>tu descuento</span></div>'
        : '<div class="shop-tip-v6"><strong>Kitsune</strong><span>desbloquea -5%</span></div>');
  }

  function renderShopRecent() {
    var el = document.getElementById('comm-shop-recent');
    if (!el || !COMMUNITY.shopRecentRedeems) return;
    var mine = state.redeemed.slice(0, 3).map(function (r) {
      return '<div class="shop-recent-row shop-recent-you"><span>' + (state.nickname || 'Tú') + '</span><em>' + r.name + '</em><time>Ahora</time></div>';
    }).join('');
    el.innerHTML = '<h3 class="comm-subtitle comm-subtitle-left">Canjes recientes</h3>' +
      mine +
      COMMUNITY.shopRecentRedeems.map(function (r) {
        return '<div class="shop-recent-row"><span>' + r.nick + '</span><em>' + r.item + '</em><time>' + r.ago + '</time></div>';
      }).join('');
  }

  function renderMyRedeems() {
    var el = document.getElementById('comm-my-redeems');
    if (!el) return;
    if (!state.redeemed.length) {
      el.innerHTML = '<p class="comm-empty">Aún no has canjeado premios. ¡Acumula KP y elige en la tienda!</p>';
      return;
    }
    el.innerHTML = state.redeemed.slice().reverse().map(function (r) {
      return '<article class="my-redeem-card"><span>🎁</span><div><strong>' + r.name + '</strong><code>' + r.code + '</code></div></article>';
    }).join('');
  }

  function renderLevelRoadmap() {
    var el = document.getElementById('comm-level-roadmap');
    if (!el) return;
    var lv = getLevel(state.lifetime);
    el.innerHTML = COMMUNITY.levels.map(function (l, i) {
      var reached = state.lifetime >= l.min;
      var current = lv.id === l.id;
      var disc = l.discount ? ' · -' + Math.round(l.discount * 100) + '% tienda' : '';
      return '<div class="level-road-item' + (reached ? ' level-road-done' : '') + (current ? ' level-road-current' : '') + '">' +
        '<span class="level-road-icon">' + l.icon + '</span>' +
        '<div class="level-road-body">' +
          '<strong>' + l.name + '</strong>' +
          '<em>' + l.min.toLocaleString('es-ES') + '+ KP' + disc + '</em>' +
        '</div>' +
        (i < COMMUNITY.levels.length - 1 ? '<i class="level-road-line"></i>' : '') +
      '</div>';
    }).join('');
  }

  function redeemReward(id) {
    var r = COMMUNITY.rewards.find(function (x) { return x.id === id; });
    if (!r) return;
    var cost = discountedCost(r.cost);
    if (state.points < cost) return;
    if (!confirm('¿Canjear "' + r.name + '" por ' + cost + ' ' + COMMUNITY.currency + '?\n\nTe daremos un código para reclamar el premio por contacto.')) return;
    if (!spendPoints(cost)) return;
    var code = uid();
    state.redeemed.push({ id: id, code: code, at: Date.now(), name: r.name });
    logActivity('Canje: ' + r.name + ' (' + code + ')', -cost);
    checkAchievements();
    save(state);
    renderShop();
    renderMyRedeems();
    renderShopRecent();
    renderActivity();
    showRedeemModal(r, code);
  }

  function showRedeemModal(r, code) {
    var modal = document.getElementById('comm-redeem-modal');
    if (!modal) return;
    document.getElementById('redeem-title').textContent = r.name;
    document.getElementById('redeem-code').textContent = code;
    var link = document.getElementById('redeem-contact');
    if (link) {
      link.href = (typeof SITE !== 'undefined' ? SITE.pages.contacto : 'contactanos.html') +
        '?premio=' + encodeURIComponent(r.name) + '&codigo=' + code;
    }
    modal.classList.add('open');
  }

  /* ─── LEADERBOARD ─── */
  function renderLeaderboard() {
    var el = document.getElementById('comm-leaderboard');
    if (!el) return;
    var list = COMMUNITY.leaderboardSeed.slice();
    if (state.nickname) {
      list.push({ nick: state.nickname + ' (tú)', points: state.lifetime, you: true });
    }
    list.sort(function (a, b) { return b.points - a.points; });
    list = list.slice(0, 10);

    el.innerHTML = list.map(function (row, i) {
      return '<div class="lb-row' + (row.you ? ' lb-you' : '') + '">' +
        '<span class="lb-rank">' + (i + 1) + '</span>' +
        '<span class="lb-nick">' + row.nick + '</span>' +
        '<span class="lb-pts">' + row.points.toLocaleString('es-ES') + ' KP</span>' +
      '</div>';
    }).join('');
  }

  /* ─── ACHIEVEMENTS ─── */
  function renderAchievements() {
    var el = document.getElementById('comm-achievements');
    if (!el) return;
    el.innerHTML = COMMUNITY.achievements.map(function (a) {
      var unlocked = state.achievements.indexOf(a.id) >= 0;
      return '<div class="ach-badge' + (unlocked ? ' ach-unlocked' : '') + '" title="' + a.desc + '">' +
        '<span>' + (unlocked ? '🏆' : '🔒') + '</span>' +
        '<small>' + a.name + '</small>' +
      '</div>';
    }).join('');
  }

  /* ─── ACTIVITY ─── */
  function renderActivity() {
    var el = document.getElementById('comm-activity');
    if (!el) return;
    if (!state.activity.length) {
      el.innerHTML = '<p class="comm-empty">Aún no hay actividad. ¡Juega y suma KP!</p>';
      return;
    }
    el.innerHTML = state.activity.slice(0, 12).map(function (a) {
      var pts = a.pts ? (a.pts > 0 ? '+' + a.pts : a.pts) + ' KP' : '';
      return '<div class="act-row"><span>' + a.text + '</span><em>' + pts + '</em></div>';
    }).join('');
  }

  /* ─── STATS STRIP ─── */
  function renderStatsStrip() {
    var el = document.getElementById('comm-stats-strip');
    if (!el) return;
    var lv = getLevel(state.lifetime);
    var preds = Object.keys(state.predictions).length;
    el.innerHTML =
      '<span class="cv4-stat cv4-stat-hot"><strong>' + state.points.toLocaleString('es-ES') + '</strong> KP</span>' +
      '<span class="cv4-stat"><strong>' + state.streak + '</strong> racha</span>' +
      '<span class="cv4-stat"><strong>' + lv.icon + '</strong> ' + lv.name + '</span>' +
      '<span class="cv4-stat"><strong>' + preds + '</strong> pred.</span>' +
      '<span class="cv4-stat"><strong>' + countAllSocialActions() + '</strong> redes</span>';
  }

  function renderCommEarnStrip() {
    var el = document.getElementById('comm-earn-strip');
    if (!el) return;
    var pts = (typeof SITE !== 'undefined' && SITE.points && SITE.points.short) ? SITE.points.short : 'KP';
    var commPage = (typeof SITE !== 'undefined' && SITE.pages && SITE.pages.comunidad) ? SITE.pages.comunidad : 'comunidad.html';
    var newsPage = (typeof SITE !== 'undefined' && SITE.pages && SITE.pages.noticias) ? SITE.pages.noticias : 'noticias.html';
    var items = [
      { icon: '📰', title: 'Noticias', sub: '+10 ' + pts + ' por leer', href: newsPage, page: 'noticias' },
      { icon: '𝕏', title: 'Redes', sub: 'Like · RT · comentarios', href: commPage + '#apoya-redes', page: 'comunidad' },
      { icon: '🎮', title: 'Arcade', sub: 'Minijuegos diarios', href: commPage + '#juegos', page: 'comunidad' },
      { icon: '⚽', title: 'Predicciones', sub: 'Hasta +100 ' + pts, href: commPage + '#predicciones', page: 'comunidad' },
      { icon: '🛒', title: 'Tienda', sub: 'Camisetas y merch', href: commPage + '#tienda', page: 'comunidad' }
    ];
    el.innerHTML = items.map(function (it) {
      return '<a href="' + it.href + '" class="comm-earn-chip" data-site-page="' + it.page + '">' +
        '<span class="comm-earn-icon" aria-hidden="true">' + it.icon + '</span>' +
        '<span class="comm-earn-text"><strong>' + it.title + '</strong><em>' + it.sub + '</em></span>' +
      '</a>';
    }).join('');
    if (typeof syncSiteLinks === 'function') syncSiteLinks(el);
  }

  function renderCommHeroStats() {
    var el = document.getElementById('comm-hero-stats');
    if (!el || !COMMUNITY.globalStats) return;
    var g = COMMUNITY.globalStats;
    var pts = (typeof SITE !== 'undefined' && SITE.points && SITE.points.short) ? SITE.points.short : 'KP';
    el.innerHTML =
      '<div class="comm-hero-stat comm-hero-stat--hot"><strong>' + g.members.toLocaleString('es-ES') + '</strong><span>Miembros</span></div>' +
      '<div class="comm-hero-stat"><strong>' + (g.kpDistributed / 1000).toFixed(0) + 'K</strong><span>' + pts + ' repartidos</span></div>' +
      '<div class="comm-hero-stat"><strong>' + g.predictionsWeek.toLocaleString('es-ES') + '</strong><span>Predicciones/sem</span></div>' +
      '<div class="comm-hero-stat"><strong>' + g.xActionsWeek.toLocaleString('es-ES') + '</strong><span>Acciones X</span></div>' +
      '<div class="comm-hero-stat"><strong>' + g.prizesRedeemed + '</strong><span>Premios</span></div>';
  }

  /* ─── EARN GRID + LEVELS ─── */
  function renderEarnGrid() {
    var el = document.getElementById('comm-earn-grid');
    if (!el) return;
    el.innerHTML = COMMUNITY.earnMethods.map(function (e) {
      return '<article class="earn-card reveal-item">' +
        '<span class="earn-icon">' + e.icon + '</span>' +
        '<h4>' + e.title + '</h4>' +
        '<p>' + e.desc + '</p>' +
        '<strong class="earn-kp">' + e.kp + ' KP</strong>' +
      '</article>';
    }).join('');
  }

  function renderLevels() {
    var el = document.getElementById('comm-levels');
    if (!el) return;
    var lv = getLevel(state.lifetime);
    el.innerHTML = COMMUNITY.levels.map(function (l) {
      var on = lv.id === l.id ? ' comm-level-on' : '';
      return '<div class="comm-level-chip' + on + '"><span class="level-rank">' + l.icon + '</span><strong>' + l.name + '</strong><em>' + l.min.toLocaleString('es-ES') + '+ KP</em>' +
        (l.discount ? '<small>-' + Math.round(l.discount * 100) + '% tienda</small>' : '') + '</div>';
    }).join('');
    renderLevelPerks();
    renderLevelRoadmap();
  }

  function renderLevelPerks() {
    var el = document.getElementById('comm-level-perks');
    if (!el || !COMMUNITY.levelPerks) return;
    el.innerHTML = COMMUNITY.levelPerks.map(function (p) {
      return '<article class="level-perk-card reveal-item">' +
        '<span class="level-perk-icon">' + p.icon + '</span>' +
        '<h4>' + p.level.charAt(0).toUpperCase() + p.level.slice(1) + '</h4>' +
        '<ul>' + p.perks.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
      '</article>';
    }).join('');
  }

  function renderQuickStart() {
    var el = document.getElementById('comm-quick-start');
    if (!el || !COMMUNITY.quickStart) return;
    el.innerHTML = '<h3 class="comm-subtitle">Primeros pasos en 6 minutos</h3>' +
      COMMUNITY.quickStart.map(function (s) {
        var href = s.href;
        if (typeof SITE !== 'undefined' && SITE.normalizeHref) href = SITE.normalizeHref(href);
        return '<a href="' + href + '" class="quick-step reveal-item">' +
          '<span class="quick-num">' + s.step + '</span>' +
          '<span class="quick-icon">' + s.icon + '</span>' +
          '<div><strong>' + s.title + '</strong><p>' + s.desc + '</p></div>' +
        '</a>';
      }).join('');
    if (typeof syncSiteLinks === 'function') syncSiteLinks(el);
  }

  function renderProgressDash() {
    var el = document.getElementById('comm-progress-dash');
    if (!el) return;
    var lv = getLevel(state.lifetime);
    var nxt = nextLevel(state.lifetime);
    var pct = nxt ? Math.min(100, ((state.lifetime - lv.min) / (nxt.min - lv.min)) * 100) : 100;
    var missionsDone = COMMUNITY.missions.filter(function (m) { return state.missions[m.id]; }).length;
    var newsDone = Object.keys(state.newsRead).length;
    var newsTotal = COMMUNITY.news.length;
    var gamesToday = Object.keys(state.gamesToday.list || {}).length;
    var preds = Object.keys(state.predictions).length;
    var items = [
      { ok: !!state.nickname, label: 'Perfil camada', val: state.nickname || 'Pendiente' },
      { ok: state.lastLogin === todayKey(), label: 'Bonus diario hoy', val: state.lastLogin === todayKey() ? 'Reclamado' : 'Pendiente' },
      { ok: missionsDone >= 5, label: 'Misiones', val: missionsDone + '/' + COMMUNITY.missions.length },
      { ok: newsDone >= newsTotal, label: 'Noticias leídas', val: newsDone + '/' + newsTotal },
      { ok: gamesToday >= 3, label: 'Minijuegos hoy', val: gamesToday + '/6' },
      { ok: preds >= 1, label: 'Predicciones', val: preds + ' registradas' },
      { ok: countAllSocialActions() >= 5, label: 'Acciones redes', val: countAllSocialActions() + ' · ' + getSocialKpTotal() + ' KP' },
      { ok: countTwitterActions() >= 3, label: 'Acciones X', val: countTwitterActions() + ' Like/RT/💬' },
      { ok: state.predictionWins >= 1, label: 'Aciertos pred.', val: state.predictionWins + ' victorias' }
    ];
    el.innerHTML =
      '<div class="progress-dash-top">' +
        '<div class="progress-dash-level">' +
          '<span class="progress-dash-icon level-rank">' + lv.icon + '</span>' +
          '<div><strong>' + (state.nickname || 'Invitado') + '</strong><em>Nivel ' + lv.name + ' · ' + state.lifetime.toLocaleString('es-ES') + ' KP lifetime</em></div>' +
        '</div>' +
        '<div class="progress-dash-bar-wrap">' +
          '<div class="progress-dash-bar"><i style="width:' + pct + '%"></i></div>' +
          '<span class="progress-dash-next">' + (nxt ? 'Siguiente: ' + nxt.name + ' (' + nxt.min.toLocaleString('es-ES') + ' KP)' : 'Nivel máximo alcanzado') + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="progress-checklist">' +
        items.map(function (it) {
          return '<div class="progress-check' + (it.ok ? ' progress-check-done' : '') + '">' +
            '<span>' + (it.ok ? '✓' : '○') + '</span><div><strong>' + it.label + '</strong><em>' + it.val + '</em></div></div>';
        }).join('') +
      '</div>';
  }

  function renderGlobalStats() {
    renderCommHeroStats();
  }

  function renderFeaturedPrediction() {
    var el = document.getElementById('comm-featured-pred');
    if (!el) return;
    if (typeof SCHEDULE === 'undefined' || !SCHEDULE.featured) {
      el.innerHTML = '';
      el.hidden = true;
      return;
    }
    el.hidden = false;
    var m = SCHEDULE.featured;
    var picked = state.predictions[m.id];
    var resolved = COMMUNITY.predictionResults[m.id];
    var resultHtml = '';
    if (resolved && picked) {
      resultHtml = picked === resolved
        ? '<span class="pred-result pred-win">✓ Acertaste · +100 KP</span>'
        : '<span class="pred-result pred-lose">Resultado: ' + labelPick(resolved) + '</span>';
    }
    el.innerHTML =
      '<article class="pred-hero-card match-' + m.game + '">' +
        '<div class="pred-hero-glow"></div>' +
        '<span class="pred-featured-badge">⭐ Partido estrella</span>' +
        '<div class="pred-card-v5-top">' +
          '<span class="pred-live-badge">MATCHDAY</span>' +
          '<span class="pred-game">' + m.gameLabel + '</span>' +
          '<time>' + formatDate(m.date) + ' · ' + m.time + ' ' + (m.timezone || '') + '</time>' +
        '</div>' +
        '<div class="pred-hero-teams">' +
          '<span>LyokFox</span><em>VS</em><span>' + m.opponent + '</span>' +
        '</div>' +
        '<p class="pred-comp">' + m.competition + '</p>' +
        (m.venue ? '<p class="pred-venue">' + m.venue + '</p>' : '') +
        '<div class="pred-options pred-options-hero" data-match="' + m.id + '">' +
          btnPick(m.id, 'lyokfox', 'Victoria LyokFox', picked) +
          btnPick(m.id, 'draw', 'Empate', picked) +
          btnPick(m.id, 'rival', 'Victoria rival', picked) +
        '</div>' +
        (picked ? '<p class="pred-picked">Tu pick: <strong>' + labelPick(picked) + '</strong> · +25 KP</p>' : '') +
        resultHtml +
        (m.stream ? '<a href="' + m.stream + '" target="_blank" rel="noopener" class="btn btn-glass btn-sm pred-stream">Seguir en X</a>' : '') +
      '</article>';

    el.querySelectorAll('.pred-opt:not([disabled])').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var matchId = btn.closest('.pred-options').dataset.match;
        var pick = btn.dataset.pick;
        if (state.predictions[matchId]) return;
        state.predictions[matchId] = pick;
        addPoints(25, 'Predicción destacada');
        trackPrediction();
        completeMission('first_pred');
        save(state);
        renderFeaturedPrediction();
        renderPredMatchday();
        renderPredictions();
        renderProgressDash();
        checkPredictionResults();
      });
    });
  }

  function renderPredHistory() {
    var el = document.getElementById('comm-pred-history');
    if (!el || !COMMUNITY.matchHistory) return;
    el.innerHTML = COMMUNITY.matchHistory.map(function (m) {
      var resultLabel = m.result === 'lyokfox' ? 'Victoria LyokFox' : m.result === 'rival' ? 'Victoria ' + m.opponent : 'Empate';
      var cls = m.result === 'lyokfox' ? 'pred-hist-win' : m.result === 'rival' ? 'pred-hist-loss' : 'pred-hist-draw';
      var picked = state.predictions[m.id];
      var bonus = picked && picked === m.result ? '<span class="pred-hist-bonus">+100 KP bonus</span>' : '';
      return '<article class="pred-hist-v5 ' + cls + '">' +
        '<div class="pred-hist-top"><span>' + m.gameLabel + '</span><time>' + formatDate(m.date) + '</time></div>' +
        '<h4>LyokFox vs ' + m.opponent + '</h4>' +
        '<p class="pred-hist-score">' + m.score + ' · ' + resultLabel + '</p>' +
        '<p class="pred-hist-comp">' + m.competition + '</p>' +
        bonus +
      '</article>';
    }).join('');
  }

  function renderArcadeLegend() {
    var el = document.getElementById('comm-arcade-legend');
    if (!el || !COMMUNITY.arcadeGames) return;
    el.innerHTML = COMMUNITY.arcadeGames.map(function (g) {
      return '<div class="arcade-leg-item reveal-item">' +
        '<span>' + g.icon + '</span>' +
        '<div><strong>' + g.name + '</strong><em>' + g.limit + ' · hasta ' + g.maxKp + ' KP</em><p>' + g.rule + '</p></div>' +
      '</div>';
    }).join('');
  }

  function renderEvents() {
    var el = document.getElementById('comm-events');
    if (!el || !COMMUNITY.communityEvents) return;
    el.innerHTML = COMMUNITY.communityEvents.map(function (ev) {
      return '<article class="event-card reveal-item">' +
        '<div class="event-date"><strong>' + formatDate(ev.date) + '</strong><span>' + ev.time + '</span></div>' +
        '<span class="event-type">' + ev.type + '</span>' +
        '<h4>' + ev.icon + ' ' + ev.title + '</h4>' +
        '<p>' + ev.desc + '</p>' +
        '<a href="' + ev.href + '" class="btn btn-glass btn-sm">' + (ev.href.charAt(0) === '#' ? 'Ver sección' : 'Ir') + '</a>' +
      '</article>';
    }).join('');
  }

  function renderMilestones() {
    var el = document.getElementById('comm-milestones');
    if (!el || !COMMUNITY.clubMilestones) return;
    var compact = el.classList.contains('milestones-compact') || el.classList.contains('news-page-milestones');
    var head = compact ? '' : '<h3 class="comm-subtitle">Palmarés &amp; hitos del club</h3>';
    el.innerHTML = head +
      '<div class="milestones-row' + (compact ? ' milestones-row-compact' : '') + '">' +
      COMMUNITY.clubMilestones.map(function (m) {
        return '<article class="milestone-chip">' +
          '<span class="milestone-year">' + m.year + '</span>' +
          '<span class="milestone-icon">' + m.icon + '</span>' +
          '<div><strong>' + m.title + '</strong><p>' + m.desc + '</p></div></article>';
      }).join('') +
      '</div>';
  }

  function renderNewsPageKpi() {
    var el = document.getElementById('news-page-kpi');
    if (!el) return;
    var read = Object.keys(state.newsRead).length;
    var total = COMMUNITY.news.length;
    el.innerHTML =
      '<span><strong>' + total + '</strong> noticias</span>' +
      '<span><strong>' + read + '/' + total + '</strong> leídas</span>' +
      '<span><strong>+10</strong> KP por noticia</span>';
  }

  function initNewsSearch() {
    var input = document.getElementById('news-search');
    if (!input || input.dataset.bound) return;
    input.dataset.bound = '1';
    var debounceTimer;
    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        newsSearch = input.value.trim();
        renderNews();
        renderFeaturedNews();
      }, 200);
    });
  }

  function renderFanWall() {
    var el = document.getElementById('comm-fan-wall');
    if (!el || !COMMUNITY.fanQuotes) return;
    el.innerHTML = '<h3 class="comm-subtitle">Muro de la camada</h3>' +
      '<div class="fan-wall-row">' +
      COMMUNITY.fanQuotes.map(function (q) {
        return '<blockquote class="fan-quote reveal-item">' +
          '<span class="fan-avatar">' + q.avatar + '</span>' +
          '<p>“' + q.text + '”</p>' +
          '<cite>— ' + q.nick + '</cite></blockquote>';
      }).join('') +
      '</div>';
  }

  function renderShopFeatured() {
    var el = document.getElementById('comm-shop-featured');
    if (!el || !COMMUNITY.shopFeatured) return;
    el.innerHTML = COMMUNITY.shopFeatured.map(function (id) {
      var r = COMMUNITY.rewards.find(function (x) { return x.id === id; });
      if (!r) return '';
      var cost = discountedCost(r.cost);
      return '<article class="shop-showcase-card reward-' + r.tier + '">' +
        '<span class="shop-showcase-badge">Destacado</span>' +
        '<span class="reward-icon reward-icon-v5">' + r.icon + '</span>' +
        '<h4>' + r.name + '</h4><p>' + r.desc + '</p>' +
        '<div class="shop-showcase-foot"><strong>' + cost.toLocaleString('es-ES') + ' KP</strong>' +
        '<button type="button" class="btn btn-primary btn-sm reward-btn-showcase" data-id="' + r.id + '">Canjear</button></div></article>';
    }).join('');
    el.querySelectorAll('.reward-btn-showcase').forEach(function (btn) {
      btn.onclick = function () { redeemReward(btn.dataset.id); };
    });
  }

  function renderPromo() {
    var el = document.getElementById('comm-promo');
    if (!el || !COMMUNITY.promoCodes) return;
    el.innerHTML =
      '<div class="promo-inner">' +
        '<div class="promo-head"><span>🎁</span><div><strong>Códigos promo</strong><p>Canjea una vez por apodo · KP instantáneos</p></div></div>' +
        '<div class="promo-form">' +
          '<input type="text" id="promo-input" placeholder="Ej. INDOMABLES" maxlength="20">' +
          '<button type="button" class="btn btn-primary btn-sm" id="promo-submit">Canjear</button>' +
        '</div>' +
        '<div class="promo-hints">' +
          COMMUNITY.promoCodes.map(function (p) {
            var used = (state.promoRedeemed || []).indexOf(p.code) >= 0;
            return '<span class="promo-hint' + (used ? ' promo-used' : '') + '">' + p.code + ' · +' + p.reward + ' KP · ' + p.desc + (used ? ' ✓' : '') + '</span>';
          }).join('') +
        '</div>' +
      '</div>';
    var btn = document.getElementById('promo-submit');
    if (btn) {
      btn.onclick = function () {
        var val = (document.getElementById('promo-input').value || '').trim().toUpperCase();
        var promo = COMMUNITY.promoCodes.find(function (p) { return p.code === val; });
        if (!promo) { toast('Código no válido'); return; }
        if ((state.promoRedeemed || []).indexOf(val) >= 0) { toast('Ya canjeaste este código'); return; }
        if (!state.promoRedeemed) state.promoRedeemed = [];
        state.promoRedeemed.push(val);
        addPoints(promo.reward, 'Código ' + val);
        checkAutoMissions();
        checkAchievements();
        save(state);
        renderPromo();
        renderProgressDash();
        toast('+' + promo.reward + ' KP · ' + val);
      };
    }
  }

  var newsFilter = 'all';
  var newsSearch = '';

  function renderFeaturedNews() {
    var el = document.getElementById('comm-news-featured');
    if (!el) return;
    var list = COMMUNITY.news.filter(function (n) {
      var tagOk = newsFilter === 'all' || n.tag === newsFilter;
      var q = newsSearch.toLowerCase();
      var searchOk = !q || (n.title + ' ' + n.body + ' ' + n.tag).toLowerCase().indexOf(q) >= 0;
      return tagOk && searchOk;
    });
    if (!list.length) {
      el.innerHTML = '';
      el.hidden = true;
      return;
    }
    el.hidden = false;
    var n = list[0];
    var read = state.newsRead[n.id];
    el.innerHTML =
      '<article class="news-featured-card' + (read ? ' news-read' : '') + '">' +
        '<div class="news-featured-glow"></div>' +
        '<div class="news-featured-top"><span class="news-tag">' + n.tag + '</span><time>' + n.date + '</time><span class="news-featured-badge">Destacada</span></div>' +
        '<h3>' + n.title + '</h3>' +
        '<p>' + n.body + '</p>' +
        '<div class="news-featured-foot">' +
          (read ? '<span class="mission-done">✓ Leída · +10 KP</span>' :
            '<button type="button" class="btn btn-primary btn-sm news-read-btn" data-id="' + n.id + '">Leer y ganar +10 KP</button>') +
          '<a href="' + (typeof SITE !== 'undefined' ? SITE.pages.noticias : 'noticias.html') + '" class="btn btn-glass btn-sm" data-site-page="noticias">Más noticias</a>' +
        '</div>' +
      '</article>';
    bindNewsReadButtons(el);
  }

  function bindNewsReadButtons(root) {
    (root || document).querySelectorAll('.news-read-btn').forEach(function (btn) {
      btn.onclick = function () {
        var id = btn.dataset.id;
        if (state.newsRead[id]) return;
        state.newsRead[id] = true;
        addPoints(10, 'Noticia leída');
        save(state);
        renderNews();
        renderFeaturedNews();
        renderNewsTags();
        renderProgressDash();
        renderDailyChallenge();
        checkAchievements();
        renderAchievements();
        renderNewsPageKpi();
      };
    });
  }

  function renderNewsTags() {
    var el = document.getElementById('comm-news-tags');
    if (!el) return;
    var tags = ['Todos'];
    COMMUNITY.news.forEach(function (n) {
      if (tags.indexOf(n.tag) < 0) tags.push(n.tag);
    });
    el.innerHTML = tags.map(function (t) {
      var id = t === 'Todos' ? 'all' : t;
      var on = (newsFilter === 'all' && t === 'Todos') || newsFilter === t ? ' news-tag-on' : '';
      return '<button type="button" class="news-tag-btn' + on + '" data-tag="' + id + '">' + t + '</button>';
    }).join('');
    el.querySelectorAll('.news-tag-btn').forEach(function (btn) {
      btn.onclick = function () {
        newsFilter = btn.dataset.tag;
        renderNews();
        renderFeaturedNews();
        renderNewsTags();
      };
    });
  }

  function renderLeaderboardFull() {
    var el = document.getElementById('comm-leaderboard-full');
    if (!el) return;
    var list = COMMUNITY.leaderboardSeed.slice();
    if (state.nickname) {
      list.push({ nick: state.nickname + ' (tú)', points: state.lifetime, you: true });
    }
    list.sort(function (a, b) { return b.points - a.points; });
    list = list.slice(10, 20);
    if (!list.length) { el.innerHTML = ''; return; }
    el.innerHTML = '<p class="comm-subtitle comm-subtitle-left">Posiciones 11–20</p>' +
      list.map(function (row, i) {
        return '<div class="lb-row' + (row.you ? ' lb-you' : '') + '">' +
          '<span class="lb-rank">' + (i + 11) + '</span>' +
          '<span class="lb-nick">' + row.nick + '</span>' +
          '<span class="lb-pts">' + row.points.toLocaleString('es-ES') + ' KP</span></div>';
      }).join('');
  }

  /* ─── DAILY CHALLENGE ─── */
  function renderDailyChallenge() {
    var el = document.getElementById('comm-daily-challenge');
    if (!el) return;
    var ch = getDailyChallenge();
    var prog = challengeProgress(ch);
    var done = prog >= ch.target;
    var today = todayKey();
    if (state.dailyChallenge.day !== today) {
      state.dailyChallenge = { day: today, id: ch.id, claimed: false };
      save(state);
    }
    var claimed = state.dailyChallenge.claimed;
    el.innerHTML =
      '<div class="mini-card-head"><span>🎯</span><h3>Reto del día</h3></div>' +
      '<p class="daily-ch-text">' + ch.text + '</p>' +
      '<div class="daily-ch-bar"><i style="width:' + Math.min(100, (prog / ch.target) * 100) + '%"></i></div>' +
      '<p class="mini-meta">' + Math.min(prog, ch.target) + '/' + ch.target + ' · Recompensa: <strong>+' + ch.reward + ' KP</strong></p>' +
      (claimed ? '<span class="mission-done">✓ Reto completado hoy</span>' :
        (done ? '<button type="button" class="btn btn-primary btn-sm" id="claim-daily-ch">Reclamar +' + ch.reward + ' KP</button>' :
          '<span class="mission-pending">Completa el objetivo para reclamar</span>'));
    var btn = document.getElementById('claim-daily-ch');
    if (btn) btn.onclick = function () {
      state.dailyChallenge.claimed = true;
      addPoints(ch.reward, 'Reto diario completado');
      save(state);
      renderDailyChallenge();
    };
  }

  /* ─── SPIN WHEEL ─── */
  function renderSpin() {
    var el = document.getElementById('comm-spin');
    if (!el) return;
    var g = state.games.spin;
    var today = todayKey();
    if (g.day === today) {
      el.innerHTML = '<div class="mini-done"><span>🎡</span><p>Ruleta usada hoy</p><small>Vuelve mañana · hasta +150 KP</small></div>';
      return;
    }
    el.innerHTML =
      '<div class="spin-wheel" id="spin-wheel">' +
        COMMUNITY.spinSegments.map(function (s, i) {
          return '<span class="spin-seg" style="--i:' + i + '">' + s.label + '</span>';
        }).join('') +
      '</div>' +
      '<button type="button" class="btn btn-primary btn-full" id="spin-btn">Girar ruleta</button>';
    document.getElementById('spin-btn').onclick = function () {
      var seg = COMMUNITY.spinSegments[Math.floor(Math.random() * COMMUNITY.spinSegments.length)];
      g.day = today;
      addPoints(seg.value, 'Ruleta kitsune · ' + seg.label);
      trackGame('spin');
      completeMission('first_spin');
      save(state);
      el.innerHTML = '<div class="spin-result"><span>🎡</span><strong>' + seg.label + '</strong><p>¡Premio conseguido!</p></div>';
      setTimeout(renderSpin, 2500);
    };
  }

  /* ─── WORD SCRAMBLE ─── */
  function scrambleWord(w) {
    var a = w.split('');
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a.join('') === w ? scrambleWord(w) : a.join('');
  }

  function renderWord() {
    var el = document.getElementById('comm-word');
    if (!el) return;
    var g = state.games.word;
    if (g.day === todayKey()) {
      el.innerHTML = '<div class="mini-done"><span>🔤</span><p>Anagrama resuelto</p><small>+120 KP max · vuelve mañana</small></div>';
      return;
    }
    var idx = Math.floor(new Date(todayKey()).getTime() / 86400000) % COMMUNITY.wordScramble.length;
    var item = COMMUNITY.wordScramble[idx];
    var scrambled = scrambleWord(item.word);
    el.innerHTML =
      '<p class="mini-meta">Pista: ' + item.hint + ' · +120 KP</p>' +
      '<p class="word-scrambled">' + scrambled + '</p>' +
      '<input type="text" class="word-input" id="word-input" placeholder="Tu respuesta" maxlength="12">' +
      '<button type="button" class="btn btn-primary btn-sm" id="word-submit">Comprobar</button>';
    document.getElementById('word-submit').onclick = function () {
      var val = document.getElementById('word-input').value.trim().toUpperCase();
      if (val === item.word) {
        g.day = todayKey();
        addPoints(120, 'Anagrama Fox resuelto');
        trackGame('word');
        save(state);
        renderWord();
        renderDailyChallenge();
      } else {
        toast('Incorrecto — inténtalo de nuevo');
      }
    };
  }

  /* ─── FOX TAP ─── */
  function renderTap() {
    var el = document.getElementById('comm-tap');
    if (!el) return;
    var g = state.games.tap;
    if (g.day === todayKey()) {
      el.innerHTML = '<div class="mini-done"><span>🎯</span><p>Fox Tap completado</p><small>Mejor: ' + (g.best || 0) + ' KP</small></div>';
      return;
    }
    var round = 0;
    var total = 0;
    var waiting = false;
    var timer = null;

    function showRound() {
      if (round >= 5) {
        g.day = todayKey();
        g.best = total;
        addPoints(total, 'Fox Tap (' + round + ' rondas)');
        trackGame('tap');
        save(state);
        el.innerHTML = '<p class="reflex-done">+' + total + ' KP · Promedio reacción</p>';
        setTimeout(renderTap, 2000);
        return;
      }
      el.innerHTML = '<p class="mini-meta">Ronda ' + (round + 1) + '/5 · Pulsa cuando veas 🦊</p>' +
        '<button type="button" class="tap-arena" id="tap-arena">Esperando...</button>';
      var arena = document.getElementById('tap-arena');
      waiting = false;
      var delay = 800 + Math.random() * 2000;
      timer = setTimeout(function () {
        waiting = true;
        arena.textContent = '🦊 ¡PULSA!';
        arena.classList.add('tap-go');
        arena.dataset.t = Date.now();
      }, delay);
      arena.onclick = function () {
        if (!waiting) { clearTimeout(timer); total += 5; round++; showRound(); return; }
        var ms = Date.now() - +arena.dataset.t;
        var pts = ms < 300 ? 25 : ms < 500 ? 18 : ms < 800 ? 12 : 6;
        total += pts;
        round++;
        clearTimeout(timer);
        showRound();
      };
    }
    showRound();
  }

  /* ─── EMOTE PICK ─── */
  function renderEmote() {
    var el = document.getElementById('comm-emote');
    if (!el) return;
    var g = state.games.emote;
    if (g.day === todayKey()) {
      el.innerHTML = '<div class="mini-done"><span>🎲</span><p>Pick emotes hecho</p><small>+45 KP</small></div>';
      return;
    }
    var emotes = ['⚽', '👑', '🦊', '🔥', '💎', '🎮'];
    var shuffled = emotes.slice().sort(function () { return Math.random() - 0.5; });
    el.innerHTML = '<p class="mini-meta">¿Cuál es el kitsune? · +45 KP</p><div class="emote-pick">' +
      shuffled.map(function (e) {
        return '<button type="button" class="emote-btn">' + e + '</button>';
      }).join('') + '</div>';
    el.querySelectorAll('.emote-btn').forEach(function (btn) {
      btn.onclick = function () {
        if (btn.textContent === '🦊') {
          g.day = todayKey();
          addPoints(45, 'Pick emotes · acertaste');
          trackGame('emote');
          save(state);
          renderEmote();
        } else {
          toast('Ese no es el kitsune — prueba otra vez');
        }
      };
    });
  }

  /* ─── NEWS ─── */
  function renderNews() {
    var el = document.getElementById('comm-news');
    if (!el) return;
    var list = COMMUNITY.news.filter(function (n) {
      var tagOk = newsFilter === 'all' || n.tag === newsFilter;
      var q = newsSearch.toLowerCase();
      var searchOk = !q || (n.title + ' ' + n.body + ' ' + n.tag).toLowerCase().indexOf(q) >= 0;
      return tagOk && searchOk;
    });
    var skipFeatured = document.getElementById('comm-news-featured') && newsFilter === 'all' && !newsSearch;
    if (skipFeatured && list.length) list = list.slice(1);
    el.innerHTML = list.map(function (n) {
      var read = state.newsRead[n.id];
      return '<article class="news-card reveal-item' + (read ? ' news-read' : '') + '">' +
        '<div class="news-top"><span class="news-tag">' + n.tag + '</span><time>' + n.date + '</time></div>' +
        '<h4>' + n.title + '</h4>' +
        '<p>' + n.body + '</p>' +
        (read ? '<span class="mission-done">✓ Leído · +10 KP</span>' :
          '<button type="button" class="btn btn-glass btn-sm news-read-btn" data-id="' + n.id + '">Marcar leído · +10 KP</button>') +
      '</article>';
    }).join('');
    bindNewsReadButtons(el);
  }

  /* ─── WEEKLY GOALS ─── */
  function renderWeekly() {
    var el = document.getElementById('comm-weekly');
    if (!el) return;
    ensureWeekly();
    el.innerHTML = COMMUNITY.weeklyGoals.map(function (g) {
      var val = g.track === 'weeklyStreak' ? state.streak : state.weekly[g.track.replace('weekly', '').toLowerCase()] || 0;
      if (g.track === 'weeklyStreak') val = state.streak;
      else if (g.track === 'weeklyPredictions') val = state.weekly.predictions;
      else if (g.track === 'weeklyGames') val = state.weekly.games;
      else if (g.track === 'weeklyMissions') val = state.weekly.missions;
      else if (g.track === 'weeklyTwitter') val = state.weekly.twitter || 0;
      else if (g.track === 'weeklySocial') val = state.weekly.social || 0;
      var pct = Math.min(100, (val / g.target) * 100);
      var claimed = state.weekly.claimed[g.id];
      var done = val >= g.target;
      return '<article class="weekly-pill-v5 reveal-item">' +
        '<span class="weekly-icon">' + g.icon + '</span>' +
        '<div class="weekly-pill-body">' +
          '<h4>' + g.label + '</h4>' +
          '<div class="daily-ch-bar"><i style="width:' + pct + '%"></i></div>' +
          '<p class="mini-meta">' + Math.min(val, g.target) + '/' + g.target + ' · +' + g.reward + ' KP</p>' +
        '</div>' +
        (claimed ? '<span class="mission-done-v5">✓</span>' :
          (done ? '<button type="button" class="btn btn-primary btn-sm weekly-claim" data-id="' + g.id + '">OK</button>' :
            '<span class="weekly-pct">' + Math.round(pct) + '%</span>')) +
      '</article>';
    }).join('');
    el.querySelectorAll('.weekly-claim').forEach(function (btn) {
      btn.onclick = function () {
        var g = COMMUNITY.weeklyGoals.find(function (x) { return x.id === btn.dataset.id; });
        if (!g || state.weekly.claimed[g.id]) return;
        state.weekly.claimed[g.id] = true;
        addPoints(g.reward, 'Objetivo semanal: ' + g.label);
        save(state);
        renderWeekly();
      };
    });
  }

  /* ─── POLL 2 ─── */
  function renderPoll2() {
    renderPollEl('comm-poll2', COMMUNITY.poll2);
  }

  function renderPoll3() {
    renderPollEl('comm-poll3', COMMUNITY.poll3);
  }

  function renderPollEl(id, p) {
    var el = document.getElementById(id);
    if (!el || !p) return;
    var voted = state.pollVotes[p.id];
    var total = p.options.reduce(function (s, o) { return s + o.votes; }, 0);
    if (voted) {
      el.innerHTML = '<h3>' + p.question + '</h3><div class="poll-results">' +
        p.options.map(function (o) {
          var v = o.votes + (voted === o.id ? 1 : 0);
          var pct = Math.round((v / (total + 1)) * 100);
          return '<div class="poll-bar-row"><span>' + o.label + '</span><div class="poll-bar"><i style="width:' + pct + '%"></i></div><em>' + pct + '%</em></div>';
        }).join('') + '</div><p class="poll-voted">✓ Voto registrado · +' + p.reward + ' KP</p>';
      return;
    }
    el.innerHTML = '<h3>' + p.question + '</h3><p class="mini-meta">+' + p.reward + ' KP por votar</p><div class="poll-vote">' +
      p.options.map(function (o) {
        return '<button type="button" class="poll-opt" data-id="' + o.id + '">' + o.label + '</button>';
      }).join('') + '</div>';
    el.querySelectorAll('.poll-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.pollVotes[p.id] = btn.dataset.id;
        addPoints(p.reward, 'Voto encuesta');
        save(state);
        renderPollEl(id, p);
      });
    });
  }

  function initSocialTabs() {
    var tabs = document.getElementById('comm-social-tabs');
    if (!tabs) return;
    var nets = [
      { id: 'x', label: '𝕏 @LyokFox_', sub: 'Like · RT · Comentario' },
      { id: 'instagram', label: '📸 Instagram', sub: 'Like · Comentario · Guardar' },
      { id: 'fans', label: '🧡 @Lyokfox_Fans', sub: 'Like · RT · Comentario' }
    ];
    tabs.innerHTML = nets.map(function (n) {
      return '<button type="button" class="social-net-tab' + (socialNetwork === n.id ? ' active' : '') + '" data-net="' + n.id + '">' +
        '<strong>' + n.label + '</strong><span>' + n.sub + '</span></button>';
    }).join('');
    tabs.querySelectorAll('.social-net-tab').forEach(function (btn) {
      btn.onclick = function () {
        socialNetwork = btn.dataset.net;
        initSocialTabs();
        renderSocialPosts();
      };
    });
  }

  function renderSocialBanner() {
    var banner = document.getElementById('comm-social-banner') || document.getElementById('comm-x-banner');
    if (!banner) return;
    var html = '';
    if (socialNetwork === 'x') {
      var rw = COMMUNITY.twitterRewards;
      html = '<div class="x-banner-inner">' +
        '<div class="x-banner-stat"><strong>+' + rw.perLike + '</strong><span>Like ❤️</span></div>' +
        '<div class="x-banner-stat x-banner-stat-hot"><strong>+' + rw.perRt + '</strong><span>RT 🔁</span></div>' +
        '<div class="x-banner-stat"><strong>+' + rw.perComment + '</strong><span>Comentario 💬</span></div>' +
        '<div class="x-banner-stat"><strong>+' + rw.comboBonus + '</strong><span>combo L+RT</span></div>' +
        '<div class="x-banner-stat"><strong>+' + (rw.fullPostBonus || 0) + '</strong><span>post completo</span></div>' +
        '<div class="x-banner-stat"><strong>' + countTwitterActions() + '</strong><span>acciones X</span></div></div>';
    } else if (socialNetwork === 'instagram') {
      var ig = COMMUNITY.instagramRewards;
      html = '<div class="x-banner-inner">' +
        '<div class="x-banner-stat"><strong>+' + ig.perLike + '</strong><span>Like ❤️</span></div>' +
        '<div class="x-banner-stat x-banner-stat-hot"><strong>+' + ig.perComment + '</strong><span>Comentario 💬</span></div>' +
        '<div class="x-banner-stat"><strong>+' + ig.perSave + '</strong><span>Guardar 🔖</span></div>' +
        '<div class="x-banner-stat"><strong>' + countInstagramActions() + '</strong><span>acciones IG</span></div></div>';
    } else {
      var fn = COMMUNITY.fansRewards;
      html = '<div class="x-banner-inner">' +
        '<div class="x-banner-stat"><strong>+' + fn.perLike + '</strong><span>Like ❤️</span></div>' +
        '<div class="x-banner-stat x-banner-stat-hot"><strong>+' + fn.perRt + '</strong><span>RT 🔁</span></div>' +
        '<div class="x-banner-stat"><strong>+' + fn.perComment + '</strong><span>Comentario 💬</span></div>' +
        '<div class="x-banner-stat"><strong>+' + fn.comboBonus + '</strong><span>combo</span></div>' +
        '<div class="x-banner-stat"><strong>' + countFansActions() + '</strong><span>acciones Fans</span></div></div>';
    }
    banner.innerHTML = html;
  }

  function renderSocialHero() {
    var el = document.getElementById('comm-social-hero');
    if (!el) return;
    var ui = (COMMUNITY.ui && COMMUNITY.ui.socialHero) || {};
    var badge = ui.badge || 'Redes + KP';
    var title = ui.title || 'Apoya a LyokFox · gana Kitsune Points';
    var text = ui.text || 'Like, RT y comentarios en <strong>@LyokFox_</strong>, Instagram y <strong>@Lyokfox_Fans</strong>. Reclama aquí tras interactuar.';
    var total = getSocialKpTotal();
    var actions = countAllSocialActions();
    el.innerHTML =
      '<div class="social-hero-inner">' +
        '<div class="social-hero-copy">' +
          '<span class="social-hero-badge">' + badge + '</span>' +
          '<h2>' + title + '</h2>' +
          '<p>' + text + '</p>' +
        '</div>' +
        '<div class="social-hero-stats">' +
          '<div class="social-hero-stat social-hero-stat-hot"><strong>' + total.toLocaleString('es-ES') + '</strong><span>KP ganados</span></div>' +
          '<div class="social-hero-stat"><strong>' + actions + '</strong><span>acciones</span></div>' +
          '<div class="social-hero-stat"><strong>+' + (COMMUNITY.twitterRewards.perLike + COMMUNITY.twitterRewards.perRt) + '</strong><span>KP combo X</span></div>' +
        '</div>' +
      '</div>';
  }

  function renderSocialSummary() {
    var el = document.getElementById('comm-social-summary');
    if (!el) return;
    var tw = state.twitterKp || 0;
    var ig = state.instagramKp || 0;
    var fn = state.fansKp || 0;
    var total = tw + ig + fn;
    var maxPerPostX = (COMMUNITY.twitterRewards.perLike || 0) + (COMMUNITY.twitterRewards.perRt || 0) +
      (COMMUNITY.twitterRewards.perComment || 0) + (COMMUNITY.twitterRewards.comboBonus || 0) +
      (COMMUNITY.twitterRewards.fullPostBonus || 0);
    var hintTpl = (COMMUNITY.ui && COMMUNITY.ui.socialSummaryHint) || '';
    var hint = hintTpl ||
      'Cada post es independiente: <strong>Like + RT + Comentario</strong> en X suman hasta <strong>' + maxPerPostX + ' KP</strong> por publicación. Pulsa los botones tras interactuar de verdad.';
    el.innerHTML =
      '<div class="social-summary-grid">' +
        '<article class="social-summary-card social-summary-total">' +
          '<span class="kp-mark kp-mark-sm">KP</span>' +
          '<div><strong>' + total.toLocaleString('es-ES') + ' KP</strong><em>Total ganado en redes</em></div>' +
        '</article>' +
        '<article class="social-summary-card"><strong>' + tw.toLocaleString('es-ES') + '</strong><span>𝕏 @LyokFox_</span><em>' + countTwitterActions() + ' acciones</em></article>' +
        '<article class="social-summary-card"><strong>' + ig.toLocaleString('es-ES') + '</strong><span>📸 Instagram</span><em>' + countInstagramActions() + ' acciones</em></article>' +
        '<article class="social-summary-card"><strong>' + fn.toLocaleString('es-ES') + '</strong><span>🧡 Fans</span><em>' + countFansActions() + ' acciones</em></article>' +
      '</div>' +
      '<p class="social-summary-hint">' + hint + '</p>';
  }

  function renderSocialPosts() {
    renderSocialHero();
    initSocialTabs();
    renderSocialBanner();
    renderSocialSummary();
    var panels = { x: 'comm-twitter-posts', instagram: 'comm-instagram-posts', fans: 'comm-fans-posts' };
    Object.keys(panels).forEach(function (k) {
      var p = document.getElementById(panels[k]);
      if (p) p.hidden = socialNetwork !== k;
    });
    if (socialNetwork === 'x') renderTwitterPosts();
    else if (socialNetwork === 'instagram') renderInstagramPosts();
    else renderFansPosts();
    requestAnimationFrame(showActivePanelReveals);
    var totalEl = document.getElementById('comm-social-total');
    var kpEl = document.getElementById('comm-social-kp');
    if (totalEl) totalEl.textContent = countAllSocialActions();
    if (kpEl) kpEl.textContent = getSocialKpTotal().toLocaleString('es-ES');
    if (typeof syncSiteLinks === 'function') {
      var panel = document.querySelector('.comm-v4-panel.active:not([hidden])');
      syncSiteLinks(panel || undefined);
    }
  }

  function renderInstagramPosts() {
    var el = document.getElementById('comm-instagram-posts');
    if (!el || !COMMUNITY.instagramPosts) return;
    var rw = COMMUNITY.instagramRewards;
    var how = document.getElementById('comm-social-how') || document.getElementById('comm-x-how');
    if (how) {
      how.innerHTML =
        '<div class="x-how-step"><span>1</span><p>Abre el post en <strong>@lyokfox</strong></p></div>' +
        '<div class="x-how-step"><span>2</span><p>Like, comenta o guarda el post</p></div>' +
        '<div class="x-how-step"><span>3</span><p>Reclama tus <strong>Kitsune Points</strong></p></div>' +
        '<a href="' + rw.profileUrl + '" target="_blank" rel="noopener" class="btn btn-glass btn-sm">Ver @lyokfox</a>';
    }
    el.innerHTML = COMMUNITY.instagramPosts.slice().sort(function (a, b) {
      return b.date.localeCompare(a.date);
    }).map(function (p) {
      var c = getIgClaims(p.id);
      var earned = (c.like ? rw.perLike : 0) + (c.comment ? rw.perComment : 0) + (c.save ? rw.perSave : 0) +
        (c.full ? (rw.fullPostBonus || 0) : 0);
      return '<article class="x-post-card x-post-ig reveal-item">' +
        '<div class="x-post-top"><span class="x-post-tag">' + p.tag + '</span><time>' + formatDate(p.date) + '</time></div>' +
        '<p class="x-post-text">' + p.text + '</p>' +
        '<div class="x-post-stats"><span>❤️ ' + p.stats.likes + '</span><span>💬 ' + p.stats.comments + '</span>' +
        (earned ? '<span class="x-post-earned">+' + earned + ' KP</span>' : '') + '</div>' +
        '<div class="x-post-actions">' +
          '<a href="' + p.url + '" target="_blank" rel="noopener" class="btn btn-glass btn-sm">Abrir IG</a>' +
          '<button type="button" class="btn btn-glass btn-sm ig-claim-like" data-id="' + p.id + '"' + (c.like ? ' disabled' : '') + '>❤️ +' + rw.perLike + '</button>' +
          '<button type="button" class="btn btn-glass btn-sm ig-claim-comment" data-id="' + p.id + '"' + (c.comment ? ' disabled' : '') + '>💬 +' + rw.perComment + '</button>' +
          '<button type="button" class="btn btn-primary btn-sm ig-claim-save" data-id="' + p.id + '"' + (c.save ? ' disabled' : '') + '>🔖 +' + rw.perSave + '</button>' +
        '</div></article>';
    }).join('');
    el.querySelectorAll('.ig-claim-like:not([disabled])').forEach(function (btn) {
      btn.onclick = function () {
        var post = COMMUNITY.instagramPosts.find(function (p) { return p.id === btn.dataset.id; });
        if (post) window.open(post.url, '_blank', 'noopener');
        setTimeout(function () { claimInstagram(btn.dataset.id, 'like'); }, 400);
      };
    });
    el.querySelectorAll('.ig-claim-comment:not([disabled])').forEach(function (btn) {
      btn.onclick = function () {
        var post = COMMUNITY.instagramPosts.find(function (p) { return p.id === btn.dataset.id; });
        if (post) window.open(post.url, '_blank', 'noopener');
        setTimeout(function () { claimInstagram(btn.dataset.id, 'comment'); }, 400);
      };
    });
    el.querySelectorAll('.ig-claim-save:not([disabled])').forEach(function (btn) {
      btn.onclick = function () {
        var post = COMMUNITY.instagramPosts.find(function (p) { return p.id === btn.dataset.id; });
        if (post) window.open(post.url, '_blank', 'noopener');
        setTimeout(function () { claimInstagram(btn.dataset.id, 'save'); }, 400);
      };
    });
  }

  function renderFansPosts() {
    var el = document.getElementById('comm-fans-posts');
    if (!el || !COMMUNITY.fansPosts) return;
    var rw = COMMUNITY.fansRewards;
    var how = document.getElementById('comm-social-how') || document.getElementById('comm-x-how');
    if (how) {
      how.innerHTML =
        '<div class="x-how-step"><span>1</span><p>Abre el post en <strong>@Lyokfox_Fans</strong></p></div>' +
        '<div class="x-how-step"><span>2</span><p>Like, RT o <strong>comenta</strong> de verdad</p></div>' +
        '<div class="x-how-step"><span>3</span><p>Reclama <strong>Kitsune Points</strong> aquí</p></div>' +
        '<a href="' + rw.profileUrl + '" target="_blank" rel="noopener" class="btn btn-glass btn-sm">Ver @Lyokfox_Fans</a>';
    }
    var sorted = COMMUNITY.fansPosts.slice().sort(function (a, b) {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.date.localeCompare(a.date);
    });
    el.innerHTML = sorted.map(function (p) {
      var c = getFansClaims(p.id);
      var earned = (c.like ? rw.perLike : 0) + (c.rt ? rw.perRt : 0) + (c.comment ? rw.perComment : 0) +
        (c.combo ? rw.comboBonus : 0) + (c.full ? (rw.fullPostBonus || 0) : 0);
      return '<article class="x-post-card x-post-fans reveal-item' + (p.pinned ? ' x-post-pinned' : '') + '">' +
        (p.pinned ? '<span class="x-post-pin">📌 Destacado</span>' : '') +
        '<div class="x-post-top"><span class="x-post-tag">' + p.tag + '</span><time>' + formatDate(p.date) + '</time></div>' +
        '<p class="x-post-text">' + p.text + '</p>' +
        '<div class="x-post-stats"><span>❤️ ' + p.stats.likes + '</span><span>🔁 ' + p.stats.rts + '</span>' +
        (earned ? '<span class="x-post-earned">+' + earned + ' KP</span>' : '') + '</div>' +
        '<div class="x-post-actions x-post-actions-wrap">' +
          '<a href="' + p.url + '" target="_blank" rel="noopener" class="btn btn-glass btn-sm">Abrir post</a>' +
          '<button type="button" class="btn btn-glass btn-sm fans-claim-like" data-id="' + p.id + '"' + (c.like ? ' disabled' : '') + '>❤️ +' + rw.perLike + '</button>' +
          '<button type="button" class="btn btn-primary btn-sm fans-claim-rt" data-id="' + p.id + '"' + (c.rt ? ' disabled' : '') + '>🔁 +' + rw.perRt + '</button>' +
          '<button type="button" class="btn btn-glass btn-sm fans-claim-comment" data-id="' + p.id + '"' + (c.comment ? ' disabled' : '') + '>💬 +' + rw.perComment + '</button>' +
        '</div>' +
        (c.combo ? '<span class="x-combo-badge">💥 Combo Like+RT +' + rw.comboBonus + ' KP</span>' : '') +
        (c.full ? '<span class="x-combo-badge x-full-badge">🏆 Post completo +' + rw.fullPostBonus + ' KP</span>' : '') +
      '</article>';
    }).join('');
    el.querySelectorAll('.fans-claim-like:not([disabled])').forEach(function (btn) {
      btn.onclick = function () {
        var post = COMMUNITY.fansPosts.find(function (p) { return p.id === btn.dataset.id; });
        if (post) window.open(post.url, '_blank', 'noopener');
        setTimeout(function () { claimFans(btn.dataset.id, 'like'); }, 400);
      };
    });
    el.querySelectorAll('.fans-claim-rt:not([disabled])').forEach(function (btn) {
      btn.onclick = function () {
        var post = COMMUNITY.fansPosts.find(function (p) { return p.id === btn.dataset.id; });
        if (post) window.open(post.url, '_blank', 'noopener');
        setTimeout(function () { claimFans(btn.dataset.id, 'rt'); }, 400);
      };
    });
    el.querySelectorAll('.fans-claim-comment:not([disabled])').forEach(function (btn) {
      btn.onclick = function () {
        var post = COMMUNITY.fansPosts.find(function (p) { return p.id === btn.dataset.id; });
        if (post) window.open(post.url, '_blank', 'noopener');
        setTimeout(function () { claimFans(btn.dataset.id, 'comment'); }, 400);
      };
    });
  }

  /* ─── TWITTER / X POSTS ─── */
  function renderTwitterPosts() {
    var how = document.getElementById('comm-social-how') || document.getElementById('comm-x-how');
    var el = document.getElementById('comm-twitter-posts');
    if (!el || !COMMUNITY.twitterPosts) return;

    var rw = COMMUNITY.twitterRewards;

    if (how && socialNetwork === 'x') {
      how.innerHTML =
        '<div class="x-how-step"><span>1</span><p>Abre el post en <strong>@LyokFox_</strong></p></div>' +
        '<div class="x-how-step"><span>2</span><p>Da <strong>Like</strong>, <strong>RT</strong> o <strong>comenta</strong></p></div>' +
        '<div class="x-how-step"><span>3</span><p>Vuelve y <strong>reclama KP</strong> aquí</p></div>' +
        '<a href="' + rw.profileUrl + '" target="_blank" rel="noopener" class="btn btn-glass btn-sm">Ver perfil @LyokFox_</a>';
    }

    var sorted = COMMUNITY.twitterPosts.slice().sort(function (a, b) {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.date.localeCompare(a.date);
    });

    el.innerHTML = sorted.map(function (p) {
      var c = getPostClaims(p.id);
      var likeDone = !!c.like;
      var rtDone = !!c.rt;
      var commentDone = !!c.comment;
      var comboDone = !!c.combo;
      var fullDone = !!c.full;
      var comments = (p.stats.comments != null) ? p.stats.comments : Math.round(p.stats.likes * 0.12);
      var earned = (likeDone ? rw.perLike : 0) + (rtDone ? rw.perRt : 0) + (commentDone ? rw.perComment : 0) +
        (comboDone ? rw.comboBonus : 0) + (fullDone ? (rw.fullPostBonus || 0) : 0);
      return '<article class="x-post-card reveal-item' + (p.pinned ? ' x-post-pinned' : '') + '">' +
        (p.pinned ? '<span class="x-post-pin">📌 Destacado</span>' : '') +
        '<div class="x-post-top">' +
          '<span class="x-post-tag">' + p.tag + '</span>' +
          '<time>' + formatDate(p.date) + '</time>' +
        '</div>' +
        '<p class="x-post-text">' + p.text + '</p>' +
        '<div class="x-post-stats">' +
          '<span>❤️ ' + p.stats.likes.toLocaleString('es-ES') + '</span>' +
          '<span>🔁 ' + p.stats.rts.toLocaleString('es-ES') + ' RT</span>' +
          '<span>💬 ' + comments.toLocaleString('es-ES') + '</span>' +
          (earned ? '<span class="x-post-earned">+' + earned + ' KP tuyos</span>' : '') +
        '</div>' +
        '<div class="x-post-actions x-post-actions-wrap">' +
          '<a href="' + p.url + '" target="_blank" rel="noopener" class="btn btn-glass btn-sm">Abrir post</a>' +
          '<button type="button" class="btn btn-glass btn-sm x-claim-like" data-id="' + p.id + '"' + (likeDone ? ' disabled' : '') + '>' +
            (likeDone ? '✓ Like +' + rw.perLike : '❤️ Like +' + rw.perLike) +
          '</button>' +
          '<button type="button" class="btn btn-primary btn-sm x-claim-rt" data-id="' + p.id + '"' + (rtDone ? ' disabled' : '') + '>' +
            (rtDone ? '✓ RT +' + rw.perRt : '🔁 RT +' + rw.perRt) +
          '</button>' +
          '<button type="button" class="btn btn-glass btn-sm x-claim-comment" data-id="' + p.id + '"' + (commentDone ? ' disabled' : '') + '>' +
            (commentDone ? '✓ Coment. +' + rw.perComment : '💬 Coment. +' + rw.perComment) +
          '</button>' +
        '</div>' +
        (comboDone ? '<span class="x-combo-badge">💥 Combo Like+RT +' + rw.comboBonus + ' KP</span>' : '') +
        (fullDone ? '<span class="x-combo-badge x-full-badge">🏆 Post completo +' + rw.fullPostBonus + ' KP</span>' :
          (!comboDone && likeDone && rtDone ? '<span class="x-combo-hint">Comenta para bonus post completo (+' + rw.fullPostBonus + ' KP)</span>' :
            (!comboDone ? '<span class="x-combo-hint">Like + RT = +' + rw.comboBonus + ' KP · Las 3 acciones = +' + rw.fullPostBonus + ' KP extra</span>' : ''))) +
      '</article>';
    }).join('');

    el.querySelectorAll('.x-claim-like:not([disabled])').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.dataset.id;
        var post = COMMUNITY.twitterPosts.find(function (p) { return p.id === id; });
        if (post && post.url) window.open(post.url, '_blank', 'noopener');
        setTimeout(function () { claimTwitter(id, 'like'); }, 400);
      });
    });

    el.querySelectorAll('.x-claim-rt:not([disabled])').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.dataset.id;
        var post = COMMUNITY.twitterPosts.find(function (p) { return p.id === id; });
        if (post && post.url) window.open(post.url, '_blank', 'noopener');
        setTimeout(function () { claimTwitter(id, 'rt'); }, 400);
      });
    });

    el.querySelectorAll('.x-claim-comment:not([disabled])').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.dataset.id;
        var post = COMMUNITY.twitterPosts.find(function (p) { return p.id === id; });
        if (post && post.url) window.open(post.url, '_blank', 'noopener');
        setTimeout(function () { claimTwitter(id, 'comment'); }, 400);
      });
    });
  }

  /* ─── FAQ ─── */
  function renderFAQ() {
    var el = document.getElementById('comm-faq');
    if (!el) return;
    el.innerHTML = COMMUNITY.faq.map(function (f, i) {
      return '<details class="faq-item reveal-item"><summary>' + f.q + '</summary><p>' + f.a + '</p></details>';
    }).join('');
  }

  function initCommV4Tabs() {
    var tabs = document.querySelectorAll('.comm-v4-tab');
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activateCommTab(tab.dataset.commTab);
      });
    });
    window.addEventListener('hashchange', openCommTabFromHash);
  }

  document.addEventListener('lyokfox:news-read', function (e) {
    var id = e.detail && e.detail.id;
    if (!id || state.newsRead[id]) return;
    state.newsRead[id] = true;
    addPoints(10, 'Noticia leída');
    save(state);
    checkAchievements();
    renderAchievements();
    if (window.LyokFoxProfile) window.LyokFoxProfile.refresh(state);
    toast('+10 KP · Noticia leída');
  });

  function initMissionTabs() {
    document.querySelectorAll('.mission-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.mission-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        missionFilter = tab.dataset.tab;
        renderMissions();
      });
    });
  }

  /* ─── SUB NAV ─── */
  function initSubNav() {
    var links = document.querySelectorAll('.comm-nav a, .comm-dock a');
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (href.charAt(0) === '#') {
          e.preventDefault();
          var target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });
          document.querySelectorAll('.comm-nav a, .comm-dock a').forEach(function (l) {
            if (l.getAttribute('href') === href) l.classList.add('active');
            else if (l.closest('.comm-dock, .comm-nav')) l.classList.remove('active');
          });
          a.classList.add('active');
        }
      });
    });
  }

  function closeModals() {
    if (document.body.dataset.commModalsBound) return;
    document.body.dataset.commModalsBound = '1';
    document.addEventListener('click', function (e) {
      var close = e.target.closest('.comm-modal .comm-modal-close, .comm-modal-backdrop');
      if (close) close.closest('.comm-modal').classList.remove('open');
    });
  }

  function initCommTicker() {
    if (typeof initLiveTicker === 'function') initLiveTicker();
  }

  function initCommunity() {
    if (document.body.dataset.page !== 'comunidad') return;
    if (window._lyokCommInited) return;
    window._lyokCommInited = true;

    if (typeof SITE !== 'undefined' && SITE.points) {
      document.querySelectorAll('[data-points-name]').forEach(function (el) {
        el.textContent = SITE.points.name;
      });
      document.querySelectorAll('[data-points-short]').forEach(function (el) {
        el.textContent = SITE.points.short;
      });
    }

    processDailyLogin();
    checkPredictionResults();
    checkAutoMissions();
    checkTwitterMissions();
    checkSocialMissions();
    renderHUD();
    renderCommHeroStats();
    renderCommEarnStrip();
    showOnboarding();
    requestAnimationFrame(function () {
      renderEarnGrid();
      renderProgressDash();
    });
    initCommV4Tabs();
    initCommTicker();
    initMissionTabs();
    initSubNav();
    closeModals();

    if (sessionStorage.getItem('lyokfox_visit_equipos')) {
      completeMission('visit_equipos');
      sessionStorage.removeItem('lyokfox_visit_equipos');
    }
    if (sessionStorage.getItem('lyokfox_visit_historia')) {
      completeMission('visit_historia');
      sessionStorage.removeItem('lyokfox_visit_historia');
    }
    if (sessionStorage.getItem('lyokfox_visit_inicio')) {
      completeMission('visit_inicio');
      sessionStorage.removeItem('lyokfox_visit_inicio');
    }
    if (sessionStorage.getItem('lyokfox_visit_sponsor')) {
      completeMission('visit_sponsor');
      sessionStorage.removeItem('lyokfox_visit_sponsor');
    }
    if (sessionStorage.getItem('lyokfox_visit_contacto')) {
      completeMission('visit_contacto');
      sessionStorage.removeItem('lyokfox_visit_contacto');
    }
    completeMission('visit_comunidad');

    var hashTab = (window.location.hash || '').replace('#', '');
    var hashMap = { 'apoya-redes': 'redes', redes: 'redes', tienda: 'tienda', juegos: 'juegos', predicciones: 'predicciones', misiones: 'misiones', ranking: 'ranking' };
    var startTab = hashMap[hashTab] || 'redes';
    activateCommTab(startTab);
    if (typeof syncSiteLinks === 'function') syncSiteLinks(document.querySelector('.lyok-page'));
  }

  function initNoticias() {
    if (document.body.dataset.page !== 'noticias') return;
    if (window._lyokCommNewsInited) return;
    window._lyokCommNewsInited = true;

    if (typeof SITE !== 'undefined' && SITE.points) {
      document.querySelectorAll('[data-points-name]').forEach(function (el) {
        el.textContent = SITE.points.name;
      });
      document.querySelectorAll('[data-points-short]').forEach(function (el) {
        el.textContent = SITE.points.short;
      });
    }

    processDailyLogin();
    renderNewsPageKpi();
    renderFeaturedNews();
    renderNewsTags();
    renderNews();
    renderMilestones();
    initNewsSearch();
    closeModals();
    if (typeof syncSiteLinks === 'function') {
      var panel = document.querySelector('.comm-v4-panel.active:not([hidden])');
      syncSiteLinks(panel || undefined);
    }
  }

  document.addEventListener('layout:ready', function () {
    initCommunity();
    initNoticias();
  });

  document.addEventListener('cms:applied', function () {
    if (document.body.dataset.page !== 'comunidad') return;
    if (typeof renderCommHeroStats === 'function') renderCommHeroStats();
    if (typeof renderCommEarnStrip === 'function') renderCommEarnStrip();
    if (typeof renderSocialPosts === 'function') renderSocialPosts();
    if (typeof syncSiteLinks === 'function') syncSiteLinks(document.querySelector('.lyok-page'));
  });

  /* Marcar visita equipos — se procesa en comunidad.html */
  window.LyokFoxCommunity = {
    getState: function () { return state; },
    save: save,
    toast: toast,
    reload: function () { state = load(); }
  };
})();
