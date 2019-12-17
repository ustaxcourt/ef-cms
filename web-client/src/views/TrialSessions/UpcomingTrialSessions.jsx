import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TrialCityOptions } from '../TrialCityOptions';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const UpcomingTrialSessions = connect(
  {
    formattedTrialSessions: state.formattedTrialSessions.formattedSessions,
    trialSessionTypes: state.constants.TRIAL_SESSION_TYPES,
    users: state.users,
  },
  ({ formattedTrialSessions, trialSessionTypes, users }) => {
    return (
      <React.Fragment>
        <div className="grid-row margin-bottom-3">
          <div className="tablet:grid-col-7">
            <div className="grid-row grid-gap">
              <div className="grid-col-3 tablet:grid-col-2 padding-top-05">
                <h3 id="filterHeading">Filter by</h3>
              </div>
              <div className="grid-col-3">
                <BindedSelect
                  ariaLabel="session"
                  bind="screenMetadata.trialSessionFilters.sessionType"
                  id="sessionFilter"
                  name="sessionType"
                >
                  <option value="">-Session type-</option>
                  {trialSessionTypes.map(sessionType => (
                    <option key={sessionType} value={sessionType}>
                      {sessionType}
                    </option>
                  ))}
                </BindedSelect>
              </div>
              <div className="grid-col-3">
                <BindedSelect
                  ariaLabel="location"
                  bind="screenMetadata.trialSessionFilters.trialLocation"
                  id="locationFilter"
                  name="trialLocation"
                >
                  <option value="">-Location-</option>
                  <TrialCityOptions />
                </BindedSelect>
              </div>
              <div className="grid-col-3">
                <BindedSelect
                  ariaLabel="judge"
                  bind="screenMetadata.trialSessionFilters.judge.userId"
                  id="judgeFilter"
                  name="judge"
                >
                  <option value="">-Judge-</option>
                  {users.map((judge, idx) => (
                    <option key={idx} value={judge.userId}>
                      {judge.name}
                    </option>
                  ))}
                </BindedSelect>
              </div>
            </div>
          </div>
        </div>
        <table
          aria-describedby="filterHeading sessionFilter locationFilter judgeFilter"
          aria-label="upcoming trial sessions"
          className="usa-table ustc-table trial-sessions subsection"
          id="upcoming-sessions"
        >
          <thead>
            <tr>
              <th>Date</th>
              <th aria-hidden="true" className="icon-column" />
              <th>Location</th>
              <th>Type</th>
              <th>Judge</th>
              <th aria-label="Number of cases">No. of cases</th>
            </tr>
          </thead>
          {formattedTrialSessions.map((trialDate, idxDate) => (
            <React.Fragment key={idxDate}>
              <tbody>
                <tr className="trial-date">
                  <td colSpan="6">
                    <h4 className="margin-bottom-0">
                      {trialDate.dateFormatted}
                    </h4>
                  </td>
                </tr>
              </tbody>
              {trialDate.sessions.map((item, idx) => (
                <tbody key={idx}>
                  <tr className="trial-sessions-row">
                    <td>{item.formattedStartDate}</td>
                    <td aria-hidden="true">
                      {item.swingSession && (
                        <FontAwesomeIcon
                          className="fa-icon-blue"
                          icon="link"
                          size="sm"
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
                    <td>{item.sessionType}</td>
                    <td>{item.judge && item.judge.name}</td>
                    <td>{item.maxCases}</td>
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
