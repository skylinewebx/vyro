// Interactive 3D black VYRO over-ear headphone (Three.js / WebGL).
// Built from real geometry (swept headband, lathed ear cups and cushions, hinge brackets, buttons, port…),
// proportioned from the supplied front / side / back / top reference views, lit with an image-based
// environment plus a yellow rim light so it belongs to the site's yellow-and-black set.
// A designed GLB/GLTF can replace the procedural model: pass `modelUrl`.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

const V2 = (x, y) => new THREE.Vector2(x, y)
const smooth = (pts, n = 64) => new THREE.SplineCurve(pts.map((p) => V2(p[0], p[1]))).getPoints(n)
const TILT = 0.11            // cups rest slightly splayed — bottoms a touch closer together, as in the front reference

/* ------------------------------------------------------------------ textures */
// tileable leather: creased ridges + fine pebble grain (value noise on a wrapping lattice)
function leatherTexture() {
  const s = 256, c = document.createElement('canvas'); c.width = c.height = s
  const g = c.getContext('2d'), img = g.createImageData(s, s)
  let seed = 23; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const lattice = (n) => Array.from({ length: n * n }, rnd)
  const smoothstep = (t) => t * t * (3 - 2 * t)
  const noise = (L, n, x, y) => {
    const fx = (x / s) * n, fy = (y / s) * n, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = smoothstep(fx - x0), ty = smoothstep(fy - y0)
    const at = (i, j) => L[(((j % n) + n) % n) * n + (((i % n) + n) % n)]
    return (at(x0, y0) * (1 - tx) + at(x0 + 1, y0) * tx) * (1 - ty) + (at(x0, y0 + 1) * (1 - tx) + at(x0 + 1, y0 + 1) * tx) * ty
  }
  const A = lattice(7), B = lattice(14), C = lattice(32), D = lattice(64)
  for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
    const ridge = 1 - Math.abs(noise(A, 7, x, y) * 2 - 1), crease = 1 - Math.abs(noise(B, 14, x, y) * 2 - 1)
    const v = 0.42 * Math.pow(ridge, 3) + 0.3 * Math.pow(crease, 2) + 0.18 * noise(C, 32, x, y) + 0.1 * noise(D, 64, x, y)
    const k = (y * s + x) * 4, p = Math.max(0, Math.min(255, v * 235 + 4))
    img.data[k] = img.data[k + 1] = img.data[k + 2] = p; img.data[k + 3] = 255
  }
  g.putImageData(img, 0, 0)
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(7, 3.6); t.anisotropy = 8
  return t
}
function logoTexture() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 160
  const g = c.getContext('2d'); g.clearRect(0, 0, 512, 160)
  g.font = '500 108px "Unbounded", "Manrope", Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'
  g.fillStyle = '#a2a2a9'; if ('letterSpacing' in g) g.letterSpacing = '7px'
  g.fillText('VYRO', 256, 84)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8
  return t
}
function shadowTexture() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256
  const g = c.getContext('2d')
  const blob = (cx, cy, rx, ry, a) => { g.save(); g.translate(cx, cy); g.scale(rx, ry); const r = g.createRadialGradient(0, 0, 0, 0, 0, 1); r.addColorStop(0, `rgba(0,0,0,${a})`); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.beginPath(); g.arc(0, 0, 1, 0, Math.PI * 2); g.fill(); g.restore() }
  blob(256, 128, 236, 78, 0.5)
  blob(158, 128, 76, 62, 0.9); blob(354, 128, 76, 62, 0.9)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
}

/* ------------------------------------------------------------------ studio environment
   What the glossy parts reflect: the site's yellow wall, a black panel on the right (the wedge), a dark table and a large softbox —
   so edges pick up the same yellow bounce that the photograph shows. */
