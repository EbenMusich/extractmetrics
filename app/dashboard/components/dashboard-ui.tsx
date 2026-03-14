import type { ReactNode } from 'react'
import Link from 'next/link'

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const dashboardSurfaceClass =
  'rounded-3xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_rgba(15,23,42,0.06)]'

export const dashboardInsetSurfaceClass =
  'rounded-2xl border border-gray-200/80 bg-gray-50/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]'

export const primaryButtonClass =
  'inline-flex items-center justify-center rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:opacity-60'

export const secondaryButtonClass =
  'inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 disabled:cursor-not-allowed disabled:opacity-60'

export const destructiveButtonClass =
  'inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-700 shadow-sm transition hover:border-red-300 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 disabled:cursor-not-allowed disabled:opacity-60'

export const inputClass =
  'w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-4 focus:ring-gray-100'

export const labelClass = 'text-sm font-medium text-gray-900'
export const helperTextClass = 'text-xs text-gray-500'
export const errorTextClass = 'text-sm text-red-600'

export const tableWrapperClass = `${dashboardSurfaceClass} overflow-hidden`
export const tableClass = 'min-w-full text-sm text-gray-700'
export const tableHeadClass =
  'border-b border-gray-200 bg-gray-50/90 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-700'
export const tableRowClass =
  'border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50'
export const tableEmptyCellClass = 'px-5 py-10 text-center text-sm text-gray-500'

type PageHeaderProps = {
  title: string
  description: ReactNode
  action?: ReactNode
  backHref?: string
  backLabel?: string
  eyebrow?: string
}

export function PageHeader({
  title,
  description,
  action,
  backHref,
  backLabel,
  eyebrow = 'Dashboard',
}: PageHeaderProps) {
  return (
    <section className="space-y-5">
      {backHref && backLabel ? (
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          <span aria-hidden="true">←</span>
          <span>{backLabel}</span>
        </Link>
      ) : null}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">{eyebrow}</p>
          <div className="space-y-2.5">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-[2.15rem]">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-gray-600 sm:text-[15px]">{description}</p>
          </div>
        </div>

        {action ? <div className="flex flex-wrap items-center gap-3 pt-1">{action}</div> : null}
      </div>
    </section>
  )
}

type SectionHeaderProps = {
  title: string
  description: ReactNode
  action?: ReactNode
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold tracking-tight text-gray-950">{title}</h2>
        <p className="text-sm leading-6 text-gray-600">{description}</p>
      </div>
      {action ? <div className="flex flex-wrap items-center gap-3">{action}</div> : null}
    </div>
  )
}

type EmptyStateProps = {
  title: string
  description: ReactNode
  compact?: boolean
}

export function EmptyState({ title, description, compact = false }: EmptyStateProps) {
  return (
    <div
      className={joinClasses(
        dashboardInsetSurfaceClass,
        compact ? 'p-5' : 'p-8',
        'text-center'
      )}
    >
      <p className="text-sm font-medium text-gray-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
    </div>
  )
}
