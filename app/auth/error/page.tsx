import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type AuthErrorPageProps = {
  searchParams: Promise<{
    context?: string
  }>
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  const params = await searchParams
  const isRecoveryError = params.context === 'recovery'

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-zinc-950">
      <div className="w-full max-w-lg rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {isRecoveryError ? 'Reset link issue' : 'Confirmation link issue'}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
          {isRecoveryError
            ? 'That password reset link is invalid or has expired.'
            : 'That confirmation link is invalid or has expired.'}
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          {isRecoveryError
            ? 'Request a new password reset email to continue.'
            : 'Try signing in if your account is already confirmed, or request a fresh confirmation email by signing up again.'}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={isRecoveryError ? '/forgot-password' : '/login'}
            className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            {isRecoveryError ? 'Request new reset email' : 'Go to Log In'}
          </Link>
          <Link
            href={isRecoveryError ? '/login' : '/signup'}
            className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            {isRecoveryError ? 'Back to Log In' : 'Back to Sign Up'}
          </Link>
        </div>
      </div>
    </main>
  )
}
