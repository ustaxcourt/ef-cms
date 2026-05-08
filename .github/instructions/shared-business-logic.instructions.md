---
applyTo: "shared/src/business/**"
---

# Shared Business Logic — Clean Architecture Rules

## Purpose

Rules for the innermost Clean Architecture layer: pure domain logic (entities,
interactors, utilities). Code here must remain framework- and infrastructure-agnostic.

## Import Restrictions

- MUST NOT import from `web-api/`, `web-client/`, AWS SDKs, or persistence modules
- Reach outward only via `applicationContext` methods:
  `getPersistenceGateway`, `getUseCases`, `getUseCaseHelpers`, `getUtilities`, `getDocumentGenerators`
- Do not put browser-only code (`window`, `document`, DOM APIs, React, Cerebral) in `shared/`

## Interactor Conventions

- File naming: `verbNounInteractor.ts` co-located with `verbNounInteractor.test.ts`
- Validate the entity (Joi via `JoiValidationEntity`) **before** invoking persistence
- Never persist first and validate after
- Never reach a persistence gateway from an unvalidated entity

```typescript
// Correct order
const entity = new MyEntity(rawData);
entity.validate(); // throws if invalid
await applicationContext.getPersistenceGateway().saveEntity({ entity });

// Wrong — persisting before validation
await applicationContext.getPersistenceGateway().saveEntity({ entity: rawData });
entity.validate();
```

## Entity Conventions

- PascalCase classes extending `JoiValidationEntity`
- Validation constants in `EntityValidationConstants.ts` / `JoiValidationConstants.ts`
- Domain constants (event codes, etc.) in `EntityConstants.ts`

## Date/Time Handling

- Use `DateHandler` from `shared/src/business/utilities/DateHandler.ts`
- Do not import `luxon`, `date-fns`, `moment`, or use hand-rolled `new Date()` arithmetic
- A custom ESLint rule enforces this

## Error Handling

- Errors from user-initiated actions must always reach the end user
- Do not swallow errors (empty `catch`, `catch` that only logs)
