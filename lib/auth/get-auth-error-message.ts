type AuthErrorLike = {
  code?: string
  message?: string
} | null

export function getAuthErrorMessage(error: AuthErrorLike) {
  if (!error) {
    return null
  }

  const normalizedCode = error.code?.trim().toLowerCase()
  const normalizedMessage = error.message?.trim().toLowerCase() ?? ''

  if (
    normalizedCode === 'email_not_confirmed' ||
    normalizedMessage.includes('email not confirmed') ||
    normalizedMessage.includes('account not confirmed')
  ) {
    return "Your account hasn't been confirmed yet. Please check your email for the confirmation link."
  }

  if (
    normalizedMessage.includes('expired') ||
    normalizedMessage.includes('invalid token') ||
    normalizedMessage.includes('token has expired') ||
    normalizedMessage.includes('otp expired')
  ) {
    return 'That link is invalid or has expired. Request a new one and try again.'
  }

  return error.message ?? 'Something went wrong. Please try again.'
}
