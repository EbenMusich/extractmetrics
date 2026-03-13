import { SectionHeader, dashboardSurfaceClass } from './dashboard-ui'

type SummaryMetricsProps = {
  totalRuns: number
  totalCost: number
  averageYieldPercent: number
  averageCostPerGram: number
  totalOutputWeight: number
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
  totalOutputWeight,
}: SummaryMetricsProps) {
  const cards = [
    { label: 'Total runs', value: totalRuns.toString() },
    { label: 'Total cost', value: currencyFormatter.format(totalCost) },
    { label: 'Average yield', value: `${numberFormatter.format(averageYieldPercent)}%` },
    { label: 'Average cost / g', value: currencyFormatter.format(averageCostPerGram) },
    { label: 'Total output', value: `${numberFormatter.format(totalOutputWeight)} g` },
  ]

  return (
    <section className="space-y-5">
      <SectionHeader title="Summary" description="Quick stats from your saved extraction runs." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <article
            key={card.label}
            className={`${dashboardSurfaceClass} flex min-h-36 flex-col justify-between p-5 sm:p-6`}
          >
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-600">{card.label}</p>
              <p className="text-3xl font-semibold tracking-tight text-gray-950">{card.value}</p>
            </div>
            <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
              Saved run data
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
