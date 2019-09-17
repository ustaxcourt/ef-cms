import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { CaseLink } from '../ustc-ui/CaseLink/CaseLink';
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
    openAddEditCaseNoteModalFromListSequence:
      sequences.openAddEditCaseNoteModalFromListSequence,
    openDeleteCaseNoteConfirmModalSequence:
      sequences.openDeleteCaseNoteConfirmModalSequence,
    sort: state.trialSessionWorkingCopy.sort,
    sortOrder: state.trialSessionWorkingCopy.sortOrder,
    toggleWorkingCopySortSequence: sequences.toggleWorkingCopySortSequence,
    trialStatusOptions: state.trialSessionWorkingCopyHelper.trialStatusOptions,
  },
  ({
    autoSaveTrialSessionWorkingCopySequence,
    casesShownCount,
    formattedCases,
    openAddEditCaseNoteModalFromListSequence,
    openDeleteCaseNoteConfirmModalSequence,
    sort,
    sortOrder,
    toggleWorkingCopySortSequence,
    trialStatusOptions,
  }) => {
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
                <button
                  className="usa-button usa-button--unstyled sortable-header-button"
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
                    Docket
                  </span>
                  {(sort === 'docket' && sortOrder === 'desc' && (
                    <FontAwesomeIcon icon="caret-up" />
                  )) || <FontAwesomeIcon icon="caret-down" />}
                </button>
              </th>
              <th className="no-wrap">Case Caption</th>
              <th className="no-wrap">
                <button
                  className="usa-button usa-button--unstyled sortable-header-button"
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
                </button>
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
                  <td>{item.caseCaptionNames}</td>
                  <td>
                    {item.practitioners.map((practitioner, idx) => (
                      <div key={idx}>{practitioner.name}</div>
                    ))}
                  </td>
                  <td>
                    {item.respondents.map((respondent, idx) => (
                      <div key={idx}>{respondent.name}</div>
                    ))}
                  </td>
                  <td className="minw-30">
                    <BindedSelect
                      ariaLabel="trial status"
                      bind={`trialSessionWorkingCopy.caseMetadata.${item.docketNumber}.trialStatus`}
                      id={`trialSessionWorkingCopy-${item.docketNumber}`}
                      onChange={() => {
                        autoSaveTrialSessionWorkingCopySequence();
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
                      bind={`trialSessionWorkingCopy.caseNotes.${item.caseId}.notes`}
                    >
                      <button
                        className="usa-button usa-button--unstyled margin-top-1"
                        onClick={() => {
                          openAddEditCaseNoteModalFromListSequence({
                            caseId: item.caseId,
                          });
                        }}
                      >
                        <FontAwesomeIcon icon="plus-circle"></FontAwesomeIcon>
                        Add Note
                      </button>
                    </If>
                  </td>
                </tr>
                <If
                  bind={`trialSessionWorkingCopy.caseNotes.${item.caseId}.notes`}
                >
                  <tr className="notes-row">
                    <td className="text-right font-body-2xs">
                      <strong>Notes:</strong>
                    </td>
                    <td className="font-body-2xs" colSpan="3">
                      <Text
                        bind={`trialSessionWorkingCopy.caseNotes.${item.caseId}.notes`}
                      />
                    </td>
                    <td className="no-wrap text-align-right">
                      <button
                        className="usa-button usa-button--unstyled red-warning margin-right-105"
                        onClick={() => {
                          openDeleteCaseNoteConfirmModalSequence({
                            caseId: item.caseId,
                          });
                        }}
                      >
                        <FontAwesomeIcon icon="times-circle"></FontAwesomeIcon>
                        Delete Note
                      </button>
                    </td>
                    <td className="no-wrap text-align-right">
                      <button
                        className="usa-button usa-button--unstyled"
                        onClick={() => {
                          openAddEditCaseNoteModalFromListSequence({
                            caseId: item.caseId,
                          });
                        }}
                      >
                        <FontAwesomeIcon icon="edit"></FontAwesomeIcon>Edit Note
                      </button>
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
