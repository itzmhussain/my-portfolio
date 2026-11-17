import type { DateRangeKey, MetricSummary, NamedValue, TimePoint } from '../../lib/types'
import { avg, buildSeries, createRng, sliceSeries, sum } from '../../lib/seed'

const DAYS = 90
const engagementSeries = buildSeries(DAYS, 12400, 0.1, 1401, 35)
const reachSeries = buildSeries(DAYS, 86000, 0.08, 1402, 200)

export type SocialPost = {
  title: string
  platform: string
  engagement: number
  reach: number
  sentiment: number
}

function rangeDays(range: DateRangeKey): number {
  if (range === '7d') return 7
  if (range === '30d') return 30
  return 90
}

export function getEngagementSeries(range: DateRangeKey = '30d'): {
  engagement: TimePoint[]
  reach: TimePoint[]
} {
  const days = rangeDays(range)
  return {
    engagement: sliceSeries(engagementSeries, days),
    reach: sliceSeries(reachSeries, days),
  }
}

export function getSummary(range: DateRangeKey = '30d'): MetricSummary[] {
  const { engagement, reach } = getEngagementSeries(range)
  const eng = sum(engagement.map((p) => p.value))
  const rch = sum(reach.map((p) => p.value))
  const sentiment = avg(getSentimentBreakdown(range).map((s) => s.value * (s.name === 'Positive' ? 1 : s.name === 'Neutral' ? 0.5 : 0)))
  const posts = getTopPosts(range)

  return [
    { label: 'Engagements', value: Math.round(eng), delta: 7.8, format: 'compact' },
    { label: 'Reach', value: Math.round(rch), delta: 4.1, format: 'compact' },
    { label: 'Eng. Rate', value: rch ? (eng / rch) * 100 : 0, delta: 0.6, format: 'percent' },
    { label: 'Top Post Score', value: posts[0]?.engagement ?? 0, delta: sentiment, format: 'number' },
  ]
}

export function getSentimentBreakdown(range: DateRangeKey = '30d'): NamedValue[] {
  const rng = createRng(1500 + rangeDays(range))
  const positive = 0.55 + rng() * 0.15
  const neutral = 0.25 + rng() * 0.1
  const negative = Math.max(0.05, 1 - positive - neutral)
  const total = sum(getEngagementSeries(range).engagement.map((p) => p.value))
  return [
    { name: 'Positive', value: Math.round(total * positive) },
    { name: 'Neutral', value: Math.round(total * neutral) },
    { name: 'Negative', value: Math.round(total * negative) },
  ]
}

export function getPlatformMix(range: DateRangeKey = '30d'): NamedValue[] {
  const rng = createRng(1600 + rangeDays(range))
  const platforms = ['Instagram', 'TikTok', 'X', 'LinkedIn', 'Facebook']
  const weights = platforms.map(() => 0.4 + rng())
  const totalW = sum(weights)
  const total = sum(getEngagementSeries(range).engagement.map((p) => p.value))
  return platforms
    .map((name, i) => ({ name, value: Math.round(total * (weights[i] / totalW)) }))
    .sort((a, b) => b.value - a.value)
}

export function getTopPosts(range: DateRangeKey = '30d'): SocialPost[] {
  const rng = createRng(1700 + rangeDays(range))
  const titles = [
    'Behind the network upgrade',
    'Customer story: family plan',
    'Weekend flash offer',
    'How-to: eSIM activation',
    'Community spotlight',
  ]
  const platforms = ['Instagram', 'TikTok', 'LinkedIn', 'X', 'Facebook']
  const scale = rangeDays(range) / 30
  return titles
    .map((title, i) => ({
      title,
      platform: platforms[i % platforms.length],
      engagement: Math.round((2200 + rng() * 9000) * scale),
      reach: Math.round((18000 + rng() * 60000) * scale),
      sentiment: Math.round((60 + rng() * 35) * 10) / 10,
    }))
    .sort((a, b) => b.engagement - a.engagement)
}
