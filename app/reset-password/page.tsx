'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthErrorMessage } from '@/lib/auth/get-auth-error-message'
import { createClient } from '@/lib/supabase/client'

type ResetStatus = 'checking' | 'ready' | 'invalid' | 'success'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<ResetStatus>('checking')
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword

  useEffect(() => {
    let isMounted = true

    async function loadResetSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!isMounted) {
        return
      }

      setStatus(user ? 'ready' : 'invalid')
    }

    void loadResetSession()

    return () => {
      isMounted = false
    }
  }, [supabase])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (status !== 'ready' || isSubmitting) {
      return
    }

    setError(null)
    setIsSubmitting(true)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setIsSubmitting(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setError(getAuthErrorMessage(error))
      setIsSubmitting(false)
      return
    }

    setStatus('success')
    setIsSubmitting(false)

    window.setTimeout(() => {
      router.replace('/dashboard')
      router.refresh()
    }, 1600)
  }

  if (status === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-zinc-950">
        <div className="w-full max-w-lg rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Verifying link
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
            Checking your password reset link...
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            Please wait while we confirm that your secure reset session is ready.
          </p>
        </div>
      </main>
    )
  }

  if (status === 'invalid') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-zinc-950">
        <div className="w-full max-w-lg rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Reset link issue
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
            This password reset link is invalid or has expired.
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            Request a new password reset email to continue.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/forgot-password"
              className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Request New Reset Email
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              Back to Log In
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (status === 'success') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-zinc-950">
        <div className="w-full max-w-lg rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Password updated
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
            Your password has been updated.
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            Redirecting you to your dashboard now.
          </p>
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
        <h1 className="text-xl font-bold">Reset Password</h1>
        <p className="text-sm leading-6 text-zinc-600">
          Choose a new password for your ExtractMetrics account.
        </p>

        <input
          type="password"
          placeholder="New Password"
          required
          autoComplete="new-password"
          disabled={isSubmitting}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-xl border border-zinc-300 px-3 py-2 disabled:cursor-not-allowed disabled:bg-zinc-50"
        />

        <div className="flex flex-col gap-2">
          <input
            type="password"
            placeholder="Confirm New Password"
            required
            autoComplete="new-password"
            disabled={isSubmitting}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            aria-invalid={passwordsMismatch}
            className="rounded-xl border border-zinc-300 px-3 py-2 disabled:cursor-not-allowed disabled:bg-zinc-50"
          />

          {passwordsMismatch ? (
            <p className="text-sm text-red-500">Passwords do not match.</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || passwordsMismatch}
          className="rounded-full bg-zinc-950 px-4 py-2 text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Updating Password...' : 'Update Password'}
        </button>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </form>
    </main>
  )
}
