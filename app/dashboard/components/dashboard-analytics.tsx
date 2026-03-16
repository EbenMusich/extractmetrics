'use client'

import Link from 'next/link'
import { type ReactNode, useMemo, useState } from 'react'
import { CostBreakdownChart } from './cost-breakdown-chart'
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
import { YieldByStrainChart } from './yield-by-strain-chart'
import { YieldTrendChart } from './yield-trend-chart'
import {
  getDashboardSummaryMetrics,
} from './analytics-metrics'
import { roundNumber } from './safe-number'
import {
  SectionHeader,
  SkeletonBlock,
  dashboardSurfaceClass,
  primaryButtonClass,
  secondaryButtonClass,
} from './dashboard-ui'

type DashboardAnalyticsRun = {
  id: string
  run_date: string
  strain_name: string
  grower_name: string
  output_type: string
  biomass_input_g: number | null
  output_weight_g: number | null
  solvent_used_g?: number | null
  labor_cost: number | null
  material_cost: number | null
  utility_cost: number | null
  other_cost: number | null
  created_at: string
}

type DashboardAnalyticsProps = {
  runs?: DashboardAnalyticsRun[]
  isLoading?: boolean
}

type DashboardEmptyState = {
  title: string
  description: string
  action?: ReactNode
}

const EMPTY_RUNS: DashboardAnalyticsRun[] = []

