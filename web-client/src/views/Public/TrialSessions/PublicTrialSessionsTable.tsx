import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import {
  isTrialSessionRow,
  isTrialSessionWeek,
} from '@web-client/presenter/computeds/trialSessionsHelper';
import { state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

type PublicTrialSessionsTableProps = {};

const PublicTrialSessionsTableDeps = {
  publicTrialSessionsHelper: state.publicTrialSessionsHelper,
};

export const PublicTrialSessionsTable = connect<
  PublicTrialSessionsTableProps,
  typeof PublicTrialSessionsTableDeps
>(PublicTrialSessionsTableDeps, function ({ publicTrialSessionsHelper }) {
  return (
    <>
      <div className="grid-row margin-bottom-2 width-full flex-align-center"></div>
      <div className="text-right width-full">
        <span className="text-semibold">Count: </span>
        {publicTrialSessionsHelper.trialSessionsCount}
      </div>
      <div className="padding-1"></div>
      <div className="overflow-x-auto">
        <table
          aria-describedby="trial-sessions-filter-label locationFilter proceedingFilter sessionFilter judgeFilter"
          className="usa-table ustc-table trial-sessions"
        >
          <thead>
            <tr>
              <th className="width-mobile">Start Date</th>
              <th aria-label="Swing session icon" className="icon-column" />
              <th className="width-mobile">Location</th>
              <th className="width-mobile">Proceeding Type</th>
              <th className="width-mobile">Session Type</th>
              <th className="width-mobile">Judge</th>
            </tr>
          </thead>
          {publicTrialSessionsHelper.trialSessionRows.map(row => {
            if (isTrialSessionWeek(row)) {
              return (
                <tbody key={row.formattedSessionWeekStartDate}>
                  <tr className="trial-date">
                    <td colSpan={100}>
                      <h4 className="margin-bottom-0">
                        {'Week of '}
                        {row.formattedSessionWeekStartDate}
                      </h4>
                    </td>
                  </tr>
                </tbody>
              );
            }
            if (isTrialSessionRow(row)) {
              return (
                <tbody key={row.trialSessionId}>
                  <tr
                    className="trial-sessions-row"
                    data-testid={`trial-sessions-row-${row.trialSessionId}`}
                  >
                    <td>
                      {row.showAlertForNOTTReminder && (
                        <FontAwesomeIcon
                          className="fa-icon-blue margin-right-05"
                          icon="clock"
                          size="sm"
                          title={row.alertMessageForNOTT}
                        />
                      )}
                      {row.formattedStartDate}
                    </td>
                    <td>
                      {row.swingSession && (
                        <FontAwesomeIcon
                          aria-label="Swing session: will be held in two cities"
                          className="fa-icon-blue"
                          icon="link"
                          size="sm"
                          title="Swing session: will be held in two cities"
                        />
                      )}
                    </td>
                    <td>
                      <a
                        data-testid={`trial-location-link-${row.trialSessionId}`}
                        href={`/trial-session-detail/${row.trialSessionId}`}
                      >
                        {row.trialLocation}
                      </a>
                    </td>
                    <td>{row.proceedingType}</td>
                    <td>{row.sessionType}</td>
                    <td>{row.judge.name}</td>
                  </tr>
                </tbody>
              );
            }
          })}
        </table>
      </div>
      {publicTrialSessionsHelper.trialSessionRows.length === 0 && (
        <p>There are no trial sessions for the selected filters.</p>
      )}
      <div className="padding-1" />
    </>
  );
});
