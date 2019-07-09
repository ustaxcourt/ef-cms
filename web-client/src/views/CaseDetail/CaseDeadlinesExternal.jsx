import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseDeadlinesExternal = connect(
  {
    caseDeadlines: state.formattedCaseDetail.caseDeadlines,
    caseDetailHelper: state.caseDetailHelper,
  },
  function CaseDeadlinesExternal({ caseDeadlines, caseDetailHelper }) {
    return (
      <>
        {caseDetailHelper.showCaseDeadlinesExternal && (
          <>
            <div className="title">
              <h1>Deadlines</h1>
            </div>
            <table className="usa-table row-border-only subsection deadlines">
              <tbody>
                {caseDeadlines.map((item, idx) => (
                  <tr key={idx}>
                    <td className="overdue smaller-column center-column">
                      {item.overdue ? 'Overdue' : ''}
                    </td>
                    <td className="smaller-column center-column">
                      {item.deadlineDateFormatted}
                    </td>
                    <td className="padding-extra">{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </>
    );
  },
);
//        {caseDeadlines && caseDeadlines.length > 0 && (
