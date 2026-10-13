import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import { SectionHead } from '../components/ui'

const picks = ['vyro-one', 'vyro-air-buds', 'vyro-luxe', 'vyro-buds']

export default function Featured() {
  const list = picks.map((s) => products.find((p) => p.slug === s))
  return (
    <section id="collection" className="bg-ink px-5 md:px-[5.3vw] py-20 md:py-32" aria-labelledby="featured-h">
      <SectionHead n="01" title={<span id="featured-h">Featured collection</span>} link="/shop" linkLabel="View all 16">
        Premium audio gear for every vibe. Find your perfect sound.
      </SectionHead>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
      </div>
    </section>
  )
}
