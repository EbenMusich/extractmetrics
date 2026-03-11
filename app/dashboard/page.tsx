import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RecentRunsTable } from './components/recent-runs-table'
import { RunEntryForm } from './components/run-entry-form'
import { SummaryMetrics } from './components/summary-metrics'

type DashboardRun = {
  id: string
  run_date: string
  strain_name: string
  grower_name: string
  output_type: string
  biomass_input_g: number | null
  output_weight_g: number | null
  material_cost: number | null
  utility_cost: number | null
  other_cost: number | null
  created_at: string
}

function roundMetric(value: number) {
  return Number(value.toFixed(2))
}

function calculateYieldPercent(run: DashboardRun) {
  if (!run.biomass_input_g || !run.output_weight_g) {
    return null
  }

  return (run.output_weight_g / run.biomass_input_g) * 100
}

function calculateCostPerGram(run: DashboardRun) {
  if (!run.output_weight_g) {
    return null
  }

  const totalCost =
    (run.material_cost ?? 0) + (run.utility_cost ?? 0) + (run.other_cost ?? 0)

  return totalCost / run.output_weight_g
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
      'id, run_date, strain_name, grower_name, output_type, biomass_input_g, output_weight_g, material_cost, utility_cost, other_cost, created_at'
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const runs: DashboardRun[] = data ?? []
  const recentRuns = runs.slice(0, 10)
  const yields = runs
    .map(calculateYieldPercent)
    .filter((value): value is number => value !== null)
  const costsPerGram = runs
    .map(calculateCostPerGram)
    .filter((value): value is number => value !== null)

  const totalRuns = runs.length
  const totalOutputWeight = roundMetric(
    runs.reduce((sum, run) => sum + (run.output_weight_g ?? 0), 0)
  )
  const averageYieldPercent = yields.length > 0 ? roundMetric(yields.reduce((sum, value) => sum + value, 0) / yields.length) : 0
  const averageCostPerGram =
    costsPerGram.length > 0
      ? roundMetric(costsPerGram.reduce((sum, value) => sum + value, 0) / costsPerGram.length)
      : 0

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 bg-gray-50 px-6 py-12">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold">ExtractMetrics</h1>
        <p className="text-sm text-gray-600">
          Welcome back{user.email ? `, ${user.email}` : ''}. Track runs, review your metrics, and
          keep the latest activity in one place.
        </p>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unable to load your runs right now. {error.message}
        </div>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <SummaryMetrics
            totalRuns={totalRuns}
            averageYieldPercent={averageYieldPercent}
            averageCostPerGram={averageCostPerGram}
            totalOutputWeight={totalOutputWeight}
          />
          <RecentRunsTable runs={recentRuns} />
        </div>

        <div>
          <RunEntryForm />
        </div>
      </div>
    </main>
  )
}
