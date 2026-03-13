'use client'

import { useMemo } from 'react'
import {
  aggregatePerformanceMetrics,
  type AggregatedPerformanceMetric,
  type PerformanceMetricRun,
} from './analytics-metrics'
import { EmptyState, SectionHeader, dashboardSurfaceClass } from './dashboard-ui'

type PerformanceInsightsProps = {
  filteredRuns: PerformanceMetricRun[]
}

type InsightCard = {
  title: string
  label: string
  value: string
}

const percentFormatter = new Intl.NumberFormat('en-US', {
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
  return value === null ? '-' : `${percentFormatter.format(value)}%`
}

function formatCostPerGram(value: number | null) {
  return value === null ? '-' : `${currencyFormatter.format(value)} / g`
}

function getHighestMetric(
  rows: AggregatedPerformanceMetric[],
  getValue: (row: AggregatedPerformanceMetric) => number | null
) {
  let bestRow: AggregatedPerformanceMetric | null = null
  let bestValue: number | null = null

  for (const row of rows) {
    const value = getValue(row)
    if (value === null) {
      continue
    }

    if (bestValue === null || value > bestValue) {
      bestRow = row
      bestValue = value
    }
  }

  return bestRow
}

function getLowestMetric(
  rows: AggregatedPerformanceMetric[],
  getValue: (row: AggregatedPerformanceMetric) => number | null
) {
  let bestRow: AggregatedPerformanceMetric | null = null
  let bestValue: number | null = null

  for (const row of rows) {
    const value = getValue(row)
    if (value === null) {
      continue
    }

    if (bestValue === null || value < bestValue) {
      bestRow = row
      bestValue = value
    }
  }

  return bestRow
}

function toInsightCard(
  title: string,
  row: AggregatedPerformanceMetric | null,
  formatValue: (value: number | null) => string,
  getValue: (row: AggregatedPerformanceMetric) => number | null
): InsightCard {
  return {
    title,
    label: row?.label ?? 'No valid data',
    value: formatValue(row ? getValue(row) : null),
  }
}

export function PerformanceInsights({ filteredRuns }: PerformanceInsightsProps) {
  const cards = useMemo(() => {
    const strainMetrics = aggregatePerformanceMetrics(filteredRuns, 'strain_name')
    const growerMetrics = aggregatePerformanceMetrics(filteredRuns, 'grower_name')
    const outputTypeMetrics = aggregatePerformanceMetrics(filteredRuns, 'output_type')

    return [
      toInsightCard(
        'Best Yielding Strain',
        getHighestMetric(strainMetrics, (row) => row.averageYieldPercent),
        formatPercent,
        (row) => row.averageYieldPercent
      ),
      toInsightCard(
        'Lowest Cost Strain',
        getLowestMetric(strainMetrics, (row) => row.averageCostPerGram),
        formatCostPerGram,
        (row) => row.averageCostPerGram
      ),
      toInsightCard(
        'Best Performing Grower',
        getHighestMetric(growerMetrics, (row) => row.averageYieldPercent),
        formatPercent,
        (row) => row.averageYieldPercent
      ),
      toInsightCard(
        'Lowest Cost Grower',
        getLowestMetric(growerMetrics, (row) => row.averageCostPerGram),
        formatCostPerGram,
        (row) => row.averageCostPerGram
      ),
      toInsightCard(
        'Best Output Type',
        getHighestMetric(outputTypeMetrics, (row) => row.averageYieldPercent),
        formatPercent,
        (row) => row.averageYieldPercent
      ),
    ]
  }, [filteredRuns])

  return (
    <section className="space-y-5">
      <SectionHeader
        title="Performance insights"
        description="Automatic highlights based on average yield and cost across the selected runs."
      />

      {filteredRuns.length === 0 ? (
        <EmptyState
          compact
          title="No insights yet"
          description="Add a run or widen the date filter to see performance highlights."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className={`${dashboardSurfaceClass} flex min-h-36 flex-col justify-between p-5 sm:p-6`}
            >
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-lg font-semibold tracking-tight text-gray-950">{card.label}</p>
              </div>
              <div className="mt-6 flex items-end justify-between gap-4">
                <p className="text-3xl font-semibold tracking-tight text-gray-950">{card.value}</p>
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                  Insight {index + 1}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
