import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  getBestSellers,
  getCustomerBreakdown,
  getDashboardKpis,
  getMostActiveDays,
  getProfitTrend,
  getRepeatCustomerRate,
} from '../../data/ecommerce'
import { formatCurrency, formatNumber, formatShortDate } from '../../lib/formatters'
import type { DateRangeKey } from '../../lib/types'
import { AddWidgetModal } from './AddWidgetModal'
import styles from './EcommerceSalesPage.module.css'
import {
  IconAnalytics,
  IconBag,
  IconBell,
  IconCalendar,
  IconChevron,
  IconContent,
  IconCursor,
  IconCustomers,
  IconDiscount,
  IconEye,
  IconHelp,
  IconHome,
  IconInvoice,
  IconOrders,
  IconPlus,
  IconProducts,
  IconReports,
  IconSearch,
  IconSend,
  IconSettings,
  IconStar,
  IconStore,
  IconSun,
  IconTransactions,
  IconUsers,
  LogoMark,
} from './icons'

const NAV_MAIN = [
  { id: 'dashboard', label: 'Dashboard', icon: IconHome, active: true },
  { id: 'orders', label: 'Orders', icon: IconOrders },
  { id: 'products', label: 'Products', icon: IconProducts },
  { id: 'customers', label: 'Customers', icon: IconCustomers },
  { id: 'content', label: 'Content', icon: IconContent },
  { id: 'store', label: 'Online Store', icon: IconStore },
]

const NAV_FINANCE = [
  { id: 'invoices', label: 'Invoices', icon: IconInvoice },
  { id: 'transactions', label: 'Transactions', icon: IconTransactions },
  { id: 'reports', label: 'Reports', icon: IconReports },
]

const KPI_ICONS = {
  views: IconEye,
  visitors: IconUsers,
  clicks: IconCursor,
  orders: IconBag,
}

function RepeatGauge({ value }: { value: number }) {
  const r = 68
  const c = 2 * Math.PI * r
  const pct = Math.min(100, Math.max(0, value)) / 100
  const dash = c * 0.75
  const offset = dash * (1 - pct)

  return (
    <div className={styles.gaugeWrap}>
      <svg width="180" height="120" viewBox="0 0 180 120" aria-hidden>
        <path
          d="M22 100 A68 68 0 1 1 158 100"
          fill="none"
          stroke="#eef2f7"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M22 100 A68 68 0 1 1 158 100"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          strokeDashoffset={offset}
        />
      </svg>
      <div className={styles.gaugeValue}>
        <strong>{value}%</strong>
        <span>Repeat rate</span>
      </div>
    </div>
  )
}

