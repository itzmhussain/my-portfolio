import type { TemplateMeta } from './types'

export const TEMPLATES: TemplateMeta[] = [
  {
    id: 'ecommerce-sales',
    title: 'Ecommerce Sales',
    description:
      'Shopeers-style ecommerce ops dashboard with KPIs, profit trends, products, and widgets.',
    domains: ['Ecommerce'],
    status: 'live',
    path: '/templates/ecommerce-sales',
  },
  {
    id: 'marketing-analytics',
    title: 'Marketing & Analytics',
    description:
      'Campaign ROAS, funnel stages, traffic sources, and device mix.',
    domains: ['Marketing', 'Digital Analytics'],
    status: 'live',
    path: '/templates/marketing-analytics',
  },
  {
    id: 'telecom-operations',
    title: 'Telecom Operations',
    description:
      'Activations, plan sales, network enablement, and channel snapshot.',
    domains: ['Telecom Ops', 'Channel Ops'],
    status: 'live',
    path: '/templates/telecom-operations',
  },
  {
    id: 'social-media',
    title: 'Social Media',
    description:
      'Engagement, reach, sentiment, and top posts — design view stub.',
    domains: ['Social'],
    status: 'stub',
    path: '/templates/social-media',
  },
  {
    id: 'channel-operations',
    title: 'Channel Operations',
    description:
      'Digital, chatbot, and POS volumes with containment and AHT — stub.',
    domains: ['Channel Ops'],
    status: 'stub',
    path: '/templates/channel-operations',
  },
]

export function getTemplate(id: string): TemplateMeta | undefined {
  return TEMPLATES.find((t) => t.id === id)
}
