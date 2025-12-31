import { Accordion, AccordionItem } from '../../ustc-ui/Accordion/Accordion';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { FormattedTrialSession } from '@web-client/presenter/computeds/formattedClerkOfCourtDashboardTrialSessions';
import { CLERK_OF_COURT_DASHBOARD_LABELS } from '@shared/business/entities/EntityConstants';
import React from 'react';

type WeekType = 'current' | 'next';

type ClerkOfCourtTrialSessionsSummaryProps = {
  formattedClerkOfCourtDashboardTrialSessions?: {
    formattedCurrentWeekSessions: FormattedTrialSession[];
    formattedNextWeekSessions: FormattedTrialSession[];
  };
};

const getTrialLocationAriaLabel = (trialLocation?: string): string => {
  const location = trialLocation || 'trial session';
  return `View trial session details for ${location}`;
};

const getFieldValue = (value: string | undefined, fallback: string): string => {
  return value || fallback;
};

const renderTrialSessionsHeader = () => (
  <h2 className="margin-top-4 margin-bottom-4">
    {CLERK_OF_COURT_DASHBOARD_LABELS.TRIAL_SESSIONS_HEADER}
  </h2>
);

const renderTrialSessionMobile = (
  session: FormattedTrialSession,
  weekType: WeekType,
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
      role="listitem"
    >
      <div className="grid-row grid-gap-2">
        <div className="grid-col-6">
          <div>
            <strong>{CLERK_OF_COURT_DASHBOARD_LABELS.FIELD_START_DATE}</strong>
          </div>
          <div className="margin-top-05">{session.formattedStartDate}</div>
        </div>
        <div className="grid-col-6">
          <div>
            <strong>{CLERK_OF_COURT_DASHBOARD_LABELS.FIELD_PROC_TYPE}</strong>
          </div>
          <div className="margin-top-05">{session.proceedingType}</div>
        </div>
      </div>
      <div className="grid-row grid-gap-2">
        <div className="grid-col-12">
          <div>
            <strong>{CLERK_OF_COURT_DASHBOARD_LABELS.FIELD_CITY}</strong>
          </div>
          <div className="margin-top-05">
            <a
              aria-label={getTrialLocationAriaLabel(session.trialLocation)}
              data-testid={`trial-location-link-${session.trialSessionId}`}
              href={`/trial-session-detail/${session.trialSessionId}`}
            >
              {getFieldValue(
                session.trialLocation,
                CLERK_OF_COURT_DASHBOARD_LABELS.FALLBACK_EMPTY,
              )}
            </a>
          </div>
        </div>
      </div>
      <div className="grid-row grid-gap-2">
        <div className="grid-col-6">
          <div>
            <strong>
              {CLERK_OF_COURT_DASHBOARD_LABELS.FIELD_EST_END_DATE}
            </strong>
          </div>
          <div>
            {getFieldValue(
              session.formattedEstimatedEndDate,
              CLERK_OF_COURT_DASHBOARD_LABELS.FALLBACK_EMPTY,
            )}
          </div>
        </div>
        <div className="grid-col-6">
          <div>
            <strong>
              {CLERK_OF_COURT_DASHBOARD_LABELS.FIELD_SESSION_TYPE}
            </strong>
          </div>
          <div>{session.sessionType}</div>
        </div>
      </div>
      <div className="grid-row grid-gap-2">
        <div className="grid-col-6">
          <div>
            <strong>{CLERK_OF_COURT_DASHBOARD_LABELS.FIELD_JUDGE}</strong>
          </div>
          <div>
            {getFieldValue(
              session.judge?.name,
              CLERK_OF_COURT_DASHBOARD_LABELS.FALLBACK_UNASSIGNED,
            )}
          </div>
        </div>
        <div className="grid-col-6">
          <div>
            <strong>{CLERK_OF_COURT_DASHBOARD_LABELS.FIELD_CLERK}</strong>
          </div>
          <div>
            {getFieldValue(
              session.trialClerk?.name,
              CLERK_OF_COURT_DASHBOARD_LABELS.FALLBACK_EMPTY,
            )}
          </div>
        </div>
      </div>
      {!isLast && (
        <hr
          aria-hidden="true"
          className="margin-top-3 margin-bottom-0 trial-session-divider"
        />
      )}
    </div>
  );
};

