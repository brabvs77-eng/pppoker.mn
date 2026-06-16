#!/usr/bin/env node
/**
 * Renders content/articles/*.md + content/articles/{lang}/*.md
 * → articles/ + {lang}/articles/
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { ARTICLE_I18N, LANG_LABELS } from './article-i18n.js'
import { writeSitemap } from './sitemap.mjs'
import { PLAY_URL, SUPPORT_TELEGRAM } from './site-links.js'
import { FAVICON_HEAD } from './favicon-head.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const contentDir = join(root, 'content', 'articles')
const SITE = 'https://pppoker.mn'

const ARTICLES = []
const GROUPS = new Map()

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { meta: {}, body: raw }
  const meta = {}
  for (const line of match[1].split('\n')) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return { meta, body: match[2].trim() }
}

function inline(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => {
      const ext = u.startsWith('http') && !u.includes('pppoker.mn')
      return `<a href="${u}"${ext ? ' rel="noopener" target="_blank"' : ''}>${t}</a>`
    })
}

function mdToHtml(md) {
  const lines = md.split('\n')
  const out = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('<!--') || line === '---') {
      i++
      continue
    }

    if (line.startsWith('|')) {
      const rows = []
      while (i < lines.length && lines[i].startsWith('|')) {
        rows.push(lines[i])
        i++
      }
      if (rows.length >= 2) {
        const parseRow = r =>
          r
            .split('|')
            .slice(1, -1)
            .map(c => c.trim())
        const header = parseRow(rows[0])
        const bodyRows = rows.slice(2).map(parseRow)
        out.push('<div class="article-table-wrap"><table class="article-table"><thead><tr>')
        header.forEach(h => out.push(`<th>${inline(h)}</th>`))
        out.push('</tr></thead><tbody>')
        bodyRows.forEach(row => {
          out.push('<tr>')
          row.forEach(c => out.push(`<td>${inline(c)}</td>`))
          out.push('</tr>')
        })
        out.push('</tbody></table></div>')
      }
      continue
    }

    if (/^#{1,3} /.test(line)) {
      const level = line.match(/^#+/)[0].length
      const text = line.replace(/^#+\s*/, '')
      const tag = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3'
      const cls = level === 1 ? 'article-title' : level === 2 ? 'article-h2' : 'article-h3'
      out.push(`<${tag} class="${cls}">${inline(text)}</${tag}>`)
      i++
      continue
    }

    if (/^\d+\.\s/.test(line)) {
      out.push('<ol class="article-ol">')
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        out.push(`<li>${inline(lines[i].replace(/^\d+\.\s*/, ''))}</li>`)
        i++
      }
      out.push('</ol>')
      continue
    }

    if (line.startsWith('- ')) {
      out.push('<ul class="article-ul">')
      while (i < lines.length && lines[i].startsWith('- ')) {
        out.push(`<li>${inline(lines[i].slice(2))}</li>`)
        i++
      }
      out.push('</ul>')
      continue
    }

    if (line.trim() === '') {
      i++
      continue
    }

    out.push(`<p>${inline(line)}</p>`)
    i++
  }

  return out.join('\n')
}

function articlePath(article) {
  if (article.lang === 'mn') return `/articles/${article.slug}/`
  return `/${article.lang}/articles/${article.slug}/`
}

function articleUrl(article) {
  return `${SITE}${articlePath(article)}`
}

function homeUrl(lang) {
  return lang === 'mn' ? `${SITE}/` : `${SITE}/?lang=${lang}`
}

function articlesIndexPath(lang) {
  return lang === 'mn' ? '/articles/' : `/${lang}/articles/`
}

