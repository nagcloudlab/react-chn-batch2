
import { use, useEffect, useState } from "react"

function UseEffect() {

    const [light, setLight] = useState(false)
    const [count, setCount] = useState(0)

    useEffect(() => {
        // External API call, DOM manipulation, event listeners, timers, etc.
        // console.log("effect-1 - on every render")
        // document.title = light ? "Light is ON" : "Light is OFF"
    });

    useEffect(() => {
        console.log("effect-2 - on first render")
        return () => {
            console.log("effect-2 - cleanup on unmount")
        }
    }, [])

    useEffect(() => {
        // console.log("effect-3 - on light state change")
    }, [light])


    useEffect(() => {
        console.log("effect-4 -  - init ( start timer, subscribe to events, etc.)")
        let intervalId;
        if (light) {
            intervalId = setInterval(() => {
                console.log("Timer tick...")
            }, 1000)
        }
        return () => {
            console.log("effect-4 - cleanup ( stop timer, unsubscribe from events, etc.)")
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [light])


    return (
        <div className="container">
            <hr />
            <h2>useEffect</h2>
            <hr />
            <button className="btn btn-warning" onClick={() => setLight(true)}>Light ON</button>
            <button className="btn btn-danger" onClick={() => setLight(false)}>Light OFF</button>
            <hr />
            <button className="btn btn-primary" onClick={() => setCount(count + 1)}>Count - {count}</button>
        </div>
    )
}

export default UseEffect