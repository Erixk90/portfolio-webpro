---
name: webpro-troubleshooting
description: Catalogo de fallos reales de WebProCode con sintoma, causa y fix verificado. Use when the build fails, the CMS does not start, EADDRINUSE appears, Prisma does not generate, JSON.parse breaks, pnpm blocks postinstall, vite build rejects top-level await, or a generated site does not show CMS data.
---

# Troubleshooting WebProCode

Fallos que **ya nos pasaron** y cómo se resolvieron. Si el síntoma está en la tabla,
aplicá el fix directo en vez de investigar de cero.

## Regla de oro

1. **Reproducir** el fallo con el comando mínimo.
2. **Aislar**: ¿es el build, el CMS, la config o el entorno? Probá en otro puerto o carpeta.
3. **Fix mínimo** y volver a correr el mismo comando.
4. **Verificar** que el resultado esperado existe (no alcanza con "no explotó").

> Nunca declares "arreglado" sin ver el efecto. Un build puede imprimir `Complete!`
> y salir con código distinto de 0.

## Catálogo

| Síntoma | Causa | Fix |
|---|---|---|
| `EADDRINUSE :3001` | Ya hay un CMS corriendo (o quedó de una sesión anterior) | `taskkill /IM node.exe /F` y volver a levantar. Un solo CMS y un solo storefront a la vez |
| `JSON.parse` falla con `Unexpected token ''` | **BOM UTF-8** (`EF BB BF`) al inicio del archivo | Reescribir sin BOM. En PowerShell 5.1 `Set-Content -Encoding UTF8` **agrega** BOM: usar `[System.IO.File]::WriteAllText($p, $c, (New-Object System.Text.UTF8Encoding($false)))`. Si el archivo ya existe, algunas tools **preservan** el BOM viejo: borralo y volvé a escribirlo |
| `PrismaClientInitializationError` o el CMS arranca en modo plantilla | `@prisma/client` no generado o `hasDB()` en `false` | `pnpm --filter webpro-cms-api db:generate`, `pnpm db:push` y confirmar `export const hasDB = () => !!prisma;` en `cms/api/src/lib/db.js` |
| `EPERM: operation not permitted, rename query_engine-windows.dll.node` | Un proceso `node` tiene la DLL tomada | `taskkill /IM node.exe /F` y reintentar `pnpm --filter webpro-cms-api db:generate` |
| `Ignored build scripts: esbuild, sharp, prisma` | pnpm 10 bloquea postinstall por seguridad | Agregar `onlyBuiltDependencies` en `pnpm-workspace.yaml` (`esbuild`, `sharp`, `@prisma/client`, `@prisma/engines`, `prisma`) y reinstalar |
| `[vite:esbuild-transpile] Transform failed` en React | `vite build` no soporta **top-level await** | Envolver en IIFE: `(async () => { const c = await loadContent(); … })()` |
| `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c` | **Node ≥24 + Windows**: hacer `fetch` dentro del proceso de build de Astro deja handles y libuv rompe al salir (exit ≠ 0, aunque el sitio se genere) | No hacer fetch en el build. Usar el **snapshot**: `scripts/fetch-cms.mjs` corre antes y escribe `src/data/cms.json`; `cms.js` lo lee |
| El admin del CMS queda en blanco | Se abrió con `file://` (bloquea ES modules y `fetch`) | Abrir `http://localhost:3001/cms/admin/` — nunca el archivo directo |
| `Route GET:/ not found` en `localhost:3001/` | Es correcto: es una API headless, no tiene home | Usar `/api/cms/health`, `/api/cms/services`, `/cms/admin/` |
| La landing no muestra los datos del CMS | Falta `apps/storefront/.env` con `WEBPRO_CMS_URL`, o el snapshot quedó en `null` | Revisar `apps/storefront/.env`; correr `node scripts/fetch-cms.mjs` y verificar `src/data/cms.json` |
| `whatsappNumber inválido` | No es E.164 | 8 a 15 dígitos, **sin** `+` ni espacios (ej. `5491123456789`) |
| Los cambios no persisten al reiniciar | `hasDB()` en `false` (modo plantilla, datos en memoria) | Activar persistencia y correr `pnpm db:push` + `pnpm db:seed` |
| `db:seed` no existe | El proyecto se generó sin `--with-cms` | No hay CMS que sembrar. Regenerar con `--with-cms` |

## Diagnóstico de "no falla pero no hace lo que espero"

1. **¿Existe el archivo que debería haberse creado?** (`Test-Path`)
2. **¿El contenido es el esperado?** (`Select-String`, no confiar en el log)
3. **¿La tool reportó éxito real?** Revisar el **exit code**, no solo la última línea.
4. **¿Hay BOM?** Ante cualquier rareza con JSON: revisar los primeros 3 bytes.

```powershell
# exit code real (sin pipe que lo enmascare)
& node cli\src\index.js init --stack astro --dir C:\tmp\x
$LASTEXITCODE
```

## Antes de escalar

- Un solo CMS y un solo storefront a la vez.
- `node --version` — el framework apunta a Node 20 LTS; en Node ≥24 en Windows aparecen los fallos de arriba.
- Si el CMS responde pero la landing no, el problema es de **build time**, no de runtime.
