import Link from "next/link"
import LogoutButton from "@/components/LogoutButton"

export default function DashboardLayout({
  children,
  analytics,
  activity,
  notifications,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  activity: React.ReactNode
  notifications: React.ReactNode
}) {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <nav
        className="bg-dark text-white p-3 d-flex flex-column"
        style={{ width: "220px" }}
      >
        <h5 className="mb-4">Dashboard</h5>
        <Link href="/dashboard" className="text-white text-decoration-none mb-2">
          Home
        </Link>
        <Link href="/dashboard/courses" className="text-white text-decoration-none mb-2">
          Courses
        </Link>
        <Link href="/dashboard/users" className="text-white text-decoration-none mb-2">
          Users
        </Link>
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </nav>
      <main className="flex-grow-1 p-4 bg-light">
        {children}
        <div className="row mt-4">
          <div className="col-md-4">{analytics}</div>
          <div className="col-md-4">{activity}</div>
          <div className="col-md-4">{notifications}</div>
        </div>
      </main>
    </div>
  )
}
