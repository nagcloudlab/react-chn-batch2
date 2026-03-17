
function Message({ message }) {
    console.log("message rendered");
    return (
        <div className="alert alert-info">{message} </div>
    );
}

export default Message;