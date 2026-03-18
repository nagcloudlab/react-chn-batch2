import { useContext, useState } from "react";
import TodosContext from "../contexts/TodosContext";
import TodoInput from "./TodoInput";



function TodoItem({ todo }) {

    const { dispatch } = useContext(TodosContext);
    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = () => {
        dispatch({ type: "DELETE_TODO", id: todo.id });
    }
    const handleChange = (e) => {
        dispatch({ type: "TOGGLE_TODO", id: todo.id });
    }

    const renderViewOrInput = () => {
        if (isEditing) {
            return (
                <TodoInput
                    onEnter={(title) => {
                        dispatch({ type: "EDIT_TODO", id: todo.id, title });
                        setIsEditing(false);
                    }}
                    value={todo.title}
                    onBlur={() => setIsEditing(false)}
                />
            )
        } else {
            return (
                <div className="view" onDoubleClick={() => setIsEditing(true)}>
                    <input checked={todo.completed} onChange={handleChange} className="toggle" type="checkbox" />
                    <label>{todo.title}</label>
                    <button onClick={handleDelete} className="destroy"></button>
                </div>
            )
        }
    }
    return (
        <li className={todo.completed ? "completed" : ""}>
            {renderViewOrInput()}
        </li>
    )
}

export default TodoItem;