function Card({ header, footer, children }) {
  return (
    <div className="card">
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer text-muted">{footer}</div>}
    </div>
  )
}

function PageLayout({ sidebar, header, children }) {
  return (
    <div className="border rounded overflow-hidden">
      {header && (
        <div className="bg-dark text-white p-2 px-3">{header}</div>
      )}
      <div className="d-flex">
        {sidebar && (
          <div className="bg-light border-end p-3" style={{ width: 180 }}>
            {sidebar}
          </div>
        )}
        <div className="p-3 flex-grow-1">{children}</div>
      </div>
    </div>
  )
}

export default function SlotsCompositionDemo() {
  return (
    <div>
      <h2>Slots &amp; Composition</h2>
      <p className="lead">
        Pass JSX as props to create flexible, reusable layout components.
      </p>

      <ul className="mb-4">
        <li><code>children</code> is the default slot — any JSX between open/close tags</li>
        <li>Named slots use regular props: <code>header</code>, <code>footer</code>, <code>sidebar</code></li>
        <li>The layout component decides <em>where</em> to render each slot</li>
        <li>Avoids deep nesting and rigid hierarchies</li>
        <li>Preferred over HOCs for most layout use cases</li>
      </ul>

      <div className="card mb-4">
        <div className="card-header">Live Demo — Card with Slots</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <Card
                header={<strong>Full Card</strong>}
                footer="Last updated: today"
              >
                This card has a header, body, and footer slot.
              </Card>
            </div>
            <div className="col-md-4">
              <Card header={<strong>Header Only</strong>}>
                This card has no footer slot.
              </Card>
            </div>
            <div className="col-md-4">
              <Card>
                This card uses only the default <code>children</code> slot.
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">Live Demo — PageLayout with Named Slots</div>
        <div className="card-body">
          <PageLayout
            header={<strong>My Application</strong>}
            sidebar={
              <ul className="list-unstyled mb-0">
                <li>Dashboard</li>
                <li>Settings</li>
                <li>Profile</li>
              </ul>
            }
          >
            <h5>Main Content</h5>
            <p className="mb-0">
              The sidebar, header, and body are all composed via named slots.
              The layout component decides where each piece goes.
            </p>
          </PageLayout>
        </div>
      </div>

      <code className="snippet">{`function Card({ header, footer, children }) {
  return (
    <div className="card">
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  )
}

// Usage:
<Card
  header={<strong>Title</strong>}
  footer="Footer text"
>
  Body content goes here
</Card>`}</code>
    </div>
  )
}
