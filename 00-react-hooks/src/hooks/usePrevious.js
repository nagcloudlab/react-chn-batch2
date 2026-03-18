import { useState } from "react";

/**
 * usePrevious — Remembers the previous value of any state or prop.
 *
 * @param {*} value — The current value to track.
 * @returns {*}     — The value from the previous render (undefined on first render).
 *
 * Key concepts:
 *  - Uses two state variables: `current` and `previous`
 *  - When `value` changes (detected during render), it shifts:
 *    current → previous, new value → current
 *  - Returns `undefined` on the very first render (no previous value yet)
 *  - Works with any data type: numbers, strings, objects, etc.
 */
export function usePrevious(value) {
  const [current, setCurrent] = useState(value);
  const [previous, setPrevious] = useState(undefined);

  // Detect value change during render (not in an effect) —
  // this keeps previous and current in sync immediately
  if (value !== current) {
    setPrevious(current);
    setCurrent(value);
  }

  return previous;
}

export default usePrevious;
