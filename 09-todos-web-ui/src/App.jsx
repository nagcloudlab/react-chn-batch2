import { useReducer } from "react";
import TodoFooter from "./components/TodoFooter";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";

import todosReducer from "./reducers/todos";
import TodosContext from "./contexts/TodosContext";

function App() {
  const [todos, dispatch] = useReducer(todosReducer, []);
  const handleToggleAllChange = (e) => {
    dispatch({ type: 'TOGGLE_ALL' });
  }
  return (
    <TodosContext.Provider value={{ todos, dispatch }}>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <TodoInput />
        </header>
        <main className="main">
          <div className="toggle-all-container" onClick={handleToggleAllChange}>
            <input className="toggle-all" type="checkbox" />
            <label className="toggle-all-label" htmlFor="toggle-all">Mark all as complete</label>
          </div>
          <TodoList />
        </main>
        <TodoFooter />
      </section>
    </TodosContext.Provider>
  )
}

export default App;