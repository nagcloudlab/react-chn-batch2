# Level 1 — Next.js Project Setup & Routing Fundamentals

> **Objective:** By the end of this level, you will have a working Next.js project with the App Router, Bootstrap styling, multiple routes, and a sidebar layout — understanding the core architecture behind each piece.

> **Prerequisites:**
> - Node.js v18+ installed (`node -v` to verify)
> - A code editor (VS Code recommended)
> - Basic knowledge of React components, JSX, and props
> - Familiarity with terminal/command line

---

## Step 1 — Create the Next.js Project (App Router)

- Run the following command to scaffold a new Next.js app:

  ```bash
  npx create-next-app@latest next-dashboard
  ```

  - `npx` — runs the package without installing it globally
  - `create-next-app@latest` — official Next.js project generator (always pulls the latest version)
  - `next-dashboard` — the project folder name (you can change this)

- When prompted, choose the following options:

  | Prompt          | Choose | Why                                                        |
  |-----------------|--------|------------------------------------------------------------|
  | **TypeScript**  | Yes    | Type safety catches bugs at compile time, industry standard |
  | **ESLint**      | Yes    | Linting enforces code quality and consistency               |
  | **Tailwind**    | No     | We'll use Bootstrap instead for familiar class-based styling |
  | **App Router**  | Yes    | The modern Next.js routing system (replaces Pages Router)   |
  | **src directory** | No   | Keeps the project structure flat and simpler to navigate     |

- Start the development server:

  ```bash
  cd next-dashboard
  npm run dev
  ```

