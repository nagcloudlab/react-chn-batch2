import { useId } from 'react'

// --- Reusable form field that uses useId for accessibility ---
function FormField({ label, type = 'text', placeholder = '' }) {
  const id = useId()

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="form-control"
        placeholder={placeholder}
      />
      <div className="form-text">
        Generated ID: <code>{id}</code>
      </div>
    </div>
  )
}

export default function UseIdDemo() {
  const passwordHintId = useId()

  return (
    <div>
      <h2>useId</h2>
      <p className="lead">
        Generates a unique, stable ID string that can be used for accessible
        HTML attributes like <code>htmlFor</code> and <code>id</code>.
      </p>

      {/* Bullet-point explanation */}
      <ul className="mb-4">
        <li>Generates <strong>unique IDs</strong> for linking labels to inputs, improving accessibility.</li>
        <li>IDs are <strong>stable across server and client</strong>, avoiding hydration mismatches in SSR.</li>
        <li>Do <strong>not</strong> use generated IDs as <code>key</code> props for list items.</li>
        <li>Call <code>useId()</code> <strong>once per component instance</strong>; each call produces a distinct ID.</li>
      </ul>

      {/* Demo -- Accessible form */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Demo -- Accessible Form Fields</div>
        <div className="card-body" style={{ maxWidth: 500 }}>
          <p className="text-muted mb-3">
            Each field below uses <code>useId()</code> to generate a unique ID.
            Click a label to see focus move to its input -- proof that{' '}
            <code>htmlFor</code>/<code>id</code> are correctly linked.
          </p>

          <FormField label="Full Name" placeholder="Jane Doe" />
          <FormField label="Email Address" type="email" placeholder="jane@example.com" />

          {/* Third field with aria-describedby to show suffix pattern */}
          <div className="mb-3">
            <label htmlFor={passwordHintId + '-input'} className="form-label fw-semibold">
              Password
            </label>
            <input
              id={passwordHintId + '-input'}
              type="password"
              className="form-control"
              placeholder="Enter password"
              aria-describedby={passwordHintId + '-hint'}
            />
            <div id={passwordHintId + '-hint'} className="form-text">
              Must be at least 8 characters.
              &nbsp;Base ID: <code>{passwordHintId}</code>,
              &nbsp;input ID: <code>{passwordHintId}-input</code>,
              &nbsp;hint ID: <code>{passwordHintId}-hint</code>
            </div>
          </div>
        </div>
      </div>

      {/* ID summary table */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Generated IDs at a Glance</div>
        <div className="card-body">
          <p className="text-muted mb-2">
            Notice React's <code>:r...</code> format -- these are guaranteed unique across
            the entire app, even with multiple instances of the same component.
          </p>
          <table className="table table-bordered table-sm mb-0">
            <thead className="table-light">
              <tr>
                <th>Field</th>
                <th>Generated ID</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Password (base)</td>
                <td><code>{passwordHintId}</code></td>
              </tr>
              <tr>
                <td>Password input</td>
                <td><code>{passwordHintId}-input</code></td>
              </tr>
              <tr>
                <td>Password hint</td>
                <td><code>{passwordHintId}-hint</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Code hint */}
      <h5>Code Hint</h5>
      <code className="snippet">{
`// Generate a unique ID
const id = useId()

// Use it for accessible label/input pairing
<label htmlFor={id}>Email</label>
<input id={id} type="email" />

// Derive related IDs with a suffix
<input id={id + '-input'} aria-describedby={id + '-hint'} />
<p id={id + '-hint'}>Must be 8+ characters.</p>`
      }</code>
    </div>
  )
}
