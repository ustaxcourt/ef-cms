import { Button as DawsonUiButton } from '@web-client/dawson-ui/ui/button';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { InfoNotificationComponent } from '@web-client/views/InfoNotification';
import { SuccessNotification } from '@web-client/views/SuccessNotification';
import { WarningNotification } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { AlertError } from '@web-client/dawson-ui/ui/Alert/AlertError';

export const Login = connect(
  {
    alertInfo: state.alertInfo,
    navigateToCreatePetitionerAccountSequence:
      sequences.navigateToCreatePetitionerAccountSequence,
    navigateToForgotPasswordSequence:
      sequences.navigateToForgotPasswordSequence,
    showPassword: state.showPassword,
    submitLoginSequence: sequences.submitLoginSequence,
    toggleShowPasswordSequence: sequences.toggleShowPasswordSequence,
    updateAuthenticationFormValueSequence:
      sequences.updateAuthenticationFormValueSequence,
    alertError: state.alertError,
    alertHelper: state.alertHelper,
    dismissAlertSequence: sequences.dismissAlertSequence,
  },
  ({
    alertInfo,
    navigateToCreatePetitionerAccountSequence,
    navigateToForgotPasswordSequence,
    showPassword,
    submitLoginSequence,
    toggleShowPasswordSequence,
    updateAuthenticationFormValueSequence,
    alertError,
    alertHelper,
    dismissAlertSequence,
  }) => {
    return (
      <>
        {/* <section className="grid-container usa-section"> */}
        <section className="grid-container tw:px-4 tw:pb-16 tw:pt-0">
          <div className="grid-row flex-justify-center">
            <div className="grid-col-12 desktop:grid-col-4 tablet:grid-col-7">
              <SuccessNotification isDismissible={false} />
              <WarningNotification isDismissible={false} />
              {alertInfo && (
                <InfoNotificationComponent
                  alertInfo={alertInfo}
                  dismissible={false}
                ></InfoNotificationComponent>
              )}

              <div className="tw:mb-4">
                <AlertError
                  alertError={alertError}
                  alertHelper={alertHelper}
                  closeButtonOnClick={() => dismissAlertSequence()}
                  isDismissible={false}
                />
              </div>

              {/* <div className="grid-container bg-white padding-y-3 border border-base-lighter login"> */}
              <div className="grid-container bg-white tw:py-6 border border-base-lighter login">
                <div className="display-flex flex-column">
                  <div className="flex-align-center">
                    <h1
                      // className="margin-bottom-1 inherit-body-font-family"
                      className="tw:mb-2 inherit-body-font-family"
                      data-testid="login-header"
                    >
                      Log in to DAWSON
                    </h1>
                    <form
                      // className="usa-form margin-top-4 max-width-unset login-form"
                      className="usa-form tw:mt-8 max-width-unset"
                      onSubmit={e => {
                        e.preventDefault();
                        submitLoginSequence();
                      }}
                    >
                      {/* <label className="usa-label" htmlFor="email"> */}
                      <label className="usa-label tw:mb-1.75" htmlFor="email">
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
                        // className="usa-label margin-top-2"
                        className="usa-label tw:mb-1.75 tw:mt-4"
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
                      <div className="tw:my-4">
                        <DawsonUiButton
                          aria-label="Login"
                          data-testid="login-button"
                          variant="primary"
                        >
                          Log in
                        </DawsonUiButton>
                      </div>
                    </form>
                    <div className="tw:my-4">
                      <DawsonUiButton
                        aria-label="Forgot password"
                        variant="primaryTertiary"
                        data-testid="forgot-password-button"
                        onClick={() => navigateToForgotPasswordSequence()}
                      >
                        Forgot password?
                      </DawsonUiButton>
                    </div>
                    Don&apos;t have an account?{' '}
                    <Button
                      link={true}
                      // className="tw:block padding-top-0 pl-0"
                      className="tw:block tw:pt-0 tw:pl-0"
                      type="button"
                      onClick={e => {
                        e.preventDefault();
                        navigateToCreatePetitionerAccountSequence();
                      }}
                      variant="primary"
                    >
                      Create your account now.
                    </Button>
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
