import { useWindowSize } from "../../hooks/useWindowSize";

export default function UseWindowSizeDemo() {
  const { width, height } = useWindowSize();

  const deviceLabel =
    width < 768 ? "Mobile" : width < 1024 ? "Tablet" : "Desktop";

  const badgeColor =
    width < 768
      ? "bg-warning text-dark"
      : width < 1024
        ? "bg-info text-dark"
        : "bg-success";

  return (
    <div className="container mt-4">
      <h2>useWindowSize</h2>

      <ul>
        <li>A custom hook that tracks the browser window dimensions</li>
        <li>Returns an object with <code>width</code> and <code>height</code> properties</li>
        <li>Attaches a <strong>resize</strong> event listener inside useEffect</li>
        <li>Cleans up the listener on unmount to prevent memory leaks</li>
        <li>Re-renders the component automatically whenever the window is resized</li>
      </ul>

      <div className="card">
        <div className="card-body text-center">
          <h5 className="card-title">Resize your browser window</h5>
          <p className="fs-4">
            Width: <strong>{width}px</strong> | Height:{" "}
            <strong>{height}px</strong>
          </p>
          <span className={`badge ${badgeColor} fs-5 px-4 py-2`}>
            {deviceLabel}
          </span>
          <p className="text-muted mt-3 mb-0">
            Mobile &lt; 768px | Tablet &lt; 1024px | Desktop &ge; 1024px
          </p>
        </div>
      </div>

      <pre className="code snippet mt-4">
{`export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}`}
      </pre>
    </div>
  );
}
