// Interactive 3D black VYRO over-ear headphone (Three.js / WebGL).
// The model is built from real geometry (swept headband, lathed ear cups and cushions, hinges, buttons…),
// lit with an image-based environment + a yellow rim light to sit in the site's yellow-and-black scene.
// A GLB/GLTF can replace the procedural model: set MODEL_URL in src/data/showcase.js.
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

const V2 = (x, y) => new THREE.Vector2(x, y)
const smooth = (pts, n = 64) => new THREE.SplineCurve(pts.map((p) => V2(p[0], p[1]))).getPoints(n)
const FLOOR_Y = -4.3      // plinth top / cup bottoms

/* ------------------------------------------------------------------ textures */
function grainTexture() {
  const s = 192, c = document.createElement('canvas'); c.width = c.height = s
  const g = c.getContext('2d'), img = g.createImageData(s, s)
  let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const base = new Float32Array(s * s).map(() => rnd())
  for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {         // 3×3 box blur → soft leather-like grain
    let a = 0; for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) a += base[((y + j + s) % s) * s + ((x + i + s) % s)]
    const v = Math.round((a / 9) * 255 * 1.6 - 60), k = (y * s + x) * 4
    img.data[k] = img.data[k + 1] = img.data[k + 2] = Math.max(0, Math.min(255, v)); img.data[k + 3] = 255
  }
  g.putImageData(img, 0, 0)
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(10, 6); t.anisotropy = 4
  return t
}
function logoTexture() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 160
  const g = c.getContext('2d'); g.clearRect(0, 0, 512, 160)
  g.font = '500 112px "Unbounded", "Manrope", Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'
  g.fillStyle = '#9b9ba2'; if ('letterSpacing' in g) g.letterSpacing = '6px'
  g.fillText('VYRO', 256, 84)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8
  return t
}
function shadowTexture() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256
  const g = c.getContext('2d')
  const blob = (cx, cy, rx, ry, a) => { g.save(); g.translate(cx, cy); g.scale(rx, ry); const r = g.createRadialGradient(0, 0, 0, 0, 0, 1); r.addColorStop(0, `rgba(0,0,0,${a})`); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.beginPath(); g.arc(0, 0, 1, 0, Math.PI * 2); g.fill(); g.restore() }
  blob(256, 128, 230, 70, 0.55)           // soft overall shadow
  blob(158, 128, 70, 58, 0.85); blob(354, 128, 70, 58, 0.85)   // under each cup
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
}

