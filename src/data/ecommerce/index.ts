import type { DateRangeKey, NamedValue, TimePoint } from '../../lib/types'
import { avg, buildSeries, createRng, sliceSeries, sum } from '../../lib/seed'

const DAYS = 90
const revenueSeries = buildSeries(DAYS, 42000, 0.08, 101, 180)
const ordersSeries = buildSeries(DAYS, 620, 0.07, 202, 2.2)
const pageViewsSeries = buildSeries(DAYS, 18400, 0.09, 111, 55)
const visitorsSeries = buildSeries(DAYS, 9200, 0.08, 112, 28)
const clicksSeries = buildSeries(DAYS, 3100, 0.1, 113, 12)
const profitSeries = buildSeries(DAYS, 18500, 0.11, 114, 90)

function rangeDays(range: DateRangeKey): number {
  if (range === '7d') return 7
  if (range === '30d') return 30
  return 90
}

function deltaFor(series: TimePoint[]): number {
  const half = Math.floor(series.length / 2) || 1
  const prev = sum(series.slice(0, half).map((p) => p.value))
  const curr = sum(series.slice(half).map((p) => p.value))
  return prev ? ((curr - prev) / prev) * 100 : 0
}

export type EcommerceKpi = {
  id: string
  label: string
  value: number
  delta: number
  format: 'number' | 'compact'
  icon: 'views' | 'visitors' | 'clicks' | 'orders'
}

export type BestSeller = {
  id: string
  name: string
  sold: number
  revenue: number
  rating: number
  color: string
}

export type CustomerSegment = {
  name: string
  percent: number
  color: string
}

export type DayActivity = {
  day: string
  value: number
}

export type WidgetOption = {
  id: string
  title: string
  description: string
  tag: string
  preview: 'devices' | 'overview' | 'orders' | 'trend' | 'segments'
}

export function getTimeSeries(range: DateRangeKey = '30d'): {
  revenue: TimePoint[]
  orders: TimePoint[]
  aov: TimePoint[]
  profit: TimePoint[]
} {
  const days = rangeDays(range)
  const revenue = sliceSeries(revenueSeries, days)
  const orders = sliceSeries(ordersSeries, days)
  const profit = sliceSeries(profitSeries, days)
  const aov = revenue.map((r, i) => ({
    date: r.date,
    value: Math.round((r.value / Math.max(orders[i]?.value || 1, 1)) * 100) / 100,
  }))
  return { revenue, orders, aov, profit }
}

export function getDashboardKpis(range: DateRangeKey = '30d'): EcommerceKpi[] {
  const days = rangeDays(range)
  const views = sliceSeries(pageViewsSeries, days)
  const visitors = sliceSeries(visitorsSeries, days)
  const clicks = sliceSeries(clicksSeries, days)
  const orders = sliceSeries(ordersSeries, days)

  return [
    {
      id: 'views',
      label: 'Page Views',
      value: Math.round(sum(views.map((p) => p.value))),
      delta: deltaFor(views),
      format: 'compact',
      icon: 'views',
    },
    {
      id: 'visitors',
      label: 'Visitors',
      value: Math.round(sum(visitors.map((p) => p.value))),
      delta: deltaFor(visitors),
      format: 'compact',
      icon: 'visitors',
    },
    {
      id: 'clicks',
      label: 'Click',
      value: Math.round(sum(clicks.map((p) => p.value))),
      delta: -Math.abs(deltaFor(clicks) * 0.4),
      format: 'compact',
      icon: 'clicks',
    },
    {
      id: 'orders',
      label: 'Orders',
      value: Math.round(sum(orders.map((p) => p.value))),
      delta: deltaFor(orders),
      format: 'number',
      icon: 'orders',
    },
  ]
}

export function getProfitTrend(range: DateRangeKey = '30d'): TimePoint[] {
  return getTimeSeries(range).profit
}

