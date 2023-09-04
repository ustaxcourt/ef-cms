import { AddEditPrimaryIssueModal } from './AddEditPrimaryIssueModal';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { DateInput } from '@web-client/ustc-ui/DateInput/DateInput';
import { DeletePrimaryIssueModal } from './DeletePrimaryIssueModal';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

function convertToDateInputValues(date: string) {
  if (!date) {
    return '';
  }
  const [year, month, day] = date.split('-');
  return {
    day,
    month,
    year,
  };
}

export const CaseWorksheets = connect(
  {
    STATUS_OF_MATTER_OPTIONS: state.constants.STATUS_OF_MATTER_OPTIONS,
    caseWorksheetsHelper: state.caseWorksheetsHelper,
    openAddEditPrimaryIssueModalSequence:
      sequences.openAddEditPrimaryIssueModalSequence,
    openCleanModalSequence: sequences.openCleanModalSequence,
    openDeletePrimaryIssueSequence: sequences.openDeletePrimaryIssueSequence,
    showModal: state.modal.showModal,
    updateFinalBriefDueDateSequence: sequences.updateFinalBriefDueDateSequence,
    updateStatusOfMatterSequence: sequences.updateStatusOfMatterSequence,
    validationErrors: state.validationErrors,
  },
  function CaseWorksheets({
    caseWorksheetsHelper,
    openAddEditPrimaryIssueModalSequence,
    openDeletePrimaryIssueSequence,
    showModal,
    STATUS_OF_MATTER_OPTIONS,
    updateFinalBriefDueDateSequence,
    updateStatusOfMatterSequence,
    validationErrors,
  }) {
    return (
      <React.Fragment>
        <h1>Submitted/CAV Cases</h1>

        <table
          aria-describedby="submitted-cav-cases-tab"
          className="usa-table ustc-table"
        >
          <thead>
            <tr>
              <th aria-hidden="true" className="consolidated-case-column"></th>
              <th aria-label="Docket Number" className="small">
                <span className="padding-left-2px">Docket No.</span>
              </th>
              <th>No. of Cases</th>
              <th>Petitioner(s)</th>
              <th>Case Status</th>
              <th>Days in Status</th>
              <th>Status Date</th>
              <th>
                <label htmlFor="final-brief-due-date-date-picker">
                  Final Brief Due Date
                </label>
              </th>
              <th>
                <label htmlFor="status-of-matter-dropdown">
                  Status of Matter
                </label>
              </th>
            </tr>
          </thead>
          <tbody>
            {caseWorksheetsHelper.caseWorksheetsFormatted.map(formattedCase => {
              return (
                <React.Fragment key={`info-${formattedCase.docketNumber}`}>
                  <tr>
                    <td className="consolidated-case-column">
                      <ConsolidatedCaseIcon
                        consolidatedIconTooltipText={
                          formattedCase.consolidatedIconTooltipText
                        }
                        inConsolidatedGroup={formattedCase.inConsolidatedGroup}
                        showLeadCaseIcon={formattedCase.isLeadCase}
                      />
                    </td>
                    <td>
                      <CaseLink formattedCase={formattedCase} />
                    </td>
                    <td>{formattedCase.formattedCaseCount}</td>
                    <td>{formattedCase.caseTitle}</td>
                    <td>{formattedCase.status}</td>
                    <td>{formattedCase.daysSinceLastStatusChange}</td>
                    <td>{formattedCase.formattedSubmittedCavStatusDate}</td>
                    <td className="display-flex flex-column flex-align-center">
                      <FormGroup
                        className="margin-bottom-0"
                        errorText={
                          validationErrors &&
                          validationErrors.submittedCavCasesTable &&
                          validationErrors.submittedCavCasesTable[
                            formattedCase.docketNumber
                          ]?.finalBriefDueDate
                        }
                      >
                        <div className="display-flex flex-align-center">
                          <DateInput
                            className={'margin-bottom-0'}
                            id={`final-brief-due-date-date-picker-${formattedCase.docketNumber}`}
                            showDateHint={false}
                            values={convertToDateInputValues(
                              formattedCase.worksheet.finalBriefDueDate,
                            )}
                            onValueChange={value => {
                              updateFinalBriefDueDateSequence({
                                docketNumber: formattedCase.docketNumber,
                                finalBriefDueDate: value === '' ? null : value,
                              });
                            }}
                          />
                        </div>
                      </FormGroup>
                    </td>
                    <td>
                      <select
                        aria-describedby="status-of-matter"
                        className="usa-select"
                        id={`status-of-matter-dropdown-${formattedCase.docketNumber}`}
                        name="statusOfMatter"
                        value={formattedCase.worksheet.statusOfMatter ?? ''}
                        onChange={e => {
                          updateStatusOfMatterSequence({
                            docketNumber: formattedCase.docketNumber,
                            statusOfMatter:
                              e.target.value === '' ? null : e.target.value,
                          });
                        }}
                      >
                        <option value="">- Select -</option>
                        {STATUS_OF_MATTER_OPTIONS.map(from => (
                          <option key={from} value={from}>
                            {from}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  <tr className="wip-submitted-cav-cases-primary-issue-row">
                    <td className="grid-container" colSpan={12}>
                      <div className="grid-row">
                        <div className="grid-col-3 text-right">
                          <b>Primary Issue:</b>
                        </div>
                        <div
                          className="grid-col-8"
                          style={{
                            paddingLeft: '12px',
                            paddingRight: '12px',
                          }}
                        >
                          {formattedCase.worksheet.primaryIssue}
                        </div>
                        <div className="grid-col-1">
                          {!formattedCase.worksheet.primaryIssue && (
                            <Button
                              link
                              className="float-right"
                              icon="plus-circle"
                              onClick={() => {
                                openAddEditPrimaryIssueModalSequence({
                                  docketNumber: formattedCase.docketNumber,
                                });
                              }}
                            >
                              Add Issue
                            </Button>
                          )}

                          {formattedCase.worksheet.primaryIssue && (
                            <div className="grid">
                              <div>
                                <Button
                                  link
                                  icon="edit"
                                  onClick={() => {
                                    openAddEditPrimaryIssueModalSequence({
                                      docketNumber: formattedCase.docketNumber,
                                    });
                                  }}
                                >
                                  Edit Issue
                                </Button>
                              </div>
                              <div>
                                <Button
                                  link
                                  className="red-warning"
                                  icon="trash"
                                  onClick={() => {
                                    openDeletePrimaryIssueSequence({
                                      docketNumber: formattedCase.docketNumber,
                                    });
                                  }}
                                >
                                  Delete Issue
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        {caseWorksheetsHelper.caseWorksheetsFormatted.length === 0 && (
          <div>
            There are no cases with a status of &quot;Submitted&quot; or
            &quot;CAV&quot;
          </div>
        )}

        {showModal === 'AddEditPrimaryIssueModal' && (
          <AddEditPrimaryIssueModal />
        )}

        {showModal === 'DeletePrimaryIssueModal' && <DeletePrimaryIssueModal />}
      </React.Fragment>
    );
  },
);

CaseWorksheets.displayName = 'CaseWorksheets';
