import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
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
        <div>
          <Button
            className="push-right margin-right-0 margin-bottom-1"
            id="button-add-deadline"
            onClick={() => {
              openCreateCaseDeadlineModalSequence();
            }}
          >
            <FontAwesomeIcon icon="calendar-alt" size="1x" /> Add Deadline
          </Button>
        </div>
        {caseDetailHelper.showCaseDeadlinesInternalEmpty && (
          <p className="margin-bottom-5">
            There are no deadlines for this case.
          </p>
        )}
        {caseDetailHelper.showCaseDeadlinesInternal && (
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
                    <Button
                      link
                      className="margin-right-0 padding-0"
                      icon="trash"
                      onClick={() => {
                        openDeleteCaseDeadlineModalSequence({
                          caseDeadlineId: item.caseDeadlineId,
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </td>
                  <td className="smaller-column center-column">
                    <Button
                      link
                      className="margin-right-0 padding-0"
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
                    </Button>
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
