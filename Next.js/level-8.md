# Level 8 — Data Persistence & Shared Data Layer

> **Objective:** By the end of this level, you will have a working **create → list** flow where new courses added via the form actually appear in the courses table. You'll learn how to create a shared data layer, connect Server Actions to it, and use `redirect()` for post-mutation navigation.

> **Prerequisites:**
> - Completed **Levels 1–7**
> - Dev server running (`npm run dev`)
> - Existing structure:
>   ```
>   app/
>     ├─ layout.tsx
>     ├─ page.tsx
>     ├─ api/
>     │   └─ courses/
>     │       └─ route.ts                ← API (currently has hardcoded data)
>     └─ dashboard/
>         ├─ layout.tsx                  ← Sidebar (with Add Course link)
>         ├─ page.tsx                    ← Metric cards
>         ├─ courses/
>         │   ├─ page.tsx                ← Course list + search
>         │   ├─ new/
>         │   │   └─ page.tsx            ← Create form (currently only logs)
>         │   └─ [id]/
>         │       └─ page.tsx            ← Course detail
>         └─ users/
>             └─ page.tsx
>   components/
>     ├─ CourseSearch.tsx
>     └─ StatCard.tsx
>   ```

> **What changes in this level:** Right now the "Add Course" form only logs to the terminal — the new course disappears into nothing. We'll create a **shared data layer** (`lib/data.ts`) that acts as a central data source, connect both the API route and the Server Action to it, and wire up `redirect()` so the user lands on the updated courses list after creating a course.

---

## The Problem We're Solving

Currently, data lives in two separate places:

```
app/api/courses/route.ts     → has its own hardcoded courses array
app/dashboard/courses/new/   → Server Action logs data but doesn't save it
```

**The fix:** Create a single shared module that both files import from — a **central data layer**.

```
lib/data.ts                  ← single source of truth
    ↑                  ↑
    │                  │
route.ts reads    Server Action writes
from here         to here
```

---

## Step 23 — Create the Data Store

- Create a new folder at the project root: `lib/`
- Create file: `lib/data.ts`

```ts
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
```

  **Line-by-line breakdown:**

  | Code | Purpose |
  |------|---------|
  | `export let courses = [...]` | The data array — `let` (not `const`) because we need to modify it via `push` |
  | `export function addCourse(course)` | Helper function to add a new course to the array |
  | `courses.push(course)` | Mutates the shared array — all importers see the updated data |

### Why This Works as a Shared Module

- In Node.js (and Next.js), **modules are cached after first import**.
- This means:

  ```
  File A: import { courses } from "@/lib/data"    → gets the SAME array
  File B: import { courses } from "@/lib/data"    → gets the SAME array
  File C: import { addCourse } from "@/lib/data"   → pushes to the SAME array
  ```

- After File C adds a course, Files A and B will see it on their next read.

### How This Maps to Production

| Our approach (learning) | Production equivalent |
|------------------------|----------------------|
| `lib/data.ts` (in-memory array) | PostgreSQL / MySQL database |
| `export let courses = [...]` | `courses` table with rows |
| `addCourse(course)` | `INSERT INTO courses (...)` |
| `courses.find(c => c.id == id)` | `SELECT * FROM courses WHERE id = ?` |
| Data resets on server restart | Data persists permanently |

> **Important limitation:** In-memory data is lost when the server restarts (`npm run dev` restart or code save triggers). This is fine for learning — in production you'd use a real database.

---

## Step 24 — Update the API Route

- Open `app/api/courses/route.ts` and **replace the entire content** with:

  ```ts
  import { courses } from "@/lib/data"

  export async function GET() {

    return Response.json(courses)

  }
  ```

  **What changed:**

  | Before | After |
  |--------|-------|
  | Hardcoded array inside `route.ts` | Imports from shared `lib/data.ts` |
  | API has its own data | API reads from the central data layer |
  | Adding a course doesn't affect the API | Adding a course is immediately visible via the API |

