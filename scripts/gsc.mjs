#!/usr/bin/env node
/**
 * Google Search Console API helper for pppoker.mn
 *
 * Env:
 *   GSC_SERVICE_ACCOUNT_JSON — service account key JSON (required)
 *   GSC_SITE_URL             — e.g. sc-domain:pppoker.mn (optional, auto-detected)
 *
 * Usage:
 *   node scripts/gsc.mjs test
 *   node scripts/gsc.mjs sites
 *   node scripts/gsc.mjs queries [--days 28] [--limit 50]
 *   node scripts/gsc.mjs pages  [--days 28] [--limit 50]
 *   node scripts/gsc.mjs export [--days 28] [--out knowledge/gsc-export.json]
 *   node scripts/gsc.mjs sitemap submit [--url https://pppoker.mn/sitemap.xml]
 *   node scripts/gsc.mjs sitemap list
 *   node scripts/gsc.mjs index URL [URL...]          # Indexing API (needs enable + Owner)
 *   node scripts/gsc.mjs index-sitemap [--file public/sitemap.xml]
 */
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { google } from 'googleapis'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const SCOPES = {
  read: ['https://www.googleapis.com/auth/webmasters.readonly'],
  write: ['https://www.googleapis.com/auth/webmasters'],
  index: ['https://www.googleapis.com/auth/indexing'],
}

const HELP = `
GSC API — pppoker.mn

Commands:
  test            Check credentials and API access
  sites           List properties available to the service account
  queries         Top search queries (stdout table)
  pages           Top landing pages (stdout table)
  export          Save queries + pages + summary to JSON
  sitemap submit  Ping Google to recrawl sitemap.xml (recommended)
  sitemap list    Show submitted sitemaps and status
  index URL...    Notify Google about URL update (Indexing API)
  index-sitemap   Submit all URLs from local sitemap via Indexing API

Options:
  --days N     Lookback window (default: 28)
  --limit N    Row limit per report (default: 50, max: 25000)
  --out PATH   Export file path (default: knowledge/gsc-export.json)
  --site URL   Override GSC_SITE_URL
  --url URL    Sitemap URL for sitemap submit (default: https://pppoker.mn/sitemap.xml)
  --file PATH  Local sitemap for index-sitemap (default: public/sitemap.xml)
`.trim()

function parseArgs(argv) {
  const args = {
    command: null,
    subcommand: null,
    days: 28,
    limit: 50,
    out: join(root, 'knowledge', 'gsc-export.json'),
    site: null,
    sitemapUrl: 'https://pppoker.mn/sitemap.xml',
    sitemapFile: join(root, 'public', 'sitemap.xml'),
    urls: [],
  }
  const rest = [...argv]
  if (rest.length && !rest[0].startsWith('-')) args.command = rest.shift()
  if (args.command === 'sitemap' && rest.length && !rest[0].startsWith('-')) {
    args.subcommand = rest.shift()
  }

  for (let i = 0; i < rest.length; i++) {
    const a = rest[i]
    if (a === '--days') args.days = Number(rest[++i])
    else if (a === '--limit') args.limit = Number(rest[++i])
    else if (a === '--out') args.out = rest[++i]
    else if (a === '--site') args.site = rest[++i]
    else if (a === '--url') args.sitemapUrl = rest[++i]
    else if (a === '--file') args.sitemapFile = rest[++i]
    else if (a === '--help' || a === '-h') args.command = 'help'
    else if (a.startsWith('http')) args.urls.push(a)
  }
  return args
}

function loadCredentials() {
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON
  if (!raw) {
    throw new Error('GSC_SERVICE_ACCOUNT_JSON is not set')
  }
  let info
  try {
    info = JSON.parse(raw)
  } catch {
    throw new Error('GSC_SERVICE_ACCOUNT_JSON is not valid JSON')
  }
  if (info.type !== 'service_account' || !info.client_email || !info.private_key) {
    throw new Error('GSC_SERVICE_ACCOUNT_JSON must be a service account key')
  }
  return info
}

function getAuth(info, scopeKey) {
  return new google.auth.GoogleAuth({
    credentials: info,
    scopes: SCOPES[scopeKey],
  })
}

function getSearchConsole(info, scopeKey = 'read') {
  return google.searchconsole({ version: 'v1', auth: getAuth(info, scopeKey) })
}

function getIndexing(info) {
  return google.indexing({ version: 'v3', auth: getAuth(info, 'index') })
}

