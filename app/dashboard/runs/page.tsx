import { redirect } from 'next/navigation'
import { RunHistoryTable } from '../components/run-history-table'
import type { RunTableRun } from '../components/run-table-formatters'
import { createClient } from '@/lib/supabase/server'

export default async function RunsPage() {
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

  const runs: RunTableRun[] = data ?? []

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold">Run history</h1>
        <p className="text-sm text-gray-600">
          Review every saved extraction run in one place.
        </p>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unable to load your runs right now. {error.message}
        </div>
      ) : null}

      <RunHistoryTable runs={runs} />
    </div>
  )
}