/* ------------------------------------------------------------------ geometry helpers */
function rrProfile(w, h, r, seg = 5) {     // rounded-rectangle outline (x = across, y = thickness)
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
  for (const [ring, flip] of [[0, false], [samples.length - 1, true]]) {     // end caps
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
  const grain = track(grainTexture())
  const D = THREE.DoubleSide
  const M = {
    plastic: track(new THREE.MeshPhysicalMaterial({ color: 0x101012, roughness: 0.4, metalness: 0.05, clearcoat: 0.4, clearcoatRoughness: 0.4, side: D, envMap: env })),
    face: track(new THREE.MeshPhysicalMaterial({ color: 0x151518, roughness: 0.26, metalness: 0.1, clearcoat: 0.7, clearcoatRoughness: 0.25, side: D, envMap: env })),
    leather: track(new THREE.MeshPhysicalMaterial({ color: 0x141416, roughness: 0.56, metalness: 0, bumpMap: grain, bumpScale: 1.4, sheen: 1, sheenColor: new THREE.Color(0x3a3a42), sheenRoughness: 0.5, side: D, envMap: env })),
    pad: track(new THREE.MeshPhysicalMaterial({ color: 0x18181b, roughness: 0.66, metalness: 0, bumpMap: grain, bumpScale: 1.0, sheen: 1, sheenColor: new THREE.Color(0x30303a), sheenRoughness: 0.6, side: D, envMap: env })),
    metal: track(new THREE.MeshStandardMaterial({ color: 0x8b8b93, metalness: 1, roughness: 0.28, side: D, envMap: env })),
    darkMetal: track(new THREE.MeshStandardMaterial({ color: 0x1f1f23, metalness: 0.85, roughness: 0.38, side: D, envMap: env })),
    fabric: track(new THREE.MeshStandardMaterial({ color: 0x08080a, roughness: 1, side: D })),
    rubber: track(new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.8, side: D })),
  }
  const add = (geo, mat, parent = root) => { track(geo); const m = new THREE.Mesh(geo, mat); parent.add(m); return m }

  /* headband (plastic band + soft underside pad + metal sliders) */
  const cx = 0, cy = 4.2, rx = 8.8, ry = 10.9
  add(sweep(ellipseSamples(cx, cy, rx, ry, 0.3, Math.PI - 0.3, 90), rrProfile(3.0, 0.95, 0.42)), M.plastic)
  add(sweep(ellipseSamples(cx, cy, rx, ry, 0.42, Math.PI - 0.42, 80), rrProfile(2.55, 0.7, 0.3), -0.82), M.pad)
  for (const [a, b] of [[0.0, 0.36], [Math.PI - 0.36, Math.PI]]) {
    add(sweep(ellipseSamples(cx, cy, rx, ry, a, b, 10), rrProfile(1.5, 0.62, 0.24), -0.12), M.darkMetal)
  }
  for (const [a, b] of [[0.3, 0.36], [Math.PI - 0.36, Math.PI - 0.3]])      // brushed metal collars where the slider meets the band
    add(sweep(ellipseSamples(cx, cy, rx, ry, a, b, 4), rrProfile(1.7, 0.78, 0.28), -0.1), M.metal)

  /* ear cups */
  for (const side of [1, -1]) {
    const cup = new THREE.Group(); cup.position.x = side * 8.0
    const local = new THREE.Group(); local.scale.set(1, 1, 0.82); local.rotation.z = (-side * Math.PI) / 2; cup.add(local)

    const shell = smooth([[0, 1.28], [1.0, 1.285], [2.0, 1.25], [2.9, 1.17], [3.55, 1.03], [3.98, 0.78], [4.2, 0.4], [4.25, 0], [4.22, -0.55], [4.05, -1.0], [3.7, -1.25]], 80)
    shell.push(V2(3.2, -1.3), V2(0, -1.3))
    const sg = new THREE.LatheGeometry(shell, 112); sg.computeVertexNormals()
    add(sg, M.plastic, local)
    const capPts = shell.filter((p) => p.x <= 3.5 && p.y > 0.9)             // glossier inner disc, a touch proud of the shell
    const cg = new THREE.LatheGeometry(capPts, 112); cg.computeVertexNormals()
    const cap = add(cg, M.face, local); cap.scale.setScalar(1.004)
    const ring = add(new THREE.TorusGeometry(3.6, 0.05, 10, 140), M.metal, local); ring.rotation.x = Math.PI / 2; ring.position.y = 1.09

    // cushion (soft rounded pad) + fabric dish
    const cush = smooth([[3.3, -1.28], [4.05, -1.32], [4.55, -1.62], [4.78, -2.12], [4.72, -2.78], [4.42, -3.22], [3.9, -3.52], [3.2, -3.62], [2.7, -3.48], [2.35, -3.12], [2.2, -2.62], [2.3, -2.0], [2.62, -1.5], [3.0, -1.3]], 90)
    const kg = new THREE.LatheGeometry(cush, 112); kg.computeVertexNormals()
    add(kg, M.leather, local)
    const dish = smooth([[0, -2.95], [1.1, -2.9], [1.8, -2.7], [2.15, -2.35]], 20)
    const dg = new THREE.LatheGeometry(dish, 64); dg.computeVertexNormals()
    add(dg, M.fabric, local)
    const seam = add(new THREE.TorusGeometry(3.95, 0.03, 8, 140), M.darkMetal, local); seam.rotation.x = Math.PI / 2; seam.position.y = -1.34

    // logo
    const logoMat = track(new THREE.MeshStandardMaterial({ map: logoTexture(), transparent: true, roughness: 0.35, metalness: 0.7, depthWrite: false, envMap: env }))
    const logo = add(new THREE.PlaneGeometry(2.7, 0.84), logoMat, cup)
    logo.position.set(side * 1.3, -0.15, side * -0.55); logo.rotation.y = (side * Math.PI) / 2
    disposables.push(logoMat.map)

    // hinge yoke (stem from the cup up into the headband slider)
    const yoke = add(new RoundedBoxGeometry(0.85, 2.1, 2.2, 4, 0.3), M.darkMetal, cup); yoke.position.set(side * 0.55, 4.5, 0)
    const pivot = add(new THREE.CylinderGeometry(0.62, 0.62, 0.38, 36), M.metal, cup); pivot.rotation.z = Math.PI / 2; pivot.position.set(side * 1.0, 3.85, 0)

    if (side === 1) {                                              // controls + charging port on the right cup
      const bz = (y) => 3.47 * Math.sqrt(1 - (y / 4.23) ** 2) * 0.99 + 0.16
      for (const [y, h] of [[1.55, 0.9], [0.35, 0.9], [-0.9, 0.9]]) {
        const b = add(new RoundedBoxGeometry(0.62, h, 0.5, 4, 0.2), M.darkMetal, cup); b.position.set(-0.15, y, bz(y))
        const ridge = add(new THREE.BoxGeometry(0.34, 0.05, 0.04), M.metal, cup); ridge.position.set(-0.15, y, bz(y) + 0.26)
      }
      const port = add(new RoundedBoxGeometry(0.95, 0.3, 0.34, 3, 0.12), M.rubber, cup); port.position.set(-0.15, -2.35, bz(-2.35) - 0.04)
      const led = add(new THREE.SphereGeometry(0.055, 12, 12), M.rubber, cup); led.position.set(-0.15, -1.75, bz(-1.75))
    }
    root.add(cup)
  }
  return { root, dispose: () => disposables.forEach((d) => d && d.dispose && d.dispose()) }
}

