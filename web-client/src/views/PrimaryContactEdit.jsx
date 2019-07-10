import { Address } from './StartCase/Address';
import { Country } from './StartCase/Country';
import { Text } from '../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PrimaryContactEdit = connect(
  {
    caseDetail: state.caseDetail,
    submitEditPrimaryContactSequence:
      sequences.submitEditPrimaryContactSequence,
    updateCaseValueSequence: sequences.updateCaseValueSequence,
    validateContactPrimarySequence: sequences.validateContactPrimarySequence,
    validationErrors: state.validationErrors,
  },
  ({
    caseDetail,
    submitEditPrimaryContactSequence,
    updateCaseValueSequence,
    validateContactPrimarySequence,
    validationErrors,
  }) => {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <h1>My Contact Information</h1>
          </div>
        </div>
        <section className="usa-section grid-container">
          <h2>Edit Your Contact Information for This Case</h2>
          <div className="blue-container">
            <Country
              bind={'caseDetail'}
              type={'contactPrimary'}
              onBlur={'validateContactPrimarySequence'}
              onChange={'updateCaseValueSequence'}
            />
            <Address
              bind={'caseDetail'}
              type={'contactPrimary'}
              onBlur={'validateContactPrimarySequence'}
              onChange={'updateCaseValueSequence'}
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
                  validateContactPrimarySequence();
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
          <button
            className="usa-button margin-top-3 margin-right-3"
            onBlur={() => {
              submitEditPrimaryContactSequence();
            }}
          >
            Save
          </button>
          <a
            className="usa-button usa-button--outline"
            href={`/case-detail/${caseDetail.docketNumber}`}
          >
            Cancel
          </a>
        </section>
      </>
    );
  },
);
