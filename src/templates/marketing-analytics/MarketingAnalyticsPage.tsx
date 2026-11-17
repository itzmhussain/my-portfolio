import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartFrame } from '../../components/ChartFrame'
import { DataTable, type Column } from '../../components/DataTable'
import { PeriodFilter } from '../../components/PeriodFilter'
import { MetricStrip } from '../../components/MetricStrip'
import { TemplateShell } from '../../components/TemplateShell'
import layout from '../../components/layout.module.css'
import { axisStyle, chartColors, gridStroke } from '../../components/chartTheme'
import {
  getDevices,
  getSummary as getAnalyticsSummary,
  getTrafficSources,
} from '../../data/digital-analytics'
import {
  getCampaigns,
  getChannelAttribution,
  getFunnel,
  getSummary as getMarketingSummary,
  type Campaign,
} from '../../data/marketing'
import { formatCurrency, formatNumber } from '../../lib/formatters'
import type { DateRangeKey } from '../../lib/types'

export function MarketingAnalyticsPage() {
  const [range, setRange] = useState<DateRangeKey>('30d')
  const marketingMetrics = getMarketingSummary(range)
  const analyticsMetrics = getAnalyticsSummary(range)
  const campaigns = getCampaigns(range)
  const funnel = getFunnel(range)
  const attribution = getChannelAttribution(range)
  const devices = getDevices(range)
  const sources = getTrafficSources(range)

  const mergedMetrics = [
    marketingMetrics[0],
    marketingMetrics[2],
    analyticsMetrics[0],
    analyticsMetrics[1],
  ]

  const columns: Column<Campaign>[] = [
    { key: 'name', header: 'Campaign', render: (r) => r.name },
    { key: 'channel', header: 'Channel', render: (r) => r.channel },
    {
      key: 'spend',
      header: 'Spend',
      align: 'right',
      render: (r) => formatCurrency(r.spend),
    },
    {
      key: 'revenue',
      header: 'Revenue',
      align: 'right',
      render: (r) => formatCurrency(r.revenue),
    },
    {
      key: 'roas',
      header: 'ROAS',
      align: 'right',
      render: (r) => `${r.roas.toFixed(2)}x`,
    },
    {
      key: 'conversions',
      header: 'Conv.',
      align: 'right',
      render: (r) => formatNumber(r.conversions),
    },
  ]

  return (
    <TemplateShell
      title="Marketing & Analytics"
      eyebrow="Live template"
      actions={<PeriodFilter value={range} onChange={setRange} />}
    >
      <div className={layout.panel}>
        <MetricStrip metrics={mergedMetrics} />
      </div>

      <div className={layout.panel}>
        <ChartFrame title="Campaign performance" hint="Sorted by ROAS">
          <DataTable columns={columns} rows={campaigns} rowKey={(r) => r.name} />
        </ChartFrame>
      </div>

      <div className={layout.grid2}>
        <div className={layout.panel}>
          <ChartFrame title="Conversion funnel">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={funnel}>
                <CartesianGrid stroke={gridStroke} vertical={false} />
                <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis
                  tick={axisStyle}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatNumber(Number(v), true)}
                />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Bar dataKey="value" fill="#1d4e89" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </div>

        <div className={layout.panel}>
          <ChartFrame title="Channel attribution" hint="Attributed revenue">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={attribution} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid stroke={gridStroke} horizontal={false} />
                <XAxis
                  type="number"
                  tick={axisStyle}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatCurrency(Number(v), true)}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={axisStyle}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="value" fill="#0d7a6f" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </div>
      </div>

      <div className={layout.grid2}>
        <div className={layout.panel}>
          <ChartFrame title="Traffic sources">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={sources}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {sources.map((s, i) => (
                    <Cell key={s.name} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </ChartFrame>
        </div>

        <div className={layout.panel}>
          <ChartFrame title="Device mix">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={devices}>
                <CartesianGrid stroke={gridStroke} vertical={false} />
                <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis
                  tick={axisStyle}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatNumber(Number(v), true)}
                />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Bar dataKey="value" fill="#c45c26" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </div>
      </div>
    </TemplateShell>
  )
}
