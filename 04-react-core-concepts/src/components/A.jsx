import B from "./B";
import { useContext } from "react";
import { ColorContext } from "../contexts/ColorContext";


function A() {
    const color = useContext(ColorContext);
    return (
        <div className="card">
            <div className="card-body">
                <h1>Component A - {color}</h1>
                <B />
            </div>
        </div>
    )
}

export default A;