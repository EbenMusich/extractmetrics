import { SectionHeader, dashboardSurfaceClass } from './dashboard-ui'

type SummaryMetricsProps = {
  totalRuns: number
  totalCost: number
  averageYieldPercent: number
  averageCostPerGram: number
  averageCostPerKgBiomass: number
  averageOutputPerKg: number
  totalOutputWeight: number
  selectionLabel: string
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

export function SummaryMetrics({
  totalRuns,
  totalCost,
  averageYieldPercent,
  averageCostPerGram,
  averageCostPerKgBiomass,
  averageOutputPerKg,
  totalOutputWeight,
  selectionLabel,
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
      label: 'Avg Yield',
      value: `${numberFormatter.format(averageYieldPercent)}%`,
      eyebrow: 'Efficiency',
    },
    {
      label: 'Cost / kg biomass',
      value: `${currencyFormatter.format(averageCostPerKgBiomass)} / kg`,
      eyebrow: 'Efficiency',
    },
    {
      label: 'Output / kg biomass',
      value: `${numberFormatter.format(averageOutputPerKg)} g/kg`,
      eyebrow: 'Efficiency',
    },
    {
      label: 'Avg Cost / g',
      value: currencyFormatter.format(averageCostPerGram),
      eyebrow: 'Spend',
    },
  ]

  return (
    <section className="space-y-5">
      <SectionHeader title="Summary" description="Quick stats from your selected extraction runs." />

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
    </section>
  )
}
