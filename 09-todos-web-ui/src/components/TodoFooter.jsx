import { useContext } from "react";
import TodosContext from "../contexts/TodosContext";


function TodoFooter() {
    const { todos } = useContext(TodosContext);
    if (todos.length === 0) {
        return null;
    }
    return (
        <footer className="footer">
            <span className="todo-count"></span>
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
            <button className="clear-completed">Clear completed</button>
        </footer>
    )
}

export default TodoFooter;