import React from 'react'
import { Plus, Minus, Trash2 } from 'lucide-react'

export default function CartItem({ item, onUpdateQty, onRemove }) {
  const total = item.price * item.qty

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-pos-border last:border-0 animate-slide-in group">
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-pos-text truncate">{item.name}</div>
        <div className="text-xs text-pos-muted font-display mt-0.5">
          {Number(item.price).toFixed(2)} × {item.qty}
        </div>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onUpdateQty(item.id, item.qty - 1)}
          className="w-7 h-7 rounded-lg bg-pos-border hover:bg-pos-accent hover:text-white flex items-center justify-center transition-all active:scale-90"
        >
          <Minus size={12} />
        </button>
        <span className="w-8 text-center text-sm font-semibold font-display">{item.qty}</span>
        <button
          onClick={() => onUpdateQty(item.id, item.qty + 1)}
          className="w-7 h-7 rounded-lg bg-pos-border hover:bg-pos-accent hover:text-white flex items-center justify-center transition-all active:scale-90"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Total */}
      <div className="text-sm font-semibold text-pos-text w-16 text-right shrink-0 font-display">
        {total.toFixed(2)}
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.id)}
        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg hover:bg-red-900/50 hover:text-red-400 flex items-center justify-center transition-all text-pos-muted"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}
