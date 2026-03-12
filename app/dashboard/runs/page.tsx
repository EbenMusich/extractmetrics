import { redirect } from 'next/navigation'
import Link from 'next/link'
import { RunHistoryTable } from '../components/run-history-table'
import type { RunTableRun } from '../components/run-table-formatters'
import { createClient } from '@/lib/supabase/server'
import { PageHeader, primaryButtonClass } from '../components/dashboard-ui'

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
    <div className="space-y-8 lg:space-y-10">
      <PageHeader
        title="Run history"
        description="Review every saved extraction run, search quickly, and export filtered results when needed."
        action={
          <Link href="/dashboard/new-run" className={primaryButtonClass}>
            + New Run
          </Link>
        }
      />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unable to load your runs right now. {error.message}
        </div>
      ) : null}

      <RunHistoryTable runs={runs} />
    </div>
  )
}
