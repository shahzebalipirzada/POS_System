import React, { useState, useEffect } from 'react'
import { productService } from '../../services/productService'
import { useToast } from '../ui/Toast'

const EMPTY = { name: '', sku: '', category: '', price: '', costPrice: '', stock: '' }

export default function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (product) setForm({ ...EMPTY, ...product })
    else setForm(EMPTY)
  }, [product])

  const set = (field, value) => setForm(p => ({ ...p, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price) return toast('Name and price are required', 'error')
    setLoading(true)
    try {
      const data = {
        name: form.name.trim(),
        sku: form.sku.trim() || `SKU-${Date.now()}`,
        category: form.category.trim(),
        price: parseFloat(form.price) || 0,
        costPrice: parseFloat(form.costPrice) || 0,
        stock: parseInt(form.stock) || 0,
      }
      if (product?.id) {
        await productService.update(product.id, data)
        toast('Product updated', 'success')
      } else {
        await productService.add(data)
        toast('Product added', 'success')
      }
      onSave()
    } catch (err) {
      toast('Error saving product', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Product Name *</label>
          <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Coca-Cola 500ml" required />
        </div>
        <div>
          <label className="label">SKU / Barcode</label>
          <input className="input font-display" value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="e.g. SKU001" />
        </div>
        <div>
          <label className="label">Category</label>
          <input className="input" value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Beverages" />
        </div>
        <div>
          <label className="label">Selling Price *</label>
          <input className="input font-display" type="number" min={0} step="0.01" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" required />
        </div>
        <div>
          <label className="label">Cost Price</label>
          <input className="input font-display" type="number" min={0} step="0.01" value={form.costPrice} onChange={e => set('costPrice', e.target.value)} placeholder="0.00" />
        </div>
        <div className="col-span-2">
          <label className="label">Stock Quantity</label>
          <input className="input font-display" type="number" min={0} value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" />
        </div>
      </div>

      {/* Profit preview */}
      {form.price && form.costPrice && (
        <div className="bg-pos-surface rounded-lg p-3 text-sm">
          <span className="text-pos-muted">Est. Profit: </span>
          <span className={Number(form.price) > Number(form.costPrice) ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
            {(Number(form.price) - Number(form.costPrice)).toFixed(2)} ({((Number(form.price) - Number(form.costPrice)) / Number(form.price) * 100).toFixed(1)}%)
          </span>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Saving...' : product ? 'Update' : 'Add Product'}
        </button>
      </div>
    </form>
  )
}