const renderTrialSession = (
  session: FormattedTrialSession,
  weekType: WeekType,
  isLast: boolean,
) => {
  if (!session.trialSessionId) {
    return null;
  }

  return (
    <React.Fragment key={session.trialSessionId}>
      <NonMobile>
        <div
          data-testid={`${weekType}-week-session-${session.trialSessionId}`}
          className="margin-3"
          role="listitem"
        >
          <div className="grid-row grid-gap-2">
            <div className="tablet:grid-col-3">
              <div>
                <strong>
                  {CLERK_OF_COURT_DASHBOARD_LABELS.FIELD_START_DATE}
                </strong>
              </div>
              <div className="margin-top-05">{session.formattedStartDate}</div>
            </div>
            <div className="tablet:grid-col-3">
              <div>
                <strong>
                  {CLERK_OF_COURT_DASHBOARD_LABELS.FIELD_PROC_TYPE}
                </strong>
              </div>
              <div className="margin-top-05">{session.proceedingType}</div>
            </div>
            <div className="tablet:grid-col-3">
              <div>
                <strong>{CLERK_OF_COURT_DASHBOARD_LABELS.FIELD_CITY}</strong>
              </div>
              <div className="margin-top-05">
                <a
                  aria-label={getTrialLocationAriaLabel(session.trialLocation)}
                  data-testid={`trial-location-link-${session.trialSessionId}`}
                  href={`/trial-session-detail/${session.trialSessionId}`}
                >
                  {session.trialLocation ||
                    CLERK_OF_COURT_DASHBOARD_LABELS.FALLBACK_EMPTY}
                </a>
              </div>
            </div>
            <div className="tablet:grid-col-3"></div>
          </div>
          <div className="grid-row grid-gap-2">
            <div className="tablet:grid-col-3">
              <div>
                <strong>
                  {CLERK_OF_COURT_DASHBOARD_LABELS.FIELD_EST_END_DATE}
                </strong>
              </div>
              <div>
                {session.formattedEstimatedEndDate ||
                  CLERK_OF_COURT_DASHBOARD_LABELS.FALLBACK_EMPTY}
              </div>
            </div>
            <div className="tablet:grid-col-3">
              <div>
                <strong>
                  {CLERK_OF_COURT_DASHBOARD_LABELS.FIELD_SESSION_TYPE}
                </strong>
              </div>
              <div>{session.sessionType}</div>
            </div>
            <div className="tablet:grid-col-3">
              <div>
                <strong>{CLERK_OF_COURT_DASHBOARD_LABELS.FIELD_JUDGE}</strong>
              </div>
              <div>
                {session.judge?.name ||
                  CLERK_OF_COURT_DASHBOARD_LABELS.FALLBACK_UNASSIGNED}
              </div>
            </div>
            <div className="tablet:grid-col-3">
              <div>
                <strong>{CLERK_OF_COURT_DASHBOARD_LABELS.FIELD_CLERK}</strong>
              </div>
              <div>
                {session.trialClerk?.name ||
                  CLERK_OF_COURT_DASHBOARD_LABELS.FALLBACK_EMPTY}
              </div>
            </div>
          </div>
          {!isLast && (
            <hr
              aria-hidden="true"
              className="margin-top-3 margin-bottom-0 trial-session-divider"
            />
          )}
        </div>
      </NonMobile>
      <Mobile>{renderTrialSessionMobile(session, weekType, isLast)}</Mobile>
    </React.Fragment>
  );
};

const renderWeekSection = (
  title: string,
  sessions: FormattedTrialSession[],
  weekType: WeekType,
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
            <div className="trial-sessions-scrollable" role="list">
              {sessions.map((session, index) =>
                renderTrialSession(
                  session,
                  weekType,
                  index === sessions.length - 1,
                ),
              )}
            </div>
          ) : (
            <div
              aria-live="polite"
              className="padding-top-2 padding-bottom-2"
              role="status"
            >
              {emptyMessage}
            </div>
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
  }: ClerkOfCourtTrialSessionsSummaryProps) {
    const {
      formattedCurrentWeekSessions = [],
      formattedNextWeekSessions = [],
    } = formattedClerkOfCourtDashboardTrialSessions || {};

    return (
      <>
        <NonMobile>
          {renderTrialSessionsHeader()}
          <div className="grid-row grid-gap">
            <div className="grid-col-6">
              {renderWeekSection(
                CLERK_OF_COURT_DASHBOARD_LABELS.WEEK_CURRENT,
                formattedCurrentWeekSessions,
                'current',
                CLERK_OF_COURT_DASHBOARD_LABELS.EMPTY_MESSAGE_CURRENT_WEEK,
                'current-week-trial-sessions-card',
              )}
            </div>
            <div className="grid-col-6">
              {renderWeekSection(
                CLERK_OF_COURT_DASHBOARD_LABELS.WEEK_NEXT,
                formattedNextWeekSessions,
                'next',
                CLERK_OF_COURT_DASHBOARD_LABELS.EMPTY_MESSAGE_NEXT_WEEK,
                'next-week-trial-sessions-card',
              )}
            </div>
          </div>
        </NonMobile>
        <Mobile>
          {renderTrialSessionsHeader()}
          <div className="grid-row grid-gap">
            <div className="grid-col-12">
              {renderWeekSection(
                CLERK_OF_COURT_DASHBOARD_LABELS.WEEK_CURRENT,
                formattedCurrentWeekSessions,
                'current',
                CLERK_OF_COURT_DASHBOARD_LABELS.EMPTY_MESSAGE_CURRENT_WEEK,
                'current-week-trial-sessions-card',
              )}
            </div>
            <div className="grid-col-12 margin-top-4">
              {renderWeekSection(
                CLERK_OF_COURT_DASHBOARD_LABELS.WEEK_NEXT,
                formattedNextWeekSessions,
                'next',
                CLERK_OF_COURT_DASHBOARD_LABELS.EMPTY_MESSAGE_NEXT_WEEK,
                'next-week-trial-sessions-card',
              )}
            </div>
          </div>
        </Mobile>
      </>
    );
  },
);

ClerkOfCourtTrialSessionsSummary.displayName =
  'ClerkOfCourtTrialSessionsSummary';
