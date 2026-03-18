import { useState, useRef } from "react"
import { useClickOutside } from "../../hooks/useClickOutside"

export default function UseClickOutsideDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useClickOutside(dropdownRef, () => {
    if (isOpen) setIsOpen(false)
  })

  return (
    <div>
      <h2>useClickOutside</h2>
      <p className="lead">
        A custom hook that detects clicks outside a referenced element —
        perfect for closing dropdowns, modals, and popovers.
      </p>

      {/* Bullet-point explanation */}
      <ul className="mb-4">
        <li>Detects clicks <strong>outside</strong> a referenced DOM element.</li>
        <li>Accepts a <code>ref</code> and a <code>callback</code> function as arguments.</li>
        <li>Listens for <strong>mousedown</strong> events on the document.</li>
        <li>Checks if the click target is outside using <code>ref.current.contains()</code>.</li>
        <li>Cleans up the event listener on unmount.</li>
      </ul>

      {/* Demo — Dropdown Menu */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Demo — Dropdown Menu</div>
        <div className="card-body">
          <p className="text-muted mb-3">
            Click the button to open the menu, then click anywhere outside to close it.
          </p>

          <div className="position-relative d-inline-block" ref={dropdownRef}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsOpen(prev => !prev)}
            >
              {isOpen ? "Close Menu" : "Open Menu"}
            </button>

            {isOpen && (
              <div
                className="position-absolute mt-2 shadow rounded bg-white border"
                style={{ zIndex: 1000, minWidth: 200 }}
              >
                <ul className="list-group list-group-flush">
                  <li className="list-group-item list-group-item-action">Profile</li>
                  <li className="list-group-item list-group-item-action">Settings</li>
                  <li className="list-group-item list-group-item-action">Notifications</li>
                  <li className="list-group-item list-group-item-action text-danger">Logout</li>
                </ul>
              </div>
            )}
          </div>

          {isOpen && (
            <p className="text-success mt-3 mb-0">
              Menu is open. Click outside to close it!
            </p>
          )}
        </div>
      </div>

      {/* Code hint */}
      <h5>Code Hint</h5>
      <code className="snippet">{
`useClickOutside(dropdownRef, () => setIsOpen(false))

// Inside useClickOutside:
useEffect(() => {
  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      callback()
    }
  }
  document.addEventListener("mousedown", handleClickOutside)
  return () => document.removeEventListener("mousedown", handleClickOutside)
}, [ref, callback])`
      }</code>
    </div>
  )
}