function parseSitemapLocs(filePath) {
  const xml = readFileSync(filePath, 'utf8')
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

function dateRange(days) {
  const end = new Date()
  end.setUTCDate(end.getUTCDate() - 3) // GSC final data lag ~2–3 days
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - (days - 1))
  const fmt = (d) => d.toISOString().slice(0, 10)
  return { startDate: fmt(start), endDate: fmt(end) }
}

async function resolveSiteUrl(service, preferred) {
  if (preferred || process.env.GSC_SITE_URL) {
    return preferred || process.env.GSC_SITE_URL
  }
  const { data } = await service.sites.list()
  const entries = data.siteEntry || []
  if (!entries.length) {
    throw new Error('No GSC properties found. Add the service account as a user in Search Console.')
  }
  const match = entries.find((e) => /pppoker/i.test(e.siteUrl || ''))
  return match?.siteUrl || entries[0].siteUrl
}

async function fetchAnalytics(service, siteUrl, { startDate, endDate, dimensions, rowLimit }) {
  const { data } = await service.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions,
      rowLimit,
      dataState: 'final',
      type: 'web',
    },
  })
  return data.rows || []
}

function formatRow(row) {
  const key = (row.keys || []).join(' / ')
  return {
    key,
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0,
  }
}

function printTable(rows, labelHeader) {
  if (!rows.length) {
    console.log('(no data)')
    return
  }
  console.log(`${labelHeader.padEnd(42)} clicks  impr   ctr    pos`)
  console.log('-'.repeat(72))
  for (const r of rows) {
    console.log(
      `${r.key.slice(0, 42).padEnd(42)} ${String(r.clicks).padStart(6)}  ${String(r.impressions).padStart(5)}  ${(r.ctr * 100).toFixed(1).padStart(5)}%  ${r.position.toFixed(1).padStart(5)}`
    )
  }
}

function summarize(rows) {
  return rows.reduce(
    (acc, row) => ({
      clicks: acc.clicks + (row.clicks ?? 0),
      impressions: acc.impressions + (row.impressions ?? 0),
    }),
    { clicks: 0, impressions: 0 }
  )
}

async function cmdTest(service, siteUrl) {
  const info = loadCredentials()
  console.log('Service account:', info.client_email)
  console.log('Site:', siteUrl)

  const { data: sites } = await service.sites.list()
  const entries = sites.siteEntry || []
  console.log(`Sites accessible: ${entries.length}`)
  for (const e of entries) {
    console.log(`  ${e.siteUrl} (${e.permissionLevel})`)
  }

  const range = dateRange(7)
  const rows = await fetchAnalytics(service, siteUrl, {
    ...range,
    dimensions: ['query'],
    rowLimit: 3,
  })
  console.log(`\nSample queries (${range.startDate} → ${range.endDate}):`)
  printTable(rows.map(formatRow), 'query')
  console.log('\nOK — GSC API connection works')
}

async function cmdSites(service) {
  const { data } = await service.sites.list()
  const entries = data.siteEntry || []
  if (!entries.length) {
    console.log('No sites found.')
    return
  }
  for (const e of entries) {
    console.log(`${e.siteUrl}\t${e.permissionLevel}`)
  }
}

async function cmdQueries(service, siteUrl, opts) {
  const range = dateRange(opts.days)
  const rows = await fetchAnalytics(service, siteUrl, {
    ...range,
    dimensions: ['query'],
    rowLimit: opts.limit,
  }).then((r) => r.map(formatRow))
  console.log(`Top queries — ${siteUrl} (${range.startDate} → ${range.endDate})\n`)
  printTable(rows, 'query')
}

async function cmdPages(service, siteUrl, opts) {
  const range = dateRange(opts.days)
  const rows = await fetchAnalytics(service, siteUrl, {
    ...range,
    dimensions: ['page'],
    rowLimit: opts.limit,
  }).then((r) => r.map(formatRow))
  console.log(`Top pages — ${siteUrl} (${range.startDate} → ${range.endDate})\n`)
  printTable(rows, 'page')
}

async function cmdSitemapSubmit(service, siteUrl, opts) {
  await service.sitemaps.submit({
    siteUrl,
    feedpath: opts.sitemapUrl,
  })
  console.log(`Submitted sitemap: ${opts.sitemapUrl}`)
  console.log('Google will recrawl URLs listed in the sitemap (not instant indexing).')
}

