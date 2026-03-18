import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";

function UseFetchDemo() {
  const [limit, setLimit] = useState(false);
  const url = limit
    ? "https://jsonplaceholder.typicode.com/users?_limit=5"
    : "https://jsonplaceholder.typicode.com/users";

  const { data, loading, error } = useFetch(url);

  return (
    <div className="container mt-4">
      <h2>useFetch - Custom Hook</h2>

      <ul>
        <li>
          Encapsulates the entire <strong>fetch lifecycle</strong> in one hook
        </li>
        <li>
          Returns <code>{"{ data, loading, error }"}</code> for easy
          consumption
        </li>
        <li>
          Uses <strong>AbortController</strong> to cancel in-flight requests on
          cleanup
        </li>
        <li>
          Automatically <strong>re-fetches</strong> when the URL changes
          (dependency array)
        </li>
        <li>
          Handles JSON parsing and HTTP error status codes gracefully
        </li>
      </ul>

      <hr />

      <div className="mb-3">
        <button
          className="btn btn-primary me-2"
          onClick={() => setLimit((prev) => !prev)}
        >
          {limit ? "Show All Users (10)" : "Limit to 5 Users"}
        </button>
        <span className="text-muted">
          Current: <code>{url}</code>
        </span>
      </div>

      {loading && (
        <div className="d-flex align-items-center gap-2 my-3">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span>Fetching users...</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      )}

      {data && !loading && (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address?.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="code-snippet mt-4">
        <pre>
          <code>{`const { data, loading, error } = useFetch(url);

// Inside useFetch:
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal })
    .then(res => res.json())
    .then(setData)
    .catch(setError);
  return () => controller.abort();
}, [url]);`}</code>
        </pre>
      </div>
    </div>
  );
}

export default UseFetchDemo;
