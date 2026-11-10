# AGENTS.md — rules for every agent working in this repository

This file is the contract between the humans and the AI agents that build this repo.
It is read by **Hermes** (planning, docs, review, git) and by **Antigravity** (front-end code).
Read it before touching anything. If a rule here conflicts with a spec in
`docs/specs/`, the spec wins for that block — and then this file gets fixed.

## 1. What this repository is

The portfolio and preparation evidence for the **Powercoders Bootcamp (Spring 2027)**
application, by Carlos Gutiérrez — industrial engineer transitioning into software
development. It is a deliverable that recruiters will read: the code, the history and the
documentation are all part of the application.

- Live site: https://carlosg-pc-roadmap-dashboard.netlify.app/
- Product requirements: `docs/PRD.es.md` (source of truth) and `docs/PRD.md` (English)
- Dashboard architecture: `docs/dashboard.md`
- Block specs: `docs/specs/`

## 2. Who does what

| Who | Owns | Never does |
|---|---|---|
| **Carlos** | Requirements, product decisions, native review (ES/FR), validation | Writes code |
| **Hermes** | Plans, specs, docs, code review, commits, GitHub, Netlify, dashboard bugs | Invents features outside the PRD |
| **Antigravity** | Front-end code as specified | Commits, pushes, changes architecture, adds dependencies |

**Only Hermes commits and pushes.** Antigravity delivers files + a short summary; Hermes
reviews the diff and owns the history.

## 3. Directory map

```
docs/            PRD (es/en), dashboard.md (architecture), specs/bloque-N.md
web/             ← Netlify publish root: everything served by the site lives here
  index.html     portfolio home (in progress)
  dashboard/     the Task Tracker: index.html + data/datos.json (self-contained, no assets)
  assets/        css/ · js/ · img/ — shared portfolio assets
apps-script/     Code.gs (read-only JSON endpoint) + buildTracker.gs (one-time migration)
scripts/         export_datos.py (legacy Excel → CSV export, kept for the diff history)
roadmap/         the original Excel workbook — historical evidence, do not edit
datos.csv        legacy text export of the workbook, kept so early commits still diff
netlify.toml     publish = "web"
```

Routes after deploy: `/` → portfolio home · `/dashboard/` → Task Tracker ·
`/assets/...` → shared assets.

## 4. Rules for code

1. **No framework, no build step, no npm, no bundler.** Plain HTML, CSS and JavaScript.
   A new dependency needs an explicit decision in a spec.
2. **No external CDN** and no runtime fetch to a third party except the Apps Script
   endpoint the dashboard already uses. The page must work offline from disk.
3. **Relative paths only** (`assets/css/styles.css`, `../assets/img/x.png`). Never a leading
   `/`, so the site also works with `file://` and from any subfolder.
4. **One concern per file** under `web/assets/`: `css/` styles, `js/` behaviour, `img/`
   images. No inline `<style>`/`<script>` blocks larger than a few lines in new pages.
5. **i18n from day one.** No user-visible string hard-coded in HTML once the i18n layer
   exists: strings live in the translation table and are applied via `data-i18n` attributes.
   Languages: **en · es · fr · de**; default `en`; the choice persists (localStorage) and
   falls back to the browser language.
6. **Dark/light mode** is a CSS custom-property theme, defaulting to `prefers-color-scheme`,
   overridable by a toggle that persists.
7. **Accessibility and responsiveness are part of "done"**: semantic landmarks, real
   `<button>`/`<a>`, labels on form fields, visible focus, contrast ≥ 4.5:1 for body text,
   usable at 360 px wide without horizontal scroll.
8. **The dashboard stays self-contained.** `web/dashboard/index.html` is one file with no
   external asset; never split it, never link it to `web/assets/`.
9. **Never edit the workbook with openpyxl** — it strips ~90 charts on save. Chart-safe
   `.xlsx` edits go through Excel COM. `roadmap/*.xlsx` is frozen evidence.
10. **No secrets in the repo.** Keys live in `.env` outside version control.

## 5. Data rule

The dashboard's single source of truth is the Google Sheet; the page derives every number
from the Apps Script JSON and falls back to `web/dashboard/data/datos.json`, saying which
one it used (`Live` / `Cached` / `Sample data`). Never compute progress in the page from
hard-coded numbers, and never make the page render blank on a failed fetch.

## 6. Language policy

- **Repo docs, code, identifiers and commit messages: English.**
- **`docs/PRD.es.md` is the source of truth**; `docs/PRD.md` is its English rendering. If
  they disagree, the Spanish one wins and the English one gets fixed.
- The **site** ships in four languages. Translations of site copy are content, not code:
  Hermes drafts them, Carlos validates Spanish and French natively and German as B2.

## 7. Git protocol

- Work on `master`; it deploys. A branch is for anything risky or larger than one block.
- **Conventional commits**, English, imperative, ≤ 72 characters in the subject:
  `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`. The body explains *why*.
- One block = one coherent commit (or a short series that reads like a story). Never mix a
  refactor with a feature.
- **Never commit** generated noise, editor files, `.env`, local scratch, or a file whose
  diff you have not read.
- Before pushing: `git status`, `git diff --stat`, run the page locally, and confirm the
  changed pages load with no console error. After pushing, verify the remote commit.

## 8. Local run

```bash
cd web && python -m http.server 8080     # then open http://localhost:8080
```

`file://` works for the dashboard too (it shows the `Sample data` badge when the snapshot
cannot be fetched), but always test the real pages over HTTP.

## 9. Definition of done

- [ ] Matches the block's spec, and nothing outside it was touched.
- [ ] Works over HTTP locally: no console errors, no 404s, no layout break at 360 px.
- [ ] The four languages still switch and no string is left in the wrong language.
- [ ] Dark and light mode both readable.
- [ ] Docs updated when behaviour changed (`docs/dashboard.md`, README, spec).
- [ ] Committed with a conventional message and pushed by Hermes.

## 10. Calendar (non-negotiable)

Dashboard functional **22 Nov 2026** · MVP in 4 languages **29 Nov** · deployed **30 Nov** ·
application window **1–5 Dec 2026**. If something slips, cut scope — never the date.
