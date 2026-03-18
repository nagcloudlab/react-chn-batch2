import { useState, useEffect } from 'react';

function Clock({ timeZone = 'Asia/Kolkata' }) {
  const [time, setTime] = useState(() => {
    return new Date().toLocaleTimeString('en-US', { timeZone });
  });

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { timeZone }));
    }, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <div className="card text-center">
      <div className="card-header fw-semibold">{timeZone}</div>
      <div className="card-body py-3">
        <span className="badge bg-danger fs-6">{time}</span>
      </div>
    </div>
  );
}

export default Clock;
