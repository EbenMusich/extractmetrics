import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DashboardAnalytics } from './components/dashboard-analytics'

type DashboardRun = {
  id: string
  run_date: string
  strain_name: string
  grower_name: string
  output_type: string
  biomass_input_g: number | null
  output_weight_g: number | null
  labor_cost: number | null
  material_cost: number | null
  utility_cost: number | null
  other_cost: number | null
  created_at: string
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('runs')
    .select(
      'id, run_date, strain_name, grower_name, output_type, biomass_input_g, output_weight_g, labor_cost, material_cost, utility_cost, other_cost, created_at'
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const runs: DashboardRun[] = data ?? []

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">ExtractMetrics</h1>
          <p className="text-sm text-gray-600">
            Welcome back{user.email ? `, ${user.email}` : ''}. Track runs, review your metrics, and
            keep the latest activity in one place.
          </p>
        </div>

        <Link
          href="/dashboard/new-run"
          className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
        >
          + New Run
        </Link>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unable to load your runs right now. {error.message}
        </div>
      ) : null}

      <div className="space-y-8">
        <DashboardAnalytics runs={runs} />
      </div>
    </div>
  )
}
