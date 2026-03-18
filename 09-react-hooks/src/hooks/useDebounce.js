import { useState, useEffect } from "react";

/**
 * useDebounce — Delays updating a value until the caller stops changing it.
 *
 * @param {*}      value — The rapidly-changing input value (e.g. a search term).
 * @param {number} delay — Milliseconds to wait after the last change.
 * @returns {*}           — The debounced value (updates only after the delay).
 *
 * Key concepts:
 *  - Uses setTimeout + clearTimeout inside useEffect
 *  - Every time `value` changes the previous timer is cleared (cleanup),
 *    and a new timer starts — so the update only fires when the user
 *    stops typing for `delay` ms
 *  - Prevents excessive API calls and re-renders on every keystroke
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Start a timer to update the debounced value after `delay` ms
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: if `value` changes before the timer fires, cancel it
    // This is what makes it a debounce — only the LAST call wins
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // Re-run when value or delay changes

  return debouncedValue;
}

export default useDebounce;
