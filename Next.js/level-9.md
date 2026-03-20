# Level 9 — Edit, Delete & Complete CRUD Operations

> **Objective:** By the end of this level, you will have a fully functional **CRUD dashboard** — Create, Read, Update, and Delete courses — all powered by Server Actions and the shared data layer. This is the foundation of every admin panel, CMS, and internal tool.

> **Prerequisites:**
> - Completed **Levels 1–8**
> - Dev server running (`npm run dev`)
> - Existing structure:
>   ```
>   app/
>     ├─ layout.tsx
>     ├─ page.tsx
>     ├─ api/
>     │   └─ courses/
>     │       └─ route.ts              ← Reads from lib/data.ts
>     └─ dashboard/
>         ├─ layout.tsx                ← Sidebar
>         ├─ page.tsx                  ← Metric cards
>         ├─ courses/
>         │   ├─ page.tsx              ← Course list + search
>         │   ├─ new/
>         │   │   └─ page.tsx          ← Create form (writes to lib/data.ts)
>         │   └─ [id]/
>         │       └─ page.tsx          ← Course detail
>         └─ users/
>             └─ page.tsx
>   components/
>     ├─ CourseSearch.tsx
>     └─ StatCard.tsx
>   lib/
>     └─ data.ts                       ← Shared data layer (courses array + addCourse)
>   ```

> **What changes in this level:** We add **Delete** and **Edit** functionality to complete the CRUD cycle. After this level, your dashboard can create courses, display them, edit them, and delete them — all using Server Actions with zero API route boilerplate.

---

## CRUD Overview

Before we code, let's map out all four operations:

| Operation | Route | Method | Data layer function | Status |
|-----------|-------|--------|---------------------|--------|
| **C**reate | `/dashboard/courses/new` | Server Action | `addCourse()` | Done (Level 8) |
| **R**ead | `/dashboard/courses` | `fetch()` | API reads `courses` | Done (Level 3) |
| **U**pdate | `/dashboard/courses/edit/[id]` | Server Action | `updateCourse()` | **This level** |
| **D**elete | `/dashboard/courses` (inline) | Server Action | `deleteCourse()` | **This level** |

---

## Step 27 — Extend the Data Store with Update & Delete

- Open `lib/data.ts` and **replace the entire content** with:

  ```ts
  export let courses = [
    {
      id: 1,
      name: "Next.js Fundamentals",
      instructor: "Admin"
    },
    {
      id: 2,
      name: "React Advanced",
      instructor: "Admin"
    },
    {
      id: 3,
      name: "Microservices Architecture",
      instructor: "Admin"
    }
  ]

  export function addCourse(course: any) {
    courses.push(course)
  }

  export function deleteCourse(id: number) {

    const index = courses.findIndex(c => c.id === id)

    if (index !== -1) {
      courses.splice(index, 1)
    }

  }

  export function updateCourse(id: number, data: any) {

    const course = courses.find(c => c.id === id)

    if (course) {
      course.name = data.name
      course.instructor = data.instructor
    }

  }
  ```

  **New functions explained:**

  | Function | What it does | SQL equivalent |
  |----------|-------------|----------------|
  | `addCourse(course)` | Adds a new course to the array | `INSERT INTO courses (name, instructor) VALUES (...)` |
  | `deleteCourse(id)` | Finds and removes a course by ID | `DELETE FROM courses WHERE id = ?` |
  | `updateCourse(id, data)` | Finds a course and overwrites its fields | `UPDATE courses SET name = ?, instructor = ? WHERE id = ?` |

  **Code details:**

  | Code | Purpose |
  |------|---------|
  | `courses.findIndex(c => c.id === id)` | Returns the array index of the matching course (-1 if not found) |
  | `courses.splice(index, 1)` | Removes 1 element at the given index — mutates the array in place |
  | `courses.find(c => c.id === id)` | Returns the matching course object (or `undefined` if not found) |
  | `course.name = data.name` | Directly mutates the object in the array — all importers see the change |

  > **`splice` vs `filter`:** We use `splice` because it mutates the existing array. Using `filter` would create a new array, and since other files hold a reference to the original, they wouldn't see the change. Alternatively, you could reassign: `courses = courses.filter(...)` (because `courses` is declared with `let`).

---

## Step 28 — Add Delete Button to the Courses List

- We'll add a "Delete" button next to each course in the table, using an inline Server Action.

