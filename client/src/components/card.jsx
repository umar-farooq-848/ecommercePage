// ========================================
// CLIENT/SRC/COMPONENTS/CARD.JSX
// ========================================
import React from 'react'

const Card = ({ children, className = '', glow = false, ...props }) => {
  const glowClass = glow ? 'shadow-glow-indigo' : ''
  
  return (
    <div
      className={`bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] rounded-2xl p-6 border border-electric-indigo/10 ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
