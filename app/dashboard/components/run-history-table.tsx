'use client'

import { useMemo, useState } from 'react'
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

function normalizeSearchValue(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? ''
}

export function RunHistoryTable({ runs }: RunHistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredRuns = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase()

    if (!normalizedSearchTerm) {
      return runs
    }

    return runs.filter((run) =>
      [run.strain_name, run.grower_name, run.output_type].some((value) =>
        normalizeSearchValue(value).includes(normalizedSearchTerm)
      )
    )
  }, [runs, searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredRuns.length / RUNS_PER_PAGE))
  const visiblePage = Math.min(currentPage, totalPages)
  const startIndex = (visiblePage - 1) * RUNS_PER_PAGE
  const visibleRuns = filteredRuns.slice(startIndex, startIndex + RUNS_PER_PAGE)
  const hasRuns = runs.length > 0

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">All runs</h2>
          <p className="text-sm text-gray-600">
            Browse your full extraction history with search and pagination.
          </p>
        </div>

        <label className="flex w-full max-w-sm flex-col gap-1 text-sm text-gray-600">
          <span>Search runs</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search strain, grower, or output type"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-400"
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
              <tr>
                <th className={textCellClass}>Run Date</th>
                <th className={textCellClass}>Strain</th>
                <th className={textCellClass}>Grower</th>
                <th className={textCellClass}>Output Type</th>
                <th className={numericCellClass}>Biomass In</th>
                <th className={numericCellClass}>Output</th>
                <th className={numericCellClass}>Yield %</th>
                <th className={numericCellClass}>Cost / g</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {!hasRuns ? (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-gray-500" colSpan={9}>
                    No runs recorded yet.
                  </td>
                </tr>
              ) : visibleRuns.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-gray-500" colSpan={9}>
                    No runs match your search.
                  </td>
                </tr>
              ) : (
                visibleRuns.map((run) => (
                  <tr key={run.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80">
                    <td className={textCellClass}>{formatDate(run.run_date)}</td>
                    <td className={textCellClass}>{formatText(run.strain_name)}</td>
                    <td className={textCellClass}>{formatText(run.grower_name)}</td>
                    <td className={textCellClass}>{formatText(run.output_type)}</td>
                    <td className={numericCellClass}>{formatGrams(run.biomass_input_g)}</td>
                    <td className={numericCellClass}>{formatGrams(run.output_weight_g)}</td>
                    <td className={numericCellClass}>{getFormattedYieldPercent(run)}</td>
                    <td className={numericCellClass}>{getFormattedCostPerGram(run)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          disabled
                          className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-400"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled
                          className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-400"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {hasRuns ? (
        <div className="flex flex-col gap-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {filteredRuns.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + RUNS_PER_PAGE, filteredRuns.length)} of{' '}
            {filteredRuns.length} runs
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={visiblePage === 1 || filteredRuns.length === 0}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              Previous
            </button>
            <span>
              Page {filteredRuns.length === 0 ? 0 : visiblePage} of {filteredRuns.length === 0 ? 0 : totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={visiblePage >= totalPages || filteredRuns.length === 0}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
