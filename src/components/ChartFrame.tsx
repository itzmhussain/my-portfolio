import type { ReactNode } from 'react'
import styles from './ChartFrame.module.css'

type Props = {
  title: string
  hint?: string
  children: ReactNode
}

export function ChartFrame({ title, hint, children }: Props) {
  return (
    <section className={styles.frame}>
      <header className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {hint ? <p className={styles.hint}>{hint}</p> : null}
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  )
}
