# Level 15 — Middleware & Production-Grade Route Protection

> **Objective:** By the end of this level, you will understand Next.js Middleware — a powerful feature that intercepts requests **before** they reach the page. You'll replace the layout-level auth check with middleware for faster, more secure route protection, and learn how enterprises use middleware for far more than just authentication.

> **Prerequisites:**
> - Completed **Levels 1–14**
> - Dev server running (`npm run dev`)
> - Authentication set up (Level 13) with NextAuth / Auth.js
> - `NEXTAUTH_SECRET` configured in `.env`

> **What changes in this level:** In Level 13, we added auth protection inside `dashboard/layout.tsx` using `getServerSession()`. This works, but the server starts rendering the page before it realizes the user isn't logged in. **Middleware** intercepts the request **before any rendering happens** — it's faster, cleaner, and the standard production approach.

---

## The Problem with Layout-Level Auth

In Level 13, our protection looked like this:

```tsx
// app/dashboard/layout.tsx
export default async function DashboardLayout({ children }: any) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")     // redirect AFTER the layout starts rendering
  }

  return <div>...</div>
}
```

**The issue:**

```
Layout-level auth:                    Middleware auth:
──────────────────                    ────────────────
Request arrives                       Request arrives
       ↓                                    ↓
Layout starts rendering               Middleware intercepts
       ↓                                    ↓
getServerSession() runs                Check token (fast)
       ↓                                    ↓
No session found                       No session found
       ↓                                    ↓
redirect("/login")                     redirect("/login")
       ↓                                    ↓
Page was partially processed           Page was NEVER processed
(wasted server work)                   (zero wasted work)
```

| Aspect | Layout auth | Middleware auth |
|--------|------------|-----------------|
| **When it runs** | During page rendering | Before rendering starts |
| **Server work wasted** | Yes — layout begins rendering | No — blocked immediately |
| **Speed** | Slower — rendering + redirect | Faster — redirect before any work |
| **Scope** | Per-layout (must add to each layout) | Global or pattern-matched |
| **Standard approach** | Learning / prototyping | Production |

---

## What Is Middleware?

- Middleware is a function that runs **before every matched request** on the server.
- It sits between the browser request and the page rendering:

  ```
  Browser Request
        ↓
  ┌─────────────────────┐
  │    middleware.ts     │  ← Runs FIRST, before anything else
  │                     │
  │  • Check auth       │
  │  • Redirect         │
  │  • Modify headers   │
  │  • Rewrite URLs     │
  └─────────┬───────────┘
            ↓
  ┌─────────────────────┐
  │   layout.tsx        │  ← Only runs if middleware allows
  │   page.tsx          │
  └─────────────────────┘
  ```

- The middleware file must be placed at the **project root** (same level as `app/`):

  ```
  next-dashboard/
    ├─ app/
    ├─ components/
    ├─ lib/
    ├─ prisma/
    ├─ middleware.ts          ← HERE (project root)
    ├─ package.json
    └─ ...
  ```

  > **Important:** There can only be **one** `middleware.ts` file per project. It must be at the root — not inside `app/` or any subfolder.

---

## Step 1 — Verify Dependencies

- Middleware uses `getToken` from `next-auth/jwt` to read the encrypted session cookie.
- This is already available if you installed `next-auth` in Level 13:

  ```bash
  # Already installed — just verify
  npm list next-auth
  ```

  > **Note:** You do NOT need to install `@auth/core` separately if you have `next-auth` v4+. The JWT helper is built in.

---

## Step 2 — Create the Middleware File

- Create file at the **project root**: `middleware.ts`

  ```
  next-dashboard/
    ├─ app/
    ├─ components/
    ├─ lib/
    ├─ middleware.ts       ← NEW FILE (project root, NOT inside app/)
    └─ ...
  ```

---

## Step 3 — Implement the Middleware

- Add the following code to `middleware.ts`:

  ```ts
  import { NextResponse } from "next/server"
  import { getToken } from "next-auth/jwt"

  export async function middleware(request: any) {

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })

    // If no session → redirect to login
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      )
    }

    return NextResponse.next()
  }

  export const config = {
    matcher: ["/dashboard/:path*"]
  }
  ```

  **Line-by-line breakdown:**

  | Code | Purpose |
  |------|---------|
  | `import { NextResponse } from "next/server"` | Next.js utility for creating responses (redirect, rewrite, continue) |
  | `import { getToken } from "next-auth/jwt"` | Reads the NextAuth session from the encrypted JWT cookie |
  | `export async function middleware(request)` | The middleware function — runs on every matched request |
  | `getToken({ req: request, secret: ... })` | Decrypts the session cookie — returns the user token or `null` |
  | `if (!token)` | No valid session exists |
  | `NextResponse.redirect(new URL("/login", request.url))` | Redirects to login page — the dashboard page never renders |
  | `NextResponse.next()` | Allows the request to continue to the page |
  | `export const config = { matcher: [...] }` | Defines which routes this middleware applies to |
  | `"/dashboard/:path*"` | Matches `/dashboard` and **all** nested paths (`/dashboard/courses`, `/dashboard/courses/new`, etc.) |

