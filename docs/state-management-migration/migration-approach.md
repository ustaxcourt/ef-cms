# Migration Approach

## Scope

In the worst case, migrating from Cerebral to a new state management library
and/or business workflow orchestration library would entail a complete rewrite
of:

- 972 action files
- 631 sequence files
- 377 React components are wrapped by the `connect` function

On top of this, we would also need to implement a familiar presenter
abstraction, including tasks like configuring the initial state and registering
replacements for sequences.

This is a massive undertaking. Any techniques that reduce code changes and allow
for a step-by-step migration would be hugely beneficial.

## Narrowing Scope

One strategy is building a *compatibility wrapper layer* around the new state
management solution. This wrapper could:

- Expose an API similar to Cerebral's (e.g., `connect`, `state`, `sequences`).
- Allow components, sequences, and actions to work with minimal changes.
- Enable incremental migration of features, minimizing disruption.
