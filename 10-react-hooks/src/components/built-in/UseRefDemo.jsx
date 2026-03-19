import { useState, useRef, useEffect } from 'react'

export default function UseRefDemo() {
  // --- Demo 1: Focus input ---
  const inputRef = useRef(null)

  // --- Demo 2: Stopwatch with mutable ref for interval ID ---
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => prev + 10)
      }, 10)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  function handleStart() {
    if (!running) setRunning(true)
  }

  function handleStop() {
    setRunning(false)
  }

  function handleReset() {
    setRunning(false)
    setElapsed(0)
  }

  // Format elapsed ms as MM:SS.ms
  function formatTime(ms) {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const centis = Math.floor((ms % 1000) / 10)
    return (
      String(minutes).padStart(2, '0') + ':' +
      String(seconds).padStart(2, '0') + '.' +
      String(centis).padStart(2, '0')
    )
  }

  return (
    <div>
      <h2>useRef</h2>
      <p className="lead">
        Returns a mutable ref object whose <code>.current</code> property persists
        across renders without causing re-renders.
      </p>

      {/* Bullet-point explanation */}
      <ul className="mb-4">
        <li>Updating <code>ref.current</code> does <strong>not</strong> trigger a re-render -- unlike <code>useState</code>.</li>
        <li>The primary use case is <strong>DOM access</strong>: attach a ref to a JSX element via the <code>ref</code> attribute, then call methods like <code>focus()</code> or <code>scrollIntoView()</code>.</li>
        <li>Refs are also ideal for storing <strong>mutable instance values</strong> -- interval IDs, previous values, or any data that should survive re-renders but not drive UI.</li>
        <li>Think of a ref as a "box" you can put any value into, and React will hand you the same box every render.</li>
      </ul>

      {/* Demo 1 -- Focus input */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Demo 1 -- Focus Input with Ref</div>
        <div className="card-body">
          <div className="d-flex align-items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              className="form-control"
              placeholder="Click the button to focus me..."
              style={{ maxWidth: 350 }}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={() => inputRef.current.focus()}
            >
              Focus Input
            </button>
          </div>
        </div>
        <div className="card-footer text-muted small">
          The button calls <code>inputRef.current.focus()</code> -- no state change, no re-render,
          just direct DOM manipulation.
        </div>
      </div>

      {/* Demo 2 -- Stopwatch */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Demo 2 -- Stopwatch (Mutable Ref for Interval ID)</div>
        <div className="card-body">
          <p className="fs-3 fw-bold font-monospace mb-3">{formatTime(elapsed)}</p>
          <div className="d-flex gap-2">
            <button
              className="btn btn-success btn-sm"
              onClick={handleStart}
              disabled={running}
            >
              Start
            </button>
            <button
              className="btn btn-warning btn-sm"
              onClick={handleStop}
              disabled={!running}
            >
              Stop
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
        <div className="card-footer text-muted small">
          The interval ID is stored in <code>intervalRef.current</code> so it can be
          cleared later. Storing it in a ref avoids unnecessary re-renders that a
          <code> useState</code> call would cause.
        </div>
      </div>

      {/* Code hint */}
      <h5>Code Hint</h5>
      <code className="snippet">{
`// DOM access
const inputRef = useRef(null)
<input ref={inputRef} />
inputRef.current.focus()

// Mutable value (no re-render on change)
const intervalRef = useRef(null)
intervalRef.current = setInterval(tick, 100)
clearInterval(intervalRef.current)`
      }</code>
    </div>
  )
}
