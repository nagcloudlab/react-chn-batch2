import { useContext } from "react";
import TodosContext from "../contexts/TodosContext";


function TodoInput() {
    const { dispatch } = useContext(TodosContext);
    const handleKeyUp = (event) => {
        if (event.key !== "Enter") return;
        const text = event.target.value.trim();
        if (text) {
            dispatch({ type: "ADD_TODO", title: text });
        }
        event.target.value = "";
    }
    return (
        <input onKeyUp={handleKeyUp} className="new-todo" placeholder="What needs to be done?" autoFocus />
    )
}

export default TodoInput;