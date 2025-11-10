import { useState, useEffect } from "react";

/**
 * Hook debounce untuk menunda perubahan nilai
 * agar tidak trigger re-render berulang setiap ketikan.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
