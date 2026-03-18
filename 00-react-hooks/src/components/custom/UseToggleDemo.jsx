import { useToggle } from "../../hooks/useToggle";

function TogglePanel({ title, children }) {
  const [isOpen, toggle] = useToggle(false);

  return (
    <div className="card mb-3">
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
  );
}

function UseToggleDemo() {
  const [darkMode, toggleDarkMode] = useToggle(false);

  return (
    <div className="container mt-4">
      <h2>useToggle - Custom Hook</h2>

      <ul>
        <li>
          Simplifies <strong>boolean state management</strong> with a single
          toggle function
        </li>
        <li>
          Returns <code>[value, toggle]</code> similar to useState's API
        </li>
        <li>
          Uses <code>useCallback</code> to memoize the toggle function and
          prevent unnecessary re-renders
        </li>
        <li>
          Accepts an optional <strong>initial value</strong> (defaults to false)
        </li>
        <li>
          Perfect for show/hide panels, dark mode switches, and modal visibility
        </li>
      </ul>

      <hr />

      <div className="mb-4">
        <button
          className={`btn ${darkMode ? "btn-light" : "btn-dark"}`}
          onClick={toggleDarkMode}
        >
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
        <span className="ms-3">
          Current mode: <strong>{darkMode ? "Dark" : "Light"}</strong>
        </span>
      </div>

      <div
        className={`p-3 rounded mb-4 ${
          darkMode ? "bg-dark text-light" : "bg-light text-dark"
        }`}
      >
        <TogglePanel title="What is useToggle?">
          <p>
            <code>useToggle</code> is a custom hook that manages a boolean
            state. Instead of writing{" "}
            <code>setValue(prev =&gt; !prev)</code> every time, you get a clean{" "}
            <code>toggle()</code> function that flips the value for you.
          </p>
        </TogglePanel>

        <TogglePanel title="When should I use it?">
          <p>Use it whenever you have binary UI states:</p>
          <ul>
            <li>Show/hide sidebars, modals, or dropdown menus</li>
            <li>Toggle between dark and light themes</li>
            <li>Expand/collapse accordion panels</li>
            <li>Enable/disable features or settings</li>
          </ul>
        </TogglePanel>

        <TogglePanel title="How does it work internally?">
          <p>
            It is a thin wrapper around <code>useState</code>. The toggle
            function uses the functional updater form{" "}
            <code>setValue(prev =&gt; !prev)</code> to guarantee it always
            flips from the latest state, even in concurrent scenarios. The
            function is wrapped in <code>useCallback</code> so it has a stable
            identity across renders.
          </p>
        </TogglePanel>
      </div>

      <div className="code-snippet mt-4">
        <pre>
          <code>{`const [isOpen, toggle] = useToggle(false);

// Inside useToggle:
const [value, setValue] = useState(initialValue);
const toggle = useCallback(() => {
  setValue(prev => !prev);
}, []);
return [value, toggle];`}</code>
        </pre>
      </div>
    </div>
  );
}

export default UseToggleDemo;
