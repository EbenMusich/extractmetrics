export type PerformanceMetricRun = {
  strain_name?: string | null
  grower_name?: string | null
  output_type?: string | null
  biomass_input_g?: number | null
  output_weight_g?: number | null
  solvent_used_g?: number | null
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
  averageCostPerKgBiomass: number | null
  averageOutputPerKg: number | null
}

export type CostBreakdownDatum = {
  name: string
  value: number
}

export type YieldByStrainDatum = {
  name: string
  value: number
}

export type DashboardSummaryMetrics = {
  totalRuns: number
  totalOutputWeightG: number
  totalCost: number
  yieldPercent: number | null
  costPerGramOutput: number | null
  costPerKgBiomass: number | null
  outputPerKgBiomass: number | null
  solventPerGramOutput: number | null
  outputPerGramSolvent: number | null
}

type MutableAggregatedPerformanceMetric = {
  label: string
  runCount: number
  totalOutputG: number
  yieldSum: number
  yieldCount: number
  costPerGramSum: number
  costPerGramCount: number
  costPerKgBiomassSum: number
  costPerKgBiomassCount: number
  outputPerKgSum: number
  outputPerKgCount: number
}

function coerceNumber(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function divideSafely(numerator: number, denominator: number) {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) {
    return null
  }

  return numerator / denominator
}

function getMetricLabel(value: string | null | undefined) {
  const normalizedValue = value?.trim()
  return normalizedValue ? normalizedValue : 'Unspecified'
}

function getStrainChartLabel(value: string | null | undefined) {
  const normalizedValue = value?.trim()
  return normalizedValue ? normalizedValue : 'Unknown'
}

