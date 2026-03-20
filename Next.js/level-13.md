# Level 13 — Authentication & Protected Routes

> **Objective:** By the end of this level, you will add authentication to the dashboard using NextAuth.js (Auth.js), create a login page, protect dashboard routes so only logged-in users can access them, and understand session handling in Server Components.

> **Prerequisites:**
> - Completed **Levels 1–12**
> - Dev server running (`npm run dev`)
> - Existing dashboard with full CRUD, charts, pagination, loading UI

> **What changes in this level:** Currently, anyone can access `/dashboard` and all its pages — there's no login requirement. In production, admin dashboards must be **protected** so that only authenticated users can view or modify data. We'll add a login page, configure authentication, and guard all dashboard routes.

---

## Authentication Overview

### What We're Building

```
Unauthenticated user                  Authenticated user
────────────────────                  ──────────────────
visits /dashboard                     visits /dashboard
       ↓                                     ↓
automatically redirected              session verified
       ↓                                     ↓
/login page                           dashboard renders
       ↓                                     ↓
enters credentials                    full access to all pages
       ↓
session created
       ↓
redirected to /dashboard
```

### Auth.js (NextAuth) — The Standard for Next.js

- **Auth.js** (formerly NextAuth.js) is the most popular authentication library for Next.js.
- The npm package is still called `next-auth` even though the project rebranded to Auth.js.

