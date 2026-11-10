import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { IRSNotice } from '../IRSNotice';
import { PetitionPaymentForm } from './PetitionPaymentForm';
import { ProcedureType } from '../StartCase/ProcedureType';
import { TrialCityOptions } from '../TrialCityOptions';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const EditCaseDetails = connect(
  {
    CASE_TYPES: state.constants.CASE_TYPES,
    docketNumber: state.caseDetail.docketNumber,
    form: state.form,
    updateCaseDetailsSequence: sequences.updateCaseDetailsSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateCaseDetailsSequence: sequences.validateCaseDetailsSequence,
    validationErrors: state.validationErrors,
  },
  function EditCaseDetails({
    docketNumber,
    form,
    updateCaseDetailsSequence,
    updateFormValueSequence,
    validateCaseDetailsSequence,
    validationErrors,
  }) {
    return (
      <>
        <CaseDetailHeader />

        <section
          className="usa-section grid-container"
          data-testid="edit-case-details-container"
        >
          <ErrorNotification />

          <h1>Edit Case Details</h1>
          <div className="blue-container margin-bottom-4">
            <div className="margin-bottom-5">
              <h4 className="margin-bottom-2">IRS Notice/Case</h4>
              <IRSNotice
                shouldStartWithBlankStatistic={false}
                validateFormData={validateCaseDetailsSequence}
              />

              <ProcedureType
                legend="Case procedure"
                value={form.procedureType}
                onChange={e => {
                  updateFormValueSequence({
                    key: 'procedureType',
                    value: e.target.value,
                  });
                }}
              />

              <FormGroup
                className="margin-bottom-3"
                errorText={validationErrors.preferredTrialCity}
              >
                <label className="usa-label" htmlFor="preferred-trial-city">
                  Requested place of trial
                </label>
                <select
                  className="usa-select"
                  id="preferred-trial-city"
                  name="preferredTrialCity"
                  value={form.preferredTrialCity}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                    validateCaseDetailsSequence();
                  }}
                >
                  <option value="">- Select -</option>
                  <TrialCityOptions procedureType="All" />
                </select>
              </FormGroup>
            </div>

            <PetitionPaymentForm
              bind="form"
              validateFormData={validateCaseDetailsSequence}
              validationErrorsBind="validationErrors"
              onUpdate={updateFormValueSequence}
            />

            <div className="margin-bottom-5">
              <h4 className="margin-bottom-2">Special Trial Judge</h4>
              <FormGroup
                className="margin-bottom-3"
                errorText={validationErrors.isStjEligible}
              >
                <label className="usa-label" htmlFor="preferred-trial-city">
                  STJ Eligibility
                </label>
                <div className="usa-radio usa-radio__inline">
                  <input
                    aria-describedby="has-irs-verified-notice-Eligible"
                    checked={form.isStjEligible === true}
                    className="usa-radio__input"
                    data-testid="isStjEligible-Eligible-radio"
                    id="isStjEligible-Eligible"
                    name="isStjEligible"
                    type="radio"
                    value="eligible"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: true,
                      });
                    }}
                  />
                  <label
                    className="usa-radio__label"
                    data-testid="lbl-Is-Stj-Eligible"
                    htmlFor="isStjEligible-Eligible"
                    id="has-irs-verified-notice-Eligible"
                  >
                    Eligible
                  </label>
                </div>
                <div className="usa-radio usa-radio__inline">
                  <input
                    aria-describedby="has-irs-verified-notice-Not-Eligible"
                    checked={form.isStjEligible === false}
                    className="usa-radio__input"
                    data-testid="isStjEligible-Not-Eligible-radio"
                    id="isStjEligible-Not-Eligible"
                    name="isStjEligible"
                    type="radio"
                    value="not-eligible"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: false,
                      });
                    }}
                  />
                  <label
                    className="usa-radio__label"
                    data-testid="lbl-Is-Stj-Not-Eligible"
                    htmlFor="isStjEligible-Not-Eligible"
                    id="has-irs-verified-notice-Not-Eligible"
                  >
                    Not Eligible
                  </label>
                </div>
              </FormGroup>
            </div>
          </div>

          <div className="button-container">
            <Button
              onClick={() => {
                updateCaseDetailsSequence();
              }}
            >
              Save
            </Button>

            <Button link href={`/case-detail/${docketNumber}/case-information`}>
              Cancel
            </Button>
          </div>
        </section>
      </>
    );
  },
);

EditCaseDetails.displayName = 'EditCaseDetails';
