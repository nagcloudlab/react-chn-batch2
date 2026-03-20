# Level 14 — Database Integration with Prisma & PostgreSQL

> **Objective:** By the end of this level, you will replace the in-memory data store (`lib/data.ts`) with a real database using Prisma ORM and PostgreSQL, giving your dashboard **persistent data** that survives server restarts — the final step to a production-ready backend.

> **Prerequisites:**
> - Completed **Levels 1–13**
> - Dev server running (`npm run dev`)
> - **PostgreSQL installed and running** locally (or access to a remote PostgreSQL instance)
>   - macOS: `brew install postgresql` then `brew services start postgresql`
>   - Windows: [Download PostgreSQL installer](https://www.postgresql.org/download/windows/)
>   - Linux: `sudo apt install postgresql`
>   - Alternatively, use a free cloud database (e.g., [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app))
> - Existing dashboard with full CRUD, auth, charts, pagination, loading UI

> **What changes in this level:** We replace `lib/data.ts` (an in-memory array that resets on every server restart) with **Prisma + PostgreSQL** — a real database where data persists permanently. The page components and Server Actions stay almost identical — only the data access layer changes.

---

## What Is Prisma?

- **Prisma** is an ORM (Object-Relational Mapper) for Node.js and TypeScript.
- It lets you interact with databases using **JavaScript/TypeScript functions** instead of raw SQL.

### Prisma vs Raw SQL

| Operation | Raw SQL | Prisma |
|-----------|---------|--------|
| **Read all** | `SELECT * FROM courses` | `prisma.course.findMany()` |
| **Read one** | `SELECT * FROM courses WHERE id = 1` | `prisma.course.findUnique({ where: { id: 1 } })` |
| **Create** | `INSERT INTO courses (name, instructor) VALUES ('...', '...')` | `prisma.course.create({ data: { name, instructor } })` |
| **Update** | `UPDATE courses SET name = '...' WHERE id = 1` | `prisma.course.update({ where: { id: 1 }, data: { name } })` |
| **Delete** | `DELETE FROM courses WHERE id = 1` | `prisma.course.delete({ where: { id: 1 } })` |
| **Count** | `SELECT COUNT(*) FROM courses` | `prisma.course.count()` |
| **Paginate** | `SELECT * FROM courses LIMIT 5 OFFSET 10` | `prisma.course.findMany({ skip: 10, take: 5 })` |

### Why Prisma over Other ORMs?

| Feature | Prisma | Sequelize | TypeORM | Drizzle |
|---------|--------|-----------|---------|---------|
| **TypeScript-first** | Yes | Partial | Yes | Yes |
| **Auto-generated types** | Yes | No | Partial | Yes |
| **Migration tool** | Built-in | Built-in | Built-in | Built-in |
| **Visual DB browser** | Prisma Studio | No | No | No |
| **Learning curve** | Low | Medium | High | Medium |
| **Next.js integration** | Excellent | Good | Good | Good |

---

## Step 45 — Install Prisma

- Install Prisma as a dev dependency and the Prisma Client:

  ```bash
  npm install prisma @prisma/client
  ```

  | Package | Purpose |
  |---------|---------|
  | `prisma` | CLI tool for migrations, schema management, studio |
  | `@prisma/client` | Runtime library — the actual database client used in your code |

- Initialize Prisma in your project:

  ```bash
  npx prisma init
  ```

- This creates two things:

  ```
  prisma/
    └─ schema.prisma     ← Database schema definition
  .env                    ← Environment variables (DATABASE_URL)
  ```

  > **Note:** If you already have a `.env.local` file from Level 13 (NextAuth), you can add the `DATABASE_URL` to that file instead. Prisma reads from `.env` by default, but Next.js uses `.env.local` for local overrides.

---

## Step 46 — Configure the Database Connection

- Open the `.env` file and set your database connection string:

  ```bash
  DATABASE_URL="postgresql://postgres:password@localhost:5432/dashboard"
  ```

  **Connection string breakdown:**

  ```
  postgresql://postgres:password@localhost:5432/dashboard
  ──────────── ──────── ──────── ───────── ──── ─────────
       │          │        │        │       │       │
   Protocol    Username  Password   Host   Port  Database
  ```

  | Part | Value | Description |
  |------|-------|-------------|
  | Protocol | `postgresql://` | Database type |
  | Username | `postgres` | Default PostgreSQL user (change if needed) |
  | Password | `password` | Your PostgreSQL password |
  | Host | `localhost` | Where the DB is running |
  | Port | `5432` | Default PostgreSQL port |
  | Database | `dashboard` | Database name (Prisma creates it if it doesn't exist) |

  **Common connection strings for different setups:**

  | Setup | Connection string |
  |-------|------------------|
  | Local PostgreSQL | `postgresql://postgres:password@localhost:5432/dashboard` |
  | Local with no password | `postgresql://postgres@localhost:5432/dashboard` |
  | Neon (cloud) | `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dashboard?sslmode=require` |
  | Supabase | `postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres` |
  | Docker PostgreSQL | `postgresql://postgres:password@localhost:5433/dashboard` |

  **SQLite alternative (no setup required):**

  If you don't want to install PostgreSQL, use SQLite instead:

  ```bash
  # In .env:
  DATABASE_URL="file:./dev.db"
  ```

  ```prisma
  // In schema.prisma, change the provider:
  datasource db {
    provider = "sqlite"
    url      = env("DATABASE_URL")
  }
  ```

  > **SQLite** creates a file-based database — no server to install. Great for learning and prototyping. Switch to PostgreSQL for production.

---

## Step 47 — Define the Database Schema

- Open `prisma/schema.prisma` and **replace the entire content** with:

  ```prisma
  generator client {
    provider = "prisma-client-js"
  }

  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }

  model Course {
    id         Int    @id @default(autoincrement())
    name       String
    instructor String
  }
  ```

  **Schema breakdown:**

  | Code | Purpose |
  |------|---------|
  | `generator client` | Tells Prisma to generate a TypeScript client for database access |
  | `provider = "prisma-client-js"` | Use the JavaScript/TypeScript Prisma Client |
  | `datasource db` | Database connection configuration |
  | `provider = "postgresql"` | Database type (change to `"sqlite"` for SQLite) |
  | `url = env("DATABASE_URL")` | Reads the connection string from the `.env` file |
  | `model Course` | Defines a database table called `Course` |
  | `id Int @id @default(autoincrement())` | Auto-incrementing primary key |
  | `name String` | Text column for the course name |
  | `instructor String` | Text column for the instructor name |

  **This schema maps to the following SQL table:**

  ```sql
  CREATE TABLE "Course" (
    "id"         SERIAL PRIMARY KEY,
    "name"       TEXT NOT NULL,
    "instructor" TEXT NOT NULL
  );
  ```

  **How our in-memory data maps to the schema:**

  | `lib/data.ts` (before) | Prisma schema (after) |
  |------------------------|----------------------|
  | `{ id: 1, name: "...", instructor: "..." }` | Row in `Course` table |
  | `courses` array | `Course` table |
  | `addCourse(course)` | `prisma.course.create()` |
  | `deleteCourse(id)` | `prisma.course.delete()` |
  | `updateCourse(id, data)` | `prisma.course.update()` |

---

## Step 48 — Run the Migration

- Create the database table by running a migration:

  ```bash
  npx prisma migrate dev --name init
  ```

  **What this command does:**

  | Step | What happens |
  |------|-------------|
  | 1 | Reads `schema.prisma` to see what tables are needed |
  | 2 | Creates the `dashboard` database if it doesn't exist |
  | 3 | Generates a SQL migration file in `prisma/migrations/` |
  | 4 | Runs the SQL to create the `Course` table |
  | 5 | Generates the Prisma Client (TypeScript types + functions) |

- After running, you'll see:

  ```
  prisma/
    ├─ schema.prisma
    └─ migrations/
        └─ 20240101000000_init/
            └─ migration.sql          ← Generated SQL
  ```

- **Verify:** You can inspect the migration SQL to see the exact table creation:

  ```sql
  -- CreateTable
  CREATE TABLE "Course" (
      "id" SERIAL NOT NULL,
      "name" TEXT NOT NULL,
      "instructor" TEXT NOT NULL,
      CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
  );
  ```

### Optional — Seed Initial Data

- Create a seed file to populate the database with initial courses:

- Create file: `prisma/seed.ts`

  ```ts
  import { PrismaClient } from "@prisma/client"

  const prisma = new PrismaClient()

  async function main() {

    await prisma.course.createMany({
      data: [
        { name: "Next.js Fundamentals", instructor: "Admin" },
        { name: "React Advanced", instructor: "Admin" },
        { name: "Microservices Architecture", instructor: "Admin" },
        { name: "Node.js Backend", instructor: "Admin" },
        { name: "DevOps CI/CD", instructor: "Admin" },
        { name: "Docker Essentials", instructor: "Admin" },
        { name: "Kubernetes Basics", instructor: "Admin" },
        { name: "System Design", instructor: "Admin" },
        { name: "Distributed Systems", instructor: "Admin" },
        { name: "API Security", instructor: "Admin" },
        { name: "Cloud Architecture", instructor: "Admin" },
        { name: "Performance Engineering", instructor: "Admin" }
      ]
    })

    console.log("Seed data created")

  }

  main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
  ```

- Add to `package.json`:

  ```json
  "prisma": {
    "seed": "npx tsx prisma/seed.ts"
  }
  ```

- Run the seed:

  ```bash
  npx prisma db seed
  ```

- **Verify:** Open Prisma Studio (a visual database browser):

  ```bash
  npx prisma studio
  ```

  This opens a web UI at `http://localhost:5555` where you can browse, edit, and delete records visually.

---

## Step 49 — Create the Prisma Client Singleton

- Create file: `lib/prisma.ts`

  ```ts
  import { PrismaClient } from "@prisma/client"

  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
  }

  export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient()

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
  }
  ```

  **Line-by-line breakdown:**

  | Code | Purpose |
  |------|---------|
  | `import { PrismaClient }` | The auto-generated database client |
  | `globalForPrisma = globalThis` | Access the Node.js global object |
  | `globalForPrisma.prisma ??` | Reuse existing client if one exists |
  | `new PrismaClient()` | Create a new client only if none exists |
  | `if (process.env.NODE_ENV !== "production")` | In development, store client on `globalThis` |
  | `globalForPrisma.prisma = prisma` | Prevents new client on every hot reload |

### Why This Pattern Is Necessary

- During development, Next.js **hot reloads** your code on every file save.
- Without this pattern, each hot reload creates a **new database connection**:

  ```
  Without singleton:                  With singleton:
  ──────────────────                  ─────────────────
  Save file → new PrismaClient()     Save file → reuse existing client
  Save file → new PrismaClient()     Save file → reuse existing client
  Save file → new PrismaClient()     Save file → reuse existing client
        ↓                                   ↓
  Connection pool exhausted!          Single connection reused
  "Too many connections" error        No issues
  ```

- In **production**, this isn't a problem because there are no hot reloads — the singleton pattern just acts as a regular module export.

---

## Step 50 — Update the Courses API Route

- Open `app/api/courses/route.ts` and **replace** with:

  ```ts
  import { prisma } from "@/lib/prisma"

  export async function GET() {

    const courses = await prisma.course.findMany()

    return Response.json(courses)

  }
  ```

  **What changed:**

  | Before (lib/data.ts) | After (Prisma) |
  |---------------------|----------------|
  | `import { courses } from "@/lib/data"` | `import { prisma } from "@/lib/prisma"` |
  | `return Response.json(courses)` | `const courses = await prisma.course.findMany()` |
  | Reads from in-memory array | Queries PostgreSQL database |
  | Data resets on restart | Data persists permanently |

---

## Step 51 — Update the Create Course Server Action

- Open `app/dashboard/courses/new/page.tsx` and **replace** with:

  ```tsx
  import { prisma } from "@/lib/prisma"
  import { redirect } from "next/navigation"
  import { revalidatePath } from "next/cache"

  export default function NewCoursePage() {

    async function createCourse(formData: FormData) {
      "use server"

      const name = formData.get("name") as string
      const instructor = formData.get("instructor") as string

      await prisma.course.create({
        data: {
          name,
          instructor
        }
      })

      revalidatePath("/dashboard/courses")
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

  **What changed:**

  | Before (lib/data.ts) | After (Prisma) |
  |---------------------|----------------|
  | `import { addCourse, courses } from "@/lib/data"` | `import { prisma } from "@/lib/prisma"` |
  | `id: courses.length + 1` | Auto-generated by database (`@default(autoincrement())`) |
  | `addCourse(newCourse)` | `await prisma.course.create({ data: { name, instructor } })` |
  | Data lost on restart | Data saved permanently |

---

## Step 52 — Update the Courses List Page

- Instead of fetching from the API route, query the database **directly** from the Server Component.

- Open `app/dashboard/courses/page.tsx` and **replace** with:

  ```tsx
  import { prisma } from "@/lib/prisma"
  import Link from "next/link"

  export default async function CoursesPage({ searchParams }: any) {

    const params = await searchParams
    const page = Number(params.page) || 1
    const limit = 5
    const skip = (page - 1) * limit

    const [courses, totalCount] = await Promise.all([
      prisma.course.findMany({
        skip,
        take: limit,
        orderBy: { id: "asc" }
      }),
      prisma.course.count()
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return (

      <div className="container">

        <h2>Courses</h2>

        <table className="table mt-4">

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Instructor</th>
            </tr>
          </thead>

          <tbody>

            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>{course.instructor}</td>
              </tr>
            ))}

          </tbody>

        </table>

        <div className="mt-3">
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1
            return (
              <Link
                key={pageNumber}
                href={`/dashboard/courses?page=${pageNumber}`}
                className={`btn btn-sm me-2 ${
                  pageNumber === page ? "btn-primary" : "btn-outline-primary"
                }`}
              >
                {pageNumber}
              </Link>
            )
          })}
        </div>

      </div>

    )
  }
  ```

  **Key Prisma features used:**

  | Prisma method | SQL equivalent | Purpose |
  |--------------|----------------|---------|
  | `findMany({ skip, take })` | `SELECT * LIMIT 5 OFFSET 10` | Paginated query |
  | `count()` | `SELECT COUNT(*)` | Total records for pagination controls |
  | `orderBy: { id: "asc" }` | `ORDER BY id ASC` | Consistent ordering |
  | `Promise.all([...])` | Two queries in parallel | Fetch data + count simultaneously |

  **Direct DB access vs API route:**

  | Approach | Code | When to use |
  |----------|------|-------------|
  | Via API route | `fetch("/api/courses")` → `route.ts` → Prisma | When external clients need the API |
  | Direct Prisma | `prisma.course.findMany()` in Server Component | When only Next.js uses the data (faster) |

  > **Key insight:** Server Components can query the database **directly** — no API route needed. This is one of the biggest advantages of Server Components. The API route remains available for external consumers (mobile apps, other services).

---

## CRUD Operations — Complete Prisma Reference

Here's every CRUD operation updated for Prisma:

### Create

```ts
await prisma.course.create({
  data: { name: "Docker Mastery", instructor: "Admin" }
})
```

### Read (all)

```ts
const courses = await prisma.course.findMany()
```

### Read (one)

```ts
const course = await prisma.course.findUnique({
  where: { id: 1 }
})
```

### Read (paginated)

```ts
const courses = await prisma.course.findMany({
  skip: 10,
  take: 5,
  orderBy: { id: "asc" }
})
```

### Update

```ts
await prisma.course.update({
  where: { id: 1 },
  data: { name: "Updated Name", instructor: "New Instructor" }
})
```

### Delete

```ts
await prisma.course.delete({
  where: { id: 1 }
})
```

### Count

```ts
const total = await prisma.course.count()
```

### Search / Filter

```ts
const results = await prisma.course.findMany({
  where: {
    name: { contains: "react", mode: "insensitive" }
  }
})
```

---

## Architecture After Database Integration

```
Before (Levels 1–13):                After (Level 14):
──────────────────────                ─────────────────
Browser                               Browser
   ↓                                     ↓
