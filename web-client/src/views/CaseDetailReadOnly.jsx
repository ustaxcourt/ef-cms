import { CaseDetailReadOnlyPartyInformation } from './CaseDetailReadOnlyPartyInformation';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseDetailReadOnly = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
  },
  ({ formattedCaseDetail }) => {
    return (
      <React.Fragment>
        <CaseDetailReadOnlyPartyInformation />

        <div className="blue-container">
          <h3>Case Information</h3>
          <div className="label">Case procedure</div>
          <p>{formattedCaseDetail.procedureType} Tax Case</p>
          <div className="label">Trial Location</div>
          <p>{formattedCaseDetail.preferredTrialCity}</p>
          <div className="label">Fee Payment Date</div>
          <p>{formattedCaseDetail.payGovDateFormatted || 'Unpaid'}</p>
          <div className="label">Fee Payment ID</div>
          <p id="fee-payment-id" name="payGovId">
            {formattedCaseDetail.payGovId || 'Unpaid'}
          </p>
        </div>

        <div className="blue-container">
          <h3>IRS Notice(s)</h3>

          <span className="label">Notice/case type</span>
          <p>{formattedCaseDetail.caseType}</p>

          <div className="label">Notice Date</div>
          <p>{formattedCaseDetail.irsNoticeDateFormatted}</p>
        </div>
      </React.Fragment>
    );
  },
);
