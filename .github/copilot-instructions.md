# GitHub Copilot Instructions

This repository is governed by the comprehensive testing, architecture, and workflow expectations documented in `AGENTS.md`.

Before suggesting architectural changes, generating new features, or writing tests, please review the `/AGENTS.md` file located in the root of the repository for full context.

Key Guidelines:
1. **Clean Architecture**: Never import `web-api/`, `web-client/`, AWS SDKs, or persistence modules from within `shared/src/business/` (domain/use cases).
2. **Testing**: All code modifications require 100% line + branch test coverage in their owning suite (detailed in `AGENTS.md`).
3. **Accessibility**: All UI changes must satisfy Section 508 and WCAG 2.1 AA.
4. **Validation**: Ensure that Joi entities are validated *before* invoking persistence models.
5. **Code Style**: Run `npm run lint:fix` followed by `npm run lint` for automated clean-up, and prefer Tailwind (`tw:`) over USWDS styling where both are viable.

For exact Cypress role testing commands, infrastructure documentation, debugging hints, and commit prefixing rules, consult `AGENTS.md`.

## PR Review Agent Instructions

If you are acting as the GitHub Copilot Pull Request Reviewer, your job is to enforce the conventions in `AGENTS.md` through static analysis. When reviewing a PR, immediately flag violations of the following:

1. **Clean Architecture Violations**: Reject any PR that imports `web-api/`, `web-client/`, AWS SDKs, or persistence modules into `shared/src/business/`.
2. **Missing Migrations Documentation**: If `web-api/src/persistence/postgres/utils/migrate/` has new files, verify `docs/postgres/schema/data-dictionary.csv` and `docs/postgres/schema/erd.mmd` are also updated.
3. **Interactor Ordering**: Reject if an interactor persists an entity before successfully validating it via `JoiValidationEntity`.
4. **TypeScript Discipline**: Flag the use of `as any`, non-null assertions (`!`), or missing return type annotations.
5. **Styling**: Flag new usages of USWDS utility classes if a Tailwind equivalent with the `tw:` prefix could be used.
6. **Missing Test Coverage**: If a source file is modified but its corresponding `*.test.ts` (or `*.cy.ts` for UI) is absent from the PR, remind the author that 100% line/branch coverage and Cypress role permutations are required by `AGENTS.md`.
7. **Acceptance Criteria**: If you can associate this work to a ticket or defined task, examine the original ticket or task in detail (e.g. `GH_PAGER=cat gh issue view <TICKET NUMBER> --comments`), examine all added and modified code, and assert that all acceptance criteria have been met.
8. **Linting and Formatting**: Check the diff for ESLint, Stylelint, Shellcheck, and Prettier inconsistencies.
9. **Safe Migrations**: Flag any Postgres migration under `web-api/src/persistence/postgres/utils/migrate/` that destructively modifies tables or columns currently in use. Because DAWSON uses zero-downtime blue/green deployments, the "active" color is still running while migrations execute on the "passive" color. Suggest the expand/contract pattern for any destructive schema changes.
