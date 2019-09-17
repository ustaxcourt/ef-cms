import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const AllCases = connect(
  {
    allCases: state.formattedTrialSessionDetails.allCases,
  },
  ({ allCases }) => {
    return (
      <React.Fragment>
        <div className="text-semibold push-right margin-bottom-2 margin-top-neg-205">
          Count: {allCases.length}
        </div>
        <table
          aria-describedby="all-cases-tab"
          className="usa-table ustc-table trial-sessions subsection"
          id="all-cases"
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
          {allCases.map((item, idx) => (
            <tbody key={idx}>
              <tr className="eligible-cases-row">
                <td>{item.status}</td>
                <td>
                  <CaseLink formattedCase={item} />
                </td>
                <td>{item.caseCaptionNames}</td>
                <td aria-hidden="true">
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
