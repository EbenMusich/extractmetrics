import type { ReactNode } from 'react'
import { DashboardSidebar } from './components/dashboard-sidebar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-gray-200 bg-white lg:w-64 lg:flex-shrink-0 lg:border-r lg:border-b-0">
          <div className="flex h-full flex-col gap-8 px-4 py-6 sm:px-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                ExtractMetrics
              </p>
              <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
              <p className="text-sm text-gray-600">
                Navigate your metrics, run history, and upcoming workflows.
              </p>
            </div>

            <DashboardSidebar />
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  )
}
