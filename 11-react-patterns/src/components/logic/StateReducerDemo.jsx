import { useReducer } from 'react'

// Default reducer for toggle
function defaultToggleReducer(state, action) {
  switch (action.type) {
    case 'toggle':
      return { on: !state.on, clickCount: state.clickCount + 1 }
    case 'reset':
      return { on: false, clickCount: 0 }
    default:
      return state
  }
}

function useToggle({ reducer = defaultToggleReducer } = {}) {
  const [state, dispatch] = useReducer(reducer, { on: false, clickCount: 0 })
  const toggle = () => dispatch({ type: 'toggle' })
  const reset = () => dispatch({ type: 'reset' })
  return { on: state.on, clickCount: state.clickCount, toggle, reset }
}

// Default toggle — no limit
function DefaultToggle() {
  const { on, clickCount, toggle, reset } = useToggle()

  return (
    <div>
      <div className="mb-2">
        <span className={`badge fs-6 ${on ? 'bg-success' : 'bg-secondary'}`}>
          {on ? 'ON' : 'OFF'}
        </span>
        <span className="ms-2 text-muted">Clicks: {clickCount}</span>
      </div>
      <button className="btn btn-primary btn-sm me-2" onClick={toggle}>Toggle</button>
      <button className="btn btn-outline-secondary btn-sm" onClick={reset}>Reset</button>
    </div>
  )
}

// Custom reducer — limits toggles to 4 clicks
function limitedToggleReducer(state, action) {
  switch (action.type) {
    case 'toggle':
      if (state.clickCount >= 4) return state
      return { on: !state.on, clickCount: state.clickCount + 1 }
    case 'reset':
      return { on: false, clickCount: 0 }
    default:
      return state
  }
}

function LimitedToggle() {
  const { on, clickCount, toggle, reset } = useToggle({ reducer: limitedToggleReducer })
  const isMaxed = clickCount >= 4

  return (
    <div>
      <div className="mb-2">
        <span className={`badge fs-6 ${on ? 'bg-success' : 'bg-secondary'}`}>
          {on ? 'ON' : 'OFF'}
        </span>
        <span className="ms-2 text-muted">Clicks: {clickCount} / 4</span>
        {isMaxed && <span className="ms-2 text-danger fw-bold">Limit reached!</span>}
      </div>
      <button className="btn btn-primary btn-sm me-2" onClick={toggle} disabled={isMaxed}>
        Toggle
      </button>
      <button className="btn btn-outline-secondary btn-sm" onClick={reset}>Reset</button>
    </div>
  )
}

export default function StateReducerDemo() {
  return (
    <div>
      <h2>State Reducer Pattern</h2>
      <p className="lead">
        Let consumers customize state transitions by passing their own reducer.
      </p>

      <ul className="mb-4">
        <li>The hook/component ships with a default reducer for standard behavior</li>
        <li>Consumers can pass a custom reducer to override transitions</li>
        <li>This gives users control over <em>how</em> state changes, not just <em>what</em> state is</li>
        <li>Popularized by Kent C. Dodds in Downshift and React hooks patterns</li>
        <li>Great for building flexible, reusable UI primitives</li>
      </ul>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">Default Reducer (unlimited)</div>
            <div className="card-body">
              <DefaultToggle />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">Custom Reducer (max 4 clicks)</div>
            <div className="card-body">
              <LimitedToggle />
            </div>
          </div>
        </div>
      </div>

      <code className="snippet">{`function defaultToggleReducer(state, action) {
  switch (action.type) {
    case 'toggle': return { on: !state.on, clickCount: state.clickCount + 1 }
    case 'reset':  return { on: false, clickCount: 0 }
  }
}

function useToggle({ reducer = defaultToggleReducer } = {}) {
  const [state, dispatch] = useReducer(reducer, { on: false, clickCount: 0 })
  return { ...state, toggle: () => dispatch({ type: 'toggle' }) }
}

// Custom reducer — limit to 4 clicks
function limitedReducer(state, action) {
  if (action.type === 'toggle' && state.clickCount >= 4) return state
  return defaultToggleReducer(state, action)
}

const { on, toggle } = useToggle({ reducer: limitedReducer })`}</code>
    </div>
  )
}
