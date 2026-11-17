import { getWidgetCatalog } from '../../data/ecommerce'
import { IconAnalytics, IconClose, IconCustomers, IconOrders, IconReports } from './icons'
import styles from './EcommerceSalesPage.module.css'

type Props = {
  open: boolean
  onClose: () => void
  onSelect: (id: string) => void
}

function Preview({ kind }: { kind: string }) {
  switch (kind) {
    case 'devices':
      return <IconCustomers size={22} />
    case 'orders':
      return <IconOrders size={22} />
    case 'trend':
      return <IconAnalytics size={22} />
    case 'segments':
      return <IconReports size={22} />
    default:
      return <IconAnalytics size={22} />
  }
}

export function AddWidgetModal({ open, onClose, onSelect }: Props) {
  if (!open) return null
  const widgets = getWidgetCatalog()

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Add widget"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHead}>
          <h2 className={styles.modalTitle}>Add widget</h2>
          <button type="button" className={styles.iconBtn} onClick={onClose} aria-label="Close">
            <IconClose />
          </button>
        </div>
        <ul className={styles.widgetList}>
          {widgets.map((w) => (
            <li key={w.id} className={styles.widgetItem}>
              <div className={styles.widgetPreview}>
                <Preview kind={w.preview} />
              </div>
              <div>
                <h3 className={styles.widgetTitle}>{w.title}</h3>
                <p className={styles.widgetDesc}>{w.description}</p>
                <p className={styles.widgetTag}>{w.tag}</p>
              </div>
              <button
                type="button"
                className={styles.selectBtn}
                onClick={() => onSelect(w.id)}
              >
                Select
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
