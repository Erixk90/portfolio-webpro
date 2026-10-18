# BEM Vanilla — Reglas WebPro

## Naming
`block__element--modifier` en kebab-case.

- OK: `product-card__image--large`, `header__nav--open`, `hero__title`
- NO: `cardImg`, `header-nav`, `heroTitle`, `hero_title`

## Un archivo por bloque
```
src/styles/blocks/header.css
src/styles/blocks/hero.css
src/styles/blocks/services.css
```
Nunca un CSS por página ni un CSS gigante. Si un bloque crece demasiado, se parte en otro bloque.

## Prohibido
- Tailwind, Bootstrap, cualquier framework CSS
- `@apply`, CSS-in-JS, estilos inline (salvo valores dinámicos inevitables)
- `!important` (salvo reset puntual y documentado)
- Anidamiento más profundo que 2 niveles

## Tokens
Todo color, tipografía, espaciado, radio y tiempo va en `tokens.css` como variable CSS.
En los bloques se usa `var(--token)`, nunca un valor hardcodeado.

```css
/* ✅ */
.services__item { border-radius: var(--radius-md); padding: var(--space-md); }

/* ❌ */
.services__item { border-radius: 12px; padding: 24px; }
```

## Estructura obligatoria de estilos
```
src/styles/tokens.css      # variables
src/styles/base.css        # reset + tipografía base (+ .container, .btn, .skip-link)
src/styles/blocks/*.css    # un archivo por bloque
```

## Accesibilidad mínima por bloque
- Contraste ≥ 4.5:1 en texto.
- Área táctil ≥ 44×44 px en elementos interactivos.
- `:focus-visible` siempre visible (definido en `base.css`).
- Imágenes con `alt` descriptivo o `alt=""` si son decorativas.
