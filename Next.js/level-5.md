# Level 5 — Client Components & Interactive Search

> **Objective:** By the end of this level, you will understand the difference between Server Components and Client Components, know when to use each, and build a live search feature using the `"use client"` directive with React state.

> **Prerequisites:**
> - Completed **Levels 1–4**
> - Dev server running (`npm run dev`)
> - Existing structure:
>   ```
>   app/
>     ├─ layout.tsx
>     ├─ page.tsx
>     ├─ api/
>     │   └─ courses/
>     │       └─ route.ts              ← API returning courses JSON
>     └─ dashboard/
>         ├─ layout.tsx                ← Sidebar
>         ├─ page.tsx
>         ├─ courses/
>         │   ├─ page.tsx              ← Courses list (fetches from API)
>         │   └─ [id]/
>         │       └─ page.tsx          ← Course detail (dynamic route)
>         └─ users/
>             └─ page.tsx
>   ```

> **What changes in this level:** Until now, every component we built was a **Server Component** — it runs on the server and sends static HTML. But dashboards need interactivity: search boxes, filters, modals, forms. For that, we need **Client Components** that run in the browser with full React capabilities.

---

## The Core Concept — Server vs Client Components

Before we write code, let's understand the mental model:

### Server Components (default in App Router)

- Every component is a **Server Component by default** — you don't need to add anything.
- They run **on the server** and send **HTML** to the browser.
- They **can** do:
  - `async/await` and `fetch()` directly in the component
  - Database queries, file system access, secret key usage
  - Import and render Client Components
- They **cannot** do:
  - `useState`, `useEffect`, `useRef` (React hooks)
  - `onClick`, `onChange`, `onSubmit` (event handlers)
  - Browser APIs (`window`, `document`, `localStorage`)

### Client Components (`"use client"`)

- You opt in by adding `"use client"` as the **very first line** of the file.
- They run **in the browser** (also pre-rendered on server for initial HTML).
- They **can** do:
  - All React hooks (`useState`, `useEffect`, `useRef`, etc.)
  - Event handlers (`onClick`, `onChange`, `onSubmit`)
  - Browser APIs (`window`, `document`, `localStorage`)
- They **cannot** do:
  - `async/await` in the component function itself
  - Direct database queries or secret key access (these would be exposed to the browser)

### Side-by-Side Comparison

| Feature | Server Component (default) | Client Component (`"use client"`) |
|---------|---------------------------|-----------------------------------|
| **Runs on** | Server | Browser (+ server for initial render) |
| **`async/await`** | Yes | No |
| **`useState` / `useEffect`** | No | Yes |
| **`onClick` / `onChange`** | No | Yes |
| **`fetch()` directly** | Yes | Yes (but usually via `useEffect`) |
| **Access DB / secrets** | Yes | No (would leak to browser) |
| **Sends JS to browser** | No (zero JS) | Yes (component code shipped) |
| **Best for** | Data fetching, rendering | Interactivity, user input |

> **Rule of thumb:** Keep components as Server Components by default. Only add `"use client"` when you **need** interactivity (hooks, events, browser APIs). This minimizes the JavaScript sent to the browser.

---

## Step 16 — Create a Client Component (Course Search)

- We'll build a **search input** that filters the courses table in real-time as the user types.

- Create a new folder at the project root: `components/`
- Create file: `components/CourseSearch.tsx`

  ```tsx
  "use client"

  import { useState } from "react"

  export default function CourseSearch({ courses }: any) {

    const [query, setQuery] = useState("")

    const filteredCourses = courses.filter((course: any) =>
      course.name.toLowerCase().includes(query.toLowerCase())
    )

    return (
      <div>

        <input
          type="text"
          placeholder="Search courses..."
          className="form-control mb-3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Course</th>
              <th>Instructor</th>
            </tr>
          </thead>

          <tbody>
            {filteredCourses.map((course: any) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>{course.instructor}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    )
  }
  ```

  **Line-by-line breakdown:**

  | Code | Purpose |
  |------|---------|
  | `"use client"` | **Must be the very first line** — tells Next.js this component runs in the browser |
  | `import { useState } from "react"` | React hook for managing component state |
  | `{ courses }: any` | Receives the courses array as a **prop** from the parent (Server Component) |
  | `const [query, setQuery] = useState("")` | Creates a state variable `query` (starts empty) and a setter `setQuery` |
  | `courses.filter(...)` | Creates a new array containing only courses whose name matches the search query |
  | `.toLowerCase()` | Makes the search **case-insensitive** (e.g., "next" matches "Next.js") |
  | `onChange={(e) => setQuery(e.target.value)}` | Updates `query` state every time the user types — triggers re-render with filtered results |
  | `form-control` | Bootstrap class — styles the input as a full-width form field |
  | `mb-3` | Bootstrap margin-bottom level 3 (`1rem` = 16px) |

### Why `"use client"` Is Required Here

- Without `"use client"`, this component would be a Server Component.
- Server Components **cannot use** `useState` or `onChange`.
- If you forget the directive, you'll get this error:

  ```
  Error: useState only works in Client Components.
  Add the "use client" directive at the top of the file to use it.
  ```

