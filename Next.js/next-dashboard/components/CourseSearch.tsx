"use client"

import { useRouter, useSearchParams } from "next/navigation"

export default function CourseSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (term) {
      params.set("q", term)
      params.set("page", "1")
    } else {
      params.delete("q")
    }
    router.push(`/dashboard/courses?${params.toString()}`)
  }

  return (
    <input
      type="text"
      className="form-control mb-3"
      placeholder="Search courses..."
      defaultValue={searchParams.get("q") ?? ""}
      onChange={(e) => handleSearch(e.target.value)}
    />
  )
}
