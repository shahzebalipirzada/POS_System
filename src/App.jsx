import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ToastProvider } from './components/ui/Toast'
import Sidebar from './components/ui/Sidebar'
import POSPage from './pages/POSPage'
import ProductsPage from './pages/ProductsPage'
import SalesPage from './pages/SalesPage'
import DashboardPage from './pages/DashboardPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <div className="flex h-screen overflow-hidden bg-pos-bg">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<POSPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </ToastProvider>
    </AppProvider>
  )
}
