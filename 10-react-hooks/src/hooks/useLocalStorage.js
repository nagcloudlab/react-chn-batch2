import { useState } from "react";

/**
 * useLocalStorage — useState that persists to localStorage.
 *
 * @param {string} key          — The localStorage key.
 * @param {*}      initialValue — Fallback if nothing is stored yet.
 * @returns {[any, Function]}   — Same [value, setValue] API as useState.
 *
 * Key concepts:
 *  - Lazy initializer: reads localStorage only once (first render)
 *  - JSON.parse / JSON.stringify for serialization
 *  - Supports functional updates like useState: setValue(prev => prev + 1)
 *  - Wraps everything in try/catch for safety (corrupted data, quota exceeded)
 */
export function useLocalStorage(key, initialValue) {
  // Lazy initialization — the function passed to useState runs only on the
  // first render, so we read localStorage just once (not on every re-render)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      // If a stored value exists, parse it; otherwise use the initial value
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Custom setter that mirrors useState's API but also writes to localStorage
  const setValue = (value) => {
    try {
      // Support functional updates: setValue(prev => prev + 1)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
