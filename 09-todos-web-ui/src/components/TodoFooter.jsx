import { useContext } from "react";
import TodosContext from "../contexts/TodosContext";


function TodoFooter() {
    const { todos, dispatch } = useContext(TodosContext);
    const activeCount = todos.filter(todo => !todo.completed).length;
    if (todos.length === 0) {
        return null;
    }
    const handleClearCompleted = () => {
        dispatch({ type: 'CLEAR_COMPLETED' });
    }
    return (
        <footer className="footer">
            <span className="todo-count">{activeCount} item{activeCount !== 1 ? 's' : ''} left</span>
            <ul className="filters">
                <li>
                    <a href="#/" className="selected">All</a>
                </li>
                <li>
                    <a href="#/active" className="">Active</a>
                </li>
                <li>
                    <a href="#/completed" className="">Completed</a>
                </li>
            </ul>
            <button onClick={handleClearCompleted} className="clear-completed">Clear completed</button>
        </footer>
    )
}

export default TodoFooter;