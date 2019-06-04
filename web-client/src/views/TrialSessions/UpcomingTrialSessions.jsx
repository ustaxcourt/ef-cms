import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const UpcomingTrialSessions = connect(
  {
    formattedSessions: state.formattedTrialSessions,
  },
  ({ formattedSessions }) => {
    return (
      <React.Fragment>
        <table
          className="usa-table ustc-table trial-sessions subsection"
          id="upcoming-sessions"
          aria-describedby="tab-my-queue-TODO"
        >
          <thead>
            <tr>
              <th aria-label="Number">No.</th>
              <th>Date</th>
              <th>Type</th>
              <th>Location</th>
              <th>Judge</th>
              <th aria-label="Number of cases">No. of Cases</th>
            </tr>
          </thead>
          {formattedSessions.map((trialDate, idxDate) => (
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
                    <td>{idx + 1}</td>
                    <td>{item.startDate}</td>
                    <td>{item.sessionType}</td>
                    <td>
                      <button className="usa-button--unstyled link">
                        {item.trialLocation}
                      </button>
                    </td>
                    <td>{item.judge || 'Judge Dredd'}</td>
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
