import { Link } from 'react-router-dom'
import { TEMPLATES } from '../lib/templates'
import styles from './GalleryPage.module.css'

export function GalleryPage() {
  const liveCount = TEMPLATES.filter((t) => t.status === 'live').length

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.brand}>Dashboard Templates</h1>
        <p className={styles.lede}>
          Interactive single-page dashboard views for ecommerce, marketing,
          analytics, telecom operations, and channel performance — powered by
          shared sample data you can extend.
        </p>
        <div className={styles.meta}>
          <span>{TEMPLATES.length} templates</span>
          <span>{liveCount} live demos</span>
          <span>Sample data included</span>
        </div>
      </header>

      <section className={styles.grid} aria-label="Template gallery">
        {TEMPLATES.map((template) => (
          <Link key={template.id} to={template.path} className={styles.card}>
            <div className={styles.cardTop}>
              <span
                className={`${styles.status} ${
                  template.status === 'live' ? styles.live : styles.stub
                }`}
              >
                {template.status}
              </span>
            </div>
            <h2 className={styles.cardTitle}>{template.title}</h2>
            <p className={styles.cardDesc}>{template.description}</p>
            <div className={styles.tags}>
              {template.domains.map((d) => (
                <span key={d} className={styles.tag}>
                  {d}
                </span>
              ))}
            </div>
            <span className={styles.cta}>
              {template.status === 'live' ? 'Open live demo →' : 'Open stub →'}
            </span>
          </Link>
        ))}
      </section>
    </div>
  )
}
