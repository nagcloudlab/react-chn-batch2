"use client"

import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button
      className="btn btn-outline-light btn-sm"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      Logout
    </button>
  )
}
