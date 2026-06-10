import Dexie from 'dexie'

export const db = new Dexie('SwiftPOS')

db.version(1).stores({
  products: '++id, sku, name, category, price, costPrice, stock, createdAt',
  transactions: '++id, invoiceNo, date, total, items, discount, tax, grandTotal, profit',
  cartSessions: '++id, name, createdAt, items, discount, tax',
  settings: 'key',
})

db.on('ready', async () => {
  const count = await db.products.count()
  if (count === 0) {
    await db.products.bulkAdd([
      { sku: 'SKU001', name: 'Coca-Cola 500ml', category: 'Beverages', price: 50, costPrice: 35, stock: 100, createdAt: new Date() },
      { sku: 'SKU002', name: 'Lays Classic Chips', category: 'Snacks', price: 40, costPrice: 28, stock: 150, createdAt: new Date() },
      { sku: 'SKU003', name: 'Bread Loaf', category: 'Bakery', price: 85, costPrice: 60, stock: 40, createdAt: new Date() },
      { sku: 'SKU004', name: 'Full Cream Milk 1L', category: 'Dairy', price: 120, costPrice: 90, stock: 60, createdAt: new Date() },
      { sku: 'SKU005', name: 'Basmati Rice 1kg', category: 'Grains', price: 200, costPrice: 155, stock: 200, createdAt: new Date() },
      { sku: 'SKU006', name: 'Sugar 1kg', category: 'Essentials', price: 130, costPrice: 100, stock: 80, createdAt: new Date() },
      { sku: 'SKU007', name: 'Mineral Water 1L', category: 'Beverages', price: 30, costPrice: 18, stock: 200, createdAt: new Date() },
      { sku: 'SKU008', name: 'Chocolate Bar', category: 'Snacks', price: 75, costPrice: 50, stock: 120, createdAt: new Date() },
      { sku: 'SKU009', name: 'Eggs (12 pcs)', category: 'Dairy', price: 180, costPrice: 140, stock: 50, createdAt: new Date() },
      { sku: 'SKU010', name: 'Shampoo 200ml', category: 'Personal Care', price: 220, costPrice: 160, stock: 30, createdAt: new Date() },
    ])
    await db.settings.put({ key: 'shopName', value: 'SwiftPOS Store' })
    await db.settings.put({ key: 'taxRate', value: 17 })
    await db.settings.put({ key: 'currency', value: 'PKR' })
    await db.settings.put({ key: 'invoiceCounter', value: 1000 })
  }
})

export default db
