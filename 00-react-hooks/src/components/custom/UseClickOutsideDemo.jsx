import { useState, useRef } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";

export default function UseClickOutsideDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => {
    if (isOpen) setIsOpen(false);
  });

  return (
    <div className="container mt-4">
      <h2>useClickOutside</h2>

      <ul>
        <li>A custom hook that detects clicks <strong>outside</strong> a referenced element</li>
        <li>Accepts a <code>ref</code> and a <code>callback</code> function as arguments</li>
        <li>Listens for <strong>mousedown</strong> events on the document</li>
        <li>Checks if the click target is outside the ref element using <code>contains()</code></li>
        <li>Cleans up the event listener on unmount</li>
      </ul>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Dropdown Menu Example</h5>
          <p className="text-muted">
            Click the button to open the menu, then click anywhere outside to
            close it.
          </p>

          <div className="position-relative d-inline-block" ref={dropdownRef}>
            <button
              className="btn btn-primary"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? "Close Menu" : "Open Menu"}
            </button>

            {isOpen && (
              <div
                className="position-absolute mt-2 shadow rounded bg-white border"
                style={{ zIndex: 1000, minWidth: "200px" }}
              >
                <ul className="list-group list-group-flush">
                  <li className="list-group-item list-group-item-action">
                    Profile
                  </li>
                  <li className="list-group-item list-group-item-action">
                    Settings
                  </li>
                  <li className="list-group-item list-group-item-action">
                    Notifications
                  </li>
                  <li className="list-group-item list-group-item-action text-danger">
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>

          {isOpen && (
            <p className="text-success mt-3">
              Menu is open. Click outside to close it!
            </p>
          )}
        </div>
      </div>

      <pre className="code snippet mt-4">
{`export function useClickOutside(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
}`}
      </pre>
    </div>
  );
}
