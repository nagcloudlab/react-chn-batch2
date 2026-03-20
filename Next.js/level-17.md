# Level 17 — Parallel Routes & Multi-Panel Dashboards

> **Objective:** By the end of this level, you will understand Parallel Routes — an advanced App Router feature that allows multiple **independent UI sections** to render simultaneously within the same layout. You'll build a multi-panel dashboard where analytics, activity, and notifications load independently, each with their own loading states.

> **Prerequisites:**
> - Completed **Levels 1–16**
> - Dev server running (`npm run dev`)
> - Route Groups set up (Level 16)

> **What changes in this level:** Currently the dashboard page is a single component that fetches all its data at once. With Parallel Routes, we split it into **independent slots** (`@analytics`, `@activity`, `@notifications`) that load in parallel. If one slot is slow, the others still render immediately — no single bottleneck blocks the entire page.

---

## The Problem — Single-Component Dashboard

Our current dashboard page fetches everything in one component:

```
DashboardPage
   ↓
Fetch stats (fast)
   ↓
Fetch chart data (slow)
   ↓
Fetch activity (medium)
   ↓
Fetch notifications (fast)
   ↓
EVERYTHING renders at once
```

**The issue:** If the chart data takes 3 seconds, the **entire page** waits 3 seconds — even though stats and notifications are ready instantly.

**The solution — Parallel Routes:**

```
DashboardLayout renders instantly
   ├─ @analytics    → loads independently (3s)
   ├─ @activity     → loads independently (1s)
   └─ @notifications → loads independently (0.5s)

Time 0.0s → Layout + heading visible
Time 0.5s → Notifications appear
Time 1.0s → Activity appears
Time 3.0s → Analytics chart appears
```

Each section streams in as soon as its data is ready.

---

## The Core Concept — Named Slots

- Parallel Routes use **named slots** — folders that start with `@`.
- Each `@slot` folder becomes a **prop** in the parent layout.
- Slots render **independently** and can each have their own `loading.tsx`, `error.tsx`, and `page.tsx`.

### How Slots Map to Layout Props

```
Folder structure:                   Layout receives as props:
────────────────                    ───────────────────────
dashboard/
  ├─ @analytics/page.tsx            → analytics
  ├─ @activity/page.tsx             → activity
  ├─ @notifications/page.tsx        → notifications
  ├─ page.tsx                       → children (default)
  └─ layout.tsx                     → { children, analytics, activity, notifications }
```

| Folder | Layout prop | URL effect |
|--------|------------|------------|
| `page.tsx` | `children` | Default content |
| `@analytics/page.tsx` | `analytics` | **None** — does not create a URL |
| `@activity/page.tsx` | `activity` | **None** — does not create a URL |
| `@notifications/page.tsx` | `notifications` | **None** — does not create a URL |

> **Key difference from Route Groups:** Route Groups `(folder)` organize routes into logical sections. Parallel Routes `@slot` render **multiple components simultaneously** within the same page. They solve different problems.

### Comparing App Router Special Folders

| Folder syntax | Name | URL effect | Purpose |
|--------------|------|------------|---------|
| `dashboard/` | Normal route | `/dashboard` | Creates a URL segment |
| `(group)/` | Route Group | None | Organizational grouping |
| `[id]/` | Dynamic Route | `/courses/1` | URL parameter |
| `@slot/` | Parallel Route | **None** | Independent UI section |

---

## Step 1 — Create the Parallel Route Structure

- Inside your dashboard folder (e.g., `app/(dashboard)/dashboard/` or `app/dashboard/`), create three slot folders:

  ```
  dashboard/
    ├─ layout.tsx                  ← Will receive slots as props
    ├─ page.tsx                    ← Main content (children)
    ├─ @analytics/
    │   └─ page.tsx                ← Analytics panel
    ├─ @activity/
    │   └─ page.tsx                ← Activity feed
    └─ @notifications/
        └─ page.tsx                ← Notifications panel
  ```

  > **Important:** The `@` prefix is required — it tells Next.js this is a parallel route slot, not a regular route folder. `@analytics` does NOT create a `/analytics` URL.

---

## Step 2 — Update the Dashboard Layout

- Open your dashboard `layout.tsx` and **update** it to receive the slot props.

- If your dashboard layout is inside a Route Group: `app/(dashboard)/dashboard/layout.tsx`
- If not using Route Groups: `app/dashboard/layout.tsx`

