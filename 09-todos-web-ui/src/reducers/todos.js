

function todosReducer(todos = [], action) {
    const { type } = action;
    switch (type) {
        case 'ADD_TODO': {
            const { title } = action;
            let newTodo = {
                id: todos.length + 1,
                title,
                completed: false
            }
            return [...todos, newTodo];
        }
        case 'TOGGLE_TODO': {
            const { id } = action;
            return todos.map(todo => {
                if (todo.id === id) {
                    return { ...todo, completed: !todo.completed }
                }
                return todo;
            })
        }
        case 'DELETE_TODO': {
            const { id } = action;
            return todos.filter(todo => todo.id !== id);
        }
        case 'CLEAR_COMPLETED': {
            return todos.filter(todo => !todo.completed);
        }
        case 'EDIT_TODO': {
            const { id, title } = action;
            return todos.map(todo => {
                if (todo.id === id) {
                    return { ...todo, title }
                }
                return todo;
            })
        }
        case 'TOGGLE_ALL': {
            const { completed } = action;
            return todos.map(todo => ({ ...todo, completed }));
        }
        default:
            return todos;
    }

}

export default todosReducer;