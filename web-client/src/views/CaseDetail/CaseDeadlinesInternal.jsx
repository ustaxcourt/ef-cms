import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const CaseDeadlinesInternal = connect(
  {
    caseDeadlines: state.formattedCaseDetail.caseDeadlines,
    caseDetailHelper: state.caseDetailHelper,
    openCreateCaseDeadlineModalSequence:
      sequences.openCreateCaseDeadlineModalSequence,
    openDeleteCaseDeadlineModalSequence:
      sequences.openDeleteCaseDeadlineModalSequence,
    openEditCaseDeadlineModalSequence:
      sequences.openEditCaseDeadlineModalSequence,
  },
  function CaseDeadlinesInternal({
    caseDeadlines,
    caseDetailHelper,
    openCreateCaseDeadlineModalSequence,
    openDeleteCaseDeadlineModalSequence,
    openEditCaseDeadlineModalSequence,
  }) {
    return (
      <>
        <div className="title">
          <h1>Deadlines</h1>
          <button
            className="usa-button push-right"
            onClick={() => {
              openCreateCaseDeadlineModalSequence();
            }}
          >
            <FontAwesomeIcon icon="calendar-alt" size="1x" /> Add Deadline
          </button>
        </div>
        {caseDetailHelper.showCaseDeadlinesInternalEmpty && (
          <p className="heading-2 margin-bottom-10">
            There are no deadlines for this case.
          </p>
        )}
        {caseDetailHelper.showCaseDeadlinesInternal && (
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
