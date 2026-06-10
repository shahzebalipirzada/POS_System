import React, { useState, useCallback, createContext, useContext, useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  const icons = { success: CheckCircle, error: AlertCircle, info: Info }
  const colors = {
    success: 'bg-green-900/90 border-green-700 text-green-100',
    error: 'bg-red-900/90 border-red-700 text-red-100',
    info: 'bg-pos-card border-pos-border text-pos-text',
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 no-print">
        {toasts.map(t => {
          const Icon = icons[t.type] || Info
          return (
            <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl animate-slide-in ${colors[t.type]}`}>
              <Icon size={16} className="shrink-0" />
              <span className="text-sm font-medium">{t.message}</span>
              <button onClick={() => remove(t.id)} className="ml-2 opacity-60 hover:opacity-100">
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
