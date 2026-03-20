# Level 11 — Charts & Analytics Dashboard

> **Objective:** By the end of this level, you will add interactive charts to the dashboard using the Recharts library, understand why charts must be Client Components, and learn the pattern for combining Server Components (data fetching) with Client Components (chart rendering).

> **Prerequisites:**
> - Completed **Levels 1–10**
> - Dev server running (`npm run dev`)
> - Existing structure includes `loading.tsx`, `<Suspense>`, `DashboardStats` component, and full CRUD

> **What changes in this level:** We transform the dashboard from a numbers-only view into a visual **analytics platform** with line charts. This is the standard for enterprise dashboards — metrics at the top, charts below, tables further down.

---

## Why Charts Need Client Components

- Chart libraries like Recharts, Chart.js, and D3 require access to:

  | Browser feature | Why charts need it |
  |----------------|-------------------|
  | **DOM** | Charts render SVG/Canvas elements directly in the browser |
  | **Event listeners** | Hover tooltips, click interactions, zoom/pan |
  | **Window dimensions** | Responsive charts need to know the container size |
  | **Animation APIs** | Smooth transitions when data changes |

- None of these exist on the server — so chart components **must** use `"use client"`.

- **The pattern:** Server Component fetches data → passes it as props → Client Component renders the chart.

---

## Step 35 — Install the Chart Library

- We'll use **Recharts** — the most popular React charting library:

  ```bash
  npm install recharts
  ```

  **Why Recharts?**

  | Library | React-native? | Learning curve | Best for |
  |---------|--------------|----------------|----------|
  | **Recharts** | Yes — built on React components | Low | Dashboards, admin panels |
  | Chart.js | No — needs react-chartjs-2 wrapper | Medium | Simple charts, quick setup |
  | D3.js | No — imperative, not component-based | High | Custom, complex visualizations |
  | Nivo | Yes — built on D3 + React | Medium | Beautiful pre-built charts |

  > Recharts uses a **declarative** API with React components (`<LineChart>`, `<BarChart>`, etc.), which feels natural alongside the rest of your Next.js code.

---

## Step 36 — Create the Revenue Chart Component

- Create file: `components/RevenueChart.tsx`

  ```tsx
  "use client"

  import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
  } from "recharts"

  const data = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 7000 },
    { month: "May", revenue: 6000 },
    { month: "Jun", revenue: 8000 }
  ]

  export default function RevenueChart() {

    return (

      <div className="card mt-4">

        <div className="card-body">

          <h5 className="card-title">Revenue Growth</h5>

          <ResponsiveContainer width="100%" height={300}>

            <LineChart data={data}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0d6efd"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    )

  }
  ```

  **Line-by-line breakdown:**

  | Code | Purpose |
  |------|---------|
  | `"use client"` | Required — Recharts needs browser DOM to render SVG charts |
  | `LineChart` | The chart container — defines the chart type |
  | `Line` | The actual data line drawn on the chart |
  | `XAxis` | Horizontal axis — displays `month` labels |
  | `YAxis` | Vertical axis — auto-scales based on revenue values |
  | `CartesianGrid` | Background grid lines for readability |
  | `Tooltip` | Shows data values on hover — interactive |
  | `ResponsiveContainer` | Makes the chart resize with its parent container |

  **Recharts component hierarchy:**

  ```
  <ResponsiveContainer>          ← handles sizing
    └─ <LineChart data={...}>    ← chart type + data
         ├─ <CartesianGrid />    ← background grid
         ├─ <XAxis />            ← horizontal labels
         ├─ <YAxis />            ← vertical scale
         ├─ <Tooltip />          ← hover interaction
         └─ <Line />             ← the data visualization
  ```

  **Key props explained:**

  | Prop | Value | Purpose |
  |------|-------|---------|
  | `width="100%"` | Full width of parent | Chart fills its container |
  | `height={300}` | 300 pixels | Fixed chart height |
  | `dataKey="month"` | Field name in data | Which field to use for X-axis labels |
  | `dataKey="revenue"` | Field name in data | Which field to plot as the line |
  | `type="monotone"` | Curve type | Smooth curves between data points (vs `"linear"` for straight lines) |
  | `stroke="#0d6efd"` | Hex color | Line color — Bootstrap primary blue |
  | `strokeWidth={3}` | Pixel width | Thicker line for visibility |
  | `strokeDasharray="3 3"` | Dash pattern | Creates dashed grid lines (3px dash, 3px gap) |

