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

const TABLE_HEADERS = (
  <tr>
    <th className="width-card">Start Date</th>
    <th className="width-card">Est. End Date</th>
    <th className="width-mobile">Location</th>
    <th className="width-card-lg">Proceeding Type</th>
    <th className="width-card">Session Type</th>
    <th className="width-card">Judge</th>
    <th className="width-card">Trial Clerk</th>
  </tr>
);

const renderTrialSessionRow = (
  session: FormattedTrialSession,
  weekType: 'current' | 'next',
) => {
  if (!session.trialSessionId) {
    return null;
  }

  return (
    <tr
      key={session.trialSessionId}
      className="trial-sessions-row"
      data-testid={`${weekType}-week-session-${session.trialSessionId}`}
    >
      <td>{session.formattedStartDate}</td>
      <td>{session.formattedEstimatedEndDate}</td>
      <td>
        <a
          data-testid={`trial-location-link-${session.trialSessionId}`}
          href={`/trial-session-detail/${session.trialSessionId}`}
        >
          {session.trialLocation}
        </a>
      </td>
      <td>{session.proceedingType}</td>
      <td>{session.sessionType}</td>
      <td>{session.judge?.name || 'Unassigned'}</td>
      <td>{session.trialClerk?.name || '—'}</td>
    </tr>
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
        <div className="overflow-x-auto">
          <div className="minw-tablet-lg">
            <table
              aria-label={`${title} trial sessions`}
              className="usa-table ustc-table trial-sessions"
            >
              <thead>{TABLE_HEADERS}</thead>
              <tbody>
                {sessions.map(session =>
                  renderTrialSessionRow(session, weekType),
                )}
              </tbody>
            </table>
          </div>
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