Next.js Server Components             Next.js Server Components
   ↓                                     ↓
Server Actions                         Server Actions
   ↓                                     ↓
lib/data.ts (in-memory array)          Prisma ORM
   ↓                                     ↓
Data resets on restart                 PostgreSQL Database
                                         ↓
                                       Data persists permanently
```

**Full production architecture:**

```
┌──────────────────────────────────────────────────┐
│                     Browser                       │
└──────────────────────┬───────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────┐
│              Next.js App Router                   │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │ Server Components                           │ │
│  │  • Dashboard page                           │ │
│  │  • Courses list (prisma.course.findMany())  │ │
│  │  • Course detail (prisma.course.findUnique)│ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │ Server Actions                              │ │
│  │  • Create (prisma.course.create())          │ │
│  │  • Update (prisma.course.update())          │ │
│  │  • Delete (prisma.course.delete())          │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │ Client Components                           │ │
│  │  • CourseSearch, RevenueChart, LogoutButton  │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │ Auth.js (NextAuth)                          │ │
│  │  • Session management                       │ │
│  │  • Route protection                         │ │
│  └─────────────────────────────────────────────┘ │
└──────────────────────┬───────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────┐
│              Prisma ORM                           │
│  • Type-safe queries                              │
│  • Migration management                           │
│  • Connection pooling                              │
└──────────────────────┬───────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────┐
│           PostgreSQL Database                     │
│  • Course table                                   │
│  • (future) User, Session, Analytics tables       │
│  • Persistent storage                             │
└──────────────────────────────────────────────────┘
```

---

## Current Architecture

```
app/
  ├─ layout.tsx                              ← Root layout + AuthProvider
  ├─ page.tsx                                ← Home page
  ├─ login/
  │   └─ page.tsx                            ← Login page
  ├─ api/
  │   ├─ auth/[...nextauth]/route.ts         ← Auth endpoints
  │   └─ courses/route.ts                    ← Courses API (Prisma)
  └─ dashboard/
      ├─ layout.tsx                          ← Protected + Sidebar
      ├─ loading.tsx                         ← Loading spinner
      ├─ page.tsx                            ← Stats + Chart
      ├─ courses/
      │   ├─ page.tsx                        ← Paginated list (Prisma)
      │   ├─ new/page.tsx                    ← Create (Prisma)
      │   ├─ edit/[id]/page.tsx              ← Edit (Prisma)
      │   └─ [id]/page.tsx                   ← Detail (Prisma)
      └─ users/page.tsx

