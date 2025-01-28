# 2a. Overview of Current Architecture

## Goals

The DAWSON engineering team needs to migrate from the no-longer-maintained Cerebral state management library to some better-maintained library. This is a tricky endeavor for a number of reasons, some of which are orthogonal (i.e., they represent distinct challenges that don't necessarily intersect).

This document will:

1. Describe the circumstances that require a migration away from Cerebral.
2. Describe the challenges of migrating away from Cerebral.
3. Describe the current design of the application's frontend state management solution.
4. Analyze the characteristics of the current design.

## Technical Scope

This document focuses on state management within our single-page application (SPA) running in the browser. Server-side considerations and other system components are out of scope.

## Circumstances Requiring Migration

Several factors require moving away from Cerebral:

1. Cerebral is no longer actively maintained.
2. React 19.x, the latest major version as of December, 2024, is not supported.
3. Cerebral has poor TypeScript support.

## Challenges of Migrating from Cerebral

There are a number of significant challenges the team will need to overcome in order to migrate off Cerebral.

1. Any React component that interacts with state in the application is wrapped in a call to the Cerebral `connect` function. This tightly couples presentational concerns with Cerebral.
2. Workflows triggered by event handlers in components that work with Cerebral state are modeled using Cerebral sequences and actions. This tightly couples business processes to Cerebral.

**Note**: Throughout this document, the unquoted terms "sequence" and "action" refer specifically to _Cerebral sequences_ and _Cerebral actions_. These are fundamental abstractions provided by Cerebral.

## Current Design

This section describes the current architectural principles for state management in DAWSON:

- All state lives in a single state tree: there is as little component-specific state as possible
- React components are strictly presentational where possible: "fancy HTML"
- Event handlers delegate to sequences for all business logic
- These sequences comprise granular actions that can be:
    - Chained together
    - Pass data along as they execute
    - Branch based on results of prior actions

### Example Implementation

Here is a simple form that demonstrates how Cerebral is used in DAWSON:

```tsx
// NameForm.tsx
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const NameForm = connect( // #1
  {
    form: state.form,
    nameFormHelper: state.nameFormHelper,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateNameFormSequence: sequences.validateNameFormSequence,
    validationErrors: state.validationErrors,

  },
  function NameForm({
    form,
    nameFormHelper,
    updateFormValueSequence,
    validateNameFormSequence,
    validationErrors,
  }) {
    return (
      <>
        {/* #2 */}
        <span>Your current name: {nameFormHelper.formattedName}</span>
        <form
          onSubmit={e => {
            // #3
            e.preventDefault();
            validateNameFormSequence();
          }}
        >
          <input
            type="text"
            name="name"
            {/* #4 */}
            value={form.name || ''}
            onChange={e => {
              // #5
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
          {/* #6 */}
          {validationErrors.name && (
            <span className="error">{validationErrors.name}</span>
          )}
          <button type="submit">Submit</button>
        </form>
      </>
    );
  }
);
```

1. `connect` is a higher-order function that wraps and returns the component itself, which is passed as the second argument to `connect` along with a configuration object pulling in Cerebral functionality that the form needs.
2. `state.nameFormHelper` is a computed that exposes derived state values. Computeds automatically re-evaluate when their dependent state values change.
3. In the `onSubmit` event handler, sequences called on form submission.
4. DAWSON tends to use a universal `form` property on state that is dynamically reset and populated as new forms render in the UI.
5. `updateFormValueSequence` updates the `form` property on state. This sequence is reusable across components.
6. This common pattern conditionally renders a specific validation error if it exists in state.

Below is an example of what `validateNameFormSequence` might look like:

```tsx
// validateNameFormSequence.ts
import {clearAlertsAction } from '../actions/clearAlertsAction';
// ... import remaining actions

export const validateNameFormSequence = showProgressSequenceDecorator([
    clearAlertsAction,
    validateNameFormAction,
    {
        error: [setValidationErrorAction],
        success: [
            submitNameFormAction,
            navigateToPathAction,
        ],
    },
]) as unknown as () => void;
```

Note the conditional logic after the action that validates the form.

In these action functions, we set state like this:

`get(state.someProperty)`

And set state like this:

`store.set(state.someProperty, 'someValue');`

### Characteristics of Current Design

DAWSON uses Cerebral to:

1. Get and set state on a single state tree
2. Get derived and computed values based on the current state tree
3. Declaratively define workflows that are triggered by event handlers

These are the primary technical use cases we need to account for when considering how to replace Cerebral.

### Ramifications of Current Design

Each way that Cerebral satisfies the characteristics above comes with distinct advantages and limitations that inform the selection of replacement tools.

#### 1. Get and set state on a single state tree
**Pros**:
- Predictable state updates through a single source of truth
- Simple state debugging since all data flows through one tree
- Simple mental model

**Cons**:
- Complex state shape becomes difficult to maintain as application grows
- State data relevant only to a specific component could be deeply nested
in the global state tree
- TypeScript types become unwieldy for deeply nested state

#### 2. Get derived and computed values based on the current state tree
**Pros**:
- Automatic recalculation of derived values when dependent state changes
- Business logic stays isolated from components
- Computed values can be reused across components

**Cons**:
- Computed values can create hidden dependencies
- Performance overhead from unnecessary recalculations

#### 3. Orchestrate workflows triggered by event handlers
**Pros**:
- Clear separation between UI components and business logic
- Reusable sequences can be composed from smaller actions
- Declarative branching based on action results

**Cons**:
- Tight coupling to Cerebral's sequence/action model
- Complex workflows become difficult to debug
- Testing requires mocking Cerebral's infrastructure

## Initial Conclusions

The tool or tools that replace Cerebral will need to account for both:

- Traditional state access patterns like getter, setter, and derived state calculations
- Workflow orchestration of some sort
