import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PendingReportList = connect(
  {
    formattedPendingItemsHelper: state.formattedPendingItemsHelper,
    hasPendingItemsResults: state.pendingReports.hasPendingItemsResults,
    loadMorePendingItemsSequence: sequences.loadMorePendingItemsSequence,
    pendingItemsTotal: state.pendingReports.pendingItemsTotal,
    pendingReportListHelper: state.pendingReportListHelper,
    setPendingReportSelectedJudgeSequence:
      sequences.setPendingReportSelectedJudgeSequence,
  },
  function PendingReportList({
    formattedPendingItemsHelper,
    hasPendingItemsResults,
    loadMorePendingItemsSequence,
    pendingItemsTotal,
    pendingReportListHelper,
    setPendingReportSelectedJudgeSequence,
  }) {
    return (
      <>
        <div className="grid-row margin-bottom-2">
          <div className="tablet:grid-col-8">
            <div className="grid-row grid-gap">
              <label
                className="dropdown-label-serif margin-right-3"
                htmlFor="inline-select"
                id="pending-reports-filter-label"
              >
                Show items for
              </label>
              <BindedSelect
                aria-describedby="pending-reports-filter-label"
                aria-label="judge filter"
                bind="screenMetadata.pendingItemsFilters.judge"
                className="select-left inline-select width-mobile"
                data-testid="dropdown-select-judge"
                id="judgeFilter"
                name="judge"
                onChange={judge =>
                  setPendingReportSelectedJudgeSequence({
                    judge,
                  })
                }
              >
                <option value="">-Judge-</option>
                {formattedPendingItemsHelper.judges.map(judge => (
                  <option key={`pending-judge-${judge}`} value={judge}>
                    {judge}
                  </option>
                ))}
              </BindedSelect>
            </div>
          </div>
          {hasPendingItemsResults && (
            <div className="grid-col-4 text-right margin-top-1">
              <span className="text-semibold">Count: {pendingItemsTotal}</span>
            </div>
          )}
        </div>

        <table
          aria-describedby="judgeFilter"
          aria-label="pending items"
          className="usa-table ustc-table pending-items subsection"
          id="pending-items"
        >
          <thead>
            <tr>
              <th />
              <th aria-label="Docket Number">Docket No.</th>
              <th>Date Filed</th>
              <th>Case Title</th>
              <th>Filings and Proceedings</th>
              <th>Case Status</th>
              <th>Judge</th>
            </tr>
          </thead>
          {formattedPendingItemsHelper.items.map(item => (
            <tbody
              key={`pending-item-${item.formattedFiledDate}-${item.caseTitle}`}
            >
              <tr className="pending-item-row">
                <td>
                  <ConsolidatedCaseIcon
                    consolidatedIconTooltipText={
                      item.consolidatedIconTooltipText
                    }
                    inConsolidatedGroup={item.inConsolidatedGroup}
                    showLeadCaseIcon={item.isLeadCase}
                  />
                </td>
                <td>
                  <CaseLink formattedCase={item} />
                </td>
                <td>{item.formattedFiledDate}</td>
                <td>{item.caseTitle}</td>
                <td>
                  <a href={item.documentLink}>{item.formattedName}</a>
                </td>
                <td>{item.formattedStatus}</td>
                <td>{item.associatedJudgeFormatted}</td>
              </tr>
            </tbody>
          ))}
        </table>

        {pendingReportListHelper.showNoPendingItems && (
          <p>There is nothing pending.</p>
        )}

        {pendingReportListHelper.showSelectJudgeText && (
          <p>Select a judge to view their pending items.</p>
        )}

        {pendingReportListHelper.showLoadMore && (
          <Button
            secondary
            className="margin-bottom-20"
            onClick={() => {
              loadMorePendingItemsSequence();
            }}
          >
            Load More
          </Button>
        )}
      </>
    );
  },
);

PendingReportList.displayName = 'PendingReportList';
