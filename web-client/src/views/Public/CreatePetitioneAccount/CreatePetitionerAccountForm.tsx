import { connect } from '@cerebral/react';
import { sequences, state } from '@web-client/presenter/app-public.cerebral';

import React from 'react';

export const CreatePetitionerAccountForm = connect(
  {
    createAccountHelper: state.createAccountHelper,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({ updateFormValueSequence }) => {
    return (
      <div className="create-petitioner-form padding-x-205 margin-bottom-4 grid-col-12 desktop:grid-col-6">
        <h1 className="margin-bottom-1">Create Petitioner Account</h1>
        <form style={{ width: '90%' }}>
          <label className="usa-label" htmlFor="email">
            Email address
          </label>

          <input
            required
            autoCapitalize="off"
            autoCorrect="off"
            className="usa-input"
            id="name"
            name="name"
            type="text"
          />

          <label className="usa-label" htmlFor="password-create-account">
            Name
          </label>

          <input
            required
            autoCapitalize="off"
            autoCorrect="off"
            className="usa-input"
            id="email"
            name="email"
            type="email"
          />

          <label className="usa-label" htmlFor="password-create-account">
            Password
          </label>

          <input
            required
            className="usa-input"
            id="password-create-account"
            name="password"
            type="password"
            onChange={e => {
              updateFormValueSequence({
                key: 'password',
                value: e.target.value,
              });
            }}
          />

          <button
            aria-controls="password-create-account password-create-account-confirm"
            className="usa-show-password"
            data-hide-text="Hide password"
            data-show-text="Show password"
            title=""
            type="button"
          >
            Show password
          </button>
          <label
            className="usa-label"
            htmlFor="password-create-account-confirm"
          >
            Re-type Password
          </label>
          <input
            required
            className="usa-input"
            id="password-create-account-confirm"
            name="password-confirm"
            type="password"
          />
          <button
            aria-controls="password-create-account password-create-account-confirm"
            className="usa-show-password"
            data-hide-text="Hide password"
            data-show-text="Show password"
            title=""
            type="button"
          >
            Show password
          </button>

          <input
            className="usa-button margin-top-4"
            type="submit"
            value="Continue"
          />
        </form>
        <p>
          Already have an account?{' '}
          {/* TODO: FILL IN HREF WITH CORRECT LINK LATER ! */}
          <a className="usa-link" href="/">
            Sign in
          </a>
          .
        </p>
      </div>
    );
  },
);

CreatePetitionerAccountForm.displayName = 'CreatePetitionerAccountForm';
