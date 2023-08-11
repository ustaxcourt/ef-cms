import { connect } from '@cerebral/react';
import { getView } from './viewFactory';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const ErrorNotification = getView('ErrorNotification');
const Button = getView('Button');

export const LogIn = connect(
  {
    form: state.form,
    loginWithCodeSequence: sequences.loginWithCodeSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function LogIn({ form, loginWithCodeSequence, updateFormValueSequence }) {
    return (
      <section className="usa-section grid-container">
        <h1 tabIndex="-1">Log in</h1>
        <ErrorNotification />
        <form
          noValidate
          id="log-in"
          onSubmit={event => {
            event.preventDefault();
            loginWithCodeSequence({
              code: form.email,
            });
          }}
        >
          <div className="blue-container margin-bottom-5">
            <div className="usa-form-group margin-bottom-0">
              <label className="usa-label" htmlFor="email">
                Email
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="email"
                name="email"
                type="email"
                value={form.email}
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

LogIn.displayName = 'LogIn';
