import StatCard from "@/components/StatCard"
import { Suspense } from "react"
import { domainToUnicode } from "url"


// users-microservice.
async function fetchUserStats() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                users: 1200
            })
        }, 2000)
    })
}

// courses-microservice.
async function fetchCourseStats() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                courses: 35
            })
        }, 3000)
    })
}

// revenue-microservice.
async function fetchRevenueStats() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                revenue: "$15,000"
            })
        }, 10000)
    })
}

// sessions-microservice.   
async function fetchSessionStats() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                activeSessions: 45
            })
        }, 5000)
    })
}

async function getDashboardStats() {
    // return new Promise(resolve => {
    //     setTimeout(() => {
    //         resolve({
    //             users: 1200,
    //             courses: 35,
    //             revenue: "$15,000",
    //             activeSessions: 45
    //         })
    //     }, 5000)
    // })

    const [userStats, courseStats, revenueStats, sessionStats]: Array<any> = await Promise.all([
        fetchUserStats(),
        fetchCourseStats(),
        fetchRevenueStats(),
        fetchSessionStats()
    ])

    return Promise.resolve({
        users: userStats.users,
        courses: courseStats.courses,
        revenue: revenueStats.revenue,
        activeSessions: sessionStats.activeSessions
    })

}



async function UserStats() {
    const userStats: any = await fetchUserStats()
    return (
        <>
            <StatCard title="Users" value={userStats.users} color="primary" />
        </>
    )
}

async function CourseStats() {
    const courseStats: any = await fetchCourseStats()
    return (
        <>
            <StatCard title="Courses" value={courseStats.courses} color="success" />
        </>
    )
}

async function RevenueStats() {
    const revenueStats: any = await fetchRevenueStats()
    return (
        <>
            <StatCard title="Revenue" value={revenueStats.revenue} color="warning" />
        </>
    )
}

async function SessionStats() {
    const sessionStats: any = await fetchSessionStats()
    return (
        <>
            <StatCard title="Active Sessions" value={sessionStats.activeSessions} color="dark" />
        </>
    )
}

function CardSkeleton() {
    return (
        <div className="card mb-4" style={{ width: '18rem' }}>
            <div className="card-body">
                <h5 className="card-title placeholder-glow">
                    <span className="placeholder col-6"></span>
                </h5>
                <p className="card-text placeholder-glow">
                    <span className="placeholder col-7"></span>
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-6"></span>
                    <span className="placeholder col-8"></span>
                </p>
            </div>
        </div>
    )
}


export default async function DashboardPage() {

    // const stats: any = await getDashboardStats()

    return (
        <div className="container">
            <h2 className="mb-4">Dashboard</h2>
            <div className="row">
                <Suspense fallback={<CardSkeleton />}>
                    <CourseStats />
                </Suspense>
                <Suspense fallback={<CardSkeleton />}>
                    <RevenueStats />
                </Suspense>
                <Suspense fallback={<CardSkeleton />}>
                    <SessionStats />
                </Suspense>
                <Suspense fallback={<CardSkeleton />}>
                    <UserStats />
                </Suspense>
            </div>
        </div>
    )
}