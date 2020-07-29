import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { If } from '../../ustc-ui/If/If';
import { Text } from '../../ustc-ui/Text/Text';
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
    formattedCases: state.trialSessionWorkingCopyHelper.formattedCases,
    openAddEditUserCaseNoteModalFromListSequence:
      sequences.openAddEditUserCaseNoteModalFromListSequence,
    openDeleteUserCaseNoteConfirmModalSequence:
      sequences.openDeleteUserCaseNoteConfirmModalSequence,
    sort: state.trialSessionWorkingCopy.sort,
    sortOrder: state.trialSessionWorkingCopy.sortOrder,
    toggleWorkingCopySortSequence: sequences.toggleWorkingCopySortSequence,
    trialStatusOptions: state.trialSessionWorkingCopyHelper.trialStatusOptions,
  },
  function WorkingCopySessionList({
    autoSaveTrialSessionWorkingCopySequence,
    casesShownCount,
    formattedCases,
    openAddEditUserCaseNoteModalFromListSequence,
    openDeleteUserCaseNoteConfirmModalSequence,
    sort,
    sortOrder,
    toggleWorkingCopySortSequence,
    trialStatusOptions,
  }) {
    return (
      <div className="margin-top-4">
        <WorkingCopyFilterHeader />
        <table
          aria-describedby="tab-my-queue"
          className="usa-table work-queue subsection"
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
                  className="sortable-header-button"
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
                    <FontAwesomeIcon icon="caret-up" />
                  )) || <FontAwesomeIcon icon="caret-down" />}
                </Button>
              </th>
              <th aria-label="manually added indicator"></th>
              <th className="no-wrap">Case Title</th>
              <th className="no-wrap">
                <Button
                  link
                  className="sortable-header-button"
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
                    <FontAwesomeIcon icon="caret-up" />
                  )) || <FontAwesomeIcon icon="caret-down" />}
                </Button>
              </th>
              <th className="no-wrap">Respondent Counsel</th>
              <th className="no-wrap" colSpan="2">
                Trial Status
              </th>
            </tr>
          </thead>
          {formattedCases.map((item, idx) => {
            return (
              <tbody className="hoverable" key={idx}>
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
                  <td>{item.caseTitle}</td>
                  <td>
                    {item.privatePractitioners.map((practitioner, idx) => (
                      <div key={idx}>{practitioner.name}</div>
                    ))}
                  </td>
                  <td>
                    {item.irsPractitioners.map((respondent, idx) => (
                      <div key={idx}>{respondent.name}</div>
                    ))}
                  </td>
                  <td className="minw-30">
                    <BindedSelect
                      ariaLabel="trial status"
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
                    <If
                      not
                      bind={`trialSessionWorkingCopy.userNotes.${item.docketNumber}.notes`}
                    >
                      <Button
                        link
                        className="margin-top-1"
                        icon="plus-circle"
                        onClick={() => {
                          openAddEditUserCaseNoteModalFromListSequence({
                            docketNumber: item.docketNumber,
                          });
                        }}
                      >
                        Add Note
                      </Button>
                    </If>
                  </td>
                </tr>
                <If
                  bind={`trialSessionWorkingCopy.userNotes.${item.docketNumber}.notes`}
                >
                  <tr className="notes-row">
                    <td className="text-right font-body-2xs">
                      <strong>Notes:</strong>
                    </td>
                    <td className="font-body-2xs" colSpan="4">
                      <Text
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
                </If>
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