- **Fix:** Always add `"use client"` as the **first line** (before all imports).

> **Common Mistake:** Putting `"use client"` after the imports — it must be the **very first line** of the file, before everything else.

---

## Step 17 — Use the Client Component in a Server Component

- Now open `app/dashboard/courses/page.tsx` and **replace the entire content** with:

  ```tsx
  import CourseSearch from "@/components/CourseSearch"

  async function getCourses() {

    const res = await fetch("http://localhost:3000/api/courses", {
      cache: "no-store"
    })

    return res.json()
  }

  export default async function CoursesPage() {

    const courses = await getCourses()

    return (
      <div className="container">

        <h2>Courses</h2>

        <CourseSearch courses={courses} />

      </div>
    )
  }
  ```

  **Line-by-line breakdown:**

  | Code | Purpose |
  |------|---------|
  | `import CourseSearch from "@/components/CourseSearch"` | Imports the Client Component — `@/` is a path alias for the project root |
  | `async function getCourses()` | Fetches data from the API **on the server** |
  | `async function CoursesPage()` | This is a **Server Component** (no `"use client"`) — it can use `async/await` |
  | `<CourseSearch courses={courses} />` | Passes the fetched data **down** to the Client Component as props |

- Refresh [http://localhost:3000/dashboard/courses](http://localhost:3000/dashboard/courses)

- **Verify:**
  - You see a search input above the courses table
  - Type "next" — only "Next.js Fundamentals" remains visible
  - Type "react" — only "React Advanced" shows
  - Clear the input — all courses reappear
  - The sidebar is still present (layout unchanged)

---

## The Server → Client Pattern (Most Important Concept)

This is the **core architectural pattern** in Next.js App Router:

```
CoursesPage (Server Component)
       │
       │  1. Runs on the server
       │  2. Fetches data from API
       │  3. Passes data as props
       │
       ▼
CourseSearch (Client Component)
       │
       │  4. Runs in the browser
       │  5. Manages search state (useState)
       │  6. Filters and renders interactively
       │
       ▼
  User sees filtered table
```

### Why This Pattern Works So Well

| Concern | Handled by | Why |
|---------|-----------|-----|
| **Data fetching** | Server Component | Secure, fast, no loading spinners needed |
| **User interaction** | Client Component | React hooks enable real-time UI updates |
| **SEO & initial load** | Server Component | HTML is ready on first load |
| **Bundle size** | Server Component | Data fetching code never ships to browser |

### The Alternative (Without This Pattern)

In a traditional React app (Create React App / Vite), you'd do **everything** in the browser:

```tsx
// Traditional React — everything runs in the browser
"use client"

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    fetch("/api/courses")
      .then(res => res.json())
      .then(data => {
        setCourses(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading...</p>

  // ... render table with filtering
}
```

**Problems with this approach:**
- User sees a loading spinner first (bad UX)
- API call happens in the browser (slower, exposes URL)
- All the code ships as JavaScript (larger bundle)
- No SEO — search engines see an empty page initially

**With the Server → Client pattern:**
- Server fetches data → HTML arrives ready
- Client only handles interactivity
- Less JavaScript in the browser
- SEO-friendly out of the box

---

## Understanding the Boundary

A visual map of where each component type lives:

```
┌─────────────────────────────────────────────────────────────┐
│                        SERVER                               │
│                                                             │
│  app/layout.tsx ─────────────────── Server Component        │
│  app/dashboard/layout.tsx ───────── Server Component        │
│  app/dashboard/courses/page.tsx ─── Server Component        │
│       │                                                     │
│       │  fetches data, passes as props                      │
│       ▼                                                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                      BROWSER                            │ │
│ │                                                         │ │
│ │  components/CourseSearch.tsx ────── Client Component     │ │
│ │       │                                                 │ │
│ │       │  useState, onChange, filtering                   │ │
│ │       ▼                                                 │ │
│ │  Interactive UI                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Key Rules About the Boundary

| Rule | Explanation |
|------|-------------|
| Server can render Client | A Server Component **can** import and render a Client Component |
| Client cannot import Server | A Client Component **cannot** import a Server Component |
| Props cross the boundary | Data flows from Server → Client via **props** (must be serializable: strings, numbers, arrays, objects) |
| Functions don't cross | You **cannot** pass functions as props from Server to Client (functions aren't serializable) |
| `"use client"` is a boundary | Everything in a `"use client"` file (and its imports) becomes client-side |

> **Trainer Tip:** A great way to explain this — Server Components are like a **kitchen** (data prep happens behind the scenes). Client Components are like the **dining room** (the customer interacts with the served dish). Data flows from kitchen → dining room, never the reverse.

---

## When to Use Which

Use this decision guide when building components:

```
Does the component need useState, useEffect,
onClick, onChange, or browser APIs?
        │
        ├─ YES → "use client" (Client Component)
        │         Examples: search box, modal, form,
        │         dropdown, toggle, drag-and-drop
        │
        └─ NO  → Server Component (default)
                  Examples: page layout, data table,
                  header, footer, static content
```

### Common Dashboard Components by Type

| Component | Type | Why |
|-----------|------|-----|
| Page layout | Server | No interactivity needed |
| Data table (static) | Server | Just renders data |
| Search input | **Client** | Needs `useState` + `onChange` |
| Filter dropdown | **Client** | Needs `useState` + `onChange` |
| Pagination controls | **Client** | Needs `useState` + `onClick` |
| Modal / Dialog | **Client** | Needs `useState` for open/close |
| Form (create/edit) | **Client** | Needs `useState` + `onSubmit` |
| Sidebar navigation | Server | Static links, no interactivity |
| Charts / Graphs | **Client** | Usually needs browser APIs |
| Toast notifications | **Client** | Needs `useState` for visibility |

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
      ├─ page.tsx                      ← Server Component (Dashboard home)
      ├─ courses/
      │   ├─ page.tsx                  ← Server Component (fetches data, renders CourseSearch)
      │   └─ [id]/
      │       └─ page.tsx              ← Server Component (course detail)
      └─ users/
          └─ page.tsx                  ← Server Component (users list)

components/
  └─ CourseSearch.tsx                   ← Client Component (search + filter)
```

**Data flow for `/dashboard/courses`:**

```
Browser requests /dashboard/courses
        ↓
Server: CoursesPage() runs
        ↓
Server: getCourses() → fetch /api/courses → gets JSON array
        ↓
Server: Renders <CourseSearch courses={[...]} />
        ↓
Server: Sends HTML + CourseSearch JS bundle to browser
        ↓
Browser: CourseSearch hydrates → search input becomes interactive
        ↓
User types in search → useState updates → table filters instantly
```

> **What is hydration?** When the server sends pre-rendered HTML, the browser "attaches" React event handlers to make it interactive — this process is called **hydration**. The user sees the page instantly (HTML), then it becomes interactive moments later (hydration).

---

## Practice Exercises

Try these on your own before moving to Level 6:

1. **Add search to the Users page**
   - Create `components/UserSearch.tsx` with `"use client"`
   - Add `useState` to filter users by name
   - Update `app/dashboard/users/page.tsx` to fetch from an API and pass data to `UserSearch`

2. **Add a "no results" message**
   - In `CourseSearch.tsx`, check if `filteredCourses.length === 0`
   - Display a message like "No courses match your search" when the table would be empty:
     ```tsx
     {filteredCourses.length === 0 ? (
       <p className="text-muted mt-3">No courses match your search.</p>
     ) : (
       <table>...</table>
     )}
     ```

3. **Add a clear button to the search**
   - Add a Bootstrap button next to the input that resets the search:
     ```tsx
     <div className="d-flex gap-2 mb-3">
       <input ... />
       <button
         className="btn btn-outline-secondary"
         onClick={() => setQuery("")}
       >
         Clear
       </button>
     </div>
     ```
   - The button should only appear when there's text in the search box

4. **Try removing `"use client"` — observe the error**
   - Comment out `"use client"` from `CourseSearch.tsx`
   - Save and see the error message
   - This is a great teaching exercise — helps students understand why the directive exists
   - Remember to add it back after testing

5. **Add a result count**
   - Display something like "Showing 2 of 3 courses" above the table:
     ```tsx
     <p className="text-muted">
       Showing {filteredCourses.length} of {courses.length} courses
     </p>
     ```
   - Notice how this updates in real-time as the user types — that's React state in action

6. **Experiment with the boundary**
   - Try adding `"use client"` to `app/dashboard/courses/page.tsx`
   - What happens to the `async function getCourses()` and `await`?
   - *(Answer: It breaks — Client Components cannot be async. This proves why data fetching should stay in Server Components.)*

---

## Summary — What You Learned

| Concept | Key Takeaway |
|---------|-------------|
| **Server Components** | Default in App Router — run on server, can use `async/await`, ship zero JS |
| **Client Components** | Add `"use client"` as the first line — enables hooks and event handlers |
| **`"use client"` directive** | Must be the **very first line** of the file, before all imports |
| **Server → Client pattern** | Server fetches data → passes as props → Client handles interactivity |
| **Hydration** | Server sends HTML first, then browser attaches React handlers |
| **Boundary rules** | Server can render Client; Client cannot import Server; props must be serializable |
| **Decision guide** | Need hooks/events? → Client. Everything else? → Server (default) |
| **Component organization** | Keep Client Components small and focused; keep data fetching in Server Components |

---

## What's Coming Next (Level 6)

We'll add **data mutation** — creating, editing, and deleting courses:

- Topics covered:
  - **Server Actions** — a modern Next.js feature for handling form submissions without building API routes
  - **Forms with `"use client"`** — building create/edit forms
  - **Database integration options:**
    - Option A: **SQLite** (simplest, no setup)
    - Option B: **PostgreSQL / MySQL** (production-style)
    - Option C: **Microservice calls** (call a Go/Node backend)
  - **CRUD operations** — Create, Read, Update, Delete courses

- This is where the dashboard becomes fully functional — not just displaying data, but **modifying** it.
