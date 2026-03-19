
import { useState, useRef, useEffect, useLayoutEffect } from "react";

export default function UseLayoutEffect() {
    const [show, setShow] = useState(false);
    const buttonRef = useRef(null);
    const tooltipRef = useRef(null);

    useLayoutEffect(() => {
        // useEffect(() => {
        if (show) {
            const rect = buttonRef.current.getBoundingClientRect();
            // simulate delay
            // setTimeout(() => {
            tooltipRef.current.style.top = rect.bottom + "px";
            tooltipRef.current.style.left = rect.left + "px";
            // }, 300);
        }
    }, [show]);

    return (
        <div style={{ padding: "150px" }}>

            <button ref={buttonRef} onClick={() => setShow(!show)}>
                Toggle Tooltip
            </button>

            {show && (
                <div
                    ref={tooltipRef}
                    style={{
                        position: "absolute",
                        top: "0px",      // 👈 WRONG initial position
                        left: "0px",
                        background: "black",
                        color: "white",
                        padding: "8px",
                    }}
                >
                    Tooltip
                </div>
            )}
        </div>
    );
}

