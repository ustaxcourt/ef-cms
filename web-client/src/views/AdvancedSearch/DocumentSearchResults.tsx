import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { WarningNotificationComponent } from '../WarningNotification';
import { Paginator } from '../../ustc-ui/Pagination/Paginator';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';

import React, { useState, useEffect } from 'react';
import { SortableColumn } from '../../ustc-ui/Table/SortableColumn';
import {
  ASCENDING,
  SORT_ASCENDING_TEXT,
  SORT_DESCENDING_TEXT,
} from '@shared/business/entities/EntityConstants';

const PAGE_SIZE = 5;

export const DocumentSearchResults = connect(
  {
    MAX_SEARCH_RESULTS: state.constants.MAX_SEARCH_RESULTS,
    advancedDocumentSearchHelper: state.advancedDocumentSearchHelper,
    isPublic: state.isPublic,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    showMoreResultsSequence: sequences.showMoreResultsSequence,
    updateDocumentSearchResultsSequence:
      sequences.updateDocumentSearchResultsSequence,
  },
  function DocumentSearchResults({
    advancedDocumentSearchHelper,
    isPublic,
    MAX_SEARCH_RESULTS,
    openCaseDocumentDownloadUrlSequence,
    updateDocumentSearchResultsSequence,
  }) {
    // Pagination state: zero-based page index
    const [currentPaginationPage, setCurrentPaginationPage] = useState(0);

    const results = advancedDocumentSearchHelper.formattedSearchResults || [];

    // Calculate total pages based on PAGE_SIZE
    const totalPages = Math.ceil(results.length / PAGE_SIZE);

    // If results change and current page is out of range, reset page to 0
    useEffect(() => {
      if (currentPaginationPage >= totalPages && totalPages > 0) {
        setCurrentPaginationPage(0);
      }
    }, [results.length, currentPaginationPage, totalPages]);

    // Slice results for current page
    const pagedResults = results.slice(
      currentPaginationPage * PAGE_SIZE,
      currentPaginationPage * PAGE_SIZE + PAGE_SIZE,
    );

    // Handle sorting column header click
    const handleSort = (columnKey: string) => {
      if (advancedDocumentSearchHelper.sortColumn === columnKey) {
        updateDocumentSearchResultsSequence({
          sortColumn: columnKey,
          sortDirection:
            advancedDocumentSearchHelper.sortDirection === 'asc'
              ? 'desc'
              : 'asc',
        });
      } else {
        updateDocumentSearchResultsSequence({
          sortColumn: columnKey,
          sortDirection: 'asc',
        });
      }
      setCurrentPaginationPage(0); // reset page on sort
    };

    return (
      <div aria-live="polite">
        {advancedDocumentSearchHelper.showSearchResults && (
          <>
            {advancedDocumentSearchHelper.showManyResultsMessage && (
              <div className="margin-top-4">
                <WarningNotificationComponent
                  alertWarning={{
                    message: 'Refine your search by adding search criteria.',
                    title: `Displaying the first ${MAX_SEARCH_RESULTS} matches of your search.`,
                  }}
                  dismissible={false}
                  scrollToTop={false}
                />
              </div>
            )}
            <div className="grid-row">
              <div className="tablet:grid-col-10">
                <h1 className="margin-top-1">Results</h1>
              </div>
              <div className="tablet:grid-col-2 float-right text-right text-middle-margin">
                {results.length} match(es) shown
              </div>
            </div>

            <table
              className="usa-table search-results ustc-table responsive-table"
              data-testid="advanced-document-search-results-table"
            >
              <thead>
                <tr>
                  <th>
                    <SortableColumn
                      ascText={SORT_ASCENDING_TEXT.string}
                      currentlySortedField={
                        advancedDocumentSearchHelper.sortColumn
                      }
                      currentlySortedOrder={
                        advancedDocumentSearchHelper.sortDirection
                      }
                      defaultSortOrder={ASCENDING}
                      descText={SORT_DESCENDING_TEXT.string}
                      hasRows={true}
                      sortField="formattedFiledDate"
                      title="Filed Date"
                      onClickSequence={() => {
                        handleSort('formattedFiledDate');
                      }}
                    />
                  </th>
                  <th aria-hidden="true" className="small-column"></th>
                  <th>
                    <SortableColumn
                      ascText={SORT_ASCENDING_TEXT.string}
                      currentlySortedField={
                        advancedDocumentSearchHelper.sortColumn
                      }
                      currentlySortedOrder={
                        advancedDocumentSearchHelper.sortDirection
                      }
                      defaultSortOrder={ASCENDING}
                      descText={SORT_DESCENDING_TEXT.string}
                      hasRows={true}
                      sortField="documentTitle"
                      title={advancedDocumentSearchHelper.documentTypeVerbiage}
                      onClickSequence={() => handleSort('documentTitle')}
                    />
                  </th>
                  <th>
                    <SortableColumn
                      ascText={SORT_ASCENDING_TEXT.string}
                      currentlySortedField={
                        advancedDocumentSearchHelper.sortColumn
                      }
                      currentlySortedOrder={
                        advancedDocumentSearchHelper.sortDirection
                      }
                      defaultSortOrder={ASCENDING}
                      descText={SORT_DESCENDING_TEXT.string}
                      hasRows={true}
                      sortField="caseTitle"
                      title="Case Title"
                      onClickSequence={() => handleSort('caseTitle')}
                    />
                  </th>
                  <th>
                    <SortableColumn
                      ascText={SORT_ASCENDING_TEXT.string}
                      currentlySortedField={
                        advancedDocumentSearchHelper.sortColumn
                      }
                      currentlySortedOrder={
                        advancedDocumentSearchHelper.sortDirection
                      }
                      defaultSortOrder={ASCENDING}
                      descText={SORT_DESCENDING_TEXT.string}
                      hasRows={true}
                      sortField="formattedJudgeName"
                      title="Judge"
                      onClickSequence={() => handleSort('formattedJudgeName')}
                    />
                  </th>
                  <th>
                    <SortableColumn
                      ascText={SORT_ASCENDING_TEXT.date}
                      currentlySortedField={
                        advancedDocumentSearchHelper.sortColumn
                      }
                      currentlySortedOrder={
                        advancedDocumentSearchHelper.sortDirection
                      }
                      defaultSortOrder={ASCENDING}
                      descText={SORT_DESCENDING_TEXT.date}
                      hasRows={true}
                      sortField="numberOfPagesFormatted"
                      title="Pages"
                      onClickSequence={() =>
                        handleSort('numberOfPagesFormatted')
                      }
                    />
                  </th>
                  <th>
                    <SortableColumn
                      ascText={SORT_ASCENDING_TEXT.string}
                      currentlySortedField={
                        advancedDocumentSearchHelper.sortColumn
                      }
                      currentlySortedOrder={
                        advancedDocumentSearchHelper.sortDirection
                      }
                      defaultSortOrder={ASCENDING}
                      descText={SORT_DESCENDING_TEXT.string}
                      hasRows={true}
                      sortField="docketNumber"
                      title="Docket No."
                      onClickSequence={() => handleSort('docketNumber')}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedResults.map(result => (
                  <tr
                    className="search-result"
                    key={`${result.docketEntryId}-${result.docketNumber}`}
                  >
                    <td>{result.formattedFiledDate}</td>
                    <td aria-hidden="true" className="small-column">
                      {result.showSealedIcon && (
                        <Icon
                          aria-label="sealed"
                          className="iconSealed"
                          icon={['fa', 'lock']}
                          size="1x"
                        />
                      )}
                    </td>
                    <td>
                      <Button
                        link
                        className="padding-0"
                        data-testid={`docket-number-link-${result.docketNumber}`}
                        onClick={() => {
                          openCaseDocumentDownloadUrlSequence({
                            docketEntryId: result.docketEntryId,
                            docketNumber: result.docketNumber,
                            isPublic,
                            useSameTab: false,
                          });
                        }}
                      >
                        {result.documentTitle}
                      </Button>
                    </td>
                    <td>{result.caseTitle}</td>
                    <td>{result.formattedJudgeName}</td>
                    <td>{result.numberOfPagesFormatted}</td>
                    <td data-testid={`docket-number-${result.docketNumber}`}>
                      <CaseLink
                        formattedCase={result}
                        rel="noreferrer"
                        target={
                          advancedDocumentSearchHelper.isInternalUser
                            ? '_blank'
                            : ''
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <Paginator
                currentPageIndex={currentPaginationPage}
                totalPages={totalPages}
                onPageChange={currentPage => {
                  setCurrentPaginationPage(currentPage);
                }}
              />
            )}
          </>
        )}
        {advancedDocumentSearchHelper.showNoMatches && (
          <div id="no-search-results">
            <h1 className="margin-top-4">No Matches Found</h1>
            <p>Check your search terms and try again.</p>
          </div>
        )}
      </div>
    );
  },
);

DocumentSearchResults.displayName = 'DocumentSearchResults';
