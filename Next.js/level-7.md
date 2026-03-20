# Level 7 — Server Actions & Form Handling

> **Objective:** By the end of this level, you will understand Server Actions — a modern Next.js feature that lets you handle form submissions directly with server-side functions, **without writing API routes**. You'll build a "Create Course" form and learn the `"use server"` directive.

> **Prerequisites:**
> - Completed **Levels 1–6**
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
>         ├─ layout.tsx                ← Sidebar
>         ├─ page.tsx                  ← Metric cards
>         ├─ courses/
>         │   ├─ page.tsx              ← Course list with search
>         │   └─ [id]/
>         │       └─ page.tsx          ← Course detail
>         └─ users/
>             └─ page.tsx
>   components/
>     ├─ CourseSearch.tsx               ← Client Component
>     └─ StatCard.tsx                   ← Server Component
>   ```

> **What changes in this level:** Until now, we've only been **reading** data. Real dashboards also need to **create, update, and delete** records. Server Actions provide a clean way to handle these mutations directly from forms — no API route boilerplate required.

---

## The Core Concept — Server Actions

### What Are Server Actions?

- Server Actions are **async functions that run on the server**, triggered by form submissions or client-side calls.
- They are marked with the `"use server"` directive.
- They eliminate the need to create separate API routes for form handling.

### Traditional Approach vs Server Actions

**Traditional React flow (without Server Actions):**

```
User submits form
      ↓
Client-side JavaScript catches the event (onSubmit)
      ↓
fetch("POST /api/courses", { body: JSON.stringify(data) })
      ↓
API route receives request (app/api/courses/route.ts)
      ↓
API route processes data → saves to database
      ↓
Returns JSON response
      ↓
Client updates UI
```

- Requires: `"use client"`, `useState`, `onSubmit`, `fetch()`, and a separate `route.ts` file.

**Server Actions flow:**

```
User submits form
      ↓
Form data sent directly to server function
      ↓
Server function processes data → saves to database
      ↓
