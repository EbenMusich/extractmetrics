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
import { getRunYieldPercent } from './analytics-metrics'
import { AnalyticsChartCard, analyticsChartTheme } from './analytics-chart-card'
import { formatDate, type RunTableRun } from './run-table-formatters'
import { roundNumber } from './safe-number'

type YieldTrendChartProps = {
  runs?: RunTableRun[]
  emptyMessage: string
  isLoading?: boolean
}

type YieldTrendPoint = {
  date: string
  value: number
}

const EMPTY_RUNS: RunTableRun[] = []

const percentFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

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

function formatPercent(value: number) {
  return `${percentFormatter.format(value)}%`
}

export function YieldTrendChart({
  runs,
  emptyMessage,
  isLoading = false,
}: YieldTrendChartProps) {
  const safeRuns = runs ?? EMPTY_RUNS
  const data = useMemo<YieldTrendPoint[]>(() => {
    return [...safeRuns]
      .sort(sortRunsByDate)
      .map((run) => {
        const yieldPercent = getRunYieldPercent(run)

        if (yieldPercent === null) {
          return null
        }

        return {
          date: formatDate(run.run_date),
          value: roundNumber(yieldPercent, 2),
        }
      })
      .filter((point): point is YieldTrendPoint => point !== null)
  }, [safeRuns])

  return (
    <AnalyticsChartCard
      title="Yield trend"
      description="Yield percentage across the selected runs, ordered by run date."
      emptyTitle="No yield trend yet"
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
            tickFormatter={formatPercent}
            tick={analyticsChartTheme.axisTick}
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            width={64}
          />
          <Tooltip
            formatter={(value) => (typeof value === 'number' ? formatPercent(value) : value)}
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
            name="Yield"
            stroke="#4f46e5"
            strokeWidth={analyticsChartTheme.lineStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={{ r: 3, strokeWidth: 2, fill: '#ffffff' }}
            activeDot={{ r: 5, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </AnalyticsChartCard>
  )
}
