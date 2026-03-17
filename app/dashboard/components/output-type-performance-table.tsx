'use client'

import {
  aggregatePerformanceMetrics,
  type PerformanceMetricRun,
} from './analytics-metrics'
import { SectionHeader } from './dashboard-ui'
import { ResponsiveDashboardTable } from './responsive-dashboard-table'
import { formatCurrency, formatGrams, formatGramsPerKg, formatPercent } from './run-table-formatters'

type OutputTypePerformanceRun = PerformanceMetricRun

type OutputTypePerformanceTableProps = {
  runs: OutputTypePerformanceRun[]
  emptyMessage?: string
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

      <ResponsiveDashboardTable
        columns={[
          { header: 'Output Type', className: 'px-4 py-3 sm:px-5' },
          { header: 'Runs', className: 'px-4 py-3 text-right sm:px-5' },
          { header: 'Average Yield', className: 'px-4 py-3 text-right sm:px-5' },
          { header: 'Average Cost per g Output', className: 'px-4 py-3 text-right sm:px-5' },
          { header: 'Average Output per kg Biomass', className: 'px-4 py-3 text-right sm:px-5' },
          { header: 'Total Output', className: 'px-4 py-3 text-right sm:px-5' },
        ]}
        rows={rows.map((row) => ({
          key: row.label,
          primaryLabel: row.label,
          desktopCells: [
            { content: row.label, className: 'px-4 py-3 font-medium text-gray-900 sm:px-5' },
            {
              content: row.runCount,
              className: 'px-4 py-3 text-right tabular-nums text-gray-700 sm:px-5',
            },
            {
              content: formatPercent(row.averageYieldPercent),
              className: 'px-4 py-3 text-right tabular-nums text-gray-700 sm:px-5',
            },
            {
              content: formatCurrency(row.averageCostPerGram),
              className: 'px-4 py-3 text-right tabular-nums text-gray-700 sm:px-5',
            },
            {
              content: formatGramsPerKg(row.averageOutputPerKg),
              className: 'px-4 py-3 text-right tabular-nums text-gray-700 sm:px-5',
            },
            {
              content: formatGrams(row.totalOutputG),
              className: 'px-4 py-3 text-right tabular-nums text-gray-700 sm:px-5',
            },
          ],
          mobileFields: [
            { label: 'Runs', value: row.runCount, valueClassName: 'tabular-nums' },
            {
              label: 'Average Yield',
              value: formatPercent(row.averageYieldPercent),
              valueClassName: 'tabular-nums',
            },
            {
              label: 'Average Cost per g Output',
              value: formatCurrency(row.averageCostPerGram),
              valueClassName: 'tabular-nums',
            },
            {
              label: 'Average Output per kg Biomass',
              value: formatGramsPerKg(row.averageOutputPerKg),
              valueClassName: 'tabular-nums',
            },
            {
              label: 'Total Output',
              value: formatGrams(row.totalOutputG),
              valueClassName: 'tabular-nums',
            },
          ],
        }))}
        emptyStateTitle="No output data yet"
        emptyMessage={emptyMessage}
      />
    </section>
  )
}
