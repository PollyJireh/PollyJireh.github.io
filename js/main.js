(function () {
  var S = window.SITE || {};

  // ---- Contact links from config.js ----
  document.querySelectorAll('[data-contact]').forEach(function (el) {
    var key = el.getAttribute('data-contact');
    var val = S[key];
    el.hidden = !val;
    if (!val) return;
    el.href = key === 'email' ? 'mailto:' + val + '?subject=' + encodeURIComponent('Project inquiry') : val;
    if (key !== 'email') { el.target = '_blank'; el.rel = 'noopener noreferrer'; }
  });
  document.querySelectorAll('[data-repo]').forEach(function (el) { el.href = S.scamSenseRepo; });
  document.querySelectorAll('[data-demo]').forEach(function (el) {
    if (S.scamSenseDemo) { el.href = S.scamSenseDemo; el.hidden = false; } else { el.hidden = true; }
  });
  document.querySelectorAll('[data-no-demo]').forEach(function (el) { el.hidden = !!S.scamSenseDemo; });

  // ---- Project cards from projects.js ----
  var grid = document.getElementById('projects-grid');
  var list = window.PROJECTS || [];
  var moreSec = document.getElementById('more-projects');
  if (moreSec) moreSec.hidden = !list.length;
  if (grid) list.forEach(function (p) { grid.appendChild(projectCard(p)); });

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  function projectCard(p) {
    var card = el('article', 'card project-card');
    if (p.image) {
      var img = el('img');
      img.src = p.image; img.alt = p.imageAlt || ''; img.width = 1280; img.height = 720;
      img.loading = 'lazy'; img.decoding = 'async';
      card.appendChild(img);
    }
    var body = el('div', 'pc-body');
    body.appendChild(el('h3', '', p.title));
    body.appendChild(el('p', '', p.description));
    if (p.tech && p.tech.length) {
      var ul = el('ul', 'tags');
      p.tech.forEach(function (t) { ul.appendChild(el('li', '', t)); });
      body.appendChild(ul);
    }
    if (p.role) body.appendChild(el('p', 'role', 'My role: ' + p.role));
    var links = el('div', 'links');
    [['repo', 'Repository'], ['demo', 'Live demo']].forEach(function (l) {
      if (!p[l[0]]) return;
      var a = el('a', '', l[1]);
      a.href = p[l[0]]; a.target = '_blank'; a.rel = 'noopener noreferrer';
      links.appendChild(a);
    });
    if (links.children.length) body.appendChild(links);
    card.appendChild(body);
    return card;
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ---- Mobile menu ----
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    });
  }

  // ---- Highlight current section in nav ----
  var links = document.querySelectorAll('.nav a[href^="#"]');
  if (links.length && 'IntersectionObserver' in window) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.removeAttribute('aria-current'); });
          if (map[en.target.id]) map[en.target.id].setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) so.observe(s); });
  }

  // ---- Reveal on scroll (skipped when reduced motion is requested) ----
  var els = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }

  // ---- Hero panel: inspect details like in the game ----
  var finding = document.getElementById('finding');
  var flags = document.querySelectorAll('.flag[data-finding]');
  if (finding && flags.length) {
    flags.forEach(function (f) {
      f.addEventListener('click', function () {
        flags.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
        f.setAttribute('aria-pressed', 'true');
        finding.innerHTML = '';
        var t = document.createElement('strong');
        t.textContent = f.getAttribute('data-title');
        finding.appendChild(t);
        finding.appendChild(document.createTextNode(f.getAttribute('data-finding')));
      });
    });
  }

  // ---- Screenshot gallery (project page) ----
  var main = document.getElementById('shot');
  var cap = document.getElementById('shot-cap');
  var thumbs = document.querySelectorAll('.thumb');
  if (main && thumbs.length) {
    thumbs.forEach(function (t) {
      t.addEventListener('click', function () {
        thumbs.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
        t.setAttribute('aria-pressed', 'true');
        main.src = t.getAttribute('data-full');
        main.alt = t.getAttribute('data-alt');
        if (cap) cap.textContent = t.getAttribute('data-cap');
      });
    });
  }

  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  // ---- Featured screenshot carousel + lightbox ----
  var car = document.getElementById('ss-carousel');
  if (car) {
    var slides = car.querySelectorAll('.slide');
    var dotsBox = car.querySelector('.dots');
    var count = car.querySelector('.car-count');
    var title = car.querySelector('.car-title');
    var lb = document.getElementById('lightbox');
    var lbImg = lb && lb.querySelector('img');
    var lbCap = lb && lb.querySelector('figcaption');
    var idx = 0;

    var dots = Array.prototype.map.call(slides, function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Screenshot ' + (i + 1) + ': ' + s.getAttribute('data-cap'));
      b.addEventListener('click', function () { show(i); });
      dotsBox.appendChild(b);
      return b;
    });

    function show(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        s.classList.toggle('is-active', n === idx);
        s.setAttribute('aria-hidden', String(n !== idx));
      });
      dots.forEach(function (d, n) { d.setAttribute('aria-current', String(n === idx)); });
      count.textContent = (idx + 1) + ' / ' + slides.length;
      title.textContent = slides[idx].getAttribute('data-cap');
      if (lb && lb.open) fillLightbox();
    }
    function fillLightbox() {
      lbImg.src = slides[idx].currentSrc || slides[idx].src;
      lbImg.alt = slides[idx].alt;
      lbCap.textContent = (idx + 1) + ' / ' + slides.length + ' · ' + slides[idx].alt;
    }
    // Start fetching the other screenshots once the visitor interacts.
    var warmed = false;
    function warm() { if (warmed) return; warmed = true; slides.forEach(function (s) { s.loading = 'eager'; }); }

    car.querySelector('.prev').addEventListener('click', function () { warm(); show(idx - 1); });
    car.querySelector('.next').addEventListener('click', function () { warm(); show(idx + 1); });
    car.addEventListener('pointerenter', warm);
    car.addEventListener('focusin', warm);
    car.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { show(idx - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { show(idx + 1); e.preventDefault(); }
    });

    // Swipe on touch screens.
    var sx = null, sy = null;
    car.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') { sx = e.clientX; sy = e.clientY; warm(); } });
    car.addEventListener('pointerup', function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(idx + (dx < 0 ? 1 : -1));
      sx = null;
    });
    car.addEventListener('pointercancel', function () { sx = null; });

    if (lb && lb.showModal) {
      car.querySelector('.expand').addEventListener('click', function () { fillLightbox(); lb.showModal(); });
      lb.querySelector('.prev').addEventListener('click', function () { show(idx - 1); });
      lb.querySelector('.next').addEventListener('click', function () { show(idx + 1); });
      lb.querySelector('.close').addEventListener('click', function () { lb.close(); });
      lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
      lb.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') show(idx - 1);
        if (e.key === 'ArrowRight') show(idx + 1);
      });
    } else {
      car.querySelector('.expand').hidden = true;
    }
    show(0);
  }

  // ---- 3D tilt + parallax (mouse/trackpad only, never with reduced motion) ----
  document.querySelectorAll('[data-tilt]').forEach(function (frame) {
    var slidesEl = frame.querySelector('.slides');
    var raf = 0, pending = null;
    function enabled() { return finePointer.matches && !reduce; }
    function apply() {
      raf = 0;
      if (!pending) return;
      var x = pending.x, y = pending.y;  // -0.5 .. 0.5
      frame.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
      frame.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg');
      frame.style.setProperty('--gx', ((x + 0.5) * 100).toFixed(1) + '%');
      frame.style.setProperty('--gy', ((y + 0.5) * 100).toFixed(1) + '%');
      if (slidesEl) {
        slidesEl.style.setProperty('--px', (-x * 16).toFixed(1) + 'px');
        slidesEl.style.setProperty('--py', (-y * 10).toFixed(1) + 'px');
      }
    }
    frame.addEventListener('pointermove', function (e) {
      if (!enabled() || e.pointerType !== 'mouse') return;
      var r = frame.getBoundingClientRect();
      pending = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
      frame.classList.add('is-tilting');
      if (!raf) raf = requestAnimationFrame(apply);
    });
    frame.addEventListener('pointerleave', function () {
      pending = null;
      frame.classList.remove('is-tilting');
      ['--rx', '--ry', '--gx', '--gy'].forEach(function (p) { frame.style.removeProperty(p); });
      if (slidesEl) { slidesEl.style.removeProperty('--px'); slidesEl.style.removeProperty('--py'); }
    });
  });

  // ---- Accessible tabs (arrow keys, Home/End) ----
  document.querySelectorAll('[data-tabs]').forEach(function (box) {
    var tabs = Array.prototype.slice.call(box.querySelectorAll('[role=tab]'));
    var ink = box.querySelector('.tab-ink');
    function moveInk(t) {
      if (!ink) return;
      ink.style.setProperty('--ink-x', t.offsetLeft + 'px');
      ink.style.setProperty('--ink-w', t.offsetWidth + 'px');
    }
    function select(t, focus) {
      tabs.forEach(function (o) {
        var on = o === t;
        o.setAttribute('aria-selected', String(on));
        o.tabIndex = on ? 0 : -1;
        var p = document.getElementById(o.getAttribute('aria-controls'));
        p.classList.toggle('is-active', on);
        if (on) p.removeAttribute('inert'); else p.setAttribute('inert', '');
      });
      moveInk(t);
      if (focus) t.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(tabs[n], true); }
      });
    });
    var current = function () { return tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0]; };
    moveInk(current());
    window.addEventListener('resize', function () { moveInk(current()); });
  });
})();
