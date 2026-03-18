import { useState, useRef, useLayoutEffect } from 'react'

export default function UseLayoutEffectDemo() {
  const [showBox, setShowBox] = useState(false)
  const [tooltipStyle, setTooltipStyle] = useState({})
  const boxRef = useRef(null)

  // Measure the box's position synchronously before paint
  useLayoutEffect(() => {
    if (showBox && boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect()
      setTooltipStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
  }, [showBox])

  return (
    <div>
      <h2>useLayoutEffect</h2>
      <p className="lead">
        Fires synchronously after DOM mutations but before the browser paints --
        ideal for measuring and adjusting layout.
      </p>

      {/* Bullet-point explanation */}
      <ul className="mb-4">
        <li>Fires <strong>synchronously</strong> after all DOM mutations, before the browser has a chance to paint.</li>
        <li>Runs <strong>before the browser paint</strong>, so the user never sees an intermediate (incorrect) layout.</li>
        <li>Perfect for <strong>DOM measurements</strong> -- reading <code>getBoundingClientRect()</code>, scroll positions, or computed styles and then immediately applying corrections.</li>
        <li>Prefer <strong>useEffect</strong> for most side effects; only reach for useLayoutEffect when you need layout measurements or need to prevent visual flicker.</li>
      </ul>

      {/* Demo -- Tooltip positioned via DOM measurement */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Demo -- Measured Tooltip</div>
        <div className="card-body" style={{ position: 'relative', minHeight: 200 }}>
          <p className="text-muted mb-3">
            Click the button to toggle a box. A tooltip is positioned directly
            below it using dimensions measured in <code>useLayoutEffect</code> --
            no flicker.
          </p>

          <button
            className="btn btn-primary mb-3"
            onClick={() => setShowBox(prev => !prev)}
          >
            {showBox ? 'Hide Box' : 'Show Box'}
          </button>

          {showBox && (
            <>
              {/* The box we measure */}
              <div
                ref={boxRef}
                className="border border-primary rounded p-3 text-center fw-semibold"
                style={{
                  width: 260,
                  backgroundColor: '#e7f1ff',
                  color: '#0d6efd',
                }}
              >
                Measured Box (260 px)
              </div>

              {/* Tooltip positioned via useLayoutEffect */}
              <div
                className="alert alert-info py-2 px-3 mb-0 shadow-sm"
                style={{
                  ...tooltipStyle,
                  fontSize: '0.85rem',
                  zIndex: 10,
                }}
              >
                <strong>Tooltip</strong> -- I am exactly as wide as the box above
                ({Math.round(tooltipStyle.width || 0)}px) and placed 8 px below it.
              </div>
            </>
          )}

          {!showBox && (
            <div className="alert alert-light mb-0">
              The box is hidden. Click <strong>Show Box</strong> to see the measured tooltip.
            </div>
          )}
        </div>
      </div>

      {/* Why not useEffect? */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Why not useEffect?</div>
        <div className="card-body">
          <p className="mb-0">
            <code>useEffect</code> runs <em>after</em> the browser paints. If we
            measured the box there and then updated the tooltip position, the user
            would briefly see the tooltip in the wrong spot (a flash of incorrect
            layout). <code>useLayoutEffect</code> avoids this by running{' '}
            <strong>before</strong> the paint, so the tooltip appears in the
            correct position on the very first frame.
          </p>
        </div>
      </div>

      {/* Code hint */}
      <h5>Code Hint</h5>
      <code className="snippet">{
        `useLayoutEffect(() => {
  // Runs synchronously after DOM mutations, before paint
  const rect = ref.current.getBoundingClientRect()
  setPosition({ top: rect.bottom + 8, left: rect.left })
}, [deps])

// Prefer useEffect for side effects that don't need layout info
// useLayoutEffect blocks paint -- keep the callback fast`
      }</code>
    </div>
  )
}
