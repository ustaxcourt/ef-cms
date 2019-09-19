import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const TrialSessionsSummary = connect(
  {
    formattedRecentSessions:
      state.formattedDashboardTrialSessions.formattedRecentSessions,
    formattedUpcomingSessions:
      state.formattedDashboardTrialSessions.formattedUpcomingSessions,
    user: state.user,
  },
  ({ formattedRecentSessions, formattedUpcomingSessions, user }) => {
    return (
      <div aria-label="trial sessions" className="card" id="sessions-summary">
        <div className="grid-container content-wrapper gray">
          <div className="grid-row underlined">
            <div className="  grid-col-8">
              <h3>Upcoming Trial Sessions</h3>
            </div>
            <div className="tablet:grid-col-4">
              <a
                className="usa-link float-right"
                href={`/trial-sessions?judge[userId]=${user.userId}`}
              >
                View All
              </a>
            </div>
          </div>
          <div role="list">
            {!formattedUpcomingSessions.length ? (
              formattedUpcomingSessions.map((trialSession, idx) => (
                <div
                  className="grid-row margin-top-4 margin-bottom-4"
                  key={idx}
                  role="listitem"
                >
                  <div className="tablet:grid-col-6">
                    {trialSession.formattedStartDate}
                  </div>
                  <div className="tablet:grid-col-6">
                    <a
                      href={`/trial-session-working-copy/${trialSession.trialSessionId}`}
                    >
                      {trialSession.trialLocation}
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="padding-top-2 padding-bottom-2">
                You have no upcoming trial sessions.
              </div>
            )}
          </div>
          <div className="grid-row underlined margin-top-4">
            <div className="tablet:grid-col-8">
              <h3>Recent Trial Sessions</h3>
            </div>
            <div className="tablet:grid-col-4">
              <a
                className="usa-link float-right"
                href={`/trial-sessions?type=recent&judge[userId]=${user.userId}`}
              >
                View All
              </a>
            </div>
          </div>
          <div className="margin-bottom-0" role="list">
            {!formattedRecentSessions.length ? (
              formattedRecentSessions.map((trialSession, idx) => (
                <div
                  className="grid-row margin-top-4 margin-bottom-4"
                  key={idx}
                  role="listitem"
                >
                  <div className="tablet:grid-col-6">
                    {trialSession.formattedStartDate}
                  </div>
                  <div className="tablet:grid-col-6">
                    <a
                      href={`/trial-session-working-copy/${trialSession.trialSessionId}`}
                    >
                      {trialSession.trialLocation}
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="padding-top-2 padding-bottom-2">
                You have no recent trial sessions.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
