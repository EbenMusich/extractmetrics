import type { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from './components/dashboard-sidebar'
import { UserAccount } from './components/user-account'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col lg:flex-row">
        <aside className="border-b border-gray-200 bg-gray-50/95 lg:w-72 lg:flex-shrink-0 lg:border-r lg:border-b-0">
          <div className="flex h-full flex-col gap-8 px-5 py-6 sm:px-6 lg:px-7 lg:py-8">
            <div className="space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                ExtractMetrics
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-gray-950">Dashboard</h2>
              <p className="text-sm leading-6 text-gray-600">
                Track runs, review analytics, and keep day-to-day extraction work organized.
              </p>
            </div>

            <DashboardSidebar />
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8 xl:px-12">
          <div className="mx-auto w-full max-w-6xl space-y-6 sm:space-y-8">
            <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-end sm:pb-5">
              <UserAccount initialEmail={user?.email ?? null} />
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
