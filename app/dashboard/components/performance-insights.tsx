'use client'

import { useMemo } from 'react'
import {
  aggregatePerformanceMetrics,
  type AggregatedPerformanceMetric,
  type PerformanceMetricRun,
} from './analytics-metrics'

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
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold">Performance Insights</h2>
        <p className="text-sm text-gray-600">
          Automatic highlights based on average yield and cost across the selected runs.
        </p>
      </div>

      {filteredRuns.length === 0 ? (
        <div className="rounded-xl border bg-white p-5 text-sm text-gray-600">
          No run data available yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="rounded-xl border bg-white p-5">
              <p className="text-sm text-gray-600">{card.title}</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">{card.label}</p>
              <p className="mt-1 text-2xl font-semibold">{card.value}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
