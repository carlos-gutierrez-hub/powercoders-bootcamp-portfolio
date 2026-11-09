/**
 * buildTracker.gs — one-time migration of the Excel tracker to Google Sheets.
 *
 * HOW TO USE
 *  1. Extensions → Apps Script, replace the whole content of this file.
 *  2. Save (Ctrl+S), then run buildTracker() once and authorise.
 *  3. Check the execution log: it must say "Grid OK ... 67 columns,
 *     25.10.2026 → 30.12.2026". If it throws, do not deploy: send the message.
 *  4. Share the spreadsheet as "Anyone with the link → Viewer".
 *
 * DATES AND DAYLIGHT SAVING
 *  The horizon starts on 25 Oct 2026, the day the clocks change in Switzerland
 *  (that day has 25 hours). Adding 86 400 000 ms per column therefore lands at
 *  23:00 of the day before and duplicates a date, which shortens the grid by
 *  one day and pushes every header out of step.
 *  Here every date is built from calendar parts and, when the script time zone
 *  differs from the spreadsheet time zone, parsed with Utilities in the
 *  spreadsheet's own zone. verifyGrid_() then reads the result back and fails
 *  loudly if the grid is not contiguous.
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

  // --- header row: one column per calendar day ----------------------------
  const head = [['Category', 'Task / Activity', 'Start', 'End', 'Description']];
  for (let d = 0; d < days; d++) head[0].push(sheetDate_(dayAt_(d)));
  sh.getRange(1, 1, 1, head[0].length).setValues(head);
  sh.getRange(1, FIRST_DAY_COL, 1, days).setNumberFormat('dd.mm');

  // --- tasks --------------------------------------------------------------
  const body = TASKS.map(function (t) {
    return [t[0], t[1], sheetDate_(fromIso_(t[2])), sheetDate_(fromIso_(t[3])), ''];
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

  // --- prove it, do not assume it ----------------------------------------
  verifyGrid_(sh, days);
}

/** Rebuilds the checkbox grid after editing start/end dates. */
function refreshCheckboxes() {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEET);
  const days = dayCount_();
  sh.getRange(2, FIRST_DAY_COL, sh.getMaxRows() - 1, days).removeCheckboxes().clearContent();
  addCheckboxes(sh);
  verifyGrid_(sh, days);
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

/* --------------------------------------------------------------- checks */

/** Reads row 1 back and fails if the grid is not one contiguous run of days. */
function verifyGrid_(sh, days) {
  const header = sh.getRange(1, FIRST_DAY_COL, 1, days).getValues()[0];
  const problems = [];
  let previous = null;

  header.forEach(function (cell, i) {
    const d = parseAny_(cell);
    if (!d) { problems.push('column ' + (i + 1) + ' is not a date: ' + cell); return; }
    if (previous) {
      const step = dayDiff_(previous, d);
      if (step === 0) problems.push('duplicated day ' + iso_(d) + ' at column ' + (i + 1));
      if (step > 1) problems.push('gap of ' + (step - 1) + ' day(s) before ' + iso_(d));
      if (step < 0) problems.push('out of order at ' + iso_(d));
    }
    previous = d;
  });

  const first = parseAny_(header[0]);
  const last  = parseAny_(header[header.length - 1]);
  if (first && iso_(first) !== iso_(dayAt_(0))) problems.push('first day is ' + iso_(first) + ', expected ' + iso_(dayAt_(0)));
  if (last && iso_(last) !== iso_(dayAt_(days - 1))) problems.push('last day is ' + iso_(last) + ', expected ' + iso_(dayAt_(days - 1)));
  if (header.length !== days) problems.push('wrote ' + header.length + ' columns, expected ' + days);

  if (problems.length) {
    throw new Error('Grid check failed — re-run buildTracker() before deploying.\n  ' +
      problems.slice(0, 10).join('\n  '));
  }

  Logger.log('Grid OK: ' + pretty_(first) + ' -> ' + pretty_(last) +
             ' - ' + days + ' day columns - ' + TASKS.length + ' tasks');
  return true;
}

/* --------------------------------------------------------------- helpers */
/* Dates are built from calendar parts, never by adding 86400000 ms: on a DST
   change day "24 hours" is not "one day" and the grid silently shifts. */

/** Date for horizon day i (0 = HORIZON_START): local midnight, DST-proof. */
function dayAt_(i) {
  return new Date(HORIZON_START.getFullYear(), HORIZON_START.getMonth(), HORIZON_START.getDate() + i);
}

/** Number of calendar days in the horizon, both ends included. */
function dayCount_() {
  return dayOffset_(HORIZON_END) + 1;
}

/** Calendar days between HORIZON_START and a date (UTC parts, no DST). */
function dayOffset_(date) {
  return dayDiff_(HORIZON_START, date);
}

function dayDiff_(from, to) {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / 86400000);
}

/** 'yyyy-mm-dd' → Date at local midnight, without parsing heuristics. */
function fromIso_(s) {
  const p = String(s).split('-');
  return new Date(+p[0], +p[1] - 1, +p[2]);
}

/**
 * Returns a Date whose wall-clock date, as the SPREADSHEET sees it, is the
 * same calendar day. If the script time zone differs from the spreadsheet
 * one, the value is rebuilt with Utilities in the spreadsheet's zone.
 */
function sheetDate_(d) {
  try {
    const ss = SpreadsheetApp.getActive();
    const sheetTz  = ss.getSpreadsheetTimeZone();
    const scriptTz = Session.getScriptTimeZone();
    if (!sheetTz || !scriptTz || sheetTz === scriptTz) return d;
    const iso = Utilities.formatDate(d, scriptTz, 'yyyy-MM-dd');
    return Utilities.parseDate(iso + ' 00:00:00', sheetTz, 'yyyy-MM-dd HH:mm:ss');
  } catch (e) {
    return d;                                   // no Utilities (tests) or no context
  }
}

/** Reads a header cell as a calendar date, whatever the cell type is. */
function parseAny_(v) {
  if (Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v.getTime())) {
    return new Date(v.getFullYear(), v.getMonth(), v.getDate());
  }
  const s = String(v == null ? '' : v).trim();
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  m = /^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{2,4})$/.exec(s);
  if (m) { let y = +m[3]; if (y < 100) y += 2000; return new Date(y, +m[2] - 1, +m[1]); }
  return null;
}

function iso_(d) {
  const m = d.getMonth() + 1, day = d.getDate();
  return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
}

function pretty_(d) {
  const m = d.getMonth() + 1, day = d.getDate();
  return (day < 10 ? '0' : '') + day + '.' + (m < 10 ? '0' : '') + m + '.' + d.getFullYear();
}
