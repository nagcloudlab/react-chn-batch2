import { useState } from "react"
import { usePrevious } from "../../hooks/usePrevious"

export default function UsePreviousDemo() {
  const [count, setCount] = useState(0)
  const previousCount = usePrevious(count)

  const [text, setText] = useState("")
  const previousText = usePrevious(text)

  return (
    <div>
      <h2>usePrevious</h2>
      <p className="lead">
        A custom hook that remembers the previous value of any state or
        prop — useful for comparisons and animations.
      </p>

      {/* Bullet-point explanation */}
      <ul className="mb-4">
        <li>Remembers the <strong>previous value</strong> of any state or prop.</li>
        <li>Uses two state variables to shift: current → previous on each change.</li>
        <li>Returns <code>undefined</code> on the very first render (no previous value yet).</li>
        <li>Works with any data type: numbers, strings, objects, etc.</li>
        <li>Useful for transition animations, change detection, and undo features.</li>
      </ul>

      {/* Demo 1 — Counter */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Demo 1 — Counter</div>
        <div className="card-body text-center">
          <p className="fs-4">
            Current: <strong>{count}</strong> | Previous: <strong>{previousCount ?? "N/A"}</strong>
          </p>
          <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-primary btn-sm" onClick={() => setCount(c => c + 1)}>
              Increment
            </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setCount(c => c - 1)}>
              Decrement
            </button>
            <button className="btn btn-outline-danger btn-sm" onClick={() => setCount(0)}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Demo 2 — Text Input */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Demo 2 — Text Input</div>
        <div className="card-body">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Type something..."
            value={text}
            onChange={e => setText(e.target.value)}
            style={{ maxWidth: 400 }}
          />
          <p className="mb-1">Current text: <strong>{text || "(empty)"}</strong></p>
          <p className="mb-0">Previous text: <strong>{previousText ?? "N/A"}</strong></p>
        </div>
      </div>

      {/* Code hint */}
      <h5>Code Hint</h5>
      <code className="snippet">{
`const previousCount = usePrevious(count)

// Inside usePrevious:
const [current, setCurrent] = useState(value)
const [previous, setPrevious] = useState(undefined)

if (value !== current) {
  setPrevious(current)    // old current becomes previous
  setCurrent(value)       // new value becomes current
}
return previous`
      }</code>
    </div>
  )
}
