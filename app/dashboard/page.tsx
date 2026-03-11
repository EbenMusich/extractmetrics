import Link from 'next/link'
import { requireUser } from '@/lib/auth/require-user'

export default async function DashboardPage() {
  const user = await requireUser()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-6 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-600">
          Welcome back{user.email ? `, ${user.email}` : ''}.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Link className="rounded border px-4 py-3 hover:bg-gray-50" href="/dashboard/new-run">
          Create a new run
        </Link>
        <Link className="rounded border px-4 py-3 hover:bg-gray-50" href="/dashboard/runs">
          View runs
        </Link>
      </div>
    </main>
  )
}
