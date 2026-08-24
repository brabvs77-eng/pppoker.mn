/**
 * Auto-generates public/sitemap.xml from article translation groups.
 */
import { writeFileSync } from 'fs'
import { join } from 'path'

const SITE = 'https://pppoker.mn'
const LANGS = ['mn', 'en', 'ru', 'zh']
const HUB_PRIORITY = { mn: 0.9, en: 0.85, ru: 0.85, zh: 0.85 }

/** Priority by Source Slug / groupId */
const GROUP_PRIORITY = {
  'online-poker-mongol-2026': 0.9,
  'mongol-poker-sistem': 0.85,
  'mongol-poker-tatah': 0.85,
  '100-bonus-nuhtsul': 0.85,
  'deposit-withdraw-mongol': 0.85,
  'pppoker-klub-vs-betting': 0.85,
  'bluff-poker-mongolia': 0.8,
  'cash-game-mongol': 0.8,
  'poker-terms-mn': 0.8,
  'poker-setgel-zui': 0.75,
  'bankroll-udirdlaga': 0.75,
  'blef-uriag': 0.75,
  'floating-taktik': 0.75,
  'statistik-analiz': 0.75,
}

function articlePath(article) {
  if (article.lang === 'mn') return `/articles/${article.slug}/`
  return `/${article.lang}/articles/${article.slug}/`
}

function articleUrl(article) {
  return `${SITE}${articlePath(article)}`
}

function articlesHubPath(lang) {
  return lang === 'mn' ? '/articles/' : `/${lang}/articles/`
}

function hreflangLinks(group) {
  const lines = []
  for (const lang of LANGS) {
    if (group[lang]) {
      lines.push(`    <xhtml:link rel="alternate" hreflang="${lang}" href="${articleUrl(group[lang])}" />`)
    }
  }
  if (group.mn) {
    lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${articleUrl(group.mn)}" />`)
  }
  return lines.join('\n')
}

function urlEntry(loc, changefreq, priority, extraLines = '', lastmod) {
  const extras = extraLines ? `\n${extraLines}` : ''
  const lastmodLine = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
  return `  <url>
    <loc>${loc}</loc>${lastmodLine}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${extras}
  </url>`
}

function groupLastmod(group) {
  const dates = Object.values(group)
    .map(a => a.fileMtime)
    .filter(Boolean)
  if (!dates.length) return null
  return dates.sort().pop()
}

function homeHreflang() {
  const lines = LANGS.map(lang => {
    const href = lang === 'mn' ? `${SITE}/` : `${SITE}/?lang=${lang}`
    return `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`
  })
  lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/" />`)
  return lines.join('\n')
}

function aboutHreflang() {
  const lines = LANGS.map(lang => {
    const href = lang === 'mn' ? `${SITE}/about/` : `${SITE}/about/?lang=${lang}`
    return `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`
  })
  lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/about/" />`)
  return lines.join('\n')
}

function hubHreflang() {
  return LANGS.map(
    lang =>
      `    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE}${articlesHubPath(lang)}" />`
  ).join('\n')
}

function buildSitemapXml(groups, byLang) {
  const entries = []
  const buildDate = new Date().toISOString().split('T')[0]

  entries.push(
    urlEntry(`${SITE}/`, 'daily', 1.0, homeHreflang(), buildDate)
  )

  entries.push(
    urlEntry(`${SITE}/articles/`, 'weekly', HUB_PRIORITY.mn, `${hubHreflang()}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/articles/" />`, buildDate)
  )

  entries.push(
    urlEntry(`${SITE}/about/`, 'monthly', 0.85, aboutHreflang(), buildDate)
  )

  const sortedGroupIds = [...groups.keys()].sort()
  for (const groupId of sortedGroupIds) {
    const group = groups.get(groupId)
    const priority = GROUP_PRIORITY[groupId] ?? 0.8
    const hreflang = hreflangLinks(group)
    const lastmod = groupLastmod(group)
    if (group.mn) {
      entries.push(urlEntry(articleUrl(group.mn), 'monthly', priority, hreflang, lastmod))
    }
  }

  for (const lang of ['en', 'ru', 'zh']) {
    if (!byLang[lang]?.length) continue
    entries.push(
      urlEntry(`${SITE}${articlesHubPath(lang)}`, 'weekly', HUB_PRIORITY[lang], `${hubHreflang()}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/articles/" />`, buildDate)
    )
  }

  for (const lang of ['en', 'ru', 'zh']) {
    const list = byLang[lang] || []
    for (const article of list.sort((a, b) => a.slug.localeCompare(b.slug))) {
      const group = groups.get(article.groupId)
      const priority = GROUP_PRIORITY[article.groupId] ?? 0.8
      entries.push(urlEntry(articleUrl(article), 'monthly', priority, hreflangLinks(group), article.fileMtime || groupLastmod(group)))
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`
}

export function writeSitemap(groups, byLang, rootDir) {
  const xml = buildSitemapXml(groups, byLang)
  const outPath = join(rootDir, 'public', 'sitemap.xml')
  writeFileSync(outPath, xml)
  const urlCount = (xml.match(/<loc>/g) || []).length
  return { outPath, urlCount }
}
