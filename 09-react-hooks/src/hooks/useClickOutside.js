import { useEffect } from "react";

/**
 * useClickOutside — Detects clicks outside a referenced DOM element.
 *
 * @param {React.RefObject} ref      — Ref attached to the element to "protect".
 * @param {Function}        callback — Called when a click lands outside.
 *
 * Key concepts:
 *  - Listens for "mousedown" on the entire document
 *  - Uses ref.current.contains(event.target) to check if the click
 *    was inside or outside the element
 *  - Cleans up the event listener on unmount
 *  - Common use cases: closing dropdowns, modals, and popovers
 */
export function useClickOutside(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      // If the ref exists and the click target is NOT inside the ref element,
      // fire the callback (e.g., close the dropdown)
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    // "mousedown" fires before "click", giving us a chance to
    // close things before other click handlers run
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup: remove listener when component unmounts
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
}

export default useClickOutside;
