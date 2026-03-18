'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { getAuthErrorMessage } from '@/lib/auth/get-auth-error-message'
import { createClient } from '@/lib/supabase/client'

type LoginFormProps = {
  confirmationError: string | null
}

export function LoginForm({ confirmationError }: LoginFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isSubmitting) {
      return
    }

    setError(null)
    setIsSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(getAuthErrorMessage(error))
      setIsSubmitting(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 text-zinc-950">
      <form
        onSubmit={handleLogin}
        className="flex w-full max-w-sm flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-xl font-bold">Log In</h1>
        <p className="text-sm leading-6 text-zinc-600">
          Sign in to access your extraction dashboard and run analytics.
        </p>

        <input
          type="email"
          placeholder="Email"
          required
          autoComplete="email"
          disabled={isSubmitting}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-zinc-300 px-3 py-2 disabled:cursor-not-allowed disabled:bg-zinc-50"
        />

        <input
          type="password"
          placeholder="Password"
          required
          autoComplete="current-password"
          disabled={isSubmitting}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-zinc-300 px-3 py-2 disabled:cursor-not-allowed disabled:bg-zinc-50"
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-zinc-700 underline underline-offset-4 transition hover:text-zinc-950"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-zinc-950 px-4 py-2 text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Signing In...' : 'Log In'}
        </button>

        <p className="text-sm text-zinc-600">
          Need an account?{' '}
          <Link href="/signup" className="font-medium text-zinc-950 underline underline-offset-4">
            Sign up
          </Link>
        </p>

        {error ?? confirmationError ? (
          <p className="text-sm text-red-500">{error ?? confirmationError}</p>
        ) : null}

        {!error && !confirmationError ? (
          <p className="text-xs text-zinc-500">
            If you just signed up, confirm your email first. We&apos;ll take you into the app
            after confirmation whenever possible.
          </p>
        ) : null}
      </form>
    </div>
  )
}
