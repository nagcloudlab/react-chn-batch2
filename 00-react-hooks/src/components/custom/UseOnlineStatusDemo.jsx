import { useOnlineStatus } from "../../hooks/useOnlineStatus"

export default function UseOnlineStatusDemo() {
  const isOnline = useOnlineStatus()

  return (
    <div>
      <h2>useOnlineStatus</h2>
      <p className="lead">
        A custom hook that tracks the browser's network connectivity
        and re-renders when the status changes.
      </p>

      {/* Bullet-point explanation */}
      <ul className="mb-4">
        <li>Tracks the browser's <strong>network connectivity</strong> in real time.</li>
        <li>Uses <code>navigator.onLine</code> for the initial online/offline state.</li>
        <li>Listens to the <strong>online</strong> and <strong>offline</strong> window events.</li>
        <li>Returns a boolean: <code>true</code> when online, <code>false</code> when offline.</li>
        <li>Cleans up both event listeners on unmount.</li>
      </ul>

      {/* Demo — Network Status */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Demo — Network Status</div>
        <div className="card-body text-center">
          <div className="my-3">
            <span
              className={`badge fs-4 px-4 py-3 ${isOnline ? "bg-success" : "bg-danger"}`}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>

          <div className={`alert ${isOnline ? "alert-success" : "alert-danger"} mb-0`}>
            {isOnline
              ? "You are connected to the internet."
              : "You have lost your internet connection."}
          </div>
        </div>
        <div className="card-footer small">
          <strong>How to test:</strong> Open DevTools → Network tab →
          toggle the <strong>Offline</strong> checkbox and watch the badge change.
        </div>
      </div>

      {/* Code hint */}
      <h5>Code Hint</h5>
      <code className="snippet">{
`const isOnline = useOnlineStatus()

// Inside useOnlineStatus:
const [isOnline, setIsOnline] = useState(navigator.onLine)

useEffect(() => {
  const goOnline  = () => setIsOnline(true)
  const goOffline = () => setIsOnline(false)
  window.addEventListener("online", goOnline)
  window.addEventListener("offline", goOffline)
  return () => {
    window.removeEventListener("online", goOnline)
    window.removeEventListener("offline", goOffline)
  }
}, [])`
      }</code>
    </div>
  )
}
