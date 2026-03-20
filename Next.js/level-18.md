# Level 18 — Error Handling & 404 Pages (`error.tsx`, `not-found.tsx`, `global-error.tsx`)

---

## Objective

Implement **production-grade error handling** and **custom 404 pages** using Next.js App Router's special error files. By the end of this level, your application will gracefully handle runtime errors, missing routes, and missing data — instead of showing ugly default error screens.

---

## Prerequisites

| You Should Know | From Level |
|---|---|
| App Router file conventions | Level 1 |
| Route Groups `(folder)` | Level 16 |
| Dynamic routes `[id]` | Level 4 |
| Server Components vs Client Components | Level 5 |
| Prisma database queries | Level 14 |
| React Suspense & `loading.tsx` | Level 10 |

---

## What Changes in This Level

| Before (Level 17) | After (Level 18) |
|---|---|
| Errors crash the entire page | Errors show a friendly recovery UI |
| Invalid URLs show default browser error | Custom 404 page with navigation |
| Missing database records show blank/crash | Programmatic `notFound()` with proper UI |
| No global error safety net | `global-error.tsx` catches layout-level errors |

---

## The Problem: Why Error Handling Matters

Without error handling, your users see this when something breaks:

```
Unhandled Runtime Error
TypeError: Cannot read properties of undefined (reading 'name')
    at CoursePage (app/dashboard/courses/[id]/page.tsx:12:34)
```

**This is terrible UX.** Users don't understand stack traces. They think the app is broken and leave.

Next.js App Router provides **three special files** that act as safety nets:

| Special File | Purpose | Scope |
|---|---|---|
| `error.tsx` | Catches runtime errors in a route segment | Route-level (wraps `page.tsx`) |
| `not-found.tsx` | Displays when a route doesn't exist | App-wide or route-specific |
| `global-error.tsx` | Catches errors in the root layout | Entire application (last resort) |

### How They Relate to Other Special Files

```
app/
├── layout.tsx          ← Shared UI wrapper
├── loading.tsx         ← Suspense fallback (Level 10)
├── error.tsx           ← Error boundary ⭐ NEW
├── not-found.tsx       ← 404 page ⭐ NEW
├── global-error.tsx    ← Root error handler ⭐ NEW
└── page.tsx            ← Route content
```

---

## How Error Boundaries Work in Next.js

Next.js automatically wraps each route segment with a **React Error Boundary**. Here's what happens behind the scenes:

```
What Next.js generates internally:
┌─────────────────────────────────────────┐
│ <Layout>                                │
│  ┌───────────────────────────────────┐  │
│  │ <ErrorBoundary fallback={Error}>  │  │  ← error.tsx
│  │  ┌─────────────────────────────┐  │  │
│  │  │ <Suspense fallback={Load}>  │  │  │  ← loading.tsx
│  │  │  ┌───────────────────────┐  │  │  │
│  │  │  │ <Page />              │  │  │  │  ← page.tsx
│  │  │  └───────────────────────┘  │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

**Key insight:** `error.tsx` wraps `page.tsx` but **does NOT wrap `layout.tsx`**. This means the layout remains visible when an error occurs — the sidebar and navigation stay intact!

---

## Step 1️⃣ — Dashboard Error Boundary (`error.tsx`)

This handles **runtime errors** inside the dashboard route segment.

### Create the File

**File:** `app/(dashboard)/dashboard/error.tsx`

```tsx
"use client"

