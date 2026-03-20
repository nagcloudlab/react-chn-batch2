# Level 3 — API Routes, Server Components & Data Fetching

> **Objective:** By the end of this level, you will understand how to create backend API routes inside Next.js, fetch data using Server Components (without `useEffect` or `useState`), and control caching behavior for different use cases.

> **Prerequisites:**
> - Completed **Level 1** and **Level 2**
> - Dev server running (`npm run dev`)
> - Existing structure:
>   ```
>   app/
>     ├─ layout.tsx
>     ├─ page.tsx
>     └─ dashboard/
>         ├─ layout.tsx
>         ├─ page.tsx
>         ├─ courses/
>         │   └─ page.tsx       ← currently has hardcoded data
>         └─ users/
>             └─ page.tsx       ← currently has hardcoded data
>   ```

> **What changes in this level:** We move from **hardcoded table data** to **API-driven data**. This mirrors how real production dashboards work — your frontend fetches data from backend services.

---

## Step 9 — Create Your First API Route

- Next.js allows you to create **backend API endpoints** inside the same project — no separate Express/Fastify server needed.

- Create the folder and file:
  1. Create folder: `app/api/courses/`
  2. Create file: `app/api/courses/route.ts`

- Your structure now includes an API layer:

  ```
  app/
    ├─ api/
    │   └─ courses/
    │       └─ route.ts         ← Backend API endpoint
    ├─ dashboard/
    │   ├─ courses/
    │   │   └─ page.tsx         ← Frontend page (will consume the API)
    │   ...
  ```

- Add the API code to `app/api/courses/route.ts`:

  ```ts
  export async function GET() {

    const courses = [
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

    return Response.json(courses)

  }
  ```

  **Code breakdown:**

  | Code | Purpose |
  |------|---------|
  | `export async function GET()` | Handles HTTP GET requests to this route |
  | `courses` array | Simulated data (later replaced with DB queries or microservice calls) |
  | `Response.json(courses)` | Returns JSON response with proper `Content-Type` header |

  > **Important:** The file must be named `route.ts` (not `page.tsx`). Next.js uses `page.tsx` for UI routes and `route.ts` for API routes — they serve different purposes.

### Test the API

