import React, { useState } from 'react'
import { Save, Wifi, WifiOff, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useToast } from '../components/ui/Toast'
import db from '../db/database'

export default function SettingsPage() {
  const { settings, updateSettings } = useApp()
  const toast = useToast()
  const [form, setForm] = useState({
    shopName: settings.shopName || '',
    taxRate: settings.taxRate || 0,
    currency: settings.currency || 'PKR',
  })
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  React.useEffect(() => {
    setForm({ shopName: settings.shopName || '', taxRate: settings.taxRate || 0, currency: settings.currency || 'PKR' })
  }, [settings])

  React.useEffect(() => {
    const on = () => setIsOnline(true)
    const off = () => setIsOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  const save = async () => {
    await updateSettings('shopName', form.shopName)
    await updateSettings('taxRate', Number(form.taxRate))
    await updateSettings('currency', form.currency)
    toast('Settings saved', 'success')
  }

  const clearData = async (table) => {
    if (!window.confirm(`Clear all ${table}? This cannot be undone.`)) return
    await db[table].clear()
    toast(`${table} cleared`, 'info')
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-pos-text mb-6">Settings</h1>

      {/* Status */}
      <div className={`flex items-center gap-3 p-4 rounded-xl border mb-6 ${isOnline ? 'border-green-700 bg-green-900/20' : 'border-red-700 bg-red-900/20'}`}>
        {isOnline ? <Wifi size={18} className="text-green-400" /> : <WifiOff size={18} className="text-red-400" />}
        <div>
          <div className={`text-sm font-medium ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </div>
          <div className="text-xs text-pos-muted">App works fully offline — all data stored locally</div>
        </div>
      </div>

      {/* Shop settings */}
      <div className="card p-5 mb-4 space-y-4">
        <h2 className="text-sm font-semibold text-pos-text border-b border-pos-border pb-2">Shop Configuration</h2>
        <div>
          <label className="label">Shop Name</label>
          <input className="input" value={form.shopName} onChange={e => setForm(p => ({ ...p, shopName: e.target.value }))} placeholder="My Shop" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Tax Rate (%)</label>
            <input className="input font-display" type="number" min={0} max={100} value={form.taxRate} onChange={e => setForm(p => ({ ...p, taxRate: e.target.value }))} />
          </div>
          <div>
            <label className="label">Currency</label>
            <select className="input" value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}>
              <option value="PKR">PKR — Pakistani Rupee</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="INR">INR — Indian Rupee</option>
              <option value="AED">AED — UAE Dirham</option>
            </select>
          </div>
        </div>
        <button onClick={save} className="btn-primary flex items-center gap-2 text-sm">
          <Save size={15} /> Save Settings
        </button>
      </div>

      {/* Danger Zone */}
      <div className="card p-5 border-red-900/50">
        <h2 className="text-sm font-semibold text-red-400 border-b border-pos-border pb-2 mb-4">Danger Zone</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-pos-text">Clear Sales History</div>
              <div className="text-xs text-pos-muted">Remove all transaction records</div>
            </div>
            <button onClick={() => clearData('transactions')} className="btn-danger text-xs py-1.5 flex items-center gap-1">
              <Trash2 size={13} /> Clear
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-pos-text">Clear All Products</div>
              <div className="text-xs text-pos-muted">Remove all products from inventory</div>
            </div>
            <button onClick={() => clearData('products')} className="btn-danger text-xs py-1.5 flex items-center gap-1">
              <Trash2 size={13} /> Clear
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-pos-muted">
        SwiftPOS v1.0 — Offline-first PWA — All data stored in your browser
      </div>
    </div>
  )
}
