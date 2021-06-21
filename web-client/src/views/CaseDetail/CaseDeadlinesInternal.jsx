import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseDeadlinesInternal = connect(
  {
    caseDetailHelper: state.caseDetailHelper,
    formattedCaseDeadlines: state.formattedCaseDeadlines,
    openDeleteCaseDeadlineModalSequence:
      sequences.openDeleteCaseDeadlineModalSequence,
    openEditCaseDeadlineModalSequence:
      sequences.openEditCaseDeadlineModalSequence,
  },
  function CaseDeadlinesInternal({
    caseDetailHelper,
    formattedCaseDeadlines,
    openDeleteCaseDeadlineModalSequence,
    openEditCaseDeadlineModalSequence,
  }) {
    return (
      <>
        {caseDetailHelper.showCaseDeadlinesInternalEmpty && (
          <p className="margin-bottom-5">
            There are no deadlines for this case.
          </p>
        )}
        {caseDetailHelper.showCaseDeadlinesInternal && (
          <table className="usa-table ustc-table subsection deadlines">
            <thead>
              <tr>
                <th>Due Date</th>
                <th></th>
                <th>Description</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {formattedCaseDeadlines.map(item => (
                <tr key={item.caseDeadlineId}>
                  <td className="smaller-column semi-bold">
                    {item.deadlineDateFormatted}
                  </td>
                  <td className="overdue smaller-column center-column semi-bold">
                    {item.overdue && 'Overdue'}
                  </td>
                  <td className="padding-extra">{item.description}</td>
                  <td className="smaller-column center-column">
                    <Button
                      link
                      className="margin-right-0 padding-0"
                      icon="edit"
                      onClick={() => {
                        openEditCaseDeadlineModalSequence({
                          caseDeadlineId: item.caseDeadlineId,
                        });
                      }}
                    >
                      Edit
                    </Button>
                  </td>
                  <td className="smaller-column center-column">
                    <Button
                      link
                      className="margin-right-0 padding-0 red-warning"
                      icon="trash"
                      onClick={() => {
                        openDeleteCaseDeadlineModalSequence({
                          caseDeadlineId: item.caseDeadlineId,
                        });
                      }}
                    >
                      Delete
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
