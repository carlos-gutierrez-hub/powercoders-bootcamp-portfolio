# Bloque 1 — Repository restructure + portfolio skeleton

**Fecha:** 10 nov 2026 · **Autor:** Hermes (coordinador) · **Estado:** Parte A ✅ hecha ·
Parte B ⬜ lista para Antigravity

**Resumen (ES):** la Parte A ya está ejecutada: el dashboard vive en `web/dashboard/`, la
raíz `web/` queda libre para el portafolio y existe el árbol `web/assets/`. La Parte B es el
encargo para Antigravity: el esqueleto del portafolio (5 secciones, modo oscuro/claro, 4
idiomas) sin contenido de texto.

---

## Goal

Split `web/` into two independent surfaces —the **portfolio** at the root and the
**dashboard** at `/dashboard/`— so the four-language site can be built without touching the
page that already works, and give the front-end agent a fixed structure to build into.

## Part A — Hermes (done)

| # | Step | Result |
|---|---|---|
| 1 | Move the dashboard into `web/dashboard/` | `git mv web/index.html web/dashboard/index.html`, `git mv web/data web/dashboard/data` |
| 2 | Create the portfolio entry point | `web/index.html` — temporary holding page, links to `/dashboard/` |
| 3 | Create the asset tree | `web/assets/{css,js,img}/` with `.gitkeep` |
| 4 | Review `netlify.toml` | `publish = "web"` unchanged; route map documented in the file |
| 5 | Update `README.md` | new paths, both URLs, structure |
| 6 | Commit and push | conventional commit, verified on GitHub |

**Resulting structure**

```
web/
├── index.html                 portfolio home (temporary page)
├── dashboard/
│   ├── index.html             the Task Tracker — still one self-contained file
│   └── data/datos.json        committed snapshot (fallback)
└── assets/
    ├── css/    js/    img/
```

**Why the snapshot moved with the page:** `web/dashboard/index.html` loads
`SNAPSHOT = "data/datos.json"` relatively, so `data/` had to stay a sibling of the page.
Nothing inside the dashboard changed — zero regression risk.

**Routes after deploy**

| URL | Serves |
|---|---|
| `/` | `web/index.html` — portfolio (in progress) |
| `/dashboard/` | `web/dashboard/index.html` — Task Tracker, live |
| `/dashboard/data/datos.json` | snapshot used when the endpoint fails |
| `/assets/…` | shared portfolio assets |

## Part B — Antigravity (the front-end task)

Build the **shell** of the portfolio in `web/index.html`, using the structure and rules in
`AGENTS.md`. Structure, navigation, theme and languages only — **no copywriting**: every
visible string is a key with a working English placeholder.

### Files it may create or modify

| File | Purpose |
|---|---|
| `web/index.html` | Semantic skeleton: header, 5 sections, footer. Replaces the temporary page |
| `web/assets/css/styles.css` | Design tokens (`:root`) + `[data-theme="light"]` overrides, layout, components |
| `web/assets/js/i18n.js` | Translation table `en/es/fr/de` + `setLang()` |
| `web/assets/js/app.js` | Theme toggle, section navigation / hash routing, language selector wiring |

Nothing else. No new directories, no dependencies, no images yet (`web/assets/img/` stays
empty except `.gitkeep`).

### Required behaviour

1. **Five sections**, one page, no reload: `#home`, `#about`, `#dashboard`, `#projects`,
   `#contact`. Nav links use the hash; the active link reflects the current section;
   deep-linking to `/#projects` works.
2. **The dashboard section links to `dashboard/`** — it does not embed it and does not
   duplicate its markup.
3. **Dark/light theme**: tokens in CSS custom properties, default from
   `prefers-color-scheme`, toggle button with `aria-pressed`, choice persisted in
   `localStorage["pc-theme"]`, no flash of the wrong theme on load.
4. **Four languages** `en · es · fr · de`: strings in `i18n.js`, applied through
   `data-i18n` attributes; selector `<select>` with `lang` values; default from
   `localStorage["pc-lang"]` → `navigator.language` → `en`; the document's `lang` attribute
   updates; French and German may reuse the English placeholder text until Hermes delivers
   the copy, but the keys must already exist.
5. **Responsive and accessible**: usable at 360 px with no horizontal scroll, semantic
   landmarks (`header`/`nav`/`main`/`footer`), real buttons and links, visible focus,
   `aria-label` on icon-only controls, contrast ≥ 4.5:1.
6. **Offline-clean**: no CDN, no webfont request, no analytics, works from `file://` and
   from `http://localhost:8080`.

### Acceptance criteria (Hermes verifies each one)

- [ ] `cd web && python -m http.server 8080` → `/` loads with **zero console errors** and
      zero 404s.
- [ ] All five sections reachable, hash deep-link works, active state correct.
- [ ] Theme toggle persists across reload; no light/dark flash.
- [ ] Each of the four languages visibly switches the interface; `document.documentElement.lang`
      matches.
- [ ] At 360 px: no horizontal scroll, nav usable, tap targets ≥ 40 px.
- [ ] Keyboard only: tab order logical, focus visible, no trap.
- [ ] No `<style>`/`<script>` block in `index.html` beyond a few lines; no inline
      user-visible text outside the i18n table.
- [ ] `git diff` touches only the four files listed above.

### Out of scope (do not build)

- Copywriting and translations (Hermes writes them; Carlos validates).
- Contact form submission / Netlify Forms, CV download file, chatbot, backend.
- Any change to `web/dashboard/`, `apps-script/`, `netlify.toml`, `docs/` or the Excel.
- Images, fonts, icons, animation beyond simple CSS transitions.

### Handoff format

Reply with: files created/modified, a 5-line summary of the approach, the exact command to
run it, and anything the spec did not decide that you had to choose. No commit — Hermes owns
git.
