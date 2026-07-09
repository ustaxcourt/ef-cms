# web-client/ — Frontend Layer

This directory contains DAWSON's React + Cerebral.js single-page applications: a private app (`app.tsx`) and a public app (`appPublic.tsx`).

## Two React Apps

- **Private app**: [`src/app.tsx`](src/app.tsx), [`src/applicationContext.ts`](src/applicationContext.ts), routes in [`src/router.ts`](src/router.ts), state in [`src/presenter/state.ts`](src/presenter/state.ts).
- **Public app**: [`src/appPublic.tsx`](src/appPublic.tsx), [`src/applicationContextPublic.ts`](src/applicationContextPublic.ts), routes in [`src/routerPublic.ts`](src/routerPublic.ts), state in [`src/presenter/state-public.ts`](src/presenter/state-public.ts).
- Do not mix private and public concerns — public-facing additions go to the public app files and the `public-api/` lambdas.

## Cerebral Conventions

- **Actions**: `verbNounAction.ts(x)` in [`src/presenter/actions/`](src/presenter/actions/) (or feature subfolder); each pairs with `*.test.ts`.
- **Sequences**: `verbNounSequence.ts` in [`src/presenter/sequences/`](src/presenter/sequences/), composed of actions; registered in [`src/presenter/presenter.ts`](src/presenter/presenter.ts) / `presenter-public.ts`.
- **Computeds / derived state**: [`src/presenter/computeds/`](src/presenter/computeds/).
- **State shape**: do not introduce top-level state paths without declaring them in [`src/presenter/state.ts`](src/presenter/state.ts) (private) or [`src/presenter/state-public.ts`](src/presenter/state-public.ts) (public).
- **Business logic in React**: non-rendering logic should be contained in Cerebral Action and Sequence files rather than embedded in React components.
- **State debugging**: for "list/data disappears after a sequence runs" bugs, inspect the action chain in the `*Sequence.ts`, the state shape, any relevant computed, and the action that runs on modal close — these bugs are usually a missing re-fetch or a state path being cleared without being re-populated.
- Feature flags are pulled into client state at login by [`src/presenter/actions/getAllFeatureFlagsAction.ts`](src/presenter/actions/getAllFeatureFlagsAction.ts).

## Component Libraries

Two component libraries coexist:

- [`src/ustc-ui/`](src/ustc-ui/) — legacy.
- [`src/dawson-ui/`](src/dawson-ui/) — newer, still maturing.

Prefer either over hand-rolled markup; both are acceptable today.

## Styling

- Prefer **Tailwind utility classes** with the `tw:` prefix (e.g. `className="tw:flex tw:mt-4"`, see [`src/views/Login/Login.tsx`](src/views/Login/Login.tsx)) over USWDS classes when both are viable.
- Reserve USWDS classes for component patterns that depend on USWDS behavior/markup.

## Accessibility

- All UI must satisfy **Section 508** and **WCAG 2.1 AA**.
- Preserve semantic HTML, label associations, focus order, and keyboard operability.
- Verify by adding/extending a Cypress spec that calls `checkA11y` (see [`../cypress/`](../cypress/) AGENTS.md for details).
- Prefer existing accessible primitives in `ustc-ui/` and `dawson-ui/`.

## Test Infrastructure

- Mock `applicationContext` (client-side): [`src/test/createClientTestApplicationContext.ts`](src/test/createClientTestApplicationContext.ts).

## Testing

- **Unit tests**: `npm run test:client:unit` (with coverage). Single file: `npm run test:client:unit:file -- path/to/file.test.ts`.
- **Integration tests** (Cerebral): `npm run test:client:_integration`. Single file: `npm run test:client:integration:file -- path/to/file.test.ts`. Requires the local stack.
- 100% line + branch coverage is required for all added/modified code.
