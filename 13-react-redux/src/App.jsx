

import {
  useSelector,
  useDispatch
} from 'react-redux'

import {
  todoToggled,
  todoAdded,
  incremented,
  decremented
} from './redux/index.js'


function CounterBox() {
  const count = useSelector(state => state.counter)
  const todos = useSelector(state => state.todos || [])
  const dispatch = useDispatch()

  return (
    <div>
      <h1>Counter: {count + todos.length}</h1>
      <button className='btn btn-success' onClick={() => dispatch(incremented())}>+</button>
      <button className='btn btn-danger' onClick={() => dispatch(decremented())}>-</button>
    </div>
  )
}

function App() {

  const todos = useSelector(state => state.todos)
  const dispatch = useDispatch()


  const handleToggle = (id) => {
    dispatch(todoToggled(id))
  }
  const handleNewTodo = () => {
    const text = prompt('Enter new todo text:')
    if (text) {
      dispatch(todoAdded({ id: Date.now(), text }))
    }
  }

  return (
    <div className="container">
      <div className='display-1'>
        React Redux Todo List
      </div>
      <hr />
      <CounterBox />
      <hr />
      <button className='btn btn-primary' onClick={handleNewTodo}>
        Add New Todo
      </button>
      <hr />
      <h1>Todo List</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input onChange={e => handleToggle(todo.id)} type="checkbox" checked={todo.completed} readOnly />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App