function makeStudio() {
  const s = new THREE.Scene()
  const dome = new THREE.Mesh(new THREE.SphereGeometry(60, 64, 40), new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide }))
  const pos = dome.geometry.attributes.position, col = []
  const lo = new THREE.Color('#c99a00'), hi = new THREE.Color('#ffd000'), tmp = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / 60
    if (y > 0) tmp.copy(lo).lerp(hi, Math.min(1, y * 2.4)).multiplyScalar(1.15 + y * 0.5)
    else tmp.set('#1a1203').multiplyScalar(0.5 + (1 + y) * 0.3)
    col.push(tmp.r, tmp.g, tmp.b)
  }
  dome.geometry.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); s.add(dome)
  const panel = (w, h, p, color, k) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }))
    m.position.set(...p); m.lookAt(0, 6, 0); s.add(m)
  }
  panel(36, 24, [-26, 32, 26], '#ffffff', 8)        // large softbox, upper left / front
  panel(12, 46, [36, 12, -18], '#ffe066', 4)        // tall yellow strip behind right
  panel(46, 46, [50, 12, 8], '#000000', 1)          // black panel on the right
  panel(34, 16, [0, 7, -48], '#fff2c0', 2.4)        // soft back light
  return s
}

/* ------------------------------------------------------------------ geometry helpers */
function rrProfile(w, h, r, seg = 5) {
  const pts = [], hw = w / 2, hh = h / 2
  for (const [cx, cy, a0] of [[hw - r, hh - r, 0], [-hw + r, hh - r, Math.PI / 2], [-hw + r, -hh + r, Math.PI], [hw - r, -hh + r, 1.5 * Math.PI]])
    for (let k = 0; k <= seg; k++) { const a = a0 + (k / seg) * (Math.PI / 2); pts.push(V2(cx + Math.cos(a) * r, cy + Math.sin(a) * r)) }
  return pts
}
function ellipseSamples(cx, cy, rx, ry, t0, t1, n) {
  const out = []
  for (let i = 0; i <= n; i++) {
    const t = t0 + ((t1 - t0) * i) / n
    out.push({ p: new THREE.Vector3(cx + rx * Math.cos(t), cy + ry * Math.sin(t), 0), n: new THREE.Vector3(ry * Math.cos(t), rx * Math.sin(t), 0).normalize() })
  }
  return out
}
function sweep(samples, profile, offset = 0) {
  const pos = [], idx = [], m = profile.length
  for (const s of samples) for (const q of profile) pos.push(s.p.x + s.n.x * (q.y + offset), s.p.y + s.n.y * (q.y + offset), s.p.z + q.x)
  for (let i = 0; i < samples.length - 1; i++) for (let j = 0; j < m; j++) {
    const a = i * m + j, b = i * m + ((j + 1) % m), c = (i + 1) * m + j, d = (i + 1) * m + ((j + 1) % m)
    idx.push(a, c, b, b, c, d)
  }
  for (const [ring, flip] of [[0, false], [samples.length - 1, true]]) {
    const centre = pos.length / 3; let cx = 0, cy = 0, cz = 0
    for (let j = 0; j < m; j++) { const k = (ring * m + j) * 3; cx += pos[k]; cy += pos[k + 1]; cz += pos[k + 2] }
    pos.push(cx / m, cy / m, cz / m)
    for (let j = 0; j < m; j++) { const a = ring * m + j, b = ring * m + ((j + 1) % m); flip ? idx.push(centre, b, a) : idx.push(centre, a, b) }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals()
  return g
}

/* ------------------------------------------------------------------ the headphone */
export function buildHeadphone(env) {
  const root = new THREE.Group()
  const disposables = []
  const track = (o) => (disposables.push(o), o)
  const grain = track(leatherTexture())
  const D = THREE.DoubleSide
  const M = {
    plastic: track(new THREE.MeshPhysicalMaterial({ color: 0x1b1b1f, roughness: 0.6, metalness: 0.02, clearcoat: 0.1, clearcoatRoughness: 0.6, side: D, envMap: env, envMapIntensity: 0.4 })),
    face: track(new THREE.MeshPhysicalMaterial({ color: 0x232327, roughness: 0.52, metalness: 0.03, clearcoat: 0.1, clearcoatRoughness: 0.5, side: D, envMap: env, envMapIntensity: 0.22 })),
    leather: track(new THREE.MeshPhysicalMaterial({ color: 0x1c1c1f, roughness: 0.6, metalness: 0, bumpMap: grain, bumpScale: 0.65, sheen: 0.5, sheenColor: new THREE.Color(0x2e2e35), sheenRoughness: 0.5, side: D, envMap: env, envMapIntensity: 0.28 })),
    pad: track(new THREE.MeshPhysicalMaterial({ color: 0x1c1c1f, roughness: 0.62, metalness: 0, bumpMap: grain, bumpScale: 0.45, sheen: 0.4, sheenColor: new THREE.Color(0x202026), sheenRoughness: 0.6, side: D, envMap: env, envMapIntensity: 0.28 })),
    metal: track(new THREE.MeshStandardMaterial({ color: 0x8d8d95, metalness: 1, roughness: 0.34, side: D, envMap: env, envMapIntensity: 0.38 })),
    darkMetal: track(new THREE.MeshStandardMaterial({ color: 0x202024, metalness: 0.85, roughness: 0.42, side: D, envMap: env, envMapIntensity: 0.4 })),
    fabric: track(new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 1, side: D })),
    rubber: track(new THREE.MeshStandardMaterial({ color: 0x0b0b0d, roughness: 0.85, side: D })),
  }
  const add = (geo, mat, parent = root) => { track(geo); const m = new THREE.Mesh(geo, mat); parent.add(m); return m }

  /* headband: plastic band + soft underside pad + dark slider blocks and metal collars at the ends */
  const cx = 0, cy = 4.3, rx = 9.1, ry = 11.3
  add(sweep(ellipseSamples(cx, cy, rx, ry, 0.3, Math.PI - 0.3, 100), rrProfile(3.3, 1.3, 0.55)), M.plastic)
  add(sweep(ellipseSamples(cx, cy, rx, ry, 0.42, Math.PI - 0.42, 90), rrProfile(2.8, 0.85, 0.38), -1.05), M.pad)
  for (const [a, b] of [[0.0, 0.42], [Math.PI - 0.42, Math.PI]]) add(sweep(ellipseSamples(cx, cy, rx, ry, a, b, 12), rrProfile(2.7, 1.05, 0.32), -0.15), M.darkMetal)
  for (const [a, b] of [[0.3, 0.37], [Math.PI - 0.37, Math.PI - 0.3]]) add(sweep(ellipseSamples(cx, cy, rx, ry, a, b, 4), rrProfile(3.0, 1.2, 0.5), -0.05), M.darkMetal)

  /* ear cups — each hangs from a pivot at the band end and rests a few degrees splayed */
  for (const side of [1, -1]) {
    const pivot = new THREE.Group(); pivot.position.set(side * 9.1, 4.3, 0); pivot.rotation.z = -side * TILT; root.add(pivot)
    const cup = new THREE.Group(); cup.position.set(-side * 0.9, -4.3, 0); pivot.add(cup)
    const local = new THREE.Group(); local.scale.set(1.1, 1, 0.94); local.rotation.z = (-side * Math.PI) / 2; cup.add(local)

    const shell = smooth([[0, 1.28], [1.0, 1.285], [2.0, 1.25], [2.9, 1.17], [3.55, 1.03], [3.98, 0.78], [4.2, 0.4], [4.25, 0], [4.22, -0.55], [4.05, -1.0], [3.7, -1.25]], 80)
    shell.push(V2(3.2, -1.3), V2(0, -1.3))
    const sg = new THREE.LatheGeometry(shell, 120); sg.computeVertexNormals(); add(sg, M.plastic, local)
    const capPts = shell.filter((p) => p.x <= 3.5 && p.y > 0.9)
    const cg = new THREE.LatheGeometry(capPts, 120); cg.computeVertexNormals(); add(cg, M.face, local).scale.setScalar(1.004)
    const ring = add(new THREE.TorusGeometry(3.62, 0.035, 10, 150), M.darkMetal, local); ring.rotation.x = Math.PI / 2; ring.position.y = 1.09

    const cush = smooth([[3.3, -1.28], [4.0, -1.3], [4.42, -1.55], [4.56, -2.05], [4.54, -2.8], [4.3, -3.4], [3.85, -3.75], [3.2, -3.86], [2.7, -3.72], [2.4, -3.35], [2.3, -2.8], [2.38, -2.1], [2.68, -1.55], [3.0, -1.3]], 100)
    const kg = new THREE.LatheGeometry(cush, 120); kg.computeVertexNormals(); add(kg, M.leather, local)
    const dish = smooth([[0, -3.0], [1.1, -2.95], [1.8, -2.75], [2.15, -2.4]], 20)
    const dg = new THREE.LatheGeometry(dish, 64); dg.computeVertexNormals(); add(dg, M.fabric, local)
    const seam = add(new THREE.TorusGeometry(3.95, 0.03, 8, 150), M.darkMetal, local); seam.rotation.x = Math.PI / 2; seam.position.y = -1.34

    const logoMat = track(new THREE.MeshStandardMaterial({ map: logoTexture(), transparent: true, roughness: 0.35, metalness: 0.7, depthWrite: false, envMap: env }))
    const logo = add(new THREE.PlaneGeometry(2.8, 0.88), logoMat, cup)
    logo.position.set(side * 1.3, -0.35, side * -0.95); logo.rotation.y = (side * Math.PI) / 2
    disposables.push(logoMat.map)

    // hinge bracket + pivot pin (sits in the pivot frame, so it stays joined to the band as the cup tilts)
    const yoke = add(new RoundedBoxGeometry(1.1, 2.4, 2.9, 4, 0.36), M.darkMetal, pivot); yoke.position.set(-side * 0.1, 0.3, 0)
    const pin = add(new THREE.CylinderGeometry(0.62, 0.62, 0.4, 36), M.metal, pivot); pin.rotation.z = Math.PI / 2; pin.position.set(side * 0.2, -0.45, 0)

    if (side === 1) {                                              // controls + charging port, right cup only
      const bz = (y) => 3.47 * 0.84 * Math.sqrt(1 - (y / 4.23) ** 2) * 1.0 + 0.14
      for (const [y, h] of [[1.55, 0.9], [0.35, 0.9], [-0.9, 0.9]]) {
        const b = add(new RoundedBoxGeometry(0.62, h, 0.5, 4, 0.2), M.darkMetal, cup); b.position.set(-0.15, y, bz(y))
        const ridge = add(new THREE.BoxGeometry(0.34, 0.05, 0.04), M.metal, cup); ridge.position.set(-0.15, y, bz(y) + 0.26)
      }
      const port = add(new RoundedBoxGeometry(0.95, 0.3, 0.34, 3, 0.12), M.rubber, cup); port.position.set(-0.15, -2.35, bz(-2.35) - 0.04)
      const led = add(new THREE.SphereGeometry(0.055, 12, 12), M.rubber, cup); led.position.set(-0.15, -1.75, bz(-1.75))
    }
  }
  // rest the headphone on the floor (y = 0)
  root.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(root)
  root.position.y -= box.min.y
  return { root, size: box.getSize(new THREE.Vector3()), dispose: () => disposables.forEach((d) => d && d.dispose && d.dispose()) }
}

