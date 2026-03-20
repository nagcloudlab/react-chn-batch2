# Level 12 — Server-Side Pagination & URL State

> **Objective:** By the end of this level, you will implement server-side pagination using Next.js `searchParams`, understand why URL-based state is superior to React state for pagination, and build numbered page controls — the standard pattern for dashboards with large datasets.

> **Prerequisites:**
> - Completed **Levels 1–11**
> - Dev server running (`npm run dev`)
> - Existing structure includes full CRUD, charts, loading UI, and Suspense

> **What changes in this level:** Currently the courses page shows **all** courses in a single table. With 12+ courses, this is already crowded. In production dashboards with hundreds or thousands of records, loading everything is impractical. We'll add pagination so only **5 courses per page** are shown, with numbered page buttons at the bottom.

---

## The Core Concept — `searchParams`

- In Next.js App Router, **query parameters** (the `?key=value` part of URLs) are accessed via `searchParams`.

- Example URLs and their `searchParams`:

  | URL | `searchParams` |
  |-----|---------------|
  | `/dashboard/courses` | `{}` (empty) |
  | `/dashboard/courses?page=1` | `{ page: "1" }` |
  | `/dashboard/courses?page=2` | `{ page: "2" }` |
  | `/dashboard/courses?page=3&sort=name` | `{ page: "3", sort: "name" }` |

- **Like `params` in Level 4**, `searchParams` is a **Promise** in Next.js 15 and must be awaited:

  ```tsx
  // Next.js 15+
  export default async function Page({ searchParams }: any) {
    const params = await searchParams
    const page = params.page   // "2"
  }
  ```

### Why URL State > React State for Pagination

| Feature | React state (`useState`) | URL state (`searchParams`) |
|---------|-------------------------|---------------------------|
| **Bookmarkable** | No — page resets on refresh | Yes — `?page=2` preserves the page |
| **Shareable** | No — state is local | Yes — copy URL, share with anyone |
| **Back button** | Broken — doesn't go to previous page | Works — browser history tracks pages |
| **SEO** | Not indexed | Each page is indexable |
| **Server rendering** | No — client fetches after load | Yes — server returns the correct page |
| **Deep linking** | Not possible | Direct link to any page |

> **Rule of thumb:** If the state should survive a page refresh or be shareable via URL, put it in `searchParams`. Pagination, sorting, filters, and search queries all belong in the URL.

---

## Step 38 — Expand the Dataset

- To make pagination visible, we need more than 3 courses. Update the data store with 12 courses.

- Open `lib/data.ts` and **replace the entire content** with:

  ```ts
  export let courses = [
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
    { id: 12, name: "Performance Engineering", instructor: "Admin" }
  ]

  export function addCourse(course: any) {
    courses.push(course)
  }

  export function deleteCourse(id: number) {
    const index = courses.findIndex(c => c.id === id)
    if (index !== -1) courses.splice(index, 1)
  }

  export function updateCourse(id: number, data: any) {
    const course = courses.find(c => c.id === id)
    if (course) {
      course.name = data.name
      course.instructor = data.instructor
    }
  }
  ```

- **What changed:** Dataset grew from 3 courses to 12. With 5 per page, we'll have 3 pages.

---

## Step 39 — Implement Paginated Courses Page

