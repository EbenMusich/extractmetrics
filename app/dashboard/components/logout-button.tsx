'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { secondaryButtonClass } from './dashboard-ui'

export function LogoutButton() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleLogout() {
    setIsSigningOut(true)

    const supabase = createClient()
    await supabase.auth.signOut()

    router.replace('/')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSigningOut}
      className={`${secondaryButtonClass} w-full sm:w-auto`}
    >
      Log Out
    </button>
  )
}
