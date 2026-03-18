import { useState } from 'react'

export default function UseStateDemo() {

  // --- Demo 1: Counter ---
  const [count, setCount] = useState(0)

  // --- Demo 2: Object state (user form) ---
  const [user, setUser] = useState({ name: '', age: '' })

  // --- Demo 3: Array state (item list) ---
  const [item, setItem] = useState('')
  const [items, setItems] = useState([])

  function handleAddItem() {
    const trimmed = item.trim()
    if (trimmed === '') return
    setItems(prev => [...prev, trimmed])
    setItem('')
  }

  return (
    <div>
      <h2>useState</h2>
      <p className="lead">
        The most fundamental hook -- adds reactive state to function components.
      </p>

      {/* Bullet-point explanation */}
      <ul className="mb-4">
        <li>Returns a <strong>[value, setter]</strong> pair. The setter triggers a re-render.</li>
        <li>The initial value is only used on the <em>first</em> render; subsequent renders ignore it.</li>
        <li>When updating objects or arrays, you must return a <strong>new reference</strong> (spread syntax) because React uses shallow comparison.</li>
        <li>You can pass a <strong>callback</strong> to the setter (<code>prev =&gt; prev + 1</code>) to safely derive the next value from the previous one.</li>
        <li>Calling the setter with the <em>same</em> value (by reference for objects) bails out of the re-render.</li>
      </ul>

      {/* Demo 1 -- Counter */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Demo 1 -- Counter</div>
        <div className="card-body d-flex align-items-center gap-3">
          <button className="btn btn-outline-primary btn-sm" onClick={() => setCount(c => c - 1)}>
            - Decrement
          </button>
          <span className="fs-4 fw-bold">{count}</span>
          <button className="btn btn-outline-primary btn-sm" onClick={() => setCount(c => c + 1)}>
            + Increment
          </button>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => setCount(0)}>
            Reset
          </button>
        </div>
      </div>

      {/* Demo 2 -- Object state */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Demo 2 -- Object State (User Form)</div>
        <div className="card-body">
          <div className="row g-3 mb-3">
            <div className="col-auto">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={user.name}
                onChange={e => setUser(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="col-auto">
              <input
                type="number"
                className="form-control"
                placeholder="Age"
                value={user.age}
                onChange={e => setUser(prev => ({ ...prev, age: e.target.value }))}
              />
            </div>
          </div>
          <div className="alert alert-light mb-0">
            <strong>Current state:</strong>{' '}
            <code>{JSON.stringify(user)}</code>
          </div>
        </div>
      </div>

      {/* Demo 3 -- Array state */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Demo 3 -- Array State (Item List)</div>
        <div className="card-body">
          <div className="input-group mb-3" style={{ maxWidth: 400 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Type an item..."
              value={item}
              onChange={e => setItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddItem()}
            />
            <button className="btn btn-primary" onClick={handleAddItem}>
              Add
            </button>
          </div>
          {items.length === 0 ? (
            <p className="text-muted mb-0">No items yet. Add one above.</p>
          ) : (
            <ul className="list-group">
              {items.map((entry, idx) => (
                <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                  {entry}
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Code hint */}
      <h5>Code Hint</h5>
      <code className="snippet">{
        `// Primitive state
const [count, setCount] = useState(0)

// Object state -- always spread to create a new object
const [user, setUser] = useState({ name: '', age: '' })
setUser(prev => ({ ...prev, name: 'Alice' }))

// Array state -- always spread to create a new array
const [items, setItems] = useState([])
setItems(prev => [...prev, newItem])`
      }</code>
    </div>
  )
}