components/
  ├─ AuthProvider.tsx
  ├─ LogoutButton.tsx
  ├─ CourseSearch.tsx
  ├─ StatCard.tsx
  ├─ DashboardStats.tsx
  └─ RevenueChart.tsx

lib/
  ├─ auth.ts                                 ← Auth configuration
  ├─ prisma.ts                               ← Prisma client singleton
  └─ data.ts                                 ← (can be removed — replaced by Prisma)

prisma/
  ├─ schema.prisma                           ← Database schema
  ├─ seed.ts                                 ← Seed data (optional)
  └─ migrations/                             ← Migration history
```

---

## Your Complete Dashboard Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js App Router | Routing, layouts, pages |
| **UI** | Bootstrap 5 | Styling, components, grid |
| **Charts** | Recharts | Data visualization |
| **Server rendering** | Server Components | Data fetching, zero client JS |
| **Interactivity** | Client Components | Search, charts, forms |
| **Data mutations** | Server Actions | Create, update, delete |
| **Authentication** | Auth.js (NextAuth) | Login, sessions, route protection |
| **ORM** | Prisma | Type-safe database queries |
| **Database** | PostgreSQL | Persistent data storage |
| **Loading UI** | Suspense + loading.tsx | Streaming, skeleton screens |

---

## Practice Exercises

Try these on your own:

1. **Update the Edit page to use Prisma**
   - Open `app/dashboard/courses/edit/[id]/page.tsx`
   - Replace `courses.find()` with:
     ```ts
     const course = await prisma.course.findUnique({
       where: { id: Number(id) }
     })
     ```
   - Replace `updateCourse()` with:
     ```ts
     await prisma.course.update({
       where: { id: Number(id) },
       data: { name, instructor }
     })
     ```

2. **Update the Delete action to use Prisma**
   - In the courses list page, replace `deleteCourse(id)` with:
     ```ts
     await prisma.course.delete({
       where: { id }
     })
     ```

3. **Add a User model to the schema**
   - Add to `prisma/schema.prisma`:
     ```prisma
     model User {
       id    Int    @id @default(autoincrement())
       name  String
       email String @unique
       role  String @default("viewer")
     }
     ```
   - Run migration: `npx prisma migrate dev --name add-user-model`
   - Update the Users page to query from the database

4. **Explore Prisma Studio**
   - Run `npx prisma studio` — opens at `http://localhost:5555`
   - Browse your courses table
   - Try adding, editing, and deleting records directly in the UI
   - Refresh your dashboard to see the changes reflected

