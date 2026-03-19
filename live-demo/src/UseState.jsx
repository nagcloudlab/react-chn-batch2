import { useState } from "react"


function fetchTodos() {
  console.log("Fetching todos...")
  return [
    { id: 1, title: "Learn React" },
    { id: 2, title: "Build a React App" },
    { id: 3, title: "Master React" }
  ]
}

function UseState() {

  const [count, setCount] = useState(0)
  const handleCount = () => {
    //setCount(count + 1)
    setCount(prev => prev + 1)
  }
  const [items, setItems] = useState([])
  const handleAddItem = () => {
    setItems(prev => {
      return [...prev, `Item ${prev.length + 1}`]
    })
  }
  const [person, setPerson] = useState({
    name: "John",
    age: 30
  })
  const handleUpdatePerson = () => {
    setPerson(prev => {
      return { ...prev, age: prev.age + 1 }
    })
  }

  const [todos, setTodos] = useState(() => {
    return fetchTodos()
  })

  return (
    <div className="container">
      <h2>useState</h2>
      <hr />

      <div className="mb-3">
        <button className="btn btn-primary" onClick={handleCount}>Count: {count}</button>
      </div>

      <div className="mb-3">
        <button className="btn btn-secondary" onClick={handleAddItem}>Add Item</button>
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mb-3">
        <button className="btn btn-success" onClick={handleUpdatePerson}>Update Person</button>
        <p>Name: {person.name}, Age: {person.age}</p>
      </div>

      <div className="mb-3">
        <h3>Todos:</h3>
        {todos.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {todos.map(todo => (
              <li key={todo.id}>{todo.title}</li>
            ))}
          </ul>
        )}
      </div>

    </div>
  )
}

export default UseState