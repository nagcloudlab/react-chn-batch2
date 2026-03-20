import { useState, useRef, useEffect, useId } from "react";

function Person(name, age) {
    this.name = name
    this.age = age
}


function UseRef() {
    console.log("comp rendered")
    const [count, setCount] = useState(0)
    const nameId = useId()

    const ref = useRef(new Person("Nag", 32))
    ref.current.age++;

    const inputRef = useRef()
    useEffect(() => {
        inputRef.current.focus()
    }, [])


    return (
        <div>
            <h1>UseRef</h1>
            <hr />
            <button className="btn btn-danger" onClick={() => setCount(count + 1)}>Count: {count}</button>
            <hr />
            <div>Name: {ref.current.name}</div>
            <div>Age: {ref.current.age}</div>
            <hr />

            <input ref={inputRef} className="form-control" />

            <hr />

            <form>
                <label htmlFor={nameId}>Name</label>
                <input id={nameId} className="form-control" />
            </form>

        </div>
    );
}

export default UseRef;