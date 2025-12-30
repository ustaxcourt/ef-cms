import { Button as DawsonUiButton } from '@web-client/dawson-ui/ui/button';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { InfoNotificationComponent } from '@web-client/views/InfoNotification';
import { SuccessNotification } from '@web-client/views/SuccessNotification';
import { WarningNotification } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { AlertError } from '@web-client/dawson-ui/ui/Alert/AlertError';
import { TextField } from '@web-client/dawson-ui/ui/input';
import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';

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
    const LoginDiv = (
      <>
        <div className="grid-row flex-justify-center">
          <div className="tw:w-md">
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

            <div className="grid-container bg-white tw:py-6 border border-base-lighter login">
              <div className="display-flex flex-column">
                <div className="flex-align-center">
                  <h1
                    className="tw:mb-2 inherit-body-font-family"
                    data-testid="login-header"
                  >
                    Log in to DAWSON
                  </h1>
                  <form
                    className="usa-form tw:mt-8 max-width-unset"
                    onSubmit={e => {
                      e.preventDefault();
                      submitLoginSequence();
                    }}
                  >
                    <label className="usa-label tw:mb-1.75" htmlFor="email">
                      Email address
                    </label>
                    <TextField
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
                      className="usa-label tw:mb-1.75 tw:mt-4"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <TextField
                      required
                      className="usa-input tw:mt-0"
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
                    <div className="tw:mt-6 tw:mb-4">
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
      </>
    );
    return (
      <>
        <NonMobile>
          <section className="grid-container tw:px-4 tw:pb-16 tw:pt-0">
            {LoginDiv}
          </section>
        </NonMobile>
        <Mobile>
          <section className="grid-container tw:px-0 tw:pb-16 tw:pt-0">
            {LoginDiv}
          </section>
        </Mobile>
      </>
    );
  },
);
