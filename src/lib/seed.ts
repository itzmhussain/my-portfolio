/** Deterministic PRNG so sample data is stable across reloads. */
export function createRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

export function daysAgo(n: number, from = new Date('2026-11-16')): string {
  const d = new Date(from)
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export function buildSeries(
  days: number,
  base: number,
  volatility: number,
  seed: number,
  trend = 0,
): { date: string; value: number }[] {
  const rng = createRng(seed)
  const points: { date: string; value: number }[] = []
  let value = base
  for (let i = days - 1; i >= 0; i--) {
    const drift = trend * (1 - i / days)
    value = Math.max(0, value * (1 + (rng() - 0.48) * volatility) + drift)
    points.push({ date: daysAgo(i), value: Math.round(value * 100) / 100 })
  }
  return points
}

export function sliceSeries<T extends { date: string }>(
  series: T[],
  days: number,
): T[] {
  return series.slice(-days)
}

export function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0)
}

export function avg(values: number[]): number {
  if (!values.length) return 0
  return sum(values) / values.length
}
