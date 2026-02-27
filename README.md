# team_39 — Recipe Application

A culinary and nutrition management web application focused on recipe organization. It supports storing recipes, cooking instructions, nutritional and dietary information, and community features such as rating and saving recipes.

**Documentation:** See [QuerySpec.md](QuerySpec.md) for the full query specification and implementation details.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js + Express (express@^4.17.3) |
| Database | Oracle Database (UBC host) via oracledb@^5.2.0 |
| Frontend | Plain HTML, CSS, vanilla JavaScript (no frameworks) |
| API | REST-like HTTP endpoints (GET, POST, PUT, DELETE) |
| SQL | Raw SQL with schema file (`recipe_schema.sql`) |
| Config | `.env` file with custom loader (`src/utils/envUtil.js`) |
| Tooling | npm project with Windows/macOS scripts for Oracle Instant Client and SSH DB tunneling |

## Project Structure

```
team_39/
├── .env              # Environment variables (create from template)
├── recipe_schema.sql # Database schema and seed data
├── QuerySpec.md      # Query specification reference
├── README.md
└── src/
    ├── package.json
    ├── server.js     # Express server entry point
    ├── appController.js
    ├── appService.js
    ├── remote-start.sh  # For UBC remote server
    ├── public/       # Static frontend assets
    │   ├── index.html
    │   ├── styles.css
    │   └── scripts.js
    ├── utils/
    │   └── envUtil.js
    └── scripts/
        ├── win/      # Windows: db-tunnel.cmd, server-tunnel.cmd, instantclient-setup.cmd
        └── mac/      # macOS: db-tunnel.sh, server-tunnel.sh, instantclient-setup.sh
```

## Getting Started

### Prerequisites

- Node.js
- Oracle Instant Client (see `src/scripts/win` or `src/scripts/mac` for setup)
- UBC CWL account (for database access via SSH tunnel)

### 1. Install Dependencies

```bash
cd src
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root with:

```
PORT=65534
ORACLE_USER=your_oracle_username
ORACLE_PASS=your_oracle_password
ORACLE_HOST=localhost
ORACLE_PORT=1522
ORACLE_DBNAME=your_db_name
```

### 3. Database Connection

For remote access to the UBC Oracle database, establish an SSH tunnel first:

- **Windows**: Run `src/scripts/win/db-tunnel.cmd`
- **macOS**: Run `src/scripts/mac/db-tunnel.sh`

The script will prompt for your CWL and update `ORACLE_HOST` and `ORACLE_PORT` in `.env`.

### 4. Initialize Schema

Load the schema and seed data by running `recipe_schema.sql` against your Oracle database (via SQL*Plus, SQL Developer, or another tool).

### 5. Start the Server

From the `src/` directory:

```bash
cd src
npm start
```

Or run `src/remote-start.sh` from project root (for UBC remote server). With tunnel (Windows): `src/scripts/win/server-tunnel.cmd`

The app will be available at `http://localhost:65534/` (or the port in your `.env`).

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/check-db-connection` | Test database connectivity |
| GET | `/recipe` | List all recipes |
| POST | `/initiate-recipe` | Reset Recipe table |
| POST | `/insert-recipe` | Add a new recipe |
| GET | `/customer` | List all customers |
| POST | `/select-customer` | Filter customers by type (RecipeCreator/FoodCritic) |
| PUT | `/customer/:id` | Update customer name/email |
| GET | `/ingredients` | List all ingredients |
| DELETE | `/ingredient/:id` | Delete an ingredient |
| POST | `/savedListCountTable` | Recipe counts per saved list |
| POST | `/findAllRecipesTable` | Find recipes containing all specified ingredients |
| POST | `/customers-by-recipe` | Customers who rated a recipe (with min stars) |
| GET | `/top-cuisines` | Cuisines with highest average rating |
| POST | `/recipes/projection` | Project selected Recipe attributes |
| POST | `/recipes/avg-rating` | Recipes with average rating ≥ threshold |

## Features (Implemented Queries)

1. **Insert** — Add recipes with customer association
2. **Update** — Update customer name and/or email
3. **Delete** — Remove ingredients (cascades to Fresh, Processed, Contain, CanHave)
4. **Selection** — Filter customers by RecipeCreator or FoodCritic type (with optional name)
5. **Projection** — Display selected Recipe attributes
6. **Join** — Customers who rated a recipe with minimum stars
7. **Aggregation (GROUP BY)** — Recipe count per saved list
8. **Aggregation (HAVING)** — Recipes with average rating ≥ threshold
9. **Nested Aggregation** — Top cuisines by average rating
10. **Division** — Recipes containing all specified ingredients

For SQL details and query design, see [QuerySpec.md](QuerySpec.md).

## Database Schema Overview

Key entities: `Customer`, `Recipe`, `Cuisine`, `Ingredient`, `SavedLists`, `Instruction`, `Nutrition1`, `Nutrition2`, `Allergen`, `RecipeCreator`, `FoodCritic`, `Rate`, `AddRelation`, `Contain`, `RecipeReference`, `CanHave`, `Fresh`, `Processed`.

See `recipe_schema.sql` for full definitions and seed data.

## License

ISC
