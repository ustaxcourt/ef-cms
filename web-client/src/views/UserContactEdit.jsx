import { Address } from './StartCase/Address';
import { Country } from './StartCase/Country';
import { ErrorNotification } from './ErrorNotification';
import { InternationalAddress } from './StartCase/InternationalAddress';
import { Text } from '../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const UserContactEdit = connect(
  {
    submitEditUserContactSequence: sequences.submitEditUserContactSequence,
    updateUserContactValueSequence: sequences.updateUserContactValueSequence,
    user: state.user,
    validateUserContactSequence: sequences.validateUserContactSequence,
    validationErrors: state.validationErrors,
  },
  ({
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
            <h1>My Contact Information</h1>
          </div>
        </div>
        <section className="usa-section grid-container">
          <ErrorNotification />

          <h2>Edit Your Contact Information for This Case</h2>

          <div className="blue-container">
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
                'usa-form-group ' +
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
            onClick={() => {
              history.back();
            }}
          >
            Cancel
          </button>
        </section>
      </>
    );
  },
);
