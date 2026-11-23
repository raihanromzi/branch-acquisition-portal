/** Visit dates must be a real calendar date within this window (FR-007). */
export const VISIT_DATE_PAST_DAYS = 365
export const VISIT_DATE_FUTURE_DAYS = 365

export function isValidVisitDate(value: string, today = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false
  }
  const start = new Date(today)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - VISIT_DATE_PAST_DAYS)
  const end = new Date(today)
  end.setHours(0, 0, 0, 0)
  end.setDate(end.getDate() + VISIT_DATE_FUTURE_DAYS)
  return date >= start && date <= end
}
