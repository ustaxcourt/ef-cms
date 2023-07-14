import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { DateInput } from '@web-client/ustc-ui/DateInput/DateInput';
import { connect } from '@cerebral/react';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';

import { AddEditPrimaryIssueModal } from '../CaseWorksheet/AddEditPrimaryIssueModal';
import { Button } from '@web-client/ustc-ui/Button/Button';
import React from 'react';
import classNames from 'classnames';

export const SubmittedCavCasesTable = connect(
  {
    judgeActivityReportHelper: state.judgeActivityReportHelper,
    openAddEditPrimaryIssueModalSequence:
      sequences.openAddEditPrimaryIssueModalSequence,
    openDeleteCasePrimaryIssueSequence:
      sequences.openDeleteCasePrimaryIssueSequence,
    showModal: state.modal.showModal,
  },

  function SubmittedCavCasesTable({
    judgeActivityReportHelper,
    openAddEditPrimaryIssueModalSequence,
    openDeleteCasePrimaryIssueSequence,
    showModal,
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

    const daysInStatusSortHandler = (
      caseA: { daysElapsedSinceLastStatusChange: number },
      caseB: { daysElapsedSinceLastStatusChange: number },
    ) => {
      if (
        caseA.daysElapsedSinceLastStatusChange <
        caseB.daysElapsedSinceLastStatusChange
      )
        return 1;
      if (
        caseA.daysElapsedSinceLastStatusChange >
        caseB.daysElapsedSinceLastStatusChange
      )
        return -1;
      return 0;
    };

    const getSubmittedOrCAVDate = (
      caseStatusHistory: { updatedCaseStatus: string; formattedDate: string }[],
    ): string | undefined => {
      return caseStatusHistory.find(statusHistory =>
        ['Submitted', 'CAV'].includes(statusHistory.updatedCaseStatus),
      )?.formattedDate;
    };

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
              <th>
                Days in
                <br /> Status
              </th>
              <th>Status Date</th>
              <th>
                Final Brief
                <br /> Due Date
              </th>
              <th>Status of Matter</th>
            </tr>
          </thead>
          <tbody>
            {judgeActivityReportHelper.filteredSubmittedAndCavCasesByJudge
              .sort(daysInStatusSortHandler)
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
                        {getSubmittedOrCAVDate(formattedCase.caseStatusHistory)}
                      </td>
                      <td>
                        <DateInput
                          id={`final-brief-due-date-${formattedCase.docketNumber}`}
                          label={''}
                          showDateHint={false}
                          values={{
                            day: '',
                            month: '',
                            year: '',
                          }}
                        />
                      </td>
                      <td>
                        <select
                          className={classNames(
                            'usa-select',
                            'inline-select',
                            'width-180',
                            'select-left',
                            'margin-left-1pt5rem',
                          )}
                        >
                          {StatusOfMatter.map(from => (
                            <option key={from} value={from}>
                              {from}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    <tr className="wip-submitted-cav-cases-primary-issue-row">
                      <td colSpan={3}></td>
                      <td colSpan={6}>
                        <div
                          style={{
                            display: 'flex',
                            height: 'fit-content',
                            width: '100%',
                          }}
                        >
                          <div
                            className="margin-top-1 margin-right-2"
                            style={{ flex: '0 0 auto' }}
                          >
                            <b>Primary Issue:</b>
                          </div>
                          <div className="margin-top-1" style={{ flex: '1' }}>
                            {formattedCase.primaryIssue}
                          </div>
                          <div
                            className="margin-left-6 margin-top-auto margin-bottom-auto"
                            style={{ flex: '0 0 auto' }}
                          >
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
                              <div
                                style={{
                                  display: 'grid',
                                  gridTemplateRows: 'auto auto',
                                }}
                              >
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
                                      console.log('trash click');
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
          <tbody></tbody>
        </table>
        {showModal === 'AddEditPrimaryIssueModal' && (
          <AddEditPrimaryIssueModal />
        )}
      </React.Fragment>
    );
  },
);

SubmittedCavCasesTable.displayName = 'SubmittedCavCasesTable';