---

## Step 37 — Add the Chart to the Dashboard

- Open `app/dashboard/page.tsx` and **replace the entire content** with:

  ```tsx
  import { Suspense } from "react"
  import DashboardStats from "@/components/DashboardStats"
  import RevenueChart from "@/components/RevenueChart"

  export default function DashboardPage() {

    return (

      <div className="container">

        <h2 className="mb-4">Dashboard</h2>

        <Suspense fallback={<p>Loading stats...</p>}>

          <DashboardStats />

        </Suspense>

        <RevenueChart />

      </div>

    )

  }
  ```

  **What changed:**

  | Before (Level 10) | After (Level 11) |
  |-------------------|------------------|
  | Stats cards only | Stats cards + Revenue chart |
  | One visual section | Two visual sections |

  > **Note:** `RevenueChart` is **not** wrapped in `<Suspense>` because it doesn't fetch data asynchronously — it uses hardcoded data. If you later make it fetch data from an API (via a Server Component wrapper), you'd wrap it in Suspense.

- Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

- **Verify:**
  - Stats cards appear at the top (with Suspense loading)
  - A line chart titled "Revenue Growth" appears below the cards
  - Hover over the chart — a tooltip shows the month and revenue value
  - Resize your browser — the chart adapts to the new width

### The Dashboard Now Looks Like

```
┌─────────────────────────────────────────────────────────┐
│ Sidebar  │  Dashboard                                   │
│          │                                               │
│ Home     │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│ Courses  │  │Users   │ │Courses │ │Revenue │ │Sessions│ │
│ Users    │  │  120   │ │   8    │ │$24,000 │ │   32   │ │
│ Add      │  └────────┘ └────────┘ └────────┘ └────────┘ │
│ Course   │                                               │
│          │  ┌───────────────────────────────────────────┐ │
│          │  │  Revenue Growth                           │ │
│          │  │  $8k ┤          ╱                         │ │
│          │  │  $6k ┤    ╱╲  ╱                          │ │
│          │  │  $4k ┤╲  ╱  ╲╱                           │ │
│          │  │  $2k ┤ ╲╱                                │ │
│          │  │      └──┬──┬──┬──┬──┬──┬                 │ │
│          │  │        Jan Feb Mar Apr May Jun            │ │
│          │  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Architecture — Server + Client Composition

The dashboard page now combines both component types:

```
DashboardPage (Server Component)
       │
       ├── <Suspense>
       │      └── DashboardStats (Server Component)
       │              └── StatCard (Server Component)
       │
       └── RevenueChart (Client Component)
```

| Component | Type | `"use client"`? | Why |
|-----------|------|-----------------|-----|
| `DashboardPage` | Server | No | Orchestrates layout, no interactivity |
| `DashboardStats` | Server | No | Async data fetching |
| `StatCard` | Server | No | Pure rendering, no hooks |
| `RevenueChart` | **Client** | **Yes** | Recharts needs DOM + event listeners |

**Key insight:** Only `RevenueChart` ships JavaScript to the browser. All other components render as **pure HTML** — no JS bundle overhead.

### Data Flow

```
Server renders DashboardPage
       ↓
Server renders DashboardStats (async, fetches data)
       ↓
Server renders StatCard × 4 (pure HTML)
       ↓
Server sends RevenueChart component reference
       ↓
Browser receives HTML + RevenueChart JS bundle
       ↓
Browser hydrates RevenueChart → SVG chart renders
       ↓
User can hover for tooltips, resize for responsiveness
```

---

## Other Chart Types in Recharts

Recharts supports many chart types using the same component pattern. Here's a quick reference:

### Bar Chart

```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

<BarChart data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="revenue" fill="#198754" />
</BarChart>
```

### Area Chart

```tsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

