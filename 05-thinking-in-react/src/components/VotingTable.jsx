

function VotingTable(props) {
    const { votingLines } = props
    return (
        <div className="card mt-3">
            <div className="card-header">Voting Table</div>
            <div className="card-body">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Likes</th>
                            <th>Dislikes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {votingLines.map((line, index) => {
                            return (
                                <tr key={index}>
                                    <td className={line.likes > line.dislikes ? "text-success" : line.likes < line.dislikes ? "text-danger" : ""}>{line.item}</td>
                                    <td>{line.likes}</td>
                                    <td>{line.dislikes}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default VotingTable