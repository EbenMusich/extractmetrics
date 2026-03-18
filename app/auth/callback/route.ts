import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

const DASHBOARD_PATH = '/dashboard'
const RESET_PASSWORD_PATH = '/reset-password'
const CONFIRMED_PATH = '/auth/confirmed'
const AUTH_ERROR_PATH = '/auth/error'

function getSafeRedirectPath(next: string | null, fallback = DASHBOARD_PATH) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return fallback
  }

  return next
}

function buildAuthErrorUrl(requestUrl: URL, context: 'confirmation' | 'recovery') {
  const errorUrl = new URL(AUTH_ERROR_PATH, requestUrl.origin)
  errorUrl.searchParams.set('context', context)
  errorUrl.searchParams.set('reason', 'invalid_or_expired')
  return errorUrl
}

function buildConfirmedUrl(requestUrl: URL, next: string) {
  const confirmedUrl = new URL(CONFIRMED_PATH, requestUrl.origin)
  confirmedUrl.searchParams.set('next', next)
  return confirmedUrl
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const tokenHash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null
  const next = getSafeRedirectPath(requestUrl.searchParams.get('next'))
  const isRecoveryFlow = type === 'recovery' || next === RESET_PASSWORD_PATH
  const supabase = await createClient()

  if (!code && !(tokenHash && type)) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      return NextResponse.redirect(
        new URL(isRecoveryFlow ? RESET_PASSWORD_PATH : next, requestUrl.origin)
      )
    }

    return NextResponse.redirect(
      buildAuthErrorUrl(requestUrl, isRecoveryFlow ? 'recovery' : 'confirmation')
    )
  }

  let authError: Error | null = null

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    authError = error
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    })

    authError = error
  }

  if (authError) {
    return NextResponse.redirect(
      buildAuthErrorUrl(requestUrl, isRecoveryFlow ? 'recovery' : 'confirmation')
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (isRecoveryFlow) {
    if (user) {
      return NextResponse.redirect(new URL(RESET_PASSWORD_PATH, requestUrl.origin))
    }

    return NextResponse.redirect(buildAuthErrorUrl(requestUrl, 'recovery'))
  }

  if (user) {
    return NextResponse.redirect(new URL(next, requestUrl.origin))
  }

  return NextResponse.redirect(buildConfirmedUrl(requestUrl, next))
}
