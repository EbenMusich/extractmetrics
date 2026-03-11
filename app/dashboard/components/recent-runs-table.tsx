type RecentRun = {
  id: string
  run_date: string
  strain_name: string
  grower_name: string
  output_type: string
  biomass_input_g: number | null
  output_weight_g: number | null
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
  maximumFractionDigits: 2,
})

function formatNumber(value: number | null, suffix = '') {
  if (value === null) {
    return '-'
  }

  return `${numberFormatter.format(value)}${suffix}`
}

function formatCurrency(value: number | null) {
  if (value === null) {
    return '-'
  }

  return currencyFormatter.format(value)
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString()
}

function calculateYieldPercent(run: RecentRun) {
  if (!run.biomass_input_g || !run.output_weight_g) {
    return null
  }

  return (run.output_weight_g / run.biomass_input_g) * 100
}

function calculateCostPerGram(run: RecentRun) {
  if (!run.output_weight_g) {
    return null
  }

  const totalCost =
    (run.material_cost ?? 0) + (run.utility_cost ?? 0) + (run.other_cost ?? 0)

  return totalCost / run.output_weight_g
}

export function RecentRunsTable({
  runs,
  emptyMessage = 'No runs yet. Add your first run to start tracking metrics.',
}: RecentRunsTableProps) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold">Recent runs</h2>
        <p className="text-sm text-gray-600">Your latest saved extraction runs.</p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        {runs.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">
            {emptyMessage}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50 text-left text-sm text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Strain</th>
                  <th className="px-4 py-3 font-medium">Grower</th>
                  <th className="px-4 py-3 font-medium">Output</th>
                  <th className="px-4 py-3 font-medium">Yield</th>
                  <th className="px-4 py-3 font-medium">Cost / g</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {runs.map((run) => (
                  <tr key={run.id}>
                    <td className="px-4 py-3">{formatDate(run.run_date)}</td>
                    <td className="px-4 py-3">{run.strain_name}</td>
                    <td className="px-4 py-3">{run.grower_name}</td>
                    <td className="px-4 py-3">{formatNumber(run.output_weight_g, ' g')}</td>
                    <td className="px-4 py-3">{formatNumber(calculateYieldPercent(run), '%')}</td>
                    <td className="px-4 py-3">{formatCurrency(calculateCostPerGram(run))}</td>
                    <td className="px-4 py-3">{run.output_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