### The `matcher` Pattern

The `matcher` config controls which routes trigger the middleware:

| Pattern | Matches | Does NOT match |
|---------|---------|----------------|
| `"/dashboard"` | `/dashboard` only | `/dashboard/courses` |
| `"/dashboard/:path*"` | `/dashboard` and all sub-paths | `/login`, `/api/*` |
| `"/dashboard/:path+"` | `/dashboard/courses`, `/dashboard/users` | `/dashboard` (root) |
| `"/(dashboard\|admin)/:path*"` | `/dashboard/*` and `/admin/*` | `/login`, `/api/*` |

**Common matcher configurations:**

```ts
// Protect only dashboard
export const config = {
  matcher: ["/dashboard/:path*"]
}

// Protect multiple sections
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/settings/:path*"]
}

// Protect everything except public pages
export const config = {
  matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"]
}
```

> **The last pattern** uses a negative lookahead regex — it matches all routes **except** `/login`, `/api`, and Next.js internal paths. This is the most secure approach for apps where most pages require auth.

---

## Step 4 — Ensure Auth Secret Is Set

- Verify your `.env` (or `.env.local`) has the secret:

  ```bash
  NEXTAUTH_SECRET=super-secret-key
  ```

- To generate a strong secret for production:

  ```bash
  openssl rand -base64 32
  ```

  **Example output:**
  ```
  NEXTAUTH_SECRET=K7gY3pN8xQ2wR5tE9bA4vM1jD6fH0cU3sL8iO7nZ=
  ```

  > **Critical:** The `NEXTAUTH_SECRET` in middleware **must match** the one used by NextAuth in `lib/auth.ts`. If they differ, middleware can't decrypt the session cookie and every request will be treated as unauthenticated.

---

## Step 5 — Update Dashboard Layout (Remove Redundant Check)

- Since middleware now handles auth, the layout-level check is redundant. You can simplify `app/dashboard/layout.tsx`:

  ```tsx
  import { getServerSession } from "next-auth"
  import { authOptions } from "@/lib/auth"
  import Link from "next/link"
  import LogoutButton from "@/components/LogoutButton"

  export default async function DashboardLayout({ children }: any) {

    // Session is guaranteed to exist here (middleware already checked)
    const session = await getServerSession(authOptions)

    return (

      <div className="d-flex">

        <div className="bg-dark text-white p-3" style={{ width: "250px", height: "100vh" }}>
          <h4>Dev Dashboard</h4>

          <p className="text-muted small">Welcome, {session?.user?.name}</p>

          <ul className="nav flex-column">
            <li className="nav-item">
              <Link className="nav-link text-white" href="/dashboard">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" href="/dashboard/courses">Courses</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" href="/dashboard/users">Users</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" href="/dashboard/courses/new">Add Course</Link>
            </li>
          </ul>

          <LogoutButton />

        </div>

        <div className="p-4 flex-grow-1">
          {children}
        </div>

      </div>

    )

  }
  ```

  **What changed:**

  | Before (Level 13) | After (Level 15) |
  |-------------------|------------------|
  | `if (!session) redirect("/login")` | Removed — middleware handles this |
  | Session might be null | Session guaranteed to exist (middleware blocked unauthenticated requests) |

  > **Note:** We still call `getServerSession()` to display the user's name — but we no longer need the redirect check because middleware has already verified the session before the layout even runs.

---

## Step 6 — Test the Middleware

1. **Clear your session:** Logout or clear browser cookies
2. **Visit** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
3. **Verify:** Immediately redirected to `/login` — no flash of dashboard content
4. **Login** with `admin` / `admin`
5. **Verify:** Dashboard loads normally with "Welcome, Admin User" in the sidebar
6. **Test nested routes:** Visit `/dashboard/courses`, `/dashboard/courses/new` while logged in — all work
7. **Clear cookies again** and try `/dashboard/courses` directly — redirected to `/login`

### How to Verify Middleware Is Running

