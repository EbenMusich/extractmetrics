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
          successRedirectTo="/dashboard"
        />
      </div>
    </section>
  )
}
