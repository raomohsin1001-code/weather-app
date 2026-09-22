import { useState, useEffect } from 'react'

/**
 * Persists state to localStorage under the given key.
 * Works just like useState, but survives page reloads.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // localStorage unavailable (e.g. private browsing) — fail silently
    }
  }, [key, value])

  return [value, setValue]
}