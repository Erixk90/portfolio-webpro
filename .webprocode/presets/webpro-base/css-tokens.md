# Tokens CSS — Reglas WebPro

Todos los tokens viven en `src/styles/tokens.css` dentro de `:root`.

## Contrato mínimo

```css
:root {
  /* Color */
  --color-bg, --color-surface, --color-text, --color-muted,
  --color-accent, --color-on-accent, --color-border

  /* Tipografía */
  --font-sans, --font-display,
  --text-h1, --text-h2, --text-h3, --text-body,
  --leading-tight, --leading-body

  /* Espaciado */
  --space-xs, --space-sm, --space-md, --space-lg, --space-xl

  /* Formas */
  --radius-sm, --radius-md, --radius-pill, --content-max, --shadow-sm

  /* Movimiento */
  --ease, --duration

  /* Capas */
  --z-header
}
```

## Reglas

1. Tipografía responsive con `clamp()`: `--text-h1: clamp(2.2rem, 6vw, 4rem);`
2. Espaciado en escala fija (no inventar valores sueltos).
3. Los bloques **solo** consumen tokens: `var(--space-md)`, `var(--color-muted)`.
4. Cambiar la identidad visual = editar `tokens.css`. No se toca ningún bloque.
5. Para agregar un token nuevo: primero en `tokens.css`, luego se usa.

## Paleta por defecto de la plantilla

| Token | Valor | Uso |
|---|---|---|
| `--color-bg` | `#ffffff` | Fondo principal |
| `--color-surface` | `#f6f7f9` | Secciones alternas / tarjetas |
| `--color-text` | `#14161a` | Texto principal |
| `--color-muted` | `#5c6470` | Texto secundario |
| `--color-accent` | `#2f6df6` | CTA y acentos |
| `--color-border` | `#e4e7ec` | Bordes y separadores |
