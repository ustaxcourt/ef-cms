import { Address } from './StartCase/Address';
import { Button } from '../ustc-ui/Button/Button';
import { Country } from './StartCase/Country';
import { ErrorNotification } from './ErrorNotification';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { Hint } from '../ustc-ui/Hint/Hint';
import { InternationalAddress } from './StartCase/InternationalAddress';
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
    validatePrimaryContactSequence: sequences.validatePrimaryContactSequence,
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
    validatePrimaryContactSequence,
    validationErrors,
  }) => {
    const type = 'contactPrimary';
    const bind = 'caseDetail';
    const onBlur = 'validatePrimaryContactSequence';

    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <h1>Edit Contact Information</h1>
          </div>
        </div>

        <section className="usa-section grid-container">
          <ErrorNotification />

          <p>
            This form will automatically create and submit a change of contact
            information notification for this case. Please ensure your
            information is accurate before submitting.
          </p>

          <Hint wider>
            To change the case caption, please file a Motion to Change Caption
          </Hint>

          <div className="blue-container margin-bottom-5">
            <div className="usa-form-group">
              <p className="usa-label">Contact name</p>
              <p className="margin-top-0">
                {caseDetailHelper.showCaseNameForPrimary
                  ? formattedCaseDetail.caseName
                  : caseDetail.contactPrimary.name}
              </p>
            </div>

            {primaryContactEditHelper.showInCareOf && (
              <FormGroup
                errorText={
                  validationErrors.contactPrimary &&
                  validationErrors.contactPrimary.inCareOf
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
                    validatePrimaryContactSequence();
                  }}
                  onChange={e => {
                    updateCaseValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </FormGroup>
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
            <FormGroup
              errorText={
                validationErrors &&
                validationErrors.contactPrimary &&
                validationErrors.contactPrimary.phone
              }
            >
              <label className="usa-label" htmlFor="phone">
                Phone number
              </label>
              <input
                autoCapitalize="none"
                className="usa-input max-width-200"
                id="phone"
                name="contactPrimary.phone"
                type="tel"
                value={caseDetail.contactPrimary.phone || ''}
                onBlur={() => {
                  validatePrimaryContactSequence();
                }}
                onChange={e => {
                  updateCaseValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>
          </div>
          <Button
            onClick={() => {
              submitEditPrimaryContactSequence();
            }}
          >
            Save
          </Button>
          <Button
            link
            onClick={() => {
              cancelEditPrimaryContactSequence({
                caseId: caseDetail.docketNumber,
              });
            }}
          >
            Cancel
          </Button>
        </section>
      </>
    );
  },
);
