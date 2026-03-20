"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div className="container text-center py-5">
          <h1 className="display-4 text-danger">Something went wrong!</h1>
          <p className="lead">{error.message}</p>
          <button className="btn btn-primary" onClick={() => reset()}>
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}
