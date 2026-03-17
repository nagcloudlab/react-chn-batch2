

let todos = []

function addTodo(title) {
    let newTodo = {
        id: todos.length + 1,
        title,
        completed: false
    }
    todos = [...todos, newTodo]
}

function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return {
                ...todo,
                completed: !todo.completed
            }
        }
        return todo
    });
}

function toggleAll() {
    const areAllCompleted = todos.every(todo => todo.completed)
    todos = todos.map(todo => {
        return {
            ...todo,
            completed: !areAllCompleted
        }
    });
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id)
}

function clearCompleted() {
    todos = todos.filter(todo => !todo.completed)
}

function editTodo(id, newTitle) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return {
                ...todo,
                title: newTitle
            }
        }
        return todo
    });
}

const FILTERS = {
    all: () => true,
    active: todo => !todo.completed,
    completed: todo => todo.completed,
    today: todo => {
        const today = new Date().toDateString()
        const createdAt = new Date(todo.createdAt).toDateString()
        return today === createdAt
    }
}

function getFilteredTodos(filter = "all") {
    return todos.filter(FILTERS[filter])
}

