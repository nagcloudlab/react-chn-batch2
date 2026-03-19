import { useState, useCallback } from "react";



function UseCallback() {
    console.log("Rendering UseCallback component...")
    const [count, setCount] = useState(0)
    // const handleClick = () => {
    //     setCount(count + 1)
    // }
    const handleClick = useCallback(() => {
        setCount(count + 1)
    }, [count])
    return (
        <div>
            <h1>UseCallback</h1>
            <hr />

            <button className="btn btn-primary" onClick={handleClick}>
                Click Me
            </button>
            <p>Count: {count}</p>

        </div>
    );
}

export default UseCallback;