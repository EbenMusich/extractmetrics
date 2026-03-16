import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NewRunForm } from '@/components/new-run-form'
import { PageHeader } from '../components/dashboard-ui'

export default async function NewRunPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <section className="space-y-8">
      <PageHeader
        backHref="/dashboard"
        backLabel="Back to dashboard"
        title="New run"
        description="Record a new extraction run with clean labels, consistent units, and the cost details needed for launch-ready analytics."
      />

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
