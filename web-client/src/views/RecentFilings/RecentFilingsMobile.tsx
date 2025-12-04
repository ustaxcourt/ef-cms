import {
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import { DOCKET_ENTRY_SEALED_TO_TYPES } from '@shared/business/entities/EntityConstants';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { WrappedIcon } from '@web-client/ustc-ui/Icon/Icon';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { RecentFiling } from '@shared/business/useCases/getRecentFilingsForUserInteractor';
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

export const RecentFilingsMobile = ({
  recentFilingsTableSort,
  setRecentFilingsTableSortSequence,
  recentFilingsHelper,
  openCaseDocumentDownloadUrlSequence,
  currentDate,
  paginatorTop,
  activePage,
  pageRecords,
  setActivePage,
  count,
  totalPages,
  isLoading = false,
}: {
  recentFilingsTableSort: RecentFilingsTableSort;
  setRecentFilingsTableSortSequence: SequenceFunction;
  recentFilingsHelper: RecentFilingsHelper;
  openCaseDocumentDownloadUrlSequence: SequenceFunction;
  currentDate: string;
  paginatorTop: React.RefObject<HTMLDivElement | null>;
  activePage: number;
  pageRecords: RecentFiling[];
  setActivePage: (page: number) => void;
  count: number;
  totalPages: number;
  isLoading?: boolean;
}) => {
  const renderViewMyCasesButton = () => (
    <Button link className="mobile-header-button" href="/">
      View my Cases
    </Button>
  );

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
      <BigHeader text="Recent Filings" button={renderViewMyCasesButton()} />
      <div className="padding-x-2">
        <div
          className="read-only-text margin-bottom-2"
          data-testid="recent-filings-info"
        >
          This page shows new docket entries dated within the last 7 days for
          any case(s) for which you are associated. It is provided for
          convenience. Please consult the docket record for your case(s) to view
          all the docket entries. Information on this page is current as of{' '}
          {currentDate}.
        </div>
        <div id="recent-filings-mobile-description" className="sr-only">
          Mobile table showing recent filings with rows containing Docket
          Number, Filed Date, Document, and Case Title information.
        </div>
        <div id="sort-options-description" className="sr-only">
          Choose how to sort the recent filings table. Options include sorting
          by Docket Number, Filed Date, Document, or Case Title in ascending or
          descending order.
        </div>

        <div className="grid-row margin-bottom-4">
          <h3 className="grid-col-4 margin-y-auto">Sort By</h3>
          <select
            aria-label="Sort recent filings by column and order"
            aria-describedby="sort-options-description"
            className="usa-select grid-col-8"
            data-testid="mobile-sort-dropdown"
            value={`${recentFilingsTableSort.sortField}-${recentFilingsTableSort.sortOrder}`}
            onChange={e => {
              const selectedOption = recentFilingsHelper.sortOptions.find(
                option => option.value === e.target.value,
              );
              if (selectedOption) {
                setRecentFilingsTableSortSequence({
                  sortField: selectedOption.field,
                  sortOrder: selectedOption.order,
                });
              }
            }}
          >
            {recentFilingsHelper.sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
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
        {pageRecords.length > 0 && (
          <div className="margin-bottom-2 text-right">
            <strong>Count: </strong>
            {count}
          </div>
        )}
        {pageRecords.length > 0 && (
          <div className="grid-row">
            <table
              className="usa-table gray-header responsive-table row-only todays-orders-mobile"
              aria-label="Recent filings mobile table"
              aria-describedby="recent-filings-mobile-description"
              role="grid"
              data-testid="recent-filings-mobile-table"
            >
              <tbody>
                {pageRecords.map(filing => (
                  <tr
                    key={`recent-filings-mobile-${filing.docketNumber}-${filing.docketEntryId}`}
                  >
                    <td className="docket-number-head">
                      {filing.inConsolidatedGroup && (
                        <span className="margin-right-1">
                          <ConsolidatedCaseIcon
                            consolidatedIconTooltipText={
                              filing.consolidatedIconTooltipText
                            }
                            inConsolidatedGroup={
                              filing.inConsolidatedGroup || false
                            }
                            showLeadCaseIcon={filing.isLeadCase || false}
                            data-testid="consolidated-case-icon"
                          />
                        </span>
                      )}
                      <a
                        href={`/case-detail/${filing.docketNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        data-testid="case-number-link"
                      >
                        {filing.docketNumber}
                      </a>
                    </td>
                    <th>Filed Date</th>
                    <td className="divider">
                      {formatDateString(filing.filedDate, FORMATS.MMDDYYYY)}
                    </td>
                    <th>Document</th>
                    <td className="divider">
                      {filing.isSealed && (
                        <WrappedIcon
                          iconAriaLabel={
                            filing.sealedTo ===
                            DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC
                              ? 'Sealed to the public'
                              : 'Sealed to the public and parties of this case'
                          }
                          icon="lock"
                          iconClass="sealed-case-entry margin-right-1"
                          title={
                            filing.sealedTo ===
                            DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC
                              ? 'Sealed to the public'
                              : 'Sealed to the public and parties of this case'
                          }
                        />
                      )}
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
                    <th>Case Title</th>
                    <td className="divider">{filing.caseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pageRecords.length === 0 && (
          <div className="margin-top-2" data-testid="no-recent-filings-message">
            No new entries in the last 7 days.
          </div>
        )}
      </div>
    </>
  );
};
