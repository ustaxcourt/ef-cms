import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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
      <div className="margin-top-3">
        {caseDetailHelper.showCaseDeadlinesInternalEmpty && (
          <p className="margin-bottom-5">
            There are no deadlines for this case.
          </p>
        )}
        {caseDetailHelper.showCaseDeadlinesInternal && (
          <>
            <div className="text-right margin-bottom-3">
              <span className="text-semibold">Count: </span>
              {formattedCaseDeadlines.length}
            </div>
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
                  <tr key={item.caseDeadlineId} className="case-deadline-row">
                    <td className="smaller-column">
                      {item.deadlineDateFormatted}
                    </td>
                    <td className="overdue smaller-column center-column semi-bold">
                      {item.overdue && 'Overdue'}
                    </td>
                    <td
                      className="padding-extra"
                      data-testid="case-deadline-description"
                    >
                      {item.description}
                    </td>
                    <td className="smaller-column center-column">
                      {caseDetailHelper.hasTrackedItemsPermission &&
                        item.displayEditAndDeleteLink && (
                          <Button
                            link
                            className="margin-right-0 padding-0"
                            data-testid="case-deadline-edit-button"
                            icon="edit"
                            onClick={() => {
                              openEditCaseDeadlineModalSequence({
                                caseDeadlineId: item.caseDeadlineId,
                              });
                            }}
                          >
                            Edit
                          </Button>
                        )}
                    </td>
                    <td className="smaller-column center-column">
                      {caseDetailHelper.hasTrackedItemsPermission &&
                        item.displayEditAndDeleteLink && (
                          <Button
                            link
                            className="margin-right-0 padding-0 red-warning"
                            icon="trash"
                            data-testid="delete-case-deadline-button"
                            onClick={() => {
                              openDeleteCaseDeadlineModalSequence({
                                caseDeadlineId: item.caseDeadlineId,
                              });
                            }}
                          >
                            Delete
                          </Button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
  },
);

CaseDeadlinesInternal.displayName = 'CaseDeadlinesInternal';
