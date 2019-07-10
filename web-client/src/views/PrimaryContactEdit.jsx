import { Address } from './StartCase/Address';
import { Country } from './StartCase/Country';
import { Text } from '../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PrimaryContactEdit = connect(
  {
    caseDetail: state.caseDetail,
    updateCaseValueSequence: sequences.updateCaseValueSequence,
    validateCaseDetailSequence: sequences.validateCaseDetailSequence,
    validationErrors: state.validationErrors,
  },
  ({
    caseDetail,
    updateCaseValueSequence,
    validateCaseDetailSequence,
    validationErrors,
  }) => {
    return (
      <section className="usa-section grid-container">
        <h1>Edit Your Contact Information</h1>
        <div className="blue-container">
          <Country
            bind={'caseDetail'}
            type={'contactPrimary'}
            onBlur={validateCaseDetailSequence}
            onChange={updateCaseValueSequence}
          />
          <Address
            bind={'caseDetail'}
            type={'contactPrimary'}
            onBlur={validateCaseDetailSequence}
            onChange={updateCaseValueSequence}
          />
          <div
            className={
              'usa-form-group ' +
              (validationErrors &&
              validationErrors.contactPrimary &&
              validationErrors.contactPrimary.phone
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
              value={caseDetail.contactPrimary.phone || ''}
              onBlur={() => {
                validateCaseDetailSequence();
              }}
              onChange={e => {
                updateCaseValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
            <Text
              bind={'validationErrors.contactPrimary.phone'}
              className="usa-error-message"
            />
          </div>
        </div>
      </section>
    );
  },
);
