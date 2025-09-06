// ========================================
// CLIENT/SRC/COMPONENTS/BADGE.JSX
// ========================================
import React from 'react'

const Badge = ({ children, className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-electric-indigo text-white',
    success: 'bg-neon-green text-soft-black',
    warning: 'bg-cyber-yellow text-soft-black',
    danger: 'bg-neon-pink text-white'
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge