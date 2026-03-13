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

type OutputByStrainChartProps = {
  runs: RunTableRun[]
  emptyMessage: string
}

type OutputByStrainPoint = {
  strain: string
  totalOutputG: number
}

const gramsFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

function formatGrams(value: number) {
  return `${gramsFormatter.format(value)} g`
}

export function OutputByStrainChart({ runs, emptyMessage }: OutputByStrainChartProps) {
  const data = useMemo<OutputByStrainPoint[]>(() => {
    return aggregatePerformanceMetrics(runs, 'strain_name').map((row) => ({
      strain: row.label,
      totalOutputG: Number(row.totalOutputG.toFixed(2)),
    }))
  }, [runs])

  return (
    <AnalyticsChartCard
      title="Output by strain"
      description="Total output in grams, aggregated by strain from the selected runs."
      emptyTitle="No strain output yet"
      emptyMessage={emptyMessage}
      hasData={data.length > 0}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 18, left: 4, bottom: 8 }}>
          <CartesianGrid
            stroke={analyticsChartTheme.gridStroke}
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="strain"
            tick={analyticsChartTheme.axisTick}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={16}
          />
          <YAxis
            tickFormatter={formatGrams}
            tick={analyticsChartTheme.axisTick}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            width={72}
          />
          <Tooltip
            formatter={(value) => (typeof value === 'number' ? formatGrams(value) : value)}
            labelFormatter={(label) => `Strain: ${label}`}
            contentStyle={analyticsChartTheme.tooltipContentStyle}
            labelStyle={analyticsChartTheme.tooltipLabelStyle}
            itemStyle={analyticsChartTheme.tooltipItemStyle}
            cursor={{ fill: 'rgba(148, 163, 184, 0.10)' }}
          />
          <Bar
            dataKey="totalOutputG"
            name="Total output"
            fill="#2563eb"
            radius={[12, 12, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </AnalyticsChartCard>
  )
}
