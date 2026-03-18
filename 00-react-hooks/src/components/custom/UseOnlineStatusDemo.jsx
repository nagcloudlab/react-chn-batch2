import { useOnlineStatus } from "../../hooks/useOnlineStatus";

export default function UseOnlineStatusDemo() {
  const isOnline = useOnlineStatus();

  return (
    <div className="container mt-4">
      <h2>useOnlineStatus</h2>

      <ul>
        <li>A custom hook that tracks the browser's <strong>network connectivity</strong></li>
        <li>Uses <code>navigator.onLine</code> for the initial online/offline state</li>
        <li>Listens to the <strong>online</strong> and <strong>offline</strong> window events</li>
        <li>Returns a boolean: <code>true</code> when online, <code>false</code> when offline</li>
        <li>Cleans up both event listeners on unmount</li>
      </ul>

      <div className="card">
        <div className="card-body text-center">
          <h5 className="card-title">Network Status</h5>

          <div className="my-4">
            <span
              className={`badge fs-4 px-4 py-3 ${isOnline ? "bg-success" : "bg-danger"}`}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>

          <div
            className={`alert ${isOnline ? "alert-success" : "alert-danger"}`}
          >
            {isOnline
              ? "You are connected to the internet."
              : "You have lost your internet connection."}
          </div>

          <div className="alert alert-info text-start">
            <strong>How to test:</strong>
            <ol className="mb-0 mt-2">
              <li>Open DevTools (F12 or Cmd+Option+I)</li>
              <li>Go to the <strong>Network</strong> tab</li>
              <li>Toggle the <strong>Offline</strong> checkbox (or select "Offline" from the throttling dropdown)</li>
              <li>Watch the badge change from green to red in real time</li>
            </ol>
          </div>
        </div>
      </div>

      <pre className="code snippet mt-4">
{`export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() { setIsOnline(true); }
    function handleOffline() { setIsOnline(false); }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}`}
      </pre>
    </div>
  );
}
