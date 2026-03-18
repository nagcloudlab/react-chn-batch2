import { useState } from "react"
import { useDebounce } from "../../hooks/useDebounce"

const LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Go", "Rust",
  "Ruby", "PHP", "Swift", "Kotlin", "Dart", "Scala", "Haskell", "Elixir",
  "Clojure", "R", "MATLAB", "Perl",
]

export default function UseDebounceDemo() {
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 500)

  const isWaiting = searchTerm !== debouncedSearch

  const filteredLanguages = debouncedSearch
    ? LANGUAGES.filter(lang =>
        lang.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : LANGUAGES

  return (
    <div>
      <h2>useDebounce</h2>
      <p className="lead">
        Delays updating a value until the user stops changing it for a
        specified duration — prevents excessive re-renders and API calls.
      </p>

      {/* Bullet-point explanation */}
      <ul className="mb-4">
        <li>Delays updating the value until the user <strong>stops typing</strong> for a specified duration.</li>
        <li>Prevents excessive re-renders and API calls on every keystroke.</li>
        <li>Uses <code>setTimeout</code> and <code>clearTimeout</code> internally for cleanup.</li>
        <li>Returns the <strong>debounced value</strong> which updates only after the delay.</li>
        <li>Ideal for search inputs, auto-save, and resize/scroll handlers.</li>
      </ul>

      {/* Demo — Search Languages */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Demo — Search Programming Languages</div>
        <div className="card-body">
          <div className="mb-3">
            <div className="input-group" style={{ maxWidth: 500 }}>
              <input
                type="text"
                className="form-control"
                placeholder="Type to search (e.g., 'java', 'rust', 'py')..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {isWaiting && (
                <span className="input-group-text text-warning">
                  <span className="spinner-border spinner-border-sm me-1" role="status" />
                  Waiting...
                </span>
              )}
              {!isWaiting && searchTerm && (
                <span className="input-group-text text-success">Filtered</span>
              )}
            </div>
            <small className="text-muted">
              Debounce delay: <strong>500ms</strong> | Immediate: <code>"{searchTerm}"</code> | Debounced: <code>"{debouncedSearch}"</code>
            </small>
          </div>

          <ul className="list-group">
            {filteredLanguages.length === 0 ? (
              <li className="list-group-item text-muted">
                No languages match "{debouncedSearch}"
              </li>
            ) : (
              filteredLanguages.map(lang => (
                <li key={lang} className="list-group-item py-1">{lang}</li>
              ))
            )}
          </ul>
          <span className="badge bg-secondary mt-2">
            Showing {filteredLanguages.length} of {LANGUAGES.length} languages
          </span>
        </div>
      </div>

      {/* Code hint */}
      <h5>Code Hint</h5>
      <code className="snippet">{
`const debouncedSearch = useDebounce(searchTerm, 500)

// Inside useDebounce:
useEffect(() => {
  const timer = setTimeout(() => setDebouncedValue(value), delay)
  return () => clearTimeout(timer)   // cancel previous timer
}, [value, delay])`
      }</code>
    </div>
  )
}