function outFilePath(article) {
  const rel = articlePath(article).replace(/^\//, '').replace(/\/$/, '')
  return join(root, rel, 'index.html')
}

function faviconHead() {
  return FAVICON_HEAD
}

function navLogo(home, ariaLabel) {
  return `        <a href="${home}" class="nav-logo" aria-label="${ariaLabel}">
          <img src="/images/logo.png" alt="" class="logo-img" width="40" height="40" />
          <span class="logo-text">BAATRYN ÖRÖÖ</span>
        </a>`
}

function metrikaHead() {
  return `  <script type="text/javascript">
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=109810225', 'ym');
    ym(109810225, 'init', {ssr:true, webvisor:true, clickmap:true, accurateTrackBounce:true, trackLinks:true});
  </script>`
}

function metrikaBody() {
  return `  <noscript><div><img src="https://mc.yandex.ru/watch/109810225" style="position:absolute; left:-9999px;" alt="" /></div></noscript>`
}

function hreflangHead(article) {
  const group = GROUPS.get(article.groupId) || {}
  const lines = []
  const defaultArticle = group.mn || article
  for (const [lang, a] of Object.entries(group)) {
    lines.push(`  <link rel="alternate" hreflang="${lang}" href="${articleUrl(a)}" />`)
  }
  if (group.mn) {
    lines.push(`  <link rel="alternate" hreflang="x-default" href="${articleUrl(defaultArticle)}" />`)
  }
  return lines.join('\n')
}

function mobilePlayNavItem(playLabel) {
  return `          <li class="nav-mobile-play">
            <a href="${PLAY_URL}" class="nav-btn nav-btn--menu" rel="noopener" target="_blank">${playLabel}</a>
          </li>`
}

function langSwitcher(article) {
  const group = GROUPS.get(article.groupId) || {}
  const langs = Object.keys(group).sort((a, b) => (a === 'mn' ? -1 : b === 'mn' ? 1 : a.localeCompare(b)))
  if (langs.length <= 1) return ''

  const t = ARTICLE_I18N[article.lang] || ARTICLE_I18N.mn
  const items = langs
    .map(lang => {
      const a = group[lang]
      const active = lang === article.lang ? ' class="active"' : ''
      return `              <li role="menuitem"><a href="${articlePath(a)}"${active}>${LANG_LABELS[lang] || lang.toUpperCase()}</a></li>`
    })
    .join('\n')

  return `          <div class="lang-switcher" id="langSwitcher">
            <button class="lang-current" id="langBtn" aria-label="${t.langSwitcher.aria}" aria-expanded="false">
              <span id="langLabel">${LANG_LABELS[article.lang] || article.lang.toUpperCase()}</span> ▾
            </button>
            <ul class="lang-menu" id="langMenu" role="menu">
${items}
            </ul>
          </div>`
}

function nav(article) {
  const lang = article.lang
  const t = ARTICLE_I18N[lang] || ARTICLE_I18N.mn
  const home = homeUrl(lang)
  const hash = lang === 'mn' ? '' : `?lang=${lang}`
  return `  <header>
    <nav class="navbar" id="navbar" role="navigation" aria-label="Main navigation">
      <div class="container nav-container">
        ${navLogo(home, t.nav.homeAria)}
        <ul class="nav-links" id="navLinks">
          <li><a href="${home}#games">${t.nav.games}</a></li>
          <li><a href="${home}#features">${t.nav.features}</a></li>
          <li><a href="${articlesIndexPath(lang)}" class="active">${t.nav.articles}</a></li>
          <li><a href="${home}#academy">${t.nav.academy}</a></li>
          <li><a href="${home}#faq">${t.nav.faq}</a></li>
${mobilePlayNavItem(t.nav.play)}
        </ul>
        <div class="nav-right">
${langSwitcher(article)}
          <a href="${PLAY_URL}" class="nav-btn" rel="noopener" target="_blank">${t.nav.play}</a>
        </div>
        <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  </header>`
}

function footer(lang, articles) {
  const t = ARTICLE_I18N[lang] || ARTICLE_I18N.mn
  const articleLinks = articles
    .map(a => `            <li><a href="${articlePath(a)}">${a.listTitle}</a></li>`)
    .join('\n')
  return `  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="nav-logo"><img src="/images/logo.png" alt="" class="logo-img" width="40" height="40" /><span class="logo-text">BAATRYN ÖRÖÖ</span></div>
          <p>${t.footer.brand}</p>
        </div>
        <div class="footer-links">
          <h4>${t.footer.articles}</h4>
          <ul>
${articleLinks}
          </ul>
        </div>
        <div class="footer-links">
          <h4>${t.footer.contact}</h4>
          <ul>
            <li><a href="${SUPPORT_TELEGRAM}" rel="noopener" target="_blank">@BatrynOrooSupport</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>${t.footer.tagline}</p>
      </div>
    </div>
  </footer>`
}

function articlePage(article, langArticles) {
  const { slug, metaTitle, metaDesc, title, html, lang } = article
  const t = ARTICLE_I18N[lang] || ARTICLE_I18N.mn
  const url = articleUrl(article)
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: metaDesc,
    author: { '@type': 'Organization', name: 'Baatryn Öröö' },
    publisher: { '@type': 'Organization', name: 'Baatryn Öröö', url: SITE },
    mainEntityOfPage: url,
    inLanguage: lang,
  })

  const hreflang = hreflangHead(article)
  const ogAlts =
    lang !== 'mn' && GROUPS.get(article.groupId)?.mn
      ? `  <meta property="og:locale:alternate" content="mn_MN" />`
      : lang === 'mn' && GROUPS.get(article.groupId)?.en
        ? `  <meta property="og:locale:alternate" content="en_US" />`
        : ''

  return `<!DOCTYPE html>
<html lang="${t.htmlLang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${metaTitle}</title>
  <meta name="description" content="${metaDesc}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${url}" />
${hreflang}
${faviconHead()}
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Baatryn Öröö" />
  <meta property="og:title" content="${metaTitle}" />
  <meta property="og:description" content="${metaDesc}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:locale" content="${t.ogLocale}" />
${ogAlts}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/src/style.css" />
  <script type="application/ld+json">${jsonLd}</script>
${metrikaHead()}
</head>
<body>
${metrikaBody()}
  <a href="#main-content" class="skip-link">Skip to content</a>
${nav(article)}
  <main id="main-content" class="article-page">
    <div class="container">
      <nav class="article-breadcrumb" aria-label="Breadcrumb">
        <a href="${homeUrl(lang)}">${t.breadcrumb.home}</a> <span>/</span> <a href="${articlesIndexPath(lang)}">${t.breadcrumb.articles}</a> <span>/</span> <span>${title}</span>
      </nav>
      <article class="article-body">
${html}
      </article>
      <div class="article-cta">
        <a href="${PLAY_URL}" class="btn btn-primary" rel="noopener" target="_blank">${t.cta.play}</a>
        <a href="${articlesIndexPath(lang)}" class="btn btn-outline">${t.cta.more}</a>
      </div>
    </div>
  </main>
${footer(lang, langArticles)}
  <script type="module" src="/src/article-page.js"></script>
</body>
</html>`
}

