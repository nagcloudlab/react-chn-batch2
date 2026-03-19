import { useState, useRef } from 'react'

function ControlledForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted({ name, email })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label className="form-label">Name</label>
        <input
          className="form-control"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label className="form-label">Email</label>
        <input
          className="form-control"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <button className="btn btn-primary btn-sm" type="submit">Submit</button>
      {submitted && (
        <div className="alert alert-success mt-2 mb-0 py-1">
          Submitted: {submitted.name} ({submitted.email})
        </div>
      )}
    </form>
  )
}

function UncontrolledForm() {
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const [submitted, setSubmitted] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted({
      name: nameRef.current.value,
      email: emailRef.current.value,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label className="form-label">Name</label>
        <input className="form-control" ref={nameRef} defaultValue="" />
      </div>
      <div className="mb-2">
        <label className="form-label">Email</label>
        <input className="form-control" type="email" ref={emailRef} defaultValue="" />
      </div>
      <button className="btn btn-secondary btn-sm" type="submit">Submit</button>
      {submitted && (
        <div className="alert alert-success mt-2 mb-0 py-1">
          Submitted: {submitted.name} ({submitted.email})
        </div>
      )}
    </form>
  )
}

export default function ControlledUncontrolledDemo() {
  return (
    <div>
      <h2>Controlled vs Uncontrolled Components</h2>
      <p className="lead">
        Two strategies for managing form state — React state vs DOM state.
      </p>

      <ul className="mb-4">
        <li><strong>Controlled:</strong> React state is the single source of truth via <code>value</code> + <code>onChange</code></li>
        <li><strong>Uncontrolled:</strong> the DOM owns the value; you read it via <code>ref</code> when needed</li>
        <li>Controlled gives you instant validation, conditional disabling, and formatting</li>
        <li>Uncontrolled is simpler for quick forms or third-party DOM integrations</li>
        <li>Most React apps default to controlled; uncontrolled is fine for simple cases</li>
      </ul>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">Controlled Form</div>
            <div className="card-body">
              <ControlledForm />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-secondary text-white">Uncontrolled Form</div>
            <div className="card-body">
              <UncontrolledForm />
            </div>
          </div>
        </div>
      </div>

      <code className="snippet">{`// Controlled — React owns the value
const [name, setName] = useState('')
<input value={name} onChange={e => setName(e.target.value)} />

// Uncontrolled — DOM owns the value
const nameRef = useRef(null)
<input ref={nameRef} defaultValue="" />
// Read later: nameRef.current.value`}</code>
    </div>
  )
}
