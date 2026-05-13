# AI Agent Instructions

This repository is governed by the comprehensive testing, architecture, and workflow expectations documented in `AGENTS.md`.

Before suggesting architectural changes, generating new features, or writing tests, please review the `AGENTS.md` file located in the root of the repository for full context.

Directory-specific conventions are documented in each major directory's own `AGENTS.md`:

- `shared/AGENTS.md` — Clean Architecture, entities, interactors, domain utilities, document generation.
- `web-api/AGENTS.md` — Lambda handlers, persistence (Postgres/OpenSearch), logging, async work, feature flags.
- `web-client/AGENTS.md` — React + Cerebral conventions, component libraries, styling, accessibility.
- `cypress/AGENTS.md` — E2E testing, role helpers, accessibility testing, Cypress commands.