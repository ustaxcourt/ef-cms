import { Button } from '@web-client/ustc-ui/Button/Button';
import { ErrorNotification } from '@web-client/views/ErrorNotification';
import { SuccessNotification } from '@web-client/views/SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ForgotPassword = connect(
  {
    email: state.authentication.form.email,
    submitForgotPasswordSequence: sequences.submitForgotPasswordSequence,
    updateAuthenticationFormValueSequence:
      sequences.updateAuthenticationFormValueSequence,
  },
  ({
    email,
    submitForgotPasswordSequence,
    updateAuthenticationFormValueSequence,
  }) => {
    return (
      <>
        <section className="grid-container usa-section">
          <div className="grid-row flex-justify-center">
            <div className="grid-col-12 desktop:grid-col-4 tablet:grid-col-7">
              <SuccessNotification isDismissible={false} />
              <ErrorNotification />

              <div className="grid-container bg-white padding-y-3 border border-base-lighter">
                <div className="display-flex flex-column">
                  <div className="flex-align-self-center">
                    <h1 className="margin-bottom-1 margin-top-1 inherit-body-font-family">
                      Forgot Password?
                    </h1>
                    <span>
                      Enter your email address to receive an email to reset your
                      password.
                    </span>
                    <form className="usa-form margin-top-4 max-width-unset forgot-password-form">
                      <label className="usa-label" htmlFor="email">
                        Email address
                      </label>
                      <input
                        required
                        autoCapitalize="off"
                        autoCorrect="off"
                        className="usa-input"
                        data-testid="email-input"
                        id="email"
                        name="email"
                        type="email"
                        onChange={e => {
                          updateAuthenticationFormValueSequence({
                            email: e.target.value,
                          });
                        }}
                      />
                      <Button
                        className="usa-button margin-top-3"
                        data-testid="send-password-reset-button"
                        disabled={!email}
                        onClick={e => {
                          e.preventDefault();
                          submitForgotPasswordSequence();
                        }}
                      >
                        Send Password Reset
                      </Button>
                      <p>
                        If you no longer have access to the email address on
                        file, contact{' '}
                        <a href="mailto:dawson.support@ustaxcourt.gov">
                          dawson.support@ustaxcourt.gov
                        </a>
                        .
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  },
);
