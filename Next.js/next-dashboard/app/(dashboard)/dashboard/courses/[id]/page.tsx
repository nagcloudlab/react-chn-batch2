import { getCourses } from "@/lib/data"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const courses = getCourses()
  const course = courses.find((c) => c.id === Number(id))

  if (!course) notFound()

  return (
    <div>
      <h2 className="mb-4">Course Details</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{course.name}</h5>
          <p className="card-text">
            <strong>ID:</strong> {course.id}
          </p>
          <p className="card-text">
            <strong>Instructor:</strong> {course.instructor}
          </p>
          <Link href="/dashboard/courses" className="btn btn-secondary">
            Back to Courses
          </Link>
        </div>
      </div>
    </div>
  )
}
