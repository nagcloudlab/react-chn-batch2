
import { useState, useEffect, use } from 'react';

function Clock(props) {

    console.log("clock rendered");

    let { timeZone } = props;
    timeZone = timeZone || 'Asia/Kolkata'

    const [time, setTime] = useState(() => {
        return new Date().toLocaleTimeString('en-US', { timeZone })
    })
    useEffect(() => {
        const id = setInterval(() => {
            setTime(new Date().toLocaleTimeString('en-US', { timeZone }))
        }, 1000)
        return () => clearInterval(id);
    }, [timeZone])

    return (
        <>
            <div className="card">
                <div className="card-header">{timeZone}</div>
                <div className="card-body">
                    <p>
                        <span className="badge bg-danger">{time}</span>
                    </p>
                </div>
            </div>
        </>
    )
}

export default Clock;