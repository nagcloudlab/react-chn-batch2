import { useContext } from "react";
import { ColorContext } from "../contexts/ColorContext";

function C() {
  const color = useContext(ColorContext);
  return (
    <div className="card border-start border-3 ms-3 mt-1" style={{ borderColor: color + ' !important' }}>
      <div className="card-body py-2">
        <h6 className="mb-0">
          Component C &mdash; <span className="badge" style={{ backgroundColor: color }}>{color}</span>
        </h6>
      </div>
    </div>
  );
}

export default C;
