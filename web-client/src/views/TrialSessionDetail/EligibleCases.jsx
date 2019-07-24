import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const EligibleCases = connect(
  {
    formattedEligibleCases:
      state.formattedTrialSessionDetails.formattedEligibleCases,
  },
  ({ formattedEligibleCases }) => {
    return (
      <React.Fragment>
        <table
          aria-describedby="eligible-cases-tab"
          className="usa-table ustc-table trial-sessions subsection"
          id="upcoming-sessions"
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
          {formattedEligibleCases.map((item, idx) => (
            <tbody key={idx}>
              <tr className="eligible-cases-row">
                <td>
                  <a href={`/case-detail/${item.docketNumber}`}>
                    {item.docketNumberWithSuffix}
                  </a>
                </td>
                <td>{item.caseCaption}</td>
                <td>
                  {item.practitioners.map((practitioner, idx) => (
                    <div key={idx}>{practitioner.name}</div>
                  ))}
                </td>
                <td>{item.respondent}</td>
                <td>{item.caseType}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </React.Fragment>
    );
  },
);
