#!/usr/bin/env node
/**
 * check-budget.mjs — verifica el presupuesto de performance del sitio construido.
 *
 * ⚠️ Mide lo que el usuario DESCARGA DE ENTRADA (los scripts y el CSS que el HTML
 * referencia), NO la suma de todos los chunks. En frameworks con code splitting
 * (Next) sumar todo el JS del output infla la cuenta y da un número falso.
 *
 * Uso:   pnpm budget        (después de pnpm build)
 * Sale con código 1 si se excede el presupuesto, así sirve en CI.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const STACK = 'astro';

// Presupuesto en kB gzip por stack.
// `next` tiene un piso propio: su runtime + polyfills son ~140 kB antes de
// que escribas una línea de código.
const PRESUPUESTO = {
  astro: { css: 60, js: 80 },
  react: { css: 60, js: 80 },
  'html-vanilla': { css: 60, js: 80 },
  next: { css: 60, js: 170 },
};

const SALIDA = {
  astro: 'apps/storefront/dist',
  react: 'apps/storefront/dist',
  next: 'apps/storefront/out',
  'html-vanilla': 'apps/storefront',
};

const limite = PRESUPUESTO[STACK] ?? PRESUPUESTO.astro;
const outDir = path.resolve(process.cwd(), SALIDA[STACK] ?? 'apps/storefront');

if (!fs.existsSync(outDir)) {
  console.error(`✖ No existe la carpeta de salida: ${SALIDA[STACK]}`);
  console.error('  Corré primero:  pnpm build');
  process.exit(1);
}

const htmlPath = path.join(outDir, 'index.html');
if (!fs.existsSync(htmlPath)) {
  console.error(`✖ No existe ${path.relative(process.cwd(), htmlPath)}`);
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf8');

/**
 * Archivos que la página carga de entrada (src y preloads).
 * Acepta atributos con y sin comillas: los bundlers siempre los citan, pero
 * el HTML escrito a mano (html-vanilla) puede no hacerlo.
 */
const refs = [
  ...new Set(
    [...html.matchAll(/(?:src|href)\s*=\s*["']?([^"'\s>]+\.(?:js|css))["']?/g)].map((m) => m[1])
  ),
];

let js = 0;
let css = 0;
const detalle = [];

for (const ref of refs) {
  const file = path.join(outDir, ref.replace(/^\//, ''));
  if (!fs.existsSync(file)) continue;
  const gz = zlib.gzipSync(fs.readFileSync(file)).length;
  if (file.endsWith('.js')) js += gz;
  else css += gz;
  detalle.push(`${path.basename(file)} ${(gz / 1024).toFixed(1)}kB`);
}

const kb = (b) => (b / 1024).toFixed(2);
const okCss = css <= limite.css * 1024;
const okJs = js <= limite.js * 1024;

console.log(`\nPresupuesto de performance — stack ${STACK}\n`);
console.log(`  CSS  ${kb(css).padStart(7)} kB  /  ${limite.css} kB   ${okCss ? 'OK' : 'EXCEDIDO'}`);
console.log(`  JS   ${kb(js).padStart(7)} kB  /  ${limite.js} kB   ${okJs ? 'OK' : 'EXCEDIDO'}`);
if (detalle.length) console.log(`\n  archivos iniciales: ${detalle.join(', ')}`);
console.log('');

if (!okCss || !okJs) {
  console.error('✖ Presupuesto excedido. Revisá: ¿agregaste una dependencia que');
  console.error('  se podía hacer nativa, o hidratación de más? (ver la skill');
  console.error('  webpro-static-perf-budget)');
  process.exit(1);
}

console.log('✓ Dentro del presupuesto.');
