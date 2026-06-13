import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync, existsSync } from 'fs'

function collectArticleInputs(dir, inputs, prefix) {
  if (!existsSync(dir)) return
  const indexPath = resolve(dir, 'index.html')
  if (existsSync(indexPath)) {
    inputs[`${prefix}articlesIndex`] = indexPath
  }
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    if (!name.isDirectory()) continue
    const htmlPath = resolve(dir, name.name, 'index.html')
    if (existsSync(htmlPath)) {
      inputs[`${prefix}article-${name.name}`] = htmlPath
    }
  }
}

function getArticleInputs() {
  const inputs = {
    main: resolve(__dirname, 'index.html'),
  }
  collectArticleInputs(resolve(__dirname, 'articles'), inputs, '')
  collectArticleInputs(resolve(__dirname, 'en', 'articles'), inputs, 'en-')
  collectArticleInputs(resolve(__dirname, 'ru', 'articles'), inputs, 'ru-')
  collectArticleInputs(resolve(__dirname, 'zh', 'articles'), inputs, 'zh-')
  return inputs
}

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: getArticleInputs(),
    },
  },
})