- Add a `console.log` at the top of your middleware:

  ```ts
  export async function middleware(request: any) {
    console.log("Middleware running for:", request.nextUrl.pathname)
    // ...
  }
  ```

- Check your **server terminal** — you'll see the log for every matched request:

  ```
  Middleware running for: /dashboard
  Middleware running for: /dashboard/courses
  Middleware running for: /dashboard/courses/new
  ```

  > Remember to remove the `console.log` after testing.

---

## How Middleware Executes

### Execution Order

```
Browser request: /dashboard/courses
       ↓
1. middleware.ts              ← Runs FIRST
       ↓
2. app/layout.tsx             ← Root layout
       ↓
3. app/dashboard/layout.tsx   ← Dashboard layout (sidebar)
       ↓
4. app/dashboard/courses/page.tsx  ← Page component
```

- Middleware runs **before** any layout or page — even before `loading.tsx`.
- If middleware redirects, steps 2–4 **never execute**.

### What Middleware Can Do

| Action | Code | Use case |
|--------|------|----------|
| **Redirect** | `NextResponse.redirect(new URL("/login", req.url))` | Auth check failed |
| **Rewrite** | `NextResponse.rewrite(new URL("/new-path", req.url))` | URL rewriting (A/B testing) |
| **Continue** | `NextResponse.next()` | Allow the request |
| **Set headers** | `response.headers.set("x-custom", "value")` | Add custom headers |
| **Read cookies** | `request.cookies.get("name")` | Access request cookies |
| **Set cookies** | `response.cookies.set("name", "value")` | Add response cookies |

### What Middleware CANNOT Do

| Limitation | Reason |
|-----------|--------|
| Cannot render UI | Middleware returns responses, not components |
| Cannot use React | Runs in the Edge runtime, not Node.js |
| Cannot access database directly | Edge runtime has limited APIs (no `fs`, limited `net`) |
| Cannot use most Node.js APIs | Runs in a lightweight Edge runtime for speed |
| Cannot modify the request body | Can only read it |

> **Key concept:** Middleware runs on the **Edge runtime** — a lightweight, fast environment designed for request interception. It's not the same as the Node.js runtime where your pages and Server Actions run.

---

## Real Enterprise Middleware Examples

### 1. Role-Based Access Control (RBAC)

```ts
export async function middleware(request: any) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Admin-only pages
  if (request.nextUrl.pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  return NextResponse.next()
}
```

### 2. Geo-Location Routing

```ts
export async function middleware(request: any) {
  const country = request.geo?.country || "US"

  if (country === "EU") {
    return NextResponse.rewrite(new URL("/eu/dashboard", request.url))
  }

  return NextResponse.next()
}
```

### 3. Maintenance Mode

```ts
export async function middleware(request: any) {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true"

  if (isMaintenanceMode && !request.nextUrl.pathname.startsWith("/maintenance")) {
    return NextResponse.redirect(new URL("/maintenance", request.url))
  }

  return NextResponse.next()
}
```

### 4. Request Logging

```ts
export async function middleware(request: any) {
  const start = Date.now()

  const response = NextResponse.next()

  const duration = Date.now() - start
  console.log(`${request.method} ${request.nextUrl.pathname} - ${duration}ms`)

  return response
}
```

---

## Current Architecture

```
next-dashboard/
  ├─ middleware.ts                            ← Route protection (runs before everything)
  ├─ app/
  │   ├─ layout.tsx                          ← Root layout + AuthProvider
  │   ├─ page.tsx                            ← Home page (public)
  │   ├─ login/
  │   │   └─ page.tsx                        ← Login page (public)
  │   ├─ api/
  │   │   ├─ auth/[...nextauth]/route.ts     ← Auth endpoints
  │   │   └─ courses/route.ts                ← Courses API
  │   └─ dashboard/                          ← Protected by middleware
  │       ├─ layout.tsx                      ← Sidebar (session guaranteed)
  │       ├─ loading.tsx                     ← Loading spinner
  │       ├─ page.tsx                        ← Stats + Chart
  │       ├─ courses/
  │       │   ├─ page.tsx                    ← Paginated list
  │       │   ├─ new/page.tsx                ← Create form
  │       │   ├─ edit/[id]/page.tsx          ← Edit form
  │       │   └─ [id]/page.tsx               ← Detail
  │       └─ users/page.tsx
  ├─ components/
  ├─ lib/
  │   ├─ auth.ts
  │   └─ prisma.ts
  └─ prisma/
      └─ schema.prisma
```

**Request flow diagram:**

