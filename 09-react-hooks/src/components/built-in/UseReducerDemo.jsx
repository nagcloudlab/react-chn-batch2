import { useReducer } from 'react'

const initialState = {
  name: '',
  email: '',
  age: '',
}

function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export default function UseReducerDemo() {
  const [state, dispatch] = useReducer(formReducer, initialState)

  const handleChange = e => {
    dispatch({
      type: 'UPDATE_FIELD',
      field: e.target.name,
      value: e.target.value,
    })
  }

  const handleReset = () => {
    dispatch({ type: 'RESET' })
  }

  const handleSubmit = e => {
    e.preventDefault()
    alert(
      `Submitted!\n\nName: ${state.name}\nEmail: ${state.email}\nAge: ${state.age}`
    )
  }

  return (
    <div>
      <h2>useReducer</h2>

      <ul className="list-group list-group-flush mb-4">
        <li className="list-group-item">
          <strong>Alternative to useState for complex state</strong> — when state
          has multiple sub-values or the next state depends on the previous one,{' '}
          <code>useReducer</code> keeps logic organized.
        </li>
        <li className="list-group-item">
          <strong>Reducer is a pure function</strong> — it takes the current state
          and an action, and returns the next state with no side effects.
        </li>
        <li className="list-group-item">
          <strong>dispatch triggers state updates</strong> — instead of calling a
          setter directly, you describe <em>what happened</em> by dispatching an
          action object.
        </li>
        <li className="list-group-item">
          <strong>Good for related state transitions</strong> — a single reducer
          can handle many action types, making it easy to add new behaviors
          without scattering logic across multiple <code>useState</code> calls.
        </li>
        <li className="list-group-item">
          <strong>Predictable &amp; testable</strong> — because the reducer is
          pure, you can unit-test it outside of React with simple input/output
          assertions.
        </li>
      </ul>

      {/* ---- Live Demo ---- */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Live Demo</div>
        <div className="card-body">
          <p className="text-muted mb-3">
            This multi-field form is managed entirely by a single{' '}
            <code>useReducer</code>. Two action types drive all updates:{' '}
            <code>UPDATE_FIELD</code> and <code>RESET</code>.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={state.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={state.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                name="age"
                value={state.age}
                onChange={handleChange}
                placeholder="25"
              />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </form>

          {/* Live state mirror */}
          <div className="mt-4">
            <h6>Current reducer state</h6>
            <pre className="bg-light border rounded p-3 mb-0">
              {JSON.stringify(state, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* ---- Code Hint ---- */}
      <h5>Code Hint</h5>
      <code className="snippet">
        {`const [state, dispatch] = useReducer(reducer, initialState)`}
      </code>
    </div>
  )
}
