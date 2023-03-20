import React from 'react';

export const SessionAssignmentsSection = ({ formattedTrialSession }) => {
  return (
    <div className="card">
      <div className="card-header">Assignments</div>
      <div className="card-content assignments-container">
        <div className="assignments-row">
          <div className="assignments-row-content wrap-text-content">
            <div className="text-bold">Judge</div>
            <div>{formattedTrialSession.formattedJudge}</div>
            <div>{formattedTrialSession.formattedChambersPhoneNumber}</div>
          </div>
          <div className="assignments-row-content wrap-text-content">
            <div className="text-bold">Trial clerk</div>
            <div>{formattedTrialSession.formattedTrialClerk}</div>
          </div>
        </div>
        <div className="assignments-row">
          <div className="assignments-row-content wrap-text-content">
            <div className="text-bold">Court reporter</div>
            <div>{formattedTrialSession.formattedCourtReporter}</div>
          </div>
          <div className="assignments-row-content wrap-text-content">
            <div className="text-bold">IRS calendar administrator</div>
            <div>{formattedTrialSession.formattedIrsCalendarAdministrator}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
