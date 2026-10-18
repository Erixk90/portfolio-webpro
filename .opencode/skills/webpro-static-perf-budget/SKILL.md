---
name: webpro-static-perf-budget
description: Presupuestos de performance de WebProCode y como medirlos y recuperarlos en un sitio estatico. Use when the build got heavier, the user mentions performance, Lighthouse, Core Web Vitals, LCP, CLS, bundle size, or when adding a library, a font, images, video or an animation to the site.
---

# Presupuesto de performance

Un sitio de WebProCode tiene que ser **liviano por defecto**. Estos números son parte
de la definición de "terminado", no un deseo.

## Presupuesto (por stack)

| Stack | CSS | JS inicial | Por qué |
|---|---|---|---|
| `astro` | ≤ 60 kB gz | **≤ 80 kB gz** | Islas mínimas: normalmente ~0 kB |
| `react` | ≤ 60 kB gz | **≤ 80 kB gz** | SPA: un bundle (~48 kB gz) |
| `html-vanilla` | ≤ 60 kB gz | **≤ 80 kB gz** | Sin build, JS nativo |
| `next` | ≤ 60 kB gz | **≤ 170 kB gz** | ⚠️ Tiene un **piso**: su runtime + polyfills son ~140 kB gz **antes** de que escribas código |

| Métrica | Límite |
|---|---|
| Lighthouse Performance | ≥ 90 |
| LCP | ≤ 2.5 s |
| CLS | ≤ 0.1 |
| INP | ≤ 200 ms |

## Cómo se mide (importante)

**Se mide el JS/CSS que la página carga de entrada**, no la suma de todos los archivos
del output. En frameworks con code splitting (Next) sumar todo el JS da un número
**falso y alarmante** (223 kB cuando el usuario baja 139 kB).

El proyecto trae el medidor:

```powershell
pnpm build
pnpm budget
```

Sale con código 1 si se excede, así sirve en CI. Ver `scripts/check-budget.mjs`.

> ❌ **No** midas con `gzip -c dist/**/*.js | wc -c`: infla la cuenta con chunks
> que el usuario nunca descarga.
>
> ⚠️ Tampoco uses `browserslist` con targets modernos para "sacar los polyfills"
> de Next: **no los quita**. El piso es del framework.

Lighthouse:

```powershell
npx --yes lighthouse http://localhost:3000 --preset=desktop --only-categories=performance,accessibility --chrome-flags="--headless" --view
```

## Las 5 causas típicas (en orden de frecuencia)

1. **Una librería para algo que hacés en 20 líneas.** Carrusel, acordeón, animación:
   casi siempre conviene CSS/JS nativo. Cada dependencia entra al bundle de todas las páginas.
2. **`client:load` de más (Astro).** El hero y las secciones de contenido van **estáticos**.
   Solo hidratar lo interactivo, con `client:visible` o `client:idle`. Nunca `client:load` en el hero.
3. **Imágenes sin dimensiones.** Sin `width`/`height` o `aspect-ratio`, el layout salta → CLS.
   Toda imagen: `loading="lazy" decoding="async"` **excepto** la de above-the-fold.
4. **Fuentes sin subset / sin swap.** Subset + `font-display: swap` + preload solo del woff2 crítico.
5. **Animar propiedades que reflowean.** Animar `width`, `height`, `top` o `margin` rompe el frame.
   Animar solo `transform` y `opacity`.

## Reglas de media

| Elemento | Cómo |
|---|---|
| Imagen above-the-fold (hero) | `loading="eager" decoding="async" fetchpriority="high"` |
| Resto de imágenes | `loading="lazy" decoding="async"` |
| Video de fondo | `preload="metadata"` + `poster` + `autoplay muted loop playsinline`, con poster como fallback |
| Decorativas | CSS (gradiente, patrón) antes que una imagen |

## Islands (Astro)

El contenido (hero, servicios, planes, FAQ estático) **no se hidrata**.
Solo hidratar: acordeón, slider, parallax, tracking. Siempre detrás de `client:visible`/`client:idle`.

## Si el presupuesto de Next te queda corto

Si 170 kB de techo no alcanza, es señal de que **el stack elegido no es el correcto para
ese objetivo**: un sitio de contenido con performance crítico va en `astro` (por eso es
el stack recomendado). Next se justifica cuando el proyecto es realmente una aplicación.

## Antes de cerrar

- [ ] `pnpm build` sin warnings de tamaño
- [ ] `pnpm build && pnpm budget` → dentro del presupuesto
- [ ] Imágenes con dimensiones (o `aspect-ratio`) y lazy salvo el hero
- [ ] Animaciones con `transform`/`opacity` y respetando `prefers-reduced-motion`
- [ ] Ningún `client:load` en contenido crítico
- [ ] Si agregaste una dependencia, justificá por qué no se hizo nativo
