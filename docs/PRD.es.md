# PRD — Portafolio Personal Powercoders

**Idioma:** 🇪🇸 Español · 🇬🇧 [English](PRD.md)

> Documento original (fuente de verdad). La versión en inglés vive en [PRD.md](PRD.md);
> si alguna vez discrepan, manda esta.

**Versión:** 1.0 · **Fecha:** 6 nov 2026 · **Autor:** Carlos Gutiérrez (tech-lead, con Hermes)

---

## 1. Propósito (el "porqué")

Crear un sitio web de portafolio desplegado en Netlify que sirva como carta de presentación para la aplicación al Bootcamp de Powercoders (Spring 2027). El objetivo **no es solo mostrar un producto final**, sino demostrar capacidad de organización, metodología de trabajo y orquestación de herramientas de IA para resolver un problema real: la gestión de tareas y hábitos.

## 2. Usuario objetivo y recorrido

**Usuario:** reclutadores de Powercoders (y reclutadores suizos en general). Tiempo de revisión: 30–60 segundos.

**Recorrido deseado:**
1. Abre el sitio → ve una interfaz limpia y profesional.
2. Lee "Sobre mí" → entiende la historia (ingeniero industrial, Nicaragua → Zúrich, transición a software).
3. Abre el **Task Tracker Dashboard** → ve la evolución Excel → web interactiva.
4. Descarga el CV en PDF y/o usa el formulario de contacto.

## 3. Características (MVP — Fase 1)

1. **5 pestañas de navegación:** Home · Sobre mí · Task Tracker Dashboard · Proyectos · Contacto.
2. **Modo oscuro/claro** (selector dark/light).
3. **Selector de idiomas** (EN · ES · FR · DE), contenido completo en los cuatro.
4. **Task Tracker Dashboard interactivo** — migración del Excel a HTML/CSS/JS.
5. **Sección "La evolución del Dashboard"** — narrativa del proceso Excel → web, con capturas y el diff en GitHub.
6. **Formulario de contacto** (Netlify Forms) + **descarga de CV en PDF** + enlaces a LinkedIn/GitHub.

## 4. No-objetivos (fuera del MVP)

- Chatbot / asistente (Fase 2).
- Backend o serverless (solo si es viable, Fase 2).
- Filtros/búsqueda avanzados en el dashboard (Fase 2).

## 5. Criterios de éxito

- Desplegado en Netlify con **URL pública antes del 1 dic 2026**.
- Los 4 idiomas completos y sin errores.
- Dashboard funcional mostrando **datos reales** del Excel.
- README en GitHub que documenta el proceso (8 pasos resumidos).
- Todo el historial de la evolución visible vía commits (`.xlsx` + `datos.csv`).

## 6. Método

**AI-assisted / low-code.** Carlos actúa como tech-lead/arquitecto; Antigravity escribe el código; Hermes planifica, redacta contenido y revisa. Enfoque en **entender los fundamentos** (HTML, CSS, JS, Git) más que memorizar sintaxis.

## 7. Hitos críticos

| Fecha | Hito |
|---|---|
| 8 nov | CV + LinkedIn actualizados |
| 22 nov | Task Tracker Dashboard funcional |
| 29 nov | MVP completo en 4 idiomas |
| 30 nov | Desplegado en Netlify |
| 1–5 dic | **Aplicar a Powercoders** |
