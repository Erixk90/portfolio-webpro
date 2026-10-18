---
name: webpro-whatsapp-funnel
description: Reglas y checklist del unico canal de conversion de WebProCode (links wa.me, mensajes prellenados por seccion, CTA flotante y tracking). Use when adding or changing CTAs, buttons, links, forms, contact sections, or lead capture, or when the user mentions WhatsApp, wa.me, conversion, leads, or CTA.
---

# Funnel de WhatsApp

**Es la única conversión del sitio.** No hay carrito, no hay checkout, no hay pago online.
Si el link de WhatsApp está mal, el negocio entero está roto.

## El link

Siempre con el helper, nunca a mano:

```js
// apps/storefront/src/lib/whatsapp.js
buildWaMe(number, text)   // → https://wa.me/<E.164>?text=<mensaje urlencoded>
```

Reglas duras:

- Número en **E.164 sin `+` ni espacios**: 8 a 15 dígitos (`/^\d{8,15}$/` sobre los dígitos limpios).
- El mensaje va con `encodeURIComponent` (tildes y emojis se rompen si no).
- Número inválido → devolver `'#'`, **nunca** lanzar y romper el render.
- El número vive en el CMS (`siteSettings.whatsappNumber`); el service lo valida y rechaza con 400 si es inválido.

**Un número mal cargado es peor que un sitio caído**: el sitio se ve bien y no entra nadie.

## Mensajes prellenados

Cada CTA prellena un mensaje **contextual** con lo que el usuario estaba mirando:

| CTA | Mensaje |
|---|---|
| Hero | genérico ("Hola, quiero información") |
| Servicio X | menciona el servicio |
| Plan Y | menciona el plan |
| Flotante | genérico |

Quien recibe el mensaje ya sabe de qué se trata. Sin esto, todos los leads dicen "hola".

## Atributos para tracking

Todo CTA lleva:

```html
<a href={wa} data-whatsapp data-section="planes" data-plan="pro" target="_blank" rel="noopener">
```

- `data-whatsapp` → el script engancha el evento
- `data-section` → de dónde vino el clic (`hero`, `servicios`, `planes`, `faq`, `floating`)
- `data-plan` / `data-service` → qué estaba mirando

Se emite `whatsapp_click` con `{ section, plan|service }`. Sin esto no se puede saber
qué sección genera los leads.

## Comportamiento

- **Debounce 300 ms**: doble clic = un solo `window.open` y un solo evento. No duplicar leads.
- `target="_blank"` + `rel="noopener"`.
- Si el usuario no tiene WhatsApp instalado, `wa.me` abre `web.whatsapp.com` — no hay que hacer nada.
- CTA flotante: `position: fixed`, `env(safe-area-inset-bottom)` en iOS, contraste AA,
  y no debe tapar contenido crítico.

## Checklist de conversión

- [ ] Hay un CTA **visible sin hacer scroll** (hero).
- [ ] Desde **cualquier sección** se llega a WhatsApp en **≤ 2 clics**.
- [ ] Todos los CTA usan `buildWaMe` (ningún `wa.me` hardcodeado).
- [ ] Cada CTA tiene su `data-section` y mensaje contextual.
- [ ] Área táctil ≥ 44×44 px.
- [ ] El número es real (no el `0000000000` de la plantilla).

## Verificar antes de dar por cerrado

```powershell
# ningun wa.me hardcodeado fuera del helper
Select-String -Path apps\storefront\src -Pattern 'wa\.me' | Where-Object { $_.Path -notmatch 'whatsapp.js' }

# links generados en el HTML final
pnpm build
Select-String -Path apps\storefront\dist\index.html -Pattern 'wa\.me/\d{8,15}\?text=' -AllMatches
```

Comprobación manual: clic en cada CTA → abre WhatsApp con **el número correcto** y
**el mensaje correcto** para esa sección.
