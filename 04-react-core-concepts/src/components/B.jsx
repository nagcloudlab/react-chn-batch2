import C from "./C";

function B() {
  return (
    <div className="card bg-light ms-3 mt-1">
      <div className="card-body py-2">
        <h6 className="mb-1 text-muted">Component B <small>(no context used)</small></h6>
        <C />
      </div>
    </div>
  );
}

export default B;
