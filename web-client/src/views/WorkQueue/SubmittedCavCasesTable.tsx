import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { DateInput } from '@web-client/ustc-ui/DateInput/DateInput';
import { connect } from '@cerebral/react';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';

import { AddEditPrimaryIssueModal } from '../CaseWorksheet/AddEditPrimaryIssueModal';
import { BindedSelect } from '@web-client/ustc-ui/BindedSelect/BindedSelect';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { DeletePrimaryIssueModal } from '../CaseWorksheet/DeletePrimaryIssueModal';
import React from 'react';

export const SubmittedCavCasesTable = connect(
  {
    judgeActivityReportHelper: state.judgeActivityReportHelper,
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
    openAddEditPrimaryIssueModalSequence,
    openDeleteCasePrimaryIssueSequence,
    showModal,
    submittedCavCasesTableHelper,
    updateSubmittedCavCaseDetailSequence,
  }) {
    const StatusOfMatter = [
      'Awaiting Consideration',
      'Awaiting Supplemental Briefs',
      'Drafting',
      'Reviewing Draft',
      'Submitted to Chief Judge',
      'Revising Draft',
      'Submitted to Reporter',
      'Stayed',
    ];
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
                      <td>
                        {/* TODO: wire up / figure out the saving */}
                        <DateInput
                          className={'margin-bottom-0'}
                          id={'final-brief-due-date-date-picker'}
                          showDateHint={false}
                          values={{
                            day: '',
                            month: '',
                            year: '',
                          }}
                          onChange={() => {
                            updateSubmittedCavCaseDetailSequence({
                              finalBriefDueDate: 'thing',
                            });
                          }}
                        />
                      </td>
                      <td colSpan={2}>
                        {/* TODO: update persistence on change */}
                        <BindedSelect
                          aria-describedby="status-of-matter"
                          bind=""
                          id="status-of-matter-dropdown"
                          name="statusOfMatter"
                          onChange={e => {
                            updateSubmittedCavCaseDetailSequence({
                              statusOfMatter: e,
                            });
                          }}
                        >
                          <option value="">- Select -</option>
                          {StatusOfMatter.map(from => (
                            <option key={from} value={from}>
                              {from}
                            </option>
                          ))}
                        </BindedSelect>
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
