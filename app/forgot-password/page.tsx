'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthErrorMessage } from '@/lib/auth/get-auth-error-message'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function redirectAuthenticatedUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!isMounted || !user) {
        return
      }

      router.replace('/dashboard')
      router.refresh()
    }

    void redirectAuthenticatedUser()

    return () => {
      isMounted = false
    }
  }, [router, supabase])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setError(null)
    setIsSubmitting(true)

    const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    if (error) {
      setError(getAuthErrorMessage(error))
      setIsSubmitting(false)
      return
    }

    setIsEmailSent(true)
    setIsSubmitting(false)
  }

  if (isEmailSent) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-zinc-950">
        <div className="w-full max-w-lg rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Check your email
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
            Password reset email sent.
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            If an ExtractMetrics account exists for that email, you&apos;ll receive a link to
            choose a new password.
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            If you do not see it right away, check your spam or promotions folder.
          </p>

          <div className="mt-8">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Back to Log In
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-zinc-950">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-xl font-bold">Forgot Password</h1>
        <p className="text-sm leading-6 text-zinc-600">
          Enter your email and we&apos;ll send you a secure link to reset your password.
        </p>

        <input
          type="email"
          placeholder="Email"
          required
          autoComplete="email"
          disabled={isSubmitting}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-xl border border-zinc-300 px-3 py-2 disabled:cursor-not-allowed disabled:bg-zinc-50"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-zinc-950 px-4 py-2 text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Sending Reset Email...' : 'Send Reset Email'}
        </button>

        <p className="text-sm text-zinc-600">
          Remembered your password?{' '}
          <Link href="/login" className="font-medium text-zinc-950 underline underline-offset-4">
            Back to log in
          </Link>
        </p>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </form>
    </main>
  )
}
