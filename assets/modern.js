/* modern.js — scroll reveals, card spotlight, title animation, nav state, hero parallax.
   Vanilla JS, no dependencies. Everything degrades to the original static page. */
(function () {
    'use strict';
    var d = document, root = d.documentElement;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var page = (location.pathname.split('/').pop() || 'index').replace(/\.html$/, '') || 'index';
    root.dataset.page = page;

    /* Nav: glass + shadow once the page scrolls */
    var nav = d.querySelector('.nav');
    function onScroll() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Card spotlight: follow the cursor (fine pointers only, rAF-throttled) */
    if (finePointer) {
        var SPOT = '.stat-card,.achievement-card,.course-card,.lang-card,.coll-stat,.country-entry,.faq-item,.achievement-box,.manage-box';
        var raf = 0, last;
        d.addEventListener('pointermove', function (e) {
            last = e;
            if (raf) return;
            raf = requestAnimationFrame(function () {
                raf = 0;
                var el = last.target.closest && last.target.closest(SPOT);
                if (!el) return;
                var r = el.getBoundingClientRect();
                el.style.setProperty('--mx', (last.clientX - r.left) + 'px');
                el.style.setProperty('--my', (last.clientY - r.top) + 'px');
            });
        }, { passive: true });
    }

    /* Title: split into words for a staggered reveal (plain-text h1 only) */
    if (!reduce) {
        d.querySelectorAll('main h1').forEach(function (h) {
            if (h.children.length) return;
            var words = h.textContent.trim().split(/\s+/);
            h.textContent = '';
            words.forEach(function (w, i) {
                var s = d.createElement('span');
                s.className = 'w'; s.style.setProperty('--i', i); s.textContent = w;
                h.appendChild(s);
                if (i < words.length - 1) h.appendChild(d.createTextNode(' '));
            });
        });
    }

    /* Scroll reveal: fade/rise as blocks enter the viewport, then hand control back to the
       element's own hover styles by removing the reveal classes once the transition is done */
    var REV = '.section>h2,.section>p,.profile-photo-wrap,.stat-card,.timeline-item,.achievement-card,.course-card,.lang-card,' +
              '.courses-accordion,.achievement-box,.faq-item,.coll-stat,.country-entry,.gallery-item,.manage-box,.cookie-table-wrap';
    var io = null;
    if (!reduce && 'IntersectionObserver' in window) {
        io = new IntersectionObserver(function (entries) {
            entries.filter(function (e) { return e.isIntersecting; })
                .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left; })
                .forEach(function (e, n) {
                    var el = e.target;
                    io.unobserve(el);
                    el.style.setProperty('--d', Math.min(n, 6) * 70 + 'ms');
                    el.classList.add('in', 'seen');
                    setTimeout(function () { el.classList.remove('reveal', 'in'); el.style.removeProperty('--d'); }, 1200);
                });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    }
    function mark(el) {
        if (el.dataset.rv) return;
        el.dataset.rv = '1';
        if (!io) { el.classList.add('seen'); return; }
        el.classList.add('reveal');
        io.observe(el);
    }
    function scan(scope) {
        if (scope.matches && scope.matches(REV)) mark(scope);
        scope.querySelectorAll(REV).forEach(mark);
    }
    scan(d);
    /* Content built by the page scripts later (gallery, country list, plate list) */
    var dyn = new MutationObserver(function (muts) {
        muts.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) scan(n); }); });
    });
    ['galleryGrid', 'countryList', 'cpPlateList'].forEach(function (id) {
        var host = d.getElementById(id);
        if (host) dyn.observe(host, { childList: true });
    });

    /* Index hero: tiny parallax on panel text as the carousel scrolls */
    if (page === 'index' && !reduce) {
        var hero = d.querySelector('.hero'), ticking = false;
        if (hero) {
            var update = function () {
                ticking = false;
                var hb = hero.getBoundingClientRect(), w = hero.clientWidth || 1;
                d.querySelectorAll('.hero-panel').forEach(function (p) {
                    var x = (p.getBoundingClientRect().left - hb.left) / w;
                    p.style.setProperty('--p', Math.max(-1.2, Math.min(1.2, x)).toFixed(3));
                });
            };
            hero.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
            window.addEventListener('resize', update);
            update();
        }
    }
})();
