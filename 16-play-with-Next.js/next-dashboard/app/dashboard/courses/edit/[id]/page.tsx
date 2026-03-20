import { courses, updateCourse } from "@/lib/data"
import { redirect } from "next/navigation"

export default async function EditCoursePage({ params }: any) {
    const { id } = await params
    const course = courses.find(c => c.id == id)
    async function saveCourse(formData: FormData) {
        "use server"
        const name = formData.get("name")
        const instructor = formData.get("instructor")
        updateCourse(Number(id), { name, instructor })
        redirect("/dashboard/courses")
    }

    return (

        <div className="container">
            <h2>Edit Course</h2>
            <form action={saveCourse}>
                <div className="mb-3">
                    <label className="form-label">Course Name</label>
                    <input
                        name="name"
                        defaultValue={course?.name}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Instructor</label>
                    <input
                        name="instructor"
                        defaultValue={course?.instructor}
                        className="form-control"
                    />
                </div>

                <button className="btn btn-primary">
                    Save
                </button>

            </form>

        </div>
    )

}