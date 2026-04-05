export function formatDateTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return String(iso)
  return d.toLocaleString()
}

export function formatCurrency(amount) {
  const n = Number(amount)
  if (!Number.isFinite(n)) return ''
  try {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(n)
  } catch {
    return `Rs ${Math.round(n).toLocaleString('en-PK')}`
  }
}
