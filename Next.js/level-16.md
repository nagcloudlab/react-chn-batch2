# Level 16 — Route Groups & Application Architecture

> **Objective:** By the end of this level, you will understand Route Groups — a Next.js organizational feature that lets you group related routes into folders **without affecting the URL**. You'll restructure the project into `(auth)`, `(dashboard)`, and optionally `(marketing)` groups, each with their own layout, creating a scalable architecture for large applications.

> **Prerequisites:**
> - Completed **Levels 1–15**
> - Dev server running (`npm run dev`)
> - Existing dashboard with auth, middleware, CRUD, charts, pagination

> **What changes in this level:** As the project grows, the `app/` folder becomes crowded with mixed concerns — login pages sit next to dashboard pages, API routes next to marketing pages. Route Groups let you organize routes into **logical sections** without changing any URLs. This is purely an **architectural improvement** — the app works exactly the same, but the codebase becomes much cleaner.

---

## The Problem — A Crowded `app/` Folder

As the project has grown, the `app/` directory contains everything mixed together:

```
app/
  ├─ layout.tsx           ← Root layout (shared)
  ├─ page.tsx             ← Home/marketing page
  ├─ login/               ← Auth feature
  │   └─ page.tsx
  ├─ api/                 ← Backend endpoints
  │   ├─ auth/...
  │   └─ courses/...
  └─ dashboard/           ← Dashboard feature
      ├─ layout.tsx
      ├─ page.tsx
      ├─ courses/...
      └─ users/...
```

**Problems with this structure:**
- Auth pages and dashboard pages live at the same level — no clear separation
- As you add marketing pages (`/pricing`, `/docs`, `/blog`), it gets messier
- Each section needs a different layout (auth = centered, dashboard = sidebar, marketing = navbar)
- Hard to tell at a glance which section a page belongs to

---

## The Solution — Route Groups

- **Route Groups** are folders wrapped in **parentheses** — e.g., `(auth)`, `(dashboard)`, `(marketing)`.
- The parentheses tell Next.js: **"Use this folder for organization only — do NOT include it in the URL."**

```
Folder name              URL effect
───────────              ──────────
app/dashboard/page.tsx   → /dashboard        (folder IS in the URL)
app/(auth)/login/page.tsx → /login           (parentheses folder is NOT in the URL)
```

### The Core Rule

| Folder | Appears in URL? | Purpose |
|--------|----------------|---------|
| `app/dashboard/` | Yes → `/dashboard` | Normal route folder |
| `app/(dashboard)/` | **No** | Organization only |
| `app/(auth)/` | **No** | Organization only |
| `app/(marketing)/` | **No** | Organization only |

---

## Step 1 — Plan the New Structure

Before moving files, let's see the target architecture:

```
app/
  ├─ layout.tsx                   ← Root layout (minimal — just <html>, <body>)
  ├─ page.tsx                     ← Home page (/)
  │
  ├─ (auth)/                      ← Auth group (NOT in URL)
  │   ├─ layout.tsx               ← Centered layout (no sidebar)
  │   └─ login/
  │       └─ page.tsx             ← /login
  │
  ├─ (dashboard)/                 ← Dashboard group (NOT in URL)
  │   └─ dashboard/
  │       ├─ layout.tsx           ← Sidebar layout
  │       ├─ loading.tsx          ← Loading spinner
  │       ├─ page.tsx             ← /dashboard
  │       ├─ courses/
  │       │   ├─ page.tsx         ← /dashboard/courses
  │       │   ├─ new/page.tsx     ← /dashboard/courses/new
  │       │   ├─ edit/[id]/page.tsx
  │       │   └─ [id]/page.tsx
  │       └─ users/
  │           └─ page.tsx         ← /dashboard/users
  │
  └─ api/                         ← API routes (stays as-is)
      ├─ auth/[...nextauth]/route.ts
      └─ courses/route.ts
```

**URL mapping — nothing changes:**

| File path (new) | URL (unchanged) |
|-----------------|-----------------|
| `app/(auth)/login/page.tsx` | `/login` |
| `app/(dashboard)/dashboard/page.tsx` | `/dashboard` |
| `app/(dashboard)/dashboard/courses/page.tsx` | `/dashboard/courses` |
| `app/(dashboard)/dashboard/courses/new/page.tsx` | `/dashboard/courses/new` |
| `app/(dashboard)/dashboard/users/page.tsx` | `/dashboard/users` |

> **Key point:** Every URL stays exactly the same. Route Groups are invisible to the browser and to users.