- **Verify:** Open [http://localhost:3000/api/courses](http://localhost:3000/api/courses) — you should see the same 3 courses as before. The difference is now they come from the shared module.

---

## Step 25 — Update the Server Action

- Open `app/dashboard/courses/new/page.tsx` and **replace the entire content** with:

  ```tsx
  import { addCourse, courses } from "@/lib/data"
  import { redirect } from "next/navigation"

  export default function NewCoursePage() {

    async function createCourse(formData: FormData) {
      "use server"

      const name = formData.get("name")
      const instructor = formData.get("instructor")

      const newCourse = {
        id: courses.length + 1,
        name,
        instructor
      }

      addCourse(newCourse)

      redirect("/dashboard/courses")
    }

    return (
      <div className="container">

        <h2 className="mb-4">Add Course</h2>

        <form action={createCourse}>

          <div className="mb-3">
            <label className="form-label">Course Name</label>
            <input name="name" className="form-control" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Instructor</label>
            <input name="instructor" className="form-control" required />
          </div>

          <button className="btn btn-primary">
            Create Course
          </button>

        </form>

      </div>
    )
  }
  ```

  **Line-by-line breakdown of what changed:**

  | Code | Purpose |
  |------|---------|
  | `import { addCourse, courses } from "@/lib/data"` | Imports the shared data layer — both the array (for ID generation) and the add function |
  | `import { redirect } from "next/navigation"` | Next.js function to navigate the user after the action completes |
  | `id: courses.length + 1` | Simple ID generation — in production, the database generates IDs automatically |
  | `addCourse(newCourse)` | Pushes the new course into the shared array |
  | `redirect("/dashboard/courses")` | Sends the user to the courses list where they can see the new course |

  **What changed from Level 7:**

  | Level 7 (before) | Level 8 (after) |
  |-----------------|-----------------|
  | `console.log("New Course:", name, instructor)` | `addCourse(newCourse)` — actually saves the data |
  | No redirect — stays on the form page | `redirect("/dashboard/courses")` — navigates to the list |
  | Data disappears after logging | Data persists in the shared module |

---

## Step 26 — Test the Complete Flow

1. Open [http://localhost:3000/dashboard/courses/new](http://localhost:3000/dashboard/courses/new)

2. Fill in the form:
   - **Course Name:** `Docker Mastery`
   - **Instructor:** `Alex`

3. Click **Create Course**.

4. **What should happen:**
   - You are automatically redirected to `/dashboard/courses`
   - The courses table now shows **4 courses** (the original 3 + your new one)
   - The search still works — try searching for "Docker"

5. **Verify the API also reflects the change:**
   - Open [http://localhost:3000/api/courses](http://localhost:3000/api/courses)
   - The new course appears in the JSON response

6. **Add another course** to confirm the flow is repeatable:
   - Go back to `/dashboard/courses/new`
   - Add "Kubernetes Basics" by "Admin"
   - The courses list should now show **5 courses**

### The Complete Data Flow

```
User visits /dashboard/courses/new
       ↓
Fills in: "Docker Mastery" + "Alex"
       ↓
Clicks "Create Course"
       ↓
Browser sends FormData to server
       ↓
Server Action runs createCourse(formData)
       ↓
formData.get("name")       → "Docker Mastery"
formData.get("instructor") → "Alex"
       ↓
addCourse({ id: 4, name: "Docker Mastery", instructor: "Alex" })
       ↓
courses array now has 4 items
       ↓
redirect("/dashboard/courses")
       ↓
CoursesPage renders → getCourses() → fetch /api/courses
       ↓
API route reads from lib/data.ts → returns 4 courses
       ↓
CourseSearch component displays updated table
       ↓
User sees "Docker Mastery" in the list
```

---

## Understanding the Architecture

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                    lib/data.ts                       │
│              (Central Data Layer)                    │
│                                                     │
│  courses = [ {id:1,...}, {id:2,...}, {id:3,...} ]    │
│  addCourse(course) → courses.push(course)           │
└──────────────┬────────────────────┬─────────────────┘
               │                    │
         READ  │                    │  WRITE
               ↓                    ↓
┌──────────────────────┐  ┌────────────────────────────┐
│  app/api/courses/    │  │  courses/new/page.tsx       │
│  route.ts            │  │  Server Action              │
│                      │  │                             │
│  GET() →             │  │  createCourse(formData) →   │
│  Response.json(      │  │    addCourse(newCourse)     │
│    courses           │  │    redirect("/courses")     │
│  )                   │  │                             │
└──────────┬───────────┘  └─────────────────────────────┘
           │
     FETCH │
           ↓
┌──────────────────────┐
│  courses/page.tsx     │
│  (Server Component)   │
│                       │
│  getCourses() →       │
│  fetch /api/courses   │
│       ↓               │
│  <CourseSearch        │
│    courses={data} />  │
└───────────────────────┘
```

### The Layers of a Next.js Dashboard

| Layer | Our implementation | Production equivalent |
|-------|-------------------|----------------------|
| **UI Layer** | `page.tsx` components | Same |
| **Data Access Layer** | `lib/data.ts` | ORM (Prisma, Drizzle) or API client |
| **Data Store** | In-memory array | PostgreSQL, MySQL, MongoDB |
| **API Layer** | `app/api/*/route.ts` | Same (or microservice endpoints) |
| **Mutation Layer** | Server Actions | Server Actions + ORM |

> **Key insight:** The architecture is the same whether you use an in-memory array or a real database. When you're ready to switch to a database, you only change `lib/data.ts` — everything else stays identical.

---

## How to Replace This with a Real Database

When you're ready to move beyond the in-memory store, here's what changes:

### Option A — SQLite with Prisma (Simplest database setup)

```ts
// lib/data.ts → replaced by Prisma calls
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getCourses() {
  return prisma.course.findMany()
}

export async function addCourse(course: any) {
  return prisma.course.create({ data: course })
}
```

### Option B — PostgreSQL / MySQL with Prisma

```ts
// Same Prisma code — just change the DATABASE_URL in .env
// DATABASE_URL="postgresql://user:pass@localhost:5432/dashboard"
```

### Option C — Microservice Call

```ts
// lib/data.ts → calls your Go/Node service
export async function getCourses() {
  const res = await fetch("http://localhost:8080/api/courses")
  return res.json()
}

export async function addCourse(course: any) {
  await fetch("http://localhost:8080/api/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course)
  })
}
```

**What stays the same across all options:**

| Component | Changes? | Why |
|-----------|----------|-----|
| `lib/data.ts` functions | Yes — internals change | This is the data access layer |
| `app/api/courses/route.ts` | No | Still calls `getCourses()` |
| `courses/new/page.tsx` Server Action | No | Still calls `addCourse()` |
| `courses/page.tsx` | No | Still renders the table |
| `components/CourseSearch.tsx` | No | Still handles search UI |

> **This is the benefit of a data access layer** — you swap the implementation once, and the entire app works with the new data source.

---

## Current Architecture

```
app/
  ├─ layout.tsx                        ← Root layout
  ├─ page.tsx                          ← Home page
  ├─ api/
  │   └─ courses/
  │       └─ route.ts                  ← API: reads from lib/data.ts
  └─ dashboard/
      ├─ layout.tsx                    ← Sidebar
      ├─ page.tsx                      ← Metric cards
      ├─ courses/
      │   ├─ page.tsx                  ← Course list (fetches from API)
      │   ├─ new/
      │   │   └─ page.tsx              ← Create form (writes to lib/data.ts)
      │   └─ [id]/
      │       └─ page.tsx              ← Course detail
      └─ users/
          └─ page.tsx

components/
  ├─ CourseSearch.tsx                   ← Client Component
  └─ StatCard.tsx                      ← Server Component

lib/
  └─ data.ts                           ← Shared data layer (central data source)
```

**Project organization:**

| Folder | Purpose | Examples |
|--------|---------|---------|
| `app/` | Routes, pages, layouts, API endpoints | `page.tsx`, `layout.tsx`, `route.ts` |
| `components/` | Reusable UI components | `StatCard.tsx`, `CourseSearch.tsx` |
| `lib/` | Data access, utilities, helpers | `data.ts`, `utils.ts`, `api.ts` |

---

## Dashboard Features Built So Far

| Feature | Level | How it works |
|---------|-------|-------------|
| Project setup & App Router | 1 | `create-next-app` with TypeScript |
| Bootstrap styling | 1 | Global CSS import in root layout |
| Sidebar layout | 1 | `dashboard/layout.tsx` with `<Link>` |
| Nested routing | 2 | Folder structure = URL segments |
| API routes | 3 | `route.ts` with `GET()` handler |
| Server Component data fetching | 3 | `async/await` + `fetch()` in components |
| Caching control | 3 | `cache: "no-store"` for fresh data |
| Dynamic routes | 4 | `[id]` folder + `await params` |
| Client Components & search | 5 | `"use client"` + `useState` |
| Dashboard metric cards | 6 | Reusable `StatCard` component |
| Server Actions & forms | 7 | `"use server"` + `<form action={fn}>` |
| Shared data layer | 8 | `lib/data.ts` — central data source |
| Create + redirect flow | 8 | `addCourse()` → `redirect()` |

---

## Practice Exercises

Try these on your own before moving to Level 9:

1. **Create a shared users data store**
   - Add a `users` array and `addUser()` function to `lib/data.ts`:
     ```ts
     export let users = [
       { id: 101, name: "John", role: "Developer" },
       { id: 102, name: "Sarah", role: "Admin" }
     ]

     export function addUser(user: any) {
       users.push(user)
     }
     ```
   - Update the Users API route to read from `lib/data.ts`
   - Create a "Add User" form at `/dashboard/users/new`
   - Test the full flow: create user → redirect to list → see new user

2. **Add a `deleteCourse()` function**
   - Add to `lib/data.ts`:
     ```ts
     export function deleteCourse(id: number) {
       courses = courses.filter(c => c.id !== id)
     }
     ```
   - Note: you need to **reassign** the array (not just `splice`) because `let` allows reassignment
   - We'll use this in the next level — for now, just add the function

3. **Test data persistence across pages**
   - Add a course at `/dashboard/courses/new`
   - Navigate to `/dashboard/courses` — see it in the list
   - Navigate to `/api/courses` — see it in the JSON
   - Navigate to `/dashboard/courses/:id` — see its detail page
   - Restart the dev server (`Ctrl+C` → `npm run dev`) — data resets to the original 3 courses
   - This demonstrates the in-memory limitation

4. **Add an `updateCourse()` function**
   - Add to `lib/data.ts`:
     ```ts
     export function updateCourse(id: number, updates: any) {
       const index = courses.findIndex(c => c.id === id)
       if (index !== -1) {
         courses[index] = { ...courses[index], ...updates }
       }
     }
     ```
   - We'll use this for the edit form in a later level

5. **Improve the ID generation**
   - The current approach (`courses.length + 1`) can create duplicate IDs if courses are deleted
   - Fix it using `Math.max`:
     ```ts
     const newId = Math.max(...courses.map(c => c.id), 0) + 1
     ```
   - This always generates a unique ID by finding the highest existing ID and adding 1

6. **Add `revalidatePath` to the Server Action**
   - Import and call `revalidatePath` before `redirect`:
     ```tsx
     import { revalidatePath } from "next/cache"

     // Inside the Server Action, after addCourse():
     revalidatePath("/dashboard/courses")
     redirect("/dashboard/courses")
     ```
   - `revalidatePath` tells Next.js to clear the cache for that route so it re-fetches data
   - In development mode this may seem unnecessary (caching is disabled), but in production it's essential

---

## Summary — What You Learned

| Concept | Key Takeaway |
|---------|-------------|
| **Shared data layer** | `lib/data.ts` acts as a central data source — all files import from the same module |
| **Module caching** | Node.js caches modules — all importers share the same instance |
| **In-memory store** | Simple array for learning; replace with a database for production |
| **Server Action → data store** | Server Action calls `addCourse()` to write data |
| **API route → data store** | API route reads `courses` array to serve data |
| **`redirect()`** | Navigates the user after a mutation — imported from `next/navigation` |
| **Data access layer pattern** | Swap `lib/data.ts` internals to switch between array, database, or microservice |
| **Project organization** | `app/` for routes, `components/` for UI, `lib/` for data and utilities |

---

## What's Coming Next (Level 9)

We'll complete the CRUD operations by adding **Edit** and **Delete** functionality:

- Topics covered:
  - **Edit Course page** — pre-populated form that updates an existing course
  - **Delete Course** — Server Action triggered by a delete button
  - **Server Actions for mutations** — `updateCourse()` and `deleteCourse()` wired to the data layer
  - **Confirmation before delete** — UX pattern for destructive actions
  - **`revalidatePath()`** — refreshing page data after updates and deletes

- After Level 9, your dashboard will support full **CRUD**: Create, Read, Update, Delete — the foundation of every admin panel.
