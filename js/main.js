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
})();
