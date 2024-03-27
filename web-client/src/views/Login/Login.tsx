import { Button } from '@web-client/ustc-ui/Button/Button';
import { ErrorNotification } from '@web-client/views/ErrorNotification';
import { SuccessNotification } from '@web-client/views/SuccessNotification';
import { WarningNotification } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const Login = connect(
  {
    loginHelper: state.loginHelper,
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
    loginHelper,
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
                  <div
                    className="flex-align-self-center"
                    style={{ background: '#ffffff' }}
                  >
                    <h3 style={{ color: '#ecebeb' }}>Log in to DAWSON</h3>
                    <h1
                      className="margin-bottom-1 inherit-body-font-family"
                      data-testid="login-header"
                    ></h1>

                    <span>Email address and password are case sensitive.</span>
                    <form className="usa-form margin-top-4 max-width-unset login-form">
                      <label className="usa-label">Email address</label>
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
                        disabled={loginHelper.disableLoginButton}
                        onClick={e => {
                          e.preventDefault();
                          submitLoginSequence();
                        }}
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
                    <span style={{ color: 'white' }}>
                      Don&apos;t have an account?{' '}
                      <Button
                        className="padding-top-0"
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
