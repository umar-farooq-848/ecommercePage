// ========================================
// CLIENT/SRC/COMPONENTS/TOAST.JSX
// ========================================
import React, { useState, useEffect } from 'react'

let toastQueue = []
let toastListener = null

export const showToast = (message, type = 'success') => {
  const toast = {
    id: Date.now(),
    message,
    type
  }
  
  toastQueue.push(toast)
  if (toastListener) {
    toastListener([...toastQueue])
  }
  
  setTimeout(() => {
    toastQueue = toastQueue.filter(t => t.id !== toast.id)
    if (toastListener) {
      toastListener([...toastQueue])
    }
  }, 3000)
}

const Toast = () => {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    toastListener = setToasts
    return () => {
      toastListener = null
    }
  }, [])

  const removeToast = (id) => {
    toastQueue = toastQueue.filter(t => t.id !== id)
    setToasts([...toastQueue])
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg max-w-sm animate-slide-in ${
            toast.type === 'success' ? 'bg-neon-green text-soft-black' :
            toast.type === 'error' ? 'bg-neon-pink text-white' :
            'bg-electric-indigo text-white'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-lg hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Toast