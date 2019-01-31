import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import UpdateCaseCancelModalDialog from './UpdateCaseCancelModalDialog';

export default connect(
  {
    caseDetail: state.caseDetail,
    submitting: state.submitting,
    showModal: state.showModal,
  },
  function PetitionEdit({ caseDetail, submitting, showModal }) {
    return (
      <form noValidate onSubmit={() => {}} role="form">
        {showModal && <UpdateCaseCancelModalDialog />}
        <div className="blue-container">
          <h3>IRS Notice(s)</h3>
          <span className="label">Type of Notice</span>
          <p>{caseDetail.caseType}</p>
          <div className="usa-grid-full usa-form-group">
            <div className="usa-input-grid usa-input-grid-small">
              <label htmlFor="year">Year</label>
              <input id="year" type="text" />
            </div>
            <div className="usa-input-grid usa-input-grid-medium">
              <label htmlFor="amount">Amount</label>
              <input id="amount" type="text" />
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
                  className="usa-input-inline"
                  aria-describedby="date-of-notice-legend"
                  id="date-of-notice-month"
                  name="month"
                  aria-label="month, two digits"
                  type="number"
                  min="1"
                  max="12"
                  onChange={() => {}}
                />
              </div>
              <div className="usa-form-group usa-form-group-day">
                <label htmlFor="date-of-notice-day" aria-hidden="true">
                  DD
                </label>
                <input
                  className="usa-input-inline"
                  aria-describedby="date-of-notice-legend"
                  aria-label="day, two digits"
                  id="date-of-notice-day"
                  name="day"
                  type="number"
                  min="1"
                  max="31"
                  onChange={() => {}}
                />
              </div>
              <div className="usa-form-group usa-form-group-year">
                <label htmlFor="date-of-notice-year" aria-hidden="true">
                  YYYY
                </label>
                <input
                  className="usa-input-inline"
                  aria-describedby="date-of-notice-legend"
                  aria-label="year, four digits"
                  id="date-of-notice-year"
                  name="year"
                  type="number"
                  min="1900"
                  max="2100"
                  onChange={() => {}}
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
                  className="usa-input-inline"
                  aria-describedby="fee-payment-date-legend"
                  id="fee-payment-date-month"
                  name="month"
                  aria-label="month, two digits"
                  type="number"
                  min="1"
                  max="12"
                  onChange={() => {}}
                />
              </div>
              <div className="usa-form-group usa-form-group-day">
                <label htmlFor="fee-payment-date-day" aria-hidden="true">
                  DD
                </label>
                <input
                  className="usa-input-inline"
                  aria-describedby="fee-payment-date-legend"
                  aria-label="day, two digits"
                  id="fee-payment-date-day"
                  name="day"
                  type="number"
                  min="1"
                  max="31"
                  onChange={() => {}}
                />
              </div>
              <div className="usa-form-group usa-form-group-year">
                <label htmlFor="fee-payment-date-year" aria-hidden="true">
                  YYYY
                </label>
                <input
                  className="usa-input-inline"
                  aria-describedby="fee-payment-date-legend"
                  aria-label="year, four digits"
                  id="fee-payment-date-year"
                  name="year"
                  type="number"
                  min="1900"
                  max="2100"
                  onChange={() => {}}
                />
              </div>
            </div>
          </fieldset>
          <div className="usa-form-group">
            <label htmlFor="fee-payment-id">Fee Payment ID</label>
            <input
              id="fee-payment-id"
              type="number"
              value={caseDetail.payGovId}
              onChange={() => {}}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className={submitting ? 'usa-button-active' : 'usa-button'}
          aria-disabled={submitting ? 'true' : 'false'}
        >
          {submitting && <div className="spinner" />}
          Save
        </button>
      </form>
    );
  },
);
