import { createContext, useContext, useState, useCallback } from 'react'

const NotificationContext = createContext()

let nextId = 1

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((message, type = 'info') => {
    const id = nextId++
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}

function NotificationList() {
  const { notifications, removeNotification } = useNotifications()

  if (notifications.length === 0) return null

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1050, width: 300 }}>
      {notifications.map(n => (
        <div key={n.id} className={`alert alert-${n.type} alert-dismissible py-2 mb-2`}>
          {n.message}
          <button type="button" className="btn-close py-2" onClick={() => removeNotification(n.id)} />
        </div>
      ))}
    </div>
  )
}

// Deeply nested components that consume notifications
function Toolbar() {
  const { addNotification } = useNotifications()
  return (
    <div className="d-flex gap-2 mb-3">
      <button className="btn btn-info btn-sm" onClick={() => addNotification('Info message!', 'info')}>
        Info
      </button>
      <button className="btn btn-success btn-sm" onClick={() => addNotification('Success!', 'success')}>
        Success
      </button>
      <button className="btn btn-warning btn-sm" onClick={() => addNotification('Warning!', 'warning')}>
        Warning
      </button>
      <button className="btn btn-danger btn-sm" onClick={() => addNotification('Error occurred!', 'danger')}>
        Error
      </button>
    </div>
  )
}

function DeepChild() {
  const { addNotification } = useNotifications()
  return (
    <div className="border rounded p-2 bg-light">
      <small className="text-muted d-block mb-1">Deeply nested component:</small>
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={() => addNotification('Hello from deep child!', 'primary')}
      >
        Notify from deep child
      </button>
    </div>
  )
}

function MiddleComponent() {
  return (
    <div className="border rounded p-3 mb-3">
      <p className="mb-2 text-muted">Middle component (passes nothing down)</p>
      <DeepChild />
    </div>
  )
}

function DemoApp() {
  return (
    <NotificationProvider>
      <NotificationList />
      <Toolbar />
      <MiddleComponent />
    </NotificationProvider>
  )
}

export default function ProviderPatternDemo() {
  return (
    <div>
      <h2>Provider Pattern</h2>
      <p className="lead">
        Share state deeply without prop drilling using Context + Provider.
      </p>

      <ul className="mb-4">
        <li>Wrap a subtree with a Provider that holds shared state</li>
        <li>Any descendant can consume via <code>useContext</code> — no matter how deep</li>
        <li>Pair with a custom hook (<code>useNotifications</code>) for a clean API</li>
        <li>Middle components don&apos;t need to know about the shared state at all</li>
        <li>Perfect for themes, auth, notifications, and feature flags</li>
      </ul>

      <div className="card mb-4">
        <div className="card-header">Live Demo — Notification System</div>
        <div className="card-body">
          <DemoApp />
        </div>
      </div>

      <code className="snippet">{`const NotificationContext = createContext()

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const addNotification = useCallback((message, type) => {
    setNotifications(prev => [...prev, { id: nextId++, message, type }])
  }, [])
  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

function useNotifications() {
  return useContext(NotificationContext)
}

// Any deeply nested component can call:
const { addNotification } = useNotifications()
addNotification('Hello!', 'success')`}</code>
    </div>
  )
}