export function getCustomerBreakdown(range: DateRangeKey = '30d'): CustomerSegment[] {
  const rng = createRng(404 + rangeDays(range))
  const retailers = 48 + rng() * 10
  const distributors = 28 + rng() * 8
  const wholesalers = Math.max(8, 100 - retailers - distributors)
  return [
    { name: 'Retailers', percent: Math.round(retailers), color: '#3B82F6' },
    { name: 'Distributors', percent: Math.round(distributors), color: '#22C55E' },
    { name: 'Wholesalers', percent: Math.round(wholesalers), color: '#F59E0B' },
  ]
}

export function getMostActiveDays(range: DateRangeKey = '30d'): DayActivity[] {
  const rng = createRng(505 + rangeDays(range))
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map((day, i) => ({
    day,
    value: Math.round(40 + rng() * 55 + (i === 1 ? 35 : 0)),
  }))
}

export function getBestSellers(range: DateRangeKey = '30d'): BestSeller[] {
  const rng = createRng(606 + rangeDays(range))
  const scale = rangeDays(range) / 30
  const items = [
    { name: 'Aura Wireless Buds', color: '#DBEAFE' },
    { name: 'Forge Running Shoe', color: '#DCFCE7' },
    { name: 'Lumen Desk Lamp', color: '#FEF3C7' },
    { name: 'Harbor Ceramic Set', color: '#E0E7FF' },
    { name: 'Northface Pack 28L', color: '#FCE7F3' },
  ]
  return items.map((item, i) => {
    const sold = Math.round((420 - i * 48 + rng() * 80) * scale)
    const price = 38 + rng() * 90
    return {
      id: `#PRD-${1024 + i}`,
      name: item.name,
      sold,
      revenue: Math.round(sold * price),
      rating: Math.round((4.2 + rng() * 0.7) * 10) / 10,
      color: item.color,
    }
  })
}

export function getRepeatCustomerRate(range: DateRangeKey = '30d'): number {
  return Math.round(62 + (rangeDays(range) % 9) + createRng(707)() * 4)
}

export function getChannelMix(range: DateRangeKey = '30d'): NamedValue[] {
  const rng = createRng(808 + rangeDays(range))
  const channels = ['Direct', 'Paid Search', 'Social', 'Email', 'Marketplace']
  const weights = channels.map(() => 0.5 + rng())
  const totalW = sum(weights)
  const revenue = sum(getTimeSeries(range).revenue.map((p) => p.value))
  return channels
    .map((name, i) => ({ name, value: Math.round(revenue * (weights[i] / totalW)) }))
    .sort((a, b) => b.value - a.value)
}

export function getTopProducts(range: DateRangeKey = '30d'): NamedValue[] {
  return getBestSellers(range).map((p) => ({ name: p.name, value: p.revenue }))
}

export function getSummary(range: DateRangeKey = '30d') {
  const kpis = getDashboardKpis(range)
  return kpis.map((k) => ({
    label: k.label,
    value: k.value,
    delta: k.delta,
    format: k.format === 'compact' ? ('compact' as const) : ('number' as const),
  }))
}

export function getWidgetCatalog(): WidgetOption[] {
  return [
    {
      id: 'visitors-device',
      title: 'Visitors by Device',
      description: 'See how visitors engage across mobile, tablet, and desktop.',
      tag: '#Audience Insights',
      preview: 'devices',
    },
    {
      id: 'dashboard-overview',
      title: 'Dashboard Overview',
      description: 'High-level snapshot of revenue, traffic, and conversion.',
      tag: '#Overview',
      preview: 'overview',
    },
    {
      id: 'orders-performance',
      title: 'Orders Performance',
      description: 'Track order volume, fulfillment pace, and cancel rates.',
      tag: '#Sales Ops',
      preview: 'orders',
    },
    {
      id: 'trend-analysis',
      title: 'Trend Analysis',
      description: 'Compare period-over-period growth across key metrics.',
      tag: '#Trends',
      preview: 'trend',
    },
    {
      id: 'customer-segmentation',
      title: 'Customer Segmentation',
      description: 'Break down buyers by segment, LTV, and purchase frequency.',
      tag: '#Customers',
      preview: 'segments',
    },
  ]
}

export function avgProfit(range: DateRangeKey = '30d'): number {
  return avg(getProfitTrend(range).map((p) => p.value))
}
