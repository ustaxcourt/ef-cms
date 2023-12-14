import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const TrialSessionsSummary = connect(
  {
    formattedRecentSessions:
      state.formattedDashboardTrialSessions.formattedRecentSessions,
    formattedUpcomingSessions:
      state.formattedDashboardTrialSessions.formattedUpcomingSessions,
    trialSessionsSummaryHelper: state.trialSessionsSummaryHelper,
  },
  function TrialSessionsSummary({
    formattedRecentSessions,
    formattedUpcomingSessions,
    trialSessionsSummaryHelper,
  }) {
    return (
      <>
        <h1>
          Trial Sessions
          <Button
            link
            className="margin-left-205"
            href={`/trial-sessions?judge[userId]=${trialSessionsSummaryHelper.judgeUserId}`}
          >
            View All
          </Button>
        </h1>
        <div className="grid-row grid-gap">
          <div className="grid-col-6">
            <div
              className="card height-full"
              data-testid="upcoming-trial-sessions-card"
            >
              <div className="content-wrapper gray height-full">
                <h3>Upcoming Trial Sessions</h3>
                <div role="list">
                  {formattedUpcomingSessions.length ? (
                    formattedUpcomingSessions.map(trialSession => (
                      <div
                        className="grid-row margin-top-4 margin-bottom-4"
                        key={trialSession.trialSessionId}
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
              </div>
            </div>
          </div>
          <div className="grid-col-6">
            <div className="card height-full">
              <div className="content-wrapper gray height-full">
                <h3>Recent Trial Sessions</h3>
                <div className="margin-bottom-0" role="list">
                  {formattedRecentSessions.length ? (
                    formattedRecentSessions.map(trialSession => (
                      <div
                        className="grid-row margin-top-4 margin-bottom-4"
                        key={trialSession.trialSessionId}
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
          </div>
        </div>
      </>
    );
  },
);

TrialSessionsSummary.displayName = 'TrialSessionsSummary';