- Open `app/dashboard/courses/page.tsx` and **replace the entire content** with:

  ```tsx
  import { deleteCourse } from "@/lib/data"
  import { redirect } from "next/navigation"

  async function getCourses() {

    const res = await fetch("http://localhost:3000/api/courses", {
      cache: "no-store"
    })

    return res.json()

  }

  export default async function CoursesPage() {

    const courses = await getCourses()

    async function removeCourse(formData: FormData) {
      "use server"

      const id = Number(formData.get("id"))

      deleteCourse(id)

      redirect("/dashboard/courses")
    }

    return (

      <div className="container">

        <h2>Courses</h2>

        <table className="table mt-4">

          <thead>
            <tr>
              <th>ID</th>
              <th>Course</th>
              <th>Instructor</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {courses.map((course: any) => (
              <tr key={course.id}>

                <td>{course.id}</td>

                <td>{course.name}</td>

                <td>{course.instructor}</td>

                <td>

                  <form action={removeCourse}>

                    <input type="hidden" name="id" value={course.id} />

                    <button className="btn btn-danger btn-sm">
                      Delete
                    </button>

                  </form>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    )
  }
  ```

  **Key patterns introduced:**

  | Code | Purpose |
  |------|---------|
  | `<th>Actions</th>` | New table column header for Edit/Delete buttons |
  | `<form action={removeCourse}>` | Each row has its own mini-form that triggers the Server Action |
  | `<input type="hidden" name="id" value={course.id} />` | Passes the course ID to the Server Action without showing it to the user |
  | `Number(formData.get("id"))` | Converts the string from FormData to a number (IDs are stored as numbers) |
  | `btn-danger btn-sm` | Bootstrap classes — red button (`danger`) in small size (`sm`) |

  > **Why a `<form>` for each delete button?** Server Actions are triggered via form submissions. Each row needs its own form to pass the correct `course.id`. This is the standard pattern for inline Server Actions.

### The Hidden Input Pattern

- The hidden input is how we pass **data that the user doesn't type** to a Server Action:

  ```
  <input type="hidden" name="id" value={course.id} />

  User sees:  nothing (hidden)
  FormData:   { "id": "2" }
  Server:     formData.get("id") → "2"
  ```

- This is the same technique used in traditional HTML forms — Next.js Server Actions work with standard HTML form features.

---

## Step 29 — Test Delete

