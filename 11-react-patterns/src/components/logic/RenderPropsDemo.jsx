import { useState, useCallback } from 'react'

function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPosition({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    })
  }, [])

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        height: 200,
        border: '2px dashed #dee2e6',
        borderRadius: 8,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'crosshair',
      }}
    >
      {render(position)}
    </div>
  )
}

function CoordsDisplay({ x, y }) {
  return (
    <div className="d-flex align-items-center justify-content-center h-100">
      <span className="badge bg-dark fs-6">
        x: {x}, y: {y}
      </span>
    </div>
  )
}

function FollowingDot({ x, y }) {
  return (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        backgroundColor: '#0d6efd',
        position: 'absolute',
        left: x - 10,
        top: y - 10,
        transition: 'left 0.05s, top 0.05s',
        pointerEvents: 'none',
      }}
    />
  )
}

function ColorGradient({ x, y }) {
  const hue = Math.round((x / 400) * 360) % 360
  const lightness = Math.round(30 + (y / 200) * 40)

  return (
    <div
      className="d-flex align-items-center justify-content-center h-100"
      style={{
        backgroundColor: `hsl(${hue}, 70%, ${lightness}%)`,
        transition: 'background-color 0.1s',
      }}
    >
      <span className="badge bg-light text-dark">
        hsl({hue}, 70%, {lightness}%)
      </span>
    </div>
  )
}

export default function RenderPropsDemo() {
  return (
    <div>
      <h2>Render Props</h2>
      <p className="lead">
        Share behavior between components by passing a function that returns JSX.
      </p>

      <ul className="mb-4">
        <li>A component receives a <code>render</code> function prop and calls it with data</li>
        <li>The consumer decides <em>what</em> to render; the provider decides <em>when</em> and <em>what data</em></li>
        <li>Enables code reuse without HOCs or inheritance</li>
        <li>Same <code>MouseTracker</code> drives 3 different UIs below</li>
        <li>Modern alternative: custom hooks — but render props still shine for component-level sharing</li>
      </ul>

      <div className="card mb-3">
        <div className="card-header">Consumer 1 — Text Coordinates</div>
        <div className="card-body p-0">
          <MouseTracker render={({ x, y }) => <CoordsDisplay x={x} y={y} />} />
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header">Consumer 2 — Following Dot</div>
        <div className="card-body p-0">
          <MouseTracker render={({ x, y }) => <FollowingDot x={x} y={y} />} />
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header">Consumer 3 — Color Gradient</div>
        <div className="card-body p-0">
          <MouseTracker render={({ x, y }) => <ColorGradient x={x} y={y} />} />
        </div>
      </div>

      <code className="snippet">{`function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  return (
    <div onMouseMove={handleMouseMove}>
      {render(position)}
    </div>
  )
}

// 3 different consumers, same tracker:
<MouseTracker render={({ x, y }) => <CoordsDisplay x={x} y={y} />} />
<MouseTracker render={({ x, y }) => <FollowingDot x={x} y={y} />} />
<MouseTracker render={({ x, y }) => <ColorGradient x={x} y={y} />} />`}</code>
    </div>
  )
}
