# Stack Astro — Reglas WebPro

Astro 4.x con salida **estática (SSG)**: máximo rendimiento y SEO.

## Estructura
```
apps/storefront/
├── astro.config.mjs        # output: 'static'
├── package.json
├── public/                 # assets estáticos (favicon, og-image)
└── src/
    ├── layouts/Layout.astro
    ├── pages/index.astro    # única página: compone las secciones
    ├── components/*.astro   # Header, Hero, Services, Cta, Footer
    ├── lib/site.js          # 👈 contenido a editar
    ├── lib/whatsapp.js
    ├── lib/cms.js           # conexión opcional al CMS
    ├── scripts/*.js         # JS de cliente (islas)
    └── styles/              # tokens.css, base.css, blocks/*.css
```

## Reglas

1. `output: 'static'` — nada de SSR por request salvo necesidad real.
2. Componentes `.astro` para el markup; la interactividad en `src/scripts/*.js`.
3. **No** usar `client:load` en contenido crítico. Preferir `client:visible` / `client:idle`.
4. El hero y las secciones principales son **estáticas** (sin hidratación).
5. El contenido se resuelve en **build time** con `loadContent()` de `src/lib/cms.js`.
6. No importar React/Preact/Vue salvo que el proyecto lo requiera explícitamente.
7. Los estilos se importan una sola vez en `Layout.astro` (tokens → base → bloques).

## Consumo del CMS (snapshot, sin fetch en el build)
```
scripts/fetch-cms.mjs   → descarga el CMS a src/data/cms.json (proceso aparte)
src/lib/cms.js          → lee ese JSON en build time
```
```astro
---
import { loadContent } from '../lib/cms.js';
const content = await loadContent();   // snapshot del CMS, o site.js si no hay
---
```

**Por qué un snapshot y no fetch directo:** hacer `fetch` dentro del proceso de
Astro provoca en Node ≥24 sobre Windows una aserción de libuv al terminar el
build (exit code ≠ 0) aunque el sitio se genere bien. El script previo corre en
su propio proceso, así el build termina limpio — y además el build es más rápido.

El script corre automáticamente: `pnpm dev` y `pnpm build` ya lo invocan.

## Performance (presupuesto)
- CSS total ≤ 60 kB gzip · JS ≤ 80 kB gzip
- Imágenes con `loading="lazy"` y `decoding="async"` (excepto lo que esté above-the-fold)
- Build sin errores y sin `client:load` innecesario

## SEO
- `lang="es"`, `<title>`, `<meta name="description">`, `canonical`, OG tags
- Un solo `<h1>` por página; jerarquía `h1 → h2 → h3` sin saltos
