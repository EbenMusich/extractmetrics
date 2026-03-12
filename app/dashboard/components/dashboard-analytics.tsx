'use client'

import { useMemo, useState } from 'react'
import {
  DashboardDateFilter,
  type DashboardDateFilterValue,
} from './dashboard-date-filter'
import { GrowerPerformanceTable } from './grower-performance-table'
import { OutputTypePerformanceTable } from './output-type-performance-table'
import { PerformanceInsights } from './performance-insights'
import { RecentRunsTable } from './recent-runs-table'
import { StrainPerformanceTable } from './strain-performance-table'
import { SummaryMetrics } from './summary-metrics'
import { getCostPerGram, getYieldPercent } from './analytics-metrics'

type DashboardAnalyticsRun = {
  id: string
  run_date: string
  strain_name: string
  grower_name: string
  output_type: string
  biomass_input_g: number | null
  output_weight_g: number | null
  labor_cost: number | null
  material_cost: number | null
  utility_cost: number | null
  other_cost: number | null
  created_at: string
}

type DashboardAnalyticsProps = {
  runs: DashboardAnalyticsRun[]
}

function roundMetric(value: number) {
  return Number(value.toFixed(2))
}

function parseRunDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return null
  }

  return new Date(year, month - 1, day)
}

function getStartOfToday() {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth(), today.getDate())
}

function getCutoffDate(filter: DashboardDateFilterValue) {
  if (filter === 'all') {
    return null
  }

  const cutoff = getStartOfToday()
  cutoff.setDate(cutoff.getDate() - (filter === '7d' ? 7 : 30))
  return cutoff
}

export function DashboardAnalytics({ runs }: DashboardAnalyticsProps) {
  const [dateFilter, setDateFilter] = useState<DashboardDateFilterValue>('all')

  const filteredRuns = useMemo(() => {
    const cutoffDate = getCutoffDate(dateFilter)

    if (!cutoffDate) {
      return runs
    }

    return runs.filter((run) => {
      const runDate = parseRunDate(run.run_date)
      return runDate ? runDate >= cutoffDate : true
    })
  }, [dateFilter, runs])

  const yields = filteredRuns.map(getYieldPercent).filter((value): value is number => value !== null)
  const costsPerGram = filteredRuns
    .map(getCostPerGram)
    .filter((value): value is number => value !== null)

  const totalRuns = filteredRuns.length
  const totalOutputWeight = roundMetric(
    filteredRuns.reduce((sum, run) => sum + (run.output_weight_g ?? 0), 0)
  )
  const averageYieldPercent =
    yields.length > 0
      ? roundMetric(yields.reduce((sum, value) => sum + value, 0) / yields.length)
      : 0
  const averageCostPerGram =
    costsPerGram.length > 0
      ? roundMetric(costsPerGram.reduce((sum, value) => sum + value, 0) / costsPerGram.length)
      : 0
  const emptyMessage =
    runs.length === 0
      ? 'No runs yet. Add your first run to start tracking metrics.'
      : 'No runs match the selected date range.'

  return (
    <div className="space-y-8 lg:space-y-10">
      <DashboardDateFilter value={dateFilter} onChange={setDateFilter} />
      <SummaryMetrics
        totalRuns={totalRuns}
        averageYieldPercent={averageYieldPercent}
        averageCostPerGram={averageCostPerGram}
        totalOutputWeight={totalOutputWeight}
      />
      <PerformanceInsights filteredRuns={filteredRuns} />
      <StrainPerformanceTable runs={filteredRuns} emptyMessage={emptyMessage} />
      <GrowerPerformanceTable runs={filteredRuns} emptyMessage={emptyMessage} />
      <OutputTypePerformanceTable runs={filteredRuns} emptyMessage={emptyMessage} />
      <RecentRunsTable runs={filteredRuns} emptyMessage={emptyMessage} />
    </div>
  )
}
