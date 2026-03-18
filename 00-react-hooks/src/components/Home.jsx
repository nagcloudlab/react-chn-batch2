export default function Home() {
  return (
    <div>
      <h1>React Hooks Explorer</h1>
      <p className="lead">
        A hands-on guide to every React hook you need to know.
      </p>

      {/* ── Built-in Hooks Overview ── */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Built-in Hooks (11)</div>
        <div className="card-body">
          <p className="card-text">
            Master the hooks that ship with React — from everyday state
            management to advanced performance optimizations.
          </p>
          <table className="table table-sm table-bordered mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '30%' }}>Category</th>
                <th>Hooks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>State &amp; Lifecycle</strong></td>
                <td><code>useState</code>, <code>useEffect</code>, <code>useReducer</code></td>
              </tr>
              <tr>
                <td><strong>Refs &amp; DOM</strong></td>
                <td><code>useRef</code>, <code>useId</code>, <code>useLayoutEffect</code></td>
              </tr>
              <tr>
                <td><strong>Performance</strong></td>
                <td><code>useMemo</code>, <code>useCallback</code></td>
              </tr>
              <tr>
                <td><strong>Context</strong></td>
                <td><code>useContext</code></td>
              </tr>
              <tr>
                <td><strong>Concurrent</strong></td>
                <td><code>useTransition</code>, <code>useDeferredValue</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Custom Hooks Overview ── */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Custom Hooks (8)</div>
        <div className="card-body">
          <p className="card-text">
            Learn to extract reusable logic into your own hooks —
            the most powerful pattern in React.
          </p>
          <table className="table table-sm table-bordered mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '30%' }}>Category</th>
                <th>Hooks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Data</strong></td>
                <td><code>useFetch</code>, <code>useLocalStorage</code></td>
              </tr>
              <tr>
                <td><strong>UI</strong></td>
                <td><code>useToggle</code>, <code>useClickOutside</code>, <code>useWindowSize</code></td>
              </tr>
              <tr>
                <td><strong>Timing</strong></td>
                <td><code>useDebounce</code>, <code>usePrevious</code></td>
              </tr>
              <tr>
                <td><strong>Browser</strong></td>
                <td><code>useOnlineStatus</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="alert alert-info mt-3">
        Click any hook in the sidebar to see an explanation with bullet points,
        a live interactive demo, and a code snippet.
      </div>
    </div>
  )
}
