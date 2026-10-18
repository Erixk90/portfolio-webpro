# Deploy — WebPro

Son **dos piezas** que se despliegan por separado (si usás CMS):

```
SITIO (estático)  ──build-time──►  CMS API + Admin
Vercel / Netlify                   Render / Railway / Docker + Postgres
```

Sin CMS, solo desplegás el sitio: es 100% estático.

---

## 1. Antes de publicar (pre-flight)

| # | Chequeo |
|---|---|
| 1 | **WhatsApp real** (no el `0000000000` de la plantilla) en `apps/storefront/src/lib/site.js` |
| 2 | **`.env` reales** en `cms/api/.env` y `apps/storefront/.env` |
| 3 | **Provider Postgres** si vas a producción: `pnpm --filter webpro-cms-api db:use-postgres` |
| 4 | **Ningún secreto en el sitio**: `Select-String -Path apps\storefront\src -Pattern 'TOKEN\|SECRET\|PASSWORD'` → 0 |
| 5 | **Contenido real**: textos, imágenes y video definitivos |
| 6 | **Presupuesto de performance**: `pnpm build` y revisar el tamaño del bundle |

---

## 2. Sitio (estático)

El proyecto ya trae `vercel.json` y `netlify.toml` configurados para este stack.

**Vercel** — importá el repo, y en Settings → Environment Variables agregá:
```
WEBPRO_CMS_URL = https://<tu-cms>
```

**Netlify** — importá el repo y agregá la misma variable (`netlify.toml` ya trae el comando de build, los redirects y los headers).

**Sin plataforma**: `pnpm build` y subí el contenido de la carpeta de salida a cualquier hosting.

> El sitio es estático: lee el CMS **en build time**. Si el CMS está caído, usa `site.js`
> y **no se rompe** — pero el contenido queda viejo hasta el próximo build.

### Cloudflare (Workers Static Assets) — recomendado

El dashboard de Workers **solo acepta HTML/CSS/JS** al subir a mano, así que las fuentes,
SVG y XML rebotan. La vía correcta es `wrangler` (ya configurado en `wrangler.jsonc`):

```bash
pnpm build                 # genera apps/storefront/dist
npx wrangler login         # abre el navegador, una sola vez
pnpm deploy:cf             # = npx wrangler@latest deploy
```

`wrangler.jsonc` ya apunta a `apps/storefront/dist`, sirve `404.html` para rutas
inexistentes y **no** usa `binding` (Worker solo-assets). Ver `DEPLOY.md` más abajo.

Tras el primer deploy, en el panel:

1. **Custom domains** — agregá `www.webpro.cat` y `webpro.cat`
2. **Redirect apex → www** — Rules → *Redirect Rules*:
   `hostname equals webpro.cat` → `https://www.webpro.cat/${path}` (301, preservar query)
3. **Forzar HTTPS** — SSL/TLS → Edge Certificates → *Always Use HTTPS*: **ON**
4. **HSTS** — SSL/TLS → Edge Certificates → *HSTS*: **ON** (empezá con 6 meses)

**Apagá estas 3 o rompen la CSP estricta del sitio** (`script-src 'self'`):

| Función | Dónde | Acción |
|---|---|---|
| Rocket Loader | Speed → Optimization | OFF |
| Email Address Obfuscation | Scrape Shield | OFF |
| Cloudflare Web Analytics | Analytics | OFF |

> Seguridad: usá `wrangler` **≥ 4.59.1** (CVE-2026-0933, inyección en `wrangler pages deploy`).
> `npx wrangler@latest` siempre trae la última.

---

## 3. CMS (solo si usás `--with-cms`)

El proyecto trae `render.yaml`, `Dockerfile` y `docker-compose.yml`.

**Render** — New → Blueprint → conectá el repo. Completá las variables marcadas
`sync: false` (`IG_ACCESS_TOKEN`, `IG_USER_ID`, `WEBPRO_CMS_URL`). El build ya corre `db:push`.
Después, una sola vez: `pnpm --filter webpro-cms-api seed`.

**Railway** — agregá PostgreSQL, y configurá:
- Build: `pnpm install && pnpm --filter webpro-cms-api db:push`
- Start: `pnpm --filter webpro-cms-api start`
- Variables: `DATABASE_URL`, `PORT=3001`, `IG_ACCESS_TOKEN`, `IG_USER_ID`, `IG_HANDLE`

**Docker / VPS** —
```bash
pnpm --filter webpro-cms-api db:use-postgres
cp .env.example .env          # completá DATABASE_URL e IG_*
docker compose up -d --build
docker compose exec cms pnpm --filter webpro-cms-api seed
```
Poné un reverse proxy (Caddy/Nginx) delante para HTTPS.

---

## 4. Verificación post-deploy

- [ ] El sitio carga **con datos reales**
- [ ] `/api/cms/health` responde `{"ok":true}`
- [ ] `/cms/admin/` abre y guarda
- [ ] Un clic en el CTA abre WhatsApp con el **número real** y el mensaje correcto
- [ ] No aparece ningún token en el código fuente de la página
- [ ] HTTPS activo

---

## 5. Rebuild

El sitio es estático: editar en el panel **no** lo actualiza hasta el próximo build.
Si el contenido cambia seguido, configurá un **Deploy Hook** (Vercel/Netlify) y disparalo al publicar.

---

Para el detalle paso a paso, el agente tiene la skill **`webpro-deploy-check`**.
