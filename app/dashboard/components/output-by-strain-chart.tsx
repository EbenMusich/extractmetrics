'use client'

import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { aggregatePerformanceMetrics } from './analytics-metrics'
import { AnalyticsChartCard, analyticsChartTheme } from './analytics-chart-card'
import { type RunTableRun } from './run-table-formatters'
import { roundNumber } from './safe-number'

type OutputByStrainChartProps = {
  runs?: RunTableRun[]
  emptyMessage: string
  isLoading?: boolean
}

type OutputByStrainPoint = {
  strain: string
  totalOutputG: number
}

const EMPTY_RUNS: RunTableRun[] = []

const gramsFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

function formatGrams(value: number) {
  return `${gramsFormatter.format(value)} g`
}

export function OutputByStrainChart({
  runs,
  emptyMessage,
  isLoading = false,
}: OutputByStrainChartProps) {
  const safeRuns = runs ?? EMPTY_RUNS
  const data = useMemo<OutputByStrainPoint[]>(() => {
    return aggregatePerformanceMetrics(safeRuns, 'strain_name').map((row) => ({
      strain: row.label,
      totalOutputG: roundNumber(row.totalOutputG, 2),
    }))
  }, [safeRuns])

  return (
    <AnalyticsChartCard
      title="Output by strain"
      description="Total output in grams, aggregated by strain from the selected runs."
      emptyTitle="No strain output yet"
      emptyMessage={safeRuns.length === 0 ? emptyMessage : 'Not enough valid data to display this chart.'}
      hasData={data.length > 0}
      isLoading={isLoading}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ ...analyticsChartTheme.chartMargin, left: 4, bottom: 8 }}
          barCategoryGap={18}
        >
          <CartesianGrid
            stroke={analyticsChartTheme.gridStroke}
            strokeDasharray={analyticsChartTheme.gridDasharray}
            vertical={false}
          />
          <XAxis
            dataKey="strain"
            tick={analyticsChartTheme.axisTick}
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            minTickGap={16}
          />
          <YAxis
            tickFormatter={formatGrams}
            tick={analyticsChartTheme.axisTick}
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            width={72}
          />
          <Tooltip
            formatter={(value) => (typeof value === 'number' ? formatGrams(value) : value)}
            labelFormatter={(label) => `Strain: ${label}`}
            contentStyle={analyticsChartTheme.tooltipContentStyle}
            labelStyle={analyticsChartTheme.tooltipLabelStyle}
            itemStyle={analyticsChartTheme.tooltipItemStyle}
            wrapperStyle={analyticsChartTheme.tooltipWrapperStyle}
            cursor={{ fill: analyticsChartTheme.cursorFill }}
          />
          <Bar
            dataKey="totalOutputG"
            name="Total output"
            fill="#2563eb"
            radius={[10, 10, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </AnalyticsChartCard>
  )
}
