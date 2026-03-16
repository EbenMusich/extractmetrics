import { EmptyState, SectionHeader, SkeletonBlock, dashboardSurfaceClass } from './dashboard-ui'

type SummaryEmptyState = {
  title: string
  description: string
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
  eyebrow: string
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
  suffix = ''
) {
  if (value === null) {
    return '-'
  }

  return `${formatter(value)}${suffix}`
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
  const cards: SummaryCard[] = [
    {
      label: 'Total runs',
      value: numberFormatter.format(totalRuns),
      eyebrow: 'Volume',
    },
    {
      label: 'Total output',
      value: `${numberFormatter.format(totalOutputWeight)} g`,
      eyebrow: 'Output',
    },
    {
      label: 'Total cost',
      value: currencyFormatter.format(totalCost),
      eyebrow: 'Spend',
    },
    {
      label: 'Yield',
      value: formatMetricValue(yieldPercent, numberFormatter.format, '%'),
      eyebrow: 'Efficiency',
    },
    {
      label: 'Cost per g output',
      value: formatMetricValue(costPerGramOutput, currencyFormatter.format),
      eyebrow: 'Spend',
    },
    {
      label: 'Cost per kg biomass',
      value: formatMetricValue(costPerKgBiomass, currencyFormatter.format, ' / kg'),
      eyebrow: 'Efficiency',
    },
    {
      label: 'Output per kg biomass',
      value: formatMetricValue(outputPerKgBiomass, numberFormatter.format, ' g/kg'),
      eyebrow: 'Efficiency',
    },
    {
      label: 'Solvent per g output',
      value: formatMetricValue(solventPerGramOutput, numberFormatter.format, ' g/g'),
      eyebrow: 'Solvent',
    },
    {
      label: 'Output per g solvent',
      value: formatMetricValue(outputPerGramSolvent, numberFormatter.format, ' g/g'),
      eyebrow: 'Solvent',
    },
  ]

  return (
    <section className="space-y-5">
      <SectionHeader title="Summary" description="Quick stats from your selected extraction runs." />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {cards.map((card) => (
            <article
              key={card.label}
              className={`${dashboardSurfaceClass} flex min-h-40 flex-col justify-between gap-6 p-5 sm:p-6`}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <SkeletonBlock className="h-3 w-16 rounded-lg" />
                  <SkeletonBlock className="h-4 w-28 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <SkeletonBlock className="h-10 w-32 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <SkeletonBlock className="h-3 w-24 rounded-lg" />
                <SkeletonBlock className="h-3 w-full rounded-lg" />
              </div>
            </article>
          ))}
        </div>
      ) : emptyState ? (
        <EmptyState title={emptyState.title} description={emptyState.description} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {cards.map((card) => (
            <article
              key={card.label}
              className={`${dashboardSurfaceClass} flex min-h-40 flex-col justify-between gap-6 p-5 sm:p-6`}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                    {card.eyebrow}
                  </p>
                  <p className="text-sm font-medium text-gray-600">{card.label}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-[2rem]">
                    {card.value}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                  Filters applied
                </p>
                <p className="text-xs text-gray-500">{selectionLabel}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
