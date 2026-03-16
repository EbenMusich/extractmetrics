'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { deleteRunAction } from '@/app/dashboard/actions'
import { getCostPerGram, getRunYieldPercent } from './analytics-metrics'
import { filterRunsBySearchTerm } from './run-history-filter'
import {
  EmptyState,
  SectionHeader,
  destructiveButtonClass,
  inputClass,
  secondaryButtonClass,
  tableClass,
  tableHeadClass,
  tableRowClass,
  tableWrapperClass,
} from './dashboard-ui'
import {
  formatDate,
  formatGrams,
  formatText,
  getFormattedCostPerGram,
  getFormattedYieldPercent,
  numericCellClass,
  textCellClass,
  type RunTableRun,
} from './run-table-formatters'

type RunHistoryTableProps = {
  runs: RunTableRun[]
}

const RUNS_PER_PAGE = 25

type SortKey =
  | 'run_date'
  | 'strain_name'
  | 'grower_name'
  | 'output_type'
  | 'biomass_input_g'
  | 'output_weight_g'
  | 'yield_percent'
  | 'cost_per_g'

type SortDirection = 'asc' | 'desc'

type SortState = {
  key: SortKey
  direction: SortDirection
}

const defaultSortState: SortState = {
  key: 'run_date',
  direction: 'desc',
}

const sortLabels: Record<SortKey, string> = {
  run_date: 'run date',
  strain_name: 'strain',
  grower_name: 'grower',
  output_type: 'output type',
  biomass_input_g: 'biomass input',
  output_weight_g: 'output weight',
  yield_percent: 'yield',
  cost_per_g: 'cost per g',
}

function compareOptionalNumbers(left: number | null | undefined, right: number | null | undefined) {
  const leftValue = typeof left === 'number' && Number.isFinite(left) ? left : null
  const rightValue = typeof right === 'number' && Number.isFinite(right) ? right : null

  if (leftValue === null && rightValue === null) {
    return 0
  }
  if (leftValue === null) {
    return 1
  }
  if (rightValue === null) {
    return -1
  }

  return leftValue - rightValue
}

function compareText(left: string | null | undefined, right: string | null | undefined) {
  return (left?.trim() ?? '').localeCompare(right?.trim() ?? '', undefined, { sensitivity: 'base' })
}

function sortRuns(runs: RunTableRun[], sortState: SortState) {
  return [...runs].sort((left, right) => {
    let comparison = 0

    switch (sortState.key) {
      case 'run_date':
        comparison = left.run_date.localeCompare(right.run_date)
        break
      case 'strain_name':
        comparison = compareText(left.strain_name, right.strain_name)
        break
      case 'grower_name':
        comparison = compareText(left.grower_name, right.grower_name)
        break
      case 'output_type':
        comparison = compareText(left.output_type, right.output_type)
        break
      case 'biomass_input_g':
        comparison = compareOptionalNumbers(left.biomass_input_g, right.biomass_input_g)
        break
      case 'output_weight_g':
        comparison = compareOptionalNumbers(left.output_weight_g, right.output_weight_g)
        break
      case 'yield_percent':
        comparison = compareOptionalNumbers(getRunYieldPercent(left), getRunYieldPercent(right))
        break
      case 'cost_per_g':
        comparison = compareOptionalNumbers(getCostPerGram(left), getCostPerGram(right))
        break
    }

    if (comparison === 0) {
      comparison = right.run_date.localeCompare(left.run_date)
    }

    return sortState.direction === 'asc' ? comparison : -comparison
  })
}

function getSortIndicator(isActive: boolean, direction: SortDirection) {
  if (!isActive) {
    return '↕'
  }

  return direction === 'asc' ? '↑' : '↓'
}

function getNextSortState(currentSort: SortState, key: SortKey): SortState {
  if (currentSort.key === key) {
    return {
      key,
      direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
    }
  }

  return {
    key,
    direction:
      key === 'strain_name' || key === 'grower_name' || key === 'output_type' ? 'asc' : 'desc',
  }
}

function DeleteRunButton({ onClick }: { onClick: () => void }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={`${destructiveButtonClass} px-3 py-1.5 text-sm`}
    >
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  )
}

function DeleteRunForm({ runId }: { runId: string }) {
  const formRef = useRef<HTMLFormElement>(null)

  function handleDeleteClick() {
    if (!window.confirm('Delete this run? This cannot be undone.')) {
      return
    }

    formRef.current?.requestSubmit()
  }

  return (
    <form ref={formRef} action={deleteRunAction}>
      <input type="hidden" name="run_id" value={runId} />
      <DeleteRunButton onClick={handleDeleteClick} />
    </form>
  )
}