```
Browser requests /dashboard/courses
       ↓
middleware.ts
  → getToken() → valid? ──→ NextResponse.next()
                                    ↓
                            app/layout.tsx
                                    ↓
                            app/dashboard/layout.tsx (sidebar)
                                    ↓
                            app/dashboard/courses/page.tsx
                                    ↓
                            HTML sent to browser

  → getToken() → null? ──→ NextResponse.redirect("/login")
                                    ↓
                            Browser shows /login page
                            (dashboard code NEVER executed)
```

---

## Practice Exercises

Try these on your own before moving to Level 16:

1. **Add request logging to middleware**
   - Log every request path and whether it was allowed or redirected:
     ```ts
     console.log(
       `[Middleware] ${request.nextUrl.pathname} → ${token ? "ALLOWED" : "REDIRECTED"}`
     )
     ```
   - Check the server terminal to see the logs

2. **Add role-based protection**
   - Add a `role` field to the token in `lib/auth.ts`:
     ```ts
     return { id: "1", name: "Admin User", role: "admin" }
     ```
   - In middleware, check the role for specific routes:
     ```ts
     if (request.nextUrl.pathname.startsWith("/dashboard/users") && token.role !== "admin") {
       return NextResponse.redirect(new URL("/dashboard", request.url))
     }
     ```
   - Test with a non-admin user

3. **Create a maintenance mode**
   - Add `MAINTENANCE_MODE=true` to `.env`
   - Create `app/maintenance/page.tsx` with a maintenance message
   - In middleware, redirect all requests to `/maintenance` when the flag is set
   - Toggle the flag and test

4. **Protect API routes with middleware**
   - Update the matcher to also cover API routes:
     ```ts
     matcher: ["/dashboard/:path*", "/api/courses/:path*"]
     ```
   - Test: visit `/api/courses` while logged out — should redirect to `/login`
   - Note: API routes might need a JSON error response instead of a redirect:
     ```ts
     if (request.nextUrl.pathname.startsWith("/api/")) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
     }
     ```

5. **Add custom headers for debugging**
   - In middleware, add a custom header to every response:
     ```ts
     const response = NextResponse.next()
     response.headers.set("x-middleware-processed", "true")
     response.headers.set("x-user-id", token?.sub || "anonymous")
     return response
     ```
   - Check headers in DevTools → Network tab → click a request → Response Headers

6. **Test edge cases**
   - What happens when you visit `/dashboard` with an expired session?
   - What happens if `NEXTAUTH_SECRET` is wrong in middleware but correct in NextAuth?
   - What happens if you remove the `matcher` config entirely? *(Answer: middleware runs on ALL routes — including `/login`, causing an infinite redirect loop!)*
   - Add `/login` to the matcher and observe the loop, then fix it

---

## Summary — What You Learned

| Concept | Key Takeaway |
|---------|-------------|
| **Middleware** | Runs **before** any page rendering — intercepts requests at the edge |
| **`middleware.ts` location** | Must be at the project root — only one middleware file per project |
| **`getToken()` from next-auth/jwt** | Reads the encrypted session cookie without calling the database |
| **`NextResponse.redirect()`** | Redirects the user — the page never renders |
| **`NextResponse.next()`** | Allows the request to continue to the page |
| **`matcher` config** | Controls which routes trigger the middleware — supports patterns and regex |
| **Layout auth vs Middleware auth** | Middleware is faster — blocks before rendering; layout checks during rendering |
| **Edge runtime** | Middleware runs in a lightweight runtime — fast but limited APIs |
| **Enterprise uses** | Auth, RBAC, geo-routing, A/B testing, rate limiting, maintenance mode, logging |
| **Single middleware file** | Use `if/else` on `request.nextUrl.pathname` to handle different routes |

---

## What's Coming Next (Level 16)

We'll implement **Route Groups** to organize the growing application:

- Topics covered:
  - **`(auth)` and `(dashboard)` groups** — folders wrapped in parentheses that don't affect the URL
  - **Separate layouts per group** — auth pages get a centered layout, dashboard pages get the sidebar layout
  - **Cleaner architecture** — group related routes without affecting URLs
  - **Parallel routes** — advanced layout patterns for complex UIs

- Route Groups are essential for structuring large Next.js applications — they keep the codebase clean as it grows.

  ```
  app/
    ├─ (auth)/
    │   ├─ layout.tsx           ← Centered layout (no sidebar)
    │   └─ login/page.tsx       ← /login
    └─ (dashboard)/
        ├─ layout.tsx           ← Sidebar layout
        └─ dashboard/page.tsx   ← /dashboard
  ```

  > **Notice:** The parentheses folders `(auth)` and `(dashboard)` do NOT appear in the URL — they're purely organizational.
