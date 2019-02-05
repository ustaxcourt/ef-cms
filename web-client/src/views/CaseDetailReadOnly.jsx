import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export default connect(
  {
    caseDetail: state.caseDetail,
    caseDetailErrors: state.caseDetailErrors,
    formattedCaseDetail: state.formattedCaseDetail,
  },
  function PetitionEdit({ caseDetail, formattedCaseDetail }) {
    return (
      <React.Fragment>
        <div className="blue-container">
          <h3>IRS Notice(s)</h3>
          <span className="label">Type of Notice</span>
          <p>{caseDetail.caseType}</p>

          <h3>Date of Notice</h3>
          <p>{caseDetail.formattedIrsNoticeDate}</p>
          <div>
            {formattedCaseDetail.yearAmountsFormatted.map((yearAmount, idx) => (
              <div key={idx}>
                <div className="inline-input-year">
                  {idx === 0 && <label htmlFor="year">Year</label>}
                  <p id={idx}>{yearAmount.year}</p>
                </div>
                <div className="inline-input-amount">
                  {idx === 0 && <label htmlFor="amount">Amount</label>}
                  <span aria-hidden="true" role="presentation">
                    $
                  </span>
                  <span
                    aria-label="IRS Notice Amount in whole dollars"
                    id="amount"
                  />
                  {yearAmount.amount}
                  <span aria-hidden="true" role="presentation">
                    .00
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="blue-container">
          <h3>Case Information</h3>
          <span className="label">Case Procedure</span>
          <p>{caseDetail.procedureType} Tax Case</p>
          <span className="label">Trial Location</span>
          <p>{caseDetail.preferredTrialCity}</p>
          <h3>Filing Date</h3>
          <p>{caseDetail.formattedPayGovDate || 'Unpaid'}</p>
          <h3>Fee Payment ID</h3>
          <p id="fee-payment-id" name="payGovId">
            {caseDetail.payGovId || 'Unpaid'}
          </p>
        </div>
      </React.Fragment>
    );
  },
);
