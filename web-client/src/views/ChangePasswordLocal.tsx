import { connect } from '@web-client/presenter/shared.cerebral';
import { getView } from './viewFactory';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const ErrorNotification = getView('ErrorNotification');
const Button = getView('Button');

export const ChangePasswordLocal = connect(
  {
    changePasswordLocalSequence: sequences.changePasswordLocalSequence,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    userEmail: state.login.userEmail,
  },
  function CreateNewAccountLocal({
    changePasswordLocalSequence,
    form,
    updateFormValueSequence,
    userEmail,
  }) {
    return (
      <section className="usa-section grid-container">
        <h1 tabIndex={-1}>New Password Required</h1>
        <ErrorNotification />
        <form
          noValidate
          id="change-password"
          onSubmit={event => {
            event.preventDefault();
            changePasswordLocalSequence();
          }}
        >
          <div className="blue-container margin-bottom-5">
            <div className="usa-form-group margin-bottom-0">
              <label className="usa-label" htmlFor="email">
                Email
              </label>
              <input
                disabled
                autoCapitalize="none"
                className="usa-input margin-bottom-2"
                id="email"
                name="email"
                type="email"
                value={userEmail}
              />
              <label className="usa-label" htmlFor="email">
                New Password
              </label>
              <input
                autoCapitalize="none"
                className="usa-input margin-bottom-2"
                id="newPassword"
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <Button id="update-password-button" type="submit">
            Update Password
          </Button>
        </form>
      </section>
    );
  },
);

ChangePasswordLocal.displayName = 'ChangePasswordLocal';
