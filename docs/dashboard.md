# Dashboard — from Excel to a live web page

**Live:** https://carlosg-pc-roadmap-dashboard.netlify.app/
**Data:** Google Sheet → Apps Script → JSON → static HTML → Netlify

This document explains how the Task Tracker stopped being a spreadsheet and became a page on the web, and what to touch when something changes. It is the narrative behind the code.

---

## 1. The chain

```
Excel v2 (frozen)          Google Sheet "Tracker"        Apps Script           index.html        Netlify
Roadmap Tracker  ────────► 58 tasks · 1 checkbox  ──────► doGet()   ──────► fetch / JSONP ────► carlosg-pc-…
_v2.xlsx                   per planned day              JSON payload        58 rows · 6 rings   roadmap-dashboard
kept as evidence            = the single source          60 s cache          no build step       auto-deploy on push
```

| Stage | Where it lives | Role |
|---|---|---|
| 1. Excel v2 | `roadmap/Roadmap Tracker Powercoders_Bootcamp_Sp_2027_v2.xlsx` | **Historical evidence.** 58 tasks, 259 checkboxes, 17 charts. No longer edited for daily work |
| 2. Google Sheet | `Tracker` tab of a spreadsheet in Drive | **Master.** The only place where progress is updated: tick the days you worked |
| 3. Apps Script | `apps-script/Code.gs`, deployed as a web app | Read-only JSON endpoint. `doGet()` only — there is no `doPost()` |
| 4. Web page | `web/dashboard/index.html` + `web/dashboard/data/datos.json` | Static HTML/CSS/JS, no framework, no build step. Served at `/dashboard/` |
| 5. Netlify | `netlify.toml` → `publish = "web"` | Serves `web/` as the site root — `/` is the portfolio, `/dashboard/` is this page. Every push to `master` redeploys |

Nothing is duplicated: the Sheet holds the state, the endpoint derives every number, the page only draws.

## 2. Why this chain and not something simpler

- **Not the Excel uploaded to Drive.** Importing the workbook would bring 259 dead form controls and 17 charts that the web does not need, and Drive preview is not a dashboard.
- **Not "Publish to web" + iframe.** That route is a Google-rendered table with ~5 min latency, no control over design and no mobile layout. It would not show a single line of HTML of mine.
- **The Sheet stays the easy part.** Editing data in a spreadsheet is the low-code half; the JSON endpoint is the "real software" half. The pair is the point of the exercise.
- **The page ships before the data source is trustworthy.** If the endpoint fails, the page falls back to the committed snapshot and says so in the badge — `Live`, `Cached` or `Sample data · not connected yet`. It never renders an empty screen.

## 3. The data contract

`Code.gs` returns exactly this shape (and `web/dashboard/data/datos.json` is a snapshot of it):

```json
{
  "updated": "2026-11-09T19:49:12.493Z",
  "source": "sheet",
  "horizon": { "start": "2026-10-25", "end": "2026-12-30" },
  "overall": { "checked": 49, "planned": 259 },
  "weeks": [ { "label": "W0", "start": "2026-10-19", "planned": 2, "checked": 2 } ],
  "categories": [
    { "id": 1, "name": "1. Discovery / Exploration", "short": "Discovery",
      "color": "#EAC435", "chart": "#F0CE55",
      "checked": 35, "planned": 35,
      "tasks": [ { "name": "…", "start": "2026-10-25", "end": "2026-10-27",
                   "checked": 3, "planned": 3 } ] }
  ]
}
```

Planned **task-days** are derived from the dates, never stored: `planned = end − start + 1` in calendar days per task. Because tasks overlap, the sum (259) is larger than the 67 calendar days of the horizon — the same reason `checked` is not "days worked" in the calendar sense. A checkbox only counts if it falls inside the task's window, which is why a stray tick cannot inflate the total.

## 4. Updating the data (the daily loop)

1. Open the Google Sheet → tab `Tracker`.
2. Tick the boxes for the days you actually worked. One column = one calendar day.
3. Done. The endpoint serves the change within 60 seconds (cache); the page picks it up on reload.

No export, no commit, no deploy for data changes. The repo only changes when the *code* or the documentation changes.

**If you change a start or end date**, run `refreshCheckboxes()` in Apps Script afterwards: it rebuilds the tick grid to match the new windows.

**To keep the repo honest**, refresh the snapshot when the numbers matter (a weekly rhythm is enough):

```bash
curl -s "<exec-url>" -o web/dashboard/data/datos.json   # then: git add web/dashboard/data/datos.json && git commit
```

## 5. Endpoints and deployment

```
<exec-url>                     → JSON (what the page consumes)
<exec-url>?pretty=1            → the same, indented, to read in a browser
<exec-url>?prefix=__roadmap    → JSONP wrapper, used by the page to bypass CORS
<exec-url>?debug=1&nocache=1   → adds _debug: what the script actually reads
```

**Deploy (Apps Script):** *Deploy → Manage deployments → edit → Version: New version*. This keeps the same `/exec` URL. Creating a new deployment gives a new URL and the page must be updated.

