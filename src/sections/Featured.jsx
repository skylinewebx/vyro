import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import { SectionHead } from '../components/ui'

export default function Featured() {
  const list = products.filter((p) => ['vyro-one', 'vyro-air', 'vyro-luxe', 'vyro-buds'].includes(p.slug))
    .sort((a, b) => a.featured - b.featured)
  return (
    <section id="featured" className="bg-ink px-5 md:px-10 py-20 md:py-32" aria-labelledby="featured-h">
      <SectionHead n="01" title={<span id="featured-h">Featured collection</span>} link="/shop" linkLabel="View all">
        Premium audio gear for every vibe. Find your perfect sound.
      </SectionHead>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p, i) => <ProductCard key={p.slug} product={p} index={i} variant="feature" />)}
      </div>
    </section>
  )
}
