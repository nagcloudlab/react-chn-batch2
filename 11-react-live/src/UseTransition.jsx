import { useState, useTransition } from "react";


// fetch 10 todos from server
function fetchTodos() {
    console.log("Fetching todos...")
    return [
        { id: 1, title: "Learn React" },
        { id: 2, title: "Build a React App" },
        { id: 3, title: "Master React" },
        { id: 4, title: "Learn React Hooks" },
        { id: 5, title: "Learn React Router" },
        { id: 6, title: "Learn React Redux" },
        { id: 7, title: "Learn React Context API" },
        { id: 8, title: "Learn React Testing Library" },
        { id: 9, title: "Learn React Performance Optimization" },
        { id: 10, title: "Learn React Best Practices" },
    ]
}


function UseTransition() {

    const [searchQuery, setSearchQuery] = useState("")
    const [todos, setTodos] = useState(fetchTodos)
    const [isPending, startTransition] = useTransition()

    const handleSearch = (query) => {
        // # state change-1
        setSearchQuery(query) // asynchronous state update
        // # state change-2
        startTransition(() => {
            const filteredTodos = fetchTodos().filter(todo => todo.title.toLowerCase().includes(query.toLowerCase()))
            setTodos(filteredTodos) // asynchronous state update
        })
    }

    return (
        <div>
            <h1>UseTransition</h1>
            <hr />
            <input type="text"
                className="form-control" placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)} />
            <hr />
            <p>Search Query: {searchQuery}</p>
            <hr />
            {isPending && <p>Loading...</p>}
            <hr />
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>{todo.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default UseTransition;