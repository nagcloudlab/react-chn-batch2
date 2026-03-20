import Link from "next/link"

async function getCourse(id: string) {
    const res = await fetch("http://localhost:3000/api/courses", {
        cache: "no-store"
    })
    const courses = await res.json()
    return courses.find((c: any) => c.id == id)
}

export default async function CourseDetailPage({ params }: any) {

    const { id } = await params
    const course = await getCourse(id)
    if (!course) {
        return (
            <div className="container mt-4">
                <h2>Course not found</h2>
                <Link href="/dashboard/courses" className="btn btn-primary mt-3">
                    Back to Courses
                </Link>
            </div>
        )
    }
    return (
        <div className="container mt-4">

            <h2>{course.name}</h2>
            <div className="card mt-3">
                <div className="card-body">
                    <p><strong>ID:</strong> {course.id}</p>
                    <p><strong>Instructor:</strong> {course.instructor}</p>
                </div>
            </div>
            <Link
                href="/dashboard/courses"
                className="btn btn-secondary mt-3"
            >
                Back to Courses
            </Link>

        </div>
    )
}