---

## Step 2 — Move the Login Page into `(auth)` Group

- Create folder: `app/(auth)/`
- Move `app/login/` into it: `app/(auth)/login/`

  ```
  Before:                          After:
  app/                             app/
    └─ login/                        └─ (auth)/
        └─ page.tsx                       └─ login/
                                               └─ page.tsx
  ```

- **Verify:** Open [http://localhost:3000/login](http://localhost:3000/login) — it still works. The `(auth)` folder does not appear in the URL.

---

## Step 3 — Move Dashboard Pages into `(dashboard)` Group

- Create folder: `app/(dashboard)/`
- Move the entire `app/dashboard/` folder into it: `app/(dashboard)/dashboard/`

  ```
  Before:                          After:
  app/                             app/
    └─ dashboard/                    └─ (dashboard)/
        ├─ layout.tsx                     └─ dashboard/
        ├─ loading.tsx                        ├─ layout.tsx
        ├─ page.tsx                           ├─ loading.tsx
        ├─ courses/...                        ├─ page.tsx
        └─ users/...                          ├─ courses/...
                                              └─ users/...
  ```

- **Verify:** Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) — it still works. All dashboard routes remain unchanged.

---

## Step 4 — Verify Middleware Still Works

- Your middleware protects routes based on **URLs**, not file paths:

  ```ts
  export const config = {
    matcher: ["/dashboard/:path*"]
  }
  ```

- Since Route Groups **don't affect URLs**, the middleware pattern `/dashboard/:path*` still matches — **no changes needed**.

  | What changed | What did NOT change |
  |-------------|-------------------|
  | File locations on disk | URLs in the browser |
  | Folder organization | Middleware matchers |
  | Project architecture | `<Link>` href values |
  | Developer experience | User experience |

---

## Step 5 — Add Group-Specific Layouts

The real power of Route Groups is that each group can have its **own layout**.

### Auth Layout (Centered, No Sidebar)

- Create file: `app/(auth)/layout.tsx`

  ```tsx
  export default function AuthLayout({ children }: { children: React.ReactNode }) {

    return (

      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>

        <div style={{ width: "100%", maxWidth: "400px" }}>
          {children}
        </div>

      </div>

    )

  }
  ```

  **What this does:**
  - Centers the login form both horizontally and vertically
  - Limits the width to 400px — clean, focused layout
  - No sidebar, no navbar — just the form

### Dashboard Layout (Sidebar — Already Exists)

- The existing `app/(dashboard)/dashboard/layout.tsx` already has the sidebar layout — no changes needed.

### The Result — Different Layouts for Different Sections

```
/login                                    /dashboard
┌─────────────────────────────────┐      ┌──────────┬──────────────────────┐
│                                 │      │ Sidebar  │ Dashboard            │
│                                 │      │          │                      │
│         ┌───────────────┐       │      │ Home     │ [Users] [Courses]    │
│         │    Login      │       │      │ Courses  │ [Revenue] [Sessions] │
│         │               │       │      │ Users    │                      │
│         │  [Username]   │       │      │ Add      │ Revenue Chart        │
│         │  [Password]   │       │      │ Course   │                      │
│         │  [Login Btn]  │       │      │          │                      │
│         └───────────────┘       │      │ [Logout] │                      │
│                                 │      │          │                      │
└─────────────────────────────────┘      └──────────┴──────────────────────┘
        (auth) layout                          (dashboard) layout
     centered, minimal                       sidebar, full-width content
```

### Layout Nesting with Route Groups

```
app/layout.tsx (Root)                    ← Wraps EVERYTHING (Bootstrap CSS, AuthProvider)
  │
  ├─ app/(auth)/layout.tsx              ← Wraps only auth pages (centered)
  │     └─ app/(auth)/login/page.tsx    ← /login
  │
  └─ app/(dashboard)/dashboard/layout.tsx ← Wraps only dashboard pages (sidebar)
        ├─ .../courses/page.tsx          ← /dashboard/courses
        └─ .../users/page.tsx            ← /dashboard/users
```

**Rendering chain for `/login`:**

```
Root Layout → (auth) Layout → Login Page
    ↓              ↓              ↓
  <html>      centered div    login form
  <body>
  Bootstrap
```

**Rendering chain for `/dashboard`:**

```
Root Layout → (dashboard)/dashboard Layout → Dashboard Page
    ↓                   ↓                        ↓
  <html>           sidebar + content          stat cards
  <body>
  Bootstrap
```

