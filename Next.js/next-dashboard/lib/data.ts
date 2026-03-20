declare global {
  var _courses: any[] | undefined
}

if (!global._courses) {
  global._courses = [
    { id: 1, name: "Next.js Fundamentals", instructor: "Admin" },
    { id: 2, name: "React Advanced", instructor: "Admin" },
    { id: 3, name: "Microservices Architecture", instructor: "Admin" },
    { id: 4, name: "Node.js Backend", instructor: "Admin" },
    { id: 5, name: "DevOps CI/CD", instructor: "Admin" },
    { id: 6, name: "Docker Essentials", instructor: "Admin" },
    { id: 7, name: "Kubernetes Basics", instructor: "Admin" },
    { id: 8, name: "System Design", instructor: "Admin" },
    { id: 9, name: "Distributed Systems", instructor: "Admin" },
    { id: 10, name: "API Security", instructor: "Admin" },
    { id: 11, name: "Cloud Architecture", instructor: "Admin" },
    { id: 12, name: "Performance Engineering", instructor: "Admin" },
  ]
}

export const courses = global._courses!

export function getCourses() {
  return global._courses!
}

export function addCourse(course: any) {
  global._courses!.push(course)
}

export function deleteCourse(id: number) {
  const index = global._courses!.findIndex((c) => c.id === id)
  if (index !== -1) global._courses!.splice(index, 1)
}

export function updateCourse(id: number, data: any) {
  const course = global._courses!.find((c) => c.id === id)
  if (course) {
    course.name = data.name
    course.instructor = data.instructor
  }
}
