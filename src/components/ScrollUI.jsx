import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return <motion.div aria-hidden style={{ scaleX }} className="fixed top-0 left-0 right-0 h-[3px] bg-vy origin-left z-[80]" />
}

export function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => {
      const st = document.getElementById('showcase')
      const r = st && st.getBoundingClientRect()
      const inShowcase = r && r.top <= 0 && r.bottom >= window.innerHeight * 0.5   // pinned showcase has its own index + cards
      setShow(window.scrollY > 900 && !inShowcase && window.scrollY < document.documentElement.scrollHeight - window.innerHeight - 320)
    }
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const go = () => (window.__lenis ? window.__lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: 'smooth' }))
  return (
    <AnimatePresence>
      {show && (
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={go} aria-label="Back to top"
          className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-vy text-ink grid place-items-center shadow-lg hover:bg-warm transition-colors">
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
