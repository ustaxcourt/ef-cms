import React from 'react';
import { sequences, state } from 'cerebral';

import { connect } from '@cerebral/react';

export default connect(
  {
    form: state.form,
    updateFormValue: sequences.updateFormValue,
    submitLogIn: sequences.submitLogIn,
  },
  function LogIn({ form, updateFormValue, submitLogIn }) {
    return (
      <section className="usa-section usa-grid">
        <h1>Log in</h1>
        <form
          id="log-in"
          noValidate
          onSubmit={e => {
            e.preventDefault();
            submitLogIn();
          }}
        >
          <div className="usa-form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="input"
              name="name"
              value={form.name}
              onChange={e => {
                updateFormValue({
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
