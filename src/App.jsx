import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import SmoothScroll from './components/SmoothScroll'
import { ScrollProgress, BackToTop } from './components/ScrollUI'
import { EASE } from './components/ui'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'

const About = lazy(() => import('./pages/About'))
const Journal = lazy(() => import('./pages/Journal'))
const Article = lazy(() => import('./pages/Article'))
const Contact = lazy(() => import('./pages/Contact'))
const Checkout = lazy(() => import('./pages/Checkout'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const location = useLocation()
  // /shop, /shop/earbuds … share one page: only animate when the page itself changes
  const key = location.pathname.startsWith('/shop') ? '/shop' : location.pathname
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-vy focus:text-ink focus:px-4 focus:py-2">Skip to content</a>
      <SmoothScroll />
      <ScrollProgress />
      <Header />
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => (window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0))}>
        <motion.main id="main" key={key}
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}>
          <Suspense fallback={<div className="min-h-screen" />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:category" element={<Shop />} />
              <Route path="/product/:slug" element={<Product />} />
              <Route path="/about" element={<About />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/journal/:slug" element={<Article />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CartDrawer />
      <BackToTop />
    </>
  )
}
