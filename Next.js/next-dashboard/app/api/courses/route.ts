import { NextResponse } from "next/server"
import { getCourses, addCourse } from "@/lib/data"

export async function GET() {
  return NextResponse.json(getCourses())
}

export async function POST(request: Request) {
  const body = await request.json()
  const courses = getCourses()
  const newCourse = {
    id: courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1,
    name: body.name,
    instructor: body.instructor,
  }
  addCourse(newCourse)
  return NextResponse.json(newCourse, { status: 201 })
}
