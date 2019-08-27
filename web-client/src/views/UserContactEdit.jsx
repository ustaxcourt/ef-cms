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
    contact: state.user.contact,
    submitEditUserContactSequence: sequences.submitEditUserContactSequence,
    updateUserValueSequence: sequences.updateUserValueSequence,
    validateUserContactSequence: sequences.validateUserContactSequence,
    validationErrors: state.validationErrors,
  },
  ({
    contact,
    submitEditUserContactSequence,
    updateUserValueSequence,
    validateUserContactSequence,
    validationErrors,
  }) => {
    const bind = 'contact';
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
              clearTypeOnCountryChange={true}
              onChange="countryTypeChangeSequence"
            />
            {contact.countryType === 'domestic' ? (
              <Address
                bind={bind}
                onBlur={onBlur}
                onChange="updateUserValueSequence"
              />
            ) : (
              <InternationalAddress
                bind={bind}
                onBlur={onBlur}
                onChange="updateUserValueSequence"
              />
            )}
            <div
              className={
                'usa-form-group ' +
                (validationErrors && validationErrors.phone
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
                name="contactPrimary.phone"
                type="tel"
                value={contact.phone || ''}
                onBlur={() => {
                  validateUserContactSequence();
                }}
                onChange={e => {
                  updateUserValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
              <Text
                bind={'validationErrors.phone'}
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
