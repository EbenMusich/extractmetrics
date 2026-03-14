import {
  dashboardInsetSurfaceClass,
  SectionHeader,
} from './dashboard-ui'

type DashboardDateFilterValue = '30d' | '90d' | 'all'

type DashboardDateFilterProps = {
  value: DashboardDateFilterValue
  onChange: (value: DashboardDateFilterValue) => void
}

const options: Array<{ value: DashboardDateFilterValue; label: string }> = [
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'all', label: 'All time' },
]

export type { DashboardDateFilterValue }

export function DashboardDateFilter({
  value,
  onChange,
}: DashboardDateFilterProps) {
  return (
    <section className="space-y-5">
      <SectionHeader
        title="Analytics overview"
        description="Filter your saved runs to update the dashboard metrics, comparisons, and recent activity."
        action={
          <div className={`${dashboardInsetSurfaceClass} inline-flex flex-wrap gap-2 p-2`}>
            {options.map((option) => {
              const isActive = option.value === value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange(option.value)}
                  aria-pressed={isActive}
                  className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'border-gray-900/10 bg-white text-gray-950 shadow-sm ring-1 ring-gray-900/5'
                      : 'border-transparent text-gray-600 hover:border-gray-200 hover:bg-white hover:text-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        }
      />
    </section>
  )
}
