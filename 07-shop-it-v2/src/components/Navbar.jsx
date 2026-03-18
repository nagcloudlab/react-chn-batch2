

function Navbar({ title = "Unknown" }) {
    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container-fluid">
                <h3 className="navbar-brand mb-0 h1">{title}</h3>
            </div>
        </nav>
    )
}

export default Navbar;