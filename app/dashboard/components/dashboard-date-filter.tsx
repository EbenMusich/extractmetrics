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
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold">Analytics</h2>
        <p className="text-sm text-gray-600">
          Filter your saved runs to update the dashboard metrics and tables.
        </p>
      </div>

      <div className="inline-flex flex-wrap gap-2 rounded-xl border bg-white p-2">
        {options.map((option) => {
          const isActive = option.value === value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={isActive}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
