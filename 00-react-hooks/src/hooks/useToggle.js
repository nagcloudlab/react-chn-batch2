import { useState, useCallback } from "react";

/**
 * useToggle — Simplifies boolean state management.
 *
 * @param {boolean} [initialValue=false] — Starting value.
 * @returns {[boolean, Function]}        — [currentValue, toggleFn]
 *
 * Key concepts:
 *  - Thin wrapper around useState for true/false state
 *  - The toggle function uses the functional updater (prev => !prev)
 *    to guarantee correctness even in concurrent mode
 *  - Wrapped in useCallback so the toggle function has a stable identity
 *    (won't cause unnecessary re-renders in memoized children)
 */
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  // useCallback ensures `toggle` is the same function reference across renders
  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle];
}

export default useToggle;
