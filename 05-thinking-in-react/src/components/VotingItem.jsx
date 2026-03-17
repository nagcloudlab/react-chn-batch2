


function VotingItem(props) {
    let { item = "Unknown", onVote } = props;

    function handleLike() {
        onVote({ item, type: "like" })
    }
    const handleDislike = () => {
        onVote({ item, type: "dislike" })
    }

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{item}</h5>
                <hr />
                <div className="d-flex justify-content-end">
                    <button onClick={handleLike} className="btn btn-primary">Like</button>
                    <button onClick={handleDislike} className="btn btn-danger ms-2">Dislike</button>
                </div>
            </div>
        </div>
    )
}

export default VotingItem