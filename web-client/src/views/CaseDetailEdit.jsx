import { connect } from '@cerebral/react';
import { state, sequences } from 'cerebral';
import React from 'react';
import UpdateCaseCancelModalDialog from './UpdateCaseCancelModalDialog';

export default connect(
  {
    caseDetail: state.caseDetail,
    form: state.form,
    showModal: state.showModal,
    submitting: state.submitting,
    submitUpdateCaseSequence: sequences.submitUpdateCaseSequence,
    updateCaseValueSequence: sequences.updateCaseValueSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateCaseDetailSequence: sequences.validateCaseDetailSequence,
  },
  function PetitionEdit({
    caseDetail,
    form,
    showModal,
    submitting,
    submitUpdateCaseSequence,
    updateCaseValueSequence,
    updateFormValueSequence,
    validateCaseDetailSequence,
  }) {
    return (
      <form
        noValidate
        onSubmit={e => {
          e.preventDefault();
          submitUpdateCaseSequence();
        }}
        role="form"
      >
        {showModal && <UpdateCaseCancelModalDialog />}
        <div className="blue-container">
          <h3>IRS Notice(s)</h3>
          <span className="label">Type of Notice</span>
          <p>{caseDetail.caseType}</p>
          <div className="usa-grid-full usa-form-group">
            <div className="usa-input-grid usa-input-grid-small">
              <label htmlFor="year">Year</label>
              <input
                id="year"
                type="text"
                name="year"
                value={caseDetail.yearAmounts[0].year || ''}
                onChange={e => {
                  updateCaseValueSequence({
                    key: 'yearAmounts.0.year',
                    value: e.target.value,
                  });
                }}
                onBlur={() => {
                  validateCaseDetailSequence();
                }}
              />
            </div>
            <div className="usa-input-grid usa-input-grid-medium">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                name="amount"
                type="text"
                value={caseDetail.yearAmounts[0].amount || ''}
                onChange={e => {
                  updateCaseValueSequence({
                    key: 'yearAmounts.0.amount',
                    value: e.target.value,
                  });
                }}
                onBlur={() => {
                  validateCaseDetailSequence();
                }}
              />
            </div>
          </div>
          <fieldset>
            <legend id="date-of-notice-legend">Date of Notice</legend>
            <div className="usa-date-of-birth">
              <div className="usa-form-group usa-form-group-month">
                <label htmlFor="date-of-notice-month" aria-hidden="true">
                  MM
                </label>
                <input
                  aria-describedby="date-of-notice-legend"
                  aria-label="month, two digits"
                  className="usa-input-inline"
                  id="date-of-notice-month"
                  max="12"
                  min="1"
                  name="irsMonth"
                  type="number"
                  value={form.irsMonth || ''}
                  onBlur={() => {
                    validateCaseDetailSequence();
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
                <label htmlFor="date-of-notice-day" aria-hidden="true">
                  DD
                </label>
                <input
                  aria-describedby="date-of-notice-legend"
                  aria-label="day, two digits"
                  className="usa-input-inline"
                  id="date-of-notice-day"
                  max="31"
                  min="1"
                  name="irsDay"
                  type="number"
                  value={form.irsDay || ''}
                  onBlur={() => {
                    validateCaseDetailSequence();
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
                <label htmlFor="date-of-notice-year" aria-hidden="true">
                  YYYY
                </label>
                <input
                  aria-describedby="date-of-notice-legend"
                  aria-label="year, four digits"
                  className="usa-input-inline"
                  id="date-of-notice-year"
                  max="2100"
                  min="1900"
                  name="irsYear"
                  type="number"
                  value={form.irsYear || ''}
                  onBlur={() => {
                    validateCaseDetailSequence();
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
          </fieldset>
        </div>
        <div className="blue-container">
          <h3>Case Information</h3>
          <span className="label">Case Procedure</span>
          <p>{caseDetail.procedureType} Tax Case</p>
          <span className="label">Trial Location</span>
          <p>{caseDetail.preferredTrialCity}</p>
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
                  className="usa-input-inline"
                  id="fee-payment-date-month"
                  max="12"
                  min="1"
                  name="payGovMonth"
                  type="number"
                  value={form.payGovMonth || ''}
                  onBlur={() => {
                    validateCaseDetailSequence();
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
                  className="usa-input-inline"
                  id="fee-payment-date-day"
                  max="31"
                  min="1"
                  name="payGovDay"
                  type="number"
                  value={form.payGovDay || ''}
                  onBlur={() => {
                    validateCaseDetailSequence();
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
                  className="usa-input-inline"
                  id="fee-payment-date-year"
                  max="2100"
                  min="1900"
                  name="payGovYear"
                  type="number"
                  value={form.payGovYear || ''}
                  onBlur={() => {
                    validateCaseDetailSequence();
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
          </fieldset>
          <div className="usa-form-group">
            <label htmlFor="fee-payment-id">Fee Payment ID</label>
            <input
              id="fee-payment-id"
              name="payGovId"
              type="number"
              value={caseDetail.payGovId || ''}
              onBlur={() => {
                validateCaseDetailSequence();
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
        <button
          aria-disabled={submitting ? 'true' : 'false'}
          className={submitting ? 'usa-button-active' : 'usa-button'}
          disabled={submitting}
          type="submit"
        >
          {submitting && <div className="spinner" />}
          Save
        </button>
      </form>
    );
  },
);
