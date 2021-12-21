import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TrialCityOptions } from '../TrialCityOptions';
import { connect } from '@cerebral/react';
import { props, state } from 'cerebral';
import React from 'react';

export const TrialSessionsTable = connect(
  {
    formattedTrialSessions:
      state.formattedTrialSessions.filteredTrialSessions[props.filter],
    proceedingTypes: state.constants.TRIAL_SESSION_PROCEEDING_TYPES,
    trialSessionTypes: state.constants.TRIAL_SESSION_TYPES,
    trialSessionsHelper: state.trialSessionsHelper,
  },
  function TrialSessionsTable({
    formattedTrialSessions,
    proceedingTypes,
    trialSessionsHelper,
    trialSessionTypes,
  }) {
    return (
      <React.Fragment>
        {console.log('*****formattedTrialSessions: ', formattedTrialSessions)}
        <div className="grid-row margin-bottom-3">
          <div className="tablet:grid-col-7">
            <div className="grid-row grid-gap">
              <div className="col tablet:grid-col-2 padding-top-05">
                <h3 id="filterHeading">Filter by</h3>
              </div>
              <div className="col">
                <BindedSelect
                  aria-label="location"
                  bind="screenMetadata.trialSessionFilters.trialLocation"
                  id="locationFilter"
                  name="trialLocation"
                >
                  <option value="">-Location-</option>
                  <TrialCityOptions procedureType="AllPlusStandalone" />
                </BindedSelect>
              </div>
              <div className="col">
                <BindedSelect
                  aria-label="proceeding"
                  bind="screenMetadata.trialSessionFilters.proceedingType"
                  id="proceedingFilter"
                  name="proceedingType"
                >
                  <option value="">-Proceeding Type-</option>
                  {Object.values(proceedingTypes).map(proceedingType => (
                    <option key={proceedingType} value={proceedingType}>
                      {proceedingType}
                    </option>
                  ))}
                </BindedSelect>
              </div>
              <div className="col">
                <BindedSelect
                  aria-label="session"
                  bind="screenMetadata.trialSessionFilters.sessionType"
                  id="sessionFilter"
                  name="sessionType"
                >
                  <option value="">-Session type-</option>
                  {Object.values(trialSessionTypes).map(sessionType => (
                    <option key={sessionType} value={sessionType}>
                      {sessionType}
                    </option>
                  ))}
                </BindedSelect>
              </div>
              <div className="col">
                <BindedSelect
                  aria-label="judge"
                  bind="screenMetadata.trialSessionFilters.judge.userId"
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
            </div>
          </div>
        </div>
        <table
          aria-describedby="filterHeading locationFilter proceedingFilter sessionFilter judgeFilter"
          aria-label={`${props.filter} trial sessions`}
          className="usa-table ustc-table trial-sessions subsection"
          id={`${props.filter}-sessions`}
        >
          <thead>
            <tr>
              <th>Date</th>
              <th className="icon-column" />
              <th>Location</th>
              <th>Proceeding Type</th>
              <th>Session Type</th>
              <th>Judge</th>
              {trialSessionsHelper.showNoticeIssued && <th>Notice issued</th>}
              {trialSessionsHelper.showSessionStatus && <th>Session Status</th>}
            </tr>
          </thead>
          {formattedTrialSessions.map(trialDate => (
            <React.Fragment key={trialDate.startOfWeekSortable}>
              <tbody>
                <tr className="trial-date">
                  <td colSpan={6 + trialSessionsHelper.additionalColumnsShown}>
                    <h4 className="margin-bottom-0">
                      {trialDate.dateFormatted}
                    </h4>
                  </td>
                </tr>
              </tbody>
              {trialDate.sessions.map(item => (
                <tbody key={item.trialSessionId}>
                  <tr className="trial-sessions-row">
                    <td>{item.formattedStartDate}</td>
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
                    <td>
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
