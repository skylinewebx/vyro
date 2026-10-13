// Single source of truth for the catalogue. Prices and spec scores are SAMPLE values —
// edit them here and the shop, product pages, cart and compare section all update.
const C = {
  black: { name: 'Matte Black', hex: '#141414' },
  graphite: { name: 'Graphite', hex: '#4a4a4c' },
  silver: { name: 'Silver', hex: '#b9bbbe' },
  cream: { name: 'Cream', hex: '#e8dfc9' },
  gold: { name: 'Champagne Gold', hex: '#D8B56D' },
  white: { name: 'Pearl White', hex: '#f1efe9' },
}
const detail = { src: '/img/macro.jpg', pos: '50% 50%', zoom: 1, label: 'Detail' }
const g = (src, pos = '50% 50%') => [
  { src, pos, zoom: 1, label: 'Front' },
  { src, pos, zoom: 1.7, label: 'Close-up' },
  detail,
]

export const products = [
  { slug: 'vyro-one', name: 'VYRO ONE', category: 'headphones', kind: 'Wireless Headphones', price: 249, featured: 1, image: '/img/one.jpg', pos: '50% 45%',
    colors: [C.black, C.silver, C.cream], gallery: g('/img/one.jpg', '50% 45%'),
    blurb: 'Active noise cancellation in a quiet, matte-black silhouette.',
    description: 'The everyday reference. VYRO ONE pairs soft protein-leather cushions with a low-profile steel headband, tuned for long, fatigue-free sessions at home, on the move, or anywhere between.',
    scores: { sound: 9.5, comfort: 9.5, battery: 40, anc: 9 },
    specs: [['Type', 'Over-ear, closed-back'], ['Connectivity', 'Bluetooth, USB-C'], ['Battery (sample)', 'Up to 40 h'], ['Noise cancellation', 'Active, 3 modes'], ['Weight (sample)', '260 g']] },
  { slug: 'vyro-air', name: 'VYRO AIR', category: 'earbuds', kind: 'Wireless Earbuds', price: 149, featured: 2, image: '/img/air.jpg', pos: '50% 50%',
    colors: [C.black, C.graphite, C.gold], gallery: g('/img/air.jpg'),
    blurb: 'Pocket-sized earbuds with a copper-finished charging case.',
    description: 'Compact, secure and quietly premium. VYRO AIR disappears into your day with a low-profile fit and a case you will actually enjoy carrying.',
    scores: { sound: 8.5, comfort: 9, battery: 8, anc: 8 },
    specs: [['Type', 'True wireless, in-ear'], ['Connectivity', 'Bluetooth, USB-C case'], ['Battery (sample)', '8 h + 24 h case'], ['Noise cancellation', 'Active'], ['Water resistance (sample)', 'IPX4']] },
  { slug: 'vyro-luxe', name: 'VYRO LUXE', category: 'headphones', kind: 'Premium Headphones', price: 279, featured: 3, image: '/img/luxe.jpg', pos: '50% 50%',
    colors: [C.gold, C.cream, C.black], gallery: g('/img/luxe.jpg'),
    blurb: 'Champagne finish. Hi-res tuning. Statement comfort.',
    description: 'Our most expressive pair. LUXE wraps a warm, wide soundstage in a champagne-toned shell — made to be seen, built to be worn all day.',
    scores: { sound: 9, comfort: 9, battery: 35, anc: 8.5 },
    specs: [['Type', 'On-ear, closed-back'], ['Connectivity', 'Bluetooth, 3.5 mm'], ['Battery (sample)', 'Up to 35 h'], ['Noise cancellation', 'Active'], ['Weight (sample)', '240 g']] },
  { slug: 'vyro-buds', name: 'VYRO BUDS', category: 'earbuds', kind: 'True Wireless Earbuds', price: 129, featured: 4, image: '/img/buds.jpg', pos: '50% 55%',
    colors: [C.white, C.black, C.silver], gallery: g('/img/buds.jpg', '50% 55%'),
    blurb: 'Everyday true wireless with a charging case that fits any pocket.',
    description: 'The easy choice. BUDS deliver clear, balanced sound with one-touch controls and a case that keeps going when you do.',
    scores: { sound: 8, comfort: 8.5, battery: 7, anc: 6.5 },
    specs: [['Type', 'True wireless, in-ear'], ['Connectivity', 'Bluetooth, USB-C case'], ['Battery (sample)', '7 h + 21 h case'], ['Noise cancellation', 'Ambient + passive'], ['Water resistance (sample)', 'IPX4']] },
  { slug: 'vyro-pro', name: 'VYRO PRO', category: 'headphones', kind: 'Studio Headphones', price: 349, featured: 5, image: '/img/pro.jpg', pos: '50% 50%',
    colors: [C.black, C.graphite], gallery: g('/img/pro.jpg'),
    blurb: 'Ultra-clear studio tuning and marathon battery life.',
    description: 'Built for people who listen closely. PRO adds larger drivers, a longer battery and a more neutral signature for mixing, editing and critical listening.',
    scores: { sound: 10, comfort: 9.8, battery: 60, anc: 9.5 },
    specs: [['Type', 'Over-ear, closed-back'], ['Connectivity', 'Bluetooth, USB-C, 3.5 mm'], ['Battery (sample)', 'Up to 60 h'], ['Noise cancellation', 'Adaptive'], ['Weight (sample)', '285 g']] },
  { slug: 'vyro-flow', name: 'VYRO FLOW', category: 'headphones', kind: 'Lightweight Headphones', price: 199, featured: 6, image: '/img/studio.jpg', pos: '50% 50%',
    colors: [C.black, C.silver], gallery: g('/img/studio.jpg'),
    blurb: 'Featherweight comfort for long days and longer playlists.',
    description: 'FLOW trims the weight without trimming the sound. A pivoting headband and breathable cushions keep it comfortable from the first track to the last.',
    scores: { sound: 8.5, comfort: 9.2, battery: 45, anc: 7.5 },
    specs: [['Type', 'Over-ear, closed-back'], ['Connectivity', 'Bluetooth'], ['Battery (sample)', 'Up to 45 h'], ['Noise cancellation', 'Active'], ['Weight (sample)', '230 g']] },
  { slug: 'vyro-core', name: 'VYRO CORE', category: 'headphones', kind: 'Wireless Headphones', price: 179, featured: 7, image: '/img/core.jpg', pos: '50% 50%',
    colors: [C.black, C.graphite], gallery: g('/img/core.jpg'),
    blurb: 'Balanced, punchy sound at a friendlier price.',
    description: 'The place to start. CORE keeps the essentials sharp — a punchy, balanced signature, a dependable battery and a fit that stays put.',
    scores: { sound: 8, comfort: 8.5, battery: 30, anc: 7 },
    specs: [['Type', 'Over-ear, closed-back'], ['Connectivity', 'Bluetooth'], ['Battery (sample)', 'Up to 30 h'], ['Noise cancellation', 'Active'], ['Weight (sample)', '270 g']] },
  { slug: 'vyro-sport', name: 'VYRO SPORT', category: 'earbuds', kind: 'Wireless Earbuds', price: 119, featured: 8, image: '/img/sport.jpg', pos: '50% 50%',
    colors: [C.black, C.white], gallery: g('/img/sport.jpg'),
    blurb: 'Secure-fit earbuds that keep up with every rep.',
    description: 'SPORT locks in with a stable fit and sweat-ready build, so the music keeps pace however hard you push.',
    scores: { sound: 8, comfort: 8.8, battery: 9, anc: 6 },
    specs: [['Type', 'True wireless, secure fit'], ['Connectivity', 'Bluetooth, USB-C case'], ['Battery (sample)', '9 h + 27 h case'], ['Noise cancellation', 'Ambient'], ['Water resistance (sample)', 'IPX5']] },
]

export const bySlug = (s) => products.find((p) => p.slug === s)
export const money = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
export const categories = [
  { slug: 'all', label: 'All', to: '/shop' },
  { slug: 'headphones', label: 'Headphones', to: '/shop/headphones' },
  { slug: 'earbuds', label: 'Wireless Earbuds', to: '/shop/earbuds' },
  { slug: 'accessories', label: 'Accessories', to: '/shop/accessories' },
]
