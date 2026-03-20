"use client"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="alert alert-danger" role="alert">
      <h4 className="alert-heading">Dashboard Error</h4>
      <p>{error.message}</p>
      <button className="btn btn-outline-danger" onClick={() => reset()}>
        Try Again
      </button>
    </div>
  )
}
