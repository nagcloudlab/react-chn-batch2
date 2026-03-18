import { useState } from 'react'
import './App.css'

import Home from './components/Home'
import UseStateDemo from './components/built-in/UseStateDemo'
import UseEffectDemo from './components/built-in/UseEffectDemo'
import UseRefDemo from './components/built-in/UseRefDemo'
import UseMemoDemo from './components/built-in/UseMemoDemo'
import UseCallbackDemo from './components/built-in/UseCallbackDemo'
import UseReducerDemo from './components/built-in/UseReducerDemo'
import UseContextDemo from './components/built-in/UseContextDemo'
import UseIdDemo from './components/built-in/UseIdDemo'
import UseTransitionDemo from './components/built-in/UseTransitionDemo'
import UseDeferredValueDemo from './components/built-in/UseDeferredValueDemo'
import UseLayoutEffectDemo from './components/built-in/UseLayoutEffectDemo'

import UseFetchDemo from './components/custom/UseFetchDemo'
import UseLocalStorageDemo from './components/custom/UseLocalStorageDemo'
import UseDebounceDemo from './components/custom/UseDebounceDemo'
import UseToggleDemo from './components/custom/UseToggleDemo'
import UseWindowSizeDemo from './components/custom/UseWindowSizeDemo'
import UsePreviousDemo from './components/custom/UsePreviousDemo'
import UseClickOutsideDemo from './components/custom/UseClickOutsideDemo'
import UseOnlineStatusDemo from './components/custom/UseOnlineStatusDemo'

const builtInHooks = [
  { key: 'useState', label: 'useState', component: UseStateDemo },
  { key: 'useEffect', label: 'useEffect', component: UseEffectDemo },
  { key: 'useRef', label: 'useRef', component: UseRefDemo },
  { key: 'useMemo', label: 'useMemo', component: UseMemoDemo },
  { key: 'useCallback', label: 'useCallback', component: UseCallbackDemo },
  { key: 'useReducer', label: 'useReducer', component: UseReducerDemo },
  { key: 'useContext', label: 'useContext', component: UseContextDemo },
  { key: 'useId', label: 'useId', component: UseIdDemo },
  { key: 'useTransition', label: 'useTransition', component: UseTransitionDemo },
  { key: 'useDeferredValue', label: 'useDeferredValue', component: UseDeferredValueDemo },
  { key: 'useLayoutEffect', label: 'useLayoutEffect', component: UseLayoutEffectDemo },
]

const customHooks = [
  { key: 'useFetch', label: 'useFetch', component: UseFetchDemo },
  { key: 'useLocalStorage', label: 'useLocalStorage', component: UseLocalStorageDemo },
  { key: 'useDebounce', label: 'useDebounce', component: UseDebounceDemo },
  { key: 'useToggle', label: 'useToggle', component: UseToggleDemo },
  { key: 'useWindowSize', label: 'useWindowSize', component: UseWindowSizeDemo },
  { key: 'usePrevious', label: 'usePrevious', component: UsePreviousDemo },
  { key: 'useClickOutside', label: 'useClickOutside', component: UseClickOutsideDemo },
  { key: 'useOnlineStatus', label: 'useOnlineStatus', component: UseOnlineStatusDemo },
]

export default function App() {
  const [activeHook, setActiveHook] = useState('home')

  const allHooks = [...builtInHooks, ...customHooks]
  const found = allHooks.find(h => h.key === activeHook)
  const ActiveComponent = found ? found.component : Home

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <h4 className="px-3 mb-3">React Hooks</h4>

        <div
          className={`nav-link ${activeHook === 'home' ? 'active' : ''}`}
          onClick={() => setActiveHook('home')}
        >
          Home
        </div>

        <hr className="mx-3" />
        <h5>Built-in Hooks</h5>
        {builtInHooks.map(h => (
          <div
            key={h.key}
            className={`nav-link ${activeHook === h.key ? 'active' : ''}`}
            onClick={() => setActiveHook(h.key)}
          >
            {h.label}
          </div>
        ))}

        <hr className="mx-3" />
        <h5>Custom Hooks</h5>
        {customHooks.map(h => (
          <div
            key={h.key}
            className={`nav-link ${activeHook === h.key ? 'active' : ''}`}
            onClick={() => setActiveHook(h.key)}
          >
            {h.label}
          </div>
        ))}
      </nav>

      <main className="main-content">
        <ActiveComponent />
      </main>
    </div>
  )
}
