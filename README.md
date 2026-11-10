# Powercoders Bootcamp — Portfolio & Preparation Roadmap

Welcome to my application portfolio for the **Powercoders Bootcamp (Spring 2027)**.

I am an Industrial Engineer transitioning into software development, focused on process digitalisation, automation and AI-assisted no-code / low-code solutions. This repository documents my preparation journey and hosts the web portfolio that showcases it.

## What you'll find here

- **`web/`** — the deployed site: the portfolio at `/` (in progress) and the **Task Tracker dashboard** at `/dashboard/` (Excel → Google Sheet → JSON → static HTML).
- **`docs/`** — the [PRD](docs/PRD.md) (also in [Español](docs/PRD.es.md)), the [dashboard architecture](docs/dashboard.md) and the [block specs](docs/specs/).
- **`AGENTS.md`** — the working conventions both AI agents follow in this repository.
- **`roadmap/`** — the preparation roadmap and its starting point: the original Excel dashboard, kept as evidence.
- The **AI-assisted web portfolio** (in progress) demonstrating the methodology, organisation and problem-solving I will bring to the Bootcamp.

## The project

**Goal:** build a clean, functional, multilingual portfolio site entirely assisted by AI agents — no hand-written code — and document the process as proof of analytical and organisational ability.

**Approach:** I act as the "tech lead". I define requirements, architecture and the quality bar, while AI agents (Hermes + DeepSeek API + Antigravity) write the code and explain it to me. This mirrors exactly what Powercoders teaches: AI-assisted automation, no-code / low-code, and process thinking.

**The evidence:** the "Task Tracker" began as a spreadsheet and now runs as a live dashboard. That evolution — Excel → Google Sheet → JSON → HTML — is the proof of my methodology.

## Live dashboard — Excel → Google Sheet → web

**https://carlosg-pc-roadmap-dashboard.netlify.app/dashboard/** — the Task Tracker as a live page: 58 tasks, 6 categories, 259 task-days (25 Oct – 30 Dec 2026).

The site root **https://carlosg-pc-roadmap-dashboard.netlify.app/** holds the portfolio itself, which is being built block by block; for now it links to the dashboard.

```
Excel v2 (frozen) → Google Sheet (master) → Apps Script JSON → web/dashboard/ (static HTML) → Netlify
```

- The **Google Sheet** is where progress is updated: one checkbox per planned day. It is the single source of truth.
- `apps-script/Code.gs` exposes it as a **read-only JSON endpoint** (`doGet` only, 60 s cache, JSONP for the browser).
- `web/dashboard/index.html` renders it with **no framework and no build step**, and falls back to the committed snapshot `web/dashboard/data/datos.json` if the endpoint does not answer — the badge on the page says `Live`, `Cached` or `Sample data`.
- `netlify.toml` publishes `web/` on every push to `master`.

Architecture, JSON contract and the daily update loop: **[docs/dashboard.md](docs/dashboard.md)**.

The workbook in `roadmap/` is kept as the historical starting point. `datos.csv` and `scripts/export_datos.py` are its legacy text export, kept so the early commits still diff line by line.

## Roadmap (six phases)

| # | Phase | Window | Status |
|---|-------|--------|--------|
| 1 | Discovery & Exploration | 25 Oct – 5 Nov | ✅ Complete |
| 2 | Theory & Fundamentals | 1 Nov – 30 Dec | 🔄 Ongoing |
| 3 | Portfolio Construction | 6 – 30 Nov | ⬜ Upcoming |
| 4 | Professional Profile (CV & LinkedIn) | 20 Oct – 5 Dec | 🔄 Ongoing |
| 5 | Application | 1 – 5 Dec | ⬜ Upcoming |
| 6 | Consolidation & Continued Learning | Dec | ⬜ Upcoming |

## Stack

- **AI agents:** Hermes (planning, documentation, review) + Antigravity (code) + DeepSeek API
- **Deploy:** Netlify (free)
- **Languages:** English · German · French · Spanish
- **Source control:** Git + GitHub

## Portfolio site (under construction)

- Max 5 pages/tabs · dark/light mode · 4-language selector
- Task Tracker Dashboard: Excel → interactive HTML
- Automated contact + basic CV chatbot
- CV download + direct links to LinkedIn and GitHub

## Status

- ✅ Roadmap defined (5 Nov 2026)
- ✅ Dashboard Excel v2 finalized with dynamic formulas and data bars (9 Nov 2026)
- ✅ Task Tracker live on Netlify, reading a Google Sheet through an Apps Script JSON endpoint (9 Nov 2026)
- ✅ Repository restructured (10 Nov 2026): dashboard moved to `/dashboard/`, portfolio entry point and asset tree in place, `AGENTS.md` and the block specs written
- 🔄 Portfolio under construction (Nov 2026)
- 🎯 Application window: 1 – 5 Dec 2026

---

**Links**

- LinkedIn: [Carlos Gutiérrez](https://www.linkedin.com/in/carlos-guti%C3%A9rrez-9200681b7)
- GitHub: [@carlos-gutierrez-hub](https://github.com/carlos-gutierrez-hub)

*This repository is part of my application to the Powercoders Bootcamp.*
