# Level 2 — Nested Routing & Dashboard Pages

> **Objective:** By the end of this level, you will have a multi-page dashboard with nested routes, understand layout inheritance, and see how client-side navigation works under the hood.

> **Prerequisites:**
> - Completed **Level 1** (project setup, root layout, dashboard layout with sidebar)
> - Dev server running (`npm run dev`)
> - Existing structure from Level 1:
>   ```
>   app/
>     ├─ layout.tsx          ← Root layout (Bootstrap CSS)
>     ├─ page.tsx            ← Home page (/)
>     └─ dashboard/
>         ├─ layout.tsx      ← Dashboard layout (Sidebar)
>         └─ page.tsx        ← Dashboard page (/dashboard)
>   ```

---

## Step 6 — Create Nested Dashboard Pages

- We will add two new pages inside the dashboard:

  | Route                | Purpose                    |
  |----------------------|----------------------------|
  | `/dashboard/courses` | List of developer courses  |
  | `/dashboard/users`   | List of registered users   |

- These will **automatically** use the sidebar layout you created in Level 1 — no extra configuration needed.

- **Create the folders** inside `app/dashboard/`:
  1. `app/dashboard/courses/`
  2. `app/dashboard/users/`

- Your folder structure should now look like this:

  ```
  app/
    └─ dashboard/
        ├─ layout.tsx           ← Sidebar layout (already exists)
        ├─ page.tsx             ← Dashboard home (already exists)
        ├─ courses/
        │   └─ page.tsx         ← NEW (we'll create in Step 7)
        └─ users/
            └─ page.tsx         ← NEW (we'll create in Step 8)
  ```

> **Reminder:** Only `page.tsx` files become visitable routes. The folders alone don't create routes — you need a `page.tsx` inside them.

---

## Step 7 — Courses Page

- Create file: `app/dashboard/courses/page.tsx`

- Add this code:

  ```tsx
  export default function CoursesPage() {
    return (
      <div className="container">
        <h2>Courses</h2>
        <p>Available developer courses</p>

        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Course Name</th>
              <th>Instructor</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>Next.js Fundamentals</td>
              <td>Admin</td>
            </tr>

            <tr>
              <td>2</td>
              <td>React Advanced</td>
              <td>Admin</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
  ```

  **Code breakdown:**

  | Code | Purpose |
  |------|---------|
  | `table table-striped` | Bootstrap table with alternating row colors for readability |
  | `mt-4` | Margin-top level 4 (`1.5rem` = 24px) — adds space between heading and table |
  | `<thead>` | Table header row — rendered with bold text by default |
  | `<tbody>` | Table body — contains the actual data rows |

