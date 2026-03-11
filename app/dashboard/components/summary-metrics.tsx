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
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold">Summary</h2>
        <p className="text-sm text-gray-600">Quick stats from your saved extraction runs.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-600">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