- It supports multiple authentication methods:

  | Provider | Use case | Setup complexity |
  |----------|----------|-----------------|
  | **Credentials** | Username/password login | Simple (we'll use this) |
  | **Google OAuth** | "Sign in with Google" | Medium |
  | **GitHub OAuth** | "Sign in with GitHub" | Medium |
  | **LDAP / Active Directory** | Enterprise SSO | Complex |
  | **JWT custom** | Custom token-based auth | Medium |
  | **Email (Magic Link)** | Passwordless login | Medium |

- We'll start with **Credentials** provider for training — it's the simplest to understand and doesn't require external service setup.

---

## Step 40 — Install Authentication Package

- Install NextAuth:

  ```bash
  npm install next-auth
  ```

  > **Note:** Even though the project rebranded to "Auth.js", the package name remains `next-auth`. You may see both names in documentation — they refer to the same library.

- NextAuth also requires a secret key for encrypting session tokens. Create a `.env.local` file at the project root:

  ```bash
  # .env.local
  NEXTAUTH_SECRET=my-secret-key-change-in-production
  NEXTAUTH_URL=http://localhost:3000
  ```

  **What these variables do:**

  | Variable | Purpose |
  |----------|---------|
  | `NEXTAUTH_SECRET` | Encrypts session cookies — must be a strong random string in production |
  | `NEXTAUTH_URL` | The base URL of your app — used for callback redirects |

  > **Production:** Generate a real secret with `openssl rand -base64 32` and never commit `.env.local` to version control.

---

## Step 41 — Create Auth Configuration

- Create file: `lib/auth.ts`

  ```ts
  import NextAuth from "next-auth"
  import CredentialsProvider from "next-auth/providers/credentials"

  export const authOptions = {

    providers: [

      CredentialsProvider({

        name: "Credentials",

        credentials: {
          username: {},
          password: {}
        },

        async authorize(credentials: any) {

          if (
            credentials.username === "admin" &&
            credentials.password === "admin"
          ) {
            return {
              id: "1",
              name: "Admin User"
            }
          }

          return null
        }

      })

    ],

    pages: {
      signIn: "/login"
    }

  }
  ```

  **Line-by-line breakdown:**

  | Code | Purpose |
  |------|---------|
  | `import NextAuth from "next-auth"` | The core authentication library |
  | `import CredentialsProvider` | Provider for username/password authentication |
  | `providers: [...]` | Array of authentication methods — can have multiple (Google + Credentials, etc.) |
  | `name: "Credentials"` | Label shown on the default sign-in page |
  | `credentials: { username: {}, password: {} }` | Defines the fields expected from the login form |
  | `async authorize(credentials)` | The function that validates the login — returns a user object or `null` |
  | `credentials.username === "admin"` | Hardcoded check for training — in production, query a database |
  | `return { id: "1", name: "Admin User" }` | On success: returns a user object that gets stored in the session |
  | `return null` | On failure: rejects the login attempt |
  | `pages: { signIn: "/login" }` | Custom login page — overrides NextAuth's default sign-in page |

### How `authorize()` Would Look in Production

```ts
// With a database (Prisma)
async authorize(credentials: any) {
  const user = await prisma.user.findUnique({
    where: { email: credentials.username }
  })

  if (!user) return null

  const isValid = await bcrypt.compare(credentials.password, user.passwordHash)

  if (!isValid) return null

  return { id: user.id, name: user.name, email: user.email }
}
```

```ts
// With a microservice
async authorize(credentials: any) {
  const res = await fetch("http://auth-service/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  })

  if (!res.ok) return null

  return await res.json()  // { id, name, email }
}
```

> **Important:** In production, **never** hardcode credentials. Always validate against a database with hashed passwords (using bcrypt or argon2).

---

## Step 42 — Create the Auth API Route

- NextAuth needs an API route to handle authentication requests (login, logout, session checks).

- Create the folder structure: `app/api/auth/[...nextauth]/`
- Create file: `app/api/auth/[...nextauth]/route.ts`

  ```ts
  import NextAuth from "next-auth"
  import { authOptions } from "@/lib/auth"

  const handler = NextAuth(authOptions)

  export { handler as GET, handler as POST }
  ```

  **Line-by-line breakdown:**

  | Code | Purpose |
  |------|---------|
  | `[...nextauth]` | **Catch-all route** — handles all paths under `/api/auth/*` |
  | `NextAuth(authOptions)` | Creates a request handler with your auth configuration |
  | `export { handler as GET, handler as POST }` | Handles both GET and POST requests for auth endpoints |

- This single file creates **multiple endpoints** automatically:

  | Endpoint | Method | Purpose |
  |----------|--------|---------|
  | `/api/auth/signin` | GET | Shows the sign-in page (or redirects to custom `/login`) |
  | `/api/auth/signout` | POST | Destroys the session and logs out |
  | `/api/auth/session` | GET | Returns the current session data (JSON) |
  | `/api/auth/callback/credentials` | POST | Processes credential login submissions |
  | `/api/auth/csrf` | GET | Returns CSRF token for form protection |

  > **`[...nextauth]` explained:** The `...` makes it a catch-all route (covered in Level 4). It captures **any** path after `/api/auth/`, so a single `route.ts` handles all authentication endpoints.

---

## Step 43 — Create the Login Page

- Create folder: `app/login/`
- Create file: `app/login/page.tsx`

  ```tsx
  "use client"

  import { signIn } from "next-auth/react"
  import { useState } from "react"

  export default function LoginPage() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    async function handleLogin(e: any) {

      e.preventDefault()

      await signIn("credentials", {
        username,
        password,
        callbackUrl: "/dashboard"
      })

    }

    return (

      <div className="container mt-5" style={{ maxWidth: "400px" }}>

        <h2>Login</h2>

        <form onSubmit={handleLogin}>

          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100">
            Login
          </button>

        </form>

      </div>

    )

  }
  ```

  **Line-by-line breakdown:**

  | Code | Purpose |
  |------|---------|
  | `"use client"` | Required — uses `useState`, `onChange`, and `onSubmit` (interactivity) |
  | `import { signIn } from "next-auth/react"` | NextAuth's client-side sign-in function |
  | `useState("")` × 2 | Manages username and password input state |
  | `e.preventDefault()` | Prevents default form submission (we handle it with `signIn()`) |
  | `signIn("credentials", {...})` | Calls the Credentials provider's `authorize()` function |
  | `callbackUrl: "/dashboard"` | Where to redirect after successful login |
  | `style={{ maxWidth: "400px" }}` | Centers the form and prevents it from stretching too wide |
  | `w-100` | Bootstrap — makes the button full width within its container |

  **Why this is a Client Component (not a Server Action):**

  | Feature | Server Action (`<form action={fn}>`) | Client form (`onSubmit`) |
  |---------|--------------------------------------|--------------------------|
  | Interactive feedback | Limited | Full (loading states, error messages) |
  | `signIn()` from NextAuth | Not available server-side | Available via `next-auth/react` |
  | Controlled inputs | Uses `defaultValue` | Uses `value` + `onChange` |
  | Best for | Data mutations (CRUD) | Authentication, complex forms |

### Test the Login

- Open [http://localhost:3000/login](http://localhost:3000/login)

- Enter credentials:
  - **Username:** `admin`
  - **Password:** `admin`

- Click **Login**.

- **Verify:** You are redirected to `/dashboard` after successful login.

- **Test invalid credentials:** Enter wrong username/password — you stay on the login page (or see an error).

---

## Step 44 — Protect Dashboard Routes

- Now we block access to the dashboard for unauthenticated users.

- Open `app/dashboard/layout.tsx` and **update it** to check for a session before rendering:

  ```tsx
  import { getServerSession } from "next-auth"
  import { authOptions } from "@/lib/auth"
  import { redirect } from "next/navigation"
  import Link from "next/link"

  export default async function DashboardLayout({ children }: any) {

    const session = await getServerSession(authOptions)

    if (!session) {
      redirect("/login")
    }

    return (

      <div className="d-flex">

        <div className="bg-dark text-white p-3" style={{ width: "250px", height: "100vh" }}>
          <h4>Dev Dashboard</h4>

          <p className="text-muted small">Welcome, {session.user?.name}</p>

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

            <li className="nav-item">
              <Link className="nav-link text-white" href="/dashboard/courses/new">
                Add Course
              </Link>
            </li>
          </ul>

        </div>

        <div className="p-4 flex-grow-1">
          {children}
        </div>

      </div>

    )

  }
  ```

  **What changed from the previous layout:**

  | Addition | Purpose |
  |----------|---------|
  | `import { getServerSession }` | NextAuth function to check the session on the server |
  | `import { authOptions }` | Your auth configuration (providers, pages) |
  | `const session = await getServerSession(authOptions)` | Retrieves the current user's session (or `null` if not logged in) |
  | `if (!session) redirect("/login")` | If no session exists, redirect to the login page |
  | `session.user?.name` | Displays the logged-in user's name in the sidebar |

### The Protection Flow

```
User visits /dashboard (or any /dashboard/* route)
       ↓
DashboardLayout runs on the server
       ↓
getServerSession(authOptions)
       ↓
┌─────────────────────────┬────────────────────────────┐
│ Session exists           │ No session                 │
│                          │                            │
│ session = {              │ session = null             │
│   user: {                │       ↓                   │
│     name: "Admin User"   │ redirect("/login")        │
│   }                      │       ↓                   │
│ }                        │ User sees login page      │
│       ↓                  │                            │
│ Dashboard renders        │                            │
│ with user's name         │                            │
└─────────────────────────┴────────────────────────────┘
```

### Why This Protection Is Secure

| Concern | How it's handled |
|---------|-----------------|
| **Server-side check** | `getServerSession()` runs on the server — cannot be bypassed by disabling JavaScript |
| **Layout-level guard** | Protects **all** nested routes automatically (every page under `/dashboard`) |
| **Session verification** | Checks the encrypted session cookie — cannot be forged without `NEXTAUTH_SECRET` |
| **No client-side workaround** | The page never renders on the server if there's no session — the HTML is never sent |

### Test the Protection

1. **Open a new incognito window** (no session)
2. Visit `/dashboard` directly
3. **Verify:** You are automatically redirected to `/login`
4. Login with `admin` / `admin`
5. **Verify:** You land on `/dashboard` and see "Welcome, Admin User" in the sidebar
6. Try visiting `/dashboard/courses`, `/dashboard/users` — all work because you're authenticated

---

## Adding a Logout Button

- To complete the auth flow, add a sign-out option. Create a Client Component:

- Create file: `components/LogoutButton.tsx`

  ```tsx
  "use client"

  import { signOut } from "next-auth/react"

  export default function LogoutButton() {

    return (
      <button
        className="btn btn-outline-light btn-sm mt-3"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        Logout
      </button>
    )

  }
  ```

- Add it to the sidebar in `app/dashboard/layout.tsx`:

  ```tsx
  import LogoutButton from "@/components/LogoutButton"

  // Inside the sidebar div, after the nav list:
  <LogoutButton />
  ```

  **Why this needs `"use client"`:**

  | Code | Why client-side |
  |------|----------------|
  | `signOut()` | NextAuth client function — destroys the session cookie |
  | `onClick` | Event handler — requires browser |
  | `callbackUrl: "/login"` | Redirects to login page after logout |

---

## Session Provider (Required for Client Components)

- If you need to access the session in **Client Components** (not just Server Components), wrap your app with the NextAuth `SessionProvider`.

- Create file: `components/AuthProvider.tsx`

  ```tsx
  "use client"

  import { SessionProvider } from "next-auth/react"

  export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>
  }
  ```

- Update `app/layout.tsx` to wrap the app:

  ```tsx
  import 'bootstrap/dist/css/bootstrap.min.css'
  import AuthProvider from "@/components/AuthProvider"

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body>
          <AuthProvider>
            {children}
          </AuthProvider>
        </body>
      </html>
    )
  }
  ```

  **Why this is needed:**

  | Where | How to access session |
  |-------|---------------------|
  | **Server Component** | `const session = await getServerSession(authOptions)` — no provider needed |
  | **Client Component** | `const { data: session } = useSession()` — requires `<SessionProvider>` |

---

## Authentication Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        App Structure                          │
│                                                               │
│  app/layout.tsx ──── <AuthProvider> wraps everything          │
│       │                                                       │
│       ├── app/login/page.tsx ──── "use client"                │
│       │       │                                               │
│       │       └── signIn("credentials", {...})                │
│       │               ↓                                       │
│       │       /api/auth/callback/credentials                  │
│       │               ↓                                       │
│       │       authorize() in lib/auth.ts                      │
│       │               ↓                                       │
│       │       Session cookie set → redirect to /dashboard     │
│       │                                                       │
│       └── app/dashboard/layout.tsx ──── Server Component      │
│               │                                               │
│               └── getServerSession(authOptions)               │
│                       ↓                                       │
│               ┌───────────────┬───────────────┐               │
│               │ Has session   │ No session    │               │
│               │ → render page │ → redirect    │               │
│               │               │   to /login   │               │
│               └───────────────┴───────────────┘               │
└──────────────────────────────────────────────────────────────┘
```

---

## Current Architecture

```
app/
  ├─ layout.tsx                              ← Root layout + AuthProvider
  ├─ page.tsx                                ← Home page (public)
  ├─ login/
  │   └─ page.tsx                            ← Login page (Client Component)
  ├─ api/
  │   ├─ auth/
  │   │   └─ [...nextauth]/
  │   │       └─ route.ts                    ← NextAuth API handler
  │   └─ courses/
  │       └─ route.ts                        ← Courses API
  └─ dashboard/
      ├─ layout.tsx                          ← Protected layout (session check)
      ├─ loading.tsx                         ← Loading spinner
      ├─ page.tsx                            ← Stats + Chart
      ├─ courses/
      │   ├─ page.tsx                        ← Paginated course list
      │   ├─ new/page.tsx                    ← Create form
      │   ├─ edit/[id]/page.tsx              ← Edit form
      │   └─ [id]/page.tsx                   ← Course detail
      └─ users/page.tsx

components/
  ├─ AuthProvider.tsx                         ← Client Component (SessionProvider)
  ├─ LogoutButton.tsx                        ← Client Component (sign out)
  ├─ CourseSearch.tsx                         ← Client Component
  ├─ StatCard.tsx                            ← Server Component
  ├─ DashboardStats.tsx                      ← Server Component
  └─ RevenueChart.tsx                        ← Client Component

lib/
  ├─ auth.ts                                 ← Auth configuration (providers, pages)
  └─ data.ts                                 ← Data layer
```

**Auth-related routes:**

| Route | Type | Purpose |
|-------|------|---------|
| `/login` | Page | Custom login form |
| `/api/auth/[...nextauth]` | API | Handles all auth endpoints (signin, signout, session, callback) |
| `/dashboard/*` | Protected | All routes require valid session |

---

## Practice Exercises

Try these on your own before moving to Level 14:

1. **Add error handling to the login form**
   - `signIn()` returns a result object. Check for errors:
     ```tsx
     const result = await signIn("credentials", {
       username,
       password,
       redirect: false   // don't auto-redirect — handle it manually
     })

     if (result?.error) {
       setError("Invalid username or password")
     } else {
       window.location.href = "/dashboard"
     }
     ```
   - Display the error message below the form in a Bootstrap alert:
     ```tsx
     {error && <div className="alert alert-danger mt-3">{error}</div>}
     ```

2. **Add the Logout button to the sidebar**
   - Create `components/LogoutButton.tsx` (code shown above)
   - Import it in `app/dashboard/layout.tsx`
   - Place it at the bottom of the sidebar
   - Test: click Logout → verify you're redirected to `/login`

3. **Display the user's name in the dashboard**
   - In `app/dashboard/page.tsx`, get the session:
     ```tsx
     import { getServerSession } from "next-auth"
     import { authOptions } from "@/lib/auth"

     const session = await getServerSession(authOptions)
     ```
   - Display: `<h2>Welcome, {session?.user?.name}</h2>`

4. **Add a second user to the credentials check**
   - Update `authorize()` in `lib/auth.ts` to accept multiple users:
     ```ts
     const users = [
       { id: "1", username: "admin", password: "admin", name: "Admin User" },
       { id: "2", username: "trainer", password: "trainer", name: "Trainer" }
     ]

     const user = users.find(
       u => u.username === credentials.username && u.password === credentials.password
     )

     return user ? { id: user.id, name: user.name } : null
     ```
   - Test logging in with both accounts

5. **Protect individual API routes**
   - Update `app/api/courses/route.ts` to check for a session:
     ```ts
     import { getServerSession } from "next-auth"
     import { authOptions } from "@/lib/auth"

     export async function GET() {
       const session = await getServerSession(authOptions)

       if (!session) {
         return Response.json({ error: "Unauthorized" }, { status: 401 })
       }

       return Response.json(courses)
     }
     ```
   - Test: visit `/api/courses` while logged out — should return 401 error

6. **Test the complete auth flow end-to-end**
   - Open an incognito window
   - Visit `/dashboard` → verify redirect to `/login`
   - Login with wrong credentials → verify error (if you did exercise 1)
   - Login with correct credentials → verify redirect to `/dashboard`
   - Verify "Welcome, Admin User" appears in the sidebar
   - Navigate between dashboard pages → verify session persists
   - Click Logout → verify redirect to `/login`
   - Try visiting `/dashboard` again → verify redirect back to `/login`

---

## Summary — What You Learned

| Concept | Key Takeaway |
|---------|-------------|
| **NextAuth / Auth.js** | Standard authentication library for Next.js — package name is `next-auth` |
| **Credentials Provider** | Username/password login — simplest provider, good for training |
| **`authorize()` function** | Validates credentials — returns user object on success, `null` on failure |
| **Custom login page** | `pages: { signIn: "/login" }` overrides the default NextAuth sign-in page |
| **`[...nextauth]` catch-all** | Single route file handles all `/api/auth/*` endpoints |
| **`getServerSession()`** | Check the session in Server Components — no provider needed |
| **Layout-level protection** | `if (!session) redirect("/login")` in `layout.tsx` guards all nested routes |
| **`SessionProvider`** | Required wrapper for accessing sessions in Client Components via `useSession()` |
| **`signIn()` / `signOut()`** | Client-side functions for login/logout — imported from `next-auth/react` |
| **`NEXTAUTH_SECRET`** | Environment variable for encrypting session cookies — required in production |

---

## What's Coming Next (Level 14)

We'll replace the in-memory data store with a **real database**:

- Topics covered:
  - **Prisma ORM** — the most popular database toolkit for Next.js
  - **PostgreSQL** or **SQLite** setup — persistent data storage
  - **Database schema** — defining tables with Prisma's schema language
  - **Migrations** — creating and updating database tables
  - **Replacing `lib/data.ts`** — swap in-memory array with real database queries

- After this level, your dashboard data persists across server restarts — a true production backend.
