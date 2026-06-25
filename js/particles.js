(function () {
  'use strict';

  var canvas = document.getElementById('fx-particles');
  if (!canvas) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  var ctx = canvas.getContext('2d');
  var W = 0;
  var H = 0;
  var mouse = { x: 0.5, y: 0.5, active: false };
  var isMobile = window.innerWidth < 768;
  var particles = [];
  var sparks = [];
  var count = isMobile ? 70 : 160;
  var sparkCount = isMobile ? 18 : 40;

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function resize() {
    W = canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
    H = canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
  }

  function orangeColor(alpha, warm) {
    if (warm) return 'rgba(255, 184, 0, ' + alpha + ')';
    return 'rgba(255, ' + Math.floor(rand(70, 120)) + ', 0, ' + alpha + ')';
  }

  function EmberParticle(full) {
    this.reset(full);
  }

  EmberParticle.prototype.reset = function (full) {
    this.x = rand(0, window.innerWidth);
    this.y = full ? rand(0, window.innerHeight) : window.innerHeight + rand(5, 40);
    this.vx = rand(-0.4, 0.4);
    this.vy = -rand(0.4, 1.8);
    this.size = rand(0.8, 3.2);
    this.alpha = rand(0.25, 0.85);
    this.warm = Math.random() > 0.65;
    this.life = 0;
    this.maxLife = rand(180, 420);
    this.wobble = rand(0, Math.PI * 2);
    this.trail = Math.random() > 0.55;
  };

  function SparkParticle() {
    this.reset(true);
  }

  SparkParticle.prototype.reset = function (full) {
    this.x = rand(0, window.innerWidth);
    this.y = full ? rand(0, window.innerHeight) : rand(window.innerHeight * 0.3, window.innerHeight);
    this.vx = rand(-2.5, 2.5);
    this.vy = rand(-2, 2);
    this.life = 0;
    this.maxLife = rand(20, 55);
    this.size = rand(0.5, 1.8);
  };

  function init() {
    resize();
    particles = [];
    sparks = [];
    for (var i = 0; i < count; i++) {
      var p = new EmberParticle(true);
      p.life = rand(0, p.maxLife);
      particles.push(p);
    }
    for (var j = 0; j < sparkCount; j++) {
      var s = new SparkParticle();
      s.life = rand(0, s.maxLife);
      sparks.push(s);
    }
  }

  document.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
    mouse.active = true;
  }, { passive: true });

  function drawEmber(p) {
    p.life += 1;
    p.wobble += 0.04;
    var fade = 1 - p.life / p.maxLife;
    if (p.life >= p.maxLife || p.y < -30) {
      p.reset(false);
      return;
    }

    var pull = mouse.active ? (mouse.x - 0.5) * 0.15 : 0;
    p.x += p.vx + Math.sin(p.wobble) * 0.35 + pull;
    p.y += p.vy;

    var r = p.size * (p.trail ? 2.8 : 2);
    var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
    g.addColorStop(0, orangeColor(p.alpha * fade, p.warm));
    g.addColorStop(0.4, orangeColor(p.alpha * fade * 0.5, p.warm));
    g.addColorStop(1, 'rgba(255, 85, 0, 0)');
    ctx.beginPath();
    ctx.fillStyle = g;
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();

    if (p.trail && fade > 0.2) {
      ctx.beginPath();
      ctx.strokeStyle = orangeColor(0.2 * fade, p.warm);
      ctx.lineWidth = p.size * 0.6;
      ctx.lineCap = 'round';
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 12, p.y - p.vy * 12);
      ctx.stroke();
    }
  }

  function drawSpark(s) {
    s.life += 1;
    var fade = 1 - s.life / s.maxLife;
    if (s.life >= s.maxLife) {
      s.reset(false);
      return;
    }
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.02;

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 200, 80, ' + (0.7 * fade) + ')';
    ctx.lineWidth = s.size;
    ctx.lineCap = 'round';
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.vx * 3, s.y - s.vy * 3);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 140, 0, ' + (0.9 * fade) + ')';
    ctx.arc(s.x, s.y, s.size * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  function frame() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (var i = 0; i < particles.length; i++) drawEmber(particles[i]);
    for (var j = 0; j < sparks.length; j++) drawSpark(sparks[j]);
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', function () {
    isMobile = window.innerWidth < 768;
    init();
  });

  init();
  requestAnimationFrame(frame);
})();
