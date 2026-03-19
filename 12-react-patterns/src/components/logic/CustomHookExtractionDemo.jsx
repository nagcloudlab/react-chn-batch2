import { useState } from 'react'

// Step 1: Inline counter (no extraction)
function InlineCounter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <span className="me-3">Count: <strong>{count}</strong></span>
      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => setCount(c => c - 1)}>-1</button>
      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => setCount(c => c + 1)}>+1</button>
      <button className="btn btn-sm btn-outline-secondary" onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}

// Step 2: Extracted custom hook
function useCounter(initial = 0) {
  const [count, setCount] = useState(initial)
  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)
  const reset = () => setCount(initial)
  return { count, increment, decrement, reset }
}

function HookCounter() {
  const { count, increment, decrement, reset } = useCounter(0)

  return (
    <div>
      <span className="me-3">Count: <strong>{count}</strong></span>
      <button className="btn btn-sm btn-outline-success me-1" onClick={decrement}>-1</button>
      <button className="btn btn-sm btn-outline-success me-1" onClick={increment}>+1</button>
      <button className="btn btn-sm btn-outline-secondary" onClick={reset}>Reset</button>
    </div>
  )
}

// Step 3: Factory function for configurable hooks
function createCounter(step = 1) {
  return function useSteppedCounter(initial = 0) {
    const [count, setCount] = useState(initial)
    const increment = () => setCount(c => c + step)
    const decrement = () => setCount(c => c - step)
    const reset = () => setCount(initial)
    return { count, increment, decrement, reset, step }
  }
}

const useCountBy5 = createCounter(5)
const useCountBy10 = createCounter(10)

function FactoryCounter5() {
  const { count, increment, decrement, reset, step } = useCountBy5(0)
  return (
    <div>
      <span className="me-3">Count (step {step}): <strong>{count}</strong></span>
      <button className="btn btn-sm btn-outline-danger me-1" onClick={decrement}>-{step}</button>
      <button className="btn btn-sm btn-outline-danger me-1" onClick={increment}>+{step}</button>
      <button className="btn btn-sm btn-outline-secondary" onClick={reset}>Reset</button>
    </div>
  )
}

function FactoryCounter10() {
  const { count, increment, decrement, reset, step } = useCountBy10(100)
  return (
    <div>
      <span className="me-3">Count (step {step}): <strong>{count}</strong></span>
      <button className="btn btn-sm btn-outline-warning me-1" onClick={decrement}>-{step}</button>
      <button className="btn btn-sm btn-outline-warning me-1" onClick={increment}>+{step}</button>
      <button className="btn btn-sm btn-outline-secondary" onClick={reset}>Reset</button>
    </div>
  )
}

export default function CustomHookExtractionDemo() {
  return (
    <div>
      <h2>Custom Hook Extraction</h2>
      <p className="lead">
        Extract stateful logic from components into reusable hooks — progressively.
      </p>

      <ul className="mb-4">
        <li><strong>Step 1:</strong> Start with inline state logic inside a component</li>
        <li><strong>Step 2:</strong> Extract it into a <code>useCounter</code> custom hook</li>
        <li><strong>Step 3:</strong> Create a factory <code>createCounter(step)</code> for configurable hooks</li>
        <li>Custom hooks are just functions that call other hooks — nothing magic</li>
        <li>This is the most important pattern in modern React</li>
      </ul>

      <div className="card mb-3">
        <div className="card-header">Step 1 — Inline (logic in component)</div>
        <div className="card-body">
          <InlineCounter />
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header">Step 2 — useCounter hook</div>
        <div className="card-body">
          <HookCounter />
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header">Step 3 — createCounter(step) factory</div>
        <div className="card-body">
          <div className="mb-2"><FactoryCounter5 /></div>
          <FactoryCounter10 />
        </div>
      </div>

      <code className="snippet">{`// Step 2: Custom hook
function useCounter(initial = 0) {
  const [count, setCount] = useState(initial)
  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)
  const reset = () => setCount(initial)
  return { count, increment, decrement, reset }
}

// Step 3: Factory
function createCounter(step = 1) {
  return function useSteppedCounter(initial = 0) {
    const [count, setCount] = useState(initial)
    const increment = () => setCount(c => c + step)
    const decrement = () => setCount(c => c - step)
    return { count, increment, decrement, step }
  }
}
const useCountBy5 = createCounter(5)`}</code>
    </div>
  )
}
