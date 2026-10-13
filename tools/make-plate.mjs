// Builds the clean showcase plate from refs/6.webp: crops the infographic to the product scene and
// paints out the baked-in annotation lines, dots, labels and logo so every callout can be live HTML/SVG.
import sharp from 'sharp'

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const SRC = 'refs/6.webp'
const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true })
const W = info.width, H = info.height
const px = (x, y, c) => data[(y * W + x) * 3 + c]
const mask = new Uint8Array(W * H)
const NX = new Float32Array(W * H), NY = new Float32Array(W * H), SD = new Float32Array(W * H), HAS = new Uint8Array(W * H), DOT = new Uint8Array(W * H)

const seg = (x1, y1, x2, y2, r, test) => {
  const minx = Math.max(0, Math.floor(Math.min(x1, x2) - r)), maxx = Math.min(W - 1, Math.ceil(Math.max(x1, x2) + r))
  const miny = Math.max(0, Math.floor(Math.min(y1, y2) - r)), maxy = Math.min(H - 1, Math.ceil(Math.max(y1, y2) + r))
  const dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy || 1, len = Math.sqrt(l2) || 1
  for (let y = miny; y <= maxy; y++) for (let x = minx; x <= maxx; x++) {
    const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / l2))
    const d = Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy))
    if (d <= 4.4 || (d <= r && test(x, y))) { mask[y * W + x] = 1; { const nx = l2 > 1 ? -dy / len : 0, ny = l2 > 1 ? dx / len : 1; NX[y * W + x] = nx; NY[y * W + x] = ny; SD[y * W + x] = (x - (x1 + t * dx)) * nx + (y - (y1 + t * dy)) * ny; HAS[y * W + x] = 1; DOT[y * W + x] = l2 > 1 ? 0 : 1 } }
  }
}
const dark = (x, y) => Math.max(px(x, y, 0), px(x, y, 1), px(x, y, 2)) < 200          // black ink on light surfaces / yellow
const light = (x, y) => Math.min(px(x, y, 0), px(x, y, 1), px(x, y, 2)) > 120          // white ink on the dark floor
const dotR = 7

// polylines measured from the reference (px in the 1254² source)
const lines = [
  [[291, 387], [317, 387], [405, 535]],                 // soft-touch cushions
  [[255, 695], [387, 695], [531, 757]],                 // built-in microphone
  [[991, 204], [954, 204], [880, 261]],                 // premium materials
  [[1000, 455], [975, 455], [865, 601]],                // wireless
  [[330, 182], [507, 182]],                             // adjustable headband
  [[672, 697], [988, 703]],                             // physical controls
]
for (const pl of lines) for (let i = 0; i < pl.length - 1; i++) seg(...pl[i], ...pl[i + 1], 4, dark)
for (const [x, y] of [[405, 535], [531, 757], [880, 261], [865, 601], [507, 182], [672, 697], [291, 387], [255, 695], [991, 204], [1000, 455]]) seg(x, y, x, y, dotR, dark)
// charging port callout (white line on the dark floor, black dot on the port)
seg(675, 830, 745, 871, 4.5, (x, y) => light(x, y) || dark(x, y))
seg(745, 871, 800, 872, 4.5, light)
seg(675, 830, 675, 830, dotR, dark); seg(800, 872, 800, 872, dotR, light)

// text blocks (dark ink on yellow; light ink on the floor)
const box = (x0, y0, x1, y1, test) => { for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (test(x, y)) mask[y * W + x] = 1 }
const onYellow = (x, y) => px(x, y, 1) < 175
for (const b of [[100, 165, 335, 245], [50, 370, 296, 445], [55, 678, 258, 735], [996, 185, 1215, 270], [1000, 435, 1215, 515], [992, 685, 1200, 765]]) box(...b, onYellow)
box(805, 852, 985, 930, (x, y) => px(x, y, 0) + px(x, y, 1) + px(x, y, 2) > 200)
box(38, 36, 255, 84, (x, y) => px(x, y, 1) < 175)                       // VYRO logo
box(895, 38, 1215, 66, (x, y) => px(x, y, 1) < 175)                      // "premium wireless headphones" tag

