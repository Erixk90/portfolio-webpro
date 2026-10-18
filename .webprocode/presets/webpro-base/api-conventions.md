# API / CMS — Reglas WebPro

## Principio central
```
routes → services → db
```
Ninguna ruta HTTP toca la base de datos directamente. Toda la lógica vive en `src/services/*.service.js`.

## Estructura
```
cms/api/src/
  routes/        # valida input, delega al service, responde
  services/      # lógica de dominio + acceso a datos
  lib/db.js      # cliente Prisma + flag hasDB()
prisma/schema.prisma
```

## Contrato de un service
```js
export const xService = {
  async list(opts),
  async get(idOrSlug),
  async create(data),
  async update(id, data),
  async remove(id),
};
```
- Si `hasDB()` es `false`, el service devuelve datos de ejemplo en memoria.
- Nunca lanzar errores crudos de Prisma hacia la ruta: traducir a `null` o error de dominio.

## Endpoints
REST bajo `/api/cms/`:
`products` · `categories` · `pages` · `media` · `services` · `plans` ·
`testimonials` · `faqs` · `site-settings` · `instagram/feed` · `auth/*`

## Validación
- Validar el body en la **ruta** con JSON Schema de Fastify.
- Validar reglas de dominio en el **service** (ej: `whatsappNumber` debe ser E.164 `^\d{8,15}$`).

## Secretos
- Solo en `cms/api/.env` (cargado con `dotenv`).
- **Nunca** llegan al cliente. Ej: `IG_ACCESS_TOKEN` se usa server-side; al front solo va el resultado.
- Verificación en CI: `grep IG_ACCESS_TOKEN apps/storefront/src` debe dar 0.

## Resiliencia
El storefront consume el CMS en **build time**. Si el CMS no responde, el build **no se rompe**: usa el fallback local (`src/lib/site.js`).