- Open `app/dashboard/courses/page.tsx` and **replace the entire content** with:

  ```tsx
  import { courses } from "@/lib/data"
  import Link from "next/link"

  export default async function CoursesPage({ searchParams }: any) {

    const params = await searchParams

    const page = Number(params.page) || 1

    const limit = 5

    const start = (page - 1) * limit
    const end = start + limit

    const paginatedCourses = courses.slice(start, end)

    const totalPages = Math.ceil(courses.length / limit)

    return (

      <div className="container">

        <h2>Courses</h2>

        <table className="table mt-4">

          <thead>
            <tr>
              <th>ID</th>
              <th>Course</th>
              <th>Instructor</th>
            </tr>
          </thead>

          <tbody>

            {paginatedCourses.map((course: any) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>{course.instructor}</td>
              </tr>
            ))}

          </tbody>

        </table>

        <div className="mt-3">

          {Array.from({ length: totalPages }).map((_, index) => {

            const pageNumber = index + 1

            return (

              <Link
                key={pageNumber}
                href={`/dashboard/courses?page=${pageNumber}`}
                className={`btn btn-sm me-2 ${
                  pageNumber === page ? "btn-primary" : "btn-outline-primary"
                }`}
              >
                {pageNumber}
              </Link>

            )

          })}

        </div>

      </div>

    )

  }
  ```

  **Line-by-line breakdown:**

  | Code | Purpose |
  |------|---------|
  | `{ searchParams }: any` | Next.js passes query parameters as the second prop to page components |
  | `const params = await searchParams` | Unwrap the Promise (Next.js 15 — same as `params` in dynamic routes) |
  | `Number(params.page) \|\| 1` | Convert to number; default to page 1 if `?page` is missing or invalid |
  | `const limit = 5` | Number of courses per page |
  | `const start = (page - 1) * limit` | Calculate the starting index for the current page |
  | `const end = start + limit` | Calculate the ending index |
  | `courses.slice(start, end)` | Extract only the courses for the current page |
  | `Math.ceil(courses.length / limit)` | Calculate total number of pages (12 courses / 5 per page = 3 pages) |
  | `Array.from({ length: totalPages })` | Creates an array of the right length to map over for page buttons |
  | `pageNumber === page ? "btn-primary" : "btn-outline-primary"` | Active page gets a solid blue button; others get outlined buttons |

### The Pagination Math

For 12 courses with 5 per page:

| Page | `start` | `end` | `slice(start, end)` | Courses shown |
|------|---------|-------|---------------------|---------------|
| 1 | 0 | 5 | Items 0–4 | Courses 1–5 |
| 2 | 5 | 10 | Items 5–9 | Courses 6–10 |
| 3 | 10 | 15 | Items 10–11 | Courses 11–12 |

Formula:
```
start = (page - 1) * limit
end   = start + limit
```

### Test It

