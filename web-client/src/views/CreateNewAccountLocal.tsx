import { connect } from '@web-client/presenter/shared.cerebral';
import { getView } from './viewFactory';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const ErrorNotification = getView('ErrorNotification');
const Button = getView('Button');

export const CreateNewAccountLocal = connect(
  {
    createNewAccountLocalSequence: sequences.createNewAccountLocalSequence,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function CreateNewAccountLocal({
    createNewAccountLocalSequence,
    form,
    updateFormValueSequence,
  }) {
    return (
      <section className="usa-section grid-container">
        <h1 tabIndex={-1}>Create New Account</h1>
        <ErrorNotification />
        <form
          noValidate
          id="log-in"
          onSubmit={event => {
            event.preventDefault();
            createNewAccountLocalSequence();
          }}
        >
          <div className="blue-container margin-bottom-5">
            <div className="usa-form-group margin-bottom-0">
              <label className="usa-label" htmlFor="email">
                Email
              </label>
              <input
                autoCapitalize="none"
                className="usa-input margin-bottom-2"
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
              <label className="usa-label" htmlFor="email">
                Name
              </label>
              <input
                autoCapitalize="none"
                className="usa-input margin-bottom-2"
                id="name"
                name="name"
                value={form.name}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
              <label className="usa-label" htmlFor="email">
                Password
              </label>
              <input
                autoCapitalize="none"
                className="usa-input margin-bottom-2"
                id="password"
                name="password"
                type="password"
                value={form.password}
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
            Create account
          </Button>
        </form>
      </section>
    );
  },
);

CreateNewAccountLocal.displayName = 'CreateNewAccountLocal';