Page re-renders with updated data
```

- Requires: Just a function with `"use server"` and a `<form action={...}>`.

**Side-by-side comparison:**

| Aspect | Traditional (API route) | Server Actions |
|--------|------------------------|----------------|
| Files needed | `page.tsx` + `route.ts` | `page.tsx` only |
| Client JS needed | Yes (`"use client"`, `fetch`) | No |
| Form handling | `onSubmit` + `preventDefault` + `fetch` | `<form action={serverFunction}>` |
| Boilerplate | High | Minimal |
| Best for | External API consumers, complex flows | Internal CRUD, admin dashboards |

---

## Step 20 — Understand the Form Structure

- We will build a new page at `/dashboard/courses/new` with a form to create courses.

- The form will use native HTML form submission with `action={serverFunction}` — no `onSubmit`, no `preventDefault`, no `fetch`.

- **How `<form action={fn}>` works in Next.js:**

  | Standard HTML | Next.js Server Action |
  |--------------|----------------------|
  | `<form action="/api/submit">` | `<form action={createCourse}>` |
  | Sends POST to URL | Calls the server function directly |
  | Requires API route | No API route needed |
  | Full page reload | Smart re-render |

---

## Step 21 — Create the "Add Course" Page

- Create the folder and file:
  1. Create folder: `app/dashboard/courses/new/`
  2. Create file: `app/dashboard/courses/new/page.tsx`

- Your courses folder structure:

  ```
  app/dashboard/courses/
    ├─ page.tsx              ← List:   /dashboard/courses
    ├─ new/
    │   └─ page.tsx          ← Create: /dashboard/courses/new
    └─ [id]/
        └─ page.tsx          ← Detail: /dashboard/courses/:id
  ```

  > **Note:** Next.js processes **static routes before dynamic routes**. So `/dashboard/courses/new` matches the `new/` folder — it does NOT treat "new" as a dynamic `[id]` parameter.

- Add the following code to `app/dashboard/courses/new/page.tsx`:

  ```tsx
  export default function NewCoursePage() {

    async function createCourse(formData: FormData) {
      "use server"

      const name = formData.get("name")
      const instructor = formData.get("instructor")

      console.log("New Course:", name, instructor)

      // Later this could insert into database
    }

    return (
      <div className="container">

        <h2 className="mb-4">Add Course</h2>

        <form action={createCourse}>

          <div className="mb-3">

            <label className="form-label">Course Name</label>

            <input
              type="text"
              name="name"
              className="form-control"
              required
            />

          </div>

          <div className="mb-3">

            <label className="form-label">Instructor</label>

            <input
              type="text"
              name="instructor"
              className="form-control"
              required
            />

          </div>

          <button className="btn btn-primary">
            Create Course
          </button>

        </form>

      </div>
    )
  }
  ```

  **Line-by-line breakdown:**

  | Code | Purpose |
  |------|---------|
  | `async function createCourse(formData: FormData)` | The Server Action — receives native `FormData` from the form |
  | `"use server"` | **Must be the first line** inside the function — tells Next.js to execute this on the server |
  | `formData.get("name")` | Extracts the value of the input with `name="name"` |
  | `formData.get("instructor")` | Extracts the value of the input with `name="instructor"` |
  | `console.log(...)` | Logs to the **server terminal** (not browser console) — proves it runs on the server |
  | `<form action={createCourse}>` | Connects the form to the Server Action — no `onSubmit` needed |
  | `name="name"` on `<input>` | The `name` attribute is critical — `FormData` uses it to identify fields |
  | `required` | HTML5 validation — browser prevents submission if field is empty |
  | `form-control` | Bootstrap class — full-width input with proper styling |
  | `form-label` | Bootstrap class — styled label above the input |

### How FormData Works

- `FormData` is a **native browser API** — not a React or Next.js concept:

  ```
  <input name="name" value="Next.js Course" />
  <input name="instructor" value="Admin" />
                    ↓
  FormData {
    "name" → "Next.js Course",
    "instructor" → "Admin"
  }
                    ↓
  formData.get("name")       → "Next.js Course"
  formData.get("instructor") → "Admin"
  ```

- The `name` attribute on each `<input>` becomes the **key** in `FormData`. If you forget the `name` attribute, `formData.get(...)` returns `null`.

### Test It

- Open [http://localhost:3000/dashboard/courses/new](http://localhost:3000/dashboard/courses/new)

- Fill in the form:
  - Course Name: `Docker Mastery`
  - Instructor: `Admin`

- Click **Create Course**.

- **Verify:** Check your **terminal** (where `npm run dev` is running) — you should see:

  ```
  New Course: Docker Mastery Admin
  ```

  > **Important:** The log appears in the **server terminal**, not the browser console. This proves the function ran on the server.

---

## Understanding `"use server"`

- `"use server"` is the counterpart to `"use client"`:

  | Directive | Where it runs | Purpose |
  |-----------|--------------|---------|
  | `"use client"` | Browser | Enables React hooks, event handlers |
  | `"use server"` | Server | Enables server-side form processing, DB access |

- **Two ways to use `"use server"`:**

  **1. Inline — inside a Server Component function (what we did above):**

  ```tsx
  export default function Page() {
    async function myAction(formData: FormData) {
      "use server"
      // runs on server
    }

    return <form action={myAction}>...</form>
  }
  ```

  **2. Separate file — create a dedicated actions file (recommended for larger projects):**

  ```tsx
  // app/actions/course.ts
  "use server"

  export async function createCourse(formData: FormData) {
    // runs on server
  }
  ```

  ```tsx
  // app/dashboard/courses/new/page.tsx
  import { createCourse } from "@/app/actions/course"

  export default function NewCoursePage() {
    return <form action={createCourse}>...</form>
  }
  ```

  > **When to use which:** Inline is fine for small forms. A separate `actions/` file is better when multiple pages share the same actions or when actions become complex.

---

## Step 22 — Add Navigation Link in the Sidebar

- Open `app/dashboard/layout.tsx` and add a new link in the sidebar `<ul>`:

  ```tsx
  <li className="nav-item">
    <Link className="nav-link text-white" href="/dashboard/courses/new">
      Add Course
    </Link>
  </li>
  ```

- **Verify:** The sidebar now shows 4 links:

  ```
  Dev Dashboard
  ─────────────
  Home
  Courses
  Users
  Add Course        ← NEW
  ```

- Clicking "Add Course" navigates to the form page with the sidebar intact.

---

## What Happens Behind the Scenes

When the user submits the form, here's the complete flow:

```
1. User fills in form fields and clicks "Create Course"
          ↓
