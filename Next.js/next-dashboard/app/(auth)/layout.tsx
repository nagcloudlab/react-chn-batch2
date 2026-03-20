export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      {children}
    </div>
  )
}
