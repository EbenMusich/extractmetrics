import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NewRunForm } from '@/components/new-run-form'

export default async function NewRunPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <Link href="/dashboard" className="inline-flex text-sm text-gray-600 transition hover:text-gray-900">
          Back to dashboard
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">New run</h1>
          <p className="text-sm text-gray-600">
            Record a new extraction run, then return to your dashboard analytics automatically.
          </p>
        </div>
      </div>

      <div className="max-w-4xl">
        <NewRunForm
          title="Run entry"
          description="Enter the basics for this extraction run."
          successRedirectTo="/dashboard"
        />
      </div>
    </section>
  )
}
