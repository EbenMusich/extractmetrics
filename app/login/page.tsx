import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Log In | ExtractMetrics',
  description:
    'Sign in to access your extraction dashboard, run history, and performance analytics.',
  alternates: {
    canonical: '/login',
  },
  robots: {
    index: false,
    follow: true,
  },
}

type LoginPageProps = {
  searchParams: Promise<{
    error?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  const params = await searchParams
  const confirmationError =
    params.error === 'confirmation_failed'
      ? 'That confirmation link is invalid or has expired. Please request a new confirmation email or try signing in again.'
      : null

  return <LoginForm confirmationError={confirmationError} />
}
