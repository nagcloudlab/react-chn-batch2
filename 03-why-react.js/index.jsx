
function Clock(props) {
    let { timeZone } = props;
    return (
        <div className="card" style={{ width: "18rem" }}>
            <div className="card-header">{timeZone}</div>
            <div className="card-body">
                <p className="card-text">
                    <span className="badge bg-danger">
                        {new Date().toLocaleTimeString("en-US", { timeZone })}
                    </span>
                </p>
            </div>
        </div>
    );
}

function ClockBoard() {
    return (
        <div className="row">
            <div className="col-md-4">
                <Clock timeZone="Asia/Kolkata" />
            </div>
            <div className="col-md-4">
                <Clock timeZone="Asia/Dubai" />
            </div>
            <div className="col-md-4">
                <Clock timeZone="America/New_York" />
            </div>
        </div>
    );
}


setInterval(() => {

    console.log("tick")
    ReactDOM.createRoot(document.getElementById("root")).render(<ClockBoard />);

}, 1000);
