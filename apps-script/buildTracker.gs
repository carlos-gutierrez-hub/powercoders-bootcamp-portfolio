/**
 * buildTracker.gs — one-time migration of the Excel tracker to Google Sheets.
 *
 * HOW TO USE
 *  1. Create a new spreadsheet in Google Drive ("Roadmap Tracker · web").
 *  2. Extensions → Apps Script, delete the placeholder and paste this whole file.
 *  3. Save (Ctrl+S) and run buildTracker() once; authorise when asked.
 *  4. Back in the spreadsheet: the "Tracker" tab is ready with one checkbox per
 *     planned day. Share it as "Anyone with the link → Viewer".
 *
 * Code.gs (the JSON endpoint) reads this sheet; nothing else is stored here.
 * If you change start/end dates, run refreshCheckboxes() to rebuild the grid.
 */

const SHEET = 'Tracker';
const HORIZON_START = new Date(2026, 9, 25);   // 25 Oct 2026
const HORIZON_END   = new Date(2026, 11, 30);  // 30 Dec 2026
const META_COLS = 5;                            // A..E
const FIRST_DAY_COL = META_COLS + 1;            // F

const CATEGORIES = [
  ["1. Discovery / Exploration", "Discovery", "#EAC435"],
  ["2. Theory / Fundamentals", "Theory", "#345995"],
  ["3. Web / Portfolio Construction", "Web", "#03CEA4"],
  ["4. Professional Profile", "Profile", "#FB4D3D"],
  ["5. Application", "Application", "#CA1551"],
  ["6. Consolidation / Continued Learning", "Consolidation", "#F59DBA"],
];