5. **Add search with Prisma's `contains` filter**
   - Update the courses page to accept a `search` query parameter:
     ```ts
     const search = params.search || ""

     const courses = await prisma.course.findMany({
       where: {
         name: { contains: search, mode: "insensitive" }
       },
       skip,
       take: limit
     })
     ```
   - Add a search input that updates the URL: `/dashboard/courses?search=react&page=1`

6. **Add relations between models**
   - Add a relation — courses belong to an instructor:
     ```prisma
     model Instructor {
       id      Int      @id @default(autoincrement())
       name    String
       courses Course[]
     }

     model Course {
       id           Int        @id @default(autoincrement())
       name         String
       instructorId Int
       instructor   Instructor @relation(fields: [instructorId], references: [id])
     }
     ```
   - Run migration: `npx prisma migrate dev --name add-instructor-relation`
   - Query with relations: `prisma.course.findMany({ include: { instructor: true } })`
   - This is how real databases model relationships

---

## Summary — What You Learned

| Concept | Key Takeaway |
|---------|-------------|
| **Prisma ORM** | Type-safe database client — use JavaScript functions instead of raw SQL |
| **Schema definition** | `prisma/schema.prisma` defines tables, columns, and relationships |
| **Migrations** | `npx prisma migrate dev` creates/updates database tables from the schema |
| **Prisma Client singleton** | Prevents connection pool exhaustion during development hot reloads |
| **Direct DB in Server Components** | No API route needed — query Prisma directly in `async` Server Components |
| **CRUD with Prisma** | `create()`, `findMany()`, `findUnique()`, `update()`, `delete()`, `count()` |
| **Pagination with Prisma** | `skip` + `take` replaces array `slice()` |
| **Search with Prisma** | `where: { name: { contains: "...", mode: "insensitive" } }` |
| **Prisma Studio** | Visual database browser at `localhost:5555` |
| **Database persistence** | Data survives server restarts — production-ready storage |

