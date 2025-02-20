import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@tanstack/react-router';
import {
  isTrialSessionRow,
  isTrialSessionWeek,
  TrialSessionRow,
  TrialSessionWeek,
} from '@web-client/presenter/computeds/trialSessionsHelper';
import React from 'react';

export const PublicTrialSessionsTable = ({
  trialSessionsCount,
  trialSessionRows,
}: {
  trialSessionsCount: number;
  trialSessionRows: (TrialSessionRow | TrialSessionWeek)[];
}) => {
  return (
    <>
      <div className="grid-row margin-bottom-2 width-full flex-align-center"></div>
      <div className="text-right width-full">
        <span className="text-semibold">Count: </span>
        {trialSessionsCount}
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
          {trialSessionRows.map(row => {
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
                    <td
                      data-testid={`trial-location-link-${row.trialSessionId}`}
                    >
                      <Link
                        to="/trial-session-detail/$trialSessionId"
                        params={{ trialSessionId: row.trialSessionId }}
                      >
                        {row.trialLocation}
                      </Link>
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
      {trialSessionRows.length === 0 && (
        <p>There are no trial sessions for the selected filters.</p>
      )}
      <div className="padding-1" />
    </>
  );
};
