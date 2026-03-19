import { useState, useEffect } from "react";

/**
 * useWindowSize — Tracks the browser window dimensions in real time.
 *
 * @returns {{ width: number, height: number }}
 *
 * Key concepts:
 *  - Reads window.innerWidth / innerHeight on mount
 *  - Attaches a "resize" event listener inside useEffect
 *  - Cleans up the listener on unmount to prevent memory leaks
 *  - Every resize triggers a state update → component re-render
 */
export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Subscribe to window resize events
    window.addEventListener("resize", handleResize);

    // Cleanup: remove listener when component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array = subscribe once on mount

  return size;
}

export default useWindowSize;
