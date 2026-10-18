---
name: webpro-cms-service
description: Agrega un content type al CMS WebPro de punta a punta (modelo Prisma, service con modo plantilla, ruta con validacion, seed y consumo desde el storefront con fallback). Use when adding or changing CMS data (a new content type, fields, endpoints), when the user mentions CMS, service, route, Prisma, seed, or content that editors should manage.
---

# Agregar un content type al CMS

Arquitectura innegociable: **`routes → services → db`**. Ninguna ruta toca la base
de datos directamente. Siempre.

```
cms/api/
├── prisma/schema.prisma        # 1. modelo
├── src/lib/db.js               # hasDB() → false (plantilla) | !!prisma (persistente)
├── src/services/x.service.js   # 2. lógica + acceso a datos + datos de ejemplo
├── src/routes/x.js             # 3. HTTP + validación (delega al service)
├── src/server.js               # 4. registrar la ruta
├── seed.js                     # 5. cargar datos de ejemplo en la DB
└── admin/                      # 6. panel editable (vanilla BEM)
```

## 1. Modelo Prisma

En `cms/api/prisma/schema.prisma`. Campos en `camelCase`, `id` con `@default(cuid())`,
`status` con `@default("published")` si es publicable, y `order` para ordenar.

```prisma
model Widget {
  id        String   @id @default(cuid())
  slug      String   @unique
  title     String
  order     Int      @default(0)
  status    String   @default("published")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Aplicar: `pnpm db:push` (dev SQLite) · para producción: `pnpm --filter webpro-cms-api db:use-postgres`.

## 2. Service

Dos cosas obligatorias: **datos de ejemplo exportados** y el service con fallback.

```js
import { hasDB, db } from '../lib/db.js';

// Fuente única de los datos de ejemplo: la usa el modo plantilla Y seed.js
export const sampleWidgets = [ /* … */ ];

let mock = [...sampleWidgets];

export const widgetService = {
  async list({ status = 'published' } = {}) {
    if (hasDB()) return db.widget.findMany({ where: { ...(status && { status }) }, orderBy: { order: 'asc' } });
    let r = mock;
    if (status) r = r.filter((w) => w.status === status);
    return [...r].sort((a, b) => a.order - b.order);
  },
  async getBySlug(slug) { /* hasDB() ? db.widget.findUnique({ where: { slug } }) : mock.find(...) */ },
  async create(data) { /* … */ },
  async update(slug, data) { /* devolver null si no existe */ },
  async remove(slug) { /* … */ },
};
```

Exportar `sample*` evita duplicar: `seed.js` lo reutiliza.

## 3. Ruta

Validar el body con JSON Schema de Fastify. La ruta **solo** valida, delega y responde.

```js
app.get('/api/cms/widgets', async (req) => widgetService.list({ status: req.query.status }));
app.post('/api/cms/widgets', {
  schema: { body: { type: 'object', required: ['slug', 'title'], properties: { slug: { type: 'string' }, title: { type: 'string' } } } }
}, async (req, reply) => reply.code(201).send(await widgetService.create(req.body)));
```

Reglas de dominio van en el **service**, no en la ruta (ej: `whatsappNumber` debe cumplir `^\d{8,15}$`).

## 4. Registrar

`cms/api/src/server.js`: importar y `await app.register(widgetRoutes)`.

## 5. Seed

`cms/api/seed.js`: importar el `sample*` y hacer upsert. Correr `pnpm db:seed`.

## 6. Admin

En `cms/admin/`: pestaña + render + CRUD (`js/api.js` para fetch, `js/admin.js` para la vista).
Vanilla BEM, sin frameworks. Si el admin muestra `IMG` gris, falta la imagen, no el render.

## 7. Consumir desde el storefront

| Stack | Cuándo lee el CMS |
|---|---|
| `astro` / `next` | **build time** vía snapshot (`scripts/fetch-cms.mjs` → `src/data/cms.json`) |
| `react` / `html-vanilla` | **runtime** en el navegador (`loadContent()`) |

**Nunca** hacer `fetch` dentro del proceso de build de Astro/Next: rompe en Node ≥24
sobre Windows. Usar el snapshot. Ver la skill `webpro-troubleshooting`.

Si el CMS no responde, el sitio **usa `site.js` y no se rompe**. Todo consumo nuevo
debe mantener ese fallback.

## Checklist de cierre

- [ ] `pnpm db:push` corre sin error y `pnpm db:seed` carga los datos
- [ ] `GET /api/cms/<recurso>` devuelve los datos
- [ ] El endpoint responde igual con el CMS en modo plantilla (`hasDB=false`)
- [ ] El admin permite crear/editar/borrar
- [ ] El storefront muestra los datos y **sigue funcionando con el CMS apagado**
- [ ] Ningún secreto llega al cliente: `Select-String -Path apps/storefront/src -Pattern 'TOKEN|SECRET|API_KEY'` → 0
