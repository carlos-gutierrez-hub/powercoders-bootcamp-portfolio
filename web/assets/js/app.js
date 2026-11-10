/**
 * app.js - Main Client Application Logic for Carlos Gutiérrez Portfolio
 * Powercoders Bootcamp (Spring 2027)
 * Features: Dark/Light Theme, Hash Routing & Scroll Spy, Language Selector, Mobile Navigation
 */

(function () {
  'use strict';

  const THEME_KEY = 'pc-theme';

  /* ------------------------------------------------------------------
     1. Theme Management (Dark / Light)
     ------------------------------------------------------------------ */
  function getPreferredTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    } catch (e) {
      /* ignore storage access error */
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* ignore storage access error */
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      const isDark = theme === 'dark';
      themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }
  }

  function initTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    applyTheme(currentTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        const active = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(active);
      });
    }

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        try {
          if (!localStorage.getItem(THEME_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light');
          }
        } catch (err) {
          /* ignore */
        }
      });
    }
  }

  /* ------------------------------------------------------------------
     2. Section Navigation, Hash Routing & Scroll Spy
     ------------------------------------------------------------------ */
  function getCleanHash(hashStr) {
    if (!hashStr) return '';
    return hashStr.replace(/^#[/]?/, '').trim();
  }

  function updateActiveNav(sectionId) {
    if (!sectionId) return;
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href') || '';
      const linkTarget = getCleanHash(href);
      if (linkTarget === sectionId || (sectionId === 'dashboard' && href.includes('dashboard'))) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  function closeMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('primary-nav');
    if (menuToggle && nav && nav.classList.contains('is-open')) {
      menuToggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }
  }

  function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .brand, .footer-nav a[href^="#"]');

    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const targetId = getCleanHash(href);
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth' });
            if (history.pushState) {
              history.pushState(null, '', '#' + targetId);
            } else {
              window.location.hash = targetId;
            }
            updateActiveNav(targetId);
            closeMobileMenu();
          }
        }
      });
    });

    window.addEventListener('hashchange', function () {
      const targetId = getCleanHash(window.location.hash);
      if (targetId) {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
          updateActiveNav(targetId);
        }
      }
    });

    // IntersectionObserver scroll-spy
    const sections = document.querySelectorAll('main > section[id]');
    if (sections.length && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              updateActiveNav(entry.target.id);
            }
          });
        },
        {
          root: null,
          rootMargin: '-20% 0px -60% 0px',
          threshold: 0
        }
      );

      sections.forEach(function (sec) {
        observer.observe(sec);
      });
    }

    // Handle deep linking on initial load
    const initialHash = getCleanHash(window.location.hash);
    if (initialHash) {
      const targetEl = document.getElementById(initialHash);
      if (targetEl) {
        setTimeout(function () {
          targetEl.scrollIntoView({ behavior: 'smooth' });
          updateActiveNav(initialHash);
        }, 80);
      } else {
        updateActiveNav('home');
      }
    } else {
      updateActiveNav('home');
    }
  }

  /* ------------------------------------------------------------------
     3. Language Selector Wiring
     ------------------------------------------------------------------ */
  function initLanguageSelect() {
    const langSelect = document.getElementById('lang-select');
    if (!langSelect) return;

    if (window.I18N) {
      langSelect.value = window.I18N.getLang();
    }

    langSelect.addEventListener('change', function (e) {
      if (window.I18N) {
        window.I18N.setLang(e.target.value);
      }
    });

    window.addEventListener('languagechange', function (e) {
      if (e.detail && e.detail.lang && langSelect.value !== e.detail.lang) {
        langSelect.value = e.detail.lang;
      }
    });
  }

  /* ------------------------------------------------------------------
     4. Mobile Navigation Menu Toggle
     ------------------------------------------------------------------ */
  function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('primary-nav');
    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', function () {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      nav.classList.toggle('is-open', !isExpanded);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMobileMenu();
        menuToggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  /* ------------------------------------------------------------------
     App Initialization
     ------------------------------------------------------------------ */
  function init() {
    initTheme();
    initNavigation();
    initLanguageSelect();
    initMobileMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
