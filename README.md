# ₹ Tracker — Mini Expense Tracker

A full-stack expense tracking app built with **Node.js + Express** (backend) and **React + Vite** (frontend). Users can log daily spending across categories, filter by date range, visualise spending with a pie chart, set per-category budgets, and export data as CSV.

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | _Deploy to Vercel / Netlify and paste URL here_ |
| Backend  | _Deploy to Render / Railway and paste URL here_ |

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Backend runtime | Node.js + Express | Minimal boilerplate, familiar ecosystem |
| Storage | In-memory array (seeded) | Keeps setup zero-config; swap for SQLite trivially |
| Frontend | React 18 + Vite | Fast HMR, modern JSX, no CRA overhead |
| Charts | Recharts | Declarative, React-native, great defaults |
| Styling | CSS Modules | Scoped styles, no build-time overhead, easy to read |
| Testing | Jest + Supertest | Standard Node testing pair; integration-level coverage |

---

## Project Structure

```
expense-tracker/
├── package.json          ← root convenience scripts
├── .gitignore
├── README.md
│
├── server/
│   ├── package.json
│   └── src/
│       ├── index.js          ← Express app + server boot
│       ├── store.js          ← In-memory data + seed data
│       └── routes/
│           ├── expenses.js   ← CRUD + filtering + summary
│           └── budgets.js    ← GET / PUT category budgets
│   └── tests/
│       └── expenses.test.js  ← Jest + Supertest integration tests
│
└── client/
    ├── index.html
    ├── vite.config.js        ← proxies /api → localhost:4000
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx / App.module.css
        ├── api/index.js          ← all fetch calls to backend
        ├── utils.js              ← formatCurrency, formatDate, getDateRange
        ├── utils/exportCSV.js    ← CSV export helper
        ├── hooks/
        │   └── useExpenses.js    ← all data fetching + mutation logic
        ├── styles/global.css
        └── components/
            ├── ExpenseForm       ← add / edit form with validation
            ├── ExpenseList       ← table with inline edit + delete confirm
            ├── FilterBar         ← category chips + date preset picker
            ├── SummaryPanel      ← monthly totals + budget progress bars
            ├── CategoryChart     ← Recharts pie chart
            └── BudgetModal       ← set per-category budget
```

---

## How to Run Locally

> Assumes **Node.js 18+** is installed. No database setup needed.

### 1. Clone & install

```bash
git clone <your-repo-url>
cd expense-tracker
npm run install:all
```

Or manually:

```bash
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 2. Start the backend

```bash
cd server
npm run dev        # nodemon auto-restarts on changes
# Server → http://localhost:4000
```

### 3. Start the frontend (new terminal)

```bash
cd client
npm run dev
# App → http://localhost:3000
```

Vite proxies `/api/*` to `http://localhost:4000` automatically — no CORS issues in dev.

### 4. Run tests

```bash
cd server
npm test
```

---

## API Documentation

Base URL: `http://localhost:4000/api`

### Expenses

| Method | Path | Body | Response |
|--------|------|------|----------|
| `GET` | `/expenses` | — | `Expense[]` (filtered by `?category`, `?startDate`, `?endDate`) |
| `GET` | `/expenses/summary` | — | `{ totalThisMonth, byCategory, highest }` |
| `GET` | `/expenses/:id` | — | `Expense` |
| `POST` | `/expenses` | `{ amount, category, date, note? }` | `Expense` (201) |
| `PATCH` | `/expenses/:id` | Any subset of expense fields | `Expense` |
| `DELETE` | `/expenses/:id` | — | 204 No Content |

**Expense shape:**
```json
{
  "id": "uuid",
  "amount": 450,
  "category": "Food",
  "date": "2025-06-01",
  "note": "Grocery run",
  "createdAt": "2025-06-01T10:30:00.000Z"
}
```

**Summary shape:**
```json
{
  "totalThisMonth": 6250,
  "byCategory": { "Food": 650, "Bills": 4700, "Transport": 300, "Entertainment": 850, "Other": 600 },
  "highest": { ...Expense }
}
```

### Budgets

| Method | Path | Body | Response |
|--------|------|------|----------|
| `GET` | `/budgets` | — | `{ Food: 5000, Transport: 2000, ... }` |
| `PUT` | `/budgets/:category` | `{ limit: 6000 }` | `{ category, limit }` |

**Validation rules:**
- `amount` must be a positive number
- `category` must be one of: `Food`, `Transport`, `Bills`, `Entertainment`, `Other`
- `date` must be a valid date, not in the future
- Budget `limit` must be ≥ 0

---

## Features

### Must Have ✅
- Add expense (amount, category, date, optional note) with validation
- View all expenses sorted by date (newest first)
- Edit and delete expenses (delete requires confirmation)
- Filter by category and date range (this month / last month / last 3 months / all time / custom)
- Summary panel: total this month, total per category, highest single expense

### Should Have ✅
- Pie chart of expenses by category (Recharts)
- Currency formatted as ₹ using `Intl.NumberFormat` (en-IN locale)
- Full form validation — no negatives, no future dates, category required

### Bonus ✅
- Export visible expenses as CSV download
- Per-category budget with visual progress bar (turns red when exceeded)
- Empty state UI

---

## Next Steps

Given more time, I would:

1. **Persistence** — Write expenses to a JSON file or SQLite so data survives server restarts
2. **Authentication** — Add a simple JWT login so multiple users can track independently
3. **Drag-to-reorder** — Add manual ordering with `@dnd-kit`
4. **Recurring expenses** — Let users mark expenses as monthly recurring
5. **Monthly trend chart** — Bar chart showing spend across the last 6 months
6. **PWA / mobile** — Service worker + manifest for offline use on mobile

---

## Notes

- AI tools (Claude) were used to accelerate development. All code has been reviewed and understood line-by-line.
- The app ships with seed data so reviewers see a populated UI immediately on startup.
