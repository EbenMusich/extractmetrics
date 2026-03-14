'use client'

import {
  aggregatePerformanceMetrics,
  type PerformanceMetricRun,
} from './analytics-metrics'
import {
  EmptyState,
  SectionHeader,
  tableClass,
  tableHeadClass,
  tableRowClass,
  tableWrapperClass,
} from './dashboard-ui'
import { formatGramsPerKg } from './run-table-formatters'

type GrowerPerformanceRun = PerformanceMetricRun

type GrowerPerformanceTableProps = {
  runs: GrowerPerformanceRun[]
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

export function GrowerPerformanceTable({
  runs,
  emptyMessage = 'No run data available yet.',
}: GrowerPerformanceTableProps) {
  const rows = aggregatePerformanceMetrics(runs, 'grower_name')

  return (
    <section className="space-y-5">
      <SectionHeader
        title="Grower performance"
        description="Aggregated yield, cost, and output by grower across your saved runs."
      />

      <div className={tableWrapperClass}>
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead className={tableHeadClass}>
              <tr>
                <th className="px-4 py-3 sm:px-5">Grower</th>
                <th className="px-4 py-3 text-right sm:px-5">Runs</th>
                <th className="px-4 py-3 text-right sm:px-5">Avg Yield</th>
                <th className="px-4 py-3 text-right sm:px-5">Avg Cost / g</th>
                <th className="px-4 py-3 text-right sm:px-5">Avg Output / kg</th>
                <th className="px-4 py-3 text-right sm:px-5">Total Output</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 sm:px-5" colSpan={6}>
                    <EmptyState compact title="No grower data yet" description={emptyMessage} />
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.label} className={tableRowClass}>
                    <td className="px-4 py-3 font-medium text-gray-900 sm:px-5">{row.label}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700 sm:px-5">
                      {row.runCount}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700 sm:px-5">
                      {formatPercent(row.averageYieldPercent)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700 sm:px-5">
                      {formatCurrency(row.averageCostPerGram)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700 sm:px-5">
                      {formatGramsPerKg(row.averageOutputPerKg)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700 sm:px-5">
                      {formatGrams(row.totalOutputG)}
                    </td>
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
