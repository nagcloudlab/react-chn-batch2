export default function Home() {
  return (
    <div>
      <h1>React Hooks Explorer</h1>
      <p className="lead">
        A hands-on guide to every React hook you need to know.
      </p>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Built-in Hooks (11)</h5>
              <p className="card-text">
                Master the hooks that ship with React — from everyday state
                management to advanced performance optimizations.
              </p>
              <ul className="mb-0">
                <li><strong>State &amp; Effects</strong> — useState, useEffect, useReducer</li>
                <li><strong>Refs &amp; DOM</strong> — useRef, useId, useLayoutEffect</li>
                <li><strong>Performance</strong> — useMemo, useCallback</li>
                <li><strong>Context</strong> — useContext</li>
                <li><strong>Concurrent</strong> — useTransition, useDeferredValue</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Custom Hooks (8)</h5>
              <p className="card-text">
                Learn to extract reusable logic into your own hooks —
                the most powerful pattern in React.
              </p>
              <ul className="mb-0">
                <li><strong>Data</strong> — useFetch, useLocalStorage</li>
                <li><strong>UI</strong> — useToggle, useClickOutside, useWindowSize</li>
                <li><strong>Timing</strong> — useDebounce, usePrevious</li>
                <li><strong>Browser</strong> — useOnlineStatus</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-info mt-3">
        Click any hook in the sidebar to see an explanation with bullet points,
        a live interactive demo, and a code snippet.
      </div>
    </div>
  )
}
