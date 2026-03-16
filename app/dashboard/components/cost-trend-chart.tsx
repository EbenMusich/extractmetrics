'use client'

import { useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getCostPerGram } from './analytics-metrics'
import { AnalyticsChartCard, analyticsChartTheme } from './analytics-chart-card'
import { formatCurrency, formatDate, type RunTableRun } from './run-table-formatters'
import { roundNumber } from './safe-number'

type CostTrendChartProps = {
  runs?: RunTableRun[]
  emptyMessage: string
  isLoading?: boolean
}

type CostTrendPoint = {
  date: string
  value: number
}

const EMPTY_RUNS: RunTableRun[] = []

function sortRunsByDate(left: RunTableRun, right: RunTableRun) {
  return left.run_date.localeCompare(right.run_date)
}

function formatAxisDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) {
    return value
  }

  return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`
}

export function CostTrendChart({
  runs,
  emptyMessage,
  isLoading = false,
}: CostTrendChartProps) {
  const safeRuns = runs ?? EMPTY_RUNS
  const data = useMemo<CostTrendPoint[]>(() => {
    return [...safeRuns]
      .sort(sortRunsByDate)
      .map((run) => {
        const costPerGram = getCostPerGram(run)

        if (costPerGram === null) {
          return null
        }

        return {
          date: formatDate(run.run_date),
          value: roundNumber(costPerGram, 2),
        }
      })
      .filter((point): point is CostTrendPoint => point !== null)
  }, [safeRuns])

  return (
    <AnalyticsChartCard
      title="Cost per g output trend"
      description="Cost per gram of output across the selected runs, using the same run set as the yield chart."
      emptyTitle="No cost trend yet"
      emptyMessage={safeRuns.length === 0 ? emptyMessage : 'Not enough valid data to display this chart.'}
      hasData={data.length > 0}
      isLoading={isLoading}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={analyticsChartTheme.chartMargin}>
          <CartesianGrid
            stroke={analyticsChartTheme.gridStroke}
            strokeDasharray={analyticsChartTheme.gridDasharray}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatAxisDate}
            tick={analyticsChartTheme.axisTick}
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            minTickGap={24}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
            tick={analyticsChartTheme.axisTick}
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            width={80}
          />
          <Tooltip
            formatter={(value) =>
              typeof value === 'number' ? `${formatCurrency(value)} / g` : value
            }
            labelFormatter={(label) => `Run date: ${label}`}
            contentStyle={analyticsChartTheme.tooltipContentStyle}
            labelStyle={analyticsChartTheme.tooltipLabelStyle}
            itemStyle={analyticsChartTheme.tooltipItemStyle}
            wrapperStyle={analyticsChartTheme.tooltipWrapperStyle}
            cursor={{ stroke: analyticsChartTheme.cursorStroke, strokeDasharray: analyticsChartTheme.gridDasharray }}
          />
          <Line
            type="monotone"
            dataKey="value"
            name="Cost per g output"
            stroke="#0f766e"
            strokeWidth={analyticsChartTheme.lineStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={{ r: 3, strokeWidth: 2, fill: '#ffffff' }}
            activeDot={{ r: 5, fill: '#0f766e', stroke: '#ffffff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </AnalyticsChartCard>
  )
}
