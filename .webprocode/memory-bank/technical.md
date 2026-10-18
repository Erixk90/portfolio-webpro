# Technical — WebPro

## Stack
- Runtime: Node.js 20 LTS
- Storefront: `astro` — `apps/storefront`
- CSS: vanilla BEM (`tokens.css` + `base.css` + `blocks/*.css`)
- CMS: WebPro CMS headless (opcional) — `cms/api` (Fastify + Prisma)
- Package manager: pnpm

## Architecture
```
webpro-portfolio/
├── apps/storefront/           # el sitio
│   └── src/
│       ├── lib/site.js        # contenido (fuente principal)
│       ├── lib/whatsapp.js    # buildWaMe()
│       ├── lib/cms.js         # conexión opcional al CMS
│       └── styles/            # tokens + base + blocks
├── cms/                       # (opcional) API + admin
├── packages/cms-sdk/          # (opcional) SDK fetch agnóstico
└── .webprocode/               # config + memory-bank + sessions
```

## Conventions
- BEM: `block__element--modifier`, un archivo por bloque.
- Tokens solo en `tokens.css`; los bloques usan `var(--token)`.
- API: `routes → services → db` (si hay CMS).
- Secretos solo en `cms/api/.env`; nunca en el cliente.
- Commits: conventional commits.

## Dev Workflow
```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
```

## Integrations
- WhatsApp: `https://wa.me/<E.164>` con mensaje prellenado (`buildWaMe`).
- CMS (opcional): `WEBPRO_CMS_URL` en `.env`; si no responde, el build usa `site.js`.

## Key Decisions
- Stack `astro` elegido en `webprocode init`.
- Contenido centralizado en un solo archivo (`site.js`) para que sea reemplazable.
- Sitio estático: máximo rendimiento, sin dependencia del CMS en producción.
