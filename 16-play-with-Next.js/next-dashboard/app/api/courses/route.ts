
export async function GET() {

    const courses = [
        {
            id: 1,
            name: "Next.js Fundamentals",
            instructor: "Admin"
        },
        {
            id: 2,
            name: "React Advanced",
            instructor: "Admin"
        },
        {
            id: 3,
            name: "Microservices Architecture",
            instructor: "Admin"
        }
    ]
    return Response.json(courses)

}