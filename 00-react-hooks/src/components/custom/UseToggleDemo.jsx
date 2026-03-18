import { useToggle } from "../../hooks/useToggle"

function TogglePanel({ title, children }) {
  const [isOpen, toggle] = useToggle(false)

  return (
    <div className="card mb-2">
      <div
        className="card-header d-flex justify-content-between align-items-center"
        style={{ cursor: "pointer" }}
        onClick={toggle}
      >
        <strong>{title}</strong>
        <span className="badge bg-primary">{isOpen ? "Hide" : "Show"}</span>
      </div>
      {isOpen && <div className="card-body">{children}</div>}
    </div>
  )
}

export default function UseToggleDemo() {
  const [darkMode, toggleDarkMode] = useToggle(false)

  return (
    <div>
      <h2>useToggle</h2>
      <p className="lead">
        A simple custom hook for boolean state management — returns a
        value and a stable <code>toggle()</code> function.
      </p>

      {/* Bullet-point explanation */}
      <ul className="mb-4">
        <li>Simplifies <strong>boolean state management</strong> with a single toggle function.</li>
        <li>Returns <code>[value, toggle]</code> — same shape as useState's API.</li>
        <li>Uses <code>useCallback</code> to memoize the toggle function and prevent unnecessary re-renders.</li>
        <li>Accepts an optional <strong>initial value</strong> (defaults to false).</li>
        <li>Perfect for show/hide panels, dark mode switches, and modal visibility.</li>
      </ul>

      {/* Demo — Dark Mode + Collapsible Panels */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Demo — Dark Mode &amp; Collapsible Panels</div>
        <div className="card-body">
          <div className="mb-3 d-flex align-items-center gap-3">
            <button
              className={`btn btn-sm ${darkMode ? "btn-light" : "btn-dark"}`}
              onClick={toggleDarkMode}
            >
              {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
            <span>
              Current mode: <strong>{darkMode ? "Dark" : "Light"}</strong>
            </span>
          </div>

          <div className={`p-3 rounded ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}>
            <TogglePanel title="What is useToggle?">
              <p className="mb-0">
                <code>useToggle</code> is a custom hook that manages a boolean state.
                Instead of writing <code>setValue(prev =&gt; !prev)</code> every time,
                you get a clean <code>toggle()</code> function.
              </p>
            </TogglePanel>

            <TogglePanel title="When should I use it?">
              <ul className="mb-0">
                <li>Show/hide sidebars, modals, or dropdown menus</li>
                <li>Toggle between dark and light themes</li>
                <li>Expand/collapse accordion panels</li>
              </ul>
            </TogglePanel>

            <TogglePanel title="How does it work internally?">
              <p className="mb-0">
                A thin wrapper around <code>useState</code>. The toggle function
                uses the functional updater <code>prev =&gt; !prev</code> and is
                wrapped in <code>useCallback</code> for a stable identity.
              </p>
            </TogglePanel>
          </div>
        </div>
      </div>

      {/* Code hint */}
      <h5>Code Hint</h5>
      <code className="snippet">{
`const [isOpen, toggle] = useToggle(false)

// Inside useToggle:
const [value, setValue] = useState(initialValue)
const toggle = useCallback(() => setValue(prev => !prev), [])
return [value, toggle]`
      }</code>
    </div>
  )
}
