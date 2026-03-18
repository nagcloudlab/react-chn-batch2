import B from "./B";
import { useContext } from "react";
import { ColorContext } from "../contexts/ColorContext";

function A() {
  const color = useContext(ColorContext);
  return (
    <div className="card border-start border-3" style={{ borderColor: color + ' !important' }}>
      <div className="card-body py-2">
        <h6 className="mb-1">
          Component A &mdash; <span className="badge" style={{ backgroundColor: color }}>{color}</span>
        </h6>
        <B />
      </div>
    </div>
  );
}

export default A;
