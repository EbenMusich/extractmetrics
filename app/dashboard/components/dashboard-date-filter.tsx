import {
  dashboardInsetSurfaceClass,
  SectionHeader,
} from './dashboard-ui'

type DashboardDateFilterValue = '7d' | '30d' | 'all'

type DashboardDateFilterProps = {
  value: DashboardDateFilterValue
  onChange: (value: DashboardDateFilterValue) => void
}

const options: Array<{ value: DashboardDateFilterValue; label: string }> = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'all', label: 'All time' },
]

export type { DashboardDateFilterValue }

export function DashboardDateFilter({
  value,
  onChange,
}: DashboardDateFilterProps) {
  return (
    <section className="space-y-4">
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
                  className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-white hover:text-gray-900'
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