- **Replace** the return JSX (keep your existing auth checks and sidebar):

  ```tsx
  import { getServerSession } from "next-auth"
  import { authOptions } from "@/lib/auth"
  import Link from "next/link"
  import LogoutButton from "@/components/LogoutButton"

  export default async function DashboardLayout({
    children,
    analytics,
    activity,
    notifications
  }: any) {

    const session = await getServerSession(authOptions)

    return (

      <div className="d-flex">

        {/* Sidebar */}
        <div className="bg-dark text-white p-3" style={{ width: "250px", height: "100vh" }}>
          <h4>Dev Dashboard</h4>

          <p className="text-muted small">Welcome, {session?.user?.name}</p>

          <ul className="nav flex-column">
            <li className="nav-item">
              <Link className="nav-link text-white" href="/dashboard">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" href="/dashboard/courses">Courses</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" href="/dashboard/users">Users</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" href="/dashboard/courses/new">Add Course</Link>
            </li>
          </ul>

          <LogoutButton />
        </div>

        {/* Main Content */}
        <div className="p-4 flex-grow-1">

          {children}

          <div className="row mt-4">

            <div className="col-md-6">
              {analytics}
            </div>

            <div className="col-md-3">
              {activity}
            </div>

            <div className="col-md-3">
              {notifications}
            </div>

          </div>

        </div>

      </div>

    )

  }
  ```

  **What's new:**

  | Code | Purpose |
  |------|---------|
  | `analytics, activity, notifications` in props | Receives each `@slot` folder's content as a separate prop |
  | `{children}` | Renders the default `page.tsx` content (stats cards) |
  | `{analytics}` | Renders `@analytics/page.tsx` content |
  | `{activity}` | Renders `@activity/page.tsx` content |
  | `{notifications}` | Renders `@notifications/page.tsx` content |
  | `col-md-6` / `col-md-3` | Bootstrap grid — analytics takes half width, others take quarter each |

  **The layout renders as:**

  ```
  ┌──────────┬──────────────────────────────────────────────┐
  │ Sidebar  │  {children} — Stats cards                    │
  │          │                                              │
  │          │  ┌─────────────────┬──────────┬────────────┐ │
  │          │  │  {analytics}    │{activity}│{notificat.}│ │
  │          │  │  (col-md-6)     │(col-md-3)│(col-md-3)  │ │
  │          │  │                 │          │            │ │
  │          │  │  Revenue Chart  │ Activity │ Alerts     │ │
  │          │  │                 │ Feed     │ Panel      │ │
  │          │  └─────────────────┴──────────┴────────────┘ │
  └──────────┴──────────────────────────────────────────────┘
  ```

---

## Step 3 — Create the Analytics Panel

- Create file: `@analytics/page.tsx` (inside the dashboard folder)

  ```tsx
  import RevenueChart from "@/components/RevenueChart"

  export default function AnalyticsPanel() {

    return (

      <div className="card">

        <div className="card-body">

          <h5>Analytics</h5>

          <RevenueChart />

        </div>

      </div>

    )

  }
  ```

  **Code breakdown:**

  | Code | Purpose |
  |------|---------|
  | `RevenueChart` | The Recharts line chart from Level 11 |
  | `card` / `card-body` | Bootstrap card — bordered container |
  | No `"use client"` | This is a Server Component — `RevenueChart` is already `"use client"` internally |

---

## Step 4 — Create the Activity Panel

- Create file: `@activity/page.tsx` (inside the dashboard folder)

  ```tsx
  export default async function ActivityPanel() {

    // Simulate slow data source
    await new Promise(r => setTimeout(r, 1000))

    const activities = [
      { action: "User John logged in", time: "2 min ago" },
      { action: "New course created", time: "15 min ago" },
      { action: "System update completed", time: "1 hour ago" },
      { action: "Database backup finished", time: "3 hours ago" }
    ]

    return (

      <div className="card">

        <div className="card-body">

          <h5>Recent Activity</h5>

          <ul className="list-group list-group-flush">

            {activities.map((a, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between">
                <span>{a.action}</span>
                <small className="text-muted">{a.time}</small>
              </li>
            ))}

          </ul>

        </div>

      </div>

    )

  }
  ```

  **Code breakdown:**

  | Code | Purpose |
  |------|---------|
  | `async function ActivityPanel()` | Async Server Component — can fetch data independently |
  | `await new Promise(r => setTimeout(r, 1000))` | Simulates a 1-second API call (remove in production) |
  | `list-group list-group-flush` | Bootstrap — clean list without outer borders |
  | `d-flex justify-content-between` | Flexbox — action text on the left, time on the right |

---

## Step 5 — Create the Notifications Panel

