import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { Paginator } from '../../ustc-ui/Pagination/Paginator';
import { SortableColumn } from '../../ustc-ui/Table/SortableColumn';
import { WrappedIcon } from '../../ustc-ui/Icon/Icon';
import { Button } from '../../ustc-ui/Button/Button';
import { BaseModal } from '../../ustc-ui/Modal/BaseModal';
import { MAX_CASE_SEARCH_RESULTS } from '@shared/business/entities/EntityConstants';
import {
  ASCENDING,
  SORT_ASCENDING_TEXT,
  SORT_DESCENDING_TEXT,
} from '@shared/business/entities/EntityConstants';
import { connect } from '@web-client/presenter/shared.cerebral';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';

export const SearchResults = connect(
  {
    advancedSearchHelper: state.advancedSearchHelper,
    caseCurrentPaginationPage: state.caseCurrentPaginationPage,
    openCleanModalSequence: sequences.openCleanModalSequence,
    setCurrentPaginationPageSequence:
      sequences.setCurrentPaginationPageSequence,
    showModal: state.modal.showModal,
    updateDocumentSearchResultsSequence:
      sequences.updateDocumentSearchResultsSequence,
  },
  function SearchResults({
    advancedSearchHelper,
    caseCurrentPaginationPage,
    openCleanModalSequence,
    setCurrentPaginationPageSequence,
    showModal,
    updateDocumentSearchResultsSequence,
  }) {
    const paginatorTop = useRef(null);
    const totalPages = advancedSearchHelper.totalPages || 0;

    useEffect(() => {
      if (caseCurrentPaginationPage >= totalPages && totalPages > 0) {
        setCurrentPaginationPageSequence({
          advancedSearchTab: 'case',
          currentPaginationPage: 0,
        });
      }
    }, [caseCurrentPaginationPage, totalPages]);

    const handleSort = (columnKey: string) => {
      if (advancedSearchHelper.caseSearchSortColumn === columnKey) {
        updateDocumentSearchResultsSequence({
          sortColumn: columnKey,
          sortDirection:
            advancedSearchHelper.caseSearchSortDirection === 'asc'
              ? 'desc'
              : 'asc',
        });
      } else {
        updateDocumentSearchResultsSequence({
          sortColumn: columnKey,
          sortDirection: 'asc',
        });
      }

      setCurrentPaginationPageSequence({
        advancedSearchTab: 'case',
        currentPaginationPage: 0,
      });
    };

    const handleMobileSortChange = e => {
      if (!e.target.value) {
        updateDocumentSearchResultsSequence({});
        setCurrentPaginationPageSequence({
          advancedSearchTab: 'case',
          currentPaginationPage: 0,
        });
        return;
      }

      const [sortColumn, sortDirection] = e.target.value.split('|');

      updateDocumentSearchResultsSequence({
        sortColumn,
        sortDirection,
      });
      setCurrentPaginationPageSequence({
        advancedSearchTab: 'case',
        currentPaginationPage: 0,
      });
    };

    const changePage = (currentPaginationPage: number) => {
      setCurrentPaginationPageSequence({
        advancedSearchTab: 'case',
        currentPaginationPage,
      });
      focusPaginatorTop(paginatorTop);
    };

    return (
      <div ref={paginatorTop} aria-live="polite">
        {advancedSearchHelper.showSearchResults && (
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
                      currentPageIndex={caseCurrentPaginationPage}
                      totalPages={totalPages}
                      onPageChange={changePage}
                    />
                  )}
                </div>

                <div
                  className={`tablet:grid-col-4 text-right ${
                    totalPages < 2 ? ' padding-bottom-1' : ''
                  }`}
                >
                  {advancedSearchHelper.showManyResultsMessage && (
                    <WrappedIcon
                      icon="info-circle"
                      iconAriaLabel={`Search is limited to ${MAX_CASE_SEARCH_RESULTS.toLocaleString()} results.`}
                      iconClass="fa-icon-blue icon-spacing-4"
                      title={`Search is limited to ${MAX_CASE_SEARCH_RESULTS.toLocaleString()} results.`}
                    />
                  )}
                  <span
                    aria-label={`Search is limited to ${MAX_CASE_SEARCH_RESULTS.toLocaleString()} results.`}
                    className="cursor-default"
                    title={`Search is limited to ${MAX_CASE_SEARCH_RESULTS.toLocaleString()} results.`}
                  >
                    <b className="text-semibold">Count:</b>{' '}
                    <span>
                      {advancedSearchHelper.numberOfResults.toLocaleString()}
                    </span>
                  </span>
                </div>
              </div>

              <table className="usa-table search-results ustc-table responsive-table">
                <thead>
                  <tr>
                    <th className="text-no-wrap overflow-hidden small">
                      <SortableColumn
                        ascText={SORT_ASCENDING_TEXT.string}
                        currentlySortedField={
                          advancedSearchHelper.caseSearchSortColumn || ''
                        }
                        currentlySortedOrder={
                          advancedSearchHelper.caseSearchSortDirection ||
                          ASCENDING
                        }
                        defaultSortOrder={ASCENDING}
                        descText={SORT_DESCENDING_TEXT.string}
                        hasRows={true}
                        sortField="petitionerNames"
                        title="Petitioner(s)"
                        onClickSequence={() => handleSort('petitionerNames')}
                      />
                    </th>
                    <th className="text-no-wrap overflow-hidden">
                      <SortableColumn
                        ascText={SORT_ASCENDING_TEXT.string}
                        currentlySortedField={
                          advancedSearchHelper.caseSearchSortColumn || ''
                        }
                        currentlySortedOrder={
                          advancedSearchHelper.caseSearchSortDirection ||
                          ASCENDING
                        }
                        defaultSortOrder={ASCENDING}
                        descText={SORT_DESCENDING_TEXT.string}
                        hasRows={true}
                        sortField="docketNumber"
                        title="Docket No."
                        onClickSequence={() => handleSort('docketNumber')}
                      />
                    </th>
                    <th className="text-no-wrap overflow-hidden">
                      <SortableColumn
                        ascText={SORT_ASCENDING_TEXT.date}
                        currentlySortedField={
                          advancedSearchHelper.caseSearchSortColumn || ''
                        }
                        currentlySortedOrder={
                          advancedSearchHelper.caseSearchSortDirection ||
                          ASCENDING
                        }
                        defaultSortOrder={ASCENDING}
                        descText={SORT_DESCENDING_TEXT.date}
                        hasRows={true}
                        sortField="receivedAt"
                        title="Filed Date"
                        onClickSequence={() => handleSort('receivedAt')}
                      />
                    </th>
                    <th className="text-no-wrap overflow-hidden">
                      <SortableColumn
                        ascText={SORT_ASCENDING_TEXT.string}
                        currentlySortedField={
                          advancedSearchHelper.caseSearchSortColumn || ''
                        }
                        currentlySortedOrder={
                          advancedSearchHelper.caseSearchSortDirection ||
                          ASCENDING
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
                          advancedSearchHelper.caseSearchSortColumn || ''
                        }
                        currentlySortedOrder={
                          advancedSearchHelper.caseSearchSortDirection ||
                          ASCENDING
                        }
                        defaultSortOrder={ASCENDING}
                        descText={SORT_DESCENDING_TEXT.string}
                        hasRows={true}
                        sortField="petitionerStateNames"
                        title="State"
                        onClickSequence={() =>
                          handleSort('petitionerStateNames')
                        }
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {advancedSearchHelper.formattedSearchResults.map(result => (
                    <tr
                      className="search-result"
                      data-testid={`advanced-case-search-result-${result.docketNumber}`}
                      key={result.docketNumber}
                    >
                      <td>
                        {result.petitionerNames.map((name, index) => (
                          <div key={index}>{name}</div>
                        ))}
                      </td>
                      <td data-testid={`case-result-${result.docketNumber}`}>
                        <CaseLink formattedCase={result} />
                      </td>
                      <td>{result.formattedFiledDate}</td>
                      <td>{result.caseTitle}</td>
                      <td className="small">
                        {result.petitionerStateNames.map((stateName, index) => (
                          <div key={index}>{stateName}</div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </NonMobile>

            <Mobile>
              <div className="grid-row results-header-row align-items-center">
                <div
                  className="margin-bottom-2"
                  style={{ maxWidth: '100%', width: '100%' }}
                >
                  <select
                    aria-label="Sort case search results"
                    className="usa-select"
                    id="mobile-case-search-sort-dropdown"
                    value={
                      advancedSearchHelper.caseSearchSortColumn
                        ? `${advancedSearchHelper.caseSearchSortColumn}|${advancedSearchHelper.caseSearchSortDirection}`
                        : ''
                    }
                    onChange={handleMobileSortChange}
                  >
                    <option value="">Sort by Relevance</option>
                    {advancedSearchHelper.sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {totalPages > 1 && (
                  <div className="margin-bottom-4 tablet:grid-col">
                    <Paginator
                      currentPageIndex={caseCurrentPaginationPage}
                      totalPages={totalPages}
                      onPageChange={changePage}
                    />
                  </div>
                )}

                {showModal === 'showCountModalMobile' && (
                  <BaseModal title="CountModal">
                    <div>
                      <h2>Count: {MAX_CASE_SEARCH_RESULTS.toLocaleString()}</h2>
                      <p>
                        Search is limited to{' '}
                        {MAX_CASE_SEARCH_RESULTS.toLocaleString()} results.
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
                  {advancedSearchHelper.showManyResultsMessage && (
                    <FontAwesomeIcon
                      aria-label={`Search is limited to ${MAX_CASE_SEARCH_RESULTS.toLocaleString()} results.`}
                      className="fa-icon-blue icon-spacing-4"
                      icon="info-circle"
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        openCleanModalSequence({
                          showModal: 'showCountModalMobile',
                        });
                      }}
                      onKeyDown={event => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          openCleanModalSequence({
                            showModal: 'showCountModalMobile',
                          });
                        }
                      }}
                    />
                  )}
                  <b className="text-semibold">Count:</b>{' '}
                  {advancedSearchHelper.numberOfResults.toLocaleString()}
                </div>
              </div>

              <table
                aria-label="case search results"
                className="usa-table gray-header responsive-table row-only todays-orders-mobile"
              >
                <thead>
                  <tr>
                    <th aria-label="Docket Number">Docket No.</th>
                    <th>Petitioner(s)</th>
                    <th>Filed</th>
                    <th>Case Title</th>
                    <th>State</th>
                  </tr>
                </thead>

                <tbody>
                  {advancedSearchHelper.formattedSearchResults.map(result => (
                    <tr
                      data-testid={`advanced-case-search-result-${result.docketNumber}`}
                      key={`case-search-mobile-${result.docketNumber}`}
                    >
                      <td className="docket-number-head">
                        <CaseLink formattedCase={result} />
                      </td>
                      <th>Petitioner(s)</th>
                      <td className="divider">
                        {result.petitionerNames.map((name, index) => (
                          <div key={index}>{name}</div>
                        ))}
                      </td>
                      <th>Filed</th>
                      <td className="divider">{result.formattedFiledDate}</td>
                      <th>Case Title</th>
                      <td className="divider">{result.caseTitle}</td>
                      <th>State</th>
                      <td>
                        {result.petitionerStateNames.map((stateName, index) => (
                          <div key={index}>{stateName}</div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Mobile>

            {totalPages > 1 && (
              <Paginator
                currentPageIndex={caseCurrentPaginationPage}
                totalPages={totalPages}
                onPageChange={changePage}
              />
            )}
          </>
        )}
        {advancedSearchHelper.showNoMatches && (
          <div id="no-search-results" data-testid="no-search-results">
            <h1 className="margin-top-4">No Matches Found</h1>
            <Hint wider>
              Tips for improving your search:
              <ul className="usa-list">
                <li>Try alternate spellings for your search terms</li>
                <li>Use more general search terms</li>
                <li>Use fewer search terms to broaden your search</li>
              </ul>
            </Hint>
          </div>
        )}
      </div>
    );
  },
);

SearchResults.displayName = 'SearchResults';
