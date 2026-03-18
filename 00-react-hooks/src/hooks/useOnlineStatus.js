import { useState, useEffect } from "react";

/**
 * useOnlineStatus — Tracks the browser's network connectivity.
 *
 * @returns {boolean} — true when online, false when offline.
 *
 * Key concepts:
 *  - Uses navigator.onLine for the initial state
 *  - Subscribes to the "online" and "offline" window events
 *  - Cleans up both listeners on unmount
 *  - The component re-renders automatically when connectivity changes
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    // Subscribe to connectivity change events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup: remove both listeners on unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []); // Empty array = subscribe once on mount

  return isOnline;
}

export default useOnlineStatus;
