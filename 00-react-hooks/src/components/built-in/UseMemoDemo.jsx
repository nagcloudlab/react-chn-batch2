import { useState, useMemo, useEffect } from 'react'

// Generate a large list once, outside the component
const bigList = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  value: `Item #${i + 1} — ${Math.random().toString(36).substring(2, 8)}`,
}))

export default function UseMemoDemo() {
  console.log('Rendering UseMemoDemo...')
  const [query, setQuery] = useState('')
  const [counter, setCounter] = useState(0)

  // Expensive filter — only recalculated when `query` changes
  const filteredList = useMemo(() => {
    console.log('useMemo: filtering 10 000 items...')
    return bigList.filter(item =>
      item.value.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  // const [filteredList, setFilteredList] = useState(bigList)
  // useEffect(() => {
  //   console.log('useEffect: filtering 10 000 items...')
  //   setFilteredList(
  //     bigList.filter(item =>
  //       item.value.toLowerCase().includes(query.toLowerCase())
  //     )
  //   )
  // }, [query])

  return (
    <div>
      <h2>useMemo</h2>

      <ul className="list-group list-group-flush mb-4">
        <li className="list-group-item">
          <strong>Memoizes a computed value</strong> — React caches the result and
          returns it on subsequent renders unless a dependency changes.
        </li>
        <li className="list-group-item">
          <strong>Recalculates only when dependencies change</strong> — the
          function inside <code>useMemo</code> re-runs only when a value in the
          dependency array is different from the previous render.
        </li>
        <li className="list-group-item">
          <strong>Avoid for cheap operations</strong> — memoization itself has a
          cost; use it only when the computation is genuinely expensive.
        </li>
        <li className="list-group-item">
          <strong>Referential equality</strong> — because the same object / array
          reference is returned, downstream components or effects that depend on
          it will not re-run unnecessarily.
        </li>
      </ul>

      {/* ---- Live Demo ---- */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Live Demo</div>
        <div className="card-body">
          <div className="row g-3 align-items-end mb-3">
            <div className="col-md-6">
              <label className="form-label">
                Filter 10 000 items (memoized)
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Type to filter..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">
                Unrelated counter (does NOT re-run filter)
              </label>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setCounter(c => c + 1)}
                >
                  Increment
                </button>
                <span className="badge bg-primary fs-6">{counter}</span>
              </div>
            </div>
          </div>

          <p className="text-muted mb-1">
            Showing <strong>{filteredList.length}</strong> of{' '}
            <strong>{bigList.length}</strong> items. Open the console to see when
            the filter actually runs.
          </p>

          <ul
            className="list-group"
            style={{ maxHeight: '220px', overflowY: 'auto' }}
          >
            {filteredList.slice(0, 100).map(item => (
              <li key={item.id} className="list-group-item py-1">
                {item.value}
              </li>
            ))}
            {filteredList.length > 100 && (
              <li className="list-group-item py-1 text-muted fst-italic">
                ...and {filteredList.length - 100} more
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* ---- Code Hint ---- */}
      <h5>Code Hint</h5>
      <code className="snippet">
        {`const memoized = useMemo(() => computeExpensiveValue(a, b), [a, b])`}
      </code>
    </div>
  )
}