2. Browser collects all inputs into a FormData object
          ↓
3. Browser sends a POST request to the server (automatically)
          ↓
4. Next.js server receives the request
          ↓
5. Server executes createCourse(formData) function
          ↓
6. Function accesses formData.get("name"), formData.get("instructor")
          ↓
7. Function runs server logic (console.log, DB insert, API call, etc.)
          ↓
8. Page re-renders and sends updated HTML to browser
```

**Security benefits:**

| Concern | How Server Actions handle it |
|---------|------------------------------|
| **Code exposure** | The function body never reaches the browser — only a reference ID is sent |
| **SQL injection** | Data is processed on the server where you can sanitize it |
| **CSRF attacks** | Next.js automatically adds CSRF protection to Server Actions |
| **Secret keys** | Database credentials, API keys stay on the server |

---

## Real Production Examples

In a real app, the Server Action would interact with a database:

### With Prisma ORM

```tsx
async function createCourse(formData: FormData) {
  "use server"

  const name = formData.get("name") as string
  const instructor = formData.get("instructor") as string

  await prisma.course.create({
    data: { name, instructor }
  })

  revalidatePath("/dashboard/courses")
  redirect("/dashboard/courses")
}
```

### With a Microservice Call

```tsx
async function createCourse(formData: FormData) {
  "use server"

  const name = formData.get("name") as string
  const instructor = formData.get("instructor") as string

  await fetch("http://course-service:8080/api/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, instructor })
  })

  revalidatePath("/dashboard/courses")
  redirect("/dashboard/courses")
}
```

### With Raw SQL

```tsx
async function createCourse(formData: FormData) {
  "use server"

  const name = formData.get("name") as string
  const instructor = formData.get("instructor") as string

  await sql`INSERT INTO courses (name, instructor) VALUES (${name}, ${instructor})`

  revalidatePath("/dashboard/courses")
  redirect("/dashboard/courses")
}
```

**Key functions used in production:**

| Function | From | Purpose |
|----------|------|---------|
| `revalidatePath("/dashboard/courses")` | `next/cache` | Tells Next.js to re-fetch data for that page (so the new course appears) |
| `redirect("/dashboard/courses")` | `next/navigation` | Redirects the user to the courses list after successful creation |

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
      ├─ layout.tsx                    ← Server Component (Sidebar + Add Course link)
      ├─ page.tsx                      ← Server Component (Metric cards)
      ├─ courses/
      │   ├─ page.tsx                  ← Server Component (list + search)
      │   ├─ new/
      │   │   └─ page.tsx              ← Server Component (create form + Server Action)
      │   └─ [id]/
      │       └─ page.tsx              ← Server Component (course detail)
      └─ users/
          └─ page.tsx                  ← Server Component (users list)

components/
  ├─ CourseSearch.tsx                   ← Client Component
  └─ StatCard.tsx                      ← Server Component
```

**Complete route table:**

| Route                      | Type   | File                                         | Purpose                 |
|----------------------------|--------|----------------------------------------------|-------------------------|
| `/`                        | Page   | `app/page.tsx`                               | Home page               |
| `/dashboard`               | Page   | `app/dashboard/page.tsx`                     | Metric cards            |
| `/dashboard/courses`       | Page   | `app/dashboard/courses/page.tsx`             | Course list + search    |
| `/dashboard/courses/new`   | Page   | `app/dashboard/courses/new/page.tsx`         | Create course form      |
| `/dashboard/courses/:id`   | Page   | `app/dashboard/courses/[id]/page.tsx`        | Course detail           |
| `/dashboard/users`         | Page   | `app/dashboard/users/page.tsx`               | Users list              |
| `/api/courses`             | API    | `app/api/courses/route.ts`                   | Returns courses JSON    |

> **Notice:** `/dashboard/courses/new` is a **static route** and `/dashboard/courses/:id` is a **dynamic route**. Next.js correctly matches `new` to the static folder first, so it never conflicts with `[id]`.

---

## Quick Reference — Server Actions Cheat Sheet