export function EcommerceSalesPage() {
  const [range, setRange] = useState<DateRangeKey>('30d')
  const [modalOpen, setModalOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([])

  const kpis = useMemo(() => getDashboardKpis(range), [range])
  const profit = useMemo(() => getProfitTrend(range), [range])
  const segments = useMemo(() => getCustomerBreakdown(range), [range])
  const activeDays = useMemo(() => getMostActiveDays(range), [range])
  const products = useMemo(() => getBestSellers(range), [range])
  const repeatRate = useMemo(() => getRepeatCustomerRate(range), [range])
  const peakDay = Math.max(...activeDays.map((d) => d.value))

  const rangeLabel =
    range === '7d' ? 'Last 7 days' : range === '90d' ? 'Last 90 days' : 'Last 30 days'

  const cycleRange = () => {
    setRange((r) => (r === '7d' ? '30d' : r === '30d' ? '90d' : '7d'))
  }

  return (
    <div className={styles.theme}>
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.brand}>
          <LogoMark />
          <span className={styles.brandName}>Shopeers</span>
        </Link>

        <div className={styles.navSection}>
          <p className={styles.navLabel}>Main</p>
          <ul className={styles.navList}>
            {NAV_MAIN.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`${styles.navItem} ${item.active ? styles.navItemActive : ''}`}
                  >
                    <Icon />
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className={styles.navSection}>
          <p className={styles.navLabel}>Finances</p>
          <ul className={styles.navList}>
            {NAV_FINANCE.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button type="button" className={styles.navItem}>
                    <Icon />
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className={styles.navSection}>
          <p className={styles.navLabel}>Insights</p>
          <ul className={styles.navList}>
            <li>
              <button type="button" className={styles.navItem}>
                <IconAnalytics />
                Analytics
              </button>
            </li>
            <li>
              <button type="button" className={styles.navItem}>
                <IconDiscount />
                Discounts
              </button>
            </li>
          </ul>
        </div>

        <div className={styles.sidebarSpacer} />

        <div className={styles.navSection}>
          <ul className={styles.navList}>
            <li>
              <button type="button" className={styles.navItem}>
                <IconSettings />
                Settings
              </button>
            </li>
            <li>
              <button type="button" className={styles.navItem}>
                <IconHelp />
                Help & Support
              </button>
            </li>
          </ul>
        </div>

        <div className={styles.upgrade}>
          <p className={styles.upgradeTitle}>Upgrade to Premium</p>
          <p className={styles.upgradeText}>
            Unlock advanced widgets, exports, and AI insights for your store.
          </p>
          <button type="button" className={styles.upgradeBtn}>
            Upgrade plan
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <label className={styles.search}>
            <IconSearch />
            <input type="search" placeholder="Search anything..." />
            <span className={styles.kbd}>⌘K</span>
          </label>
          <div className={styles.topActions}>
            <button type="button" className={styles.iconBtn} aria-label="Theme">
              <IconSun />
            </button>
            <button type="button" className={styles.iconBtn} aria-label="Notifications">
              <IconBell />
            </button>
            <img
              className={styles.avatar}
              alt="Profile"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%2393c5fd'/%3E%3Cstop offset='1' stop-color='%233b82f6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='32' cy='32' r='32' fill='url(%23g)'/%3E%3Ccircle cx='32' cy='26' r='10' fill='%23fff' opacity='.9'/%3E%3Cpath d='M12 56c4-12 14-18 20-18s16 6 20 18' fill='%23fff' opacity='.9'/%3E%3C/svg%3E"
            />
          </div>
        </header>

        <div className={styles.content}>
          <Link to="/" className={styles.backLink}>
            ← Back to gallery
          </Link>

          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <div className={styles.headerActions}>
              <button type="button" className={styles.chip}>
                <IconCalendar />
                Jan 1, 2025 – Feb 1, 2025
              </button>
              <button type="button" className={styles.chip} onClick={cycleRange}>
                {rangeLabel}
                <IconChevron />
              </button>
              <button
                type="button"
                className={styles.btnGhost}
                onClick={() => setModalOpen(true)}
              >
                <IconPlus />
                Add widget
              </button>
              <button type="button" className={styles.btnPrimary}>
                Export
              </button>
            </div>
          </div>

          <section className={styles.kpiGrid}>
            {kpis.map((kpi) => {
              const Icon = KPI_ICONS[kpi.icon]
              const up = kpi.delta >= 0
              return (
                <article key={kpi.id} className={styles.kpiCard}>
                  <div className={styles.kpiTop}>
                    <p className={styles.kpiLabel}>{kpi.label}</p>
                    <span className={styles.kpiIcon}>
                      <Icon size={16} />
                    </span>
                  </div>
                  <p className={styles.kpiValue}>
                    {kpi.format === 'compact'
                      ? formatNumber(kpi.value, true)
                      : formatNumber(kpi.value)}
                  </p>
                  <p className={`${styles.kpiDelta} ${up ? styles.up : styles.down}`}>
                    {up ? '▲' : '▼'} {Math.abs(kpi.delta).toFixed(1)}%
                  </p>
                </article>
              )
            })}
          </section>

          <section className={styles.midGrid}>
            <article className={styles.card}>
              <div className={styles.cardHead}>
                <h2 className={styles.cardTitle}>Total Profit</h2>
                <span className={styles.cardMeta}>{rangeLabel}</span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={profit}>
                  <defs>
                    <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#eef2f7" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatShortDate}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={28}
                  />
                  <YAxis
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => formatCurrency(Number(v), true)}
                  />
                  <Tooltip
                    labelFormatter={(l) => formatShortDate(String(l))}
                    formatter={(value) => [formatCurrency(Number(value)), 'Profit']}
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 8px 24px rgb(17 24 39 / 8%)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    fill="url(#profitFill)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className={styles.segments}>
                {segments.map((s) => (
                  <div key={s.name} className={styles.segmentRow}>
                    <div className={styles.segmentMeta}>
                      <span>{s.name}</span>
                      <span>{s.percent}%</span>
                    </div>
                    <div className={styles.track}>
                      <div
                        className={styles.fill}
                        style={{ width: `${s.percent}%`, background: s.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className={styles.card}>
              <div className={styles.cardHead}>
                <h2 className={styles.cardTitle}>Most Day Active</h2>
                <span className={styles.cardMeta}>This week</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={activeDays}>
                  <CartesianGrid stroke="#eef2f7" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #e5e7eb',
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                    {activeDays.map((d) => (
                      <Cell
                        key={d.day}
                        fill={d.value === peakDay ? '#3B82F6' : '#E5E7EB'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </article>
          </section>

          <section className={styles.bottomGrid}>
            <article className={styles.card}>
              <div className={styles.cardHead}>
                <h2 className={styles.cardTitle}>Best Selling Products</h2>
                <span className={styles.cardMeta}>{products.length} items</span>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th className={styles.num}>Sold</th>
                      <th className={styles.num}>Revenue</th>
                      <th className={styles.num}>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>
                          <div className={styles.productCell}>
                            <span
                              className={styles.thumb}
                              style={{ background: p.color }}
                            />
                            {p.name}
                          </div>
                        </td>
                        <td className={styles.num}>{formatNumber(p.sold)}</td>
                        <td className={styles.num}>{formatCurrency(p.revenue)}</td>
                        <td className={styles.num}>
                          <span className={styles.rating}>
                            <IconStar />
                            {p.rating.toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className={styles.card}>
              <div className={styles.cardHead}>
                <h2 className={styles.cardTitle}>Repeat Customer Rate</h2>
              </div>
              <RepeatGauge value={repeatRate} />
              <button type="button" className={styles.detailsBtn}>
                Show details
              </button>
            </article>

            <article className={styles.aiCard}>
              <span className={styles.aiBadge}>AI Assistant</span>
              <h2 className={styles.aiTitle}>Need a quick insight?</h2>
              <p className={styles.aiText}>
                Ask about sales trends, top products, or channel performance.
                {selectedWidgets.length
                  ? ` Active widgets: ${selectedWidgets.length}.`
                  : ''}
              </p>
              <form
                className={styles.aiForm}
                onSubmit={(e) => {
                  e.preventDefault()
                  setAiPrompt('')
                }}
              >
                <input
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask me anything..."
                />
                <button type="submit" className={styles.sendBtn} aria-label="Send">
                  <IconSend />
                </button>
              </form>
            </article>
          </section>
        </div>
      </div>

      <AddWidgetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(id) => {
          setSelectedWidgets((prev) => (prev.includes(id) ? prev : [...prev, id]))
          setModalOpen(false)
        }}
      />
    </div>
  )
}
