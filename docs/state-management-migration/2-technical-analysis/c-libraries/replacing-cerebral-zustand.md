# Direct Migration to Zustand With Imperative Workflows

## Overview

The tool or tools that replace Cerebral will need to account both for both:

- Traditional state access patterns like getter, setter, and derived state calculations
- Workflow orchestration of some sort

This document contains an example design of how Zustand could be used to handle state access, while workflows are simply imperative functions with conditional logic.

## Example Implementation

Note: This document provides a stripped-down reference implementation to demonstrate core concepts. The code prioritizes clarity over production concerns like testing, error boundaries, etc.

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
    // In a practical application, the workflow logic in this
    // callback would be extracted into its own routine. The
    // event handler in this component could pass user input to
    // that routine. This would ensure that business processes
    // are modeled outside of the context of a React component.
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

## Pros and Cons of Approach

Pros:

- Simple mental model
- Relatively small learning curve
- Quick to implement for simple workflows

Cons:

- Loss of declarative workflow orchestration
- Manual error handling in workflows
- Potentially very difficult to implement for complex workflows
