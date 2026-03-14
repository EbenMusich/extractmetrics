import { NextResponse } from 'next/server'
import {
  getCostPerGram,
  getCostPerKgBiomass,
  getOutputPerKgBiomass,
  getRunYieldPercent,
  getTotalCost,
  type PerformanceMetricRun,
} from '@/app/dashboard/components/analytics-metrics'
import { filterRunsBySearchTerm, normalizeRunHistorySearchTerm } from '@/app/dashboard/components/run-history-filter'
import { formatDate } from '@/app/dashboard/components/run-table-formatters'
import { createClient } from '@/lib/supabase/server'

type ExportRun = PerformanceMetricRun & {
  run_date: string
  notes?: string | null
  created_at?: string | null
}

const CSV_HEADERS = [
  'Run Date',
  'Strain',
  'Grower',
  'Output Type',
  'Biomass Input (g)',
  'Output (g)',
  'Yield %',
  'Labor Minutes',
  'Labor Rate',
  'Labor Cost',
  'Material Cost',
  'Utility Cost',
  'Other Cost',
  'Total Cost',
  'Cost / g',
  'Cost / kg Biomass',
  'Output / kg Biomass',
  'Notes',
]

function coerceNumber(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function formatOptionalText(value: string | null | undefined) {
  return value?.trim() ?? ''
}

function formatNumber(value: number | null | undefined, fractionDigits: number) {
  const normalizedValue = coerceNumber(value)
  return normalizedValue === null ? '' : normalizedValue.toFixed(fractionDigits)
}

function escapeCsvCell(value: string) {
  if (value.includes('"') || value.includes(',') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replaceAll('"', '""')}"`
  }

  return value
}

function buildCsvRow(values: string[]) {
  return values.map(escapeCsvCell).join(',')
}

function buildCsv(run: ExportRun[]) {
  const headerRow = buildCsvRow(CSV_HEADERS)
  const dataRows = run.map((item) => {
    const yieldPercent = getRunYieldPercent(item)
    const costPerGram = getCostPerGram(item)
    const costPerKgBiomass = getCostPerKgBiomass(item)
    const outputPerKgBiomass = getOutputPerKgBiomass(item)
    const totalCost = getTotalCost(item)

    return buildCsvRow([
      formatDate(item.run_date),
      formatOptionalText(item.strain_name),
      formatOptionalText(item.grower_name),
      formatOptionalText(item.output_type),
      formatNumber(item.biomass_input_g, 1),
      formatNumber(item.output_weight_g, 1),
      formatNumber(yieldPercent, 1),
      formatNumber(item.labor_minutes, 0),
      formatNumber(item.labor_rate, 2),
      formatNumber(item.labor_cost, 2),
      formatNumber(item.material_cost, 2),
      formatNumber(item.utility_cost, 2),
      formatNumber(item.other_cost, 2),
      formatNumber(totalCost, 2),
      formatNumber(costPerGram, 2),
      formatNumber(costPerKgBiomass, 2),
      formatNumber(outputPerKgBiomass, 1),
      formatOptionalText(item.notes),
    ])
  })

  return [headerRow, ...dataRows].join('\r\n')
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return new NextResponse(authError?.message ?? 'Unauthorized', { status: 401 })
  }

  const requestUrl = new URL(request.url)
  const searchTerm = requestUrl.searchParams.get('search')
  const normalizedSearchTerm = normalizeRunHistorySearchTerm(searchTerm)

  const { data, error } = await supabase
    .from('runs')
    .select(
      'run_date, strain_name, grower_name, output_type, biomass_input_g, output_weight_g, labor_minutes, labor_rate, labor_cost, material_cost, utility_cost, other_cost, notes, created_at'
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return new NextResponse(`Unable to export runs: ${error.message}`, { status: 500 })
  }

  const runs = filterRunsBySearchTerm<ExportRun>(data ?? [], normalizedSearchTerm)
  const filename = normalizedSearchTerm
    ? 'extractmetrics-runs-filtered.csv'
    : 'extractmetrics-runs.csv'

  return new NextResponse(buildCsv(runs), {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
