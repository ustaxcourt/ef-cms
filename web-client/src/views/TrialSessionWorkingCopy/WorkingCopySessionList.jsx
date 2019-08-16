import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    openAddEditNoteModalSequence: sequences.openAddEditNoteModalSequence,
    openDeleteNoteConfirmModalSequence:
      sequences.openDeleteNoteConfirmModalSequence,
    sort: state.trialSessionWorkingCopy.sort,
    sortOrder: state.trialSessionWorkingCopy.sortOrder,
    toggleWorkingCopySortSequence: sequences.toggleWorkingCopySortSequence,
    trialStatusOptions: state.trialSessionWorkingCopyHelper.trialStatusOptions,
  },
  ({
    autoSaveTrialSessionWorkingCopySequence,
    casesShownCount,
    formattedCases,
    openAddEditNoteModalSequence,
    openDeleteNoteConfirmModalSequence,
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
              <th aria-label="Docket Number" className="padding-left-2px">
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
              <th>Case Caption</th>
              <th>
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
              <th>Respondent Counsel</th>
              <th colSpan="2">Trial Status</th>
            </tr>
          </thead>
          {formattedCases.map((item, idx) => (
            <tbody key={idx}>
              <tr>
                <td>
                  <a href={`/case-detail/${item.docketNumber}`}>
                    {item.docketNumberWithSuffix}
                  </a>

                  <button
                    className="usa-button usa-button--unstyled ustc-button--unstyled"
                    type="button"
                    onClick={() => {
                      openAddEditNoteModalSequence({
                        caseId: item.docketNumber,
                        docketNumber: item.docketNumber,
                      });
                    }}
                  >
                    Add/Edit Note
                  </button>
                  <button
                    className="usa-button usa-button--unstyled ustc-button--unstyled"
                    type="button"
                    onClick={() => {
                      openDeleteNoteConfirmModalSequence({
                        caseId: item.docketNumber,
                        docketNumber: item.docketNumber,
                      });
                    }}
                  >
                    Delete Note
                  </button>
                </td>
                <td>{item.caseName}</td>
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
                <td>
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
              </tr>
            </tbody>
          ))}
        </table>
        {casesShownCount === 0 && (
          <p>Please select a trial status to show cases.</p>
        )}
      </div>
    );
  },
);
