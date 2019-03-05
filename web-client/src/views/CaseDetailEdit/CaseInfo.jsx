import { sequences, state } from 'cerebral';

import { ProcedureType } from '../StartCase/ProcedureType';
import React from 'react';
import { TrialCity } from '../StartCase/TrialCity';
import { connect } from '@cerebral/react';

export const CaseInfo = connect(
  {
    autoSaveCaseSequence: sequences.autoSaveCaseSequence,
    caseDetail: state.caseDetail,
    caseDetailErrors: state.caseDetailErrors,
    form: state.form,
    trialCitiesHelper: state.trialCitiesHelper,
    updateCaseValueSequence: sequences.updateCaseValueSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({
    autoSaveCaseSequence,
    caseDetail,
    caseDetailErrors,
    form,
    trialCitiesHelper,
    updateCaseValueSequence,
    updateFormValueSequence,
  }) => {
    return (
      <div className="blue-container">
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

        <div className="usa-form-group">
          <input
            id="order-to-show-cause"
            type="checkbox"
            name="orderToShowCause"
            checked={caseDetail.orderToShowCause}
            onChange={e => {
              updateCaseValueSequence({
                key: e.target.name,
                value: e.target.checked,
              });
              autoSaveCaseSequence();
            }}
          />
          <label htmlFor="order-to-show-cause">Order to Show Cause</label>
        </div>

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

        <div className="usa-form-group">
          <input
            id="order-for-filing-fee"
            type="checkbox"
            name="orderForFilingFee"
            checked={caseDetail.orderForFilingFee}
            onChange={e => {
              updateCaseValueSequence({
                key: e.target.name,
                value: e.target.checked,
              });
              autoSaveCaseSequence();
            }}
          />
          <label htmlFor="order-for-filing-fee">Order for Filing Fee</label>
        </div>

        <h3 id="orders-needed">Orders Needed</h3>
        <div role="list" aria-labelledby="orders-needed">
          <div className="usa-form-group" role="listitem">
            <input
              id="order-for-ratification"
              type="checkbox"
              name="orderForRatification"
              checked={caseDetail.orderForRatification}
              onChange={e => {
                updateCaseValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                autoSaveCaseSequence();
              }}
            />
            <label htmlFor="order-for-ratification">
              Order for Ratification of Petition
            </label>
          </div>
          <div className="usa-form-group" role="listitem">
            <input
              id="notice-of-attachments"
              type="checkbox"
              name="noticeOfAttachments"
              checked={caseDetail.noticeOfAttachments}
              onChange={e => {
                updateCaseValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                autoSaveCaseSequence();
              }}
            />
            <label htmlFor="notice-of-attachments">
              Notice of Attachments in the Nature of Evidence
            </label>
          </div>
          <div className="usa-form-group" role="listitem">
            <input
              id="order-for-amended-petition"
              type="checkbox"
              name="orderForAmendedPetition"
              checked={caseDetail.orderForAmendedPetition}
              onChange={e => {
                updateCaseValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                autoSaveCaseSequence();
              }}
            />
            <label htmlFor="order-for-amended-petition">
              Order for Amended Petition
            </label>
          </div>
          <div className="usa-form-group" role="listitem">
            <input
              id="order-for-amended-petition-and-filing-fee"
              type="checkbox"
              name="orderForAmendedPetitionAndFilingFee"
              checked={caseDetail.orderForAmendedPetitionAndFilingFee}
              onChange={e => {
                updateCaseValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                autoSaveCaseSequence();
              }}
            />
            <label htmlFor="order-for-amended-petition-and-filing-fee">
              Order for Amended Petition and Filing Fee
            </label>
          </div>
        </div>
      </div>
    );
  },
);