function indexLangSwitcher(currentLang) {
  const hubs = [
    { lang: 'mn', path: '/articles/' },
    { lang: 'en', path: '/en/articles/' },
    { lang: 'ru', path: '/ru/articles/' },
    { lang: 'zh', path: '/zh/articles/' },
  ]
  const t = ARTICLE_I18N[currentLang] || ARTICLE_I18N.mn
  const items = hubs
    .map(({ lang, path }) => {
      const active = lang === currentLang ? ' class="active"' : ''
      return `              <li role="menuitem"><a href="${path}"${active}>${LANG_LABELS[lang]}</a></li>`
    })
    .join('\n')
  return `          <div class="lang-switcher" id="langSwitcher">
            <button class="lang-current" id="langBtn" aria-label="${t.langSwitcher.aria}" aria-expanded="false">
              <span id="langLabel">${LANG_LABELS[currentLang]}</span> ▾
            </button>
            <ul class="lang-menu" id="langMenu" role="menu">
${items}
            </ul>
          </div>`
}

function navForIndex(lang) {
  const t = ARTICLE_I18N[lang] || ARTICLE_I18N.mn
  const home = homeUrl(lang)
  return `  <header>
    <nav class="navbar" id="navbar" role="navigation" aria-label="Main navigation">
      <div class="container nav-container">
        ${navLogo(home, t.nav.homeAria)}
        <ul class="nav-links" id="navLinks">
          <li><a href="${home}#games">${t.nav.games}</a></li>
          <li><a href="${home}#features">${t.nav.features}</a></li>
          <li><a href="${articlesIndexPath(lang)}" class="active">${t.nav.articles}</a></li>
          <li><a href="${home}#academy">${t.nav.academy}</a></li>
          <li><a href="${home}#faq">${t.nav.faq}</a></li>
${mobilePlayNavItem(t.nav.play)}
        </ul>
        <div class="nav-right">
${indexLangSwitcher(lang)}
          <a href="${PLAY_URL}" class="nav-btn" rel="noopener" target="_blank">${t.nav.play}</a>
        </div>
        <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  </header>`
}

