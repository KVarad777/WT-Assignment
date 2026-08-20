/**
 * Global Application Script for Energy Ledger
 * Handles theme persistence (dark/light mode) and responsive navigation.
 */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
});

function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const storedTheme = localStorage.getItem('energy_ledger_theme');
    
    if (storedTheme) {
        document.documentElement.setAttribute('data-theme', storedTheme);
        updateThemeIcon(storedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', initialTheme);
        updateThemeIcon(initialTheme);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('energy_ledger_theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        if (theme === 'dark') {
            themeIcon.innerHTML = '☀️'; // Sun icon for switching to light
            themeIcon.setAttribute('title', 'Switch to Light Mode');
        } else {
            themeIcon.innerHTML = '🌙'; // Moon icon for switching to dark
            themeIcon.setAttribute('title', 'Switch to Dark Mode');
        }
    }
}

function initMobileNav() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show-mobile');
        });
    }
}
