import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

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
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">New run</h1>
        <p className="text-sm text-gray-600">
          This page is ready for the next step of the dashboard build.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-700">
          New Run page is ready for the next step. The sidebar link now has a dedicated
          placeholder route instead of redirecting away.
        </p>
      </div>
    </section>
  )
}
