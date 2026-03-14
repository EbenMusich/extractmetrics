import { SectionHeader, dashboardSurfaceClass } from './dashboard-ui'

type SummaryMetricsProps = {
  totalRuns: number
  totalCost: number
  averageYieldPercent: number
  averageCostPerGram: number
  averageCostPerKgBiomass: number
  averageOutputPerKg: number
  totalOutputWeight: number
}

type SummaryCard = {
  label: string
  value: string
  helper?: string
  eyebrow: string
  tone?: 'default' | 'positive' | 'caution' | 'info'
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
}: SummaryMetricsProps) {
  const cards: SummaryCard[] = [
    {
      label: 'Total runs',
      value: totalRuns.toString(),
      helper: 'Saved extraction runs',
      eyebrow: 'Volume',
    },
    {
      label: 'Total output',
      value: `${numberFormatter.format(totalOutputWeight)} g`,
      helper: 'Across selected runs',
      eyebrow: 'Output',
    },
    {
      label: 'Total cost',
      value: currencyFormatter.format(totalCost),
      helper: 'Combined operating spend',
      eyebrow: 'Spend',
    },
    {
      label: 'Avg Yield',
      value: `${numberFormatter.format(averageYieldPercent)}%`,
      helper: 'Extraction efficiency',
      eyebrow: 'Efficiency',
      tone: 'positive',
    },
    {
      label: 'Cost / kg biomass',
      value: `${currencyFormatter.format(averageCostPerKgBiomass)} / kg`,
      helper: 'Processing efficiency',
      eyebrow: 'Efficiency',
      tone: 'info',
    },
    {
      label: 'Output / kg biomass',
      value: `${numberFormatter.format(averageOutputPerKg)} g/kg`,
      helper: 'Higher is better',
      eyebrow: 'Efficiency',
      tone: 'positive',
    },
    {
      label: 'Avg Cost / g',
      value: currencyFormatter.format(averageCostPerGram),
      helper: 'Lower is better',
      eyebrow: 'Spend',
      tone: 'caution',
    },
  ]

  function getToneClass(tone: SummaryCard['tone']) {
    switch (tone) {
      case 'positive':
        return 'text-emerald-700'
      case 'caution':
        return 'text-amber-700'
      case 'info':
        return 'text-sky-700'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <section className="space-y-5">
      <SectionHeader title="Summary" description="Quick stats from your saved extraction runs." />

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
                {card.helper ? (
                  <p className={`text-sm ${getToneClass(card.tone)}`}>{card.helper}</p>
                ) : null}
              </div>
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
              Selected date range
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
