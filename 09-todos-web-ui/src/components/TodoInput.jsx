import { useContext, useState } from "react";
import TodosContext from "../contexts/TodosContext";


function TodoInput({ value = "", onEnter, onBlur }) {
    const { dispatch } = useContext(TodosContext);
    const [inputValue, setInputValue] = useState(value);
    const handleKeyUp = (event) => {
        if (event.key === "Escape") {
            setInputValue("");
            if (onBlur) {
                onBlur();
            }
            return;
        }
        if (event.key !== "Enter") return;
        if (inputValue.trim() !== "") {
            if (onEnter) {
                onEnter(inputValue);
            } else {
                dispatch({ type: "ADD_TODO", title: inputValue });
            }
            setInputValue("");
        }
    }
    return (
        <input onKeyUp={handleKeyUp}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={onBlur}
            className="new-todo"
            placeholder="What needs to be done?" autoFocus />
    )
}

export default TodoInput;