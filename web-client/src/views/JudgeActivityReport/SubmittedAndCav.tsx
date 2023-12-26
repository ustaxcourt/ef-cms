import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { SortableColumn } from '@web-client/ustc-ui/Table/SortableColumn';
import { connect } from '@web-client/presenter/shared.cerebral';
import { formatPositiveNumber } from '@shared/business/utilities/formatPositiveNumber';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const SubmittedAndCav = connect(
  {
    constants: state.constants,
    judgeActivityReportHelper: state.judgeActivityReportHelper,
    sortTableSequence: sequences.sortTableSequence,
    tableSort: state.tableSort,
  },
  function SubmittedAndCav({
    constants,
    judgeActivityReportHelper,
    sortTableSequence,
    tableSort,
  }) {
    return (
      <>
        <table
          aria-describedby="progressDescription"
          className="usa-table ustc-table"
        >
          <caption id="progressDescription">
            <div className="grid-row display-flex flex-row flex-align-end">
              <div className="grid-col-9 table-caption-serif">
                Submitted/CAV Cases
              </div>
              <div className="display-flex flex-column flex-align-end grid-col-fill text-semibold">
                Count:{' '}
                {formatPositiveNumber(
                  judgeActivityReportHelper.progressDescriptionTableTotal,
                )}
              </div>
            </div>
          </caption>
          <thead>
            <tr>
              <th aria-label="consolidation icon">
                <span className="usa-sr-only">Consolidated Case Indicator</span>
              </th>
              <th aria-label="docket number">Docket No.</th>
              <th aria-label="number of cases">No. of Cases</th>
              <th aria-label="judge">
                <SortableColumn
                  ascText={constants.ALPHABETICALLY_ASCENDING}
                  currentlySortedField={tableSort.sortField}
                  currentlySortedOrder={tableSort.sortOrder}
                  defaultSortOrder={constants.ASCENDING}
                  descText={constants.ALPHABETICALLY_DESCENDING}
                  hasRows={
                    judgeActivityReportHelper.submittedAndCavCasesByJudge
                      .length > 0
                  }
                  sortField="associatedJudge"
                  title="Judge"
                  onClickSequence={sortTableSequence}
                />
              </th>
              <th aria-label="petitioners">Petitioner(s)</th>
              <th aria-label="case status">Case Status</th>
              <th aria-label="days in status">
                <SortableColumn
                  ascText={constants.CHRONOLOGICALLY_ASCENDING}
                  currentlySortedField={tableSort.sortField}
                  currentlySortedOrder={tableSort.sortOrder}
                  defaultSortOrder={constants.ASCENDING}
                  descText={constants.CHRONOLOGICALLY_DESCENDING}
                  hasRows={
                    judgeActivityReportHelper.submittedAndCavCasesByJudge
                      .length > 0
                  }
                  sortField="daysElapsedSinceLastStatusChange"
                  title="Days in Status"
                  onClickSequence={sortTableSequence}
                />
              </th>
              <th aria-label="status date">Status Date</th>
              <th aria-label="final brief due date">Final Brief Due Date</th>
              <th aria-label="status of matter">Status of Matter</th>
            </tr>
          </thead>
          <tbody>
            {judgeActivityReportHelper.submittedAndCavCasesByJudge.map(
              (formattedCase, index) => {
                return (
                  <React.Fragment key={`case-row-${index}`}>
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
                        <CaseLink
                          formattedCase={formattedCase}
                          rel="noopener noreferrer"
                          target="_blank"
                        />
                      </td>
                      <td>
                        {formatPositiveNumber(
                          formattedCase?.formattedCaseCount,
                        )}
                      </td>
                      <td>{formattedCase.associatedJudge}</td>
                      <td>{formattedCase.caseCaption}</td>
                      <td>{formattedCase.status}</td>
                      <td>
                        {formatPositiveNumber(
                          formattedCase.daysElapsedSinceLastStatusChange,
                        )}
                      </td>
                      <td>{formattedCase.statusDate}</td>
                      <td>
                        {
                          formattedCase.caseWorksheet
                            ?.formattedFinalBriefDueDate
                        }
                      </td>
                      <td>{formattedCase.caseWorksheet?.statusOfMatter}</td>
                    </tr>
                    <tr>
                      <td colSpan={3}></td>
                      <td colSpan={7}>
                        <span className="text-bold margin-right-1">
                          Primary Issue:
                        </span>
                        {formattedCase.caseWorksheet?.primaryIssue}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              },
            )}
          </tbody>
        </table>
        {judgeActivityReportHelper.progressDescriptionTableTotal === 0 && (
          <p>{'There are no cases with a status of "Submitted" or "CAV".'}</p>
        )}
      </>
    );
  },
);
