# team_39

## Project Summary

The domain of this application is culinary and nutrition management, and more specifically, is focused around recipe organization. It encompasses areas such as storing recipes, giving instructions for cooking, and tracking nutritional or dietary information. Moreover, the system also includes community engagement features such as rating or saving recipes, which extend the domain into social and collaborative cooking.

## Tech stacks

- Backend: Node.js + Express (express@^4.17.3)
- Database: Oracle Database (UBC host) via Node driver oracledb@^5.2.0
- Frontend: plain HTML + CSS + vanilla JavaScript (no React/Vue/Angular)
- API style: REST-like HTTP endpoints in Express (GET/POST/DELETE)
- SQL: raw SQL + schema file (recipe_schema.sql)
- Config/env: .env file with custom env loader (envUtil.js)
- Tooling/scripts: npm project with Windows/macOS shell scripts for
- Oracle Instant Client setup and SSH DB tunneling (scripts/win, scripts/mac)
