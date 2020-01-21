import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetailHeader';
import { CaseTypeSelect } from '../StartCase/CaseTypeSelect';
import { ErrorNotification } from '../ErrorNotification';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { PetitionPaymentForm } from './PetitionPaymentForm';
import { ProcedureType } from '../StartCase/ProcedureType';
import { TrialCityOptions } from '../TrialCityOptions';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const EditPetitionDetails = connect(
  {
    caseTypes: state.caseTypes,
    docketNumber: state.caseDetail.docketNumber,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updatePetitionDetailsSequence: sequences.updatePetitionDetailsSequence,
    validatePetitionDetailsSequence: sequences.validatePetitionDetailsSequence,
    validationErrors: state.validationErrors,
  },
  ({
    caseTypes,
    docketNumber,
    form,
    updateFormValueSequence,
    updatePetitionDetailsSequence,
    validatePetitionDetailsSequence,
    validationErrors,
  }) => {
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

              <CaseTypeSelect
                allowDefaultOption={true}
                caseTypes={caseTypes}
                legend="Type of case"
                validation="validatePetitionDetailsSequence"
                value={form.caseType}
                onChange="updateFormValueSequence"
              />

              <FormGroup errorText={validationErrors.irsNoticeDate}>
                <fieldset className="usa-fieldset margin-bottom-0">
                  <legend className="usa-legend" id="date-of-notice-legend">
                    Date of notice
                  </legend>
                  <div className="usa-memorable-date">
                    <div className="usa-form-group usa-form-group--month margin-bottom-0">
                      <input
                        aria-describedby="date-of-notice-legend"
                        aria-label="month, two digits"
                        className={classNames(
                          'usa-input usa-input--inline',
                          validationErrors.irsNoticeDate && 'usa-input--error',
                        )}
                        id="date-of-notice-month"
                        max="12"
                        min="1"
                        name="irsMonth"
                        placeholder="MM"
                        type="number"
                        value={form.irsMonth || ''}
                        onBlur={() => validatePetitionDetailsSequence()}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="usa-form-group usa-form-group--day margin-bottom-0">
                      <input
                        aria-describedby="date-of-notice-legend"
                        aria-label="day, two digits"
                        className={classNames(
                          'usa-input usa-input--inline',
                          validationErrors.irsNoticeDate && 'usa-input--error',
                        )}
                        id="date-of-notice-day"
                        max="31"
                        min="1"
                        name="irsDay"
                        placeholder="DD"
                        type="number"
                        value={form.irsDay || ''}
                        onBlur={() => validatePetitionDetailsSequence()}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="usa-form-group usa-form-group--year margin-bottom-0">
                      <input
                        aria-describedby="date-of-notice-legend"
                        aria-label="year, four digits"
                        className={classNames(
                          'usa-input usa-input--inline',
                          validationErrors.irsNoticeDate && 'usa-input--error',
                        )}
                        id="date-of-notice-year"
                        max="2100"
                        min="1900"
                        name="irsYear"
                        placeholder="YYYY"
                        type="number"
                        value={form.irsYear || ''}
                        onBlur={() => validatePetitionDetailsSequence()}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                </fieldset>
              </FormGroup>

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
