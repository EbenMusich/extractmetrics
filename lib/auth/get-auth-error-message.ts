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

  return error.message ?? 'Something went wrong. Please try again.'
}
