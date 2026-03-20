import { useState, useEffect } from 'react'

// Presentational: pure props, no data fetching
function UserList({ users, selectedId, onSelect }) {
  return (
    <ul className="list-group">
      {users.map(user => (
        <li
          key={user.id}
          className={`list-group-item list-group-item-action ${selectedId === user.id ? 'active' : ''}`}
          onClick={() => onSelect(user.id)}
          style={{ cursor: 'pointer' }}
        >
          {user.name}
        </li>
      ))}
    </ul>
  )
}

// Presentational: just displays data
function UserDetail({ user }) {
  if (!user) return <p className="text-muted">Select a user from the list.</p>

  return (
    <div>
      <h5>{user.name}</h5>
      <table className="table table-sm">
        <tbody>
          <tr><td className="fw-bold">Email</td><td>{user.email}</td></tr>
          <tr><td className="fw-bold">Phone</td><td>{user.phone}</td></tr>
          <tr><td className="fw-bold">Company</td><td>{user.company.name}</td></tr>
          <tr><td className="fw-bold">Website</td><td>{user.website}</td></tr>
        </tbody>
      </table>
    </div>
  )
}

// Container: owns state and data fetching
function UserContainer() {
  const [users, setUsers] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
  }, [])

  const selectedUser = users.find(u => u.id === selectedId) || null

  if (loading) return <div className="text-center p-3"><div className="spinner-border" /></div>

  return (
    <div className="row">
      <div className="col-md-5">
        <UserList users={users} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
      <div className="col-md-7">
        <UserDetail user={selectedUser} />
      </div>
    </div>
  )
}

export default function ContainerPresentationalDemo() {
  return (
    <div>
      <h2>Container / Presentational</h2>
      <p className="lead">
        Separate data-fetching logic (container) from rendering (presentational).
      </p>

      <ul className="mb-4">
        <li><strong>Container:</strong> fetches data, manages state, passes props down</li>
        <li><strong>Presentational:</strong> receives props, renders UI — no side effects</li>
        <li>Presentational components are easy to test and reuse</li>
        <li>Container components can be swapped (e.g., mock data for tests)</li>
        <li>Modern alternative: custom hooks replace containers — but the split is still valuable</li>
      </ul>

      <div className="card mb-4">
        <div className="card-header">Live Demo — User Directory (JSONPlaceholder)</div>
        <div className="card-body">
          <UserContainer />
        </div>
      </div>

      <code className="snippet">{`// Container — owns state & effects
function UserContainer() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers)
  }, [])
  return <UserList users={users} onSelect={setSelected} />
}

// Presentational — pure props
function UserList({ users, onSelect }) {
  return users.map(u => (
    <li key={u.id} onClick={() => onSelect(u.id)}>{u.name}</li>
  ))
}`}</code>
    </div>
  )
}
