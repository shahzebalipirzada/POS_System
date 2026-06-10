import React, { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Search, Edit2, Trash2, Package, TrendingUp } from 'lucide-react'
import db from '../db/database'
import { productService } from '../services/productService'
import ProductForm from '../components/products/ProductForm'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [editProduct, setEditProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [catFilter, setCatFilter] = useState('All')
  const toast = useToast()

  const products = useLiveQuery(async () => {
    if (search.trim()) return productService.search(search)
    return db.products.orderBy('name').toArray()
  }, [search])

  const categories = useLiveQuery(async () => {
    const cats = await productService.getCategories()
    return ['All', ...cats]
  }, [])

  const filtered = (products || []).filter(p => catFilter === 'All' || p.category === catFilter)

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    await productService.delete(id)
    toast('Product deleted', 'info')
  }

  const openAdd = () => { setEditProduct(null); setShowForm(true) }
  const openEdit = (p) => { setEditProduct(p); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditProduct(null) }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-pos-text">Products</h1>
          <p className="text-pos-muted text-sm mt-1">{(products || []).length} total products</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-pos-muted" />
          <input
            className="input pl-9 text-sm"
            placeholder="Search by name, SKU, or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(categories || []).map(cat => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${catFilter === cat ? 'bg-pos-accent text-white' : 'bg-pos-card border border-pos-border text-pos-muted hover:text-pos-text'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-pos-border text-pos-muted text-xs uppercase tracking-wider">
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4 hidden sm:table-cell">SKU</th>
              <th className="text-left p-4 hidden md:table-cell">Category</th>
              <th className="text-right p-4">Price</th>
              <th className="text-right p-4 hidden lg:table-cell">Cost</th>
              <th className="text-right p-4 hidden lg:table-cell">Profit</th>
              <th className="text-right p-4">Stock</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const profit = p.price - (p.costPrice || 0)
              const margin = p.price > 0 ? (profit / p.price * 100) : 0
              return (
                <tr key={p.id} className="border-b border-pos-border last:border-0 hover:bg-pos-surface/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-pos-text">{p.name}</div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="font-display text-xs text-pos-muted bg-pos-surface px-2 py-0.5 rounded">{p.sku}</span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-xs text-pos-muted bg-pos-surface px-2 py-0.5 rounded-full">{p.category || '—'}</span>
                  </td>
                  <td className="p-4 text-right font-display font-semibold text-pos-accent">{Number(p.price).toFixed(2)}</td>
                  <td className="p-4 text-right font-display text-pos-muted hidden lg:table-cell">{Number(p.costPrice || 0).toFixed(2)}</td>
                  <td className="p-4 text-right hidden lg:table-cell">
                    <div className={`flex items-center justify-end gap-1 text-xs font-semibold ${profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <TrendingUp size={12} />
                      {profit.toFixed(2)} ({margin.toFixed(1)}%)
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className={`font-display text-sm font-semibold ${p.stock > 10 ? 'text-green-400' : p.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-pos-border text-pos-muted hover:text-pos-text transition-all">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 rounded-lg hover:bg-red-900/30 text-pos-muted hover:text-red-400 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-12 text-center text-pos-muted">
                  <Package size={32} className="mx-auto mb-3 opacity-30" />
                  <p>No products found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showForm} onClose={closeForm} title={editProduct ? 'Edit Product' : 'Add Product'}>
        <ProductForm product={editProduct} onSave={closeForm} onCancel={closeForm} />
      </Modal>
    </div>
  )
}
