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

type CostTrendChartProps = {
  runs: RunTableRun[]
  emptyMessage: string
  isLoading?: boolean
}

type CostTrendPoint = {
  date: string
  value: number
}

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
  const data = useMemo<CostTrendPoint[]>(() => {
    return [...runs]
      .sort(sortRunsByDate)
      .map((run) => {
        const costPerGram = getCostPerGram(run)

        if (costPerGram === null) {
          return null
        }

        return {
          date: formatDate(run.run_date),
          value: Number(costPerGram.toFixed(2)),
        }
      })
      .filter((point): point is CostTrendPoint => point !== null)
  }, [runs])

  return (
    <AnalyticsChartCard
      title="Cost per g output trend"
      description="Cost per gram of output across the selected runs, using the same run set as the yield chart."
      emptyTitle="No cost trend yet"
      emptyMessage={runs.length === 0 ? emptyMessage : 'Not enough valid data to display this chart.'}
      hasData={data.length > 0}
      isLoading={isLoading}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 18, left: 4, bottom: 0 }}>
          <CartesianGrid
            stroke={analyticsChartTheme.gridStroke}
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatAxisDate}
            tick={analyticsChartTheme.axisTick}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={24}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
            tick={analyticsChartTheme.axisTick}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
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
            cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            name="Cost per g output"
            stroke="#0f766e"
            strokeWidth={2.5}
            dot={{ r: 3.5, strokeWidth: 2, fill: '#ffffff' }}
            activeDot={{ r: 5, fill: '#0f766e', stroke: '#ffffff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </AnalyticsChartCard>
  )
}
