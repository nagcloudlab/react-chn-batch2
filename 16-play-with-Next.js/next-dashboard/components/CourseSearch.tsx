"use client"

import Link from "next/link"
import { useState } from "react"

export default function CourseSearch({ courses }: any) {

    const [query, setQuery] = useState("")

    const filteredCourses = courses.filter((course: any) =>
        course.name.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <div>

            <input
                type="text"
                placeholder="Search courses..."
                className="form-control mb-3"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Course</th>
                        <th>Instructor</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredCourses.map((course: any) => (
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