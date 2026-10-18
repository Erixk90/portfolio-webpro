---
name: webpro-design-premium
description: Direccion de arte para que un sitio WebProCode se vea premium y no como una plantilla generada por IA, siempre con tokens y BEM sin frameworks CSS. Use when designing or improving a landing, hero, section or palette, when the user says it looks generic, boring, plantilla, or asks for a distintivo, premium or high-end look.
---

# Diseño premium (sin parecer plantilla)

El objetivo no es "que se vea lindo": es que **no se parezca a las otras mil landings
hechas con IA**. Eso se decide en cuatro lugares, y ninguno es una librería.

## Los 6 clichés a evitar

| Cliché | En vez de eso |
|---|---|
| Gradiente azul → violeta de fondo | Un color base decidido (oscuro, claro o terroso) + **un solo** acento |
| Tres tarjetas iguales en fila | Ritmo roto: layouts asimétricos, una sección a sangre, tamaños distintos |
| Emoji como íconos | Íconos SVG consistentes, o tipografía, o nada |
| Sombra difusa grande en todo | Bordes, contraste y espacio. Sombra solo donde hay elevación real |
| Todo centrado | Alineación a la izquierda con jerarquía clara; centrar es el default vago |
| Texto de relleno ("Lorem") | Copy real, específico, con números y nombres |

## 1. Dirección de arte (en `tokens.css`)

- **Un acento, no tres.** El acento marca **una** cosa: la acción principal.
- **Escala tipográfica con ratio**, no tamaños sueltos. Un display grande de verdad
  (con `clamp()`) y tracking negativo (-0.02 a -0.04em) en títulos display.
- **Ritmo de espaciado**: usar la escala (`--space-sm/md/lg/xl`) y animarse al `xl`.
  El espacio generoso es lo que separa "premium" de "apretado".
- **Contraste decidido**: o claro limpio, o oscuro con intención. El gris tibio no convence a nadie.

## 2. Jerarquía

Un solo `<h1>`. El ojo debe saber en 3 segundos: qué es, para quién, y qué hacer.
Probar el **test del entrecerrado**: si entrecerrás los ojos, ¿igual se entiende la
estructura y se ve el CTA? Si todo pesa igual, no hay jerarquía.

## 3. Layout

- No todo tiene que ser una grilla simétrica. Una sección puede ocupar toda la pantalla.
- Variar la composición entre secciones (media a la izquierda / a la derecha / a sangre).
- Whitespace generoso: el espacio no es desperdicio, es lujo.

## 4. Motion

- Duración **150–300 ms**, un solo easing (`--ease`) en todo el sitio.
- Animar solo `transform` y `opacity` (nunca `width`/`top`/`margin`).
- **Siempre** respetar `prefers-reduced-motion: reduce` (patrón en `base.css`).
- Poco y sutil: que acompañe, no que haga un show.

## Cómo se logra sin frameworks CSS

La diferencia **no** viene de Tailwind ni de una librería de componentes: viene del
ritmo, el contraste y la jerarquía. Todo esto se hace con tokens + bloques BEM.
Si para lograr el look necesitás un framework CSS, el problema es la dirección de arte,
no la herramienta. Ver la skill `webpro-bem-tokens`.

## QA visual (antes de mostrar)

1. **Elegí 2 referencias reales** y nombralas. Sin referencia no hay dirección, hay gusto personal.
2. **Screenshot a 1440 px y 375 px.** Espejo, no memoria.
3. Checklist:
   - [ ] ¿Hay **un** punto focal claro en la primera pantalla?
   - [ ] ¿El CTA principal se distingue del resto (no hay 3 botones que compiten)?
   - [ ] ¿Un color de acento, usado con disciplina?
   - [ ] ¿Tipografía con jerarquía real (display vs cuerpo bien diferenciados)?
   - [ ] ¿Espacio suficiente, o está todo apretado?
   - [ ] ¿Se ve distinto a la competencia que el usuario mencionó, o es "otra landing más"?
   - [ ] ¿Se sostiene en mobile sin quedar un amasijo?

**Criterio de aceptación honesto:** si le mostrás el sitio a alguien y dice
"qué lindo template", falló. Si dice "¿quién lo hizo?", funcionó.
