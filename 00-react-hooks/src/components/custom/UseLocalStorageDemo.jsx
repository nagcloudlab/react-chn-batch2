import { useLocalStorage } from "../../hooks/useLocalStorage";

function UseLocalStorageDemo() {
  const [note, setNote] = useLocalStorage("stickyNote", "");

  const handleClear = () => {
    setNote("");
  };

  return (
    <div className="container mt-4">
      <h2>useLocalStorage - Custom Hook</h2>

      <ul>
        <li>
          Works exactly like <code>useState</code> but{" "}
          <strong>persists to localStorage</strong>
        </li>
        <li>
          Reads the saved value on initialization using{" "}
          <code>JSON.parse</code>
        </li>
        <li>
          Writes updates to localStorage automatically using{" "}
          <code>JSON.stringify</code>
        </li>
        <li>
          Supports <strong>lazy initialization</strong> to avoid reading
          localStorage on every render
        </li>
        <li>
          Gracefully handles errors (e.g., corrupted data, storage quota
          exceeded)
        </li>
      </ul>

      <hr />

      <div className="card">
        <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
          <strong>Sticky Note</strong>
          <button className="btn btn-sm btn-outline-dark" onClick={handleClear}>
            Clear
          </button>
        </div>
        <div className="card-body">
          <textarea
            className="form-control"
            rows="5"
            placeholder="Type your note here... It will persist even after page refresh!"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <small className="text-muted mt-2 d-block">
            Try typing something, then refresh the page. Your note will still be
            here!
          </small>
        </div>
        <div className="card-footer text-muted">
          localStorage key: <code>"stickyNote"</code> | Length:{" "}
          {note.length} characters
        </div>
      </div>

      <div className="code-snippet mt-4">
        <pre>
          <code>{`const [note, setNote] = useLocalStorage("stickyNote", "");

// Inside useLocalStorage:
const [storedValue, setStoredValue] = useState(() => {
  const item = localStorage.getItem(key);
  return item !== null ? JSON.parse(item) : initialValue;
});

const setValue = (value) => {
  setStoredValue(value);
  localStorage.setItem(key, JSON.stringify(value));
};`}</code>
        </pre>
      </div>
    </div>
  );
}

export default UseLocalStorageDemo;
