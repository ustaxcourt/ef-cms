import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const ClosedCases = connect(
  {
    closedCases: state.formattedTrialSessionDetails.closedCases,
  },
  ({ closedCases }) => {
    return (
      <React.Fragment>
        <div className="text-semibold push-right margin-bottom-2 margin-top-neg-205">
          Count: {closedCases.length}
        </div>
        <table
          aria-describedby="closed-cases-tab"
          className="usa-table ustc-table trial-sessions subsection"
          id="closed-cases"
        >
          <thead>
            <tr>
              <th>Docket</th>
              <th>Case name</th>
              <th>Petitioner Counsel</th>
              <th>Respondent Counsel</th>
              <th>Disposition</th>
            </tr>
          </thead>
          {closedCases.map((item, idx) => (
            <tbody key={idx}>
              <tr className="eligible-cases-row">
                <td>
                  <CaseLink formattedCase={item} />
                </td>
                <td>{item.caseCaptionNames}</td>
                <td>
                  {item.practitioners.map((practitioner, idx) => (
                    <div key={idx}>{practitioner.name}</div>
                  ))}
                </td>
                <td>
                  {item.respondents.map((respondent, idx) => (
                    <div key={idx}>{respondent.name}</div>
                  ))}
                </td>
                <td>{item.disposition}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </React.Fragment>
    );
  },
);
