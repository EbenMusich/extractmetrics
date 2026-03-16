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
import { getYieldByStrainData, type YieldByStrainDatum } from './analytics-metrics'
import { AnalyticsChartCard, analyticsChartTheme } from './analytics-chart-card'
import { type RunTableRun } from './run-table-formatters'

type YieldByStrainChartProps = {
  runs: RunTableRun[]
  emptyMessage: string
  isLoading?: boolean
}

const percentFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

function formatPercent(value: number) {
  return `${percentFormatter.format(value)}%`
}

export function YieldByStrainChart({
  runs,
  emptyMessage,
  isLoading = false,
}: YieldByStrainChartProps) {
  const data = useMemo<YieldByStrainDatum[]>(() => getYieldByStrainData(runs), [runs])
  const resolvedEmptyMessage =
    runs.length === 0 ? emptyMessage : 'Not enough valid data to display this chart.'

  return (
    <AnalyticsChartCard
      title="Yield by strain"
      description="Average yield percentage by strain, calculated from the currently selected runs."
      emptyTitle="No strain yield yet"
      emptyMessage={resolvedEmptyMessage}
      hasData={data.length > 0}
      isLoading={isLoading}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 18, left: 12, bottom: 8 }}>
          <CartesianGrid
            stroke={analyticsChartTheme.gridStroke}
            strokeDasharray="3 3"
            horizontal={false}
          />
          <XAxis
            type="number"
            tickFormatter={formatPercent}
            tick={analyticsChartTheme.axisTick}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            width={72}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={analyticsChartTheme.axisTick}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            width={110}
          />
          <Tooltip
            formatter={(value) => (typeof value === 'number' ? formatPercent(value) : value)}
            labelFormatter={(label) => `Strain: ${label}`}
            contentStyle={analyticsChartTheme.tooltipContentStyle}
            labelStyle={analyticsChartTheme.tooltipLabelStyle}
            itemStyle={analyticsChartTheme.tooltipItemStyle}
            cursor={{ fill: 'rgba(148, 163, 184, 0.10)' }}
          />
          <Bar
            dataKey="value"
            name="Average yield"
            fill="#0f766e"
            radius={[0, 12, 12, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </AnalyticsChartCard>
  )
}
