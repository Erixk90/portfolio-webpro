---
name: webpro-memory-bank-update
description: Sincroniza WebPro Memory (.webprocode/memory-bank) con el código real del proyecto — detecta stack, package manager, CSS y CMS leyendo archivos, compara con technical.md y propone el diff antes de escribir. Use when the user says "actualiza la memoria", "sincroniza el memory-bank", "webpro-memory-bank-update", or after a stack change, a new dependency, onboarding an existing repo, or when project.md/technical.md look stale.
---

# Actualizar WebPro Memory

Mantiene `.webprocode/memory-bank/` fiel a lo que el proyecto **realmente es**,
no a lo que se planeó al inicio.

## Cuándo usarla

- **Onboarding**: primer contacto con un proyecto existente.
- **Cambio de stack**: se cambió de Astro a Next, se agregó el CMS, se migró a Postgres.
- **Dependencias relevantes**: nueva integración (pagos, auth, analytics).
- **Deriva**: `technical.md` describe algo que el código ya no hace.
- Cuando el usuario pide "actualiza la memoria".

**No la uses durante una sesión SDD en curso**: la memoria se actualiza al cerrar
la feature (o al cambiar la arquitectura), no en medio de la implementación.

## Reglas

1. **Leer antes de escribir.** Nunca inventes: si un dato no está en el código, no va.
2. **Proponer el diff primero.** Mostrá `antes → después` y esperá aprobación humana.
3. **No tocar código.** Esta skill solo escribe en `.webprocode/memory-bank/`.
4. **No borrar historia.** Si algo dejó de aplicar, marcalo como histórico en vez de eliminarlo
   (ej: "Postgres (migrado desde SQLite el 2026-09)").
5. **Stack-agnóstica.** Detectá el stack leyendo archivos; jamás asumas Astro o React.

## Procedimiento

### 1. Detectar el stack real

| Evidencia en el repo | Stack |
|---|---|
| `astro.config.mjs` + `astro` en `package.json` | `astro` |
| `next.config.js` / `.mjs` + `next` | `next` |
| `vite.config.js` + `react` | `react` |
| `index.html` con `<script type="module">` y sin bundler | `html-vanilla` |

Detectá también:

- **Package manager**: `pnpm-lock.yaml` → pnpm · `package-lock.json` → npm · `yarn.lock` → yarn
- **Node**: `engines.node` del `package.json`
- **CSS**: ¿hay `tokens.css` + `styles/blocks/*.css`? → confirma `vanilla-bem`
- **CMS**: ¿existe `cms/api/src/server.js`? ¿`hasDB()` en `cms/api/src/lib/db.js` devuelve `!!prisma` (persistente) o `false` (plantilla)?
- **Base de datos**: `provider` en `cms/api/prisma/schema.prisma` (sqlite | postgresql)
- **Rutas de contenido**: `src/lib/site.js`, `scripts/fetch-cms.mjs`, `src/data/cms.json`

### 2. Leer la memoria actual

```
.webprocode/memory-bank/project.md      # negocio, alcance, constraints
.webprocode/memory-bank/technical.md    # stack, arquitectura, convenciones
.webprocode/memory-bank/index.md        # índice de módulos
.webprocode/memory-bank/modules/*.json  # detalle por módulo
.webprocode/config.json                 # stack declarado, dominio, contacto
```

### 3. Comparar y proponer el diff

Presentá **solo lo que cambió**, en formato `antes → después`, agrupado por archivo.
Si `config.json:stack` no coincide con el stack detectado, marcalo como **conflicto**
y preguntá cuál es la verdad antes de escribir.

### 4. Escribir tras aprobación

- `project.md`: negocio, alcance, constraints, métricas. Sin detalles técnicos.
- `technical.md`: stack, arquitectura (`routes → services → db` si hay CMS), convenciones
  (BEM, un `.css` por bloque), workflow (`pnpm dev`, `pnpm build`), decisiones clave.
- `index.md` + `modules/*.json`: agregar/actualizar módulos reales del proyecto.

Cerrá siempre indicando qué archivos escribiste y qué quedó pendiente de confirmar.

## Qué NO hacer

- No documentar features que no existen (evita la "promesa sin sustancia").
- No copiar el `README.md` dentro de la memoria: la memoria es contexto para agentes,
  el README es para humanos.
- No registrar secretos ni valores de `.env` (solo los **nombres** de las variables).
- No reescribir `project.md` si solo cambió la implementación: eso va en `technical.md`.
