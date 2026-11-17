import type { DateRangeKey } from '../lib/types'
import styles from './PeriodFilter.module.css'

const OPTIONS: { key: DateRangeKey; label: string }[] = [
  { key: '7d', label: '7D' },
  { key: '30d', label: '30D' },
  { key: '90d', label: '90D' },
]

type Props = {
  value: DateRangeKey
  onChange: (value: DateRangeKey) => void
}

export function PeriodFilter({ value, onChange }: Props) {
  return (
    <div className={styles.group} role="group" aria-label="Date range">
      {OPTIONS.map((opt) => (
        <button
          key={opt.key}
          type="button"
          className={`${styles.btn} ${value === opt.key ? styles.active : ''}`}
          onClick={() => onChange(opt.key)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
