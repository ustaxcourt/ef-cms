import React from 'react';
import { state } from 'cerebral';

import { connect } from '@cerebral/react';

export default connect(
  {
    name: state.loginForm.name,
    submitLogIn: sequences.submitLogIn,
  },
  function LogIn({ name, submitLogIn }) {
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
            <input id="name" type="input" />
          </div>
          <input type="submit" value="Log in" />
        </form>
      </section>
    );
  },
);