**Deploy (Netlify):** already wired. Site `carlosg-pc-roadmap-dashboard`, branch `master`, build command empty, publish directory `web`. `netlify.toml` carries the publish directory so a reconnection needs no clicking.

## 6. Files

| File | What it is |
|---|---|
| `web/dashboard/index.html` | The dashboard: one file, no dependencies. `ENDPOINT` at the top points to the endpoint |
| `web/dashboard/data/datos.json` | Committed snapshot, used when the endpoint does not answer |
| `web/index.html` + `web/assets/` | The portfolio itself (root `/`), built in its own blocks — independent of this page |
| `netlify.toml` | `[build] publish = "web"` |
| `apps-script/buildTracker.gs` | One-time migration: builds the `Tracker` tab, 58 tasks, one checkbox per planned day, and verifies the result |
| `apps-script/Code.gs` | The JSON endpoint (read-only), with cache, JSONP and debug mode |
| `scripts/export_datos.py` | Exports the Excel to `datos.csv` (legacy, kept for the diff history) |

## 7. Two bugs worth remembering

Both are documented in detail in the local learning log (`Bitácora Dashboard Web.md`), outside this repository.

**Daylight saving, 25 October 2026.** The grid was built by adding 86 400 000 ms per column. Switzerland switches clocks that day (a 25-hour day), so the second column landed at 23:00 of the first date: one date duplicated, one day missing at the end, and every header one day early. Fix: build dates from calendar parts (`new Date(y, m, d + i)`) and compare with `Date.UTC`; `verifyGrid_()` now reads the grid back and fails loudly instead of writing a grid that looks fine.

**One global scope in Apps Script.** All files in a project share the global namespace, so `const META_COLS` in two files is a redeclaration error — served as an HTTP 200 HTML page, not as a JSON error. Fix: the endpoint is wrapped in an IIFE and exposes only `doGet` and `logPayload`.

## 8. The portfolio site and the contact form

`web/` holds two independent surfaces: the portfolio at `/` (`web/index.html` + `web/assets/`) and this dashboard at `/dashboard/`. The portfolio is a static page with no framework; its conventions live in `AGENTS.md`.

**The form.** `name="contacto-portafolio"`, `method="POST"`, no `action` (it posts to the page itself), `data-netlify="true"` and a hidden `form-name` input that must match the form's name. Fields: `nombre`, `email`, `mensaje`, all `required`. Submissions land in *Netlify → Forms → contacto-portafolio*, where they can be read or exported as CSV.

**Anti-spam.** `netlify-honeypot="bot-field"` plus an input named `bot-field` that humans never see: `.hp-field` in the CSS pushes it off-canvas (not `display:none`, so a bot parsing the markup still finds a plausible field), it is `aria-hidden` and `tabindex="-1"`. Netlify accepts any submission but files as spam the ones where `bot-field` arrived filled.

**Proving that Netlify registered the form.** The only reliable test is a real POST, compared against a control:

```bash
SITE=https://carlosg-pc-roadmap-dashboard.netlify.app

# registered form → 200
curl -s -o /dev/null -w 'real:  %{http_code}\n' -X POST "$SITE/" \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'form-name=contacto-portafolio' \
  --data-urlencode 'nombre=TEST — delete me' \
  --data-urlencode 'email=test@example.com' \
  --data-urlencode 'mensaje=verification'

# unknown form name → 404
curl -s -o /dev/null -w 'control: %{http_code}\n' -X POST "$SITE/" \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'form-name=no-existe-xyz&a=1'
```

Each real POST creates an entry in the dashboard — delete the test row afterwards.

**Detection runs at build time.** A new form, a renamed field or a new `netlify-honeypot` attribute only takes effect on the next deploy. Turning "Form detection" **on** also requires a fresh deploy: existing deploys are not re-scanned, so the form can be live in the HTML and still unknown to Netlify.

## 9. Netlify rewrites the HTML it serves

The file in the repo and the file the browser receives are not the same. To see it:

```bash
curl -s https://carlosg-pc-roadmap-dashboard.netlify.app/ > /tmp/live.html
diff <(sed 's/\r$//' /tmp/live.html) <(git show HEAD:web/index.html | sed 's/\r$//')
```

As of 10 Nov 2026 the served page differs in about a dozen lines, all of them Netlify's doing:

- injects a promotional comment in `<head>` and a `/.netlify/scripts/hud` script before `</body>`;
- rewrites `href="dashboard/index.html"` to `href="/dashboard/"`;
- reorders attributes and switches them to single quotes (minifier);
- **drops `data-netlify="true"` from the `<form>`.**

Two consequences worth remembering:

1. Never judge whether the form is registered by reading the live HTML, and never "fix" the live HTML — the repo file is the source of truth. The POST test in §8 is the proof.
2. To check whether a deploy actually landed, poll for content Netlify does not touch (copy, images, CSS values), not for attributes it rewrites. That is how every deploy in this repo has been verified.
