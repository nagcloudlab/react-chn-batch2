import { useState, useTransition, useMemo } from 'react'

// --- Generate a large dataset once ---
const TOTAL_ITEMS = 20000
const allItems = Array.from({ length: TOTAL_ITEMS }, (_, i) => `Item #${i + 1}`)

export default function UseTransitionDemo() {
  const [query, setQuery] = useState('')
  const [filterText, setFilterText] = useState('')
  const [isPending, startTransition] = useTransition()

  // Filter the large list based on the deferred filterText
  const filteredItems = useMemo(() => {
    if (filterText.trim() === '') return allItems
    const lower = filterText.toLowerCase()
    return allItems.filter(item => item.toLowerCase().includes(lower))
  }, [filterText])

  function handleChange(e) {
    const value = e.target.value
    // Urgent: keep the input responsive
    setQuery(value) // # Urgent update -- keeps input responsive
    // Non-urgent: filter the huge list in the background
    startTransition(() => {
      setFilterText(value) // # Non-urgent update -- deferred, can be interrupted
    })
  }

  return (
    <div>
      <h2>useTransition</h2>
      <p className="lead">
        Marks a state update as non-urgent so the UI stays responsive while
        React works on a heavy re-render in the background.
      </p>

      {/* Bullet-point explanation */}
      <ul className="mb-4">
        <li>Marks state updates as <strong>non-urgent</strong>, letting urgent updates (like typing) go first.</li>
        <li>Keeps the UI <strong>responsive during heavy updates</strong> such as filtering large lists.</li>
        <li>Returns an <strong><code>isPending</code></strong> flag you can use to show a loading indicator.</li>
        <li>Wraps the slow <code>setState</code> call inside <strong><code>startTransition</code></strong> to defer it.</li>
        <li>React may <strong>interrupt</strong> the transition render if a more urgent update arrives.</li>
      </ul>

      {/* Demo -- Filter a large list */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">
          Demo -- Filter {TOTAL_ITEMS.toLocaleString()} Items
        </div>
        <div className="card-body">
          <div className="mb-3" style={{ maxWidth: 400 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Type to filter (e.g. 123, 500, 9999)..."
              value={query}
              onChange={handleChange}
            />
          </div>

          {/* Pending indicator */}
          {isPending && (
            <div className="alert alert-warning d-flex align-items-center gap-2 py-2">
              <div className="spinner-border spinner-border-sm text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span>Updating... filtering {TOTAL_ITEMS.toLocaleString()} items in the background</span>
            </div>
          )}

          <p className="text-muted mb-2">
            Showing <strong>{filteredItems.length.toLocaleString()}</strong> of{' '}
            {TOTAL_ITEMS.toLocaleString()} items
            {filterText && (
              <span> matching "<strong>{filterText}</strong>"</span>
            )}
          </p>

          {/* Render a capped portion of the list for visibility */}
          <div
            className="border rounded p-2"
            style={{ maxHeight: 300, overflowY: 'auto', fontSize: '0.85rem' }}
          >
            {filteredItems.length === 0 ? (
              <p className="text-muted mb-0">No items match your filter.</p>
            ) : (
              <ul className="list-unstyled mb-0">
                {filteredItems.slice(0, 200).map((item, idx) => (
                  <li key={idx} className="py-1 border-bottom">
                    {item}
                  </li>
                ))}
                {filteredItems.length > 200 && (
                  <li className="py-1 text-muted fst-italic">
                    ... and {(filteredItems.length - 200).toLocaleString()} more items
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Code hint */}
      <h5>Code Hint</h5>
      <code className="snippet">{
        `const [isPending, startTransition] = useTransition()

function handleChange(e) {
  // Urgent update -- keeps input responsive
  setQuery(e.target.value)

  // Non-urgent update -- deferred, can be interrupted
  startTransition(() => {
    setFilterText(e.target.value)
  })
}

// Show a loading indicator while the transition is pending
{isPending && <span>Updating...</span>}`
      }</code>
    </div>
  )
}
