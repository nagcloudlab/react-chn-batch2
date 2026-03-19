import { useState } from 'react'
import './App.css'

import Home from './components/Home'
import CompoundComponentsDemo from './components/compound/CompoundComponentsDemo'
import HOCDemo from './components/compound/HOCDemo'
import ControlledUncontrolledDemo from './components/compound/ControlledUncontrolledDemo'
import ContainerPresentationalDemo from './components/compound/ContainerPresentationalDemo'
import SlotsCompositionDemo from './components/compound/SlotsCompositionDemo'

import RenderPropsDemo from './components/logic/RenderPropsDemo'
import CustomHookExtractionDemo from './components/logic/CustomHookExtractionDemo'
import ProviderPatternDemo from './components/logic/ProviderPatternDemo'
import StateReducerDemo from './components/logic/StateReducerDemo'
import PropGettersDemo from './components/logic/PropGettersDemo'

const componentPatterns = [
  { key: 'compound', label: 'Compound Components', component: CompoundComponentsDemo },
  { key: 'hoc', label: 'Higher-Order Components', component: HOCDemo },
  { key: 'controlled', label: 'Controlled vs Uncontrolled', component: ControlledUncontrolledDemo },
  { key: 'container', label: 'Container / Presentational', component: ContainerPresentationalDemo },
  { key: 'slots', label: 'Slots & Composition', component: SlotsCompositionDemo },
]

const logicPatterns = [
  { key: 'renderprops', label: 'Render Props', component: RenderPropsDemo },
  { key: 'customhook', label: 'Custom Hook Extraction', component: CustomHookExtractionDemo },
  { key: 'provider', label: 'Provider Pattern', component: ProviderPatternDemo },
  { key: 'statereducer', label: 'State Reducer', component: StateReducerDemo },
  { key: 'propgetters', label: 'Prop Getters', component: PropGettersDemo },
]

export default function App() {
  const [activePage, setActivePage] = useState('home')

  const allPatterns = [...componentPatterns, ...logicPatterns]
  const found = allPatterns.find(p => p.key === activePage)
  const ActiveComponent = found ? found.component : Home

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <h4 className="px-3 mb-3">React Patterns</h4>

        <div
          className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => setActivePage('home')}
        >
          Home
        </div>

        <hr className="mx-3" />
        <h5>Component Patterns</h5>
        {componentPatterns.map(p => (
          <div
            key={p.key}
            className={`nav-link ${activePage === p.key ? 'active' : ''}`}
            onClick={() => setActivePage(p.key)}
          >
            {p.label}
          </div>
        ))}

        <hr className="mx-3" />
        <h5>Logic Patterns</h5>
        {logicPatterns.map(p => (
          <div
            key={p.key}
            className={`nav-link ${activePage === p.key ? 'active' : ''}`}
            onClick={() => setActivePage(p.key)}
          >
            {p.label}
          </div>
        ))}
      </nav>

      <main className="main-content">
        <ActiveComponent />
      </main>
    </div>
  )
}
