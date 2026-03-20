# Level 4 — Dynamic Routes & Detail Pages

> **Objective:** By the end of this level, you will understand dynamic routing with `[id]` folders, how to access URL parameters in Server Components (including the Next.js 15 async `params` change), and how to build a list-to-detail navigation flow — the most common pattern in real dashboards.

> **Prerequisites:**
> - Completed **Levels 1–3**
> - Dev server running (`npm run dev`)
> - Existing structure:
>   ```
>   app/
>     ├─ layout.tsx
>     ├─ page.tsx
>     ├─ api/
>     │   └─ courses/
>     │       └─ route.ts           ← API returning courses JSON
>     └─ dashboard/
>         ├─ layout.tsx             ← Sidebar
>         ├─ page.tsx
>         ├─ courses/
>         │   └─ page.tsx           ← Courses list (fetches from API)
>         └─ users/
>             └─ page.tsx
>   ```

> **What changes in this level:** We add **detail pages** so clicking a course in the table opens `/dashboard/courses/1` with that course's information. This is the standard **list → detail** pattern used in every admin dashboard, e-commerce site, and CRM.

---

## Step 12 — Create a Dynamic Route Folder

- Inside `app/dashboard/courses/`, create a folder named **exactly**:

  ```
  [id]
  ```

  - The **square brackets** are part of the folder name — this tells Next.js it's a **dynamic segment**.
  - `id` is the parameter name — you can choose any name (e.g., `[courseId]`, `[slug]`).

- Your structure becomes:

  ```
  app/
    └─ dashboard/
        └─ courses/
            ├─ page.tsx           ← List page:   /dashboard/courses
            └─ [id]/
                └─ page.tsx       ← Detail page:  /dashboard/courses/:id
  ```

- This **automatically** creates the route pattern:

  | URL | `params.id` value |
  |-----|-------------------|
  | `/dashboard/courses/1` | `"1"` |
  | `/dashboard/courses/2` | `"2"` |
  | `/dashboard/courses/99` | `"99"` |
  | `/dashboard/courses/nextjs` | `"nextjs"` |

- **Any value** in that URL position gets captured as `params.id`.

### How This Compares to Other Frameworks

| Framework | Dynamic route syntax |
|-----------|---------------------|
| **Next.js** | Folder named `[id]` |
| **Express** | `app.get("/courses/:id")` |
| **React Router** | `<Route path="/courses/:id">` |
| **Angular** | `{ path: "courses/:id" }` |

> **Key difference:** In Next.js, you don't write any route configuration — the folder name **is** the configuration.

---

## Step 13 — Create the Course Detail Page

- Create file: `app/dashboard/courses/[id]/page.tsx`

- Add the following code:

  ```tsx
  type Props = {
    params: Promise<{
      id: string
    }>
  }

  export default async function CourseDetailPage({ params }: Props) {

    const { id } = await params

    return (
      <div className="container">
        <h2>Course Details</h2>

        <p>Course ID: {id}</p>
      </div>
    )
  }
  ```

  **Line-by-line breakdown:**

  | Code | Purpose |
  |------|---------|
  | `params: Promise<{ id: string }>` | TypeScript type — `params` is a Promise containing an object with `id` |
  | `async function CourseDetailPage` | Component must be `async` because we need to `await params` |
  | `const { id } = await params` | Unwrap the Promise to get the actual `id` value |
  | `{id}` | Displays the dynamic value from the URL |

