import { Button } from '../ustc-ui/Button/Button';
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
  ({ form, submitLoginSequence, updateFormValueSequence }) => {
    return (
      <section className="usa-section grid-container">
        <h1 tabIndex="-1">Log in</h1>
        <ErrorNotification />
        <form
          noValidate
          id="log-in"
          onSubmit={event => {
            event.preventDefault();
            submitLoginSequence();
          }}
        >
          <div className="blue-container margin-bottom-5">
            <div className="usa-form-group">
              <label className="usa-label" htmlFor="name">
                Name
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
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
          <Button id="log-in-button" type="submit">
            Log in
          </Button>
        </form>
      </section>
    );
  },
);
