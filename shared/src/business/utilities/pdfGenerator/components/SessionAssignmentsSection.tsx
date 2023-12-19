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
            {!formattedTrialSession.formattedIrsCalendarAdministratorInfo && (
              <p
                className="margin-bottom-0 word-wrap-break-word"
                data-testid="irs-calendar-admin-info"
              >
                {formattedTrialSession.formattedIrsCalendarAdministrator}
              </p>
            )}
            {formattedTrialSession.formattedIrsCalendarAdministratorInfo && (
              <div
                className="margin-bottom-0 word-wrap-break-word"
                data-testid="irs-calendar-admin-info"
              >
                <div data-testid="irs-calendar-admin-info-name">
                  {
                    formattedTrialSession.formattedIrsCalendarAdministratorInfo
                      .name
                  }
                </div>
                <div
                  data-testid="irs-calendar-admin-info-email"
                  style={{
                    overflowWrap: 'break-word',
                    wordBreak: 'break-all',
                  }}
                >
                  {
                    formattedTrialSession.formattedIrsCalendarAdministratorInfo
                      .email
                  }
                </div>
                <div data-testid="irs-calendar-admin-info-phone">
                  {
                    formattedTrialSession.formattedIrsCalendarAdministratorInfo
                      .phone
                  }
                </div>
              </div>
            )}{' '}
          </div>
        </div>
      </div>
    </div>
  );
};
