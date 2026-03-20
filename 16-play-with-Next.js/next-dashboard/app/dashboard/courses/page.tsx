async function getCourses() {
    console.log("Fetching courses...")
    const res = await fetch("http://localhost:3000/api/courses", {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
    })
    return res.json()
}

export default async function CoursesPage() {
    const courses = await getCourses()
    return (
        <div className="container">
            <h2>Courses</h2>
            <table className="table table-striped mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Course Name</th>
                        <th>Instructor</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course: any) => (
                        <tr key={course.id}>
                            <td>{course.id}</td>
                            <td>{course.name}</td>
                            <td>{course.instructor}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}