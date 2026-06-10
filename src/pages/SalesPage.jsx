import React, { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Search, Download, Eye, Receipt, TrendingUp } from 'lucide-react'
import { format, isToday, isYesterday, parseISO } from 'date-fns'
import db from '../db/database'
import { transactionService } from '../services/transactionService'
import Modal from '../components/ui/Modal'
import { useApp } from '../context/AppContext'
import { useToast } from '../components/ui/Toast'

export default function SalesPage() {
  const { settings } = useApp()
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [viewTxn, setViewTxn] = useState(null)

  const transactions = useLiveQuery(() => db.transactions.orderBy('date').reverse().toArray(), [])

  const filtered = (transactions || []).filter(t =>
    !search.trim() ||
    t.invoiceNo?.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (date) => {
    const d = new Date(date)
    if (isToday(d)) return `Today ${format(d, 'hh:mm a')}`
    if (isYesterday(d)) return `Yesterday ${format(d, 'hh:mm a')}`
    return format(d, 'MMM dd, yyyy hh:mm a')
  }

  const exportCSV = async () => {
    const csv = await transactionService.exportCSV()
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sales-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast('CSV exported', 'success')
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-pos-text">Sales History</h1>
          <p className="text-pos-muted text-sm mt-1">{filtered.length} transactions</p>
        </div>
        <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 text-sm">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-pos-muted" />
        <input
          className="input pl-9 text-sm"
          placeholder="Search by invoice number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Transactions list */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-pos-border text-pos-muted text-xs uppercase tracking-wider">
              <th className="text-left p-4">Invoice</th>
              <th className="text-left p-4 hidden sm:table-cell">Date</th>
              <th className="text-right p-4 hidden md:table-cell">Items</th>
              <th className="text-right p-4 hidden lg:table-cell">Discount</th>
              <th className="text-right p-4 hidden lg:table-cell">Tax</th>
              <th className="text-right p-4">Total</th>
              <th className="text-right p-4 hidden md:table-cell">Profit</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className="border-b border-pos-border last:border-0 hover:bg-pos-surface/50 transition-colors">
                <td className="p-4">
                  <span className="font-display text-xs bg-pos-surface px-2 py-1 rounded text-pos-accent">{t.invoiceNo}</span>
                </td>
                <td className="p-4 text-pos-muted hidden sm:table-cell text-xs">{formatDate(t.date)}</td>
                <td className="p-4 text-right text-pos-muted hidden md:table-cell">{t.items?.length || 0}</td>
                <td className="p-4 text-right text-green-400 hidden lg:table-cell font-display">
                  {t.discountAmount > 0 ? `-${Number(t.discountAmount).toFixed(2)}` : '—'}
                </td>
                <td className="p-4 text-right text-pos-muted hidden lg:table-cell font-display">
                  {Number(t.taxAmount || 0).toFixed(2)}
                </td>
                <td className="p-4 text-right font-display font-bold text-pos-accent">
                  {Number(t.grandTotal).toFixed(2)}
                </td>
                <td className="p-4 text-right hidden md:table-cell">
                  <span className={`text-xs font-semibold font-display ${(t.profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {Number(t.profit || 0).toFixed(2)}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => setViewTxn(t)}
                    className="p-1.5 rounded-lg hover:bg-pos-border text-pos-muted hover:text-pos-text transition-all"
                  >
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-12 text-center text-pos-muted">
                  <Receipt size={32} className="mx-auto mb-3 opacity-30" />
                  <p>No transactions found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Transaction detail modal */}
      <Modal isOpen={!!viewTxn} onClose={() => setViewTxn(null)} title={`Invoice: ${viewTxn?.invoiceNo}`}>
        {viewTxn && (
          <div className="space-y-4 text-sm">
            <div className="text-pos-muted text-xs">{viewTxn.date && format(new Date(viewTxn.date), 'MMMM dd, yyyy — hh:mm a')}</div>
            <table className="w-full">
              <thead>
                <tr className="text-xs text-pos-muted border-b border-pos-border">
                  <th className="text-left pb-2">Item</th>
                  <th className="text-right pb-2">Qty</th>
                  <th className="text-right pb-2">Price</th>
                  <th className="text-right pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {(viewTxn.items || []).map((item, i) => (
                  <tr key={i} className="border-b border-pos-border/50">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2 text-right font-display">{item.qty}</td>
                    <td className="py-2 text-right font-display">{Number(item.price).toFixed(2)}</td>
                    <td className="py-2 text-right font-display font-semibold">{(item.price * item.qty).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="space-y-1 text-sm bg-pos-surface rounded-lg p-3">
              <div className="flex justify-between text-pos-muted"><span>Subtotal</span><span className="font-display">{Number(viewTxn.total).toFixed(2)}</span></div>
              {viewTxn.discountAmount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span className="font-display">-{Number(viewTxn.discountAmount).toFixed(2)}</span></div>}
              {viewTxn.taxAmount > 0 && <div className="flex justify-between text-pos-muted"><span>Tax ({viewTxn.taxRate}%)</span><span className="font-display">{Number(viewTxn.taxAmount).toFixed(2)}</span></div>}
              <div className="flex justify-between font-bold text-pos-accent border-t border-pos-border pt-2 mt-1"><span>Grand Total</span><span className="font-display">{Number(viewTxn.grandTotal).toFixed(2)}</span></div>
              {viewTxn.profit != null && <div className="flex justify-between text-green-400 text-xs pt-1"><span>Profit</span><span className="font-display">{Number(viewTxn.profit).toFixed(2)}</span></div>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
