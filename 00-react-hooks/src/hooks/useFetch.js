import { useState, useEffect } from "react";

/**
 * useFetch — Custom hook that encapsulates the fetch lifecycle.
 *
 * @param {string} url — The endpoint to fetch data from.
 * @returns {{ data: any, loading: boolean, error: string|null }}
 *
 * Key concepts:
 *  - Manages three states: data, loading, error
 *  - Uses AbortController to cancel in-flight requests on cleanup
 *    (prevents setting state on an unmounted component)
 *  - Re-fetches automatically whenever the URL changes (dependency array)
 */
export function useFetch(url) {
  // Three-piece state: the data we got, whether we're loading, any error
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // AbortController lets us cancel the fetch if the component unmounts
    // or the URL changes before the previous request completes
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, { signal });

        // fetch() does NOT throw on HTTP errors (404, 500, etc.)
        // — we must check response.ok manually
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        setData(json);
      } catch (err) {
        // AbortError is expected when we cancel — don't treat it as a real error
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        // Only update loading if the request wasn't aborted
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup: abort the in-flight request when url changes or component unmounts
    return () => {
      controller.abort();
    };
  }, [url]); // Re-run the effect whenever the URL changes

  return { data, loading, error };
}

export default useFetch;
