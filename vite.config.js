import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync, existsSync } from 'fs'

function getArticleInputs() {
  const articlesDir = resolve(__dirname, 'articles')
  const inputs = {
    main: resolve(__dirname, 'index.html'),
  }
  if (!existsSync(articlesDir)) return inputs

  const indexPath = resolve(articlesDir, 'index.html')
  if (existsSync(indexPath)) {
    inputs.articlesIndex = indexPath
  }

  for (const name of readdirSync(articlesDir, { withFileTypes: true })) {
    if (!name.isDirectory()) continue
    const htmlPath = resolve(articlesDir, name.name, 'index.html')
    if (existsSync(htmlPath)) {
      inputs[`article-${name.name}`] = htmlPath
    }
  }
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
