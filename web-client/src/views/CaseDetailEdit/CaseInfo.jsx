import { connect } from '@cerebral/react';
import { state, sequences } from 'cerebral';
import React from 'react';
import { ProcedureType } from '../StartCase/ProcedureType';
import { TrialCity } from '../StartCase/TrialCity';

export const CaseInfo = connect(
  {
    autoSaveCaseSequence: sequences.autoSaveCaseSequence,
    caseDetail: state.caseDetail,
    caseDetailErrors: state.caseDetailErrors,
    form: state.form,
    updateCaseValueSequence: sequences.updateCaseValueSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    trialCitiesHelper: state.trialCitiesHelper,
  },
  ({
    autoSaveCaseSequence,
    caseDetail,
    trialCitiesHelper,
    caseDetailErrors,
    form,
    updateCaseValueSequence,
    updateFormValueSequence,
  }) => {
    return (
      <div className="blue-container">
        <h3>Case Information</h3>
        <ProcedureType
          value={caseDetail.procedureType}
          onChange={e => {
            updateCaseValueSequence({
              key: 'procedureType',
              value: e.target.value,
            });
            updateCaseValueSequence({
              key: 'preferredTrialCity',
              value: '',
            });
            autoSaveCaseSequence();
          }}
          legend="Case Procedure"
        />

        <TrialCity
          label="Trial Location"
          showHint={false}
          showSmallTrialCitiesHint={false}
          showRegularTrialCitiesHint={false}
          showDefaultOption={true}
          value={caseDetail.preferredTrialCity}
          trialCitiesByState={
            trialCitiesHelper(caseDetail.procedureType).trialCitiesByState
          }
          onChange={e => {
            updateCaseValueSequence({
              key: 'preferredTrialCity',
              value: e.target.value,
            });
            autoSaveCaseSequence();
          }}
        />

        <div className={caseDetailErrors.payGovDate ? 'usa-input-error' : ''}>
          <fieldset>
            <legend id="fee-payment-date-legend">Fee Payment Date</legend>
            <div className="usa-date-of-birth">
              <div className="usa-form-group usa-form-group-month">
                <label htmlFor="fee-payment-date-month" aria-hidden="true">
                  MM
                </label>
                <input
                  aria-describedby="fee-payment-date-legend"
                  aria-label="month, two digits"
                  className={
                    'usa-input-inline' +
                    (caseDetailErrors.payGovDate ? 'usa-input-error' : '')
                  }
                  id="fee-payment-date-month"
                  max="12"
                  min="1"
                  name="payGovMonth"
                  type="number"
                  value={form.payGovMonth || ''}
                  onBlur={() => {
                    autoSaveCaseSequence();
                  }}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="usa-form-group usa-form-group-day">
                <label htmlFor="fee-payment-date-day" aria-hidden="true">
                  DD
                </label>
                <input
                  aria-describedby="fee-payment-date-legend"
                  aria-label="day, two digits"
                  className={
                    'usa-input-inline' +
                    (caseDetailErrors.payGovDate ? 'usa-input-error' : '')
                  }
                  id="fee-payment-date-day"
                  max="31"
                  min="1"
                  name="payGovDay"
                  type="number"
                  value={form.payGovDay || ''}
                  onBlur={() => {
                    autoSaveCaseSequence();
                  }}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="usa-form-group usa-form-group-year">
                <label htmlFor="fee-payment-date-year" aria-hidden="true">
                  YYYY
                </label>
                <input
                  aria-describedby="fee-payment-date-legend"
                  aria-label="year, four digits"
                  className={
                    'usa-input-inline' +
                    (caseDetailErrors.payGovDate ? 'usa-input-error' : '')
                  }
                  id="fee-payment-date-year"
                  max="2100"
                  min="1900"
                  name="payGovYear"
                  type="number"
                  value={form.payGovYear || ''}
                  onBlur={() => {
                    autoSaveCaseSequence();
                  }}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            {caseDetailErrors.payGovDate && (
              <div className="usa-input-error-message beneath" role="alert">
                {caseDetailErrors.payGovDate}
              </div>
            )}
          </fieldset>
        </div>

        <div className="usa-form-group">
          <label htmlFor="fee-payment-id">Fee Payment ID</label>
          <input
            id="fee-payment-id"
            name="payGovId"
            type="number"
            value={caseDetail.payGovId || ''}
            onBlur={() => {
              autoSaveCaseSequence();
            }}
            onChange={e => {
              updateCaseValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </div>
      </div>
    );
  },
);
