import React, { createContext, useContext, useState, useEffect } from 'react'
import { settingsService } from '../services/settingsService'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [settings, setSettings] = useState({ shopName: 'SwiftPOS Store', taxRate: 17, currency: 'PKR' })
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    settingsService.getAll().then(s => {
      if (s && Object.keys(s).length > 0) setSettings(prev => ({ ...prev, ...s }))
    })
    const saved = localStorage.getItem('posTheme')
    if (saved === 'light') setDarkMode(false)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('posTheme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const updateSettings = async (key, value) => {
    await settingsService.set(key, value)
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <AppContext.Provider value={{ settings, updateSettings, darkMode, setDarkMode }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
