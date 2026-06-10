import React, { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { TrendingUp, ShoppingBag, DollarSign, BarChart2, Package, ArrowUp } from 'lucide-react'
import { format, subDays } from 'date-fns'
import { transactionService } from '../services/transactionService'
import { useApp } from '../context/AppContext'
import db from '../db/database'

function StatCard({ icon: Icon, label, value, sub, color = 'text-pos-accent' }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-pos-muted text-xs uppercase tracking-wider mb-2">{label}</div>
          <div className={`text-2xl font-bold font-display ${color}`}>{value}</div>
          {sub && <div className="text-pos-muted text-xs mt-1">{sub}</div>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color === 'text-green-400' ? 'bg-green-900/30' : color === 'text-blue-400' ? 'bg-blue-900/30' : 'bg-pos-accent/20'}`}>
          <Icon size={20} className={color} />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { settings } = useApp()
  const [todayStats, setTodayStats] = useState({ count: 0, revenue: 0, profit: 0 })
  const [topProducts, setTopProducts] = useState([])
  const [weeklyData, setWeeklyData] = useState([])

  const productCount = useLiveQuery(() => db.products.count(), [])

  useEffect(() => {
    const load = async () => {
      const stats = await transactionService.getTodayStats()
      setTodayStats(stats)
      const top = await transactionService.getTopProducts(6)
      setTopProducts(top)

      // Build weekly data
      const days = []
      for (let i = 6; i >= 0; i--) {
        const day = subDays(new Date(), i)
        const start = new Date(day); start.setHours(0, 0, 0, 0)
        const end = new Date(day); end.setHours(23, 59, 59, 999)
        const txns = await transactionService.getByDateRange(start, end)
        days.push({
          label: i === 0 ? 'Today' : format(day, 'EEE'),
          revenue: txns.reduce((s, t) => s + t.grandTotal, 0),
          count: txns.length,
        })
      }
      setWeeklyData(days)
    }
    load()
  }, [])

  const maxRevenue = Math.max(...weeklyData.map(d => d.revenue), 1)
  const cur = settings.currency || 'PKR'

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-pos-text">Dashboard</h1>
        <p className="text-pos-muted text-sm mt-1">{format(new Date(), 'EEEE, MMMM dd yyyy')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={DollarSign} label="Today's Revenue" value={`${cur} ${todayStats.revenue.toFixed(0)}`} sub={`${todayStats.count} transactions`} color="text-pos-accent" />
        <StatCard icon={TrendingUp} label="Today's Profit" value={`${cur} ${todayStats.profit.toFixed(0)}`} sub="Net margin" color="text-green-400" />
        <StatCard icon={ShoppingBag} label="Transactions" value={todayStats.count} sub="Today" color="text-blue-400" />
        <StatCard icon={Package} label="Products" value={productCount || 0} sub="In inventory" color="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} className="text-pos-accent" />
            <span className="text-sm font-semibold">Revenue — Last 7 Days</span>
          </div>
          <div className="flex items-end gap-2 h-40">
            {weeklyData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs font-display text-pos-muted">
                  {day.revenue > 0 ? day.revenue.toFixed(0) : ''}
                </div>
                <div
                  className="w-full rounded-t-md transition-all duration-500"
                  style={{
                    height: `${Math.max(4, (day.revenue / maxRevenue) * 120)}px`,
                    background: i === 6
                      ? 'linear-gradient(to top, #6c63ff, #9c95ff)'
                      : 'linear-gradient(to top, #2d3348, #3d4460)',
                  }}
                />
                <div className="text-xs text-pos-muted">{day.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-pos-accent" />
            <span className="text-sm font-semibold">Top Products</span>
          </div>
          {topProducts.length === 0 ? (
            <div className="text-center text-pos-muted text-sm py-8">No sales yet</div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => {
                const maxQty = topProducts[0]?.qty || 1
                return (
                  <div key={i} className="group">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-pos-text font-medium truncate flex-1 mr-2">{p.name}</span>
                      <span className="text-pos-muted font-display">{p.qty} sold</span>
                    </div>
                    <div className="h-1.5 bg-pos-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pos-accent rounded-full transition-all duration-700"
                        style={{ width: `${(p.qty / maxQty) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      {todayStats.transactions?.length > 0 && (
        <div className="card p-5 mt-4">
          <div className="text-sm font-semibold mb-4">Today's Transactions</div>
          <div className="space-y-2">
            {todayStats.transactions.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-pos-border last:border-0">
                <div>
                  <div className="text-xs font-display text-pos-accent">{t.invoiceNo}</div>
                  <div className="text-xs text-pos-muted">{t.items?.length} items</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold font-display text-pos-text">{cur} {Number(t.grandTotal).toFixed(2)}</div>
                  <div className="text-xs text-green-400">+{Number(t.profit || 0).toFixed(2)} profit</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
