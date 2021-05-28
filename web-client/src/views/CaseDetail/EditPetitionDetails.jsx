import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { IRSNotice } from '../CaseDetailEdit/IRSNotice';
import { PetitionPaymentForm } from './PetitionPaymentForm';
import { ProcedureType } from '../StartCase/ProcedureType';
import { TrialCityOptions } from '../TrialCityOptions';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditPetitionDetails = connect(
  {
    CASE_TYPES: state.constants.CASE_TYPES,
    docketNumber: state.caseDetail.docketNumber,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updatePetitionDetailsSequence: sequences.updatePetitionDetailsSequence,
    validatePetitionDetailsSequence: sequences.validatePetitionDetailsSequence,
    validationErrors: state.validationErrors,
  },
  function EditPetitionDetails({
    docketNumber,
    form,
    updateFormValueSequence,
    updatePetitionDetailsSequence,
    validatePetitionDetailsSequence,
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

          <h1>Edit Petition Details</h1>
          <div className="blue-container margin-bottom-4">
            <div className="margin-bottom-5">
              <h4 className="margin-bottom-2">IRS Notice/Case</h4>
              <IRSNotice
                shouldStartWithBlankStatistic={false}
                validationName="validatePetitionDetailsSequence"
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
                    validatePetitionDetailsSequence();
                  }}
                >
                  <option value="">- Select -</option>
                  <TrialCityOptions />
                </select>
              </FormGroup>
            </div>

            <PetitionPaymentForm
              bind="form"
              dateBind="form"
              updateDateSequence={updateFormValueSequence}
              updateSequence={updateFormValueSequence}
              validateSequence={validatePetitionDetailsSequence}
              validationErrorsBind="validationErrors"
            />
          </div>

          <Button
            onClick={() => {
              updatePetitionDetailsSequence();
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
