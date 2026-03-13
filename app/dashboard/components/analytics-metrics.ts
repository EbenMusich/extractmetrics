export type PerformanceMetricRun = {
  strain_name?: string | null
  grower_name?: string | null
  output_type?: string | null
  biomass_input_g?: number | null
  output_weight_g?: number | null
  labor_minutes?: number | null
  labor_rate?: number | null
  labor_cost?: number | null
  material_cost?: number | null
  utility_cost?: number | null
  other_cost?: number | null
}

export type PerformanceMetricGroupKey = 'strain_name' | 'grower_name' | 'output_type'

export type AggregatedPerformanceMetric = {
  label: string
  runCount: number
  totalOutputG: number
  averageYieldPercent: number | null
  averageCostPerGram: number | null
}

type MutableAggregatedPerformanceMetric = {
  label: string
  runCount: number
  totalOutputG: number
  yieldSum: number
  yieldCount: number
  costPerGramSum: number
  costPerGramCount: number
}

function coerceNumber(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function getMetricLabel(value: string | null | undefined) {
  const normalizedValue = value?.trim()
  return normalizedValue ? normalizedValue : 'Unspecified'
}

export function getLaborCost(run: PerformanceMetricRun) {
  const laborCost = coerceNumber(run.labor_cost)
  if (laborCost !== null) {
    return laborCost
  }

  const laborMinutes = coerceNumber(run.labor_minutes)
  const laborRate = coerceNumber(run.labor_rate)

  if (laborMinutes === null || laborRate === null) {
    return 0
  }

  return (laborMinutes / 60) * laborRate
}

export function getYieldPercent(run: PerformanceMetricRun) {
  const biomassInputG = coerceNumber(run.biomass_input_g)
  const outputWeightG = coerceNumber(run.output_weight_g)

  if (biomassInputG === null || biomassInputG <= 0 || outputWeightG === null) {
    return null
  }

  return (outputWeightG / biomassInputG) * 100
}

export function getCostPerGram(run: PerformanceMetricRun) {
  const outputWeightG = coerceNumber(run.output_weight_g)

  if (outputWeightG === null || outputWeightG <= 0) {
    return null
  }

  return getTotalCost(run) / outputWeightG
}

export function getTotalCost(run: PerformanceMetricRun) {
  return (
    getLaborCost(run) +
    (coerceNumber(run.material_cost) ?? 0) +
    (coerceNumber(run.utility_cost) ?? 0) +
    (coerceNumber(run.other_cost) ?? 0)
  )
}

export function aggregatePerformanceMetrics(
  runs: PerformanceMetricRun[],
  groupKey: PerformanceMetricGroupKey
) {
  const aggregateMap = new Map<string, MutableAggregatedPerformanceMetric>()

  for (const run of runs) {
    const label = getMetricLabel(run[groupKey])
    const existingAggregate = aggregateMap.get(label)
    const aggregate =
      existingAggregate ??
      {
        label,
        runCount: 0,
        totalOutputG: 0,
        yieldSum: 0,
        yieldCount: 0,
        costPerGramSum: 0,
        costPerGramCount: 0,
      }

    aggregate.runCount += 1
    aggregate.totalOutputG += coerceNumber(run.output_weight_g) ?? 0

    const yieldPercent = getYieldPercent(run)
    if (yieldPercent !== null) {
      aggregate.yieldSum += yieldPercent
      aggregate.yieldCount += 1
    }

    const costPerGram = getCostPerGram(run)
    if (costPerGram !== null) {
      aggregate.costPerGramSum += costPerGram
      aggregate.costPerGramCount += 1
    }

    aggregateMap.set(label, aggregate)
  }

  return Array.from(aggregateMap.values())
    .map((aggregate): AggregatedPerformanceMetric => ({
      label: aggregate.label,
      runCount: aggregate.runCount,
      totalOutputG: aggregate.totalOutputG,
      averageYieldPercent:
        aggregate.yieldCount > 0 ? aggregate.yieldSum / aggregate.yieldCount : null,
      averageCostPerGram:
        aggregate.costPerGramCount > 0
          ? aggregate.costPerGramSum / aggregate.costPerGramCount
          : null,
    }))
    .sort((left, right) => {
      if (right.totalOutputG !== left.totalOutputG) {
        return right.totalOutputG - left.totalOutputG
      }

      if (right.runCount !== left.runCount) {
        return right.runCount - left.runCount
      }

      return left.label.localeCompare(right.label)
    })
}
