'use client'

import {
  aggregatePerformanceMetrics,
  type PerformanceMetricRun,
} from './analytics-metrics'

type OutputTypePerformanceRun = PerformanceMetricRun

type OutputTypePerformanceTableProps = {
  runs: OutputTypePerformanceRun[]
  emptyMessage?: string
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

export function OutputTypePerformanceTable({
  runs,
  emptyMessage = 'No run data available yet.',
}: OutputTypePerformanceTableProps) {
  const rows = aggregatePerformanceMetrics(runs, 'output_type')

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold">Output type performance</h2>
        <p className="text-sm text-gray-600">
          Aggregated yield, cost, and output by output type across your saved runs.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50 text-left text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Output Type</th>
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
                  <tr key={row.label}>
                    <td className="px-4 py-3 font-medium text-gray-900">{row.label}</td>
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
