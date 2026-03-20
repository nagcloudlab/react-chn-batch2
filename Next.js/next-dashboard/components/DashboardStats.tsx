import { getCourses } from "@/lib/data"
import StatCard from "./StatCard"

export default function DashboardStats() {
  const courses = getCourses()

  return (
    <div className="row">
      <div className="col-md-4">
        <StatCard title="Total Courses" value={courses.length} color="primary" />
      </div>
      <div className="col-md-4">
        <StatCard title="Instructors" value={new Set(courses.map((c) => c.instructor)).size} color="success" />
      </div>
      <div className="col-md-4">
        <StatCard title="Active Students" value={128} color="info" />
      </div>
    </div>
  )
}
