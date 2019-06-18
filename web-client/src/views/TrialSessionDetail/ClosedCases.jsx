import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const ClosedCases = connect(
  {
    formattedCases: state.formattedTrialSessionDetails.closedCases,
  },
  ({ formattedCases }) => {
    return (
      <React.Fragment>
        <table
          className="usa-table ustc-table trial-sessions subsection"
          id="closed-cases"
        >
          <thead>
            <tr>
              <th>Docket</th>
              <th>Case Caption</th>
              <th>Petitioner Counsel</th>
              <th>Respondent Counsel</th>
              <th>Disposition</th>
            </tr>
          </thead>
          {formattedCases.map((item, idx) => (
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
                <td>{item.disposition}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </React.Fragment>
    );
  },
);