> **Key insight:** Each group gets a completely **independent layout chain**. Auth pages never see the sidebar. Dashboard pages never see the centered container. The root layout wraps both.

---

## Why Route Groups Matter for Large Apps

### Small App (No Groups Needed)

```
app/
  ├─ login/page.tsx
  ├─ dashboard/page.tsx
  └─ page.tsx

→ Simple, manageable
```

### Medium App (Groups Help)

```
app/
  ├─ (auth)/
  │   ├─ login/page.tsx
  │   └─ register/page.tsx
  ├─ (dashboard)/
  │   └─ dashboard/
  │       ├─ courses/...
  │       └─ users/...
  └─ page.tsx

→ Clear separation of concerns
```

### Large Enterprise App (Groups Essential)

```
app/
  ├─ (auth)/
  │   ├─ layout.tsx             ← Centered layout
  │   ├─ login/page.tsx
  │   ├─ register/page.tsx
  │   ├─ forgot-password/page.tsx
  │   └─ reset-password/page.tsx
  │
  ├─ (dashboard)/
  │   ├─ layout.tsx             ← Sidebar layout
  │   └─ dashboard/
  │       ├─ page.tsx
  │       ├─ courses/...
  │       ├─ users/...
  │       ├─ analytics/...
  │       ├─ settings/...
  │       └─ reports/...
  │
  ├─ (marketing)/
  │   ├─ layout.tsx             ← Navbar + footer layout
  │   ├─ pricing/page.tsx
  │   ├─ docs/page.tsx
  │   ├─ blog/page.tsx
  │   └─ about/page.tsx
  │
  └─ page.tsx                   ← Landing page

→ Each section has its own layout, team, and concerns
```

**Benefits for large teams:**

| Benefit | Explanation |
|---------|-------------|
| **Feature isolation** | Auth team works in `(auth)/`, dashboard team in `(dashboard)/` |
| **Independent layouts** | Each section has its own layout without conflicts |
| **Clear boundaries** | Easy to tell which section a file belongs to |
| **Scalability** | Add new sections without affecting existing ones |
| **Code reviews** | Changes scoped to one group — easier to review |

---

## Common Route Group Patterns

### Pattern 1 — By Feature Area (Most Common)

```
app/
  ├─ (auth)/          → login, register, forgot-password
  ├─ (dashboard)/     → admin panel, CRUD pages
  ├─ (marketing)/     → landing, pricing, blog, docs
  └─ (api)/           → API routes (optional grouping)
```

### Pattern 2 — By User Role

```
app/
  ├─ (admin)/         → admin-only pages
  ├─ (user)/          → regular user pages
  └─ (public)/        → pages anyone can access
```

### Pattern 3 — By Layout Type

```
app/
  ├─ (with-sidebar)/  → pages with sidebar layout
  ├─ (with-navbar)/   → pages with top navbar
  └─ (fullscreen)/    → pages with no navigation (login, onboarding)
```

---

## Current Architecture

```
app/
  ├─ layout.tsx                              ← Root layout (Bootstrap, AuthProvider)
  ├─ page.tsx                                ← Home page (/)
  │
  ├─ (auth)/                                 ← Auth group
  │   ├─ layout.tsx                          ← Centered layout
  │   └─ login/
  │       └─ page.tsx                        ← /login
  │
  ├─ (dashboard)/                            ← Dashboard group
  │   └─ dashboard/
  │       ├─ layout.tsx                      ← Sidebar layout
  │       ├─ loading.tsx                     ← Loading spinner
  │       ├─ page.tsx                        ← /dashboard (stats + chart)
  │       ├─ courses/
  │       │   ├─ page.tsx                    ← /dashboard/courses
  │       │   ├─ new/page.tsx                ← /dashboard/courses/new
  │       │   ├─ edit/[id]/page.tsx          ← /dashboard/courses/edit/:id
  │       │   └─ [id]/page.tsx               ← /dashboard/courses/:id
  │       └─ users/
  │           └─ page.tsx                    ← /dashboard/users
  │
  └─ api/
      ├─ auth/[...nextauth]/route.ts         ← Auth API
      └─ courses/route.ts                    ← Courses API

middleware.ts                                ← Route protection (unchanged)
components/                                  ← Shared components
lib/                                         ← Auth config, Prisma client
prisma/                                      ← Database schema
```

---

## App Router Special Files — Complete Reference

After 16 levels, here's every special file convention in the App Router:

| File | Purpose | Level introduced |
|------|---------|-----------------|
| `page.tsx` | Route UI — makes a folder visitable | Level 1 |
| `layout.tsx` | Shared wrapper — persists across navigation | Level 1 |
| `loading.tsx` | Loading UI — shown while page data loads | Level 10 |
| `error.tsx` | Error boundary — catches runtime errors | *(future)* |
| `not-found.tsx` | Custom 404 page | *(future)* |
| `route.ts` | API endpoint — handles HTTP methods | Level 3 |
| `middleware.ts` | Request interceptor — runs before pages | Level 15 |
| `(folder)` | Route Group — organizational, not in URL | Level 16 |
| `[folder]` | Dynamic segment — captures URL parameters | Level 4 |
| `[...folder]` | Catch-all segment — captures multiple URL segments | Level 4 (reference) |

---

## Practice Exercises

Try these on your own:

1. **Create a `(marketing)` group**
   - Create `app/(marketing)/layout.tsx` with a simple top navbar:
     ```tsx
     import Link from "next/link"

     export default function MarketingLayout({ children }: any) {
       return (
         <div>
           <nav className="navbar navbar-light bg-light px-4">
             <Link className="navbar-brand" href="/">MyApp</Link>
             <div>
               <Link className="btn btn-outline-primary btn-sm me-2" href="/pricing">Pricing</Link>
               <Link className="btn btn-primary btn-sm" href="/login">Login</Link>
             </div>
           </nav>
           {children}
         </div>
       )
     }
     ```
   - Create `app/(marketing)/pricing/page.tsx` — a pricing page at `/pricing`
   - Create `app/(marketing)/about/page.tsx` — an about page at `/about`
   - Verify both pages use the navbar layout, not the sidebar

2. **Add a registration page to the `(auth)` group**
   - Create `app/(auth)/register/page.tsx` at `/register`
   - It should use the same centered layout as the login page
   - Add name, email, and password fields
   - Verify it inherits the `(auth)` layout automatically

3. **Verify URL independence**
   - After moving files, run through every route:
     - `/` — home page
     - `/login` — login page (centered layout)
     - `/dashboard` — dashboard (sidebar layout)
     - `/dashboard/courses` — courses list
     - `/dashboard/courses/new` — create form
   - Verify all URLs work exactly as before
   - Check that `<Link>` href values don't need updating

4. **Test layout isolation**
   - Visit `/login` — verify there's **no sidebar**
   - Visit `/dashboard` — verify there's **no centered container**
   - This proves each group has its own independent layout

5. **Add an `(admin)` group**
   - Create `app/(admin)/admin/page.tsx` at `/admin`
   - Create `app/(admin)/admin/layout.tsx` with a distinct layout (e.g., red sidebar for admin)
   - This demonstrates that you can have multiple dashboard-like sections with different layouts

6. **Refactor the home page into a group**
   - Move `app/page.tsx` into `app/(marketing)/` and see what happens
   - *(Hint: you need to handle the root `/` route — the `(marketing)` group can contain the home page if the `(marketing)/layout.tsx` is appropriate)*
   - This is how SaaS apps structure their marketing site vs app

---

## Summary — What You Learned

| Concept | Key Takeaway |
|---------|-------------|
| **Route Groups `(folder)`** | Parentheses folders organize routes without affecting URLs |
| **Group layouts** | Each group can have its own `layout.tsx` — independent layout chains |
| **URL transparency** | Route Groups are invisible to the browser — URLs never change |
| **Middleware compatibility** | Middleware matchers use URLs, not file paths — unaffected by groups |
| **Feature isolation** | Auth, dashboard, marketing sections are clearly separated |
| **Scalability** | Add new sections without touching existing code |
| **Layout nesting** | Root layout → Group layout → Page — each level adds its own wrapper |
| **Common patterns** | By feature area, by user role, or by layout type |

---

## What's Coming Next (Level 17)

We'll explore **Parallel Routes** and **Intercepting Routes** — advanced App Router features:

- Topics covered:
  - **Parallel Routes (`@slot`)** — render multiple page sections simultaneously in the same layout
  - **Independent loading** — each slot has its own `loading.tsx` and error boundary
  - **Intercepting Routes `(.)` `(..)` `(...)`** — show a modal preview when clicking a link, full page on direct URL visit
  - **Modal pattern** — click a course → modal preview in the list; direct URL → full detail page

- These are the most advanced App Router features — used in complex dashboards with multi-panel layouts and modal overlays.
