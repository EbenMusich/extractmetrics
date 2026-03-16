import type { ReactNode } from 'react'
import { DashboardStatCard } from './dashboard-stat-card'
import { EmptyState, SectionHeader, SkeletonBlock, dashboardSurfaceClass } from './dashboard-ui'
import { toSafeNumber } from './safe-number'

type SummaryEmptyState = {
  title: string
  description: string
  action?: ReactNode
}

type SummaryMetricsProps = {
  totalRuns: number
  totalCost: number
  yieldPercent: number | null
  costPerGramOutput: number | null
  costPerKgBiomass: number | null
  outputPerKgBiomass: number | null
  solventPerGramOutput: number | null
  outputPerGramSolvent: number | null
  totalOutputWeight: number
  selectionLabel: string
  isLoading?: boolean
  emptyState?: SummaryEmptyState | null
}

type SummaryCard = {
  label: string
  value: string
  unit?: string
}

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

function formatMetricValue(
  value: number | null,
  formatter: (resolvedValue: number) => string,
  unit?: string
) {
  return {
    value: formatter(toSafeNumber(value)),
    unit,
  }
}

export function SummaryMetrics({
  totalRuns,
  totalCost,
  yieldPercent,
  costPerGramOutput,
  costPerKgBiomass,
  outputPerKgBiomass,
  solventPerGramOutput,
  outputPerGramSolvent,
  totalOutputWeight,
  selectionLabel,
  isLoading = false,
  emptyState = null,
}: SummaryMetricsProps) {
  const formattedYield = formatMetricValue(yieldPercent, numberFormatter.format, '%')
  const formattedCostPerGram = formatMetricValue(costPerGramOutput, currencyFormatter.format)
  const formattedCostPerKgBiomass = formatMetricValue(
    costPerKgBiomass,
    currencyFormatter.format,
    '/ kg'
  )
  const formattedOutputPerKgBiomass = formatMetricValue(
    outputPerKgBiomass,
    numberFormatter.format,
    'g/kg'
  )
  const formattedSolventPerGram = formatMetricValue(
    solventPerGramOutput,
    numberFormatter.format,
    'g/g'
  )
  const formattedOutputPerGramSolvent = formatMetricValue(
    outputPerGramSolvent,
    numberFormatter.format,
    'g/g'
  )
  const cards: SummaryCard[] = [
    {
      label: 'Total runs',
      value: numberFormatter.format(toSafeNumber(totalRuns)),
    },
    {
      label: 'Total output',
      value: numberFormatter.format(toSafeNumber(totalOutputWeight)),
      unit: 'g',
    },
    {
      label: 'Total cost',
      value: currencyFormatter.format(toSafeNumber(totalCost)),
    },
    {
      label: 'Yield',
      value: formattedYield.value,
      unit: formattedYield.unit,
    },
    {
      label: 'Cost per g output',
      value: formattedCostPerGram.value,
      unit: formattedCostPerGram.unit,
    },
    {
      label: 'Cost per kg biomass',
      value: formattedCostPerKgBiomass.value,
      unit: formattedCostPerKgBiomass.unit,
    },
    {
      label: 'Output per kg biomass',
      value: formattedOutputPerKgBiomass.value,
      unit: formattedOutputPerKgBiomass.unit,
    },
    {
      label: 'Solvent per g output',
      value: formattedSolventPerGram.value,
      unit: formattedSolventPerGram.unit,
    },
    {
      label: 'Output per g solvent',
      value: formattedOutputPerGramSolvent.value,
      unit: formattedOutputPerGramSolvent.unit,
    },
  ]

  return (
    <section className="space-y-5">
      <SectionHeader
        title="Summary"
        description="Quick stats from your selected extraction runs."
        action={
          isLoading ? (
            <SkeletonBlock className="h-6 w-44 rounded-full" />
          ) : (
            <p className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 shadow-sm">
              {selectionLabel}
            </p>
          )
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {cards.map((card) => (
            <article
              key={card.label}
              className={`${dashboardSurfaceClass} flex min-h-32 flex-col justify-between gap-6 p-4 sm:p-5`}
            >
              <div className="space-y-5">
                <SkeletonBlock className="h-3 w-24 rounded-lg" />
                <div className="flex items-end gap-2">
                  <SkeletonBlock className="h-10 w-24 rounded-xl" />
                  <SkeletonBlock className="h-4 w-10 rounded-lg" />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : emptyState ? (
        <EmptyState
          title={emptyState.title}
          description={emptyState.description}
          action={emptyState.action}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {cards.map((card) => (
            <DashboardStatCard
              key={card.label}
              label={card.label}
              value={card.value}
              unit={card.unit}
            />
          ))}
        </div>
      )}
    </section>
  )
}
