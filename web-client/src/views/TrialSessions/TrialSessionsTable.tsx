import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { TrialCityOptions } from '../TrialCityOptions';
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
      <React.Fragment>
        <div className="margin-bottom-4">
          <label
            className="dropdown-label-serif margin-right-3"
            htmlFor="inline-select"
            id="trial-sessions-filter-label"
          >
            Filter by
          </label>
          <BindedSelect
            aria-label="location"
            bind="screenMetadata.trialSessionFilters.trialLocation"
            className="select-left width-180 inline-select"
            id="locationFilter"
            name="trialLocation"
          >
            <option value="">-Location-</option>
            <TrialCityOptions procedureType="AllPlusStandalone" />
          </BindedSelect>
          <BindedSelect
            aria-label="proceeding"
            bind="screenMetadata.trialSessionFilters.proceedingType"
            className="select-left width-180 inline-select margin-left-1pt5rem"
            id="proceedingFilter"
            name="proceedingType"
          >
            <option value="">-Proceeding Type-</option>
            {Object.values(TRIAL_SESSION_PROCEEDING_TYPES).map(
              proceedingType => (
                <option key={proceedingType} value={proceedingType}>
                  {proceedingType}
                </option>
              ),
            )}
          </BindedSelect>
          <BindedSelect
            aria-label="session"
            bind="screenMetadata.trialSessionFilters.sessionType"
            className="select-left width-180 inline-select margin-left-1pt5rem"
            id="sessionFilter"
            name="sessionType"
          >
            <option value="">-Session Type-</option>
            {Object.values(SESSION_TYPES).map(sessionType => (
              <option key={sessionType} value={sessionType}>
                {sessionType}
              </option>
            ))}
          </BindedSelect>
          <BindedSelect
            aria-label="judge"
            bind="screenMetadata.trialSessionFilters.judge.userId"
            className="select-left width-180 inline-select margin-left-1pt5rem"
            id="judgeFilter"
            name="judge"
          >
            <option value="">-Judge-</option>
            {trialSessionsHelper.trialSessionJudges.map(judge => (
              <option key={judge.name} value={judge.userId}>
                {judge.name}
              </option>
            ))}

            {trialSessionsHelper.showUnassignedJudgeFilter && (
              <option
                key={trialSessionsHelper.trialSessionJudges.length}
                value="unassigned"
              >
                Unassigned
              </option>
            )}
          </BindedSelect>
        </div>
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
      </React.Fragment>
    );
  },
);

TrialSessionsTable.displayName = 'TrialSessionsTable';