---

## Congratulations — Your Full-Stack Dashboard Is Complete!

You've built a **production-grade admin dashboard** covering every major Next.js concept:

```
Level  1 → Project setup, App Router, layouts
Level  2 → Nested routing, file-based routes
Level  3 → API routes, Server Components, data fetching
Level  4 → Dynamic routes [id], URL parameters
Level  5 → Client Components, "use client", search
Level  6 → Dashboard metrics, reusable components
Level  7 → Server Actions, "use server", forms
Level  8 → Shared data layer, redirect after mutation
Level  9 → Full CRUD — Edit + Delete
Level 10 → Loading UI, Suspense, streaming
Level 11 → Charts with Recharts
Level 12 → Pagination with searchParams
Level 13 → Authentication with Auth.js
Level 14 → Database with Prisma + PostgreSQL
```

---

## Beyond the Dashboard — Enterprise Extensions

For teams ready to go further, these are the next topics to explore:

| Feature | Technology | Use case |
|---------|-----------|----------|
| **Caching layer** | Redis | Cache frequent queries, session storage |
| **Background jobs** | BullMQ, Inngest | Email sending, report generation |
| **Microservice integration** | REST / gRPC | Connect to Go, Java, Python backends |
| **Event streaming** | Kafka, RabbitMQ | Real-time data pipelines |
| **Rate limiting** | Upstash, express-rate-limit | API abuse prevention |
| **RBAC authorization** | Custom middleware | Admin, editor, viewer roles |
| **File uploads** | S3, Cloudinary | Profile pictures, documents |
| **Testing** | Jest, Playwright | Unit tests, E2E tests |
| **Deployment** | Vercel, Docker, AWS | Production hosting |
| **Monitoring** | Sentry, Datadog | Error tracking, performance |
