import React from 'react'
import { format } from 'date-fns'
import { Printer, X } from 'lucide-react'

export default function Receipt({ transaction, shopName, onClose }) {
  if (!transaction) return null

  const handlePrint = () => window.print()

  return (
    <>
      {/* Screen overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm no-print" onClick={onClose}>
        <div className="bg-white text-black rounded-xl shadow-2xl w-80 p-0 overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="bg-pos-accent text-white p-3 flex justify-between items-center">
            <span className="font-semibold text-sm">Receipt Preview</span>
            <button onClick={onClose}><X size={16} /></button>
          </div>
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <ReceiptContent t={transaction} shopName={shopName} />
          </div>
          <div className="p-3 border-t flex gap-2">
            <button onClick={onClose} className="flex-1 btn-secondary text-sm py-2 text-black border-gray-300">Close</button>
            <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 bg-pos-accent text-white py-2 rounded-lg text-sm font-semibold hover:bg-pos-accentHover transition-colors">
              <Printer size={15} /> Print
            </button>
          </div>
        </div>
      </div>

      {/* Print-only receipt */}
      <div className="print-only fixed top-0 left-0 hidden">
        <ReceiptContent t={transaction} shopName={shopName} printMode />
      </div>
    </>
  )
}

function ReceiptContent({ t, shopName, printMode }) {
  const date = t.date ? new Date(t.date) : new Date()

  return (
    <div style={{ fontFamily: 'monospace', fontSize: '12px', width: '100%', color: '#000', background: '#fff' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '2px' }}>{shopName || 'SwiftPOS'}</div>
        <div style={{ fontSize: '10px', marginTop: '2px', opacity: 0.6 }}>Powered by SwiftPOS</div>
        <div style={{ borderTop: '1px dashed #ccc', margin: '8px 0' }} />
        <div style={{ fontSize: '10px' }}>Invoice: <strong>{t.invoiceNo}</strong></div>
        <div style={{ fontSize: '10px' }}>{format(date, 'MMM dd, yyyy — hh:mm a')}</div>
      </div>

      {/* Items */}
      <div style={{ borderTop: '1px dashed #ccc', borderBottom: '1px dashed #ccc', padding: '8px 0', margin: '8px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10px', marginBottom: '4px' }}>
          <span>ITEM</span><span>QTY</span><span>AMT</span>
        </div>
        {(t.items || []).map((item, i) => (
          <div key={i} style={{ marginBottom: '4px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600' }}>{item.name}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', opacity: 0.8 }}>
              <span>{Number(item.price).toFixed(2)} × {item.qty}</span>
              <span>{(item.price * item.qty).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div style={{ fontSize: '11px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
          <span>Subtotal:</span><span>{Number(t.total).toFixed(2)}</span>
        </div>
        {t.discountAmount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span>Discount:</span><span>-{Number(t.discountAmount).toFixed(2)}</span>
          </div>
        )}
        {t.taxAmount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span>Tax ({t.taxRate}%):</span><span>{Number(t.taxAmount).toFixed(2)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', borderTop: '1px solid #ccc', paddingTop: '6px', marginTop: '4px' }}>
          <span>TOTAL:</span><span>{Number(t.grandTotal).toFixed(2)}</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '10px', opacity: 0.6 }}>
        <div style={{ borderTop: '1px dashed #ccc', paddingTop: '8px' }} />
        <div>Thank you for your purchase!</div>
        <div>Please come again</div>
        <div style={{ marginTop: '4px' }}>* * * * *</div>
      </div>
    </div>
  )
}
