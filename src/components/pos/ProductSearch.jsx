import React, { useState, useEffect, useRef } from 'react'
import { Search, Barcode } from 'lucide-react'
import { productService } from '../../services/productService'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../db/database'

export default function ProductSearch({ onAddProduct }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [selectedCat, setSelectedCat] = useState('All')
  const inputRef = useRef(null)

  const allProducts = useLiveQuery(() => db.products.orderBy('name').toArray(), [])
  const categories = ['All', ...new Set((allProducts || []).map(p => p.category).filter(Boolean))]

  useEffect(() => {
    const search = async () => {
      if (!allProducts) return
      let filtered = allProducts
      if (selectedCat !== 'All') filtered = filtered.filter(p => p.category === selectedCat)
      if (query.trim()) {
        const q = query.toLowerCase()
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
        )
      }
      setResults(filtered.slice(0, 20))
      setShowResults(true)
    }
    search()
  }, [query, selectedCat, allProducts])

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && query.trim()) {
      // Try barcode match first
      const product = await productService.getBySku(query.trim())
      if (product) {
        onAddProduct(product)
        setQuery('')
        return
      }
      // else show results
    }
  }

  const handleSelect = (product) => {
    onAddProduct(product)
    setQuery('')
    setShowResults(false)
    inputRef.current?.focus()
  }

  // Keyboard shortcut F2 to focus search
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'F2') { e.preventDefault(); inputRef.current?.focus() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="flex flex-col gap-3">
      {/* Search input */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-pos-muted" />
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowResults(true)}
          placeholder="Search product or scan barcode... (F2)"
          className="input pl-9 pr-10 text-sm"
          autoComplete="off"
        />
        <Barcode size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-pos-muted" />
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedCat === cat
                ? 'bg-pos-accent text-white'
                : 'bg-pos-card text-pos-muted hover:text-pos-text border border-pos-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {showResults && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
          {results.map(product => (
            <button
              key={product.id}
              onClick={() => handleSelect(product)}
              className="card p-3 text-left hover:border-pos-accent transition-all duration-150 active:scale-95 group"
            >
              <div className="text-xs text-pos-muted font-display mb-1">{product.sku}</div>
              <div className="text-sm font-medium text-pos-text leading-tight group-hover:text-pos-accent transition-colors line-clamp-2">
                {product.name}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-pos-accent font-semibold text-sm">
                  {Number(product.price).toFixed(0)}
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${product.stock > 0 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                  {product.stock > 0 ? `${product.stock} left` : 'Out'}
                </span>
              </div>
            </button>
          ))}
          {results.length === 0 && (
            <div className="col-span-3 text-center py-8 text-pos-muted text-sm">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  )
}
