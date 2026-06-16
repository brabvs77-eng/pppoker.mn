const OG_LOCALE = { mn: 'mn_MN', en: 'en_US', zh: 'zh_CN', ru: 'ru_RU' }

export function syncLangInUrl(lang) {
  const url = new URL(window.location.href)
  if (lang === 'mn') {
    url.searchParams.delete('lang')
  } else {
    url.searchParams.set('lang', lang)
  }
  const next = url.pathname + url.search + url.hash
  if (next !== window.location.pathname + window.location.search + window.location.hash) {
    history.replaceState(null, '', next)
  }
}

export function updateOgLocale(lang) {
  const el = document.querySelector('meta[property="og:locale"]')
  if (el) el.content = OG_LOCALE[lang] || OG_LOCALE.mn
}
