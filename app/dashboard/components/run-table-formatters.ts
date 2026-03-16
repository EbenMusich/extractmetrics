import { getCostPerGram, getYieldPercent, type PerformanceMetricRun } from './analytics-metrics'
import { coerceFiniteNumber, toSafeNumber } from './safe-number'

export type RunTableRun = PerformanceMetricRun & {
  id: string
  run_date: string
  created_at?: string
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const numericCellClass =
  'whitespace-nowrap px-4 py-3.5 text-right text-sm tabular-nums text-gray-700 sm:px-5'
export const textCellClass = 'whitespace-nowrap px-4 py-3.5 text-sm text-gray-700 sm:px-5'

export function formatGrams(value: number | null | undefined) {
  return `${toSafeNumber(value).toFixed(1)} g`
}

export function formatGramsPerKg(value: number | null | undefined) {
  return `${toSafeNumber(value).toFixed(1)} g/kg`
}

export function formatPercent(value: number | null | undefined) {
  return `${toSafeNumber(value).toFixed(1)}%`
}

export function formatCurrency(value: number | null | undefined) {
  return currencyFormatter.format(toSafeNumber(value))
}

export function formatDate(value: string) {
  const normalizedValue = value.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedValue)) {
    return normalizedValue
  }

  const parsedDate = new Date(normalizedValue)
  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  const year = parsedDate.getFullYear()
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const day = String(parsedDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatText(value: string | null | undefined) {
  const normalizedValue = value?.trim()
  return normalizedValue ? normalizedValue : 'Unspecified'
}

export function getFormattedYieldPercent(run: RunTableRun) {
  const biomassInputG = coerceFiniteNumber(run.biomass_input_g)
  const outputWeightG = coerceFiniteNumber(run.output_weight_g)

  if (biomassInputG === null || outputWeightG === null) {
    return formatPercent(0)
  }

  return formatPercent(getYieldPercent(outputWeightG, biomassInputG))
}

export function getFormattedCostPerGram(run: RunTableRun) {
  return formatCurrency(getCostPerGram(run))
}
