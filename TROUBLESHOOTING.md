# Troubleshooting

Technical problems found while building the **Task Tracker Dashboard** (Roadmap Tracker, Excel → web) and how each one was fixed. Entries are added in the order they appeared.

---

## Excel — Sparklines (mini-charts) not refreshing

**Date:** 9 Nov 2026
**Where:** `roadmap/Roadmap Tracker Powercoders_Bootcamp_Sp_2027_v2.xlsx` → sheet *Roadmap Tracker* (sparklines above the day grid)

**Symptom**
The in-cell sparklines (mini-charts) kept showing stale or blank values after the task dates were reassigned or the day checkboxes were ticked. The underlying formula produced the right percentage, but the mini-chart did not repaint: the drawing stayed pinned to its previous cached result.

**Cause**
A sparkline is a cached drawing tied to the cell that hosts it. Excel only rebuilds that cache when the cell is actually recalculated. Two situations break it:

1. The workbook is left in **manual calculation** mode, so nothing on the sheet is recalculated after an edit.
2. The formula is **not volatile** and its inputs look unchanged to Excel from one edit to the next, so the cell is never marked as dirty and the sparkline keeps the old render.

**Fix**

1. **Force the recalculation with `F2` + `Enter`** on the cell that feeds the sparkline. Re-entering the formula marks the cell as dirty, recalculates it and rebuilds the sparkline cache. This confirmed the formula itself was correct and the problem was purely a cached render.
2. **Make the formula volatile by referencing `TODAY()`**, so Excel recalculates it on every change in the workbook and the mini-charts update dynamically instead of waiting for a manual refresh. Keeping the original result and adding zero through the volatile function is enough, e.g.:

```excel
=IF($I$7="",0,IFERROR(COUNTIF(I$8:I$65,TRUE)/(COUNTIF(I$8:I$65,TRUE)+COUNTIF(I$8:I$65,FALSE)),0)) + 0*TODAY()
```

The `+ 0*TODAY()` term never changes the value (it adds zero) but marks the cell as volatile, which is what keeps the sparklines alive while the roadmap is being edited day by day.

**Result**
The sparklines now repaint on every checkbox tick or date change, in the same way as the per-week doughnut charts they sit above.

**Lesson**
When a sparkline does not move, check the *calculation mode* and the *volatility* of its host formula before touching the chart itself — the drawing is almost never the problem, the cached calculation is.