- Open [http://localhost:3000/dashboard/courses](http://localhost:3000/dashboard/courses)

- **Verify:** You should see the Bootstrap table inside your sidebar layout. The sidebar links (Home, Courses, Users) should all be visible on the left.

### Why This Works

- Next.js routing rule:

  ```
  app/dashboard/courses/page.tsx  →  /dashboard/courses
  ```

- Because `courses/` is **inside** the `dashboard/` folder, it automatically inherits `dashboard/layout.tsx` (the sidebar).

- The rendering chain for this URL:

  ```
  /dashboard/courses
        ↓
  app/layout.tsx               → <html>, <body>, Bootstrap CSS
    └─ app/dashboard/layout.tsx  → Sidebar + {children}
         └─ app/dashboard/courses/page.tsx  → Courses table
  ```

- **You wrote zero configuration.** The folder structure alone defines the route and its layout.

---

## Step 8 — Users Page

- Create file: `app/dashboard/users/page.tsx`

- Add this code:

  ```tsx
  export default function UsersPage() {
    return (
      <div className="container">
        <h2>Users</h2>

        <table className="table table-bordered mt-4">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>101</td>
              <td>John</td>
              <td>Developer</td>
            </tr>

            <tr>
              <td>102</td>
              <td>Sarah</td>
              <td>Admin</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
  ```

  **Bootstrap table variants used so far:**

  | Class            | Effect                                              |
  |------------------|-----------------------------------------------------|
  | `table-striped`  | Alternating row background colors (used in Courses) |
  | `table-bordered` | Visible borders around every cell (used in Users)   |
  | `table-hover`    | *(try it!)* Row highlights on mouse hover           |

- Visit [http://localhost:3000/dashboard/users](http://localhost:3000/dashboard/users)

- **Verify:** The Users table appears with borders. The sidebar is still present. Click between "Courses" and "Users" in the sidebar — pages switch **without a full reload**.

---

## Key Concepts Recap

### 1. Nested Routing

- Every subfolder inside `app/` creates a URL segment:

  ```
  dashboard/
    ├─ page.tsx              →  /dashboard
    ├─ courses/page.tsx      →  /dashboard/courses
    └─ users/page.tsx        →  /dashboard/users
  ```

- Routes are generated **automatically** — no router configuration file needed.

- You can nest as deep as you want:

  ```
  app/dashboard/courses/advanced/page.tsx  →  /dashboard/courses/advanced
  ```

### 2. Layout Inheritance

- Layouts wrap all pages **below them** in the folder tree:

  ```
  Root Layout (app/layout.tsx)
       ↓ wraps everything
  Dashboard Layout (app/dashboard/layout.tsx)
       ↓ wraps only /dashboard/*
  Page Content
  ```

- The visual result is nested composition:

  ```
  ┌──────────────────────────────────────────────┐
  │ Root Layout (Bootstrap CSS, <html>, <body>)  │
  │  ┌──────────────────────────────────────────┐│
  │  │ Dashboard Layout                         ││
  │  │  ┌──────────┬───────────────────────────┐││
  │  │  │ Sidebar  │  Page Content             │││
  │  │  │          │  (changes per route)      │││
  │  │  └──────────┴───────────────────────────┘││
  │  └──────────────────────────────────────────┘│
  └──────────────────────────────────────────────┘
  ```

- **Important behavior:** When navigating from `/dashboard/courses` to `/dashboard/users`:
  - Root Layout — **does NOT re-render**
  - Dashboard Layout (sidebar) — **does NOT re-render**
  - Only the page content swaps — this is what makes it fast

### 3. Client-Side Navigation

- Because we used `<Link>` from `next/link` in the sidebar, navigation is **client-side**:

  ```tsx
  import Link from "next/link"

  <Link href="/dashboard/courses">Courses</Link>
  ```

- What Next.js does behind the scenes when you click a `<Link>`:

  | Step | What happens |
  |------|-------------|
  | **Prefetch** | Next.js preloads the target page in the background (even before you click) |
  | **Load** | Only the minimal JavaScript for the new page is downloaded |
  | **Render** | The page component replaces `{children}` — layouts stay intact |

- **Result:** Navigation feels instant — no white flash, no full page reload.

> **Try it:** Open browser DevTools → Network tab. Click between sidebar links. Notice that only small JS chunks load — not the entire page.

---

## Current Architecture

```
app/
  ├─ layout.tsx              ← Root layout (Bootstrap CSS, wraps everything)
  ├─ page.tsx                ← Home page (/)
  └─ dashboard/
      ├─ layout.tsx          ← Dashboard layout (Sidebar)
      ├─ page.tsx            ← Dashboard home (/dashboard)
      ├─ courses/
      │   └─ page.tsx        ← Courses page (/dashboard/courses)
      └─ users/
          └─ page.tsx        ← Users page (/dashboard/users)
```

**Complete route table:**

| Route                | File                                | Layout chain                          |
|----------------------|-------------------------------------|---------------------------------------|
| `/`                  | `app/page.tsx`                      | Root Layout                           |
| `/dashboard`         | `app/dashboard/page.tsx`            | Root Layout → Dashboard Layout        |
| `/dashboard/courses` | `app/dashboard/courses/page.tsx`    | Root Layout → Dashboard Layout        |
| `/dashboard/users`   | `app/dashboard/users/page.tsx`      | Root Layout → Dashboard Layout        |

---

## Practice Exercises

Try these on your own before moving to Level 3:

1. **Add a Profile page**
   - Create `app/dashboard/profile/page.tsx`
   - Display a Bootstrap card with a user's name, email, and role
   - Add a "Profile" link in the sidebar (`dashboard/layout.tsx`)
   - Verify it appears at `/dashboard/profile` with the sidebar

2. **Try different Bootstrap table styles**
   - Open the Courses page and try combining classes: `table table-dark table-hover`
   - Open the Users page and try: `table table-striped table-bordered`
   - Reference: [Bootstrap Table Docs](https://getbootstrap.com/docs/5.3/content/tables/)

3. **Add a detail page with deeper nesting**
   - Create `app/dashboard/courses/nextjs/page.tsx`
   - Display details about the "Next.js Fundamentals" course
   - Verify it works at `/dashboard/courses/nextjs`
   - Notice how it still inherits the dashboard sidebar layout

4. **Test layout isolation**
   - Create `app/about/page.tsx` (outside the dashboard folder)
   - Verify it does **NOT** have the sidebar — it only gets the root layout
   - This proves layouts are scoped to their folder

5. **Observe prefetching in action**
   - Open browser DevTools → Network tab
   - Load `/dashboard` and watch the Network tab
   - Notice Next.js **prefetches** the Courses and Users pages automatically (you'll see JS chunks loading in the background)
   - This is why clicking sidebar links feels instant

---

## Summary — What You Learned

| Concept                  | Key Takeaway                                                         |
|--------------------------|----------------------------------------------------------------------|
| **Nested Routing**       | Subfolders inside `app/` create nested URL segments automatically    |
| **Layout Inheritance**   | A `layout.tsx` wraps all pages in its folder and subfolders          |
| **Layout Persistence**   | Layouts don't re-render on navigation — only `{children}` swaps     |
| **Client Navigation**    | `<Link>` enables instant page transitions without full page reloads  |
| **Prefetching**          | Next.js preloads linked pages in the background for instant navigation |
| **Bootstrap Tables**     | `table-striped`, `table-bordered`, `table-hover` for different styles |

---

## What's Coming Next (Level 3)

We'll replace the **hardcoded table data** with real data using **Server Components + Data Fetching**:

- **Server Components** — components that run on the server and send only HTML to the browser (zero client-side JavaScript)
- **Fetch API** — call REST APIs directly inside server components
- **Database integration** — query a database from server-side code
- **Microservice calls** — connect to external services (e.g., a Go backend)

  ```
  Example flow:
  Go service → REST API → Next.js Server Component → fetch() → Render table
  ```

- This is where Next.js becomes powerful — your React components can talk directly to backends without building a separate API layer.
