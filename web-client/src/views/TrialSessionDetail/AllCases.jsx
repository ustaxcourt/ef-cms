import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
        <div className="text-semibold push-right margin-bottom-2">
          Count: {allCases.length}
        </div>
        <table
          aria-describedby="all-cases-tab"
          className="usa-table ustc-table trial-sessions subsection"
          id="all-cases"
        >
          <thead>
            <tr>
              <th>Docket</th>
              <th aria-label="manually added indicator"></th>
              <th>Case title</th>
              <th>Case status</th>
              <th>Disposition</th>
              <th>Disposition date</th>
            </tr>
          </thead>
          {allCases.map((item, idx) => (
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
                <td>{item.status}</td>
                <td>{item.disposition}</td>
                <td>{item.removedFromTrialDateFormatted}</td>
              </tr>
            </tbody>
          ))}
        </table>
        {allCases.length === 0 && <p>There are no cases.</p>}
      </React.Fragment>
    );
  },
);
