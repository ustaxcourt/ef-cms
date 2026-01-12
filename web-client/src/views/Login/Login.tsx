import { Button } from '@web-client/dawson-ui/ui/button';
import { ButtonSmall } from '@web-client/dawson-ui/ui/buttonSmall';
import { InfoNotificationComponent } from '@web-client/views/InfoNotification';
import { SuccessNotification } from '@web-client/views/SuccessNotification';
import { WarningNotification } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { AlertError } from '@web-client/dawson-ui/ui/Alert/AlertError';
import { TextField } from '@web-client/dawson-ui/ui/input';

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
        <section className="grid-container tw:px-0 tw:pb-16 tw:pt-0">
          <div className="grid-row flex-justify-center">
            <div className="tw:w-full tw:xs:w-135">
              <SuccessNotification isDismissible={false} />
              <WarningNotification isDismissible={false} />
              {alertInfo && (
                <InfoNotificationComponent
                  alertInfo={alertInfo}
                  dismissible={false}
                />
              )}

              <div className="tw:mb-4">
                <AlertError
                  alertError={alertError}
                  alertHelper={alertHelper}
                  closeButtonOnClick={() => dismissAlertSequence()}
                  isDismissible={false}
                />
              </div>

              <div className="grid-container bg-white tw:xs:p-12 tw:px-3 tw:py-8 border border-base-lighter login tw:rounded-2xl tw:max-[33.75rem]:rounded-none">
                <div className="display-flex flex-column">
                  <div className="flex-align-center">
                    <h1
                      className="tw:xs:mb-8 tw:mb-8 tw:font-noto-serif tw:font-bold tw:xs:text-4xl tw:text-2xl"
                      data-testid="login-header"
                    >
                      Log in to DAWSON
                    </h1>
                    <form
                      className="usa-form max-width-unset"
                      onSubmit={e => {
                        e.preventDefault();
                        submitLoginSequence();
                      }}
                    >
                      <TextField
                        required
                        autoCapitalize="off"
                        autoCorrect="off"
                        className="usa-input tw:mb-4"
                        data-testid="email-input"
                        id="email"
                        name="email"
                        type="email"
                        label="Email address"
                        onChange={e => {
                          updateAuthenticationFormValueSequence({
                            email: e.target.value,
                          });
                        }}
                      />
                      <TextField
                        required
                        className="usa-input tw:mt-0"
                        data-testid="password-input"
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        onChange={e => {
                          updateAuthenticationFormValueSequence({
                            password: e.target.value,
                          });
                        }}
                      />
                      <div className="tw:mt-2 tw:flex tw:w-full">
                        <ButtonSmall
                          variant="primaryTertiary"
                          type="button"
                          data-hide-text="Hide password"
                          data-show-text="Show password"
                          className="tw:ml-auto tw:w-auto"
                          onClick={() =>
                            toggleShowPasswordSequence({
                              passwordType: 'showPassword',
                            })
                          }
                        >
                          {showPassword ? 'Hide password' : 'Show password'}
                        </ButtonSmall>
                      </div>
                      <div className="tw:mt-4 tw:xs:mb-4 tw:mb-3">
                        <Button
                          aria-label="Login"
                          data-testid="login-button"
                          variant="primary"
                        >
                          Log in
                        </Button>
                      </div>
                    </form>
                    <div className="tw:xs:mb-4 tw:mb-3 tw:flex tw:w-full">
                      <Button
                        aria-label="Forgot password"
                        variant="primaryTertiary"
                        data-testid="forgot-password-button"
                        className="tw:mr-auto tw:w-auto"
                        onClick={() => navigateToForgotPasswordSequence()}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <div className="'tw:text-base tw:xs:text-lg">
                      Don&apos;t have an account?{' '}
                    </div>
                    <div className="tw:flex tw:w-full">
                      <Button
                        className="tw:pt-0 tw:pl-0 tw:mr-auto tw:w-auto"
                        variant="primaryTertiary"
                        type="button"
                        onClick={e => {
                          e.preventDefault();
                          navigateToCreatePetitionerAccountSequence();
                        }}
                      >
                        Create your account now.
                      </Button>
                    </div>
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
