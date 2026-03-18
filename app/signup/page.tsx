'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAuthErrorMessage } from '@/lib/auth/get-auth-error-message'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword

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

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isSubmitting) {
      return
    }

    setError(null)
    setIsSubmitting(true)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setIsSubmitting(false)
      return
    }

    const emailRedirectTo = 'https://extractmetrics.com/auth/callback'

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
      },
    })

    if (error) {
      setError(getAuthErrorMessage(error))
      setIsSubmitting(false)
      return
    }

    if (!data.session) {
      router.push('/check-email')
      router.refresh()
      return
    }

    await supabase.auth.signOut()
    router.push('/check-email')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 text-zinc-950">
      <form
        onSubmit={handleSignup}
        className="flex w-full max-w-sm flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-xl font-bold">Create Account</h1>
        <p className="text-sm leading-6 text-zinc-600">
          Create your account to start tracking extraction runs and performance trends.
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
          autoComplete="new-password"
          disabled={isSubmitting}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-zinc-300 px-3 py-2 disabled:cursor-not-allowed disabled:bg-zinc-50"
        />

        <div className="flex flex-col gap-2">
          <input
            type="password"
            placeholder="Confirm Password"
            required
            autoComplete="new-password"
            disabled={isSubmitting}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {isSubmitting ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p className="text-sm text-zinc-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-zinc-950 underline underline-offset-4">
            Log in
          </Link>
        </p>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        {!error ? (
          <p className="text-xs text-zinc-500">
            We&apos;ll send a confirmation link to finish setting up your account before you
            can sign in.
          </p>
        ) : null}
      </form>
    </div>
  )
}