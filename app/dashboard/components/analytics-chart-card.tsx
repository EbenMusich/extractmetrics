'use client'

import type { ReactNode } from 'react'
import { EmptyState, dashboardSurfaceClass } from './dashboard-ui'

type AnalyticsChartCardProps = {
  title: string
  description: string
  emptyTitle: string
  emptyMessage: string
  hasData: boolean
  children: ReactNode
}

export const analyticsChartTheme = {
  axisTick: { fill: '#475569', fontSize: 12, fontWeight: 500 },
  gridStroke: '#e5e7eb',
  tooltipContentStyle: {
    borderRadius: '16px',
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.10)',
    padding: '10px 12px',
  },
  tooltipLabelStyle: {
    color: '#0f172a',
    fontWeight: 600,
    marginBottom: '4px',
  },
  tooltipItemStyle: {
    color: '#334155',
    paddingTop: '2px',
    paddingBottom: '2px',
  },
} as const

export function AnalyticsChartCard({
  title,
  description,
  emptyTitle,
  emptyMessage,
  hasData,
  children,
}: AnalyticsChartCardProps) {
  return (
    <section className={`${dashboardSurfaceClass} overflow-hidden`}>
      <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold tracking-tight text-gray-950 sm:text-lg">{title}</h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-600">{description}</p>
        </div>
      </div>
      <div className="px-3 pb-3 pt-4 sm:px-4 sm:pb-4 sm:pt-5">
        {hasData ? (
          <div className="h-72 sm:h-80">{children}</div>
        ) : (
          <EmptyState compact title={emptyTitle} description={emptyMessage} />
        )}
      </div>
    </section>
  )
}
