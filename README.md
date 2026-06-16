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

### GitHub Actions (optional)

After merge to `main`, CI can ping Google Search Console automatically when these
**repository secrets** are set (Settings → Secrets and variables → Actions):

| Secret | Required | Description |
|--------|----------|-------------|
| `GSC_SERVICE_ACCOUNT_JSON` | Yes | Full service account key JSON (single line) |
| `GSC_SITE_URL` | No | e.g. `sc-domain:pppoker.mn` — auto-detected if omitted |

When `GSC_SERVICE_ACCOUNT_JSON` is missing, the GSC job is skipped entirely.

On each push to `main` with the secret configured, CI will:

1. Verify API access (`npm run gsc:test`)
2. Submit `https://pppoker.mn/sitemap.xml` (`npm run gsc:sitemap`)
3. Export a 28-day analytics snapshot as a workflow artifact (`gsc-export`)