const TASKS = [
  ["1. Discovery / Exploration", "Explore Powercoders and define scope", "2026-10-25", "2026-10-27"],
  ["1. Discovery / Exploration", "Install and configure tools", "2026-10-25", "2026-11-05"],
  ["1. Discovery / Exploration", "Define initial Portfolio architecture", "2026-10-28", "2026-10-30"],
  ["1. Discovery / Exploration", "Explore AI / No-Code / Low-Code tools", "2026-10-28", "2026-11-05"],
  ["1. Discovery / Exploration", "Define Master Roadmap", "2026-11-01", "2026-11-05"],
  ["1. Discovery / Exploration", "Create initial project README", "2026-11-05", "2026-11-05"],
  ["1. Discovery / Exploration", "Upload Excel Roadmap + README to GitHub", "2026-11-05", "2026-11-05"],
  ["1. Discovery / Exploration", "Review and delimit current CV", "2026-11-06", "2026-11-06"],
  ["2. Theory / Fundamentals", "PRD — Product Requirements Document", "2026-11-06", "2026-11-07"],
  ["2. Theory / Fundamentals", "User Story Mapping", "2026-11-09", "2026-11-10"],
  ["2. Theory / Fundamentals", "HTML Fundamentals", "2026-11-09", "2026-11-11"],
  ["2. Theory / Fundamentals", "Software Engineer Thinking / Problem Solving", "2026-11-11", "2026-11-12"],
  ["2. Theory / Fundamentals", "Git / GitHub Fundamentals", "2026-11-12", "2026-11-13"],
  ["2. Theory / Fundamentals", "Technical Vocabulary / Terminology", "2026-11-12", "2026-11-30"],
  ["2. Theory / Fundamentals", "File Types & Formats", "2026-11-14", "2026-11-15"],
  ["2. Theory / Fundamentals", "CSS Fundamentals", "2026-11-15", "2026-11-18"],
  ["2. Theory / Fundamentals", "Process Mapping", "2026-11-16", "2026-11-17"],
  ["2. Theory / Fundamentals", "Data Mapping / ERD", "2026-11-18", "2026-11-19"],
  ["2. Theory / Fundamentals", "Solution Architecture", "2026-11-19", "2026-11-20"],
  ["2. Theory / Fundamentals", "JavaScript Fundamentals", "2026-11-19", "2026-11-23"],
  ["2. Theory / Fundamentals", "Automation Tools", "2026-11-22", "2026-11-24"],
  ["2. Theory / Fundamentals", "Python Fundamentals", "2026-11-24", "2026-11-26"],
  ["2. Theory / Fundamentals", "Workflows / Git / CI/CD / Build Concepts", "2026-11-26", "2026-11-28"],
  ["3. Web / Portfolio Construction", "Export roadmap data to CSV + document evolution", "2026-11-08", "2026-11-08"],
  ["3. Web / Portfolio Construction", "Hacer los últimos ajustes al documento Roadmap Tracker v2", "2026-11-08", "2026-11-08"],
  ["3. Web / Portfolio Construction", "Subir o dejar evidencia en GitHub los últimos ajustes al documento Roadmap Tracker v2", "2026-11-08", "2026-11-08"],
  ["3. Web / Portfolio Construction", "Dashboard Evolution: From Excel to Automated Web App", "2026-11-09", "2026-11-09"],
  ["3. Web / Portfolio Construction", "Define final Portfolio concept", "2026-11-06", "2026-11-08"],
  ["3. Web / Portfolio Construction", "Define maximum five tabs/pages", "2026-11-06", "2026-11-08"],
  ["3. Web / Portfolio Construction", "Design initial UX/UI", "2026-11-10", "2026-11-12"],
  ["3. Web / Portfolio Construction", "Dark / Light Mode", "2026-11-13", "2026-11-14"],
  ["3. Web / Portfolio Construction", "Frontend implementation", "2026-11-13", "2026-11-22"],
  ["3. Web / Portfolio Construction", "Prepare portfolio content", "2026-11-15", "2026-11-20"],
  ["3. Web / Portfolio Construction", "Automated Contact Section", "2026-11-21", "2026-11-22"],
  ["3. Web / Portfolio Construction", "CV / LinkedIn / GitHub Integration", "2026-11-22", "2026-11-23"],
  ["3. Web / Portfolio Construction", "Multilingual Support", "2026-11-24", "2026-11-26"],
  ["3. Web / Portfolio Construction", "Basic AI Chatbot", "2026-11-26", "2026-11-28"],
  ["3. Web / Portfolio Construction", "Backend / Services", "2026-11-25", "2026-11-28"],
  ["3. Web / Portfolio Construction", "Testing & Quality Review", "2026-11-28", "2026-11-30"],
  ["3. Web / Portfolio Construction", "Final Documentation", "2026-11-29", "2026-11-30"],
  ["3. Web / Portfolio Construction", "Deployment", "2026-11-30", "2026-11-30"],
  ["4. Professional Profile", "GitHub Portfolio Organisation", "2026-11-05", "2026-11-30"],
  ["4. Professional Profile", "CV — Initial St. Gallen Alignment", "2026-11-06", "2026-11-06"],
  ["4. Professional Profile", "LinkedIn — Initial Alignment with CV", "2026-11-06", "2026-11-06"],
  ["4. Professional Profile", "Learning Evidence Collection", "2026-11-06", "2026-11-30"],
  ["4. Professional Profile", "CV — Final Refinement", "2026-11-25", "2026-11-27"],
  ["4. Professional Profile", "LinkedIn — Final Refinement", "2026-11-27", "2026-11-28"],
  ["5. Application", "Verify Application Requirements", "2026-11-10", "2026-11-11"],
  ["5. Application", "Prepare Online Application Answers", "2026-11-20", "2026-11-24"],
  ["5. Application", "Prepare Powercoders Application", "2026-11-25", "2026-11-28"],
  ["5. Application", "Interview Preparation — English", "2026-11-26", "2026-11-30"],
  ["5. Application", "Final Application Review", "2026-12-01", "2026-12-03"],
  ["5. Application", "Submit Powercoders Application", "2026-12-04", "2026-12-05"],
  ["6. Consolidation / Continued Learning", "Consolidate Fundamentals", "2026-12-06", "2026-12-20"],
  ["6. Consolidation / Continued Learning", "Portfolio Review", "2026-12-07", "2026-12-12"],
  ["6. Consolidation / Continued Learning", "GitHub Review", "2026-12-13", "2026-12-18"],
  ["6. Consolidation / Continued Learning", "Technical Review", "2026-12-19", "2026-12-24"],
  ["6. Consolidation / Continued Learning", "Roadmap Evaluation", "2026-12-26", "2026-12-30"],
];

