import React from 'react'
import { PlayCircle, Trash2, ShoppingCart } from 'lucide-react'
import { format } from 'date-fns'

export default function HeldCarts({ sessions, onResume, onDelete }) {
  if (!sessions.length) return null

  return (
    <div className="mt-4">
      <div className="text-xs font-medium text-pos-muted uppercase tracking-wider mb-2 px-1">
        Held Bills ({sessions.length})
      </div>
      <div className="flex flex-col gap-2">
        {sessions.map(s => (
          <div key={s.id} className="card p-3 flex items-center gap-3 hover:border-pos-accent transition-all group">
            <ShoppingCart size={16} className="text-pos-muted shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-pos-text truncate">{s.name}</div>
              <div className="text-xs text-pos-muted">
                {s.items?.length || 0} items · {s.createdAt ? format(new Date(s.createdAt), 'hh:mm a') : ''}
              </div>
            </div>
            <button
              onClick={() => onResume(s)}
              className="p-1.5 rounded-lg hover:bg-green-900/30 text-pos-muted hover:text-green-400 transition-all"
              title="Resume"
            >
              <PlayCircle size={16} />
            </button>
            <button
              onClick={() => onDelete(s.id)}
              className="p-1.5 rounded-lg hover:bg-red-900/30 text-pos-muted hover:text-red-400 transition-all"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
