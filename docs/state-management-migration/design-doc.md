# Migrating From Cerebral

## Project Description

The DAWSON engineering team needs to migrate from the no-longer-maintained Cerebral state management library to some better-maintained library. This is a tricky endeavor for a number of reasons, some of which are orthogonal (that is, they represent distinct challenges that don't necessarily intersect).

This document will:

1. Describe the circumstances that require a migration away from Cerebral
2. Describe the current design of the application
3. Discuss each problem area first in isolation, then in context
4. Put forth some ideas for successful migration
5. Share detailed implementation approaches for feedback

## Circumstances Requiring Migration

Several factors require moving away from Cerebral:

1. Cerebral is no longer actively maintained
2. React 19.x, the latest major version as of December, 2024, is not supported
3. Cerebral has poor TypeScript support

## Technical Scope

This document focuses on state management within our single-page application (SPA) running in the browser. Server-side considerations and other system components are out of scope.

## Current Design

The driving architectural principles for state management in this application are:

- All state lives in a single state tree: there is no component-specific state
- React components are strictly presentational where possible: "fancy HTML"
- Event handlers delegate to Cerebral "sequences" for all business logic
- These "sequences" comprise more granular "actions" that can be:
    - Chained together
    - Pass data along as they execute
    - Branch based on results of prior actions

**Note**: Throughout this document, the unquoted terms "sequence" and "action" refer specifically to _Cerebral sequences_ and _Cerebral actions_. These are fundamental abstractions provided by Cerebral.

### Example Implementation

Let's look at a simple form that demonstrates how Cerebral is used in DAWSON:

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

### Characteristics of Current Implementation

DAWSON uses Cerebral to:

1. Get and set state on a single state tree
2. Get derived and computed values based on the current state tree
3. Orchestrate workflows triggered by event handlers

These are the primary technical use cases we need to account for when considering how to replace Cerebral.

## Paths Forward

Two possible approaches for migrating away from Cerebral are:

1. Direct migration to Zustand
2. Workflow management using XState, in conjunction with Zustand

Let's examine each approach.

## 1. Direct Migration to Zustand With Bespoke Workflows

### Example Implementation

```typescript
// nameFormStore.ts
import { create } from "zustand";

type FormState = {
  name: string;
  setName: (name: string) => void;
  resetForm: () => void;
};

export const useNameFormStore = create<FormState>((set) => ({
  name: "",
  setName: (name) => set({ name }),
  resetForm: () => set({ name: "" }),
}));
```

```typescript
// NameForm.tsx
import React from 'react';
import { useNameFormStore } from './nameFormStore';

export const NameForm: React.FC = () => {
  const { name, setName, resetForm } = useNameFormStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      alert(`Name submitted: ${name}`);
      resetForm();
    } else {
      alert('Please enter a name.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```

### Pros and Cons of Direct Migration

Pros:

- Simple mental model
- Minimal learning curve
- Quick to implement
- Good TypeScript support
- Active maintenance

Cons:

- Loss of workflow orchestration
- More component-level logic
- Manual error handling
- Less predictable state updates
- Harder to test complex flows

## 2. Workflow Abstraction Using State Machines

### Why Consider This Approach?

Managing workflows with state machines offers several advantages that align well with our migration needs:

1. **Declarative Workflows**: Similar to Cerebral's sequences, workflows can be defined declaratively
3. **Type Safety**: First-class TypeScript support
4. **Testing**: Workflows can be tested in isolation
5. **Active Maintenance**: Well-maintained libraries available (e.g., XState)

### Implementation Example

```typescript
// useFormStore.ts
import { create } from 'zustand'

type FormState = {
  name: string
  setName: (name: string) => void
  reset: () => void
}

const initialState = { name: '' }

export const useFormStore = create<FormState>((set) => ({
  ...initialState,
  setName: (name) => set({ name }),
  reset: () => set(initialState),
}))

// createFormMachine.ts
import { createMachine } from 'xstate'

export const createFormMachine = createMachine({
  id: 'form',
  initial: 'idle',
  states: {
    idle: {
      on: { SUBMIT: 'submitting' },
    },
    submitting: {
      invoke: {
        src: 'submitForm',
        onDone: 'success',
        onError: 'idle',
      },
    },
    success: {
      // Automatically transitions to 'idle' after 1 second
      after: { 1000: 'idle' },
    },
  },
})

// useNameForm.ts
import { useMachine } from '@xstate/react'
import { useFormStore } from './useFormStore'
import { createFormMachine } from './createFormMachine'

export const useNameForm = () => {
  const { name, setName, reset } = useFormStore()

  const [state, send] = useMachine(createFormMachine, {
    services: {
      submitForm: async () => {
        // Simulate async work--in practice, this should be isolated in
        // a separate service function that isolates network calls,
        // etc.
        await new Promise((resolve) => setTimeout(resolve, 500))
      },
    },
  })

  const handleChange = (value: string) => setName(value)
  const handleSubmit = () => send('SUBMIT')

  return {
    name,
    isSubmitting: state.matches('submitting'),
    isSuccess: state.matches('success'),
    handleChange,
    handleSubmit,
  }
}

// NameForm.tsx
import React from 'react'
import { useNameForm } from './useNameForm'

export const NameForm: React.FC = () => {
  const { name, isSubmitting, isSuccess, handleChange, handleSubmit } = useNameForm();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <input
        type="text"
        value={name}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isSubmitting}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      {isSuccess && <div>Form submitted successfully!</div>}
    </form>
  )
}
```

### Pros and Cons of Using XState

Pros:

- **Declarative Workflows**: Intuitive and familiar, similar to Cerebral's sequences.
- **Type Safety**: First-class support for TypeScript ensures robust typing.
- **Testing**: Isolated workflows simplify unit and integration testing.
- **Visualization**: Built-in tools enhance debugging and understanding of state transitions.
- **Active Maintenance**: Well-maintained libraries with strong community support and documentation.

Cons:

- **Learning Curve**: Requires understanding state machine concepts and XState-specific APIs.
- **Overhead**: May be overkill for simpler workflows or smaller projects.
- **Complexity**: Additional abstraction could make debugging harder if not well-documented.

## Migration Strategy

Given the complexity of migrating from Cerebral to a new state management solution, the strategy should prioritize incremental changes to minimize disruption and ensure business continuity. Below are the proposed steps for the migration:

### 1. **Preparation Phase**

- **Audit the Codebase**: Identify all components and modules dependent on Cerebral, focusing on sequences, state access patterns, and computed values.
- **Choose a Replacement**: Decide on the primary replacement for Cerebral based on team input and project requirements. (E.g., Zustand + XState or Zustand alone.)
- **Setup New Tools**: Integrate the chosen libraries (e.g., Zustand, XState) into the project and configure basic scaffolding, such as a global state store and example workflows.

### 2. **Prototyping and Validation**

- **Prototype Key Features**: Re-implement a few critical workflows and components using the new state management solution to validate feasibility and ergonomics.
- **Gather Feedback**: Solicit team feedback to identify pain points and refine the approach before committing to a broader rollout.

### 3. **Incremental Migration**

- **Module-Level Replacement**: Migrate modules one at a time, starting with low-risk or isolated features. Replace Cerebral sequences with equivalent workflows in XState (or simple Zustand actions where appropriate).
- **Maintain Backward Compatibility**: Create adapters or shims, if necessary, to allow Cerebral and the new state management library to coexist temporarily.
- **Monitor Performance and Bugs**: Carefully observe the impact on performance and track bugs during the migration.

### 4. **Full Migration**

- **Deprecate Cerebral**: Gradually remove all dependencies on Cerebral, ensuring that all components and workflows are fully migrated.
- **Comprehensive Testing**: Perform extensive unit, integration, and end-to-end testing to validate the migrated system.
- **Documentation Update**: Update internal documentation to reflect the new state management approach, including usage patterns and best practices.

### 5. **Post-Migration Cleanup**

- **Remove Legacy Code**: Eliminate all remaining Cerebral-specific code and configurations.
- **Optimize**: Refactor and optimize the newly migrated code to fully leverage the benefits of the chosen state management tools.
- **Retrospective**: Conduct a retrospective to document lessons learned and areas for improvement in similar migrations.