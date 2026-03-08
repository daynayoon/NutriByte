# NutriByte

Recipe and nutrition management web app built for CPSC 304.

**Live:** https://nutri-byte-omega.vercel.app

## Stack

| Layer | Tech |
|---|---|
| Backend | Node.js + Express |
| Database | PostgreSQL (Neon) |
| Frontend | Vanilla HTML / CSS / JS |
| Hosting | Vercel |

## Project Structure

```
NutriByte/
├── .env                  # Local env vars (not committed)
├── vercel.json           # Vercel deployment config
├── db/
│   ├── recipe_schema.sql     # Oracle schema (legacy)
│   └── recipe_schema_pg.sql  # PostgreSQL schema + seed data
└── src/
    ├── server.js
    ├── appController.js  # All routes
    ├── appService.js     # All SQL / DB logic
    ├── public/           # Frontend
    └── utils/envUtil.js
```

## Local Development

```bash
# 1. Install dependencies
cd src && npm install

# 2. Create .env in project root
PORT=50008
PGUSER=postgres
PGPASSWORD=your_password
PGHOST=127.0.0.1
PGPORT=5432
PGDATABASE=nutribyte

# 3. Start dev server
cd src && npm run dev
```

App runs at `http://localhost:50008`

## Deployment

Hosted on Vercel with Neon PostgreSQL. Redeploy:

```bash
vercel --prod
```

## Features

1. **Insert** — Add recipes with customer association
2. **Update** — Update customer name / email
3. **Delete** — Remove ingredients (with cascade)
4. **Selection** — Filter customers by type with optional name
5. **Projection** — Display selected Recipe columns
6. **Join** — Customers who rated a recipe above a threshold
7. **Group By** — Recipe count per saved list
8. **Having** — Recipes with average rating ≥ threshold
9. **Nested Aggregation** — Top cuisines by average rating
10. **Division** — Recipes containing all specified ingredients
