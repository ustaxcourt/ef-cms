import { Button } from '@web-client/ustc-ui/Button/Button';
import { RequirementsText } from '@web-client/views/CreatePetitionerAccount/RequirementsText';
import { connect } from '@web-client/presenter/shared.cerebral';
import { debounce } from 'lodash';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useState } from 'react';

const DEBOUNCE_TIME_MS = 500;

export const CreatePetitionerAccountForm = connect(
  {
    alertError: state.alertError,
    alertWarning: state.alertWarning,
    confirmPassword: state.form.confirmPassword,
    createAccountHelper: state.createAccountHelper,
    navigateToLoginSequence: sequences.navigateToLoginSequence,
    password: state.form.password,
    showConfirmPassword: state.showConfirmPassword,
    showPassword: state.showPassword,
    submitCreatePetitionerAccountFormSequence:
      sequences.submitCreatePetitionerAccountFormSequence,
    toggleShowPasswordSequence: sequences.toggleShowPasswordSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({
    alertError,
    alertWarning,
    confirmPassword,
    createAccountHelper,
    navigateToLoginSequence,
    password,
    showConfirmPassword,
    showPassword,
    submitCreatePetitionerAccountFormSequence,
    toggleShowPasswordSequence,
    updateFormValueSequence,
  }) => {
    const [inFocusEmail, setInFocusEmail] = useState(true);
    const [inFocusName, setInFocusName] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    // Re-enabled submit button if submission was unsuccessful
    useEffect(() => {
      if (alertError || alertWarning) {
        setSubmitDisabled(false);
      }
    }, [alertError, alertWarning]);

    const submitFunction = debounce(() => {
      submitCreatePetitionerAccountFormSequence();
    }, DEBOUNCE_TIME_MS);

    return (
      <>
        <div
          className="create-petitioner-form padding-x-205 margin-bottom-4 flex-1"
          style={{ width: 'fit-content' }}
        >
          <div>
            <h1 className="margin-bottom-1">Create Petitioner Account</h1>
            <form
              onSubmit={e => {
                e.preventDefault();
                setSubmitDisabled(true);
                submitFunction();
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
                data-testid="petitioner-account-creation-email"
                id="email"
                name="email"
                type="text"
                onBlur={() => {
                  setInFocusEmail(false);
                }}
                onChange={e => {
                  updateFormValueSequence({
                    key: 'email',
                    value: e.target.value,
                  });
                }}
                onFocus={() => setInFocusEmail(true)}
              />
              {!inFocusEmail && createAccountHelper.email && (
                <div className="margin-top-1">
                  <RequirementsText
                    fieldName="email"
                    text={createAccountHelper.email}
                    valid={false}
                  ></RequirementsText>
                </div>
              )}

              <label className="usa-label" htmlFor="name">
                Name
              </label>
              <input
                required
                autoCapitalize="off"
                autoCorrect="off"
                className="usa-input"
                data-testid="petitioner-account-creation-name"
                id="name"
                name="name"
                type="text"
                onBlur={() => {
                  setInFocusName(false);
                }}
                onChange={e => {
                  updateFormValueSequence({
                    key: 'name',
                    value: e.target.value,
                  });
                }}
                onFocus={() => setInFocusName(true)}
              />
              {!inFocusName && createAccountHelper.name && (
                <div className="margin-top-1">
                  <RequirementsText
                    aria-label="name field validation errors"
                    fieldName="name"
                    text={createAccountHelper.name}
                    valid={false}
                  ></RequirementsText>
                </div>
              )}
              <label className="usa-label" htmlFor="password">
                Password
              </label>
              <input
                required
                className="usa-input"
                data-testid="petitioner-account-creation-password"
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
                  toggleShowPasswordSequence({ passwordType: 'showPassword' })
                }
              >
                {showPassword ? 'Hide password' : 'Show password'}
              </button>
              <div
                className="margin-top-1"
                data-testid="password-validation-errors"
                hidden={!password}
              >
                {createAccountHelper.passwordErrors.map(error => {
                  return (
                    <RequirementsText
                      fieldName={`password-${error.key}`}
                      key={error.message}
                      text={error.message}
                      valid={error.valid}
                    ></RequirementsText>
                  );
                })}
              </div>

              <label className="usa-label" htmlFor="confirm-password">
                Re-type password
              </label>
              <input
                required
                className="usa-input"
                data-testid="petitioner-account-creation-confirm-password"
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
                {showConfirmPassword ? 'Hide password' : 'Show password'}
              </button>
              <div
                className="margin-top-1"
                style={{
                  visibility: confirmPassword ? 'visible' : 'hidden',
                }}
              >
                <RequirementsText
                  fieldName="confirm-password"
                  text="Passwords must match"
                  valid={createAccountHelper.confirmPassword}
                ></RequirementsText>
              </div>
              <Button
                className="usa-button margin-top-2"
                data-testid="petitioner-account-creation-submit-button"
                disabled={!createAccountHelper.formIsValid || submitDisabled}
                id="submit-button"
              >
                Continue
              </Button>
            </form>
            <p>
              Already have an account?{' '}
              <Button
                className="usa-button--unstyled"
                onClick={() => navigateToLoginSequence()}
              >
                Log in
              </Button>
            </p>
          </div>
        </div>
      </>
    );
  },
);

CreatePetitionerAccountForm.displayName = 'CreatePetitionerAccountForm';
