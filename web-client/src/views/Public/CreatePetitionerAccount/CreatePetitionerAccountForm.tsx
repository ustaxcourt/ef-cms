import { Button } from '@web-client/ustc-ui/Button/Button';
import { RequirementsText } from '@web-client/views/Public/CreatePetitionerAccount/RequirementsText';
import { connect } from '@cerebral/react';
import { sequences, state } from '@web-client/presenter/app-public.cerebral';
import React, { useState } from 'react';

export const CreatePetitionerAccountForm = connect(
  {
    confirmPassword: state.form.confirmPassword,
    createAccountHelper: state.createAccountHelper,

    navigateToCognitoSequence: sequences.navigateToCognitoSequence,
    password: state.form.password,
    showConfirmPassword: state.showConfirmPassword,
    showPassword: state.showPassword,
    submitCreatePetitionerAccountFormSequence:
      sequences.submitCreatePetitionerAccountFormSequence,
    toggleShowPasswordSequence: sequences.toggleShowPasswordSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({
    confirmPassword,
    createAccountHelper,
    navigateToCognitoSequence,
    password,
    showConfirmPassword,
    showPassword,
    submitCreatePetitionerAccountFormSequence,
    toggleShowPasswordSequence,
    updateFormValueSequence,
  }) => {
    const [inFocusEmail, setInFocusEmail] = useState(true);
    const [inFocusName, setInFocusName] = useState(true);

    return (
      <>
        <div
          className="
							create-petitioner-form
              padding-x-205
              margin-bottom-4
							flex-1
            "
          style={{ width: 'fit-content' }}
        >
          <div>
            <h1 className="margin-bottom-1">Create Petitioner Account</h1>
            <form
              style={{ width: '90%' }}
              onSubmit={e => {
                e.preventDefault();
                submitCreatePetitionerAccountFormSequence();
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
                {showPassword ? 'Hide Password' : 'Show password'}
              </button>
              <div className="margin-top-1" hidden={!password}>
                <RequirementsText
                  fieldName="password"
                  text={
                    createAccountHelper.passwordErrors?.hasOneLowercase.message
                  }
                  valid={
                    createAccountHelper.passwordErrors?.hasOneLowercase.valid
                  }
                ></RequirementsText>
                <RequirementsText
                  fieldName="password"
                  text={
                    createAccountHelper.passwordErrors?.hasOneUppercase.message
                  }
                  valid={
                    createAccountHelper.passwordErrors?.hasOneUppercase.valid
                  }
                ></RequirementsText>
                <RequirementsText
                  fieldName="password"
                  text={
                    createAccountHelper.passwordErrors?.hasOneNumber.message
                  }
                  valid={createAccountHelper.passwordErrors?.hasOneNumber.valid}
                ></RequirementsText>
                <RequirementsText
                  fieldName="password"
                  text={
                    createAccountHelper.passwordErrors?.isProperLength.message
                  }
                  valid={
                    createAccountHelper.passwordErrors?.isProperLength.valid
                  }
                ></RequirementsText>
                <RequirementsText
                  fieldName="password"
                  text={
                    createAccountHelper.passwordErrors
                      ?.hasSpecialCharacterOrSpace.message
                  }
                  valid={
                    createAccountHelper.passwordErrors
                      ?.hasSpecialCharacterOrSpace.valid
                  }
                ></RequirementsText>
                <RequirementsText
                  fieldName="password"
                  text={
                    createAccountHelper.passwordErrors
                      ?.hasNoLeadingOrTrailingSpace.message
                  }
                  valid={
                    createAccountHelper.passwordErrors
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
                {showConfirmPassword ? 'Hide Password' : 'Show password'}
              </button>
              <div
                className="margin-top-1"
                style={{
                  visibility: confirmPassword ? 'visible' : 'hidden',
                }}
              >
                <RequirementsText
                  fieldName="confirm password"
                  text="Password must match"
                  valid={createAccountHelper.confirmPassword}
                ></RequirementsText>
              </div>
              <Button
                className="usa-button margin-top-2"
                disabled={!createAccountHelper.formIsValid}
                id="submit-button"
              >
                Continue
              </Button>
            </form>
            <p>
              Already have an account?{' '}
              <Button
                className="usa-button--unstyled"
                onClick={() => navigateToCognitoSequence()}
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
