import Link from "next/link"
import { getCourses, deleteCourse } from "@/lib/data"
import { revalidatePath } from "next/cache"
import CourseSearch from "@/components/CourseSearch"

const PAGE_SIZE = 5

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page } = await searchParams
  const allCourses = getCourses()

  const filtered = q
    ? allCourses.filter((c) =>
        c.name.toLowerCase().includes(q.toLowerCase())
      )
    : allCourses

  const currentPage = Number(page) || 1
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  async function handleDelete(formData: FormData) {
    "use server"
    const id = Number(formData.get("id"))
    deleteCourse(id)
    revalidatePath("/dashboard/courses")
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Courses</h2>
        <Link href="/dashboard/courses/new" className="btn btn-primary">
          Add Course
        </Link>
      </div>

      <CourseSearch />

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Instructor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((course) => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>
                <Link href={`/dashboard/courses/${course.id}`}>
                  {course.name}
                </Link>
              </td>
              <td>{course.instructor}</td>
              <td>
                <Link
                  href={`/dashboard/courses/edit/${course.id}`}
                  className="btn btn-sm btn-warning me-2"
                >
                  Edit
                </Link>
                <form action={handleDelete} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={course.id} />
                  <button type="submit" className="btn btn-sm btn-danger">
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <li
                key={p}
                className={`page-item ${p === currentPage ? "active" : ""}`}
              >
                <Link
                  href={`/dashboard/courses?page=${p}${q ? `&q=${q}` : ""}`}
                  className="page-link"
                >
                  {p}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
