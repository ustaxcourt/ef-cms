import { CaseLink } from '../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const OpenCases = connect(
  {
    openCases: state.formattedTrialSessionDetails.openCases,
  },
  ({ openCases }) => {
    return (
      <React.Fragment>
        <div className="text-semibold push-right margin-bottom-2 margin-top-neg-205">
          Count: {openCases.length}
        </div>
        <table
          aria-describedby="open-cases-tab"
          className="usa-table ustc-table trial-sessions subsection"
          id="open-cases"
        >
          <thead>
            <tr>
              <th>Docket</th>
              <th>Case Caption</th>
              <th>Petitioner Counsel</th>
              <th>Respondent Counsel</th>
            </tr>
          </thead>
          {openCases.map((item, idx) => (
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
              </tr>
            </tbody>
          ))}
        </table>
      </React.Fragment>
    );
  },
);
