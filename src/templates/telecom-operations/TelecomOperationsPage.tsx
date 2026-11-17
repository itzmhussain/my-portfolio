import { useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
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
import { axisStyle, gridStroke } from '../../components/chartTheme'
import { getChannelKpis, getVolumeMix } from '../../data/channel-ops'
import {
  getEnablementPipeline,
  getOpsSeries,
  getRegionalBreakdown,
  getSalesByPlan,
  getSummary,
  type EnablementStage,
} from '../../data/telecom-ops'
import { formatNumber, formatShortDate } from '../../lib/formatters'
import type { DateRangeKey } from '../../lib/types'

export function TelecomOperationsPage() {
  const [range, setRange] = useState<DateRangeKey>('30d')
  const metrics = getSummary(range)
  const { activations, sales, enablementSla } = getOpsSeries(range)
  const plans = getSalesByPlan(range)
  const pipeline = getEnablementPipeline(range)
  const regions = getRegionalBreakdown(range)
  const channelMix = getVolumeMix(range)
  const channelKpis = getChannelKpis(range)

  const trend = activations.map((a, i) => ({
    date: a.date,
    activations: a.value,
    sales: sales[i]?.value ?? 0,
    sla: enablementSla[i]?.value ?? 0,
  }))

  const pipelineColumns: Column<EnablementStage>[] = [
    { key: 'stage', header: 'Stage', render: (r) => r.stage },
    {
      key: 'count',
      header: 'Volume',
      align: 'right',
      render: (r) => formatNumber(r.count),
    },
    {
      key: 'sla',
      header: 'SLA met',
      align: 'right',
      render: (r) => `${r.slaMet.toFixed(1)}%`,
    },
  ]

  return (
    <TemplateShell
      title="Telecom Operations"
      eyebrow="Live template"
      actions={<PeriodFilter value={range} onChange={setRange} />}
    >
      <div className={layout.panel}>
        <MetricStrip metrics={metrics} />
      </div>

      <div className={layout.panel}>
        <ChartFrame
          title="Activations vs plan sales"
          hint="Daily volume with enablement SLA overlay"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trend}>
              <CartesianGrid stroke={gridStroke} vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatShortDate}
                tick={axisStyle}
                axisLine={false}
                tickLine={false}
                minTickGap={28}
              />
              <YAxis yAxisId="left" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[80, 100]}
                tick={axisStyle}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip labelFormatter={(l) => formatShortDate(String(l))} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="activations"
                stroke="#0d7a6f"
                fill="#0d7a6f22"
                strokeWidth={2}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                stroke="#1d4e89"
                fill="#1d4e8922"
                strokeWidth={2}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="sla"
                stroke="#c45c26"
                fill="transparent"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>

      <div className={layout.grid2}>
        <div className={layout.panel}>
          <ChartFrame title="Sales by plan">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={plans} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid stroke={gridStroke} horizontal={false} />
                <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={axisStyle}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#0d7a6f" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </div>

        <div className={layout.panel}>
          <ChartFrame title="Network enablement pipeline">
            <DataTable
              columns={pipelineColumns}
              rows={pipeline}
              rowKey={(r) => r.stage}
            />
          </ChartFrame>
        </div>
      </div>

      <div className={layout.grid2}>
        <div className={layout.panel}>
          <ChartFrame title="Regional activations" hint="Heatmap-style ranking">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={regions}>
                <CartesianGrid stroke={gridStroke} vertical={false} />
                <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#1d4e89" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </div>

        <div className={layout.panel}>
          <ChartFrame title="Channel ops snapshot" hint="Digital · Chatbot · POS">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={channelMix}>
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
            <DataTable
              columns={[
                { key: 'channel', header: 'Channel', render: (r) => r.channel },
                {
                  key: 'containment',
                  header: 'Containment',
                  align: 'right',
                  render: (r) => `${r.containment}%`,
                },
                {
                  key: 'aht',
                  header: 'AHT (s)',
                  align: 'right',
                  render: (r) => String(r.ahtSeconds),
                },
                {
                  key: 'conv',
                  header: 'Conv.',
                  align: 'right',
                  render: (r) => `${r.conversion}%`,
                },
              ]}
              rows={channelKpis}
              rowKey={(r) => r.channel}
            />
          </ChartFrame>
        </div>
      </div>
    </TemplateShell>
  )
}
