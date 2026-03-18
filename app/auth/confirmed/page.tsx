'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function getSafeRedirectPath(next: string | null) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return '/dashboard'
  }

  return next
}

export default function AuthConfirmedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = useMemo(() => createClient(), [])
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const next = getSafeRedirectPath(searchParams.get('next'))

  useEffect(() => {
    let isMounted = true

    async function continueIfSessionIsReady() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!isMounted) {
        return
      }

      if (user) {
        router.replace(next)
        router.refresh()
        return
      }

      setIsCheckingSession(false)
    }

    void continueIfSessionIsReady()

    return () => {
      isMounted = false
    }
  }, [next, router, supabase])

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-zinc-950">
      <div className="w-full max-w-lg rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Email confirmed
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
          {isCheckingSession
            ? 'Finalizing your confirmation...'
            : 'Your email has been confirmed.'}
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          {isCheckingSession
            ? "We're checking whether your session is ready in this browser and will take you to your dashboard if it is."
            : 'Your ExtractMetrics account is ready. If we could not start your session automatically, sign in to continue.'}
        </p>

        {!isCheckingSession ? (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Go to Log In
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              Back Home
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  )
}
