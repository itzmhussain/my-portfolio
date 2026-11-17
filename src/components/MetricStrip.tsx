import type { MetricSummary } from '../lib/types'
import { formatMetric, formatPercent } from '../lib/formatters'
import styles from './MetricStrip.module.css'

type Props = {
  metrics: MetricSummary[]
}

export function MetricStrip({ metrics }: Props) {
  return (
    <div className={styles.strip}>
      {metrics.map((m) => (
        <div key={m.label} className={styles.metric}>
          <p className={styles.label}>{m.label}</p>
          <p className={styles.value}>{formatMetric(m.value, m.format)}</p>
          <p className={`${styles.delta} ${m.delta >= 0 ? styles.up : styles.down}`}>
            {formatPercent(m.delta)} vs prior
          </p>
        </div>
      ))}
    </div>
  )
}
