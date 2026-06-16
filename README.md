# pppoker.mn

Baatryn Öröö poker club marketing site (Vite, vanilla JS, MN/EN/RU/ZH).

## Commands

```bash
npm install
npm run dev          # port 5173
npm run build        # dist/
npm run articles:build
npm run images:compress
npm run slider:prepare
```

## Google Search Console

1. Copy `.env.example` → `.env` and set `GSC_SERVICE_ACCOUNT_JSON`.
2. Grant the service account access in [Google Search Console](https://search.google.com/search-console).
3. Run:

```bash
npm run gsc:test
npm run gsc:export
npm run gsc:sitemap
```

See `scripts/gsc.mjs` for all commands.
