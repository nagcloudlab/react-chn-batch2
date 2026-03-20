import Link from "next/link"

export default function Home() {
  return (
    <div className="container text-center py-5">
      <h1 className="display-4 mb-3">Next.js Dashboard</h1>
      <p className="lead text-muted mb-4">
        Course management platform built with Next.js App Router
      </p>
      <div className="d-flex gap-3 justify-content-center">
        <Link href="/dashboard" className="btn btn-primary btn-lg">
          Go to Dashboard
        </Link>
        <Link href="/login" className="btn btn-outline-secondary btn-lg">
          Login
        </Link>
      </div>
    </div>
  )
}
