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
import { getCostBreakdownData, type CostBreakdownDatum } from './analytics-metrics'
import { AnalyticsChartCard, analyticsChartTheme } from './analytics-chart-card'
import { formatCurrency, type RunTableRun } from './run-table-formatters'

type CostBreakdownChartProps = {
  runs: RunTableRun[]
  emptyMessage: string
  isLoading?: boolean
}

export function CostBreakdownChart({
  runs,
  emptyMessage,
  isLoading = false,
}: CostBreakdownChartProps) {
  const data = useMemo<CostBreakdownDatum[]>(() => getCostBreakdownData(runs), [runs])
  const hasData = runs.length > 0 && data.some((bucket) => bucket.value > 0)
  const resolvedEmptyMessage =
    runs.length === 0 ? emptyMessage : 'Not enough valid data to display this chart.'

  return (
    <AnalyticsChartCard
      title="Cost breakdown"
      description="Total material, labor, utility, and other costs across the selected runs."
      emptyTitle="No cost breakdown yet"
      emptyMessage={resolvedEmptyMessage}
      hasData={hasData}
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
            dataKey="name"
            tick={analyticsChartTheme.axisTick}
            tickLine={false}
            axisLine={false}
            tickMargin={12}
          />
          <YAxis
            tickFormatter={formatCurrency}
            tick={analyticsChartTheme.axisTick}
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            width={86}
          />
          <Tooltip
            formatter={(value) => (typeof value === 'number' ? formatCurrency(value) : value)}
            labelFormatter={(label) => `${label} cost`}
            contentStyle={analyticsChartTheme.tooltipContentStyle}
            labelStyle={analyticsChartTheme.tooltipLabelStyle}
            itemStyle={analyticsChartTheme.tooltipItemStyle}
            wrapperStyle={analyticsChartTheme.tooltipWrapperStyle}
            cursor={{ fill: analyticsChartTheme.cursorFill }}
          />
          <Bar
            dataKey="value"
            name="Total cost"
            fill="#7c3aed"
            radius={[10, 10, 0, 0]}
            maxBarSize={56}
          />
        </BarChart>
      </ResponsiveContainer>
    </AnalyticsChartCard>
  )
}
