import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './TemplateShell.module.css'

type Props = {
  title: string
  eyebrow?: string
  actions?: ReactNode
  children: ReactNode
}

export function TemplateShell({ title, eyebrow, actions, children }: Props) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.left}>
            <Link to="/" className={styles.back}>
              ← Gallery
            </Link>
            <div className={styles.titleBlock}>
              {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
              <h1 className={styles.title}>{title}</h1>
            </div>
          </div>
          {actions}
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
