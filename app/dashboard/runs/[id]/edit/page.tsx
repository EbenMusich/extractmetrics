import { notFound } from 'next/navigation'
import { RunEntryForm } from '@/app/dashboard/components/run-entry-form'
import { PageHeader } from '@/app/dashboard/components/dashboard-ui'
import { requireUser } from '@/lib/auth/require-user'
import { createClient } from '@/lib/supabase/server'

type EditRunPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditRunPage({ params }: EditRunPageProps) {
  const user = await requireUser()
  const { id } = await params
  const supabase = await createClient()
  const { data: run, error } = await supabase
    .from('runs')
    .select(
      'id, run_date, output_type, strain_name, grower_name, biomass_input_g, output_weight_g, labor_minutes, labor_rate, material_cost, utility_cost, other_cost, notes'
    )
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    return (
      <section className="space-y-8">
        <PageHeader
          backHref="/dashboard/runs"
          backLabel="Back to run history"
          title="Edit run"
          description="Update this extraction run and return to your full run history."
        />

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unable to load this run right now. {error.message}
        </div>
      </section>
    )
  }

  if (!run) {
    notFound()
  }

  return (
    <section className="space-y-8">
      <PageHeader
        backHref="/dashboard/runs"
        backLabel="Back to run history"
        title="Edit run"
        description="Update this extraction run and return to your full run history."
      />

      <div className="max-w-4xl">
        <RunEntryForm
          mode="edit"
          runId={run.id}
          title="Run entry"
          description="Update the basics for this extraction run."
          submitLabel="Save changes"
          initialValues={{
            run_date: run.run_date ?? '',
            output_type: run.output_type ?? '',
            strain_name: run.strain_name ?? '',
            grower_name: run.grower_name ?? '',
            biomass_input_g: run.biomass_input_g?.toString() ?? '',
            output_weight_g: run.output_weight_g?.toString() ?? '',
            labor_minutes: run.labor_minutes?.toString() ?? '0',
            labor_rate: run.labor_rate?.toString() ?? '0',
            material_cost: run.material_cost?.toString() ?? '',
            utility_cost: run.utility_cost?.toString() ?? '',
            other_cost: run.other_cost?.toString() ?? '',
            notes: run.notes ?? '',
          }}
        />
      </div>
    </section>
  )
}
