'use client'

type GrowerPerformanceRun = {
  id: string
  grower_name?: string | null
  biomass_input_g?: number | null
  output_weight_g?: number | null
  labor_cost?: number | null
  material_cost?: number | null
  utility_cost?: number | null
  other_cost?: number | null
}

type GrowerPerformanceTableProps = {
  runs: GrowerPerformanceRun[]
  emptyMessage?: string
}

type GrowerAggregate = {
  growerName: string
  runCount: number
  totalOutputG: number
  averageYieldPercent: number | null
  averageCostPerGram: number | null
}

type MutableGrowerAggregate = {
  growerName: string
  runCount: number
  totalOutputG: number
  yieldSum: number
  yieldCount: number
  costPerGramSum: number
  costPerGramCount: number
}

const percentFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const gramsFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function coerceNumber(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function getGrowerLabel(value: string | null | undefined) {
  const normalizedValue = value?.trim()
  return normalizedValue ? normalizedValue : 'Unspecified'
}

function getYieldPercent(run: GrowerPerformanceRun) {
  const biomassInputG = coerceNumber(run.biomass_input_g)
  const outputWeightG = coerceNumber(run.output_weight_g)

  if (biomassInputG === null || biomassInputG <= 0 || outputWeightG === null) {
    return null
  }

  return (outputWeightG / biomassInputG) * 100
}

function getCostPerGram(run: GrowerPerformanceRun) {
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

function aggregateGrowerMetrics(runs: GrowerPerformanceRun[]): GrowerAggregate[] {
  const growerMap = new Map<string, MutableGrowerAggregate>()

  for (const run of runs) {
    const growerName = getGrowerLabel(run.grower_name)
    const existingAggregate = growerMap.get(growerName)
    const aggregate =
      existingAggregate ??
      {
        growerName,
        runCount: 0,
        totalOutputG: 0,
        yieldSum: 0,
        yieldCount: 0,
        costPerGramSum: 0,
        costPerGramCount: 0,
      }

    aggregate.runCount += 1
    aggregate.totalOutputG += coerceNumber(run.output_weight_g) ?? 0

    const yieldPercent = getYieldPercent(run)
    if (yieldPercent !== null) {
      aggregate.yieldSum += yieldPercent
      aggregate.yieldCount += 1
    }

    const costPerGram = getCostPerGram(run)
    if (costPerGram !== null) {
      aggregate.costPerGramSum += costPerGram
      aggregate.costPerGramCount += 1
    }

    growerMap.set(growerName, aggregate)
  }

  return Array.from(growerMap.values())
    .map((aggregate) => ({
      growerName: aggregate.growerName,
      runCount: aggregate.runCount,
      totalOutputG: aggregate.totalOutputG,
      averageYieldPercent:
        aggregate.yieldCount > 0 ? aggregate.yieldSum / aggregate.yieldCount : null,
      averageCostPerGram:
        aggregate.costPerGramCount > 0
          ? aggregate.costPerGramSum / aggregate.costPerGramCount
          : null,
    }))
    .sort((left, right) => {
      if (right.totalOutputG !== left.totalOutputG) {
        return right.totalOutputG - left.totalOutputG
      }

      if (right.runCount !== left.runCount) {
        return right.runCount - left.runCount
      }

      return left.growerName.localeCompare(right.growerName)
    })
}

function formatPercent(value: number | null) {
  if (value === null) {
    return '-'
  }

  return `${percentFormatter.format(value)}%`
}

function formatCurrency(value: number | null) {
  if (value === null) {
    return '-'
  }

  return currencyFormatter.format(value)
}

function formatGrams(value: number) {
  return `${gramsFormatter.format(value)} g`
}

export function GrowerPerformanceTable({
  runs,
  emptyMessage = 'No run data available yet.',
}: GrowerPerformanceTableProps) {
  const rows = aggregateGrowerMetrics(runs)

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold">Grower performance</h2>
        <p className="text-sm text-gray-600">
          Aggregated yield, cost, and output by grower across your saved runs.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50 text-left text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Grower</th>
                <th className="px-4 py-3 font-medium">Runs</th>
                <th className="px-4 py-3 font-medium">Avg Yield</th>
                <th className="px-4 py-3 font-medium">Avg Cost / g</th>
                <th className="px-4 py-3 font-medium">Total Output</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-gray-600" colSpan={5}>
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.growerName}>
                    <td className="px-4 py-3 font-medium text-gray-900">{row.growerName}</td>
                    <td className="px-4 py-3 text-gray-700">{row.runCount}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatPercent(row.averageYieldPercent)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatCurrency(row.averageCostPerGram)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{formatGrams(row.totalOutputG)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
