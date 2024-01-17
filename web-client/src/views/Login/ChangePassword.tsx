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
    confirmPassword: state.form.confirmPassword,
    password: state.form.password,
    showConfirmPassword: state.showConfirmPassword,
    showPassword: state.showPassword,
    submitChangePasswordSequence: sequences.submitChangePasswordSequence,
    toggleShowPasswordSequence: sequences.toggleShowPasswordSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({
    changePasswordHelper,
    confirmPassword,
    password,
    showConfirmPassword,
    showPassword,
    submitChangePasswordSequence,
    toggleShowPasswordSequence,
    updateFormValueSequence,
  }) => {
    return (
      <>
        <section className="grid-container usa-section margin-top-4">
          <div className="grid-row flex-justify-center">
            <div className="grid-col-12 desktop:grid-col-4 tablet:grid-col-7">
              <SuccessNotification isDismissable={false} />
              <ErrorNotification />
              <div className="grid-container bg-white padding-y-3 border border-base-lighter">
                <div className="display-flex flex-column">
                  <div className="flex-align-self-center">
                    {/* TODO: Update this with UX? */}
                    <h1 className="margin-bottom-1">Reset Password</h1>
                    <form className="usa-form margin-top-4">
                      <label className="usa-label" htmlFor="password">
                        Password
                      </label>
                      <input
                        required
                        className="usa-input"
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        onChange={e => {
                          updateFormValueSequence({
                            key: 'password',
                            value: e.target.value,
                          });
                        }}
                      />
                      <button
                        aria-controls="password password-create-account-confirm"
                        className="usa-show-password"
                        data-hide-text="Hide password"
                        data-show-text="Show password"
                        title=""
                        type="button"
                        onClick={() =>
                          toggleShowPasswordSequence({
                            passwordType: 'showPassword',
                          })
                        }
                      >
                        {showPassword ? 'Hide Password' : 'Show password'}
                      </button>
                      <div className="margin-top-1" hidden={!password}>
                        <RequirementsText
                          fieldName="password"
                          text={
                            changePasswordHelper.passwordErrors?.hasOneLowercase
                              .message
                          }
                          valid={
                            changePasswordHelper.passwordErrors?.hasOneLowercase
                              .valid
                          }
                        ></RequirementsText>
                        <RequirementsText
                          fieldName="password"
                          text={
                            changePasswordHelper.passwordErrors?.hasOneUppercase
                              .message
                          }
                          valid={
                            changePasswordHelper.passwordErrors?.hasOneUppercase
                              .valid
                          }
                        ></RequirementsText>
                        <RequirementsText
                          fieldName="password"
                          text={
                            changePasswordHelper.passwordErrors?.hasOneNumber
                              .message
                          }
                          valid={
                            changePasswordHelper.passwordErrors?.hasOneNumber
                              .valid
                          }
                        ></RequirementsText>
                        <RequirementsText
                          fieldName="password"
                          text={
                            changePasswordHelper.passwordErrors?.isProperLength
                              .message
                          }
                          valid={
                            changePasswordHelper.passwordErrors?.isProperLength
                              .valid
                          }
                        ></RequirementsText>
                        <RequirementsText
                          fieldName="password"
                          text={
                            changePasswordHelper.passwordErrors
                              ?.hasSpecialCharacterOrSpace.message
                          }
                          valid={
                            changePasswordHelper.passwordErrors
                              ?.hasSpecialCharacterOrSpace.valid
                          }
                        ></RequirementsText>
                        <RequirementsText
                          fieldName="password"
                          text={
                            changePasswordHelper.passwordErrors
                              ?.hasNoLeadingOrTrailingSpace.message
                          }
                          valid={
                            changePasswordHelper.passwordErrors
                              ?.hasNoLeadingOrTrailingSpace.valid
                          }
                        ></RequirementsText>
                      </div>

                      <label className="usa-label" htmlFor="confirm-password">
                        Re-type Password
                      </label>
                      <input
                        required
                        className="usa-input"
                        id="confirm-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        onChange={e => {
                          updateFormValueSequence({
                            key: 'confirmPassword',
                            value: e.target.value,
                          });
                        }}
                      />
                      <button
                        aria-controls="password password-create-account-confirm"
                        className="usa-show-password"
                        data-hide-text="Hide password"
                        data-show-text="Show password"
                        title=""
                        type="button"
                        onClick={() =>
                          toggleShowPasswordSequence({
                            passwordType: 'showConfirmPassword',
                          })
                        }
                      >
                        {showConfirmPassword
                          ? 'Hide Password'
                          : 'Show password'}
                      </button>
                      <div
                        className="margin-top-1"
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
                        data-testid="login-button"
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
            </div>
          </div>
        </section>
      </>
    );
  },
);