function getBiomassInputKg(run: PerformanceMetricRun) {
  const biomassInputG = coerceNumber(run.biomass_input_g)

  if (biomassInputG === null || biomassInputG <= 0) {
    return null
  }

  return biomassInputG / 1000
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

export function getYieldPercent(outputWeightG: number, biomassInputG: number) {
  if (biomassInputG <= 0) {
    return 0
  }

  return (outputWeightG / biomassInputG) * 100
}

export function getRunYieldPercent(run: PerformanceMetricRun) {
  const biomassInputG = coerceNumber(run.biomass_input_g)
  const outputWeightG = coerceNumber(run.output_weight_g)

  if (biomassInputG === null || biomassInputG <= 0 || outputWeightG === null) {
    return null
  }

  return getYieldPercent(outputWeightG, biomassInputG)
}

export function getCostPerGram(run: PerformanceMetricRun) {
  const outputWeightG = coerceNumber(run.output_weight_g)

  if (outputWeightG === null || outputWeightG <= 0) {
    return null
  }

  return divideSafely(getTotalCost(run), outputWeightG)
}

export function getCostPerKgBiomass(run: PerformanceMetricRun) {
  const biomassInputKg = getBiomassInputKg(run)

  if (biomassInputKg === null) {
    return null
  }

  return divideSafely(getTotalCost(run), biomassInputKg)
}

export function getOutputPerKgBiomass(run: PerformanceMetricRun) {
  const biomassInputKg = getBiomassInputKg(run)
  const outputWeightG = coerceNumber(run.output_weight_g)

  if (biomassInputKg === null || outputWeightG === null) {
    return null
  }

  return divideSafely(outputWeightG, biomassInputKg)
}

export function getSolventPerGramOutput(run: PerformanceMetricRun) {
  const solventUsedG = coerceNumber(run.solvent_used_g)
  const outputWeightG = coerceNumber(run.output_weight_g)

  if (solventUsedG === null || solventUsedG < 0 || outputWeightG === null || outputWeightG <= 0) {
    return null
  }

  return divideSafely(solventUsedG, outputWeightG)
}

export function getOutputPerGramSolvent(run: PerformanceMetricRun) {
  const solventUsedG = coerceNumber(run.solvent_used_g)
  const outputWeightG = coerceNumber(run.output_weight_g)

  if (solventUsedG === null || solventUsedG <= 0 || outputWeightG === null || outputWeightG < 0) {
    return null
  }

  return divideSafely(outputWeightG, solventUsedG)
}

export function getTotalCost(run: PerformanceMetricRun) {
  return (
    getLaborCost(run) +
    (coerceNumber(run.material_cost) ?? 0) +
    (coerceNumber(run.utility_cost) ?? 0) +
    (coerceNumber(run.other_cost) ?? 0)
  )
}

export function getCostBreakdownData(runs: PerformanceMetricRun[]): CostBreakdownDatum[] {
  const totals = runs.reduce(
    (aggregate, run) => {
      aggregate.material += coerceNumber(run.material_cost) ?? 0
      aggregate.labor += coerceNumber(run.labor_cost) ?? 0
      aggregate.utility += coerceNumber(run.utility_cost) ?? 0
      aggregate.other += coerceNumber(run.other_cost) ?? 0
      return aggregate
    },
    {
      material: 0,
      labor: 0,
      utility: 0,
      other: 0,
    }
  )

  return [
    { name: 'Material', value: Number(totals.material.toFixed(2)) },
    { name: 'Labor', value: Number(totals.labor.toFixed(2)) },
    { name: 'Utility', value: Number(totals.utility.toFixed(2)) },
    { name: 'Other', value: Number(totals.other.toFixed(2)) },
  ]
}

export function getYieldByStrainData(
  runs: PerformanceMetricRun[],
  limit = 8
): YieldByStrainDatum[] {
  const aggregateMap = new Map<
    string,
    {
      name: string
      totalOutputG: number
      totalBiomassG: number
    }
  >()

  for (const run of runs) {
    const biomassInputG = coerceNumber(run.biomass_input_g)
    const outputWeightG = coerceNumber(run.output_weight_g)

    if (biomassInputG === null || biomassInputG <= 0 || outputWeightG === null || outputWeightG < 0) {
      continue
    }

    const name = getStrainChartLabel(run.strain_name)
    const existingAggregate = aggregateMap.get(name)
    const aggregate =
      existingAggregate ??
      {
        name,
        totalOutputG: 0,
        totalBiomassG: 0,
      }

    aggregate.totalOutputG += outputWeightG
    aggregate.totalBiomassG += biomassInputG

    aggregateMap.set(name, aggregate)
  }

  return Array.from(aggregateMap.values())
    .sort((left, right) => {
      const leftYield = getYieldPercent(left.totalOutputG, left.totalBiomassG)
      const rightYield = getYieldPercent(right.totalOutputG, right.totalBiomassG)

      if (rightYield !== leftYield) {
        return rightYield - leftYield
      }

      if (right.totalBiomassG !== left.totalBiomassG) {
        return right.totalBiomassG - left.totalBiomassG
      }

      return left.name.localeCompare(right.name)
    })
    .slice(0, limit)
    .map(({ name, totalOutputG, totalBiomassG }) => ({
      name,
      value: Number(getYieldPercent(totalOutputG, totalBiomassG).toFixed(2)),
    }))
}

export function getDashboardSummaryMetrics(runs: PerformanceMetricRun[]): DashboardSummaryMetrics {
  const totals = runs.reduce(
    (aggregate, run) => {
      const biomassInputG = coerceNumber(run.biomass_input_g)
      const outputWeightG = coerceNumber(run.output_weight_g)
      const solventUsedG = coerceNumber(run.solvent_used_g)

      aggregate.totalCost += getTotalCost(run)

      if (outputWeightG !== null && outputWeightG >= 0) {
        aggregate.totalOutputWeightG += outputWeightG
      }

      if (biomassInputG !== null && biomassInputG > 0) {
        aggregate.totalBiomassInputG += biomassInputG
      }

      if (solventUsedG !== null && solventUsedG >= 0) {
        aggregate.totalSolventUsedG += solventUsedG
      }

      return aggregate
    },
    {
      totalCost: 0,
      totalOutputWeightG: 0,
      totalBiomassInputG: 0,
      totalSolventUsedG: 0,
    }
  )

  const totalBiomassInputKg = divideSafely(totals.totalBiomassInputG, 1000)

  return {
    totalRuns: runs.length,
    totalOutputWeightG: Number(totals.totalOutputWeightG.toFixed(2)),
    totalCost: Number(totals.totalCost.toFixed(2)),
    yieldPercent: divideSafely(totals.totalOutputWeightG * 100, totals.totalBiomassInputG),
    costPerGramOutput: divideSafely(totals.totalCost, totals.totalOutputWeightG),
    costPerKgBiomass:
      totalBiomassInputKg === null ? null : divideSafely(totals.totalCost, totalBiomassInputKg),
    outputPerKgBiomass:
      totalBiomassInputKg === null
        ? null
        : divideSafely(totals.totalOutputWeightG, totalBiomassInputKg),
    solventPerGramOutput: divideSafely(totals.totalSolventUsedG, totals.totalOutputWeightG),
    outputPerGramSolvent: divideSafely(totals.totalOutputWeightG, totals.totalSolventUsedG),
  }
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
        costPerKgBiomassSum: 0,
        costPerKgBiomassCount: 0,
        outputPerKgSum: 0,
        outputPerKgCount: 0,
      }

    aggregate.runCount += 1
    aggregate.totalOutputG += coerceNumber(run.output_weight_g) ?? 0

    const yieldPercent = getRunYieldPercent(run)
    if (yieldPercent !== null) {
      aggregate.yieldSum += yieldPercent
      aggregate.yieldCount += 1
    }

    const costPerGram = getCostPerGram(run)
    if (costPerGram !== null) {
      aggregate.costPerGramSum += costPerGram
      aggregate.costPerGramCount += 1
    }

    const costPerKgBiomass = getCostPerKgBiomass(run)
    if (costPerKgBiomass !== null) {
      aggregate.costPerKgBiomassSum += costPerKgBiomass
      aggregate.costPerKgBiomassCount += 1
    }

    const outputPerKg = getOutputPerKgBiomass(run)
    if (outputPerKg !== null) {
      aggregate.outputPerKgSum += outputPerKg
      aggregate.outputPerKgCount += 1
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
      averageCostPerKgBiomass:
        aggregate.costPerKgBiomassCount > 0
          ? aggregate.costPerKgBiomassSum / aggregate.costPerKgBiomassCount
          : null,
      averageOutputPerKg:
        aggregate.outputPerKgCount > 0 ? aggregate.outputPerKgSum / aggregate.outputPerKgCount : null,
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
