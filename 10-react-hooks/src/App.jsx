import { useState } from 'react'
import './App.css'

import Home from './components/Home'

// ─── Built-in Hooks ──────────────────────────────────────────────
// Group 1 — State & Lifecycle
import UseStateDemo from './components/built-in/UseStateDemo'
import UseEffectDemo from './components/built-in/UseEffectDemo'
import UseReducerDemo from './components/built-in/UseReducerDemo'

// Group 2 — Refs & DOM
import UseRefDemo from './components/built-in/UseRefDemo'
import UseIdDemo from './components/built-in/UseIdDemo'
import UseLayoutEffectDemo from './components/built-in/UseLayoutEffectDemo'

// Group 3 — Performance
import UseMemoDemo from './components/built-in/UseMemoDemo'
import UseCallbackDemo from './components/built-in/UseCallbackDemo'

// Group 4 — Context
import UseContextDemo from './components/built-in/UseContextDemo'

// Group 5 — Concurrent Rendering
import UseTransitionDemo from './components/built-in/UseTransitionDemo'
import UseDeferredValueDemo from './components/built-in/UseDeferredValueDemo'

// ─── Custom Hooks ────────────────────────────────────────────────
// Group 1 — Data
import UseFetchDemo from './components/custom/UseFetchDemo'
import UseLocalStorageDemo from './components/custom/UseLocalStorageDemo'

// Group 2 — UI
import UseToggleDemo from './components/custom/UseToggleDemo'
import UseClickOutsideDemo from './components/custom/UseClickOutsideDemo'
import UseWindowSizeDemo from './components/custom/UseWindowSizeDemo'

// Group 3 — Timing
import UseDebounceDemo from './components/custom/UseDebounceDemo'
import UsePreviousDemo from './components/custom/UsePreviousDemo'

// Group 4 — Browser
import UseOnlineStatusDemo from './components/custom/UseOnlineStatusDemo'

// ─── Hook registry (grouped by category) ────────────────────────

const builtInGroups = [
  {
    category: 'State & Lifecycle',
    hooks: [
      { key: 'useState',    label: 'useState',    component: UseStateDemo },
      { key: 'useEffect',   label: 'useEffect',   component: UseEffectDemo },
      { key: 'useReducer',  label: 'useReducer',  component: UseReducerDemo },
    ],
  },
  {
    category: 'Refs & DOM',
    hooks: [
      { key: 'useRef',          label: 'useRef',          component: UseRefDemo },
      { key: 'useId',           label: 'useId',           component: UseIdDemo },
      { key: 'useLayoutEffect', label: 'useLayoutEffect', component: UseLayoutEffectDemo },
    ],
  },
  {
    category: 'Performance',
    hooks: [
      { key: 'useMemo',     label: 'useMemo',     component: UseMemoDemo },
      { key: 'useCallback', label: 'useCallback', component: UseCallbackDemo },
    ],
  },
  {
    category: 'Context',
    hooks: [
      { key: 'useContext', label: 'useContext', component: UseContextDemo },
    ],
  },
  {
    category: 'Concurrent',
    hooks: [
      { key: 'useTransition',    label: 'useTransition',    component: UseTransitionDemo },
      { key: 'useDeferredValue', label: 'useDeferredValue', component: UseDeferredValueDemo },
    ],
  },
]

const customGroups = [
  {
    category: 'Data',
    hooks: [
      { key: 'useFetch',        label: 'useFetch',        component: UseFetchDemo },
      { key: 'useLocalStorage', label: 'useLocalStorage', component: UseLocalStorageDemo },
    ],
  },
  {
    category: 'UI',
    hooks: [
      { key: 'useToggle',       label: 'useToggle',       component: UseToggleDemo },
      { key: 'useClickOutside', label: 'useClickOutside', component: UseClickOutsideDemo },
      { key: 'useWindowSize',   label: 'useWindowSize',   component: UseWindowSizeDemo },
    ],
  },
  {
    category: 'Timing',
    hooks: [
      { key: 'useDebounce',  label: 'useDebounce',  component: UseDebounceDemo },
      { key: 'usePrevious',  label: 'usePrevious',  component: UsePreviousDemo },
    ],
  },
  {
    category: 'Browser',
    hooks: [
      { key: 'useOnlineStatus', label: 'useOnlineStatus', component: UseOnlineStatusDemo },
    ],
  },
]

// Flatten all hooks for quick lookup
const allHooks = [
  ...builtInGroups.flatMap(g => g.hooks),
  ...customGroups.flatMap(g => g.hooks),
]

export default function App() {
  const [activeHook, setActiveHook] = useState('home')

  const found = allHooks.find(h => h.key === activeHook)
  const ActiveComponent = found ? found.component : Home

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <h4 className="px-3 mb-3">React Hooks</h4>

        {/* Home link */}
        <div
          className={`nav-link ${activeHook === 'home' ? 'active' : ''}`}
          onClick={() => setActiveHook('home')}
        >
          Home
        </div>

        {/* ── Built-in Hooks ── */}
        <hr className="mx-3" />
        <h5>Built-in Hooks</h5>

        {builtInGroups.map(group => (
          <div key={group.category}>
            <div className="sidebar-category">{group.category}</div>
            {group.hooks.map(h => (
              <div
                key={h.key}
                className={`nav-link ${activeHook === h.key ? 'active' : ''}`}
                onClick={() => setActiveHook(h.key)}
              >
                {h.label}
              </div>
            ))}
          </div>
        ))}

        {/* ── Custom Hooks ── */}
        <hr className="mx-3" />
        <h5>Custom Hooks</h5>

        {customGroups.map(group => (
          <div key={group.category}>
            <div className="sidebar-category">{group.category}</div>
            {group.hooks.map(h => (
              <div
                key={h.key}
                className={`nav-link ${activeHook === h.key ? 'active' : ''}`}
                onClick={() => setActiveHook(h.key)}
              >
                {h.label}
              </div>
            ))}
          </div>
        ))}
      </nav>

      <main className="main-content">
        <ActiveComponent />
      </main>
    </div>
  )
}
