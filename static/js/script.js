/**
 * FinScoreAI — Main Script
 * script.js
 *
 * Handles: Navbar scroll, animations, counter animations,
 * progress bars, intersection observer, and utility functions.
 */

(function () {
    'use strict';

    // ============================================================
    // NAVBAR SCROLL EFFECT
    // ============================================================
    function initNavbarScroll() {
        const navbar = document.getElementById('mainNavbar');
        if (!navbar) return;

        function updateNavbar() {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', updateNavbar, { passive: true });
        updateNavbar(); // Run on load
    }

    // ============================================================
    // ANIMATED COUNTERS
    // Finds elements with [data-target] and counts up to the value
    // ============================================================
    function animateCounters() {
        const counters = document.querySelectorAll('[data-target]');
        if (!counters.length) return;

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                observer.unobserve(entry.target);

                const el = entry.target;
                const target = parseFloat(el.dataset.target);
                const duration = 1500;
                const steps = 60;
                const increment = target / steps;
                let current = 0;
                let step = 0;

                const timer = setInterval(function () {
                    step++;
                    current += increment;
                    if (step >= steps || current >= target) {
                        clearInterval(timer);
                        el.textContent = target.toFixed(2) + '%';
                    } else {
                        el.textContent = current.toFixed(2) + '%';
                    }
                }, duration / steps);
            });
        }, { threshold: 0.3 });

        counters.forEach(function (el) {
            observer.observe(el);
        });
    }

    // ============================================================
    // PROGRESS BAR ANIMATIONS
    // Finds elements with [data-width] and animates to that width
    // ============================================================
    function animateProgressBars() {
        const bars = document.querySelectorAll('[data-width]');
        if (!bars.length) return;

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                observer.unobserve(entry.target);

                const bar = entry.target;
                const width = parseFloat(bar.dataset.width);

                // Small delay for visual appeal
                setTimeout(function () {
                    bar.style.width = width + '%';
                }, 200);
            });
        }, { threshold: 0.1 });

        bars.forEach(function (bar) {
            observer.observe(bar);
        });
    }

    // ============================================================
    // SCROLL ANIMATIONS (AOS-like)
    // ============================================================
    function initScrollAnimations() {
        const elements = document.querySelectorAll('[data-aos]');
        if (!elements.length) return;

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, index) {
                if (!entry.isIntersecting) return;
                observer.unobserve(entry.target);

                const el = entry.target;
                const delay = el.dataset.aosDelay ? parseInt(el.dataset.aosDelay) : 0;

                setTimeout(function () {
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                }, delay);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        elements.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            observer.observe(el);
        });
    }

    // ============================================================
    // FLASH MESSAGE AUTO-DISMISS
    // ============================================================
    function initFlashMessages() {
        const alerts = document.querySelectorAll('.flash-alert');
        alerts.forEach(function (alert) {
            setTimeout(function () {
                const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
                if (bsAlert) bsAlert.close();
            }, 5000);
        });
    }

    // ============================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ============================================================
    // NAVBAR COLLAPSE ON MOBILE LINK CLICK
    // ============================================================
    function initMobileNavClose() {
        const navLinks = document.querySelectorAll('#navMenu .nav-link');
        const navCollapse = document.getElementById('navMenu');
        if (!navCollapse) return;

        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse) bsCollapse.hide();
            });
        });
    }

    // ============================================================
    // TOOLTIP INITIALIZATION
    // ============================================================
    function initTooltips() {
        const tooltipEls = document.querySelectorAll('[title]');
        tooltipEls.forEach(function (el) {
            if (typeof bootstrap !== 'undefined') {
                new bootstrap.Tooltip(el, { trigger: 'hover' });
            }
        });
    }

    // ============================================================
    // NUMBER FORMATTER
    // ============================================================
    function formatNumber(n) {
        return new Intl.NumberFormat('en-US').format(n);
    }

    // ============================================================
    // RIPPLE EFFECT ON BUTTONS
    // ============================================================
    function initRipple() {
        const btns = document.querySelectorAll('.btn-hero-primary, .btn-form-next, .btn-form-submit');
        btns.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.25);
                    transform: scale(0);
                    animation: ripple-anim 0.6s linear;
                    pointer-events: none;
                `;

                btn.style.position = 'relative';
                btn.style.overflow = 'hidden';
                btn.appendChild(ripple);

                ripple.addEventListener('animationend', function () {
                    ripple.remove();
                });
            });
        });

        // Add ripple keyframes if not already present
        if (!document.getElementById('ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = '@keyframes ripple-anim { to { transform: scale(4); opacity: 0; } }';
            document.head.appendChild(style);
        }
    }

    // ============================================================
    // HERO FLOATING ANIMATION ENHANCEMENT
    // ============================================================
    function initHeroParallax() {
        const orbs = document.querySelectorAll('.hero-orb');
        if (!orbs.length) return;

        document.addEventListener('mousemove', function (e) {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;

            orbs.forEach(function (orb, i) {
                const factor = (i + 1) * 0.3;
                orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
                orb.style.transition = 'transform 0.3s ease';
            });
        });
    }

    // ============================================================
    // FORM VALIDATION ENHANCEMENT
    // ============================================================
    function enhanceFormValidation() {
        const inputs = document.querySelectorAll('.form-control-custom');
        inputs.forEach(function (input) {
            input.addEventListener('input', function () {
                if (this.value) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid-custom');
                }
            });
            input.addEventListener('blur', function () {
                if (this.required && !this.value) {
                    this.classList.add('is-invalid');
                }
            });
        });
    }

    // ============================================================
    // COPY TO CLIPBOARD
    // ============================================================
    function initCopyButtons() {
        document.querySelectorAll('[data-copy]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const text = this.dataset.copy;
                navigator.clipboard.writeText(text).then(function () {
                    btn.textContent = '✓ Copied!';
                    setTimeout(function () {
                        btn.textContent = 'Copy';
                    }, 2000);
                });
            });
        });
    }

    // ============================================================
    // INITIALIZE ALL
    // ============================================================
    function init() {
        initNavbarScroll();
        initScrollAnimations();
        initFlashMessages();
        initSmoothScroll();
        initMobileNavClose();
        initRipple();
        initHeroParallax();
        enhanceFormValidation();
        initCopyButtons();
    }

    // DOM Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose public API
    window.FinScoreAI = {
        animateCounters: animateCounters,
        animateProgressBars: animateProgressBars,
        formatNumber: formatNumber,
    };

    // Expose standalone functions for Jinja template calls
    window.animateCounters = animateCounters;
    window.animateProgressBars = animateProgressBars;

})();
