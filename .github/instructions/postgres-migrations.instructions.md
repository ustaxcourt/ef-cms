---
applyTo: "web-api/src/persistence/postgres/utils/migrate/**"
---

# Postgres Migration Rules

## Purpose

Rules for Kysely database migrations. DAWSON uses zero-downtime blue/green
deployments, so migrations run on the "passive" environment while the "active"
environment continues serving traffic.

## Zero-Downtime Safety

- Never destructively modify tables or columns that the active color relies on
- For destructive schema changes (column drops, type changes, renames), use the
  expand/contract pattern:
  1. **Expand**: add the new column/table alongside the old one
  2. **Deploy**: code reads from both, writes to both
  3. **Contract** (next release): remove the old column/table once no code references it

```typescript
// Expand phase — add new column, keep old one
await db.schema.alterTable('my_table').addColumn('new_col', 'text').execute();

// Contract phase (NEXT release only) — drop old column
await db.schema.alterTable('my_table').dropColumn('old_col').execute();
```

## Required Documentation Updates

Every new migration file must be paired with updates to:

- `docs/postgres/schema/data-dictionary.csv` — column-level documentation
- `docs/postgres/schema/erd.mmd` — Mermaid ERD diagram

## Schema Reference

- Database schema types: `web-api/src/persistence/postgres/database-schema.ts`
- Existing migrations: `web-api/src/persistence/postgres/utils/migrate/`
