import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const CaseDeadlines = connect(
  {
    caseDeadlines: state.formattedCaseDetail.caseDeadlines,
    openDeleteCaseDeadlineModalSequence:
      sequences.openDeleteCaseDeadlineModalSequence,
    openEditCaseDeadlineModalSequence:
      sequences.openEditCaseDeadlineModalSequence,
  },
  function CaseDeadlines({
    caseDeadlines,
    openDeleteCaseDeadlineModalSequence,
    openEditCaseDeadlineModalSequence,
  }) {
    return (
      <>
        {!caseDeadlines ||
          (caseDeadlines.length === 0 && (
            <p className="heading-2 margin-bottom-10">
              There are no deadlines for this case.
            </p>
          ))}
        {caseDeadlines && caseDeadlines.length > 0 && (
          <table className="usa-table row-border-only subsection deadlines">
            <tbody>
              {caseDeadlines.map((item, idx) => (
                <tr key={idx}>
                  <td className="smaller-column center-column semi-bold">
                    {item.deadlineDateFormatted}
                  </td>
                  <td className="overdue smaller-column center-column semi-bold">
                    {item.overdue ? 'Overdue' : ''}
                  </td>
                  <td className="padding-extra">{item.description}</td>
                  <td className="smaller-column center-column">
                    <button
                      className="usa-button usa-button--unstyled"
                      onClick={() => {
                        openDeleteCaseDeadlineModalSequence({
                          caseDeadlineId: item.caseDeadlineId,
                        });
                      }}
                    >
                      <FontAwesomeIcon
                        className="margin-right-05"
                        icon="trash"
                        size="1x"
                      />
                      Remove
                    </button>
                  </td>
                  <td className="smaller-column center-column">
                    <button
                      className="usa-button usa-button--unstyled"
                      onClick={() => {
                        openEditCaseDeadlineModalSequence({
                          caseDeadlineId: item.caseDeadlineId,
                        });
                      }}
                    >
                      <FontAwesomeIcon
                        className="margin-right-05"
                        icon="edit"
                        size="1x"
                      />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    );
  },
);
