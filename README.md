# WebPro

Sitio generado con **WebProCode** · stack `astro` · CSS vanilla BEM.

---

## Empezar

```bash
pnpm install
pnpm dev
```

| Servicio | URL |
|---|---|
| Sitio | http://localhost:3000 |

---

## Personalizar (1 solo archivo)

Todo el contenido está en:

```
apps/storefront/src/lib/site.js
```

Ahí editás marca, navegación, hero, servicios, contacto y footer. El resto es presentación.

**Para cambiar colores/tipografía:** `apps/storefront/src/styles/tokens.css`

**Regla de estilos (BEM vanilla):**
- Un archivo por bloque en `apps/storefront/src/styles/blocks/`
- Naming `block__element--modifier` — sin Tailwind, sin frameworks CSS

---

## Contacto configurado

- WhatsApp: `5491100000000`
- Marca: WebPro
- Dominio: https://example.com

---

## Estructura

```
webpro-portfolio/
├── package.json
├── pnpm-workspace.yaml
├── .env.example
└── apps/storefront/
    ├── src/lib/site.js          ← 👈 tu contenido
    ├── src/styles/tokens.css    ← 👈 tus colores
    ├── src/styles/blocks/*.css
    └── (código del stack astro)
```

---

## Conectar el CMS (opcional)

1. Levantá un CMS WebPro (ver `cms/` en la base del framework).
2. Poné `WEBPRO_CMS_URL=http://localhost:3001` en `.env`.
3. El build leerá servicios y ajustes desde el CMS; si no responde, usa `site.js` y **no se rompe**.
