import type { DateRangeKey, MetricSummary, NamedValue, TimePoint } from '../../lib/types'
import { avg, buildSeries, createRng, sliceSeries, sum } from '../../lib/seed'

const DAYS = 90
const activationsSeries = buildSeries(DAYS, 1850, 0.07, 2001, 4)
const salesSeries = buildSeries(DAYS, 2100, 0.08, 2002, 5)
const enablementSeries = buildSeries(DAYS, 92, 0.03, 2003, 0.02)

export type EnablementStage = {
  stage: string
  count: number
  slaMet: number
}

function rangeDays(range: DateRangeKey): number {
  if (range === '7d') return 7
  if (range === '30d') return 30
  return 90
}

export function getOpsSeries(range: DateRangeKey = '30d'): {
  activations: TimePoint[]
  sales: TimePoint[]
  enablementSla: TimePoint[]
} {
  const days = rangeDays(range)
  return {
    activations: sliceSeries(activationsSeries, days),
    sales: sliceSeries(salesSeries, days),
    enablementSla: sliceSeries(enablementSeries, days),
  }
}

export function getSummary(range: DateRangeKey = '30d'): MetricSummary[] {
  const { activations, sales, enablementSla } = getOpsSeries(range)
  const act = sum(activations.map((p) => p.value))
  const sale = sum(sales.map((p) => p.value))
  const sla = avg(enablementSla.map((p) => p.value))
  const churn = 1.8 + (rangeDays(range) % 5) * 0.05
  const nps = 42 + (rangeDays(range) % 7)

  return [
    { label: 'Activations', value: Math.round(act), delta: 5.6, format: 'number' },
    { label: 'Plan Sales', value: Math.round(sale), delta: 3.2, format: 'number' },
    { label: 'Enablement SLA', value: sla, delta: 1.1, format: 'percent' },
    { label: 'Churn / NPS', value: churn, delta: nps / 10, format: 'percent' },
  ]
}

export function getSalesByPlan(range: DateRangeKey = '30d'): NamedValue[] {
  const rng = createRng(2100 + rangeDays(range))
  const plans = ['Prepaid Basic', 'Postpaid Flex', 'Family Share', 'Business Pro', '5G Unlimited']
  const total = sum(getOpsSeries(range).sales.map((p) => p.value))
  const weights = plans.map(() => 0.5 + rng())
  const totalW = sum(weights)
  return plans
    .map((name, i) => ({ name, value: Math.round(total * (weights[i] / totalW)) }))
    .sort((a, b) => b.value - a.value)
}

export function getEnablementPipeline(range: DateRangeKey = '30d'): EnablementStage[] {
  const rng = createRng(2200 + rangeDays(range))
  const scale = rangeDays(range) / 30
  const stages = [
    'Order Captured',
    'SIM / eSIM Provisioned',
    'Network Profile Ready',
    'First Attach',
    'Service Enabled',
  ]
  let remaining = Math.round((12000 + rng() * 3000) * scale)
  return stages.map((stage, i) => {
    const drop = i === 0 ? 1 : 0.82 + rng() * 0.12
    remaining = Math.round(remaining * drop)
    return {
      stage,
      count: remaining,
      slaMet: Math.round((88 + rng() * 10) * 10) / 10,
    }
  })
}

export function getRegionalBreakdown(range: DateRangeKey = '30d'): NamedValue[] {
  const rng = createRng(2300 + rangeDays(range))
  const regions = ['North', 'South', 'East', 'West', 'Central', 'Metro']
  const total = sum(getOpsSeries(range).activations.map((p) => p.value))
  const weights = regions.map(() => 0.5 + rng())
  const totalW = sum(weights)
  return regions
    .map((name, i) => ({ name, value: Math.round(total * (weights[i] / totalW)) }))
    .sort((a, b) => b.value - a.value)
}

export function getNpsChurn(range: DateRangeKey = '30d'): { nps: number; churn: number } {
  return {
    nps: 42 + (rangeDays(range) % 7),
    churn: Math.round((1.8 + (rangeDays(range) % 5) * 0.05) * 100) / 100,
  }
}
