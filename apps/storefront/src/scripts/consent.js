/**
 * consent.js — registro de consentimiento de cookies/analítica.
 *
 * Hoy el sitio no usa cookies ni trackers, así que el banner permanece
 * apagado. Si algún día se activa (Layout: <body data-consent="on">),
 * aparece el aviso y cada decisión queda registrada en el propio
 * navegador del visitante con fecha, versión de política y página.
 * Ese registro también se lista automáticamente en /cookies.
 */
const KEY = 'webpro.consent.v1';

const body = document.querySelector('body');
if (body && body.dataset.consent === 'on' && !window.WebProConsent) {
  const banner = document.createElement('div');
  banner.className = 'consent';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Aviso de cookies');
  banner.innerHTML = `
    <p class="consent__text">
      Usamos almacenamiento local solo para registrar tu decisión sobre
      analítica del sitio. Puedes leer la <a href="/cookies">política de cookies</a>.
    </p>
    <div class="consent__actions">
      <button type="button" class="consent__btn consent__btn--ok">Aceptar</button>
      <button type="button" class="consent__btn">Rechazar</button>
    </div>
  `;
  const hide = () => banner.remove();
  banner.querySelector('.consent__btn--ok').addEventListener('click', () => {
    record('granted');
    hide();
  });
  banner.querySelector('.consent__btn:not(.consent__btn--ok)').addEventListener('click', () => {
    record('denied');
    hide();
  });

  function readLog() {
    try {
      const raw = window.localStorage.getItem(KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  function record(choice) {
    const entry = {
      choice,
      at: new Date().toISOString(),
      version: document.body.dataset.consentVersion || '1',
      page: location.pathname,
    };
    const log = readLog();
    log.push(entry);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(log));
    } catch {
      /* almacenamiento no disponible: sin registro */
    }
    renderLog();
  }

  function renderLog() {
    const box = document.querySelector('#consent-log');
    if (!box) return;
    const log = readLog();
    box.textContent = '';
    if (!log.length) {
      const empty = document.createElement('p');
      empty.textContent = 'No hay decisiones registradas en este navegador.';
      box.appendChild(empty);
      return;
    }
    const ul = document.createElement('ul');
    ul.className = 'legal__loglist';
    for (const e of log) {
      const li = document.createElement('li');
      const when = new Date(e.at).toLocaleString('es-CO');
      const choice = e.choice === 'granted' ? 'aceptó' : 'rechazó';
      li.textContent = `${when} — ${choice} (versión ${e.version}, ${e.page})`;
      ul.appendChild(li);
    }
    box.appendChild(ul);
  }

  document.body.insertAdjacentElement('beforeend', banner);
  renderLog();

  window.WebProConsent = {
    grant: () => (record('granted'), hide()),
    deny: () => (record('denied'), hide()),
    log: readLog,
    reset: () => {
      try {
        window.localStorage.removeItem(KEY);
      } catch {}
      renderLog();
    },
  };
}
