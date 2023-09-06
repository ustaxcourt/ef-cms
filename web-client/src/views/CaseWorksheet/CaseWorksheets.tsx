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
      <div className="margin-top-6">
        <div className="grid-container padding-0 margin-bottom-3">
          <div className="grid-row">
            <div className="grid-col-10">
              <h1 className="margin-bottom-0">Submitted/CAV Cases</h1>
            </div>
            <div className="display-flex flex-align-end flex-justify-end grid-col-2">
              <span className="text-semibold">
                Count: {caseWorksheetsHelper.caseWorksheetsFormatted.length}
              </span>
            </div>
          </div>
        </div>

        <table className="usa-table ustc-table">
          <thead>
            <tr>
              <th aria-hidden="true" className="consolidated-case-column"></th>
              <th className="small">
                <span className="padding-left-2px">Docket No.</span>
              </th>
              <th>No. of Cases</th>
              <th>Petitioner(s)</th>
              <th>Case Status</th>
              <th>Days in Status</th>
              <th>Status Date</th>
              <th>Final Brief Due Date</th>
              <th>Status of Matter</th>
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
                    <td>
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
                      </FormGroup>
                    </td>
                    <td>
                      <select
                        aria-label="status of matter"
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
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <span className="text-bold margin-right-1">
                        Primary Issue:
                      </span>
                      {formattedCase.worksheet.primaryIssue}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      {!formattedCase.worksheet.primaryIssue && (
                        <Button
                          link
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
                        <div>
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
      </div>
    );
  },
);

CaseWorksheets.displayName = 'CaseWorksheets';
