import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
        <div className="text-semibold push-right margin-bottom-2">
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
              <th aria-label="manually added indicator"></th>
              <th>Case title</th>
              <th>Petitioner counsel</th>
              <th>Respondent counsel</th>
            </tr>
          </thead>
          {openCases.map((item, idx) => (
            <tbody key={idx}>
              <tr className="eligible-cases-row">
                <td>
                  <CaseLink formattedCase={item} />
                </td>

                <td>
                  {item.isManuallyAdded && (
                    <span aria-label="manually added indicator">
                      <FontAwesomeIcon
                        className="mini-success"
                        icon="calendar-plus"
                      />
                    </span>
                  )}
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
        {openCases.length === 0 && <p>There are no open cases.</p>}
      </React.Fragment>
    );
  },
);
