'use client'

import { useMemo, useState } from 'react'
import { CostTrendChart } from './cost-trend-chart'
import {
  DashboardFilterBar,
  defaultDashboardFilters,
  getDashboardDateRangeLabel,
  type DashboardFilterState,
} from './dashboard-filter-bar'
import { GrowerPerformanceTable } from './grower-performance-table'
import { OutputByStrainChart } from './output-by-strain-chart'
import { OutputTypePerformanceTable } from './output-type-performance-table'
import { PerformanceInsights } from './performance-insights'
import { RecentRunsTable } from './recent-runs-table'
import { StrainPerformanceTable } from './strain-performance-table'
import { SummaryMetrics } from './summary-metrics'
import { YieldTrendChart } from './yield-trend-chart'
import {
  getCostPerGram,
  getCostPerKgBiomass,
  getOutputPerKgBiomass,
  getRunYieldPercent,
  getTotalCost,
} from './analytics-metrics'
import { EmptyState } from './dashboard-ui'

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

function normalizeFilterValue(value: string | null | undefined) {
  return value?.trim() ?? ''
}

function getFilterOptions(
  runs: DashboardAnalyticsRun[],
  key: 'strain_name' | 'grower_name' | 'output_type'
) {
  const options = new Set<string>()

  for (const run of runs) {
    const value = normalizeFilterValue(run[key])
    if (value) {
      options.add(value)
    }
  }

  return Array.from(options).sort((left, right) => left.localeCompare(right))
}

function matchesFilter(value: string | null | undefined, filterValue: string) {
  return !filterValue || normalizeFilterValue(value) === filterValue
}

function getCutoffDate(filter: DashboardFilterState['dateRange']) {
  if (filter === 'all') {
    return null
  }

  const cutoff = getStartOfToday()
  const days = filter === '7d' ? 7 : filter === '30d' ? 30 : 90
  cutoff.setDate(cutoff.getDate() - (days - 1))
  return cutoff
}

export function DashboardAnalytics({ runs }: DashboardAnalyticsProps) {
  const [filters, setFilters] = useState<DashboardFilterState>(defaultDashboardFilters)

  const filterOptions = useMemo(
    () => ({
      strain: getFilterOptions(runs, 'strain_name'),
      grower: getFilterOptions(runs, 'grower_name'),
      outputType: getFilterOptions(runs, 'output_type'),
    }),
    [runs]
  )

  const filteredRuns = useMemo(() => {
    const cutoffDate = getCutoffDate(filters.dateRange)

    return runs.filter((run) => {
      if (!matchesFilter(run.strain_name, filters.strain)) {
        return false
      }

      if (!matchesFilter(run.grower_name, filters.grower)) {
        return false
      }

      if (!matchesFilter(run.output_type, filters.outputType)) {
        return false
      }

      if (!cutoffDate) {
        return true
      }

      const runDate = parseRunDate(run.run_date)
      return runDate ? runDate >= cutoffDate : true
    })
  }, [filters, runs])

  const yields = filteredRuns.map(getRunYieldPercent).filter((value): value is number => value !== null)
  const costsPerGram = filteredRuns
    .map(getCostPerGram)
    .filter((value): value is number => value !== null)
  const costsPerKgBiomass = filteredRuns
    .map(getCostPerKgBiomass)
    .filter((value): value is number => value !== null)
  const outputsPerKg = filteredRuns
    .map(getOutputPerKgBiomass)
    .filter((value): value is number => value !== null)

  const totalRuns = filteredRuns.length
  const totalOutputWeight = roundMetric(
    filteredRuns.reduce((sum, run) => sum + (run.output_weight_g ?? 0), 0)
  )
  const totalCost = roundMetric(filteredRuns.reduce((sum, run) => sum + getTotalCost(run), 0))
  const averageYieldPercent =
    yields.length > 0
      ? roundMetric(yields.reduce((sum, value) => sum + value, 0) / yields.length)
      : 0
  const averageCostPerGram =
    costsPerGram.length > 0
      ? roundMetric(costsPerGram.reduce((sum, value) => sum + value, 0) / costsPerGram.length)
      : 0
  const averageCostPerKgBiomass =
    costsPerKgBiomass.length > 0
      ? roundMetric(
          costsPerKgBiomass.reduce((sum, value) => sum + value, 0) / costsPerKgBiomass.length
        )
      : 0
  const averageOutputPerKg =
    outputsPerKg.length > 0
      ? roundMetric(outputsPerKg.reduce((sum, value) => sum + value, 0) / outputsPerKg.length)
      : 0
  const activeFilterLabels = [
    filters.dateRange !== 'all' ? getDashboardDateRangeLabel(filters.dateRange) : null,
    filters.strain ? `Strain: ${filters.strain}` : null,
    filters.grower ? `Grower: ${filters.grower}` : null,
    filters.outputType ? `Output type: ${filters.outputType}` : null,
  ].filter((value): value is string => Boolean(value))
  const selectionLabel = activeFilterLabels.length > 0 ? activeFilterLabels.join(' | ') : 'All saved runs'
  const emptyMessage =
    runs.length === 0
      ? 'No runs yet. Add your first run to start tracking metrics.'
      : 'No runs match the selected filters. Try widening the date range or choosing All in a dropdown.'

  return (
    <div className="space-y-10 xl:space-y-12">
      <DashboardFilterBar
        value={filters}
        onChange={setFilters}
        strainOptions={filterOptions.strain}
        growerOptions={filterOptions.grower}
        outputTypeOptions={filterOptions.outputType}
        totalRunCount={runs.length}
        filteredRunCount={filteredRuns.length}
      />
      {runs.length > 0 && filteredRuns.length === 0 ? (
        <EmptyState
          title="No runs match these filters"
          description="Try widening the date range or setting one of the dropdowns back to All."
        />
      ) : null}
      <SummaryMetrics
        totalRuns={totalRuns}
        totalCost={totalCost}
        averageYieldPercent={averageYieldPercent}
        averageCostPerGram={averageCostPerGram}
        averageCostPerKgBiomass={averageCostPerKgBiomass}
        averageOutputPerKg={averageOutputPerKg}
        totalOutputWeight={totalOutputWeight}
        selectionLabel={selectionLabel}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <YieldTrendChart runs={filteredRuns} emptyMessage={emptyMessage} />
        <CostTrendChart runs={filteredRuns} emptyMessage={emptyMessage} />
      </div>
      <OutputByStrainChart runs={filteredRuns} emptyMessage={emptyMessage} />
      <PerformanceInsights filteredRuns={filteredRuns} />
      <div className="grid gap-6 xl:grid-cols-2">
        <StrainPerformanceTable runs={filteredRuns} emptyMessage={emptyMessage} />
        <GrowerPerformanceTable runs={filteredRuns} emptyMessage={emptyMessage} />
      </div>
      <OutputTypePerformanceTable runs={filteredRuns} emptyMessage={emptyMessage} />
      <RecentRunsTable runs={filteredRuns} emptyMessage={emptyMessage} />
    </div>
  )
}
