import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DashboardAnalytics } from './components/dashboard-analytics'
import { PageHeader, StatusBanner, primaryButtonClass } from './components/dashboard-ui'

type DashboardRun = {
  id: string
  run_date: string
  strain_name: string
  grower_name: string
  output_type: string
  biomass_input_g: number | null
  output_weight_g: number | null
  solvent_used_g?: number | null
  labor_cost: number | null
  material_cost: number | null
  utility_cost: number | null
  other_cost: number | null
  created_at: string
}

type DashboardPageProps = {
  searchParams?: Promise<{
    created?: string
  }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = await createClient()
  const resolvedSearchParams = await searchParams
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('runs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const runs: DashboardRun[] = data ?? []

  return (
    <div className="space-y-10 overflow-x-hidden lg:space-y-12">
      <PageHeader
        eyebrow="ExtractMetrics"
        title="Dashboard"
        description={
          <>
            Welcome back{user.email ? `, ${user.email}` : ''}. Review performance trends, recent
            activity, and the latest run data from one place.
          </>
        }
        action={
          <Link href="/dashboard/new-run" className={`${primaryButtonClass} px-5`}>
            + New Run
          </Link>
        }
      />

      {resolvedSearchParams?.created === '1' ? (
        <StatusBanner tone="success">New run saved successfully.</StatusBanner>
      ) : null}

      {error ? (
        <StatusBanner tone="error">Unable to load your runs right now. {error.message}</StatusBanner>
      ) : null}

      <div className="space-y-10 overflow-x-hidden lg:space-y-12">
        <DashboardAnalytics runs={runs} />
      </div>
    </div>
  )
}