- Open [http://localhost:3000/dashboard/courses](http://localhost:3000/dashboard/courses)

- **Verify:**
  - Page 1 shows courses 1–5
  - Three page buttons appear at the bottom: **[1] [2] [3]**
  - Button "1" is solid blue (active), others are outlined
  - Click **[2]** — URL changes to `?page=2`, courses 6–10 appear
  - Click **[3]** — URL changes to `?page=3`, courses 11–12 appear
  - The active button highlights correctly on each page
  - Click browser **Back** button — returns to the previous page (URL state works with history)

### What the Pagination Looks Like

```
Page 1:                              Page 2:
┌────┬──────────────────┬────────┐   ┌────┬──────────────────┬────────┐
│ ID │ Course           │ Instr. │   │ ID │ Course           │ Instr. │
├────┼──────────────────┼────────┤   ├────┼──────────────────┼────────┤
│  1 │ Next.js Fund.    │ Admin  │   │  6 │ Docker Essen.    │ Admin  │
│  2 │ React Advanced   │ Admin  │   │  7 │ Kubernetes       │ Admin  │
│  3 │ Microservices    │ Admin  │   │  8 │ System Design    │ Admin  │
│  4 │ Node.js Backend  │ Admin  │   │  9 │ Distributed Sys. │ Admin  │
│  5 │ DevOps CI/CD     │ Admin  │   │ 10 │ API Security     │ Admin  │
└────┴──────────────────┴────────┘   └────┴──────────────────┴────────┘
 [1]  2   3                            1  [2]  3
 ^^^active                                ^^^active
```

---

## Understanding the Data Flow

```
User clicks page 2 button
       ↓
Browser navigates to /dashboard/courses?page=2
       ↓
Next.js Server Component receives searchParams: { page: "2" }
       ↓
const params = await searchParams
const page = Number(params.page)     → 2
       ↓
start = (2 - 1) * 5 = 5
end = 5 + 5 = 10
       ↓
courses.slice(5, 10)                 → courses 6–10
       ↓
Server renders table with 5 courses + page buttons
       ↓
HTML sent to browser — button "2" is highlighted
```

### `searchParams` vs `params` Comparison

Both are page component props, but serve different purposes:

| Feature | `params` | `searchParams` |
|---------|----------|----------------|
| **Source** | URL path segments | URL query string |
| **Example URL** | `/courses/[id]` → `/courses/5` | `/courses?page=2` |
| **Access** | `const { id } = await params` | `const { page } = await searchParams` |
| **Defined by** | Folder name `[id]` | Added by the user/link |
| **Required?** | Yes — part of the route | No — optional query parameters |
| **Next.js 15** | Promise (must await) | Promise (must await) |

---

## Production Pagination — Database Queries

In our code, we slice an in-memory array. In production, you'd paginate at the **database level**:

### With Prisma ORM

```ts
const paginatedCourses = await prisma.course.findMany({
  skip: start,       // same as our 'start'
  take: limit,       // same as our 'limit'
  orderBy: { id: "asc" }
})

const totalCount = await prisma.course.count()
const totalPages = Math.ceil(totalCount / limit)
```

### With Raw SQL

```sql
SELECT * FROM courses
ORDER BY id ASC
LIMIT 5 OFFSET 10;    -- page 3: skip 10, take 5
```

### With a Microservice API

```ts
const res = await fetch(
  `http://course-service/api/courses?page=${page}&limit=${limit}`
)
const { data, total } = await res.json()
const totalPages = Math.ceil(total / limit)
```

**What stays the same across all approaches:**

| Component | Changes? |
|-----------|----------|
| `searchParams` reading | No — always reads `?page=N` from the URL |
| Pagination math | No — always `(page - 1) * limit` |
| Page buttons rendering | No — always map over `totalPages` |
| Data fetching internals | **Yes** — changes from `slice` to `prisma.findMany` or API call |

> **Key insight:** The pagination **UI logic** is identical regardless of your data source. Only the data access layer changes.

---

## Adding Previous / Next Buttons (Enhancement)

For a more polished pagination, add Previous and Next buttons alongside page numbers:

```tsx
<div className="mt-3 d-flex align-items-center gap-2">

  {/* Previous button */}
  {page > 1 && (
    <Link
      href={`/dashboard/courses?page=${page - 1}`}
      className="btn btn-sm btn-outline-secondary"
    >
      Previous
    </Link>
  )}

  {/* Page numbers */}
  {Array.from({ length: totalPages }).map((_, index) => {
    const pageNumber = index + 1
    return (
      <Link
        key={pageNumber}
        href={`/dashboard/courses?page=${pageNumber}`}
        className={`btn btn-sm ${
          pageNumber === page ? "btn-primary" : "btn-outline-primary"
        }`}
      >
        {pageNumber}
      </Link>
    )
  })}

  {/* Next button */}
  {page < totalPages && (
    <Link
      href={`/dashboard/courses?page=${page + 1}`}
      className="btn btn-sm btn-outline-secondary"
    >
      Next
    </Link>
  )}

</div>

{/* Page info */}
<p className="text-muted mt-2">
  Page {page} of {totalPages} ({courses.length} total courses)
</p>
```

**Result:**

```
 [Previous]  [1]  [2]  [3]  [Next]
 Page 2 of 3 (12 total courses)
```

| Code | Purpose |
|------|---------|
| `page > 1 &&` | Hide "Previous" on the first page |
| `page < totalPages &&` | Hide "Next" on the last page |
| `d-flex align-items-center gap-2` | Bootstrap flexbox — aligns buttons horizontally with spacing |

---

## Current Architecture

```
app/
  ├─ layout.tsx
  ├─ page.tsx
  ├─ api/courses/route.ts
  └─ dashboard/
      ├─ layout.tsx                          ← Sidebar
      ├─ loading.tsx                         ← Loading spinner
      ├─ page.tsx                            ← Stats + Chart
      ├─ courses/
      │   ├─ page.tsx                        ← Paginated course list
      │   ├─ new/page.tsx                    ← Create form
      │   ├─ edit/[id]/page.tsx              ← Edit form
      │   └─ [id]/page.tsx                   ← Course detail
      └─ users/page.tsx

components/
  ├─ CourseSearch.tsx                         ← Client Component
  ├─ StatCard.tsx                            ← Server Component
  ├─ DashboardStats.tsx                      ← Async Server Component
  └─ RevenueChart.tsx                        ← Client Component

lib/
  └─ data.ts                                 ← Data layer (12 courses)
