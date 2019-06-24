import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const AllCases = connect(
  {
    formattedCases: state.formattedTrialSessionDetails.allCases,
  },
  ({ formattedCases }) => {
    return (
      <React.Fragment>
        <div className="text-semibold push-right margin-bottom-2 margin-top-neg-205">
          Count: {formattedCases.length}
        </div>
        <table
          className="usa-table ustc-table trial-sessions subsection"
          id="all-cases"
          aria-describedby="all-cases-tab"
        >
          <thead>
            <tr>
              <th>Status</th>
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
                <td>{item.status}</td>
                <td>
                  <a href={`/case-detail/${item.docketNumber}`}>
                    {item.docketNumberWithSuffix}
                  </a>
                </td>
                <td>{item.caseCaption}</td>
                <td aria-hidden="true">
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
