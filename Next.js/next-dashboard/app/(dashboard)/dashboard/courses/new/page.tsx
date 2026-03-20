import { addCourse, getCourses } from "@/lib/data"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export default function NewCoursePage() {
  async function createCourse(formData: FormData) {
    "use server"
    const courses = getCourses()
    const newId = courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1
    addCourse({
      id: newId,
      name: formData.get("name") as string,
      instructor: formData.get("instructor") as string,
    })
    revalidatePath("/dashboard/courses")
    redirect("/dashboard/courses")
  }

  return (
    <div>
      <h2 className="mb-4">Add New Course</h2>
      <div className="card">
        <div className="card-body">
          <form action={createCourse}>
            <div className="mb-3">
              <label className="form-label">Course Name</label>
              <input name="name" type="text" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Instructor</label>
              <input name="instructor" type="text" className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary">
              Create Course
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
