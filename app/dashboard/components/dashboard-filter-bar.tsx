import {
  dashboardInsetSurfaceClass,
  inputClass,
  secondaryButtonClass,
  SectionHeader,
  SkeletonBlock,
} from './dashboard-ui'

export type DashboardDateRangeValue = '7d' | '30d' | '90d' | 'all'

export type DashboardFilterState = {
  dateRange: DashboardDateRangeValue
  strain: string
  grower: string
  outputType: string
}

type DashboardFilterBarProps = {
  value: DashboardFilterState
  onChange: (value: DashboardFilterState) => void
  strainOptions: string[]
  growerOptions: string[]
  outputTypeOptions: string[]
  totalRunCount: number
  filteredRunCount: number
  isLoading?: boolean
}

type FilterSelectProps = {
  label: string
  value: string
  allLabel: string
  options: string[]
  onChange: (value: string) => void
  disabled?: boolean
}

const dateRangeOptions: Array<{ value: DashboardDateRangeValue; label: string }> = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'all', label: 'All time' },
]

export const defaultDashboardFilters: DashboardFilterState = {
  dateRange: 'all',
  strain: '',
  grower: '',
  outputType: '',
}

export function getDashboardDateRangeLabel(value: DashboardDateRangeValue) {
  return dateRangeOptions.find((option) => option.value === value)?.label ?? 'All time'
}

function FilterSelect({ label, value, allLabel, options, onChange, disabled = false }: FilterSelectProps) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-gray-900">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
        disabled={disabled}
      >
        <option value="">{disabled ? 'Loading...' : allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export function DashboardFilterBar({
  value,
  onChange,
  strainOptions,
  growerOptions,
  outputTypeOptions,
  totalRunCount,
  filteredRunCount,
  isLoading = false,
}: DashboardFilterBarProps) {
  const hasActiveFilters =
    value.dateRange !== defaultDashboardFilters.dateRange ||
    value.strain !== defaultDashboardFilters.strain ||
    value.grower !== defaultDashboardFilters.grower ||
    value.outputType !== defaultDashboardFilters.outputType

  return (
    <section className="space-y-5">
      <SectionHeader
        title="Analytics overview"
        description="Filter your saved runs to update the dashboard metrics, charts, comparisons, and recent activity."
        action={
          isLoading ? (
            <SkeletonBlock className="h-5 w-36 rounded-lg" />
          ) : (
            <p className="text-sm font-medium text-gray-500">
              Showing {filteredRunCount} of {totalRunCount} runs
            </p>
          )
        }
      />

      <div className={`${dashboardInsetSurfaceClass} space-y-5 p-4 sm:p-5`}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">Date range</p>
            <div className="flex flex-wrap gap-2">
              {dateRangeOptions.map((option) => {
                const isActive = option.value === value.dateRange

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange({ ...value, dateRange: option.value })}
                    aria-pressed={isActive}
                    disabled={isLoading}
                    className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'border-gray-900/10 bg-white text-gray-950 shadow-sm ring-1 ring-gray-900/5'
                        : 'border-transparent text-gray-600 hover:border-gray-200 hover:bg-white hover:text-gray-900'
                    } ${isLoading ? 'cursor-wait opacity-70' : ''}`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => onChange(defaultDashboardFilters)}
              disabled={isLoading}
              className={secondaryButtonClass}
            >
              Clear filters
            </button>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <FilterSelect
            label="Strain"
            value={value.strain}
            allLabel="All strains"
            options={strainOptions}
            onChange={(strain) => onChange({ ...value, strain })}
            disabled={isLoading}
          />
          <FilterSelect
            label="Grower"
            value={value.grower}
            allLabel="All growers"
            options={growerOptions}
            onChange={(grower) => onChange({ ...value, grower })}
            disabled={isLoading}
          />
          <FilterSelect
            label="Output type"
            value={value.outputType}
            allLabel="All output types"
            options={outputTypeOptions}
            onChange={(outputType) => onChange({ ...value, outputType })}
            disabled={isLoading}
          />
        </div>
      </div>
    </section>
  )
}
