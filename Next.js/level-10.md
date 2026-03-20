# Level 10 — Loading UI, Suspense & Streaming

> **Objective:** By the end of this level, you will understand how to add loading states using Next.js's built-in `loading.tsx` file, use React `<Suspense>` for partial page loading, and build a dashboard where different sections load independently — the **streaming** pattern used in production dashboards.

> **Prerequisites:**
> - Completed **Levels 1–9** (full CRUD dashboard)
> - Dev server running (`npm run dev`)
> - Existing structure:
>   ```
>   app/
>     ├─ layout.tsx
>     ├─ page.tsx
>     ├─ api/courses/route.ts
>     └─ dashboard/
>         ├─ layout.tsx                ← Sidebar
>         ├─ page.tsx                  ← Metric cards
>         ├─ courses/
>         │   ├─ page.tsx              ← Course list + Edit/Delete
>         │   ├─ new/page.tsx          ← Create form
>         │   ├─ edit/[id]/page.tsx    ← Edit form
>         │   └─ [id]/page.tsx         ← Course detail
>         └─ users/page.tsx
>   components/
>     ├─ CourseSearch.tsx
>     └─ StatCard.tsx
>   lib/
>     └─ data.ts
>   ```

> **What changes in this level:** Currently, if a page takes time to fetch data, the user sees a blank screen until everything is ready. We'll add **loading indicators** and **streaming** so the page renders progressively — fast parts appear immediately, slow parts show a spinner until ready.

---

## The Problem — Blank Screen While Loading

- When a Server Component fetches data, the browser waits for **all data** before showing anything:

  ```
  Browser requests /dashboard
        ↓
  Server fetches stats (takes 2 seconds)
        ↓
  User sees blank screen for 2 seconds...
        ↓
  Full page finally appears
  ```

- This is a bad user experience — users think the app is broken.

- **Two solutions in Next.js:**

  | Solution | How | Best for |
  |----------|-----|----------|
  | `loading.tsx` | Automatic — Next.js shows it while the entire page loads | Simple pages with a single data source |
  | `<Suspense>` | Granular — wrap individual components for independent loading | Complex pages with multiple data sources |

---

## Step 32 — Add a Loading UI

- Next.js provides a special file convention: **`loading.tsx`**
- When placed in a route folder, Next.js **automatically** shows this component while the page's data is loading.

- Create file: `app/dashboard/loading.tsx`

  ```tsx
  export default function Loading() {

    return (

      <div className="container mt-5 text-center">

        <div className="spinner-border text-primary" role="status">
        </div>

        <p className="mt-3">Loading dashboard...</p>

      </div>

    )

  }
  ```

  **Code breakdown:**

  | Code | Purpose |
  |------|---------|
  | `loading.tsx` | Special Next.js filename — automatically used as loading UI |
  | `spinner-border` | Bootstrap spinner component — animated rotating circle |
  | `text-primary` | Makes the spinner blue (Bootstrap primary color) |
  | `role="status"` | Accessibility attribute — screen readers announce "loading" |
  | `text-center` | Centers the spinner horizontally |

### How `loading.tsx` Works

- Next.js wraps the page in a `<Suspense>` boundary automatically:

  ```
  What you write:                    What Next.js does internally:
  ─────────────                      ────────────────────────────
  dashboard/                         <Suspense fallback={<Loading />}>
    loading.tsx                        <DashboardPage />
    page.tsx                         </Suspense>
  ```

- The loading UI appears **instantly** while `page.tsx` fetches data on the server.

### Where `loading.tsx` Applies

| File location | Scope |
|---------------|-------|
| `app/loading.tsx` | Shows for **all** pages in the app |
| `app/dashboard/loading.tsx` | Shows for `/dashboard` and **all nested routes** (`/dashboard/courses`, etc.) |
| `app/dashboard/courses/loading.tsx` | Shows **only** for `/dashboard/courses` and its children |

- Loading files follow the same **nesting rules** as layouts — they scope to their folder and below.

### Test It

- To see the loading UI in action, we need to simulate slow data fetching.
- Temporarily add a delay to your dashboard page's data function:

  ```tsx
  async function getDashboardStats() {
    // Simulate slow API call
    await new Promise(r => setTimeout(r, 2000))

    return {
      users: 120,
      courses: 8,
      revenue: "$24,000",
      activeSessions: 32
    }
  }
  ```

