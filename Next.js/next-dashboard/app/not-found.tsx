import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container text-center py-5">
      <h1 className="display-1">404</h1>
      <p className="lead">Page not found</p>
      <Link href="/" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  )
}
