import { connect } from '@cerebral/react';
import { getView } from './viewFactory';
import { sequences, state } from 'cerebral';
import React from 'react';

const ErrorNotification = getView('ErrorNotification');
const Button = getView('Button');

export const LogIn = connect(
  {
    form: state.form,
    submitLocalLoginSequence: sequences.submitLocalLoginSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function LogIn({ form, submitLocalLoginSequence, updateFormValueSequence }) {
    return (
      <section className="usa-section grid-container">
        <h1 tabIndex="-1">Log in</h1>
        <ErrorNotification />
        <form
          noValidate
          id="log-in"
          onSubmit={event => {
            event.preventDefault();
            submitLocalLoginSequence();
          }}
        >
          <div className="blue-container margin-bottom-5">
            <div className="usa-form-group margin-bottom-0">
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
