/**
 * fetch-cms.mjs — descarga el contenido del CMS a `src/data/cms.json`.
 *
 * Lo ejecutan `dev` y `build` ANTES del framework, en un proceso aparte.
 * Motivo: hacer `fetch` dentro del proceso de build provoca en Node >=24 sobre
 * Windows una aserción de libuv al terminar (exit code != 0) aunque el sitio se
 * genere bien. En un proceso propio el build termina limpio.
 *
 * Comportamiento:
 *   - Sin WEBPRO_CMS_URL  -> escribe `null` (el sitio usa site.js)
 *   - CMS caído           -> reintenta y, si no responde, escribe `null`
 *
 * Los reintentos cubren el arranque en paralelo de `pnpm dev` (CMS + sitio).
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT_FILE = path.resolve(process.cwd(), 'src', 'data', 'cms.json');
const RETRIES = 4;
const DELAY_MS = 700;

/** Lee WEBPRO_CMS_URL del entorno o, si no está, del archivo .env. */
function readCmsUrl() {
  if (process.env.WEBPRO_CMS_URL) return process.env.WEBPRO_CMS_URL;
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const match = fs.readFileSync(envPath, 'utf8').match(/^\s*WEBPRO_CMS_URL\s*=\s*(.*)$/m);
      if (match) return match[1].trim().replace(/^["']|["']$/g, '');
    }
  } catch {
    /* sin .env: seguimos */
  }
  return '';
}

function writeSnapshot(value) {
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function readCms(base) {
  const get = (p) =>
    fetch(`${base}${p}`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);

  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    const [settings, services] = await Promise.all([
      get('/api/cms/site-settings'),
      get('/api/cms/services'),
    ]);

    if (settings || (Array.isArray(services) && services.length)) {
      return { settings, services };
    }
    if (attempt < RETRIES) await sleep(DELAY_MS);
  }
  return null;
}

async function main() {
  const base = readCmsUrl();

  if (!base) {
    writeSnapshot(null);
    console.log('[cms] WEBPRO_CMS_URL no configurada -> se usa site.js');
    return;
  }

  const snapshot = await readCms(base);

  if (!snapshot) {
    writeSnapshot(null);
    console.warn('[cms] el CMS no respondio -> se usa site.js');
    return;
  }

  writeSnapshot(snapshot);
  console.log(`[cms] snapshot guardado (${snapshot.services?.length ?? 0} servicios)`);
}

main();