---
name: webpro-bem-tokens
description: Crea y audita bloques BEM vanilla y tokens CSS en WebProCode (un archivo por bloque, tokens.css como unica fuente, sin frameworks CSS). Use when adding or editing styles, creating a new section, reviewing CSS, or when the user mentions BEM, tokens, blocks, Tailwind, or asks why the CSS looks inconsistent.
---

# BEM vanilla + tokens

Es la regla nº 1 del framework. No hay framework CSS, nunca.

## Estructura obligatoria

```
apps/storefront/src/styles/
├── tokens.css        # ÚNICA fuente de variables (colores, tipografía, espacio, radios, motion)
├── base.css          # reset + tipografía base + .container + .btn + .skip-link + .reveal
└── blocks/
    ├── header.css
    ├── hero.css
    ├── services.css
    ├── cta.css
    └── footer.css
```

**Un archivo por bloque.** Nunca un CSS por página ni un archivo gigante.
Se importan una sola vez, en orden: `tokens` → `base` → `blocks/*`.

## Naming

`block__element--modifier`, todo en kebab-case.

| ✅ | ❌ |
|---|---|
| `hero__title` | `heroTitle` |
| `hero__title--display` | `hero_title_display` |
| `service-editorial--reverse` | `serviceEditorialReverse` |

Un elemento **nunca** se anida en el nombre: `.card__media__img` está mal. Nuevo bloque.

## Prohibido (auditar en cada cambio)

- Tailwind, Bootstrap, o cualquier framework CSS
- `@apply`, CSS-in-JS, utilidades
- **Estilos inline** — salvo valores verdaderamente dinámicos
- `!important` (única excepción: un reset puntual, comentado)
- Anidamiento de más de 2 niveles

## Crear un bloque nuevo

1. Definir el bloque y sus elementos (no pensar en "páginas", pensar en piezas).
2. Crear `styles/blocks/<bloque>.css` con la clase raíz `.bloque`.
3. Consumir **solo tokens**: `var(--space-md)`, `var(--color-muted)`. Nunca `16px` suelto.
4. Importar el `.css` en el layout (Astro), `main.jsx` (React) o `<link>` (HTML vanilla).
5. Usar responsive con `clamp()` y `@media` al final del archivo del bloque.

```css
/* ✅ */
.services__item {
  border-radius: var(--radius-md);
  padding: var(--space-md);
  background: var(--color-surface);
}
```

## Si un bloque crece demasiado

Señales: más de ~120 líneas, o elementos sin relación.
Partilo en dos bloques con responsabilidades claras (ej. `plans` → `plans` + `plan-card`).

## Cambiar la identidad visual

**No se toca ningún bloque.** Se edita `tokens.css`. Si para cambiar un color hay que
tocar varios bloques, hay un token mal usado: centralizalo primero.

## Auditoría (correr antes de dar por cerrado)

```powershell
# frameworks CSS y !important
Select-String -Path apps\storefront\src\styles\blocks\*.css -Pattern 'tailwind|@apply|bootstrap|!important'

# valores hardcodeados que deberian ser tokens (hex sueltos)
Select-String -Path apps\storefront\src\styles\blocks\*.css -Pattern '#[0-9a-fA-F]{3,6}'

# un archivo por bloque
Get-ChildItem apps\storefront\src\styles\blocks
```

Los dos primeros deben dar **0**. El tercero, un archivo por bloque real (sin `misc.css`).

## Accesibilidad mínima del bloque

- Contraste ≥ 4.5:1 en texto.
- Área táctil ≥ 44×44 px en elementos interactivos.
- `:focus-visible` visible (ya está en `base.css`; no lo pises).
- Imágenes con `alt` descriptivo, o `alt=""` si son decorativas.

## Motion

Duración y easing salen de tokens (`--duration`, `--ease`). Toda animación debe
respetar `prefers-reduced-motion: reduce` (ver el patrón en `base.css`).