export default function DashboardError({
  error,
  reset
}: {
  error: Error
  reset: () => void
}) {

  return (

    <div className="container mt-5 text-center">

      <h2>Something went wrong in the dashboard.</h2>

      <p className="text-muted">{error.message}</p>

      <button
        className="btn btn-primary mt-3"
        onClick={() => reset()}
      >
        Try Again
      </button>

    </div>

  )

}
```

### Line-by-Line Breakdown

| Line | Code | Purpose |
|---|---|---|
| 1 | `"use client"` | **Required** — Error boundaries must run in the browser |
| 3-7 | `DashboardError({ error, reset })` | Next.js automatically passes these two props |
| 4 | `error: Error` | The JavaScript Error object that was thrown |
| 5 | `reset: () => void` | Function to re-render the route segment |
| 11 | `<h2>Something went wrong...</h2>` | User-friendly message (not a stack trace!) |
| 13 | `{error.message}` | Show the error description (not the full trace) |
| 15-19 | `<button onClick={() => reset()}>` | Let the user retry without a full page reload |

### Why `"use client"` is Required

Error boundaries use React's `componentDidCatch` lifecycle method internally. This **only works in the browser**, not on the server. Therefore:

| Component Type | Can Be Error Boundary? | Why? |
|---|---|---|
| Server Component | No | Runs on server, no DOM lifecycle |
| Client Component | Yes | Has access to browser lifecycle methods |

```
Server (Node.js)                    Browser
┌──────────────────┐               ┌──────────────────────┐
│ Renders page.tsx │──── HTML ────▶│ Hydrates components   │
│ (can throw here) │               │ error.tsx catches     │
│                  │               │ errors AFTER hydration│
└──────────────────┘               └──────────────────────┘
```

### What `reset()` Does

The `reset()` function is provided by React's Error Boundary. It attempts to **re-render the errored segment** without reloading the entire page:

```
Error occurs in <Page />
         ↓
error.tsx UI is shown (layout stays visible!)
         ↓
User clicks "Try Again"
         ↓
reset() is called
         ↓
React re-renders the <Page /> component
         ↓
If the error was transient → page loads normally
If the error persists → error.tsx shows again
```

**Common transient errors** that `reset()` can fix:
- Network timeout (API was temporarily down)
- Race condition on initial load
- Expired session (re-fetch triggers re-auth)

---

## Step 2️⃣ — Custom 404 Page (`not-found.tsx`)

This displays when a user navigates to a **route that does not exist**.

### Create the File

**File:** `app/not-found.tsx`

```tsx
import Link from "next/link"

