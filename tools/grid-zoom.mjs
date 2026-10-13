import sharp from 'sharp'
const [x0, y0, w, h, z, out] = process.argv.slice(2).map((v, i) => (i < 5 ? +v : v))
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w * z}" height="${h * z}">`
const step = w > 400 ? 50 : 20
for (let x = Math.ceil(x0 / step) * step; x < x0 + w; x += step) svg += `<line x1="${(x - x0) * z}" y1="0" x2="${(x - x0) * z}" y2="${h * z}" stroke="#f0f" stroke-opacity=".4"/><text x="${(x - x0) * z + 2}" y="12" fill="#f0f" font-size="11">${x}</text>`
for (let y = Math.ceil(y0 / step) * step; y < y0 + h; y += step) svg += `<line y1="${(y - y0) * z}" x1="0" y2="${(y - y0) * z}" x2="${w * z}" stroke="#0ff" stroke-opacity=".4"/><text y="${(y - y0) * z - 2}" x="2" fill="#0ff" font-size="11">${y}</text>`
svg += '</svg>'
const src = process.env.SRC || 'refs/6.webp'
await sharp(src).extract({ left: x0, top: y0, width: w, height: h }).resize(w * z, h * z, { kernel: 'lanczos3' }).composite([{ input: Buffer.from(svg) }]).png().toFile(out)