- Create file: `@notifications/page.tsx` (inside the dashboard folder)

  ```tsx
  export default async function NotificationsPanel() {

    // Simulate fast data source
    await new Promise(r => setTimeout(r, 500))

    const notifications = [
      { message: "Server maintenance tonight", type: "warning" },
      { message: "New version deployed", type: "success" },
      { message: "Security patch available", type: "danger" }
    ]

    const badgeColors: Record<string, string> = {
      warning: "bg-warning",
      success: "bg-success",
      danger: "bg-danger"
    }

    return (

      <div className="card">

        <div className="card-body">

          <h5>Notifications</h5>

          <ul className="list-group list-group-flush">

            {notifications.map((n, i) => (
              <li key={i} className="list-group-item">
                <span className={`badge ${badgeColors[n.type]} me-2`}>{n.type}</span>
                {n.message}
              </li>
            ))}

          </ul>

        </div>

      </div>

    )

  }
  ```

  **Code breakdown:**

  | Code | Purpose |
  |------|---------|
  | `await new Promise(r => setTimeout(r, 500))` | Simulates a 0.5-second data fetch |
  | `type: "warning" \| "success" \| "danger"` | Notification severity levels |
  | `badge bg-warning` | Bootstrap colored badge — visual indicator |
  | `badgeColors` lookup | Maps notification type to Bootstrap color class |

---

## Step 6 — Add Independent Loading States

Each slot can have its **own** `loading.tsx` — they load independently:

- Create `@analytics/loading.tsx`:

  ```tsx
  export default function Loading() {
    return (
      <div className="card">
        <div className="card-body text-center p-4">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading analytics...</p>
        </div>
      </div>
    )
  }
  ```

- Create `@activity/loading.tsx`:

  ```tsx
  export default function Loading() {
    return (
      <div className="card">
        <div className="card-body">
          <h5>Recent Activity</h5>
          <div className="placeholder-glow">
            <p><span className="placeholder col-10"></span></p>
            <p><span className="placeholder col-8"></span></p>
            <p><span className="placeholder col-9"></span></p>
          </div>
        </div>
      </div>
    )
  }
  ```

- Create `@notifications/loading.tsx`:

  ```tsx
  export default function Loading() {
    return (
      <div className="card">
        <div className="card-body">
          <h5>Notifications</h5>
          <div className="placeholder-glow">
            <p><span className="placeholder col-9"></span></p>
            <p><span className="placeholder col-7"></span></p>
          </div>
        </div>
      </div>
    )
  }
  ```

### The Streaming Timeline

With the simulated delays, the dashboard streams progressively:

```
Time 0.0s → Layout renders (sidebar + heading)
            Analytics:     [Loading spinner...]
            Activity:      [Skeleton placeholder...]
            Notifications: [Skeleton placeholder...]

Time 0.5s → Notifications appear (replaced skeleton)
            Analytics:     [Loading spinner...]
            Activity:      [Skeleton placeholder...]

Time 1.0s → Activity appears (replaced skeleton)
            Analytics:     [Loading spinner...]

Time 3.0s → Analytics chart appears (replaced spinner)
            (if using a slow data source)
```

> **Key insight:** Each `@slot` is wrapped in its **own implicit `<Suspense>` boundary**. When a slot has a `loading.tsx`, Next.js shows it while the slot's async data loads — independently of all other slots.

---

## Step 7 — Handle Missing Slots with `default.tsx`

- When navigating to a nested route (e.g., `/dashboard/courses`), the parallel slots don't have a matching sub-route. Next.js needs a **fallback** for unmatched slots.

- Create a `default.tsx` file in each slot folder:

  ```tsx
  // @analytics/default.tsx
  export default function Default() {
    return null
  }
  ```

  ```tsx
  // @activity/default.tsx
  export default function Default() {
    return null
  }
  ```

  ```tsx
  // @notifications/default.tsx
  export default function Default() {
    return null
  }
  ```

  **Why `default.tsx` is needed:**

  | File | When it's used |
  |------|---------------|
  | `page.tsx` | When the URL matches the slot's route (e.g., `/dashboard`) |
  | `default.tsx` | When the URL **doesn't** match — provides a fallback |

  - Without `default.tsx`, navigating to `/dashboard/courses` would cause a 404 because the slots don't have a `courses/` subfolder.
  - `default.tsx` returning `null` means: "When this slot doesn't match the current URL, render nothing."

  > **Alternatively**, you can have `default.tsx` return the same content as `page.tsx` if you want the panels to persist on all dashboard sub-routes.

---

## Step 8 — Test the Dashboard

- Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

- **Verify:**
  - Stats cards appear at the top (`{children}`)
  - Three panels appear below in a row: Analytics (half width), Activity (quarter), Notifications (quarter)
  - If using simulated delays: notifications appear first, then activity, then analytics
  - Each panel has its own loading state (if you created `loading.tsx` files)
  - Navigate to `/dashboard/courses` — the parallel slots either show their `default.tsx` content or disappear

---

## Architecture Comparison

### Before Parallel Routes (Level 10)

```
DashboardPage
   ↓
Single <Suspense> boundary
   ↓
ALL data fetches must complete
   ↓
Entire page renders at once
```

### After Parallel Routes (Level 17)

```
DashboardLayout
   ├─ {children}        → Stats cards (immediate)
   ├─ {analytics}       → Chart (independent loading)
   ├─ {activity}        → Activity feed (independent loading)
   └─ {notifications}   → Alerts (independent loading)
```

| Feature | Single Suspense | Parallel Routes |
|---------|----------------|-----------------|
| **Loading granularity** | One loading state for all | Each section has its own |
| **Streaming** | All-or-nothing | Progressive section-by-section |
| **Error isolation** | One error crashes all | Each section handles errors independently |
| **Code organization** | Everything in one component | Each section in its own `@slot` folder |
| **Independent data sources** | Must coordinate in one function | Each slot fetches its own data |

---

## Parallel Routes with `<Suspense>` (Alternative Approach)

You can also wrap slots in explicit `<Suspense>` boundaries in the layout for more control:

```tsx
import { Suspense } from "react"

export default function DashboardLayout({
  children, analytics, activity, notifications
}: any) {
  return (
    <div className="p-4">
      {children}

      <div className="row mt-4">
        <div className="col-md-6">
          <Suspense fallback={<AnalyticsSkeleton />}>
            {analytics}
          </Suspense>
        </div>

        <div className="col-md-3">
          <Suspense fallback={<ActivitySkeleton />}>
            {activity}
          </Suspense>
        </div>

        <div className="col-md-3">
          <Suspense fallback={<NotificationsSkeleton />}>
            {notifications}
          </Suspense>
        </div>
      </div>
    </div>
  )
}
```

> **`loading.tsx` vs `<Suspense>`:** The `loading.tsx` inside each `@slot` folder is equivalent to wrapping the slot in `<Suspense>` in the layout. Use whichever approach feels cleaner — both achieve the same result.

---

## Complete Folder Structure

```
dashboard/
  ├─ layout.tsx                    ← Receives { children, analytics, activity, notifications }
  ├─ page.tsx                      ← children → Stats cards (/dashboard)
  │
  ├─ @analytics/
  │   ├─ page.tsx                  ← Analytics panel (chart)
  │   ├─ loading.tsx               ← Spinner while chart loads
  │   └─ default.tsx               ← Fallback for unmatched routes
  │
  ├─ @activity/
  │   ├─ page.tsx                  ← Activity feed (list)
  │   ├─ loading.tsx               ← Skeleton while data loads
  │   └─ default.tsx               ← Fallback for unmatched routes
  │
  ├─ @notifications/
  │   ├─ page.tsx                  ← Notifications (badges + list)
  │   ├─ loading.tsx               ← Skeleton while data loads
  │   └─ default.tsx               ← Fallback for unmatched routes
  │
  ├─ courses/
  │   ├─ page.tsx                  ← /dashboard/courses
  │   ├─ new/page.tsx              ← /dashboard/courses/new
  │   ├─ edit/[id]/page.tsx        ← /dashboard/courses/edit/:id
  │   └─ [id]/page.tsx             ← /dashboard/courses/:id
  │
  └─ users/
      └─ page.tsx                  ← /dashboard/users
```

**How each file type works within a slot:**

| File | Purpose | Equivalent to |
|------|---------|---------------|
| `@slot/page.tsx` | The slot content | `<Component />` |
| `@slot/loading.tsx` | Loading state for the slot | `<Suspense fallback={...}>` |
| `@slot/error.tsx` | Error boundary for the slot | `<ErrorBoundary>` |
| `@slot/default.tsx` | Fallback when URL doesn't match | *(no equivalent — unique to parallel routes)* |

---

## Real Enterprise Use Cases

### 1. Multi-Panel Analytics Dashboard

```
dashboard/
  ├─ @revenue/page.tsx        → Revenue chart
  ├─ @users/page.tsx          → User growth chart
  ├─ @orders/page.tsx         → Order statistics
  └─ @alerts/page.tsx         → System alerts
```

