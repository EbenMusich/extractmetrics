const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

if (!supabaseUrl) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL. Set NEXT_PUBLIC_SUPABASE_URL in your local .env file and hosting provider before starting ExtractMetrics."
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY. Set NEXT_PUBLIC_SUPABASE_ANON_KEY in your local .env file and hosting provider before starting ExtractMetrics."
  )
}

export function getSupabaseEnv() {
  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  }
}