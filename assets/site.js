/* site.js - behaviour shared by every page. One copy instead of eight pasted ones.
   Sections: 1 search index  2 theme + menu  3 consent + analytics  4 shared UI  5 video facade
   When you add a page or a section worth finding, add a line to SITE_INDEX below. */
(function () {
    'use strict';

    /* ── 1. Search index (the only copy) ── */
    var SITE_INDEX = [
        { title: 'Home', url: 'index.html', desc: 'Basketball, academics, license plate atlas' },
        { title: 'Basketball', url: 'basketball.html', desc: 'Player profile, height, weight, position' },
        { title: 'Playing history', url: 'basketball.html', desc: 'KK Portoro\u017e, KK Borac Zemun, Honv\u00e9d Academy, EYBL' },
        { title: 'Highlight video', url: 'basketball.html#highlights', desc: 'Highlights 2025/26, Eurobasket, KZS, SofaScore, Proballers' },
        { title: 'Player sheet (PDF)', url: 'files/pavle-radojevic-player-sheet.pdf', desc: 'One-page profile for coaches, clubs and recruiters' },
        { title: 'Career achievements', url: 'basketball.html#achievements', desc: 'National team camp, NB II champion, tournaments' },
        { title: 'Career highs', url: 'basketball.html#career-highs', desc: 'Points, rebounds, assists, blocks' },
        { title: 'Basketball FAQ', url: 'basketball.html#faq', desc: 'Contact, stats, recruiting questions' },
        { title: 'Academic', url: 'academic.html', desc: 'University of Primorska, FAMNIT, Koper' },
        { title: 'Courses', url: 'academic.html#courses', desc: 'Completed at University of Belgrade: programming, linear algebra, logic' },
        { title: 'Languages', url: 'academic.html#languages', desc: 'Serbian, English, Hungarian' },
        { title: 'Activities & leadership', url: 'academic.html#activities', desc: 'GDG on Campus UP core team: events, marketing, tech support' },
        { title: 'License plate atlas', url: 'plates.html', desc: 'Interactive globe and collection stats' },
        { title: 'Visitor map', url: 'visitors.html', desc: 'Visitor statistics by country' },
        { title: 'Privacy policy', url: 'privacy.html', desc: 'Data, analytics, your rights' },
        { title: 'Terms & conditions', url: 'terms.html', desc: 'Use of this site' },
        { title: 'Cookie policy', url: 'cookies.html', desc: 'Cookies, storage, consent' }
    ];

    function cookieFlags() { return ';path=/;max-age=' + (60 * 60 * 24 * 365) + ';SameSite=Lax' + (location.protocol === 'https:' ? ';Secure' : ''); }

    /* ── 2. Theme toggle + mobile menu ── */
    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
        themeToggle.addEventListener('click', function () {
            var html = document.documentElement;
            var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            themeToggle.textContent = next === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
            document.cookie = 'theme=' + next + cookieFlags();
        });
    }
    var mobileMenuBtn = document.getElementById('mobileMenuBtn');
    var navLinks = document.getElementById('navLinks');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function () {
            navLinks.classList.toggle('mobile-open');
            var open = navLinks.classList.contains('mobile-open');
            mobileMenuBtn.textContent = open ? '\u2715' : '\u2630';
            mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    /* ── 3. Consent banner + first-party analytics (only runs after Accept, never after Decline) ── */
    (function () {
        var WORKER_URL = 'https://visitor-tracker.pavle-radojevic3.workers.dev';
        var MAX_IDLE_MINUTES = 30;
        var CONSENT_COOKIE = 'analytics-consent';
        var SESSION_KEYS = ['visitorToken', 'entryTime', 'lastPage', 'utmParams'];

        function getCookie(name) {
            var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? match[2] : null;
        }
        function clearSession() { SESSION_KEYS.forEach(function (k) { try { sessionStorage.removeItem(k); } catch (e) {} }); }
        function setConsentCookie(value) {
            if (value !== 'accepted') clearSession();
            document.cookie = CONSENT_COOKIE + '=' + value + cookieFlags();
        }
        function getUTMParams() {
            var params = new URLSearchParams(window.location.search);
            var utm = {}, found = false;
            ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (k) {
                var v = params.get(k);
                if (v) { utm[k] = v.slice(0, 100); found = true; }
            });
            if (found) { sessionStorage.setItem('utmParams', JSON.stringify(utm)); return utm; }
            try { var stored = sessionStorage.getItem('utmParams'); return stored ? JSON.parse(stored) : {}; } catch (e) { return {}; }
        }
        function runTracking() {
            if (!sessionStorage.getItem('visitorToken')) {
                sessionStorage.setItem('visitorToken', crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2));
            }
            var visitorToken = sessionStorage.getItem('visitorToken');

            function getEntryTime() {
                var stored = sessionStorage.getItem('entryTime');
                if (!stored) return null;
                if (Date.now() - new Date(stored).getTime() > MAX_IDLE_MINUTES * 60 * 1000) { sessionStorage.removeItem('entryTime'); return null; }
                return stored;
            }
            var entryTime = getEntryTime();
            if (!entryTime) { entryTime = new Date().toISOString(); sessionStorage.setItem('entryTime', entryTime); }

            var ua = navigator.userAgent;
            var pageData = {
                browser: ua.includes('Firefox') ? 'Firefox' : ua.includes('Chrome') ? 'Chrome' : ua.includes('Safari') ? 'Safari' : 'Other',
                os: navigator.platform || 'Unknown',
                device: /Mobi|Android/i.test(ua) ? 'Mobile' : 'Desktop',
                referrer: document.referrer || 'Direct',
                page: window.location.pathname,
                entryTime: entryTime,
                previousPage: sessionStorage.getItem('lastPage') || null,
                visitorToken: visitorToken,
                utm: getUTMParams()
            };
            sessionStorage.setItem('lastPage', window.location.pathname);
            fetch(WORKER_URL + '/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pageData) }).catch(function () {});

            function getReferrerTag() { return new URLSearchParams(window.location.search).get('ref') || document.referrer || 'Direct'; }
            function trackEvent(type, label, url, referrer) {
                fetch(WORKER_URL + '/track-event', { method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: type, label: label, url: url, referrer: referrer || '' }) }).catch(function () {});
            }
            document.addEventListener('click', function (e) {
                var link = e.target.closest && e.target.closest('a');
                if (!link) return;
                var href = link.getAttribute('href') || '';
                var label = link.getAttribute('data-label') || link.textContent.trim();   // data-label: a clean name for the report
                if (/\.pdf$/i.test(href) || link.hasAttribute('download') || link.classList.contains('pdf-link')) {
                    trackEvent('download', label || 'PDF Download', href, getReferrerTag());
                }
                if (link.hostname && link.hostname !== window.location.hostname) {
                    trackEvent('click', label || link.href, href, getReferrerTag());
                }
            });
        }

        var consent = getCookie(CONSENT_COOKIE);
        var banner = document.getElementById('analytics-consent-banner');
        if (consent === 'accepted') {
            runTracking();
        } else if (consent !== 'declined' && banner) {
            banner.classList.add('visible');
            var acceptBtn = document.getElementById('acAcceptBtn');
            var declineBtn = document.getElementById('acDeclineBtn');
            if (acceptBtn) acceptBtn.addEventListener('click', function () { setConsentCookie('accepted'); banner.classList.remove('visible'); runTracking(); });
            if (declineBtn) declineBtn.addEventListener('click', function () { setConsentCookie('declined'); banner.classList.remove('visible'); });
        }
    })();

    /* ── 4. Shared UI: progress bar, back to top, floating contact, search, copy email, cookie modal, FAQ, shortcuts ── */
    var progressBar = document.getElementById('scrollProgressBar');
    var backToTopBtn = document.getElementById('backToTopBtn');
    function onScroll() {
        var doc = document.documentElement;
        var scrollTop = doc.scrollTop || document.body.scrollTop;
        var scrollable = doc.scrollHeight - doc.clientHeight;
        if (progressBar) progressBar.style.width = (scrollable > 0 ? (scrollTop / scrollable) * 100 : 0) + '%';
        if (backToTopBtn) backToTopBtn.classList.toggle('visible', scrollTop > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function () {
            var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        });
    }

    var fcToggle = document.getElementById('floatingContactToggle');
    var fcPanel = document.getElementById('floatingContactPanel');
    var fcWrap = document.getElementById('floatingContact');
    function closeFc() {
        if (!fcPanel || !fcToggle) return;
        fcPanel.classList.remove('open');
        fcToggle.setAttribute('aria-expanded', 'false');
    }
    if (fcToggle && fcPanel) {
        fcToggle.addEventListener('click', function () {
            var open = fcPanel.classList.toggle('open');
            fcToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        document.addEventListener('click', function (e) { if (fcWrap && !fcWrap.contains(e.target)) closeFc(); });
    }

    var banner = document.getElementById('analytics-consent-banner');
    function adjustForBanner() {
        if (!banner || !fcWrap || !backToTopBtn) return;
        var offset = banner.classList.contains('visible') ? banner.offsetHeight + 16 : 24;
        fcWrap.style.bottom = offset + 'px';
        backToTopBtn.style.bottom = offset + 'px';
    }
    adjustForBanner();
    if (banner && window.MutationObserver) new MutationObserver(adjustForBanner).observe(banner, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('resize', adjustForBanner);

    /* Site search */
    var searchTrigger = document.getElementById('siteSearchTrigger');
    var searchOverlay = document.getElementById('siteSearchOverlay');
    var searchInputEl = document.getElementById('siteSearchInput');
    var searchResultsEl = document.getElementById('siteSearchResults');
    var lastFocus = null;
    function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    function renderResults(q) {
        if (!searchResultsEl) return;
        var query = q.trim().toLowerCase();
        var matches = SITE_INDEX.filter(function (item) {
            return !query || item.title.toLowerCase().indexOf(query) !== -1 || item.desc.toLowerCase().indexOf(query) !== -1;
        });
        if (matches.length === 0) { searchResultsEl.innerHTML = '<div id="siteSearchEmpty">No matches. Try a different word.</div>'; return; }
        searchResultsEl.innerHTML = matches.map(function (item) {
            return '<a href="' + item.url + '"><strong>' + escapeHtml(item.title) + '</strong><div class="result-desc">' + escapeHtml(item.desc) + '</div></a>';
        }).join('');
    }
    function openSearch() {
        if (!searchOverlay) return;
        lastFocus = document.activeElement;
        searchOverlay.classList.add('open');
        renderResults('');
        setTimeout(function () { if (searchInputEl) searchInputEl.focus(); }, 30);
    }
    function closeSearch() {
        if (!searchOverlay) return;
        searchOverlay.classList.remove('open');
        if (searchInputEl) searchInputEl.value = '';
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    if (searchTrigger) searchTrigger.addEventListener('click', openSearch);
    if (searchInputEl) {
        searchInputEl.addEventListener('input', function () { renderResults(this.value); });
        searchInputEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                var first = searchResultsEl && searchResultsEl.querySelector('a');
                if (first) window.location.href = first.getAttribute('href');
            }
        });
    }
    if (searchOverlay) searchOverlay.addEventListener('click', function (e) { if (e.target === searchOverlay) closeSearch(); });

    /* Copy email */
    document.querySelectorAll('.copy-email-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var email = btn.getAttribute('data-email');
            function done() { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1800); }
            function fallback() {
                var ta = document.createElement('textarea');
                ta.value = email; ta.style.position = 'fixed'; ta.style.opacity = '0';
                document.body.appendChild(ta); ta.select();
                try { document.execCommand('copy'); done(); } catch (err) { btn.textContent = 'Press Ctrl+C'; }
                document.body.removeChild(ta);
            }
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(email).then(done).catch(fallback);
            else fallback();
        });
    });

    /* Cookie preferences: confirm, then clear the consent choice so the banner returns */
    var cookieModal = document.getElementById('cookiePrefsConfirmModal');
    var cookieCancelBtn = document.getElementById('cookiePrefsCancelBtn');
    var cookieConfirmBtn = document.getElementById('cookiePrefsConfirmBtn');
    var cookieLastFocus = null;
    function openCookieModal() {
        if (!cookieModal) return;
        cookieLastFocus = document.activeElement;
        cookieModal.classList.add('open');
        if (cookieConfirmBtn) cookieConfirmBtn.focus();
    }
    function closeCookieModal() {
        if (!cookieModal) return;
        cookieModal.classList.remove('open');
        if (cookieLastFocus && cookieLastFocus.focus) cookieLastFocus.focus();
    }
    if (cookieCancelBtn) cookieCancelBtn.addEventListener('click', closeCookieModal);
    if (cookieModal) cookieModal.addEventListener('click', function (e) { if (e.target === cookieModal) closeCookieModal(); });
    if (cookieConfirmBtn) cookieConfirmBtn.addEventListener('click', function () {
        ['visitorToken', 'entryTime', 'lastPage', 'utmParams'].forEach(function (k) { try { sessionStorage.removeItem(k); } catch (e) {} });
        document.cookie = 'analytics-consent=; path=/; max-age=0; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
        location.reload();
    });
    window.openCookiePrefsConfirm = openCookieModal;
    ['cookiePrefsBtn', 'cookiePrefsBtnMain'].forEach(function (id) {
        var b = document.getElementById(id);
        if (b) b.addEventListener('click', openCookieModal);
    });

    /* FAQ accordion */
    document.querySelectorAll('.faq-item').forEach(function (item) {
        function toggle() { item.setAttribute('aria-expanded', item.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'); }
        item.addEventListener('click', toggle);
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); toggle(); }
        });
    });

    /* Shortcuts: Ctrl/Cmd+K opens search, Escape closes any open overlay */
    document.addEventListener('keydown', function (e) {
        if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openSearch(); }
        if (e.key === 'Escape') {
            if (searchOverlay && searchOverlay.classList.contains('open')) closeSearch();
            if (cookieModal && cookieModal.classList.contains('open')) closeCookieModal();
            closeFc();
        }
    });

    /* ── 5. Video facade: nothing is requested from YouTube until the visitor presses play ── */
    document.querySelectorAll('.video-facade').forEach(function (facade) {
        facade.addEventListener('click', function (e) {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;   // let "open in new tab" work
            var id = facade.getAttribute('data-video-id') || '';
            if (!/^[A-Za-z0-9_-]{6,20}$/.test(id)) return;                          // bad id: fall back to the plain link
            e.preventDefault();
            var frame = document.createElement('iframe');
            frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
            frame.title = facade.getAttribute('data-title') || 'Video';
            frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
            frame.setAttribute('allowfullscreen', '');
            frame.referrerPolicy = 'strict-origin-when-cross-origin';
            facade.parentNode.replaceChild(frame, facade);
            frame.focus();
        });
    });
})();
