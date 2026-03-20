import { deleteCourse } from "@/lib/data"
import { redirect } from "next/navigation"

async function getCourses() {

    const res = await fetch("http://localhost:3000/api/courses", {
        cache: "no-store"
    })

    return res.json()

}

export default async function CoursesPage() {

    const courses = await getCourses()

    async function removeCourse(formData: FormData) {
        "use server"
        const id = Number(formData.get("id"))
        deleteCourse(id)
        redirect("/dashboard/courses")
    }

    return (

        <div className="container">

            <h2>Courses</h2>

            <table className="table mt-4">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Course</th>
                        <th>Instructor</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {courses.map((course: any) => (
                        <tr key={course.id}>
                            <td>{course.id}</td>
                            <td>{course.name}</td>
                            <td>{course.instructor}</td>
                            <td>
                                <div className="d-flex">
                                    <a
                                        href={`/dashboard/courses/edit/${course.id}`}
                                        className="btn btn-warning btn-sm me-2"
                                    >
                                        Edit
                                    </a>
                                    <form action={removeCourse}>
                                        <input type="hidden" name="id" value={course.id} />
                                        <button className="btn btn-danger btn-sm">
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>

        </div>

    )
}