import type { DateRangeKey, MetricSummary, NamedValue, TimePoint } from '../../lib/types'
import { avg, buildSeries, createRng, sliceSeries, sum } from '../../lib/seed'

const DAYS = 90
const digitalSeries = buildSeries(DAYS, 4200, 0.06, 3001, 8)
const chatbotSeries = buildSeries(DAYS, 3100, 0.09, 3002, 10)
const posSeries = buildSeries(DAYS, 2650, 0.05, 3003, 4)

export type ChannelKpi = {
  channel: string
  volume: number
  containment: number
  ahtSeconds: number
  conversion: number
}

function rangeDays(range: DateRangeKey): number {
  if (range === '7d') return 7
  if (range === '30d') return 30
  return 90
}

export function getVolumeSeries(range: DateRangeKey = '30d'): {
  digital: TimePoint[]
  chatbot: TimePoint[]
  pos: TimePoint[]
} {
  const days = rangeDays(range)
  return {
    digital: sliceSeries(digitalSeries, days),
    chatbot: sliceSeries(chatbotSeries, days),
    pos: sliceSeries(posSeries, days),
  }
}

export function getSummary(range: DateRangeKey = '30d'): MetricSummary[] {
  const channels = getChannelKpis(range)
  const volume = sum(channels.map((c) => c.volume))
  const containment = avg(channels.map((c) => c.containment))
  const aht = avg(channels.map((c) => c.ahtSeconds))
  const conversion = avg(channels.map((c) => c.conversion))

  return [
    { label: 'Total Interactions', value: Math.round(volume), delta: 4.8, format: 'compact' },
    { label: 'Containment', value: containment, delta: 2.2, format: 'percent' },
    { label: 'Avg Handle Time', value: Math.round(aht), delta: -3.1, format: 'number' },
    { label: 'Conversion', value: conversion, delta: 1.4, format: 'percent' },
  ]
}

export function getChannelKpis(range: DateRangeKey = '30d'): ChannelKpi[] {
  const { digital, chatbot, pos } = getVolumeSeries(range)
  const rng = createRng(3100 + rangeDays(range))
  return [
    {
      channel: 'Digital Web / App',
      volume: Math.round(sum(digital.map((p) => p.value))),
      containment: Math.round((78 + rng() * 12) * 10) / 10,
      ahtSeconds: Math.round(90 + rng() * 40),
      conversion: Math.round((4.2 + rng() * 2) * 10) / 10,
    },
    {
      channel: 'Chatbot',
      volume: Math.round(sum(chatbot.map((p) => p.value))),
      containment: Math.round((62 + rng() * 18) * 10) / 10,
      ahtSeconds: Math.round(45 + rng() * 25),
      conversion: Math.round((2.8 + rng() * 1.8) * 10) / 10,
    },
    {
      channel: 'Point of Sale',
      volume: Math.round(sum(pos.map((p) => p.value))),
      containment: Math.round((94 + rng() * 4) * 10) / 10,
      ahtSeconds: Math.round(320 + rng() * 80),
      conversion: Math.round((18 + rng() * 8) * 10) / 10,
    },
  ]
}

export function getVolumeMix(range: DateRangeKey = '30d'): NamedValue[] {
  return getChannelKpis(range).map((c) => ({ name: c.channel, value: c.volume }))
}
