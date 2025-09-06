// ========================================
// CLIENT/SRC/COMPONENTS/BUTTON.JSX
// ========================================
import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-electric-indigo/50'
  
  const variants = {
    primary: 'bg-neon-gradient text-white shadow-glow-indigo hover:shadow-glow-neon disabled:opacity-50',
    ghost: 'bg-transparent text-[var(--fg)] hover:bg-electric-indigo/10 disabled:opacity-50',
    outline: 'border-2 border-electric-indigo text-electric-indigo hover:bg-electric-indigo hover:text-white disabled:opacity-50'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button