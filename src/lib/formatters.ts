export function formatCurrency(value: number, compact = false): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value)
}

export function formatNumber(value: number, compact = false): string {
  return new Intl.NumberFormat('en-US', {
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value)
}

export function formatPercent(value: number, digits = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(digits)}%`
}

export function formatMetric(
  value: number,
  format: 'currency' | 'number' | 'percent' | 'compact',
): string {
  switch (format) {
    case 'currency':
      return formatCurrency(value)
    case 'compact':
      return formatNumber(value, true)
    case 'percent':
      return `${value.toFixed(1)}%`
    default:
      return formatNumber(value)
  }
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
