import { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";

const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "C++",
  "Go",
  "Rust",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "Dart",
  "Scala",
  "Haskell",
  "Elixir",
  "Clojure",
  "R",
  "MATLAB",
  "Perl",
];

function UseDebounceDemo() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const isWaiting = searchTerm !== debouncedSearch;

  const filteredLanguages = debouncedSearch
    ? LANGUAGES.filter((lang) =>
        lang.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : LANGUAGES;

  return (
    <div className="container mt-4">
      <h2>useDebounce - Custom Hook</h2>

      <ul>
        <li>
          Delays updating the value until the user{" "}
          <strong>stops typing</strong> for a specified duration
        </li>
        <li>
          Prevents excessive re-renders and API calls on every keystroke
        </li>
        <li>
          Uses <code>setTimeout</code> and <code>clearTimeout</code> internally
          for cleanup
        </li>
        <li>
          Returns the <strong>debounced value</strong> which updates only after
          the delay
        </li>
        <li>
          Ideal for search inputs, auto-save, and resize/scroll handlers
        </li>
      </ul>

      <hr />

      <div className="mb-3">
        <label htmlFor="searchInput" className="form-label">
          Search Programming Languages
        </label>
        <div className="input-group">
          <input
            id="searchInput"
            type="text"
            className="form-control"
            placeholder="Type to search (e.g., 'java', 'rust', 'py')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isWaiting && (
            <span className="input-group-text text-warning">
              <span
                className="spinner-border spinner-border-sm me-1"
                role="status"
              />
              Waiting...
            </span>
          )}
          {!isWaiting && searchTerm && (
            <span className="input-group-text text-success">Filtered</span>
          )}
        </div>
        <small className="text-muted">
          Debounce delay: <strong>500ms</strong> | Immediate value:{" "}
          <code>"{searchTerm}"</code> | Debounced value:{" "}
          <code>"{debouncedSearch}"</code>
        </small>
      </div>

      <ul className="list-group">
        {filteredLanguages.length === 0 ? (
          <li className="list-group-item text-muted">
            No languages match "{debouncedSearch}"
          </li>
        ) : (
          filteredLanguages.map((lang) => (
            <li key={lang} className="list-group-item">
              {lang}
            </li>
          ))
        )}
      </ul>

      <span className="badge bg-secondary mt-2">
        Showing {filteredLanguages.length} of {LANGUAGES.length} languages
      </span>

      <div className="code-snippet mt-4">
        <pre>
          <code>{`const [searchTerm, setSearchTerm] = useState("");
const debouncedSearch = useDebounce(searchTerm, 500);

// Inside useDebounce:
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedValue(value);
  }, delay);
  return () => clearTimeout(timer);
}, [value, delay]);`}</code>
        </pre>
      </div>
    </div>
  );
}

export default UseDebounceDemo;
