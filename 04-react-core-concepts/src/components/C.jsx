
import { useContext } from "react";
import { ColorContext } from "../contexts/ColorContext";


function C() {
    const color = useContext(ColorContext);
    return (
        <div className="card">
            <div className="card-body">
                <h1>Component C - {color}</h1>
            </div>
        </div >
    )
}

export default C;