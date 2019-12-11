import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const InactiveCases = connect(
  {
    inactiveCases: state.formattedTrialSessionDetails.inactiveCases,
  },
  ({ inactiveCases }) => {
    return (
      <React.Fragment>
        <div className="text-semibold push-right margin-bottom-2">
          Count: {inactiveCases.length}
        </div>
        <table
          aria-describedby="inactive-cases-tab"
          className="usa-table ustc-table trial-sessions subsection"
          id="inactive-cases"
        >
          <thead>
            <tr>
              <th>Docket</th>
              <th>Case title</th>
              <th>Disposition</th>
              <th>Disposition date</th>
            </tr>
          </thead>
          {inactiveCases.map((item, idx) => (
            <tbody key={idx}>
              <tr className="eligible-cases-row">
                <td>
                  <CaseLink formattedCase={item} />
                </td>
                <td>{item.caseCaptionNames}</td>
                <td>{item.disposition}</td>
                <td>{item.removedFromTrialDateFormatted}</td>
              </tr>
            </tbody>
          ))}
        </table>
        {inactiveCases.length === 0 && <p>There are no inactive cases.</p>}
      </React.Fragment>
    );
  },
);
