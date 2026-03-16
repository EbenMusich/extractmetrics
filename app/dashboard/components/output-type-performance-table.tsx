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
    <section className="space-y-5">
      <SectionHeader
        title="Output type performance"
        description="Aggregated yield, cost, and output by output type across your saved runs."
      />

      <div className={tableWrapperClass}>
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead className={tableHeadClass}>
              <tr>
                <th className="px-4 py-3 sm:px-5">Output Type</th>
                <th className="px-4 py-3 text-right sm:px-5">Runs</th>
                <th className="px-4 py-3 text-right sm:px-5">Average Yield</th>
                <th className="px-4 py-3 text-right sm:px-5">Average Cost per g Output</th>
                <th className="px-4 py-3 text-right sm:px-5">Average Output per kg Biomass</th>
                <th className="px-4 py-3 text-right sm:px-5">Total Output</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 sm:px-5" colSpan={6}>
                    <EmptyState compact title="No output data yet" description={emptyMessage} />
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
