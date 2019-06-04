import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const UpcomingTrialSessions = connect(
  {
    trialSessions: state.trialSessions,
  },
  ({ trialSessions }) => {
    return (
      <React.Fragment>
        <table
          className="usa-table trial-sessions subsection"
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
          {trialSessions.map((item, idx) => (
            <tbody key={idx}>
              <tr className="trial-sessions-row">
                <td>{idx}</td>
                <td>{item.startDate}</td>
                <td>{item.sessionType}</td>
                <td>
                  {item.city}, {item.state}
                </td>
                <td>{item.judge}</td>
                <td>{item.maxCases}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </React.Fragment>
    );
  },
);
