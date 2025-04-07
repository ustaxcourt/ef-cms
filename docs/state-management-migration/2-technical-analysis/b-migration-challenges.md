# 2b. Migration Challenges

## Scope of Migration

In the worst case, migrating from Cerebral to a new state management library
and/or business workflow orchestration library would entail a complete rewrite
of:

- **972** action files
- **631** sequence files
- **377** React components are wrapped by the `connect` function

On top of this, we would also need to implement a familiar presenter
abstraction, including tasks like configuring the initial state and registering
replacements for sequences.

This is a massive undertaking. Any techniques that reduce code changes and allow
for a step-by-step migration would be hugely beneficial.

## Narrowing Scope of Migration

One way of narrowing the technical scope of this migration is creating a compatibility layer that connects the new state management solution(s) to existing sequences, actions, and components. This compatibility layer could:

- Expose an API similar to Cerebral's (e.g., `connect` wrapper function, `state`, `sequences`).
- Allow components, sequences, and actions to work with minimal changes.
- Enable incremental migration of features, minimizing disruption.

Another strategy that would narrow the technical scope of this migration is forking Cerebral and maintaining it internally. This approach:

- Lets us address the immediate need (React 19.x compatibility) without requiring a full migration.
- Preserves the conceptual framework of Cerebral.
- Provides full control over future updates.
- Minimizes the risk of introducing regressions by retaining the existing API and behavior.

However, this approach comes with significant trade-offs:

- Long-term maintenance responsibility for the forked version.
- Potential challenges in keeping the fork compatible with evolving libraries or ecosystem standards.
- Limits our ability to leverage modern libraries and best practices without extensive modification.

Both approaches offer ways to narrow the technical scope of migration, but they also present different trade-offs in terms of long-term sustainability and flexibility.
