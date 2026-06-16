import { readdir, stat, unlink } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const imagesDir = join(root, 'public', 'images')

const SLIDE_WIDTH = 1600
const SLIDE_HEIGHT = 900
const SLIDE_BG = { r: 10, g: 10, b: 15, alpha: 1 }

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function fileSize(path) {
  return (await stat(path)).size
}

const files = (await readdir(imagesDir))
  .filter((f) => f.startsWith('slide-') && (f.endsWith('.png') || f.endsWith('.webp')))
  .sort()

if (!files.length) {
  console.error('No slide-*.png or slide-*.webp files found in public/images/')
  process.exit(1)
}

console.log(`Preparing ${files.length} slider images → ${SLIDE_WIDTH}×${SLIDE_HEIGHT} WebP (16:9, fit contain) …\n`)

let before = 0
let after = 0

for (const file of files) {
  const input = join(imagesDir, file)
  const base = file.replace(/\.(png|webp)$/, '')
  const output = join(imagesDir, `${base}.webp`)
  before += await fileSize(input)

  await sharp(input)
    .resize(SLIDE_WIDTH, SLIDE_HEIGHT, {
      fit: 'contain',
      background: SLIDE_BG,
    })
    .webp({ quality: 85, effort: 6 })
    .toFile(output)

  after += await fileSize(output)

  if (input !== output) {
    await unlink(input)
  }

  console.log(`  ${file} → ${base}.webp`)
}

console.log(`\nTotal: ${formatBytes(before)} → ${formatBytes(after)}`)
