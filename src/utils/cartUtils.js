export function calcCartTotals(items, discountType, discountValue, taxRate) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  let discountAmount = 0
  if (discountType === 'percent') {
    discountAmount = (subtotal * Math.min(100, discountValue || 0)) / 100
  } else {
    discountAmount = Math.min(subtotal, discountValue || 0)
  }

  const afterDiscount = subtotal - discountAmount
  const taxAmount = (afterDiscount * (taxRate || 0)) / 100
  const grandTotal = afterDiscount + taxAmount

  const profit = items.reduce((sum, item) => {
    const itemProfit = (item.price - (item.costPrice || 0)) * item.qty
    return sum + itemProfit
  }, 0) - discountAmount

  return {
    subtotal,
    discountAmount,
    afterDiscount,
    taxAmount,
    grandTotal,
    profit,
  }
}

export function generateCartName() {
  return `Cart ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
}

export function formatCurrency(amount, currency = 'PKR') {
  return `${currency} ${Number(amount || 0).toFixed(2)}`
}
