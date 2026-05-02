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