/* ------------------------------------------------------------------ viewer */
export async function createViewer({ container, reduced = false, modelUrl = null, getBaseFrac = () => 0.78, onInteract = () => {}, onReady = () => {}, onLost = () => {} }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  const coarse = window.matchMedia('(pointer: coarse)').matches
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.6 : 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.12
  const canvas = renderer.domElement
  Object.assign(canvas.style, { width: '100%', height: '100%', display: 'block', touchAction: 'pan-y', cursor: 'grab', outline: 'none' })
  container.appendChild(canvas)

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envScene = makeStudio()
  const envTex = pmrem.fromScene(envScene, 0.04).texture
  scene.environment = envTex
  if ('environmentIntensity' in scene) scene.environmentIntensity = 1.0

  const key = new THREE.DirectionalLight(0xffffff, 2.3); key.position.set(-18, 26, 24); scene.add(key)
  const rim = new THREE.DirectionalLight(0xffc900, 0.9); rim.position.set(24, 9, -22); scene.add(rim)
  const rim2 = new THREE.DirectionalLight(0xffd54a, 0.4); rim2.position.set(-26, 6, -16); scene.add(rim2)
  const fill = new THREE.DirectionalLight(0xffffff, 0.8); fill.position.set(14, 6, 28); scene.add(fill)
  const top = new THREE.DirectionalLight(0xffffff, 0.9); top.position.set(0, 44, 8); scene.add(top)

  // model (+ a dim mirrored copy under the floor line for the glossy-table reflection)
  let model, modelDispose = () => {}, modelHeight = 20
  if (modelUrl) {
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
    const gltf = await new GLTFLoader().loadAsync(modelUrl)
    model = gltf.scene
    const bb = new THREE.Box3().setFromObject(model), size = bb.getSize(new THREE.Vector3()), mid = bb.getCenter(new THREE.Vector3())
    const s = 20 / Math.max(size.x, size.y, size.z); model.scale.setScalar(s)
    model.position.set(-mid.x * s, -bb.min.y * s, -mid.z * s)
    modelDispose = () => model.traverse((o) => { o.geometry && o.geometry.dispose(); const m = o.material; (Array.isArray(m) ? m : [m]).forEach((x) => x && x.dispose()) })
  } else {
    const hp = buildHeadphone(envTex); model = hp.root; modelDispose = hp.dispose; modelHeight = hp.size.y
  }
  scene.add(model)
  const mirror = new THREE.Group(); mirror.scale.y = -1
  const mclone = model.clone(true); mirror.add(mclone); scene.add(mirror)
  const reflMats = []
  mclone.traverse((o) => { if (o.isMesh) { const m = o.material.clone(); m.transparent = true; m.opacity = 0.34; m.depthWrite = false; o.material = m; reflMats.push(m) } })

  const shTex = shadowTexture()
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(27, 14), new THREE.MeshBasicMaterial({ map: shTex, transparent: true, depthWrite: false, opacity: 0.9 }))
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.02; scene.add(shadow)

  // camera (orbits the headphone; the base is pinned to the floor line of the page)
  const camera = new THREE.PerspectiveCamera(19, 1, 1, 600)
  const target = new THREE.Vector3(0, modelHeight * 0.46, 0)
  let theta = 1.0, phi = 1.62, radius = 60, W = 1, H = 1, baseFrac = 0.78, vTheta = 0
  let camHeight = 3.2      // camera sits just above the table: with a high camera the near cup dips and the far cup rises as it turns (a see-saw)
  const fit = () => {
    W = container.clientWidth || 1; H = container.clientHeight || 1
    renderer.setSize(W, H, false); camera.aspect = W / H
    baseFrac = getBaseFrac() || 0.78
    const halfV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), halfH = halfV * camera.aspect
    radius = Math.max((modelHeight * 1.08) / (2 * halfV * baseFrac * 0.94), (21 * 0.94) / (2 * halfH * 0.9))
    phi = Math.acos(THREE.MathUtils.clamp((camHeight - target.y) / radius, -1, 1))
  }
  const tmp = new THREE.Vector3()
  const place = () => {
    camera.position.set(target.x + radius * Math.sin(phi) * Math.sin(theta), target.y + radius * Math.cos(phi), target.z + radius * Math.sin(phi) * Math.cos(theta))
    camera.lookAt(target)
    camera.clearViewOffset(); camera.updateProjectionMatrix(); camera.updateMatrixWorld(true)
    const ndc = tmp.set(0, 0, 0).project(camera).y                       // where the floor point under the headphone lands
    const down = (ndc - (1 - 2 * baseFrac)) * (H / 2)                     // pixels to slide the picture so it lands on the page's floor line
    camera.setViewOffset(W, H, 0, -down, W, H)
  }
  fit()

  // interaction
  let dragging = false, lastX = 0, lastY = 0, lastT = 0, idle = 0, auto = 0, visible = true, raf = 0, last = performance.now(), told = false
  const AUTO = 0.17            // rad/s ≈ one slow turn every 37 s
  const touched = () => { if (!told) { told = true; onInteract() } }
  const down = (e) => { dragging = true; idle = 0; auto = 0; lastX = e.clientX; lastY = e.clientY; lastT = performance.now(); vTheta = 0; canvas.style.cursor = 'grabbing'; try { canvas.setPointerCapture(e.pointerId) } catch {} }
  const move = (e) => {
    if (!dragging) return
    const now = performance.now(), dt = Math.max(1, now - lastT) / 1000
    const dx = e.clientX - lastX, dTheta = -dx * 0.0085
    theta += dTheta; vTheta = THREE.MathUtils.lerp(vTheta, dTheta / dt, 0.4)
    lastX = e.clientX; lastY = e.clientY; lastT = now; touched()
  }
  const up = (e) => { dragging = false; canvas.style.cursor = 'grab'; try { canvas.releasePointerCapture(e.pointerId) } catch {} ; vTheta = THREE.MathUtils.clamp(vTheta, -6, 6) }
  const key_ = (e) => {
    const k = { ArrowLeft: [-0.18, 0], ArrowRight: [0.18, 0] }[e.key]
    if (!k) return
    e.preventDefault(); theta += k[0]; idle = 0; auto = 0; touched()
  }
  canvas.tabIndex = 0
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); onLost() })
  canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move)
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up); canvas.addEventListener('keydown', key_)

  let frames = 0
  const update = (dt) => {
    if (dragging) { idle = 0; auto = 0 }
    else {
      theta += vTheta * dt; vTheta *= Math.pow(0.04, dt)                      // inertia that eases out
      idle += dt
      if (!reduced && idle > 1.8) { auto = Math.min(1, auto + dt * 0.5); theta += AUTO * auto * dt }   // gentle resume
    }
  }
  const tick = (now) => { frames++; update(Math.min(0.05, (now - last) / 1000)); last = now; place(); renderer.render(scene, camera) }
  const loop = () => { raf = requestAnimationFrame((t) => { tick(t); if (visible) loop() }) }
  const setVisible = (v) => { visible = v && !document.hidden; cancelAnimationFrame(raf); if (visible) { last = performance.now(); loop() } }
  const onVis = () => setVisible(visible || !document.hidden)
  document.addEventListener('visibilitychange', onVis)
  const ro = new ResizeObserver(() => { fit(); place(); renderer.render(scene, camera) })
  ro.observe(container)
  if (import.meta.env.DEV) window.__vy = { get theta() { return theta }, set theta(v) { theta = v }, get phi() { return phi }, set camHeight(v) { camHeight = v; fit() }, feetY() { const f = (x) => (1 - tmp.set(x, 0, 0).project(camera).y) / 2 * H; return [f(6.6), f(-6.6)] }, topY() { return (1 - tmp.set(0, modelHeight, 0).project(camera).y) / 2 * H }, get auto() { return auto }, get radius() { return radius }, get frames() { return frames }, get dragging() { return dragging }, advance(sec) { for (let t = 0; t < sec; t += 1 / 60) update(1 / 60); place(); renderer.render(scene, camera) }, render() { place(); renderer.render(scene, camera) } }

  place(); renderer.render(scene, camera); setVisible(true); onReady()

  return {
    setVisible,
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); document.removeEventListener('visibilitychange', onVis)
      canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up); canvas.removeEventListener('keydown', key_)
      modelDispose(); reflMats.forEach((m) => m.dispose()); shadow.geometry.dispose(); shadow.material.dispose(); shTex.dispose()
      envTex.dispose(); pmrem.dispose(); envScene.traverse((o) => { o.geometry && o.geometry.dispose(); o.material && o.material.dispose && o.material.dispose() })
      renderer.dispose(); canvas.remove()
    },
  }
}
