/**
 * Code.gs — read-only JSON endpoint for the roadmap dashboard.
 *
 * Reads the "Tracker" tab of THIS spreadsheet and returns the payload that
 * web/index.html already consumes. Nothing is written; there is no doPost().
 *
 * DEPLOY
 *   1. Extensions → Apps Script (same project as buildTracker.gs) → paste this file.
 *   2. Save. Deploy → New deployment → type "Web app".
 *        Description .......... roadmap json v1
 *        Execute as ........... Me
 *        Who has access ....... Anyone
 *   3. Deploy → Authorise → copy the /exec URL.
 *   4. Test it:  <URL>/exec?pretty=1   → JSON in the browser.
 *   5. Put that URL in ENDPOINT inside web/index.html.
 *
 * After editing this file: Deploy → Manage deployments → edit → New version
 * (the URL stays the same).
 *
 * NOTE: every constant lives inside ROADMAP_JSON, so this file can sit in the
 * same Apps Script project as buildTracker.gs without duplicate declarations.
 */

const ROADMAP_JSON = (function () {
  'use strict';

  const SHEET_NAME    = 'Tracker';
  const META_COLS     = 5;        // A..E = category, task, start, end, description
  const CACHE_SECONDS = 60;       // short cache: the page feels live, Sheets is not hammered
  const DAY_MS        = 86400000;

  /** Display metadata per category. Order here = order in the dashboard. */
  const CATEGORY_META = [
    { name: '1. Discovery / Exploration',             short: 'Discovery',     color: '#EAC435', chart: '#F0CE55' },
    { name: '2. Theory / Fundamentals',               short: 'Theory',        color: '#345995', chart: '#5B7FBF' },
    { name: '3. Web / Portfolio Construction',        short: 'Web',           color: '#03CEA4', chart: '#17DCB4' },
    { name: '4. Professional Profile',                short: 'Profile',       color: '#FB4D3D', chart: '#FF6A5A' },
    { name: '5. Application',                         short: 'Application',   color: '#CA1551', chart: '#E23A72' },
    { name: '6. Consolidation / Continued Learning',  short: 'Consolidation', color: '#F59DBA', chart: '#F8B4CB' }
  ];

  /* ------------------------------------------------------------------ entry */

  function doGet(e) {
    const params = (e && e.parameter) || {};
    const prefix = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(params.prefix || '') ? params.prefix : null;

    let payload;
    try {
      payload = getPayload_();
    } catch (err) {
      // No "categories" key on purpose: the page then falls back to its snapshot
      // instead of rendering an empty dashboard.
      payload = { error: String((err && err.message) || err), updated: new Date().toISOString() };
    }
    return respond_(payload, prefix, params.pretty === '1');
  }

  function respond_(payload, prefix, pretty) {
    const body = JSON.stringify(payload, null, pretty ? 1 : 0);
    if (prefix) {
      return ContentService
        .createTextOutput(prefix + '(' + body + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService
      .createTextOutput(body)
      .setMimeType(ContentService.MimeType.JSON);
  }

  /* --------------------------------------------------------------- caching */

  function getPayload_() {
    const cache = CacheService.getScriptCache();
    const hit = cache.get('roadmap');
    if (hit) return JSON.parse(hit);

    const payload = computePayload_();
    const serialised = JSON.stringify(payload);
    if (serialised.length < 95000) cache.put('roadmap', serialised, CACHE_SECONDS);
    return payload;
  }

  /** Run this from the editor to inspect the payload in the execution log. */
  function logPayload() {
    Logger.log(JSON.stringify(computePayload_(), null, 2));
  }

  /* ------------------------------------------------------------- the maths */

  function computePayload_() {
    const sh = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    if (!sh) throw new Error('Sheet "' + SHEET_NAME + '" not found');

    const lastRow = sh.getLastRow();
    const lastCol = sh.getLastColumn();
    if (lastRow < 2) throw new Error('Sheet "' + SHEET_NAME + '" has no task rows');

    const grid   = sh.getRange(1, 1, lastRow, lastCol).getValues();
    const header = grid[0];

    // Day columns: every header cell right of the metadata that holds a date.
    const dayCols = [];
    for (let c = META_COLS; c < lastCol; c++) {
      if (isDate_(header[c])) dayCols.push(c);
    }
    if (!dayCols.length) {
      throw new Error('No date columns found in row 1 — the day headers must be real dates');
    }

    const horizonStart = dateOnly_(header[dayCols[0]]);
    const horizonEnd   = dateOnly_(header[dayCols[dayCols.length - 1]]);
    const lastDayIdx   = dayDiff_(horizonStart, horizonEnd);
    const dayIndex     = d => dayDiff_(horizonStart, d);

    // Week 0 begins on the Monday of the horizon's first week (the Excel grid).
    const mondayOffset = (horizonStart.getDay() + 6) % 7;          // Monday = 0
    const week0        = new Date(horizonStart.getFullYear(), horizonStart.getMonth(),
                                 horizonStart.getDate() - mondayOffset);
    const weekOf       = i => Math.floor((i + mondayOffset) / 7);
    const weekCount    = weekOf(lastDayIdx) + 1;

    const weeksPlanned = new Array(weekCount).fill(0);
    const weeksChecked = new Array(weekCount).fill(0);

    const buckets = {};
    const order   = [];
    let totalPlanned = 0;
    let totalChecked = 0;
    let taskCount    = 0;

    for (let r = 1; r < lastRow; r++) {
      const row  = grid[r];
      const name = String(row[1] || '').trim();
      if (!name) continue;

      if (!isDate_(row[2]) || !isDate_(row[3])) continue;          // no dates, no days
      const s = Math.max(0, Math.min(lastDayIdx, dayIndex(row[2])));
      const e = Math.max(0, Math.min(lastDayIdx, dayIndex(row[3])));
      const planned = e - s + 1;
      if (planned <= 0) continue;

      let checked = 0;
      for (let i = 0; i < dayCols.length; i++) {
        const c = dayCols[i];
        if (!isTrue_(row[c])) continue;
        const d = dayIndex(header[c]);
        if (d < s || d > e) continue;                              // ignore ticks outside the window
        checked++;
        weeksChecked[weekOf(d)]++;
      }
      for (let d = s; d <= e; d++) weeksPlanned[weekOf(d)]++;

      const catName = String(row[0] || '').trim() || 'Unsorted';
      if (!buckets[catName]) {
        buckets[catName] = { name: catName, checked: 0, planned: 0, tasks: [] };
        order.push(catName);
      }
      buckets[catName].tasks.push({
        name: name,
        start: iso_(row[2]),
        end: iso_(row[3]),
        checked: checked,
        planned: planned
      });
      buckets[catName].checked += checked;
      buckets[catName].planned += planned;
      totalChecked += checked;
      totalPlanned += planned;
      taskCount++;
    }

    if (!taskCount) throw new Error('No task rows with a name and both dates were found');

    // Declared categories first (dashboard order), then anything unexpected.
    const names = [];
    CATEGORY_META.forEach(function (m) { if (buckets[m.name]) names.push(m.name); });
    order.forEach(function (n) { if (names.indexOf(n) === -1) names.push(n); });

    const categories = names.map(function (name, i) {
      const meta   = CATEGORY_META.filter(function (m) { return m.name === name; })[0];
      const bucket = buckets[name];
      return {
        id: i + 1,
        name: name,
        short: meta ? meta.short : name,
        color: meta ? meta.color : '#8A97A6',
        chart: meta ? meta.chart : '#AEBBC9',
        checked: bucket.checked,
        planned: bucket.planned,
        tasks: bucket.tasks
      };
    });

    const weeks = [];
    for (let w = 0; w < weekCount; w++) {
      const d = new Date(week0.getFullYear(), week0.getMonth(), week0.getDate() + w * 7);
      weeks.push({
        label: 'W' + w,
        start: iso_(d),
        planned: weeksPlanned[w],
        checked: weeksChecked[w]
      });
    }

    return {
      updated: new Date().toISOString(),
      source: 'sheet',
      horizon: { start: iso_(horizonStart), end: iso_(horizonEnd) },
      overall: { checked: totalChecked, planned: totalPlanned },
      weeks: weeks,
      categories: categories
    };
  }

  /* --------------------------------------------------------------- helpers */

  function isDate_(v) {
    return Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v.getTime());
  }

  function isTrue_(v) {
    if (v === true) return true;
    if (v === false || v === null || v === '') return false;
    const s = String(v).trim().toLowerCase();
    return s === 'true' || s === 'yes' || s === '1';
  }

  function dateOnly_(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  /* Day arithmetic on UTC parts: on a DST change day "24 h" is not one day,
     so subtracting timestamps would silently shift every header by one. */
  function utcDay_(d) {
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function dayDiff_(from, to) {
    return Math.round((utcDay_(to) - utcDay_(from)) / DAY_MS);
  }

  function iso_(d) {
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }

  return { doGet: doGet, logPayload: logPayload };
})();

/** Apps Script entry point — the only global this file needs. */
function doGet(e) {
  return ROADMAP_JSON.doGet(e);
}

/** Editor helper: run it to print the payload in the execution log. */
function logPayload() {
  return ROADMAP_JSON.logPayload();
}
