import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { IRSNotice } from '../IRSNotice';
import { PetitionPaymentForm } from './PetitionPaymentForm';
import { ProcedureType } from '../StartCase/ProcedureType';
import { TrialCityOptions } from '../TrialCityOptions';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
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
          id="case-detail-internal"
        >
          <ErrorNotification />

          <h1>Edit Case Details</h1>
          <div className="blue-container margin-bottom-4">
            <div className="margin-bottom-5">
              <h4 className="margin-bottom-2">IRS Notice/Case</h4>
              <IRSNotice
                shouldStartWithBlankStatistic={false}
                validationName="validateCaseDetailsSequence"
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
              dateBind="form"
              updateDateSequence={updateFormValueSequence}
              updateSequence={updateFormValueSequence}
              validateSequence={validateCaseDetailsSequence}
              validationErrorsBind="validationErrors"
            />
          </div>

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
        </section>
      </>
    );
  },
);

EditCaseDetails.displayName = 'EditCaseDetails';
