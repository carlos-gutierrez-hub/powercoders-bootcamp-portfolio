# PRD — Personal Portfolio for Powercoders

**Language:** 🇬🇧 English · 🇪🇸 [Español](PRD.es.md)

**Version:** 1.0 · **Date:** 6 Nov 2026 · **Author:** Carlos Gutiérrez (tech lead, with Hermes)

> This is the English rendering of the original Spanish PRD, which remains the source of
> truth and is kept verbatim in [PRD.es.md](PRD.es.md). If the two ever disagree, the
> Spanish version wins.

---

## 1. Purpose (the "why")

Build a portfolio website deployed on Netlify that serves as my introduction for the Powercoders Bootcamp application (Spring 2027). The goal is **not only to show a finished product**, but to demonstrate organisational ability, working methodology and orchestration of AI tools to solve a real problem: managing tasks and habits.

## 2. Target user and journey

**User:** Powercoders recruiters (and Swiss recruiters in general). Review time: 30–60 seconds.

**Desired journey:**

1. Opens the site → sees a clean, professional interface.
2. Reads "About me" → understands the story (industrial engineer, Nicaragua → Zurich, transition into software).
3. Opens the **Task Tracker Dashboard** → sees the evolution from Excel → interactive web.
4. Downloads the CV as PDF and/or uses the contact form.

## 3. Features (MVP — Phase 1)

1. **5 navigation tabs:** Home · About me · Task Tracker Dashboard · Projects · Contact.
2. **Dark/light mode** (dark/light switch).
3. **Language selector** (EN · ES · FR · DE), full content in all four.
4. **Interactive Task Tracker Dashboard** — migration of the Excel workbook to HTML/CSS/JS.
5. **"The Evolution of the Dashboard" section** — the story of the Excel → web process, with screenshots and the diff on GitHub.
6. **Contact form** (Netlify Forms) + **CV download as PDF** + LinkedIn/GitHub links.

## 4. Non-goals (outside the MVP)

- Chatbot / assistant (Phase 2).
- Backend or serverless (only if viable, Phase 2).
- Advanced filters/search in the dashboard (Phase 2).

## 5. Success criteria

- Deployed on Netlify with a **public URL before 1 Dec 2026**.
- All 4 languages complete and error-free.
- A working dashboard showing **real data** from the Excel workbook.
- A GitHub README that documents the process (8 summarised steps).
- The entire evolution history visible through commits (`.xlsx` + `datos.csv`).

## 6. Method

**AI-assisted / low-code.** Carlos acts as tech lead/architect; Antigravity writes the code; Hermes plans, writes content and reviews. The focus is on **understanding the fundamentals** (HTML, CSS, JS, Git) rather than memorising syntax.

## 7. Critical milestones

| Date | Milestone |
|---|---|
| 8 Nov | CV + LinkedIn updated |
| 22 Nov | Task Tracker Dashboard functional |
| 29 Nov | MVP complete in 4 languages |
| 30 Nov | Deployed on Netlify |
| 1–5 Dec | **Apply to Powercoders** |
