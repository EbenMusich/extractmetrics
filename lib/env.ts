type RequiredSupabaseEnvKey = 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'

function readRequiredEnv(name: RequiredSupabaseEnvKey) {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Set ${name} in your local .env file and hosting provider before starting ExtractMetrics.`
    )
  }

  return value
}

export function getSupabaseEnv() {
  return {
    url: readRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: readRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  }
}
