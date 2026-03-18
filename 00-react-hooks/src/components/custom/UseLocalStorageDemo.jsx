import { useLocalStorage } from "../../hooks/useLocalStorage"

export default function UseLocalStorageDemo() {
  const [note, setNote] = useLocalStorage("stickyNote", "")

  return (
    <div>
      <h2>useLocalStorage</h2>
      <p className="lead">
        A drop-in replacement for <code>useState</code> that persists
        the value to <code>localStorage</code>.
      </p>

      {/* Bullet-point explanation */}
      <ul className="mb-4">
        <li>Works exactly like <code>useState</code> but <strong>persists to localStorage</strong>.</li>
        <li>Reads the saved value on initialization using <code>JSON.parse</code> (lazy initializer).</li>
        <li>Writes updates to localStorage automatically using <code>JSON.stringify</code>.</li>
        <li>Supports <strong>functional updates</strong>: <code>setValue(prev =&gt; prev + 1)</code>.</li>
        <li>Gracefully handles errors (e.g., corrupted data, storage quota exceeded).</li>
      </ul>

      {/* Demo — Sticky Note */}
      <div className="card mb-4">
        <div className="card-header bg-warning text-dark fw-semibold d-flex justify-content-between align-items-center">
          <span>Demo — Sticky Note</span>
          <button className="btn btn-sm btn-outline-dark" onClick={() => setNote("")}>
            Clear
          </button>
        </div>
        <div className="card-body">
          <textarea
            className="form-control"
            rows="5"
            placeholder="Type your note here... It will persist even after page refresh!"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
          <small className="text-muted mt-2 d-block">
            Try typing something, then refresh the page. Your note will still be here!
          </small>
        </div>
        <div className="card-footer text-muted small">
          localStorage key: <code>"stickyNote"</code> | Length: {note.length} characters
        </div>
      </div>

      {/* Code hint */}
      <h5>Code Hint</h5>
      <code className="snippet">{
`const [note, setNote] = useLocalStorage("stickyNote", "")

// Inside useLocalStorage:
const [storedValue, setStoredValue] = useState(() => {
  const item = localStorage.getItem(key)
  return item !== null ? JSON.parse(item) : initialValue
})

const setValue = (value) => {
  const v = value instanceof Function ? value(storedValue) : value
  setStoredValue(v)
  localStorage.setItem(key, JSON.stringify(v))
}`
      }</code>
    </div>
  )
}