- Open [http://localhost:3000](http://localhost:3000) — you should see the Next.js welcome page.

- **Verify:** If you see the Next.js logo and welcome text, your setup is correct.

### Why This Matters

- Next.js uses the **App Router** architecture (introduced in Next.js 13, now the default).
- It replaced the older **Pages Router** (`pages/` directory) — you may see the Pages Router in older tutorials, but App Router is the standard going forward.
- The core idea revolves around a simple folder structure:

  ```
  app/
    layout.tsx    ← wraps all pages (like a master template)
    page.tsx      ← the actual page content
  ```

- Each file has a specific purpose:

  | File         | Purpose                                                    |
  |--------------|------------------------------------------------------------|
  | `layout.tsx` | Global UI wrapper — shared across all pages (navbar, footer, etc.) |
  | `page.tsx`   | Route page — the content unique to that URL                |
  | `loading.tsx`| *(future)* Loading UI shown while page data is being fetched |
  | `error.tsx`  | *(future)* Error boundary for handling runtime errors       |

- So `app/page.tsx` represents the `/` route (your homepage).

> **Note for Students:** Every folder inside `app/` can have its own `page.tsx`, `layout.tsx`, `loading.tsx`, and `error.tsx`. This is the convention — Next.js recognizes these filenames automatically.

---

## Step 2 — Install Bootstrap

- Since we're using Bootstrap for UI, install it:

  ```bash
  npm install bootstrap
  ```

  - This adds Bootstrap to `node_modules/` and records it in `package.json` under `dependencies`.

- Open `app/layout.tsx` and add the Bootstrap CSS import **at the very top**:

  ```tsx
  import 'bootstrap/dist/css/bootstrap.min.css'

  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    )
  }
  ```

  **Line-by-line breakdown:**

  | Line | What it does |
  |------|-------------|
  | `import 'bootstrap/dist/css/bootstrap.min.css'` | Loads Bootstrap styles globally for the entire app |
  | `children: React.ReactNode` | TypeScript type — accepts any valid React content |
  | `<html lang="en">` | Root HTML element — required in the root layout |
  | `{children}` | Placeholder where the current page's content gets injected |

- **Verify:** Open the browser → the font style should change (Bootstrap's default font replaces the browser default).

### Why Layout Exists

- `layout.tsx` wraps **every page** in the app — it is the outermost shell.
- Think of it as a structural container:

  ```
  Root Layout (app/layout.tsx)
    ├─ Navbar         ← shared across all pages
    ├─ Sidebar        ← shared across all pages
    └─ {children}     ← this changes per route
  ```

- **Key behavior:** When you navigate between pages, the layout does **NOT re-render** — only `{children}` swaps out. This makes navigation fast and preserves state (e.g., sidebar scroll position).

- Later we will add inside this layout:
  - Navbar
  - Authentication guards
  - Sidebar

> **Common Mistake:** Do not import Bootstrap CSS in individual pages — import it once in the root layout, and it applies everywhere.

---

## Step 3 — Clean the Home Page

- Open `app/page.tsx` and **replace everything** with:

  ```tsx
  export default function HomePage() {
    return (
      <div className="container mt-5">
        <h1>Developer Dashboard</h1>
        <p>Welcome to the Next.js training dashboard.</p>
      </div>
    )
  }
  ```

  **What each Bootstrap class does:**

  | Class       | Effect                                           |
  |-------------|--------------------------------------------------|
  | `container` | Centers content with responsive left/right margins |
  | `mt-5`      | Adds top margin (level 5 = `3rem` = 48px)        |

- Save the file — the browser will auto-refresh.

- **Verify:** You should see "Developer Dashboard" heading with "Welcome to..." text, nicely centered.

### What Just Happened (Important)

- The Next.js dev server performed a **Hot Reload** (also called **Fast Refresh**).
- This means:
  - Code change → instant browser update
  - **No manual refresh required**
  - Component **state is preserved** during edits (e.g., form inputs don't reset)
- This only works in **development mode** (`npm run dev`). In production, the app is pre-built and served as static/server-rendered pages.

> **Try it yourself:** Change the `<h1>` text, save, and watch the browser update instantly without losing the page scroll position.

---

## Step 4 — Create First Dashboard Route

- Now we introduce **Next.js file-based routing** — one of the most important concepts.

- Create the folder and file:
  1. Create folder: `app/dashboard/`
  2. Create file inside it: `app/dashboard/page.tsx`

- Add the following code to `app/dashboard/page.tsx`:

  ```tsx
  export default function DashboardPage() {
    return (
      <div className="container mt-5">
        <h2>Dashboard</h2>
        <p>This is the main dashboard page.</p>
      </div>
    )
  }
  ```

- Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) — you now have **two pages**:

  | Route        | File                       | What it renders         |
  |--------------|----------------------------|-------------------------|
  | `/`          | `app/page.tsx`             | Home page               |
  | `/dashboard` | `app/dashboard/page.tsx`   | Dashboard page          |

- **Verify:** You can navigate between `/` and `/dashboard` by changing the URL in the browser.

### Key Concept — File-Based Routing

- In Next.js: **Folders = URL segments**
- The rule is simple:

  ```
  app/page.tsx                    →  /
  app/dashboard/page.tsx          →  /dashboard
  app/dashboard/courses/page.tsx  →  /dashboard/courses
  app/about/page.tsx              →  /about
  ```

- This is called **File-Based Routing** — no need for a separate router configuration (unlike React Router in plain React apps).

- **Only `page.tsx` files become routes.** You can have other files in the folder (components, utilities, styles) and they will NOT create routes.

> **Comparison with React Router:**
>
> | Feature               | React (react-router)          | Next.js (App Router)          |
> |-----------------------|-------------------------------|-------------------------------|
> | Route definition      | `<Route path="/dashboard">` in code | Create `app/dashboard/page.tsx` |
> | Configuration         | Manual route config file      | Automatic from folder structure |
> | Nested layouts        | Manual with `<Outlet />`      | Automatic with `layout.tsx`    |

---

## Step 5 — Add Dashboard Layout (Sidebar)

- Dashboards need shared UI (like a sidebar) that appears on **every** dashboard sub-page.

- Create `app/dashboard/layout.tsx`:

  ```tsx
  import Link from "next/link"

  export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="d-flex">

        {/* Sidebar */}
        <div className="bg-dark text-white p-3" style={{width: "250px", height:"100vh"}}>
          <h4>Dev Dashboard</h4>

          <ul className="nav flex-column">
            <li className="nav-item">
              <Link className="nav-link text-white" href="/dashboard">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-white" href="/dashboard/courses">
                Courses
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-white" href="/dashboard/users">
                Users
              </Link>
            </li>
          </ul>

        </div>

        {/* Main Content Area */}
        <div className="p-4 flex-grow-1">
          {children}
        </div>

      </div>
    )
  }
  ```

  **Key pieces explained:**

  | Code | Purpose |
  |------|---------|
  | `import Link from "next/link"` | Next.js `<Link>` component — enables **client-side navigation** (no full page reload) |
  | `d-flex` | Bootstrap flexbox — places sidebar and content side by side |
  | `bg-dark text-white` | Dark background with white text for the sidebar |
  | `style={{width: "250px", height:"100vh"}}` | Fixed sidebar width, full viewport height |
  | `nav flex-column` | Bootstrap vertical navigation list |
  | `{children}` | Where the active page content gets injected |

- Refresh `/dashboard` — you now have a sidebar layout.

- **Verify:** The sidebar should appear on the left with three links (Home, Courses, Users). The "Dashboard" content appears on the right.

### Important Concept — Nested Layouts

- When you place a `layout.tsx` inside a subfolder, it wraps **only the pages in that subfolder** (and deeper):

  ```
  app/layout.tsx                  ← Root layout (wraps EVERYTHING)
    └─ app/dashboard/layout.tsx   ← Dashboard layout (wraps only /dashboard/*)
         ├─ dashboard/page.tsx
         ├─ dashboard/courses/page.tsx
         └─ dashboard/users/page.tsx
  ```

- **Layouts are nested automatically.** The rendering order is:

  ```
  Root Layout (Bootstrap CSS, <html>, <body>)
    └─ Dashboard Layout (Sidebar + Content area)
         └─ Page Content (changes per route)
  ```

- Every page under `/dashboard` will automatically share the same sidebar — **no need to duplicate code**.

> **Why `<Link>` instead of `<a>`?**
> - `<a href="...">` causes a **full page reload** (the entire app re-downloads)
> - `<Link href="...">` performs **client-side navigation** (only the new page component loads, the layout stays intact)
> - This makes navigation feel instant and preserves layout state

---

## Current Architecture

```
app/
  ├─ layout.tsx          ← Root layout (Bootstrap CSS, wraps everything)
  ├─ page.tsx            ← Home page (/)
  └─ dashboard/
      ├─ layout.tsx      ← Dashboard layout (Sidebar)
      └─ page.tsx        ← Dashboard page (/dashboard)
```

**How requests flow:**

```
Browser requests /dashboard
        ↓
app/layout.tsx          → renders <html>, <body>, Bootstrap
  └─ app/dashboard/layout.tsx  → renders Sidebar + {children}
       └─ app/dashboard/page.tsx  → renders "Dashboard" content
```

---

## Quick Reference — Key Files in App Router

| File           | Purpose                              | Required? |
|----------------|--------------------------------------|-----------|
| `page.tsx`     | The UI for a route                   | Yes (to make a route visible) |
| `layout.tsx`   | Shared UI wrapper for a route segment | Yes (root only, optional elsewhere) |
| `loading.tsx`  | Loading skeleton / spinner            | Optional  |
| `error.tsx`    | Error boundary for the route          | Optional  |
| `not-found.tsx`| Custom 404 page for the route         | Optional  |

---

## Practice Exercises

Try these on your own before moving to Level 2:

1. **Add an About page**
   - Create `app/about/page.tsx`
   - Add a heading and a paragraph about the project
   - Verify it works at `/about`

2. **Add a Settings page inside dashboard**
   - Create `app/dashboard/settings/page.tsx`
   - Add it as a new link in the sidebar
   - Verify the sidebar persists on the settings page

3. **Experiment with layout nesting**
   - Create `app/about/layout.tsx` that adds a blue banner above the about page content
   - Observe how it nests inside the root layout but is independent of the dashboard layout

4. **Break things intentionally (to learn)**
   - Rename `page.tsx` to `index.tsx` — what happens? *(Answer: the route disappears — Next.js only recognizes `page.tsx`)*
   - Delete `app/layout.tsx` — what error do you get? *(Answer: Next.js requires a root layout)*
   - Use `<a>` instead of `<Link>` — notice the full page flash on navigation

---

## Summary — What You Learned

| Concept              | Key Takeaway                                                    |
|----------------------|-----------------------------------------------------------------|
| **App Router**       | Modern Next.js routing based on the `app/` directory            |
| **File-Based Routing** | Folders become URL segments, `page.tsx` makes them visitable  |
| **Root Layout**      | `app/layout.tsx` wraps every page — import global CSS here      |
| **Nested Layouts**   | Subfolder `layout.tsx` wraps only its children — layouts compose |
| **`<Link>`**         | Client-side navigation — fast, no full reload                   |
| **Hot Reload**       | Code changes reflect instantly in the browser during development |

---

## Next Steps (Level 2)

We will add real dashboard pages and introduce **data fetching**:

- `/dashboard/courses` — display a list of courses
- `/dashboard/users` — display a list of users
- Topics covered:
  - **Server Components** — components that render on the server (no JavaScript sent to browser)
  - **Fetch API** — fetching data from REST APIs inside server components
  - **Database calls** — querying a database directly from server-side code
  - **Microservices integration** — connecting to external backend services
