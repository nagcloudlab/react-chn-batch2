
import {
    useState,
} from "react"

import VotingItem from "./VotingItem"
import VotingTable from "./VotingTable"




function VotingBox() {

    const [items, setItems] = useState([
        "TVK",
        "DMK",
        "ADMK",
        "NTK",
    ])
    const [votingLines, setVotingLines] = useState([])

    const handleVote = ({ item, type }) => {
        setVotingLines((prevLines) => {
            const lineIndex = prevLines.findIndex((line) => line.item === item)
            if (lineIndex === -1) {
                const newLine = {
                    item,
                    likes: type === "like" ? 1 : 0,
                    dislikes: type === "dislike" ? 1 : 0,
                }
                return [...prevLines, newLine]
            } else {
                const updatedLines = [...prevLines]
                if (type === "like") {
                    updatedLines[lineIndex].likes += 1
                } else {
                    updatedLines[lineIndex].dislikes += 1
                }
                return updatedLines
            }
        })
    }


    function renderVotingItems(items) {
        return items.map((item, index) => {
            return <VotingItem key={index} item={item} onVote={handleVote} />
        })
    }

    return (
        <div className="card">
            <div className="card-header">Voting Box</div>
            <div className="card-body">
                <div className="d-flex justify-content-start flex-wrap gap-3">
                    {renderVotingItems(items)}
                </div>
                <VotingTable votingLines={votingLines} />
            </div>
        </div>
    )
}



export default VotingBox