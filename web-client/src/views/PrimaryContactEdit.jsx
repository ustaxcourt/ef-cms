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
    caseDetailHelper: state.caseDetailHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    primaryContactEditHelper: state.primaryContactEditHelper,
    submitEditPrimaryContactSequence:
      sequences.submitEditPrimaryContactSequence,
    updateCaseValueSequence: sequences.updateCaseValueSequence,
    validateContactPrimarySequence: sequences.validateContactPrimarySequence,
    validationErrors: state.validationErrors,
  },
  ({
    cancelEditPrimaryContactSequence,
    caseDetail,
    caseDetailHelper,
    formattedCaseDetail,
    primaryContactEditHelper,
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
            <div className="usa-form-group">
              <p className="usa-label">Contact name</p>
              <p className="margin-top-0">
                {caseDetailHelper.showCaseNameForPrimary
                  ? formattedCaseDetail.caseName
                  : caseDetail.contactPrimary.name}
              </p>
            </div>

            {primaryContactEditHelper.showInCareOf && (
              <div
                className={
                  'usa-form-group ' +
                  (validationErrors.contactPrimary &&
                  validationErrors.contactPrimary.inCareOf
                    ? 'usa-form-group--error'
                    : '')
                }
              >
                <label className="usa-label" htmlFor="inCareOf">
                  <span>
                    In care of <span className="usa-hint">(your name)</span>
                  </span>
                </label>
                <input
                  autoCapitalize="none"
                  className="usa-input"
                  id="inCareOf"
                  name="contactPrimary.inCareOf"
                  type="text"
                  value={caseDetail.contactPrimary.inCareOf || ''}
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
                  bind="validationErrors.contactPrimary.inCareOf"
                  className="usa-error-message"
                />
              </div>
            )}

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
                'usa-form-group margin-bottom-0 ' +
                (validationErrors &&
                validationErrors.contactPrimary &&
                validationErrors.contactPrimary.phone
                  ? 'usa-form-group--error'
                  : '')
              }
            >
              <label className="usa-label" htmlFor="phone">
                Phone number
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
            className="usa-button usa-button--unstyled margin-top-3 margin-right-3"
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