/* ------------------------------------------------------------------ viewer */
export async function createViewer({ container, reduced = false, modelUrl = null, onInteract = () => {}, onReady = () => {}, onLost = () => {} }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  const coarse = window.matchMedia('(pointer: coarse)').matches
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.6 : 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  const canvas = renderer.domElement
  Object.assign(canvas.style, { width: '100%', height: '100%', display: 'block', touchAction: 'pan-y', cursor: 'grab', outline: 'none' })
  container.appendChild(canvas)

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envScene = new RoomEnvironment()
  const envTex = pmrem.fromScene(envScene, 0.04).texture
  scene.environment = envTex
  if ('environmentIntensity' in scene) scene.environmentIntensity = 0.85

  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-18, 26, 24); scene.add(key)
  const rim = new THREE.DirectionalLight(0xffc900, 3.4); rim.position.set(24, 9, -22); scene.add(rim)
  const rim2 = new THREE.DirectionalLight(0xffd54a, 1.6); rim2.position.set(-26, 6, -16); scene.add(rim2)
  const fill = new THREE.DirectionalLight(0xffffff, 0.55); fill.position.set(14, 6, 28); scene.add(fill)

  // plinth + soft contact shadow
  const stage = new THREE.Group(); scene.add(stage)
  const plinthMat = new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 0.88, metalness: 0, envMap: envTex, envMapIntensity: 0.08 })
  const plinthGeo = new THREE.CylinderGeometry(12.4, 12.7, 1.05, 160)
  const plinth = new THREE.Mesh(plinthGeo, plinthMat); plinth.position.y = FLOOR_Y - 0.525; stage.add(plinth)
  const shTex = shadowTexture()
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(26, 13), new THREE.MeshBasicMaterial({ map: shTex, transparent: true, depthWrite: false, opacity: 0.9 }))
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = FLOOR_Y + 0.02; stage.add(shadow)

  // model
  let model, modelDispose = () => {}
  if (modelUrl) {
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
    const gltf = await new GLTFLoader().loadAsync(modelUrl)
    model = gltf.scene
    const box = new THREE.Box3().setFromObject(model), size = box.getSize(new THREE.Vector3()), mid = box.getCenter(new THREE.Vector3())
    const s = 20 / Math.max(size.x, size.y, size.z); model.scale.setScalar(s)
    model.position.set(-mid.x * s, FLOOR_Y - box.min.y * s, -mid.z * s)
    modelDispose = () => model.traverse((o) => { o.geometry && o.geometry.dispose(); const m = o.material; (Array.isArray(m) ? m : [m]).forEach((x) => x && x.dispose()) })
  } else {
    const hp = buildHeadphone(envTex); model = hp.root; modelDispose = hp.dispose
  }
  scene.add(model)

  // camera (orbit)
  const camera = new THREE.PerspectiveCamera(28, 1, 1, 400)
  const target = new THREE.Vector3(0, 4.7, 0)
  let theta = 0.85, phi = 1.38, radius = 60, vTheta = 0
  const PHI_MIN = 0.62, PHI_MAX = 1.5
  const fit = () => {
    const w = container.clientWidth || 1, h = container.clientHeight || 1, aspect = w / h
    renderer.setSize(w, h, false); camera.aspect = aspect; camera.updateProjectionMatrix()
    const halfV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), halfH = halfV * aspect
    const needH = 14.4 / halfV, needW = (aspect < 1 ? 13.8 : 16.6) / halfH               // keep the whole headphone + plinth in frame
    radius = Math.max(needH, needW) * 1.02
  }
  fit()
  const place = () => {
    camera.position.set(target.x + radius * Math.sin(phi) * Math.sin(theta), target.y + radius * Math.cos(phi), target.z + radius * Math.sin(phi) * Math.cos(theta))
    camera.lookAt(target)
  }

  // interaction
  let dragging = false, lastX = 0, lastY = 0, lastT = 0, idle = 0, auto = 0, visible = true, raf = 0, last = performance.now(), told = false
  const AUTO = 0.17            // rad/s ≈ one slow turn every 37 s
  const touched = () => { if (!told) { told = true; onInteract() } }
  const down = (e) => { dragging = true; idle = 0; auto = 0; lastX = e.clientX; lastY = e.clientY; lastT = performance.now(); vTheta = 0; canvas.style.cursor = 'grabbing'; try { canvas.setPointerCapture(e.pointerId) } catch {} }
  const move = (e) => {
    if (!dragging) return
    const now = performance.now(), dt = Math.max(1, now - lastT) / 1000
    const dx = e.clientX - lastX, dy = e.clientY - lastY
    const dTheta = -dx * 0.0085
    theta += dTheta; vTheta = THREE.MathUtils.lerp(vTheta, dTheta / dt, 0.4)
    if (e.pointerType === 'mouse') phi = THREE.MathUtils.clamp(phi - dy * 0.005, PHI_MIN, PHI_MAX)
    lastX = e.clientX; lastY = e.clientY; lastT = now; touched()
  }
  const up = (e) => { dragging = false; canvas.style.cursor = 'grab'; try { canvas.releasePointerCapture(e.pointerId) } catch {} ; vTheta = THREE.MathUtils.clamp(vTheta, -6, 6) }
  const key_ = (e) => {
    const k = { ArrowLeft: [-0.18, 0], ArrowRight: [0.18, 0], ArrowUp: [0, -0.1], ArrowDown: [0, 0.1] }[e.key]
    if (!k) return
    e.preventDefault(); theta += k[0]; phi = THREE.MathUtils.clamp(phi + k[1], PHI_MIN, PHI_MAX); idle = 0; auto = 0; touched()
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
  const tick = (now) => {
    frames++
    update(Math.min(0.05, (now - last) / 1000)); last = now
    place(); renderer.render(scene, camera)
  }
  const loop = () => { raf = requestAnimationFrame((t) => { tick(t); if (visible) loop() }) }
  const start = () => { if (!raf || true) { cancelAnimationFrame(raf); last = performance.now(); loop() } }
  const setVisible = (v) => { visible = v && !document.hidden; cancelAnimationFrame(raf); if (visible) { last = performance.now(); loop() } }
  const onVis = () => setVisible(visible || !document.hidden)
  document.addEventListener('visibilitychange', onVis)
  const ro = new ResizeObserver(() => { fit(); place(); renderer.render(scene, camera) })
  ro.observe(container)

  if (import.meta.env.DEV) window.__vy = { get theta() { return theta }, get phi() { return phi }, get auto() { return auto }, get radius() { return radius }, get frames() { return frames }, get visible() { return visible }, get dragging() { return dragging }, advance(sec) { for (let t = 0; t < sec; t += 1 / 60) update(1 / 60); place(); renderer.render(scene, camera) } }
  place(); renderer.render(scene, camera); start(); onReady()

  return {
    setVisible,
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); document.removeEventListener('visibilitychange', onVis)
      canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up); canvas.removeEventListener('keydown', key_)
      modelDispose(); plinthGeo.dispose(); plinthMat.dispose(); shadow.geometry.dispose(); shadow.material.dispose(); shTex.dispose()
      envTex.dispose(); pmrem.dispose(); envScene.traverse((o) => { o.geometry && o.geometry.dispose(); o.material && o.material.dispose && o.material.dispose() })
      renderer.dispose(); canvas.remove()
    },
  }
}
