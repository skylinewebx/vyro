// Builds site images from the supplied reference artwork in ./refs (not committed).
//  - hero.webp  : portrait crop of refs/1.webp (UI text/nav excluded)
//  - p01..p16   : the 16 product tiles of refs/2.webp with the baked-in captions painted out
import sharp from 'sharp'

const cols = [[37, 390], [403, 762], [775, 1135], [1148, 1503]]
const rows = [[74, 294], [307, 519], [533, 747], [760, 962]]

// ---- hero
const hero = await sharp('refs/1.webp').extract({ left: 700, top: 82, width: 740, height: 859 }).toBuffer()
await sharp(hero).resize({ width: 1480, kernel: 'lanczos3' }).sharpen({ sigma: 0.8 }).webp({ quality: 86 }).toFile('public/img/hero.webp')
// sample the backdrop colour down the left edge so the page can blend seamlessly
const { data, info } = await sharp(hero).extract({ left: 0, top: 0, width: 6, height: 859 }).raw().toBuffer({ resolveWithObject: true })
const samples = []
for (const y of [10, 200, 430, 650, 840]) {
  let r = 0, g = 0, b = 0
  for (let x = 0; x < 6; x++) { const i = (y * 6 + x) * info.channels; r += data[i]; g += data[i + 1]; b += data[i + 2] }
  samples.push('#' + [r, g, b].map((v) => Math.round(v / 6).toString(16).padStart(2, '0')).join(''))
}
console.log('hero backdrop samples (top→bottom):', samples.join(' '))

// ---- products
// right edge (px from tile left) of each tile's baked-in caption
const textEnd = [124, 108, 100, 118, 108, 100, 108, 112, 118, 107, 108, 112, 110, 112, 100, 114]
let n = 1
for (const [y0, y1] of rows) for (const [x0, x1] of cols) {
  const w = x1 - x0, h = y1 - y0
  const tile = await sharp('refs/2.webp').extract({ left: x0, top: y0, width: w, height: h }).toBuffer()
  // paint out caption (bottom-left) and index number (top-left) by copying clean backdrop above them
  const fix = async (buf, from, to) => {
    const patch = await sharp(buf).extract(from).blur(6).toBuffer()
    const mask = Buffer.from(`<svg width="${to.w}" height="${to.h}"><rect width="${to.w}" height="${to.h}" rx="10" fill="#fff"/></svg>`)
    const soft = await sharp(patch).composite([{ input: await sharp(mask).blur(5).toBuffer(), blend: 'dest-in' }]).png().toBuffer()
    return sharp(buf).composite([{ input: soft, left: to.x, top: to.y }]).toBuffer()
  }
  const pw = textEnd[n - 1] - 8
  let out = await fix(tile, { left: 8, top: h - 176, width: pw, height: 80 }, { x: 8, y: h - 90, w: pw, h: 80 })
  out = await fix(out, { left: 8, top: 44, width: 44, height: 24 }, { x: 8, y: 14, w: 44, h: 24 })
  const id = String(n++).padStart(2, '0')
  await sharp(out).resize({ width: Math.round(w * 2.3), kernel: 'lanczos3' }).sharpen({ sigma: 0.7 }).webp({ quality: 88 }).toFile(`public/img/p/p${id}.webp`)
}
console.log('done')
