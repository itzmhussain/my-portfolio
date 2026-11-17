import type { DateRangeKey, MetricSummary, NamedValue, TimePoint } from '../../lib/types'
import { avg, buildSeries, createRng, sliceSeries, sum } from '../../lib/seed'

const DAYS = 90
const sessionsSeries = buildSeries(DAYS, 18400, 0.07, 1001, 40)
const bounceSeries = buildSeries(DAYS, 42, 0.04, 1002, -0.02)

function rangeDays(range: DateRangeKey): number {
  if (range === '7d') return 7
  if (range === '30d') return 30
  return 90
}

export function getSessionSeries(range: DateRangeKey = '30d'): TimePoint[] {
  return sliceSeries(sessionsSeries, rangeDays(range))
}

export function getSummary(range: DateRangeKey = '30d'): MetricSummary[] {
  const sessions = getSessionSeries(range)
  const bounce = sliceSeries(bounceSeries, rangeDays(range))
  const totalSessions = sum(sessions.map((p) => p.value))
  const bounceRate = avg(bounce.map((p) => p.value))
  const pagesPerSession = 3.2 + (rangeDays(range) % 7) * 0.05
  const avgDurationSec = 168 + rangeDays(range)

  return [
    { label: 'Sessions', value: Math.round(totalSessions), delta: 5.4, format: 'compact' },
    { label: 'Bounce Rate', value: bounceRate, delta: -1.2, format: 'percent' },
    { label: 'Pages / Session', value: pagesPerSession, delta: 2.1, format: 'number' },
    { label: 'Avg. Duration (s)', value: avgDurationSec, delta: 3.0, format: 'number' },
  ]
}

export function getDevices(range: DateRangeKey = '30d'): NamedValue[] {
  const rng = createRng(1100 + rangeDays(range))
  const mobile = 0.52 + rng() * 0.08
  const desktop = 0.34 + rng() * 0.05
  const tablet = Math.max(0.05, 1 - mobile - desktop)
  const total = sum(getSessionSeries(range).map((p) => p.value))
  return [
    { name: 'Mobile', value: Math.round(total * mobile) },
    { name: 'Desktop', value: Math.round(total * desktop) },
    { name: 'Tablet', value: Math.round(total * tablet) },
  ]
}

export function getTrafficSources(range: DateRangeKey = '30d'): NamedValue[] {
  const rng = createRng(1200 + rangeDays(range))
  const sources = ['Organic', 'Paid', 'Direct', 'Referral', 'Social', 'Email']
  const weights = sources.map(() => 0.4 + rng())
  const totalW = sum(weights)
  const total = sum(getSessionSeries(range).map((p) => p.value))
  return sources
    .map((name, i) => ({ name, value: Math.round(total * (weights[i] / totalW)) }))
    .sort((a, b) => b.value - a.value)
}

export function getTopPages(range: DateRangeKey = '30d'): NamedValue[] {
  const rng = createRng(1300 + rangeDays(range))
  const pages = [
    '/home',
    '/products/wireless-buds',
    '/checkout',
    '/blog/activation-tips',
    '/plans/family',
    '/support',
  ]
  const scale = rangeDays(range) / 30
  return pages
    .map((name) => ({
      name,
      value: Math.round((8000 + rng() * 22000) * scale),
    }))
    .sort((a, b) => b.value - a.value)
}
