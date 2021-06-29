import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextView } from '../../ustc-ui/Text/TextView';
import { WorkingCopyFilterHeader } from './WorkingCopyFilterHeader';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const WorkingCopySessionList = connect(
  {
    autoSaveTrialSessionWorkingCopySequence:
      sequences.autoSaveTrialSessionWorkingCopySequence,
    casesShownCount: state.trialSessionWorkingCopyHelper.casesShownCount,
    openAddEditUserCaseNoteModalFromListSequence:
      sequences.openAddEditUserCaseNoteModalFromListSequence,
    openDeleteUserCaseNoteConfirmModalSequence:
      sequences.openDeleteUserCaseNoteConfirmModalSequence,
    sort: state.trialSessionWorkingCopy.sort,
    sortOrder: state.trialSessionWorkingCopy.sortOrder,
    toggleWorkingCopySortSequence: sequences.toggleWorkingCopySortSequence,
    trialSessionWorkingCopyHelper: state.trialSessionWorkingCopyHelper,
    trialStatusOptions: state.trialSessionWorkingCopyHelper.trialStatusOptions,
  },
  function WorkingCopySessionList({
    autoSaveTrialSessionWorkingCopySequence,
    casesShownCount,
    openAddEditUserCaseNoteModalFromListSequence,
    openDeleteUserCaseNoteConfirmModalSequence,
    sort,
    sortOrder,
    toggleWorkingCopySortSequence,
    trialSessionWorkingCopyHelper,
    trialStatusOptions,
  }) {
    return (
      <div className="margin-top-4">
        <WorkingCopyFilterHeader />
        <table
          aria-describedby="tab-my-queue"
          className="usa-table ustc-table subsection"
          id="my-work-queue"
        >
          <thead>
            <tr>
              <th
                aria-label="Docket Number"
                className="padding-left-2px no-wrap"
              >
                <Button
                  link
                  className="sortable-header-button margin-right-0"
                  onClick={() => {
                    toggleWorkingCopySortSequence({
                      sort: 'docket',
                    });
                  }}
                >
                  <span
                    className={classNames(
                      'margin-right-105',
                      sort === 'docket' && 'sortActive',
                    )}
                  >
                    Docket No.
                  </span>
                  {(sort === 'docket' && sortOrder === 'desc' && (
                    <FontAwesomeIcon
                      icon="caret-up"
                      title="in ascending order"
                    />
                  )) || (
                    <FontAwesomeIcon
                      icon="caret-down"
                      title="in descending order"
                    />
                  )}
                </Button>
              </th>
              <th aria-label="manually added indicator"></th>
              <th>Case Title</th>
              <th>
                <Button
                  link
                  className="sortable-header-button margin-right-0"
                  onClick={() => {
                    toggleWorkingCopySortSequence({
                      sort: 'practitioner',
                    });
                  }}
                >
                  <span
                    className={classNames(
                      'margin-right-105',
                      sort === 'practitioner' && 'sortActive',
                    )}
                  >
                    Petitioner Counsel
                  </span>
                  {(sort === 'practitioner' && sortOrder === 'desc' && (
                    <FontAwesomeIcon
                      icon="caret-up"
                      title="in ascending order"
                    />
                  )) || (
                    <FontAwesomeIcon
                      icon="caret-down"
                      title="in descending order"
                    />
                  )}
                </Button>
              </th>
              <th>Respondent Counsel</th>
              <th colSpan="2">Trial Status</th>
            </tr>
          </thead>
          {trialSessionWorkingCopyHelper.formattedCases.map(item => {
            return (
              <tbody className="hoverable" key={item.docketNumber}>
                <tr className="vertical-align-middle-row">
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
                  <td className="minw-80">{item.caseTitle}</td>
                  <td>
                    {item.privatePractitioners.map(practitioner => (
                      <div key={practitioner.userId}>{practitioner.name}</div>
                    ))}
                  </td>
                  <td>
                    {item.irsPractitioners.map(respondent => (
                      <div key={respondent.userId}>{respondent.name}</div>
                    ))}
                  </td>
                  <td className="minw-30">
                    <BindedSelect
                      aria-label="trial status"
                      bind={`trialSessionWorkingCopy.caseMetadata.${item.docketNumber}.trialStatus`}
                      id={`trialSessionWorkingCopy-${item.docketNumber}`}
                      onChange={value => {
                        autoSaveTrialSessionWorkingCopySequence({
                          key: `caseMetadata.${item.docketNumber}.trialStatus`,
                          value,
                        });
                      }}
                    >
                      <option value="">-Trial Status-</option>
                      {trialStatusOptions.map(({ key, value }) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </BindedSelect>
                  </td>
                  <td className="no-wrap">
                    {!item.userNotes && (
                      <Button
                        link
                        className="margin-top-1"
                        icon="plus-circle"
                        id={`add-note-${item.docketNumber}`}
                        onClick={() => {
                          openAddEditUserCaseNoteModalFromListSequence({
                            docketNumber: item.docketNumber,
                            docketNumberWithSuffix: item.docketNumberWithSuffix,
                          });
                        }}
                      >
                        Add Note
                      </Button>
                    )}
                  </td>
                </tr>
                {item.calendarNotes && (
                  <tr className="notes-row">
                    <td></td>
                    <td></td>
                    <td className="font-body-2xs no-wrap" colSpan="4">
                      <span className="text-bold margin-right-1">
                        Calendar notes:
                      </span>
                      {item.calendarNotes}
                    </td>
                    <td></td>
                  </tr>
                )}
                {item.userNotes && (
                  <tr className="notes-row">
                    <td></td>
                    <td></td>
                    <td className="font-body-2xs" colSpan="3">
                      <span className="text-bold margin-right-1">Notes:</span>
                      <TextView
                        bind={`trialSessionWorkingCopy.userNotes.${item.docketNumber}.notes`}
                      />
                    </td>
                    <td className="no-wrap text-align-right">
                      <Button
                        link
                        className="red-warning"
                        icon="trash"
                        onClick={() => {
                          openDeleteUserCaseNoteConfirmModalSequence({
                            docketNumber: item.docketNumber,
                          });
                        }}
                      >
                        Delete Note
                      </Button>
                    </td>
                    <td className="no-wrap text-align-right">
                      <Button
                        link
                        icon="edit"
                        onClick={() => {
                          openAddEditUserCaseNoteModalFromListSequence({
                            docketNumber: item.docketNumber,
                          });
                        }}
                      >
                        Edit Note
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            );
          })}
        </table>
        {casesShownCount === 0 && (
          <p>Please select a trial status to show cases.</p>
        )}
      </div>
    );
  },
);
