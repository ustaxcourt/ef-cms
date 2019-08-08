import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const TrialSessionsSummary = connect(
  {
    recentTrialSessions:
      state.formattedDashboardTrialSessions.formattedRecentSessions,
    upcomingTrialSessions:
      state.formattedDashboardTrialSessions.formattedUpcomingSessions,
    user: state.user,
  },
  ({ recentTrialSessions, upcomingTrialSessions, user }) => {
    return (
      <div aria-label="trial sessions" className="card" id="sessions-summary">
        <div className="grid-container content-wrapper gray">
          <div className="grid-row underlined">
            <div className="grid-col-8">
              <h3>Upcoming Trial Sessions</h3>
            </div>
            <div className="grid-col-4">
              <a
                className="usa-link float-right"
                href={`/trial-sessions?judge=${user.userId}`}
              >
                View All
              </a>
            </div>
          </div>
          <div role="list">
            {upcomingTrialSessions.map((trialDate, idxDate) => (
              <div
                className="grid-row margin-top-4 margin-bottom-4"
                key={idxDate}
                role="listitem"
              >
                <div className="grid-col-6">{trialDate.formattedStartDate}</div>
                <div className="grid-col-6">
                  <a href="/trial-session-details/">
                    {trialDate.trialLocation}
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="grid-row underlined margin-top-4">
            <div className="grid-col-8">
              <h3>Recent Trial Sessions</h3>
            </div>
            <div className="grid-col-4">
              <a
                className="usa-link float-right"
                href={`/trial-sessions?type=recent&judge=${user.userId}`}
              >
                View All
              </a>
            </div>
          </div>
          <div className="margin-bottom-0" role="list">
            {recentTrialSessions.map((trialDate, idxDate) => (
              <div
                className="grid-row margin-top-4 margin-bottom-4"
                key={idxDate}
                role="listitem"
              >
                <div className="grid-col-6">{trialDate.formattedStartDate}</div>
                <div className="grid-col-6">
                  <a href="/trial-session-details/">
                    {trialDate.trialLocation}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
);
