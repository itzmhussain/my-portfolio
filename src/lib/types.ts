export type TemplateStatus = 'live' | 'stub'

export type TemplateMeta = {
  id: string
  title: string
  description: string
  domains: string[]
  status: TemplateStatus
  path: string
}

export type DateRangeKey = '7d' | '30d' | '90d'

export type TimePoint = {
  date: string
  value: number
}

export type NamedValue = {
  name: string
  value: number
}

export type MetricSummary = {
  label: string
  value: number
  delta: number
  format: 'currency' | 'number' | 'percent' | 'compact'
}
