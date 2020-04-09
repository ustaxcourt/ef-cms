import { CaseDetailReadOnlyPartyInformation } from './CaseDetailReadOnlyPartyInformation';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseDetailReadOnly = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
  },
  function CaseDetailReadOnly({ formattedCaseDetail }) {
    return (
      <React.Fragment>
        <CaseDetailReadOnlyPartyInformation />

        <div className="blue-container">
          <h3>Case Information</h3>
          <div className="label">Case procedure</div>
          <p>{formattedCaseDetail.procedureType} Tax Case</p>
          <div className="label">Trial location</div>
          <p>{formattedCaseDetail.preferredTrialCity}</p>
        </div>

        <div className="blue-container">
          <h3>IRS Notice(s)</h3>

          <span className="label">Notice/case type</span>
          <p>{formattedCaseDetail.caseType}</p>

          <div className="label">Notice date</div>
          <p>{formattedCaseDetail.irsNoticeDateFormatted}</p>
        </div>
      </React.Fragment>
    );
  },
);
