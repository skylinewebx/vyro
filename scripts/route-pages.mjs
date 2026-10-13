// GitHub Pages is static: give every client-side route its own index.html so
// direct visits / refreshes return 200 (404.html stays as a fallback for unknown URLs).
import { copyFileSync, mkdirSync } from 'node:fs'
import { products } from '../src/data/products.js'
import { articles } from '../src/data/journal.js'

const routes = [
  'shop', 'shop/headphones', 'shop/earbuds', 'shop/accessories', 'about', 'journal', 'contact', 'checkout',
  ...products.map((p) => `product/${p.slug}`),
  ...articles.map((a) => `journal/${a.slug}`),
]
for (const r of routes) {
  mkdirSync(`dist/${r}`, { recursive: true })
  copyFileSync('dist/index.html', `dist/${r}/index.html`)
}
copyFileSync('dist/index.html', 'dist/404.html')
console.log(`Wrote ${routes.length} route pages + 404.html`)
