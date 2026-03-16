import { redirect } from 'next/navigation'
import Link from 'next/link'
import { RunHistoryTable } from '../components/run-history-table'
import type { RunTableRun } from '../components/run-table-formatters'
import { createClient } from '@/lib/supabase/server'
import { PageHeader, StatusBanner, primaryButtonClass } from '../components/dashboard-ui'

type RunsPageProps = {
  searchParams?: Promise<{
    updated?: string
    deleted?: string
  }>
}

export default async function RunsPage({ searchParams }: RunsPageProps) {
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

      {resolvedSearchParams?.updated === '1' ? (
        <StatusBanner tone="success">Run changes were saved successfully.</StatusBanner>
      ) : null}
      {resolvedSearchParams?.deleted === '1' ? (
        <StatusBanner tone="success">Run deleted successfully.</StatusBanner>
      ) : null}

      {error ? (
        <StatusBanner tone="error">Unable to load your runs right now. {error.message}</StatusBanner>
      ) : null}

      <RunHistoryTable runs={runs} />
    </div>
  )
}
