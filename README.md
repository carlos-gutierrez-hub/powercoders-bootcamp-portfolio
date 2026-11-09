# Powercoders Bootcamp — Portfolio & Preparation Roadmap

Welcome to my application portfolio for the **Powercoders Bootcamp (Spring 2027)**.

I am an Industrial Engineer transitioning into software development, focused on process digitalisation, automation and AI-assisted no-code / low-code solutions. This repository documents my preparation journey and hosts the web portfolio that showcases it.

## What you'll find here

- **`roadmap/`** — my preparation roadmap and task tracker: from the original Excel dashboard to its evolution into an interactive web version (the core evidence of this project).
- The **AI-assisted web portfolio** (in progress) demonstrating the methodology, organisation and problem-solving I will bring to the Bootcamp.

## The project

**Goal:** build a clean, functional, multilingual portfolio site entirely assisted by AI agents — no hand-written code — and document the process as proof of analytical and organisational ability.

**Approach:** I act as the "tech lead". I define requirements, architecture and the quality bar, while AI agents (Hermes + DeepSeek API + Antigravity) write the code and explain it to me. This mirrors exactly what Powercoders teaches: AI-assisted automation, no-code / low-code, and process thinking.

**The evidence:** the "Task Tracker" began as a spreadsheet and will become an interactive dashboard. That evolution — Excel → HTML — is the proof of my methodology.

## Dashboard data — Excel → CSV

The Task Tracker data lives in the Roadmap Tracker workbook (58 tasks across 6 categories, 25 Oct – 30 Dec). Because `.xlsx` is binary, GitHub only shows it as "modified" without a readable diff. To make the **evolution of the data visible line-by-line**, the tasks are exported to a text file:

- **`datos.csv`** — the 58 roadmap tasks (category, start/end date, status, progress), extracted from the Excel.
- **`scripts/export_datos.py`** — read-only exporter (never modifies the Excel or its 17 charts).

**Workflow (after each edit to the Excel):**

1. Edit and save `roadmap/Roadmap Tracker Powercoders_Bootcamp_Sp_2027_v2.xlsx`.
2. Run `python scripts/export_datos.py` (regenerates `datos.csv`).
3. Commit both files — GitHub diffs `datos.csv` line by line (red = removed, green = added).

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
- 🔄 Portfolio under construction (Nov 2026)
- 🎯 Application window: 1 – 5 Dec 2026

---

**Links**

- LinkedIn: [Carlos Gutiérrez](https://www.linkedin.com/in/carlos-guti%C3%A9rrez-9200681b7)
- GitHub: [@carlos-gutierrez-hub](https://github.com/carlos-gutierrez-hub)

*This repository is part of my application to the Powercoders Bootcamp.*
