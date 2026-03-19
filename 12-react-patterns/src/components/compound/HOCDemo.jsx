import { useState, useEffect } from 'react'

function Greeting({ name, ...extra }) {
  return (
    <div className="p-3 border rounded">
      <strong>Hello, {name}!</strong>
      {extra.timestamp && (
        <div className="text-muted small mt-1">Rendered at: {extra.timestamp}</div>
      )}
      {extra.renderCount !== undefined && (
        <div className="text-muted small">Render #{extra.renderCount}</div>
      )}
    </div>
  )
}

function withTimestamp(WrappedComponent) {
  function WithTimestamp(props) {
    const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString())

    useEffect(() => {
      const id = setInterval(() => {
        setTimestamp(new Date().toLocaleTimeString())
      }, 1000)
      return () => clearInterval(id)
    }, [])

    return <WrappedComponent {...props} timestamp={timestamp} />
  }
  WithTimestamp.displayName = `withTimestamp(${WrappedComponent.displayName || WrappedComponent.name})`
  return WithTimestamp
}

function withRenderCounter(WrappedComponent) {
  function WithRenderCounter(props) {
    const [count, setCount] = useState(0)
    const [prevProps, setPrevProps] = useState(props)

    if (props !== prevProps) {
      setPrevProps(props)
      setCount(c => c + 1)
    }

    return <WrappedComponent {...props} renderCount={count} />
  }
  WithRenderCounter.displayName = `withRenderCounter(${WrappedComponent.displayName || WrappedComponent.name})`
  return WithRenderCounter
}

const TimestampGreeting = withTimestamp(Greeting)
const CountedTimestampGreeting = withRenderCounter(withTimestamp(Greeting))

export default function HOCDemo() {
  const [name, setName] = useState('World')

  return (
    <div>
      <h2>Higher-Order Components (HOC)</h2>
      <p className="lead">
        A function that takes a component and returns an enhanced version of it.
      </p>

      <ul className="mb-4">
        <li>HOCs are pure functions — they don&apos;t modify the original component</li>
        <li>They add behavior by wrapping: <code>withX(Component)</code></li>
        <li>HOCs compose: <code>withA(withB(Component))</code></li>
        <li>Convention: prefix with <code>with</code> and set <code>displayName</code></li>
        <li>Modern alternative: custom hooks — but HOCs still appear in many codebases</li>
      </ul>

      <div className="card mb-4">
        <div className="card-header">Live Demo — withTimestamp + withRenderCounter</div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Name:</label>
            <input
              className="form-control"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ maxWidth: 300 }}
            />
          </div>

          <div className="row g-3">
            <div className="col-md-4">
              <h6>Plain Greeting</h6>
              <Greeting name={name} />
            </div>
            <div className="col-md-4">
              <h6>withTimestamp</h6>
              <TimestampGreeting name={name} />
            </div>
            <div className="col-md-4">
              <h6>withRenderCounter + withTimestamp</h6>
              <CountedTimestampGreeting name={name} />
            </div>
          </div>
        </div>
      </div>

      <code className="snippet">{`function withTimestamp(WrappedComponent) {
  function WithTimestamp(props) {
    const [timestamp, setTimestamp] = useState(
      new Date().toLocaleTimeString()
    )
    useEffect(() => {
      const id = setInterval(
        () => setTimestamp(new Date().toLocaleTimeString()), 1000
      )
      return () => clearInterval(id)
    }, [])
    return <WrappedComponent {...props} timestamp={timestamp} />
  }
  WithTimestamp.displayName = \`withTimestamp(\${WrappedComponent.name})\`
  return WithTimestamp
}

const Enhanced = withTimestamp(Greeting)`}</code>
    </div>
  )
}
