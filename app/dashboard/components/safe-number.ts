export function coerceFiniteNumber(value: unknown) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim()
    if (!normalizedValue) {
      return null
    }

    const parsedValue = Number(normalizedValue)
    return Number.isFinite(parsedValue) ? parsedValue : null
  }

  return null
}

export function toSafeNumber(value: unknown, fallback = 0) {
  return coerceFiniteNumber(value) ?? fallback
}

export function roundNumber(value: unknown, fractionDigits = 2, fallback = 0) {
  const numericValue = coerceFiniteNumber(value)
  if (numericValue === null) {
    return fallback
  }

  const roundedValue = Number(numericValue.toFixed(fractionDigits))
  return Number.isFinite(roundedValue) ? roundedValue : fallback
}
