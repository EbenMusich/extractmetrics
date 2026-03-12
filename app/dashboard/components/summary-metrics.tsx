import { SectionHeader, dashboardSurfaceClass } from './dashboard-ui'

type SummaryMetricsProps = {
  totalRuns: number
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
  averageYieldPercent,
  averageCostPerGram,
  totalOutputWeight,
}: SummaryMetricsProps) {
  const cards = [
    { label: 'Total runs', value: totalRuns.toString() },
    { label: 'Average yield', value: `${numberFormatter.format(averageYieldPercent)}%` },
    { label: 'Average cost / g', value: currencyFormatter.format(averageCostPerGram) },
    { label: 'Total output', value: `${numberFormatter.format(totalOutputWeight)} g` },
  ]

  return (
    <section className="space-y-4">
      <SectionHeader title="Summary" description="Quick stats from your saved extraction runs." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.label}
            className={`${dashboardSurfaceClass} flex min-h-32 flex-col justify-between p-5 sm:p-6`}
          >
            <p className="text-sm font-medium text-gray-600">{card.label}</p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-gray-950">{card.value}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-gray-400">Saved run data</p>
          </article>
        ))}
      </div>
    </section>
  )
}