function indexPage(lang, articles) {
  const t = ARTICLE_I18N[lang] || ARTICLE_I18N.mn
  const cards = articles
    .map(
      a => `        <a href="${articlePath(a)}" class="article-card">
          <span class="article-card-tag">${t.index.cardTag}</span>
          <h2>${a.title}</h2>
          <p>${a.metaDesc}</p>
          <span class="article-card-link">${t.index.read}</span>
        </a>`
    )
    .join('\n')

  return `<!DOCTYPE html>
<html lang="${t.htmlLang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t.index.metaTitle}</title>
  <meta name="description" content="${t.index.metaDesc}" />
  <link rel="canonical" href="${t.index.canonical}" />
  <link rel="alternate" hreflang="mn" href="https://pppoker.mn/articles/" />
  <link rel="alternate" hreflang="en" href="https://pppoker.mn/en/articles/" />
  <link rel="alternate" hreflang="ru" href="https://pppoker.mn/ru/articles/" />
  <link rel="alternate" hreflang="zh" href="https://pppoker.mn/zh/articles/" />
  <link rel="alternate" hreflang="x-default" href="https://pppoker.mn/articles/" />
${faviconHead()}
  <meta property="og:title" content="${t.index.metaTitle}" />
  <meta property="og:url" content="${t.index.canonical}" />
  <meta property="og:locale" content="${t.ogLocale}" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/src/style.css" />
${metrikaHead()}
</head>
<body>
${metrikaBody()}
  <a href="#main-content" class="skip-link">Skip to content</a>
${navForIndex(lang)}
  <main id="main-content" class="article-page">
    <div class="container">
      <header class="article-index-header">
        <h1 class="article-title">${t.index.title}</h1>
        <p class="article-index-desc">${t.index.desc}</p>
      </header>
      <div class="article-grid">
${cards}
      </div>
    </div>
  </main>
${footer(lang, articles)}
  <script type="module" src="/src/article-page.js"></script>
</body>
</html>`
}

function loadMarkdown(filePath, langOverride) {
  const raw = readFileSync(filePath, 'utf8')
  const { meta, body } = parseFrontmatter(raw)
  const slug = meta.Slug || filePath.split('/').pop().replace('.md', '')
  const lang = langOverride || meta.Language || 'mn'
  const groupId = meta['Source Slug'] || slug
  const h1 = body.match(/^# (.+)$/m)?.[1] || slug
  return {
    slug,
    lang,
    groupId,
    metaTitle: meta['Meta Title'] || h1,
    metaDesc: meta['Meta Description'] || '',
    title: h1,
    listTitle: meta['List Title'] || h1.replace(/\|.*/, '').trim().slice(0, 40),
    html: mdToHtml(body),
  }
}

// Load MN articles (flat files)
for (const file of readdirSync(contentDir).filter(f => f.endsWith('.md') && f !== 'README.md')) {
  ARTICLES.push(loadMarkdown(join(contentDir, file), 'mn'))
}

// Load translated articles (content/articles/{lang}/*.md)
for (const entry of readdirSync(contentDir)) {
  const sub = join(contentDir, entry)
  if (!statSync(sub).isDirectory()) continue
  const lang = entry
  if (!['en', 'ru', 'zh'].includes(lang)) continue
  for (const file of readdirSync(sub).filter(f => f.endsWith('.md'))) {
    ARTICLES.push(loadMarkdown(join(sub, file), lang))
  }
}

// Build translation groups
for (const article of ARTICLES) {
  if (!GROUPS.has(article.groupId)) GROUPS.set(article.groupId, {})
  GROUPS.get(article.groupId)[article.lang] = article
}

const byLang = { mn: [], en: [], ru: [], zh: [] }
for (const article of ARTICLES) {
  if (!byLang[article.lang]) byLang[article.lang] = []
  byLang[article.lang].push(article)
}

let built = 0
for (const article of ARTICLES) {
  const langArticles = byLang[article.lang]
  const outPath = outFilePath(article)
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, articlePage(article, langArticles))
  built++
}

for (const lang of ['mn', 'en', 'ru', 'zh']) {
  const list = byLang[lang]
  if (!list?.length) continue
  const indexOut =
    lang === 'mn' ? join(root, 'articles', 'index.html') : join(root, lang, 'articles', 'index.html')
  mkdirSync(dirname(indexOut), { recursive: true })
  writeFileSync(indexOut, indexPage(lang, list))
}

const enCount = byLang.en?.length || 0
const ruCount = byLang.ru?.length || 0
const zhCount = byLang.zh?.length || 0
const mnCount = byLang.mn?.length || 0
console.log(`Built ${built} article pages (${mnCount} MN + ${enCount} EN + ${ruCount} RU + ${zhCount} ZH)`)

const { outPath: sitemapPath, urlCount } = writeSitemap(GROUPS, byLang, root)
console.log(`Wrote sitemap (${urlCount} URLs) → ${sitemapPath.replace(root + '/', '')}`)
