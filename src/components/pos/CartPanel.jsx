import React, { useState } from 'react'
import { ShoppingCart, Trash2, Pause, ChevronDown } from 'lucide-react'
import CartItem from './CartItem'
import { calcCartTotals, formatCurrency } from '../../utils/cartUtils'
import { useApp } from '../../context/AppContext'

export default function CartPanel({
  items, onUpdateQty, onRemove, onClear, onHold, onCheckout,
  discountType, setDiscountType, discountValue, setDiscountValue,
}) {
  const { settings } = useApp()
  const taxRate = settings.taxRate || 0
  const currency = settings.currency || 'PKR'
  const [showDiscount, setShowDiscount] = useState(false)

  const totals = calcCartTotals(items, discountType, discountValue, taxRate)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-pos-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-pos-accent" />
          <span className="font-semibold">Cart</span>
          {items.length > 0 && (
            <span className="bg-pos-accent text-white text-xs px-2 py-0.5 rounded-full font-display">
              {items.reduce((s, i) => s + i.qty, 0)}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {items.length > 0 && (
            <>
              <button onClick={onHold} title="Hold cart (F4)" className="p-1.5 rounded-lg hover:bg-pos-border text-pos-muted hover:text-pos-warning transition-all" >
                <Pause size={15} />
              </button>
              <button onClick={onClear} className="p-1.5 rounded-lg hover:bg-red-900/30 text-pos-muted hover:text-red-400 transition-all">
                <Trash2 size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-pos-muted gap-3">
            <ShoppingCart size={40} className="opacity-20" />
            <p className="text-sm">Cart is empty</p>
            <p className="text-xs opacity-60">Search and add products</p>
          </div>
        ) : (
          <div className="py-2">
            {items.map(item => (
              <CartItem key={item.id} item={item} onUpdateQty={onUpdateQty} onRemove={onRemove} />
            ))}
          </div>
        )}
      </div>

      {/* Discount & Tax */}
      {items.length > 0 && (
        <div className="px-4 pb-2">
          <button
            onClick={() => setShowDiscount(s => !s)}
            className="flex items-center gap-2 text-xs text-pos-muted hover:text-pos-accent transition-colors py-1"
          >
            <ChevronDown size={13} className={`transition-transform ${showDiscount ? 'rotate-180' : ''}`} />
            Discount & Tax
          </button>

          {showDiscount && (
            <div className="flex gap-2 mt-2 animate-fade-in">
              <select
                value={discountType}
                onChange={e => setDiscountType(e.target.value)}
                className="input text-xs py-1.5 w-24 shrink-0"
              >
                <option value="percent">%</option>
                <option value="fixed">Fixed</option>
              </select>
              <input
                type="number"
                value={discountValue}
                onChange={e => setDiscountValue(Number(e.target.value))}
                placeholder={discountType === 'percent' ? 'e.g. 10' : 'Amount'}
                min={0}
                className="input text-xs py-1.5 flex-1"
              />
            </div>
          )}
        </div>
      )}

      {/* Totals */}
      {items.length > 0 && (
        <div className="px-4 pb-4 border-t border-pos-border mt-1">
          <div className="space-y-1.5 py-3 text-sm">
            <div className="flex justify-between text-pos-muted">
              <span>Subtotal</span>
              <span className="font-display">{totals.subtotal.toFixed(2)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Discount</span>
                <span className="font-display">-{totals.discountAmount.toFixed(2)}</span>
              </div>
            )}
            {taxRate > 0 && (
              <div className="flex justify-between text-pos-muted">
                <span>Tax ({taxRate}%)</span>
                <span className="font-display">{totals.taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-pos-text font-bold text-base pt-2 border-t border-pos-border">
              <span>Total</span>
              <span className="font-display text-pos-accent">{totals.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => onCheckout(totals)}
            className="w-full btn-success py-3 text-sm font-bold tracking-wide"
          >
            Checkout — {currency} {totals.grandTotal.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  )
}
