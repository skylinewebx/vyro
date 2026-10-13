// Single source of truth for the catalogue — the 16 products of the VYRO collection.
// Prices, scores and specs are SAMPLE values: edit them here and the collection,
// product pages, cart and compare section all update.
const C = {
  black: { name: 'Matte Black', hex: '#141414' },
  graphite: { name: 'Graphite', hex: '#4a4a4c' },
  silver: { name: 'Silver', hex: '#b9bbbe' },
  cream: { name: 'Cream', hex: '#e2d8c3' },
  gold: { name: 'Champagne Gold', hex: '#D8B56D' },
  bronze: { name: 'Bronze', hex: '#8a6a3b' },
  white: { name: 'Pearl White', hex: '#f1efe9' },
  clear: { name: 'Crystal Clear', hex: '#cfd6da' },
}

// [name, kind, tagline, category, price, colours, description, scores, specs]
const raw = [
  ['ONE', 'Wireless Headphones', 'Active Noise Cancellation', 'headphones', 249, [C.black, C.graphite, C.silver],
    'The everyday reference. Soft protein-leather cushions and a low-profile headband, tuned for long, fatigue-free listening.',
    { sound: 9.5, comfort: 9.5, battery: 40, anc: 9 }, ['Over-ear, closed-back', 'Bluetooth, USB-C', '40 h', 'Active, 3 modes', '260 g']],
  ['LUXE', 'Premium Headphones', 'Hi-Res Audio', 'headphones', 279, [C.gold, C.cream, C.black],
    'Our most expressive pair. A warm, wide soundstage in a champagne-toned shell — made to be seen, built to be worn all day.',
    { sound: 9, comfort: 9, battery: 35, anc: 8.5 }, ['Over-ear, closed-back', 'Bluetooth, 3.5 mm', '35 h', 'Active', '270 g']],
  ['PRO', 'Studio Headphones', 'Ultra Clarity', 'headphones', 349, [C.black, C.graphite],
    'Built for people who listen closely. Larger drivers and a neutral signature for mixing, editing and critical listening.',
    { sound: 10, comfort: 9.8, battery: 60, anc: 9.5 }, ['Over-ear, semi-open', 'Bluetooth, USB-C, 3.5 mm', '60 h', 'Adaptive', '285 g']],
  ['SIGNATURE', 'Wireless Headphones', 'Premium Build', 'headphones', 329, [C.bronze, C.black],
    'Machined metal accents and a bronze finish give Signature its quiet, confident presence.',
    { sound: 9.2, comfort: 9, battery: 45, anc: 9 }, ['Over-ear, closed-back', 'Bluetooth, USB-C', '45 h', 'Active', '295 g']],
  ['AIR', 'Wireless Headphones', 'Long Battery Life', 'headphones', 199, [C.black, C.graphite],
    'Light on the head, heavy on battery. Air keeps going long after everything else has run out.',
    { sound: 8.5, comfort: 9.2, battery: 70, anc: 8 }, ['Over-ear, closed-back', 'Bluetooth', '70 h', 'Active', '240 g']],
  ['FLOW', 'On-Ear Headphones', 'Lightweight Design', 'headphones', 169, [C.black, C.graphite],
    'A featherweight on-ear design with a pivoting headband that moves with you.',
    { sound: 8.3, comfort: 9, battery: 45, anc: 7 }, ['On-ear, closed-back', 'Bluetooth', '45 h', 'Ambient', '210 g']],
  ['PURE', 'Wireless Headphones', 'Seamless Comfort', 'headphones', 229, [C.cream, C.white],
    'Cream finish, cloud-soft cushions. Pure is made for the longest listening sessions.',
    { sound: 8.8, comfort: 9.6, battery: 40, anc: 8.5 }, ['Over-ear, closed-back', 'Bluetooth, USB-C', '40 h', 'Active', '255 g']],
  ['ELITE', 'Studio Headphones', 'Professional Grade', 'headphones', 399, [C.bronze, C.black],
    'Reference-grade tuning with a durable build for the studio and the road.',
    { sound: 9.8, comfort: 9.3, battery: 50, anc: 9 }, ['Over-ear, closed-back', 'USB-C, 3.5 mm, Bluetooth', '50 h', 'Adaptive', '310 g']],
  ['QUEST', 'Open-Back Headphones', 'Natural Sound', 'headphones', 299, [C.black, C.graphite],
    'An open-back design that sounds wide, airy and natural, like listening in a room.',
    { sound: 9.6, comfort: 9.4, battery: 0, anc: 0 }, ['Over-ear, open-back', 'Wired, 3.5 mm / 6.3 mm', 'n/a (wired)', 'None (open-back)', '320 g']],
  ['FORCE', 'Wireless Headphones', 'Built for Performance', 'headphones', 259, [C.black, C.graphite],
    'Punchy, dynamic and made to take a beating — Force keeps up with your busiest days.',
    { sound: 9, comfort: 8.8, battery: 50, anc: 8.5 }, ['Over-ear, closed-back', 'Bluetooth, USB-C', '50 h', 'Active', '290 g']],
  ['CLASSIC', 'Over-Ear Headphones', 'Timeless Design', 'headphones', 219, [C.graphite, C.black, C.gold],
    'A brushed-metal ear cup and an unfussy shape that will not date.',
    { sound: 8.7, comfort: 9, battery: 38, anc: 8 }, ['Over-ear, closed-back', 'Bluetooth, 3.5 mm', '38 h', 'Active', '275 g']],
  ['BUDS', 'True Wireless Earbuds', 'Crystal Clear Sound', 'earbuds', 129, [C.cream, C.black],
    'Everyday true wireless with balanced sound and a pocket-friendly cream case.',
    { sound: 8, comfort: 8.5, battery: 7, anc: 6.5 }, ['True wireless, in-ear', 'Bluetooth, USB-C case', '7 h + 21 h case', 'Ambient + passive', 'IPX4 (sample)']],
  ['AIR BUDS', 'True Wireless Earbuds', 'Compact & Powerful', 'earbuds', 149, [C.black, C.graphite],
    'Compact earbuds with a strong low end and a case you will actually enjoy carrying.',
    { sound: 8.5, comfort: 9, battery: 8, anc: 8 }, ['True wireless, in-ear', 'Bluetooth, USB-C case', '8 h + 24 h case', 'Active', 'IPX4 (sample)']],
  ['GOLD', 'True Wireless Earbuds', 'Premium Finish', 'earbuds', 189, [C.gold, C.black],
    'A polished gold finish with a precise, detailed sound to match.',
    { sound: 9, comfort: 8.8, battery: 8, anc: 8.5 }, ['True wireless, in-ear', 'Bluetooth, USB-C case', '8 h + 24 h case', 'Active', 'IPX4 (sample)']],
  ['SPORT', 'Wireless Earbuds', 'Secure Fit', 'earbuds', 119, [C.black, C.white],
    'Ear-hook earbuds that lock in and stay put through every rep.',
    { sound: 8, comfort: 8.8, battery: 9, anc: 6 }, ['Wireless, ear-hook', 'Bluetooth, USB-C case', '9 h + 27 h case', 'Ambient', 'IPX5 (sample)']],
  ['CRYSTAL', 'True Wireless Earbuds', 'Modern Aesthetics', 'earbuds', 169, [C.clear, C.black],
    'A transparent case that shows off the engineering inside.',
    { sound: 8.6, comfort: 8.8, battery: 8, anc: 7.5 }, ['True wireless, in-ear', 'Bluetooth, USB-C case', '8 h + 24 h case', 'Active', 'IPX4 (sample)']],
]

const specLabels = ['Type', 'Connectivity', 'Battery (sample)', 'Noise cancellation', 'Weight / rating (sample)']

export const products = raw.map(([n, kind, tagline, category, price, colors, description, scores, specs], i) => {
  const id = String(i + 1).padStart(2, '0')
  const earbuds = category === 'earbuds'
  return {
    slug: `vyro-${n.toLowerCase().replace(/\s+/g, '-')}`,
    index: id,
    name: `VYRO ${n}`,
    kind, tagline, category, price, colors, description, scores,
    image: `/img/p/p${id}.webp`,
    // zoomed "close-up" view for the second gallery slot
    zoom: { scale: earbuds ? 1.9 : 1.75, origin: earbuds ? '66% 62%' : '64% 55%' },
    specs: specLabels.map((l, k) => [l, specs[k]]),
  }
})

export const bySlug = (s) => products.find((p) => p.slug === s)
export const money = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
export const categories = [
  { slug: 'all', label: 'All', to: '/shop' },
  { slug: 'headphones', label: 'Headphones', to: '/shop/headphones' },
  { slug: 'earbuds', label: 'Earbuds', to: '/shop/earbuds' },
  { slug: 'accessories', label: 'Accessories', to: '/shop/accessories' },
]
