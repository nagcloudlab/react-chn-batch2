

import { useState, useEffect } from "react";


function useFetch(url) {

    // result, error, loading
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const abortController = new AbortController();

    useEffect(() => {
        fetch(url, { signal: abortController.signal })
            .then(res => res.json())
            .then(data => {
                setResult(data);
                setLoading(false);
            })
            .catch(err => {
                if (err.name === "AbortError") {
                    console.log("Fetch aborted");
                } else {
                    setError(err);
                    setLoading(false);
                }
            });

        return () => {
            abortController.abort();
        };
    }, [url]);

    return { result, error, loading };


}

export default useFetch;