import CartBadge from "./CartBadge";


function Navbar({ title = "Unknown" }) {
    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container-fluid">
                <h3 className="navbar-brand mb-0 h1">{title}</h3>
            </div>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link">
                        <CartBadge />
                    </a>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;