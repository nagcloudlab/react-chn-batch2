


function TodoItem({ todo }) {
    return (
        <li>
            <div className="view">
                <input className="toggle" type="checkbox" />
                <label>{todo.title}</label>
                <button className="destroy"></button>
            </div>
        </li>
    )
}

export default TodoItem;