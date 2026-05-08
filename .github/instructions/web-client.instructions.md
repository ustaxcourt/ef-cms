---
applyTo: "web-client/**"
---

# Web Client — Frontend Conventions

## Purpose

Rules for the React + Cerebral.js single-page application layer.
Two separate apps share entities/use-cases: private (`app.tsx`) and public (`appPublic.tsx`).

## Cerebral Patterns

- Actions: `verbNounAction.ts(x)` in `web-client/src/presenter/actions/`; each pairs with `*.test.ts`
- Sequences: `verbNounSequence.ts` in `web-client/src/presenter/sequences/`; registered in `presenter.ts` / `presenter-public.ts`
- Non-rendering logic belongs in Cerebral actions and sequences, not embedded in React components

## Cerebral State Discipline

- Private app state shape: `web-client/src/presenter/state.ts`
- Public app state shape: `web-client/src/presenter/state-public.ts`
- Do not introduce new top-level state paths without declaring them in the appropriate state file
- Sequences that clear a state path must include an action that re-populates it
  before the user sees an empty list

## Cerebral State Debugging

For "list/data disappears after a sequence runs" bugs, inspect:
1. The action chain in the relevant `*Sequence.ts`
2. The state shape in `state.ts`
3. Any relevant computed under `web-client/src/presenter/computeds/`
4. The action that runs on modal close (usually a missing re-fetch or cleared state path)

## Styling

- Prefer Tailwind utility classes with the `tw:` prefix (e.g. `className="tw:flex tw:mt-4"`)
- Reserve USWDS classes for component patterns that depend on USWDS behavior/markup
- Two component libraries coexist: `ustc-ui/` (legacy) and `dawson-ui/` (newer)
- Prefer either library over hand-rolled markup

## Public vs. Private Surface

- Public-facing additions go to `appPublic.tsx` / `applicationContextPublic.ts`
  and the `public-api/` lambdas
- Do not put browser-only code in `shared/`

## Accessibility

- All UI must satisfy Section 508 and WCAG 2.1 AA
- Preserve semantic HTML, label associations, focus order, and keyboard operability
- Prefer accessible primitives from `ustc-ui/` and `dawson-ui/`

## Routing

- Private route table: `web-client/src/router.ts`
- Public route table: `web-client/src/routerPublic.ts`
- Computeds / derived state: `web-client/src/presenter/computeds/`
