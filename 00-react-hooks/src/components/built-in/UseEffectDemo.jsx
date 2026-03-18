import { useState, useEffect } from 'react'

export default function UseEffectDemo() {
  // --- Demo 1: Timer that counts seconds ---
  const [seconds, setSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)

  useEffect(() => {
    console.log('useEffect fired. timerRunning:', timerRunning)
    if (!timerRunning) return

    console.log('Setting up timer interval')
    const id = setInterval(() => {
      console.log('Tick:', seconds + 1) // Logs the value at the time of this effect's creation
      setSeconds(s => s + 1)
    }, 1000)

    // Cleanup -- runs when timerRunning changes or component unmounts
    return () => {
      console.log('Cleaning up timer interval')
      clearInterval(id)
    }
  }, [timerRunning])

  // --- Demo 2: Window resize listener ---
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup -- remove the listener when the component unmounts
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div>
      <h2>useEffect</h2>
      <p className="lead">
        Lets you synchronize a component with an external system -- APIs, timers,
        event listeners, or the DOM.
      </p>

      {/* Bullet-point explanation */}
      <ul className="mb-4">
        <li>Runs <strong>after</strong> the component renders (paint phase), not during.</li>
        <li>The <strong>dependency array</strong> controls when it re-runs: empty <code>[]</code> means "mount only"; omitting it means "every render".</li>
        <li>The <strong>cleanup function</strong> (returned from the effect) runs before the effect re-fires and on unmount -- perfect for clearing intervals, removing listeners, or cancelling network requests.</li>
        <li>Each render has its own effect closure, capturing the state and props at that point in time.</li>
        <li>Keep effects focused on a single concern. Use multiple <code>useEffect</code> calls rather than one giant one.</li>
      </ul>

      {/* Demo 1 -- Timer */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Demo 1 -- Timer with Cleanup</div>
        <div className="card-body d-flex align-items-center gap-3">
          <span className="fs-4 fw-bold">{seconds}s</span>
          {!timerRunning ? (
            <button className="btn btn-success btn-sm" onClick={() => setTimerRunning(true)}>
              Start
            </button>
          ) : (
            <button className="btn btn-warning btn-sm" onClick={() => setTimerRunning(false)}>
              Pause
            </button>
          )}
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => { setTimerRunning(false); setSeconds(0) }}
          >
            Reset
          </button>
        </div>
        <div className="card-footer text-muted small">
          The interval is created when you click Start and <strong>cleared</strong> (cleanup)
          when you click Pause, Reset, or navigate away.
        </div>
      </div>

      {/* Demo 2 -- Window resize */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Demo 2 -- Window Resize Listener</div>
        <div className="card-body">
          <p className="mb-1">
            <strong>Width:</strong> {windowWidth}px
          </p>
          <p className="mb-0">
            <strong>Height:</strong> {windowHeight}px
          </p>
        </div>
        <div className="card-footer text-muted small">
          Resize your browser window and watch the values update. The event listener
          is attached on mount and <strong>removed</strong> (cleanup) on unmount.
        </div>
      </div>

      {/* Code hint */}
      <h5>Code Hint</h5>
      <code className="snippet">{
        `useEffect(() => {
  // Side-effect logic (subscribe, fetch, timer, etc.)
  const id = setInterval(() => tick(), 1000)

  // Cleanup -- runs before re-fire & on unmount
  return () => clearInterval(id)
}, [dependency])  // [] = mount only, [dep] = when dep changes, omit = every render`
      }</code>
    </div>
  )
}