<AreaChart data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Area type="monotone" dataKey="revenue" stroke="#0d6efd" fill="#0d6efd" fillOpacity={0.3} />
</AreaChart>
```

### Pie Chart

```tsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const pieData = [
  { name: "Beginner", value: 40 },
  { name: "Intermediate", value: 35 },
  { name: "Advanced", value: 25 }
]

const COLORS = ["#0d6efd", "#198754", "#ffc107"]

<PieChart>
  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
    {pieData.map((entry, index) => (
      <Cell key={index} fill={COLORS[index]} />
    ))}
  </Pie>
  <Tooltip />
</PieChart>
```

### Chart Type Quick Reference

| Chart type | Component | Best for |
|-----------|-----------|----------|
| `<LineChart>` | `<Line>` | Trends over time (revenue, users, growth) |
| `<BarChart>` | `<Bar>` | Comparing categories (courses per instructor, sales by region) |
| `<AreaChart>` | `<Area>` | Volume over time (traffic, bandwidth, usage) |
| `<PieChart>` | `<Pie>` | Proportions (market share, category distribution) |
| `<RadarChart>` | `<Radar>` | Multi-dimensional comparison (skill assessment, ratings) |

---

## Production Pattern — Server Fetches, Client Renders

In our current code, chart data is hardcoded inside the Client Component. In production, data should be **fetched on the server** and **passed as props**:

```tsx
// components/RevenueChart.tsx (Client — renders the chart)
"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function RevenueChart({ data }: { data: any[] }) {
  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Revenue Growth</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#0d6efd" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
```

```tsx
// components/RevenueChartWrapper.tsx (Server — fetches data)
import RevenueChart from "./RevenueChart"

async function getRevenueData() {
  const res = await fetch("http://analytics-service/api/revenue", {
    cache: "no-store"
  })
  return res.json()
}

export default async function RevenueChartWrapper() {
  const data = await getRevenueData()
  return <RevenueChart data={data} />
}
```

```tsx
// app/dashboard/page.tsx (uses the wrapper)
<Suspense fallback={<p>Loading chart...</p>}>
  <RevenueChartWrapper />
</Suspense>
```

**Why this pattern?**

| Concern | Who handles it |
|---------|---------------|
| Fetching data from API | Server Component (secure, fast) |
| Rendering SVG chart | Client Component (needs DOM) |
| Loading state | `<Suspense>` boundary |

> **Trainer Tip:** Walk students through this three-layer pattern: **Server fetches → Client renders → Suspense loads**. This is the most common architecture in production Next.js apps with charts.

---

## Current Architecture

```
app/
  ├─ layout.tsx
  ├─ page.tsx
  ├─ api/courses/route.ts
  └─ dashboard/
      ├─ layout.tsx                          ← Sidebar
      ├─ loading.tsx                         ← Loading spinner
      ├─ page.tsx                            ← Stats + Chart
      ├─ courses/
      │   ├─ page.tsx                        ← Course list + CRUD
      │   ├─ new/page.tsx                    ← Create form
      │   ├─ edit/[id]/page.tsx              ← Edit form
      │   └─ [id]/page.tsx                   ← Course detail
      └─ users/page.tsx

components/
  ├─ CourseSearch.tsx                         ← Client Component (search)
  ├─ StatCard.tsx                            ← Server Component (metric card)
  ├─ DashboardStats.tsx                      ← Server Component (async stats)
  └─ RevenueChart.tsx                        ← Client Component (line chart)

lib/
  └─ data.ts                                 ← Data layer