async function cmdSitemapList(service, siteUrl) {
  const { data } = await service.sitemaps.list({ siteUrl })
  const entries = data.sitemap || []
  if (!entries.length) {
    console.log('No sitemaps found.')
    return
  }
  for (const s of entries) {
    console.log(`${s.path}`)
    console.log(`  lastSubmitted: ${s.lastSubmitted || '—'}`)
    console.log(`  lastDownloaded: ${s.lastDownloaded || '—'}`)
    console.log(`  pending: ${s.isPending ?? false}`)
    console.log(`  errors: ${s.errors ?? 0}, warnings: ${s.warnings ?? 0}`)
  }
}

async function cmdIndex(info, urls) {
  if (!urls.length) {
    throw new Error('Provide at least one URL: node scripts/gsc.mjs index https://pppoker.mn/...')
  }
  const indexing = getIndexing(info)
  let ok = 0
  for (const url of urls) {
    try {
      const { data } = await indexing.urlNotifications.publish({
        requestBody: { url, type: 'URL_UPDATED' },
      })
      console.log(`OK  ${url}`)
      if (data.urlNotificationMetadata?.latestUpdate?.notifyTime) {
        console.log(`    notifyTime: ${data.urlNotificationMetadata.latestUpdate.notifyTime}`)
      }
      ok++
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message
      console.error(`FAIL ${url}`)
      console.error(`     ${msg}`)
    }
  }
  console.log(`\nIndexed ${ok}/${urls.length} URL(s)`)
  if (ok < urls.length) {
    process.exitCode = 1
  }
}

async function cmdIndexSitemap(info, opts) {
  const urls = parseSitemapLocs(opts.sitemapFile)
  if (!urls.length) {
    throw new Error(`No <loc> entries in ${opts.sitemapFile}`)
  }
  const batch = urls.slice(0, opts.limit)
  console.log(`Submitting ${batch.length} URL(s) from ${opts.sitemapFile}`)
  await cmdIndex(info, batch)
}

async function cmdExport(service, siteUrl, opts) {
  const range = dateRange(opts.days)
  const [queries, pages] = await Promise.all([
    fetchAnalytics(service, siteUrl, { ...range, dimensions: ['query'], rowLimit: opts.limit }),
    fetchAnalytics(service, siteUrl, { ...range, dimensions: ['page'], rowLimit: opts.limit }),
  ])

  const payload = {
    exportedAt: new Date().toISOString(),
    siteUrl,
    dateRange: range,
    summary: summarize([...queries, ...pages]),
    queries: queries.map(formatRow),
    pages: pages.map(formatRow),
  }

  writeFileSync(opts.out, `${JSON.stringify(payload, null, 2)}\n`)
  console.log(`Exported ${payload.queries.length} queries, ${payload.pages.length} pages → ${opts.out}`)
  console.log(`Summary: ${payload.summary.clicks} clicks, ${payload.summary.impressions} impressions`)
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  if (!opts.command || opts.command === 'help') {
    console.log(HELP)
    process.exit(opts.command ? 0 : 1)
  }

  const info = loadCredentials()
  const readService = getSearchConsole(info, 'read')
  const siteUrl = await resolveSiteUrl(readService, opts.site)

  switch (opts.command) {
    case 'test':
      await cmdTest(readService, siteUrl)
      break
    case 'sites':
      await cmdSites(readService)
      break
    case 'queries':
      await cmdQueries(readService, siteUrl, opts)
      break
    case 'pages':
      await cmdPages(readService, siteUrl, opts)
      break
    case 'export':
      await cmdExport(readService, siteUrl, opts)
      break
    case 'sitemap': {
      const writeService = getSearchConsole(info, 'write')
      if (opts.subcommand === 'submit') await cmdSitemapSubmit(writeService, siteUrl, opts)
      else if (opts.subcommand === 'list') await cmdSitemapList(readService, siteUrl)
      else throw new Error('Use: sitemap submit | sitemap list')
      break
    }
    case 'index':
      await cmdIndex(info, opts.urls)
      break
    case 'index-sitemap':
      await cmdIndexSitemap(info, opts)
      break
    default:
      console.error(`Unknown command: ${opts.command}\n\n${HELP}`)
      process.exit(1)
  }
}

main().catch((err) => {
  const msg = err.response?.data?.error?.message || err.message
  console.error('GSC error:', msg)
  process.exit(1)
})
