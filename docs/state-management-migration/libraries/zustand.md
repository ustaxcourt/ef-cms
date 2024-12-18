# Zustand

## 1. Ease of Isolation

Q: Is the library easy to use in isolation from both React components and
business logic?

A: Sort of. Although it does not require wrapping components in providers or
using custom hooks, the `create` function that creates a Zustand store does
rely on the native `useState` hook.

## 2. Conceptual Simplicity

Q: Does the library introduce as few novel abstractions as possible?

A: Yes. Its API is tiny: you create a store using the `create` function, and
then you call `getState` and `setState` on that store.

## 3. Boilerplate Volume

Q: Does the library require a great deal of boilerplate code?

A: No.

## Sketch: A Very Dumb Component

```tsx
// ContactForm.tsx
import React from 'react';
import { useContactFormStore } from './contactFormStore';
import { handleContactFormChange, handleContactFormSubmit } from './contactFormEventHandlers';

export const ContactForm = () => {
  const { email, emailError, isEmailChecking } = useContactFormStore();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await handleContactFormSubmit();
      }}
    >
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={async (e) => {
            await handleContactFormChange(e.target.value);
          }}
          disabled={isEmailChecking}
        />
        {isEmailChecking && <p>Checking email...</p>}
        {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
```

```
web-client/
└── src/
    ├── business/
    |   └── validateContactForm.ts
    ├── features/
    │   └── ContactForm/
    │       ├── ContactForm.tsx
    |       ├── contactFormEventHandlers.ts
    |       └── contactFormStore.ts
    ├── services/
    |   └── emailVerificationService.ts
    ├── app.tsx
    ├── index.html
    └── index.ts
```
