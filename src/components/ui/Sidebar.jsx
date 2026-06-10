import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  ShoppingCart, Package, BarChart2, Clock, Settings, Moon, Sun, Zap
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

const links = [
  { to: '/', icon: ShoppingCart, label: 'POS', end: true },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/sales', icon: Clock, label: 'Sales' },
  { to: '/dashboard', icon: BarChart2, label: 'Dashboard' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { darkMode, setDarkMode } = useApp()

  return (
    <aside className="w-16 lg:w-56 bg-pos-surface border-r border-pos-border flex flex-col h-screen sticky top-0 no-print">
      {/* Logo */}
      <div className="p-3 lg:p-4 border-b border-pos-border flex items-center gap-3">
        <div className="w-9 h-9 bg-pos-accent rounded-xl flex items-center justify-center shrink-0">
          <Zap size={18} className="text-white" />
        </div>
        <div className="hidden lg:block">
          <div className="font-bold text-pos-text font-display text-sm">SwiftPOS</div>
          <div className="text-pos-muted text-xs">v1.0</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 flex flex-col gap-1">
        {links.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                isActive
                  ? 'bg-pos-accent text-white'
                  : 'text-pos-muted hover:text-pos-text hover:bg-pos-card'
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            <span className="hidden lg:block text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Theme toggle */}
      <div className="p-2 border-t border-pos-border">
        <button
          onClick={() => setDarkMode(d => !d)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-pos-muted hover:text-pos-text hover:bg-pos-card transition-all"
        >
          {darkMode ? <Sun size={18} className="shrink-0" /> : <Moon size={18} className="shrink-0" />}
          <span className="hidden lg:block text-sm font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  )
}
