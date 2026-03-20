import Link from "next/link"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="d-flex">

            {/* Sidebar */}
            <div className="bg-dark text-white p-3" style={{ width: "250px", height: "100vh" }}>
                <h4>Dev Dashboard</h4>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link className="nav-link text-white" href="/dashboard">
                            Home
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link text-white" href="/dashboard/courses">
                            Courses
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" href="/dashboard/users">
                            Users
                        </Link>
                    </li>
                </ul>

            </div>

            {/* Main Content Area */}
            <div className="p-4 flex-grow-1">
                {children}
            </div>

        </div>
    )
}
