import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

type FormattedTrialSession = {
  trialSessionId?: string;
  formattedStartDate: string;
  formattedEstimatedEndDate: string;
  trialLocation?: string;
  proceedingType: string;
  sessionType: string;
  judge?: { name: string; userId: string };
  trialClerk?: { name: string; userId: string };
};

const renderTrialSession = (
  session: FormattedTrialSession,
  weekType: 'current' | 'next',
  isLast: boolean,
) => {
  if (!session.trialSessionId) {
    return null;
  }

  return (
    <div
      key={session.trialSessionId}
      data-testid={`${weekType}-week-session-${session.trialSessionId}`}
    >
      <div className="grid-row">
        <div className="tablet:grid-col-4">
          <strong>Start Date:</strong> {session.formattedStartDate}
        </div>
        <div className="tablet:grid-col-4">
          <strong>Proc. Type:</strong> {session.proceedingType}
        </div>
        <div className="tablet:grid-col-4">
          <strong>City:</strong>{' '}
          <a
            data-testid={`trial-location-link-${session.trialSessionId}`}
            href={`/trial-session-detail/${session.trialSessionId}`}
          >
            {session.trialLocation}
          </a>
        </div>
      </div>
      <div className="grid-row margin-top-1">
        <div className="tablet:grid-col-3">
          <strong>Est. End Date:</strong>{' '}
          {session.formattedEstimatedEndDate || '—'}
        </div>
        <div className="tablet:grid-col-3">
          <strong>Session Type:</strong> {session.sessionType}
        </div>
        <div className="tablet:grid-col-3">
          <strong>Judge:</strong> {session.judge?.name || 'Unassigned'}
        </div>
        <div className="tablet:grid-col-3">
          <strong>Clerk:</strong> {session.trialClerk?.name || '—'}
        </div>
      </div>
      {!isLast && (
        <hr
          className="margin-top-2 margin-bottom-2"
          style={{ borderTop: '1px solid #d6d7d9' }}
        />
      )}
    </div>
  );
};

const renderWeekSection = (
  title: string,
  sessions: FormattedTrialSession[],
  weekType: 'current' | 'next',
  emptyMessage: string,
  testId: string,
) => (
  <div className="card height-full" data-testid={testId}>
    <div
      className="header-with-blue-background"
      style={{ backgroundColor: '#005EA2' }}
    >
      <h3 style={{ fontSize: '1.1rem', fontWeight: 'normal' }}>
        {title} ({sessions.length})
      </h3>
    </div>
    <div className="content-wrapper gray height-full">
      {sessions.length > 0 ? (
        <div
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            paddingRight: '10px',
          }}
        >
          {sessions.map((session, index) =>
            renderTrialSession(
              session,
              weekType,
              index === sessions.length - 1,
            ),
          )}
        </div>
      ) : (
        <div className="padding-top-2 padding-bottom-2">{emptyMessage}</div>
      )}
    </div>
  </div>
);

export const ClerkOfCourtTrialSessionsSummary = connect(
  {
    formattedClerkOfCourtDashboardTrialSessions:
      state.formattedClerkOfCourtDashboardTrialSessions,
  },
  function ClerkOfCourtTrialSessionsSummary({
    formattedClerkOfCourtDashboardTrialSessions,
  }: {
    formattedClerkOfCourtDashboardTrialSessions?: {
      formattedCurrentWeekSessions: FormattedTrialSession[];
      formattedNextWeekSessions: FormattedTrialSession[];
    };
  }) {
    const {
      formattedCurrentWeekSessions = [],
      formattedNextWeekSessions = [],
    } = formattedClerkOfCourtDashboardTrialSessions || {};

    return (
      <>
        <h1>
          Trial Sessions
          <Button
            link
            className="margin-left-205"
            data-testid="view-all-trial-sessions-button"
            href="/trial-sessions"
          >
            View All
          </Button>
        </h1>
        <div className="grid-row grid-gap">
          <div className="grid-col-6">
            {renderWeekSection(
              'Trial Sessions This Week',
              formattedCurrentWeekSessions,
              'current',
              'There are no trial sessions for the current week.',
              'current-week-trial-sessions-card',
            )}
          </div>
          <div className="grid-col-6">
            {renderWeekSection(
              'Trial Sessions Next Week',
              formattedNextWeekSessions,
              'next',
              'There are no trial sessions for the next week.',
              'next-week-trial-sessions-card',
            )}
          </div>
        </div>
      </>
    );
  },
);

ClerkOfCourtTrialSessionsSummary.displayName =
  'ClerkOfCourtTrialSessionsSummary';
