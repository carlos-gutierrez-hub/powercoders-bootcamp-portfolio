/**
 * i18n.js - Multilingual Translation Engine for Carlos Gutiérrez Portfolio
 * Powercoders Bootcamp (Spring 2027)
 * Languages: en (default), es, fr, de
 */

(function () {
  'use strict';

  const SUPPORTED_LANGS = ['en', 'es', 'fr', 'de'];
  const STORAGE_KEY = 'pc-lang';
  const DEFAULT_LANG = 'en';

  const TRANSLATIONS = {
    en: {
      'nav.skip': 'Skip to content',
      'nav.brand': 'Carlos Gutiérrez',
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.dashboard': 'Task Tracker',
      'nav.projects': 'Projects',
      'nav.contact': 'Contact',
      'nav.theme_toggle': 'Toggle dark/light theme',
      'nav.lang_select': 'Select language',
      'nav.menu_toggle': 'Toggle navigation menu',

      'hero.eyebrow': 'Powercoders Bootcamp · Spring 2027',
      'hero.title': 'Carlos Gutiérrez',
      'hero.subtitle': 'Industrial Engineer transitioning into Software Development',
      'hero.lead': 'Building a transparent, evidence-based preparation journey for the Powercoders application in Zurich. Demonstrating engineering methodology, systematic task tracking, and rapid adoption of web technologies.',
      'hero.cta_dashboard': 'Open Task Tracker',
      'hero.cta_projects': 'View Projects',
      'hero.cta_cv': 'Download CV (PDF)',

      'about.eyebrow': 'Background & Transition',
      'about.title': 'About Me',
      'about.lead': 'From industrial engineering in Nicaragua to tech in Switzerland: solving complex problems with structured processes and software.',
      'about.card1_title': 'Engineering Mindset',
      'about.card1_body': 'Process optimization, root-cause analysis, and systematic problem solving applied to modern software engineering.',
      'about.card2_title': 'Powercoders Journey',
      'about.card2_body': 'Dedicated preparation track covering web fundamentals (HTML, CSS, JS), version control, and full-stack development practices.',
      'about.card3_title': 'Multilingual & Adaptable',
      'about.card3_body': 'Native Spanish, fluent French, professional English, and conversational German (B2), thriving in multicultural technical teams.',

      'dashboard.eyebrow': 'Live Preparation Evidence',
      'dashboard.title': 'Task Tracker Dashboard',
      'dashboard.lead': 'An interactive progress tracker migrated from an Excel workbook with 90+ charts to an autonomous web dashboard connected to a live Google Sheet via Apps Script.',
      'dashboard.stat1_label': 'Evolution',
      'dashboard.stat1_value': 'Excel → Web',
      'dashboard.stat2_label': 'Data Source',
      'dashboard.stat2_value': 'Google Sheets API',
      'dashboard.stat3_label': 'Architecture',
      'dashboard.stat3_value': '100% Client-side',
      'dashboard.cta': 'Launch Interactive Dashboard',
      'dashboard.note': 'The dashboard runs independently at /dashboard/ with offline fallback snapshot support.',

      'projects.eyebrow': 'Technical Portfolio',
      'projects.title': 'Projects & Deliverables',
      'projects.lead': 'Practical implementations demonstrating front-end architecture, automation scripts, and agile workflow management.',
      'projects.item1_title': 'Task Tracker Web Dashboard',
      'projects.item1_desc': 'Single-page responsive dashboard consuming Google Apps Script JSON with offline JSON snapshot fallback.',
      'projects.item1_tag': 'Vanilla JS · CSS Grid · Apps Script',
      'projects.view_dashboard': 'Open Dashboard →',
      'projects.item2_title': 'Multilingual Application Portfolio',
      'projects.item2_desc': 'Responsive 4-language portfolio built with zero dependencies, CSS variables, and full accessibility.',
      'projects.item2_tag': 'Semantic HTML5 · CSS Tokens · i18n',
      'projects.view_repo': 'View Repository →',
      'projects.item3_title': 'Excel COM Automation Pipeline',
      'projects.item3_desc': 'Python COM pipeline preserving embedded charts while synchronizing task data across spreadsheets and repositories.',
      'projects.item3_tag': 'Python · Excel COM · Automation',
      'projects.view_script': 'View Script →',

      'contact.eyebrow': 'Connect',
      'contact.title': 'Get in Touch',
      'contact.lead': 'I am actively preparing for the Powercoders Spring 2027 cohort in Zurich and welcome technical discussions, mentorship, or interview opportunities.',
      'contact.name_label': 'Your Name',
      'contact.name_placeholder': 'e.g. Jane Doe',
      'contact.email_label': 'Your Email',
      'contact.email_placeholder': 'jane@example.com',
      'contact.message_label': 'Message',
      'contact.message_placeholder': 'Write your message here...',
      'contact.submit': 'Send Message',
      'contact.form_note': 'Contact form will be enabled with Netlify Forms in an upcoming block.',
      'contact.cv_download': 'Download CV (PDF)',
      'contact.links_title': 'Direct Links',

      'footer.tagline': 'Powercoders Spring 2027 Application Portfolio · Built with vanilla web standards.',
      'footer.back_to_top': 'Back to top ↑',
      'footer.github': 'GitHub',
      'footer.linkedin': 'LinkedIn',
      'footer.rights': '© 2026 Carlos Gutiérrez. All rights reserved.'
    },

    es: {
      'nav.skip': 'Saltar al contenido',
      'nav.brand': 'Carlos Gutiérrez',
      'nav.home': 'Inicio',
      'nav.about': 'Sobre mí',
      'nav.dashboard': 'Task Tracker',
      'nav.projects': 'Proyectos',
      'nav.contact': 'Contacto',
      'nav.theme_toggle': 'Alternar tema claro/oscuro',
      'nav.lang_select': 'Seleccionar idioma',
      'nav.menu_toggle': 'Alternar menú de navegación',

      'hero.eyebrow': 'Powercoders Bootcamp · Primavera 2027',
      'hero.title': 'Carlos Gutiérrez',
      'hero.subtitle': 'Ingeniero industrial en transición hacia el desarrollo de software',
      'hero.lead': 'Construyendo un camino de preparación transparente y basado en evidencias para la postulación a Powercoders en Zúrich. Demostrando metodología de ingeniería, seguimiento sistemático y rápida adopción de tecnologías web.',
      'hero.cta_dashboard': 'Abrir Task Tracker',
      'hero.cta_projects': 'Ver proyectos',
      'hero.cta_cv': 'Descargar CV (PDF)',

      'about.eyebrow': 'Trayectoria y transición',
      'about.title': 'Sobre mí',
      'about.lead': 'De la ingeniería industrial en Nicaragua a la tecnología en Suiza: resolviendo problemas complejos con procesos estructurados y software.',
      'about.card1_title': 'Mentalidad de ingeniería',
      'about.card1_body': 'Optimización de procesos, análisis de causa raíz y resolución sistemática de problemas aplicados al desarrollo moderno de software.',
      'about.card2_title': 'Camino hacia Powercoders',
      'about.card2_body': 'Ruta de preparación intensiva cubriendo fundamentos web (HTML, CSS, JS), control de versiones y metodologías full-stack.',
      'about.card3_title': 'Multilingüe y adaptable',
      'about.card3_body': 'Español nativo, francés fluido, inglés profesional y alemán conversacional (B2), colaborando eficazmente en equipos multiculturales.',

      'dashboard.eyebrow': 'Evidencia de preparación en vivo',
      'dashboard.title': 'Task Tracker Dashboard',
      'dashboard.lead': 'Un panel interactivo migrado desde un libro de Excel con más de 90 gráficos hacia una aplicación web autónoma conectada a Google Sheets mediante Apps Script.',
      'dashboard.stat1_label': 'Evolución',
      'dashboard.stat1_value': 'Excel → Web',
      'dashboard.stat2_label': 'Fuente de datos',
      'dashboard.stat2_value': 'Google Sheets API',
      'dashboard.stat3_label': 'Arquitectura',
      'dashboard.stat3_value': '100% Client-side',
      'dashboard.cta': 'Abrir Dashboard interactivo',
      'dashboard.note': 'El dashboard opera de forma independiente en /dashboard/ con respaldo de snapshot sin conexión.',

      'projects.eyebrow': 'Portafolio técnico',
      'projects.title': 'Proyectos y entregables',
      'projects.lead': 'Implementaciones prácticas que demuestran arquitectura front-end, scripts de automatización y gestión ágil de flujos de trabajo.',
      'projects.item1_title': 'Task Tracker Web Dashboard',
      'projects.item1_desc': 'Panel responsive de una sola página que consume JSON desde Google Apps Script con respaldo offline.',
      'projects.item1_tag': 'Vanilla JS · CSS Grid · Apps Script',
      'projects.view_dashboard': 'Abrir Dashboard →',
      'projects.item2_title': 'Portafolio multilingüe de postulación',
      'projects.item2_desc': 'Portafolio responsive en 4 idiomas construido sin dependencias externas, con variables CSS y total accesibilidad.',
      'projects.item2_tag': 'Semantic HTML5 · CSS Tokens · i18n',
      'projects.view_repo': 'Ver repositorio →',
      'projects.item3_title': 'Pipeline de automatización Excel COM',
      'projects.item3_desc': 'Automatización en Python COM que preserva gráficos incrustados y sincroniza tareas entre hojas y repositorios.',
      'projects.item3_tag': 'Python · Excel COM · Automatización',
      'projects.view_script': 'Ver script →',

      'contact.eyebrow': 'Contacto',
      'contact.title': 'Ponte en contacto',
      'contact.lead': 'Me preparo activamente para la convocatoria Powercoders Spring 2027 en Zúrich y estoy disponible para conversaciones técnicas, mentorías u oportunidades de entrevista.',
      'contact.name_label': 'Tu nombre',
      'contact.name_placeholder': 'ej. Carlos Gutiérrez',
      'contact.email_label': 'Tu correo electrónico',
      'contact.email_placeholder': 'carlos@example.com',
      'contact.message_label': 'Mensaje',
      'contact.message_placeholder': 'Escribe tu mensaje aquí...',
      'contact.submit': 'Enviar mensaje',
      'contact.form_note': 'El formulario de contacto se activará con Netlify Forms en el próximo bloque.',
      'contact.cv_download': 'Descargar CV (PDF)',
      'contact.links_title': 'Enlaces directos',

      'footer.tagline': 'Portafolio de postulación Powercoders Spring 2027 · Construido con estándares web nativos.',
      'footer.back_to_top': 'Volver arriba ↑',
      'footer.github': 'GitHub',
      'footer.linkedin': 'LinkedIn',
      'footer.rights': '© 2026 Carlos Gutiérrez. Todos los derechos reservados.'
    },

    fr: {
      'nav.skip': 'Passer au contenu',
      'nav.brand': 'Carlos Gutiérrez',
      'nav.home': 'Accueil',
      'nav.about': 'À propos',
      'nav.dashboard': 'Task Tracker',
      'nav.projects': 'Projets',
      'nav.contact': 'Contact',
      'nav.theme_toggle': 'Basculer thème clair/sombre',
      'nav.lang_select': 'Choisir la langue',
      'nav.menu_toggle': 'Basculer le menu de navigation',

      'hero.eyebrow': 'Powercoders Bootcamp · Printemps 2027',
      'hero.title': 'Carlos Gutiérrez',
      'hero.subtitle': 'Ingénieur industriel en transition vers le développement logiciel',
      'hero.lead': 'Construction d’un parcours de préparation transparent et fondé sur des preuves pour la candidature Powercoders à Zurich. Démonstration de la méthodologie d’ingénierie, du suivi méthodique et de l’adoption rapide des technologies web.',
      'hero.cta_dashboard': 'Ouvrir Task Tracker',
      'hero.cta_projects': 'Voir les projets',
      'hero.cta_cv': 'Télécharger le CV (PDF)',

      'about.eyebrow': 'Parcours et transition',
      'about.title': 'À propos de moi',
      'about.lead': 'De l’ingénierie industrielle au Nicaragua à la tech en Suisse : résoudre des problèmes complexes grâce à des processus structurés et du logiciel.',
      'about.card1_title': 'Esprit d’ingénierie',
      'about.card1_body': 'Optimisation des processus, analyse des causes fondamentales et résolution systématique appliquées au développement logiciel moderne.',
      'about.card2_title': 'Parcours Powercoders',
      'about.card2_body': 'Programme de préparation dédié couvrant les fondamentaux du web (HTML, CSS, JS), le contrôle de versions et les pratiques full-stack.',
      'about.card3_title': 'Multilingue et adaptable',
      'about.card3_body': 'Espagnol natif, français courant, anglais professionnel et allemand conversationnel (B2), s’épanouissant au sein d’équipes multiculturelles.',

      'dashboard.eyebrow': 'Preuve de préparation en direct',
      'dashboard.title': 'Tableau de bord Task Tracker',
      'dashboard.lead': 'Un outil de suivi interactif migré d’un classeur Excel de plus de 90 graphiques vers un tableau de bord web autonome connecté à Google Sheets via Apps Script.',
      'dashboard.stat1_label': 'Évolution',
      'dashboard.stat1_value': 'Excel → Web',
      'dashboard.stat2_label': 'Source de données',
      'dashboard.stat2_value': 'API Google Sheets',
      'dashboard.stat3_label': 'Architecture',
      'dashboard.stat3_value': '100% Côté client',
      'dashboard.cta': 'Lancer le tableau de bord interactif',
      'dashboard.note': 'Le tableau de bord fonctionne de manière autonome sous /dashboard/ avec instantané de secours hors ligne.',

      'projects.eyebrow': 'Portfolio technique',
      'projects.title': 'Projets et livrables',
      'projects.lead': 'Réalisations pratiques démontrant l’architecture front-end, les scripts d’automatisation et la gestion agile des flux de travail.',
      'projects.item1_title': 'Tableau de bord web Task Tracker',
      'projects.item1_desc': 'Tableau de bord monopage responsive consommant le JSON de Google Apps Script avec secours hors ligne.',
      'projects.item1_tag': 'Vanilla JS · CSS Grid · Apps Script',
      'projects.view_dashboard': 'Ouvrir le tableau de bord →',
      'projects.item2_title': 'Portfolio de candidature multilingue',
      'projects.item2_desc': 'Portfolio responsive en 4 langues sans aucune dépendance externe, avec variables CSS et accessibilité totale.',
      'projects.item2_tag': 'HTML5 sémantique · Tokens CSS · i18n',
      'projects.view_repo': 'Voir le dépôt →',
      'projects.item3_title': 'Pipeline d’automatisation Excel COM',
      'projects.item3_desc': 'Automatisation Python COM préservant les graphiques intégrés tout en synchronisant les données entre feuilles et dépôts.',
      'projects.item3_tag': 'Python · Excel COM · Automatisation',
      'projects.view_script': 'Voir le script →',

      'contact.eyebrow': 'Contact',
      'contact.title': 'Contactez-moi',
      'contact.lead': 'Je prépare activement la promotion Powercoders Printemps 2027 à Zurich et suis disponible pour des échanges techniques, du mentorat ou des opportunités d’entretien.',
      'contact.name_label': 'Votre nom',
      'contact.name_placeholder': 'ex. Jean Dupont',
      'contact.email_label': 'Votre e-mail',
      'contact.email_placeholder': 'jean@example.com',
      'contact.message_label': 'Message',
      'contact.message_placeholder': 'Écrivez votre message ici...',
      'contact.submit': 'Envoyer le message',
      'contact.form_note': 'Le formulaire de contact sera activé avec Netlify Forms dans un prochain bloc.',
      'contact.cv_download': 'Télécharger le CV (PDF)',
      'contact.links_title': 'Liens directs',

      'footer.tagline': 'Portfolio de candidature Powercoders Printemps 2027 · Conçu avec les standards web natifs.',
      'footer.back_to_top': 'Retour en haut ↑',
      'footer.github': 'GitHub',
      'footer.linkedin': 'LinkedIn',
      'footer.rights': '© 2026 Carlos Gutiérrez. Tous droits réservés.'
    },

    de: {
      'nav.skip': 'Zum Inhalt springen',
      'nav.brand': 'Carlos Gutiérrez',
      'nav.home': 'Startseite',
      'nav.about': 'Über mich',
      'nav.dashboard': 'Task Tracker',
      'nav.projects': 'Projekte',
      'nav.contact': 'Kontakt',
      'nav.theme_toggle': 'Hell/Dunkel-Design umschalten',
      'nav.lang_select': 'Sprache auswählen',
      'nav.menu_toggle': 'Navigationsmenü umschalten',

      'hero.eyebrow': 'Powercoders Bootcamp · Frühjahr 2027',
      'hero.title': 'Carlos Gutiérrez',
      'hero.subtitle': 'Wirtschaftsingenieur im Übergang zur Softwareentwicklung',
      'hero.lead': 'Aufbau einer transparenten, evidenzbasierten Vorbereitung für die Powercoders-Bewerbung in Zürich. Demonstration von Ingenieurmethodik, systematischem Tracking und schneller Beherrschung moderner Webtechnologien.',
      'hero.cta_dashboard': 'Task Tracker öffnen',
      'hero.cta_projects': 'Projekte ansehen',
      'hero.cta_cv': 'CV herunterladen (PDF)',

      'about.eyebrow': 'Hintergrund & Übergang',
      'about.title': 'Über mich',
      'about.lead': 'Vom Wirtschaftsingenieurwesen in Nicaragua zur Tech-Branche in der Schweiz: Lösung komplexer Probleme durch strukturierte Prozesse und Software.',
      'about.card1_title': 'Ingenieursdenken',
      'about.card1_body': 'Prozessoptimierung, Ursachenanalyse und systematische Problemlösung für die moderne Softwareentwicklung.',
      'about.card2_title': 'Weg zu Powercoders',
      'about.card2_body': 'Gezielte Vorbereitung auf Web-Grundlagen (HTML, CSS, JS), Versionskontrolle und agile Full-Stack-Entwicklung.',
      'about.card3_title': 'Mehrsprachig & anpassungsfähig',
      'about.card3_body': 'Spanisch als Muttersprache, fliessend Französisch, verhandlungssicheres Englisch und Deutsch auf B2-Niveau.',

      'dashboard.eyebrow': 'Live-Vorbereitungsnachweis',
      'dashboard.title': 'Task Tracker Dashboard',
      'dashboard.lead': 'Ein interaktiver Fortschrittstracker, migriert von einer Excel-Arbeitsmappe mit über 90 Diagrammen zu einem autonomen Web-Dashboard mit Google Sheets API-Anbindung.',
      'dashboard.stat1_label': 'Evolution',
      'dashboard.stat1_value': 'Excel → Web',
      'dashboard.stat2_label': 'Datenquelle',
      'dashboard.stat2_value': 'Google Sheets API',
      'dashboard.stat3_label': 'Architektur',
      'dashboard.stat3_value': '100% Client-seitig',
      'dashboard.cta': 'Interaktives Dashboard starten',
      'dashboard.note': 'Das Dashboard läuft unabhängig unter /dashboard/ mit lokaler Offline-Snapshot-Unterstützung.',

      'projects.eyebrow': 'Technisches Portfolio',
      'projects.title': 'Projekte & Ergebnisse',
      'projects.lead': 'Praktische Implementierungen zur Veranschaulichung von Frontend-Architektur, Automatisierungsskripten und agilen Arbeitsabläufen.',
      'projects.item1_title': 'Task Tracker Web Dashboard',
      'projects.item1_desc': 'Responsives Single-Page-Dashboard, das Google Apps Script JSON mit Offline-Fallback konsumiert.',
      'projects.item1_tag': 'Vanilla JS · CSS Grid · Apps Script',
      'projects.view_dashboard': 'Dashboard öffnen →',
      'projects.item2_title': 'Mehrsprachiges Bewerbungs-Portfolio',
      'projects.item2_desc': 'Responsives 4-Sprachen-Portfolio ohne externe Abhängigkeiten, mit CSS-Tokens und vollständiger Barrierefreiheit.',
      'projects.item2_tag': 'Semantisches HTML5 · CSS Tokens · i18n',
      'projects.view_repo': 'Repository ansehen →',
      'projects.item3_title': 'Excel-COM-Automatisierungs-Pipeline',
      'projects.item3_desc': 'Python-COM-Pipeline zur Erhaltung eingebetteter Diagramme bei gleichzeitiger Datensynchronisation.',
      'projects.item3_tag': 'Python · Excel COM · Automation',
      'projects.view_script': 'Skript ansehen →',

      'contact.eyebrow': 'Kontakt',
      'contact.title': 'Kontakt aufnehmen',
      'contact.lead': 'Ich bereite mich aktiv auf das Powercoders Frühjahrs-Bootcamp 2027 in Zürich vor und freue mich über technische Fachgespräche, Mentoring oder Kennenlerngespräche.',
      'contact.name_label': 'Ihr Name',
      'contact.name_placeholder': 'z.B. Max Mustermann',
      'contact.email_label': 'Ihre E-Mail',
      'contact.email_placeholder': 'max@example.com',
      'contact.message_label': 'Nachricht',
      'contact.message_placeholder': 'Schreiben Sie Ihre Nachricht hier...',
      'contact.submit': 'Nachricht senden',
      'contact.form_note': 'Das Kontaktformular wird in einem kommenden Block über Netlify Forms aktiviert.',
      'contact.cv_download': 'CV herunterladen (PDF)',
      'contact.links_title': 'Direkte Links',

      'footer.tagline': 'Bewerbungsportfolio Powercoders Frühjahr 2027 · Mit nativen Webstandards entwickelt.',
      'footer.back_to_top': 'Nach oben ↑',
      'footer.github': 'GitHub',
      'footer.linkedin': 'LinkedIn',
      'footer.rights': '© 2026 Carlos Gutiérrez. Alle Rechte vorbehalten.'
    }
  };

  let currentLang = DEFAULT_LANG;

  function resolveInitialLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LANGS.includes(stored)) {
        return stored;
      }
    } catch (e) {
      /* ignore storage access error */
    }

    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserCode = navigator.language.slice(0, 2).toLowerCase();
      if (SUPPORTED_LANGS.includes(browserCode)) {
        return browserCode;
      }
    }

    return DEFAULT_LANG;
  }

  function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) {
      lang = DEFAULT_LANG;
    }
    currentLang = lang;
    document.documentElement.lang = lang;

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore storage access error */
    }

    // Sync select element if it exists
    const select = document.getElementById('lang-select');
    if (select && select.value !== lang) {
      select.value = lang;
    }

    // Apply text translations
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key] !== undefined) {
        el.textContent = TRANSLATIONS[lang][key];
      } else if (TRANSLATIONS[DEFAULT_LANG] && TRANSLATIONS[DEFAULT_LANG][key] !== undefined) {
        el.textContent = TRANSLATIONS[DEFAULT_LANG][key];
      }
    });

    // Apply placeholder translations
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(function (el) {
      const key = el.getAttribute('data-i18n-placeholder');
      if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key] !== undefined) {
        el.setAttribute('placeholder', TRANSLATIONS[lang][key]);
      } else if (TRANSLATIONS[DEFAULT_LANG] && TRANSLATIONS[DEFAULT_LANG][key] !== undefined) {
        el.setAttribute('placeholder', TRANSLATIONS[DEFAULT_LANG][key]);
      }
    });

    // Apply aria-label translations
    const ariaLabels = document.querySelectorAll('[data-i18n-aria-label]');
    ariaLabels.forEach(function (el) {
      const key = el.getAttribute('data-i18n-aria-label');
      if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key] !== undefined) {
        el.setAttribute('aria-label', TRANSLATIONS[lang][key]);
      } else if (TRANSLATIONS[DEFAULT_LANG] && TRANSLATIONS[DEFAULT_LANG][key] !== undefined) {
        el.setAttribute('aria-label', TRANSLATIONS[DEFAULT_LANG][key]);
      }
    });

    // Dispatch event so other modules can react if needed
    if (typeof CustomEvent !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: lang } }));
    }
  }

  function getLang() {
    return currentLang;
  }

  function t(key, fallback) {
    if (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key] !== undefined) {
      return TRANSLATIONS[currentLang][key];
    }
    if (TRANSLATIONS[DEFAULT_LANG] && TRANSLATIONS[DEFAULT_LANG][key] !== undefined) {
      return TRANSLATIONS[DEFAULT_LANG][key];
    }
    return fallback !== undefined ? fallback : key;
  }

  function init() {
    const initialLang = resolveInitialLang();
    setLang(initialLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.I18N = {
    setLang: setLang,
    getLang: getLang,
    t: t,
    supportedLangs: SUPPORTED_LANGS
  };
})();
