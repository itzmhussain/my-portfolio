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
import { PeriodFilter } from '../../components/PeriodFilter'
import { MetricStrip } from '../../components/MetricStrip'
import { TemplateShell } from '../../components/TemplateShell'
import layout from '../../components/layout.module.css'
import { axisStyle, gridStroke } from '../../components/chartTheme'
import {
  getEngagementSeries,
  getPlatformMix,
  getSummary,
  getTopPosts,
} from '../../data/social'
import { formatNumber, formatShortDate } from '../../lib/formatters'
import type { DateRangeKey } from '../../lib/types'
import styles from './SocialMediaPage.module.css'

export function SocialMediaPage() {
  const [range, setRange] = useState<DateRangeKey>('30d')
  const metrics = getSummary(range)
  const { engagement, reach } = getEngagementSeries(range)
  const platforms = getPlatformMix(range)
  const posts = getTopPosts(range)

  const trend = engagement.map((e, i) => ({
    date: e.date,
    engagement: e.value,
    reach: reach[i]?.value ?? 0,
  }))

  return (
    <TemplateShell
      title="Social Media"
      eyebrow="Stub template · data wired"
      actions={<PeriodFilter value={range} onChange={setRange} />}
    >
      <div className={styles.stub}>
        <div className={styles.banner}>
          <h2 className={styles.bannerTitle}>Design view coming next</h2>
          <p className={styles.bannerText}>
            Sample engagement, reach, sentiment, and top-post data is already
            loaded. Use this page as the canvas for the social interaction
            report layout.
          </p>
        </div>

        <div className={layout.panel}>
          <MetricStrip metrics={metrics} />
        </div>

        <div className={styles.previewGrid}>
          <div className={layout.panel}>
            <ChartFrame title="Engagement preview">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={trend}>
                  <CartesianGrid stroke={gridStroke} vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatShortDate}
                    tick={axisStyle}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={32}
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
                    dataKey="engagement"
                    stroke="#6b4f9a"
                    fill="#6b4f9a22"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartFrame>
          </div>

          <div className={layout.panel}>
            <ChartFrame title="Top posts (sample)">
              <ul className={styles.list}>
                {posts.slice(0, 5).map((p) => (
                  <li key={p.title} className={styles.listItem}>
                    <span>
                      {p.title}
                      <span className={styles.muted}> · {p.platform}</span>
                    </span>
                    <strong>{formatNumber(p.engagement)}</strong>
                  </li>
                ))}
              </ul>
            </ChartFrame>
          </div>
        </div>

        <div className={layout.panel}>
          <ChartFrame title="Platform mix ready">
            <ul className={styles.list}>
              {platforms.map((p) => (
                <li key={p.name} className={styles.listItem}>
                  <span>{p.name}</span>
                  <strong>{formatNumber(p.value)}</strong>
                </li>
              ))}
            </ul>
          </ChartFrame>
        </div>
      </div>
    </TemplateShell>
  )
}
