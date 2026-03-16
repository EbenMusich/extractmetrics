'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { dashboardInsetSurfaceClass, secondaryButtonClass } from './dashboard-ui'

type UserAccountProps = {
  initialEmail?: string | null
}

export function UserAccount({ initialEmail = null }: UserAccountProps) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [email, setEmail] = useState<string | null>(initialEmail)
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (isMounted) {
        setEmail(user?.email ?? null)
      }
    }

    void loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  async function handleLogout() {
    setIsSigningOut(true)
    await supabase.auth.signOut()
    router.replace('/')
    router.refresh()
  }

  if (!email) {
    return null
  }

  return (
    <div
      className={`${dashboardInsetSurfaceClass} ml-auto flex w-full flex-col gap-3 p-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4`}
    >
      <div className="min-w-0 text-right">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Account</p>
        <p className="truncate text-sm font-medium text-gray-900">{email}</p>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={isSigningOut}
        className={`${secondaryButtonClass} w-full sm:w-auto`}
      >
        Log Out
      </button>
    </div>
  )
}
