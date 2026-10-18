/**
 * cms.js — contenido del sitio.
 *
 * Prioridad:
 *   1. Snapshot del CMS:  src/data/cms.json  (lo genera scripts/fetch-cms.mjs)
 *   2. site.js                                (fallback / fuente principal)
 *
 * El snapshot se lee en BUILD TIME: el CMS no hace falta en producción y el
 * sitio nunca se rompe si el CMS está caído (el snapshot queda en `null`).
 *
 * No se hace fetch acá a propósito (ver comentario en scripts/fetch-cms.mjs).
 */
import fs from 'node:fs';
import path from 'node:path';
import { site } from './site.js';

const SNAPSHOT = path.resolve(process.cwd(), 'src', 'data', 'cms.json');

function readSnapshot() {
  try {
    if (!fs.existsSync(SNAPSHOT)) return null;
    return JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8')) || null;
  } catch {
    return null;
  }
}

function merge(snapshot) {
  const settings = snapshot.settings || {};
  const services = snapshot.services;

  return {
    ...site,
    hero: {
      ...site.hero,
      title: settings.heroHeadline || site.hero.title,
      subtitle: settings.heroSubheadline || site.hero.subtitle,
    },
    contact: {
      ...site.contact,
      whatsappNumber: settings.whatsappNumber || site.contact.whatsappNumber,
      instagram: settings.instagramHandle || site.contact.instagram,
    },
    services: {
      ...site.services,
      items:
        Array.isArray(services) && services.length
          ? services.map((s) => ({
              title: s.title,
              description: s.description,
              mediaUrl: s.mediaUrl,
              alt: s.alt || s.title,
            }))
          : site.services.items,
    },
  };
}

export async function loadContent() {
  const snapshot = readSnapshot();
  return snapshot ? merge(snapshot) : site;
}

export default loadContent;
