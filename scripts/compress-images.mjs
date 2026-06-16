import { readdir, stat, unlink } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const imagesDir = join(root, 'public', 'images')

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function fileSize(path) {
  const { size } = await stat(path)
  return size
}

async function compressSlides() {
  const files = (await readdir(imagesDir)).filter((f) => f.startsWith('slide-') && f.endsWith('.png'))
  let before = 0
  let after = 0

  for (const file of files) {
    const input = join(imagesDir, file)
    const output = join(imagesDir, file.replace(/\.png$/, '.webp'))
    before += await fileSize(input)

    await sharp(input)
      .resize({ width: 1080, withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toFile(output)

    after += await fileSize(output)
    await unlink(input)
    console.log(`  ${file} → ${file.replace(/\.png$/, '.webp')}`)
  }

  return { before, after, count: files.length }
}

async function compressLogo() {
  const input = join(imagesDir, 'logo.png')
  const output = join(imagesDir, 'logo.webp')
  const before = await fileSize(input)

  await sharp(input)
    .resize({ width: 80, withoutEnlargement: true })
    .webp({ quality: 90, effort: 6 })
    .toFile(output)

  const after = await fileSize(output)
  await unlink(input)
  console.log('  logo.png → logo.webp')
  return { before, after }
}

async function compressOgCover() {
  const input = join(imagesDir, 'og-cover.png')
  const output = join(imagesDir, 'og-cover.jpg')
  const before = await fileSize(input)

  await sharp(input)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(output)

  const after = await fileSize(output)
  await unlink(input)
  console.log('  og-cover.png → og-cover.jpg (1200×630)')
  return { before, after }
}

console.log('Compressing images in public/images/ …\n')

const slides = await compressSlides()
const logo = await compressLogo()
const og = await compressOgCover()

const totalBefore = slides.before + logo.before + og.before
const totalAfter = slides.after + logo.after + og.after
const saved = totalBefore - totalAfter
const pct = totalBefore ? ((saved / totalBefore) * 100).toFixed(1) : '0'

console.log('\nSummary:')
console.log(`  Slides (${slides.count}): ${formatBytes(slides.before)} → ${formatBytes(slides.after)}`)
console.log(`  Logo: ${formatBytes(logo.before)} → ${formatBytes(logo.after)}`)
console.log(`  OG cover: ${formatBytes(og.before)} → ${formatBytes(og.after)}`)
console.log(`  Total: ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)} (−${pct}%)`)
