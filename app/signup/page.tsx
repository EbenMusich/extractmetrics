'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAuthErrorMessage } from '@/lib/auth/get-auth-error-message'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isSubmitting) {
      return
    }

    setError(null)
    setIsSubmitting(true)

    const emailRedirectTo = `${window.location.origin}/auth/confirm?next=/auth/confirmed`

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
          disabled={isSubmitting}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-zinc-300 px-3 py-2 disabled:cursor-not-allowed disabled:bg-zinc-50"
        />

        <input
          type="password"
          placeholder="Password"
          required
          disabled={isSubmitting}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-zinc-300 px-3 py-2 disabled:cursor-not-allowed disabled:bg-zinc-50"
        />

        <button
          type="submit"
          disabled={isSubmitting}
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
            We&apos;ll send a confirmation link to your email before you can sign in.
          </p>
        ) : null}
      </form>
    </div>
  )
}