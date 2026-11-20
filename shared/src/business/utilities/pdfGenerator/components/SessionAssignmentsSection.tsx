import React from 'react';

type SessionAssignmentsTrialSession = {
  formattedChambersPhoneNumber?: string;
  formattedCourtReporter?: string;
  formattedIrsCalendarAdministrator?: string;
  formattedIrsCalendarAdministratorInfo?: {
    email?: string;
    name?: string;
    phone?: string;
  };
  formattedJudge?: string;
  formattedTrialClerk?: string;
  isReportingSession?: boolean;
};

type SessionAssignmentsProps = {
  formattedTrialSession: SessionAssignmentsTrialSession;
};

const IrsCalendarAdministrator = ({
  formattedTrialSession,
}: SessionAssignmentsProps) => (
  <div className="assignments-row-content wrap-text-content">
    <div className="text-bold">IRS calendar administrator</div>
    {!formattedTrialSession.formattedIrsCalendarAdministratorInfo && (
      <div>{formattedTrialSession.formattedIrsCalendarAdministrator}</div>
    )}
    {formattedTrialSession.formattedIrsCalendarAdministratorInfo && (
      <div
        className="margin-bottom-0 word-wrap-break-word"
        data-testid="irs-calendar-admin-info"
      >
        <div data-testid="irs-calendar-admin-info-name">
          {formattedTrialSession.formattedIrsCalendarAdministratorInfo.name}
        </div>
        <div
          data-testid="irs-calendar-admin-info-email"
          style={{
            overflowWrap: 'break-word',
            wordBreak: 'break-all',
          }}
        >
          {formattedTrialSession.formattedIrsCalendarAdministratorInfo.email}
        </div>
        <div data-testid="irs-calendar-admin-info-phone">
          {formattedTrialSession.formattedIrsCalendarAdministratorInfo.phone}
        </div>
      </div>
    )}{' '}
  </div>
);

// Reporting sessions do not have a trial clerk or court reporter
export const SessionAssignmentsSection = ({
  formattedTrialSession,
}: SessionAssignmentsProps) => {
  const { isReportingSession } = formattedTrialSession;

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
          {isReportingSession ? (
            <IrsCalendarAdministrator
              formattedTrialSession={formattedTrialSession}
            />
          ) : (
            <div className="assignments-row-content wrap-text-content">
              <div className="text-bold">Trial clerk</div>
              <div>{formattedTrialSession.formattedTrialClerk}</div>
            </div>
          )}
        </div>
        {!isReportingSession && (
          <div className="assignments-row">
            <div className="assignments-row-content wrap-text-content">
              <div className="text-bold">Court reporter</div>
              <div>{formattedTrialSession.formattedCourtReporter}</div>
            </div>
            <IrsCalendarAdministrator
              formattedTrialSession={formattedTrialSession}
            />
          </div>
        )}
      </div>
    </div>
  );
};
