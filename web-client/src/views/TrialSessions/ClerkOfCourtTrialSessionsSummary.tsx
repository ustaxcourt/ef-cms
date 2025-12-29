import { Accordion, AccordionItem } from '../../ustc-ui/Accordion/Accordion';
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
      className="margin-3"
    >
      <div className="grid-row grid-gap-2">
        <div className="tablet:grid-col-3">
          <div>
            <strong>Start Date</strong>
          </div>
          <div className="margin-top-05">{session.formattedStartDate}</div>
        </div>
        <div className="tablet:grid-col-3">
          <div>
            <strong>Proc. Type</strong>
          </div>
          <div className="margin-top-05">{session.proceedingType}</div>
        </div>
        <div className="tablet:grid-col-3">
          <div>
            <strong>City</strong>
          </div>
          <div className="margin-top-05">
            <a
              data-testid={`trial-location-link-${session.trialSessionId}`}
              href={`/trial-session-detail/${session.trialSessionId}`}
            >
              {session.trialLocation}
            </a>
          </div>
        </div>
        <div className="tablet:grid-col-3"></div>
      </div>
      <div className="grid-row grid-gap-2">
        <div className="tablet:grid-col-3">
          <div>
            <strong>Est. End Date</strong>
          </div>
          <div>{session.formattedEstimatedEndDate || '—'}</div>
        </div>
        <div className="tablet:grid-col-3">
          <div>
            <strong>Session Type</strong>
          </div>
          <div>{session.sessionType}</div>
        </div>
        <div className="tablet:grid-col-3">
          <div>
            <strong>Judge</strong>
          </div>
          <div>{session.judge?.name || 'Unassigned'}</div>
        </div>
        <div className="tablet:grid-col-3">
          <div>
            <strong>Clerk</strong>
          </div>
          <div>{session.trialClerk?.name || '—'}</div>
        </div>
      </div>
      {!isLast && (
        <hr
          className="margin-top-3 margin-bottom-0"
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
  <div data-testid={testId}>
    <Accordion className="clerk-of-court-accordion">
      <AccordionItem
        contentClassName="clerk-of-court-accordion-content"
        dataTestId={`${testId}-accordion`}
        headerClassName="clerk-of-court-accordion-header"
        initiallyOpen={true}
        title={`${title} (${sessions.length})`}
      >
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
      </AccordionItem>
    </Accordion>
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
    );
  },
);

ClerkOfCourtTrialSessionsSummary.displayName =
  'ClerkOfCourtTrialSessionsSummary';
