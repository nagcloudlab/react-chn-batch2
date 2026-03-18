import Clock from '../Clock';

function PropsDemo() {
  return (
    <section id="props">
      <h2>Props & useEffect</h2>
      <p className="lead">
        Props let you pass data from parent to child components. Combined with <code>useEffect</code>,
        you can run side effects when props change.
      </p>
      <ul>
        <li><strong>Props</strong> &mdash; read-only data passed to a component via attributes</li>
        <li><strong>Default values</strong> &mdash; fallback when a prop is not provided</li>
        <li><strong>useEffect</strong> &mdash; runs side effects (timers, subscriptions) after render</li>
        <li><strong>Cleanup function</strong> &mdash; returned from useEffect to prevent memory leaks</li>
      </ul>

      <div className="card demo-card">
        <div className="card-header">
          <strong>Live Clocks</strong> &mdash; each receives a different <code>timeZone</code> prop
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <Clock />
            </div>
            <div className="col-md-4">
              <Clock timeZone="Asia/Dubai" />
            </div>
            <div className="col-md-4">
              <Clock timeZone="America/New_York" />
            </div>
          </div>
        </div>
      </div>

      <div className="code-snippet">
        <code>&lt;Clock /&gt;</code> uses default <code>Asia/Kolkata</code> &bull;{' '}
        <code>&lt;Clock timeZone="Asia/Dubai" /&gt;</code> overrides via prop
      </div>
    </section>
  );
}

export default PropsDemo;