- Open [http://localhost:3000/dashboard/courses](http://localhost:3000/dashboard/courses)

- You should see the courses table with a **Delete** button in each row.

- Click **Delete** on any course.

- **Verify:**
  - The course disappears from the table
  - The page reloads with the updated list
  - Visit `/api/courses` — the deleted course is gone from the JSON too

- **The delete flow:**

  ```
  User clicks "Delete" button on course #2
        ↓
  Browser submits the hidden form: FormData { id: "2" }
        ↓
  Server Action removeCourse() runs
        ↓
  Number(formData.get("id")) → 2
        ↓
  deleteCourse(2) → removes course from lib/data.ts array
        ↓
  redirect("/dashboard/courses") → page re-renders
        ↓
  getCourses() → fetch /api/courses → returns updated array (without course #2)
        ↓
  User sees the table without course #2
  ```

> **Note:** There's no confirmation dialog yet — clicking Delete immediately removes the course. We'll add confirmation as a practice exercise.

---

## Step 30 — Create the Edit Page

- We need a form that is **pre-filled** with the existing course data, allowing the user to modify and save.

- Create the folder structure:
  1. Create folder: `app/dashboard/courses/edit/`
  2. Create folder inside it: `app/dashboard/courses/edit/[id]/`
  3. Create file: `app/dashboard/courses/edit/[id]/page.tsx`

- Full path: `app/dashboard/courses/edit/[id]/page.tsx`

- The courses folder structure now:

  ```
  app/dashboard/courses/
    ├─ page.tsx                    ← List:   /dashboard/courses
    ├─ new/
    │   └─ page.tsx                ← Create: /dashboard/courses/new
    ├─ edit/
    │   └─ [id]/
    │       └─ page.tsx            ← Edit:   /dashboard/courses/edit/:id
    └─ [id]/
        └─ page.tsx                ← Detail: /dashboard/courses/:id
  ```

- Add the following code to `app/dashboard/courses/edit/[id]/page.tsx`:

  ```tsx
  import { courses, updateCourse } from "@/lib/data"
  import { redirect } from "next/navigation"

  export default async function EditCoursePage({ params }: any) {

    const { id } = await params

    const course = courses.find(c => c.id == id)

    async function saveCourse(formData: FormData) {
      "use server"

      const name = formData.get("name")
      const instructor = formData.get("instructor")

      updateCourse(Number(id), { name, instructor })

      redirect("/dashboard/courses")
    }

    return (

      <div className="container">

        <h2>Edit Course</h2>

        <form action={saveCourse}>

          <div className="mb-3">

            <label className="form-label">Course Name</label>

            <input
              name="name"
              defaultValue={course?.name}
              className="form-control"
            />

          </div>

          <div className="mb-3">

            <label className="form-label">Instructor</label>

            <input
              name="instructor"
              defaultValue={course?.instructor}
              className="form-control"
            />

          </div>

          <button className="btn btn-primary">
            Save
          </button>

        </form>

      </div>
    )

  }
  ```

  **Line-by-line breakdown:**

  | Code | Purpose |
  |------|---------|
  | `const { id } = await params` | Extracts the dynamic `[id]` from the URL (Next.js 15 async params) |
  | `courses.find(c => c.id == id)` | Finds the course to edit — uses `==` because `id` from params is a string |
  | `defaultValue={course?.name}` | **Pre-fills** the input with the existing value — key difference from the Create form |
  | `updateCourse(Number(id), { name, instructor })` | Updates the course in the data store |
  | `redirect("/dashboard/courses")` | Sends the user back to the list after saving |

  **`defaultValue` vs `value` (important for forms):**

  | Prop | Behavior | Use case |
  |------|----------|----------|
  | `defaultValue` | Sets the initial value; user can freely edit | Server Components (no state management) |
  | `value` | Controlled — requires `useState` + `onChange` to modify | Client Components with `"use client"` |

  > **Why `defaultValue`?** This is a Server Component (no `"use client"`), so we can't use `useState`. `defaultValue` sets the initial form values and lets the browser handle editing natively. The Server Action receives whatever the user typed when they submit.

### Edit vs Create Form Comparison

| Aspect | Create (`/courses/new`) | Edit (`/courses/edit/[id]`) |
|--------|------------------------|-----------------------------|
| Inputs start as | Empty | Pre-filled with existing data |
| Data source | None | `courses.find(c => c.id == id)` |
| Server Action | `addCourse(newCourse)` | `updateCourse(id, data)` |
| Input prop | *(none or empty string)* | `defaultValue={course?.name}` |
| URL | Static: `/courses/new` | Dynamic: `/courses/edit/:id` |

---

## Step 31 — Add Edit Button to the Courses List

- Open `app/dashboard/courses/page.tsx` and update the **Actions column** in each row.

- Find the `<td>` that contains the delete form and add the Edit link **before** it:

  ```tsx
  <td>

    <a
      href={`/dashboard/courses/edit/${course.id}`}
      className="btn btn-warning btn-sm me-2"
    >
      Edit
    </a>

    <form action={removeCourse} style={{ display: "inline" }}>

      <input type="hidden" name="id" value={course.id} />

      <button className="btn btn-danger btn-sm">
        Delete
      </button>

    </form>

  </td>
  ```

  **Code details:**

  | Code | Purpose |
  |------|---------|
  | `btn-warning` | Bootstrap yellow/orange button — standard for edit actions |
  | `btn-sm` | Small button size — fits neatly in a table cell |
  | `me-2` | Margin-end (right margin) — adds spacing between Edit and Delete buttons |
  | `style={{ display: "inline" }}` | Makes the delete form sit inline next to the Edit link (forms are block elements by default) |

- The Actions column now looks like:

  ```
  ┌────────────────────────┐
  │ [Edit] [Delete]        │
  └────────────────────────┘
  ```

- **Verify:**
  - Open [http://localhost:3000/dashboard/courses](http://localhost:3000/dashboard/courses)
  - Each row shows both **Edit** (yellow) and **Delete** (red) buttons
  - Click **Edit** on a course → opens the edit form pre-filled with that course's data
  - Change the name → click **Save** → redirected to the list with updated data
  - Click **Delete** → course is removed

### Test the Complete Edit Flow

1. Open `/dashboard/courses`
2. Click **Edit** on "React Advanced"
3. URL changes to `/dashboard/courses/edit/2`
4. Form shows:
   - Course Name: `React Advanced` (pre-filled)
   - Instructor: `Admin` (pre-filled)
5. Change name to `React Advanced Patterns`
6. Click **Save**
7. Redirected to `/dashboard/courses` — table shows the updated name

**The edit flow:**

```
User clicks "Edit" on course #2
       ↓
Browser navigates to /dashboard/courses/edit/2
       ↓
EditCoursePage runs on server
       ↓
const { id } = await params        → id = "2"
courses.find(c => c.id == "2")     → { id: 2, name: "React Advanced", ... }
       ↓
Form renders with defaultValue="React Advanced"
       ↓
User changes name to "React Advanced Patterns"
       ↓
User clicks "Save" → FormData { name: "React Advanced Patterns", instructor: "Admin" }
       ↓
Server Action: updateCourse(2, { name: "React Advanced Patterns", instructor: "Admin" })
       ↓
redirect("/dashboard/courses") → list shows updated name
```

---

## Complete CRUD Summary

Your dashboard now supports all four operations:

```
┌─────────────────────────────────────────────────────────────────┐
│                    CRUD Operations                              │
│                                                                 │
│  CREATE ──→  /dashboard/courses/new       ──→ addCourse()       │
│  READ   ──→  /dashboard/courses           ──→ fetch /api/courses│
│  UPDATE ──→  /dashboard/courses/edit/:id  ──→ updateCourse()    │
│  DELETE ──→  /dashboard/courses (inline)  ──→ deleteCourse()    │
│                                                                 │
│  All mutations use Server Actions ("use server")                │
│  All data flows through lib/data.ts                             │
└─────────────────────────────────────────────────────────────────┘
```

### How Each Operation Uses Server Actions

| Operation | Trigger | Server Action | Data layer | After |
|-----------|---------|---------------|------------|-------|
| **Create** | Form submit on `/courses/new` | `createCourse(formData)` | `addCourse(course)` | `redirect("/dashboard/courses")` |
| **Read** | Page load on `/courses` | *(none — just fetch)* | API reads `courses` | Renders table |
| **Update** | Form submit on `/courses/edit/:id` | `saveCourse(formData)` | `updateCourse(id, data)` | `redirect("/dashboard/courses")` |
| **Delete** | Button click on `/courses` | `removeCourse(formData)` | `deleteCourse(id)` | `redirect("/dashboard/courses")` |

---

## Current Architecture

```
app/
  ├─ layout.tsx                              ← Root layout
  ├─ page.tsx                                ← Home page
  ├─ api/
  │   └─ courses/
  │       └─ route.ts                        ← API: GET /api/courses
  └─ dashboard/
      ├─ layout.tsx                          ← Sidebar
      ├─ page.tsx                            ← Metric cards
      ├─ courses/
      │   ├─ page.tsx                        ← Course list + Edit/Delete buttons
      │   ├─ new/
      │   │   └─ page.tsx                    ← Create form
      │   ├─ edit/
      │   │   └─ [id]/
      │   │       └─ page.tsx                ← Edit form (pre-filled)
      │   └─ [id]/
      │       └─ page.tsx                    ← Course detail
      └─ users/
          └─ page.tsx

components/
  ├─ CourseSearch.tsx                         ← Client Component (search)
  └─ StatCard.tsx                            ← Server Component (metric card)

lib/
  └─ data.ts                                 ← Data layer: courses[], addCourse, deleteCourse, updateCourse
```

**Complete route table:**

| Route                            | Purpose           | CRUD operation | Server Action |
|----------------------------------|-------------------|----------------|---------------|
| `/`                              | Home page         | —              | —             |
| `/dashboard`                     | Metric cards      | —              | —             |
| `/dashboard/courses`             | Course list       | **Read** + **Delete** | `removeCourse()` |
| `/dashboard/courses/new`         | Create form       | **Create**     | `createCourse()` |
| `/dashboard/courses/edit/:id`    | Edit form         | **Update**     | `saveCourse()` |
| `/dashboard/courses/:id`         | Course detail     | **Read**       | —             |
| `/dashboard/users`               | Users list        | Read           | —             |
| `/api/courses`                   | Courses JSON API  | Read           | —             |

---

## Practice Exercises

Try these on your own before moving to Level 10:

1. **Add a confirmation before delete**
   - This requires a Client Component because `confirm()` is a browser API:
     ```tsx
     // components/DeleteButton.tsx
     "use client"

     export default function DeleteButton({ id }: { id: number }) {

       async function handleDelete() {
         if (!confirm("Are you sure you want to delete this course?")) return

         const formData = new FormData()
         formData.append("id", id.toString())

         // Call the server action via fetch or pass as prop
       }

       return (
         <button className="btn btn-danger btn-sm" onClick={handleDelete}>
           Delete
         </button>
       )
     }
     ```
   - Alternatively, keep the `<form>` approach and add `onSubmit` with a confirmation in a Client Component wrapper

2. **Implement full CRUD for Users**
   - Add `users`, `addUser()`, `deleteUser()`, `updateUser()` to `lib/data.ts`
   - Create `/dashboard/users/new` for adding users
   - Create `/dashboard/users/edit/[id]` for editing users
   - Add Edit/Delete buttons to the users table
   - This is the best exercise for reinforcing everything you've learned

3. **Add a "not found" state for the edit page**
   - What happens if someone visits `/dashboard/courses/edit/999`?
   - Add a check:
     ```tsx
     if (!course) {
       return (
         <div className="container">
           <h2>Course not found</h2>
           <a href="/dashboard/courses" className="btn btn-primary mt-3">
             Back to Courses
           </a>
         </div>
       )
     }
     ```

4. **Add `revalidatePath` to all mutations**
   - Import `revalidatePath` from `next/cache` and call it before `redirect`:
     ```tsx
     import { revalidatePath } from "next/cache"

     // Inside each Server Action:
     revalidatePath("/dashboard/courses")
     redirect("/dashboard/courses")
     ```
   - This ensures Next.js clears cached data after every mutation — critical in production

5. **Move all course actions to a separate file**
   - Create `app/actions/course.ts`:
     ```ts
     "use server"

     import { addCourse, deleteCourse, updateCourse, courses } from "@/lib/data"
     import { revalidatePath } from "next/cache"
     import { redirect } from "next/navigation"

     export async function createCourseAction(formData: FormData) {
       const name = formData.get("name") as string
       const instructor = formData.get("instructor") as string
       const id = Math.max(...courses.map(c => c.id), 0) + 1
       addCourse({ id, name, instructor })
       revalidatePath("/dashboard/courses")
       redirect("/dashboard/courses")
     }

     export async function deleteCourseAction(formData: FormData) {
       const id = Number(formData.get("id"))
       deleteCourse(id)
       revalidatePath("/dashboard/courses")
       redirect("/dashboard/courses")
     }

     export async function updateCourseAction(formData: FormData) {
       const id = Number(formData.get("id"))
       const name = formData.get("name") as string
       const instructor = formData.get("instructor") as string
       updateCourse(id, { name, instructor })
       revalidatePath("/dashboard/courses")
       redirect("/dashboard/courses")
     }
     ```
   - Import these actions in the respective pages
   - This is the recommended pattern for larger projects — keeps pages clean

6. **Add an "Edit" link to the course detail page**
   - Open `app/dashboard/courses/[id]/page.tsx`
   - Add an Edit button that navigates to `/dashboard/courses/edit/:id`:
     ```tsx
     <Link href={`/dashboard/courses/edit/${id}`} className="btn btn-warning mt-3 me-2">
       Edit
     </Link>
     ```
   - Now users can edit from both the list page and the detail page

---

## Summary — What You Learned

| Concept | Key Takeaway |
|---------|-------------|
| **Delete with Server Actions** | Inline `<form action={fn}>` with a hidden input for the ID |
| **Hidden inputs** | `<input type="hidden" name="id" value={...} />` passes data to Server Actions without user input |
| **Edit form** | Uses `defaultValue` to pre-fill inputs with existing data |
| **`defaultValue` vs `value`** | `defaultValue` for Server Components (uncontrolled); `value` for Client Components (controlled) |
| **Dynamic edit route** | `/courses/edit/[id]` — combines dynamic routing with form handling |
| **`splice` vs `filter`** | `splice` mutates in place (shared references see changes); `filter` creates a new array |
| **Complete CRUD** | Create, Read, Update, Delete — all using Server Actions + shared data layer |
| **Actions file pattern** | Separate `"use server"` file for clean, reusable actions across pages |

---

## What's Coming Next (Level 10 — Advanced Features)

With CRUD complete, we move to **production-grade features**:

- Topics that can be covered next:
  - **Loading states & Suspense** — show skeletons while data loads (`loading.tsx`)
  - **Error handling** — graceful error boundaries (`error.tsx`)
  - **Pagination** — handle large datasets in the courses table
  - **Authentication** — protect the dashboard with NextAuth.js
  - **Database integration** — replace the in-memory store with PostgreSQL + Prisma
  - **Microservice integration** — connect to a Go/Node backend
  - **Optimistic UI** — update the UI before the server confirms (instant feedback)

- These are the features that separate a learning project from a production system.
