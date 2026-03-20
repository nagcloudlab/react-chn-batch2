import { Suspense } from "react"
import DashboardStats from "@/components/DashboardStats"
import RevenueChart from "@/components/RevenueChart"

export default function DashboardPage() {
  return (
    <div>
      <h2 className="mb-4">Dashboard Overview</h2>
      <Suspense fallback={<p>Loading stats...</p>}>
        <DashboardStats />
      </Suspense>
      <Suspense fallback={<p>Loading chart...</p>}>
        <RevenueChart />
      </Suspense>
    </div>
  )
}
