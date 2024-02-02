import { Button } from '@web-client/ustc-ui/Button/Button';
import { ErrorNotification } from '@web-client/views/ErrorNotification';
import { RequirementsText } from '@web-client/views/CreatePetitionerAccount/RequirementsText';
import { SuccessNotification } from '@web-client/views/SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ChangePassword = connect(
  {
    changePasswordHelper: state.changePasswordHelper,
    confirmPassword: state.authentication.form.confirmPassword,
    password: state.authentication.form.password,
    showConfirmPassword: state.showConfirmPassword,
    showPassword: state.showPassword,
    submitChangePasswordSequence: sequences.submitChangePasswordSequence,
    toggleShowPasswordSequence: sequences.toggleShowPasswordSequence,
    updateAuthenticationFormValueSequence:
      sequences.updateAuthenticationFormValueSequence,
  },
  ({
    changePasswordHelper,
    confirmPassword,
    password,
    showConfirmPassword,
    showPassword,
    submitChangePasswordSequence,
    toggleShowPasswordSequence,
    updateAuthenticationFormValueSequence,
  }) => {
    return (
      <>
        <section className="grid-container usa-section margin-top-4">
          <div className="grid-row flex-justify-center">
            <div className="grid-col-12 desktop:grid-col-4 tablet:grid-col-7">
              <SuccessNotification isDismissible={false} />
              <ErrorNotification />

              <div className="grid-container bg-white padding-y-3 border border-base-lighter">
                <h1 className="margin-bottom-1 inherit-body-font-family">
                  Reset Password
                </h1>

                <span>Enter a new password.</span>

                <form className="usa-form margin-top-4 change-password-form max-width-unset">
                  <label className="usa-label" htmlFor="password">
                    New Password
                  </label>
                  <input
                    required
                    className="usa-input"
                    data-testid="new-password-input"
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
                    aria-controls="password"
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
                    {showPassword ? 'Hide Password' : 'Show password'}
                  </button>
                  <div
                    className="margin-top-205"
                    data-testid="password-validation-errors"
                    hidden={!password}
                  >
                    {changePasswordHelper.passwordErrors.map(error => {
                      return (
                        <RequirementsText
                          fieldName="password"
                          key={error.message}
                          text={error.message}
                          valid={error.valid}
                        ></RequirementsText>
                      );
                    })}
                  </div>

                  <div className="margin-top-3">
                    <label className="usa-label" htmlFor="confirm-password">
                      Re-type New Password
                    </label>
                    <input
                      required
                      className="usa-input"
                      data-testid="confirm-new-password-input"
                      id="confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      onChange={e => {
                        updateAuthenticationFormValueSequence({
                          confirmPassword: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <button
                    aria-controls="password password-create-account-confirm"
                    className="usa-show-password"
                    data-hide-text="Hide password"
                    data-show-text="Show password"
                    type="button"
                    onClick={() =>
                      toggleShowPasswordSequence({
                        passwordType: 'showConfirmPassword',
                      })
                    }
                  >
                    {showConfirmPassword ? 'Hide Password' : 'Show password'}
                  </button>
                  <div
                    className="margin-top-205"
                    style={{
                      visibility: confirmPassword ? 'visible' : 'hidden',
                    }}
                  >
                    <RequirementsText
                      fieldName="confirm password"
                      text="Passwords must match"
                      valid={changePasswordHelper.confirmPassword}
                    ></RequirementsText>
                  </div>
                  <Button
                    className="usa-button margin-top-3"
                    data-testid="change-password-button"
                    disabled={!changePasswordHelper.formIsValid}
                    onClick={e => {
                      e.preventDefault();
                      submitChangePasswordSequence();
                    }}
                  >
                    Change Password
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  },
);
