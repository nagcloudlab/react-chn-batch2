import { getCourses, updateCourse } from "@/lib/data"
import { notFound } from "next/navigation"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const courses = getCourses()
  const course = courses.find((c) => c.id === Number(id))

  if (!course) notFound()

  async function handleUpdate(formData: FormData) {
    "use server"
    updateCourse(Number(id), {
      name: formData.get("name") as string,
      instructor: formData.get("instructor") as string,
    })
    revalidatePath("/dashboard/courses")
    redirect("/dashboard/courses")
  }

  return (
    <div>
      <h2 className="mb-4">Edit Course</h2>
      <div className="card">
        <div className="card-body">
          <form action={handleUpdate}>
            <div className="mb-3">
              <label className="form-label">Course Name</label>
              <input
                name="name"
                type="text"
                className="form-control"
                defaultValue={course.name}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Instructor</label>
              <input
                name="instructor"
                type="text"
                className="form-control"
                defaultValue={course.instructor}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Update Course
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
