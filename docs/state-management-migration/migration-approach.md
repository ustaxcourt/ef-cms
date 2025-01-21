# Migration Approach

## Scope

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

## Narrowing Scope

One strategy is building a *adapter* that connects the new state management
solution to existing sequences, actions, and components. This adapter could:

- Expose an API similar to Cerebral's (e.g., `connect`, `state`, `sequences`).
- Allow components, sequences, and actions to work with minimal changes.
- Enable incremental migration of features, minimizing disruption.

## Tradeoffs

**Architectural Complexity**

- Con: Creates additional layers of abstraction to maintain
- Pro: Localizes complexity to well-defined boundaries instead of scattering it across more than a thousand files

**Migration Risk & Effort**

- Con: Risk of recreating too much Cerebral-like functionality
- Pro: Allows for incremental migration with minimal changes to existing code
- Pro: Makes it easier to test and validate changes in isolation

**Debugging & Maintenance**

- Con: Stack traces and error handling must traverse multiple layers
- Pro: Each layer has clear responsibility, so root cause analysis is somewhat more more straightforward

**Performance**

- Con: Some overhead from adapter layer
- Pro: Modern JS engines optimize well for this type of abstraction
- Pro: Performance bottlenecks are isolated and can be optimized if needed

**Future Flexibility**

- Con: Future workflow changes must maintain compatibility with existing sequence definitions
- Pro: Can swap underlying implementations (state management, workflow engine) without touching business logic
- Pro: Enables gradual adoption of new patterns for specific workflows
