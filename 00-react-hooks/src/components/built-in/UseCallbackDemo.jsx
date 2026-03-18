import { useState, useCallback, memo } from 'react'

// ---- Child component wrapped in React.memo ----
const MemoizedChild = memo(function MemoizedChild({ onClick, label }) {
  const [propChanges, setPropChanges] = useState(0)
  const [prevOnClick, setPrevOnClick] = useState(onClick)

  // Track when onClick identity changes (during render, not in effect)
  if (onClick !== prevOnClick) {
    setPropChanges(c => c + 1)
    setPrevOnClick(onClick)
  }

  return (
    <div className="card mb-2">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <strong>{label}</strong>
          <span className="ms-3 badge bg-info text-dark">
            Prop changes: {propChanges}
          </span>
        </div>
        <button className="btn btn-sm btn-outline-secondary" onClick={onClick}>
          Child action
        </button>
      </div>
    </div>
  )
})

export default function UseCallbackDemo() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')

  // WITHOUT useCallback — a new function reference every render
  const handleClickUnstable = () => {
    setMessage('Clicked (unstable ref)')
  }

  // WITH useCallback — same function reference across renders
  const handleClickStable = useCallback(() => {
    setMessage('Clicked (stable ref)')
  }, [])

  return (
    <div>
      <h2>useCallback</h2>

      <ul className="list-group list-group-flush mb-4">
        <li className="list-group-item">
          <strong>Memoizes a function reference</strong> — returns the same
          function object between renders unless its dependencies change.
        </li>
        <li className="list-group-item">
          <strong>Prevents unnecessary child re-renders</strong> — when a
          callback is passed as a prop to a memoized child, a stable reference
          avoids breaking the memoization.
        </li>
        <li className="list-group-item">
          <strong>Use together with React.memo</strong> — <code>useCallback</code>{' '}
          alone does nothing for performance; the child must also be wrapped in{' '}
          <code>React.memo</code> to skip re-renders.
        </li>
        <li className="list-group-item">
          <strong>Dependency array controls identity</strong> — the returned
          function is re-created only when one of the listed dependencies changes.
        </li>
      </ul>

      {/* ---- Live Demo ---- */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Live Demo</div>
        <div className="card-body">
          <p className="mb-3 text-muted">
            Click <strong>Increment Parent</strong> and watch the prop-change
            counts. The child receiving the <em>unstable</em> reference sees a
            new <code>onClick</code> every time; the one receiving the{' '}
            <em>stable</em> (useCallback) reference does not.
          </p>

          <div className="d-flex align-items-center gap-3 mb-4">
            <button
              className="btn btn-primary"
              onClick={() => setCount(c => c + 1)}
            >
              Increment Parent
            </button>
            <span className="badge bg-primary fs-6">Count: {count}</span>
          </div>

          <MemoizedChild
            label="Child WITHOUT useCallback"
            onClick={handleClickUnstable}
          />
          <MemoizedChild
            label="Child WITH useCallback"
            onClick={handleClickStable}
          />

          {message && (
            <div className="alert alert-secondary mt-3 mb-0 py-2">
              {message}
            </div>
          )}
        </div>
      </div>

      {/* ---- Code Hint ---- */}
      <h5>Code Hint</h5>
      <code className="snippet">
        {`const memoizedFn = useCallback(() => { doSomething(a) }, [a])`}
      </code>
    </div>
  )
}
