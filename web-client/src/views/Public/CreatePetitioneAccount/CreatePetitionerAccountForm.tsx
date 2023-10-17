import { RequirementsText } from '@web-client/views/Public/CreatePetitioneAccount/RequirementsText';
import { connect } from '@cerebral/react';
import { sequences, state } from '@web-client/presenter/app-public.cerebral';

import React from 'react';

export const CreatePetitionerAccountForm = connect(
  {
    createAccountHelper: state.createAccountHelper,
    password: state.form.password,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({ createAccountHelper, password, updateFormValueSequence }) => {
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
            <form style={{ width: '90%' }}>
              <label className="usa-label" htmlFor="email">
                Email address
              </label>
              <input
                required
                autoCapitalize="off"
                autoCorrect="off"
                className="usa-input"
                id="name"
                name="name"
                type="text"
              />

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
              />

              <label className="usa-label" htmlFor="password">
                Password
              </label>
              <input
                required
                className="usa-input"
                id="password"
                name="password"
                type="password"
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
              >
                Show password
              </button>
              <div hidden={!password}>
                <RequirementsText
                  label="Must contain lower case letter"
                  valid={createAccountHelper.passwordErrors?.hasOneLowercase}
                ></RequirementsText>
                <RequirementsText
                  label="Must contain upper case letter"
                  valid={createAccountHelper.passwordErrors?.hasOneUppercase}
                ></RequirementsText>
                <RequirementsText
                  label="Must contain number"
                  valid={createAccountHelper.passwordErrors?.hasOneNumber}
                ></RequirementsText>
                <RequirementsText
                  label="Must be between 8-99 characters long"
                  valid={createAccountHelper.passwordErrors?.isProperLength}
                ></RequirementsText>
                <RequirementsText
                  label="Must contain special character or space"
                  valid={
                    createAccountHelper.passwordErrors
                      ?.hasSpecialCharacterOrSpace
                  }
                ></RequirementsText>
                <RequirementsText
                  label="Must not contain leading or trailing space"
                  valid={
                    createAccountHelper.passwordErrors
                      ?.hasNoLeadingOrTrailingSpace
                  }
                ></RequirementsText>
              </div>

              <label
                className="usa-label"
                htmlFor="password-create-account-confirm"
              >
                Re-type Password
              </label>
              <input
                required
                className="usa-input"
                id="password-create-account-confirm"
                name="password-confirm"
                type="password"
              />
              <button
                aria-controls="password-create-account password-create-account-confirm"
                className="usa-show-password"
                data-hide-text="Hide password"
                data-show-text="Show password"
                title=""
                type="button"
              >
                Show password
              </button>
              <RequirementsText
                label="Passowrd must match"
                valid={true} // TODO : SAVE IN COMPUTED AND WIRE CORRECTLY HERE
              ></RequirementsText>

              <input
                className="usa-button margin-top-4"
                type="submit"
                value="Continue"
              />
            </form>
            <p>
              Already have an account?{' '}
              {/* TODO: FILL IN HREF WITH CORRECT LINK LATER ! */}
              <a className="usa-link" href="/">
                Sign in
              </a>
              .
            </p>
          </div>
        </div>
      </>
    );
  },
);

CreatePetitionerAccountForm.displayName = 'CreatePetitionerAccountForm';
