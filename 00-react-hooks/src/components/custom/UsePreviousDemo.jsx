import { useState } from "react";
import { usePrevious } from "../../hooks/usePrevious";

export default function UsePreviousDemo() {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  const [text, setText] = useState("");
  const previousText = usePrevious(text);

  return (
    <div className="container mt-4">
      <h2>usePrevious</h2>

      <ul>
        <li>A custom hook that remembers the <strong>previous value</strong> of any state</li>
        <li>Uses <code>useRef</code> to store the value without triggering re-renders</li>
        <li>Uses <code>useEffect</code> to update the ref after each render</li>
        <li>Returns <code>undefined</code> on the very first render (no previous value yet)</li>
        <li>Works with any data type: numbers, strings, objects, etc.</li>
      </ul>

      <div className="card mb-4">
        <div className="card-body text-center">
          <h5 className="card-title">Counter Example</h5>
          <p className="fs-4">
            Current: <strong>{count}</strong> | Previous:{" "}
            <strong>{previousCount ?? "N/A"}</strong>
          </p>
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-primary"
              onClick={() => setCount((c) => c + 1)}
            >
              Increment
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setCount((c) => c - 1)}
            >
              Decrement
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => setCount(0)}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Text Input Example</h5>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Type something..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p>
            Current text: <strong>{text || "(empty)"}</strong>
          </p>
          <p>
            Previous text: <strong>{previousText ?? "N/A"}</strong>
          </p>
        </div>
      </div>

      <pre className="code snippet mt-4">
{`export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}`}
      </pre>
    </div>
  );
}
