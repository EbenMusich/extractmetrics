'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { dashboardInsetSurfaceClass } from './dashboard-ui'

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/runs', label: 'Runs' },
  { href: '/dashboard/new-run', label: 'New Run' },
]

function isActivePath(pathname: string, href: string) {
  if (href === '/dashboard') {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className={`${dashboardInsetSurfaceClass} p-2`}>
      <nav className="flex flex-col gap-1.5" aria-label="Dashboard navigation">
        {navigationItems.map((item) => {
          const isActive = isActivePath(pathname, item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`rounded-xl border px-3.5 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                  : 'border-transparent text-gray-600 hover:border-gray-200 hover:bg-white hover:text-gray-900'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
