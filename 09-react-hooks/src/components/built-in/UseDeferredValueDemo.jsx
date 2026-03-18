import { useState, useDeferredValue, useMemo } from 'react'

// Generate the big list once, outside the component
const ALL_ITEMS = Array.from({ length: 20000 }, (_, i) => `Item ${i + 1}`)

export default function UseDeferredValueDemo() {
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const isStale = search !== deferredSearch

  // Heavy filtering runs against the deferred (lower-priority) value
  const filteredItems = useMemo(() => {
    const term = deferredSearch.toLowerCase()
    if (term === '') return ALL_ITEMS
    return ALL_ITEMS.filter(item => item.toLowerCase().includes(term))
  }, [deferredSearch])

  return (
    <div>
      <h2>useDeferredValue</h2>
      <p className="lead">
        Lets you defer updating a part of the UI so the rest stays responsive.
      </p>

      {/* Bullet-point explanation */}
      <ul className="mb-4">
        <li>Defers re-rendering with a <strong>lower-priority</strong> value -- React finishes urgent updates (like typing) first, then re-renders with the deferred value.</li>
        <li>Similar to <strong>debouncing</strong>, but managed by React's scheduler -- it adapts to the user's device speed instead of using a fixed delay.</li>
        <li>Works seamlessly with <strong>Suspense</strong> -- a deferred update that suspends will show existing content instead of a fallback.</li>
        <li>Keeps the <strong>input responsive</strong> while expensive results (like filtering a huge list) catch up in the background.</li>
        <li>You can detect stale content by comparing the original value with the deferred value (<code>value !== deferredValue</code>).</li>
      </ul>

      {/* Demo -- Search through 20 000 items */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Demo -- Search 20,000 Items</div>
        <div className="card-body">
          {/* Search input */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Type to search (e.g. 1234)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 400 }}
          />

          {/* Stale indicator */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <span
              className={`badge ${isStale ? 'bg-warning text-dark' : 'bg-success'}`}
            >
              {isStale ? 'Updating...' : 'Up to date'}
            </span>
            <small className="text-muted">
              Input: <code>{search || '(empty)'}</code> &nbsp;|&nbsp; Deferred: <code>{deferredSearch || '(empty)'}</code>
            </small>
          </div>

          {/* Filtered list */}
          <div
            style={{
              maxHeight: 300,
              overflowY: 'auto',
              opacity: isStale ? 0.5 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            <p className="text-muted mb-2">
              Showing <strong>{filteredItems.length.toLocaleString()}</strong> of{' '}
              {ALL_ITEMS.length.toLocaleString()} items
            </p>
            <ul className="list-group">
              {filteredItems.slice(0, 200).map(item => (
                <li key={item} className="list-group-item py-1 px-3">
                  {item}
                </li>
              ))}
              {filteredItems.length > 200 && (
                <li className="list-group-item py-1 px-3 text-muted fst-italic">
                  ...and {(filteredItems.length - 200).toLocaleString()} more
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Code hint */}
      <h5>Code Hint</h5>
      <code className="snippet">{
`const deferredValue = useDeferredValue(value)

// Use deferredValue for expensive computations
const filtered = useMemo(() => {
  return bigList.filter(item =>
    item.includes(deferredValue)
  )
}, [deferredValue])

// Detect stale content
const isStale = value !== deferredValue`
      }</code>
    </div>
  )
}
