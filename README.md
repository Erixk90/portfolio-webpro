# WebPro — Portafolio

Sitio estático del portafolio de **WebPro**, generado con **WebProCode** · stack `astro` · CSS vanilla BEM.

En producción: **https://www.webpro.cat**

---

## Empezar

```bash
pnpm install
pnpm dev
```

| Servicio | URL |
|---|---|
| Sitio | http://localhost:3000 |

### Scripts

| Script | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción → `apps/storefront/dist` |
| `pnpm preview` | Previsualiza el build |
| `pnpm budget` | Verifica el presupuesto de performance (CSS/JS) |
| `pnpm deploy:cf` | Publica en Cloudflare (`npx wrangler@latest deploy`) |
| `pnpm deploy:cf:dry` | Deploy en seco, sin publicar |

> `pnpm budget` se corre **desde la raíz** del proyecto.

---

## Personalizar

Todo el contenido de la web está en dos archivos:

```
apps/storefront/src/lib/site.js     ← marca, nav, hero, proyectos, servicios, contacto, footer
apps/storefront/src/lib/legal.js    ← Términos, Privacidad y Cookies
```

**Colores / tipografía:** `apps/storefront/src/styles/tokens.css` — es la **única fuente** de tokens (colores, espaciado, tipografía). Nada de valores sueltos.

**Regla de estilos (BEM vanilla):**
- Un archivo por bloque en `apps/storefront/src/styles/blocks/`
- Naming `block__element--modifier` — sin Tailwind, sin frameworks CSS

**Tipografía:** Sora se sirve **auto-hospedada** desde `apps/storefront/public/fonts/sora-var.woff2` (variable 100–900). No hay CDN de Google Fonts.

---

## Contacto configurado

| Dato | Valor |
|---|---|
| Marca | WebPro |
| WhatsApp | `573053906784` → https://wa.me/573053906784 |
| Email | `director@webpro.cat` |
| Dominio | https://www.webpro.cat |

El WhatsApp es el **único canal de conversión**: los CTA abren `wa.me` con mensajes prellenados por sección (`apps/storefront/src/lib/whatsapp.js`).

---

## Páginas

| Ruta | Contenido |
|---|---|
| `/` | Landing (hero, proyectos, servicios, proceso, contacto) |
| `/terminos/` | Términos y Condiciones |
| `/privacidad/` | Política de Privacidad |
| `/cookies/` | Política de Cookies |
| `/404.html` | Página de error (con `noindex`) |

---

## Estructura

```
webpro-portfolio/
├── package.json
├── pnpm-workspace.yaml
├── wrangler.jsonc              ← config de deploy en Cloudflare
├── DEPLOY.md                   ← guía de publicación
├── scripts/check-budget.mjs
├── .env.example
└── apps/storefront/
    ├── public/
    │   ├── _headers            ← CSP + cabeceras de seguridad
    │   ├── _redirects
    │   ├── robots.txt
    │   ├── sitemap.xml
    │   └── fonts/sora-var.woff2
    ├── src/lib/site.js         ← tu contenido
    ├── src/lib/legal.js        ← textos legales
    ├── src/lib/whatsapp.js
    ├── src/styles/tokens.css   ← tus colores
    ├── src/styles/blocks/*.css
    └── (código del stack astro)
```

---

## Deploy

Guía completa en **`DEPLOY.md`**. Resumen:

1. `pnpm build` → genera `apps/storefront/dist`
2. `pnpm deploy:cf` → publica en Cloudflare (Worker static assets, config en `wrangler.jsonc`)
3. Panel de Cloudflare: dominios, redirect **apex → www** (301), **Always Use HTTPS** y **HSTS** en ON

> Apagá **Rocket Loader**, **Email Address Obfuscation** y **Cloudflare Web Analytics**: rompen la CSP estricta (`script-src 'self'`).

---

## Performance y calidad

| Chequeo | Estado |
|---|---|
| Presupuesto CSS | ~3.97 kB / 60 kB |
| Presupuesto JS | ~2.61 kB / 80 kB (gzip) |
| Cabeceras de seguridad | CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` en `public/_headers` |
| SEO técnico | `robots.txt` + `sitemap.xml`, `canonical` y `og:url` **por página** |
| Consentimiento | Apagado por defecto (sin cookies); se activa con `<body data-consent="on">` |

---

## Conectar el CMS (opcional)

1. Levantá un CMS WebPro (ver `cms/` en la base del framework).
2. Poné `WEBPRO_CMS_URL=http://localhost:3001` en `.env`.
3. El build leerá servicios y ajustes desde el CMS; si no responde, usa `site.js` y **no se rompe**.