- Open in browser: [http://localhost:3000/api/courses](http://localhost:3000/api/courses)

- You should see raw JSON:

  ```json
  [
    { "id": 1, "name": "Next.js Fundamentals", "instructor": "Admin" },
    { "id": 2, "name": "React Advanced", "instructor": "Admin" },
    { "id": 3, "name": "Microservices Architecture", "instructor": "Admin" }
  ]
  ```

- **Verify:** If you see the JSON array, your API route is working.

### How API Routes Compare to Express

- This works like an Express route, but uses **filesystem routing** instead of code configuration:

  | Express                                     | Next.js App Router                    |
  |---------------------------------------------|---------------------------------------|
  | `app.get("/api/courses", (req, res) => {})` | `app/api/courses/route.ts` → `GET()` |
  | `app.post("/api/courses", (req, res) => {})` | Same file → `POST()` function       |
  | `app.put("/api/courses", (req, res) => {})`  | Same file → `PUT()` function        |
  | `app.delete("/api/courses", (req, res) => {})` | Same file → `DELETE()` function   |

- You can handle **multiple HTTP methods** in a single `route.ts` file by exporting different named functions:

  ```ts
  export async function GET() { /* handle GET */ }
  export async function POST(request: Request) { /* handle POST */ }
  export async function PUT(request: Request) { /* handle PUT */ }
  export async function DELETE(request: Request) { /* handle DELETE */ }
  ```

---

## Step 10 — Fetch Data in the Courses Page (Server Component)

- Now we connect the frontend page to the API.

- Open `app/dashboard/courses/page.tsx` and **replace** the entire content with:

  ```tsx
  async function getCourses() {

    const res = await fetch("http://localhost:3000/api/courses")

    return res.json()

  }

  export default async function CoursesPage() {

    const courses = await getCourses()

    return (
      <div className="container">
        <h2>Courses</h2>

        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Course Name</th>
              <th>Instructor</th>
            </tr>
          </thead>

          <tbody>

            {courses.map((course: any) => (
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

  | Code | What it does |
  |------|-------------|
  | `async function getCourses()` | A plain async function that fetches data — not a React hook |
  | `await fetch(...)` | Calls the API route we just created |
  | `res.json()` | Parses the JSON response into a JavaScript array |
  | `async function CoursesPage()` | The component itself is `async` — this is only possible in Server Components |
  | `courses.map(...)` | Loops over the data array and renders a `<tr>` for each course |
  | `key={course.id}` | React requires a unique `key` for each item in a list (prevents rendering bugs) |

- Refresh [http://localhost:3000/dashboard/courses](http://localhost:3000/dashboard/courses)

- **Verify:** The table now loads **3 courses** from the API (previously it had 2 hardcoded). The sidebar is still present.

### Important Concept — Server Components

- Notice something unusual: we used `await fetch()` **directly inside** the component.

- There is **no**:
  - `useEffect` — no lifecycle hook
  - `useState` — no state management
  - `loading` state — no manual loading spinner

- **Why?** Because this is a **Server Component** — it runs on the server, not in the browser.

### How Server Components Execute

- When the browser requests `/dashboard/courses`, here's what happens:

  ```
  Browser requests /dashboard/courses
          ↓
  Next.js server receives the request
          ↓
  Server runs CoursesPage() function
          ↓
  getCourses() calls fetch("http://localhost:3000/api/courses")
          ↓
  API route returns JSON data
          ↓
  Component renders HTML with the data
          ↓
  Server sends final HTML to browser
          ↓
  Browser displays the page (no JavaScript needed for this component)
  ```

- **Key benefits of Server Components:**

  | Benefit | Explanation |
  |---------|-------------|
  | **Faster page load** | HTML arrives ready — browser doesn't wait for JS to fetch data |
  | **Secure API calls** | API keys, DB credentials, internal URLs never reach the browser |
  | **No client JS** | This component ships zero JavaScript to the browser |
  | **Direct backend access** | Can call databases, microservices, file system directly |

### Server Components vs Client Components

| Feature | Server Component (default) | Client Component (`"use client"`) |
|---------|---------------------------|-----------------------------------|
| Where it runs | On the server | In the browser |
| Can use `await` | Yes | No (use `useEffect` instead) |
| Can use `useState` | No | Yes |
| Can use `onClick` | No | Yes |
| Sends JS to browser | No | Yes |
| Can access DB/secrets | Yes | No |

> **Rule of thumb:** Use Server Components for **data fetching and display**. Use Client Components for **interactivity** (buttons, forms, modals). We'll cover Client Components in a later level.

### Why This Is Powerful for Production

- Server Components allow you to call **any backend** directly from your components:

  ```ts
  // Call your Go microservice
  const res = await fetch("http://localhost:8080/courses")

  // Call an internal REST API
  const res = await fetch("http://internal-service:3001/api/data")

  // Even query a database directly (with an ORM like Prisma)
  const courses = await prisma.course.findMany()
  ```

- Your dashboard becomes a **frontend gateway** — it aggregates data from multiple services and renders it.

- **Example production architecture:**

  ```
  Browser
     ↓
  Next.js Server Component
     ├─ fetch("http://course-service/api/courses")
     ├─ fetch("http://user-service/api/users")
     └─ fetch("http://analytics-service/api/stats")
     ↓
  Renders combined HTML
     ↓
  Sends to Browser
  ```

---

## Step 11 — Caching Control (Important for Dashboards)

- By default, Next.js **caches** fetch responses in production to improve performance.
- For dashboards that need **fresh data on every request**, we need to disable caching.

- Update the fetch call in `app/dashboard/courses/page.tsx`:

  ```tsx
  async function getCourses() {

    const res = await fetch("http://localhost:3000/api/courses", {
      cache: "no-store"
    })

    return res.json()

  }
  ```

- Now data is **always fetched fresh** on every page load.

### Deep Dive — How Caching Works in Next.js

This is a common source of confusion, so let's clarify the behavior in different modes:

#### Development Mode (`npm run dev`)

- Next.js **disables most caching** to make development easier:

  ```
  Every page refresh
       ↓
  Server component runs again
       ↓
  fetch() calls API again
       ↓
  Fresh data every time
  ```

- This is why you see the API called on every refresh during development — **even without `cache: "no-store"`**.

#### Production Mode (`npm run build` + `npm start`)

- The default fetch behavior changes to **cached**:

  ```
  First request
       ↓
  API called → result cached
       ↓
  All future requests → served from cache (API NOT called again)
  ```

- Unless you explicitly disable it with `cache: "no-store"`.

#### Caching Options Reference

| Option | Behavior | Best for |
|--------|----------|----------|
| `fetch(url)` (default) | Cached indefinitely in production | Static content: product pages, blogs, marketing pages |
| `cache: "no-store"` | Always fetch fresh data | Dashboards: orders, transactions, analytics, logs |
| `next: { revalidate: 60 }` | Cache for 60 seconds, then refresh | Semi-dynamic: metrics dashboards, reports, analytics |

#### Examples for Different Use Cases

```tsx
// Dashboard — always fresh data
const res = await fetch("http://service/api/orders", {
  cache: "no-store"
})

// Marketing site — revalidate every hour
const res = await fetch("http://service/api/products", {
  next: { revalidate: 3600 }
})

// Static page — cache forever (default)
const res = await fetch("http://service/api/about")
```

> **Trainer Tip:** Great demo opportunity — run `npm run build && npm start`, then refresh `/dashboard/courses` multiple times. Students will see the API called only once (cached). Then add `cache: "no-store"` and rebuild — the API is called every time.

### One More Detail — Internal Fetch Optimization

- When your Server Component calls your own API route (e.g., `/api/courses`), the fetch **never leaves the Next.js server**:

  ```
  Next.js Server
     ↓
  Internal API route (same process)
     ↓
  Response (no network hop)
  ```

- This is fast because there's no actual HTTP request over the network — Next.js handles it internally.

---

## Current Architecture

```
app/
  ├─ layout.tsx                    ← Root layout (Bootstrap)
  ├─ page.tsx                      ← Home page (/)
  ├─ api/
  │   └─ courses/
  │       └─ route.ts              ← API: GET /api/courses
  └─ dashboard/
      ├─ layout.tsx                ← Dashboard layout (Sidebar)
      ├─ page.tsx                  ← Dashboard home (/dashboard)
      ├─ courses/
      │   └─ page.tsx              ← Courses page (fetches from API)
      └─ users/
          └─ page.tsx              ← Users page (still hardcoded)
```

**Complete route table:**

| Route                | Type     | File                              | Description                  |
|----------------------|----------|-----------------------------------|------------------------------|
| `/`                  | Page     | `app/page.tsx`                    | Home page                    |
| `/dashboard`         | Page     | `app/dashboard/page.tsx`          | Dashboard home               |
| `/dashboard/courses` | Page     | `app/dashboard/courses/page.tsx`  | Courses (fetches from API)   |
| `/dashboard/users`   | Page     | `app/dashboard/users/page.tsx`    | Users (hardcoded)            |
| `/api/courses`       | API      | `app/api/courses/route.ts`        | Returns courses JSON         |

**Data flow diagram:**

```
Browser → /dashboard/courses
              ↓
     Next.js Server Component
              ↓
     fetch("/api/courses")
              ↓
     API Route (route.ts) returns JSON
              ↓
     Component renders HTML table
              ↓
     HTML sent to Browser
```

---

## Practice Exercises

Try these on your own before moving to Level 4:

1. **Create a Users API route**
   - Create `app/api/users/route.ts`
   - Return an array of users: `[{ id: 101, name: "John", role: "Developer" }, ...]`
   - Test it at `/api/users`
   - Update `app/dashboard/users/page.tsx` to fetch from this API (replace hardcoded data)

2. **Add a POST handler to the Courses API**
   - In `app/api/courses/route.ts`, add a `POST()` function
   - Have it read the request body: `const body = await request.json()`
   - Return the body back with a success message: `Response.json({ message: "Created", course: body })`
   - Test it with a tool like Postman or `curl`:
     ```bash
     curl -X POST http://localhost:3000/api/courses \
       -H "Content-Type: application/json" \
       -d '{"name": "New Course", "instructor": "Test"}'
     ```

3. **Experiment with caching behavior**
   - Add a `console.log("API called")` inside your `GET()` function in `route.ts`
   - Run in dev mode (`npm run dev`) — observe it logs on every refresh
   - Build for production (`npm run build && npm start`) — observe caching behavior
   - Add `cache: "no-store"` to the fetch and rebuild — observe the difference

4. **Simulate a microservice call**
   - Change the fetch URL in the courses page to a public API:
     ```tsx
     const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
       cache: "no-store"
     })
     ```
   - Update the table columns to display `id`, `title`, and `userId`
   - This simulates fetching from an external microservice

5. **Add error handling to the fetch**
   - What happens if the API is down? Try fetching from a non-existent URL
   - Wrap the fetch in a try/catch and display an error message in the UI:
     ```tsx
     async function getCourses() {
       try {
         const res = await fetch("http://localhost:3000/api/courses")
         if (!res.ok) throw new Error("Failed to fetch")
         return res.json()
       } catch (error) {
         return []
       }
     }
     ```

---

## Summary — What You Learned

| Concept | Key Takeaway |
|---------|-------------|
| **API Routes** | `app/api/*/route.ts` creates backend endpoints — like Express but filesystem-based |
| **HTTP Methods** | Export `GET()`, `POST()`, `PUT()`, `DELETE()` functions from `route.ts` |
| **Server Components** | Default in App Router — run on the server, can use `async/await` directly |
| **No useEffect needed** | Server Components fetch data during rendering — no hooks, no loading state |
| **Zero client JS** | Server Components ship no JavaScript to the browser |
| **Caching** | Default is cached in production; use `cache: "no-store"` for dashboards |
| **Revalidation** | `next: { revalidate: N }` caches for N seconds — good for semi-dynamic data |
| **Internal fetch** | Calling your own API routes stays within the server (no network hop) |

---

## What's Coming Next (Level 4)

We'll implement **Dynamic Routes** — pages that change based on URL parameters:

- `/dashboard/courses/1` → shows details for course 1
- `/dashboard/courses/2` → shows details for course 2

- Topics covered:
  - **Dynamic route folders** — `[id]` syntax for parameterized URLs
  - **URL parameters** — accessing `params.id` in Server Components
  - **Per-item server rendering** — each detail page fetches its own data
  - **Navigation between list and detail views**

- This is how every real dashboard works — list page → click item → detail page.
