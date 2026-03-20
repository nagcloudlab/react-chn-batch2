import type { Metadata } from "next"
import "bootstrap/dist/css/bootstrap.min.css"
import AuthProvider from "@/components/AuthProvider"

export const metadata: Metadata = {
  title: "Next.js Dashboard",
  description: "Course management dashboard built with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