export function RunHistoryTable({ runs }: RunHistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortState, setSortState] = useState<SortState>(defaultSortState)

  const filteredRuns = useMemo(() => filterRunsBySearchTerm(runs, searchTerm), [runs, searchTerm])
  const sortedRuns = useMemo(() => sortRuns(filteredRuns, sortState), [filteredRuns, sortState])
  const exportHref = useMemo(() => {
    const params = new URLSearchParams()
    const normalizedSearchTerm = searchTerm.trim()

    if (normalizedSearchTerm) {
      params.set('search', normalizedSearchTerm)
    }

    const queryString = params.toString()
    return queryString ? `/dashboard/runs/export?${queryString}` : '/dashboard/runs/export'
  }, [searchTerm])

  const totalPages = Math.max(1, Math.ceil(sortedRuns.length / RUNS_PER_PAGE))
  const visiblePage = Math.min(currentPage, totalPages)
  const startIndex = (visiblePage - 1) * RUNS_PER_PAGE
  const visibleRuns = sortedRuns.slice(startIndex, startIndex + RUNS_PER_PAGE)
  const hasRuns = runs.length > 0
  const hasFilteredRuns = filteredRuns.length > 0
  const sortSummary = `${sortState.direction === 'asc' ? 'Ascending' : 'Descending'} by ${sortLabels[sortState.key]}`

  return (
    <section className="space-y-5">
      <SectionHeader
        title="All runs"
        description="Browse your full extraction history with search, pagination, and filtered export."
        action={
          <a
            href={filteredRuns.length > 0 ? exportHref : undefined}
            className={`${secondaryButtonClass} aria-disabled:pointer-events-none aria-disabled:opacity-50`}
            aria-disabled={filteredRuns.length === 0}
          >
            Export CSV
          </a>
        }
      />

      <div className={tableWrapperClass}>
        <div className="border-b border-gray-200 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <label className="flex w-full max-w-xl flex-col gap-1 text-sm text-gray-600">
              <span className="font-medium text-gray-700">Search runs</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search strain, grower, or output type"
                className={inputClass}
              />
              <span className="text-xs text-gray-500">
                Matches strain, grower, and output type across your saved runs.
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm text-gray-500">{sortSummary}</p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('')
                  setCurrentPage(1)
                }}
                disabled={!searchTerm.trim()}
                className={secondaryButtonClass}
              >
                Clear search
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-100 px-4 py-2 text-xs text-gray-500 sm:hidden">
          Scroll horizontally to view all columns and actions.
        </div>

        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead className={tableHeadClass}>
              <tr>
                <th className={textCellClass} aria-sort={sortState.key === 'run_date' ? (sortState.direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <button
                    type="button"
                    onClick={() => setSortState((currentSort) => getNextSortState(currentSort, 'run_date'))}
                    className="inline-flex items-center gap-1 font-semibold uppercase tracking-[0.18em] text-gray-700"
                  >
                    <span>Run Date</span>
                    <span aria-hidden="true">{getSortIndicator(sortState.key === 'run_date', sortState.direction)}</span>
                  </button>
                </th>
                <th className={textCellClass} aria-sort={sortState.key === 'strain_name' ? (sortState.direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <button
                    type="button"
                    onClick={() => setSortState((currentSort) => getNextSortState(currentSort, 'strain_name'))}
                    className="inline-flex items-center gap-1 font-semibold uppercase tracking-[0.18em] text-gray-700"
                  >
                    <span>Strain</span>
                    <span aria-hidden="true">{getSortIndicator(sortState.key === 'strain_name', sortState.direction)}</span>
                  </button>
                </th>
                <th className={textCellClass} aria-sort={sortState.key === 'grower_name' ? (sortState.direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <button
                    type="button"
                    onClick={() => setSortState((currentSort) => getNextSortState(currentSort, 'grower_name'))}
                    className="inline-flex items-center gap-1 font-semibold uppercase tracking-[0.18em] text-gray-700"
                  >
                    <span>Grower</span>
                    <span aria-hidden="true">{getSortIndicator(sortState.key === 'grower_name', sortState.direction)}</span>
                  </button>
                </th>
                <th className={textCellClass} aria-sort={sortState.key === 'output_type' ? (sortState.direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <button
                    type="button"
                    onClick={() => setSortState((currentSort) => getNextSortState(currentSort, 'output_type'))}
                    className="inline-flex items-center gap-1 font-semibold uppercase tracking-[0.18em] text-gray-700"
                  >
                    <span>Output Type</span>
                    <span aria-hidden="true">{getSortIndicator(sortState.key === 'output_type', sortState.direction)}</span>
                  </button>
                </th>
                <th className={numericCellClass} aria-sort={sortState.key === 'biomass_input_g' ? (sortState.direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <button
                    type="button"
                    onClick={() => setSortState((currentSort) => getNextSortState(currentSort, 'biomass_input_g'))}
                    className="inline-flex items-center justify-end gap-1 font-semibold uppercase tracking-[0.18em] text-gray-700"
                  >
                    <span>Biomass In</span>
                    <span aria-hidden="true">{getSortIndicator(sortState.key === 'biomass_input_g', sortState.direction)}</span>
                  </button>
                </th>
                <th className={numericCellClass} aria-sort={sortState.key === 'output_weight_g' ? (sortState.direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <button
                    type="button"
                    onClick={() => setSortState((currentSort) => getNextSortState(currentSort, 'output_weight_g'))}
                    className="inline-flex items-center justify-end gap-1 font-semibold uppercase tracking-[0.18em] text-gray-700"
                  >
                    <span>Output</span>
                    <span aria-hidden="true">{getSortIndicator(sortState.key === 'output_weight_g', sortState.direction)}</span>
                  </button>
                </th>
                <th className={numericCellClass} aria-sort={sortState.key === 'yield_percent' ? (sortState.direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <button
                    type="button"
                    onClick={() => setSortState((currentSort) => getNextSortState(currentSort, 'yield_percent'))}
                    className="inline-flex items-center justify-end gap-1 font-semibold uppercase tracking-[0.18em] text-gray-700"
                  >
                    <span>Yield %</span>
                    <span aria-hidden="true">{getSortIndicator(sortState.key === 'yield_percent', sortState.direction)}</span>
                  </button>
                </th>
                <th className={numericCellClass} aria-sort={sortState.key === 'cost_per_g' ? (sortState.direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <button
                    type="button"
                    onClick={() => setSortState((currentSort) => getNextSortState(currentSort, 'cost_per_g'))}
                    className="inline-flex items-center justify-end gap-1 font-semibold uppercase tracking-[0.18em] text-gray-700"
                  >
                    <span>Cost / g</span>
                    <span aria-hidden="true">{getSortIndicator(sortState.key === 'cost_per_g', sortState.direction)}</span>
                  </button>
                </th>
                <th className="px-4 py-3 text-right sm:px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {!hasRuns ? (
                <tr>
                  <td className="px-4 py-6 sm:px-5" colSpan={9}>
                    <EmptyState
                      compact
                      title="No runs recorded yet"
                      description="Create your first run to start building a searchable history."
                    />
                  </td>
                </tr>
              ) : visibleRuns.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 sm:px-5" colSpan={9}>
                    <EmptyState
                      compact
                      title="No matching runs"
                      description="Try a different search term or clear the filter to see more results."
                    />
                  </td>
                </tr>
              ) : (
                visibleRuns.map((run) => (
                  <tr key={run.id} className={tableRowClass}>
                    <td className={textCellClass}>{formatDate(run.run_date)}</td>
                    <td className={textCellClass}>{formatText(run.strain_name)}</td>
                    <td className={textCellClass}>{formatText(run.grower_name)}</td>
                    <td className={textCellClass}>{formatText(run.output_type)}</td>
                    <td className={numericCellClass}>{formatGrams(run.biomass_input_g)}</td>
                    <td className={numericCellClass}>{formatGrams(run.output_weight_g)}</td>
                    <td className={numericCellClass}>{getFormattedYieldPercent(run)}</td>
                    <td className={numericCellClass}>{getFormattedCostPerGram(run)}</td>
                    <td className="px-4 py-3 sm:px-5">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/runs/${run.id}/edit`}
                          className={`${secondaryButtonClass} px-3 py-1.5 text-sm`}
                        >
                          Edit
                        </Link>
                        <DeleteRunForm runId={run.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {hasRuns && hasFilteredRuns ? (
        <div className={`${tableWrapperClass} flex flex-col gap-3 px-4 py-4 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between sm:px-5`}>
          <p>
            Showing {startIndex + 1}-{Math.min(startIndex + RUNS_PER_PAGE, sortedRuns.length)} of {sortedRuns.length}{' '}
            matching runs
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={visiblePage === 1 || filteredRuns.length === 0}
              className={secondaryButtonClass}
            >
              Previous
            </button>
            <span>
              Page {visiblePage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={visiblePage >= totalPages || filteredRuns.length === 0}
              className={secondaryButtonClass}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
