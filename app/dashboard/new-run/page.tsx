import { redirect } from 'next/navigation'
import { NewRunForm } from '@/components/new-run-form'
import { SavedDefaultsForm } from '../components/saved-defaults-form'
import { PageHeader } from '../components/dashboard-ui'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUserDefaults } from '@/lib/user-defaults'

export default async function NewRunPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let savedDefaults = null
  let savedDefaultsError: string | null = null

  try {
    savedDefaults = await getCurrentUserDefaults()
  } catch (error) {
    savedDefaultsError =
      error instanceof Error ? error.message : 'Unable to load your saved defaults right now.'
  }

  const initialRunValues = savedDefaults
    ? {
        operator_name: savedDefaults.operatorName ?? '',
        solvent_type: savedDefaults.solventType ?? '',
        input_material_type: savedDefaults.inputMaterialType ?? '',
        output_type: savedDefaults.outputType ?? '',
        labor_rate:
          typeof savedDefaults.laborRate === 'number' && Number.isFinite(savedDefaults.laborRate)
            ? savedDefaults.laborRate.toString()
            : '',
      }
    : undefined

  return (
    <section className="space-y-8">
      <PageHeader
        backHref="/dashboard"
        backLabel="Back to dashboard"
        title="New run"
        description="Record a new extraction run with clean labels, consistent units, and the cost details needed for launch-ready analytics."
      />

      <SavedDefaultsForm initialDefaults={savedDefaults} loadError={savedDefaultsError} />

      <div className="max-w-4xl">
        <NewRunForm
          title="New extraction run"
          description="Capture the key run details, measured output, and tracked costs for this extraction."
          initialValues={initialRunValues}
          successRedirectTo="/dashboard"
        />
      </div>
    </section>
  )
}