export default function NotFound() {

  return (

    <div className="container text-center mt-5">

      <h1>404</h1>

      <p>Page not found</p>

      <Link
        href="/dashboard"
        className="btn btn-primary"
      >
        Go to Dashboard
      </Link>

    </div>

  )

}
```

### Line-by-Line Breakdown

| Line | Code | Purpose |
|---|---|---|
| 1 | `import Link from "next/link"` | Client-side navigation (no full page reload) |
| 3 | `export default function NotFound()` | Must be the **default export** named `NotFound` |
| 7 | `<h1>404</h1>` | Clear status code for the user |
| 9 | `<p>Page not found</p>` | Human-readable explanation |
| 11-15 | `<Link href="/dashboard">` | Escape hatch — guide users somewhere useful |

### Where `not-found.tsx` Can Live

| Location | Catches 404 For |
|---|---|
| `app/not-found.tsx` | **Any** unmatched route in the entire app |
| `app/(dashboard)/dashboard/not-found.tsx` | Only unmatched routes under `/dashboard/*` |
| `app/(dashboard)/dashboard/courses/not-found.tsx` | Only `/dashboard/courses/*` |

**Note:** The `app/not-found.tsx` at the root acts as the **global 404 fallback**.

### Test It

Open your browser and navigate to:

```
http://localhost:3000/dashboard/unknown-page
```

You should see the custom 404 page instead of the default Next.js error.

### `not-found.tsx` vs `error.tsx` — Key Difference

| Feature | `not-found.tsx` | `error.tsx` |
|---|---|---|
| When it shows | Route doesn't exist / `notFound()` called | Runtime JavaScript error thrown |
| HTTP status | **404** | **500** (or other error codes) |
| Requires `"use client"` | No (can be Server Component) | **Yes** (must be Client Component) |
| Has `reset()` prop | No | Yes |
| Has `error` prop | No | Yes |
| Can be Server Component | Yes | No |

---

## Step 3️⃣ — Triggering `notFound()` Programmatically

Sometimes a route **exists structurally** but the **data doesn't**. For example:

```
/dashboard/courses/999    ← Valid route pattern, but course #999 doesn't exist
```

Without handling this, the page would either crash or show empty content.

### Update the Course Detail Page

**File:** `app/(dashboard)/dashboard/courses/[id]/page.tsx`

```tsx
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function CoursePage({ params }: any) {

  const { id } = await params

  const course = await prisma.course.findUnique({
    where: { id: Number(id) }
  })

  if (!course) {
    notFound()
  }

  return (

    <div className="container">

      <h2>{course.name}</h2>

      <p>Instructor: {course.instructor}</p>

    </div>

  )

}
```

### Line-by-Line Breakdown

| Line | Code | Purpose |
|---|---|---|
| 1 | `import { notFound } from "next/navigation"` | Next.js utility function |
| 2 | `import { prisma } from "@/lib/prisma"` | Database client (Level 14) |
| 4 | `async function CoursePage({ params })` | Server Component with dynamic params |
| 6 | `const { id } = await params` | Extract route parameter (Next.js 15 async) |
| 8-10 | `prisma.course.findUnique(...)` | Query database for specific course |
| 12-14 | `if (!course) { notFound() }` | Trigger 404 if record doesn't exist |
| 18-22 | `<h2>{course.name}</h2>` | Render course data (only reached if found) |

### What `notFound()` Does Internally

```
User visits /dashboard/courses/999
         ↓
Server Component runs
         ↓
prisma.course.findUnique({ where: { id: 999 } })
         ↓
Returns null (no course with ID 999)
         ↓
notFound() is called
         ↓
Next.js throws a special NEXT_NOT_FOUND error
         ↓
Looks for nearest not-found.tsx
         ↓
┌──────────────────────────────────────────────────┐
│ Search order:                                     │
│ 1. app/(dashboard)/dashboard/courses/not-found.tsx│ ← closest
│ 2. app/(dashboard)/dashboard/not-found.tsx        │
│ 3. app/not-found.tsx                              │ ← global fallback
└──────────────────────────────────────────────────┘
         ↓
Renders not-found.tsx with HTTP 404 status
```

### `notFound()` vs Returning `null` vs Throwing an Error

| Approach | What Happens | HTTP Status | UX |
|---|---|---|---|
| `notFound()` | Shows `not-found.tsx` | 404 | Clean 404 page |
| `return null` | Blank page | 200 | Confusing — looks broken |
| `throw new Error(...)` | Shows `error.tsx` | 500 | Misleading — it's not a server error |
| `redirect("/")` | Sends user away | 307 | User doesn't know why |

**Best practice:** Use `notFound()` for missing data. It sends the correct HTTP status code (404) which is important for SEO and user experience.

---

## Step 4️⃣ — Global Error Page (`global-error.tsx`)

This is the **last resort** error handler. It catches errors that happen in the **root layout** itself — something `error.tsx` cannot do.

### Create the File

**File:** `app/global-error.tsx`

```tsx
"use client"

export default function GlobalError({
  error,
  reset
}: {
  error: Error
  reset: () => void
}) {

  return (

    <html>
      <body>

        <div className="container mt-5 text-center">

          <h1>Application Error</h1>

          <p>{error.message}</p>

          <button
            className="btn btn-primary"
            onClick={() => reset()}
          >
            Reload
          </button>

        </div>

      </body>
    </html>

  )

}
```

### Why `global-error.tsx` Includes `<html>` and `<body>`

This is a critical detail that students often miss:

```
Normal error.tsx:                    global-error.tsx:
┌─────────────────────┐             ┌─────────────────────┐
│ <html>  ← layout.tsx│             │                     │
│  <body>             │             │ layout.tsx CRASHED!  │
│   ┌───────────────┐ │             │ No <html> or <body> │
│   │ error.tsx     │ │             │ exists anymore       │
│   │ (replaces     │ │             │                     │
│   │  page content)│ │             │ global-error.tsx     │
│   └───────────────┘ │             │ must provide its     │
│  </body>            │             │ own <html> + <body>  │
│ </html>             │             │                     │
└─────────────────────┘             └─────────────────────┘
```

Since `global-error.tsx` **replaces the entire root layout** when it activates, it must provide its own `<html>` and `<body>` tags. Without them, the browser would render invalid HTML.

### `error.tsx` vs `global-error.tsx`

| Feature | `error.tsx` | `global-error.tsx` |
|---|---|---|
| Catches errors in | `page.tsx` of that route | Root `layout.tsx` |
| Layout visible? | **Yes** — layout stays intact | **No** — replaces everything |
| Needs `<html>`/`<body>`? | No (layout provides them) | **Yes** (no layout available) |
| When it triggers | Most runtime errors | Only root layout errors |
| How common? | Frequently used | Rarely triggered |
| Requires `"use client"` | Yes | Yes |

---

## Complete Error Handling Architecture

```
app/
├── global-error.tsx         ← Catches root layout errors (last resort)
├── not-found.tsx            ← Global 404 fallback
├── layout.tsx               ← Root layout
│
├── (auth)/
│   └── login/
│       ├── page.tsx
│       └── error.tsx        ← Catches login page errors
│
└── (dashboard)/
    └── dashboard/
        ├── layout.tsx
        ├── error.tsx        ← Catches dashboard errors ⭐
        ├── loading.tsx      ← Loading UI (Level 10)
        ├── page.tsx
        │
        └── courses/
            ├── page.tsx
            ├── error.tsx    ← Catches course list errors (optional)
            └── [id]/
                └── page.tsx ← Calls notFound() if course missing
```

### Error Bubbling Flow

Errors **bubble up** through the file tree until they find an `error.tsx`:

```
Error thrown in /dashboard/courses/[id]/page.tsx
         ↓
Step 1: Look for  app/(dashboard)/dashboard/courses/[id]/error.tsx
        → Not found? Bubble up ↑
         ↓
Step 2: Look for  app/(dashboard)/dashboard/courses/error.tsx
        → Not found? Bubble up ↑
         ↓
Step 3: Look for  app/(dashboard)/dashboard/error.tsx
        → FOUND! ✅ Show this error UI
         ↓
Step 4: If none found → app/global-error.tsx (last resort)
```

### Visual Error Handling Map

```
┌──────────────────────────────────────────────────┐
│                 global-error.tsx                   │
│           (catches root layout errors)            │
│  ┌────────────────────────────────────────────┐  │
│  │              Root Layout                    │  │
│  │  ┌──────────────────────────────────────┐  │  │
│  │  │         not-found.tsx                 │  │  │
│  │  │    (catches unknown routes)           │  │  │
│  │  └──────────────────────────────────────┘  │  │
│  │                                            │  │
│  │  ┌──────────────────────────────────────┐  │  │
│  │  │     Dashboard error.tsx              │  │  │
│  │  │  ┌────────────────────────────────┐  │  │  │
│  │  │  │  Dashboard page.tsx            │  │  │  │
│  │  │  │  (errors caught by error.tsx)  │  │  │  │
│  │  │  └────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────┘  │  │
│  │                                            │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

---

## Production Patterns

### Pattern 1: Error Logging

In production, you want to **log errors** to a monitoring service:

```tsx
"use client"

import { useEffect } from "react"

export default function DashboardError({
  error,
  reset
}: {
  error: Error
  reset: () => void
}) {

  useEffect(() => {
    // Send error to monitoring service
    console.error("Dashboard error:", error)
    // In production: Sentry, LogRocket, Datadog, etc.
    // Example: Sentry.captureException(error)
  }, [error])

  return (
    <div className="container mt-5 text-center">
      <h2>Something went wrong</h2>
      <p className="text-muted">{error.message}</p>
      <button className="btn btn-primary mt-3" onClick={() => reset()}>
        Try Again
      </button>
    </div>
  )
}
```

### Pattern 2: Route-Specific Not Found Pages

Create a custom 404 for courses that provides more context:

```tsx
// app/(dashboard)/dashboard/courses/not-found.tsx
import Link from "next/link"

export default function CourseNotFound() {
  return (
    <div className="container text-center mt-5">
      <h2>Course Not Found</h2>
      <p className="text-muted">
        The course you're looking for doesn't exist or has been removed.
      </p>
      <Link href="/dashboard/courses" className="btn btn-primary">
        Browse All Courses
      </Link>
    </div>
  )
}
```

### Pattern 3: Different Error UIs for Different Sections

```
app/
├── (auth)/
│   └── login/
│       └── error.tsx        ← "Login failed. Please try again."
│
├── (dashboard)/
│   └── dashboard/
│       ├── error.tsx        ← "Dashboard error. Try refreshing."
│       └── courses/
│           └── error.tsx    ← "Couldn't load courses. Check your connection."
│
└── global-error.tsx         ← "Something went very wrong. Reload the app."
```

Each section gets a **contextual error message** that makes sense for that part of the app.

### Pattern 4: Retry with Exponential Backoff

```tsx
"use client"

import { useState } from "react"

export default function DashboardError({
  error,
  reset
}: {
  error: Error
  reset: () => void
}) {
  const [retryCount, setRetryCount] = useState(0)

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    reset()
  }

  return (
    <div className="container mt-5 text-center">
      <h2>Something went wrong</h2>
      <p className="text-muted">{error.message}</p>
      {retryCount < 3 ? (
        <button className="btn btn-primary mt-3" onClick={handleRetry}>
          Try Again ({3 - retryCount} attempts remaining)
        </button>
      ) : (
        <p className="text-danger mt-3">
          Multiple retries failed. Please contact support.
        </p>
      )}
    </div>
  )
}
```

---

## All App Router Special Files — Complete Reference

| File | Purpose | Requires `"use client"` | Level Covered |
|---|---|---|---|
| `page.tsx` | Route content | No (default Server) | Level 1 |
| `layout.tsx` | Shared UI wrapper | No | Level 1 |
| `loading.tsx` | Suspense fallback (loading UI) | No | Level 10 |
| `error.tsx` | Error boundary | **Yes** | **Level 18** |
| `not-found.tsx` | 404 page | No | **Level 18** |
| `global-error.tsx` | Root layout error handler | **Yes** | **Level 18** |
| `route.ts` | API endpoint | No | Level 3 |
| `default.tsx` | Parallel route fallback | No | Level 17 |
| `middleware.ts` | Request interceptor | No | Level 15 |
| `template.tsx` | Re-mounting layout variant | No | (Advanced) |

---

## Current Project Architecture

```
app/
├── global-error.tsx                    ⭐ NEW — root error handler
├── not-found.tsx                       ⭐ NEW — global 404 page
├── layout.tsx                          Root layout
├── page.tsx                            Home page
├── middleware.ts                       Route protection (Level 15)
│
├── api/
│   ├── auth/[...nextauth]/route.ts     NextAuth endpoints
│   └── courses/route.ts                Course API
│
├── (auth)/
│   ├── layout.tsx                      Auth-specific layout
│   └── login/
│       └── page.tsx                    Login page
│
└── (dashboard)/
    └── dashboard/
        ├── layout.tsx                  Dashboard layout with sidebar
        ├── page.tsx                    Dashboard home
        ├── error.tsx                   ⭐ NEW — dashboard error boundary
        ├── loading.tsx                 Loading skeleton
        │
        ├── @stats/
        │   ├── page.tsx               Stats parallel slot
        │   └── default.tsx            Stats fallback
        │
        ├── @activity/
        │   ├── page.tsx               Activity parallel slot
        │   └── default.tsx            Activity fallback
        │
        ├── courses/
        │   ├── page.tsx               Course list (paginated)
        │   ├── create/page.tsx        Create course form
        │   └── [id]/
        │       ├── page.tsx           Course detail (uses notFound())  ⭐ UPDATED
        │       └── edit/page.tsx      Edit course form
        │
        └── users/
            └── page.tsx               Users list
```

---

## Practice Exercises

### Exercise 1: Custom Dashboard 404
Create `app/(dashboard)/dashboard/not-found.tsx` with a dashboard-specific 404 message. Include a link back to `/dashboard`. Verify it shows when navigating to `/dashboard/nonexistent`.

### Exercise 2: Test Error Recovery
Temporarily add `throw new Error("Test error")` at the top of your dashboard `page.tsx`. Verify that `error.tsx` catches it, the sidebar layout remains visible, and clicking "Try Again" re-renders the page.

### Exercise 3: User Detail Not Found
In your user detail page (if you have one at `app/(dashboard)/dashboard/users/[id]/page.tsx`), add a `notFound()` call when the user ID doesn't exist in the database.

### Exercise 4: Error Logging with `useEffect`
Enhance your `error.tsx` to log the error using `useEffect` (as shown in Production Pattern 1). Add `console.error()` and verify the error appears in the browser console.

### Exercise 5: Styled Error Pages
Improve the visual design of your `not-found.tsx` and `error.tsx` pages using Bootstrap components. Add an icon or illustration, a more descriptive message, and multiple navigation options.

### Exercise 6: Nested Error Boundaries
Create a separate `error.tsx` inside `app/(dashboard)/dashboard/courses/`. Trigger an error in the courses list page and verify that the **courses-level** error boundary catches it (not the dashboard-level one). Then remove it and verify the error bubbles up to the dashboard-level `error.tsx`.

---

## Summary Table

| Concept | What You Learned |
|---|---|
| `error.tsx` | Client Component that catches runtime errors in a route segment |
| `reset()` | Re-renders the errored component without full page reload |
| `not-found.tsx` | Displays custom UI for 404 (missing routes or data) |
| `notFound()` | Programmatically triggers 404 from Server Components |
| `global-error.tsx` | Last-resort handler for root layout errors (needs own `<html>`) |
| Error bubbling | Errors search upward for the nearest `error.tsx` |
| `"use client"` required | Error boundaries must be Client Components |
| Layout preservation | `error.tsx` keeps the parent layout visible |
| Route-specific 404 | Place `not-found.tsx` in any segment for contextual 404s |

---

## Your Dashboard Now Demonstrates

Your project now covers **all core App Router concepts**:

| Concept | Level | Status |
|---|---|---|
| App Router & File-based Routing | 1 | Done |
| Nested Layouts | 2 | Done |
| API Routes & Server Components | 3 | Done |
| Dynamic Routes `[id]` | 4 | Done |
| Client Components | 5 | Done |
| Dashboard Metrics & Reusable Components | 6 | Done |
| Server Actions | 7 | Done |
| Shared Data Layer | 8 | Done |
| Full CRUD (Edit + Delete) | 9 | Done |
| Loading UI & Suspense | 10 | Done |
| Charts (Recharts) | 11 | Done |
| Pagination | 12 | Done |
| Authentication (NextAuth) | 13 | Done |
| Database (Prisma + PostgreSQL) | 14 | Done |
| Middleware | 15 | Done |
| Route Groups | 16 | Done |
| Parallel Routes | 17 | Done |
| **Error Handling & 404 Pages** | **18** | **Done** |

This is a **production-ready Next.js architecture** covering virtually every App Router feature.

---

## Next Level Preview

> **Level 19** — Intercepting Routes & Modal Patterns
> Use `(.)` and `(..)` conventions to intercept navigation and show content in modals — like Instagram's photo overlay pattern where clicking a photo opens a modal but sharing the URL shows a full page.
