type RecentRun = {
  id: string
  run_date: string
  strain_name: string
  grower_name: string
  output_type: string
  biomass_input_g: number | null
  output_weight_g: number | null
  labor_cost?: number | null
  material_cost: number | null
  utility_cost: number | null
  other_cost: number | null
}

type RecentRunsTableProps = {
  runs: RecentRun[]
  emptyMessage?: string
}

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const MAX_VISIBLE_RUNS = 15
const numericCellClass = 'px-4 py-3 text-right tabular-nums'
const textCellClass = 'px-4 py-3'

function coerceNumber(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function formatGrams(value: number | null | undefined) {
  const normalizedValue = coerceNumber(value)
  if (normalizedValue === null) {
    return '-'
  }

  return `${normalizedValue.toFixed(1)} g`
}

function formatPercent(value: number | null | undefined) {
  const normalizedValue = coerceNumber(value)
  if (normalizedValue === null) {
    return '-'
  }

  return `${normalizedValue.toFixed(1)}%`
}

function formatCurrency(value: number | null | undefined) {
  const normalizedValue = coerceNumber(value)
  if (normalizedValue === null) {
    return '-'
  }

  return currencyFormatter.format(normalizedValue)
}

function formatDate(value: string) {
  const normalizedValue = value.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedValue)) {
    return normalizedValue
  }

  const parsedDate = new Date(normalizedValue)
  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  const year = parsedDate.getFullYear()
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const day = String(parsedDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function calculateYieldPercent(run: RecentRun) {
  const biomassInputG = coerceNumber(run.biomass_input_g)
  const outputWeightG = coerceNumber(run.output_weight_g)

  if (biomassInputG === null || biomassInputG <= 0 || outputWeightG === null) {
    return null
  }

  return (outputWeightG / biomassInputG) * 100
}

function calculateCostPerGram(run: RecentRun) {
  const outputWeightG = coerceNumber(run.output_weight_g)

  if (outputWeightG === null || outputWeightG <= 0) {
    return null
  }

  const totalCost =
    (coerceNumber(run.labor_cost) ?? 0) +
    (coerceNumber(run.material_cost) ?? 0) +
    (coerceNumber(run.utility_cost) ?? 0) +
    (coerceNumber(run.other_cost) ?? 0)

  return totalCost / outputWeightG
}

function RecentRunsRow({ run }: { run: RecentRun }) {
  return (
    <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80">
      <td className={textCellClass}>{formatDate(run.run_date)}</td>
      <td className={textCellClass}>{run.strain_name}</td>
      <td className={textCellClass}>{run.output_type}</td>
      <td className={numericCellClass}>{formatGrams(run.biomass_input_g)}</td>
      <td className={numericCellClass}>{formatGrams(run.output_weight_g)}</td>
      <td className={numericCellClass}>{formatPercent(calculateYieldPercent(run))}</td>
      <td className={numericCellClass}>{formatCurrency(calculateCostPerGram(run))}</td>
    </tr>
  )
}

export function RecentRunsTable({
  runs,
  emptyMessage = 'No runs recorded yet.',
}: RecentRunsTableProps) {
  const visibleRuns = runs.slice(0, MAX_VISIBLE_RUNS)

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold">Recent runs</h2>
        <p className="text-sm text-gray-600">Your latest saved extraction runs.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
              <tr>
                <th className={textCellClass}>Run Date</th>
                <th className={textCellClass}>Strain</th>
                <th className={textCellClass}>Output Type</th>
                <th className={numericCellClass}>Biomass In</th>
                <th className={numericCellClass}>Output</th>
                <th className={numericCellClass}>Yield %</th>
                <th className={numericCellClass}>Cost / g</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {visibleRuns.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-gray-500" colSpan={7}>
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                visibleRuns.map((run) => <RecentRunsRow key={run.id} run={run} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
