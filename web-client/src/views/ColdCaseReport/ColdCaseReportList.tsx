import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ColdCaseEntry } from '@web-api/business/useCases/reports/coldCaseReportInteractor';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import {
  isInConsolidatedGroup,
  isLeadCase,
} from '@shared/business/entities/cases/Case';
import React, { useRef, useState } from 'react';

const ITEMS_PER_PAGE = 100;

export function useClientSidePaginator<T>(fullDataSet: T[], pageSize) {
  const [activePage, setActivePage] = useState(0);
  const totalPages = Math.ceil(fullDataSet.length / pageSize);
  const entriesInPage = fullDataSet.slice(
    activePage * pageSize,
    activePage * pageSize + pageSize,
  );

  return {
    activePage,
    pageRecords: entriesInPage,
    setActivePage,
    totalPages,
  };
}

export function ColdCaseReportList({ entries }: { entries: ColdCaseEntry[] }) {
  const paginatorTop = useRef(null);

  const { activePage, pageRecords, setActivePage, totalPages } =
    useClientSidePaginator(entries, ITEMS_PER_PAGE);

  return (
    <>
      <div ref={paginatorTop}>
        <Paginator
          breakClassName="hide"
          forcePage={activePage}
          marginPagesDisplayed={0}
          pageCount={totalPages}
          pageRangeDisplayed={0}
          onPageChange={async pageChange => {
            setActivePage(pageChange.selected);
            focusPaginatorTop(paginatorTop);
          }}
        />
      </div>

      <div className="grid-row margin-bottom-2">
        <div className="grid-col text-right margin-top-1">
          <Button
            link
            aria-label="export pending report"
            className="margin-top-2"
            data-testid="export-pending-report"
            disabled={entries.length === 0}
            icon="file-export"
            onClick={() => {
              const csvConfig = mkConfig({ useKeysAsHeaders: true });
              const csv = generateCsv(csvConfig)(entries);
              download(csvConfig)(csv);
            }}
          >
            Export
          </Button>
          <span className="text-semibold" data-testid="display-data-count">
            Count: {entries.length}
          </span>
        </div>
      </div>

      <table
        aria-describedby="judgeFilter"
        aria-label="pending items"
        className="usa-table ustc-table pending-items subsection"
        data-testid="display-pending-report-table"
        id="pending-items"
      >
        <thead>
          <tr>
            <th />
            <th aria-label="Docket Number">Docket No.</th>
            <th>Date Created</th>
            <th>Case Type</th>
            <th>Requested Place of Trial</th>
            <th>Last Entry</th>
            <th>Last Event</th>
          </tr>
        </thead>
        {pageRecords.map(item => (
          <tbody key={`cold-case-entry-${item.docketNumber}`}>
            <tr className="pending-item-row">
              <td>
                <ConsolidatedCaseIcon
                  consolidatedIconTooltipText={
                    isLeadCase(item) ? 'Lead case' : 'Consolidated case'
                  }
                  inConsolidatedGroup={isInConsolidatedGroup(item)}
                  showLeadCaseIcon={isLeadCase(item)}
                />
              </td>
              <td>
                <CaseLink formattedCase={item} />
              </td>
              <td>{item.createdAt}</td>
              <td>{item.caseType}</td>
              <td>{item.preferredTrialCity}</td>
              <td>{item.filingDate}</td>
              <td>{item.eventCode}</td>
            </tr>
          </tbody>
        ))}
      </table>

      {entries.length === 0 && <p>There is no cold cases.</p>}

      <Paginator
        breakClassName="hide"
        forcePage={activePage}
        marginPagesDisplayed={0}
        pageCount={totalPages}
        pageRangeDisplayed={0}
        onPageChange={async pageChange => {
          setActivePage(pageChange.selected);
          focusPaginatorTop(paginatorTop);
        }}
      />
    </>
  );
}

ColdCaseReportList.displayName = 'ColdCaseReportList';