import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const EligibleCases = connect(
  {
    eligibleCases: state.eligibleCases,
  },
  ({ eligibleCases }) => {
    return (
      <React.Fragment>
        <table
          className="usa-table ustc-table trial-sessions subsection"
          id="upcoming-sessions"
          aria-describedby="tab-my-queue-TODO"
        >
          <thead>
            <tr>
              <th>Docket</th>
              <th>Case Caption</th>
              <th>Petitioner Counsel</th>
              <th>IRS Counsel</th>
              <th>Case Type</th>
            </tr>
          </thead>
          {eligibleCases.map((item, idx) => (
            <tbody key={idx}>
              <tr className="eligible-cases-row">
                <td>
                  <a href={`/case-detail/${item.docketNumber}`}>
                    {item.docketNumber}
                  </a>
                </td>
                <td>{item.caseCaption}</td>
                <td aria-hidden="true">
                  {item.practitioners.map((practitioner, idx) => (
                    <div key={idx}>{practitioner.name}</div>
                  ))}
                </td>
                <td aria-hidden="true">{item.respondent}</td>
                <td>{item.caseType}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </React.Fragment>
    );
  },
);
