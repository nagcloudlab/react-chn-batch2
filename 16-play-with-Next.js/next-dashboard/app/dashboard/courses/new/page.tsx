import { addCourse, courses } from "@/lib/data"
import { redirect } from "next/navigation"

export default function NewCoursePage() {

    async function createCourse(formData: FormData) {
        "use server"
        const name = formData.get("name")
        const instructor = formData.get("instructor")
        const newCourse = {
            id: courses.length + 1,
            name,
            instructor
        }
        addCourse(newCourse)
        redirect("/dashboard/courses")
    }

    return (
        <div className="container">

            <h2 className="mb-4">Add Course</h2>
            <form action={createCourse}>
                <div className="mb-3">
                    <label className="form-label">Course Name</label>
                    <input name="name" className="form-control" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Instructor</label>
                    <input name="instructor" className="form-control" required />
                </div>
                <button className="btn btn-primary">
                    Create Course
                </button>
            </form>

        </div>
    )
}