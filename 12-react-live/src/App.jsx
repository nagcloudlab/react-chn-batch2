import { useState } from "react";
import UseEffect from "./UseEffect";
import UseState from "./UseState";
import UseRef from "./UseRef";
import UseLayoutEffect from "./UseLayoutEffect";
import UseMemo from "./UseMemo";
import UseCallback from "./UseCallback";
import UseTransition from "./UseTransition";
import UseCustomHook from "./CustomHook";
import HOC from "./HOC";
import Slot from "./Slot";
import ContainerAndPresentational from "./ContainerAndPresentational";
import Uncontrolled_Controlled from "./Uncontrolled_Controlled";
import RenderProps from "./RederProps";


function App() {
    // const [toggle, setToggle] = useState(false)
    return (
        <div className="container">
            <h1 className="text-primary">Hello, React!</h1>
            <hr />
            {/* <UseState /> */}
            {/* <button className="btn btn-secondary" onClick={() => setToggle(!toggle)}>Toggle UseEffect</button> */}
            {/* <hr /> */}
            {/* {toggle && <UseEffect />} */}
            {/* <UseRef /> */}
            {/* <UseLayoutEffect /> */}
            {/* <UseMemo /> */}
            {/* <UseCallback /> */}
            {/* <UseTransition /> */}
            {/* <UseCustomHook /> */}
            {/* <HOC /> */}
            {/* <Slot /> */}
            {/* <ContainerAndPresentational /> */}
            {/* <Uncontrolled_Controlled /> */}
            <RenderProps />
        </div>
    )

}

export default App