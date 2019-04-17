import { ErrorNotification } from './ErrorNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

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
          onSubmit={event => {
            event.preventDefault();
            submitLoginSequence();
          }}
        >
          <div className="blue-container">
            <div className="ustc-form-group">
              <label htmlFor="name">Name</label>
              <input
                autoCapitalize="none"
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <button id="log-in-button" className="usa-button" type="submit">
            Log in
          </button>
        </form>
      </section>
    );
  },
);