const yellowBoxes = [[100, 165, 335, 245], [50, 370, 296, 445], [55, 678, 258, 735], [996, 185, 1215, 270], [1000, 435, 1215, 515], [992, 685, 1200, 765], [38, 36, 255, 84], [895, 38, 1215, 66]]
const smoothFill = []
for (const [x0, y0, x1, y1] of yellowBoxes) {
  const med = (x, y) => { const v = []; for (let j = -5; j <= 5; j++) for (let c = 0; c < 3; c++) v.push(px(x, Math.min(H - 1, Math.max(0, y + j)), c) + c * 1000); const a = [[], [], []]; v.forEach((t) => a[Math.floor(t / 1000)].push(t % 1000)); return a.map((q) => q.sort((p, r) => p - r)[Math.floor(q.length / 2)]) }
  smoothFill.push([x0, y0, x1, y1, med])
}
// grow the mask a little (anti-aliased edges)
const grow = (m, r) => { const o = new Uint8Array(m); for (let y = r; y < H - r; y++) for (let x = r; x < W - r; x++) { if (m[y * W + x]) continue; let hit = 0; for (let j = -r; j <= r && !hit; j++) for (let i = -r; i <= r; i++) if (m[(y + j) * W + x + i]) { hit = 1; break } o[y * W + x] = hit } return o }
let m = grow(mask, 3)

// normalised-convolution inpaint: fill masked pixels from valid neighbours (multi-scale)
const out = new Float32Array(W * H * 3)
for (let i = 0; i < W * H * 3; i++) out[i] = data[i]
const valid0 = new Float32Array(W * H); for (let i = 0; i < W * H; i++) valid0[i] = m[i] ? 0 : 1
const boxBlur = (src, ch, r) => { // separable box blur on one channel (src is W*H floats)
  const tmp = new Float32Array(W * H), dst = new Float32Array(W * H), k = 2 * r + 1
  for (let y = 0; y < H; y++) { let s = 0; for (let x = -r; x <= r; x++) s += src[y * W + Math.min(W - 1, Math.max(0, x))]; for (let x = 0; x < W; x++) { tmp[y * W + x] = s / k; s += src[y * W + Math.min(W - 1, x + r + 1)] - src[y * W + Math.max(0, x - r)] } }
  for (let x = 0; x < W; x++) { let s = 0; for (let y = -r; y <= r; y++) s += tmp[Math.min(H - 1, Math.max(0, y)) * W + x]; for (let y = 0; y < H; y++) { dst[y * W + x] = s / k; s += tmp[Math.min(H - 1, y + r + 1) * W + x] - tmp[Math.max(0, y - r) * W + x] } }
  return dst
}
const filled = new Uint8Array(W * H); for (let i = 0; i < W * H; i++) filled[i] = m[i] ? 0 : 1
for (const r of [5, 10, 20, 40]) {
  const wb = boxBlur(valid0, 0, r)
  for (let c = 0; c < 3; c++) {
    const ch = new Float32Array(W * H); for (let i = 0; i < W * H; i++) ch[i] = valid0[i] * data[i * 3 + c]
    const cb = boxBlur(ch, c, r)
    for (let i = 0; i < W * H; i++) if (!filled[i] && wb[i] > 0.12) out[i * 3 + c] = cb[i] / wb[i]
  }
  for (let i = 0; i < W * H; i++) if (!filled[i] && boxBlur.length) { /* mark below */ }
  // mark pixels that received a value at this scale
  const wb2 = wb
  for (let i = 0; i < W * H; i++) if (!filled[i] && wb2[i] > 0.12) filled[i] = 1
}
// across-the-line interpolation: each masked pixel is blended between the clean surface 9px either side of the line,
// which keeps gradients and edges continuous (plus a touch of grain so it does not look flat)
{
  const OFF = 9
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) - 0.5
  for (let y = OFF + 2; y < H - OFF - 2; y++) for (let x = OFF + 2; x < W - OFF - 2; x++) {
    const i = y * W + x
    if (!m[i] || !HAS[i] || DOT[i]) continue
    const sd = clamp(SD[i], -OFF + 1, OFF - 1)
    const cx = x - NX[i] * SD[i], cy = y - NY[i] * SD[i]
    const ax = Math.round(cx - NX[i] * OFF), ay = Math.round(cy - NY[i] * OFF)
    const bx = Math.round(cx + NX[i] * OFF), by = Math.round(cy + NY[i] * OFF)
    if (ax < 0 || ay < 0 || bx < 0 || by < 0 || ax >= W || bx >= W || ay >= H || by >= H) continue
    const ai = ay * W + ax, bi = by * W + bx
    if (m[ai] || m[bi]) continue
    const t = (sd + OFF) / (2 * OFF)
    const n = rnd() * 3
    for (let c = 0; c < 3; c++) out[i * 3 + c] = data[ai * 3 + c] * (1 - t) + data[bi * 3 + c] * t + n
  }
}
// dots: copy a clean patch from beside the dot, corrected to the smooth fill so tone stays continuous
{
  const wb = boxBlur(valid0, 0, 8)
  const bl = [0, 1, 2].map((c) => { const ch = new Float32Array(W * H); for (let i = 0; i < W * H; i++) ch[i] = valid0[i] * data[i * 3 + c]; const b = boxBlur(ch, c, 8); for (let i = 0; i < W * H; i++) b[i] = wb[i] > 0.05 ? b[i] / wb[i] : data[i * 3 + c]; return b })
  const cands = [[26, 0], [-26, 0], [0, 26], [0, -26], [20, 20], [-20, -20], [20, -20], [-20, 20], [38, 0], [-38, 0], [0, 38], [0, -38]]
  for (let y = 40; y < H - 40; y++) for (let x = 40; x < W - 40; x++) {
    const i = y * W + x
    if (!m[i] || !DOT[i]) continue
    for (const [ox, oy] of cands) {
      const sx = x + ox, sy = y + oy, si = sy * W + sx
      let ok = !m[si] && !m[si + 6] && !m[si - 6] && !m[si + 6 * W] && !m[si - 6 * W]
      if (!ok) continue
      for (let c = 0; c < 3; c++) out[i * 3 + c] = data[si * 3 + c] - bl[c][si] + out[i * 3 + c]
      break
    }
  }
}
for (const [x0, y0, x1, y1, med] of smoothFill) {
  const xl = Math.max(0, x0 - 14), xr = Math.min(W - 1, x1 + 14)
  for (let y = y0; y < y1; y++) { const L = med(xl, y), R = med(xr, y); for (let x = x0; x < x1; x++) { const t = (x - x0) / (x1 - x0); for (let c = 0; c < 3; c++) out[(y * W + x) * 3 + c] = L[c] * (1 - t) + R[c] * t } }
}
const buf = Buffer.alloc(W * H * 3); for (let i = 0; i < W * H * 3; i++) buf[i] = Math.max(0, Math.min(255, Math.round(out[i])))

