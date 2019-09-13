import { Address } from './StartCase/Address';
import { Country } from './StartCase/Country';
import { ErrorNotification } from './ErrorNotification';
import { Hint } from '../ustc-ui/Hint/Hint';
import { InternationalAddress } from './StartCase/InternationalAddress';
import { Text } from '../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const UserContactEdit = connect(
  {
    navigateBack: sequences.navigateBackSequence,
    submitEditUserContactSequence: sequences.submitEditUserContactSequence,
    updateUserContactValueSequence: sequences.updateUserContactValueSequence,
    user: state.user,
    validateUserContactSequence: sequences.validateUserContactSequence,
    validationErrors: state.validationErrors,
  },
  ({
    navigateBack,
    submitEditUserContactSequence,
    updateUserContactValueSequence,
    user,
    validateUserContactSequence,
    validationErrors,
  }) => {
    const type = 'contact';
    const bind = 'user';
    const onBlur = 'validateUserContactSequence';

    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <h1>Contact Information</h1>
          </div>
        </div>
        <section className="usa-section grid-container">
          <ErrorNotification />

          <h2>Edit Contact Information</h2>

          <p>
            This form will automatically create and submit change of contact
            information notifications for all of your cases. Please ensure your
            information is accurate before submitting.
          </p>

          <Hint wider>
            For name and Bar Number changes, please contact the Court’s
            Admissions section at (202)-521-0700
          </Hint>

          <div className="blue-container">
            <div className="usa-form-group">
              <p className="usa-label">Contact Name</p>
              <p className="margin-top-0">
                {user.name} ({user.barNumber})
              </p>
            </div>

            <Country
              bind={bind}
              type={type}
              onBlur={onBlur}
              onChange="updateUserContactValueSequence"
              onChangeCountryType="countryTypeUserContactChangeSequence"
            />
            {user.contact.countryType === 'domestic' ? (
              <Address
                bind={bind}
                type={type}
                onBlur={onBlur}
                onChange="updateUserContactValueSequence"
              />
            ) : (
              <InternationalAddress
                bind={bind}
                type={type}
                onBlur={onBlur}
                onChange="updateUserContactValueSequence"
              />
            )}
            <div
              className={
                'usa-form-group margin-bottom-0 ' +
                (validationErrors &&
                validationErrors.contact &&
                validationErrors.contact.phone
                  ? 'usa-form-group--error'
                  : '')
              }
            >
              <label className="usa-label" htmlFor="phone">
                Phone Number
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="phone"
                name="contact.phone"
                type="tel"
                value={user.contact.phone || ''}
                onBlur={() => {
                  validateUserContactSequence();
                }}
                onChange={e => {
                  updateUserContactValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
              <Text
                bind={'validationErrors.contact.phone'}
                className="usa-error-message"
              />
            </div>
          </div>
          <button
            className="usa-button margin-top-3 margin-right-3"
            onClick={() => {
              submitEditUserContactSequence();
            }}
          >
            Save
          </button>
          <button
            className="usa-button usa-button--outline margin-top-3 margin-right-3"
            onClick={() => navigateBack()}
          >
            Cancel
          </button>
        </section>
      </>
    );
  },
);
