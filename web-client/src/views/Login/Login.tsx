import { Button } from '@web-client/ustc-ui/Button/Button';
import { ErrorNotification } from '@web-client/views/ErrorNotification';
import { SuccessNotification } from '@web-client/views/SuccessNotification';
import { WarningNotification } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const Login = connect(
  {
    navigateToCreatePetitionerAccountSequence:
      sequences.navigateToCreatePetitionerAccountSequence,
    navigateToForgotPasswordSequence:
      sequences.navigateToForgotPasswordSequence,
    showPassword: state.showPassword,
    submitLoginSequence: sequences.submitLoginSequence,
    toggleShowPasswordSequence: sequences.toggleShowPasswordSequence,
    updateAuthenticationFormValueSequence:
      sequences.updateAuthenticationFormValueSequence,
  },
  ({
    navigateToCreatePetitionerAccountSequence,
    navigateToForgotPasswordSequence,
    showPassword,
    submitLoginSequence,
    toggleShowPasswordSequence,
    updateAuthenticationFormValueSequence,
  }) => {
    return (
      <>
        <section className="grid-container usa-section">
          <div className="grid-row flex-justify-center">
            <div className="grid-col-12 desktop:grid-col-4 tablet:grid-col-7">
              <SuccessNotification isDismissible={false} />
              <WarningNotification isDismissible={false} />
              <ErrorNotification />
              <div className="grid-container bg-white padding-y-3 border border-base-lighter login">
                <div className="display-flex flex-column">
                  <div className="flex-align-self-center">
                    <h1
                      className="margin-bottom-1 inherit-body-font-family"
                      data-testid="login-header"
                    >
                      Log in to DAWSON
                    </h1>
                    <form
                      className="usa-form margin-top-4 max-width-unset login-form"
                      onSubmit={e => {
                        e.preventDefault();
                        submitLoginSequence();
                      }}
                    >
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
                      <label
                        className="usa-label margin-top-2"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <input
                        required
                        className="usa-input"
                        data-testid="password-input"
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        onChange={e => {
                          updateAuthenticationFormValueSequence({
                            password: e.target.value,
                          });
                        }}
                      />
                      <button
                        className="usa-show-password"
                        data-hide-text="Hide password"
                        data-show-text="Show password"
                        type="button"
                        onClick={() =>
                          toggleShowPasswordSequence({
                            passwordType: 'showPassword',
                          })
                        }
                      >
                        {showPassword ? 'Hide password' : 'Show password'}
                      </button>
                      <Button
                        className="usa-button margin-top-3"
                        data-testid="login-button"
                      >
                        Log in
                      </Button>
                    </form>
                    <Button
                      className="margin-top-1 display-block"
                      data-testid="forgot-password-button"
                      link={true}
                      type="button"
                      onClick={() => navigateToForgotPasswordSequence()}
                    >
                      Forgot password?
                    </Button>
                    <span>
                      Don&apos;t have an account?{' '}
                      <Button
                        className="margin-top-0"
                        link={true}
                        type="button"
                        onClick={e => {
                          e.preventDefault();
                          navigateToCreatePetitionerAccountSequence();
                        }}
                      >
                        Create your account now.
                      </Button>
                    </span>
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