// crop to the product scene, then extend the smooth backdrop left/right so the plate can fill any stage width
const crop = { left: 0, top: 62, width: 1254, height: 898 }
const PAD = 380, SCALE = 1.8
const base = await sharp(buf, { raw: { width: W, height: H, channels: 3 } }).extract(crop).png().toBuffer()
const strip = async (left) => sharp(base).extract({ left: left ? 0 : crop.width - 24, top: 0, width: 24, height: crop.height })
  .resize(1, crop.height, { fit: 'fill' }).blur(1.5).resize(PAD, crop.height, { fit: 'fill', kernel: 'nearest' }).png().toBuffer()
const [L, R] = [await strip(true), await strip(false)]
const wide = await sharp({ create: { width: crop.width + 2 * PAD, height: crop.height, channels: 3, background: '#000' } })
  .composite([{ input: L, left: 0, top: 0 }, { input: base, left: PAD, top: 0 }, { input: R, left: PAD + crop.width, top: 0 }]).png().toBuffer()
const outW = Math.round((crop.width + 2 * PAD) * SCALE)
await sharp(wide).resize({ width: outW, kernel: 'lanczos3' }).sharpen({ sigma: 0.9, m1: 0.6, m2: 1.2 }).webp({ quality: 84 }).toFile('public/img/showcase.webp')
await sharp(wide).resize({ width: 2400, kernel: 'lanczos3' }).sharpen({ sigma: 0.8, m1: 0.6, m2: 1.1 }).webp({ quality: 82 }).toFile('public/img/showcase-m.webp')
console.log('plate ok', outW, Math.round(crop.height * SCALE))
