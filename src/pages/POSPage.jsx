import React, { useState, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import ProductSearch from '../components/pos/ProductSearch'
import CartPanel from '../components/pos/CartPanel'
import HeldCarts from '../components/pos/HeldCarts'
import Receipt from '../components/pos/Receipt'
import { cartSessionService } from '../services/cartSessionService'
import { transactionService } from '../services/transactionService'
import { productService } from '../services/productService'
import { generateCartName, calcCartTotals } from '../utils/cartUtils'
import { useApp } from '../context/AppContext'
import { useToast } from '../components/ui/Toast'
import db from '../db/database'

export default function POSPage() {
  const { settings } = useApp()
  const toast = useToast()

  const [cartItems, setCartItems] = useState([])
  const [discountType, setDiscountType] = useState('percent')
  const [discountValue, setDiscountValue] = useState(0)
  const [receipt, setReceipt] = useState(null)

  const sessions = useLiveQuery(() => cartSessionService.getAll(), [])

  const addProduct = useCallback((product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...product, qty: 1 }]
    })
    toast(`Added: ${product.name}`, 'success', 1200)
  }, [toast])

  const updateQty = useCallback((id, qty) => {
    if (qty <= 0) {
      setCartItems(prev => prev.filter(i => i.id !== id))
    } else {
      setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
    }
  }, [])

  const removeItem = useCallback((id) => {
    setCartItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
    setDiscountValue(0)
  }, [])

  const holdCart = async () => {
    if (!cartItems.length) return
    const name = generateCartName()
    await cartSessionService.save({ name, items: cartItems, discount: { type: discountType, value: discountValue }, tax: settings.taxRate })
    clearCart()
    toast(`Cart held as "${name}"`, 'info')
  }

  const resumeCart = async (session) => {
    if (cartItems.length > 0) {
      const ok = window.confirm('Current cart will be cleared. Resume held cart?')
      if (!ok) return
    }
    setCartItems(session.items || [])
    setDiscountType(session.discount?.type || 'percent')
    setDiscountValue(session.discount?.value || 0)
    await cartSessionService.delete(session.id)
    toast('Cart resumed', 'success')
  }

  const deleteSession = async (id) => {
    await cartSessionService.delete(id)
    toast('Held cart removed', 'info')
  }

  const handleCheckout = async (totals) => {
    if (!cartItems.length) return
    try {
      const txn = await transactionService.save({
        items: cartItems.map(i => ({ id: i.id, name: i.name, sku: i.sku, price: i.price, costPrice: i.costPrice, qty: i.qty })),
        total: totals.subtotal,
        discountAmount: totals.discountAmount,
        discountType,
        discountValue,
        taxRate: settings.taxRate,
        taxAmount: totals.taxAmount,
        grandTotal: totals.grandTotal,
        profit: totals.profit,
      })
      // Decrement stock
      for (const item of cartItems) {
        if (item.id) await productService.decrementStock(item.id, item.qty)
      }
      setReceipt(txn)
      clearCart()
      toast('Sale completed!', 'success')
    } catch (err) {
      toast('Checkout failed', 'error')
      console.error(err)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left: Product Search */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-pos-text">Point of Sale</h1>
            <p className="text-xs text-pos-muted">{settings.shopName}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-pos-muted">Tax Rate</div>
            <div className="text-sm font-semibold text-pos-accent font-display">{settings.taxRate}%</div>
          </div>
        </div>

        <div className="card p-4">
          <ProductSearch onAddProduct={addProduct} />
        </div>

        <HeldCarts sessions={sessions || []} onResume={resumeCart} onDelete={deleteSession} />
      </div>

      {/* Right: Cart */}
      <div className="w-80 xl:w-96 bg-pos-surface border-l border-pos-border flex flex-col">
        <CartPanel
          items={cartItems}
          onUpdateQty={updateQty}
          onRemove={removeItem}
          onClear={clearCart}
          onHold={holdCart}
          onCheckout={handleCheckout}
          discountType={discountType}
          setDiscountType={setDiscountType}
          discountValue={discountValue}
          setDiscountValue={setDiscountValue}
        />
      </div>

      {/* Receipt modal */}
      {receipt && (
        <Receipt
          transaction={receipt}
          shopName={settings.shopName}
          onClose={() => setReceipt(null)}
        />
      )}
    </div>
  )
}
