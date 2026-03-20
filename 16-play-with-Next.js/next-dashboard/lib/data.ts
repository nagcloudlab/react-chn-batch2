declare global {
    var _courses: any[] | undefined
}
if (!global._courses) {
    global._courses = [
        { id: 1, name: "Next.js Fundamentals", instructor: "Admin" },
        { id: 2, name: "React Advanced", instructor: "Admin" },
        { id: 3, name: "Microservices Architecture", instructor: "Admin" },
        { id: 4, name: "Cloud Computing with AWS", instructor: "Admin" },
    ]
}
export const courses = global._courses!
export function getCourses() {
    return global._courses!
}
export function addCourse(course: any) {
    global._courses!.push(course)
    console.log(global._courses)
}

export function deleteCourse(id: number) {
    const index = courses.findIndex(c => c.id === id)
    if (index !== -1) {
        courses.splice(index, 1)
    }
}

export function updateCourse(id: number, data: any) {
    const course = courses.find(c => c.id === id)
    if (course) {
        course.name = data.name
        course.instructor = data.instructor
    }
}
