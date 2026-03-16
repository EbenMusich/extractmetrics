'use client'

import type { ReactNode } from 'react'
import { EmptyState, SkeletonBlock, dashboardSurfaceClass } from './dashboard-ui'

type AnalyticsChartCardProps = {
  title: string
  description: string
  emptyTitle: string
  emptyMessage: string
  hasData: boolean
  children: ReactNode
  isLoading?: boolean
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
  isLoading = false,
}: AnalyticsChartCardProps) {
  return (
    <section className={`${dashboardSurfaceClass} overflow-hidden`}>
      <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold tracking-tight text-gray-950 sm:text-lg">{title}</h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-600">{description}</p>
        </div>
      </div>
      <div className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-5">
        {isLoading ? (
          <div className="rounded-2xl bg-gray-50/60 p-2 sm:p-3">
            <div className="space-y-4 p-3 sm:p-4">
              <div className="flex items-end justify-between gap-4">
                <SkeletonBlock className="h-40 flex-1 rounded-2xl" />
                <div className="flex w-14 flex-col gap-3">
                  <SkeletonBlock className="h-5 w-full rounded-lg" />
                  <SkeletonBlock className="h-5 w-full rounded-lg" />
                  <SkeletonBlock className="h-5 w-full rounded-lg" />
                </div>
              </div>
              <div className="flex gap-3">
                <SkeletonBlock className="h-4 flex-1 rounded-lg" />
                <SkeletonBlock className="h-4 flex-1 rounded-lg" />
                <SkeletonBlock className="h-4 flex-1 rounded-lg" />
              </div>
            </div>
          </div>
        ) : hasData ? (
          <div className="rounded-2xl bg-gray-50/60 p-2 sm:p-3">
            <div className="h-72 sm:h-80">{children}</div>
          </div>
        ) : (
          <EmptyState compact title={emptyTitle} description={emptyMessage} />
        )}
      </div>
    </section>
  )
}
