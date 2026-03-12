type RunHistorySearchable = {
  strain_name?: string | null
  grower_name?: string | null
  output_type?: string | null
}

export function normalizeRunHistorySearchTerm(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? ''
}

export function filterRunsBySearchTerm<T extends RunHistorySearchable>(
  runs: T[],
  searchTerm: string | null | undefined
) {
  const normalizedSearchTerm = normalizeRunHistorySearchTerm(searchTerm)

  if (!normalizedSearchTerm) {
    return runs
  }

  return runs.filter((run) =>
    [run.strain_name, run.grower_name, run.output_type].some((value) =>
      normalizeRunHistorySearchTerm(value).includes(normalizedSearchTerm)
    )
  )
}
