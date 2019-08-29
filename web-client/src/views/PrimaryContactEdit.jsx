import { Address } from './StartCase/Address';
import { Country } from './StartCase/Country';
import { ErrorNotification } from './ErrorNotification';
import { Hint } from '../ustc-ui/Hint/Hint';
import { InternationalAddress } from './StartCase/InternationalAddress';
import { Text } from '../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PrimaryContactEdit = connect(
  {
    cancelEditPrimaryContactSequence:
      sequences.cancelEditPrimaryContactSequence,
    caseDetail: state.caseDetail,
    submitEditPrimaryContactSequence:
      sequences.submitEditPrimaryContactSequence,
    updateCaseValueSequence: sequences.updateCaseValueSequence,
    validateContactPrimarySequence: sequences.validateContactPrimarySequence,
    validationErrors: state.validationErrors,
  },
  ({
    cancelEditPrimaryContactSequence,
    caseDetail,
    submitEditPrimaryContactSequence,
    updateCaseValueSequence,
    validateContactPrimarySequence,
    validationErrors,
  }) => {
    const type = 'contactPrimary';
    const bind = 'caseDetail';
    const onBlur = 'validateContactPrimarySequence';

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
            This form will automatically create and submit a change of contact
            information notification for this case. Please ensure your
            information is accurate before submitting.
          </p>

          <Hint wider>
            To change the case caption, please file a Motion to Change Caption
          </Hint>

          <div className="blue-container">
            <span className="label">Contact Name</span>
            <p>{caseDetail.contactPrimary.name}</p>
            <Country
              bind={bind}
              clearTypeOnCountryChange={true}
              type={type}
              onChange="countryTypeChangeSequence"
            />
            {caseDetail.contactPrimary.countryType === 'domestic' ? (
              <Address
                bind={bind}
                type={type}
                onBlur={onBlur}
                onChange="updateCaseValueSequence"
              />
            ) : (
              <InternationalAddress
                bind={bind}
                type={type}
                onBlur={onBlur}
                onChange="updateCaseValueSequence"
              />
            )}
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
            onClick={() => {
              submitEditPrimaryContactSequence();
            }}
          >
            Save
          </button>
          <button
            className="usa-button usa-button--outline margin-top-3 margin-right-3"
            onClick={() => {
              cancelEditPrimaryContactSequence({
                caseId: caseDetail.docketNumber,
              });
            }}
          >
            Cancel
          </button>
        </section>
      </>
    );
  },
);
