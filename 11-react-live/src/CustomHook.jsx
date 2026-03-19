import { useState } from "react";
import useCounter from "./hooks/counter";
import useFetch from "./hooks/fetch";
import useLocalStorage from "./hooks/localStorage";




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
function TodosList() {
    const { result, error, loading } = useFetch("https://jsonplaceholder.typicode.com/todos");
    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>Error: {error.message}</p>;
    }
    return (
        <div className="card">
            <div className="card-header">Todos List</div>
            <div className="card-body">
                <ul>
                    {result.map(todo => (
                        <li key={todo.id}>{todo.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}


function LoginForm() {
    const [token, updateToken] = useLocalStorage("jwtToken", null);
    const handleLogin = () => {
        const jwtToken = "eyJhbGci..."; // Simulated JWT token
        updateToken(jwtToken);
    };
    if (token) {
        return (
            <div className="card">
                <div className="card-header">Welcome Back!</div>
                <div className="card-body">
                    <p>Your token: {token}</p>
                </div>
            </div>
        );
    }
    return (
        <div className="card">
            <div className="card-header">Login Form</div>
            <div className="card-body">
                <button className="btn btn-primary" onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
}


function CustomHook() {
    return (
        <div>
            <h1>Custom Hook</h1>
            <hr />
            {/* <ComponentA /> */}
            {/* <ComponentB /> */}
            {/* <TodosList /> */}
            <LoginForm />
        </div>
    );
}

export default CustomHook;