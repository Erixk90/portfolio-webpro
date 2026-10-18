---
name: webpro-deploy-check
description: Verificacion antes y despues de publicar un sitio WebProCode (landing estatica y CMS), con los tres caminos de deploy y el checklist de secretos y datos reales. Use when deploying, going live, publishing to Vercel, Netlify, Render, Railway or Docker, or when the user mentions deploy, produccion, subir, or publicar.
---

# Deploy: chequeo previo y posterior

Son **dos piezas** que se despliegan por separado:

```
LANDING (estática)  ──build-time──►  CMS API + Admin
Vercel / Netlify                     Render / Railway / Docker + Postgres
```

## Pre-flight (sin esto, no se publica)

| # | Chequeo | Cómo |
|---|---|---|
| 1 | **WhatsApp real** (no `0000000000`) | `Select-String -Path apps\storefront\src\lib\site.js -Pattern 'whatsappNumber'` |
| 2 | **`.env` reales** (no dummy) | Revisar `cms/api/.env` y `apps/storefront/.env` |
| 3 | **`hasDB` correcto** | `!!prisma` si hay CMS en prod |
| 4 | **Provider Postgres** para prod | `pnpm --filter webpro-cms-api db:use-postgres` |
| 5 | **Ningún secreto en el sitio** | `Select-String -Path apps\storefront\src -Pattern 'TOKEN\|SECRET\|PASSWORD'` → 0 |
| 6 | **Nada sensible versionado** | `git ls-files` no debe listar `.env` ni `*.db` |
| 7 | **Contenido real** | Video/poster/fotos/textos definitivos (no placeholders) |
| 8 | **Presupuesto de perf** | Ver skill `webpro-static-perf-budget` |
| 9 | **Analytics** configurado | El evento `whatsapp_click` debe llegar a algún lado |

## Camino A — Landing estática (Vercel o Netlify)

El storefront es estático: lee el CMS **en build time**. Si el CMS no responde, usa
`site.js` y **no rompe** — pero el contenido queda viejo.

Si el proyecto no trae el archivo de deploy, creálo en la raíz:

`vercel.json`
```json
{
  "buildCommand": "pnpm --filter <proyecto>-storefront build",
  "outputDirectory": "apps/storefront/dist",
  "installCommand": "pnpm install"
}
```

`netlify.toml`
```toml
[build]
  command = "pnpm --filter <proyecto>-storefront build"
  publish = "apps/storefront/dist"
```

Variable de entorno obligatoria en la plataforma: **`WEBPRO_CMS_URL`** apuntando al CMS
desplegado (se usa en el build, no es secreto).

## Camino B — CMS (Render / Railway / Docker)

1. `pnpm --filter webpro-cms-api db:use-postgres`
2. Crear la base Postgres y setear **`DATABASE_URL`** en la plataforma
3. Build command: `pnpm install && pnpm --filter webpro-cms-api db:push`
4. Start: `pnpm --filter webpro-cms-api start`
5. Health check: `/api/cms/health`
6. Datos iniciales, **una sola vez**: `pnpm --filter webpro-cms-api seed`
7. Variables: `PORT`, `DATABASE_URL`, `IG_ACCESS_TOKEN`, `IG_USER_ID`, `IG_HANDLE`

El admin queda en `https://<cms>/cms/admin/`.

## Camino C — Todo en un VPS (Docker)

```bash
pnpm --filter webpro-cms-api db:use-postgres
cp .env.example .env      # completar DATABASE_URL, IG_*
docker compose up -d --build
docker compose exec cms pnpm --filter webpro-cms-api seed
```

Poner un reverse proxy (Caddy/Nginx) delante para HTTPS.

## El sitio es estático: necesita rebuild

Editar contenido en el panel **no** cambia el sitio publicado hasta el próximo build.
Para clientes que editan seguido, configurar un **Deploy Hook** (Vercel/Netlify) y
dispararlo al publicar. Si editan poco, rebuild manual alcanza.

## Verificación post-deploy

- [ ] La landing carga y se ve **con datos reales**
- [ ] `/api/cms/health` responde `{"ok":true}`
- [ ] `/cms/admin/` abre y permite guardar
- [ ] Un clic en el CTA abre WhatsApp con el **número real** y el mensaje correcto
- [ ] Ningún `IG_ACCESS_TOKEN` en el código fuente de la página (ver → "ver código fuente")
- [ ] HTTPS activo y el dominio resuelve
- [ ] Si algo sale mal, se puede volver atrás (rollback en la plataforma o redeploy del commit anterior)

## Después

Registrar el dominio y las decisiones de deploy en `technical.md` con la skill
`webpro-memory-bank-update`, para que el próximo deploy no empiece de cero.
