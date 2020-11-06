import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PendingReportList = connect(
  {
    fetchPendingItemsSequence: sequences.fetchPendingItemsSequence,
    formattedPendingItems: state.formattedPendingItems,
    loadMorePendingItemsSequence: sequences.loadMorePendingItemsSequence,
    pendingReportListHelper: state.pendingReportListHelper,
    setPendingReportSelectedJudgeSequence:
      sequences.setPendingReportSelectedJudgeSequence,
  },
  function PendingReportList({
    formattedPendingItems,
    loadMorePendingItemsSequence,
    pendingReportListHelper,
    setPendingReportSelectedJudgeSequence,
  }) {
    return (
      <React.Fragment>
        <div className="grid-row margin-bottom-2">
          <div className="tablet:grid-col-8">
            <div className="grid-row grid-gap">
              <h3 id="filterHeading">Show items for</h3>
              <BindedSelect
                aria-describedby="case-deadlines-tab filterHeading"
                aria-label="judge"
                bind="screenMetadata.pendingItemsFilters.judge"
                className="select-left"
                id="judgeFilter"
                name="judge"
                onChange={judge =>
                  setPendingReportSelectedJudgeSequence({
                    judge,
                  })
                }
              >
                <option value="">-Judge-</option>
                {formattedPendingItems.judges.map((judge, idx) => (
                  <option key={idx} value={judge}>
                    {judge}
                  </option>
                ))}
              </BindedSelect>
            </div>
          </div>
          {pendingReportListHelper.hasPendingItemsResults && (
            <div className="grid-col-4 text-right margin-top-1">
              <span className="text-semibold">
                Count: {pendingReportListHelper.searchResultsCount}
              </span>
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
              <th aria-label="Docket Number">Docket No.</th>
              <th>Date Filed</th>
              <th>Case Title</th>
              <th>Filings and Proceedings</th>
              <th>Case Status</th>
              <th>Judge</th>
            </tr>
          </thead>
          {formattedPendingItems.items.map((item, idx) => (
            <tbody key={idx}>
              <tr className="pending-item-row">
                <td>
                  <CaseLink formattedCase={item} />
                </td>
                <td>{item.formattedFiledDate}</td>
                <td>{item.caseTitle}</td>
                <td>
                  <a
                    href={`/case-detail/${item.docketNumber}/document-view?docketEntryId=${item.docketEntryId}`}
                  >
                    {item.formattedName}
                  </a>
                </td>
                <td>{item.status}</td>
                <td>{item.associatedJudgeFormatted}</td>
              </tr>
            </tbody>
          ))}
        </table>

        {pendingReportListHelper.showLoading && (
          <p>Loading pending reports...</p>
        )}

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
      </React.Fragment>
    );
  },
);
