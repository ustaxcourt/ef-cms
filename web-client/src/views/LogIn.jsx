import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import ErrorNotification from './ErrorNotification';

export default connect(
  {
    form: state.form,
    submitLogInSequence: sequences.submitLogInSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function LogIn({ form, updateFormValueSequence, submitLogInSequence }) {
    return (
      <section className="usa-section usa-grid">
        <h1 tabIndex="-1">Log in</h1>
        <ErrorNotification />
        <form
          id="log-in"
          noValidate
          onSubmit={e => {
            e.preventDefault();
            submitLogInSequence();
          }}
        >
          <div className="usa-form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              autoCapitalize="off"
              value={form.name}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </div>
          <input type="submit" value="Log in" />
        </form>
      </section>
    );
  },
);
