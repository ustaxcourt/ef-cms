# shared/ — Domain Logic Layer

This directory contains the inner layers of DAWSON's Clean Architecture: pure domain logic, entities, use cases (interactors), and utilities. Nothing here should depend on external frameworks, AWS SDKs, or browser APIs.

## Clean Architecture Import Rule

Code in `shared/src/business/useCases/` and `shared/src/business/entities/` **MUST NOT** import from `web-api/`, `web-client/`, AWS SDKs, or persistence modules. Reach outward only via `applicationContext` methods:

- `getPersistenceGateway()`
- `getUseCases()`
- `getUseCaseHelpers()`
- `getUtilities()`
- `getDocumentGenerators()`

See [docs/clean-architecture.md](../docs/clean-architecture.md) for full details.

**No browser-only code in `shared/`**: do not import `window`, `document`, DOM APIs, React, Cerebral, or other browser/runtime-specific modules. Such code belongs in `web-client/`. This rule is enforced at bundle time by [esbuild.config.mjs](../esbuild.config.mjs) and [esbuild.public.config.mjs](../esbuild.public.config.mjs).

## Entities

- PascalCase classes extending `JoiValidationEntity` (see [`src/business/entities/JoiValidationEntity.ts`](src/business/entities/JoiValidationEntity.ts)).
- Validation constants in `EntityValidationConstants.ts` / [`JoiValidationConstants.ts`](src/business/entities/JoiValidationConstants.ts).
- Role enum: `ROLES` in [`src/business/entities/EntityConstants.ts`](src/business/entities/EntityConstants.ts).
- Event (document filing) codes: `ALL_EVENT_CODES` in [`src/business/entities/EntityConstants.ts`](src/business/entities/EntityConstants.ts).

## Interactors (Use Cases)

- Naming: `verbNounInteractor.ts` co-located with `verbNounInteractor.test.ts` in `src/business/useCases/…`.
- **Validate before persist**: validate the entity (Joi via `JoiValidationEntity`) **before** invoking persistence — never persist first and validate after, and never reach a persistence gateway from an unvalidated entity.

## Domain Utilities

- **Date/time handling**: [`src/business/utilities/DateHandler.ts`](src/business/utilities/DateHandler.ts). A custom ESLint rule forbids direct use of the global `Date`; use `DateHandler`. Do not directly import `luxon`, `date-fns`, `moment`, or use hand-rolled `new Date()` arithmetic.
- **No i18n**: DAWSON has no i18n; user-facing copy is inline in the views.

## Document Generation

- Generators live in [`src/business/utilities/documentGenerators/`](src/business/utilities/documentGenerators/).
- Visual-diff helper `generateAndVerifyPdfDiff` lives in the same directory; see neighboring `*.test.ts` files for usage.
- New or materially altered PDF generators must ship with a `generateAndVerifyPdfDiff`-based snapshot test.

## Authorization

- Role → permission matrix: [`src/authorization/authorizationClientService.ts`](src/authorization/authorizationClientService.ts).

## Test Infrastructure

- Mock `applicationContext` (server-side): [`src/business/test/createTestApplicationContext.ts`](src/business/test/createTestApplicationContext.ts).
- Seeded user tokens for tests: [`src/test/mockUserTokenMap.ts`](src/test/mockUserTokenMap.ts).
- Sample documents/PDFs: [`test-assets/`](test-assets/).

## Testing

- **Test suite**: `npm run test:shared` (with coverage). Single file: `npm run test:shared:file -- path/to/file.test.ts`.
- **Exception**: `src/business/utilities/documentGenerators/**` → `npm run test:document-generation`.
- 100% line + branch coverage is required for all added/modified code.
