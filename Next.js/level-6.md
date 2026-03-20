# Level 6 — Dashboard Metrics & Reusable Components

> **Objective:** By the end of this level, you will build a real admin dashboard home page with metric cards, learn to create reusable components, and understand how Server Components can aggregate data from multiple sources — the gateway pattern used in enterprise dashboards.

> **Prerequisites:**
> - Completed **Levels 1–5**
> - Dev server running (`npm run dev`)
> - Existing structure:
>   ```
>   app/
>     ├─ layout.tsx
>     ├─ page.tsx
>     ├─ api/
>     │   └─ courses/
>     │       └─ route.ts
>     └─ dashboard/
>         ├─ layout.tsx               ← Sidebar
>         ├─ page.tsx                 ← Currently shows plain text
>         ├─ courses/
>         │   ├─ page.tsx             ← Course list with search
>         │   └─ [id]/
>         │       └─ page.tsx         ← Course detail
>         └─ users/
>             └─ page.tsx
>   components/
>     └─ CourseSearch.tsx              ← Client Component
>   ```

> **What changes in this level:** The dashboard home page (`/dashboard`) currently shows plain text. We'll transform it into a **real admin panel** with summary metric cards — the first thing users see in every production dashboard. Then we'll refactor the cards into a **reusable component** to introduce component composition patterns.

---

## Step 18 — Create Dashboard Metrics (Cards)

- Most admin dashboards open with **summary metrics** at a glance:

  ```
  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
  │  Users   │ │ Courses  │ │ Revenue  │ │ Active       │
  │   120    │ │    8     │ │ $24,000  │ │ Sessions: 32 │
  └──────────┘ └──────────┘ └──────────┘ └──────────────┘
  ```

- Open `app/dashboard/page.tsx` and **replace the entire content** with:

  ```tsx
  async function getDashboardStats() {

    return {
      users: 120,
      courses: 8,
      revenue: "$24,000",
      activeSessions: 32
    }

  }

  export default async function DashboardPage() {

    const stats = await getDashboardStats()

    return (
      <div className="container">

        <h2 className="mb-4">Dashboard</h2>

        <div className="row">

          <div className="col-md-3">
            <div className="card text-bg-primary mb-3">
              <div className="card-body">
                <h5 className="card-title">Users</h5>
                <h3>{stats.users}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-bg-success mb-3">
              <div className="card-body">
                <h5 className="card-title">Courses</h5>
                <h3>{stats.courses}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-bg-warning mb-3">
              <div className="card-body">
                <h5 className="card-title">Revenue</h5>
                <h3>{stats.revenue}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-bg-dark mb-3">
              <div className="card-body">
                <h5 className="card-title">Active Sessions</h5>
                <h3>{stats.activeSessions}</h3>
              </div>
            </div>
          </div>

        </div>

      </div>
    )
  }
  ```

  **Code breakdown:**

  | Code | Purpose |
  |------|---------|
  | `async function getDashboardStats()` | Simulates a data source — in production this would call APIs or databases |
  | `await getDashboardStats()` | Runs on the **server** — data never touches the browser |
  | `row` | Bootstrap grid container — arranges children in a horizontal row |
  | `col-md-3` | Bootstrap column — takes 3/12 (25%) of the row width on medium+ screens |
  | `card` | Bootstrap card component — bordered container with padding |
  | `text-bg-primary` | Bootstrap contextual class — sets both text color and background |
  | `mb-3` | Margin-bottom (`1rem`) — spacing between cards when they wrap on small screens |

  **Bootstrap color classes used:**

  | Class | Color | Typical use |
  |-------|-------|-------------|
  | `text-bg-primary` | Blue | General metrics, primary info |
  | `text-bg-success` | Green | Positive metrics (growth, completions) |
  | `text-bg-warning` | Yellow/Orange | Attention items (revenue, alerts) |
  | `text-bg-dark` | Dark/Black | Neutral metrics (sessions, counts) |
  | `text-bg-danger` | Red | *(try it!)* Errors, critical alerts |
  | `text-bg-info` | Cyan | *(try it!)* Informational items |

- Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

- **Verify:** You should see 4 colored cards in a row — Users (blue), Courses (green), Revenue (yellow), Active Sessions (dark). The sidebar remains on the left.

### Why This Is a Server Component

- `getDashboardStats()` runs **entirely on the server** — the browser never sees this function.
- In production, this function could call **multiple backend services simultaneously**:

  ```tsx
  async function getDashboardStats() {

    const [users, courses, revenue, sessions] = await Promise.all([
      fetch("http://user-service/api/count").then(r => r.json()),
      fetch("http://course-service/api/count").then(r => r.json()),
      fetch("http://billing-service/api/revenue").then(r => r.json()),
      fetch("http://analytics-service/api/sessions").then(r => r.json()),
    ])

    return { users, courses, revenue, sessions }

  }
  ```

  - `Promise.all()` runs all 4 fetches **in parallel** — much faster than calling them one by one.
  - All API URLs, keys, and internal service addresses stay on the server.

### Enterprise Dashboard Architecture

- This is the **frontend gateway** pattern — Next.js aggregates data from multiple services:

  ```
  Browser
     ↓
  Next.js Server Component
     ├─ fetch("http://user-service/api/count")         → 120
     ├─ fetch("http://course-service/api/count")       → 8
     ├─ fetch("http://billing-service/api/revenue")    → $24,000
     └─ fetch("http://analytics-service/api/sessions") → 32
     ↓
  Combines all data → renders HTML → sends to browser
  ```

  | Traditional approach | Next.js approach |
  |---------------------|-----------------|
  | Browser makes 4 API calls | Server makes 4 calls internally |
  | User sees loading spinners | User sees complete page instantly |
  | API URLs exposed in browser | API URLs hidden on server |
  | 4 round-trips over the internet | 4 calls on internal network (fast) |

> **Trainer Tip:** This is a great time to ask students: "Where would you put your API keys if you needed to call an external service like Stripe or AWS?" Answer: Inside the Server Component's fetch call — they never reach the browser.

---

## Step 19 — Create a Reusable Card Component

- The dashboard code above works, but notice the **repetition** — the same card HTML is copied 4 times with only the title, value, and color changing.

- This is a perfect opportunity to introduce **component extraction** — a core React pattern.

- Create file: `components/StatCard.tsx`

  ```tsx
  export default function StatCard({ title, value, color }: any) {

    return (

      <div className="col-md-3">

        <div className={`card text-bg-${color} mb-3`}>

          <div className="card-body">

            <h5 className="card-title">{title}</h5>

            <h3>{value}</h3>

          </div>

        </div>

      </div>

    )

  }
  ```

  **Code breakdown:**

  | Code | Purpose |
  |------|---------|
  | `{ title, value, color }` | Props — the component receives these from its parent |
  | `` `card text-bg-${color}` `` | Template literal builds the class name dynamically (e.g., `text-bg-primary`) |
  | No `"use client"` | This is a **Server Component** — it just renders HTML, no interactivity needed |

  > **Note:** Not every reusable component needs `"use client"`. `StatCard` has no hooks, no event handlers — it's pure rendering. Keeping it as a Server Component means **zero JavaScript** ships to the browser for this component.

### Update the Dashboard Page

- Open `app/dashboard/page.tsx` and **replace** with the refactored version:

  ```tsx
  import StatCard from "@/components/StatCard"

  async function getDashboardStats() {

    return {
      users: 120,
      courses: 8,
      revenue: "$24,000",
      activeSessions: 32
    }

  }

  export default async function DashboardPage() {

    const stats = await getDashboardStats()

    return (
      <div className="container">

        <h2 className="mb-4">Dashboard</h2>

        <div className="row">

          <StatCard title="Users" value={stats.users} color="primary" />

          <StatCard title="Courses" value={stats.courses} color="success" />

          <StatCard title="Revenue" value={stats.revenue} color="warning" />

          <StatCard title="Active Sessions" value={stats.activeSessions} color="dark" />

        </div>

      </div>
    )
  }
  ```

