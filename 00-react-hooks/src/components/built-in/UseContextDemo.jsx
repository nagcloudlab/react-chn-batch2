import { createContext, useContext, useState } from 'react'

// --- Context defined in the same file ---
const ThemeContext = createContext('light')

// --- Child component that consumes context ---
function ThemedBox() {
  const theme = useContext(ThemeContext)

  const styles = {
    light: {
      backgroundColor: '#ffffff',
      color: '#212529',
      border: '1px solid #dee2e6',
    },
    dark: {
      backgroundColor: '#212529',
      color: '#f8f9fa',
      border: '1px solid #495057',
    },
  }

  return (
    <div className="p-4 rounded" style={styles[theme]}>
      <h5 className="mb-2">ThemedBox Component</h5>
      <p className="mb-1">
        I am a <strong>child</strong> component reading from <code>ThemeContext</code>.
      </p>
      <p className="mb-0">
        Current theme: <span className="badge bg-info text-dark">{theme}</span>
      </p>
    </div>
  )
}

export default function UseContextDemo() {
  const [theme, setTheme] = useState('light')

  function toggleTheme() {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <div>
      <h2>useContext</h2>
      <p className="lead">
        Reads a value from a React context -- the easiest way to share data
        without passing props manually at every level.
      </p>

      {/* Bullet-point explanation */}
      <ul className="mb-4">
        <li>Avoids <strong>prop drilling</strong> by letting any descendant read shared data directly.</li>
        <li>Shares data across the <strong>entire component tree</strong> beneath a Provider.</li>
        <li>Every consumer <strong>re-renders</strong> whenever the context value changes.</li>
        <li>Combine with <strong>useReducer</strong> for managing complex shared state (mini Redux pattern).</li>
        <li>The context must be created with <code>createContext</code> and supplied via a <code>&lt;Provider&gt;</code> wrapper.</li>
      </ul>

      {/* Demo -- Theme toggle */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Demo -- Light / Dark Theme Toggle</div>
        <div className="card-body">
          <div className="mb-3 d-flex align-items-center gap-3">
            <button className="btn btn-outline-primary btn-sm" onClick={toggleTheme}>
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
            </button>
            <span className="text-muted">
              Active theme: <strong>{theme}</strong>
            </span>
          </div>

          {/* Provider wraps the child that consumes context */}
          <ThemeContext.Provider value={theme}>
            <ThemedBox />
          </ThemeContext.Provider>
        </div>
      </div>

      {/* Code hint */}
      <h5>Code Hint</h5>
      <code className="snippet">{
`// 1. Create a context
const ThemeContext = createContext('light')

// 2. Provide it higher in the tree
<ThemeContext.Provider value={theme}>
  <ChildComponent />
</ThemeContext.Provider>

// 3. Consume it in any child
const value = useContext(MyContext)`
      }</code>
    </div>
  )
}
