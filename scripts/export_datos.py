# -*- coding: utf-8 -*-
"""Exporta las tareas del Roadmap Tracker v2 a datos.csv (solo LECTURA).

Fuente: hoja "Settings-Roadmap Summary" (tabla maestra X2:AB59: categoria, tarea,
inicio, fin) y hoja "Roadmap Tracker" (casillas TRUE/FALSE por dia) para el avance.
No modifica el Excel ni sus graficos.
"""
import csv
import datetime as dt
from pathlib import Path

import openpyxl

BASE = Path(__file__).resolve().parents[1]
SRC = BASE / "roadmap" / "Roadmap Tracker Powercoders_Bootcamp_Sp_2027_v2.xlsx"
OUT = BASE / "datos.csv"

ST = "Settings-Roadmap Summary"
TR = "Roadmap Tracker"

# columnas de la tabla maestra en Settings
C_CAT, C_TASK, C_START, C_END = 24, 25, 26, 27  # X, Y, Z, AA


def fmt_date(v):
    if isinstance(v, (dt.datetime, dt.date)):
        return v.strftime("%Y-%m-%d")
    if isinstance(v, (int, float)):
        return (dt.date(1899, 12, 30) + dt.timedelta(days=int(v))).strftime("%Y-%m-%d")
    return v or ""


wb = openpyxl.load_workbook(SRC)  # sin data_only: valores literales + booleanos
st = wb[ST]
tr = wb[TR]

# progreso por tarea: filas 8-65 del tracker (B=cat, C=tarea, G..CE=dias)
progress = {}
for r in range(8, 66):
    task = tr.cell(r, 3).value
    if not task:
        continue
    checked = sum(1 for c in range(13, 80) if tr.cell(r, c).value is True)
    planned = sum(1 for c in range(13, 80) if tr.cell(r, c).value in (True, False))
    progress[task] = (checked, planned)

rows = []
for r in range(2, 60):
    cat, task = st.cell(r, C_CAT).value, st.cell(r, C_TASK).value
    if not task:
        continue
    start = fmt_date(st.cell(r, C_START).value)
    end = fmt_date(st.cell(r, C_END).value)
    checked, planned = progress.get(task, (0, 0))
    pct = round(100.0 * checked / planned) if planned else 0
    status = "Completed" if pct >= 100 else ("In progress" if checked else "Planned")
    rows.append([cat or "", task, start, end, status, pct])

with open(OUT, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["categoria", "tarea", "inicio", "fin", "estado", "progreso"])
    w.writerows(rows)

print("OK ->", OUT)
print("filas:", len(rows), "| categorias:", len({r[0] for r in rows}))
