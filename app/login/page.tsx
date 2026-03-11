'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="flex w-full max-w-sm flex-col gap-4 rounded border p-6"
      >
        <h1 className="text-xl font-bold">Log In</h1>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
        />

        <button type="submit" className="rounded bg-black p-2 text-white">
          Log In
        </button>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </form>
    </div>
  )
}
