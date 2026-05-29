import db from '../db/database'
import { format } from 'date-fns'

export const transactionService = {
  async getNextInvoiceNo() {
    const setting = await db.settings.get('invoiceCounter')
    const next = (setting?.value || 1000) + 1
    await db.settings.put({ key: 'invoiceCounter', value: next })
    return `INV-${String(next).padStart(6, '0')}`
  },

  async save(transactionData) {
    const invoiceNo = await this.getNextInvoiceNo()
    const record = {
      ...transactionData,
      invoiceNo,
      date: new Date(),
    }
    const id = await db.transactions.add(record)
    return { ...record, id }
  },

  async getAll() {
    return db.transactions.orderBy('date').reverse().toArray()
  },

  async getById(id) {
    return db.transactions.get(id)
  },

  async getByDateRange(start, end) {
    return db.transactions
      .where('date')
      .between(start, end, true, true)
      .toArray()
  },

  async getTodayStats() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const txns = await this.getByDateRange(today, tomorrow)
    const revenue = txns.reduce((s, t) => s + t.grandTotal, 0)
    const profit = txns.reduce((s, t) => s + (t.profit || 0), 0)
    return { count: txns.length, revenue, profit, transactions: txns }
  },

  async getTopProducts(limit = 5) {
    const all = await db.transactions.toArray()
    const productMap = {}
    all.forEach(t => {
      (t.items || []).forEach(item => {
        if (!productMap[item.name]) productMap[item.name] = { name: item.name, qty: 0, revenue: 0 }
        productMap[item.name].qty += item.qty
        productMap[item.name].revenue += item.qty * item.price
      })
    })
    return Object.values(productMap).sort((a, b) => b.qty - a.qty).slice(0, limit)
  },

  async exportCSV() {
    const txns = await this.getAll()
    const rows = [['Invoice No', 'Date', 'Items', 'Subtotal', 'Discount', 'Tax', 'Grand Total', 'Profit']]
    txns.forEach(t => {
      rows.push([
        t.invoiceNo,
        format(new Date(t.date), 'yyyy-MM-dd HH:mm'),
        t.items.length,
        t.total.toFixed(2),
        (t.discount || 0).toFixed(2),
        (t.taxAmount || 0).toFixed(2),
        t.grandTotal.toFixed(2),
        (t.profit || 0).toFixed(2),
      ])
    })
    return rows.map(r => r.join(',')).join('\n')
  },
}
