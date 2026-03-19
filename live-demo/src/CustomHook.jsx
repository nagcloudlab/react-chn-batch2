import { useState } from "react";


function useCounter() {
    const [count, setCount] = useState(0);
    function increment() {
        setCount(count + 1);
    }
    function decrement() {
        setCount(count - 1);
    }
    return [count, increment, decrement];
}

function ComponentA() {
    const [count, increment, decrement] = useCounter();
    return (
        <div className="card">
            <div className="card-header">Component A</div>
            <div className="card-body">
                <p>Count: {count}</p>
                <button onClick={increment}>Increment</button>
                <button onClick={decrement}>Decrement</button>
            </div>
        </div>
    );
}


function ComponentB() {
    const [count, increment, decrement] = useCounter();
    return (
        <div className="card">
            <div className="card-header">Component B</div>
            <div className="card-body">
                <p>Count: {count}</p>
                <button onClick={increment}>Increment</button>
                <button onClick={decrement}>Decrement</button>
            </div>
        </div>
    );
}



function CustomHook() {
    return (
        <div>
            <h1>Custom Hook</h1>
            <hr />
            <ComponentA />
            <ComponentB />
        </div>
    );
}

export default CustomHook;