- Refresh [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

- **Verify:** The dashboard looks exactly the same — 4 colored cards. But now the code is cleaner and reusable.

### Before vs After Comparison

| Aspect | Before (Step 18) | After (Step 19) |
|--------|-----------------|-----------------|
| Lines of code | ~45 lines of repeated HTML | ~20 lines using `<StatCard>` |
| Adding a new card | Copy-paste 8 lines of HTML | Add one `<StatCard ... />` line |
| Changing card design | Edit 4 places | Edit 1 component file |
| Consistency | Risk of inconsistency across cards | Guaranteed consistency |

### Component Reuse Pattern

- This is the fundamental React pattern — **extract repeated UI into components**:

  ```
  Page
    ↓
  Identifies repeated pattern
    ↓
  Extracts into component with props
    ↓
  Reuses with different data
  ```

- Common reusable dashboard components:

  | Component | Props | Usage |
  |-----------|-------|-------|
  | `StatCard` | `title`, `value`, `color` | Dashboard summary metrics |
  | `DataTable` | `columns`, `rows`, `onSearch` | Any data listing page |
  | `PageHeader` | `title`, `breadcrumbs` | Consistent page headings |
  | `EmptyState` | `message`, `icon` | When a list has no items |
  | `StatusBadge` | `status`, `color` | Active/Inactive indicators |

### Where Components Should Live

| Location | What goes there | Example |
|----------|----------------|---------|
| `app/` | Page-specific code (routes, layouts) | `app/dashboard/page.tsx` |
| `components/` | Reusable UI components shared across pages | `components/StatCard.tsx` |
| `lib/` or `utils/` | Helper functions, API calls, constants | `lib/api.ts` |

> **Best practice:** If a component is used on **only one page**, keep it in that page's folder. If it's used on **multiple pages**, move it to `components/`.

---

## Current Architecture

```
app/
  ├─ layout.tsx                        ← Server Component (Root layout)
  ├─ page.tsx                          ← Server Component (Home page)
  ├─ api/
  │   └─ courses/
  │       └─ route.ts                  ← API: GET /api/courses
  └─ dashboard/
      ├─ layout.tsx                    ← Server Component (Sidebar)
      ├─ page.tsx                      ← Server Component (Metric cards)
      ├─ courses/
      │   ├─ page.tsx                  ← Server Component (list + search)
      │   └─ [id]/
      │       └─ page.tsx              ← Server Component (course detail)
      └─ users/
          └─ page.tsx                  ← Server Component (users list)

components/
  ├─ CourseSearch.tsx                   ← Client Component ("use client")
  └─ StatCard.tsx                      ← Server Component (reusable card)
```

**Component type map:**

| Component | Type | `"use client"`? | Why |
|-----------|------|-----------------|-----|
| `StatCard` | Server | No | Pure rendering — no hooks, no events |
| `CourseSearch` | Client | Yes | Uses `useState` and `onChange` |
| All `page.tsx` files | Server | No | Data fetching with `async/await` |
| All `layout.tsx` files | Server | No | Static layout structure |

> **Key insight:** Reusable components can be **either** Server or Client — it depends on whether they need interactivity, not on whether they're reusable.

---

## Dashboard Features Built So Far

| Feature | Level | Route | Status |
|---------|-------|-------|--------|
| Project setup & App Router | Level 1 | — | Done |
| Bootstrap integration | Level 1 | — | Done |
| Sidebar layout | Level 1 | `/dashboard/*` | Done |
| Nested routing | Level 2 | `/dashboard/courses`, `/dashboard/users` | Done |
| API routes | Level 3 | `/api/courses` | Done |
| Server Component data fetching | Level 3 | `/dashboard/courses` | Done |
| Caching control | Level 3 | — | Done |
| Dynamic routes | Level 4 | `/dashboard/courses/:id` | Done |
| Client Components & search | Level 5 | `/dashboard/courses` | Done |
| Dashboard metric cards | Level 6 | `/dashboard` | Done |
| Reusable components | Level 6 | — | Done |

> This is already very close to a production admin dashboard. The remaining pieces are **data mutation** (create/edit/delete) and **authentication**.

---

## Practice Exercises

Try these on your own before moving to Level 7:

1. **Add more stat cards**
   - Add two more cards: "Pending Orders" (danger/red) and "Avg Rating" (info/cyan)
   - Use the `StatCard` component — should take only 2 new lines of code
   - Adjust the grid: change `col-md-3` to `col-md-2` in `StatCard.tsx` to fit 6 cards in a row

2. **Create a stats API route**
   - Create `app/api/stats/route.ts`
   - Return the stats as JSON:
     ```ts
     export async function GET() {
       return Response.json({
         users: 120,
         courses: 8,
         revenue: "$24,000",
         activeSessions: 32
       })
     }
     ```
   - Update `getDashboardStats()` to fetch from `/api/stats` instead of returning hardcoded data
   - Verify the dashboard still works

3. **Make StatCard render a link**
   - Add an optional `href` prop to `StatCard`
   - When provided, make the card clickable (wrap content in `<Link>`):
     ```tsx
     <StatCard title="Courses" value={8} color="success" href="/dashboard/courses" />
     ```
   - Clicking the card should navigate to the relevant page

4. **Add a "recent activity" section below the cards**
   - Below the `<div className="row">`, add a Bootstrap table showing recent activity:
     ```
     | Time       | Action              | User   |
     |------------|---------------------|--------|
     | 2 min ago  | Created new course  | Admin  |
     | 5 min ago  | Updated user role   | Admin  |
     ```
   - This simulates a real dashboard activity feed

5. **Experiment with `Promise.all` for parallel data fetching**
   - Create two API routes: `/api/stats` and `/api/courses`
   - In `getDashboardStats()`, fetch both simultaneously:
     ```tsx
     async function getDashboardData() {
       const [stats, courses] = await Promise.all([
         fetch("http://localhost:3000/api/stats").then(r => r.json()),
         fetch("http://localhost:3000/api/courses").then(r => r.json()),
       ])
       return { stats, courses }
     }
     ```
   - Display both stats cards **and** a courses summary on the dashboard home page

6. **Responsive design test**
   - Open the dashboard in your browser and resize the window to mobile width
   - Notice how `col-md-3` stacks the cards vertically on small screens — Bootstrap's grid handles this automatically
   - Try `col-sm-6 col-md-3` for 2 cards per row on small screens, 4 on medium+

---

## Summary — What You Learned

| Concept | Key Takeaway |
|---------|-------------|
| **Dashboard metrics** | Bootstrap cards with contextual colors (`text-bg-primary`, etc.) for at-a-glance stats |
| **Server-side data source** | `getDashboardStats()` runs on the server — can call any backend service |
| **Frontend gateway pattern** | Next.js aggregates data from multiple services, renders combined HTML |
| **`Promise.all`** | Fetch multiple data sources in parallel for faster page loads |
| **Component extraction** | Repeated UI → extract into a component with props |
| **Reusable Server Components** | Not all reusable components need `"use client"` — pure rendering stays on the server |
| **Bootstrap grid** | `row` + `col-md-3` creates a responsive 4-column layout |
| **Project organization** | Pages in `app/`, reusable components in `components/`, utilities in `lib/` |

---

## What's Coming Next (Level 7)

We'll add **data mutation** — the ability to **create new courses** using a form:

- Topics covered:
  - **Server Actions** — a modern Next.js feature for form submissions without manually building API routes
  - **`"use server"` directive** — the counterpart to `"use client"`, marking functions that run on the server
  - **Form handling** — building a create course form with validation
  - **Data flow:** Form submission → Server Action → update data → refresh page
  - **`revalidatePath()`** — telling Next.js to re-fetch data after a mutation

- This is one of the most powerful Next.js features — mutations without writing API routes.