### 2. Email/Chat Application

```
inbox/
  ├─ @sidebar/page.tsx        → Email list
  ├─ @preview/page.tsx        → Email preview pane
  └─ @details/page.tsx        → Contact details
```

### 3. IDE-Like Interface

```
editor/
  ├─ @filetree/page.tsx       → File explorer
  ├─ @editor/page.tsx         → Code editor
  ├─ @terminal/page.tsx       → Terminal output
  └─ @problems/page.tsx       → Error/warning list
```

### 4. Trading Dashboard

```
trading/
  ├─ @chart/page.tsx          → Price chart
  ├─ @orderbook/page.tsx      → Order book
  ├─ @positions/page.tsx      → Open positions
  └─ @trades/page.tsx         → Recent trades
```

---

## Practice Exercises

Try these on your own before moving to Level 18:

1. **Add error handling to a slot**
   - Create `@activity/error.tsx`:
     ```tsx
     "use client"

     export default function Error({ error, reset }: { error: Error, reset: () => void }) {
       return (
         <div className="card border-danger">
           <div className="card-body">
             <h5 className="text-danger">Activity Error</h5>
             <p>{error.message}</p>
             <button className="btn btn-sm btn-danger" onClick={reset}>Retry</button>
           </div>
         </div>
       )
     }
     ```
   - Throw an error in `@activity/page.tsx` to test it
   - Notice: the error is **contained** to just the activity panel — other slots still work

2. **Make slots persist on sub-routes**
   - Update `@analytics/default.tsx` to show the same chart as `page.tsx`:
     ```tsx
     import RevenueChart from "@/components/RevenueChart"

     export default function Default() {
       return (
         <div className="card">
           <div className="card-body">
             <h5>Analytics</h5>
             <RevenueChart />
           </div>
         </div>
       )
     }
     ```
   - Navigate to `/dashboard/courses` — the analytics chart should still be visible

3. **Add a fourth slot**
   - Create `@quickactions/page.tsx` with shortcuts like "Add Course", "Add User", "Generate Report"
   - Add `quickactions` to the layout props
   - Place it in a `col-md-12` row below the other panels

4. **Connect a slot to real data**
   - Update `@activity/page.tsx` to fetch from an API or database:
     ```tsx
     const activities = await prisma.activityLog.findMany({
       take: 5,
       orderBy: { createdAt: "desc" }
     })
     ```
   - This demonstrates how each slot independently fetches its data

5. **Create different loading styles for each slot**
   - `@analytics/loading.tsx` — spinner (chart loading)
   - `@activity/loading.tsx` — skeleton lines (list loading)
   - `@notifications/loading.tsx` — pulsing badges (notification loading)
   - Observe how each loads independently with its own style

6. **Test error isolation**
   - Deliberately throw an error in `@notifications/page.tsx`:
     ```tsx
     throw new Error("Failed to load notifications")
     ```
   - Verify that analytics and activity panels still render normally
   - Only the notifications panel shows the error boundary
   - This proves **error isolation** — one broken panel doesn't crash the whole dashboard

---

## Summary — What You Learned

| Concept | Key Takeaway |
|---------|-------------|
| **Parallel Routes (`@slot`)** | Folders starting with `@` render as independent UI sections in the parent layout |
| **Layout slot props** | Each `@slot` becomes a prop: `{ children, analytics, activity, notifications }` |
| **No URL effect** | `@slot` folders do **not** create URL segments — they're purely structural |
| **Independent loading** | Each slot can have its own `loading.tsx` — loads without blocking others |
| **Independent errors** | Each slot can have its own `error.tsx` — errors are contained |
| **`default.tsx`** | Required fallback for when the URL doesn't match the slot's route |
| **Streaming** | Slots stream in progressively — fast sections appear first |
| **`loading.tsx` vs `<Suspense>`** | Both achieve the same result — choose whichever is cleaner |
| **Enterprise pattern** | Multi-panel dashboards, email clients, trading apps, IDE layouts |

---

## What's Coming Next (Level 18)

We'll implement **Error Handling & Not Found Pages** — the final special file conventions:

- Topics covered:
  - **`error.tsx`** — catches runtime errors and shows a fallback UI with a retry button
  - **`not-found.tsx`** — custom 404 page for missing routes or records
  - **`notFound()` function** — programmatically trigger a 404 from Server Components
  - **Error boundaries** — how errors bubble up through the layout hierarchy
  - **Global vs route-level error handling** — different error pages for different sections

- These are the final pieces for a **production-resilient** application that handles failures gracefully.