- Open [http://localhost:3000/dashboard/courses/1](http://localhost:3000/dashboard/courses/1)

- **Verify:** You should see "Course ID: 1". Try changing the URL to `/dashboard/courses/999` — it shows "Course ID: 999".

### Next.js 15 Breaking Change — Async `params`

This is an important change your team needs to know about:

- **Before Next.js 15** — `params` was a plain object:

  ```tsx
  // OLD — Next.js 14 and earlier
  export default function Page({ params }) {
    const id = params.id   // direct access
  }
  ```

- **Next.js 15 and later** — `params` is a **Promise** and must be awaited:

  ```tsx
  // NEW — Next.js 15+
  export default async function Page({ params }) {
    const { id } = await params   // must await first
  }
  ```

- **Why this changed:** Next.js moved request-level APIs (`params`, `searchParams`, `cookies`, `headers`) to an async context for better performance and streaming support.

- **Quick mental model:**

  | Version | `params` type | Access pattern |
  |---------|--------------|----------------|
  | Next.js 14 | `{ id: string }` | `params.id` |
  | Next.js 15 | `Promise<{ id: string }>` | `const { id } = await params` |

> **Common Error:** If you forget to `await`, you'll see:
> ```
> Error: params is a Promise and must be unwrapped with await
> ```
> Fix: Add `async` to the function and `await params`.

---

## Step 14 — Add Clickable Links from the Courses Table

- Now we connect the list page to the detail page — clicking a course name navigates to its detail.

- Open `app/dashboard/courses/page.tsx` and make two changes:

- **1. Add the Link import** at the top:

  ```tsx
  import Link from "next/link"
  ```

- **2. Wrap the course name** in a `<Link>` inside the `.map()`:

  ```tsx
  {courses.map((course: any) => (
    <tr key={course.id}>
      <td>{course.id}</td>
      <td>
        <Link href={`/dashboard/courses/${course.id}`}>
          {course.name}
        </Link>
      </td>
      <td>{course.instructor}</td>
    </tr>
  ))}
  ```

  **What changed:**

  | Before | After |
  |--------|-------|
  | `<td>{course.name}</td>` | `<td><Link href={...}>{course.name}</Link></td>` |

  - The template literal `` `/dashboard/courses/${course.id}` `` builds the URL dynamically (e.g., `/dashboard/courses/1`).

- Refresh [http://localhost:3000/dashboard/courses](http://localhost:3000/dashboard/courses)

- **Verify:** Course names are now clickable links. Click "Next.js Fundamentals" — it navigates to `/dashboard/courses/1`.

### Why `<Link>` Matters (Client-Side Navigation)

- Using `<Link>` instead of `<a>` gives you:

  | `<a href="...">` (regular HTML) | `<Link href="...">` (Next.js) |
  |----------------------------------|-------------------------------|
  | Full page reload | No reload — only content swaps |
  | All JavaScript re-downloads | Only the new page chunk loads |
  | Layout re-renders | Layout stays intact (sidebar persists) |
  | White flash between pages | Instant, smooth transition |

- **Behind the scenes**, Next.js `<Link>` also **prefetches** the target page when it enters the viewport — so by the time the user clicks, the page is already loaded.

> **Try it:** Open DevTools → Network tab. Hover over the course links — you'll see Next.js prefetch the detail page JS in the background.

---

## Step 15 — Fetch Course Data by ID

- Now we make the detail page fetch real course data from the API instead of just showing the ID.

- **Replace the entire content** of `app/dashboard/courses/[id]/page.tsx`:

  ```tsx
  import Link from "next/link"

  async function getCourse(id: string) {

    const res = await fetch("http://localhost:3000/api/courses", {
      cache: "no-store"
    })

    const courses = await res.json()

    return courses.find((c: any) => c.id == id)
  }

  export default async function CourseDetailPage({ params }: any) {

    const { id } = await params

    const course = await getCourse(id)

    if (!course) {
      return (
        <div className="container mt-4">
          <h2>Course not found</h2>
          <Link href="/dashboard/courses" className="btn btn-primary mt-3">
            Back to Courses
          </Link>
        </div>
      )
    }

    return (
      <div className="container mt-4">

        <h2>{course.name}</h2>

        <div className="card mt-3">
          <div className="card-body">

            <p><strong>ID:</strong> {course.id}</p>

            <p><strong>Instructor:</strong> {course.instructor}</p>

          </div>
        </div>

        <Link
          href="/dashboard/courses"
          className="btn btn-secondary mt-3"
        >
          Back to Courses
        </Link>

      </div>
    )
  }
  ```

  **Code breakdown:**

  | Code | Purpose |
  |------|---------|
  | `getCourse(id)` | Fetches all courses from API, then finds the one matching `id` |
  | `cache: "no-store"` | Always fetch fresh data (important for dashboards) |
  | `courses.find((c) => c.id == id)` | Uses `==` (loose equality) because `params.id` is always a string, but `course.id` is a number |
  | `if (!course)` | Handles the case where the ID doesn't match any course — shows a "not found" message |
  | `<div className="card">` | Bootstrap card component — adds a bordered box around the course details |
  | `<Link>` back button | Navigation link styled as a Bootstrap button (`btn btn-secondary`) |

- Open [http://localhost:3000/dashboard/courses/1](http://localhost:3000/dashboard/courses/1)

- **Verify:**
  - You should see "Next.js Fundamentals" as the heading
  - Course ID and Instructor displayed in a Bootstrap card
  - A "Back to Courses" button at the bottom
  - Try `/dashboard/courses/999` — you should see "Course not found"

### The Complete User Flow

```
/dashboard/courses                    /dashboard/courses/1
┌─────────────────────────────┐      ┌─────────────────────────────┐
│ Sidebar │ Courses           │      │ Sidebar │ Next.js Fund...   │
│         │                   │      │         │                   │
│ Home    │ ID │ Name │ Inst  │      │ Home    │ ┌───────────────┐ │
│ Courses │  1 │ Next │ Admin │ ──→  │ Courses │ │ ID: 1         │ │
│ Users   │  2 │ React│ Admin │      │ Users   │ │ Inst: Admin   │ │
│         │  3 │ Micro│ Admin │      │         │ └───────────────┘ │
│         │                   │      │         │ [Back to Courses] │
└─────────────────────────────┘      └─────────────────────────────┘
        Click course name                    Click back button
```

### Data Flow for the Detail Page

```
Browser requests /dashboard/courses/1
        ↓
Next.js Server Component runs
        ↓
const { id } = await params          → id = "1"
        ↓
getCourse("1") → fetch /api/courses  → finds course with id == 1
        ↓
Renders HTML with course data
        ↓
Sends HTML to browser
```

> **Future Optimization:** Currently we fetch **all courses** and filter client-side. In production, you'd create a dedicated API endpoint like `/api/courses/1` that returns only the requested course. We'll cover this when we add RESTful route handlers.

---

## Current Architecture

```
app/
  ├─ layout.tsx                        ← Root layout (Bootstrap)
  ├─ page.tsx                          ← Home page (/)
  ├─ api/
  │   └─ courses/
  │       └─ route.ts                  ← API: GET /api/courses
  └─ dashboard/
      ├─ layout.tsx                    ← Dashboard layout (Sidebar)
      ├─ page.tsx                      ← Dashboard home (/dashboard)
      ├─ courses/
      │   ├─ page.tsx                  ← Courses list (fetches + links)
      │   └─ [id]/
      │       └─ page.tsx              ← Course detail (dynamic route)
      └─ users/
          └─ page.tsx                  ← Users page
```

**Complete route table:**

| Route                    | Type     | File                                       | Dynamic? | Description              |
|--------------------------|----------|-------------------------------------------|----------|--------------------------|
| `/`                      | Page     | `app/page.tsx`                            | No       | Home page                |
| `/dashboard`             | Page     | `app/dashboard/page.tsx`                  | No       | Dashboard home           |
| `/dashboard/courses`     | Page     | `app/dashboard/courses/page.tsx`          | No       | Courses list             |
| `/dashboard/courses/:id` | Page     | `app/dashboard/courses/[id]/page.tsx`     | Yes      | Course detail            |
| `/dashboard/users`       | Page     | `app/dashboard/users/page.tsx`            | No       | Users list               |
| `/api/courses`           | API      | `app/api/courses/route.ts`                | No       | Returns courses JSON     |

---

## Quick Reference — Dynamic Route Patterns

Next.js supports several dynamic route patterns:

| Folder name | URL pattern | Example URL | `params` value |
|-------------|-------------|-------------|----------------|
| `[id]` | Single segment | `/courses/1` | `{ id: "1" }` |
| `[...slug]` | Catch-all (1+ segments) | `/docs/a/b/c` | `{ slug: ["a","b","c"] }` |
| `[[...slug]]` | Optional catch-all (0+ segments) | `/docs` or `/docs/a/b` | `{ slug: [] }` or `{ slug: ["a","b"] }` |

> **Note:** We're using `[id]` (single segment) which is the most common pattern. You'll encounter catch-all routes in documentation sites or breadcrumb-based navigation.

---

## Practice Exercises

Try these on your own before moving to Level 5:

1. **Add a dynamic user detail page**
   - Create `app/dashboard/users/[id]/page.tsx`
   - Display the user's name, ID, and role
   - Add clickable links in the Users table (like we did for Courses)
   - Don't forget: `const { id } = await params` (Next.js 15 syntax)

2. **Create a dedicated API endpoint for a single course**
   - Create `app/api/courses/[id]/route.ts`
   - Return only the course matching the `id` parameter:
     ```ts
     export async function GET(
       request: Request,
       { params }: any
     ) {
       const { id } = await params
       const course = courses.find((c) => c.id == id)

       if (!course) {
         return Response.json({ error: "Not found" }, { status: 404 })
       }

       return Response.json(course)
     }
     ```
   - Test it at `/api/courses/1` — should return a single course object
   - Update the detail page to fetch from `/api/courses/${id}` instead of fetching all courses

3. **Add a "Back" button using `useRouter`**
   - This requires a **Client Component** (we'll cover this in Level 5, but try it early):
     ```tsx
     "use client"
     import { useRouter } from "next/navigation"

     export default function BackButton() {
       const router = useRouter()
       return (
         <button className="btn btn-secondary" onClick={() => router.back()}>
           Go Back
         </button>
       )
     }
     ```
   - Import and use this component in the detail page

4. **Handle invalid IDs gracefully**
   - Visit `/dashboard/courses/abc` — what happens?
   - Add validation: if `id` is not a valid number, show "Invalid course ID"
   - Add a link back to the courses list

5. **Test with different dynamic parameter names**
   - Rename the folder from `[id]` to `[courseId]`
   - Update the page to use `params.courseId` instead of `params.id`
   - Verify everything still works — the parameter name matches the folder name

---

## Summary — What You Learned

| Concept | Key Takeaway |
|---------|-------------|
| **Dynamic Routes** | Folder named `[id]` creates a parameterized URL segment |
| **`params` (Next.js 15)** | `params` is a Promise — always use `const { id } = await params` |
| **List → Detail pattern** | Table page links to `[id]` detail page — standard dashboard UX |
| **`<Link>` with dynamic URLs** | Template literals build URLs: `` `/courses/${course.id}` `` |
| **Not-found handling** | Check if data exists before rendering — show fallback UI if not |
| **Prefetching** | `<Link>` preloads target pages in the background for instant navigation |
| **Catch-all routes** | `[...slug]` captures multiple URL segments (advanced pattern) |

---

## What's Coming Next (Level 5)

We'll introduce **Client Components** — the missing piece for interactivity:

- Build a **live course search** with a text input
- Topics covered:
  - **`"use client"` directive** — how to opt into client-side rendering
  - **React state** (`useState`) — managing input values and filtered data
  - **Server vs Client boundary** — when to use each type and how they work together
  - **Component composition** — mixing Server and Client Components in the same page

- This is the most important architectural concept in Next.js — understanding the **Server/Client boundary**.
