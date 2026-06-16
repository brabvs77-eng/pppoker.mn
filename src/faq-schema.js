import { t } from './i18n.js'

const FAQ_COUNT = 11

export function buildFaqSchema(lang) {
  const tr = t(lang)
  const mainEntity = []
  for (let i = 1; i <= FAQ_COUNT; i++) {
    const question = tr.faq[`q${i}`]
    const answer = tr.faq[`a${i}`]
    if (!question || !answer) continue
    mainEntity.push({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity,
  }
}

export function applyFaqSchema(lang) {
  const el = document.getElementById('faqSchema')
  if (!el) return
  el.textContent = `\n  ${JSON.stringify(buildFaqSchema(lang), null, 2).replace(/\n/g, '\n  ')}\n  `
}
