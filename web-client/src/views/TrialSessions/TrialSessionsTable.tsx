import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const TrialSessionsTable = connect(
  {
    formattedTrialSessions:
      state.formattedTrialSessions.filteredTrialSessions[props.filter],
    trialSessionsHelper: state.trialSessionsHelper,
  },
  function TrialSessionsTable({
    formattedTrialSessions,
    trialSessionsHelper,
  }: {
    formattedTrialSessions: any[];
    trialSessionsHelper: {
      additionalColumnsShown: number;
      showNoticeIssued: boolean;
      showSessionStatus: boolean;
      showUnassignedJudgeFilter: boolean;
      trialSessionJudges: any[];
    };
  }) {
    return (
      <>
        <table
          aria-describedby="trial-sessions-filter-label locationFilter proceedingFilter sessionFilter judgeFilter"
          aria-label={`${props.filter} trial sessions`}
          className="usa-table ustc-table trial-sessions subsection"
          id={`${props.filter}-sessions`}
        >
          <thead>
            <tr>
              <th>Start Date</th>
              <th>Est. End Date</th>
              <th className="icon-column" />
              <th>Location</th>
              <th>Proceeding Type</th>
              <th>Session Type</th>
              <th>Judge</th>
              {trialSessionsHelper.showNoticeIssued && <th>Notice Issued</th>}
              {trialSessionsHelper.showSessionStatus && <th>Session Status</th>}
            </tr>
          </thead>
          {formattedTrialSessions.map(trialDate => (
            <React.Fragment key={trialDate.startOfWeekSortable}>
              <tbody>
                <tr className="trial-date">
                  <td colSpan={7 + trialSessionsHelper.additionalColumnsShown}>
                    <h4 className="margin-bottom-0">
                      {'Week of '}
                      {trialDate.dateFormatted}
                    </h4>
                  </td>
                </tr>
              </tbody>
              {trialDate.sessions.map(item => (
                <tbody key={item.trialSessionId}>
                  <tr
                    className="trial-sessions-row"
                    data-testid={`trial-sessions-row-${item.trialSessionId}`}
                  >
                    <td>
                      {item.showAlertForNOTTReminder && (
                        <FontAwesomeIcon
                          className="fa-icon-blue margin-right-05"
                          icon="clock"
                          size="sm"
                          title={item.alertMessageForNOTT}
                        />
                      )}
                      {item.formattedStartDate}
                    </td>
                    <td>{item.formattedEstimatedEndDate}</td>
                    <td>
                      {item.swingSession && (
                        <FontAwesomeIcon
                          className="fa-icon-blue"
                          icon="link"
                          size="sm"
                          title="swing session"
                        />
                      )}
                    </td>
                    <td
                      data-testid={`trial-location-link-${item.trialSessionId}`}
                    >
                      <a
                        href={
                          item.userIsAssignedToSession
                            ? `/trial-session-working-copy/${item.trialSessionId}`
                            : `/trial-session-detail/${item.trialSessionId}`
                        }
                      >
                        {item.trialLocation}
                      </a>
                    </td>
                    <td>{item.proceedingType}</td>
                    <td>{item.sessionType}</td>
                    <td>{item.judge && item.judge.name}</td>
                    {trialSessionsHelper.showNoticeIssued && (
                      <td>{item.formattedNoticeIssuedDate}</td>
                    )}
                    {trialSessionsHelper.showSessionStatus && (
                      <td>{item.sessionStatus}</td>
                    )}
                  </tr>
                </tbody>
              ))}
            </React.Fragment>
          ))}
        </table>
        {formattedTrialSessions.length === 0 && (
          <p>There are no trial sessions.</p>
        )}
      </>
    );
  },
);

TrialSessionsTable.displayName = 'TrialSessionsTable';
