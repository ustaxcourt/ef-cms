import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const UpcomingTrialSessions = connect(
  {
    formattedTrialSessions: state.formattedTrialSessions.formattedSessions,
  },
  ({ formattedTrialSessions }) => {
    return (
      <React.Fragment>
        <table
          className="usa-table ustc-table trial-sessions subsection"
          id="upcoming-sessions"
          aria-describedby="tab-my-queue-TODO"
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th className="icon-column" aria-hidden="true" />
              <th>Location</th>
              <th>Judge</th>
              <th aria-label="Number of cases">No. of Cases</th>
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
                    <td>{item.sessionType}</td>
                    <td aria-hidden="true">
                      {item.swingSession && (
                        <FontAwesomeIcon
                          icon="link"
                          size="sm"
                          className="fa-icon-blue"
                        />
                      )}
                    </td>
                    <td>
                      <a href={`/trial-session-detail/${item.trialSessionId}`}>
                        {item.trialLocation}
                      </a>
                    </td>
                    <td>{item.judge}</td>
                    <td>{item.maxCases}</td>
                  </tr>
                </tbody>
              ))}
            </React.Fragment>
          ))}
        </table>
      </React.Fragment>
    );
  },
);