```

---

## Dashboard Features — Complete Checklist

| Feature | Level | Status |
|---------|-------|--------|
| Project setup & App Router | 1 | Done |
| Bootstrap styling | 1 | Done |
| Sidebar layout | 1 | Done |
| Nested routing | 2 | Done |
| API routes | 3 | Done |
| Server Component data fetching | 3 | Done |
| Caching control | 3 | Done |
| Dynamic routes (`[id]`) | 4 | Done |
| Client Components & search | 5 | Done |
| Dashboard metric cards | 6 | Done |
| Reusable components | 6 | Done |
| Server Actions & forms | 7 | Done |
| Shared data layer | 8 | Done |
| Edit & Delete (full CRUD) | 9 | Done |
| Loading UI & Suspense | 10 | Done |
| Charts (Recharts) | 11 | Done |
| **Server-side pagination** | **12** | **Done** |

---

## Practice Exercises

Try these on your own before moving to Level 13:

1. **Add Previous / Next buttons**
   - Implement the enhanced pagination with Previous/Next buttons (code shown above)
   - Hide "Previous" on page 1 and "Next" on the last page
   - Add the "Page X of Y" info text below

2. **Make the page size configurable**
   - Add a dropdown to choose page size (5, 10, 20):
     ```
     /dashboard/courses?page=1&limit=10
     ```
   - Read both `params.page` and `params.limit` from `searchParams`
   - Default `limit` to 5 if not provided:
     ```tsx
     const limit = Number(params.limit) || 5
     ```

3. **Add pagination to the Users page**
   - Expand `lib/data.ts` with 10+ users
   - Add the same pagination pattern to `app/dashboard/users/page.tsx`
   - Use `searchParams` to read the page number

4. **Combine pagination with search**
   - Challenge: When the user searches, pagination should reset to page 1
   - Add search as a query parameter: `/dashboard/courses?search=react&page=1`
   - Filter courses first, then paginate the filtered results:
     ```tsx
     const search = params.search || ""
     const filteredCourses = courses.filter(c =>
       c.name.toLowerCase().includes(search.toLowerCase())
     )
     const paginatedCourses = filteredCourses.slice(start, end)
     const totalPages = Math.ceil(filteredCourses.length / limit)
     ```

5. **Add sorting via URL**
   - Allow sorting by clicking column headers:
     ```
     /dashboard/courses?page=1&sort=name&order=asc
     ```
   - Read `params.sort` and `params.order` from `searchParams`
   - Sort the courses array before pagination:
     ```tsx
     const sorted = [...courses].sort((a, b) => {
       if (params.order === "desc") return b.name.localeCompare(a.name)
       return a.name.localeCompare(b.name)
     })
     ```
   - Make column headers clickable `<Link>` elements that toggle sort order

6. **Test URL state behaviors**
   - Navigate to `/dashboard/courses?page=2`
   - Bookmark the page → close browser → reopen → verify it loads page 2
   - Copy the URL → open in a new incognito window → verify it shows page 2
   - Click between pages → use browser back/forward buttons → verify they work
   - This demonstrates why URL state is superior to `useState` for pagination

---

## Summary — What You Learned

| Concept | Key Takeaway |
|---------|-------------|
| **`searchParams`** | Access URL query parameters (`?page=2`) in Server Components |
| **`searchParams` is a Promise** | In Next.js 15, must be awaited: `const params = await searchParams` |
| **URL-based state** | Pagination in the URL is bookmarkable, shareable, and works with back/forward |
| **Server-side pagination** | Slice data on the server — only send the current page to the browser |
| **Pagination math** | `start = (page - 1) * limit`, `end = start + limit`, `totalPages = ceil(total / limit)` |
| **Active page styling** | Conditional class: solid button for active page, outlined for others |
| **`searchParams` vs `params`** | `params` = URL path segments (`[id]`); `searchParams` = query string (`?page=2`) |
| **Database pagination** | Same math applies — use `LIMIT`/`OFFSET` in SQL or `skip`/`take` in Prisma |

---

## What's Coming Next (Level 13)

We'll add **Authentication** to protect the dashboard:

- Topics covered:
  - **Auth.js (NextAuth)** — the standard authentication library for Next.js
  - **Login page** — `/login` with email/password or OAuth providers
  - **Protected routes** — redirect unauthenticated users away from `/dashboard`
  - **Session handling** — access the current user in Server Components
  - **Middleware** — intercept requests before they reach the page

- This is how real admin dashboards are secured — only authorized users can access the data.
