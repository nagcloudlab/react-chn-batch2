import { useWindowSize } from "../../hooks/useWindowSize"

export default function UseWindowSizeDemo() {
  const { width, height } = useWindowSize()

  const deviceLabel =
    width < 768 ? "Mobile" : width < 1024 ? "Tablet" : "Desktop"

  const badgeColor =
    width < 768
      ? "bg-warning text-dark"
      : width < 1024
        ? "bg-info text-dark"
        : "bg-success"

  return (
    <div>
      <h2>useWindowSize</h2>
      <p className="lead">
        A custom hook that tracks the browser window dimensions in real
        time and re-renders when the window is resized.
      </p>

      {/* Bullet-point explanation */}
      <ul className="mb-4">
        <li>Tracks the browser window's <strong>width</strong> and <strong>height</strong>.</li>
        <li>Returns an object: <code>{"{ width, height }"}</code>.</li>
        <li>Attaches a <strong>resize</strong> event listener inside <code>useEffect</code>.</li>
        <li>Cleans up the listener on unmount to prevent memory leaks.</li>
        <li>Re-renders the component automatically whenever the window is resized.</li>
      </ul>

      {/* Demo — Responsive Breakpoint Detector */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Demo — Responsive Breakpoint Detector</div>
        <div className="card-body text-center">
          <p className="fs-4">
            Width: <strong>{width}px</strong> | Height: <strong>{height}px</strong>
          </p>
          <span className={`badge ${badgeColor} fs-5 px-4 py-2`}>
            {deviceLabel}
          </span>
          <p className="text-muted mt-3 mb-0">
            Mobile &lt; 768px | Tablet &lt; 1024px | Desktop &ge; 1024px
          </p>
        </div>
        <div className="card-footer text-muted small">
          Resize your browser window and watch the values update live.
        </div>
      </div>

      {/* Code hint */}
      <h5>Code Hint</h5>
      <code className="snippet">{
`const { width, height } = useWindowSize()

// Inside useWindowSize:
const [size, setSize] = useState({
  width: window.innerWidth,
  height: window.innerHeight,
})

useEffect(() => {
  const handleResize = () =>
    setSize({ width: window.innerWidth, height: window.innerHeight })
  window.addEventListener("resize", handleResize)
  return () => window.removeEventListener("resize", handleResize)
}, [])`
      }</code>
    </div>
  )
}
