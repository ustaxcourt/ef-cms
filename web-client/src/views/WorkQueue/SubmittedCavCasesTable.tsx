import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { DateInput } from '@web-client/ustc-ui/DateInput/DateInput';
import { connect } from '@cerebral/react';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';

import { AddEditPrimaryIssueModal } from '../CaseWorksheet/AddEditPrimaryIssueModal';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { DeletePrimaryIssueModal } from '../CaseWorksheet/DeletePrimaryIssueModal';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import React from 'react';

function convertToDateInputValues(date: string) {
  if (!date) {
    return '';
  }
  const [month, day, year] = date.split('/');
  return {
    day,
    month,
    year,
  };
}

export const SubmittedCavCasesTable = connect(
  {
    STATUS_OF_MATTER_OPTIONS: state.constants.STATUS_OF_MATTER_OPTIONS,
    judgeActivityReportHelper: state.judgeActivityReportHelper,
    judgeDashboardCaseWorksheetErrors: state.judgeDashboardCaseWorksheetErrors,
    openAddEditPrimaryIssueModalSequence:
      sequences.openAddEditPrimaryIssueModalSequence,
    openDeleteCasePrimaryIssueSequence:
      sequences.openDeleteCasePrimaryIssueSequence,
    showModal: state.modal.showModal,
    submittedCavCasesTableHelper: state.submittedCavCasesTableHelper,
    updateSubmittedCavCaseDetailSequence:
      sequences.updateSubmittedCavCaseDetailSequence,
  },

  function SubmittedCavCasesTable({
    judgeActivityReportHelper,
    judgeDashboardCaseWorksheetErrors,
    openAddEditPrimaryIssueModalSequence,
    openDeleteCasePrimaryIssueSequence,
    showModal,
    STATUS_OF_MATTER_OPTIONS,
    submittedCavCasesTableHelper,
    updateSubmittedCavCaseDetailSequence,
  }) {
    return (
      <React.Fragment>
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
            {judgeActivityReportHelper.filteredSubmittedAndCavCasesByJudge
              .sort(submittedCavCasesTableHelper.daysInStatusSortHandler)
              .map(formattedCase => {
                return (
                  <React.Fragment key={`info-${formattedCase.docketNumber}`}>
                    <tr>
                      <td className="consolidated-case-column">
                        <ConsolidatedCaseIcon
                          consolidatedIconTooltipText={
                            formattedCase.consolidatedIconTooltipText
                          }
                          inConsolidatedGroup={
                            formattedCase.inConsolidatedGroup
                          }
                          showLeadCaseIcon={formattedCase.isLeadCase}
                        />
                      </td>
                      <td>
                        <CaseLink formattedCase={formattedCase} />
                      </td>
                      <td>{formattedCase?.formattedCaseCount}</td>
                      <td>
                        {formattedCase.petitioners
                          .map(p => p.entityName)
                          .join()}
                      </td>
                      <td>{formattedCase.status}</td>
                      <td>{formattedCase.daysElapsedSinceLastStatusChange}</td>
                      <td>
                        {submittedCavCasesTableHelper.getSubmittedOrCAVDate(
                          formattedCase.caseStatusHistory,
                        )}
                      </td>
                      <td className="display-flex flex-column flex-align-center">
                        <FormGroup
                          className="margin-bottom-0"
                          errorText={
                            judgeDashboardCaseWorksheetErrors[
                              formattedCase.docketNumber
                            ]?.finalBriefDueDate
                          }
                        >
                          <DateInput
                            className={'margin-bottom-0'}
                            id={'final-brief-due-date-date-picker'}
                            showDateHint={false}
                            values={convertToDateInputValues(
                              formattedCase.finalBriefDueDate,
                            )}
                            onValueChange={value => {
                              updateSubmittedCavCaseDetailSequence({
                                docketNumber: formattedCase.docketNumber,
                                finalBriefDueDate: value === '' ? null : value,
                              });
                            }}
                          />
                        </FormGroup>
                      </td>
                      <td>
                        <select
                          aria-describedby="status-of-matter"
                          className="usa-select"
                          id="status-of-matter-dropdown"
                          name="statusOfMatter"
                          value={formattedCase.statusOfMatter ?? ''}
                          onChange={e => {
                            updateSubmittedCavCaseDetailSequence({
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
                            {formattedCase.primaryIssue}
                          </div>
                          <div className="grid-col-1">
                            {!formattedCase.primaryIssue && (
                              <Button
                                link
                                className="float-right"
                                icon="plus-circle"
                                onClick={() => {
                                  openAddEditPrimaryIssueModalSequence({
                                    case: formattedCase,
                                  });
                                }}
                              >
                                Add Issue
                              </Button>
                            )}

                            {formattedCase.primaryIssue && (
                              <div className="grid">
                                <div>
                                  <Button
                                    link
                                    icon="edit"
                                    onClick={() => {
                                      openAddEditPrimaryIssueModalSequence({
                                        case: formattedCase,
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
                                      openDeleteCasePrimaryIssueSequence({
                                        docketNumber:
                                          formattedCase.docketNumber,
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
        {judgeActivityReportHelper.filteredSubmittedAndCavCasesByJudge
          .length === 0 && (
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

SubmittedCavCasesTable.displayName = 'SubmittedCavCasesTable';