```tsx
// 1. Define the action (with "use server")
async function myAction(formData: FormData) {
  "use server"
  const value = formData.get("fieldName") as string
  // ... process data
}

// 2. Connect to form
<form action={myAction}>
  <input name="fieldName" />
  <button type="submit">Submit</button>
</form>

// 3. After mutation — refresh data & redirect
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function myAction(formData: FormData) {
  "use server"
  // ... save data
  revalidatePath("/dashboard")    // re-fetch page data
  redirect("/dashboard")          // navigate user
}
```

---

## Practice Exercises

Try these on your own before moving to Level 8:

1. **Add more form fields**
   - Add a `<select>` dropdown for course category (Beginner, Intermediate, Advanced):
     ```tsx
     <select name="category" className="form-select">
       <option value="beginner">Beginner</option>
       <option value="intermediate">Intermediate</option>
       <option value="advanced">Advanced</option>
     </select>
     ```
   - Read it in the Server Action with `formData.get("category")`
   - Log all three values in the terminal

2. **Add form validation feedback**
   - After the form submits, show a success message using `redirect`:
     ```tsx
     import { redirect } from "next/navigation"

     async function createCourse(formData: FormData) {
       "use server"
       // ... process data
       redirect("/dashboard/courses")
     }
     ```
   - The user is redirected to the courses list after creating a course

3. **Create a separate actions file**
   - Create `app/actions/course.ts` with `"use server"` at the top of the file
   - Move the `createCourse` function there
   - Import it in the form page:
     ```tsx
     import { createCourse } from "@/app/actions/course"
     ```
   - Verify the form still works

4. **Build a "Create User" form**
   - Create `app/dashboard/users/new/page.tsx`
   - Add fields: Name, Email, Role (dropdown: Developer, Admin, Viewer)
   - Create a Server Action that logs the data
   - Add an "Add User" link to the sidebar

5. **Add a loading/pending state to the form**
   - This requires a Client Component wrapper using the `useFormStatus` hook:
     ```tsx
     "use client"
     import { useFormStatus } from "react-dom"

     export function SubmitButton() {
       const { pending } = useFormStatus()

       return (
         <button className="btn btn-primary" disabled={pending}>
           {pending ? "Creating..." : "Create Course"}
         </button>
       )
     }
     ```
   - Import and use `<SubmitButton />` instead of a plain `<button>` in the form
   - Notice how the button text changes and becomes disabled during submission

6. **Compare: Server Action vs API route**
   - Try building the same form using a traditional approach:
     - Add a `POST` handler to `app/api/courses/route.ts`
     - Create a Client Component form with `"use client"`, `useState`, `onSubmit`, and `fetch`
   - Compare the amount of code required — this demonstrates why Server Actions reduce boilerplate

---

## Summary — What You Learned

| Concept | Key Takeaway |
|---------|-------------|
| **Server Actions** | Async functions with `"use server"` — handle form submissions without API routes |
| **`"use server"` directive** | Marks a function to run on the server — counterpart to `"use client"` |
| **`<form action={fn}>`** | Connects a form to a Server Action — no `onSubmit`, no `fetch` needed |
| **FormData** | Native browser API — access values with `formData.get("name")` using the input's `name` attribute |
| **Security** | Server Action code never reaches the browser; CSRF protection is automatic |
| **Static vs dynamic routes** | `/courses/new` (static) takes priority over `/courses/[id]` (dynamic) — no conflicts |
| **`revalidatePath()`** | Re-fetches page data after a mutation so the UI reflects changes |
| **`redirect()`** | Navigates the user to a different page after the action completes |
| **Actions file pattern** | For larger projects, put `"use server"` at the top of a separate file and export multiple actions |

---

## What's Coming Next (Level 8)

We'll add **data persistence** so that newly created courses actually appear in the courses list:

- Topics covered:
  - **In-memory data store** — simple approach to persist data during the dev session
  - **Database integration options:**
    - Option A: **SQLite** — zero-config, file-based database (simplest)
    - Option B: **PostgreSQL / MySQL** — production-grade relational database
    - Option C: **Microservice API** — call a Go/Node backend for data storage
  - **Full CRUD operations** — Create, Read, Update, Delete courses
  - **`revalidatePath()` in action** — see the courses list update after creating a new course

- This is where the dashboard becomes fully functional — not just displaying data, but **persisting changes**.
