import { useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartFrame } from '../../components/ChartFrame'
import { DataTable } from '../../components/DataTable'
import { PeriodFilter } from '../../components/PeriodFilter'
import { MetricStrip } from '../../components/MetricStrip'
import { TemplateShell } from '../../components/TemplateShell'
import layout from '../../components/layout.module.css'
import { axisStyle, gridStroke } from '../../components/chartTheme'
import {
  getChannelKpis,
  getSummary,
  getVolumeSeries,
} from '../../data/channel-ops'
import { formatNumber, formatShortDate } from '../../lib/formatters'
import type { DateRangeKey } from '../../lib/types'
import styles from '../social-media/SocialMediaPage.module.css'

export function ChannelOperationsPage() {
  const [range, setRange] = useState<DateRangeKey>('30d')
  const metrics = getSummary(range)
  const { digital, chatbot, pos } = getVolumeSeries(range)
  const kpis = getChannelKpis(range)

  const trend = digital.map((d, i) => ({
    date: d.date,
    digital: d.value,
    chatbot: chatbot[i]?.value ?? 0,
    pos: pos[i]?.value ?? 0,
  }))

  return (
    <TemplateShell
      title="Channel Operations"
      eyebrow="Stub template · data wired"
      actions={<PeriodFilter value={range} onChange={setRange} />}
    >
      <div className={styles.stub}>
        <div className={styles.banner}>
          <h2 className={styles.bannerTitle}>Design view coming next</h2>
          <p className={styles.bannerText}>
            Digital, chatbot, and POS volumes with containment, AHT, and
            conversion are available. Build the channel operations layout on
            top of this data.
          </p>
        </div>

        <div className={layout.panel}>
          <MetricStrip metrics={metrics} />
        </div>

        <div className={layout.panel}>
          <ChartFrame title="Channel volume preview">
            <ResponsiveContainer width="100%" height={260}>
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
                <YAxis
                  tick={axisStyle}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatNumber(Number(v), true)}
                />
                <Tooltip labelFormatter={(l) => formatShortDate(String(l))} />
                <Area
                  type="monotone"
                  dataKey="digital"
                  stroke="#0d7a6f"
                  fill="#0d7a6f18"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="chatbot"
                  stroke="#1d4e89"
                  fill="#1d4e8918"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="pos"
                  stroke="#c45c26"
                  fill="#c45c2618"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartFrame>
        </div>

        <div className={layout.panel}>
          <ChartFrame title="Channel KPIs (sample)">
            <DataTable
              columns={[
                { key: 'channel', header: 'Channel', render: (r) => r.channel },
                {
                  key: 'volume',
                  header: 'Volume',
                  align: 'right',
                  render: (r) => formatNumber(r.volume),
                },
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
                  header: 'Conversion',
                  align: 'right',
                  render: (r) => `${r.conversion}%`,
                },
              ]}
              rows={kpis}
              rowKey={(r) => r.channel}
            />
          </ChartFrame>
        </div>
      </div>
    </TemplateShell>
  )
}
