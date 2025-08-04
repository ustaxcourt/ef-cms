import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { WarningNotificationComponent } from '../WarningNotification';
import { Paginator } from '../../ustc-ui/Pagination/Paginator';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useState } from 'react';

// const COLUMN_MAP = [
//   { key: 'formattedFiledDate', label: 'Filed Date' },
//   { key: 'documentTitle', label: 'Document Title' },
//   { key: 'caseTitle', label: 'Case Title' },
//   { key: 'formattedJudgeName', label: 'Judge' },
//   { key: 'numberOfPagesFormatted', label: 'Pages' },
//   { key: 'docketNumber', label: 'Docket No.' },
// ];

export const DocumentSearchResults = connect(
  {
    MAX_SEARCH_RESULTS: state.constants.MAX_SEARCH_RESULTS,
    advancedDocumentSearchHelper: state.advancedDocumentSearchHelper,
    isPublic: state.isPublic,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    showMoreResultsSequence: sequences.showMoreResultsSequence,
  },
  function DocumentSearchResults({
    advancedDocumentSearchHelper,
    isPublic,
    MAX_SEARCH_RESULTS,
    openCaseDocumentDownloadUrlSequence,
    //showMoreResultsSequence,
  }) {
    // Pagination state
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const pageSize = 5;

    // Sorting state
    const [sortColumn, setSortColumn] = useState('formattedFiledDate');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const results = advancedDocumentSearchHelper.formattedSearchResults || [];

    // Sorting logic
    const sortedResults = [...results].sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];

      // Try to parse as numbers if possible
      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    const totalPages = Math.ceil(sortedResults.length / pageSize);

    // Slice results for current page
    const pagedResults = sortedResults.slice(
      currentPageIndex * pageSize,
      currentPageIndex * pageSize + pageSize,
    );

    // Reset to first page if results change and current page is out of bounds
    React.useEffect(() => {
      if (currentPageIndex > 0 && currentPageIndex >= totalPages) {
        setCurrentPageIndex(0);
      }
    }, [sortedResults.length, totalPages, currentPageIndex]);

    // Handle column header click
    const handleSort = (columnKey: string) => {
      if (sortColumn === columnKey) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortColumn(columnKey);
        setSortDirection('asc');
      }
      setCurrentPageIndex(0);
    };

    // Helper for sort indicator
    const renderSortIndicator = (columnKey: string) => {
      if (sortColumn !== columnKey) return null;
      return sortDirection === 'asc' ? ' ▲' : ' ▼';
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
                  <th aria-hidden="true" className="small-column"></th>
                  <th
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('formattedFiledDate')}
                  >
                    Filed Date{renderSortIndicator('formattedFiledDate')}
                  </th>
                  <th aria-hidden="true" className="small-column"></th>
                  <th
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('documentTitle')}
                  >
                    {advancedDocumentSearchHelper.documentTypeVerbiage}
                    {renderSortIndicator('documentTitle')}
                  </th>
                  <th
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('caseTitle')}
                  >
                    Case Title{renderSortIndicator('caseTitle')}
                  </th>
                  <th
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('formattedJudgeName')}
                  >
                    Judge{renderSortIndicator('formattedJudgeName')}
                  </th>
                  <th
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('numberOfPagesFormatted')}
                  >
                    Pages{renderSortIndicator('numberOfPagesFormatted')}
                  </th>
                  <th
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('docketNumber')}
                    aria-label="docket number"
                  >
                    Docket No.{renderSortIndicator('docketNumber')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedResults.map((result, idx) => (
                  <tr
                    className="search-result"
                    key={`${result.docketEntryId}-${result.docketNumber}`}
                  >
                    <td aria-hidden="true" className="small-column">
                      {currentPageIndex * pageSize + idx + 1}
                    </td>
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

            {/* Paginator */}
            {totalPages > 1 && (
              <Paginator
                currentPageIndex={currentPageIndex}
                totalPages={totalPages}
                onPageChange={setCurrentPageIndex}
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
