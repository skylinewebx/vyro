import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <App />
      </CartProvider>
    </MotionConfig>
  </BrowserRouter>
)
