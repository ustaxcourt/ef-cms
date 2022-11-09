# 7. Fork Cerebral to maintain it as preferred React State Management Solution

Date: 2022-10-06

## Status

Accepted

## Context

During early development, the project decided to use Cerebral to manage state and perform business logic through its sequences of actions within the client application. It has enabled the team to separate business logic from the display of state.

Cerebral's "sequences" and "actions" provide a declarative approach that helps developers make sense of the business logic quickly while isolating functionality into individual actions. This atomizes the presentation logic in order to be easier to test via unit tests.

It is no longer being maintained, and in order to ensure that it continues to be compatible with future versions of React, it will need to be maintained by someone or the project will need to abandon it.

Meanwhile, the project is continuing to undergo heavy feature development at this time, and a large refactor is not desirable.

Alternative approaches using react-query to fetch data may offer much-needed features like caching and invalidating to improve performance.

## Decision

- Fork Cerebral into Flexion repo
- Make a devex task to make an experiment refactoring one page to not use cerebral.

## Consequences

### Maintaining it

- Long term repercussions of having to maintain a dependency.
- Are other Flexion projects relying on this? *No.*
- Security updates for dependencies. There aren't many dependencies, and they have been stable for many years now. We will need to consider this for project dependency updates.
- Are there any "oh crap" moments where we're going to have to get off of it suddenly?

### Abandoning it

- Huge undertaking with refactoring code to new solution; it's entangled within everything on the client side
- Heavy lift to move to Overmind, and we would be in the exact same place because there has been an open React18 issue on that project for many months now.
