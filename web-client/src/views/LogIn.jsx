import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import { ErrorNotification } from './ErrorNotification';

export const LogIn = connect(
  {
    form: state.form,
    submitLoginSequence: sequences.submitLoginSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({ form, updateFormValueSequence, submitLoginSequence }) => {
    return (
      <section className="usa-section usa-grid">
        <h1 tabIndex="-1">Log in</h1>
        <ErrorNotification />
        <form
          id="log-in"
          noValidate
          onSubmit={() => {
            submitLoginSequence();
          }}
        >
          <div className="usa-form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              autoCapitalize="none"
              value={form.name}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </div>
          <button id="log-in-button" className="usa-button" type="submit">
            Log in
          </button>
        </form>
      </section>
    );
  },
);
