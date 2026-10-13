// Cuts the real headphone out of the supplied photo (refs/9.webp) -> public/img/headphone-cutout.webp (alpha).
// The photo itself is untouched; this only separates the headphone from its yellow backdrop so it can be turned.
import sharp from 'sharp'
const { data, info } = await sharp('refs/9.webp').removeAlpha().raw().toBuffer({ resolveWithObject: true })
const W = info.width, H = info.height
const px = (x, y, c) => data[(y * W + x) * 3 + c]
const yel = (x, y) => (px(x, y, 0) + px(x, y, 1)) / 2 - px(x, y, 2)   // yellowness: high on the backdrop/table, ~0 on the black headphone
// region the headphone can live in: left of the black wedge, above the table reflection
const clip = (x, y) => y <= 907 && y > 70 && x < Math.min(1175, 1015 + y * 0.445) && x > 400
// backdrop = anything outside the clip, or yellow-ish (also the yellow seen through the arch of the headband)
const outside = new Uint8Array(W * H)
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) outside[y * W + x] = !clip(x, y) || yel(x, y) > 45 ? 1 : 0
const out = Buffer.alloc(W * H * 4)
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = y * W + x, o = i * 4
  if (outside[i]) { continue }                                  // transparent
  // edge pixels (touching the outside) get a soft alpha and the yellow mixed in by the antialiasing removed
  let edge = false
  for (let dy = -2; dy <= 2 && !edge; dy++) for (let dx = -2; dx <= 2; dx++) { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < W && ny < H && outside[ny * W + nx]) { edge = true; break } }
  let a = 1, r = px(x, y, 0), g = px(x, y, 1), b = px(x, y, 2)
  if (edge) {
    let sr = 0, sg = 0, sb = 0, n = 0
    for (let dy = -6; dy <= 6; dy++) for (let dx = -6; dx <= 6; dx++) { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < W && ny < H && outside[ny * W + nx] && yel(nx, ny) > 45) { sr += px(nx, ny, 0); sg += px(nx, ny, 1); sb += px(nx, ny, 2); n++ } }
    const bg = n ? [sr / n, sg / n, sb / n] : [252, 204, 0]
    const ybg = Math.max(30, (bg[0] + bg[1]) / 2 - bg[2])
    a = Math.max(0, Math.min(1, 1 - Math.max(0, (r + g) / 2 - b) / ybg))
    if (a < 0.04) continue
    const k = Math.max(a, 0.2)
    r = Math.max(0, Math.min(255, (r - (1 - a) * bg[0]) / k)); g = Math.max(0, Math.min(255, (g - (1 - a) * bg[1]) / k)); b = Math.max(0, Math.min(255, (b - (1 - a) * bg[2]) / k))
  }
  // soft fade over the last pixels at the table line so the foot melts into the new floor
  if (y > 893) a *= Math.max(0, (907 - y) / 14)
  out[o] = r; out[o + 1] = g; out[o + 2] = b; out[o + 3] = Math.round(a * 255)
}
// trim to the headphone bounds
let x0 = W, x1 = 0, y0 = H, y1 = 0
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (out[(y * W + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y }
console.log('bounds', x0, y0, x1, y1, 'size', x1 - x0 + 1, y1 - y0 + 1)
const full = sharp(out, { raw: { width: W, height: H, channels: 4 } }).extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
await full.clone().webp({ quality: 90, alphaQuality: 100 }).toFile('public/img/headphone-cutout.webp')
await full.clone().png().toFile('tmp/cutout.png')
// preview on yellow and on dark
for (const [name, c] of [['yellow', '#FFD000'], ['dark', '#101010']]) {
  const m = await sharp('tmp/cutout.png').metadata()
  await sharp({ create: { width: m.width, height: m.height, channels: 3, background: c } }).composite([{ input: 'tmp/cutout.png' }]).png().toFile('tmp/cutout-' + name + '.png')
}