- Refresh [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

- **Verify:** You should see the spinner for ~2 seconds, then the dashboard cards appear.

### Traditional React vs Next.js Loading

| Traditional React | Next.js App Router |
|------------------|-------------------|
| `const [loading, setLoading] = useState(true)` | Create `loading.tsx` |
| `useEffect(() => { fetch(...).then(() => setLoading(false)) })` | *(automatic)* |
| `if (loading) return <Spinner />` | *(automatic)* |
| `return <ActualContent />` | *(automatic)* |
| **~8 lines of boilerplate per page** | **1 file, zero boilerplate** |

> **Trainer Tip:** Ask students to count how many loading-related lines they've written in traditional React apps. Then show them this: one file, zero state management, zero `useEffect`. This is the App Router advantage.

---

## Step 33 — Create a Streaming Stats Component

- The `loading.tsx` approach is all-or-nothing — it blocks the **entire page** until data is ready.
- For complex dashboards, we want **different sections to load independently**.

- This is called **streaming** — the page renders progressively:

  ```
  ┌─────────────────────────────────────┐
  │ Dashboard         ← appears FIRST   │
  │                                     │
  │ ┌─────────────────────────────────┐ │
  │ │ Loading stats...  ← spinner     │ │
  │ └─────────────────────────────────┘ │
  │                                     │
  │ ┌─────────────────────────────────┐ │
  │ │ Loading activity... ← spinner   │ │
  │ └─────────────────────────────────┘ │
  └─────────────────────────────────────┘
                    ↓ (2 seconds later)
  ┌─────────────────────────────────────┐
  │ Dashboard                           │
  │                                     │
  │ ┌───────┐┌───────┐┌───────┐┌─────┐ │
  │ │Users  ││Courses││Revenue││Sess.│ │
  │ │ 120   ││   8   ││$24,000││  32 │ │
  │ └───────┘└───────┘└───────┘└─────┘ │
  │                                     │
  │ ┌─────────────────────────────────┐ │
  │ │ Recent Activity Table           │ │
  │ └─────────────────────────────────┘ │
  └─────────────────────────────────────┘
  ```

- To achieve this, we extract the slow-loading part into its own **async Server Component**.

- Create file: `components/DashboardStats.tsx`

  ```tsx
  import StatCard from "./StatCard"

  async function getDashboardStats() {

    // Simulate slow API call (remove in production)
    await new Promise(r => setTimeout(r, 2000))

    return {
      users: 120,
      courses: 8,
      revenue: "$24,000",
      sessions: 32
    }

  }

  export default async function DashboardStats() {

    const stats = await getDashboardStats()

    return (

      <div className="row">

        <StatCard title="Users" value={stats.users} color="primary" />
        <StatCard title="Courses" value={stats.courses} color="success" />
        <StatCard title="Revenue" value={stats.revenue} color="warning" />
        <StatCard title="Sessions" value={stats.sessions} color="dark" />

      </div>

    )

  }
  ```

  **Code breakdown:**

  | Code | Purpose |
  |------|---------|
  | `async function getDashboardStats()` | Simulates a slow API call with a 2-second delay |
  | `await new Promise(r => setTimeout(r, 2000))` | Artificial delay — in production, replace with a real API call |
  | `export default async function DashboardStats()` | An **async Server Component** — it can be wrapped in `<Suspense>` |

  > **Key insight:** For `<Suspense>` to work, the wrapped component **must be async** and perform its own data fetching. Suspense detects the pending Promise and shows the fallback until it resolves.

---

## Step 34 — Use `<Suspense>` for Partial Loading

- Now we update the dashboard page to use `<Suspense>` around the stats component.

- Open `app/dashboard/page.tsx` and **replace the entire content** with:

  ```tsx
  import { Suspense } from "react"
  import DashboardStats from "@/components/DashboardStats"

  export default function DashboardPage() {

    return (

      <div className="container">

        <h2 className="mb-4">Dashboard</h2>

        <Suspense fallback={<p>Loading stats...</p>}>

          <DashboardStats />

        </Suspense>

      </div>

    )

  }
  ```

  **Line-by-line breakdown:**

  | Code | Purpose |
  |------|---------|
  | `import { Suspense } from "react"` | React's built-in component for handling async loading |
  | `<Suspense fallback={...}>` | Shows the `fallback` content while `DashboardStats` is loading |
  | `fallback={<p>Loading stats...</p>}` | What the user sees during the loading period — can be any JSX |
  | `<DashboardStats />` | Async component that fetches data — Suspense waits for it |

  > **Notice:** `DashboardPage` is no longer `async` — it renders instantly. Only `DashboardStats` (inside Suspense) is async and does the data fetching.

- Refresh [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

- **Verify:**
  - "Dashboard" heading appears **instantly**
  - "Loading stats..." text shows below the heading
  - After ~2 seconds, the stat cards replace the loading text
  - The sidebar is visible the entire time (layout never waits)

### What Just Happened — Streaming Rendering

- The page now renders **progressively** instead of all-at-once:

  ```
  Time 0ms:                          Time 2000ms:
  ┌──────────────────────┐           ┌──────────────────────┐
  │ Dashboard            │           │ Dashboard            │
  │                      │           │                      │
  │ Loading stats...     │    ──→    │ [Users] [Courses]    │
  │                      │           │ [Revenue] [Sessions] │
  └──────────────────────┘           └──────────────────────┘
  Header renders instantly           Stats stream in when ready
  ```

- **Without Suspense:** User sees blank screen for 2 seconds, then everything at once.
- **With Suspense:** User sees the header and sidebar instantly, stats stream in when ready.

---

## Multiple Suspense Boundaries (Production Pattern)

- Real dashboards have **multiple slow data sources**. Wrap each section in its own `<Suspense>`:

  ```tsx
  import { Suspense } from "react"
  import DashboardStats from "@/components/DashboardStats"
  import RecentActivity from "@/components/RecentActivity"
  import RevenueChart from "@/components/RevenueChart"

  export default function DashboardPage() {

    return (
      <div className="container">

        <h2 className="mb-4">Dashboard</h2>

        {/* Each section loads independently */}
        <Suspense fallback={<p>Loading stats...</p>}>
          <DashboardStats />
        </Suspense>

        <Suspense fallback={<p>Loading chart...</p>}>
          <RevenueChart />
        </Suspense>

        <Suspense fallback={<p>Loading activity...</p>}>
          <RecentActivity />
        </Suspense>

      </div>
    )
  }
  ```

- Each component **fetches its own data** and **streams in independently**:

  ```
  Time 0ms    → Header appears
  Time 500ms  → Stats cards stream in
  Time 1200ms → Chart streams in
  Time 2000ms → Activity table streams in
  ```

- The user sees content progressively — **no single bottleneck** blocks the whole page.

### Streaming vs Traditional Loading

| Approach | User experience | Data sources |
|----------|----------------|--------------|
| **No loading UI** | Blank screen until everything is ready | — |
| **`loading.tsx`** | Single spinner for the entire page | One data source |
| **Single `<Suspense>`** | Header shows, one spinner for data | One data source |
| **Multiple `<Suspense>`** | Each section loads independently | Multiple data sources |

---

## Better Fallbacks — Skeleton UI

- Instead of plain text ("Loading stats..."), production apps use **skeleton screens** — gray placeholder boxes that mimic the final layout:

  ```tsx
  // components/StatsSkeleton.tsx
  export default function StatsSkeleton() {

    return (
      <div className="row">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="col-md-3">
            <div className="card mb-3">
              <div className="card-body">
                <div className="placeholder-glow">
                  <span className="placeholder col-6 mb-2"></span>
                  <span className="placeholder col-4 placeholder-lg"></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )

  }
  ```

  **Bootstrap placeholder classes:**

  | Class | Effect |
  |-------|--------|
  | `placeholder-glow` | Adds a pulsing glow animation to child placeholders |
  | `placeholder` | Creates a gray placeholder block |
  | `placeholder col-6` | Placeholder takes 50% width |
  | `placeholder-lg` | Larger placeholder (simulates a heading) |

- Use it as the Suspense fallback:

  ```tsx
  <Suspense fallback={<StatsSkeleton />}>
    <DashboardStats />
  </Suspense>
  ```

- **Result:** Instead of "Loading stats..." text, users see gray cards that pulse — matching the final layout shape. This feels faster and more polished.

> **Trainer Tip:** Show students both approaches side by side — text fallback vs skeleton UI. Skeleton screens consistently feel faster to users, even when the actual load time is identical. This is called **perceived performance**.

---

## `loading.tsx` vs `<Suspense>` — When to Use Which

| Feature | `loading.tsx` | `<Suspense>` |
|---------|--------------|--------------|
| **Setup** | Create a file — zero code in page | Import and wrap components manually |
| **Scope** | Entire page (all-or-nothing) | Individual components (granular) |
| **Nesting** | Follows folder structure | Placed anywhere in JSX |
| **Multiple sections** | No — one loading state for the whole page | Yes — each section loads independently |
| **Best for** | Simple pages, quick setup | Complex dashboards, multiple data sources |
| **Can be combined** | Yes — `loading.tsx` covers the page while `<Suspense>` covers individual sections |

### Decision Guide

```
Is the page simple with one data source?
       │
       ├─ YES → Use loading.tsx (simplest)
       │
       └─ NO  → Does the page have multiple independent data sections?
                      │
                      ├─ YES → Use <Suspense> per section (streaming)
                      │
                      └─ NO  → Use loading.tsx + one <Suspense> (hybrid)
```

---

## Current Architecture

```
app/
  ├─ layout.tsx                              ← Root layout
  ├─ page.tsx                                ← Home page
  ├─ api/courses/route.ts                    ← API
  └─ dashboard/
      ├─ layout.tsx                          ← Sidebar
      ├─ loading.tsx                         ← Loading UI (spinner)
      ├─ page.tsx                            ← Dashboard (Suspense + DashboardStats)
      ├─ courses/
      │   ├─ page.tsx                        ← Course list + CRUD
      │   ├─ new/page.tsx                    ← Create form
      │   ├─ edit/[id]/page.tsx              ← Edit form
      │   └─ [id]/page.tsx                   ← Course detail
      └─ users/page.tsx

components/
  ├─ CourseSearch.tsx                         ← Client Component
  ├─ StatCard.tsx                            ← Server Component (reusable card)
  └─ DashboardStats.tsx                      ← Async Server Component (wrapped in Suspense)

lib/
  └─ data.ts                                 ← Data layer
```

**Special App Router files reference:**

| File | Purpose | Auto-detected? |
|------|---------|----------------|
| `page.tsx` | Route UI | Yes |
| `layout.tsx` | Shared wrapper | Yes |
| `loading.tsx` | Loading UI | Yes |
| `error.tsx` | Error boundary | Yes *(we'll add in a future level)* |
| `not-found.tsx` | 404 page | Yes *(we'll add in a future level)* |
| `route.ts` | API endpoint | Yes |

---

## Practice Exercises

Try these on your own:

1. **Add a loading file for the courses page**
   - Create `app/dashboard/courses/loading.tsx`
   - Show a table skeleton (placeholder rows) instead of a spinner:
     ```tsx
     export default function Loading() {
       return (
         <div className="container">
           <h2>Courses</h2>
           <div className="placeholder-glow mt-4">
             {[1, 2, 3].map(i => (
               <p key={i}>
                 <span className="placeholder col-12"></span>
               </p>
             ))}
           </div>
         </div>
       )
     }
     ```
   - Navigate between pages and observe the loading skeleton

2. **Create a skeleton component for stat cards**
   - Build `components/StatsSkeleton.tsx` using Bootstrap placeholders (as shown above)
   - Use it as the Suspense fallback instead of `<p>Loading stats...</p>`
   - Compare the feel — skeleton vs text loading indicator

3. **Add multiple Suspense boundaries to the dashboard**
   - Create `components/RecentActivity.tsx` — an async Server Component that shows a table of recent actions (simulate with a 3-second delay)
   - Add it below `DashboardStats` wrapped in its own `<Suspense>`
   - Observe how stats and activity load **independently** at different times

4. **Test loading behavior on different routes**
   - Add a 2-second delay to the courses page's `getCourses()` function
   - Navigate from `/dashboard` to `/dashboard/courses`
   - Observe: does `dashboard/loading.tsx` appear or does the courses page need its own?
   - *(Answer: `dashboard/loading.tsx` covers all nested routes unless they have their own `loading.tsx`)*

5. **Remove the artificial delay**
   - Delete the `await new Promise(r => setTimeout(r, 2000))` line from `DashboardStats`
   - Notice that in development with fast local data, the loading state may flash briefly or not appear at all
   - This is expected — loading UI only matters when data sources are actually slow (real APIs, databases, external services)

6. **Combine `loading.tsx` and `<Suspense>`**
   - Keep `dashboard/loading.tsx` for the overall page
   - Add `<Suspense>` inside `page.tsx` for individual sections
   - Navigate to `/dashboard` — observe that `loading.tsx` shows first, then the page renders with per-section Suspense boundaries
   - This is the **hybrid approach** used in production

---

## Summary — What You Learned

| Concept | Key Takeaway |
|---------|-------------|
| **`loading.tsx`** | Special file — auto-detected by Next.js, shown while the entire page loads |
| **`<Suspense>`** | React component — wrap async components for independent, granular loading |
| **Streaming** | Page renders progressively — fast parts appear first, slow parts stream in |
| **Fallback UI** | The content shown while data loads — can be text, spinners, or skeleton screens |
| **Skeleton screens** | Gray placeholder boxes matching the final layout — feel faster than spinners |
| **Multiple boundaries** | Each `<Suspense>` boundary loads independently — no single bottleneck |
| **Async Server Components** | Must be `async` and fetch their own data for Suspense to work |
| **Loading file scoping** | `loading.tsx` applies to its folder and all nested routes below |
| **Perceived performance** | Streaming + skeletons make the app *feel* faster even if total load time is the same |

---

## What's Coming Next (Level 11)

We'll add **Charts** to create a proper analytics dashboard:

- Topics covered:
  - **Recharts library** — a React charting library that works with Next.js
  - **Bar charts, line charts, pie charts** — common dashboard visualizations
  - **Client Component charts** — charts need browser APIs, so they must use `"use client"`
  - **Combining Server + Client** — server fetches data, client renders the chart
  - **Responsive charts** — charts that adapt to screen size

- This transforms the dashboard from a data table tool into a visual **analytics platform**.
