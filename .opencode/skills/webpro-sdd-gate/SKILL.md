---
name: webpro-sdd-gate
description: Define como se ejecuta el flujo SDD de WebProCode (spec, plan, code, validate) con sus artefactos en .webprocode/sessions y sus gates humanos. Use when starting a feature, deciding between direct execution and an SDD session, writing spec.md, plan.md, tasks.json or qa-report.md, or when the user mentions SDD, spec, plan, gate, or a feature with logic.
---

# Flujo SDD y sus gates

Reglas del framework para pasar de un pedido a código verificado.

## Primero: ¿hace falta SDD?

| Modo | Cuándo | Flujo |
|---|---|---|
| **Ejecución directa** | Fix chico, refactor acotado, pregunta, cambio de texto/estilo | Delegar a `webprocode-code`. **Sin spec** |
| **Sesión SDD** | Feature con lógica o varios archivos (CMS, formularios, integración, flujo) | `spec → plan → code → validate` **con gates** |
| **Sesión Split** | Épica que no entra en una sesión | Dividir en sub-sesiones con dependencias |

Criterio: si podés describir el resultado en una frase y toca ≤2 archivos → directa.

## Artefactos

Todos en `.webprocode/sessions/{id}/` (id = `YYYY-MM-DD-slug`):

| Artefacto | Lo produce | Contenido |
|---|---|---|
| `spec.md` | `webprocode-spec` | Objetivo · Alcance / Fuera de alcance · Criterios AC-01.. · Edge cases · Supuestos |
| `plan.md` | `webprocode-plan` | Estrategia por stack · componentes impactados · decisiones técnicas · riesgos + mitigación · plan de pruebas |
| `tasks.json` | `webprocode-plan` | Tareas atómicas |
| `qa-report.md` | `webprocode-validate` | AC PASS/FAIL con evidencia · edge cases · conclusión y blockers |

## Gate 1 — el spec

**Un criterio mal escrito arruina todo lo que viene después.** Debe ser medible:

| ❌ | ✅ |
|---|---|
| "muestra las cuotas" | `Dado un producto de $300, cuando elige 3 cuotas, entonces ve $100 por cuota` |
| "el formulario valida" | `Dado un WhatsApp con letras, cuando guarda, entonces la API responde 400 y el admin muestra el error` |
| "se ve bien en mobile" | `Dado un viewport de 375 px, cuando navega, entonces no hay scroll horizontal` |

Cada AC debe poder verificarse **sin ambigüedad** (grep, test, inspección del DOM, comando).
Si no sabés cómo lo verificarías, el criterio todavía no está listo.

**Gate: un humano aprueba el spec antes de planificar.** No se sigue sin aprobación.

## Gate 2 — el plan

`tasks.json` con tareas **atómicas**, no fases:

```json
{
  "id": "T03",
  "title": "Ruta y service de widgets",
  "type": "cms",
  "depends_on": ["T02"],
  "parallel": false,
  "files": ["cms/api/src/services/widget.service.js", "cms/api/src/routes/widgets.js"],
  "acceptance": ["AC-04", "AC-05"],
  "estimate": "3h",
  "done": "GET /api/cms/widgets devuelve 3 items; POST valida el body con JSON Schema"
}
```

`acceptance` enlaza cada tarea con los AC. Si una tarea no cubre ningún AC, sobra.

**Gate: un humano aprueba plan + tasks antes de codear.**

## Gate 3 — code

El agente `webprocode-code` implementa tarea por tarea, respetando `config.json:stack`
y `css: vanilla-bem`. Después de cada tarea: build/test y actualizar `tasks.json`.
Si el build falla → `webprocode-debug` (ver skill `webpro-troubleshooting`).

## Gate 4 — validate

`webprocode-validate` verifica **cada AC con evidencia**, no de memoria.
Produce `qa-report.md` con PASS/FAIL y el comando o archivo que lo demuestra.

**FAIL → vuelve a `code`. Máximo 3 iteraciones.** Si no cierra en 3, se para y se
revisa el spec: probablemente el criterio era ambiguo.

## Reglas transversales

- **Stack-agnóstico**: leer `config.json:stack`. Nunca asumir Astro ni React.
- **No documentar lo que no existe.** Si una feature se postergó, no va al spec como hecha.
- **Los agentes no inventan formato**: los artefactos siguen las plantillas de arriba.
- **Una sesión = un objetivo.** No meter dos features en el mismo spec.
- Al cerrar, la memoria se actualiza con la skill `webpro-memory-bank-update`.
