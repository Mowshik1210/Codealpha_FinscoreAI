/**
 * FinScoreAI — Dark Mode Manager
 * darkmode.js
 *
 * Persists user's theme preference in localStorage and
 * applies it on page load. Toggles between dark and light mode.
 */

(function () {
    'use strict';

    const THEME_KEY = 'finscoreai-theme';
    const DARK = 'dark';
    const LIGHT = 'light';

    /**
     * Get the stored theme or default to 'dark'
     */
    function getSavedTheme() {
        return localStorage.getItem(THEME_KEY) || DARK;
    }

    /**
     * Apply theme to <html> element and update toggle button icon
     */
    function applyTheme(theme) {
        const html = document.documentElement;
        html.setAttribute('data-theme', theme);

        // Update body background immediately to prevent flash
        if (theme === DARK) {
            document.body.style.backgroundColor = '#0F172A';
            document.body.style.color = '#F8FAFC';
        } else {
            document.body.style.backgroundColor = '#F8FAFC';
            document.body.style.color = '#0F172A';
        }

        // Update toggle button icon
        const icon = document.getElementById('themeIcon');
        if (icon) {
            if (theme === DARK) {
                icon.className = 'fas fa-sun';
                icon.title = 'Switch to Light Mode';
            } else {
                icon.className = 'fas fa-moon';
                icon.title = 'Switch to Dark Mode';
            }
        }

        // Save to localStorage
        localStorage.setItem(THEME_KEY, theme);
    }

    /**
     * Toggle between dark and light
     */
    function toggleTheme() {
        const current = getSavedTheme();
        const next = current === DARK ? LIGHT : DARK;
        applyTheme(next);

        // Add a smooth flash animation
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }

    /**
     * Initialize: apply saved theme immediately
     */
    function init() {
        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);

        // Bind toggle button
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleTheme);
        }
    }

    // Apply theme ASAP before DOM is fully loaded to prevent flash
    const savedTheme = getSavedTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Full init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for external use
    window.FinScoreTheme = {
        toggle: toggleTheme,
        apply: applyTheme,
        get: getSavedTheme,
    };

})();
