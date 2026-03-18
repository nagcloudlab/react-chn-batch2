import { useState } from 'react';

import Sidebar from './components/Sidebar';
import PropsDemo from './components/sections/PropsDemo';
import StateDemo from './components/sections/StateDemo';
import ReducerDemo from './components/sections/ReducerDemo';
import ContextDemo from './components/sections/ContextDemo';

import './App.css';

const demos = {
  props: PropsDemo,
  state: StateDemo,
  reducer: ReducerDemo,
  context: ContextDemo,
};

function App() {
  const [activeSection, setActiveSection] = useState('props');
  const ActiveDemo = demos[activeSection];

  return (
    <div className="app-layout">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="main-content">
        <ActiveDemo />
      </main>
    </div>
  );
}

export default App;
