import { WrappedIcon } from '../../ustc-ui/Icon/Icon';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { Paginator } from '../../ustc-ui/Pagination/Paginator';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';

import React, { useEffect, useRef } from 'react';
import { SortableColumn } from '../../ustc-ui/Table/SortableColumn';
import {
  ASCENDING,
  SORT_ASCENDING_TEXT,
  SORT_DESCENDING_TEXT,
  ADVANCED_DOCUMENT_SEARCH_PAGE_SIZE,
  MAX_DOCUMENT_SEARCH_RESULTS,
} from '@shared/business/entities/EntityConstants';
import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { BaseModal } from '@web-client/ustc-ui/Modal/BaseModal';

export const DocumentSearchResults = connect(
  {
    advancedDocumentSearchHelper: state.advancedDocumentSearchHelper,
    isPublic: state.isPublic,
    showModal: state.modal.showModal,
    orderCurrentPaginationPage: state.orderCurrentPaginationPage,
    opinionCurrentPaginationPage: state.opinionCurrentPaginationPage,
    advancedSearchTab: state.advancedSearchTab,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    showMoreResultsSequence: sequences.showMoreResultsSequence,
    updateDocumentSearchResultsSequence:
      sequences.updateDocumentSearchResultsSequence,
    setCurrentPaginationPageSequence:
      sequences.setCurrentPaginationPageSequence,
    openCleanModalSequence: sequences.openCleanModalSequence,
  },

  function DocumentSearchResults({
    advancedDocumentSearchHelper,
    isPublic,
    openCaseDocumentDownloadUrlSequence,
    updateDocumentSearchResultsSequence,
    setCurrentPaginationPageSequence,
    orderCurrentPaginationPage,
    opinionCurrentPaginationPage,
    advancedSearchTab,
    showModal,
    openCleanModalSequence,
  }) {
    const paginatorTop = useRef(null);
    const results = advancedDocumentSearchHelper.formattedSearchResults || [];

    const isOpinionTab = advancedSearchTab === 'opinion';
    const currentPaginationPage = isOpinionTab
      ? opinionCurrentPaginationPage
      : orderCurrentPaginationPage;

    // Show search results if there are any
    advancedDocumentSearchHelper.showSearchResults =
      results.length > 0 && !advancedDocumentSearchHelper.showNoMatches;

    // Calculate total pages based on PAGE_SIZE
    const totalPages = Math.ceil(
      results.length / ADVANCED_DOCUMENT_SEARCH_PAGE_SIZE,
    );

    // If results change and current page is out of range, reset page to 0
    useEffect(() => {
      if (currentPaginationPage >= totalPages && totalPages > 0) {
        setCurrentPaginationPageSequence({
          currentPaginationPage: 0,
          advancedSearchTab,
        });
      }
    }, [results.length, currentPaginationPage, totalPages]);

    // Slice results for current page
    const pagedResults = results.slice(
      currentPaginationPage * ADVANCED_DOCUMENT_SEARCH_PAGE_SIZE,
      currentPaginationPage * ADVANCED_DOCUMENT_SEARCH_PAGE_SIZE +
        ADVANCED_DOCUMENT_SEARCH_PAGE_SIZE,
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
      // reset page on sort
      setCurrentPaginationPageSequence({
        currentPaginationPage: 0,
        advancedSearchTab,
      });
    };
    // Handle mobile dropdown sort change
    const handleMobileSortChange = e => {
      const { value } = e.target;
      const [column, direction] = value.split('|');
      updateDocumentSearchResultsSequence({
        sortColumn: column,
        sortDirection: direction,
      });
      setCurrentPaginationPageSequence({
        currentPaginationPage: 0,
        advancedSearchTab,
      });
    };

    const isOpinionType =
      advancedDocumentSearchHelper.documentTypeVerbiage === 'Opinion Type';

    const sortOptions = [
      { label: 'Sort by Newest', value: 'formattedFiledDate|desc' },
      { label: 'Sort by Oldest', value: 'formattedFiledDate|asc' },
      {
        label: `Sort by ${isOpinionType ? 'Opinion Type' : 'Order'} (ascending)`,
        value: 'documentTitle|asc',
      },
      {
        label: `Sort by ${isOpinionType ? 'Opinion Type' : 'Order'} (descending)`,
        value: 'documentTitle|desc',
      },
      { label: 'Sort by Case Title (ascending)', value: 'caseTitle|asc' },
      { label: 'Sort by Case Title (descending)', value: 'caseTitle|desc' },
      { label: 'Sort by Judge (ascending)', value: 'formattedJudgeName|asc' },
      { label: 'Sort by Judge (descending)', value: 'formattedJudgeName|desc' },
      {
        label: 'Sort by Pages (ascending)',
        value: 'numberOfPages|asc',
      },
      {
        label: 'Sort by Pages (descending)',
        value: 'numberOfPages|desc',
      },
      { label: 'Sort by Docket No. (ascending)', value: 'docketNumber|asc' },
      { label: 'Sort by Docket No. (descending)', value: 'docketNumber|desc' },
    ];

    return (
      <>
        <div ref={paginatorTop} aria-live="polite">
          {advancedDocumentSearchHelper.showSearchResults && (
            <>
              <div className="tablet:grid-col-4 margin-top-3">
                <h1>Results</h1>
              </div>

              <NonMobile>
                <div className="grid-row results-header-row align-items-center">
                  <div className="tablet:grid-col-4"></div>

                  <div className="tablet:grid-col-4 margin-bottom-2">
                    {totalPages > 1 && (
                      <Paginator
                        currentPageIndex={currentPaginationPage}
                        totalPages={totalPages}
                        onPageChange={currentPage => {
                          setCurrentPaginationPageSequence({
                            currentPaginationPage: currentPage,
                            advancedSearchTab,
                          });
                          focusPaginatorTop(paginatorTop);
                        }}
                      />
                    )}
                  </div>

                  <div
                    className={`tablet:grid-col-4 text-right ${totalPages < 2 ? ' padding-bottom-1' : ''}`}
                  >
                    {results.length === MAX_DOCUMENT_SEARCH_RESULTS && (
                      <WrappedIcon
                        iconClass="fa-icon-blue icon-spacing-4"
                        icon="info-circle"
                        title={`Search is limited to ${MAX_DOCUMENT_SEARCH_RESULTS.toLocaleString()} results.`}
                        iconAriaLabel={`Search is limited to ${MAX_DOCUMENT_SEARCH_RESULTS.toLocaleString()} results.`}
                      />
                    )}
                    <span
                      className="cursor-default"
                      title={`Search is limited to ${MAX_DOCUMENT_SEARCH_RESULTS.toLocaleString()} results.`}
                      aria-label={`Search is limited to ${MAX_DOCUMENT_SEARCH_RESULTS.toLocaleString()} results.`}
                    >
                      <b className="text-semibold">Count:</b>{' '}
                      <span>{results.length.toLocaleString()}</span>
                    </span>
                  </div>
                </div>

                <table
                  className="usa-table search-results ustc-table responsive-table"
                  data-testid="advanced-document-search-results-table"
                >
                  <thead>
                    <tr>
                      <th className="text-no-wrap overflow-hidden">
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
                          data-testid="sort-button-filed-date"
                          onClickSequence={() => {
                            handleSort('formattedFiledDate');
                          }}
                        />
                      </th>
                      <th aria-hidden="true" className="small-column"></th>
                      <th className="text-no-wrap overflow-hidden">
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
                          title={
                            advancedDocumentSearchHelper.documentTypeVerbiage
                          }
                          onClickSequence={() => handleSort('documentTitle')}
                        />
                      </th>
                      <th className="text-no-wrap overflow-hidden">
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
                      <th className="text-no-wrap overflow-hidden">
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
                          onClickSequence={() =>
                            handleSort('formattedJudgeName')
                          }
                        />
                      </th>
                      <th className="text-no-wrap overflow-hidden">
                        <SortableColumn
                          ascText={SORT_ASCENDING_TEXT.number}
                          currentlySortedField={
                            advancedDocumentSearchHelper.sortColumn
                          }
                          currentlySortedOrder={
                            advancedDocumentSearchHelper.sortDirection
                          }
                          defaultSortOrder={ASCENDING}
                          descText={SORT_DESCENDING_TEXT.number}
                          hasRows={true}
                          sortField="numberOfPages"
                          title="Pages"
                          onClickSequence={() => handleSort('numberOfPages')}
                        />
                      </th>
                      <th className="text-no-wrap overflow-hidden">
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
                        <td data-testid="search-result-filed-date-column">
                          {result.formattedFiledDate}
                        </td>
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
                            overrideReadOnly
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
                        <td data-testid="search-result-row-judge-name">
                          {result.formattedJudgeName}
                        </td>
                        <td>{result.numberOfPagesFormatted}</td>
                        <td
                          data-testid={`docket-number-${result.docketNumber}`}
                        >
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
              </NonMobile>

              <Mobile>
                <div className="grid-row results-header-row align-items-center">
                  <div className="tablet:grid-col-4"></div>
                  <div
                    className="margin-bottom-2"
                    style={{ maxWidth: '100%', width: '100%' }}
                  >
                    <select
                      id="mobile-sort-dropdown"
                      className="usa-select"
                      style={{ width: '100%' }}
                      value={`${advancedDocumentSearchHelper.sortColumn}|${advancedDocumentSearchHelper.sortDirection}`}
                      onChange={handleMobileSortChange}
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {totalPages > 1 && (
                    <div className="margin-bottom-4 tablet:grid-col">
                      <Paginator
                        currentPageIndex={currentPaginationPage}
                        totalPages={totalPages}
                        onPageChange={currentPage => {
                          setCurrentPaginationPageSequence({
                            currentPaginationPage: currentPage,
                            advancedSearchTab,
                          });
                          focusPaginatorTop(paginatorTop);
                        }}
                      />
                    </div>
                  )}

                  {showModal === 'showCountModalMobile' && (
                    <BaseModal title="CountModal">
                      <div>
                        <h2>
                          Count: {MAX_DOCUMENT_SEARCH_RESULTS.toLocaleString()}
                        </h2>
                        <p>
                          Search is limited to{' '}
                          {MAX_DOCUMENT_SEARCH_RESULTS.toLocaleString()}{' '}
                          results.
                        </p>
                        <Button
                          className="width-full tablet:width-auto"
                          onClick={event => {
                            event.stopPropagation();
                            openCleanModalSequence({
                              showModal: null,
                            });
                          }}
                        >
                          Close
                        </Button>
                      </div>
                    </BaseModal>
                  )}

                  <div className="tablet:grid-col-4 float-right text-right text-middle-margin margin-bottom-2">
                    {results.length === MAX_DOCUMENT_SEARCH_RESULTS && (
                      <FontAwesomeIcon
                        className="fa-icon-blue icon-spacing-4"
                        icon="info-circle"
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          openCleanModalSequence({
                            showModal: 'showCountModalMobile',
                          });
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            openCleanModalSequence({
                              showModal: 'showCountModalMobile',
                            });
                          }
                        }}
                      />
                    )}
                    <b className="text-semibold">Count:</b>{' '}
                    {results.length.toLocaleString()}
                  </div>
                </div>

                <table
                  aria-label="document search results"
                  className="usa-table gray-header responsive-table row-only todays-orders-mobile"
                >
                  <thead>
                    <tr>
                      <th aria-label="Docket Number">Docket No.</th>
                      <th>Filed Date</th>
                      <th>
                        {advancedDocumentSearchHelper.documentTypeVerbiage ===
                        'Opinion Type'
                          ? 'Opinion Type'
                          : 'Order'}
                      </th>
                      <th>Case Title</th>
                      <th>Judge</th>
                      <th>Pages</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pagedResults.map(result => (
                      <tr
                        key={`document-search-mobile-${result.docketNumber}-${result.docketEntryId}`}
                      >
                        <td className="docket-number-head">
                          <CaseLink formattedCase={result} />
                        </td>
                        <th>Filed Date</th>
                        <td className="divider">{result.formattedFiledDate}</td>
                        <th>
                          {advancedDocumentSearchHelper.documentTypeVerbiage ===
                          'Opinion Type'
                            ? 'Opinion Type'
                            : 'Order'}
                        </th>
                        <td className="divider">
                          <Button
                            overrideReadOnly
                            link
                            aria-label={`View PDF: ${result.documentTitle}`}
                            className="text-left"
                            overrideMargin={true}
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
                        <th>Case Title</th>
                        <td className="divider">{result.caseTitle}</td>
                        <th>Judge</th>
                        <td className="divider">{result.formattedJudgeName}</td>
                        <th>Pages</th>
                        <td>{result.numberOfPagesFormatted}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Mobile>

              {totalPages > 1 && (
                <Paginator
                  currentPageIndex={currentPaginationPage}
                  totalPages={totalPages}
                  onPageChange={currentPage => {
                    setCurrentPaginationPageSequence({
                      currentPaginationPage: currentPage,
                      advancedSearchTab,
                    });
                    focusPaginatorTop(paginatorTop);
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
      </>
    );
  },
);

DocumentSearchResults.displayName = 'DocumentSearchResults';
