import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { Paginator } from '../../ustc-ui/Pagination/Paginator';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import React, { useEffect } from 'react';
import { SortableColumn } from '../../ustc-ui/Table/SortableColumn';
import {
  ASCENDING,
  SORT_ASCENDING_TEXT,
  SORT_DESCENDING_TEXT,
  ADVANCED_DOCUMENT_SEARCH_PAGE_SIZE,
} from '@shared/business/entities/EntityConstants';
import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { BaseModal } from '@web-client/ustc-ui/Modal/BaseModal';

export const DocumentSearchResults = connect(
  {
    MAX_SEARCH_RESULTS: state.constants.MAX_SEARCH_RESULTS,
    advancedDocumentSearchHelper: state.advancedDocumentSearchHelper,
    isPublic: state.isPublic,
    showModal: state.modal.showModal,
    currentPaginationPage: state.currentPaginationPage,
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
    MAX_SEARCH_RESULTS,
    openCaseDocumentDownloadUrlSequence,
    updateDocumentSearchResultsSequence,
    setCurrentPaginationPageSequence,
    currentPaginationPage,
    showModal,
    openCleanModalSequence,
  }) {
    const results = advancedDocumentSearchHelper.formattedSearchResults || [];

    // Calculate total pages based on PAGE_SIZE
    const totalPages = Math.ceil(
      results.length / ADVANCED_DOCUMENT_SEARCH_PAGE_SIZE,
    );

    // If results change and current page is out of range, reset page to 0
    useEffect(() => {
      if (currentPaginationPage >= totalPages && totalPages > 0) {
        setCurrentPaginationPageSequence({ currentPaginationPage: 0 });
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
      setCurrentPaginationPageSequence({ currentPaginationPage: 0 }); // reset page on sort
    };

    // Handle mobile dropdown sort change
    const handleMobileSortChange = e => {
      const { value } = e.target;
      const [column, direction] = value.split('|');
      updateDocumentSearchResultsSequence({
        sortColumn: column,
        sortDirection: direction,
      });
      setCurrentPaginationPageSequence({ currentPaginationPage: 0 });
    };

    const sortOptions = [
      {
        label: 'Sort by Newest',
        value: 'formattedFiledDate|desc',
      },
      {
        label: 'Sort by Oldest',
        value: 'formattedFiledDate|asc',
      },
      {
        label: `Sort by Order (ascending)`,
        value: 'documentTitle|asc',
      },
      {
        label: `Sort by Order (descending)`,
        value: 'documentTitle|desc',
      },
      {
        label: 'Sort by Case Title (ascending)',
        value: 'caseTitle|asc',
      },
      {
        label: 'Sort by Case Title (descending)',
        value: 'caseTitle|desc',
      },
      {
        label: 'Sort by Judge (ascending)',
        value: 'formattedJudgeName|asc',
      },
      {
        label: 'Sort by Judge (descending)',
        value: 'formattedJudgeName|desc',
      },
      {
        label: 'Sort by Pages (ascending)',
        value: 'numberOfPagesFormatted|asc',
      },
      {
        label: 'Sort by Pages (descending)',
        value: 'numberOfPagesFormatted|desc',
      },
      {
        label: 'Sort by Docket No. (ascending)',
        value: 'docketNumber|asc',
      },
      {
        label: 'Sort by Docket No. (descending)',
        value: 'docketNumber|desc',
      },
    ];

    return (
      <>
        <div aria-live="polite">
          {advancedDocumentSearchHelper.showSearchResults && (
            <>
              <div className="grid-row results-header-row align-items-center">
                <div className="tablet:grid-col-4">
                  <h1 className="margin-top-1">Results</h1>
                </div>
                <Mobile>
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
                </Mobile>
                <div className="tablet:grid-col-4 paginator-center">
                  {totalPages > 1 && (
                    <Mobile>
                      <div className="margin-bottom-4">
                        <Paginator
                          currentPageIndex={currentPaginationPage}
                          totalPages={totalPages}
                          onPageChange={currentPage => {
                            setCurrentPaginationPageSequence({
                              currentPaginationPage: currentPage,
                            });
                          }}
                        />
                      </div>
                    </Mobile>
                  )}
                  {totalPages > 1 && (
                    <NonMobile>
                      <Paginator
                        currentPageIndex={currentPaginationPage}
                        totalPages={totalPages}
                        onPageChange={currentPage => {
                          setCurrentPaginationPageSequence({
                            currentPaginationPage: currentPage,
                          });
                        }}
                      />
                    </NonMobile>
                  )}
                </div>
                <NonMobile>
                  <div className="tablet:grid-col-4 float-right text-right text-middle-margin margin-top-2">
                    {results.length === MAX_SEARCH_RESULTS && (
                      <>
                        <FontAwesomeIcon
                          className="fa-icon-blue icon-spacing-4"
                          icon="info-circle"
                          title={`Search is limited to ${MAX_SEARCH_RESULTS.toLocaleString()} results.`}
                          tabIndex={0}
                          aria-label={`Search is limited to ${MAX_SEARCH_RESULTS.toLocaleString()} results.`}
                        />
                      </>
                    )}
                    <b className="text-semibold">Count:</b>{' '}
                    {results.length.toLocaleString()}
                  </div>
                </NonMobile>
                <Mobile>
                  {showModal === 'showCountModalMobile' && (
                    <BaseModal title="CountModal">
                      <div>
                        <h2>Count: {MAX_SEARCH_RESULTS.toLocaleString()}</h2>
                        <p>
                          Search is limited to{' '}
                          {MAX_SEARCH_RESULTS.toLocaleString()} results.
                        </p>
                        <Button
                          icon="times-circle"
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
                    {results.length === MAX_SEARCH_RESULTS && (
                      <FontAwesomeIcon
                        className="fa-icon-blue icon-spacing-4"
                        icon="info-circle"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          openCleanModalSequence({
                            showModal: 'showCountModalMobile',
                          });
                        }}
                      />
                    )}
                    <b className="text-semibold">Count:</b>{' '}
                    {results.length.toLocaleString()}
                  </div>
                </Mobile>
              </div>

              <NonMobile>
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
                          title={
                            advancedDocumentSearchHelper.documentTypeVerbiage
                          }
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
                          onClickSequence={() =>
                            handleSort('formattedJudgeName')
                          }
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
                <table
                  aria-label="document search results"
                  className="usa-table gray-header responsive-table row-only todays-orders-mobile"
                >
                  <thead>
                    <tr>
                      <th aria-label="Docket Number">Docket No.</th>
                      <th>Filed Date</th>
                      <th>Case Title</th>
                      <th>Order</th>
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
                        <th>Case Title</th>
                        <td className="divider">{result.caseTitle}</td>
                        <th>Order</th>
                        <td className="divider">
                          <Button
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
                    });
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
