import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import {
  PENDING_REPORT_PAGE_SIZE,
  STATE_KEYS,
} from '@shared/business/entities/EntityConstants';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import { useClientSidePaginator } from '@web-client/utilities/useClientSidePaginator';
import React, { useRef } from 'react';
import { SortableHeader } from '@web-client/ustc-ui/Table/SortableHeader';
import { PendingItemFormatted } from '@shared/business/utilities/formatPendingItem';

type PendingReportListParams = {
  pendingItems: PendingItemFormatted[];
  hasPendingItemsResults: boolean;
  pendingItemsTotal: number;
  pendingReportListHelper: {
    showNoPendingItems: boolean;
    showSelectJudgeText: boolean;
    judges: string[];
  };
  pendingReportTableSortData: {
    sortField: string;
    sortOrder: 'asc' | 'desc';
  };
  sortTableSequence: (props: {
    sortField: string;
    sortOrder: 'asc' | 'desc';
    stateKey?: string;
  }) => void;
  setPendingReportSelectedJudgeSequence: Function;
};

export function PendingReportList({
  hasPendingItemsResults,
  pendingItems,
  pendingItemsTotal,
  pendingReportListHelper,
  setPendingReportSelectedJudgeSequence,
  pendingReportTableSortData,
  sortTableSequence,
}: PendingReportListParams) {
  const paginatorTop = useRef(null);

  const { activePage, pageRecords, setActivePage, totalPages } =
    useClientSidePaginator(pendingItems, PENDING_REPORT_PAGE_SIZE);

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
              onChange={judge => {
                setPendingReportSelectedJudgeSequence({
                  judge,
                });
                setActivePage(0);
              }}
            >
              <option value="">-Judge-</option>
              {pendingReportListHelper.judges.map(judge => (
                <option key={`pending-judge-${judge}`} value={judge}>
                  {judge}
                </option>
              ))}
            </BindedSelect>
          </div>
        </div>
      </div>

      <div ref={paginatorTop}>
        {totalPages > 1 && (
          <Paginator
            currentPageIndex={activePage}
            totalPages={totalPages}
            onPageChange={pageChange => {
              setActivePage(pageChange);
              focusPaginatorTop(paginatorTop);
            }}
          />
        )}
      </div>

      {hasPendingItemsResults && (
        <div className="text-right margin-bottom-2">
          <span className="text-semibold" data-testid="display-data-count">
            Count: {pendingItemsTotal}
          </span>
        </div>
      )}

      <table
        aria-describedby="judgeFilter"
        aria-label="pending items"
        className="usa-table ustc-table pending-items subsection"
        data-testid="display-pending-report-table"
        id="pending-items"
      >
        <thead>
          <tr>
            <th className="icon-column" />
            <SortableHeader
              screenReaderTitle="Docket Number"
              hideOnMobile={true}
              sortField="docketNumber"
              tableSort={pendingReportTableSortData}
              sortType="string"
              className="no-wrap"
              title="Docket No."
              onSort={sortTableSequence}
              stateKey={STATE_KEYS.PENDING_REPORT_TABLE_SORT}
            />
            <SortableHeader
              sortField="receivedAt"
              sortType="date"
              tableSort={pendingReportTableSortData}
              className="no-wrap"
              title="Filed Date"
              onSort={sortTableSequence}
              stateKey={STATE_KEYS.PENDING_REPORT_TABLE_SORT}
            />
            <SortableHeader
              sortField="caseTitle"
              sortType="string"
              tableSort={pendingReportTableSortData}
              className="no-wrap"
              title="Case Title"
              onSort={sortTableSequence}
              stateKey={STATE_KEYS.PENDING_REPORT_TABLE_SORT}
            />
            <SortableHeader
              sortField="formattedName"
              sortType="string"
              tableSort={pendingReportTableSortData}
              className="no-wrap"
              title="Filings and Proceedings"
              onSort={sortTableSequence}
              stateKey={STATE_KEYS.PENDING_REPORT_TABLE_SORT}
            />
            <SortableHeader
              sortField="formattedStatus"
              sortType="string"
              tableSort={pendingReportTableSortData}
              className="no-wrap"
              title="Case Status"
              onSort={sortTableSequence}
              stateKey={STATE_KEYS.PENDING_REPORT_TABLE_SORT}
            />
            <th>Judge</th>
          </tr>
        </thead>
        <tbody>
          {pageRecords.map(item => (
            <tr
              className="pending-item-row"
              key={`pending-item-${item.docketNumber}-${item.docketEntryId}`}
            >
              <td>
                <ConsolidatedCaseIcon
                  consolidatedIconTooltipText={item.consolidatedIconTooltipText}
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
          ))}
        </tbody>
      </table>

      {pendingReportListHelper.showNoPendingItems && (
        <p>There is nothing pending.</p>
      )}

      {pendingReportListHelper.showSelectJudgeText && (
        <p>Select a judge to view their pending items.</p>
      )}

      {totalPages > 1 && (
        <Paginator
          currentPageIndex={activePage}
          totalPages={totalPages}
          onPageChange={pageChange => {
            setActivePage(pageChange);
            focusPaginatorTop(paginatorTop);
          }}
        />
      )}
    </>
  );
}
