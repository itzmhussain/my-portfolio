import type { DateRangeKey, MetricSummary, NamedValue, TimePoint } from '../../lib/types'
import { avg, buildSeries, createRng, sliceSeries, sum } from '../../lib/seed'

const DAYS = 90
const spendSeries = buildSeries(DAYS, 8500, 0.06, 701, 20)
const revenueSeries = buildSeries(DAYS, 28000, 0.09, 702, 120)

export type Campaign = {
  name: string
  channel: string
  spend: number
  revenue: number
  roas: number
  conversions: number
}

const CAMPAIGNS_BASE: Omit<Campaign, 'spend' | 'revenue' | 'roas' | 'conversions'>[] = [
  { name: 'Spring Launch — Search', channel: 'Paid Search' },
  { name: 'Retargeting Always-On', channel: 'Display' },
  { name: 'Creator Collab Q4', channel: 'Social' },
  { name: 'Lifecycle Winback', channel: 'Email' },
  { name: 'Brand Awareness TV+', channel: 'Video' },
  { name: 'App Install Push', channel: 'Mobile' },
]

function rangeDays(range: DateRangeKey): number {
  if (range === '7d') return 7
  if (range === '30d') return 30
  return 90
}

export function getSpendRevenueSeries(range: DateRangeKey = '30d'): {
  spend: TimePoint[]
  revenue: TimePoint[]
} {
  const days = rangeDays(range)
  return {
    spend: sliceSeries(spendSeries, days),
    revenue: sliceSeries(revenueSeries, days),
  }
}

export function getSummary(range: DateRangeKey = '30d'): MetricSummary[] {
  const { spend, revenue } = getSpendRevenueSeries(range)
  const spendTotal = sum(spend.map((p) => p.value))
  const revTotal = sum(revenue.map((p) => p.value))
  const roas = spendTotal ? revTotal / spendTotal : 0
  const campaigns = getCampaigns(range)
  const conversions = sum(campaigns.map((c) => c.conversions))

  return [
    { label: 'Ad Spend', value: spendTotal, delta: 4.2, format: 'currency' },
    { label: 'Attributed Revenue', value: revTotal, delta: 8.1, format: 'currency' },
    { label: 'Blended ROAS', value: Math.round(roas * 100) / 100, delta: 3.5, format: 'number' },
    { label: 'Conversions', value: conversions, delta: 6.0, format: 'number' },
  ]
}

export function getCampaigns(range: DateRangeKey = '30d'): Campaign[] {
  const rng = createRng(800 + rangeDays(range))
  const scale = rangeDays(range) / 30
  return CAMPAIGNS_BASE.map((c) => {
    const spend = Math.round((4000 + rng() * 18000) * scale)
    const roas = 1.4 + rng() * 3.2
    const revenue = Math.round(spend * roas)
    const conversions = Math.round(spend / (18 + rng() * 40))
    return { ...c, spend, revenue, roas: Math.round(roas * 100) / 100, conversions }
  }).sort((a, b) => b.roas - a.roas)
}

export function getFunnel(range: DateRangeKey = '30d'): NamedValue[] {
  const rng = createRng(900 + rangeDays(range))
  const impressions = Math.round((420000 + rng() * 80000) * (rangeDays(range) / 30))
  const clicks = Math.round(impressions * (0.018 + rng() * 0.01))
  const landing = Math.round(clicks * (0.72 + rng() * 0.1))
  const addToCart = Math.round(landing * (0.22 + rng() * 0.08))
  const purchase = Math.round(addToCart * (0.35 + rng() * 0.1))
  return [
    { name: 'Impressions', value: impressions },
    { name: 'Clicks', value: clicks },
    { name: 'Landing Views', value: landing },
    { name: 'Add to Cart', value: addToCart },
    { name: 'Purchases', value: purchase },
  ]
}

export function getChannelAttribution(range: DateRangeKey = '30d'): NamedValue[] {
  const campaigns = getCampaigns(range)
  const byChannel = new Map<string, number>()
  for (const c of campaigns) {
    byChannel.set(c.channel, (byChannel.get(c.channel) ?? 0) + c.revenue)
  }
  return [...byChannel.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export function getAvgRoas(range: DateRangeKey = '30d'): number {
  return avg(getCampaigns(range).map((c) => c.roas))
}
