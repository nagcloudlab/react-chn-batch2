export default function Home() {
  return (
    <div>
      <h1>React Design Patterns</h1>
      <p className="lead">
        A hands-on guide to the 10 most important React design patterns,
        with live interactive demos.
      </p>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Component Patterns (5)</h5>
              <p className="card-text">
                Patterns that shape how you structure and compose components.
              </p>
              <ul className="mb-0">
                <li><strong>Compound Components</strong> — shared implicit state</li>
                <li><strong>Higher-Order Components</strong> — component wrappers</li>
                <li><strong>Controlled vs Uncontrolled</strong> — who owns the state?</li>
                <li><strong>Container / Presentational</strong> — logic vs UI split</li>
                <li><strong>Slots &amp; Composition</strong> — flexible layouts via children</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Logic Patterns (5)</h5>
              <p className="card-text">
                Patterns that help you share and manage logic across components.
              </p>
              <ul className="mb-0">
                <li><strong>Render Props</strong> — share behavior via function children</li>
                <li><strong>Custom Hook Extraction</strong> — reusable stateful logic</li>
                <li><strong>Provider Pattern</strong> — deep state without prop drilling</li>
                <li><strong>State Reducer</strong> — user-controlled state transitions</li>
                <li><strong>Prop Getters</strong> — accessible prop bundles from hooks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-info mt-3">
        Click any pattern in the sidebar to see an explanation with bullet points,
        a live interactive demo, and a code snippet.
      </div>
    </div>
  )
}