```

**Component type map:**

| Component | Type | Ships JS to browser? | Why |
|-----------|------|---------------------|-----|
| All `page.tsx` / `layout.tsx` | Server | No | Layout + data fetching |
| `StatCard` | Server | No | Pure rendering |
| `DashboardStats` | Server | No | Async data fetching |
| `CourseSearch` | Client | Yes | `useState` + `onChange` |
| `RevenueChart` | Client | Yes | Recharts needs DOM |

---

## Practice Exercises

Try these on your own before moving to Level 12:

1. **Add a Bar Chart for course enrollments**
   - Create `components/EnrollmentChart.tsx` with `"use client"`
   - Use `<BarChart>` with sample data:
     ```tsx
     const data = [
       { course: "Next.js", students: 45 },
       { course: "React", students: 38 },
       { course: "Microservices", students: 22 },
       { course: "Docker", students: 30 }
     ]
     ```
   - Add it to the dashboard page below the revenue chart
   - Use `fill="#198754"` (Bootstrap green) for the bars

2. **Add a Pie Chart for user roles**
   - Create `components/RolePieChart.tsx` with `"use client"`
   - Use `<PieChart>` with data:
     ```tsx
     const data = [
       { name: "Developers", value: 65 },
       { name: "Admins", value: 20 },
       { name: "Viewers", value: 15 }
     ]
     ```
   - Display it in a Bootstrap card next to the revenue chart
   - Use a `row` + `col-md-6` grid to place two charts side by side

3. **Make the chart data come from props (Server → Client pattern)**
   - Move the `data` array out of `RevenueChart.tsx`
   - Accept it as a prop: `export default function RevenueChart({ data }: any)`
   - Create a Server Component wrapper that fetches data and passes it down
   - Wrap it in `<Suspense>` on the dashboard page

4. **Add multiple lines to the revenue chart**
   - Add `expenses` to the data:
     ```tsx
     const data = [
       { month: "Jan", revenue: 4000, expenses: 2400 },
       { month: "Feb", revenue: 3000, expenses: 1800 },
       ...
     ]
     ```
   - Add a second `<Line>` with a different color:
     ```tsx
     <Line type="monotone" dataKey="expenses" stroke="#dc3545" strokeWidth={3} />
     ```
   - Add a `<Legend />` component (import from recharts) to label each line

5. **Create a responsive two-column chart layout**
   - Place the revenue chart and a bar chart side by side using Bootstrap grid:
     ```tsx
     <div className="row">
       <div className="col-md-6">
         <RevenueChart />
       </div>
       <div className="col-md-6">
         <EnrollmentChart />
       </div>
     </div>
     ```
   - On mobile, they stack vertically; on desktop, they sit side by side

6. **Add chart tooltips with custom formatting**
   - Create a custom tooltip component:
     ```tsx
     function CustomTooltip({ active, payload, label }: any) {
       if (active && payload && payload.length) {
         return (
           <div className="card p-2">
             <strong>{label}</strong>
             <p>Revenue: ${payload[0].value.toLocaleString()}</p>
           </div>
         )
       }
       return null
     }

     // Use it:
     <Tooltip content={<CustomTooltip />} />
     ```
   - This shows formatted dollar amounts instead of raw numbers

---

## Summary — What You Learned

| Concept | Key Takeaway |
|---------|-------------|
| **Recharts** | React charting library — uses declarative components (`<LineChart>`, `<Bar>`, etc.) |
| **Charts need `"use client"`** | Chart libraries require DOM, events, and browser APIs |
| **`<ResponsiveContainer>`** | Makes charts resize automatically with their parent container |
| **Chart component hierarchy** | `ResponsiveContainer` → `Chart` → `Grid` + `Axes` + `Tooltip` + `Data` |
| **Server + Client composition** | Server fetches data, Client renders the chart — best of both worlds |
| **Three-layer pattern** | Server fetch → Client render → Suspense loading (production architecture) |
| **Multiple chart types** | Line (trends), Bar (comparisons), Area (volume), Pie (proportions) |
| **Minimal JS footprint** | Only chart components ship JavaScript — everything else stays on the server |

---

## What's Coming Next (Level 12)

We'll add **Pagination** for handling large datasets:

- Topics covered:
  - **`searchParams`** — reading URL query parameters in Server Components
  - **URL-based state** — `/dashboard/courses?page=2` for shareable, bookmarkable pagination
  - **Server-side pagination** — slicing data on the server (not loading everything into the browser)
  - **Pagination controls** — Next/Previous buttons that update the URL
  - **Why URL state > React state** — pagination state in the URL is shareable, refreshable, and SEO-friendly

- This is essential for dashboards with hundreds or thousands of records.
