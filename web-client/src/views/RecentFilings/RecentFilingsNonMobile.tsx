import {
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { SortableHeader } from '@web-client/ustc-ui/Table/SortableHeader';
import classNames from 'classnames';
import React from 'react';
import { RecentFiling } from '@shared/business/entities/RecentFiling';
import { BigHeader } from '../BigHeader';
import { RecentFilingsDocumentDisplay } from './RecentFilingsDocumentDisplay';

type SortableField = 'docketNumber' | 'filedDate' | 'document' | 'caseTitle';
type SortOrder = 'asc' | 'desc';

interface RecentFilingsTableSort {
  sortField: SortableField;
  sortOrder: SortOrder;
}

interface SortOption {
  value: string;
  label: string;
  field: SortableField;
  order: SortOrder;
}

interface RecentFilingsHelper {
  sortOptions: SortOption[];
  getDocumentDisplayProperties: (filing: RecentFiling) => {
    showLinkToDocument: boolean;
    showDocumentViewerLink: boolean;
    showDocumentDescriptionWithoutLink: boolean;
    showDocumentProcessing: boolean;
  };
}

type SequenceFunction = (props: any) => void;

export const RecentFilingsNonMobile = ({
  recentFilingsTableSort,
  sortTableSequence,
  recentFilingsHelper,
  openCaseDocumentDownloadUrlSequence,
  currentDate,
  paginatorTop,
  paginatorBottom,
  activePage,
  pageRecords,
  setActivePage,
  totalPages,
  isLoading = false,
}: {
  recentFilingsTableSort: RecentFilingsTableSort;
  sortTableSequence: SequenceFunction;
  recentFilingsHelper: RecentFilingsHelper;
  openCaseDocumentDownloadUrlSequence: SequenceFunction;
  currentDate: string;
  paginatorTop: React.RefObject<HTMLDivElement | null>;
  paginatorBottom: React.RefObject<HTMLDivElement | null>;
  activePage: number;
  pageRecords: RecentFiling[];
  setActivePage: (page: number) => void;
  totalPages: number;
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <output className="text-center padding-4" aria-live="polite">
        <FontAwesomeIcon
          className="fa-spin spinner"
          icon="sync"
          size="6x"
          aria-hidden="true"
        />
        <p>Loading recent filings...</p>
      </output>
    );
  }

  return (
    <>
      <BigHeader text="Recent Filings" />
      <div className="grid-row padding-x-5 grid-container">
        <div className="grid-col-12">
          <div className="read-only-text" data-testid="recent-filings-info">
            This page shows new docket entries dated within the last 7 days for
            any cases for which you are associated. Please consult the docket
            records for your cases to view all the docket entries. Information
            on this page is current as of {currentDate}.
          </div>
          <div id="recent-filings-description" className="sr-only">
            Table showing recent filings with columns for Docket Number, Filed
            Date, Document, and Case Title. All columns are sortable. Use the
            column headers to sort the data.
          </div>

          <div className="margin-top-4">
            <div>
              <div ref={paginatorTop} data-testid="pagination">
                <Paginator
                  currentPageIndex={activePage}
                  totalPages={totalPages}
                  onPageChange={pageChange => {
                    setActivePage(pageChange);
                    focusPaginatorTop(paginatorTop);
                  }}
                />
              </div>

              <div className="margin-bottom-2 text-right">
                <strong>Count: </strong>
                {pageRecords.length || 0}
              </div>

              <table
                aria-label="Recent filings table with sortable columns"
                aria-describedby="recent-filings-description"
                role="grid"
                className="usa-table ustc-table usa-table--stacked"
                data-testid="recent-filings-table"
              >
                <thead>
                  <tr>
                    <SortableHeader
                      sortField="docketNumber"
                      sortType="string"
                      tableSort={recentFilingsTableSort}
                      title="Docket Number"
                      onSort={sortTableSequence}
                      stateKey="recentFilingsTableSort"
                      data-testid="sort-docket-number"
                    />
                    <SortableHeader
                      sortField="filedDate"
                      sortType="date"
                      tableSort={recentFilingsTableSort}
                      title="Filed Date"
                      onSort={sortTableSequence}
                      stateKey="recentFilingsTableSort"
                      data-testid="sort-filed-date"
                    />
                    <SortableHeader
                      sortField="document"
                      sortType="string"
                      tableSort={recentFilingsTableSort}
                      title="Document"
                      onSort={sortTableSequence}
                      stateKey="recentFilingsTableSort"
                      data-testid="sort-document"
                    />
                    <SortableHeader
                      sortField="caseTitle"
                      sortType="string"
                      tableSort={recentFilingsTableSort}
                      title="Case Title"
                      onSort={sortTableSequence}
                      stateKey="recentFilingsTableSort"
                      data-testid="sort-case-title"
                    />
                  </tr>
                </thead>
                <tbody>
                  {pageRecords.map(filing => (
                    <tr
                      key={`recent-filings-${filing.docketNumber}-${filing.docketEntryId}`}
                    >
                      <td>
                        {filing.inConsolidatedGroup && (
                          <ConsolidatedCaseIcon
                            consolidatedIconTooltipText={
                              filing.consolidatedIconTooltipText
                            }
                            inConsolidatedGroup={filing.inConsolidatedGroup}
                            showLeadCaseIcon={filing.isLeadCase || false}
                            data-testid="consolidated-case-icon"
                          />
                        )}
                        <a
                          href={`/case-detail/${filing.docketNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          className={classNames(
                            filing.inConsolidatedGroup
                              ? 'margin-left-1'
                              : 'margin-left-0',
                          )}
                          data-testid="case-number-link"
                        >
                          {filing.docketNumber}
                        </a>
                      </td>
                      <td>
                        {formatDateString(filing.filedDate, FORMATS.MMDDYYYY)}
                      </td>
                      <td>
                        <RecentFilingsDocumentDisplay
                          filing={filing}
                          displayProperties={recentFilingsHelper.getDocumentDisplayProperties(
                            filing,
                          )}
                          onDownloadClick={filing => {
                            openCaseDocumentDownloadUrlSequence({
                              docketEntryId: filing.docketEntryId,
                              docketNumber: filing.docketNumber,
                              isPublic: false,
                              useSameTab: false,
                            });
                          }}
                        />
                      </td>
                      <td>{filing.caseTitle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pageRecords.length === 0 && (
                <div
                  className="margin-top-2"
                  data-testid="no-recent-filings-message"
                >
                  No new entries in the last 7 days.
                </div>
              )}
            </div>
            <div ref={paginatorBottom}>
              <Paginator
                currentPageIndex={activePage}
                totalPages={totalPages}
                onPageChange={pageChange => {
                  setActivePage(pageChange);
                  focusPaginatorTop(paginatorTop);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
