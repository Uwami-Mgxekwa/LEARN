// ===================================
// Shared Navigation — works on all pages
// ===================================

(function () {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('navMenu');

    if (!navbar || !hamburger || !navMenu) return;

    // ── Scroll shadow ──────────────────────────────
    function onScroll() {
        navbar.classList.toggle('scrolled', window.pageYOffset > 50);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Open / close helpers ───────────────────────
    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        // Prevent body scroll while menu is open
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    function toggleMenu() {
        navMenu.classList.contains('active') ? closeMenu() : openMenu();
    }

    // ── Hamburger click ────────────────────────────
    hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMenu();
    });

    // ── Close on nav link tap (mobile) ────────────
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    // ── Close on outside tap/click ─────────────────
    document.addEventListener('click', function (e) {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    // ── Close on Escape key ────────────────────────
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
            hamburger.focus();
        }
    });

    // ── Close if window resizes past mobile breakpoint ──
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    }, { passive: true });

})();
