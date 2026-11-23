const STORAGE_KEY = "branch-acquisition-portal:v1"

export function loadState<T>(fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as { version?: number; state?: T }
    if (parsed.version !== 1 || !parsed.state) {
      window.localStorage.removeItem(STORAGE_KEY)
      return fallback
    }
    return parsed.state
  } catch {
    return fallback
  }
}

export function saveState<T>(state: T): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, state }))
  } catch {
    // Quota or private mode: keep the in-memory state.
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to recover; reset already replaced memory.
  }
}