function buildTracker() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) sh = ss.insertSheet(SHEET);
  sh.clear();

  const days = dayCount_();

  // --- header row ---------------------------------------------------------
  const head = [['Category', 'Task / Activity', 'Start', 'End', 'Description']];
  for (let d = 0; d < days; d++) head[0].push(dayAt_(d));
  sh.getRange(1, 1, 1, head[0].length).setValues(head);
  sh.getRange(1, FIRST_DAY_COL, 1, days).setNumberFormat('dd.mm');

  // --- tasks --------------------------------------------------------------
  const body = TASKS.map(function (t) {
    return [t[0], t[1], new Date(t[2] + 'T00:00:00'), new Date(t[3] + 'T00:00:00'), ''];
  });
  sh.getRange(2, 1, body.length, META_COLS).setValues(body);
  sh.getRange(2, 3, body.length, 2).setNumberFormat('dd.mm.yyyy');

  // --- one checkbox per planned day --------------------------------------
  addCheckboxes(sh);

  // --- look and feel ------------------------------------------------------
  sh.setFrozenRows(1);
  sh.setFrozenColumns(2);
  sh.getRange(1, 1, 1, META_COLS + days)
    .setFontWeight('bold').setBackground('#1F4E78').setFontColor('#FFFFFF');
  sh.getRange(1, FIRST_DAY_COL, 1, days).setTextRotation(90).setFontSize(8);
  sh.getRange(2, 1, TASKS.length, META_COLS).setFontSize(9);
  sh.getRange(2, 3, TASKS.length, 2).setHorizontalAlignment('center');

  CATEGORIES.forEach(function (cat) {
    const idx = [];
    TASKS.forEach(function (t, i) { if (t[0] === cat[0]) idx.push(i + 2); });
    if (idx.length) sh.getRange(idx[0], 1, idx.length, 1).setBackground(cat[2]).setFontColor('#0B0E13');
  });

  sh.setColumnWidth(1, 150);
  sh.setColumnWidth(2, 280);
  sh.setColumnWidths(3, 2, 80);
  sh.setColumnWidths(FIRST_DAY_COL, days, 22);
}

/** Rebuilds the checkbox grid after editing start/end dates. */
function refreshCheckboxes() {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEET);
  const days = dayCount_();
  sh.getRange(2, FIRST_DAY_COL, sh.getMaxRows() - 1, days).removeCheckboxes().clearContent();
  addCheckboxes(sh);
}

function addCheckboxes(sh) {
  const vals = sh.getRange(2, 3, TASKS.length, 2).getValues();
  vals.forEach(function (row, i) {
    const c1 = FIRST_DAY_COL + dayOffset_(row[0]);
    const c2 = FIRST_DAY_COL + dayOffset_(row[1]);
    if (c2 < c1) return;
    const rng = sh.getRange(2 + i, c1, 1, c2 - c1 + 1);
    if (typeof rng.insertCheckboxes === 'function') rng.insertCheckboxes();
    else rng.setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
  });
}

/* --------------------------------------------------------------- helpers */
/* Dates are built from calendar parts, never by adding 86400000 ms:
   on a DST change day a "24 h" jump lands at 23:00 of the previous date and
   silently shifts every header by one day. */

/** Date object for horizon day i (0 = HORIZON_START), DST-proof. */
function dayAt_(i) {
  return new Date(HORIZON_START.getFullYear(), HORIZON_START.getMonth(), HORIZON_START.getDate() + i);
}

/** Number of days in the horizon, counting calendar days. */
function dayCount_() {
  return dayOffset_(HORIZON_END) + 1;
}

/** Days between HORIZON_START and a date, DST-proof. */
function dayOffset_(date) {
  const a = Date.UTC(HORIZON_START.getFullYear(), HORIZON_START.getMonth(), HORIZON_START.getDate());
  const b = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((b - a) / 86400000);
}
