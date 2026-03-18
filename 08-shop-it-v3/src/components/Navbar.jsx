import CartBadge from "./CartBadge";


function Navbar({ title = "Unknown" }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary rounded-3 shadow-sm mb-4">
            <div className="container-fluid">
                <a className="navbar-brand fw-semibold" href="#">{title}</a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#shopNavbar"
                    aria-controls="shopNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="shopNavbar">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Products</a>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center">
                        <CartBadge />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;