function roundMetric(value: number | null | undefined) {
  return roundNumber(value, 2)
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

function PerformanceTableSkeleton({ title, description }: { title: string; description: string }) {
  return (
    <section className="space-y-5">
      <SectionHeader title={title} description={description} />
      <div className={`${dashboardSurfaceClass} overflow-hidden`}>
        <div className="border-b border-gray-200 bg-gray-50/90 px-5 py-3">
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-3 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4 p-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((__, cellIndex) => (
                <SkeletonBlock key={cellIndex} className="h-4 w-full rounded-lg" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function DashboardAnalytics({ runs, isLoading = false }: DashboardAnalyticsProps) {
  const safeRuns = runs ?? EMPTY_RUNS
  const [filters, setFilters] = useState<DashboardFilterState>(defaultDashboardFilters)

  const filterOptions = useMemo(
    () => ({
      strain: getFilterOptions(safeRuns, 'strain_name'),
      grower: getFilterOptions(safeRuns, 'grower_name'),
      outputType: getFilterOptions(safeRuns, 'output_type'),
    }),
    [safeRuns]
  )

  const filteredRuns = useMemo(() => {
    const cutoffDate = getCutoffDate(filters.dateRange)

    return safeRuns.filter((run) => {
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
  }, [filters, safeRuns])
  const summaryMetrics = useMemo(() => getDashboardSummaryMetrics(filteredRuns), [filteredRuns])
  const activeFilterLabels = [
    filters.dateRange !== 'all' ? getDashboardDateRangeLabel(filters.dateRange) : null,
    filters.strain ? `Strain: ${filters.strain}` : null,
    filters.grower ? `Grower: ${filters.grower}` : null,
    filters.outputType ? `Output type: ${filters.outputType}` : null,
  ].filter((value): value is string => Boolean(value))
  const selectionLabel = activeFilterLabels.length > 0 ? activeFilterLabels.join(' | ') : 'All saved runs'
  const sectionEmptyState: DashboardEmptyState | null =
    safeRuns.length === 0
      ? {
          title: 'No runs logged yet',
          description:
            'Analytics, trends, and comparisons will appear here once you log your first extraction run.',
          action: (
            <Link href="/dashboard/new-run" className={primaryButtonClass}>
              Log your first run
            </Link>
          ),
        }
      : filteredRuns.length === 0
        ? {
            title: 'No data matches the selected filters',
            description: 'Try clearing or adjusting your filters to bring runs back into view.',
            action: (
              <button
                type="button"
                onClick={() => setFilters(defaultDashboardFilters)}
                className={secondaryButtonClass}
              >
                Clear filters
              </button>
            ),
          }
        : null
  const emptyMessage = sectionEmptyState?.description ?? 'Not enough valid data to display this chart.'

  return (
    <div className="space-y-10 xl:space-y-12">
      <DashboardFilterBar
        value={filters}
        onChange={setFilters}
        strainOptions={filterOptions.strain}
        growerOptions={filterOptions.grower}
        outputTypeOptions={filterOptions.outputType}
        totalRunCount={safeRuns.length}
        filteredRunCount={filteredRuns.length}
        isLoading={isLoading}
      />
      <SummaryMetrics
        totalRuns={summaryMetrics.totalRuns}
        totalCost={roundMetric(summaryMetrics.totalCost)}
        yieldPercent={summaryMetrics.yieldPercent === null ? null : roundMetric(summaryMetrics.yieldPercent)}
        costPerGramOutput={
          summaryMetrics.costPerGramOutput === null
            ? null
            : roundMetric(summaryMetrics.costPerGramOutput)
        }
        costPerKgBiomass={
          summaryMetrics.costPerKgBiomass === null
            ? null
            : roundMetric(summaryMetrics.costPerKgBiomass)
        }
        outputPerKgBiomass={
          summaryMetrics.outputPerKgBiomass === null
            ? null
            : roundMetric(summaryMetrics.outputPerKgBiomass)
        }
        solventPerGramOutput={
          summaryMetrics.solventPerGramOutput === null
            ? null
            : roundMetric(summaryMetrics.solventPerGramOutput)
        }
        outputPerGramSolvent={
          summaryMetrics.outputPerGramSolvent === null
            ? null
            : roundMetric(summaryMetrics.outputPerGramSolvent)
        }
        totalOutputWeight={roundMetric(summaryMetrics.totalOutputWeightG)}
        selectionLabel={selectionLabel}
        isLoading={isLoading}
        emptyState={sectionEmptyState}
      />
      {sectionEmptyState && !isLoading ? null : (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
            <YieldTrendChart runs={filteredRuns} emptyMessage={emptyMessage} isLoading={isLoading} />
            <CostTrendChart runs={filteredRuns} emptyMessage={emptyMessage} isLoading={isLoading} />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <OutputByStrainChart
              runs={filteredRuns}
              emptyMessage={emptyMessage}
              isLoading={isLoading}
            />
            <CostBreakdownChart runs={filteredRuns} emptyMessage={emptyMessage} isLoading={isLoading} />
          </div>
          <div className="grid gap-6">
            <YieldByStrainChart runs={filteredRuns} emptyMessage={emptyMessage} isLoading={isLoading} />
          </div>
          <PerformanceInsights
            filteredRuns={filteredRuns}
            isLoading={isLoading}
            emptyState={sectionEmptyState}
          />
          {isLoading ? (
            <>
              <div className="grid gap-6 xl:grid-cols-2">
                <PerformanceTableSkeleton
                  title="Strain performance"
                  description="Aggregated yield, cost, and output by strain across your saved runs."
                />
                <PerformanceTableSkeleton
                  title="Grower performance"
                  description="Aggregated yield, cost, and output by grower across your saved runs."
                />
              </div>
              <PerformanceTableSkeleton
                title="Output type performance"
                description="Aggregated yield, cost, and output by output type across your saved runs."
              />
              <PerformanceTableSkeleton
                title="Recent runs"
                description="Your latest saved extraction runs."
              />
            </>
          ) : (
            <>
              <div className="grid gap-6 xl:grid-cols-2">
                <StrainPerformanceTable runs={filteredRuns} emptyMessage={emptyMessage} />
                <GrowerPerformanceTable runs={filteredRuns} emptyMessage={emptyMessage} />
              </div>
              <OutputTypePerformanceTable runs={filteredRuns} emptyMessage={emptyMessage} />
              <RecentRunsTable runs={filteredRuns} emptyMessage={emptyMessage} />
            </>
          )}
        </>
      )}
    </div>
  )
}
