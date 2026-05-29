import db from '../db/database'

export const productService = {
  async getAll() {
    return db.products.orderBy('name').toArray()
  },

  async getById(id) {
    return db.products.get(id)
  },

  async getBySku(sku) {
    return db.products.where('sku').equalsIgnoreCase(sku).first()
  },

  async search(query) {
    const q = query.toLowerCase()
    return db.products
      .filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q)))
      .toArray()
  },

  async add(product) {
    return db.products.add({ ...product, createdAt: new Date() })
  },

  async update(id, changes) {
    return db.products.update(id, changes)
  },

  async delete(id) {
    return db.products.delete(id)
  },

  async decrementStock(id, qty) {
    const product = await db.products.get(id)
    if (product) {
      await db.products.update(id, { stock: Math.max(0, product.stock - qty) })
    }
  },

  async getCategories() {
    const products = await db.products.toArray()
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))]
    return cats.sort()
  },
}
